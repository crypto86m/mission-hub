import React, { useState, useEffect } from 'react';

// Gateway Restart API runs on the Mac mini
// Local: http://localhost:4345
// Tailscale: http://100.65.157.30:4345
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:4345' 
  : 'http://100.65.157.30:4345';

export function GatewayControl() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [gatewayStatus, setGatewayStatus] = useState(null);

  // Check gateway status on mount and every 30s
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gateway/status`);
        const data = await res.json();
        setGatewayStatus(data.status);
      } catch {
        setGatewayStatus('unreachable');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRestartGateway = async () => {
    if (!window.confirm('Restart gateway? Discord will drop for ~30 seconds.')) {
      return;
    }

    setLoading(true);
    setStatus('Restarting gateway...');

    try {
      const response = await fetch(`${API_BASE}/api/gateway/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setStatus('✅ Gateway restarting. Systems coming back online...');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setStatus('❌ Restart failed');
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Gateway Control</h3>
      <button
        onClick={handleRestartGateway}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'wait' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {loading ? '⏳ Restarting...' : '🔄 Restart Gateway'}
      </button>
      {status && <p style={{ marginTop: '10px', fontSize: '12px' }}>{status}</p>}
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>
        Status: {gatewayStatus === 'running' ? '🟢 Running' : gatewayStatus === 'unreachable' ? '🔴 Unreachable' : `⚠️ ${gatewayStatus}`}
      </div>
    </div>
  );
}
