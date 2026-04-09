import React, { useState, useEffect, useRef } from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, Filter, Activity, AlertTriangle, Zap, Brain, Eye } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// AGENT INTELLIGENCE COMMAND CENTER
// A live intelligence system + control interface
// ═══════════════════════════════════════════════════════

// NODE DEFINITIONS — Every agent, integration, workflow, data source
const nodes = [
  // Core Agents (large)
  { id: 'charles', label: 'Charles (CBV2)', type: 'core', status: 'active', role: 'Primary AI Agent', model: 'Opus 4.6', tasksCompleted: 4521, revenue: '$2.8M influenced', x: 400, y: 300, size: 60 },
  
  // Sub-agents (medium)
  { id: 'trading-bot', label: 'Trading Bot', type: 'agent', status: 'active', role: 'Live Trading', model: 'GPT-4o', tasksCompleted: 892, revenue: '$500 capital', x: 200, y: 150, size: 40 },
  { id: 'email-responder', label: 'Email Responder', type: 'agent', status: 'active', role: 'Auto-Reply', model: 'Haiku', tasksCompleted: 1247, revenue: '$80K pipeline', x: 600, y: 150, size: 40 },
  { id: 'content-agent', label: 'Content Agent', type: 'agent', status: 'active', role: 'Newsletter', model: 'Sonnet', tasksCompleted: 287, revenue: '287 subs', x: 600, y: 450, size: 40 },
  { id: 'social-agent', label: 'Social Media', type: 'agent', status: 'idle', role: 'Distribution', model: 'GPT-4o', tasksCompleted: 90, revenue: '18.7K reach', x: 750, y: 350, size: 35 },
  { id: 'market-research', label: 'Market Research', type: 'agent', status: 'active', role: 'Analysis', model: 'Perplexity', tasksCompleted: 365, revenue: 'Intel feeds', x: 150, y: 300, size: 35 },
  { id: 'prospect-research', label: 'Prospect Research', type: 'agent', status: 'idle', role: 'Lead Gen', model: 'Perplexity', tasksCompleted: 42, revenue: '$5K MRR target', x: 650, y: 250, size: 35 },
  { id: 'cost-monitor', label: 'Cost Monitor', type: 'agent', status: 'active', role: 'Budget Tracking', model: 'Custom', tasksCompleted: 730, revenue: '$200/mo budget', x: 300, y: 480, size: 35 },
  { id: 'discord-bot', label: 'Discord Bot', type: 'agent', status: 'active', role: '14 Channels', model: 'Haiku', tasksCompleted: 4521, revenue: 'Ops visibility', x: 200, y: 450, size: 35 },
  { id: 'rlm-estimator', label: 'RLM Estimator', type: 'agent', status: 'processing', role: 'Bid Generation', model: 'GPT-4o', tasksCompleted: 354, revenue: '$410K pipeline', x: 500, y: 100, size: 40 },
  
  // Integrations (small)
  { id: 'alpaca', label: 'Alpaca', type: 'integration', status: 'active', role: 'Live Trading API', x: 80, y: 100, size: 25 },
  { id: 'gmail', label: 'Gmail', type: 'integration', status: 'active', role: 'OAuth + App Pass', x: 700, y: 100, size: 25 },
  { id: 'discord-api', label: 'Discord', type: 'integration', status: 'active', role: '14 channels', x: 100, y: 500, size: 25 },
  { id: 'substack', label: 'Substack', type: 'integration', status: 'active', role: 'Publishing', x: 700, y: 500, size: 25 },
  { id: 'buffer', label: 'Buffer', type: 'integration', status: 'active', role: 'Tweet Queue', x: 780, y: 420, size: 25 },
  { id: 'perplexity', label: 'Perplexity', type: 'integration', status: 'active', role: 'Research API', x: 50, y: 250, size: 25 },
  { id: 'stripe', label: 'Stripe', type: 'integration', status: 'active', role: 'Payments', x: 750, y: 200, size: 25 },
  { id: 'ollama', label: 'Ollama', type: 'integration', status: 'active', role: 'Local LLM', x: 350, y: 50, size: 25 },
  { id: 'anthropic', label: 'Anthropic', type: 'integration', status: 'active', role: 'Claude API', x: 450, y: 50, size: 25 },
  { id: 'openai', label: 'OpenAI', type: 'integration', status: 'active', role: 'GPT-4o API', x: 300, y: 80, size: 25 },
  { id: 'vercel', label: 'Vercel', type: 'integration', status: 'active', role: 'Deployment', x: 550, y: 530, size: 25 },
  { id: 'supabase', label: 'Supabase', type: 'integration', status: 'active', role: 'Database', x: 450, y: 530, size: 25 },
  { id: 'tailscale', label: 'Tailscale', type: 'integration', status: 'active', role: 'VPN Mesh', x: 350, y: 550, size: 25 },
  { id: 'zapier', label: 'Zapier', type: 'integration', status: 'configured', role: 'Automation', x: 150, y: 380, size: 25 },
  { id: 'tradingview', label: 'TradingView', type: 'integration', status: 'planned', role: 'Webhooks', x: 80, y: 180, size: 25 },
  
  // Data Sources (external)
  { id: 'rlm-data', label: 'RLM Pipeline', type: 'data', status: 'active', role: '354 projects', x: 550, y: 50, size: 20 },
  { id: 'nvcc-data', label: 'NVCC Members', type: 'data', status: 'active', role: '128 members', x: 650, y: 50, size: 20 },
];

