/**
 * TRADING API ENDPOINT — Live Alpaca Data
 * GET /api/trading — Returns live account, positions, orders from Alpaca
 */

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ALPACA_KEY = process.env.ALPACA_API_KEY_PAPER || process.env.ALPACA_API_KEY;
  const ALPACA_SECRET = process.env.ALPACA_SECRET_KEY_PAPER || process.env.ALPACA_SECRET_KEY;
  const BASE_URL = process.env.ALPACA_BASE_URL_PAPER || process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';

  if (!ALPACA_KEY || !ALPACA_SECRET) {
    return res.status(200).json({
      connected: false,
      error: 'Alpaca credentials not configured on Vercel',
      accountValue: null,
      unrealizedPnl: null,
      openPositions: 0,
      positions: [],
      todayPnl: null,
    });
  }

  const headers = {
    'APCA-API-KEY-ID': ALPACA_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET,
  };

  try {
    const [accountRes, positionsRes] = await Promise.all([
      fetch(`${BASE_URL}/v2/account`, { headers }),
      fetch(`${BASE_URL}/v2/positions`, { headers }),
    ]);

    if (!accountRes.ok) {
      return res.status(200).json({
        connected: false,
        error: `Alpaca API error: ${accountRes.status}`,
        accountValue: null,
        unrealizedPnl: null,
        openPositions: 0,
        positions: [],
      });
    }

    const account = await accountRes.json();
    const positions = positionsRes.ok ? await positionsRes.json() : [];

    const totalUnrealized = positions.reduce((sum, p) => sum + parseFloat(p.unrealized_pl || 0), 0);

    return res.status(200).json({
      connected: true,
      accountValue: parseFloat(account.equity),
      buyingPower: parseFloat(account.buying_power),
      cash: parseFloat(account.cash),
      unrealizedPnl: totalUnrealized,
      openPositions: positions.length,
      todayPnl: parseFloat(account.equity) - parseFloat(account.last_equity),
      dailyLimit: 120,
      phase: account.status === 'ACTIVE' ? 'Paper Trading' : account.status,
      strategiesLoaded: 20,
      positions: positions.map(p => ({
        symbol: p.symbol,
        qty: parseFloat(p.qty),
        side: p.side,
        avgEntry: parseFloat(p.avg_entry_price),
        currentPrice: parseFloat(p.current_price),
        unrealizedPl: parseFloat(p.unrealized_pl),
        unrealizedPlpc: parseFloat(p.unrealized_plpc),
        marketValue: parseFloat(p.market_value),
      })),
      generated: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(200).json({
      connected: false,
      error: err.message,
      accountValue: null,
      unrealizedPnl: null,
      openPositions: 0,
      positions: [],
    });
  }
};
