const apiKey = process.env.ALPACA_API_KEY_PAPER;
const secretKey = process.env.ALPACA_SECRET_KEY_PAPER;
const baseURL = 'https://paper-api.alpaca.markets';

// Cache with 5-second TTL for real-time updates
let cache = {
  data: null,
  timestamp: 0
};

const CACHE_TTL = 5000; // 5 seconds

async function fetchAlpacaAPI(endpoint) {
  const response = await fetch(`${baseURL}${endpoint}`, {
    method: 'GET',
    headers: {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': secretKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchTradingData() {
  // Return cached data if fresh
  if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    // Fetch account info
    const account = await fetchAlpacaAPI('/v2/account');

    // Fetch open positions
    const positionsResp = await fetchAlpacaAPI('/v2/positions');
    const positions = Array.isArray(positionsResp) ? positionsResp : [];

    // Fetch recent orders (trades)
    const ordersResp = await fetchAlpacaAPI('/v2/orders?status=closed&limit=20&direction=desc');
    const orders = Array.isArray(ordersResp) ? ordersResp : [];

    const data = {
      account: {
        equity: account.equity,
        buying_power: account.buying_power,
        cash: account.cash,
        portfolio_value: account.portfolio_value,
      },
      positions: positions.map(p => ({
        symbol: p.symbol,
        qty: p.qty,
        avg_entry_price: p.avg_entry_price,
        current_price: p.current_price,
        unrealized_pl: p.unrealized_pl,
      })),
      trades: orders.map(o => ({
        symbol: o.symbol,
        side: o.side,
        filled_qty: o.filled_qty,
        filled_avg_price: o.filled_avg_price,
        created_at: o.created_at,
      })),
      timestamp: new Date().toISOString(),
    };

    cache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Error fetching trading data from Alpaca:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await fetchTradingData();
    
    // Set cache headers for real-time updates
    res.setHeader('Cache-Control', 'max-age=5, s-maxage=5');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch trading data',
      message: error.message,
    });
  }
}
