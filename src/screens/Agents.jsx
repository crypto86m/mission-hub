import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Wifi, WifiOff, AlertTriangle, Bot, Shield, Brain, Mail, BarChart3, MessageCircle, DollarSign, Search, Instagram, Twitter, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTaskStore, STATE_COLORS, STATE_LABELS } from '../store/taskStore';

const agentTree = {
  id: 'charles',
  name: 'Charles (CBV2)',
  role: 'Primary AI Agent',
  icon: '🧭',
  status: 'active',
  metric: 'Orchestrates everything',
  children: [
    {
      id: 'trading',
      name: 'Trading Orchestrator',
      role: '6 strategies, continuous loop',
      icon: '📈',
      status: 'active',
      metric: '$96,461 equity | 8 positions',
      children: [
        { id: 'watchdog', name: 'Stop-Loss Watchdog', role: '30s position checks', icon: '🐕', status: 'active', metric: 'Max 2% loss / $120 daily', children: [] },
      ],
    },
    {
      id: 'email',
      name: 'Email Responder',
      role: 'Auto-reply non-sensitive',
      icon: '📧',
      status: 'active',
      metric: '655 replies | Sensitivity filters active',
      children: [],
    },
    {
      id: 'content',
      name: 'Content Pipeline',
      role: 'Newsletter + Instagram',
      icon: '📝',
      status: 'active',
      metric: '',
      children: [
        { id: 'brief', name: "Bennett's Brief", role: 'Daily newsletter', icon: '📰', status: 'active', metric: '287 subs | 38% open rate | 6 issues', children: [] },
        { id: 'instagram', name: 'Instagram Growth', role: '1 Reel/day strategy', icon: '📸', status: 'active', metric: '682 followers | 2.5% ER | 7 Reels scheduled', children: [] },
      ],
    },
    {
      id: 'social',
      name: 'Social Media',
      role: 'Twitter + Buffer',
      icon: '🐦',
      status: 'blocked',
      metric: '⛔ Twitter 401 auth since Apr 1 | 89 tweets queued',
      children: [],
    },
    {
      id: 'cost-monitor',
      name: 'Cost Monitor',
      role: 'Budget guardian',
      icon: '💰',
      status: 'active',
      metric: '$200/mo budget | Alerts at $50/$100/$150/$180',
      children: [],
    },
    {
      id: 'discord',
      name: 'Discord Bot',
      role: '13 channels, 24/7',
      icon: '💬',
      status: 'active',
      metric: 'Gateway running | Nightly archive at 2 AM',
      children: [],
    },
    {
      id: 'rlm-estimator',
      name: 'RLM Estimator',
      role: 'Bid generation',
      icon: '🏢',
      status: 'idle',
      metric: 'Syncs every 6 hours',
      children: [],
    },
    {
      id: 'demo-pipeline',
      name: 'Demo Pipeline',
      role: 'Cold email outreach',
      icon: '🎯',
      status: 'active',
      metric: '63 emails sent | 0 demos (monitoring)',
      children: [],
    },
    {
      id: 'system-watchdog',
      name: 'System Watchdog',
      role: 'Cron health + services',
      icon: '🔍',
      status: 'active',
      metric: '18/18 crons healthy',
      children: [],
    },
  ],
};

function statusColor(status) {
  switch (status) {
    case 'active': return 'bg-green-400';
    case 'blocked': return 'bg-red-400';
    case 'idle': return 'bg-gray-400';
    default: return 'bg-yellow-400';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'active': return 'text-green-400';
    case 'blocked': return 'text-red-400';
    case 'idle': return 'text-gray-400';
    default: return 'text-yellow-400';
  }
}

function AgentNode({ agent, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l border-gray-700 pl-4' : ''}`}>
      <div
        className={`flex items-start gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-colors ${
          depth === 0 ? 'bg-gradient-to-r from-cyan/10 to-purple-500/10 border border-cyan/20' : 'bg-dark-card/50 border border-gray-700/50 hover:border-gray-600'
        }`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="text-2xl shrink-0">{agent.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold ${depth === 0 ? 'text-lg text-cyan' : 'text-sm text-white'}`}>{agent.name}</span>
            <div className={`w-2 h-2 rounded-full ${statusColor(agent.status)}`} />
            <span className={`text-[10px] font-mono ${statusLabel(agent.status)}`}>{agent.status.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{agent.role}</p>
          {agent.metric && <p className="text-[11px] text-gray-300 mt-1">{agent.metric}</p>}
        </div>
        {hasChildren && (
          <div className="shrink-0 text-gray-400">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="mt-1">
          {agent.children.map(child => (
            <AgentNode key={child.id} agent={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentTaskPerformance() {
  const { loaded, initialize, getAgentStats } = useTaskStore();
  useEffect(() => { if (!loaded) initialize(); }, [loaded]);
  const stats = getAgentStats();
  if (!loaded || stats.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-3">Task Performance by Agent</h2>
      <div className="space-y-2">
        {stats.map(s => (
          <div key={s.agent} className="glass-card py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{s.agent}</span>
              <span className={`text-sm font-mono font-bold ${s.efficiency >= 80 ? 'text-green-400' : s.efficiency >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{s.efficiency}% eff</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
              <div className={`h-2 rounded-full transition-all ${s.efficiency >= 80 ? 'bg-green-400' : s.efficiency >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${s.efficiency}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div><p className="text-xs font-bold text-green-400">{s.completed}</p><p className="text-[9px] text-gray-500">Done</p></div>
              <div><p className="text-xs font-bold text-blue-400">{s.inProgress}</p><p className="text-[9px] text-gray-500">Active</p></div>
              <div><p className="text-xs font-bold text-orange-400">{s.delayed}</p><p className="text-[9px] text-gray-500">Delayed</p></div>
              <div><p className="text-xs font-bold text-red-400">{s.blocked}</p><p className="text-[9px] text-gray-500">Blocked</p></div>
            </div>
            {s.avgTransitionHrs !== null && <p className="text-[10px] text-gray-500 mt-1 text-center">Avg transition: {s.avgTransitionHrs}h</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Agents() {
  const [supaAgents, setSupaAgents] = useState([]);

  useEffect(() => {
    supabase.from('agent_status').select('*').then(({ data }) => {
      if (data) setSupaAgents(data);
    });
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold glow-text mb-2">Agent Family Tree</h1>
        <p className="text-gray-400 text-sm">Organizational hierarchy — who does what</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card text-center py-3">
          <p className="text-2xl font-bold text-green-400">9</p>
          <p className="text-[10px] text-gray-400">Active</p>
        </div>
        <div className="glass-card text-center py-3">
          <p className="text-2xl font-bold text-red-400">1</p>
          <p className="text-[10px] text-gray-400">Blocked</p>
        </div>
        <div className="glass-card text-center py-3">
          <p className="text-2xl font-bold text-gray-400">1</p>
          <p className="text-[10px] text-gray-400">Idle</p>
        </div>
      </div>

      {/* Tree */}
      <AgentNode agent={agentTree} />

      {/* Agent Task Performance (from shared Task Intelligence store) */}
      <AgentTaskPerformance />

      {/* Supabase Agent Data (if available) */}
      {supaAgents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-3">Live Agent Status (Supabase)</h2>
          <div className="space-y-2">
            {supaAgents.map(a => (
              <div key={a.id} className="glass-card flex items-center gap-3 py-2">
                <div className={`w-2 h-2 rounded-full ${statusColor(a.status)}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white">{a.name}</span>
                  <p className="text-[10px] text-gray-400 truncate">{a.task}</p>
                </div>
                <span className={`text-[9px] font-mono ${statusLabel(a.status)}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
