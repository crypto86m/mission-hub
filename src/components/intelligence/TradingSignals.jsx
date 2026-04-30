import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, TrendingDown, AlertTriangle, Target, Volume2 } from 'lucide-react';

export default function TradingSignals() {
  const [signals] = useState([
    {
      id: 1,
      symbol: 'SPY',
      type: 'ORB - Breakout',
      status: 'ACTIVE',
      entry: 563.22,
      target: 567.50,
      stopLoss: 560.50,
      riskReward: 2.8,
      confidence: 92,
      setup: 'Opening range breakout above 564.00 resistance',
      indicators: ['EMA(9) > EMA(20)', 'Volume spike 140%', 'RSI(14) 68-72'],
      timeframe: '5m / 15m',
      color: 'green',
    },
    {
      id: 2,
      symbol: 'QQQ',
      type: 'VWAP Retest',
      status: 'ACTIVE',
      entry: 471.35,
      target: 475.80,
      stopLoss: 468.90,
      riskReward: 2.1,
      confidence: 78,
      setup: 'Price retesting VWAP from below - bullish continuation',
      indicators: ['Price > VWAP', 'EMA(50) bullish slope', 'MACD bullish crossover'],
      timeframe: '1h / 4h',
      color: 'green',
    },
    {
      id: 3,
      symbol: 'TSLA',
      type: 'Support Bounce',
      status: 'SETUP',
      entry: 234.80,
      target: 242.50,
      stopLoss: 230.00,
      riskReward: 1.9,
      confidence: 71,
      setup: 'Testing 50-day MA support - historically strong bounce zone',
      indicators: ['50-day MA support', 'Volume declining', 'Stochastic oversold'],
      timeframe: '1h',
      color: 'yellow',
    },
    {
      id: 4,
      symbol: 'NVDA',
      type: 'Bearish Flag',
      status: 'CAUTION',
      entry: 950.00,
      target: 920.00,
      stopLoss: 975.00,
      riskReward: 2.0,
      confidence: 65,
      setup: 'Consolidating after run-up - potential reversal pattern',
      indicators: ['Lower highs/lows', 'Volume declining', 'RSI overbought'],
      timeframe: '4h',
      color: 'red',
    },
    {
      id: 5,
      symbol: 'ES (MES)',
      type: 'Swing Breakout',
      status: 'ACTIVE',
      entry: 5742.00,
      target: 5805.00,
      stopLoss: 5710.00,
      riskReward: 2.4,
      confidence: 85,
      setup: 'S&P 500 E-mini breakout with strong vol on the break',
      indicators: ['Volume surge 160%', 'Breakout of consolidation', 'Trend following'],
      timeframe: '5m / 15m',
      color: 'green',
    },
  ]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'SETUP':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'CAUTION':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Trading Signal Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Active Signals</p>
            <Zap size={18} className="text-cyan" />
          </div>
          <p className="text-3xl font-bold text-green-400">3</p>
          <p className="text-xs text-gray-500 mt-1">Ready to trade</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Avg Risk/Reward</p>
            <Target size={18} className="text-cyan" />
          </div>
          <p className="text-3xl font-bold text-cyan">2.34:1</p>
          <p className="text-xs text-gray-500 mt-1">Above 2:1 target</p>
        </div>
      </div>

      {/* Signal Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Today's Trading Signals</h3>
        {signals.map((signal) => (
          <div key={signal.id} className={`glass-card overflow-hidden border-l-4 ${
            signal.color === 'green' ? 'border-green-500' : 
            signal.color === 'yellow' ? 'border-yellow-500' : 
            'border-red-500'
          }`}>
            {/* Header */}
            <div className="p-4 bg-dark-bg/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-cyan">{signal.symbol}</h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusBadgeStyle(signal.status)}`}>
                      {signal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{signal.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-16 h-6 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className={`absolute inset-0 ${getConfidenceBg(signal.confidence)} transition-all`}
                        style={{ width: `${signal.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-200">{signal.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Setup Description */}
              <p className="text-sm text-gray-300 mb-3 p-3 bg-dark-bg rounded border border-gray-700">
                {signal.setup}
              </p>
            </div>

            {/* Trade Details */}
            <div className="px-4 py-3 border-t border-gray-700">
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Entry</p>
                  <p className="text-sm font-bold text-cyan">${signal.entry.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Target</p>
                  <p className="text-sm font-bold text-green-400">${signal.target.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Stop</p>
                  <p className="text-sm font-bold text-red-400">${signal.stopLoss.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">R/R</p>
                  <p className="text-sm font-bold text-yellow-400">{signal.riskReward.toFixed(1)}:1</p>
                </div>
              </div>

              {/* Indicators */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 font-semibold mb-2">Confirmations</p>
                <div className="flex flex-wrap gap-1">
                  {signal.indicators.map((ind, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30">
                      ✓ {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeframe */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Timeframe: {signal.timeframe}</span>
                <button className="px-3 py-1 bg-cyan/20 text-cyan rounded hover:bg-cyan/30 transition-colors text-xs font-medium">
                  More Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signal Legend */}
      <div className="glass-card p-4">
        <p className="text-xs text-gray-400 font-semibold mb-3">Signal Status Legend</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-300">ACTIVE - Ready now</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300">SETUP - Watch level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-300">CAUTION - Risky</span>
          </div>
        </div>
      </div>

      {/* Trading Rules */}
      <div className="glass-card p-4 border-l-4 border-cyan">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle size={16} className="text-cyan" />
          Trading Rules
        </h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Risk max 2% per trade on position sizing</li>
          <li>• Target 2:1 minimum risk/reward ratio</li>
          <li>• Wait for 3+ indicator confirmations</li>
          <li>• Trail stops after 50% profit reached</li>
          <li>• Max 5 concurrent positions in market hours</li>
        </ul>
      </div>
    </div>
  );
}
