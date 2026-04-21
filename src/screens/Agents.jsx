import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Circle, Zap, Database, Code, Search, TrendingUp, Mail, MessageSquare, Camera, Building2 } from 'lucide-react';

const agents = [
  {
    id: 'charles',
    name: 'Charles (CBV2)',
    role: 'Central Command',
    status: 'active',
    avatar: '🧭',
    model: 'claude-sonnet-4-6',
    description: 'Autonomous AI operator. Revenue optimization, business strategy, system orchestration.',
    lastActive: '1 min ago',
    children: [
      {
        id: 'trading',
        name: 'Trading Agent',
        role: 'Market Operations',
        status: 'staged',
        avatar: '📈',
        model: 'claude-sonnet-4-6',
        description: '3 strategies: ORB, VWAP, S/R. SPY/QQQ/TSLA. Launches Monday 6:20 AM PT.',
        lastActive: 'Staged',
        children: [
          { id: 'orchestrator', name: 'Master Orchestrator', role: 'Signal Engine', status: 'staged', avatar: '⚡', model: 'haiku', description: '3 strategies, 30s scan interval', lastActive: 'Staged' },
          { id: 'watchdog', name: 'Stop Loss Watchdog', role: 'Risk Management', status: 'staged', avatar: '🛡️', model: 'shell', description: 'Independent safety net, 30s position checks', lastActive: 'Staged' },
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
        lastActive: '30 min ago',
        children: [
          { id: 'takeoff', name: 'Takeoff Extractor', role: 'Blueprint Analysis', status: 'active', avatar: '📐', model: 'claude-opus-4-7', description: 'Extracting painting scope from 2,545 floor plan pages', lastActive: 'Active' },
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
          { id: 'reels', name: 'Reels Creator', role: 'Instagram', status: 'active', avatar: '🎬', model: 'sonnet', description: '1 Reel/day, @benjamin86m', lastActive: 'Active' },
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
        lastActive: '5 min ago',
        children: [
          { id: 'tier1', name: 'Cost Guard (Tier 1)', role: 'Cost Monitoring', status: 'active', avatar: '💰', model: 'shell', description: 'Every 5 min, zero LLM cost', lastActive: '1 min ago' },
          { id: 'tier2', name: 'Ops Heartbeat (Tier 2)', role: 'Email + Calendar', status: 'active', avatar: '📧', model: 'haiku', description: 'Every 30 min, email + calendar checks', lastActive: '12 min ago' },
          { id: 'tier3', name: 'Heavy Ops (Tier 3)', role: 'Escalations + Sync', status: 'active', avatar: '⚙️', model: 'haiku', description: 'Every 2h, blockers + escalations', lastActive: '45 min ago' },
        ]
      },
    ]
  }
];

function StatusDot({ status }) {
  const colors = {
    active: 'bg-green-400',
    staged: 'bg-cyan',
    pending: 'bg-yellow-400',
    idle: 'bg-gray-500',
    blocked: 'bg-red-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-gray-500'}`} />;
}

function AgentNode({ agent, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l border-gray-700/50 pl-4' : ''}`}>
      <div
        className={`flex items-start gap-3 p-3 rounded-lg mb-1 cursor-pointer transition-all ${
          open && hasChildren ? 'bg-dark-card/80 border border-cyan/10' : 'hover:bg-dark-card/40'
        }`}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {/* Expand toggle */}
        <div className="mt-1 w-4 flex-shrink-0">
          {hasChildren ? (
            open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />
          ) : (
            <span className="w-4 inline-block" />
          )}
        </div>

        {/* Avatar + Status */}
        <div className="relative flex-shrink-0">
          <span className="text-xl">{agent.avatar}</span>
          <StatusDot status={agent.status} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{agent.name}</p>
            <span className="text-[9px] text-gray-500 font-mono">{agent.model}</span>
          </div>
          <p className="text-[10px] text-gray-400">{agent.role}</p>
          {open && <p className="text-[10px] text-gray-500 mt-1">{agent.description}</p>}
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0 text-right">
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
            agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
            agent.status === 'staged' ? 'bg-cyan/20 text-cyan' :
            agent.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            agent.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>{agent.status}</span>
          <p className="text-[9px] text-gray-600 mt-1">{agent.lastActive}</p>
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

export default function Agents() {
  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold glow-text mb-1">Agent Fleet</h1>
        <p className="text-gray-400 text-sm">Hierarchical agent tree — click to expand</p>
      </div>

      <div className="mb-4 flex gap-4 text-xs text-gray-500">
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />Active</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-cyan mr-1" />Staged</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />Pending</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1" />Idle</span>
      </div>

      {agents.map(agent => (
        <AgentNode key={agent.id} agent={agent} depth={0} />
      ))}
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
