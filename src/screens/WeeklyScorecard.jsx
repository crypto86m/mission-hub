import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Zap, RefreshCw } from 'lucide-react';

export default function WeeklyScorecard() {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => { setLiveData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <RefreshCw className="animate-spin text-cyan" size={32} />
      </div>
    );
  }

  const d = liveData || {};
  const t = d.trading || {};
  const c = d.costs || {};
  const nl = d.newsletter || {};
  const ig = d.instagram || {};
  const tw = d.twitter || {};
  const em = d.email || {};
  const ag = d.agents || {};

  const tradingConnected = t.status === 'connected';
  const costsTracked = c.status !== 'not_tracked';
  const igConnected = ig.status !== 'not_connected';
  const twConnected = tw.status !== 'not_connected';

  const systemScores = [
    { name: 'Trading Bot', score: tradingConnected ? (t.openPositions > 0 ? 95 : 80) : null, trend: tradingConnected ? 'stable' : null, detail: tradingConnected ? `$${t.accountValue?.toLocaleString()} equity, ${t.openPositions} positions` : 'Connected — awaiting market data' },
    { name: 'Email Responder', score: em.totalReplies > 0 ? 98 : null, trend: em.totalReplies > 0 ? 'up' : null, detail: em.totalReplies > 0 ? `${em.totalReplies} total replies` : 'Not tracked' },
    { name: "Bennett's Brief", score: nl.subscribers > 0 ? 85 : null, trend: 'stable', detail: `${nl.subscribers || 0} subscribers, ${nl.issuesPublished || 0} issues` },
    { name: 'Instagram', score: igConnected ? 75 : null, trend: igConnected ? 'stable' : null, detail: igConnected ? `${ig.followers} followers, ${ig.engagementRate}% ER` : 'Not connected' },
    { name: 'Twitter/X', score: twConnected ? (tw.status === 'blocked' ? 10 : 70) : null, trend: twConnected ? 'down' : null, detail: twConnected ? (tw.status === 'blocked' ? `Blocked: ${tw.error}` : `${tw.queued} queued`) : 'Not connected' },
    { name: 'Cron Jobs', score: ag.cronJobs > 0 ? (ag.cronErrors > 0 ? 70 : 100) : null, trend: 'stable', detail: ag.cronJobs > 0 ? `${ag.cronHealthy}/${ag.cronJobs} healthy` : 'Not tracked' },
    { name: 'Cost Monitor', score: costsTracked ? ((c.monthTotal || 0) < 150 ? 100 : 60) : null, trend: 'stable', detail: costsTracked ? `$${c.monthTotal?.toFixed(2)} of $${c.monthlyBudget} budget` : 'Not tracked' },
  ];

  const sorted = [...systemScores].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const topPerformer = sorted.find(s => s.score !== null);
  const worstPerformer = [...sorted].reverse().find(s => s.score !== null);

  const generated = d.generated ? new Date(d.generated) : null;
  const weekStart = generated ? new Date(generated.getTime() - 7 * 86400000) : null;
  const period = generated
    ? `${weekStart?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${generated.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
    : 'Current Week';

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-yellow-400" />
          <h1 className="text-xl font-bold text-white">Weekly Scorecard</h1>
        </div>
        <p className="text-xs text-gray-400 font-mono">{period}</p>
        {!liveData && <p className="text-xs text-red-400 mt-1">⚠️ Could not load live data — no /api/status.json found</p>}
      </div>

      {/* Top & Bottom Performer */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card border-green-500/20">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-[10px] text-green-400 font-mono">TOP PERFORMER</span>
          </div>
          {topPerformer ? (
            <>
              <p className="text-sm font-bold text-white">{topPerformer.name}</p>
              <p className="text-2xl font-bold text-green-400 font-mono">{topPerformer.score}</p>
              <p className="text-[9px] text-gray-400 mt-1">{topPerformer.detail}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
        <div className="glass-card border-red-500/20">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-[10px] text-red-400 font-mono">NEEDS ATTENTION</span>
          </div>
          {worstPerformer && worstPerformer.score < 80 ? (
            <>
              <p className="text-sm font-bold text-white">{worstPerformer.name}</p>
              <p className="text-2xl font-bold text-red-400 font-mono">{worstPerformer.score}</p>
              <p className="text-[9px] text-gray-400 mt-1">{worstPerformer.detail}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">All systems healthy</p>
          )}
        </div>
      </div>

      {/* Trading Summary */}
      <div className="mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-green-400" />
              <h2 className="text-sm font-bold text-white">Trading Summary</h2>
            </div>
            <span className={`text-xs font-mono ${tradingConnected ? 'text-green-400' : 'text-gray-500'}`}>
              {tradingConnected ? 'LIVE' : 'NOT CONNECTED'}
            </span>
          </div>
          {tradingConnected ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${t.accountValue?.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Account Value</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${(t.todayPnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(t.todayPnl || 0) >= 0 ? '+' : ''}${(t.todayPnl || 0).toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-400">Today P&L</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan">{t.openPositions}</p>
                <p className="text-[10px] text-gray-400">Open Positions</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Awaiting connection to /api/status.json</p>
          )}
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
            <span className={`text-xs font-mono ${costsTracked ? 'text-yellow-400' : 'text-gray-500'}`}>
              {costsTracked ? `$${(c.monthTotal || 0).toFixed(2)} / $${c.monthlyBudget}` : 'NOT TRACKED'}
            </span>
          </div>
          {costsTracked ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-3xl font-bold text-white">${(c.monthTotal || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-400">/ ${c.monthlyBudget} budget</p>
              </div>
              <div className="bg-gray-800 rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full ${(c.monthTotal || 0) / (c.monthlyBudget || 200) > 0.75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min((c.monthTotal || 0) / (c.monthlyBudget || 200) * 100, 100)}%` }} />
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Cost tracking not configured. Set up daily cost logging to see data here.</p>
          )}
        </div>
      </div>

      {/* System Rankings */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3">System Rankings</h2>
        <div className="space-y-1.5">
          {sorted.map((a, i) => (
            <div key={i} className="glass-card flex items-center gap-3 py-2">
              <span className="text-xs font-mono text-gray-500 w-5">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white truncate">{a.name}</span>
                  {a.trend === 'up' && <TrendingUp size={10} className="text-green-400" />}
                  {a.trend === 'down' && <TrendingDown size={10} className="text-red-400" />}
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">{a.detail}</p>
                {a.score !== null ? (
                  <div className="mt-1 bg-gray-800 rounded-full h-1.5 w-full">
                    <div className="h-1.5 rounded-full" style={{
                      width: `${a.score}%`,
                      backgroundColor: a.score > 85 ? '#22C55E' : a.score > 60 ? '#F59E0B' : '#EF4444'
                    }} />
                  </div>
                ) : (
                  <div className="mt-1 bg-gray-800 rounded-full h-1.5 w-full" />
                )}
              </div>
              <span className="text-sm font-bold font-mono" style={{
                color: a.score === null ? '#6B7280' : a.score > 85 ? '#22C55E' : a.score > 60 ? '#F59E0B' : '#EF4444'
              }}>{a.score !== null ? a.score : '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {(ig.status === 'not_connected' || tw.status === 'not_connected') && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-yellow-400" /> Not Connected
          </h2>
          <div className="space-y-1.5">
            {ig.status === 'not_connected' && (
              <div className="glass-card flex items-start gap-2 py-2 border-yellow-500/10">
                <span className="text-yellow-400 text-xs mt-0.5">⚠</span>
                <span className="text-xs text-gray-300">Instagram — API not connected. Benjamin manages manually.</span>
              </div>
            )}
            {tw.status === 'not_connected' && (
              <div className="glass-card flex items-start gap-2 py-2 border-yellow-500/10">
                <span className="text-yellow-400 text-xs mt-0.5">⚠</span>
                <span className="text-xs text-gray-300">Twitter/X — API not connected. Benjamin manages manually.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
