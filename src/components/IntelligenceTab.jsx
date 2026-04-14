import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Intelligence Tab - Market Sentiment + Competitor Intel + Trading Signals
 * Real-time data integration for strategic decisions
 */

export default function IntelligenceTab() {
  const [marketData, setMarketData] = useState({
    vix: 16.5,
    fedSentiment: "Neutral",
    sectorTrends: [],
    tradingSignals: [],
    competitorIntel: [],
    newsFeed: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch market sentiment data
    const fetchIntelligence = async () => {
      try {
        // VIX & Market Sentiment
        const vixResponse = await fetch('/api/market/vix');
        const vixData = await vixResponse.json();

        // Trading Signals
        const signalsResponse = await fetch('/api/trading/signals');
        const signals = await signalsResponse.json();

        // Competitor Intelligence
        const competitorResponse = await fetch('/api/intelligence/competitors');
        const competitors = await competitorResponse.json();

        // News Feed
        const newsResponse = await fetch('/api/intelligence/news');
        const news = await newsResponse.json();

        setMarketData({
          vix: vixData.value || 16.5,
          fedSentiment: vixData.sentiment || "Neutral",
          sectorTrends: vixData.trends || [],
          tradingSignals: signals || [],
          competitorIntel: competitors || [],
          newsFeed: news || []
        });

        setLoading(false);
      } catch (error) {
        console.error('Intelligence fetch failed:', error);
        setLoading(false);
      }
    };

    fetchIntelligence();
    const interval = setInterval(fetchIntelligence, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const marketSentimentScore = () => {
    const vixScore = (20 - marketData.vix) / 20 * 100; // Inverse VIX
    const sentiment = marketData.fedSentiment === "Bullish" ? 80 : 
                     marketData.fedSentiment === "Neutral" ? 50 : 20;
    return Math.round((vixScore + sentiment) / 2);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Intelligence Dashboard</h2>
        <p className="text-gray-600">Market sentiment, signals, and competitive intel</p>
      </div>

      {/* Market Sentiment Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <p className="text-gray-600">VIX Index</p>
          <p className="text-4xl font-bold text-blue-600">{marketData.vix.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-2">Volatility Gauge</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <p className="text-gray-600">Fed Sentiment</p>
          <p className="text-4xl font-bold text-green-600">{marketData.fedSentiment}</p>
          <p className="text-sm text-gray-500 mt-2">Policy Direction</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
          <p className="text-gray-600">Market Sentiment</p>
          <p className="text-4xl font-bold text-purple-600">{marketSentimentScore()}%</p>
          <p className="text-sm text-gray-500 mt-2">Composite Score</p>
        </div>
      </div>

      {/* Trading Signals */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Active Trading Signals</h3>
        {marketData.tradingSignals.length > 0 ? (
          <div className="space-y-3">
            {marketData.tradingSignals.map((signal, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{signal.symbol}</p>
                  <p className="text-sm text-gray-600">{signal.signal} - {signal.confidence}% confidence</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${signal.signal === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                    {signal.target}
                  </p>
                  <p className="text-sm text-gray-500">↑{signal.upside}% upside</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active signals</p>
        )}
      </div>

      {/* Competitor Intelligence */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Competitive Intel</h3>
        {marketData.competitorIntel.length > 0 ? (
          <div className="space-y-3">
            {marketData.competitorIntel.map((competitor, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded">
                <p className="font-semibold">{competitor.name}</p>
                <p className="text-sm text-gray-600">Pricing: ${competitor.pricing} | Customers: {competitor.customers}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No competitor data available</p>
        )}
      </div>

      {/* News Feed */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Relevant News</h3>
        {marketData.newsFeed.length > 0 ? (
          <div className="space-y-3">
            {marketData.newsFeed.map((item, i) => (
              <div key={i} className="p-3 border-l-4 border-blue-500 bg-blue-50">
                <p className="font-semibold">{item.headline}</p>
                <p className="text-sm text-gray-600">{item.source} · {item.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent news</p>
        )}
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-400 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
