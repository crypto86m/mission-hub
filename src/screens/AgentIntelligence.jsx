import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, Brain, Eye, Activity, Zap, DollarSign, BarChart3, Target, AlertTriangle, Pause, Play, RefreshCw, X, Layers, LayoutGrid, GitBranch, Flame, Focus } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// AGENT INTELLIGENCE COMMAND CENTER v2
// A live business intelligence engine for autonomous systems
// ═══════════════════════════════════════════════════════════════════

const CLUSTERS = {
  trading: { label: 'Trading', color: '#A855F7', x: 200, y: 200 },
  content: { label: 'Content', color: '#F97316', x: 600, y: 200 },
  operations: { label: 'Operations', color: '#22C55E', x: 200, y: 450 },
  automation: { label: 'Automation', color: '#3B82F6', x: 600, y: 450 },
};

// Agent positions for visualization (layout only — data comes from Supabase)
const AGENT_LAYOUT = {
  'charles': { cluster: null, x: 400, y: 320, size: 65, type: 'core', label: 'Charles (CBV2)' },
  'trading-bot': { cluster: 'trading', x: 150, y: 160, size: 42, type: 'agent', label: 'Trading Bot' },
  'market-research': { cluster: 'trading', x: 120, y: 260, size: 36, type: 'agent', label: 'Market Research' },
  'content-agent': { cluster: 'content', x: 620, y: 160, size: 42, type: 'agent', label: 'Content Agent' },
  'social-agent': { cluster: 'content', x: 700, y: 250, size: 34, type: 'agent', label: 'Social Media' },
  'email-responder': { cluster: 'operations', x: 180, y: 420, size: 42, type: 'agent', label: 'Email Responder' },
  'discord-bot': { cluster: 'operations', x: 120, y: 500, size: 36, type: 'agent', label: 'Discord Bot' },
  'cost-monitor': { cluster: 'operations', x: 260, y: 520, size: 34, type: 'agent', label: 'Cost Monitor' },
  'rlm-estimator': { cluster: 'automation', x: 580, y: 420, size: 42, type: 'agent', label: 'RLM Estimator' },
  'prospect-research': { cluster: 'automation', x: 680, y: 500, size: 34, type: 'agent', label: 'Prospect Research' },
};

// Fallback data if Supabase is unreachable
const agents = Object.entries(AGENT_LAYOUT).map(([id, layout]) => ({
  id, ...layout, status: 'active', role: '', model: '', objective: '', task: '',
  tasks: 0, successRate: 0, efficiency: 0, reliability: 0, revenue: 0, cost: 0,
  apiCalls: 0, latency: 0, throughput: 0,
}));

// NOTE: This component will be enhanced to fetch from Supabase agent_status table.
// For now it uses the layout + whatever data was last synced.
// The supabase-sync.py script updates agent_status every heartbeat.
// TODO: Add useEffect to fetch from supabase.from('agent_status').select('*')

const integrations = [
  { id: 'alpaca', label: 'Alpaca', type: 'integration', status: 'active', x: 60, y: 120, size: 22 },
  { id: 'gmail', label: 'Gmail', type: 'integration', status: 'active', x: 80, y: 380, size: 22 },
  { id: 'discord-api', label: 'Discord', type: 'integration', status: 'active', x: 50, y: 520, size: 22 },
  { id: 'substack', label: 'Substack', type: 'integration', status: 'active', x: 720, y: 120, size: 22 },
  { id: 'buffer', label: 'Buffer', type: 'integration', status: 'active', x: 760, y: 280, size: 22 },
  { id: 'perplexity', label: 'Perplexity', type: 'integration', status: 'active', x: 40, y: 200, size: 22 },
  { id: 'stripe', label: 'Stripe', type: 'integration', status: 'active', x: 750, y: 440, size: 22 },
  { id: 'ollama', label: 'Ollama', type: 'integration', status: 'active', x: 300, y: 60, size: 22 },
  { id: 'anthropic', label: 'Anthropic', type: 'integration', status: 'active', x: 420, y: 60, size: 22 },
  { id: 'openai', label: 'OpenAI', type: 'integration', status: 'active', x: 340, y: 100, size: 22 },
  { id: 'vercel', label: 'Vercel', type: 'integration', status: 'active', x: 500, y: 560, size: 22 },
  { id: 'supabase', label: 'Supabase', type: 'integration', status: 'active', x: 400, y: 560, size: 22 },
  { id: 'tailscale', label: 'Tailscale', type: 'integration', status: 'active', x: 300, y: 570, size: 22 },
  { id: 'zapier', label: 'Zapier', type: 'integration', status: 'configured', x: 650, y: 540, size: 22 },
  { id: 'tradingview', label: 'TradingView', type: 'integration', status: 'planned', x: 60, y: 60, size: 22 },
];

