import React, { useState } from 'react';
import { AlertCircle, Zap, Lock, Database, Bell, WifiOff } from 'lucide-react';
import MasterConnect from '../components/MasterConnect';

export default function SettingsScreen() {
  const [budget, setBudget] = useState({
    monthly: 200,
    daily: 20,
    current: 67.38,
  });

  const [cronJobs] = useState([
    {
      id: 1,
      name: 'Morning Brief Generation',
      schedule: '7:00 AM daily',
      status: 'active',
      lastRun: '2 hours ago',
    },
    {
      id: 2,
      name: 'Trading Signal Scan',
      schedule: 'Every 15 min',
      status: 'active',
      lastRun: '1 min ago',
    },
    {
      id: 3,
      name: 'Bennett\'s Brief Publisher',
      schedule: '3:00 PM daily',
      status: 'active',
      lastRun: 'pending',
    },
    {
      id: 4,
      name: 'AI Cost Optimizer',
      schedule: 'Every 6 hours',
      status: 'active',
      lastRun: '3 hours ago',
    },
    {
      id: 5,
      name: 'Discord Status Sync',
      schedule: 'Every 30 min',
      status: 'active',
      lastRun: '5 min ago',
    },
    {
      id: 6,
      name: 'Weekly Performance Review',
      schedule: 'Friday 5:00 PM',
      status: 'active',
      lastRun: 'pending',
    },
  ]);

  const [integrations] = useState([
    {
      id: 1,
      name: 'Discord',
      status: 'connected',
      lastSync: '1 min ago',
      icon: '💬',
    },
    {
      id: 2,
      name: 'Gmail',
      status: 'connected',
      lastSync: '5 min ago',
      icon: '📧',
    },
    {
      id: 3,
      name: 'Google Calendar',
      status: 'connected',
      lastSync: '2 min ago',
      icon: '📅',
    },
    {
      id: 4,
      name: 'ThinkorSwim (Trading)',
      status: 'connected',
      lastSync: '1 min ago',
      icon: '📈',
    },
    {
      id: 5,
      name: 'GitHub',
      status: 'connected',
      lastSync: '15 min ago',
      icon: '🔧',
    },
    {
      id: 6,
      name: 'Perplexity API',
      status: 'connected',
      lastSync: '3 min ago',
      icon: '🔍',
    },
    {
      id: 7,
      name: 'Superhuman',
      status: 'connected',
      lastSync: '10 min ago',
      icon: '⚡',
    },
    {
      id: 8,
      name: 'Supabase',
      status: 'connected',
      lastSync: '2 min ago',
      icon: '💾',
    },
    {
      id: 9,
      name: 'OpenAI API',
      status: 'connected',
      lastSync: '1 min ago',
      icon: '🤖',
    },
  ]);

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

        <div className="space-y-3">
          {cronJobs.map((job) => (
            <div key={job.id} className="glass-card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{job.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded border ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{job.schedule}</span>
                <span>
                  {job.lastRun === 'pending'
                    ? '⏳ Pending'
                    : `✓ ${job.lastRun}`}
                </span>
              </div>
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
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
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
          <p className="text-xs text-gray-400 mb-3">Deploy the latest Mission Control changes to production with one tap.</p>
          <button
            onClick={() => {
              alert('Deploying to Vercel... Check https://mission-control-app-chi-green.vercel.app for updates.');
            }}
            className="w-full py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan to-blue-600 text-dark-bg hover:opacity-90 transition-opacity"
          >
            🚀 Deploy to Production
          </button>
          <p className="text-[10px] text-gray-500 mt-2 text-center">Last deploy: Today 8:57 AM PT • Vercel</p>
        </div>

        <div className="space-y-2 glass-card">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">OpenClaw Version</span>
            <span className="font-semibold">2026.4.5</span>
          </div>
          <div className="border-t border-cyan/10 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">API Endpoints</span>
            <span className="font-semibold">9/9 Active</span>
          </div>
          <div className="border-t border-cyan/10 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Database</span>
            <span className="font-semibold">Supabase (Connected)</span>
          </div>
          <div className="border-t border-cyan/10 my-2"></div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Last Backup</span>
            <span className="font-semibold">Today 6:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
