import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, Zap, DollarSign, RefreshCw, CheckSquare } from 'lucide-react';
import OrbitalRing from '../components/OrbitalRing';
import ActivityFeed from '../components/ActivityFeed';
import MasterConnect from '../components/MasterConnect';
import SystemHealthWidget from '../components/SystemHealthWidget';
import { useTaskStore } from '../store/taskStore';
import AgentCommsLog from '../components/AgentCommsLog';
import TimeTravelSlider from '../components/TimeTravelSlider';
import SelfOptimization from '../components/SelfOptimization';

function TaskSummaryWidget() {
  const { summary, loaded, initialize, getSmartAlerts, getAtRiskTasks } = useTaskStore();
  useEffect(() => { if (!loaded) initialize(); }, [loaded]);
  if (!loaded) return null;
  const alerts = getSmartAlerts();
  const atRisk = getAtRiskTasks();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-cyan" />
          <h2 className="text-lg font-bold">Task Intelligence</h2>
        </div>
        <span className="text-xs font-mono text-gray-400">{summary.total} TASKS</span>
      </div>
      {alerts.length > 0 && (
        <div className="mb-2 space-y-1">
          {alerts.map((a, i) => (
            <div key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
              a.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
            }`}>{a.text}</div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 stagger-children">
        {[
          { label: 'Done', value: summary.completed, color: 'text-green-400' },
          { label: 'Active', value: summary.inProgress, color: 'text-blue-400' },
          { label: 'Approval', value: summary.awaitingApproval, color: 'text-yellow-400' },
          { label: 'Blocked', value: summary.blocked + summary.delayed, color: 'text-red-400' },
        ].map((c, i) => (
          <div key={i} className="glass-card text-center py-2">
            <p className={`text-xl font-bold number-animate ${c.color}`}>{c.value}</p>
            <p className="text-[9px] text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>
      {atRisk.length > 0 && (
        <div className="mt-2 text-[10px] text-orange-400">
          ⚠️ {atRisk.length} at-risk: {atRisk.slice(0, 3).map(t => t.title).join(', ')}{atRisk.length > 3 ? '...' : ''}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    // Fetch live status data (regenerated every 30 mins via tier-2-medium.sh)
    Promise.all([
      fetch('/api/status.json?t=' + Date.now()).then(r => r.json()),
      fetch('/api/videos.json?t=' + Date.now()).then(r => r.json()).catch(err => { console.warn('Videos not available:', err); return null; })
    ])
      .then(([statusData, videosData]) => {
        setLiveData(statusData);
        if (videosData) {
          setVideoData(videosData);
          if (videosData.videos && videosData.videos.length > 0) {
            setSelectedVideoId(videosData.videos[0].id);
          }
        }
        setLoading(false);
      })
      .catch(err => { console.error('Failed to fetch data:', err); setLoading(false); });
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
    {
      id: 6,
      name: 'Freelance',
      title: 'Upwork + Fiverr + LinkedIn',
      stats: '3 Platforms',
      subtitle: `Upwork bidding · 4 Fiverr gigs · LinkedIn outreach`,
      color: 'from-purple-500 to-purple-600',
      icon: '💼',
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
          onClick={() => { setLoading(true); fetch('/api/status.json?t=' + Date.now()).then(r => r.json()).then(d => { setLiveData(d); setLoading(false); }).catch(err => { console.error('Failed to refresh:', err); setLoading(false); }); }}
          className="p-2 rounded-lg bg-cyan/10 border border-cyan/30"
        >
          <RefreshCw size={16} className={`text-cyan ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Video Hero Section */}
      {videoData && videoData.videos && videoData.videos.length > 0 && (
        <div className="mb-6">
          {/* Featured Video */}
          <div className="mb-4 rounded-lg overflow-hidden border border-cyan/20">
            {(() => {
              const featured = videoData.videos.find(v => v.id === selectedVideoId) || videoData.videos[0];
              return (
                <div>
                  <div className="bg-black/40 aspect-video flex items-center justify-center relative">
                    <video
                      src={featured.url}
                      controls
                      className="w-full h-full object-cover"
                      poster="/poster.png"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-lg font-bold text-white">{featured.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{featured.description}</p>
                      <p className="text-xs text-gray-400 mt-2">📅 {featured.day}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Video Thumbnail Grid */}
          <div>
            <h2 className="text-lg font-bold mb-3">Video Content</h2>
            <div className="grid grid-cols-3 gap-3">
              {videoData.videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideoId(video.id)}
                  className={`rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedVideoId === video.id
                      ? 'border-cyan bg-cyan/10'
                      : 'border-gray-600 hover:border-cyan/50'
                  }`}
                >
                  <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                    <video
                      src={video.url}
                      className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                      muted
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white truncate">{video.title}</p>
                        <p className="text-[10px] text-gray-300">{video.day}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Agent Communications */}
      <div className="mb-8">
        <AgentCommsLog />
      </div>

      {/* Time Travel */}
      <div className="mb-8">
        <TimeTravelSlider />
      </div>

      {/* AI Optimization Recommendations */}
      <div className="mb-8">
        <SelfOptimization />
      </div>
    </div>
  );
}
