import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Zap,
  BarChart3,
  Newspaper,
  Users,
  DollarSign,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import MarketSentiment from '../components/intelligence/MarketSentiment';
import CompetitorAnalysis from '../components/intelligence/CompetitorAnalysis';
import TradingSignals from '../components/intelligence/TradingSignals';
import WatchlistMonitor from '../components/intelligence/WatchlistMonitor';
import NewsFeed from '../components/intelligence/NewsFeed';

export default function Intelligence() {
  const [activeTab, setActiveTab] = useState('market');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold glow-text mb-2">Intelligence Hub</h1>
          <p className="text-gray-400">Market analysis, competitor intel, trading signals & news</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan/20 text-cyan hover:bg-cyan/30 transition-all ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Last Updated */}
      <div className="mb-6 text-xs text-gray-500">
        Last updated: {formatTime(lastRefresh)}
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-cyan/10 pb-0">
        {[
          { id: 'market', label: 'Market Sentiment', icon: BarChart3 },
          { id: 'competitor', label: 'Competitors', icon: Users },
          { id: 'signals', label: 'Trading Signals', icon: Zap },
          { id: 'watchlist', label: 'Watchlist', icon: Eye },
          { id: 'news', label: 'News Feed', icon: Newspaper },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-cyan border-b-2 border-cyan'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'market' && <MarketSentiment />}
        {activeTab === 'competitor' && <CompetitorAnalysis />}
        {activeTab === 'signals' && <TradingSignals />}
        {activeTab === 'watchlist' && <WatchlistMonitor />}
        {activeTab === 'news' && <NewsFeed />}
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs">Market Status</p>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <p className="text-lg font-bold">Open</p>
          <p className="text-xs text-gray-500 mt-1">Trading hours active</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs">VIX Level</p>
            <TrendingDown size={16} className="text-green-400" />
          </div>
          <p className="text-lg font-bold">14.2</p>
          <p className="text-xs text-green-400 mt-1">↓ 2.3% low volatility</p>
        </div>
      </div>
    </div>
  );
}
