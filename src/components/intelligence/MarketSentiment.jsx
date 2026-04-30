import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';

export default function MarketSentiment() {
  const [sentiment, setSentiment] = useState({
    vix: 14.2,
    vixChange: -2.3,
    fedRate: 4.75,
    fedSentiment: 'Neutral',
    marketBreadth: 72,
    highLow: 68,
    adLine: 1850,
    putCall: 0.95,
    sectors: [
      { name: 'Tech', trend: 2.3, sentiment: 'Bullish' },
      { name: 'Healthcare', trend: 0.8, sentiment: 'Neutral' },
      { name: 'Finance', trend: 1.5, sentiment: 'Bullish' },
      { name: 'Energy', trend: -1.2, sentiment: 'Bearish' },
      { name: 'Consumer', trend: 0.2, sentiment: 'Neutral' },
      { name: 'Industrials', trend: 1.8, sentiment: 'Bullish' },
    ],
  });

  const getSentimentColor = (value, isPrice = false) => {
    if (isPrice) {
      return value > 0 ? 'text-green-400' : 'text-red-400';
    }
    if (value > 60) return 'text-green-400';
    if (value > 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (sentiment) => {
    switch (sentiment) {
      case 'Bullish':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'Bearish':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Sentiment Indicators */}
      <div className="grid grid-cols-2 gap-4">
        {/* VIX */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">VIX Index</p>
            <Activity size={18} className="text-cyan" />
          </div>
          <p className="text-3xl font-bold mb-2">{sentiment.vix}</p>
          <p className={`text-sm flex items-center gap-1 ${getSentimentColor(sentiment.vixChange, true)}`}>
            {sentiment.vixChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(sentiment.vixChange)}% {sentiment.vixChange > 0 ? 'Higher' : 'Lower'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Volatility Index (Lower = Calmer)</p>
        </div>

        {/* Market Breadth */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Market Breadth</p>
            <div className={`w-3 h-3 rounded-full ${sentiment.marketBreadth > 60 ? 'bg-green-500' : sentiment.marketBreadth > 40 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
          </div>
          <p className={`text-3xl font-bold mb-2 ${getSentimentColor(sentiment.marketBreadth)}`}>
            {sentiment.marketBreadth}%
          </p>
          <p className="text-xs text-gray-500">Advancers vs Decliners</p>
        </div>

        {/* Fed Rate */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Fed Rate</p>
            <span className="text-cyan text-xs font-semibold">Live</span>
          </div>
          <p className="text-3xl font-bold mb-2">{sentiment.fedRate}%</p>
          <p className="text-xs text-gray-500">{sentiment.fedSentiment} outlook</p>
        </div>

        {/* Put/Call Ratio */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Put/Call Ratio</p>
            <TrendingUp size={18} className="text-cyan" />
          </div>
          <p className="text-3xl font-bold mb-2">{sentiment.putCall}</p>
          <p className="text-xs text-gray-500">&lt;1.0 = Bullish</p>
        </div>
      </div>

      {/* Sector Sentiment */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} className="text-cyan" />
          Sector Sentiment Breakdown
        </h3>
        <div className="space-y-3">
          {sentiment.sectors.map((sector, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium mb-1">{sector.name}</p>
                <p className={`text-xs px-2 py-1 rounded-full w-fit ${getSentimentBg(sector.sentiment)}`}>
                  {sector.sentiment}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold flex items-center gap-1 ${getSentimentColor(sector.trend, true)}`}>
                  {sector.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(sector.trend)}%
                </p>
              </div>
              <div className="w-24 h-1.5 bg-gray-700 rounded-full ml-4">
                <div
                  className={`h-full rounded-full transition-all ${
                    sector.sentiment === 'Bullish'
                      ? 'bg-green-500'
                      : sector.sentiment === 'Bearish'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.abs(sector.trend * 15)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fed Sentiment & Economic Data */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Economic Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-dark-bg/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">High-Low Ratio</p>
            <p className="text-xl font-bold text-green-400">{sentiment.highLow}%</p>
            <p className="text-xs text-gray-500 mt-1">52-week highs vs lows</p>
          </div>
          <div className="p-3 bg-dark-bg/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Advance/Decline Line</p>
            <p className="text-xl font-bold text-cyan">{sentiment.adLine}</p>
            <p className="text-xs text-gray-500 mt-1">Cumulative momentum</p>
          </div>
        </div>
      </div>

      {/* Overall Market Status */}
      <div className={`glass-card p-6 border-l-4 ${sentiment.marketBreadth > 60 ? 'border-green-500' : sentiment.marketBreadth > 40 ? 'border-yellow-500' : 'border-red-500'}`}>
        <h3 className="text-lg font-semibold mb-2">Market Status</h3>
        <p className={`text-sm ${sentiment.marketBreadth > 60 ? 'text-green-400' : sentiment.marketBreadth > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
          {sentiment.marketBreadth > 60
            ? '📈 Strong Bullish Sentiment - Most sectors advancing'
            : sentiment.marketBreadth > 40
            ? '⚖️ Mixed Sentiment - Balanced market action'
            : '📉 Bearish Sentiment - More decliners than advancers'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Low VIX + High breadth = Risk-on environment. Good for breakouts and momentum trades.
        </p>
      </div>
    </div>
  );
}