const allNodes = [...agents, ...integrations];

const edges = [
  { from: 'charles', to: 'trading-bot', type: 'dep', traffic: 'high' },
  { from: 'charles', to: 'email-responder', type: 'dep', traffic: 'high' },
  { from: 'charles', to: 'content-agent', type: 'dep', traffic: 'med' },
  { from: 'charles', to: 'social-agent', type: 'dep', traffic: 'low' },
  { from: 'charles', to: 'market-research', type: 'dep', traffic: 'med' },
  { from: 'charles', to: 'prospect-research', type: 'dep', traffic: 'low' },
  { from: 'charles', to: 'cost-monitor', type: 'dep', traffic: 'med' },
  { from: 'charles', to: 'discord-bot', type: 'dep', traffic: 'high' },
  { from: 'charles', to: 'rlm-estimator', type: 'dep', traffic: 'med' },
  { from: 'trading-bot', to: 'alpaca', type: 'api', traffic: 'high' },
  { from: 'trading-bot', to: 'openai', type: 'api', traffic: 'med' },
  { from: 'market-research', to: 'perplexity', type: 'api', traffic: 'high' },
  { from: 'market-research', to: 'trading-bot', type: 'data', traffic: 'high' },
  { from: 'email-responder', to: 'gmail', type: 'api', traffic: 'high' },
  { from: 'email-responder', to: 'anthropic', type: 'api', traffic: 'med' },
  { from: 'content-agent', to: 'substack', type: 'api', traffic: 'med' },
  { from: 'content-agent', to: 'anthropic', type: 'api', traffic: 'high' },
  { from: 'content-agent', to: 'social-agent', type: 'data', traffic: 'med' },
  { from: 'social-agent', to: 'buffer', type: 'api', traffic: 'low' },
  { from: 'discord-bot', to: 'discord-api', type: 'api', traffic: 'high' },
  { from: 'rlm-estimator', to: 'openai', type: 'api', traffic: 'med' },
  { from: 'prospect-research', to: 'perplexity', type: 'api', traffic: 'low' },
  { from: 'prospect-research', to: 'stripe', type: 'api', traffic: 'low' },
  { from: 'cost-monitor', to: 'anthropic', type: 'api', traffic: 'low' },
  { from: 'charles', to: 'supabase', type: 'api', traffic: 'med' },
  { from: 'charles', to: 'vercel', type: 'api', traffic: 'low' },
  { from: 'zapier', to: 'email-responder', type: 'data', traffic: 'low' },
  { from: 'alpaca', to: 'tradingview', type: 'data', traffic: 'low' },
];

const activityFeed = [
  { time: 'Now', text: 'Trading Bot: QQQ Bollinger squeeze signal detected', type: 'trade', color: '#A855F7' },
  { time: '2m', text: 'Email Responder: Auto-replied to vendor inquiry', type: 'action', color: '#22C55E' },
  { time: '5m', text: 'Cost Monitor: Daily spend $23 / $200 budget', type: 'info', color: '#22C55E' },
  { time: '15m', text: 'Content Agent: Issue #7 draft at 80% (1,247 words)', type: 'action', color: '#F97316' },
  { time: '30m', text: 'Discord Bot: 28 messages logged in #general', type: 'action', color: '#3B82F6' },
  { time: '1h', text: 'RLM Estimator: Hotel Oxbow bid processing — $410K', type: 'action', color: '#22C55E' },
  { time: '2h', text: 'Market Research: Pre-market scan — 3 setups found', type: 'action', color: '#A855F7' },
  { time: '3h', text: '⚠️ Prospect Research idle for 24h — review needed', type: 'warning', color: '#EF4444' },
];

