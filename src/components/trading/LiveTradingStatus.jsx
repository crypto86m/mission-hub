import React, { useState, useEffect } from 'react';

export function LiveTradingStatus() {
  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        setLoading(true);
        
        // Fetch account data
        const accountRes = await fetch('/api/trading?endpoint=account');
        const accountData = await accountRes.json();
        setAccount(accountData);

        // Fetch positions
        const posRes = await fetch('/api/trading?endpoint=positions');
        const posData = await posRes.json();
        setPositions(Array.isArray(posData) ? posData : []);

        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch trading data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchTradingData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchTradingData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-50 p-4">
        <p className="text-red-700">❌ Connection error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <p className="text-gray-600">Loading trading data...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <p className="text-gray-600">No trading data available</p>
      </div>
    );
  }

  const equity = parseFloat(account.equity || 0);
  const cash = parseFloat(account.cash || 0);
  const dailyPnL = account.cash_withdrawable ? parseFloat(account.cash_withdrawable) : 0;

  return (
    <div className="space-y-4">
      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-300 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Account Equity</p>
          <p className="text-2xl font-bold text-gray-900">${equity.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="rounded-lg border border-gray-300 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Cash Available</p>
          <p className="text-2xl font-bold text-gray-900">${cash.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>

        <div className="rounded-lg border border-gray-300 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Daily P&L</p>
          <p className={`text-2xl font-bold ${dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${dailyPnL.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Open Positions */}
      <div className="rounded-lg border border-gray-300 bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Positions ({positions.length})</h3>
        
        {positions.length === 0 ? (
          <p className="text-gray-500">No open positions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Symbol</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Side</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">Qty</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">Entry</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">Current</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">P&L</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">%</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => {
                  const entryPrice = parseFloat(pos.avg_fill_price);
                  const currentPrice = parseFloat(pos.current_price);
                  const pnl = parseFloat(pos.unrealized_pl);
                  const pnlPct = ((currentPrice - entryPrice) / entryPrice * 100).toFixed(2);

                  return (
                    <tr key={pos.symbol} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-2 font-semibold text-gray-900">{pos.symbol}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          pos.side === 'long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {pos.side === 'long' ? 'LONG' : 'SHORT'}
                        </span>
                      </td>
                      <td className="text-right py-2 px-2 text-gray-700">{parseFloat(pos.qty).toFixed(0)}</td>
                      <td className="text-right py-2 px-2 text-gray-700">${entryPrice.toFixed(2)}</td>
                      <td className="text-right py-2 px-2 text-gray-700">${currentPrice.toFixed(2)}</td>
                      <td className={`text-right py-2 px-2 font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${pnl.toFixed(2)}
                      </td>
                      <td className={`text-right py-2 px-2 font-semibold ${parseFloat(pnlPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(pnlPct) >= 0 ? '+' : ''}{pnlPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Last Update */}
      <p className="text-xs text-gray-500 text-right">
        Last updated: {lastUpdate?.toLocaleTimeString()}
      </p>
    </div>
  );
}
