// Instagram Data Loader
// Fetches phase 1/2 video and content data from API endpoints

export async function loadInstagramData() {
  try {
    const response = await fetch('/api/instagram/overview.json');
    if (!response.ok) throw new Error('Failed to load Instagram overview');
    return await response.json();
  } catch (err) {
    console.error('Instagram overview error:', err);
    return {
      followers: 0,
      engagementRate: 0,
      monthlyReach: 0,
      contentPostsScheduled: 0,
    };
  }
}

export async function loadPhase1Videos() {
  try {
    const response = await fetch('/api/instagram/phase1-videos.json');
    if (!response.ok) throw new Error('Failed to load Phase 1 videos');
    return await response.json();
  } catch (err) {
    console.error('Phase 1 videos error:', err);
    // Return empty phase structure
    return {
      total: 0,
      completed: 0,
      videos: [],
    };
  }
}

export async function loadPhase2Posts() {
  try {
    const response = await fetch('/api/instagram/phase2-posts.json');
    if (!response.ok) throw new Error('Failed to load Phase 2 posts');
    return await response.json();
  } catch (err) {
    console.error('Phase 2 posts error:', err);
    // Return empty phase structure
    return {
      total: 0,
      completed: 0,
      posts: [],
    };
  }
}
