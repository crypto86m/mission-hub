import React, { useState } from 'react';
import { TrendingUp, Activity, Users, Zap } from 'lucide-react';
import OrbitalRing from '../components/OrbitalRing';
import ActivityFeed from '../components/ActivityFeed';
<<<<<<< HEAD
import MasterConnect from '../components/MasterConnect';
=======
import SystemHealthWidget from '../components/SystemHealthWidget';
>>>>>>> 6d6f03c (Integrate Workflow Intelligence as 6th tab + Add Agents tab + Add SystemHealthWidget to Dashboard)

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companies = [
    {
      id: 1,
      name: 'RLM',
      title: 'Commercial Painting',
      stats: '$2.4M',
      subtitle: 'Monthly Revenue',
      color: 'from-blue-500 to-blue-600',
      icon: '🏢',
    },
    {
      id: 2,
      name: 'NVCC',
      title: 'Exotic Cars',
      stats: '$340K',
      subtitle: 'Monthly Revenue',
      color: 'from-purple-500 to-purple-600',
      icon: '🏎️',
    },
    {
      id: 3,
      name: 'Trading',
      title: 'Active Trading',
      stats: '+$12.3K',
      subtitle: 'Monthly P&L',
      color: 'from-green-500 to-green-600',
      icon: '📈',
    },
    {
      id: 4,
      name: 'Brief',
      title: 'Bennett\'s Brief',
      stats: '8.2K',
      subtitle: 'Subscribers',
      color: 'from-orange-500 to-orange-600',
      icon: '📰',
    },
    {
      id: 5,
      name: 'AI Support',
      title: 'AI Support',
      stats: '94%',
      subtitle: 'Uptime',
      color: 'from-cyan-500 to-cyan-600',
      icon: '🤖',
    },
  ];

  const activityFeed = [
    { id: 1, action: 'Trading Signal', details: 'QQQ: Opening Range Breakout', time: '2 min ago', status: 'active' },
    { id: 2, action: 'Task Completed', details: 'RLM: Painter assignment for Marriott', time: '15 min ago', status: 'done' },
    { id: 3, action: 'System Alert', details: 'Trading bot: 5% daily gain target reached', time: '1 hour ago', status: 'active' },
    { id: 4, action: 'New Lead', details: 'AI Support: Enterprise prospect inquiry', time: '2 hours ago', status: 'active' },
    { id: 5, action: 'Schedule Update', details: 'Brief: Scheduled publish for tomorrow 7am', time: '3 hours ago', status: 'pending' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold glow-text mb-2">Mission Control</h1>
        <p className="text-gray-400">Command center for Benjamin's empire</p>
      </div>

<<<<<<< HEAD
      {/* Master Connect - NEW */}
      <div className="mb-8">
        <MasterConnect />
=======
      {/* System Health Widget */}
      <div className="mb-8">
        <SystemHealthWidget />
      </div>

      {/* Status Section */}
      <div className="mb-8 glass-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl glow-text">🛰️</div>
          <div>
            <h2 className="text-lg font-semibold">System Status</h2>
            <div className="flex items-center gap-2">
              <div className="status-dot active"></div>
              <span className="text-sm text-green-400">All Systems Operational</span>
            </div>
          </div>
        </div>
>>>>>>> 6d6f03c (Integrate Workflow Intelligence as 6th tab + Add Agents tab + Add SystemHealthWidget to Dashboard)
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

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card text-center">
            <Activity className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-gray-400">Active Agents</p>
          </div>
          <div className="glass-card text-center">
            <Zap className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">$67.38</p>
            <p className="text-xs text-gray-400">Daily Cost</p>
          </div>
          <div className="glass-card text-center">
            <TrendingUp className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">+18.2%</p>
            <p className="text-xs text-gray-400">Week Growth</p>
          </div>
          <div className="glass-card text-center">
            <Users className="mx-auto mb-2 text-cyan" size={20} />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-gray-400">Team Members</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-xl font-bold mb-4">Live Activity</h2>
        <ActivityFeed activities={activityFeed} />
      </div>
    </div>
  );
}
