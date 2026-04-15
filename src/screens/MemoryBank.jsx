import React, { useState } from 'react';
import { Search, Calendar, Tag, FileText, ChevronDown } from 'lucide-react';

const memories = [
  { id: 1, title: 'Live Trading Approved — $500 Account', date: 'April 2, 2026', category: 'Trading Decisions', preview: 'Benjamin approved live trading with $500 capital on Alpaca account 215596978. Three strategies: Bollinger Squeeze QQQ ($250), ORB 30-min QQQ ($150), RSI Extremes SPY ($100). Max daily loss $80. Auto-starts 6:20 AM PT weekdays.', content: 'Full approval details: Account 215596978, $500 capital. Strategies validated through backtesting. TSLA ORB 30-min: 83 trades, 51.8% WR, +0.094R. Risk parameters: max daily loss $80 (16%), daily target $15-25 (3-5%). Auto-starts via launchd + 15-min watchdog. Capital gate: 6 criteria must pass before scaling.' },
  { id: 2, title: 'Mission Statement: Systems first. Discipline always.', date: 'March 30, 2026', category: 'Business Strategy', preview: 'Finalized mission statement after deep strategy session. Core principle: build systems that work without you, then maintain discipline to follow them.', content: 'Systems first. Discipline always. Share everything. This became the operating philosophy for all businesses and agents. Every decision filters through: Does this create a system? Does this maintain discipline? Does this share knowledge?' },
  { id: 3, title: 'AI Support Platform — Production Live', date: 'April 2, 2026', category: 'Technical Architecture', preview: 'All 8 phases complete. 12 pages, 33 API endpoints. Stripe payments live. Ready for beta customers. Revenue target: $5K MRR by April 30.', content: 'Full stack deployed to Vercel + Railway PostgreSQL. Three pricing tiers: Starter ($29/mo), Pro ($99/mo), Enterprise (custom). Features: AI chat widget, knowledge base, ticket system, analytics dashboard, team management. Stripe integration verified.' },
  { id: 4, title: 'Full Operational Autonomy Activated', date: 'April 3, 2026', category: 'Business Strategy', preview: 'Benjamin granted full autonomy for email, Discord, Instagram, trading briefs, cost tracking. Approval needed only for: paper→live trading, external commitments, public statements, budget >$100.', content: 'Autonomous: Email read/reply (flags sensitive), Discord (24/7, all 13 channels), Instagram publishing, daily pre-market briefs, weekly briefings, cost tracking, model routing. Needs approval: Paper→live trading, external platform commitments, public statements, major budget decisions.' },
  { id: 5, title: 'Cost Crisis — $502 in 7 Days', date: 'April 6, 2026', category: 'Business Strategy', preview: 'API costs hit $502 in 7 days vs $200/month budget. Root cause: Opus model used by default instead of Haiku. Fixed by switching default to Haiku.', content: 'Was running Opus ($15/M tokens) for everything. Fixed by: setting default model to Haiku ($0.25/M tokens), budget monitor cron (3x/day), SMS + Discord alerts at $50/$100/$150/$180 thresholds. Cost dropped from $67/day to target $10-20/day.' },
  { id: 6, title: 'Operational Excellence Standard', date: 'April 7, 2026', category: 'Business Strategy', preview: '10 non-negotiable disciplines established. 20-min status updates, mandatory reasons for blockers, 20% time buffer, decision forcing, weekly reviews.', content: 'The 10 disciplines: 1) 20-min status updates, 2) BLOCKED/IDLE require reason, 3) 20% time buffer on estimates, 4) 20-min silence escalation, 5) Git commits for real progress only, 6) 5-min decision forcing, 7) Task switch logging, 8) Incident reports on violations, 9) Weekly automated review, 10) Emergency override separate from silence.' },
  { id: 7, title: 'Mission Control Dashboard — Lovable Build', date: 'April 9, 2026', category: 'Technical Architecture', preview: '8-screen dashboard built on Lovable with Supabase backend. Orbital hub, tasks kanban, calendar, agents, integrations (27), intelligence center, weekly scorecard.', content: 'Tech stack: React + Vite + Tailwind. Hosted on Lovable preview. GitHub repo: crypto86m/mission-hub. Supabase backend with 6 tables. 27 integrations audited. Agent Intelligence Command Center with graph/grid/flow views.' },
  { id: 8, title: 'Bennett\'s Brief — Newsletter Launch', date: 'April 8, 2026', category: 'Business Strategy', preview: '6 issues published. 7 subscribers (confirmed). Newsletter distribution via Substack.', content: 'Phase 2 live. Auto-drafts via Claude. Distribution dashboard on Mission Control. Weekly themes: Mon=Market, Tue=Leadership, Wed=Systems, Thu=Trading, Fri=Lifestyle.' },
  { id: 9, title: 'Perplexity + Superhuman Approved', date: 'April 9, 2026', category: 'Business Strategy', preview: 'Benjamin approved Perplexity (research API) and Superhuman (email management) as new external tools. Use Perplexity BEFORE web search. Superhuman for email triage.', content: 'Perplexity: API key in ~/.env, models sonar/sonar-pro. Cost ~$0.005/query. Use for prospect research, market data, competitive analysis. Superhuman: ben86m@gmail.com, full control for email triage, priority sorting, smart drafting.' },
  { id: 10, title: 'Model Routing Rules', date: 'April 9, 2026', category: 'Technical Architecture', preview: 'Hierarchy: Shell Script → Ollama (free) → Haiku → Perplexity (research) → Sonnet → Opus. All code → GPT-4o. Never change without Benjamin approval.', content: 'Shell scripts first (deterministic, free). Ollama for simple tasks (llama3.2, qwen2.5:14b). Haiku for 90% of tasks. Perplexity for research. Sonnet for complex analysis. Opus reserved for highest-stakes work. All coding → GPT-4o.' },
];

const categories = ['All', 'Business Strategy', 'Trading Decisions', 'Technical Architecture', 'Meeting Notes', 'Archive'];

export default function MemoryBank() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = memories.filter(m => {
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.preview.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && m.category !== category) return false;
    return true;
  });

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">
      <h1 className="text-3xl font-bold glow-text mb-2">Memory Bank</h1>
      <p className="text-gray-400 mb-2">{memories.length} memories • Searchable knowledge base</p>
      <p className="text-[10px] text-yellow-400/70 mb-4">ℹ️ Historical snapshots from workspace memory files. Not connected to live memory API.</p>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search memories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-cyan/20 rounded-lg text-sm text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors ${
              category === c ? 'border-cyan bg-cyan/10 text-cyan' : 'border-gray-700 text-gray-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Memory Cards */}
      <div className="space-y-3">
        {filtered.map(m => (
          <button
            key={m.id}
            onClick={() => setExpanded(expanded === m.id ? null : m.id)}
            className="w-full text-left glass-card hover:border-cyan/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={14} className="text-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white mb-1">{m.title}</h3>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] text-gray-500 font-mono">{m.date}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-cyan/20 text-cyan bg-cyan/5">{m.category}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{m.preview}</p>
              </div>
              <ChevronDown size={14} className={`text-gray-500 shrink-0 mt-1 transition-transform ${expanded === m.id ? 'rotate-180' : ''}`} />
            </div>

            {expanded === m.id && (
              <div className="mt-3 pt-3 border-t border-cyan/10">
                <p className="text-xs text-gray-300 leading-relaxed">{m.content}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText size={32} className="mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No memories match your search</p>
        </div>
      )}
    </div>
  );
}
