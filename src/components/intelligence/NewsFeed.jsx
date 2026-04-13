import React, { useState } from 'react';
import { Newspaper, TrendingUp, Users, Zap, ExternalLink, Heart } from 'lucide-react';

export default function NewsFeed() {
  const [newsItems] = useState([
    {
      id: 1,
      category: 'Market',
      source: 'Bloomberg',
      time: '2m ago',
      title: 'Fed Keeps Rates Steady at 4.75% - April Decision',
      summary: 'Federal Reserve holds interest rates unchanged amid mixed inflation signals. Powell hints at potential cuts later in 2026 if inflation continues to cool.',
      impact: 'Market positive',
      relevance: 95,
      symbol: 'SPY',
    },
    {
      id: 2,
      category: 'Tech',
      source: 'CNBC',
      time: '15m ago',
      title: 'NVIDIA Beats Q1 Earnings, Guides Higher for Q2',
      summary: 'NVIDIA reported record revenue from AI chip sales, beating estimates by 12%. Company issued strong guidance, signaling continued AI boom.',
      impact: 'Stock positive',
      relevance: 88,
      symbol: 'NVDA',
    },
    {
      id: 3,
      category: 'SaaS',
      source: 'TechCrunch',
      time: '38m ago',
      title: 'Customer Support AI Market Heating Up - New Unicorn in 7 Cities',
      summary: 'AI-powered customer support platforms attracting major VC funding. Market projected to reach $25B by 2028, growing 24% annually.',
      impact: 'Industry positive',
      relevance: 92,
      symbol: 'AI Support',
    },
    {
      id: 4,
      category: 'Trading',
      source: 'MarketWatch',
      time: '52m ago',
      title: 'Options Market Shows Bullish Sentiment - Put/Call at 0.92',
      summary: 'Put/call ratio dips below 1.0 for second consecutive day, indicating traders moving into protective stances despite bullish price action.',
      impact: 'Neutral',
      relevance: 78,
      symbol: 'ES',
    },
    {
      id: 5,
      category: 'Macro',
      source: 'Reuters',
      time: '1h ago',
      title: 'S&P 500 Sectors Show Divergence - Tech Leads, Energy Lags',
      summary: 'Technology sector up 2.3% while energy declines 1.2%. Breadth indicators show 72% of stocks in bullish trends.',
      impact: 'Market positive',
      relevance: 85,
      symbol: 'SPY',
    },
    {
      id: 6,
      category: 'Company',
      source: 'SEC Filing',
      time: '2h ago',
      title: 'Tesla Reports 15% Production Decline, Cites Supply Chain Issues',
      summary: 'Q1 Tesla production came in below expectations. Company attributes slowdown to supply chain constraints affecting global operations.',
      impact: 'Stock negative',
      relevance: 72,
      symbol: 'TSLA',
    },
  ]);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [likedItems, setLikedItems] = useState(new Set());

  const categories = ['All', 'Market', 'Tech', 'SaaS', 'Trading', 'Macro', 'Company'];

  const getImpactColor = (impact) => {
    if (impact.includes('positive')) return 'bg-green-500/20 text-green-400';
    if (impact.includes('negative')) return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SaaS':
        return '💼';
      case 'Tech':
        return '🖥️';
      case 'Trading':
        return '📈';
      case 'Market':
        return '📊';
      case 'Macro':
        return '🌍';
      case 'Company':
        return '🏢';
      default:
        return '📰';
    }
  };

  const filteredNews = categoryFilter === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.category === categoryFilter);

  const toggleLike = (id) => {
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedItems(newLiked);
  };

  return (
    <div className="space-y-6">
      {/* News Feed Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-gray-400 text-xs mb-2">Feed Items</p>
          <p className="text-3xl font-bold text-cyan">{newsItems.length}</p>
          <p className="text-xs text-gray-500 mt-1">Last 24h</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-xs mb-2">High Impact</p>
          <p className="text-3xl font-bold text-green-400">4</p>
          <p className="text-xs text-gray-500 mt-1">Relevance >80%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-xs mb-2">Sentiment</p>
          <p className="text-3xl font-bold text-green-400">+65%</p>
          <p className="text-xs text-gray-500 mt-1">Bullish bias</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-cyan text-dark-bg'
                : 'bg-dark-card border border-gray-600 text-gray-400 hover:text-cyan'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Items */}
      <div className="space-y-3">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="glass-card overflow-hidden hover:border-cyan/50 transition-colors"
          >
            <div className="p-4">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCategoryIcon(news.category)}</span>
                  <div>
                    <p className="text-xs text-gray-400">
                      {news.source} • {news.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getImpactColor(news.impact)}`}>
                    {news.impact}
                  </span>
                  <button
                    onClick={() => toggleLike(news.id)}
                    className={`transition-colors ${
                      likedItems.has(news.id) ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
                    }`}
                  >
                    <Heart size={16} fill={likedItems.has(news.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2 hover:text-cyan transition-colors cursor-pointer">
                {news.title}
              </h3>

              {/* Summary */}
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                {news.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Relevance:</span>
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
                        style={{ width: `${news.relevance}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-300">{news.relevance}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-dark-bg border border-gray-600 rounded text-gray-400">
                    {news.symbol}
                  </span>
                  <button className="text-xs px-2 py-1 bg-cyan/20 text-cyan hover:bg-cyan/30 transition-colors rounded flex items-center gap-1">
                    <ExternalLink size={12} />
                    Read
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SaaS Trends Section */}
      <div className="glass-card p-6 border-l-4 border-cyan">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users size={20} className="text-cyan" />
          SaaS Industry Trends
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <span className="text-green-400 font-semibold">✓ AI Support Market Expansion:</span> Customer support AI platforms attracting $4.2B in VC funding YTD. Total TAM growing to $25B by 2028.
          </p>
          <p>
            <span className="text-green-400 font-semibold">✓ Consolidation Wave:</span> 35 M&A deals in customer support space in 2025. Platform incumbents acquiring point solutions.
          </p>
          <p>
            <span className="text-green-400 font-semibold">✓ SMB Focus:</span> Vendors targeting $1-50M revenue companies with simplified pricing ($49-$199/month).
          </p>
        </div>
      </div>

      {/* Market Movers Alert */}
      <div className="glass-card p-6 bg-orange-500/5 border border-orange-500/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-orange-400" />
          Key Market Movers
        </h3>
        <div className="space-y-2">
          <div className="p-2 bg-dark-bg/50 rounded text-sm">
            <p className="font-semibold text-cyan">NVDA</p>
            <p className="text-xs text-gray-400">+2.1% on earnings beat - AI demand continues</p>
          </div>
          <div className="p-2 bg-dark-bg/50 rounded text-sm">
            <p className="font-semibold text-red-400">TSLA</p>
            <p className="text-xs text-gray-400">-1.2% on lower guidance - supply chain concerns</p>
          </div>
          <div className="p-2 bg-dark-bg/50 rounded text-sm">
            <p className="font-semibold text-green-400">SPY</p>
            <p className="text-xs text-gray-400">+0.8% Fed decision positive - breadth expanding</p>
          </div>
        </div>
      </div>

      {/* News Feed Settings */}
      <div className="glass-card p-4 text-center text-sm">
        <p className="text-gray-400 mb-3">
          News refreshed every 5 minutes via Perplexity API
        </p>
        <button className="px-4 py-2 bg-cyan/20 text-cyan hover:bg-cyan/30 transition-colors rounded text-xs font-medium">
          Configure Alert Preferences
        </button>
      </div>
    </div>
  );
}
