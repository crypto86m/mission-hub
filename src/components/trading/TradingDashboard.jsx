import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function TradingDashboard() {
  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch from our API endpoint
      const response = await fetch('/api/trading');
      if (!response.ok) throw new Error('Failed to fetch trading data');
      
      const data = await response.json();
      setAccount(data.account);
      setPositions(data.positions || []);
      setTrades(data.trades || []);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading && !account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Trading Dashboard</h1>
          <button
            onClick={fetchData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
            title="Refresh data"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}

        {/* Account Summary Cards */}
        {account && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {/* Equity Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 sm:p-6 text-white">
              <p className="text-xs sm:text-sm text-blue-100 uppercase tracking-wide">Account Equity</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                ${parseFloat(account.equity).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Buying Power Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4 sm:p-6 text-white">
              <p className="text-xs sm:text-sm text-green-100 uppercase tracking-wide">Buying Power</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                ${parseFloat(account.buying_power).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Cash Card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 sm:p-6 text-white">
              <p className="text-xs sm:text-sm text-purple-100 uppercase tracking-wide">Cash</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                ${parseFloat(account.cash).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Portfolio Value Card */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-4 sm:p-6 text-white">
              <p className="text-xs sm:text-sm text-orange-100 uppercase tracking-wide">Portfolio Value</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                ${parseFloat(account.portfolio_value).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* Positions Section */}
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 mb-6 border border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Open Positions ({positions.length})</h2>
          
          {positions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No open positions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 px-2 sm:px-3 text-gray-300 font-semibold">Symbol</th>
                    <th className="text-right py-2 px-2 sm:px-3 text-gray-300 font-semibold">Shares</th>
                    <th className="text-right py-2 px-2 sm:px-3 text-gray-300 font-semibold">Entry</th>
                    <th className="text-right py-2 px-2 sm:px-3 text-gray-300 font-semibold">Current</th>
                    <th className="text-right py-2 px-2 sm:px-3 text-gray-300 font-semibold">Unrealized P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos) => {
                    const unrealized = parseFloat(pos.unrealized_pl || 0);
                    const isProfit = unrealized >= 0;
                    return (
                      <tr key={pos.symbol} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-2 sm:px-3 text-white font-semibold">{pos.symbol}</td>
                        <td className="text-right py-3 px-2 sm:px-3 text-gray-300">{parseFloat(pos.qty).toFixed(2)}</td>
                        <td className="text-right py-3 px-2 sm:px-3 text-gray-300">
                          ${parseFloat(pos.avg_entry_price).toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-2 sm:px-3 text-gray-300">
                          ${parseFloat(pos.current_price).toFixed(2)}
                        </td>
                        <td className={`text-right py-3 px-2 sm:px-3 font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          ${unrealized.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Trade Log Section */}
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Recent Trades</h2>
          
          {trades.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent trades</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 px-2 sm:px-3 text-gray-300 font-semibold">Time</th>
                    <th className="text-left py-2 px-2 sm:px-3 text-gray-300 font-semibold">Symbol</th>
                    <th className="text-left py-2 px-2 sm:px-3 text-gray-300 font-semibold">Side</th>
                    <th className="text-right py-2 px-2 sm:px-3 text-gray-300 font-semibold">Qty</th>
                    <th className="text-right py-2 px-2 sm:px-3 text-gray-300 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, idx) => {
                    const isBuy = trade.side?.toLowerCase() === 'buy';
                    return (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-2 sm:px-3 text-gray-300">
                          {new Date(trade.created_at).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-white font-semibold">{trade.symbol}</td>
                        <td className={`py-3 px-2 sm:px-3 font-semibold ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.side?.toUpperCase()}
                        </td>
                        <td className="text-right py-3 px-2 sm:px-3 text-gray-300">{parseFloat(trade.filled_qty).toFixed(2)}</td>
                        <td className="text-right py-3 px-2 sm:px-3 text-gray-300">
                          ${parseFloat(trade.filled_avg_price).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradingDashboard;
