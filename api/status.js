/**
 * Vercel Serverless Function: /api/status
 * Serves live dashboard data from mission-hub status.json
 * Called by the frontend every time the Dashboard component loads/refreshes
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Try to read from public/api/status.json
    const statusPath = path.join(process.cwd(), 'public', 'api', 'status.json');
    
    let data;
    if (fs.existsSync(statusPath)) {
      const fileContent = fs.readFileSync(statusPath, 'utf-8');
      data = JSON.parse(fileContent);
    } else {
      // Fallback: return empty/default structure
      data = {
        generated: new Date().toISOString(),
        trading: { accountValue: 0, openPositions: 0, todayPnl: 0 },
        costs: { today: 0, monthTotal: 0, monthlyBudget: 200 },
        newsletter: { subscribers: 0, issuesPublished: 0 },
        instagram: { followers: 0, engagementRate: 0 },
        agents: { cronJobs: 0, cronHealthy: 0 },
        companies: { rlm: {}, nvcc: {} }
      };
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=30');

    res.status(200).json(data);
  } catch (error) {
    console.error('Status API error:', error);
    res.status(500).json({ error: 'Failed to load status' });
  }
}
