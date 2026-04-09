import { useState } from 'react';

const integrations = [
  // AI / Model Providers
  { name: "Anthropic (Claude)", category: "AI / Model Providers", status: "Active", icon: "🧠", color: "#D97706", credentials: "Valid", lastActivity: "Now", agents: ["Charles (CBV2)", "Content Agent", "Email Responder"], workflows: ["All agent operations", "Content generation", "Email replies"], models: "Haiku, Sonnet, Opus 4.6", envSource: "ANTHROPIC_API_KEY" },
  { name: "OpenAI (GPT-4o)", category: "AI / Model Providers", status: "Active", icon: "🤖", color: "#10B981", credentials: "Valid", lastActivity: "Now", agents: ["Trading Bot", "Mission Control Builder"], workflows: ["Code generation", "Trading analysis"], models: "GPT-4o, GPT-4o-mini", envSource: "OPENAI_API_KEY" },
  { name: "Ollama (Local)", category: "AI / Model Providers", status: "Active", icon: "🦙", color: "#8B5CF6", credentials: "N/A (Local)", lastActivity: "11 days ago", agents: ["Local inference tasks"], workflows: ["Simple tasks, fast turnaround"], models: "llama3.2:latest, qwen2.5:14b", envSource: "localhost:11434" },
  { name: "Perplexity", category: "AI / Model Providers", status: "Active", icon: "🔍", color: "#3B82F6", credentials: "Valid", lastActivity: "Today", agents: ["Market Research", "Prospect Research"], workflows: ["Real-time research", "Prospect intel", "Market analysis"], models: "sonar, sonar-pro", envSource: "PERPLEXITY_API_KEY" },
  { name: "Google AI (Search)", category: "AI / Model Providers", status: "Active", icon: "🔎", color: "#4285F4", credentials: "Valid", lastActivity: "Today", agents: ["Charles (CBV2)"], workflows: ["Web search", "Fact-checking"], models: "Custom Search API", envSource: "Google webSearch apiKey" },

  // Communication
  { name: "Discord", category: "Communication", status: "Active", icon: "💬", color: "#5865F2", credentials: "Valid", lastActivity: "Now", agents: ["Discord Bot", "Charles (CBV2)"], workflows: ["Channel monitoring (14 channels)", "Status updates", "Alerts", "Approval notifications"], models: "N/A", envSource: "DISCORD_TOKEN + DISCORD_WEBHOOK" },
  { name: "Gmail (OAuth)", category: "Communication", status: "Active", icon: "📧", color: "#EA4335", credentials: "Valid", lastActivity: "Every 30 min", agents: ["Email Responder"], workflows: ["Auto-reply", "Email triage", "Sensitive flagging"], models: "Haiku for drafting", envSource: "gmail-credentials.json + GMAIL_APP_PASSWORD" },
  { name: "SMS (Verizon)", category: "Communication", status: "Active", icon: "📱", color: "#EF4444", credentials: "Valid", lastActivity: "On alerts", agents: ["Cost Monitor", "Demo Pipeline"], workflows: ["Budget alerts", "Demo notifications", "Critical escalations"], models: "N/A", envSource: "7073377636@vtext.com" },
  { name: "SendGrid", category: "Communication", status: "Active", icon: "✉️", color: "#1A82E2", credentials: "Valid", lastActivity: "On demand", agents: ["AI Support Platform"], workflows: ["Transactional emails", "Customer notifications"], models: "N/A", envSource: "SENDGRID_API_KEY" },

  // Trading / Finance
  { name: "Alpaca (Live)", category: "Trading / Finance", status: "Active", icon: "📈", color: "#FBBF24", credentials: "Valid", lastActivity: "Market hours", agents: ["Trading Bot", "Risk Monitor"], workflows: ["Live trading ($500 acct)", "3 strategies", "Position management"], models: "GPT-4o for analysis", envSource: "ALPACA_API_KEY + ALPACA_SECRET" },
  { name: "TradingView", category: "Trading / Finance", status: "Planned", icon: "📊", color: "#2962FF", credentials: "Not configured", lastActivity: "Never", agents: ["Trading Bot (planned)"], workflows: ["Webhook alerts → auto-trade (planned)", "Chart analysis"], models: "N/A", envSource: "Not set — webhook integration planned" },
  { name: "Stripe", category: "Trading / Finance", status: "Active", icon: "💳", color: "#635BFF", credentials: "Valid", lastActivity: "On payments", agents: ["AI Support Platform"], workflows: ["Subscription payments", "Tier management", "Webhook processing"], models: "N/A", envSource: "STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET" },

  // Publishing / Content
  { name: "Substack", category: "Publishing / Content", status: "Active", icon: "📰", color: "#FF6719", credentials: "Valid", lastActivity: "Weekly", agents: ["Content Agent"], workflows: ["Bennett's Brief publishing", "Subscriber metrics", "Newsletter distribution"], models: "Sonnet for drafting", envSource: "Substack API (app/api/substack/)" },
  { name: "Buffer", category: "Publishing / Content", status: "Active", icon: "📤", color: "#168EEA", credentials: "Valid", lastActivity: "Daily 9 AM PT", agents: ["Social Media Agent"], workflows: ["Twitter queue (90 tweets)", "Auto-posting", "Scheduling"], models: "N/A", envSource: "Buffer.com (web integration)" },
  { name: "Twitter/X API", category: "Publishing / Content", status: "Active", icon: "🐦", color: "#1DA1F2", credentials: "Valid", lastActivity: "Daily", agents: ["Social Media Agent"], workflows: ["Auto-posting via Buffer", "Growth tracking"], models: "N/A", envSource: "TWITTER_BEARER_TOKEN + OAuth keys" },
  { name: "Instagram", category: "Publishing / Content", status: "Active", icon: "📸", color: "#E1306C", credentials: "Valid", lastActivity: "On demand", agents: ["Social Media Agent"], workflows: ["Direct publishing to @benjamin86m"], models: "N/A", envSource: "Instagram Business API credentials" },

  // Deployment / Infrastructure
  { name: "Vercel", category: "Deployment / Infrastructure", status: "Active", icon: "▲", color: "#FFFFFF", credentials: "Valid", lastActivity: "On deploy", agents: ["Mission Control Builder"], workflows: ["Dashboard hosting", "AI Support hosting", "Auto-deploy from git"], models: "N/A", envSource: "Vercel project bindings" },
  { name: "Tailscale", category: "Deployment / Infrastructure", status: "Active", icon: "🔗", color: "#4A68D1", credentials: "Valid", lastActivity: "Now", agents: ["All (network layer)"], workflows: ["Mac mini at 100.65.157.30", "iPhone connected", "Cross-device access"], models: "N/A", envSource: "Tailscale daemon" },
  { name: "Supabase", category: "Deployment / Infrastructure", status: "Active", icon: "⚡", color: "#3ECF8E", credentials: "Valid", lastActivity: "Now", agents: ["Mission Control Dashboard"], workflows: ["Live dashboard data", "Real-time subscriptions", "Database persistence"], models: "N/A", envSource: "uunqqpqyehxjodvozlgu.supabase.co" },
  { name: "GitHub", category: "Deployment / Infrastructure", status: "Active", icon: "🐙", color: "#F0F0F0", credentials: "Valid", lastActivity: "Today", agents: ["Mission Control Builder"], workflows: ["Code repo (mission-hub)", "Lovable sync", "Version control"], models: "N/A", envSource: "github.com/crypto86m/mission-hub" },

  // Automation
  { name: "Zapier", category: "Automation", status: "Configured", icon: "⚡", color: "#FF4A00", credentials: "Valid", lastActivity: "On triggers", agents: ["Demo Pipeline"], workflows: ["Demo request webhooks", "Email triggers", "CRM automation"], models: "N/A", envSource: "ZAPIER_USER + ZAPIER_PASSWORD" },
  { name: "OpenClaw Crons", category: "Automation", status: "Active", icon: "⏰", color: "#00D4FF", credentials: "N/A", lastActivity: "Every 30 min", agents: ["All agents"], workflows: ["Heartbeat (30 min)", "Email responder (30 min)", "Cost monitor (3h)", "Trading watchdog (3x/day)", "Budget alerts (3x/day)"], models: "Haiku", envSource: "launchd + openclaw cron" },
  { name: "LaunchD Services", category: "Automation", status: "Active", icon: "🚀", color: "#A855F7", credentials: "N/A", lastActivity: "Now", agents: ["System layer"], workflows: ["13 active services: gateway, booking-intake, paper-trader, trading-watchdog, cost-monitor, budget-monitor, operational-excellence, semantic-indexer, servers, encrypted-backup, gdrive-reminder, ai-support-blitz, work-accountability"], models: "N/A", envSource: "~/Library/LaunchAgents/" },

  // Data / Storage
  { name: "Vercel PostgreSQL", category: "Data / Storage", status: "Active", icon: "🗄️", color: "#336791", credentials: "Valid", lastActivity: "On request", agents: ["Mission Control (old)"], workflows: ["Approval persistence", "Dashboard data"], models: "N/A", envSource: "BACKEND_URL (mission-control-app)" },

  // Internal Tools
  { name: "Superhuman", category: "Internal Tools", status: "Active", icon: "📬", color: "#0055FF", credentials: "Valid", lastActivity: "Daily", agents: ["Email management"], workflows: ["Email triage", "Priority sorting", "Smart drafting", "Follow-up tracking"], models: "N/A", envSource: "ben86m@gmail.com (manual)" },
  { name: "Lovable", category: "Internal Tools", status: "Active", icon: "💜", color: "#E879F9", credentials: "Valid", lastActivity: "Now", agents: ["Mission Control Builder"], workflows: ["Dashboard UI generation", "Component building", "Supabase integration"], models: "N/A", envSource: "lovable.dev project" },
];

