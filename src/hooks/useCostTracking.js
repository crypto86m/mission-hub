import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Real-time Cost Tracking Hook
 * Subscribes to cost_tracking table for live budget updates
 * Monitors daily spend, monthly budget, and provider breakdown
 */
export function useCostTracking() {
  const [costs, setCosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchLatestCosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('cost_tracking')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setCosts(null);
      } else if (data) {
        setCosts(data);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err.message);
      setCosts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchLatestCosts();

    // Real-time subscription
    const channel = supabase
      .channel('cost_tracking_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cost_tracking' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setCosts(payload.new);
            setLastUpdate(new Date());
            setError(null);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          setError('Subscription error');
        }
      });

    // Fallback: refresh every 5 seconds (cost data changes frequently)
    const interval = setInterval(fetchLatestCosts, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchLatestCosts]);

  // Calculate metrics
  const percentOfDaily = costs ? Math.round((costs.daily_spend / costs.daily_limit) * 100) : 0;
  const percentOfMonthly = costs ? Math.round((costs.monthly_spend / costs.budget_limit) * 100) : 0;

  return {
    costs,
    loading,
    error,
    lastUpdate,
    isConnected,
    percentOfDaily,
    percentOfMonthly,
    refresh: fetchLatestCosts,
  };
}

export default useCostTracking;
