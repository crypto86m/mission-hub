import React, { useState, useEffect } from 'react';
import { ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function IntegrationStatusWidget() {
  const [integrations, setIntegrations] = useState([
    {
      id: 'firecrawl',
      name: 'Firecrawl',
      icon: '🕷️',
      status: 'active',
      description: 'Web scraping → LLM-ready data',
      activeWorkflows: ['RLM Lead Gen', 'Trading Research', 'Newsletter'],
      lastUsed: '2 min ago',
      stats: { scraped: 1247, cached: 342, today: 45 }
    },
    {
      id: 'tavily',
      name: 'Tavily',
      icon: '🔎',
      status: 'active',
      description: 'AI-powered web research & search',
      activeWorkflows: ['Morning Brief', 'Market Analysis', 'Competitive Intel'],
      lastUsed: '5 min ago',
      stats: { queries: 8432, cached: 2104, today: 23 }
    },
    {
      id: 'remotion',
      name: 'Remotion',
      icon: '🎬',
      status: 'pending',
      description: 'Programmatic video generation',
      activeWorkflows: [],
      nextSteps: 'Get Mux API key → Setup Mux account → Activate',
      stats: { videos: 0, pending: 1 }
    },
    {
      id: 'agent-orchestrator',
      name: 'Agent Orchestrator',
      icon: '🧠',
      status: 'active',
      description: 'Subagent coordination & task management',
      activeWorkflows: ['Trading System', 'Content Pipeline', 'Lead Generation'],
      lastUsed: '1 min ago',
      stats: { tasksCompleted: 342, active: 12, avgTime: '4.2s' }
    }
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      pending: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      error: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    
    const icons = {
      active: <CheckCircle size={14} />,
      pending: <Clock size={14} />,
      error: <AlertCircle size={14} />
    };

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="glass-card border border-cyan/20 hover:border-cyan/40 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{integration.name}</h3>
                  <p className="text-xs text-gray-400">{integration.description}</p>
                </div>
              </div>
              {getStatusBadge(integration.status)}
            </div>

            {/* Active Workflows */}
            {integration.activeWorkflows && integration.activeWorkflows.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Active Workflows:</p>
                <div className="flex flex-wrap gap-1">
                  {integration.activeWorkflows.map((workflow) => (
                    <span key={workflow} className="px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-xs text-cyan-300">
                      {workflow}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              {integration.status === 'active' && (
                <>
                  {integration.stats.scraped && (
                    <div className="bg-dark-card/50 p-2 rounded border border-cyan/10">
                      <p className="text-gray-400">Scraped</p>
                      <p className="font-bold text-cyan">{integration.stats.scraped.toLocaleString()}</p>
                    </div>
                  )}
                  {integration.stats.queries && (
                    <div className="bg-dark-card/50 p-2 rounded border border-cyan/10">
                      <p className="text-gray-400">Queries</p>
                      <p className="font-bold text-cyan">{integration.stats.queries.toLocaleString()}</p>
                    </div>
                  )}
                  {integration.stats.tasksCompleted && (
                    <div className="bg-dark-card/50 p-2 rounded border border-cyan/10">
                      <p className="text-gray-400">Tasks</p>
                      <p className="font-bold text-cyan">{integration.stats.tasksCompleted}</p>
                    </div>
                  )}
                  {integration.stats.today && (
                    <div className="bg-dark-card/50 p-2 rounded border border-cyan/10">
                      <p className="text-gray-400">Today</p>
                      <p className="font-bold text-cyan">{integration.stats.today}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Last Used / Next Steps */}
            <div className="flex items-center justify-between pt-3 border-t border-cyan/10">
              {integration.status === 'active' && (
                <p className="text-xs text-gray-400">Last used: <span className="text-cyan">{integration.lastUsed}</span></p>
              )}
              {integration.status === 'pending' && (
                <p className="text-xs text-orange-300">Next: {integration.nextSteps}</p>
              )}
              <a href="#" className="text-cyan hover:text-cyan-300 transition-colors">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Activation Status Summary */}
      <div className="glass-card border border-cyan/20 mt-4 p-4">
        <h3 className="font-bold text-white mb-3">Activation Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Firecrawl</span>
            <span className="text-green-400">✓ Active & Testing</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Tavily</span>
            <span className="text-green-400">✓ Active & Testing</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Remotion</span>
            <span className="text-orange-400">⏳ Awaiting Mux Setup</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Agent Orchestrator</span>
            <span className="text-green-400">✓ Active & Testing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
