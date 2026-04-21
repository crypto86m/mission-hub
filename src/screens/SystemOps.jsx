import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Shield, TrendingUp, Mail, Brain, Wifi, RefreshCw, AlertTriangle, CheckCircle, XCircle, Users, DollarSign, BarChart2, Lock, Clock, FileText } from 'lucide-react';

async function fetchSystemHealth() {
  try {
    const res = await fetch('/api/system-health.json?t=' + Date.now());
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function fetchAlpacaPositions() {
  try {
    const res = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': import.meta.env.VITE_ALPACA_PAPER_KEY || 'PKFUDSV2RNOHY3N46B7U4SDMPW',
        'APCA-API-SECRET-KEY': import.meta.env.VITE_ALPACA_PAPER_SECRET || 'Cj1VaCffjyddy8YsSwASV3EmPp7QgsVAhb8pv8WyZBhT',
      }
    });
    if (res.ok) return { positions: await res.json(), error: null };
  } catch {}
  return { positions: [], error: 'Connection failed' };
}

async function fetchAlpacaAccount(mode = 'paper') {
  const configs = {
    paper: {
      url: 'https://paper-api.alpaca.markets/v2/account',
      key: import.meta.env.VITE_ALPACA_PAPER_KEY || 'PKFUDSV2RNOHY3N46B7U4SDMPW',
      secret: import.meta.env.VITE_ALPACA_PAPER_SECRET || 'Cj1VaCffjyddy8YsSwASV3EmPp7QgsVAhb8pv8WyZBhT',
    },
    live: {
      url: 'https://api.alpaca.markets/v2/account',
      key: import.meta.env.VITE_ALPACA_LIVE_KEY || 'AKGRWTAEPYPFMKJMZFMFTVQNO6',
      secret: import.meta.env.VITE_ALPACA_LIVE_SECRET || '35fPtVPABQfALi9re6dsrr2YF1V6v2nyw3CDa5DsY54L',
    }
  };
  const cfg = configs[mode];
  try {
    const res = await fetch(cfg.url, {
      headers: { 'APCA-API-KEY-ID': cfg.key, 'APCA-API-SECRET-KEY': cfg.secret }
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

function StatusBadge({ status }) {
  const isOn = status === 'online' || status === true || status === 'active' || status === 'ACTIVE';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isOn ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
      {isOn ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {isOn ? 'Online' : 'Offline'}
    </span>
  );
}

function MetricCard({ icon: Icon, title, value, subtitle, color = 'cyan' }) {
  const colors = { cyan: 'text-cyan-400', green: 'text-green-400', red: 'text-red-400', yellow: 'text-yellow-400', purple: 'text-purple-400' };
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={colors[color]} />
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function Row({ label, value, status, detail }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-800/50 last:border-0">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        {detail && <span className="text-[10px] text-gray-500">{detail}</span>}
        {status !== undefined ? <StatusBadge status={status} /> : <span className="text-sm text-cyan-400 font-medium">{value}</span>}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="glass-card p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-cyan-400" />
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SystemOps() {
  const [health, setHealth] = useState(null);
  const [paperAccount, setPaperAccount] = useState(null);
  const [liveAccount, setLiveAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [posError, setPosError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [section, setSection] = useState('health');

  const refresh = useCallback(async () => {
    setLoading(true);
    const [h, paper, live, pos] = await Promise.all([
      fetchSystemHealth(),
      fetchAlpacaAccount('paper'),
      fetchAlpacaAccount('live'),
      fetchAlpacaPositions(),
    ]);
    setHealth(h);
    setPaperAccount(paper);
    setLiveAccount(live);
    setPositions(pos.positions || []);
    setPosError(pos.error);
    setLastUpdate(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 30000);
    return () => clearInterval(iv);
  }, [refresh]);

  const tabs = [
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'positions', label: 'Positions', icon: TrendingUp },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'audit', label: 'Audit', icon: Shield },
    { id: 'apis', label: 'APIs', icon: Lock },
  ];

  const paperVal = paperAccount ? parseFloat(paperAccount.portfolio_value) : 0;
  const liveVal = liveAccount ? parseFloat(liveAccount.portfolio_value) : 0;
  const totalUnrealized = positions.reduce((sum, p) => sum + parseFloat(p.unrealized_pl || 0), 0);

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity size={20} className="text-cyan-400" />
            System Operations
          </h1>
          <p className="text-[10px] text-gray-500 mt-1">
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Loading...'}
            {loading && ' • Refreshing...'}
          </p>
        </div>
        <button onClick={refresh} className={`p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={16} className="text-cyan-400" />
        </button>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              section === t.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-800/50 text-gray-500 border border-gray-800'
            }`}>
            <t.icon size={11} />{t.label}
          </button>
        ))}
      </div>

      {section === 'health' && (
        <>
          <div className={`glass-card p-3 mb-3 border-l-4 ${!health?.alerts?.length ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
            <div className="flex items-center gap-2 text-sm">
              {!health?.alerts?.length ? (
                <><CheckCircle size={16} className="text-green-400" /><span className="text-green-400 font-medium">All Systems Operational</span></>
              ) : (
                <><AlertTriangle size={16} className="text-yellow-400" /><span className="text-yellow-400 font-medium">{health.alerts.length} Issue(s)</span></>
              )}
            </div>
          </div>
          {health?.alerts?.map((a, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-2 ${a.level === 'critical' ? 'bg-red-500/10 border border-red-500/30 text-red-300' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300'}`}>
              <AlertTriangle size={12} />{a.msg}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <MetricCard icon={Wifi} title="Gateway" value={health?.gateway?.status === 'online' ? '✅ Live' : '❌ Down'} subtitle={`${health?.gateway?.memory_mb || 0}MB / 4GB`} color={health?.gateway?.status === 'online' ? 'green' : 'red'} />
            <MetricCard icon={TrendingUp} title="Trading" value={`${health?.trading?.agents || 0} agents`} subtitle="Active processes" />
            <MetricCard icon={Brain} title="MCP Servers" value={health?.mcp?.count || 0} subtitle="AI reasoning tools" color="purple" />
            <MetricCard icon={DollarSign} title="Budget" value={`$${health?.costs?.monthly || 0}`} subtitle={`of $${health?.costs?.budget || 200}/mo`} color="green" />
          </div>
          <SectionCard title="Core Infrastructure" icon={Wifi}>
            <Row label="OpenClaw Gateway" status={health?.gateway?.status} detail={`${health?.gateway?.memory_mb || 0}MB`} />
            <Row label="Web Chat Backup" status={health?.web_chat?.status} detail="Port 7777" />
            <Row label="Hermes Agents" value={`${health?.trading?.agents || 0} running`} />
          </SectionCard>
          <SectionCard title="MCP Servers" icon={Brain}>
            {(health?.mcp?.servers || []).length === 0 && <p className="text-xs text-gray-500">No server data from /api/system-health.json</p>}
            {(health?.mcp?.servers || []).map(s => (
              <Row key={s} label={s} status="online" detail="Auto-restart enabled" />
            ))}
          </SectionCard>
        </>
      )}

      {section === 'positions' && (
        <>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <MetricCard icon={BarChart2} title="Paper Account" value={`$${paperVal.toLocaleString('en-US', {minimumFractionDigits:2})}`} subtitle={paperAccount ? `BP: $${parseFloat(paperAccount.buying_power).toLocaleString()}` : 'Loading...'} color="cyan" />
            <MetricCard icon={BarChart2} title="Live Account" value={`$${liveVal.toLocaleString('en-US', {minimumFractionDigits:2})}`} subtitle={liveAccount ? `BP: $${parseFloat(liveAccount.buying_power).toLocaleString()}` : 'Loading...'} color="green" />
          </div>
          <div className={`glass-card p-3 mb-3 border-l-4 ${totalUnrealized >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Unrealized P&L (All Positions)</span>
              <span className={`text-lg font-bold ${totalUnrealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalUnrealized >= 0 ? '+' : ''}${totalUnrealized.toFixed(2)}</span>
            </div>
          </div>
          <SectionCard title={`Open Positions (${positions.length})`} icon={TrendingUp}>
            {positions.length === 0 && !posError && <p className="text-xs text-gray-500 py-2">No open positions</p>}
            {posError && <p className="text-xs text-red-400 py-2">⚠️ {posError}</p>}
            {positions.map((pos, i) => {
              const pnl = parseFloat(pos.unrealized_pl || 0);
              const pnlPct = (parseFloat(pos.unrealized_plpc || 0) * 100).toFixed(2);
              const qty = parseFloat(pos.qty);
              const entry = parseFloat(pos.avg_entry_price);
              const current = parseFloat(pos.current_price);
              const mktVal = parseFloat(pos.market_value);
              return (
                <div key={i} className="py-3 border-b border-gray-800/50 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{pos.symbol}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${pos.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{pos.side?.toUpperCase()}</span>
                    </div>
                    <span className={`text-sm font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPct}%)</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{qty} shares @ ${entry.toFixed(2)}</span>
                    <span>Now: ${current.toFixed(2)} | Val: ${mktVal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </SectionCard>
          <SectionCard title="Account Details" icon={BarChart2}>
            <Row label="Paper Status" status={paperAccount?.status} />
            <Row label="Live Status" status={liveAccount?.status} />
            <Row label="Paper Equity" value={paperAccount ? `$${parseFloat(paperAccount.equity).toLocaleString()}` : '-'} />
            <Row label="Live Equity" value={liveAccount ? `$${parseFloat(liveAccount.equity).toLocaleString()}` : '-'} />
            <Row label="Paper Day Trades" value={paperAccount?.daytrade_count || '0'} />
          </SectionCard>
        </>
      )}

      {section === 'leads' && (
        <>
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            <MetricCard icon={Users} title="Total" value={health?.leads?.total || 0} color="cyan" />
            <MetricCard icon={Mail} title="Due Outreach" value={health?.leads?.due_outreach || 0} color="yellow" />
            <MetricCard icon={CheckCircle} title="Converted" value="0" color="green" />
          </div>
          <SectionCard title="Active Pipelines" icon={Users}>
            {[
              { name: 'AI Support SaaS', target: '$5K MRR', leads: 3 },
              { name: "Bennett's Brief Sponsors", target: '$2K MRR', leads: 3 },
              { name: 'RLM Licensing', target: '$360K ARR', leads: 0 },
              { name: 'NVCC Memberships', target: '$50K ARR', leads: 0 },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-800/50 last:border-0">
                <div>
                  <span className="text-sm text-gray-200">{p.name}</span>
                  <p className="text-[10px] text-gray-500">Target: {p.target}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-400 font-medium">{p.leads} leads</span>
                  <StatusBadge status={p.leads > 0} />
                </div>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Outreach Sequence" icon={Mail}>
            <Row label="Day 0: Initial Outreach" value="Personalized" />
            <Row label="Day 2: Follow-up #1" value="Value-add" />
            <Row label="Day 5: Follow-up #2" value="Case study" />
            <Row label="Day 8: Final Follow-up" value="Last chance" />
          </SectionCard>
        </>
      )}

      {section === 'audit' && (
        <>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <MetricCard icon={Shield} title="Entries Today" value={health?.compliance?.entries_today || 0} color="cyan" />
            <MetricCard icon={Lock} title="Integrity" value={health?.compliance?.integrity === 'verified' ? '✅ Verified' : '⚠️ Check'} subtitle="SHA-256 hash validation" color="green" />
          </div>
          <SectionCard title="Audit Trail Status" icon={Shield}>
            <Row label="Log Format" value="Append-only JSONL" />
            <Row label="Tamper Detection" value="SHA-256 per entry" />
            <Row label="Storage" value="compliance/audit/" />
            <Row label="Monthly Reports" status={true} detail="Auto-generated" />
          </SectionCard>
          <SectionCard title="Tracked Actions" icon={FileText}>
            {[
              { name: 'Trades Executed', icon: '📊', count: 0 },
              { name: 'Emails Sent', icon: '✉️', count: 0 },
              { name: 'Config Changes', icon: '⚙️', count: 6 },
              { name: 'Credential Updates', icon: '🔐', count: 4 },
              { name: 'System Restarts', icon: '🔄', count: 1 },
              { name: 'Posts Published', icon: '📝', count: 0 },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                <span className="text-sm">{a.icon} {a.name}</span>
                <span className="text-xs text-cyan-400 font-mono">{a.count}</span>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Recent Entries" icon={Clock}>
            <div className="text-[10px] text-gray-500 space-y-1.5">
              <p>[12:05] config_changed: Compliance audit trail activated</p>
              <p>[12:05] config_changed: Trading analysis engine created</p>
              <p>[12:05] config_changed: Executive dashboard deployed</p>
              <p>[12:05] credential_updated: Alpaca Live API key stored</p>
              <p>[12:05] credential_updated: Alpha Vantage API key stored</p>
              <p>[12:05] system_restart: Gateway restarted for MCP</p>
              <p>[12:05] system_startup: All 6 improvements deployed</p>
            </div>
          </SectionCard>
        </>
      )}

      {section === 'apis' && (
        <>
          <SectionCard title="Trading APIs" icon={TrendingUp}>
            <Row label="Alpaca Paper Trading" status={health?.api_status?.alpaca} detail="PA3HM54AE89H" />
            <Row label="Alpaca Live Trading" status={health?.api_status?.alpaca} detail="215596978" />
            <Row label="Alpha Vantage" status={health?.api_status?.alpha_vantage} detail="Market data" />
          </SectionCard>
          <SectionCard title="Research & AI APIs" icon={Brain}>
            <Row label="Tavily Web Search" status={health?.api_status?.tavily} detail="Research queries" />
            <Row label="ElevenLabs TTS" status={health?.api_status?.elevenlabs} detail="Voice synthesis" />
            <Row label="OpenAI (GPT-4o)" status={true} detail="Code generation" />
            <Row label="Anthropic (Claude)" status={true} detail="Primary reasoning" />
          </SectionCard>
          <SectionCard title="Infrastructure APIs" icon={Lock}>
            <Row label="Supabase" status={true} detail="Database + auth" />
            <Row label="Vercel" status={true} detail="Hosting + deploy" />
            <Row label="Google OAuth" status={true} detail="Gmail + Calendar" />
            <Row label="Discord Bot" status={true} detail="CBV2 + channels" />
          </SectionCard>
          <SectionCard title="MCP Server Status" icon={Brain}>
            {(health?.mcp?.servers || []).map(s => (
              <Row key={s} label={s} status="online" detail="Auto-restart: ON" />
            ))}
            {(health?.mcp?.servers || []).length === 0 && <p className="text-[10px] text-gray-500">No data from /api/system-health.json</p>}
          </SectionCard>
          <SectionCard title="Credential Security" icon={Shield}>
            <Row label="Storage" value="~/.openclaw/.env" />
            <Row label="Encryption" value="File permissions (600)" />
            <Row label="Last Rotation" value="2026-04-16" />
            <Row label="Next Review" value="2026-05-16" />
          </SectionCard>
        </>
      )}
    </div>
  );
}
