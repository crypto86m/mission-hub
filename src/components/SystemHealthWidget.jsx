import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

export default function SystemHealthWidget({ alerts }) {
  const { getSystemHealth } = useWorkflowStore();
  const health = useMemo(() => getSystemHealth(), [getSystemHealth]);

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/10';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'critical':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} className="animate-pulse" />;
      case 'critical':
        return <AlertCircle size={20} className="animate-pulse" />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const statusText = {
    healthy: 'All Systems Healthy',
    warning: `⚠ ${health.blocked} Workflow${health.blocked !== 1 ? 's' : ''} Blocked`,
    critical: `🔴 ${health.blocked} Critical Issues`,
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getHealthColor(health.status)}`}>
      {getHealthIcon(health.status)}
      <div>
        <p className="text-sm font-semibold leading-tight">{statusText[health.status]}</p>
        <p className="text-xs opacity-75">
          {health.inProgress} in progress • {health.completed} completed
        </p>
      </div>
    </div>
  );
}
