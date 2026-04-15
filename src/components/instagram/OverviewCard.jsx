import React from 'react';
import { Users, Film, TrendingUp, CheckCircle, Zap } from 'lucide-react';

export default function OverviewCard({ data, phase1Count, phase2Count }) {
  const totalPosts = phase1Count + phase2Count;
  const connected = data?.connected;
  const currentFollowers = data?.account?.followers || 0;

  const stats = [
    {
      icon: <Film size={24} />,
      label: 'Total Posts',
      value: totalPosts,
      subtext: `Phase 1: ${phase1Count} | Phase 2: ${phase2Count}`,
      color: 'cyan',
    },
    {
      icon: <Users size={24} />,
      label: 'Followers',
      value: connected ? currentFollowers.toLocaleString() : 'Not connected',
      subtext: connected ? `@${data.account.handle}` : 'Connect Instagram API',
      color: connected ? 'cyan' : 'gray',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Engagement Rate',
      value: connected ? `${data.account.engagement_rate}%` : '—',
      subtext: connected ? 'Current baseline' : 'Not connected',
      color: connected ? 'cyan' : 'gray',
    },
    {
      icon: <CheckCircle size={24} />,
      label: 'API Status',
      value: connected ? 'Connected' : 'Not Connected',
      subtext: connected ? 'Instagram API active' : 'Benjamin manages manually',
      color: connected ? 'green' : 'gray',
    },
    {
      icon: <Zap size={24} />,
      label: 'Content Ready',
      value: `${phase1Count + phase2Count}`,
      subtext: 'Total posts planned',
      color: 'cyan',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-dark-card border border-cyan/20 rounded-lg p-4 hover:border-cyan/50 transition-colors"
        >
          <div className={`text-${stat.color} mb-3`}>{stat.icon}</div>
          <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
          <p className="text-white text-xl font-bold mb-2">{stat.value}</p>
          <p className="text-gray-500 text-xs">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
}
