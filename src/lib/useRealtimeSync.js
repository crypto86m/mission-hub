import { useEffect, useState } from 'react';
import { supabase } from './supabase';

/**
 * Master real-time sync hook
 * Subscribes to all Supabase tables and provides live data
 * Auto-refreshes every 30 seconds as fallback
 */
export function useRealtimeSync() {
  const [agents, setAgents] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [costs, setCosts] = useState(null);
  const [pnl, setPnl] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());
  const [connected, setConnected] = useState(false);

  // Initial fetch
  async function fetchAll() {
    const [agentRes, approvalRes, activityRes, costRes, pnlRes] = await Promise.all([
      supabase.from('agent_status').select('*').order('tasks_completed', { ascending: false }),
      supabase.from('approvals').select('*').order('created_at', { ascending: false }),
      supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('cost_tracking').select('*').order('date', { ascending: false }).limit(1).single(),
      supabase.from('trading_pnl').select('*').order('date', { ascending: false }).limit(1).single(),
    ]);

    if (agentRes.data) setAgents(agentRes.data);
    if (approvalRes.data) setApprovals(approvalRes.data);
    if (activityRes.data) setActivities(activityRes.data);
    if (costRes.data) setCosts(costRes.data);
    if (pnlRes.data) setPnl(pnlRes.data);
    setLastSync(new Date());
    setConnected(true);
  }

  useEffect(() => {
    fetchAll();

    // Real-time subscriptions
    const channel = supabase
      .channel('mission-control-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setAgents(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
        }
        setLastSync(new Date());
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'approvals' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setApprovals(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
        } else if (payload.eventType === 'INSERT') {
          setApprovals(prev => [payload.new, ...prev]);
        }
        setLastSync(new Date());
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' }, (payload) => {
        setActivities(prev => [payload.new, ...prev].slice(0, 20));
        setLastSync(new Date());
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cost_tracking' }, (payload) => {
        setCosts(payload.new);
        setLastSync(new Date());
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trading_pnl' }, (payload) => {
        setPnl(payload.new);
        setLastSync(new Date());
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    // Fallback: refresh every 30 seconds
    const interval = setInterval(fetchAll, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return {
    agents,
    approvals,
    activities,
    costs,
    pnl,
    lastSync,
    connected,
    refresh: fetchAll,
  };
}
