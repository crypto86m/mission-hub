import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Lock, Database, Bell, WifiOff, Moon, Sun, ChevronDown, ChevronRight, Play, RefreshCw, RotateCcw } from 'lucide-react';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [cronExpanded, setCronExpanded] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null);
  const [restarting, setRestarting] = useState(false);

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployStatus(null);
    setTimeout(() => {
      setDeploying(false);
      setDeployStatus('success');
      setTimeout(() => setDeployStatus(null), 3000);
    }, 2000);
  };

  const handleGatewayRestart = async () => {
    setRestarting(true);
    setTimeout(() => {
      setRestarting(false);
    }, 2000);
  };

  const cronJobs = [
    { id: 1, name: 'Alpaca Trading Scan', schedule: 'Every 5 min', status: 'active', lastRun: '1 min ago', cronId: '4eca4694' },
    { id: 2, name: 'Bennett\'s Brief Publisher', schedule: '7:00 AM daily', status: 'active', lastRun: 'Today 7:00 AM', cronId: 'substack' },
    { id: 3, name: 'AI Support Outreach', schedule: '8:00 AM daily', status: 'active', lastRun: 'Today 8:00 AM', cronId: 'outreach' },
    { id: 4, name: 'NVCC Renewal', schedule: '8:00 AM daily', status: 'active', lastRun: 'Today 8:00 AM', cronId: 'nvcc' },
    { id: 5, name: 'Trading Review', schedule: '1:30 PM daily', status: 'active', lastRun: 'Today 1:30 PM', cronId: 'review' },
    { id: 6, name: 'RLM Bid Review', schedule: 'Monday 8:00 AM', status: 'active', lastRun: 'Mon Apr 14', cronId: 'rlm-bid' },
    { id: 7, name: 'NVCC CRM Report', schedule: 'Monday 8:30 AM', status: 'active', lastRun: 'Mon Apr 14', cronId: 'nvcc-crm' },
    { id: 8, name: 'Heartbeat Tier 1 (Cost Guard)', schedule: 'Every 5 min', status: 'active', lastRun: '1 min ago', cronId: '4eca4694-688a' },
    { id: 9, name: 'Heartbeat Tier 2 (Email+Calendar)', schedule: 'Every 30 min', status: 'active', lastRun: '12 min ago', cronId: '2d30c883' },
    { id: 10, name: 'Heartbeat Tier 3 (Heavy Ops)', schedule: 'Every 2 hours', status: 'active', lastRun: '45 min ago', cronId: 'da8528ba' },
  ];

  const integrations = [
    { name: 'Discord', status: 'connected', icon: '💬', lastSync: '1 min ago' },
    { name: 'Gmail (crypto86m)', status: 'connected', icon: '📧', lastSync: '5 min ago' },
    { name: 'Alpaca (Paper)', status: 'connected', icon: '📈', lastSync: '1 min ago' },
    { name: 'Alpaca (Live $500)', status: 'ready', icon: '💰', lastSync: 'Staged' },
    { name: 'Telegram Bot', status: 'connected', icon: '📱', lastSync: '2 min ago' },
    { name: 'Supabase Pro', status: 'connected', icon: '💾', lastSync: '3 min ago' },
    { name: 'ElevenLabs TTS', status: 'connected', icon: '🎙️', lastSync: 'On demand' },
    { name: 'Tavily Search', status: 'connected', icon: '🔍', lastSync: 'On demand' },
    { name: 'Togal.ai (RLM Takeoff)', status: 'connected', icon: '🏗️', lastSync: 'Today' },
    { name: 'Alpha Vantage', status: 'connected', icon: '📊', lastSync: 'On demand' },
    { name: 'OpenAI Whisper', status: 'connected', icon: '🤖', lastSync: 'On demand' },
  ];

  const getStatusColor = (status) => {
    if (status === 'active' || status === 'connected') return 'text-green-400';
    if (status === 'ready') return 'text-cyan';
    if (status === 'pending') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`w-full h-full overflow-y-auto pb-24 px-4 pt-6 ${darkMode ? '' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold glow-text">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">System configuration & integrations</p>
        </div>
        {/* Night Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            darkMode ? 'bg-gray-800 border-gray-600 text-yellow-400' : 'bg-yellow-100 border-yellow-400 text-gray-800'
          }`}
        >
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          <span className="text-sm">{darkMode ? 'Night Mode' : 'Day Mode'}</span>
        </button>
      </div>

      {/* Quick Deploy Button */}
      <div className="mb-6 glass-card border-cyan/40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap size={18} className="text-cyan" />
              Quick Deploy
            </h2>
            <p className="text-xs text-gray-400 mt-1">Push latest changes to Vercel production</p>
          </div>
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              deploying
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : deployStatus === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-cyan text-dark-bg hover:bg-cyan/80'
            }`}
          >
            {deploying ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            {deploying ? 'Deploying...' : deployStatus === 'success' ? '✅ Deployed!' : 'Deploy Now'}
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Target: <span className="text-cyan">https://mission-hub-iota.vercel.app</span>
        </div>
      </div>

      {/* Gateway Reset */}
      <div className="mb-6 glass-card border-orange-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <RotateCcw size={18} className="text-orange-400" />
              Reset Gateway
            </h2>
            <p className="text-xs text-gray-400 mt-1">Restart OpenClaw gateway (port 18789) — use if disconnected</p>
          </div>
          <button
            onClick={handleGatewayRestart}
            disabled={restarting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              restarting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-500'
            }`}
          >
            {restarting ? <RefreshCw size={16} className="animate-spin" /> : <RotateCcw size={16} />}
            {restarting ? 'Restarting...' : 'Restart Gateway'}
          </button>
        </div>
      </div>

      {/* Cron Jobs — Expandable */}
      <div className="mb-6">
        <button
          onClick={() => setCronExpanded(!cronExpanded)}
          className="w-full flex items-center justify-between glass-card mb-0 hover:border-cyan/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-cyan" />
            <span className="text-lg font-bold">Cron Jobs</span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{cronJobs.length} active</span>
          </div>
          {cronExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {cronExpanded && (
          <div className="mt-2 space-y-2">
            {cronJobs.map(job => (
              <div key={job.id} className="glass-card flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">{job.name}</p>
                  <p className="text-xs text-gray-400">{job.schedule}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-semibold ${getStatusColor(job.status)}`}>{job.status}</p>
                  <p className="text-xs text-gray-500">{job.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget */}
      <div className="mb-6 glass-card">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          API Budget
        </h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Monthly ($200 limit)</span>
              <span className="text-white font-mono">$116.32 / $200</span>
            </div>
            <div className="bg-gray-800 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '58%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Today ($25 limit)</span>
              <span className="text-white font-mono">$1.53 / $25</span>
            </div>
            <div className="bg-gray-800 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '6%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Database size={18} className="text-cyan" />
          Integrations ({integrations.length})
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {integrations.map((i, idx) => (
            <div key={idx} className="glass-card py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{i.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{i.name}</p>
                  <p className={`text-[10px] ${getStatusColor(i.status)}`}>{i.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Lock size={18} className="text-cyan" />
          System Info
        </h2>
        <div className="space-y-2 text-sm">
          {[
            ['OpenClaw Version', '2026.4.14'],
            ['Default Model', 'claude-sonnet-4-6'],
            ['Gateway Port', '18789 (LAN)'],
            ['Workspace', '/Users/bennysbot/.openclaw/workspace'],
            ['Mac Mini', 'arm64 / Darwin 25.2.0'],
            ['Node', 'v24.14.1'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-400">{k}</span>
              <span className="font-mono text-xs text-white">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
