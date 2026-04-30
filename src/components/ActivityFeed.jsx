import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function ActivityFeed({ activities }) {
  const getActivityIcon = (status) => {
    switch (status) {
      case 'active':
        return <TrendingUp size={16} className="text-cyan" />;
      case 'done':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-400" />;
      default:
        return <Plus size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={activity.id} className="glass-card">
          <div className="flex gap-3">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className="p-1">{getActivityIcon(activity.status)}</div>
              {index !== activities.length - 1 && (
                <div className="w-0.5 h-8 bg-cyan/20 mt-1"></div>
              )}
            </div>

            {/* Activity Details */}
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-white text-sm">
                  {activity.action}
                </h4>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
              <p className="text-sm text-gray-300">{activity.details}</p>
              {activity.status === 'active' && (
                <div className="mt-2">
                  <span className="text-xs inline-block px-2 py-1 bg-cyan/10 border border-cyan/30 text-cyan rounded animate-pulse">
                    In Progress
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
