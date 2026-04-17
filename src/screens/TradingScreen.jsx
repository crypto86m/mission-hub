import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, BarChart2, DollarSign, Activity } from 'lucide-react';

async function fetchAlpacaAccount() {
  try {
    const res = await fetch('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': 'PKWEXOYKX72DRSUAM3UH26LWCL',
        'APCA-API-SECRET-KEY': 'CNm9ajzKtfFojB5HyXEWMgYieqpiRKNVjfHSP5BF41kY',
      }
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function fetchAlpacaPositions() {
  try {
    const res = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': 'PKWEXOYKX72DRSUAM3UH26LWCL',
        'APCA-API-SECRET-KEY': 'CNm9ajzKtfFojB5HyXEWMgYieqpiRKNVjfHSP5BF41kY',
      }
    });
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

async function fetchAlpacaOrders() {
  try {
    const res = await fetch('https://paper-api.alpaca.markets/v2/orders?status=closed&limit=20&direction=desc', {
      headers: {
        'APCA-API-KEY-ID': 'PKWEXOYKX72DRSUAM3UH26LWCL',
        'APCA-API-SECRET-KEY': 'CNm9ajzKtfFojB5HyXEWMgYieqpiRKNVjfHSP5BF41kY',
      }
    });
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export default function TradingScreen() {
  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [alpacaError, setAlpacaError] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [acc, pos, ord, status] = await Promise.all([
      fetchAlpacaAccount(),
      fetchAlpacaPositions(),
      fetchAlpacaOrders(),
      fetch('/api/status.json?t=' + Date.now()).then(r => r.json()).catch(() => null),
    ]);
    if (acc) {
      setAccount(acc);
      setAlpacaError(false);
    } else {
      setAlpacaError(true);
    }
    setPositions(pos || []);
    setOrders(ord || []);
    setStatusData(status);
    setLastUpdate(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 30000);
    return () => clearInterval(iv);
  }, [refresh]);

  const t = statusData?.trading || {};
  const equity = account ? parseFloat(account.equity) : (t.accountValue || 0);
  const buyingPower = account ? parseFloat(account.buying_power) : 0;
  const cash = account ? parseFloat(account.cash) : 0;
  const portfolioValue = account ? parseFloat(account.portfolio_value) : 0;
  const totalUnrealized = positions.reduce((sum, p) => sum + parseFloat(p.unrealized_pl || 0), 0);

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold glow-text mb-1">Trading</h1>
          <p className="text-xs text-gray-400">
            {t.phase || 'Paper Trading'} • {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Loading...'}
          </p>
        </div>
        <button onClick={refresh} className={`p-2 rounded-lg bg-cyan/10 border border-cyan/30 ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={16} className="text-cyan" />
        </button>
      </div>

      {alpacaError && (
        <div className="mb-4 glass-card border-yellow-500/20 bg-yellow-500/5 py-2 px-3">
          <p className="text-xs text-yellow-300">⚠️ Alpaca API unavailable from browser (CORS). Showing data from status.json instead.</p>
        </div>
      )}

      {/* Account Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card text-center">
          <DollarSign size={16} className="mx-auto mb-1 text-cyan" />
          <p className="text-2xl font-bold text-white">${equity.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
          <p className="text-[10px] text-gray-400">Account Equity</p>
        </div>
        <div className="glass-card text-center">
          <BarChart2 size={16} className="mx-auto mb-1 text-green-400" />
          <p className="text-2xl font-bold text-white">${(buyingPower || equity * 4).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          <p className="text-[10px] text-gray-400">Buying Power</p>
        </div>
        <div className="glass-card text-center">
          <Activity size={16} className="mx-auto mb-1 text-purple-400" />
          <p className="text-2xl font-bold text-cyan">{t.strategiesLoaded || 9}</p>
          <p className="text-[10px] text-gray-400">Strategies Active</p>
        </div>
        <div className="glass-card text-center">
          <TrendingUp size={16} className="mx-auto mb-1 text-orange-400" />
          <p className={`text-2xl font-bold ${totalUnrealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalUnrealized >= 0 ? '+' : ''}${totalUnrealized.toFixed(2)}
          </p>
          <p className="text-[10px] text-gray-400">Unrealized P&L</p>
        </div>
      </div>

      {/* Daily P&L Bar */}
      <div className="glass-card mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold">Today's P&L</h2>
          <span className="text-xs font-mono text-gray-400">${Math.abs(t.todayPnl || 0).toFixed(2)} / ${t.dailyLimit || 120} limit</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className={`h-2 rounded-full ${Math.abs(t.todayPnl || 0) > (t.dailyLimit || 120) ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(Math.abs(t.todayPnl || 0) / (t.dailyLimit || 120) * 100, 100)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div>
            <p className="text-lg font-bold text-white">{t.todayTrades || 0}</p>
            <p className="text-[9px] text-gray-500">Trades Today</p>
          </div>
          <div>
            <p className={`text-lg font-bold ${(t.todayPnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(t.todayPnl || 0) >= 0 ? '+' : ''}${(t.todayPnl || 0).toFixed(2)}
            </p>
            <p className="text-[9px] text-gray-500">Realized P&L</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{positions.length || t.openPositions || 0}</p>
            <p className="text-[9px] text-gray-500">Open Positions</p>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Open Positions ({positions.length || t.openPositions || 0})</h2>
        {positions.length === 0 ? (
          <div className="glass-card text-center py-8">
            <p className="text-gray-500 text-sm">No open positions</p>
            <p className="text-[10px] text-gray-600 mt-1">Market hours: 6:30 AM – 1:05 PM PT weekdays</p>
          </div>
        ) : (
          <div className="space-y-2">
            {positions.map((pos, i) => {
              const pnl = parseFloat(pos.unrealized_pl || 0);
              const pnlPct = (parseFloat(pos.unrealized_plpc || 0) * 100).toFixed(2);
              const qty = parseFloat(pos.qty);
              const entry = parseFloat(pos.avg_entry_price);
              const current = parseFloat(pos.current_price);
              return (
                <div key={i} className="glass-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{pos.symbol}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${pos.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {pos.side?.toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPct}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{qty} shares @ ${entry.toFixed(2)}</span>
                    <span>Now: ${current.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="glass-card text-center py-6">
            <p className="text-gray-500 text-sm">No recent orders</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {orders.slice(0, 15).map((order, i) => {
              const isBuy = order.side === 'buy';
              return (
                <div key={i} className="glass-card flex items-center gap-3 py-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {order.side?.toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-white">{order.symbol}</span>
                  <span className="text-xs text-gray-400 flex-1">{parseFloat(order.filled_qty || order.qty).toFixed(0)} @ ${parseFloat(order.filled_avg_price || order.limit_price || 0).toFixed(2)}</span>
                  <span className="text-[10px] text-gray-500">{new Date(order.filled_at || order.created_at).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Strategy Info */}
      <div className="glass-card mb-6">
        <h2 className="text-sm font-bold mb-2">Active Strategies</h2>
        <div className="space-y-1.5">
          {['ORB Breakout (TSLA)', 'VWAP Bounce', 'EMA Cross 9/20', 'RSI Oversold Reversal', 'Momentum Scalp', 'Mean Reversion', 'Opening Gap Fill', 'Volume Spike Entry', 'Range Breakout'].map((strat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-gray-300">{strat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
