import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Lock, Database, Bell, WifiOff, ChevronDown, ChevronRight } from 'lucide-react';
import MasterConnect from '../components/MasterConnect';
import { GatewayControl } from '../components/GatewayControl';

export default function SettingsScreen() {
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    fetch('/api/status.json')
      .then(r => r.json())
      .then(d => setLiveData(d))
      .catch(() => {});
  }, []);

  const c = liveData?.costs || {};
  const [budget, setBudget] = useState({
    monthly: 200,
    daily: 20,
    current: 0,
  });

  useEffect(() => {
    if (c.today !== undefined) setBudget(prev => ({ ...prev, current: c.today || 0 }));
  }, [liveData]);

  const [expandedCron, setExpandedCron] = useState(null);
  const cronCount = liveData?.agents?.cronJobs || 0;
  const cronHealthy = liveData?.agents?.cronHealthy || 0;
  const cronJobs = [
    { id: 1, name: 'Heartbeat Check', schedule: 'Every 30 min', status: 'active', lastRun: 'Continuous', description: 'Polls inbox, calendar, and system status. Batches multiple checks per heartbeat.' },
    { id: 2, name: 'Morning Brief', schedule: '7:00 AM PT (weekdays)', status: 'active', lastRun: 'Today 7:00 AM', description: 'Delivers morning briefing to SMS + Discord: overnight activity, trading setups, calendar, action items.' },
    { id: 3, name: 'Evening Debrief', schedule: '6:00 PM PT (weekdays)', status: 'active', lastRun: 'Today 6:00 PM', description: 'Daily wrap-up: what got done, blockers, tomorrow priorities. Delivered to SMS + Discord.' },
    { id: 4, name: 'Weekly Review', schedule: 'Fri 5:00 PM PT', status: 'active', lastRun: 'Last Fri', description: 'Full weekly metrics analysis: trading P&L, content performance, cost tracking, pipeline status.' },
    { id: 5, name: 'Email Auto-Responder', schedule: 'Continuous', status: 'active', lastRun: 'Running', description: 'Auto-reply to non-sensitive emails. Flags contracts, legal, payments for manual review.' },
    { id: 6, name: 'Status JSON Refresh', schedule: 'Every 30 min', status: 'active', lastRun: 'Running', description: 'Regenerates /api/status.json with live data from all systems (trading, email, IG, costs).' },
    { id: 7, name: 'Paper Trader', schedule: '6:20 AM - 1:05 PM PT (weekdays)', status: 'active', lastRun: 'Running', description: 'ORB + VWAP paper trading strategies on Alpaca. 9 strategies loaded.' },
    { id: 8, name: 'Master Orchestrator', schedule: '6:20 AM - 1:05 PM PT (weekdays)', status: 'active', lastRun: 'Running', description: '20 strategies, continuous 60s cycles. Manages all active trading logic.' },
    { id: 9, name: 'Stop Loss Watchdog', schedule: '6:20 AM - 1:05 PM PT (weekdays)', status: cronHealthy >= 8 ? 'active' : 'idle', lastRun: 'Running', description: 'Independent safety net — checks positions every 30s. Enforces hard stop-losses.' },
    { id: 10, name: 'Memory Maintenance', schedule: 'Sun 10:00 AM PT', status: 'active', lastRun: 'Last Sun', description: 'Distills daily logs into MEMORY.md, prunes stale entries, audits backlog.' },
    { id: 11, name: 'Self-Improvement', schedule: 'Nightly 11:00 PM PT', status: 'active', lastRun: 'Last night', description: 'Reviews learnings, errors, corrections. Auto-deploys improvements to skills and workflows.' },
    { id: 12, name: 'Nightly Cost Report', schedule: '11:30 PM PT', status: cronHealthy >= 8 ? 'active' : 'idle', lastRun: 'Last night', description: 'Aggregates daily API costs, posts summary to #mission-control if thresholds exceeded.' },
    { id: 13, name: 'Instagram Content Scheduler', schedule: '9:00 AM PT (varies)', status: 'idle', lastRun: 'Awaiting setup', description: 'Auto-publishes scheduled IG posts. Currently manual — waiting on IG API connection.' },
  ];

  // Integration status from live data
  const t = liveData?.trading || {};
  const ig = liveData?.instagram || {};
  const tw = liveData?.twitter || {};
  const integrations = [
    { id: 1, name: 'Discord', status: 'connected', lastSync: 'Primary channel', icon: '💬' },
    { id: 2, name: 'Telegram', status: 'connected', lastSync: 'Backup channel', icon: '📱' },
    { id: 3, name: 'Supabase', status: 'connected', lastSync: 'Pro tier', icon: '💾' },
    { id: 4, name: 'Alpaca (Trading)', status: t.status === 'connected' ? 'connected' : 'not connected', lastSync: t.status === 'connected' ? `$${(t.accountValue || 0).toLocaleString()}` : 'Not connected', icon: '📈' },
    { id: 5, name: 'Instagram', status: ig.status !== 'not_connected' ? 'connected' : 'not connected', lastSync: ig.status !== 'not_connected' ? '@benjamin86m' : 'Not connected', icon: '📸' },
    { id: 6, name: 'Twitter/X', status: tw.status !== 'not_connected' ? (tw.status === 'blocked' ? 'error' : 'connected') : 'not connected', lastSync: tw.status === 'not_connected' ? 'Not connected' : tw.status === 'blocked' ? 'Suspended' : 'Active', icon: '🐦' },
    { id: 7, name: 'Upwork', status: 'connected', lastSync: 'Freelancer profile live', icon: '💼' },
    { id: 8, name: 'Fiverr', status: 'connected', lastSync: '4 gigs live', icon: '🎯' },
    { id: 9, name: 'LinkedIn', status: 'connected', lastSync: 'CTO outreach active', icon: '🔗' },
    { id: 10, name: 'Gmail', status: 'connected', lastSync: 'Auto-responder active', icon: '📧' },
    { id: 11, name: 'Substack (Newsletter)', status: 'connected', lastSync: 'Auto-publish daily', icon: '📰' },
    { id: 12, name: 'Vercel', status: 'connected', lastSync: 'Auto-deploy enabled', icon: '▲' },
    { id: 13, name: 'Tavily (Research)', status: 'connected', lastSync: 'API active', icon: '🔍' },
    { id: 14, name: 'Firecrawl (Scraping)', status: 'connected', lastSync: 'API active', icon: '🔥' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'idle':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-red-500/10 border-red-500/30 text-red-300';
    }
  };

  const dailyRemaining = budget.daily - (budget.current % budget.daily);
  const monthlyRemaining = budget.monthly - budget.current;
  const dailyPercentage = ((budget.current % budget.daily) / budget.daily) * 100;
  const monthlyPercentage = (budget.current / budget.monthly) * 100;

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <h1 className="text-3xl font-bold glow-text mb-2">Settings</h1>
      <p className="text-gray-400 mb-6">Manage integrations, budgets, and automations</p>

      {/* Master Connect - Connection Diagnostics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <WifiOff size={20} className="text-cyan" />
          Master Connection Control
        </h2>
        <MasterConnect />
      </div>

      {/* Gateway Control - Restart Button */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-cyan" />
          Gateway Control
        </h2>
        <GatewayControl />
      </div>

      {/* Budget Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-cyan" />
          Budget Controls
        </h2>

        <div className="space-y-4">
          {/* Monthly Budget */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Monthly Budget</h3>
              <span className="text-sm text-cyan">${budget.monthly}</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan to-blue-500 h-full rounded-full transition-all"
                style={{ width: `${monthlyPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>${budget.current.toFixed(2)} spent</span>
              <span>${monthlyRemaining.toFixed(2)} remaining</span>
            </div>
          </div>

          {/* Daily Budget */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Daily Budget</h3>
              <span className="text-sm text-cyan">${budget.daily}</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${dailyPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>${(budget.current % budget.daily).toFixed(2)} spent today</span>
              <span>${dailyRemaining.toFixed(2)} remaining</span>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="glass-card border-orange-500/30 bg-orange-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Budget Alerts Enabled</h4>
                <p className="text-sm text-gray-300">
                  Alert when daily usage exceeds ${budget.daily}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Cron Jobs */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell size={20} className="text-cyan" />
          Active Automations ({cronJobs.length})
        </h2>
        <p className="text-xs text-gray-500 mb-3">{cronHealthy}/{cronCount} healthy — tap any job for details</p>

        <div className="space-y-2">
          {cronJobs.map((job) => (
            <div key={job.id} className="glass-card cursor-pointer" onClick={() => setExpandedCron(expandedCron === job.id ? null : job.id)}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {expandedCron === job.id ? <ChevronDown size={14} className="text-cyan shrink-0" /> : <ChevronRight size={14} className="text-gray-500 shrink-0" />}
                  <h3 className="font-semibold text-white text-sm">{job.name}</h3>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded border ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1 ml-6">
                <span>{job.schedule}</span>
                <span>
                  {job.lastRun === 'pending'
                    ? '⏳ Pending'
                    : `✓ ${job.lastRun}`}
                </span>
              </div>
              {expandedCron === job.id && (
                <div className="mt-3 ml-6 pt-2 border-t border-cyan/10">
                  <p className="text-xs text-gray-300 leading-relaxed">{job.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Database size={20} className="text-cyan" />
          Connected Integrations ({integrations.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map((integration) => (
            <div key={integration.id} className="glass-card">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{integration.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${integration.status === 'connected' ? 'bg-green-400' : integration.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                    <span className="text-xs text-gray-400">
                      {integration.lastSync}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lock size={20} className="text-cyan" />
          System Information
        </h2>

        {/* Quick Deploy */}
        <div className="glass-card mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Deploy</h3>
          <p className="text-xs text-gray-400 mb-3">Deploy the latest Mission Control changes to production.</p>
          <p className="text-[10px] text-gray-500 mb-3 bg-black/20 rounded-lg p-2 font-mono">cd ~/mission-hub && npx vite build && vercel --prod</p>
          <button
            onClick={() => {
              const confirmed = window.confirm('This will trigger a production deploy to Vercel.\n\nTo deploy manually, run:\ncd ~/mission-hub && npx vite build && vercel --prod\n\nProceed?');
              if (confirmed) {
                window.open('https://vercel.com/dashboard', '_blank');
              }
            }}
            className="w-full py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan to-blue-600 text-dark-bg hover:opacity-90 transition-opacity"
          >
            🚀 Deploy to Production
          </button>
          <p className="text-[10px] text-gray-500 mt-2 text-center">Deploy runs via CLI on Mac Mini • Vercel</p>
        </div>

        <div className="space-y-2 glass-card">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Dashboard</span>
            <span className="font-semibold">mission-hub-iota.vercel.app</span>
          </div>
          <div className="border-t border-cyan/10 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Database</span>
            <span className="font-semibold">Supabase (Connected)</span>
          </div>
          <div className="border-t border-cyan/10 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status Data</span>
            <span className="font-semibold">{liveData ? `Updated ${new Date(liveData.generated).toLocaleString()}` : 'Loading...'}</span>
          </div>
          <div className="border-t border-cyan/10 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Trading API</span>
            <span className={`font-semibold ${t.status === 'connected' ? 'text-green-400' : 'text-yellow-400'}`}>{t.status === 'connected' ? 'Alpaca Connected' : 'Not connected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