const bottlenecks = [
  { agent: 'Prospect Research', issue: 'Idle 24h+', suggestion: 'Reassign to AI Support lead gen or disable', severity: 'warning' },
  { agent: 'Social Media', issue: 'Idle — no content queued', suggestion: 'Feed content from Content Agent automatically', severity: 'info' },
  { agent: 'TradingView', issue: 'Not connected', suggestion: 'Set up webhook integration for auto-trade signals', severity: 'info' },
];

const statusColor = {
  active: '#00D4FF',
  idle: '#6B7280',
  error: '#EF4444',
  processing: '#F59E0B',
  configured: '#3B82F6',
  planned: '#9CA3AF',
};

const trafficW = { high: 2.5, med: 1.5, low: 0.7 };

export default function AgentIntelligence() {
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(0.85);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('graph');
  const [showRevenue, setShowRevenue] = useState(false);
  const [showPerf, setShowPerf] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [focusNode, setFocusNode] = useState(null);
  const [showClusters, setShowClusters] = useState(true);
  const [showFeed, setShowFeed] = useState(false);
  const [tick, setTick] = useState(0);

  // Simulated real-time tick
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  // Ranking — compute score for each agent
  const rankedAgents = useMemo(() => {
    return agents
      .filter(a => a.type !== 'core')
      .map(a => ({
        ...a,
        score: (a.revenue > 0 ? 30 : 0) + (a.successRate * 0.3) + (a.efficiency * 0.2) + (a.reliability * 0.2) - (a.cost * 0.1),
      }))
      .sort((a, b) => b.score - a.score);
  }, []);

  // Filter logic
  const filteredNodes = allNodes.filter(n => {
    if (search && !n.label.toLowerCase().includes(search.toLowerCase())) return false;
    if (focusNode) {
      const connected = edges.filter(e => e.from === focusNode || e.to === focusNode).flatMap(e => [e.from, e.to]);
      if (n.id !== focusNode && !connected.includes(n.id)) return false;
    }
    if (filter === 'active' && n.status !== 'active') return false;
    if (filter === 'idle' && n.status !== 'idle') return false;
    if (filter === 'error' && !['error', 'planned'].includes(n.status)) return false;
    if (filter === 'revenue' && (n.revenue === undefined || n.revenue === 0)) return false;
    if (filter === 'underperforming' && (n.successRate === undefined || n.successRate > 80)) return false;
    return true;
  });

  const filteredIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => filteredIds.has(e.from) && filteredIds.has(e.to));
  const selectedNode = selected ? allNodes.find(n => n.id === selected) : null;

  // Stats
  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalCost = agents.reduce((s, a) => s + (a.cost || 0), 0);
  const totalRevenue = agents.reduce((s, a) => s + (a.revenue || 0), 0);

  // Pan handlers
  const onDown = (e) => {
    const p = e.touches ? e.touches[0] : e;
    setDragging(true);
    setDragStart({ x: p.clientX - offset.x, y: p.clientY - offset.y });
  };
  const onMove = (e) => {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    setOffset({ x: p.clientX - dragStart.x, y: p.clientY - dragStart.y });
  };
  const onUp = () => setDragging(false);

  const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`;

  // ═══════════════ GRID VIEW ═══════════════
  if (viewMode === 'grid') {
    return (
      <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-4">
        <Header search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} viewMode={viewMode} setViewMode={setViewMode} activeCount={activeCount} totalRevenue={totalRevenue} totalCost={totalCost} />
        <div className="grid grid-cols-2 gap-2 mt-3">
          {rankedAgents.map((a, i) => (
            <button key={a.id} onClick={() => setSelected(a.id)} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-left hover:border-gray-600 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold" style={{ borderColor: statusColor[a.status], color: statusColor[a.status], backgroundColor: statusColor[a.status] + '15' }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{a.label}</p>
                  <p className="text-[9px] text-gray-500">{a.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <div><span className="text-gray-500">Success:</span> <span className="text-green-400">{a.successRate}%</span></div>
                <div><span className="text-gray-500">Efficiency:</span> <span className="text-cyan-400">{a.efficiency}%</span></div>
                <div><span className="text-gray-500">Revenue:</span> <span className="text-yellow-400">{a.revenue > 0 ? fmt(a.revenue) : '—'}</span></div>
                <div><span className="text-gray-500">Cost:</span> <span className="text-red-400">${a.cost}/day</span></div>
              </div>
              <div className="mt-2 w-full bg-gray-800 rounded-full h-1">
                <div className="h-1 rounded-full" style={{ width: `${a.score / 1.2}%`, backgroundColor: statusColor[a.status] }} />
              </div>
            </button>
          ))}
        </div>
        {selectedNode && <DetailPanel node={selectedNode} edges={edges} allNodes={allNodes} onClose={() => setSelected(null)} fmt={fmt} />}
      </div>
    );
  }

  // ═══════════════ FLOW VIEW ═══════════════
  if (viewMode === 'flow') {
    const flowStages = [
      { label: 'Data Sources', nodes: ['perplexity', 'alpaca', 'gmail', 'discord-api', 'tradingview'] },
      { label: 'Research', nodes: ['market-research', 'prospect-research'] },
      { label: 'Execution', nodes: ['trading-bot', 'email-responder', 'rlm-estimator', 'content-agent'] },
      { label: 'Distribution', nodes: ['social-agent', 'discord-bot', 'buffer', 'substack'] },
      { label: 'Infrastructure', nodes: ['charles', 'cost-monitor', 'vercel', 'supabase'] },
    ];

    return (
      <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-4">
        <Header search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} viewMode={viewMode} setViewMode={setViewMode} activeCount={activeCount} totalRevenue={totalRevenue} totalCost={totalCost} />
        <div className="mt-3 space-y-4">
          {flowStages.map((stage, si) => (
            <div key={stage.label}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-bold">{si + 1}</div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stage.label}</h3>
                {si < flowStages.length - 1 && <div className="flex-1 h-px bg-gray-800 ml-2" />}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {stage.nodes.map(nid => {
                  const n = allNodes.find(x => x.id === nid);
                  if (!n) return null;
                  return (
                    <button key={n.id} onClick={() => setSelected(n.id)} className="shrink-0 w-24 bg-gray-900/60 border border-gray-800 rounded-xl p-2 text-center hover:border-gray-600">
                      <div className="w-8 h-8 mx-auto rounded-full border flex items-center justify-center text-[9px] font-mono font-bold mb-1" style={{ borderColor: statusColor[n.status], color: statusColor[n.status] }}>
                        {n.label.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <p className="text-[9px] text-white truncate">{n.label}</p>
                      <div className="w-2 h-2 rounded-full mx-auto mt-1" style={{ backgroundColor: statusColor[n.status] }} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selectedNode && <DetailPanel node={selectedNode} edges={edges} allNodes={allNodes} onClose={() => setSelected(null)} fmt={fmt} />}
      </div>
    );
  }

  // ═══════════════ GRAPH VIEW (DEFAULT) ═══════════════
  return (
    <div className="w-full h-full overflow-hidden pb-20 flex flex-col">
      <div className="px-3 pt-3 pb-1">
        <Header search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} viewMode={viewMode} setViewMode={setViewMode} activeCount={activeCount} totalRevenue={totalRevenue} totalCost={totalCost} />

        {/* Toggles */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          <ToggleBtn icon={<DollarSign size={10} />} label="Revenue" active={showRevenue} onClick={() => setShowRevenue(!showRevenue)} />
          <ToggleBtn icon={<BarChart3 size={10} />} label="Perf" active={showPerf} onClick={() => setShowPerf(!showPerf)} />
          <ToggleBtn icon={<Flame size={10} />} label="Heatmap" active={showHeatmap} onClick={() => setShowHeatmap(!showHeatmap)} />
          <ToggleBtn icon={<Layers size={10} />} label="Clusters" active={showClusters} onClick={() => setShowClusters(!showClusters)} />
          <ToggleBtn icon={<Activity size={10} />} label="Feed" active={showFeed} onClick={() => setShowFeed(!showFeed)} />
          {focusNode && <button onClick={() => setFocusNode(null)} className="px-2 py-1 text-[9px] rounded-full border border-red-500/30 text-red-400 bg-red-500/10">Exit Focus</button>}
        </div>

        {/* Zoom controls */}
        <div className="flex gap-1 mt-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))} className="w-7 h-7 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400"><ZoomIn size={12} /></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.3))} className="w-7 h-7 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400"><ZoomOut size={12} /></button>
          <button onClick={() => { setZoom(0.85); setOffset({ x: 0, y: 0 }); setFocusNode(null); }} className="w-7 h-7 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400"><Maximize2 size={12} /></button>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      >
        <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`, transformOrigin: 'center' }}>
          <defs>
            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <filter id="g1"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="g2"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <rect width="800" height="600" fill="url(#grid2)" />

          {/* Cluster backgrounds */}
          {showClusters && Object.entries(CLUSTERS).map(([key, cl]) => (
            <g key={key}>
              <circle cx={cl.x} cy={cl.y} r="120" fill={cl.color + '06'} stroke={cl.color + '15'} strokeWidth="1" strokeDasharray="6,6" />
              <text x={cl.x} y={cl.y - 105} textAnchor="middle" fill={cl.color + '60'} fontSize="10" fontFamily="monospace" fontWeight="600">{cl.label.toUpperCase()}</text>
            </g>
          ))}

          {/* Heatmap overlay */}
          {showHeatmap && agents.filter(a => a.throughput > 30).map(a => (
            <circle key={`heat-${a.id}`} cx={a.x} cy={a.y} r={a.throughput * 0.8} fill="rgba(239,68,68,0.05)" />
          ))}

          {/* Edges */}
          {filteredEdges.map((e, i) => {
            const from = allNodes.find(n => n.id === e.from);
            const to = allNodes.find(n => n.id === e.to);
            if (!from || !to) return null;
            const w = trafficW[e.traffic] || 1;
            const isHigh = e.traffic === 'high';
            return (
              <g key={`e${i}`}>
                {isHigh && <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(0,212,255,0.12)" strokeWidth={w + 3} filter="url(#g1)" />}
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isHigh ? 'rgba(0,212,255,0.35)' : 'rgba(100,116,139,0.2)'}
                  strokeWidth={w}
                  strokeDasharray={e.type === 'dep' ? '6,4' : 'none'}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map(n => {
            const sc = statusColor[n.status] || '#6B7280';
            const isActive = n.status === 'active' || n.status === 'processing';
            const isSel = selected === n.id;
            const isGold = n.revenue > 50000;
            return (
              <g key={n.id} onClick={(e) => { e.stopPropagation(); setSelected(isSel ? null : n.id); }} className="cursor-pointer">
                {/* Pulse for active */}
                {isActive && (
                  <circle cx={n.x} cy={n.y} r={n.size / 2 + 8} fill="none" stroke={sc} strokeWidth="0.8" opacity="0.25">
                    <animate attributeName="r" values={`${n.size/2+4};${n.size/2+14};${n.size/2+4}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Gold accent for high performers */}
                {isGold && <circle cx={n.x} cy={n.y} r={n.size / 2 + 3} fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0.4" />}
                {/* Selection ring */}
                {isSel && (
                  <circle cx={n.x} cy={n.y} r={n.size / 2 + 6} fill="none" stroke="#00D4FF" strokeWidth="2" strokeDasharray="4,3">
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`} dur="8s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Node */}
                <circle cx={n.x} cy={n.y} r={n.size / 2} fill={sc + '12'} stroke={sc} strokeWidth={n.type === 'core' ? 3 : n.type === 'agent' ? 2 : 1.5} filter={isActive ? 'url(#g1)' : undefined} />
                {/* Initials */}
                <text x={n.x} y={n.y + (n.size > 30 ? 4 : 3)} textAnchor="middle" fill={sc} fontSize={n.size * 0.32} fontFamily="monospace" fontWeight="bold">
                  {n.label.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </text>
                {/* Label */}
                <text x={n.x} y={n.y + n.size / 2 + 12} textAnchor="middle" fill={sc} fontSize={n.type === 'core' ? 11 : n.type === 'agent' ? 9 : 8} fontFamily="monospace" fontWeight="600">{n.label}</text>

                {/* Revenue overlay */}
                {showRevenue && n.revenue !== undefined && n.revenue > 0 && (
                  <text x={n.x} y={n.y - n.size / 2 - 6} textAnchor="middle" fill="#FBBF24" fontSize="9" fontFamily="monospace" fontWeight="bold">{fmt(n.revenue)}</text>
                )}
                {/* Perf overlay */}
                {showPerf && n.throughput !== undefined && (
                  <text x={n.x + n.size / 2 + 4} y={n.y} fill="#00D4FF" fontSize="8" fontFamily="monospace">{n.throughput}/h</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute top-2 right-2 bg-gray-900/90 backdrop-blur border border-gray-800 rounded-lg p-2 text-[8px] space-y-0.5 z-20">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Active</div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Idle</div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Processing</div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Error</div>
          <div className="flex items-center gap-1.5 text-yellow-400/50">⬡ Gold = Revenue</div>
        </div>

      </div>

      {/* Bottleneck alerts — below graph, not overlapping */}
      {bottlenecks.length > 0 && (
        <div className="mt-3 space-y-2">
          {bottlenecks.slice(0, 3).map((b, i) => (
            <div key={i} className="glass-card flex items-start gap-2 p-2.5">
              <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white"><strong>{b.agent}:</strong> {b.issue}</p>
                <p className="text-[10px] text-gray-400">💡 {b.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Feed */}
      {showFeed && (
        <div className="absolute bottom-24 left-0 right-0 max-h-40 overflow-y-auto bg-gray-900/95 backdrop-blur border-t border-gray-700 z-30">
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-800">
            <span className="text-[10px] text-gray-400 font-mono">LIVE ACTIVITY FEED</span>
            <button onClick={() => setShowFeed(false)} className="text-gray-500"><X size={12} /></button>
          </div>
          {activityFeed.map((item, i) => (
            <div key={i} className="px-3 py-1.5 flex items-start gap-2 border-b border-gray-800/50">
              <div className="w-1 h-4 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-300">{item.text}</p>
              </div>
              <span className="text-[9px] text-gray-500 font-mono shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selectedNode && <DetailPanel node={selectedNode} edges={edges} allNodes={allNodes} onClose={() => setSelected(null)} fmt={fmt} onFocus={() => { setFocusNode(selectedNode.id); setSelected(null); }} />}
    </div>
  );
}

// ═══════════════ SHARED COMPONENTS ═══════════════

function Header({ search, setSearch, filter, setFilter, viewMode, setViewMode, activeCount, totalRevenue, totalCost }) {
  return (
    <>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-1.5"><Brain size={16} className="text-cyan-400" />Agent Intelligence</h1>
          <p className="text-[9px] text-gray-400 font-mono">{activeCount}/10 ACTIVE • $33/day • 10 crons</p>
        </div>
        <div className="flex gap-1">
          {[
            { key: 'graph', icon: <Target size={12} />, label: 'Graph' },
            { key: 'grid', icon: <LayoutGrid size={12} />, label: 'Grid' },
            { key: 'flow', icon: <GitBranch size={12} />, label: 'Flow' },
          ].map(v => (
            <button key={v.key} onClick={() => setViewMode(v.key)} className={`px-2 py-1 text-[9px] rounded border flex items-center gap-1 ${viewMode === v.key ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-500'}`}>
              {v.icon}{v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative mb-1.5">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-7 pr-3 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {['all', 'active', 'idle', 'error', 'revenue', 'underperforming'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-2 py-0.5 text-[8px] rounded-full border whitespace-nowrap ${filter === f ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-500'}`}>
            {f === 'all' ? 'All' : f === 'revenue' ? '💰 Revenue' : f === 'underperforming' ? '⚠️ Under' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
}

function ToggleBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-2 py-1 text-[9px] rounded-full border flex items-center gap-1 whitespace-nowrap ${active ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-500'}`}>
      {icon}{label}
    </button>
  );
}

function DetailPanel({ node, edges, allNodes, onClose, fmt, onFocus }) {
  const sc = statusColor[node.status] || '#6B7280';
  const connections = edges.filter(e => e.from === node.id || e.to === node.id);

  return (
    <div className="absolute bottom-24 left-3 right-3 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl p-3 z-50 max-h-[60vh] overflow-y-auto" style={{ animation: 'slideUp 0.2s ease-out' }}>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white"><X size={14} /></button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold" style={{ borderColor: sc, color: sc, backgroundColor: sc + '15' }}>
          {node.label.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{node.label}</h3>
          <p className="text-[10px] text-gray-400">{node.role} • {node.model || 'System'}</p>
        </div>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full border font-mono" style={{ color: sc, borderColor: sc + '40', backgroundColor: sc + '10' }}>{node.status?.toUpperCase()}</span>
      </div>

      {/* Objective */}
      {node.objective && (
        <div className="mb-3 bg-gray-800/50 rounded-lg p-2">
          <p className="text-[9px] text-gray-500 font-mono mb-0.5">CURRENT OBJECTIVE</p>
          <p className="text-[10px] text-white">{node.objective}</p>
        </div>
      )}

      {/* Metrics */}
      {node.tasks !== undefined && (
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          <Metric label="TASKS" value={node.tasks?.toLocaleString()} color="#00D4FF" />
          <Metric label="SUCCESS" value={`${node.successRate}%`} color={node.successRate > 85 ? '#22C55E' : '#F59E0B'} />
          <Metric label="EFFICIENCY" value={`${node.efficiency}%`} color="#A855F7" />
          <Metric label="RELIABILITY" value={`${node.reliability}%`} color="#3B82F6" />
        </div>
      )}

      {/* Revenue & Cost */}
      {(node.revenue !== undefined || node.cost !== undefined) && (
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <Metric label="REVENUE" value={node.revenue > 0 ? fmt(node.revenue) : '—'} color="#FBBF24" />
          <Metric label="COST/DAY" value={`$${node.cost}`} color="#EF4444" />
          <Metric label="ROI" value={node.revenue > 0 && node.cost > 0 ? `${Math.round(node.revenue / (node.cost * 365))}x` : '—'} color={node.revenue > 0 ? '#22C55E' : '#6B7280'} />
        </div>
      )}

      {/* Performance */}
      {node.apiCalls !== undefined && (
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <Metric label="API CALLS" value={node.apiCalls?.toLocaleString()} color="#3B82F6" />
          <Metric label="LATENCY" value={`${node.latency}s`} color={node.latency < 2 ? '#22C55E' : '#F59E0B'} />
          <Metric label="THROUGHPUT" value={`${node.throughput}/h`} color="#A855F7" />
        </div>
      )}

      {/* Connections */}
      <div className="mb-3">
        <p className="text-[9px] text-gray-500 font-mono mb-1">CONNECTIONS ({connections.length})</p>
        <div className="flex flex-wrap gap-1">
          {connections.map((e, i) => {
            const otherId = e.from === node.id ? e.to : e.from;
            const other = allNodes.find(n => n.id === otherId);
            return <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full border border-gray-700 text-gray-400">{other?.label}</span>;
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-1.5">
        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-1"><Eye size={10} />Inspect</button>
        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700 flex items-center justify-center gap-1"><Pause size={10} />Pause</button>
        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700 flex items-center justify-center gap-1"><RefreshCw size={10} />Restart</button>
        {onFocus && <button onClick={onFocus} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center gap-1"><Target size={10} />Focus</button>}
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-1.5 text-center">
      <p className="text-[8px] text-gray-500 font-mono">{label}</p>
      <p className="text-xs font-bold font-mono" style={{ color }}>{value}</p>
    </div>
  );
}
