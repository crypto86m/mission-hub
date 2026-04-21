import React from 'react';
import { BarChart3, AlertTriangle } from 'lucide-react';

export default function AnalyticsHub({ data }) {
  if (!data?.connected) {
    return (
      <div className="bg-dark-card border border-yellow-500/20 rounded-lg p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 text-yellow-400" size={32} />
        <p className="text-gray-400">Instagram API not connected</p>
        <p className="text-gray-500 text-sm mt-1">Connect Instagram to see analytics and insights</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-cyan/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-cyan" size={20} />
        <h3 className="text-lg font-bold text-white">Analytics</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">30d Views</p>
          <p className="text-2xl font-bold text-white">{(data.metrics?.views30d || 0).toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">30d Interactions</p>
          <p className="text-2xl font-bold text-white">{(data.metrics?.interactions30d || 0).toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Net Growth</p>
          <p className="text-2xl font-bold text-white">{data.metrics?.netGrowth30d || 0}</p>
        </div>
      </div>
    </div>
  );
}
