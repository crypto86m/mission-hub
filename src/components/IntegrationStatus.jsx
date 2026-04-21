import React, { useState, useEffect } from 'react';

export function IntegrationStatus() {
  const [integrations, setIntegrations] = useState({
    firecrawl: { status: 'online', lastSync: '2 min ago', usage: '0 credits' },
    tavily: { status: 'online', lastSync: '5 min ago', usage: '0 API calls' },
    agentmal: { status: 'online', lastSync: 'ready', usage: '0 analyses' },
    elevenlabs: { status: 'online', lastSync: '15 min ago', usage: '0 characters' },
    alpaca: { status: 'online', lastSync: '1 min ago', usage: '0 orders' },
  });

  useEffect(() => {
    // Fetch integration status every 30 seconds
    const interval = setInterval(() => {
      fetch('/api/integrations/status')
        .then(res => res.json())
        .then(data => setIntegrations(data))
        .catch(err => console.error('Integration status error:', err));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    return status === 'online' ? '#10b981' : '#ef4444';
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>🔗 Integrations Status</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {/* Firecrawl */}
        <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>📄 Firecrawl</h4>
            <span style={{ fontSize: '10px', backgroundColor: getStatusColor(integrations.firecrawl.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
              {integrations.firecrawl.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#666' }}>
            Web scraping API<br/>
            Last sync: {integrations.firecrawl.lastSync}<br/>
            Usage: {integrations.firecrawl.usage}
          </p>
          <button style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Test Connection
          </button>
        </div>

        {/* Tavily */}
        <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>🔍 Tavily</h4>
            <span style={{ fontSize: '10px', backgroundColor: getStatusColor(integrations.tavily.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
              {integrations.tavily.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#666' }}>
            Web search API<br/>
            Last sync: {integrations.tavily.lastSync}<br/>
            Usage: {integrations.tavily.usage}
          </p>
          <button style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Test Connection
          </button>
        </div>

        {/* Agent MAL */}
        <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>🔐 Agent MAL</h4>
            <span style={{ fontSize: '10px', backgroundColor: getStatusColor(integrations.agentmal.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
              {integrations.agentmal.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#666' }}>
            Malware analysis<br/>
            MCP Server: Port 3333<br/>
            Usage: {integrations.agentmal.usage}
          </p>
          <button style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Analyze File
          </button>
        </div>

        {/* ElevenLabs */}
        <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>🎤 ElevenLabs</h4>
            <span style={{ fontSize: '10px', backgroundColor: getStatusColor(integrations.elevenlabs.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
              {integrations.elevenlabs.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#666' }}>
            Text-to-speech API<br/>
            Last sync: {integrations.elevenlabs.lastSync}<br/>
            Usage: {integrations.elevenlabs.usage}
          </p>
          <button style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Synthesize
          </button>
        </div>

        {/* Alpaca */}
        <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>📈 Alpaca</h4>
            <span style={{ fontSize: '10px', backgroundColor: getStatusColor(integrations.alpaca.status), color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
              {integrations.alpaca.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#666' }}>
            Trading API<br/>
            Account: 215596978<br/>
            Buying Power: $500
          </p>
          <button style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            View Account
          </button>
        </div>
      </div>
    </div>
  );
}