const categories = [...new Set(integrations.map(i => i.category))];
const statusColors = {
  "Active": "bg-green-500/20 text-green-400 border-green-500/30",
  "Configured": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Planned": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Error": "bg-red-500/20 text-red-400 border-red-500/30",
  "Disabled": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "Needs Setup": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function Integrations() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = integrations.filter(i => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== 'All' && i.status !== filterStatus) return false;
    if (filterCategory !== 'All' && i.category !== filterCategory) return false;
    return true;
  });

  const statuses = [...new Set(integrations.map(i => i.status))];
  const activeCount = integrations.filter(i => i.status === 'Active').length;

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Integrations</h1>
          <p className="text-xs text-gray-400 font-mono">{activeCount}/{integrations.length} ACTIVE • FULL SYSTEM AUDIT</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search integrations..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-3 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilterStatus('All')} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterStatus === 'All' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-400'}`}>All</button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterStatus === s ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-400'}`}>{s}</button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilterCategory('All')} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterCategory === 'All' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-400'}`}>All Categories</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterCategory === c ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-400'}`}>{c}</button>
        ))}
      </div>

      {/* Integration Cards by Category */}
      {(filterCategory === 'All' ? categories : [filterCategory]).map(cat => {
        const catItems = filtered.filter(i => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</h2>
            <div className="space-y-2">
              {catItems.map(i => (
                <button
                  key={i.name}
                  onClick={() => setExpanded(expanded === i.name ? null : i.name)}
                  className="w-full text-left bg-gray-900/60 border border-gray-800 rounded-xl p-3 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-lg" style={{ borderColor: i.color + '40', backgroundColor: i.color + '10' }}>
                      {i.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white truncate">{i.name}</h3>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-mono ${statusColors[i.status] || statusColors['Disabled']}`}>{i.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{i.credentials} • Last: {i.lastActivity}</p>
                    </div>
                  </div>

                  {expanded === i.name && (
                    <div className="mt-3 pt-3 border-t border-gray-800 space-y-2 text-[10px]">
                      <div><span className="text-gray-500">Credentials:</span> <span className={i.credentials === 'Valid' ? 'text-green-400' : i.credentials === 'Not configured' ? 'text-yellow-400' : 'text-white'}>{i.credentials}</span></div>
                      <div><span className="text-gray-500">Last Activity:</span> <span className="text-white">{i.lastActivity}</span></div>
                      <div><span className="text-gray-500">Env Source:</span> <span className="text-cyan-400 font-mono">{i.envSource}</span></div>
                      {i.models !== 'N/A' && <div><span className="text-gray-500">Models:</span> <span className="text-purple-400">{i.models}</span></div>}
                      <div>
                        <span className="text-gray-500">Agents:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {i.agents.map(a => <span key={a} className="px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">{a}</span>)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Workflows:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {i.workflows.map(w => <span key={w} className="px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">{w}</span>)}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Test Connection</button>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700">Configure</button>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
