/**
 * Instagram Data Loader
 * Loads data from status.json for Instagram metrics.
 * Returns "not connected" placeholders when no real data source exists.
 */

export async function loadInstagramData() {
  try {
    const res = await fetch('/api/status.json?t=' + Date.now());
    const data = await res.json();
    const ig = data.instagram || {};

    if (ig.status === 'not_connected') {
      return {
        account: {
          handle: 'benjamin86m',
          followers: 0,
          engagement_rate: 0,
          status: 'not_connected',
        },
        metrics: {
          views30d: 0,
          interactions30d: 0,
          netGrowth30d: 0,
        },
        connected: false,
      };
    }

    return {
      account: {
        handle: 'benjamin86m',
        followers: ig.followers || 0,
        engagement_rate: ig.engagementRate || 0,
        status: 'connected',
      },
      metrics: {
        views30d: ig.views30d || 0,
        interactions30d: ig.interactions30d || 0,
        netGrowth30d: ig.netGrowth30d || 0,
      },
      connected: true,
    };
  } catch {
    return {
      account: { handle: 'benjamin86m', followers: 0, engagement_rate: 0, status: 'error' },
      metrics: { views30d: 0, interactions30d: 0, netGrowth30d: 0 },
      connected: false,
    };
  }
}

export async function loadPhase1Videos() {
  try {
    const res = await fetch('/api/videos.json');
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    return {
      total: data.videos?.length || 0,
      videos: data.videos || [],
      ready: (data.videos || []).filter(v => v.status === 'ready').length,
    };
  } catch {
    return { total: 0, videos: [], ready: 0 };
  }
}

export async function loadPhase2Posts() {
  try {
    const res = await fetch('/api/content.json');
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    return {
      total: data.instagram?.length || 0,
      posts: data.instagram || [],
    };
  } catch {
    return { total: 0, posts: [] };
  }
}
