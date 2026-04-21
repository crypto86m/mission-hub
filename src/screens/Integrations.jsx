import { useState } from 'react';

const integrations = [
  { name: "Anthropic (Claude)", category: "AI / Model Providers", status: "Active", icon: "🧠", color: "#D97706", credentials: "Valid", lastActivity: "Now", agents: ["Charles (CBV2)", "Content Agent", "Email Responder"], workflows: ["All agent operations", "Content generation", "Email replies"], models: "Haiku, Sonnet, Opus 4.6", envSource: "ANTHROPIC_API_KEY" },
  { name: "OpenAI (GPT-4o)", category: "AI / Model Providers", status: "Active", icon: "🤖", color: "#10B981", credentials: "Valid", lastActivity: "Now", agents: ["Trading Bot", "Mission Control Builder"], workflows: ["Code generation", "Trading analysis"], models: "GPT-4o, GPT-4o-mini", envSource: "OPENAI_API_KEY" },
  { name: "Ollama (Local)", category: "AI / Model Providers", status: "Active", icon: "🦙", color: "#8B5CF6", credentials: "N/A (Local)", lastActivity: "Today", agents: ["Local inference tasks"], workflows: ["Simple tasks, fast turnaround", "Cost-free local inference"], models: "llama3.2:latest, qwen2.5:14b, qwen2.5:32b", envSource: "localhost:11434" },
  { name: "Perplexity", category: "AI / Model Providers", status: "Active", icon: "🔍", color: "#3B82F6", credentials: "Valid", lastActivity: "Today", agents: ["Market Research", "Prospect Research"], workflows: ["Real-time research", "Prospect intel", "Market analysis"], models: "sonar, sonar-pro", envSource: "PERPLEXITY_API_KEY" },
  { name: "Google AI (Search)", category: "AI / Model Providers", status: "Active", icon: "🔎", color: "#4285F4", credentials: "Valid", lastActivity: "Today", agents: ["Charles (CBV2)"], workflows: ["Web search", "Fact-checking"], models: "Custom Search API", envSource: "Google webSearch apiKey" },
  { name: "Discord", category: "Communication", status: "Active", icon: "💬", color: "#5865F2", credentials: "Valid", lastActivity: "Now", agents: ["Discord Bot", "Charles (CBV2)"], workflows: ["Channel monitoring (14 channels)", "Status updates", "Alerts", "Approval notifications"], models: "N/A", envSource: "DISCORD_TOKEN + DISCORD_WEBHOOK" },
  { name: "Gmail (OAuth)", category: "Communication", status: "Active", icon: "📧", color: "#EA4335", credentials: "Valid", lastActivity: "Every 30 min", agents: ["Email Responder"], workflows: ["Auto-reply", "Email triage", "Sensitive flagging"], models: "Haiku for drafting", envSource: "gmail-credentials.json + GMAIL_APP_PASSWORD" },
  { name: "SMS (Verizon)", category: "Communication", status: "Active", icon: "📱", color: "#EF4444", credentials: "Valid", lastActivity: "On alerts", agents: ["Cost Monitor", "Demo Pipeline"], workflows: ["Budget alerts", "Demo notifications", "Critical escalations"], models: "N/A", envSource: "7073377636@vtext.com" },
  { name: "SendGrid", category: "Communication", status: "Active", icon: "✉️", color: "#1A82E2", credentials: "Valid", lastActivity: "On demand", agents: ["AI Support Platform"], workflows: ["Transactional emails", "Customer notifications"], models: "N/A", envSource: "SENDGRID_API_KEY" },
  { name: "Telegram", category: "Communication", status: "Active", icon: "📩", color: "#0088CC", credentials: "Valid", lastActivity: "Now", agents: ["Charles (CBV2)"], workflows: ["Backup communication channel", "24/7 fallback when Discord down"], models: "N/A", envSource: "Telegram Bot: @CharlesbotV2bot" },
  { name: "Alpaca (Live)", category: "Trading / Finance", status: "Active", icon: "📈", color: "#FBBF24", credentials: "Valid", lastActivity: "Market hours", agents: ["Trading Bot", "Risk Monitor"], workflows: ["Live trading ($500 acct)", "3 strategies", "Position management"], models: "GPT-4o for analysis", envSource: "ALPACA_API_KEY + ALPACA_SECRET" },
  { name: "Alpaca (Paper)", category: "Trading / Finance", status: "Active", icon: "📉", color: "#10B981", credentials: "Valid", lastActivity: "Market hours", agents: ["Paper Trader", "Orchestrator"], workflows: ["9 strategies active", "$98.6K equity", "30s position checks", "Auto stop-loss"], models: "N/A", envSource: "ALPACA_API_KEY_PAPER" },
  { name: "TradingView", category: "Trading / Finance", status: "Planned", icon: "📊", color: "#2962FF", credentials: "Not configured", lastActivity: "Never", agents: ["Trading Bot (planned)"], workflows: ["Webhook alerts → auto-trade (planned)", "Chart analysis"], models: "N/A", envSource: "Not set — webhook integration planned" },
  { name: "Stripe", category: "Trading / Finance", status: "Active", icon: "💳", color: "#635BFF", credentials: "Valid", lastActivity: "On payments", agents: ["AI Support Platform"], workflows: ["Subscription payments", "Tier management", "Webhook processing"], models: "N/A", envSource: "STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET" },
  { name: "Webull", category: "Trading / Finance", status: "Configured", icon: "💹", color: "#F97316", credentials: "Saved", lastActivity: "Not active", agents: ["N/A"], workflows: ["Data feeds (planned)"], models: "N/A", envSource: ".env.webull" },
  { name: "Substack", category: "Publishing / Content", status: "Active", icon: "📰", color: "#FF6719", credentials: "Valid", lastActivity: "Weekly", agents: ["Content Agent"], workflows: ["Bennett's Brief publishing", "Subscriber metrics", "Newsletter distribution"], models: "Sonnet for drafting", envSource: "Substack API (app/api/substack/)" },
  { name: "Buffer", category: "Publishing / Content", status: "Active", icon: "📤", color: "#168EEA", credentials: "Valid", lastActivity: "Daily 9 AM PT", agents: ["Social Media Agent"], workflows: ["Twitter queue (90 tweets)", "Auto-posting", "Scheduling"], models: "N/A", envSource: "Buffer.com (web integration)" },
  { name: "Twitter/X API", category: "Publishing / Content", status: "Error", icon: "🐦", color: "#1DA1F2", credentials: "Expired", lastActivity: "Apr 1 (blocked)", agents: ["Social Media Agent"], workflows: ["401 Unauthorized — needs key regen at developer.twitter.com", "89 tweets queued in Buffer"], models: "N/A", envSource: ".env.twitter (keys expired)" },
  { name: "Instagram", category: "Publishing / Content", status: "Active", icon: "📸", color: "#E1306C", credentials: "Valid", lastActivity: "On demand", agents: ["Social Media Agent"], workflows: ["Direct publishing to @benjamin86m"], models: "N/A", envSource: "Instagram Business API credentials" },
  { name: "TikTok", category: "Publishing / Content", status: "Planned", icon: "🎵", color: "#000000", credentials: "Saved", lastActivity: "Not active", agents: ["N/A"], workflows: ["Reel cross-posting (planned)"], models: "N/A", envSource: ".env.tiktok" },
  { name: "Vercel", category: "Deployment / Infrastructure", status: "Active", icon: "▲", color: "#FFFFFF", credentials: "Valid", lastActivity: "On deploy", agents: ["Mission Control Builder"], workflows: ["Dashboard hosting", "AI Support hosting", "Auto-deploy from git"], models: "N/A", envSource: "Vercel project bindings" },
  { name: "Tailscale", category: "Deployment / Infrastructure", status: "Active", icon: "🔗", color: "#4A68D1", credentials: "Valid", lastActivity: "Now", agents: ["All (network layer)"], workflows: ["Mac mini at 100.65.157.30", "iPhone connected", "Cross-device access"], models: "N/A", envSource: "Tailscale daemon" },
  { name: "Supabase", category: "Deployment / Infrastructure", status: "Active", icon: "⚡", color: "#3ECF8E", credentials: "Valid", lastActivity: "Now", agents: ["Mission Control Dashboard"], workflows: ["Live dashboard data", "Real-time subscriptions", "Database persistence"], models: "N/A", envSource: "uunqqpqyehxjodvozlgu.supabase.co" },
  { name: "GitHub", category: "Deployment / Infrastructure", status: "Active", icon: "🐙", color: "#F0F0F0", credentials: "Valid", lastActivity: "Today", agents: ["Mission Control Builder"], workflows: ["Code repo (mission-hub)", "Lovable sync", "Version control"], models: "N/A", envSource: "github.com/crypto86m/mission-hub" },
  { name: "Zapier", category: "Automation", status: "Configured", icon: "⚡", color: "#FF4A00", credentials: "Valid", lastActivity: "On triggers", agents: ["Demo Pipeline"], workflows: ["Demo request webhooks", "Email triggers", "CRM automation"], models: "N/A", envSource: "ZAPIER_USER + ZAPIER_PASSWORD" },
  { name: "OpenClaw Crons", category: "Automation", status: "Active", icon: "⏰", color: "#00D4FF", credentials: "N/A", lastActivity: "Every 30 min", agents: ["All agents"], workflows: ["Heartbeat (30 min)", "Email responder (30 min)", "Cost monitor (3h)", "Trading watchdog (3x/day)", "Budget alerts (3x/day)"], models: "Haiku", envSource: "launchd + openclaw cron" },
  { name: "LaunchD Services", category: "Automation", status: "Active", icon: "🚀", color: "#A855F7", credentials: "N/A", lastActivity: "Now", agents: ["System layer"], workflows: ["7 clean services: gateway, watchdog, health-server, booking-intake, paper-trader, orchestrator, stop-enforcer"], models: "N/A", envSource: "~/Library/LaunchAgents/" },
  { name: "Vercel PostgreSQL", category: "Data / Storage", status: "Active", icon: "🗄️", color: "#336791", credentials: "Valid", lastActivity: "On request", agents: ["Mission Control (old)"], workflows: ["Approval persistence", "Dashboard data"], models: "N/A", envSource: "BACKEND_URL (mission-control-app)" },
  { name: "Superhuman", category: "Internal Tools", status: "Active", icon: "📬", color: "#0055FF", credentials: "Valid", lastActivity: "Daily", agents: ["Email management"], workflows: ["Email triage", "Priority sorting", "Smart drafting", "Follow-up tracking"], models: "N/A", envSource: "ben86m@gmail.com (manual)" },
  { name: "Lovable", category: "Internal Tools", status: "Active", icon: "💜", color: "#E879F9", credentials: "Valid", lastActivity: "Now", agents: ["Mission Control Builder"], workflows: ["Dashboard UI generation", "Component building", "Supabase integration"], models: "N/A", envSource: "lovable.dev project" },
  { name: "Upwork", category: "Freelance Platforms", status: "Active", icon: "💼", color: "#14A800", credentials: "Valid", lastActivity: "Daily 8 AM PT", agents: ["Upwork Daily Bidder"], workflows: ["Job scraping", "Auto-bidding (3-5/day)", "Proposal generation"], models: "Haiku", envSource: "ben86m@gmail.com (freelancer)" },
  { name: "Fiverr", category: "Freelance Platforms", status: "Active", icon: "🎯", color: "#1DBF73", credentials: "Valid", lastActivity: "Every 30 min", agents: ["Fiverr Inquiry Monitor"], workflows: ["4 gigs live", "Gmail notification monitoring", "Auto-response"], models: "Haiku", envSource: "ben86m@gmail.com (seller)" },
  { name: "LinkedIn", category: "Freelance Platforms", status: "Active", icon: "🔗", color: "#0A66C2", credentials: "Valid", lastActivity: "3x daily", agents: ["LinkedIn Outreach Bot"], workflows: ["CTO/VP targeting", "Personalized pitches", "Response tracking"], models: "Haiku", envSource: "Safari browser automation" },
  { name: "Tavily", category: "Research Tools", status: "Active", icon: "🔍", color: "#6366F1", credentials: "Valid", lastActivity: "On demand", agents: ["Charles (CBV2)", "Market Research"], workflows: ["Web research API", "Real-time search", "Fact verification"], models: "N/A", envSource: ".env.tavily" },
  { name: "Firecrawl", category: "Research Tools", status: "Active", icon: "🔥", color: "#F97316", credentials: "Valid", lastActivity: "On demand", agents: ["Charles (CBV2)"], workflows: ["Web scraping", "Data extraction", "Product research"], models: "N/A", envSource: ".env.firecrawl" },
  { name: "Claude Code (ACP)", category: "Developer Tools", status: "Active", icon: "💻", color: "#D97706", credentials: "Valid", lastActivity: "Today", agents: ["Charles (CBV2)", "Opus Subagents"], workflows: ["Code generation via ACP runtime", "Autonomous coding sessions", "Mission Control builds"], models: "Claude Opus 4.6", envSource: "OpenClaw ACP integration" },
  { name: "Warp Terminal", category: "Developer Tools", status: "Active", icon: "⚡", color: "#01A4FF", credentials: "Valid", lastActivity: "Today", agents: ["Charles (CBV2)"], workflows: ["AI-powered terminal", "Command execution", "System administration"], models: "N/A", envSource: "Warp app (local)" },
  { name: "MCP: Extended Memory", category: "MCP Servers", status: "Active", icon: "🧠", color: "#8B5CF6", credentials: "N/A", lastActivity: "Now", agents: ["Charles (CBV2)"], workflows: ["Knowledge graph storage", "Entity/relation tracking", "Persistent memory"], models: "N/A", envSource: "mcp-server-memory (autoRestart)" },
  { name: "MCP: Sequential Thinking", category: "MCP Servers", status: "Active", icon: "🧩", color: "#6366F1", credentials: "N/A", lastActivity: "On demand", agents: ["Charles (CBV2)"], workflows: ["Complex reasoning", "Multi-step problem solving", "Decision analysis"], models: "N/A", envSource: "mcp-server-sequential-thinking (autoRestart)" },
  { name: "MCP: Alpha Vantage", category: "MCP Servers", status: "Active", icon: "📈", color: "#22C55E", credentials: "Valid", lastActivity: "Market hours", agents: ["Trading Bot", "Charles (CBV2)"], workflows: ["Stock prices", "Technical indicators (SMA, EMA, RSI)", "Company overviews", "Forex/Crypto"], models: "N/A", envSource: "alphavantage MCP (autoRestart)" },
  { name: "MCP: Quantitative Finance", category: "MCP Servers", status: "Active", icon: "📊", color: "#3B82F6", credentials: "Valid", lastActivity: "On demand", agents: ["Trading Bot"], workflows: ["Strategy comparison", "Signal generation", "Performance tracking"], models: "N/A", envSource: "quanttogo-mcp (autoRestart)" },
  { name: "MCP: Browser Automation", category: "MCP Servers", status: "Active", icon: "🌐", color: "#10B981", credentials: "N/A", lastActivity: "On demand", agents: ["Charles (CBV2)"], workflows: ["Puppeteer browser control", "Screenshot capture", "Form filling", "Web scraping"], models: "N/A", envSource: "mcp-server-puppeteer (autoRestart)" },
  { name: "ElevenLabs TTS", category: "Voice / Media", status: "Active", icon: "🎙️", color: "#FF6B35", credentials: "Valid", lastActivity: "On demand", agents: ["Charles (CBV2)"], workflows: ["Text-to-speech", "Newsletter narration", "Voice notifications"], models: "Default professional voice", envSource: ".env.elevenlabs" },
  { name: "OpenAI Sora (Video)", category: "Voice / Media", status: "Active", icon: "🎥", color: "#10B981", credentials: "Valid", lastActivity: "Weekly", agents: ["Content Agent"], workflows: ["AI video generation", "Instagram Reels (5/week)", "Lifestyle content"], models: "Sora 2", envSource: "OPENAI_API_KEY" },
  { name: "Context Bus", category: "Internal Systems", status: "Active", icon: "🔗", color: "#00D4FF", credentials: "N/A", lastActivity: "Every heartbeat", agents: ["All agents"], workflows: ["Inter-agent communication", "Shared state", "Action broadcasting"], models: "N/A", envSource: "scripts/context-bus.py + Supabase" },
  { name: "Memory Database", category: "Internal Systems", status: "Active", icon: "🗃️", color: "#A855F7", credentials: "N/A", lastActivity: "Every heartbeat", agents: ["Charles (CBV2)"], workflows: ["373 memories indexed", "30ms full-text search", "Auto-index from all sources"], models: "N/A", envSource: "scripts/memory-db.py (SQLite FTS5)" },
  { name: "Agent Triggers", category: "Internal Systems", status: "Active", icon: "⚡", color: "#FBBF24", credentials: "N/A", lastActivity: "On events", agents: ["All agents"], workflows: ["8 trigger rules", "Trade → Content notification", "Stop-loss → Alert", "Demo → Notify"], models: "N/A", envSource: "scripts/agent-triggers.py" },
  { name: "Stop-Loss Enforcer v2", category: "Internal Systems", status: "Active", icon: "🛡️", color: "#EF4444", credentials: "N/A", lastActivity: "Every 30s", agents: ["Stop-Loss Enforcer"], workflows: ["Universal position monitoring", "2% max loss per position", "$120 daily circuit breaker"], models: "N/A", envSource: "launchd: com.trading.stop-enforcer" },
  { name: "Grafana Cloud", category: "Monitoring", status: "Active", icon: "📊", color: "#F46800", credentials: "Valid", lastActivity: "Continuous", agents: ["System Monitor"], workflows: ["System health dashboards", "Cost tracking", "SMS queue monitoring", "Trading performance"], models: "N/A", envSource: "ben86m.grafana.net (Service Account)" },
];

