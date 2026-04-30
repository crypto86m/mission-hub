import React, { useState } from 'react';
import { Eye, TrendingUp, TrendingDown, AlertTriangle, Plus, X } from 'lucide-react';

export default function WatchlistMonitor() {
  const [watchlist] = useState([
    {
      id: 1,
      symbol: 'SPY',
      price: 563.45,
      change: 2.34,
      percentChange: 0.42,
      dayHigh: 568.90,
      dayLow: 559.20,
      volume: '125.3M',
      alerts: ['Near resistance', 'High volume'],
      notes: 'Core portfolio holding - track for breakout',
    },
    {
      id: 2,
      symbol: 'QQQ',
      price: 471.82,
      change: 3.12,
      percentChange: 0.67,
      dayHigh: 475.60,
      dayLow: 467.50,
      volume: '87.6M',
      alerts: ['Volume rising'],
      notes: 'Tech exposure - watch 475 level',
    },
    {
      id: 3,
      symbol: 'TSLA',
      price: 234.56,
      change: -2.15,
      percentChange: -0.91,
      dayHigh: 241.20,
      dayLow: 231.00,
      volume: '156.2M',
      alerts: ['Below SMA50', 'Bearish'],
      notes: 'Momentum downturn - watch for bounce at 50-day MA',
    },
    {
      id: 4,
      symbol: 'NVDA',
      price: 948.23,
      change: 5.67,
      percentChange: 0.60,
      dayHigh: 955.00,
      dayLow: 935.20,
      volume: '45.1M',
      alerts: ['Overbought', 'New ATH'],
      notes: 'Trending strong - potential pullback coming',
    },
    {
      id: 5,
      symbol: 'AMD',
      price: 187.34,
      change: 1.23,
      percentChange: 0.66,
      dayHigh: 189.50,
      dayLow: 183.40,
      volume: '72.8M',
      alerts: [],
      notes: 'Semi-bullish - consolidating before move',
    },
    {
      id: 6,
      symbol: 'BTC/USD',
      price: 67340,
      change: 1245,
      percentChange: 1.88,
      dayHigh: 68200,
      dayLow: 65800,
      volume: '$28.3B',
      alerts: ['Breaking resistance', 'Volume surge'],
      notes: 'Crypto strength - Fed-correlated',
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const getAlertColor = (alert) => {
    if (alert.includes('Bearish') || alert.includes('Below')) return 'bg-red-500/20 text-red-400';
    if (alert.includes('Overbought') || alert.includes('Resistance')) return 'bg-orange-500/20 text-orange-400';
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Watchlist Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-gray-400 text-xs mb-2">Total Watched</p>
          <p className="text-3xl font-bold text-cyan">{watchlist.length}</p>
          <p className="text-xs text-gray-500 mt-1">Instruments</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-xs mb-2">Portfolio Correlation</p>
          <p className="text-3xl font-bold text-green-400">+0.78</p>
          <p className="text-xs text-gray-500 mt-1">SPY-correlated</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-xs mb-2">Active Alerts</p>
          <p className="text-3xl font-bold text-orange-400">7</p>
          <p className="text-xs text-gray-500 mt-1">Price actions</p>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Eye size={20} className="text-cyan" />
          Active Watchlist
        </h3>
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="glass-card overflow-hidden transition-all"
          >
            <div
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="p-4 cursor-pointer hover:bg-cyan/5"
            >
              {/* Main Row */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-bold text-cyan">{item.symbol}</h4>
                  </div>
                  <p className="text-sm text-gray-400">${item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-bold flex items-center justify-end gap-1 ${
                    item.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(item.change).toFixed(2)}
                  </p>
                  <p className={`text-sm font-semibold ${item.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {item.alerts.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.alerts.map((alert, idx) => (
                    <span key={idx} className={`text-xs px-2 py-1 rounded ${getAlertColor(alert)}`}>
                      {alert}
                    </span>
                  ))}
                </div>
              )}

              {/* Expanded Details */}
              {expandedId === item.id && (
                <div className="mt-4 pt-4 border-t border-cyan/10 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-dark-bg/50 rounded">
                      <p className="text-xs text-gray-400 mb-1">Day High</p>
                      <p className="text-sm font-bold text-green-400">${item.dayHigh.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-dark-bg/50 rounded">
                      <p className="text-xs text-gray-400 mb-1">Day Low</p>
                      <p className="text-sm font-bold text-red-400">${item.dayLow.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-2 bg-dark-bg/50 rounded">
                    <p className="text-xs text-gray-400 mb-1">Volume</p>
                    <p className="text-sm font-bold text-cyan">{item.volume}</p>
                  </div>

                  <div className="p-3 bg-cyan/5 border border-cyan/20 rounded">
                    <p className="text-xs text-gray-400 font-semibold mb-1">📝 Notes</p>
                    <p className="text-sm text-gray-300">{item.notes}</p>
                  </div>

                  {/* Price Level Alerts */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 font-semibold">Set Price Alerts</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Buy at..."
                        className="flex-1 px-2 py-1 text-xs bg-dark-bg border border-gray-600 rounded text-white placeholder-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="Sell at..."
                        className="flex-1 px-2 py-1 text-xs bg-dark-bg border border-gray-600 rounded text-white placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Management Panel */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-400" />
          Portfolio Risk Analysis
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-dark-bg/50 rounded">
            <span className="text-sm">Correlation with SPY</span>
            <span className="font-bold text-cyan">+0.78</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-dark-bg/50 rounded">
            <span className="text-sm">Beta Weighted</span>
            <span className="font-bold text-green-400">1.12x</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-dark-bg/50 rounded">
            <span className="text-sm">Diversification</span>
            <span className="font-bold text-yellow-400">Moderate</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-dark-bg/50 rounded">
            <span className="text-sm">Drawdown Risk</span>
            <span className="font-bold text-orange-400">24% max</span>
          </div>
        </div>
      </div>

      {/* Add to Watchlist */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Plus size={18} className="text-cyan" />
          <p className="font-semibold">Add Symbol to Watchlist</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter ticker (e.g., MSFT, GOOG, BTC/USD)"
            className="flex-1 px-3 py-2 text-sm bg-dark-bg border border-gray-600 rounded text-white placeholder-gray-500"
          />
          <button className="px-4 py-2 bg-cyan/20 text-cyan hover:bg-cyan/30 transition-colors rounded font-medium text-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
