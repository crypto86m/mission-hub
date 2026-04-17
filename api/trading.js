/**
 * TRADING API
 * Vercel Serverless Function
 * Proxies Alpaca API calls for dashboard
 * 
 * Endpoints:
 * - GET /api/trading?endpoint=account
 * - GET /api/trading?endpoint=positions
 * - GET /api/trading?endpoint=orders
 * - GET /api/trading?endpoint=history
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint } = req.query;

  // Alpaca credentials from environment
  const ALPACA_KEY = process.env.ALPACA_API_KEY_PAPER;
  const ALPACA_SECRET = process.env.ALPACA_SECRET_KEY_PAPER;
  const BASE_URL = 'https://paper-api.alpaca.markets/v2';

  if (!ALPACA_KEY || !ALPACA_SECRET) {
    return res.status(500).json({ error: 'Alpaca credentials not configured' });
  }

  // Endpoint mapping
  const endpoints = {
    account: '/account',
    positions: '/positions',
    orders: '/orders?status=all&limit=20&direction=desc',
    history: '/account/portfolio/history?period=1M&timeframe=1D',
  };

  const path = endpoints[endpoint];
  if (!path) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ALPACA_KEY}`,
        'APCA-API-SECRET-KEY': ALPACA_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache response for 30 seconds
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('Trading API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
