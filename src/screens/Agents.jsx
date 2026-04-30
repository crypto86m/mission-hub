import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTaskStore } from '../store/taskStore';

// ── Agent hierarchy (static structure, status overlaid from live data) ──
const BASE_AGENT_TREE = {
  id: 'charles',
  name: 'Charles (CBV2)',
  role: 'Central Command',
  status: 'active',
  avatar: '🧭',
  model: 'claude-sonnet-4-6',
  description: 'Autonomous AI operator. Revenue optimization, business strategy, system orchestration.',
  lastActive: 'Live',
  children: [
    {
      id: 'trading',
      name: 'Trading Agent',
      role: 'Market Operations',
      status: 'active',
      avatar: '📈',
      model: 'claude-sonnet-4-6',
      description: '6 strategies: BOLLINGER_SQUEEZE, ORB_30MIN, ORB_v4, RSI_EXTREMES, VWAP_RECLAIM, MACD_CROSSOVER. 11-ticker universe. Launches Mon–Fri 6:20 AM PT.',
      lastActive: 'Weekdays 6:20 AM',
      children: [
        { id: 'orchestrator', name: 'Master Orchestrator', role: 'Signal Engine', status: 'active', avatar: '⚡', model: 'haiku', description: '6 strategies, 11 tickers, 30s scan interval', lastActive: 'Active' },
        { id: 'watchdog', name: 'Stop Loss Watchdog', role: 'Risk Management', status: 'active', avatar: '🛡️', model: 'shell', description: 'Independent safety net, 30s position checks', lastActive: 'Active' },
      ]
    },
    {
      id: 'rlm',
      name: 'RLM Agent',
      role: 'Business Operations',
      status: 'active',
      avatar: '🏗️',
      model: 'claude-sonnet-4-6',
      description: 'Hotel Oxbow takeoff, Togal.ai integration, bid reviews.',
      lastActive: 'Active',
      children: [
        { id: 'takeoff', name: 'Takeoff Extractor', role: 'Blueprint Analysis', status: 'pending', avatar: '📐', model: 'claude-opus-4-7', description: 'Awaiting Togal.ai floor plan export from Benjamin', lastActive: 'Pending' },
        { id: 'togal', name: 'Togal.ai Integration', role: 'Platform Automation', status: 'pending', avatar: '🔗', model: 'haiku', description: 'Browser automation for Togal.ai data extraction', lastActive: 'Pending' },
      ]
    },
    {
      id: 'content',
      name: 'Content Agent',
      role: 'Media & Publishing',
      status: 'active',
      avatar: '✍️',
      model: 'claude-sonnet-4-6',
      description: "Bennett's Brief newsletter, Instagram reels, social content.",
      lastActive: '7 AM today',
      children: [
        { id: 'brief', name: 'Brief Publisher', role: 'Newsletter', status: 'active', avatar: '📰', model: 'haiku', description: 'Auto-publishes at 7 AM PT daily', lastActive: '7:00 AM' },
        { id: 'reels', name: 'Reels Creator', role: 'Instagram', status: 'active', avatar: '🎬', model: 'sonnet', description: '1 Reel/day target, @benjamin86m (682 followers)', lastActive: 'Active' },
      ]
    },
    {
      id: 'infra',
      name: 'Infrastructure Agent',
      role: 'System Health',
      status: 'active',
      avatar: '🔧',
      model: 'claude-haiku-4-5',
      description: 'Gateway monitoring, cost tracking, heartbeat tiers.',
      lastActive: 'Active',
      children: [
        { id: 'tier1', name: 'Cost Guard (Tier 1)', role: 'Cost Monitoring', status: 'active', avatar: '💰', model: 'shell', description: 'Every 5 min, zero LLM cost', lastActive: '< 5 min ago' },
        { id: 'tier2', name: 'Ops Heartbeat (Tier 2)', role: 'Email + Calendar', status: 'active', avatar: '📧', model: 'haiku', description: 'Every 30 min, email + calendar checks', lastActive: '< 30 min ago' },
        { id: 'tier3', name: 'Heavy Ops (Tier 3)', role: 'Escalations + Sync', status: 'active', avatar: '⚙️', model: 'haiku', description: 'Every 2h, blockers + escalations', lastActive: '< 2 hr ago' },
      ]
    },
  ]
};

