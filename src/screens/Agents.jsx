import React, { useState } from 'react';
import { ChevronDown, Zap, Database, Pen, Search } from 'lucide-react';
import AgentOrb from '../components/AgentOrb';

export default function Agents() {
  const [expandedAgent, setExpandedAgent] = useState(null);

  const agents = [
    {
      id: 'charles',
      name: 'Charles (CBV2)',
      title: 'Central Command',
      status: 'active',
      role: 'Operations',
      lastActive: '2 min ago',
      avatar: '🧭',
      description: 'Autonomous AI operator. Revenue optimization, business strategy, system architecture.',
    },
    {
      id: 'codex',
      name: 'Codex',
      title: 'Developer',
      status: 'active',
      role: 'Developers',
      lastActive: '5 min ago',
      avatar: '💻',
      description: 'Full-stack code generation. Builds features, fixes bugs, optimizes performance.',
    },
    {
      id: 'claudecode',
      name: 'Claude Code',
      title: 'Developer',
      status: 'idle',
      role: 'Developers',
      lastActive: '45 min ago',
      avatar: '🔧',
      description: 'Advanced problem-solving. Complex debugging, architecture decisions.',
    },
    {
      id: 'writer',
      name: 'Writer Agent',
      title: 'Content Creator',
      status: 'active',
      role: 'Writers',
      lastActive: '3 min ago',
      avatar: '✍️',
      description: 'Writes newsletters, analysis, marketing copy. Optimizes for engagement.',
    },
    {
      id: 'research',
      name: 'Research Agent',
      title: 'Analyst',
      status: 'active',
      role: 'Researchers',
      lastActive: '8 min ago',
      avatar: '🔍',
      description: 'Market analysis, prospect intelligence, competitive research, trend forecasting.',
    },
    {
      id: 'trading',
      name: 'Trading Executor',
      title: 'Operations',
      status: 'active',
      role: 'Operators',
      lastActive: '1 min ago',
      avatar: '📈',
      description: 'Executes trades, monitors positions, manages risk. Real-time market execution.',
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      title: 'Monitor',
      status: 'active',
      role: 'Operators',
      lastActive: '1 min ago',
      avatar: '🛡️',
      description: 'Audits task completion, monitors stalls, verifies handoffs. Accountability enforcer.',
    },
    {
      id: 'selfheal',
      name: 'Self-Heal',
      title: 'Recovery',
      status: 'active',
      role: 'Operators',
      lastActive: '20 min ago',
      avatar: '🔄',
      description: 'Automatic failure recovery, state preservation, 3-retry protocol. Resilience.',
    },
  ];

  const roles = ['Developers', 'Writers', 'Researchers', 'Operators'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-dot active';
      case 'idle':
        return 'status-dot idle';
      case 'blocked':
        return 'status-dot blocked';
      default:
        return 'status-dot';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <h1 className="text-3xl font-bold glow-text mb-2">AI Team Orb</h1>
      <p className="text-gray-400 mb-6">Your autonomous agents ecosystem</p>

      {/* Central Agent - Charles */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-cyan">Central Command</h2>
        <AgentOrb agent={agents[0]} expandedAgent={expandedAgent} setExpandedAgent={setExpandedAgent} />
      </div>

      {/* Agent Groups */}
      {roles.map((role) => {
        const roleAgents = agents.filter((a) => a.role === role && a.id !== 'charles');
        return (
          <div key={role} className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-cyan">{role}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="glass-card cursor-pointer hover:border-cyan/50 transition-all"
                  onClick={() =>
                    setExpandedAgent(expandedAgent === agent.id ? null : agent.id)
                  }
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{agent.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-gray-400">{agent.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={getStatusColor(agent.status)}></div>
                        <span className="text-xs text-gray-400">{agent.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-cyan/20 animate-float">
                      <p className="text-sm text-gray-300 mb-3">{agent.description}</p>
                      <div className="flex gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded border ${
                            agent.status === 'active'
                              ? 'bg-green-500/10 border-green-500/30 text-green-300'
                              : agent.status === 'idle'
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                              : 'bg-red-500/10 border-red-500/30 text-red-300'
                          }`}
                        >
                          {agent.status}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-cyan/10 border border-cyan/30 text-cyan">
                          {agent.role}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Agent Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Team Statistics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card text-center">
            <Zap className="mx-auto mb-2 text-green-400" size={20} />
            <p className="text-2xl font-bold">{agents.filter((a) => a.status === 'active').length}</p>
            <p className="text-xs text-gray-400">Active Now</p>
          </div>
          <div className="glass-card text-center">
            <Database className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">{agents.length}</p>
            <p className="text-xs text-gray-400">Total Agents</p>
          </div>
          <div className="glass-card text-center">
            <Pen className="mx-auto mb-2 text-purple-400" size={20} />
            <p className="text-2xl font-bold">{agents.filter((a) => a.role === 'Writers').length}</p>
            <p className="text-xs text-gray-400">Content Creators</p>
          </div>
          <div className="glass-card text-center">
            <Search className="mx-auto mb-2 text-orange-400" size={20} />
            <p className="text-2xl font-bold">{agents.filter((a) => a.role === 'Researchers').length}</p>
            <p className="text-xs text-gray-400">Researchers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
