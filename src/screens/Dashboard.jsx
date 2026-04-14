import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Activity, Users, Zap, Wifi, WifiOff, Clock, RefreshCw, CheckSquare } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { supabase } from '../lib/supabase';
import { useTradingPnl } from '../hooks/useTradingPnl';
import { useCostTracking } from '../hooks/useCostTracking';
import { useAgentStatus } from '../hooks/useAgentStatus';
import { useApprovals } from '../hooks/useApprovals';
import NotificationSystem from '../components/NotificationSystem';
import AgentCommsLog from '../components/AgentCommsLog';
import TimeTravelSlider from '../components/TimeTravelSlider';
import SelfOptimization from '../components/SelfOptimization';
import OrbitalRing from '../components/OrbitalRing';
import ActivityFeed from '../components/ActivityFeed';
import MasterConnect from '../components/MasterConnect';
import SystemHealthWidget from '../components/SystemHealthWidget';

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
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Done', value: summary.completed, color: 'text-green-400' },
          { label: 'Active', value: summary.inProgress, color: 'text-blue-400' },
          { label: 'Approval', value: summary.awaitingApproval, color: 'text-yellow-400' },
          { label: 'Blocked', value: summary.blocked + summary.delayed, color: 'text-red-400' },
        ].map((c, i) => (
          <div key={i} className="glass-card text-center py-2">
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
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
  const [approvals, setApprovals] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveData = useCallback(async () => {
    try {
      const r = await fetch('/api/status.json?t=' + Date.now());
      const d = await r.json();
      setLiveData(d);
    } catch { setLiveData(null); }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchLiveData(),
      fetchApprovals(),
    ]);
    setTimeout(() => setRefreshing(false), 600);
  }, [fetchLiveData]);

  const fetchApprovals = useCallback(async () => {
    // Fetch pending
    const { data: pending, error: e1 } = await supabase
      .from('approvals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (!e1 && pending) setApprovals(pending);

    // Fetch recently decided (approved/denied) — last 20
    const { data: decided, error: e2 } = await supabase
      .from('approvals')
      .select('*')
      .neq('status', 'pending')
      .order('decided_at', { ascending: false })
      .limit(20);
    if (!e2 && decided) setRecentActions(decided);

    setApprovalsLoading(false);
  }, []);

  useEffect(() => {
    fetchApprovals();
    const channel = supabase
      .channel('approvals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'approvals' }, () => fetchApprovals())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchApprovals]);

  // Fetch live data from status.json
  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  const handleApproval = async (id, newStatus) => {
    const { error } = await supabase
      .from('approvals')
      .update({ status: newStatus, decided_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setApprovals(prev => prev.filter(a => a.id !== id));
    }
  };

  const d = liveData || {};
  const t = d.trading || {};
  const c = d.costs || {};
  const nl = d.newsletter || {};
  const co = d.companies || {};
  const rlm = co.rlm || {};
  const nvcc = co.nvcc || {};
  const em = d.email || {};
  const ag = d.agents || {};
  const ig = d.instagram || {};
  const tw = d.twitter || {};

  const companies = [
    {
      id: 1,
      name: 'RLM',
      title: 'Commercial Painting',
      stats: `$${(rlm.revenue / 1000000).toFixed(1)}M`,
      subtitle: `${rlm.activeProjects || 0} active projects · ${rlm.margin || 0}% margin`,
      color: 'from-blue-500 to-blue-600',
      icon: '🏢',
      logo: '/logos/rlm-logo.jpg',
    },
    {
      id: 2,
      name: 'NVCC',
      title: 'Exotic Cars',
      stats: `$${(nvcc.ytdRevenue / 1000).toFixed(0)}K`,
      subtitle: `${nvcc.members || 0} members · $${(nvcc.fleetValue / 1000000).toFixed(1)}M fleet · ${nvcc.rating}★`,
      color: 'from-green-500 to-green-600',
      icon: '🏎️',
      logo: '/logos/nvcc-logo.jpg',
    },
    {
      id: 3,
      name: 'Trading',
      title: t.phase || 'Paper Trading',
      stats: `${t.strategiesLoaded || 0} Strategies`,
      subtitle: `Account: $${(t.accountValue || 0).toLocaleString()} · ${t.openPositions || 0} positions`,
      color: t.unrealizedPnl >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
      icon: '📈',
    },
    {
      id: 4,
      name: 'Brief',
      title: "Bennett's Brief",
      stats: `${nl.subscribers || 0}`,
      subtitle: `${nl.openRate || 0}% open rate · ${nl.issuesPublished || 0} issues published`,
      color: 'from-orange-500 to-orange-600',
      icon: '📰',
    },
    {
      id: 5,
      name: 'AI Support',
      title: 'AI Support Platform',
      stats: 'Live',
      subtitle: 'ai-support-self.vercel.app',
      color: 'from-cyan-500 to-cyan-600',
      icon: '🤖',
    },
  ];

  const activityFeed = [
    { id: 1, action: 'Email Responder', details: `${em.totalReplies || 0} total replies · ${em.unread || 0} unread`, time: 'Running', status: em.unread > 0 ? 'active' : 'done' },
    { id: 2, action: 'Trading', details: `${t.todayTrades || 0} trades today · P&L: $${(t.todayPnl || 0).toFixed(2)}`, time: 'Live', status: 'active' },
    { id: 3, action: 'Instagram', details: `${ig.followers || 0} followers · ${ig.engagementRate || 0}% ER`, time: '30d stats', status: 'active' },
    { id: 4, action: 'Twitter', details: tw.status === 'blocked' ? `Blocked: ${tw.error}` : `${tw.queued || 0} queued`, time: tw.lastPosted || '', status: tw.status === 'blocked' ? 'pending' : 'done' },
    { id: 5, action: 'Cron Jobs', details: `${ag.cronHealthy || 0}/${ag.cronJobs || 0} healthy`, time: 'Auto', status: ag.cronErrors > 0 ? 'pending' : 'done' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-4">
      {/* Master Connection Status — TOP */}
      <div className="mb-3">
        <MasterConnect />
      </div>

      {/* Header + Refresh */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold glow-text mb-1">Mission Control</h1>
          {liveData && (() => {
            const gen = new Date(liveData.generated || 0);
            const age = (Date.now() - gen.getTime()) / 60000;
            const isLive = age < 60;
            const isStale = age >= 60 && age < 240;
            return (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : isStale ? 'bg-yellow-400' : 'bg-red-400'}`} />
                <span className={`text-xs ${isLive ? 'text-green-400' : isStale ? 'text-yellow-400' : 'text-red-400'}`}>
                  {isLive ? 'Live' : isStale ? 'Stale' : 'Offline'} — {age < 60 ? `${Math.round(age)}m ago` : `${Math.round(age/60)}h ago`}
                </span>
              </div>
            );
          })()}
          {!liveData && <p className="text-gray-400 text-xs">Loading...</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              refreshing
                ? 'bg-cyan/20 text-cyan border-cyan/40'
                : 'bg-dark-card/50 text-gray-300 border-gray-600/30 hover:text-cyan hover:border-cyan/40 hover:bg-cyan/10'
            }`}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-cyan' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <NotificationSystem />
        </div>
      </div>

      {/* Morning Briefing */}
      {liveData && (
        <div className="mb-6 glass-card border-cyan/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-cyan" />
            <span className="text-xs font-semibold text-cyan">Today's Briefing</span>
          </div>
          <p className="text-sm text-gray-300">
            Trading: {t.openPositions || 0} positions, ${(t.unrealizedPnl || 0) >= 0 ? '+' : ''}{(t.unrealizedPnl || 0).toLocaleString(undefined, {maximumFractionDigits: 0})} unrealized · 
            Email: {em.totalReplies || 0} processed · 
            Cost: ${(c.today || 0).toFixed(2)} today · 
            Crons: {ag.cronHealthy || 0}/{ag.cronJobs || 0} healthy · 
            IG: {ig.followers || 0} followers
          </p>
        </div>
      )}

      {/* Task Intelligence Summary — from shared store */}
      <TaskSummaryWidget />

      {/* Pending Approvals — Quick Access */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Pending Approvals</h2>
          <span className="text-xs font-mono text-cyan">{approvals.length} AWAITING</span>
        </div>
        <div className="space-y-2">
          {approvalsLoading ? (
            <p className="text-xs text-gray-500">Loading approvals...</p>
          ) : approvals.length === 0 ? (
            <p className="text-xs text-gray-500">No pending approvals ✅</p>
          ) : approvals.map(item => (
            <div key={item.id} className="glass-card flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{item.description}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono border text-cyan border-cyan/30 bg-cyan/10">{item.agent_type}</span>
                </div>
                <p className="text-[10px] text-gray-400">{item.agent_type} • {item.status}</p>
                {item.description && <p className="text-[10px] text-gray-500 mt-0.5 truncate">{item.description}</p>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => handleApproval(item.id, 'approved')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors cursor-pointer">✓</button>
                <button onClick={() => handleApproval(item.id, 'denied')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors cursor-pointer">✗</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Execution Log */}
      {recentActions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Recent Decisions</h2>
            <span className="text-xs font-mono text-gray-400">{recentActions.length} ACTIONS</span>
          </div>
          <div className="space-y-1.5">
            {recentActions.slice(0, 5).map(item => {
              const isApproved = item.status === 'approved';
              const isDenied = item.status === 'denied';
              const execStatus = item.icon_type;
              const execLog = item.color || '';
              return (
                <div key={item.id} className="glass-card flex items-center gap-3 opacity-80">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    execStatus === 'executed' ? 'bg-green-400' :
                    execStatus === 'manual_required' ? 'bg-yellow-400' :
                    execStatus === 'failed' ? 'bg-red-400' :
                    isDenied ? 'bg-red-400' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-300 truncate">{item.description}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${
                        isApproved ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                        'text-red-400 border-red-400/30 bg-red-400/10'
                      }`}>{isApproved ? 'APPROVED' : 'DENIED'}</span>
                      {execStatus && execStatus !== 'denied_logged' && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${
                          execStatus === 'executed' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                          execStatus === 'manual_required' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                          'text-red-400 border-red-400/30 bg-red-400/10'
                        }`}>{execStatus === 'executed' ? '✅ EXECUTED' : execStatus === 'manual_required' ? '⚠️ MANUAL' : '❌ FAILED'}</span>
                      )}
                    </div>
                    {execLog && <p className="text-[10px] text-gray-500 mt-0.5 truncate">{execLog}</p>}
                    <p className="text-[10px] text-gray-500">{item.agent_type} • {item.decided_at ? new Date(item.decided_at).toLocaleString() : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-Time P&L Widget */}
      <div className="mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Today's P&L</h2>
            <span className={`text-xs font-mono ${t.openPositions > 0 ? 'text-green-400' : 'text-gray-400'}`}>{t.openPositions > 0 ? 'POSITIONS OPEN' : 'NO TRADES TODAY'}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className={`text-2xl font-bold ${(t.unrealizedPnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{(t.unrealizedPnl || 0) >= 0 ? '+' : ''}${(t.unrealizedPnl || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              <p className="text-[10px] text-gray-400">Unrealized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">${(t.accountValue || 0).toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">Account Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan">{t.openPositions || 0}</p>
              <p className="text-[10px] text-gray-400">Open Positions</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-800 rounded-full h-2">
              <div className={`h-2 rounded-full ${Math.abs(t.todayPnl || 0) > (t.dailyLimit || 120) ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(Math.abs(t.todayPnl || 0) / (t.dailyLimit || 120) * 100, 100)}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">${Math.abs(t.todayPnl || 0).toFixed(2)} / ${t.dailyLimit || 120} daily limit</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">System Status</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Trading', status: t.openPositions > 0 ? 'active' : 'idle', label: `${t.strategiesLoaded || 0} strats` },
            { name: 'Email', status: 'ok', label: `${em.totalReplies || 0} replies` },
            { name: 'Brief', status: 'ok', label: `${nl.subscribers || 0} subs` },
            { name: 'Instagram', status: 'ok', label: `${ig.followers || 0} follows` },
            { name: 'Twitter', status: tw.status === 'blocked' ? 'error' : 'ok', label: tw.status === 'blocked' ? 'AUTH ERR' : `${tw.queued} queued` },
            { name: 'Crons', status: ag.cronErrors > 0 ? 'warn' : 'ok', label: `${ag.cronHealthy || 0}/${ag.cronJobs || 0}` },
            { name: 'AI Support', status: 'ok', label: 'Live' },
            { name: 'Booking', status: 'ok', label: 'Port 4344' },
            { name: 'Costs', status: (c.today || 0) > 15 ? 'warn' : 'ok', label: `$${(c.today || 0).toFixed(2)}/day` },
          ].map((a, i) => (
            <div key={i} className="glass-card text-center py-2">
              <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${a.status === 'ok' ? 'bg-green-400' : a.status === 'active' ? 'bg-blue-400 animate-pulse' : a.status === 'warn' ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <p className="text-[9px] text-gray-400">{a.name}</p>
              <p className="text-[10px] font-mono text-gray-300">{a.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Monitor */}
      <div className="mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Cost Monitor</h2>
            <span className={`text-xs font-mono ${(c.today || 0) > 15 ? 'text-yellow-400' : 'text-green-400'}`}>{(c.today || 0) > 15 ? '⚠️ WATCH' : '✅ ON BUDGET'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400">Today</p>
              <p className="text-xl font-bold text-white">${(c.today || 0).toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">{((c.today || 0) / (c.dailyLimit || 20) * 100).toFixed(0)}% of ${c.dailyLimit || 20} limit</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Month Total</p>
              <p className={`text-xl font-bold ${(c.monthTotal || 0) > 150 ? 'text-yellow-400' : 'text-white'}`}>${(c.monthTotal || 0).toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">of ${c.monthlyBudget || 200} budget</p>
            </div>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2">
            <div className={`h-2 rounded-full ${(c.monthTotal || 0) / (c.monthlyBudget || 200) > 0.75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min((c.monthTotal || 0) / (c.monthlyBudget || 200) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Master Connect moved to top */}

      {/* System Health Widget */}
      <div className="mb-8">
        <SystemHealthWidget />
      </div>

      {/* Orbital Ring - Companies */}
      {/* Status Section - LEGACY */}
      {/* <div className="mb-8 glass-card"> ... (commented out) </div> */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
        <OrbitalRing companies={companies} selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />
      </div>

      {/* Company Details */}
      {selectedCompany && (
        <div className="mb-8 glass-card animate-float">
          <h3 className="text-lg font-semibold mb-4 text-cyan">{selectedCompany.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Revenue/Metric</p>
              <p className="text-2xl font-bold">{selectedCompany.stats}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{selectedCompany.subtitle}</p>
              <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                <TrendingUp size={16} />
                <span>+12.5% YoY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card text-center">
            <Activity className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">{ag.cronJobs || 0}</p>
            <p className="text-xs text-gray-400">Cron Jobs</p>
          </div>
          <div className="glass-card text-center">
            <Zap className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">${(c.today || 0).toFixed(2)}</p>
            <p className="text-xs text-gray-400">Today's Cost</p>
          </div>
          <div className="glass-card text-center">
            <TrendingUp className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">{nl.subscribers || 0}</p>
            <p className="text-xs text-gray-400">Brief Subscribers</p>
          </div>
          <div className="glass-card text-center">
            <Users className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">{ig.followers || 0}</p>
            <p className="text-xs text-gray-400">IG Followers</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Live Activity</h2>
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
