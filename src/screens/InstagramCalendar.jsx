import React, { useState } from 'react';
import { Instagram, Eye, Heart, MessageCircle, Bookmark, Share2, Users, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Camera, Clock, Hash, MapPin } from 'lucide-react';

const metrics = {
  period: 'Mar 11 – Apr 9, 2026',
  views: 9347,
  interactions: 236,
  followers: 682,
  netGrowth: 3,
  follows: 12,
  unfollows: 9,
  accountsReached: 2875,
  reachChange: -22.1,
  profileVisits: 216,
  profileVisitChange: -39.2,
  linkTaps: 3,
  engagementRate: 2.52,
  nonFollowerViews: 63.9,
  saves: 5,
  shares: 8,
  comments: 8,
  contentByType: { reels: 78.6, stories: 11.5, posts: 9.8 },
  interactionsByType: { reels: 88.0, stories: 8.7, posts: 3.3 },
  topCities: [
    { city: 'Napa', pct: 37.2 },
    { city: 'Colorado Springs', pct: 3.4 },
    { city: 'San Francisco', pct: 1.8 },
    { city: 'Saint Helena', pct: 1.7 },
    { city: 'American Canyon', pct: 1.2 },
  ],
  demographics: {
    age: [
      { range: '13-17', pct: 0.2 },
      { range: '18-24', pct: 3.7 },
      { range: '25-34', pct: 18.1 },
      { range: '35-44', pct: 48.9 },
      { range: '45-54', pct: 17.0 },
      { range: '55-64', pct: 6.7 },
      { range: '65+', pct: 5.4 },
    ],
    gender: { men: 51.5, women: 48.5 },
  },
};

