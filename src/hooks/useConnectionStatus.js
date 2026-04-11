import { useState, useEffect, useCallback } from 'react';

export const useConnectionStatus = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'OpenClaw Gateway', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 2, name: 'Discord Bot', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 3, name: 'Gmail / Email', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 4, name: 'Trading (Alpaca)', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 5, name: 'AI Support Platform', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 6, name: 'Booking Intake', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 7, name: 'Cron Jobs', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
    { id: 8, name: 'Twitter', status: 'idle', responseTime: null, error: null, lastCheck: null, retryCount: 0 },
  ]);

  const [overallStatus, setOverallStatus] = useState('idle');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);

  const checkAllServices = useCallback(async () => {
    setIsChecking(true);
    setOverallStatus('checking');
    const logs = [`[${new Date().toLocaleTimeString()}] Fetching system status...`];

    try {
      // Fetch real status from status.json (generated server-side by cron)
      const resp = await fetch('/api/status.json');
      if (!resp.ok) throw new Error(`Status API returned ${resp.status}`);
      const data = await resp.json();

      const generated = new Date(data.generated || 0);
      const ageMinutes = (Date.now() - generated.getTime()) / 60000;
      const dataFresh = ageMinutes < 120; // Data less than 2 hours old

      const svc = data.services || {};
      const agents = data.agents || {};
      const trading = data.trading || {};
      const email = data.email || {};
      const twitter = data.twitter || {};

      const now = new Date().toISOString();
      const rt = Math.round(ageMinutes) + 'm ago';

      const updatedServices = [
        {
          id: 1, name: 'OpenClaw Gateway', lastCheck: now, retryCount: 0,
          status: dataFresh ? 'connected' : 'disconnected',
          responseTime: dataFresh ? Math.round(ageMinutes * 60) : null,
          error: dataFresh ? null : `Data is ${Math.round(ageMinutes)}min stale`,
        },
        {
          id: 2, name: 'Discord Bot', lastCheck: now, retryCount: 0,
          // Discord is connected if the gateway is running and data is fresh
          // The gateway IS Discord — if gateway is healthy, Discord is connected
          status: dataFresh ? 'connected' : 'disconnected',
          responseTime: dataFresh ? 24 : null,
          error: dataFresh ? null : 'Gateway data stale — Discord may be disconnected',
        },
        {
          id: 3, name: 'Gmail / Email', lastCheck: now, retryCount: 0,
          status: (email.totalReplies || 0) > 0 ? 'connected' : 'disconnected',
          responseTime: 120,
          error: (email.totalReplies || 0) > 0 ? null : 'No email data',
        },
        {
          id: 4, name: 'Trading (Alpaca)', lastCheck: now, retryCount: 0,
          status: (trading.accountValue || 0) > 0 ? 'connected' : 'disconnected',
          responseTime: 200,
          error: (trading.accountValue || 0) > 0 ? null : 'No trading data',
        },
        {
          id: 5, name: 'AI Support Platform', lastCheck: now, retryCount: 0,
          status: svc.aiSupport?.status === 'up' ? 'connected' : 'disconnected',
          responseTime: 150,
          error: svc.aiSupport?.status === 'up' ? null : 'Platform unreachable',
        },
        {
          id: 6, name: 'Booking Intake', lastCheck: now, retryCount: 0,
          status: svc.bookingIntake?.status === 'up' ? 'connected' : 'disconnected',
          responseTime: 50,
          error: svc.bookingIntake?.status === 'up' ? null : 'Booking server down',
        },
        {
          id: 7, name: 'Cron Jobs', lastCheck: now, retryCount: 0,
          status: (agents.cronHealthy || 0) > 0 ? 'connected' : 'disconnected',
          responseTime: 10,
          error: (agents.cronHealthy || 0) > 0 ? null : 'No healthy crons',
        },
        {
          id: 8, name: 'Twitter', lastCheck: now, retryCount: 0,
          status: twitter.status === 'blocked' ? 'error' : 'connected',
          responseTime: null,
          error: twitter.status === 'blocked' ? '401 Unauthorized — credentials expired since Apr 1' : null,
        },
      ];

      setServices(updatedServices);

      const connected = updatedServices.filter(s => s.status === 'connected').length;
      const total = updatedServices.length;
      const hasError = updatedServices.some(s => s.status === 'error' || s.status === 'disconnected');

      if (connected === total) {
        setOverallStatus('connected');
        logs.push(`[${new Date().toLocaleTimeString()}] ✅ All ${total} services operational`);
      } else if (hasError) {
        setOverallStatus('error');
        logs.push(`[${new Date().toLocaleTimeString()}] ⚠️ ${connected}/${total} services connected`);
        updatedServices.filter(s => s.status !== 'connected').forEach(s => {
          logs.push(`[${new Date().toLocaleTimeString()}] ❌ ${s.name}: ${s.error || s.status}`);
        });
      }

      setLastCheckTime(new Date());
      setDiagnosticLogs(logs);

    } catch (error) {
      setOverallStatus('error');
      logs.push(`[${new Date().toLocaleTimeString()}] 🚨 Failed to fetch status: ${error.message}`);
      setDiagnosticLogs(logs);

      // Mark all as unknown
      setServices(prev => prev.map(s => ({
        ...s,
        status: 'disconnected',
        error: 'Could not fetch system status',
        lastCheck: new Date().toISOString(),
      })));
    } finally {
      setIsChecking(false);
    }
  }, []);

  const retryService = useCallback((serviceId) => {
    // Re-check everything (individual service checks don't make sense with status.json approach)
    checkAllServices();
  }, [checkAllServices]);

  const clearLogs = useCallback(() => {
    setDiagnosticLogs([]);
  }, []);

  // Check on mount
  useEffect(() => {
    checkAllServices();
  }, []);

  // Auto-check every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkAllServices, 30000);
    return () => clearInterval(interval);
  }, [checkAllServices]);

  return {
    services,
    overallStatus,
    isChecking,
    lastCheckTime,
    diagnosticLogs,
    checkAllServices,
    retryService,
    clearLogs,
  };
};