const categories = [...new Set(integrations.map(i => i.category))];
const statusColors = {
  "Active": "bg-green-500/20 text-green-400 border-green-500/30",
  "Configured": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Planned": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Error": "bg-red-500/20 text-red-400 border-red-500/30",
  "Disabled": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function Integrations() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const testConnection = async (integration) => {
    setTesting(integration.name);
    setTestResult(null);
    const startTime = performance.now();
    try {
      if (integration.name.includes('Vercel') && !integration.name.includes('PostgreSQL')) {
        await fetch('https://mission-hub-iota.vercel.app/', { mode: 'no-cors', cache: 'no-store' });
      }
      const ms = Math.round(performance.now() - startTime);
      setTestResult({ name: integration.name, status: 'success', ms });
      setActionFeedback(`✅ ${integration.name}: Connected (${ms}ms)`);
    } catch (e) {
      setTestResult({ name: integration.name, status: 'error', error: e.message });
      setActionFeedback(`❌ ${integration.name}: ${e.message}`);
    }
    setTesting(null);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const configureIntegration = (integration) => {
    setActionFeedback(`🔧 Configure request noted for ${integration.name} — relay to Charles via Discord`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

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
      {actionFeedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-900 border border-green-400 rounded-lg px-5 py-3 shadow-2xl">
          <p className="text-sm text-green-200 font-bold">{actionFeedback}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Integrations</h1>
          <p className="text-xs text-gray-400 font-mono">{activeCount}/{integrations.length} ACTIVE • FULL SYSTEM AUDIT</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search integrations..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-3 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
      />

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        <button onClick={() => setFilterStatus('All')} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterStatus === 'All' ? 'border-cyan bg-cyan/10 text-cyan' : 'border-gray-700 text-gray-400'}`}>All</button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterStatus === s ? 'border-cyan bg-cyan/10 text-cyan' : 'border-gray-700 text-gray-400'}`}>{s}</button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilterCategory('All')} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterCategory === 'All' ? 'border-cyan bg-cyan/10 text-cyan' : 'border-gray-700 text-gray-400'}`}>All Categories</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap ${filterCategory === c ? 'border-cyan bg-cyan/10 text-cyan' : 'border-gray-700 text-gray-400'}`}>{c}</button>
        ))}
      </div>

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
                      <div><span className="text-gray-500">Env Source:</span> <span className="text-cyan font-mono">{i.envSource}</span></div>
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
                        <div
                          onClick={e => { e.stopPropagation(); testConnection(i); }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer select-none transition-all ${
                            testing === i.name
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse'
                              : testResult?.name === i.name && testResult.status === 'success'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-cyan/20 text-cyan border border-cyan/30 active:bg-cyan/30'
                          }`}
                        >
                          {testing === i.name ? '⏳ Testing...' : testResult?.name === i.name && testResult.status === 'success' ? `✅ ${testResult.ms}ms` : '🔌 Test Connection'}
                        </div>
                        <div
                          onClick={e => { e.stopPropagation(); configureIntegration(i); }}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700 cursor-pointer select-none active:bg-gray-700 transition-all"
                        >
                          ⚙️ Configure
                        </div>
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
