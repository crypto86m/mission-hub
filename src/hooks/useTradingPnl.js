import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Real-time Trading P&L Hook
 * Subscribes to trading_pnl table for live position updates
 * Auto-fetches on mount, listens for INSERT/UPDATE events
 */
export function useTradingPnl() {
  const [pnl, setPnl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchLatestPnl = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('trading_pnl')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setPnl(null);
      } else if (data) {
        setPnl(data);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err.message);
      setPnl(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchLatestPnl();

    // Real-time subscription
    const channel = supabase
      .channel('trading_pnl_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trading_pnl' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setPnl(payload.new);
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

    // Fallback: refresh every 10 seconds
    const interval = setInterval(fetchLatestPnl, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchLatestPnl]);

  return {
    pnl,
    loading,
    error,
    lastUpdate,
    isConnected,
    refresh: fetchLatestPnl,
  };
}

export default useTradingPnl;
