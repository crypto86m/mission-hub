import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Terminal, X } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

export default function MasterConnect() {
  const { services, overallStatus, isChecking, lastCheckTime, diagnosticLogs, checkAllServices, retryService, clearLogs } =
    useConnectionStatus();

  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [nextAutoCheckIn, setNextAutoCheckIn] = useState(null);

  // Auto-check on mount
  useEffect(() => {
    checkAllServices();
  }, []);

  // Schedule next auto-check every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkAllServices();
      setNextAutoCheckIn(300); // 5 minutes
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [checkAllServices]);

  // Update countdown timer
  useEffect(() => {
    if (!nextAutoCheckIn) return;

    const interval = setInterval(() => {
      setNextAutoCheckIn((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextAutoCheckIn]);

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'idle':
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300';
      case 'checking':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300 animate-pulse';
      case 'connected':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (overallStatus) {
      case 'idle':
        return '⚪';
      case 'checking':
        return '🟡';
      case 'connected':
        return '🟢';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusMessage = () => {
    switch (overallStatus) {
      case 'idle':
        return 'Not checked yet';
      case 'checking':
        return 'Checking services...';
      case 'connected':
        return 'All systems operational';
      case 'error':
        return 'Some services offline';
      default:
        return 'Unknown status';
    }
  };

  const connectedCount = services.filter((s) => s.status === 'connected').length;
  const totalCount = services.length;

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatCountdown = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `(in ${mins}m ${secs}s)`;
  };

  return (
    <div className="space-y-4">
      {/* Master Connect Button */}
      <div className={`glass-card border ${getStatusColor()} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getStatusIcon()}</span>
            <div>
              <h3 className="text-lg font-semibold">Master Connection Status</h3>
              <p className="text-sm text-gray-400">{getStatusMessage()}</p>
            </div>
          </div>
          {isChecking && <RefreshCw size={24} className="animate-spin text-yellow-400" />}
        </div>

        {/* Service Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Services Connected</span>
            <span className="font-semibold">
              {connectedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(connectedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Time Info */}
        <div className="space-y-1 mb-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>Last Check: {formatTime(lastCheckTime)}</span>
          </div>
          {nextAutoCheckIn && (
            <div className="flex items-center gap-2">
              <RefreshCw size={14} />
              <span>Next Auto-Check: {formatCountdown(nextAutoCheckIn)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => checkAllServices()}
            disabled={isChecking}
            className="flex-1 bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-cyan py-2 px-3 rounded font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            {isChecking ? 'Checking...' : 'Check Now'}
          </button>
          <button
            onClick={() => setShowDetailedModal(true)}
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-3 rounded font-semibold text-sm transition-all"
          >
            Details
          </button>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="glass-card p-4">
        <h4 className="font-semibold mb-3 text-sm text-gray-300">Service Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-2 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${
                  service.status === 'connected' ? 'bg-green-400' : service.status === 'checking' ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              ></div>
              <span className="text-gray-300">{service.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Modal */}
      {showDetailedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-cyan/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan/20">
              <h2 className="text-2xl font-bold text-white">Master Connection Diagnostic</h2>
              <button
                onClick={() => setShowDetailedModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Overall Status Section */}
              <div className={`glass-card border ${getStatusColor()} p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getStatusIcon()}</span>
                  <div>
                    <h3 className="text-lg font-semibold">Overall Status</h3>
                    <p className="text-sm">{getStatusMessage()}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Connected: {connectedCount}/{totalCount} services</p>
                  <p>Last Check: {formatTime(lastCheckTime)}</p>
                  {nextAutoCheckIn && <p>Next Check: {formatCountdown(nextAutoCheckIn)}</p>}
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Status Details</h3>
                <div className="space-y-2">
                  {services.map((service) => (
                    <div key={service.id} className="glass-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              service.status === 'connected' ? 'bg-green-400' : service.status === 'checking' ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                          ></div>
                          <h4 className="font-semibold">{service.name}</h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          service.status === 'connected' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>
                          Response Time:{' '}
                          <span className="text-white">
                            {service.responseTime ? `${service.responseTime}ms` : 'N/A'}
                          </span>
                        </div>
                        <div>
                          Retries: <span className="text-white">{service.retryCount}</span>
                        </div>
                        <div className="col-span-2">
                          Last Check:{' '}
                          <span className="text-white">
                            {service.lastCheck ? formatTime(new Date(service.lastCheck)) : 'Never'}
                          </span>
                        </div>
                        {service.error && (
                          <div className="col-span-2 text-red-400">
                            Error: <span className="text-red-300">{service.error}</span>
                          </div>
                        )}
                      </div>
                      {service.status !== 'connected' && (
                        <button
                          onClick={() => retryService(service.id)}
                          className="mt-3 w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 py-2 px-3 rounded text-xs font-semibold transition-all"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Logs */}
              {diagnosticLogs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Diagnostic Logs</h3>
                    <button
                      onClick={clearLogs}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="glass-card p-4 font-mono text-xs max-h-48 overflow-y-auto">
                    <div className="space-y-1 text-gray-400">
                      {diagnosticLogs.map((log, idx) => (
                        <div key={idx} className="text-gray-500">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-cyan/20 p-6 flex gap-2">
              <button
                onClick={() => checkAllServices()}
                disabled={isChecking}
                className="flex-1 bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-cyan py-2 px-4 rounded font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Checking...' : 'Retry All'}
              </button>
              <button
                onClick={() => setShowDetailedModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
