import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Wifi, WifiOff, AlertTriangle, Bot, Shield, Brain, Mail, BarChart3, MessageCircle, DollarSign, Search, Instagram, Twitter, Newspaper, TrendingUp, Zap, Mail as MailIcon, Activity, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTaskStore, STATE_COLORS, STATE_LABELS } from '../store/taskStore';

function buildAgentTree(liveData) {
  const d = liveData || {};
  const t = d.trading || {};
  const em = d.email || {};
  const nl = d.newsletter || {};
  const ig = d.instagram || {};
  const tw = d.twitter || {};
  const ag = d.agents || {};
  const c = d.costs || {};

  const tradingConnected = t.status === 'connected';
  const igConnected = ig.status !== 'not_connected';
  const twConnected = tw.status !== 'not_connected';

  return {
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
        role: tradingConnected ? `${t.strategiesLoaded || 0} strategies` : 'Not connected',
        icon: '📈',
        status: tradingConnected ? (t.openPositions > 0 ? 'active' : 'idle') : 'idle',
        metric: tradingConnected ? `$${(t.accountValue || 0).toLocaleString()} equity | ${t.openPositions || 0} positions` : 'Awaiting live data',
        children: [
          { id: 'watchdog', name: 'Stop-Loss Watchdog', role: '30s position checks', icon: '🐕', status: tradingConnected ? 'active' : 'idle', metric: 'Max 2% loss / $120 daily', children: [] },
        ],
      },
      {
        id: 'email',
        name: 'Email Responder',
        role: 'Auto-reply non-sensitive',
        icon: '📧',
        status: em.totalReplies > 0 ? 'active' : 'idle',
        metric: em.totalReplies > 0 ? `${em.totalReplies} replies | Sensitivity filters active` : 'Not tracked',
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
          { id: 'brief', name: "Bennett's Brief", role: 'Newsletter', icon: '📰', status: 'active', metric: `${nl.subscribers || 0} subs | ${nl.issuesPublished || 0} issues | $${nl.mrr || 0} MRR`, children: [] },
          { id: 'instagram', name: 'Instagram Growth', role: '1 Reel/day strategy', icon: '📸', status: igConnected ? 'active' : 'idle', metric: igConnected ? `${ig.followers} followers | ${ig.engagementRate}% ER` : 'Not connected', children: [] },
        ],
      },
      {
        id: 'social',
        name: 'Social Media',
        role: 'Twitter + Buffer',
        icon: '🐦',
        status: twConnected ? (tw.status === 'blocked' ? 'blocked' : 'active') : 'idle',
        metric: twConnected ? (tw.status === 'blocked' ? `⛔ ${tw.error}` : `${tw.queued || 0} queued`) : 'Not connected',
        children: [],
      },
      {
        id: 'cost-monitor',
        name: 'Cost Monitor',
        role: 'Budget guardian',
        icon: '💰',
        status: c.status !== 'not_tracked' ? 'active' : 'idle',
        metric: c.status !== 'not_tracked' ? `$${(c.monthTotal || 0).toFixed(2)}/$${c.monthlyBudget || 200} budget` : 'Not tracked',
        children: [],
      },
      {
        id: 'discord',
        name: 'Discord Bot',
        role: 'Channels, 24/7',
        icon: '💬',
        status: 'active',
        metric: 'Gateway running',
        children: [],
      },
      {
        id: 'system-watchdog',
        name: 'System Watchdog',
        role: 'Cron health + services',
        icon: '🔍',
        status: ag.cronJobs > 0 ? 'active' : 'idle',
        metric: ag.cronJobs > 0 ? `${ag.cronHealthy}/${ag.cronJobs} crons healthy` : 'Not tracked',
        children: [],
      },
    ],
  };
}

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

// Hermes Multi-Agent System removed — was entirely hardcoded/fake data.
// Agent status is now driven by the Agent Family Tree (live from status.json)
// and Task Performance (live from Supabase task store).
const HermesAgentsOverview = () => null;

export default function Agents() {
  const [supaAgents, setSupaAgents] = useState([]);
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    supabase.from('agent_status').select('*').then(({ data }) => {
      if (data) setSupaAgents(data);
    });
    fetch('/api/status.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => setLiveData(d))
      .catch(() => {});
  }, []);

  const agentTree = buildAgentTree(liveData);

  // Count statuses from tree
  const countStatuses = (node) => {
    let counts = { active: 0, blocked: 0, idle: 0 };
    if (node.status === 'active') counts.active++;
    else if (node.status === 'blocked') counts.blocked++;
    else counts.idle++;
    (node.children || []).forEach(c => {
      const cc = countStatuses(c);
      counts.active += cc.active;
      counts.blocked += cc.blocked;
      counts.idle += cc.idle;
    });
    return counts;
  };
  const statusCounts = countStatuses(agentTree);

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">
      {/* Agent Family Tree */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold glow-text mb-2">Agent System</h1>
        <p className="text-gray-400 text-sm">Live status from connected systems</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card text-center py-3">
          <p className="text-2xl font-bold text-green-400">{statusCounts.active}</p>
          <p className="text-[10px] text-gray-400">Active</p>
        </div>
        <div className="glass-card text-center py-3">
          <p className="text-2xl font-bold text-red-400">{statusCounts.blocked}</p>
          <p className="text-[10px] text-gray-400">Blocked</p>
        </div>
        <div className="glass-card text-center py-3">
          <p className="text-2xl font-bold text-gray-400">{statusCounts.idle}</p>
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
