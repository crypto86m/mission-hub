import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Real-time Approvals Hook
 * Subscribes to approvals table for instant approval requests
 * Handles approve/reject actions and status changes
 */
export function useApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  const PROXY_URL = 'http://100.65.157.30:4500';

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setApprovals([]);
      } else if (data) {
        setApprovals(data);
        setPendingApprovals(data.filter(a => a.status === 'pending'));
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err.message);
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchApprovals();

    // Real-time subscription
    let channel = null;
    try {
      channel = supabase
        .channel('approvals_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'approvals' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setApprovals(prev => [payload.new, ...prev]);
              if (payload.new.status === 'pending') {
                setPendingApprovals(prev => [payload.new, ...prev]);
              }
              setLastUpdate(new Date());
              setError(null);
            } else if (payload.eventType === 'UPDATE') {
              setApprovals(prev =>
                prev.map(a => a.id === payload.new.id ? payload.new : a)
              );
              if (payload.new.status === 'pending') {
                setPendingApprovals(prev => {
                  const filtered = prev.filter(a => a.id !== payload.new.id);
                  return [payload.new, ...filtered];
                });
              } else {
                setPendingApprovals(prev => prev.filter(a => a.id !== payload.new.id));
              }
              setLastUpdate(new Date());
              setError(null);
            }
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
          if (status === 'CHANNEL_ERROR') {
            setError(null); // suppress — table may not exist yet
          }
        });
    } catch (e) {
      console.warn('[useApprovals] subscription setup failed:', e);
    }

    // Fallback: refresh every 6 seconds
    const interval = setInterval(fetchApprovals, 6000);

    return () => {
      if (channel) supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchApprovals]);

  // Approve action
  const approve = useCallback(async (id) => {
    try {
      const approval = approvals.find(a => a.id === id);
      if (!approval) {
        throw new Error('Approval not found');
      }

      const actionMap = {
        'Trading Bot': 'trade',
        'Email Responder': 'email',
        'Content Writer': 'publish',
        'Content Agent': 'publish',
        'RLM Estimator': 'bid',
      };
      const action = actionMap[approval.agent] || 'unknown';

      // Execute real action via proxy (if available)
      try {
        await fetch(`${PROXY_URL}/api/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            approvalId: id,
            decision: 'approved',
          }),
        });
      } catch (proxyErr) {
        console.log('Proxy unavailable, continuing with Supabase update only');
      }

      // Update Supabase
      const { error: updateError } = await supabase
        .from('approvals')
        .update({
          status: 'approved',
          decided_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        setError(updateError.message);
        return false;
      }

      setLastUpdate(new Date());
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [approvals]);

  // Reject action
  const reject = useCallback(async (id) => {
    try {
      // Execute via proxy if available
      try {
        await fetch(`${PROXY_URL}/api/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            approvalId: id,
            decision: 'rejected',
          }),
        });
      } catch (proxyErr) {
        console.log('Proxy unavailable, continuing with Supabase update only');
      }

      // Update Supabase
      const { error: updateError } = await supabase
        .from('approvals')
        .update({
          status: 'rejected',
          decided_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        setError(updateError.message);
        return false;
      }

      setLastUpdate(new Date());
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Helper functions
  const getPendingCount = useCallback(() => {
    return pendingApprovals.length;
  }, [pendingApprovals]);

  const getApprovalsByAgent = useCallback((agentName) => {
    return approvals.filter(a => a.agent === agentName);
  }, [approvals]);

  const getRecentApprovals = useCallback((count = 10) => {
    return approvals.slice(0, count);
  }, [approvals]);

  return {
    approvals,
    pendingApprovals,
    loading,
    error,
    lastUpdate,
    isConnected,
    approve,
    reject,
    refresh: fetchApprovals,
    getPendingCount,
    getApprovalsByAgent,
    getRecentApprovals,
  };
}

export default useApprovals;
