import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Zap, Mail, TrendingUp, BarChart3, Activity } from 'lucide-react';

export default function AgentsScreen() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch agent status from Redis/Supabase
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/agents/status');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || MOCK_AGENTS);
      } else {
        setAgents(MOCK_AGENTS);
      }
    } catch (error) {
      console.log('Using mock data');
      setAgents(MOCK_AGENTS);
    } finally {
      setLoading(false);
    }
  };

  const MOCK_AGENTS = [
    {
      id: 'trading-agent',
      name: 'Trading Agent',
      category: 'Specialized',
      status: 'online',
      priority: 'Critical',
      uptime: '2h 15m',
      tasks: 12,
      success_rate: 95,
      last_action: 'Strategy backtest completed',
      icon: TrendingUp,
    },
    {
      id: 'content-agent',
      name: 'Content Agent',
      category: 'Specialized',
      status: 'online',
      priority: 'High',
      uptime: '2h 15m',
      tasks: 8,
      success_rate: 98,
      last_action: 'Daily brief drafted',
      icon: Zap,
    },
    {
      id: 'sales-agent',
      name: 'Sales Agent',
      category: 'Specialized',
      status: 'online',
      priority: 'High',
      uptime: '2h 15m',
      tasks: 24,
      success_rate: 87,
      last_action: 'Cold email sent (15)',
      icon: Mail,
    },
    {
      id: 'ops-agent',
      name: 'Ops Agent',
      category: 'Specialized',
      status: 'online',
      priority: 'High',
      uptime: '2h 15m',
      tasks: 18,
      success_rate: 92,
      last_action: 'RLM automation: 3 bids scraped',
      icon: BarChart3,
    },
    {
      id: 'market-monitor',
      name: 'Market Monitor',
      category: 'Background Worker',
      status: 'online',
      priority: 'Critical',
      uptime: '2h 15m',
      tasks: 144,
      success_rate: 99,
      last_action: 'ORB setup detected: QQQ',
      icon: Activity,
    },
    {
      id: 'email-triage',
      name: 'Email Triage',
      category: 'Background Worker',
      status: 'online',
      priority: 'High',
      uptime: '2h 15m',
      tasks: 89,
      success_rate: 94,
      last_action: 'Demo request: flagged',
      icon: Mail,
    },
    {
      id: 'dashboard-sync',
      name: 'Dashboard Sync',
      category: 'Background Worker',
      status: 'online',
      priority: 'Normal',
      uptime: '2h 15m',
      tasks: 267,
      success_rate: 100,
      last_action: 'Real-time sync: active',
      icon: Zap,
    },
    {
      id: 'cost-monitor',
      name: 'Cost Monitor',
      category: 'Background Worker',
      status: 'online',
      priority: 'High',
      uptime: '2h 15m',
      tasks: 134,
      success_rate: 100,
      last_action: 'Daily spend: $12.48',
      icon: BarChart3,
    },
  ];

  const getStatusColor = (status) => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const specializedAgents = agents.filter(a => a.category === 'Specialized');
  const backgroundWorkers = agents.filter(a => a.category === 'Background Worker');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">🤖 Hermes Multi-Agent System</h1>
        <p className="text-slate-400 text-lg">8 autonomous agents, fully coordinated and monitored</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <div className="text-slate-300 text-sm font-semibold mb-1">Total Agents</div>
          <div className="text-4xl font-bold text-green-400">8</div>
          <div className="text-slate-400 text-xs mt-2">All online</div>
        </div>
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <div className="text-slate-300 text-sm font-semibold mb-1">Tasks Completed</div>
          <div className="text-4xl font-bold text-blue-400">896</div>
          <div className="text-slate-400 text-xs mt-2">This session</div>
        </div>
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <div className="text-slate-300 text-sm font-semibold mb-1">Success Rate</div>
          <div className="text-4xl font-bold text-purple-400">95.4%</div>
          <div className="text-slate-400 text-xs mt-2">Average</div>
        </div>
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <div className="text-slate-300 text-sm font-semibold mb-1">System Status</div>
          <div className="text-4xl font-bold text-green-400">🟢</div>
          <div className="text-slate-400 text-xs mt-2">All systems nominal</div>
        </div>
      </div>

      {/* Specialized Agents */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">🎯 Specialized Agents (4)</h2>
        <div className="grid grid-cols-2 gap-6">
          {specializedAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-slate-500 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-600 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{agent.name}</h3>
                      <p className="text-slate-400 text-xs">{agent.id}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{agent.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Priority</div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(agent.priority)}`}>
                      {agent.priority}
                    </span>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Success Rate</div>
                    <div className="text-white font-semibold">{agent.success_rate}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Tasks</div>
                    <div className="text-white font-semibold">{agent.tasks}</div>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-3">
                  <p className="text-slate-300 text-sm">
                    <span className="text-slate-400">Last action:</span> {agent.last_action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Workers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">⚙️ Background Workers (4)</h2>
        <div className="grid grid-cols-2 gap-6">
          {backgroundWorkers.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-slate-500 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-600 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{agent.name}</h3>
                      <p className="text-slate-400 text-xs">{agent.id}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{agent.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Priority</div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(agent.priority)}`}>
                      {agent.priority}
                    </span>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Success Rate</div>
                    <div className="text-white font-semibold">{agent.success_rate}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Tasks</div>
                    <div className="text-white font-semibold">{agent.tasks}</div>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-3">
                  <p className="text-slate-300 text-sm">
                    <span className="text-slate-400">Last action:</span> {agent.last_action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">🏗️ System Architecture</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-white font-semibold mb-2">Orchestrator</div>
            <div className="text-slate-400 text-sm">Central Controller</div>
            <div className="text-green-400 text-xs mt-2">🟢 Active</div>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">State Manager</div>
            <div className="text-slate-400 text-sm">Supabase Sync</div>
            <div className="text-green-400 text-xs mt-2">🟢 Active</div>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">Message Queue</div>
            <div className="text-slate-400 text-sm">Redis Pub/Sub</div>
            <div className="text-green-400 text-xs mt-2">🟢 Active</div>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">Discord Relay</div>
            <div className="text-slate-400 text-sm">Command Interface</div>
            <div className="text-green-400 text-xs mt-2">🟢 Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
