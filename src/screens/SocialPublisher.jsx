import React, { useState, useEffect } from 'react';
import { Share2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function SocialPublisher() {
  const [stats, setStats] = useState({
    published: 0,
    success_rate: 0,
    pending_approvals: 0,
    scheduled: 0
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8899';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [statsRes, historyRes] = await Promise.all([
          fetch(`${API_BASE}/api/stats`),
          fetch(`${API_BASE}/api/history`)
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.slice(0, 10).reverse());
        }

        setError(null);
      } catch (err) {
        setError('Dashboard service offline. Run: bash /COMPLETE-SETUP.sh');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-cyan border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-400">Loading social publisher...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Service Offline</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Share2 size={32} className="text-cyan" />
          Social Publisher
        </h1>
        <p className="text-gray-400 mt-1">Real-time publication tracking & management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<Share2 size={24} />}
          label="Published"
          value={stats.published}
          color="cyan"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Success Rate"
          value={`${stats.success_rate}%`}
          color="green"
        />
        <StatCard
          icon={<AlertCircle size={24} />}
          label="Pending Approvals"
          value={stats.pending_approvals}
          color="yellow"
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Scheduled Posts"
          value={stats.scheduled}
          color="blue"
        />
      </div>

      {/* Recent Publications */}
      <div className="bg-dark-card rounded-lg border border-cyan/20 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Share2 size={20} className="text-cyan" />
          Recent Publications
        </h2>
        
        {history.length === 0 ? (
          <p className="text-gray-400">No publications yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((pub, idx) => {
              const hasSuccess = Object.values(pub.platforms || {}).some(p => p.status === 'published');
              const platforms = Object.keys(pub.platforms || {});
              
              return (
                <div key={idx} className="flex items-start justify-between gap-4 pb-3 border-b border-gray-700/30 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-white font-medium">{pub.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(pub.timestamp).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {platforms.map(p => (
                        <span key={p} className="text-xs px-2 py-1 rounded bg-dark-bg text-gray-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    {hasSuccess ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-sm font-medium">
                        ✓ Published
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-sm font-medium">
                        ✗ Failed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-3 gap-4">
        <PlatformStatus name="Substack" status="ready" />
        <PlatformStatus name="LinkedIn" status="blocked" reason="403 - Scope fix needed" />
        <PlatformStatus name="Twitter" status="pending" reason="Account reactivated" />
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card rounded-lg border border-cyan/20 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>📱 Dashboard: <code className="text-cyan">https://bennett-social-pub.loca.lt</code></p>
          <p>📋 Schedule posts: <code className="text-cyan">bash /schedule-calendar.sh</code></p>
          <p>🔧 Fix LinkedIn: Follow <code className="text-cyan">/FIX-LINKEDIN-NOW.md</code></p>
        </div>
      </div>
    </div>
  );
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
      <div className="flex items-center justify-between mb-2">
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-75">{label}</p>
    </div>
  );
}

function PlatformStatus({ name, status, reason }) {
  const statusConfig = {
    ready: { bg: 'bg-green-900/20', border: 'border-green-500', text: 'text-green-400', icon: '✓' },
    blocked: { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-400', icon: '✗' },
    pending: { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: '⏳' }
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-lg border ${config.bg} ${config.border} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{name}</p>
        <span className={`text-lg ${config.text}`}>{config.icon}</span>
      </div>
      <p className={`text-sm ${config.text}`}>
        {status === 'ready' && 'Ready'}
        {status === 'blocked' && 'Blocked'}
        {status === 'pending' && 'Pending'}
      </p>
      {reason && <p className="text-xs opacity-60 mt-1">{reason}</p>}
    </div>
  );
}
