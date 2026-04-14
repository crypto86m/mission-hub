import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Real-time Agent Status Hook
 * Subscribes to agent_status table for live agent updates
 * Tracks status changes, tasks completed, efficiency, and reliability
 */
export function useAgentStatus() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('agent_status')
        .select('*')
        .order('tasks_completed', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setAgents([]);
      } else if (data) {
        setAgents(data);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError(err.message);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAgents();

    // Real-time subscription
    const channel = supabase
      .channel('agent_status_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_status' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setAgents(prev =>
              prev.map(agent => agent.id === payload.new.id ? payload.new : agent)
            );
            setLastUpdate(new Date());
            setError(null);
          } else if (payload.eventType === 'INSERT') {
            setAgents(prev => [payload.new, ...prev]);
            setLastUpdate(new Date());
          } else if (payload.eventType === 'DELETE') {
            setAgents(prev => prev.filter(agent => agent.id !== payload.old.id));
            setLastUpdate(new Date());
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          setError('Subscription error');
        }
      });

    // Fallback: refresh every 8 seconds
    const interval = setInterval(fetchAgents, 8000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchAgents]);

  // Helper functions
  const getAgentById = useCallback((id) => {
    return agents.find(a => a.id === id);
  }, [agents]);

  const getActiveAgents = useCallback(() => {
    return agents.filter(a => a.status === 'active');
  }, [agents]);

  const getAgentsByStatus = useCallback((status) => {
    return agents.filter(a => a.status === status);
  }, [agents]);

  const getTotalTasksCompleted = useCallback(() => {
    return agents.reduce((sum, a) => sum + (a.tasks_completed || 0), 0);
  }, [agents]);

  const getAverageSuccessRate = useCallback(() => {
    if (agents.length === 0) return 0;
    const total = agents.reduce((sum, a) => sum + (a.success_rate || 0), 0);
    return Math.round(total / agents.length);
  }, [agents]);

  return {
    agents,
    loading,
    error,
    lastUpdate,
    isConnected,
    refresh: fetchAgents,
    getAgentById,
    getActiveAgents,
    getAgentsByStatus,
    getTotalTasksCompleted,
    getAverageSuccessRate,
  };
}

export default useAgentStatus;