// EDGE DEFINITIONS — All connections between nodes
const edges = [
  // Charles → all sub-agents (dependency)
  { from: 'charles', to: 'trading-bot', type: 'dependency', traffic: 'high' },
  { from: 'charles', to: 'email-responder', type: 'dependency', traffic: 'high' },
  { from: 'charles', to: 'content-agent', type: 'dependency', traffic: 'medium' },
  { from: 'charles', to: 'social-agent', type: 'dependency', traffic: 'low' },
  { from: 'charles', to: 'market-research', type: 'dependency', traffic: 'medium' },
  { from: 'charles', to: 'prospect-research', type: 'dependency', traffic: 'low' },
  { from: 'charles', to: 'cost-monitor', type: 'dependency', traffic: 'medium' },
  { from: 'charles', to: 'discord-bot', type: 'dependency', traffic: 'high' },
  { from: 'charles', to: 'rlm-estimator', type: 'dependency', traffic: 'medium' },
  
  // Agent → Integration (API communication)
  { from: 'trading-bot', to: 'alpaca', type: 'api', traffic: 'high' },
  { from: 'trading-bot', to: 'openai', type: 'api', traffic: 'medium' },
  { from: 'email-responder', to: 'gmail', type: 'api', traffic: 'high' },
  { from: 'email-responder', to: 'anthropic', type: 'api', traffic: 'medium' },
  { from: 'content-agent', to: 'substack', type: 'api', traffic: 'medium' },
  { from: 'content-agent', to: 'anthropic', type: 'api', traffic: 'high' },
  { from: 'social-agent', to: 'buffer', type: 'api', traffic: 'low' },
  { from: 'market-research', to: 'perplexity', type: 'api', traffic: 'high' },
  { from: 'prospect-research', to: 'perplexity', type: 'api', traffic: 'low' },
  { from: 'prospect-research', to: 'stripe', type: 'api', traffic: 'low' },
  { from: 'discord-bot', to: 'discord-api', type: 'api', traffic: 'high' },
  { from: 'rlm-estimator', to: 'openai', type: 'api', traffic: 'medium' },
  { from: 'cost-monitor', to: 'anthropic', type: 'api', traffic: 'low' },
  
  // Data flow
  { from: 'rlm-data', to: 'rlm-estimator', type: 'data', traffic: 'medium' },
  { from: 'nvcc-data', to: 'prospect-research', type: 'data', traffic: 'low' },
  { from: 'alpaca', to: 'tradingview', type: 'data', traffic: 'low' },
  { from: 'market-research', to: 'trading-bot', type: 'data', traffic: 'high' },
  { from: 'content-agent', to: 'social-agent', type: 'data', traffic: 'medium' },
  
  // Infrastructure
  { from: 'charles', to: 'supabase', type: 'api', traffic: 'medium' },
  { from: 'charles', to: 'vercel', type: 'api', traffic: 'low' },
  { from: 'charles', to: 'tailscale', type: 'api', traffic: 'low' },
  { from: 'zapier', to: 'email-responder', type: 'data', traffic: 'low' },
];

