import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function EngagementProjections({ data }) {
  if (!data?.connected) {
    return (
      <div className="bg-dark-card border border-yellow-500/20 rounded-lg p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 text-yellow-400" size={32} />
        <p className="text-gray-400">Instagram API not connected</p>
        <p className="text-gray-500 text-sm mt-1">Connect Instagram to see growth projections</p>
      </div>
    );
  }

  const current = data.account.followers;
  return (
    <div className="bg-dark-card border border-cyan/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-cyan" size={20} />
        <h3 className="text-lg font-bold text-white">Growth Forecast</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Current</p>
          <p className="text-2xl font-bold text-white">{current.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">10-Week Target</p>
          <p className="text-2xl font-bold text-cyan">—</p>
          <p className="text-xs text-gray-500">Awaiting data</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">20-Week Target</p>
          <p className="text-2xl font-bold text-cyan">—</p>
          <p className="text-xs text-gray-500">Awaiting data</p>
        </div>
      </div>
    </div>
  );
}
