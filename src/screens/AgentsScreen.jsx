import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Zap, Mail, TrendingUp, BarChart3, Activity, WifiOff } from 'lucide-react';

export default function AgentsScreen() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/agents/status');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
        setConnectionError(false);
      } else {
        setAgents([]);
        setConnectionError(true);
      }
    } catch (error) {
      setAgents([]);
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <span className="text-5xl animate-pulse">⚡</span>
      </div>
    );
  }

  if (connectionError || agents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🤖 Agent System</h1>
          <p className="text-slate-400 text-lg">Real-time agent monitoring</p>
        </div>

        <div className="bg-slate-700/50 border border-yellow-500/30 rounded-lg p-8 text-center max-w-lg mx-auto">
          <WifiOff className="mx-auto mb-4 text-yellow-400" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Agent API Not Connected</h2>
          <p className="text-slate-400 mb-4">
            The agent status API endpoint (<code className="text-cyan-400">/api/agents/status</code>) is not available.
          </p>
          <p className="text-slate-500 text-sm">
            Agent status is available on the main Agents tab via status.json.
            This view requires a dedicated agent monitoring API to be configured.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">🤖 Agent System</h1>
        <p className="text-slate-400 text-lg">{agents.length} agents monitored</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-slate-500 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">{agent.name}</h3>
                <p className="text-slate-400 text-xs">{agent.id}</p>
              </div>
              <div className={`flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">{agent.status}</span>
              </div>
            </div>
            {agent.last_action && (
              <div className="border-t border-slate-600 pt-3">
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-400">Last action:</span> {agent.last_action}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