// Status colors and styles
const statusStyles = {
  active: { color: '#00D4FF', glow: '0 0 20px rgba(0,212,255,0.6)', pulse: true },
  idle: { color: '#6B7280', glow: 'none', pulse: false },
  error: { color: '#EF4444', glow: '0 0 20px rgba(239,68,68,0.8)', pulse: true },
  processing: { color: '#F59E0B', glow: '0 0 15px rgba(245,158,11,0.5)', pulse: true },
  learning: { color: '#FBBF24', glow: '0 0 15px rgba(251,191,36,0.5)', pulse: true },
  configured: { color: '#3B82F6', glow: '0 0 10px rgba(59,130,246,0.4)', pulse: false },
  planned: { color: '#9CA3AF', glow: 'none', pulse: false },
};

const typeStyles = {
  core: { border: 3, labelSize: 12, bg: 'rgba(0,212,255,0.15)' },
  agent: { border: 2, labelSize: 10, bg: 'rgba(0,212,255,0.08)' },
  integration: { border: 1.5, labelSize: 9, bg: 'rgba(100,100,100,0.1)' },
  data: { border: 1, labelSize: 8, bg: 'rgba(100,100,100,0.05)' },
};

const edgeStyles = {
  dependency: { dash: '8,4', width: 1.5 },
  api: { dash: 'none', width: 1 },
  data: { dash: 'none', width: 0.8 },
};

const trafficWidth = { high: 2.5, medium: 1.5, low: 0.8 };

