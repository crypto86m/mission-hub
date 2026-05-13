export const PROJECTS = [
  {
    id: 'atlas',
    name: 'Atlas',
    label: 'Content Video Pipeline',
    category: 'Content',
    status: 'active',
    progress: 62,
    summary: 'Video generation pipeline — HeyGen, Hyperframes, xAI voice. Produces YouTube Shorts, TikTok, Instagram Reels, and long-form content. Feeds from APEX market wins and RLM project highlights.',
    source: 'User named project',
  },
  {
    id: 'apex',
    name: 'Apex',
    label: 'Stock Trades',
    category: 'Trading',
    status: 'degraded',
    progress: 60,
    summary: 'Trade execution/account surface. Awaiting live probe.',
    source: 'User named project',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    label: 'Stock Signals',
    category: 'Trading',
    status: 'active',
    progress: 72,
    summary: 'Signal and strategy monitoring layer for ORB, VWAP, RSI, MACD, EMA, and related signals.',
    source: 'User named project',
  },
  {
    id: 'lookout',
    name: 'Lookout',
    label: 'Opportunity Monitor',
    category: 'Research',
    status: 'active',
    progress: 68,
    summary: 'Daily top opportunities, market scans, and research/watchlist surface.',
    source: 'User named project',
  },
  {
    id: 'command',
    name: 'Command',
    label: 'Mission Control',
    category: 'Infrastructure',
    status: 'active',
    progress: 82,
    summary: 'Main dashboard and single-source-of-truth surface.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'hermes',
    name: 'Hermes',
    label: 'Gateway',
    category: 'Infrastructure',
    status: 'active',
    progress: 80,
    summary: 'Gateway and agent routing layer. Dashboard gateway is online; Mac-local deep probes need manifest sync.',
    source: 'Existing name',
  },
  {
    id: 'clockwork',
    name: 'Clockwork',
    label: 'Cron + LaunchAgents',
    category: 'Infrastructure',
    status: 'degraded',
    progress: 45,
    summary: 'Scheduled jobs, LaunchAgents, and run-history health.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'vault',
    name: 'Vault',
    label: 'Credentials',
    category: 'Security',
    status: 'degraded',
    progress: 58,
    summary: 'Credential inventory, 1Password/env health, and rotation readiness.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'relay',
    name: 'Relay',
    label: 'Email + Gmail',
    category: 'Communication',
    status: 'degraded',
    progress: 40,
    summary: 'Email responder, Gmail/OAuth, and outbound message readiness.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'switchboard',
    name: 'Switchboard',
    label: 'Discord + Telegram',
    category: 'Communication',
    status: 'degraded',
    progress: 52,
    summary: 'Bot messaging, alerts, and chat-command routing.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'dispatch',
    name: 'Dispatch',
    label: "Bennett's Brief",
    category: 'Content',
    status: 'active',
    progress: 76,
    summary: 'Newsletter issues, subscribers, and publication workflow.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'lens',
    name: 'Lens',
    label: 'Instagram + Reels',
    category: 'Content',
    status: 'active',
    progress: 70,
    summary: 'Instagram content, reels, social publishing, and engagement reporting.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'bidline',
    name: 'Bidline',
    label: 'RLM Pipeline',
    category: 'Revenue',
    status: 'active',
    progress: 84,
    summary: 'RLM active projects, bids, margins, and estimating pipeline.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'ignition',
    name: 'Ignition',
    label: 'NVCC Ops',
    category: 'Operations',
    status: 'degraded',
    progress: 48,
    summary: 'Napa Valley Car Club member, venue, project, and content operations.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'mnemos',
    name: 'Mnemos',
    label: 'Obsidian Memory',
    category: 'Memory',
    status: 'degraded',
    progress: 55,
    summary: 'Obsidian vault, memory health, search/retrieval, and dreaming activity.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'concierge',
    name: 'Concierge',
    label: 'AI Support',
    category: 'Revenue',
    status: 'unknown',
    progress: 50,
    summary: 'AI support platform and lead/conversion workflow.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    label: 'Content Pipeline',
    category: 'Content',
    status: 'active',
    progress: 74,
    summary: 'Content drafts, video assets, captions, and publishing handoffs.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
  {
    id: 'ledger',
    name: 'Ledger',
    label: 'Cost Monitor',
    category: 'Finance',
    status: 'active',
    progress: 65,
    summary: 'API cost tracking, budget thresholds, and spend alerts.',
    source: 'Recommended name',
    needsNameApproval: true,
  },
];

export function overlayProjectStatus(projects, health = {}, status = {}) {
  return projects.map((project) => {
    if (project.id === 'command') return { ...project, status: 'active', progress: 90 };
    if (project.id === 'hermes') return { ...project, status: 'active', progress: 86 };
    if (project.id === 'atlas') {
      const atlasStatus = status.atlas;
      if (atlasStatus?.videosQueued !== undefined) {
        return {
          ...project,
          status: 'active',
          progress: Math.min(90, 55 + (atlasStatus.videosQueued || 0) * 5),
          summary: `Video pipeline live. ${atlasStatus.videosQueued ?? 0} queued, ${atlasStatus.publishedThisWeek ?? 0} published this week. Systems: HeyGen, Hyperframes, xAI voice.`,
        };
      }
      return { ...project, status: 'active', progress: 62 };
    }
    if (project.id === 'apex') {
      const live = health.trading_system?.paper_account_live || status.trading?.status === 'LIVE';
      return {
        ...project,
        status: live ? 'active' : 'degraded',
        progress: live ? 82 : 58,
        summary: live
          ? `Trade execution/account surface. Alpaca paper feed live with ${health.trading_system?.open_positions ?? 0} open positions.`
          : 'Trade execution/account surface. Paper trading feed is not live.',
      };
    }
    if (project.id === 'pulse') return { ...project, status: 'active', progress: 72 };
    if (project.id === 'clockwork') {
      const cronLive = health.cron_health?.healthy;
      return { ...project, status: cronLive ? 'active' : 'degraded', progress: cronLive ? 78 : 46 };
    }
    if (project.id === 'dispatch') {
      const subscribers = status.newsletter?.subscribers;
      return { ...project, status: subscribers ? 'active' : 'unknown', progress: subscribers ? 78 : 45 };
    }
    if (project.id === 'lens') {
      const followers = status.instagram?.followers;
      return { ...project, status: followers ? 'active' : 'unknown', progress: followers ? 74 : 48 };
    }
    if (project.id === 'bidline') {
      const activeProjects = status.companies?.rlm?.activeProjects;
      return { ...project, status: activeProjects ? 'active' : 'unknown', progress: activeProjects ? 86 : 50 };
    }
    return project;
  });
}
