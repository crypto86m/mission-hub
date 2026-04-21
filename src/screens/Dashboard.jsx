import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, Zap, DollarSign, RefreshCw } from 'lucide-react';
import OrbitalRing from '../components/OrbitalRing';
import ActivityFeed from '../components/ActivityFeed';
import MasterConnect from '../components/MasterConnect';
import SystemHealthWidget from '../components/SystemHealthWidget';

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => { setLiveData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const d = liveData || {};
  const t = d.trading || {};
  const c = d.costs || {};
  const nl = d.newsletter || {};
  const ig = d.instagram || {};
  const co = d.companies || {};
  const svc = d.services || {};
  const ag = d.agents || {};

  const companies = [
    {
      id: 1,
      name: 'RLM',
      title: 'Commercial Painting',
      stats: co.rlm?.revenue ? `$${(co.rlm.revenue / 1000000).toFixed(1)}M` : '$2.4M+',
      subtitle: co.rlm?.activeProjects ? `${co.rlm.activeProjects} Active Projects` : 'Annual Revenue',
      color: 'from-blue-500 to-blue-600',
      icon: '🏢',
      detail: co.rlm,
    },
    {
      id: 2,
      name: 'NVCC',
      title: 'Exotic Cars',
      stats: co.nvcc?.members ? `${co.nvcc.members} members` : '128 members',
      subtitle: co.nvcc?.fleetValue ? `Fleet: $${(co.nvcc.fleetValue / 1000000).toFixed(1)}M` : 'Napa Valley Car Club',
      color: 'from-purple-500 to-purple-600',
      icon: '🏎️',
      detail: co.nvcc,
    },
    {
      id: 3,
      name: 'Trading',
      title: 'Active Trading',
      stats: t.accountValue ? `$${t.accountValue.toLocaleString()}` : loading ? '...' : 'Not connected',
      subtitle: t.todayPnl !== undefined ? `Today P&L: ${t.todayPnl >= 0 ? '+' : ''}$${(t.todayPnl || 0).toFixed(2)}` : 'Paper account',
      color: 'from-green-500 to-green-600',
      icon: '📈',
      detail: t,
    },
    {
      id: 4,
      name: 'Brief',
      title: "Bennett's Brief",
      stats: nl.subscribers ? nl.subscribers.toLocaleString() : '—',
      subtitle: nl.issuesPublished ? `${nl.issuesPublished} issues • ${nl.openRate || 0}% open rate` : 'Newsletter',
      color: 'from-orange-500 to-orange-600',
      icon: '📰',
      detail: nl,
    },
    {
      id: 5,
      name: 'Instagram',
      title: '@benjamin86m',
      stats: ig.followers ? ig.followers.toLocaleString() : '—',
      subtitle: ig.engagementRate ? `${ig.engagementRate}% engagement` : 'Instagram',
      color: 'from-pink-500 to-pink-600',
      icon: '📸',
      detail: ig,
    },
  ];

  const activityFeed = [
    {
      id: 1,
      action: 'Trading',
      details: t.strategiesLoaded ? `${t.strategiesLoaded} strategies loaded — ${t.phase || 'Paper trading'}` : 'Trading system status unknown',
      time: 'Live',
      status: t.accountValue ? 'active' : 'idle',
    },
    {
      id: 2,
      action: 'Newsletter',
      details: nl.subscribers ? `Bennett's Brief: ${nl.subscribers} subscribers, ${nl.issuesPublished} issues published` : "Bennett's Brief: no data",
      time: nl.lastIssue || 'Unknown',
      status: 'done',
    },
    {
      id: 3,
      action: 'Instagram',
      details: ig.followers ? `${ig.followers} followers, ${ig.views30d?.toLocaleString()} views (30d)` : 'Instagram not connected',
      time: 'Live',
      status: ig.followers ? 'active' : 'idle',
    },
    {
      id: 4,
      action: 'Twitter/X',
      details: d.twitter?.status === 'blocked' ? `⚠️ Blocked: ${d.twitter.error}` : d.twitter?.queued ? `${d.twitter.queued} tweets queued` : 'No data',
      time: 'Live',
      status: d.twitter?.status === 'blocked' ? 'blocked' : 'pending',
    },
    {
      id: 5,
      action: 'Cron Jobs',
      details: ag.cronJobs ? `${ag.cronHealthy || 0}/${ag.cronJobs} healthy` : 'No cron data',
      time: 'Live',
      status: ag.cronErrors > 0 ? 'warning' : 'active',
    },
    {
      id: 6,
      action: 'RLM',
      details: co.rlm?.activeProjects ? `${co.rlm.activeProjects} active projects, ${co.rlm.margin || 0}% margin` : 'RLM data not connected',
      time: 'Live',
      status: co.rlm ? 'active' : 'idle',
    },
  ];

  const costPct = c.monthTotal && c.monthlyBudget ? ((c.monthTotal / c.monthlyBudget) * 100).toFixed(0) : null;

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold glow-text mb-1">Mission Control</h1>
          <p className="text-gray-400 text-sm">
            {liveData ? `Last updated ${new Date(liveData.generated).toLocaleTimeString()}` : loading ? 'Loading...' : 'No live data'}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetch('/api/status.json?t=' + Date.now()).then(r => r.json()).then(d => { setLiveData(d); setLoading(false); }).catch(() => setLoading(false)); }}
          className="p-2 rounded-lg bg-cyan/10 border border-cyan/30"
        >
          <RefreshCw size={16} className={`text-cyan ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Master Connect */}
      <div className="mb-6">
        <MasterConnect />
      </div>

      {/* System Health */}
      <div className="mb-6">
        <SystemHealthWidget />
      </div>

      {/* Live KPIs */}
      {liveData && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Live Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card text-center">
              <DollarSign className="mx-auto mb-1 text-green-400" size={18} />
              <p className="text-lg font-bold">{c.today !== undefined ? `$${c.today.toFixed(2)}` : '—'}</p>
              <p className="text-[10px] text-gray-400">Today's API Cost</p>
              {c.dailyLimit && <p className="text-[9px] text-gray-500">limit: ${c.dailyLimit}</p>}
            </div>
            <div className="glass-card text-center">
              <Activity className="mx-auto mb-1 text-cyan" size={18} />
              <p className="text-lg font-bold">{ag.cronHealthy !== undefined ? `${ag.cronHealthy}/${ag.cronJobs}` : '—'}</p>
              <p className="text-[10px] text-gray-400">Crons Healthy</p>
              {ag.cronErrors > 0 && <p className="text-[9px] text-red-400">{ag.cronErrors} errors</p>}
            </div>
            <div className="glass-card text-center">
              <TrendingUp className="mx-auto mb-1 text-orange-400" size={18} />
              <p className="text-lg font-bold">{nl.subscribers !== undefined ? nl.subscribers : '—'}</p>
              <p className="text-[10px] text-gray-400">Brief Subscribers</p>
            </div>
            <div className="glass-card text-center">
              <Users className="mx-auto mb-1 text-pink-400" size={18} />
              <p className="text-lg font-bold">{ig.followers !== undefined ? ig.followers : '—'}</p>
              <p className="text-[10px] text-gray-400">IG Followers</p>
            </div>
          </div>
        </div>
      )}

      {/* Cost Monitor */}
      {liveData && c.monthTotal !== undefined && (
        <div className="mb-6 glass-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-sm font-bold">API Cost Monitor</span>
            </div>
            <span className={`text-xs font-mono ${costPct > 75 ? 'text-red-400' : 'text-green-400'}`}>
              ${c.monthTotal.toFixed(2)} / ${c.monthlyBudget}
            </span>
          </div>
          <div className="bg-gray-800 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full transition-all ${costPct > 75 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(costPct, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500">{costPct}% of monthly budget used</p>
        </div>
      )}

      {/* Trading P&L */}
      {liveData && t.accountValue !== undefined && (
        <div className="mb-6 glass-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-sm font-bold">Trading Account</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">{t.phase || 'Paper'}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-white">${(t.accountValue || 0).toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">Account Value</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${(t.todayPnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(t.todayPnl || 0) >= 0 ? '+' : ''}${(t.todayPnl || 0).toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-400">Today P&L</p>
            </div>
            <div>
              <p className="text-lg font-bold text-cyan">{t.openPositions || 0}</p>
              <p className="text-[10px] text-gray-400">Positions</p>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Overview */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Portfolio Overview</h2>
        <OrbitalRing companies={companies} selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />
      </div>

      {/* Company Detail on click */}
      {selectedCompany && (
        <div className="mb-6 glass-card animate-float">
          <h3 className="text-lg font-semibold mb-3 text-cyan">{selectedCompany.name} — {selectedCompany.title}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Primary Metric</p>
              <p className="text-2xl font-bold">{selectedCompany.stats}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{selectedCompany.subtitle}</p>
            </div>
          </div>
          {selectedCompany.detail && (
            <div className="mt-3 pt-3 border-t border-cyan/10">
              {Object.entries(selectedCompany.detail).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white font-mono">{typeof v === 'number' ? v.toLocaleString() : String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Activity Feed */}
      <div>
        <h2 className="text-lg font-bold mb-4">Live Activity</h2>
        <ActivityFeed activities={activityFeed} />
      </div>
    </div>
  );
}