// ── Status helpers ──────────────────────────────────────────────
function StatusDot({ status }) {
  const colors = {
    active: 'bg-green-400',
    staged: 'bg-cyan-400',
    pending: 'bg-yellow-400',
    idle: 'bg-gray-500',
    blocked: 'bg-red-400',
  };
  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 inline-block w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${colors[status] || 'bg-gray-500'}`}
    />
  );
}

function statusBadgeClass(status) {
  const map = {
    active: 'bg-green-500/20 text-green-400',
    staged: 'bg-cyan-500/20 text-cyan-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    blocked: 'bg-red-500/20 text-red-400',
    idle: 'bg-gray-500/20 text-gray-400',
  };
  return map[status] || 'bg-gray-500/20 text-gray-400';
}

// ── Recursive agent tree node ───────────────────────────────────
function AgentNode({ agent, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <div className={depth > 0 ? 'ml-5 border-l border-slate-700/60 pl-4 mt-1' : ''}>
      <div
        className={`flex items-start gap-3 p-3 rounded-lg mb-1 cursor-pointer transition-all ${
          open && hasChildren
            ? 'bg-slate-800/80 border border-slate-600/40'
            : 'hover:bg-slate-800/40'
        }`}
        onClick={() => hasChildren && setOpen(o => !o)}
      >
        {/* Expand toggle */}
        <div className="mt-1 w-4 flex-shrink-0">
          {hasChildren
            ? open
              ? <ChevronDown size={14} className="text-slate-400" />
              : <ChevronRight size={14} className="text-slate-400" />
            : <span className="w-4 inline-block" />}
        </div>

        {/* Avatar + live status dot */}
        <div className="relative flex-shrink-0 mt-0.5">
          <span className="text-xl leading-none">{agent.avatar}</span>
          <StatusDot status={agent.status} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{agent.name}</p>
            <span className="text-[9px] text-slate-500 font-mono bg-slate-700/50 px-1.5 py-0.5 rounded">
              {agent.model}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">{agent.role}</p>
          {open && <p className="text-[11px] text-slate-500 mt-1 leading-snug">{agent.description}</p>}
        </div>

        {/* Status badge + last active */}
        <div className="flex-shrink-0 text-right">
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${statusBadgeClass(agent.status)}`}>
            {agent.status}
          </span>
          <p className="text-[9px] text-slate-600 mt-1 whitespace-nowrap">{agent.lastActive}</p>
        </div>
      </div>

      {open && hasChildren && (
        <div>
          {agent.children.map(child => (
            <AgentNode key={child.id} agent={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Task performance panel (from task store) ────────────────────
function AgentTaskPerformance() {
  const { loaded, initialize, getAgentStats } = useTaskStore();

  useEffect(() => {
    if (!loaded) initialize();
  }, [loaded, initialize]);

  const stats = getAgentStats ? getAgentStats() : [];
  if (!loaded || !stats || stats.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-base font-bold text-white mb-3">📊 Task Performance by Agent</h2>
      <div className="space-y-2">
        {stats.map(s => (
          <div key={s.agent} className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{s.agent}</span>
              <span className={`text-sm font-mono font-bold ${
                s.efficiency >= 80 ? 'text-green-400' :
                s.efficiency >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>{s.efficiency}% eff</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full mb-2">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  s.efficiency >= 80 ? 'bg-green-400' :
                  s.efficiency >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${s.efficiency}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div><p className="text-xs font-bold text-green-400">{s.completed}</p><p className="text-[9px] text-slate-500">Done</p></div>
              <div><p className="text-xs font-bold text-blue-400">{s.inProgress}</p><p className="text-[9px] text-slate-500">Active</p></div>
              <div><p className="text-xs font-bold text-orange-400">{s.delayed}</p><p className="text-[9px] text-slate-500">Delayed</p></div>
              <div><p className="text-xs font-bold text-red-400">{s.blocked}</p><p className="text-[9px] text-slate-500">Blocked</p></div>
            </div>
            {s.avgTransitionHrs !== null && (
              <p className="text-[10px] text-slate-500 mt-1 text-center">Avg transition: {s.avgTransitionHrs}h</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Count statuses across tree ──────────────────────────────────
function countStatuses(node) {
  let counts = { active: 0, blocked: 0, pending: 0, idle: 0 };
  if (node.status === 'active') counts.active++;
  else if (node.status === 'blocked') counts.blocked++;
  else if (node.status === 'pending') counts.pending++;
  else counts.idle++;
  (node.children || []).forEach(c => {
    const cc = countStatuses(c);
    counts.active += cc.active;
    counts.blocked += cc.blocked;
    counts.pending += cc.pending;
    counts.idle += cc.idle;
  });
  return counts;
}

// ── Main Agents screen ──────────────────────────────────────────
export default function Agents() {
  const [liveStatus, setLiveStatus] = useState(null);
  const [supaAgents, setSupaAgents] = useState([]);
  const [cronHealth, setCronHealth] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchLiveData = async () => {
    // Fetch status.json
    try {
      const r = await fetch('/api/status.json?t=' + Date.now());
      if (r.ok) {
        const d = await r.json();
        setLiveStatus(d);
        if (d.agents) setCronHealth(d.agents);
      }
    } catch (_) {}

    // Fetch Supabase agent_status table
    try {
      const { data } = await supabase.from('agent_status').select('*').order('updated_at', { ascending: false });
      if (data && data.length > 0) setSupaAgents(data);
    } catch (_) {}

    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusCounts = countStatuses(BASE_AGENT_TREE);
  const totalAgents = statusCounts.active + statusCounts.blocked + statusCounts.pending + statusCounts.idle;

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">

      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">🤖 Agent System</h1>
          <p className="text-slate-400 text-xs">
            {totalAgents} agents monitored
            {lastRefresh && (
              <span className="ml-2 text-slate-600">
                · refreshed {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchLiveData}
          className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg text-center py-3">
          <p className="text-xl font-bold text-green-400">{statusCounts.active}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Active</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg text-center py-3">
          <p className="text-xl font-bold text-yellow-400">{statusCounts.pending}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Pending</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg text-center py-3">
          <p className="text-xl font-bold text-red-400">{statusCounts.blocked}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Blocked</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg text-center py-3">
          <p className="text-xl font-bold text-slate-400">{statusCounts.idle}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Idle</p>
        </div>
      </div>

      {/* Cron health banner (live from status.json) */}
      {cronHealth && (
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-4 py-3 mb-5 flex items-center gap-4">
          <span className="text-lg">⏱️</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Cron Health</p>
            <p className="text-[11px] text-slate-400">
              {cronHealth.cronHealthy}/{cronHealth.cronJobs} jobs healthy
              {cronHealth.cronErrors > 0 && (
                <span className="text-red-400 ml-2">· {cronHealth.cronErrors} error{cronHealth.cronErrors > 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
          <span className={`text-xs font-mono px-2 py-1 rounded ${cronHealth.cronErrors === 0 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {cronHealth.cronErrors === 0 ? '✅ All healthy' : '⚠️ Degraded'}
          </span>
        </div>
      )}

      {/* Agent family tree */}
      <div className="mb-2">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Agent Hierarchy</h2>
        <AgentNode agent={BASE_AGENT_TREE} depth={0} />
      </div>

      {/* Task Performance */}
      <AgentTaskPerformance />

      {/* Live Supabase agent records (if populated) */}
      {supaAgents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-bold text-white mb-3">🔴 Live Agent Records (Supabase)</h2>
          <div className="space-y-2">
            {supaAgents.map(a => (
              <div key={a.id} className="bg-slate-800/60 border border-slate-700/40 rounded-lg flex items-center gap-3 px-4 py-2.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  a.status === 'active' ? 'bg-green-400' :
                  a.status === 'blocked' ? 'bg-red-400' :
                  a.status === 'pending' ? 'bg-yellow-400' : 'bg-slate-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white">{a.name || a.id}</span>
                  {a.task && <p className="text-[10px] text-slate-400 truncate">{a.task}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[9px] font-mono font-semibold ${statusBadgeClass(a.status)} px-1.5 py-0.5 rounded`}>
                    {a.status}
                  </span>
                  {a.updated_at && (
                    <p className="text-[9px] text-slate-600 mt-0.5">
                      {new Date(a.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live status.json raw data strip */}
      {liveStatus && (
        <div className="mt-8 bg-slate-800/40 border border-slate-700/30 rounded-lg p-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">📡 Live System Snapshot</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500 text-[10px]">Trading</p>
              <p className="text-white font-mono">
                {liveStatus.trading?.openPositions ?? 0} positions · {liveStatus.trading?.strategiesLoaded ?? 0} strategies
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Today's Cost</p>
              <p className={`font-mono font-bold ${
                (liveStatus.costs?.today || 0) > 40 ? 'text-red-400' :
                (liveStatus.costs?.today || 0) > 20 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                ${(liveStatus.costs?.today || 0).toFixed(2)} / ${liveStatus.costs?.dailyLimit ?? 50}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Instagram</p>
              <p className="text-white font-mono">{liveStatus.instagram?.followers ?? 0} followers · {liveStatus.instagram?.engagementRate ?? 0}% eng</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Email</p>
              <p className="text-white font-mono">{liveStatus.email?.totalReplies ?? 0} replies · {liveStatus.email?.unread ?? 0} unread</p>
            </div>
          </div>
          {liveStatus.generated && (
            <p className="text-[9px] text-slate-600 mt-3 text-right">
              status.json generated: {new Date(liveStatus.generated).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