const weekContent = [
  {
    day: 'Fri Apr 11',
    title: 'The Weekend Mindset',
    type: 'Lifestyle/Mindset',
    goal: 'Saves + Shares',
    length: '20 sec',
    status: 'ready',
    hook: '"Most people see Friday and think time to relax. I see Friday and think time to build."',
    script: 'Most people see Friday and think "time to relax." I see Friday and think "time to build." Not because I don\'t enjoy life. Because I know the compound effect of 52 extra days per year that everyone else wastes. That\'s the real wealth gap. It\'s not talent. It\'s weekends.',
    filmingNotes: 'Film from driver seat (your top format). Sunglasses on, natural light. Background: nice car interior or Napa scenery.',
    overlays: ['0:00 — "FRIDAY MINDSET"', '0:05 — "52 EXTRA DAYS/YEAR"', '0:15 — "THE REAL WEALTH GAP"'],
    hashtags: '#entrepreneur #fridaymindset #napavalley #buildwealth #discipline #systemsthinking #businessowner',
  },
  {
    day: 'Sat Apr 12',
    title: 'My Fleet',
    type: 'Lifestyle/Cars',
    goal: 'Shares + Follows',
    length: '25 sec',
    status: 'ready',
    hook: '"People ask me what I drive. I don\'t just drive — I built a club around it."',
    script: 'People ask me what I drive. I don\'t just drive — I built a club around it. 128 members. $4.2 million in exotic cars. Private events. Napa Valley. This isn\'t a flex. It\'s a business. And it started with one car and one idea.',
    filmingNotes: 'Film at your garage or scenic Napa location. Walk-up → pan → interior → engine start. Use CapCut slow-mo on pan.',
    overlays: ['0:00 — "WHAT I DRIVE"', '0:08 — "128 MEMBERS"', '0:12 — "$4.2M FLEET"', '0:18 — "IT STARTED WITH ONE"'],
    hashtags: '#exoticcars #napavalley #carclub #luxurycars #entrepreneurship #napavalleycarclub',
  },
  {
    day: 'Sun Apr 13',
    title: 'Sunday Reset',
    type: 'BTS/Personal',
    goal: 'Saves + Engagement',
    length: '30 sec',
    status: 'ready',
    hook: '"My Sunday reset in 30 seconds..."',
    script: '6 AM — Review last week\'s numbers. What worked. What didn\'t. No emotions, just data. 7 AM — Plan the week. Three priorities. Not ten. Three. 9 AM — Church and family. Non-negotiable. 2 PM — Pre-load the week. Emails drafted. Calls scheduled. Systems checked. By Monday morning, I\'ve already won the week.',
    filmingNotes: 'Mix of time-lapses + quick clips. Show real desk, notebook, family moment. Authentic > polished.',
    overlays: ['0:00 — "MY SUNDAY RESET"', '0:05 — "6 AM — REVIEW"', '0:10 — "7 AM — PLAN"', '0:15 — "9 AM — FAMILY"', '0:20 — "2 PM — PRE-LOAD"'],
    hashtags: '#sundayreset #weeklyplanning #productivitytips #entrepreneurroutine #napavalley',
  },
  {
    day: 'Mon Apr 14',
    title: 'Nobody Cares About Your Excuses',
    type: 'Business Authority',
    goal: 'Shares + Comments',
    length: '20 sec',
    status: 'ready',
    hook: '"Nobody cares about your excuses. Not your clients. Not your team. Not the market."',
    script: 'Nobody cares about your excuses. Not your clients. Not your team. Not the market. They care about results. I\'ve run a multi-million dollar painting company for 11 years. And I\'ve never once had a client ask me "what went wrong." They ask "when will it be done." Stop explaining. Start delivering.',
    filmingNotes: 'Direct to camera, intense delivery. Close-up face shot. Outdoors or job site background.',
    overlays: ['0:00 — "HARD TRUTH"', '0:05 — "NOBODY CARES"', '0:12 — "RESULTS > EXCUSES"', '0:18 — "START DELIVERING"'],
    hashtags: '#hardtruth #entrepreneurship #nomorexcuses #businessowner #results #napavalley',
  },
  {
    day: 'Tue Apr 15',
    title: 'Napa Valley Morning',
    type: 'Lifestyle/Community',
    goal: 'Local Engagement + Follows',
    length: '25 sec',
    status: 'ready',
    hook: '"This is why I chose Napa Valley."',
    script: 'This is why I chose Napa Valley. Not just for the wine. For the pace. The people. The opportunity. I run businesses here. Raise my family here. And yeah... the drives aren\'t bad either. This is the life I built. And I\'m not done.',
    filmingNotes: 'Cinematic — wide shots, sunrise, slow pan. Mix drone footage with phone. Tag @visitnapavalley.',
    overlays: ['0:00 — "NAPA VALLEY"', '0:08 — "THE PACE. THE PEOPLE."', '0:15 — "THE OPPORTUNITY."', '0:22 — "NOT DONE YET."'],
    hashtags: '#napavalley #winecountry #napacalifornia #napalife #luxurylifestyle #entrepreneurlife',
  },
  {
    day: 'Wed Apr 16',
    title: 'Before & After (RLM)',
    type: 'BTS/Business',
    goal: 'Saves + Profile Visits',
    length: '20 sec',
    status: 'ready',
    hook: '"This is what a $200K painting project looks like before we touch it."',
    script: 'This is what a $200K painting project looks like before we touch it. And this is after. 40 years of experience. Hundreds of projects. Hotels. Hospitals. Wineries. NASA. We don\'t just paint walls. We transform buildings.',
    filmingNotes: 'Need before/after photos from a real project. Use dramatic CapCut transition (swipe reveal).',
    overlays: ['0:00 — "BEFORE"', '0:06 — "AFTER"', '0:12 — "40 YEARS."', '0:18 — "WE TRANSFORM BUILDINGS."'],
    hashtags: '#commercialpainting #beforeandafter #contractor #rlmenterprises #napavalley',
  },
  {
    day: 'Thu Apr 17',
    title: 'My AI Runs My Business',
    type: 'Authority/Tech',
    goal: 'Shares + Comments + Saves',
    length: '25 sec',
    status: 'ready',
    hook: '"I built an AI system that runs parts of my businesses for me."',
    script: 'I built an AI system that runs parts of my businesses for me. It reads my emails. Responds to customers. Monitors my investments. Posts my content. Runs health checks at 2 AM. People think AI is replacing jobs. I think AI is replacing busywork. I still make every big decision. But the 100 small ones? My AI handles those. This is leverage in 2026.',
    filmingNotes: 'Screen recording of dashboard/systems (blur sensitive data). Cut to face for conviction.',
    overlays: ['0:00 — "MY AI RUNS MY BUSINESS"', '0:06 — "EMAILS. CUSTOMERS. INVESTMENTS."', '0:12 — "AI ≠ REPLACING JOBS"', '0:22 — "LEVERAGE IN 2026"'],
    hashtags: '#artificialintelligence #ai #aiautomation #entrepreneur #businessautomation #leverage',
  },
];

