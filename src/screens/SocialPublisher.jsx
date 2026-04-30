import React, { useState, useEffect } from 'react';
import { Share2, TrendingUp, Clock, AlertCircle, RefreshCw } from 'lucide-react';

function getMockData() {
  return {
    stats: { published: 8, success_rate: 100, pending_approvals: 0, scheduled: 0 },
    history: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), title: "Real-Time Dashboard Active", platforms: { substack: { status: "published" } } },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), title: "System Deployment Complete", platforms: { substack: { status: "published" } } },
      { timestamp: new Date(Date.now() - 10800000).toISOString(), title: "Bennett Social Publisher - LIVE", platforms: { substack: { status: "published" } } },
    ]
  };
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    cyan: 'bg-cyan/10 border-cyan text-cyan',
    green: 'bg-green-900/10 border-green-500 text-green-400',
    yellow: 'bg-yellow-900/10 border-yellow-500 text-yellow-400',
    blue: 'bg-blue-900/10 border-blue-500 text-blue-400'
  };
  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-75">{label}</p>
    </div>
  );
}

function PlatformStatus({ name, status, reason }) {
  const cfg = {
    ready: { bg: 'bg-green-900/20', border: 'border-green-500', text: 'text-green-400', icon: '✓', label: 'Ready' },
    blocked: { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-400', icon: '✗', label: 'Blocked' },
    pending: { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: '⏳', label: 'Pending' }
  }[status] || { bg: 'bg-gray-900/20', border: 'border-gray-500', text: 'text-gray-400', icon: '?', label: status };
  return (
    <div className={`rounded-lg border ${cfg.bg} ${cfg.border} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{name}</p>
        <span className={`text-lg ${cfg.text}`}>{cfg.icon}</span>
      </div>
      <p className={`text-sm ${cfg.text}`}>{cfg.label}</p>
      {reason && <p className="text-xs opacity-60 mt-1">{reason}</p>}
    </div>
  );
}

export default function SocialPublisher() {
  const [stats, setStats] = useState(getMockData().stats);
  const [history, setHistory] = useState(getMockData().history);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/social/stats.json').then(r => r.json()).catch(() => null),
      fetch('/api/social/history.json').then(r => r.json()).catch(() => null),
    ]).then(([statsData, historyData]) => {
      if (statsData) setStats(statsData);
      if (historyData) setHistory(historyData.slice(0, 10).reverse());
      if (!statsData && !historyData) setError('Using demo data — /api/social/ endpoints not found');
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Share2 size={28} className="text-cyan" />
            Social Publisher
          </h1>
          <p className="text-gray-400 mt-1">Real-time publication tracking & management</p>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-dark-card rounded transition-colors">
          <RefreshCw size={20} className={`text-cyan ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 flex gap-3 mb-6">
          <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={<Share2 size={20} />} label="Published" value={stats.published} color="cyan" />
        <StatCard icon={<TrendingUp size={20} />} label="Success Rate" value={`${stats.success_rate}%`} color="green" />
        <StatCard icon={<AlertCircle size={20} />} label="Pending Approvals" value={stats.pending_approvals} color="yellow" />
        <StatCard icon={<Clock size={20} />} label="Scheduled Posts" value={stats.scheduled} color="blue" />
      </div>

      <div className="glass-card mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Share2 size={18} className="text-cyan" />
          Recent Publications
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">No publications yet</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {history.map((pub, idx) => {
              const hasSuccess = Object.values(pub.platforms || {}).some(p => p.status === 'published');
              const platforms = Object.keys(pub.platforms || {});
              return (
                <div key={idx} className="flex items-start justify-between gap-4 pb-3 border-b border-gray-700/30 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{pub.title}</p>
                    <p className="text-sm text-gray-400">{new Date(pub.timestamp).toLocaleString()}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {platforms.map(p => (
                        <span key={p} className="text-xs px-2 py-0.5 rounded bg-dark-bg text-gray-300">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {hasSuccess ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-medium">✓ Published</span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-medium">✗ Failed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <PlatformStatus name="Substack" status="ready" />
        <PlatformStatus name="LinkedIn" status="blocked" reason="403 - Scope fix needed" />
        <PlatformStatus name="Twitter" status="pending" reason="Account reactivated" />
      </div>

      <div className="glass-card">
        <h2 className="text-lg font-bold text-white mb-4">Quick Reference</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <div>
            <p className="text-gray-300 font-medium mb-1">📋 Schedule Posts</p>
            <code className="bg-dark-bg px-2 py-1 rounded text-cyan text-xs">bash /schedule-calendar.sh</code>
          </div>
          <div>
            <p className="text-gray-300 font-medium mb-1">🔧 Fix LinkedIn (15 min)</p>
            <code className="bg-dark-bg px-2 py-1 rounded text-cyan text-xs">Follow /FIX-LINKEDIN-NOW.md</code>
          </div>
        </div>
      </div>
    </div>
  );
}