export default function AgentIntelligence() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('graph');
  const canvasRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter nodes
  const filteredNodes = nodes.filter(n => {
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'active' && n.status !== 'active') return false;
    if (filter === 'agents' && !['core', 'agent'].includes(n.type)) return false;
    if (filter === 'integrations' && n.type !== 'integration') return false;
    if (filter === 'issues' && !['error', 'idle', 'planned'].includes(n.status)) return false;
    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));

  // Stats
  const activeAgents = nodes.filter(n => ['core', 'agent'].includes(n.type) && n.status === 'active').length;
  const totalAgents = nodes.filter(n => ['core', 'agent'].includes(n.type)).length;
  const activeIntegrations = nodes.filter(n => n.type === 'integration' && n.status === 'active').length;
  const totalIntegrations = nodes.filter(n => n.type === 'integration').length;
  const issues = nodes.filter(n => ['error', 'planned'].includes(n.status)).length;

  // Touch/mouse handlers for pan
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  const selected = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="w-full h-full overflow-hidden pb-20 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain size={20} className="text-cyan-400" />
              Agent Intelligence
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">
              {activeAgents}/{totalAgents} AGENTS • {activeIntegrations}/{totalIntegrations} INTEGRATIONS • {issues} ISSUES
            </p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"><ZoomIn size={14} /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"><ZoomOut size={14} /></button>
            <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"><Maximize2 size={14} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents, integrations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All Nodes' },
            { key: 'active', label: 'Active' },
            { key: 'agents', label: 'Agents' },
            { key: 'integrations', label: 'Integrations' },
            { key: 'issues', label: 'Issues' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 text-[9px] rounded-full border whitespace-nowrap ${
                filter === f.key ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          setDragging(true);
          setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
        }}
        onTouchMove={(e) => {
          if (!dragging) return;
          const touch = e.touches[0];
          setOffset({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
        }}
        onTouchEnd={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowStrong">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Edges */}
          {filteredEdges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const style = edgeStyles[edge.type] || edgeStyles.api;
            const width = trafficWidth[edge.traffic] || 1;
            const isHighTraffic = edge.traffic === 'high';

            return (
              <g key={`edge-${i}`}>
                {isHighTraffic && (
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="rgba(0,212,255,0.15)"
                    strokeWidth={width + 3}
                    filter="url(#glow)"
                  />
                )}
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isHighTraffic ? 'rgba(0,212,255,0.4)' : 'rgba(100,116,139,0.25)'}
                  strokeWidth={width}
                  strokeDasharray={style.dash}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map(node => {
            const ss = statusStyles[node.status] || statusStyles.idle;
            const ts = typeStyles[node.type] || typeStyles.agent;
            const isSelected = selectedNode === node.id;

            return (
              <g
                key={node.id}
                onClick={(e) => { e.stopPropagation(); setSelectedNode(isSelected ? null : node.id); }}
                className="cursor-pointer"
              >
                {/* Glow effect for active nodes */}
                {ss.pulse && (
                  <circle
                    cx={node.x} cy={node.y} r={node.size / 2 + 8}
                    fill="none"
                    stroke={ss.color}
                    strokeWidth="1"
                    opacity="0.3"
                  >
                    <animate attributeName="r" values={`${node.size / 2 + 4};${node.size / 2 + 12};${node.size / 2 + 4}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={node.x} cy={node.y} r={node.size / 2 + 6}
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  >
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${node.x} ${node.y}`} to={`360 ${node.x} ${node.y}`} dur="10s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size / 2}
                  fill={ts.bg}
                  stroke={ss.color}
                  strokeWidth={ts.border}
                  filter={ss.pulse ? 'url(#glow)' : undefined}
                />

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + node.size / 2 + 14}
                  textAnchor="middle"
                  fill={ss.color}
                  fontSize={ts.labelSize}
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.label}
                </text>

                {/* Node icon/initials */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={ss.color}
                  fontSize={node.size * 0.35}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.label.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Detail Panel */}
      {selected && (
        <div className="absolute bottom-24 left-4 right-4 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl p-4 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold"
                style={{ borderColor: statusStyles[selected.status]?.color, color: statusStyles[selected.status]?.color, backgroundColor: statusStyles[selected.status]?.color + '15' }}
              >
                {selected.label.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{selected.label}</h3>
                <p className="text-[10px] text-gray-400">{selected.role} • {selected.model || 'System'}</p>
              </div>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono ${
              selected.status === 'active' ? 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10' :
              selected.status === 'error' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
              selected.status === 'processing' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
              selected.status === 'idle' ? 'text-gray-400 border-gray-400/30 bg-gray-400/10' :
              'text-blue-400 border-blue-400/30 bg-blue-400/10'
            }`}>
              {selected.status.toUpperCase()}
            </span>
          </div>

          {/* Metrics */}
          {selected.tasksCompleted && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <p className="text-[9px] text-gray-500 font-mono">TASKS</p>
                <p className="text-sm font-bold text-white">{selected.tasksCompleted.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <p className="text-[9px] text-gray-500 font-mono">REVENUE</p>
                <p className="text-sm font-bold text-cyan-400">{selected.revenue || 'N/A'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <p className="text-[9px] text-gray-500 font-mono">TYPE</p>
                <p className="text-sm font-bold text-white capitalize">{selected.type}</p>
              </div>
            </div>
          )}

          {/* Connections */}
          <div className="mb-3">
            <p className="text-[9px] text-gray-500 font-mono mb-1">CONNECTIONS</p>
            <div className="flex flex-wrap gap-1">
              {edges.filter(e => e.from === selected.id || e.to === selected.id).map((e, i) => {
                const other = e.from === selected.id ? e.to : e.from;
                const otherNode = nodes.find(n => n.id === other);
                return (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">
                    {e.type === 'dependency' ? '→ ' : e.type === 'api' ? '⚡ ' : '📊 '}{otherNode?.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-1">
              <Eye size={12} /> Inspect
            </button>
            <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700 flex items-center justify-center gap-1">
              <Activity size={12} /> Logs
            </button>
            <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700 flex items-center justify-center gap-1">
              <Zap size={12} /> Restart
            </button>
          </div>

          <button onClick={() => setSelectedNode(null)} className="absolute top-2 right-2 text-gray-500 hover:text-white text-sm">✕</button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-[140px] right-2 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg p-2 text-[8px] space-y-1">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-400" /> Active</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-500" /> Idle</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> Error</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Processing</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /> Configured</div>
        <div className="flex items-center gap-1.5 text-gray-500">── Dependency</div>
        <div className="flex items-center gap-1.5 text-gray-500">—— API Call</div>
        <div className="flex items-center gap-1.5 text-cyan-400/50">━━ High Traffic</div>
      </div>
    </div>
  );
}