const targets = {
  views: { current: 9347, target: 18000, label: 'Views (30d)' },
  saves: { current: 5, target: 30, label: 'Saves (30d)' },
  netFollowers: { current: 3, target: 30, label: 'Net Followers (30d)' },
  linkTaps: { current: 3, target: 20, label: 'Link Taps (30d)' },
};

function MetricCard({ icon, label, value, change, changeLabel }) {
  const isNeg = change !== undefined && change < 0;
  return (
    <div className="bg-dark-card border border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {change !== undefined && (
        <div className={`text-xs mt-1 flex items-center gap-1 ${isNeg ? 'text-red-400' : 'text-green-400'}`}>
          {isNeg ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          {change > 0 ? '+' : ''}{change}%{changeLabel ? ` ${changeLabel}` : ''}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ current, target, label }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{current.toLocaleString()} / {target.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ContentCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const statusColors = { ready: 'bg-green-500/20 text-green-400', filming: 'bg-yellow-500/20 text-yellow-400', posted: 'bg-blue-500/20 text-blue-400' };

  return (
    <div className="bg-dark-card border border-gray-700 rounded-xl p-4 mb-3">
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">{item.day}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[item.status] || statusColors.ready}`}>{item.status}</span>
            <span className="text-xs text-purple-400">{item.type}</span>
          </div>
          <div className="text-white font-semibold">{item.title}</div>
          <div className="text-xs text-gray-400 mt-1">🎯 {item.goal} · ⏱ {item.length}</div>
        </div>
        {open ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-gray-700 pt-3">
          <div>
            <div className="text-xs text-pink-400 font-semibold mb-1">🪝 HOOK</div>
            <div className="text-sm text-gray-300 italic">{item.hook}</div>
          </div>
          <div>
            <div className="text-xs text-cyan font-semibold mb-1 flex items-center gap-1"><Camera size={12} /> FULL SCRIPT</div>
            <div className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">{item.script}</div>
          </div>
          <div>
            <div className="text-xs text-yellow-400 font-semibold mb-1 flex items-center gap-1"><Clock size={12} /> TEXT OVERLAYS</div>
            <div className="space-y-1">
              {item.overlays.map((o, i) => (
                <div key={i} className="text-xs text-gray-400 bg-gray-800/30 rounded px-2 py-1">{o}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-green-400 font-semibold mb-1">🎬 FILMING NOTES</div>
            <div className="text-sm text-gray-300">{item.filmingNotes}</div>
          </div>
          <div>
            <div className="text-xs text-blue-400 font-semibold mb-1 flex items-center gap-1"><Hash size={12} /> HASHTAGS</div>
            <div className="text-xs text-gray-400">{item.hashtags}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstagramCalendar() {
  const [tab, setTab] = useState('calendar');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Instagram size={28} className="text-pink-500" />
        <div>
          <h1 className="text-xl font-bold text-white">Instagram Growth</h1>
          <p className="text-xs text-gray-400">@benjamin86m · {metrics.followers} followers</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        {['calendar', 'analytics', 'audience'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-dark-card text-gray-400 border border-gray-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'calendar' && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">📅 This Week — Apr 11-17</h2>
          <p className="text-xs text-gray-400 mb-4">Tap any card to see the full script, filming notes, and hashtags. Film the night before, post at 9 AM PT.</p>
          {weekContent.map((item, i) => (
            <ContentCard key={i} item={item} index={i} />
          ))}
        </div>
      )}

      {tab === 'analytics' && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">📊 Performance — {metrics.period}</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <MetricCard icon={<Eye size={16} className="text-blue-400" />} label="Views" value={metrics.views} change={null} />
            <MetricCard icon={<Heart size={16} className="text-pink-400" />} label="Interactions" value={metrics.interactions} />
            <MetricCard icon={<Users size={16} className="text-purple-400" />} label="Accounts Reached" value={metrics.accountsReached} change={metrics.reachChange} changeLabel="vs prior" />
            <MetricCard icon={<Eye size={16} className="text-cyan" />} label="Profile Visits" value={metrics.profileVisits} change={metrics.profileVisitChange} changeLabel="vs prior" />
            <MetricCard icon={<Bookmark size={16} className="text-yellow-400" />} label="Saves" value={metrics.saves} />
            <MetricCard icon={<Share2 size={16} className="text-green-400" />} label="Shares" value={metrics.shares} />
            <MetricCard icon={<MessageCircle size={16} className="text-blue-300" />} label="Comments" value={metrics.comments} />
            <MetricCard icon={<TrendingUp size={16} className="text-green-400" />} label="Engagement Rate" value={`${metrics.engagementRate}%`} />
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">🎯 Growth Targets (30 Days)</h3>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-4 mb-6">
            {Object.values(targets).map((t, i) => (
              <ProgressBar key={i} current={t.current} target={t.target} label={t.label} />
            ))}
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">📈 Content Type Performance</h3>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-400 mb-2">Views by Type</div>
            {Object.entries(metrics.contentByType).map(([type, pct]) => (
              <div key={type} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-300 w-16 capitalize">{type}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{pct}%</span>
              </div>
            ))}
          </div>

          <div className="bg-dark-card border border-gray-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Interactions by Type</div>
            {Object.entries(metrics.interactionsByType).map(([type, pct]) => (
              <div key={type} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-300 w-16 capitalize">{type}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan h-3 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'audience' && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">👥 Audience — {metrics.followers} Followers</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <MetricCard icon={<Users size={16} className="text-green-400" />} label="New Follows" value={metrics.follows} />
            <MetricCard icon={<Users size={16} className="text-red-400" />} label="Unfollows" value={metrics.unfollows} />
            <MetricCard icon={<TrendingUp size={16} className="text-purple-400" />} label="Non-Follower Views" value={`${metrics.nonFollowerViews}%`} />
            <MetricCard icon={<Eye size={16} className="text-blue-400" />} label="Link Taps" value={metrics.linkTaps} />
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">📍 Top Locations</h3>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-4 mb-6">
            {metrics.topCities.map((c, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <MapPin size={12} className="text-pink-400" />
                <span className="text-sm text-gray-300 flex-1">{c.city}</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${c.pct * 2.5}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">🎂 Age Range</h3>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-4 mb-6">
            {metrics.demographics.age.map((a, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-300 w-12">{a.range}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div className={`h-3 rounded-full ${a.pct > 40 ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-purple-500/60'}`} style={{ width: `${a.pct * 2}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{a.pct}%</span>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">⚧ Gender</h3>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-4">
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-blue-400">{metrics.demographics.gender.men}%</div>
                <div className="text-xs text-gray-400">Men</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-pink-400">{metrics.demographics.gender.women}%</div>
                <div className="text-xs text-gray-400">Women</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
