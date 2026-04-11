import React from 'react';
import { Trophy, TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

const weekData = {
  period: 'April 3 – April 9, 2026',
  topPerformer: { name: 'Email Responder', score: 98, reason: '655 emails auto-replied, reply loops fixed, sensitivity filters active' },
  worstPerformer: { name: 'Social Media (Twitter)', score: 10, reason: 'Blocked since April 1 — 401 auth error, 89 tweets queued' },
  revenue: { total: '$3.29M', change: '+18%', breakdown: [
    { source: 'RLM Pipeline', amount: '$2.8M', status: 'up' },
    { source: 'Trading', amount: '$500', status: 'neutral' },
    { source: "Bennett's Brief", amount: '$3.4K MRR', status: 'up' },
    { source: 'NVCC Memberships', amount: '$145K YTD', status: 'up' },
    { source: 'AI Support', amount: '$0', status: 'neutral' },
  ]},
  costs: { total: '$48', budget: '$200', daily: '$3-5/day normal ($48 on heavy Opus day)', breakdown: [
    { item: 'Anthropic (Claude)', amount: '$40', pct: '83%' },
    { item: 'OpenAI (GPT-4o)', amount: '$5', pct: '10%' },
    { item: 'Perplexity', amount: '$2', pct: '4%' },
    { item: 'Other', amount: '$1', pct: '2%' },
  ]},
  agentScores: [
    { name: 'Discord Bot', score: 100, tasks: 4521, trend: 'stable' },
    { name: 'Cost Monitor', score: 100, tasks: 730, trend: 'stable' },
    { name: 'Email Responder', score: 97, tasks: 1247, trend: 'up' },
    { name: 'Content Agent', score: 92, tasks: 287, trend: 'up' },
    { name: 'Trading Bot', score: 88, tasks: 892, trend: 'up' },
    { name: 'RLM Estimator', score: 85, tasks: 354, trend: 'stable' },
    { name: 'Market Research', score: 78, tasks: 365, trend: 'down' },
    { name: 'Social Media', score: 45, tasks: 90, trend: 'down' },
    { name: 'Prospect Research', score: 32, tasks: 42, trend: 'down' },
  ],
  bottlenecks: [
    'Prospect Research idle 24h+ — reassign or disable',
    'Social Media waiting on Content Agent handoff — automate pipeline',
    'TradingView not connected — missing webhook signals',
  ],
  wins: [
    'Email Responder auto-processed 1,247 emails this week',
    'Hotel Oxbow bid generated — $410K revenue potential',
    'Trading bot maintained 52% WR on live account',
    "Bennett's Brief hit 287 subscribers (38% open rate)",
    'Cost reduced from $67/day to $26/day average',
  ],
};

export default function WeeklyScorecard() {
  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-yellow-400" />
          <h1 className="text-xl font-bold text-white">Weekly Scorecard</h1>
        </div>
        <p className="text-xs text-gray-400 font-mono">{weekData.period}</p>
      </div>

      {/* Top & Bottom Performer */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card border-green-500/20">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-[10px] text-green-400 font-mono">TOP PERFORMER</span>
          </div>
          <p className="text-sm font-bold text-white">{weekData.topPerformer.name}</p>
          <p className="text-2xl font-bold text-green-400 font-mono">{weekData.topPerformer.score}</p>
          <p className="text-[9px] text-gray-400 mt-1">{weekData.topPerformer.reason}</p>
        </div>
        <div className="glass-card border-red-500/20">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-[10px] text-red-400 font-mono">NEEDS ATTENTION</span>
          </div>
          <p className="text-sm font-bold text-white">{weekData.worstPerformer.name}</p>
          <p className="text-2xl font-bold text-red-400 font-mono">{weekData.worstPerformer.score}</p>
          <p className="text-[9px] text-gray-400 mt-1">{weekData.worstPerformer.reason}</p>
        </div>
      </div>

      {/* Revenue */}
      <div className="mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-green-400" />
              <h2 className="text-sm font-bold text-white">Revenue Influenced</h2>
            </div>
            <span className="text-xs font-mono text-green-400">{weekData.revenue.change}</span>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-3">{weekData.revenue.total}</p>
          <div className="space-y-1.5">
            {weekData.revenue.breakdown.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{r.source}</span>
                <span className={r.status === 'up' ? 'text-green-400' : 'text-gray-400'}>{r.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <h2 className="text-sm font-bold text-white">API Costs</h2>
            </div>
            <span className="text-xs font-mono text-yellow-400">{weekData.costs.daily}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-3xl font-bold text-white">{weekData.costs.total}</p>
            <p className="text-sm text-gray-400">/ {weekData.costs.budget} budget</p>
          </div>
          <div className="bg-gray-800 rounded-full h-2 mb-3">
            <div className="h-2 rounded-full bg-yellow-500" style={{ width: '93%' }} />
          </div>
          <div className="space-y-1.5">
            {weekData.costs.breakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{c.item}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{c.amount}</span>
                  <span className="text-gray-500 text-[10px]">{c.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Rankings */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3">Agent Rankings</h2>
        <div className="space-y-1.5">
          {weekData.agentScores.map((a, i) => (
            <div key={i} className="glass-card flex items-center gap-3 py-2">
              <span className="text-xs font-mono text-gray-500 w-5">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white truncate">{a.name}</span>
                  {a.trend === 'up' && <TrendingUp size={10} className="text-green-400" />}
                  {a.trend === 'down' && <TrendingDown size={10} className="text-red-400" />}
                </div>
                <div className="mt-1 bg-gray-800 rounded-full h-1.5 w-full">
                  <div className="h-1.5 rounded-full" style={{
                    width: `${a.score}%`,
                    backgroundColor: a.score > 85 ? '#22C55E' : a.score > 60 ? '#F59E0B' : '#EF4444'
                  }} />
                </div>
              </div>
              <span className="text-sm font-bold font-mono" style={{
                color: a.score > 85 ? '#22C55E' : a.score > 60 ? '#F59E0B' : '#EF4444'
              }}>{a.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wins */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle size={14} className="text-green-400" /> Wins This Week
        </h2>
        <div className="space-y-1.5">
          {weekData.wins.map((w, i) => (
            <div key={i} className="glass-card flex items-start gap-2 py-2">
              <span className="text-green-400 text-xs mt-0.5">✓</span>
              <span className="text-xs text-gray-300">{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottlenecks */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-yellow-400" /> Bottlenecks to Fix
        </h2>
        <div className="space-y-1.5">
          {weekData.bottlenecks.map((b, i) => (
            <div key={i} className="glass-card flex items-start gap-2 py-2 border-yellow-500/10">
              <span className="text-yellow-400 text-xs mt-0.5">⚠</span>
              <span className="text-xs text-gray-300">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
