import React, { useState, useEffect } from 'react';
import styles from './SystemHealth.module.css';

export default function SystemHealth() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/system/health');
        const data = await response.json();
        setHealthData(data);
        setLastCheck(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (err) {
        console.error('Health check failed:', err);
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading system status...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔍 System Health Dashboard</h1>
        <p>Last checked: {lastCheck}</p>
      </div>

      <div className={styles.grid}>
        {/* Gateway Status */}
        <Card title="🌐 Gateway" icon="gateway">
          <Status
            label="Port 18789"
            status={healthData?.gateway?.running}
            value={healthData?.gateway?.status}
          />
          <Detail label="Memory" value={`${healthData?.gateway?.memory_mb}MB / 4GB`} />
          <Detail label="Uptime" value={healthData?.gateway?.uptime} />
        </Card>

        {/* Web Chat */}
        <Card title="💬 Web Chat" icon="webchat">
          <Status
            label="Port 7777"
            status={healthData?.web_chat?.running}
            value={healthData?.web_chat?.status}
          />
          <Detail label="Service" value={healthData?.web_chat?.service} />
          <Detail label="Watchdog" value={healthData?.web_chat?.watchdog ? 'Active' : 'Inactive'} />
        </Card>

        {/* Trading System */}
        <Card title="📊 Trading" icon="trading">
          <Status
            label="Agents"
            status={healthData?.trading?.agents > 0}
            value={`${healthData?.trading?.agents} running`}
          />
          <Detail label="Positions" value={healthData?.trading?.open_positions || 0} />
          <Detail label="P&L Today" value={`$${healthData?.trading?.daily_pnl || 0}`} />
          <Detail label="Max Loss" value={`$${healthData?.trading?.max_daily_loss || 120}`} />
        </Card>

        {/* MCP Servers */}
        <Card title="🧠 MCP Servers" icon="mcp">
          <Status label="Sequential Thinking" status={healthData?.mcp?.sequential_thinking} />
          <Status label="Extended Memory" status={healthData?.mcp?.extended_memory} />
          <Status label="PDF Processing" status={healthData?.mcp?.pdf} />
          <Status label="Inspector" status={healthData?.mcp?.inspector} />
        </Card>

        {/* API Status */}
        <Card title="🔌 API Credentials" icon="api">
          <Detail label="Alpha Vantage" value={healthData?.api?.alpha_vantage ? '✅ Saved' : '❌ Missing'} />
          <Detail label="Alpaca Live" value={healthData?.api?.alpaca_live ? '✅ Saved' : '❌ Missing'} />
          <Detail label="Tavily" value={healthData?.api?.tavily ? '✅ Saved' : '❌ Missing'} />
          <Detail label="ElevenLabs" value={healthData?.api?.elevenlabs ? '✅ Saved' : '❌ Missing'} />
        </Card>

        {/* Cost Tracking */}
        <Card title="💰 Daily Costs" icon="costs">
          <Detail label="Today" value={`$${healthData?.costs?.daily || 0}`} />
          <Detail label="30-Day" value={`$${healthData?.costs?.monthly || 0}`} />
          <Detail label="Budget" value={`$200/month`} />
          <ProgressBar
            value={healthData?.costs?.monthly || 0}
            max={200}
            label="Monthly Budget Used"
          />
        </Card>

        {/* Uptime */}
        <Card title="⏱️  Uptime" icon="uptime">
          <Detail label="Gateway" value={`${healthData?.uptime?.gateway || 99}%`} />
          <Detail label="Web Chat" value={`${healthData?.uptime?.web_chat || 95}%`} />
          <Detail label="Trading" value={`${healthData?.uptime?.trading || 99}%`} />
          <Detail label="30-Day Avg" value={`${healthData?.uptime?.monthly || 98}%`} />
        </Card>

        {/* Alerts */}
        {healthData?.alerts && healthData.alerts.length > 0 && (
          <Card title="⚠️  Alerts" icon="alerts" className={styles.alerts}>
            {healthData.alerts.map((alert, i) => (
              <Alert key={i} level={alert.level} message={alert.message} />
            ))}
          </Card>
        )}
      </div>

      {/* Summary Footer */}
      <div className={styles.footer}>
        <div className={`${styles.status_badge} ${healthData?.overall_status === 'healthy' ? styles.healthy : styles.warning}`}>
          {healthData?.overall_status === 'healthy' ? '✅ All Systems Operational' : '⚠️ Issues Detected'}
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children, className }) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <h2>{title}</h2>
      <div className={styles.card_content}>{children}</div>
    </div>
  );
}

function Status({ label, status, value }) {
  return (
    <div className={styles.status_row}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.status_indicator} ${status ? styles.online : styles.offline}`}>
        {status ? '🟢' : '🔴'}
      </span>
      {value && <span className={styles.value}>{value}</span>}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className={styles.detail_row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, label }) {
  const percentage = (value / max) * 100;
  return (
    <div className={styles.progress_container}>
      <div className={styles.progress_bar}>
        <div
          className={styles.progress_fill}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={styles.progress_label}>{percentage.toFixed(0)}%</span>
    </div>
  );
}

function Alert({ level, message }) {
  return (
    <div className={`${styles.alert} ${styles[`alert_${level}`]}`}>
      <span className={styles.alert_level}>{level.toUpperCase()}</span>
      <span className={styles.alert_message}>{message}</span>
    </div>
  );
}
