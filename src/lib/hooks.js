import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Fetch agents from Supabase with real-time updates
export function useAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('agent_status')
        .select('*')
        .order('tasks_completed', { ascending: false });
      
      if (data) setAgents(data);
      setLoading(false);
    }
    fetch();

    // Real-time subscription
    const channel = supabase
      .channel('agent_status_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setAgents(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
        } else if (payload.eventType === 'INSERT') {
          setAgents(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { agents, loading };
}

// Fetch approvals from Supabase
export function useApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('approvals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setApprovals(data);
      setLoading(false);
    }
    fetch();

    const channel = supabase
      .channel('approvals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'approvals' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setApprovals(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
        } else if (payload.eventType === 'INSERT') {
          setApprovals(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const approve = async (id) => {
    await supabase.from('approvals').update({ status: 'approved', decided_at: new Date().toISOString() }).eq('id', id);
  };

  const reject = async (id) => {
    await supabase.from('approvals').update({ status: 'rejected', decided_at: new Date().toISOString() }).eq('id', id);
  };

  return { approvals, loading, approve, reject };
}

// Fetch activity feed
export function useActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('activity_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setActivities(data);
    }
    fetch();

    const channel = supabase
      .channel('activity_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' }, (payload) => {
        setActivities(prev => [payload.new, ...prev].slice(0, 20));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { activities };
}

// Fetch cost tracking
export function useCostTracking() {
  const [costs, setCosts] = useState(null);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('cost_tracking')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setCosts(data);
    }
    fetch();

    const channel = supabase
      .channel('cost_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cost_tracking' }, (payload) => {
        setCosts(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { costs };
}

// Fetch trading P&L
export function useTradingPnl() {
  const [pnl, setPnl] = useState(null);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('trading_pnl')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setPnl(data);
    }
    fetch();

    const channel = supabase
      .channel('pnl_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trading_pnl' }, (payload) => {
        setPnl(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { pnl };
}
