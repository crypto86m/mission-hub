import React, { useState, useEffect } from 'react';

export function BacktestingDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8899/api/metrics');
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-600">Loading metrics...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!metrics) return <div className="text-gray-600">No data</div>;

  const { summary, by_symbol } = metrics;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Total Trades</p>
          <p className="text-2xl font-bold text-gray-900">{summary.total_trades}</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Win Rate</p>
          <p className={`text-2xl font-bold ${summary.win_rate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.win_rate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Total P&L</p>
          <p className={`text-2xl font-bold ${summary.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${summary.total_pnl.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Sharpe Ratio</p>
          <p className={`text-2xl font-bold ${summary.sharpe_ratio >= 1 ? 'text-green-600' : 'text-yellow-600'}`}>
            {summary.sharpe_ratio.toFixed(2)}
          </p>
        </div>
      </div>

      {/* By Symbol Breakdown */}
      <div className="bg-white rounded border border-gray-300 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Symbol</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="text-left py-2 px-2 font-medium text-gray-700">Symbol</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Trades</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Wins</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Losses</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Win %</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Avg P&L</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">Total P&L</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(by_symbol).map(([symbol, data]) => (
                <tr key={symbol} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-2 font-semibold text-gray-900">{symbol}</td>
                  <td className="text-right py-2 px-2 text-gray-700">{data.wins + data.losses}</td>
                  <td className="text-right py-2 px-2 text-green-600">{data.wins}</td>
                  <td className="text-right py-2 px-2 text-red-600">{data.losses}</td>
                  <td className={`text-right py-2 px-2 font-semibold ${data.win_rate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.win_rate.toFixed(1)}%
                  </td>
                  <td className={`text-right py-2 px-2 ${data.avg_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${data.avg_pnl.toFixed(2)}
                  </td>
                  <td className={`text-right py-2 px-2 font-semibold ${data.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${data.total_pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Avg Win</p>
          <p className="text-lg font-semibold text-green-600">${summary.avg_win.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Avg Loss</p>
          <p className="text-lg font-semibold text-red-600">${summary.avg_loss.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
          <p className="text-lg font-semibold text-orange-600">${summary.max_drawdown.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-300">
          <p className="text-sm font-medium text-gray-600">Profit Factor</p>
          <p className="text-lg font-semibold text-gray-900">{summary.profit_factor.toFixed(2)}x</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-right">
        Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}
