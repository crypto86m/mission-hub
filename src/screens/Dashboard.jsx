import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Activity, Users, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NotificationSystem from '../components/NotificationSystem';
import AgentCommsLog from '../components/AgentCommsLog';
import TimeTravelSlider from '../components/TimeTravelSlider';
import SelfOptimization from '../components/SelfOptimization';
import OrbitalRing from '../components/OrbitalRing';
import ActivityFeed from '../components/ActivityFeed';
import MasterConnect from '../components/MasterConnect';
import SystemHealthWidget from '../components/SystemHealthWidget';

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(true);

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

  const handleApproval = async (id, newStatus) => {
    const { error } = await supabase
      .from('approvals')
      .update({ status: newStatus, decided_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setApprovals(prev => prev.filter(a => a.id !== id));
    }
  };

  const companies = [
    {
      id: 1,
      name: 'RLM',
      title: 'Commercial Painting',
      stats: '$2.8M',
      subtitle: 'YTD Revenue',
      color: 'from-blue-500 to-blue-600',
      icon: '🏢',
      logo: '/logos/rlm-logo.jpg',
    },
    {
      id: 2,
      name: 'NVCC',
      title: 'Exotic Cars',
      stats: '$145K',
      subtitle: 'YTD Revenue',
      color: 'from-green-500 to-green-600',
      icon: '🏎️',
      logo: '/logos/nvcc-logo.jpg',
    },
    {
      id: 3,
      name: 'Trading',
      title: 'Strategy Backtest Complete',
      stats: '20 Strategies',
      subtitle: 'Top 3: Range (100%), Breakout (83%), Price Action (78%)',
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold glow-text mb-2">Mission Control</h1>
          <p className="text-gray-400">Command center for Benjamin's empire</p>
        </div>
        <NotificationSystem />
      </div>

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
                  <span className="text-sm font-medium text-white truncate">{item.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${
                    item.risk === 'HIGH' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                    item.risk === 'LOW' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                    'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  }`}>{item.risk}</span>
                </div>
                <p className="text-[10px] text-gray-400">{item.agent} • {item.value || ''}</p>
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
                      <span className="text-sm font-medium text-gray-300 truncate">{item.title}</span>
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
                    <p className="text-[10px] text-gray-500">{item.agent} • {item.decided_at ? new Date(item.decided_at).toLocaleString() : ''}</p>
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
            <span className="text-xs font-mono text-green-400">MARKET OPEN</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">+$18.50</p>
              <p className="text-[10px] text-gray-400">Unrealized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">$518.50</p>
              <p className="text-[10px] text-gray-400">Account Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan">2</p>
              <p className="text-[10px] text-gray-400">Open Positions</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-800 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '23%' }} />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">$18.50 / $80 daily limit</span>
          </div>
        </div>
      </div>

      {/* Agent Health Scores */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Agent Health</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Trading', score: 88, color: '#22C55E' },
            { name: 'Email', score: 97, color: '#22C55E' },
            { name: 'Content', score: 92, color: '#22C55E' },
            { name: 'Discord', score: 100, color: '#22C55E' },
            { name: 'Cost Mon', score: 100, color: '#22C55E' },
            { name: 'RLM Est', score: 85, color: '#F59E0B' },
            { name: 'Research', score: 78, color: '#F59E0B' },
            { name: 'Social', score: 45, color: '#EF4444' },
            { name: 'Prospect', score: 32, color: '#EF4444' },
          ].map((a, i) => (
            <div key={i} className="glass-card text-center py-2">
              <p className="text-lg font-bold font-mono" style={{ color: a.color }}>{a.score}</p>
              <p className="text-[9px] text-gray-400">{a.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Forecast */}
      <div className="mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Cost Forecast</h2>
            <span className="text-xs font-mono text-yellow-400">⚠️ WATCH</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400">Today</p>
              <p className="text-xl font-bold text-white">$142</p>
              <p className="text-[10px] text-yellow-400">71% of $200 limit</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Month Forecast</p>
              <p className="text-xl font-bold text-yellow-400">$187</p>
              <p className="text-[10px] text-gray-400">of $200 budget</p>
            </div>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2">
            <div className="h-2 rounded-full bg-yellow-500" style={{ width: '93%' }} />
          </div>
        </div>
      </div>

      {/* Master Connect */}
      <div className="mb-8">
        <MasterConnect />
      </div>

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
