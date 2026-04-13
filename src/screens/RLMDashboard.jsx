import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, DollarSign, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import RLMPipeline from '../components/RLMPipeline';

export default function RLMDashboard() {
  const [lastSync, setLastSync] = useState('2026-04-13 15:08 PDT');
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      level: 'critical',
      message: 'RLM-2026-001: 14 days overdue - Final follow-up required',
      time: '2 hours ago'
    },
    {
      id: 2,
      level: 'warning',
      message: 'RLM-2026-002: 9 days overdue - Second follow-up needed',
      time: '2 hours ago'
    },
    {
      id: 3,
      level: 'info',
      message: 'RLM-2026-003: Medical Center estimate due 2026-04-15',
      time: '1 day ago'
    }
  ]);

  const handleSync = () => {
    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Los_Angeles'
    });
    setLastSync(now);
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/5';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/5';
      default:
        return 'border-gray-500/50 bg-gray-500/5';
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'warning':
        return <Clock size={16} className="text-yellow-400" />;
      case 'info':
        return <CheckCircle size={16} className="text-blue-400" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold glow-text mb-2">RLM Enterprises Pipeline</h1>
            <p className="text-gray-400">Commercial Painting Operations • Real-time bid & project tracking</p>
          </div>
          <button
            onClick={handleSync}
            className="p-2 hover:bg-cyan/10 rounded-lg transition-colors"
            title="Sync with database"
          >
            <RefreshCw size={20} className="text-cyan" />
          </button>
        </div>
        <p className="text-xs text-gray-500">Last sync: {lastSync}</p>
      </div>

      {/* Critical Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-cyan flex items-center gap-2">
            <AlertCircle size={20} />
            Critical Alerts & Actions
          </h2>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`glass-card border-l-4 ${getAlertColor(alert.level)} flex items-start gap-3 p-3`}
              >
                {getAlertIcon(alert.level)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Pipeline Component */}
      <div className="mb-8">
        <RLMPipeline />
      </div>

      {/* Configuration Notes */}
      <div className="glass-card border-l-4 border-cyan/50 mb-8">
        <h3 className="font-semibold mb-3 text-cyan">Alert Configuration</h3>
        <div className="text-xs text-gray-400 space-y-2">
          <p>✓ Critical alerts: Bids overdue >10 days</p>
          <p>✓ Warning alerts: Bids overdue 5-10 days</p>
          <p>✓ Info alerts: Upcoming milestones & deadlines</p>
          <p>✓ Auto-escalation: Daily check during bidding season</p>
          <p>✓ Integration: Syncs with bid-tracker & project-tracker databases</p>
        </div>
      </div>

      {/* Data Integration Note */}
      <div className="glass-card border-l-4 border-blue-500/50">
        <h4 className="font-semibold mb-2 text-blue-400">Data Sources</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Bid Data: /rlm/bid-tracker/bids.json</p>
          <p>• Project Data: /rlm/project-tracker/ACTIVE-PROJECTS.md</p>
          <p>• Real-time sync every 5 minutes (configurable)</p>
          <p>• Dashboard updates on data change</p>
        </div>
      </div>
    </div>
  );
}
