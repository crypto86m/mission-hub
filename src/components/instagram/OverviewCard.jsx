import React from 'react';
import { Users, Film, TrendingUp, CheckCircle, Zap } from 'lucide-react';

export default function OverviewCard({ data, phase1Count, phase2Count }) {
  const totalPosts = phase1Count + phase2Count;
  const currentFollowers = data.account.followers;
  const phase1Growth = { min: 150, max: 200 };
  const phase2Growth = { min: 500, max: 1000 };
  const projectedFollowersMin = currentFollowers + phase1Growth.min + phase2Growth.min;
  const projectedFollowersMax = currentFollowers + phase1Growth.max + phase2Growth.max;

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
      label: 'Current Followers',
      value: currentFollowers.toLocaleString(),
      subtext: `@${data.account.handle}`,
      color: 'cyan',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Engagement Rate',
      value: `${data.account.engagement_rate}%`,
      subtext: 'Current baseline',
      color: 'cyan',
    },
    {
      icon: <CheckCircle size={24} />,
      label: 'Status',
      value: 'Ready to Launch',
      subtext: 'All Phase 1 videos ready',
      color: 'green',
    },
    {
      icon: <Zap size={24} />,
      label: 'Projected Growth',
      value: `${projectedFollowersMin.toLocaleString()}–${projectedFollowersMax.toLocaleString()}`,
      subtext: '20-week forecast',
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
