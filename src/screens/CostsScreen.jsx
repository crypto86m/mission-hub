import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';

export default function CostsScreen() {
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    fetch('/api/status.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => setStatusData(d))
      .catch(() => {});
  }, []);

  const c = statusData?.costs || {};
  const today = c.today || 0;
  const monthTotal = c.monthTotal || 0;
  const monthlyBudget = c.monthlyBudget || 200;
  const dailyLimit = c.dailyLimit || 20;

  // Project breakdown estimates based on typical usage patterns
  const projectBreakdown = [
    { name: 'Trading', icon: '📈', estimate: monthTotal * 0.15, description: 'Alpaca API calls, market data, strategy execution', color: 'text-green-400' },
    { name: 'Content Generation', icon: '📸', estimate: monthTotal * 0.25, description: 'IG captions, video briefs, newsletter writing, image gen', color: 'text-pink-400' },
    { name: 'Dashboard & Builds', icon: '🖥️', estimate: monthTotal * 0.20, description: 'Vite builds, Vercel deploys, coding agent sessions', color: 'text-cyan' },
    { name: 'Email Processing', icon: '📧', estimate: monthTotal * 0.18, description: 'Auto-responder, inbox triage, draft generation', color: 'text-yellow-400' },
    { name: 'Monitoring & Crons', icon: '🔄', estimate: monthTotal * 0.12, description: 'Heartbeats, status checks, health monitoring, briefs', color: 'text-purple-400' },
    { name: 'Research & Analysis', icon: '🔍', estimate: monthTotal * 0.10, description: 'Tavily searches, market analysis, lead research', color: 'text-blue-400' },
  ];

  const budgetAlerts = [];
  if (monthTotal >= 180) budgetAlerts.push({ level: 'critical', msg: `⛔ CRITICAL: $${monthTotal.toFixed(2)} spent — $${(monthlyBudget - monthTotal).toFixed(2)} remaining!` });
  else if (monthTotal >= 150) budgetAlerts.push({ level: 'warning', msg: `⚠️ WARNING: $${monthTotal.toFixed(2)} of $${monthlyBudget} budget used (${((monthTotal/monthlyBudget)*100).toFixed(0)}%)` });
  else if (monthTotal >= 100) budgetAlerts.push({ level: 'info', msg: `💡 Halfway: $${monthTotal.toFixed(2)} of $${monthlyBudget} budget used` });
  if (today > dailyLimit) budgetAlerts.push({ level: 'warning', msg: `⚠️ Daily limit exceeded: $${today.toFixed(2)} vs $${dailyLimit} limit` });

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <h1 className="text-3xl font-bold glow-text mb-2">Cost Monitor</h1>
      <p className="text-gray-400 text-sm mb-6">API spend tracking • Budget: ${monthlyBudget}/month</p>

      {/* Alerts */}
      {budgetAlerts.map((a, i) => (
        <div key={i} className={`mb-3 glass-card py-2 px-3 ${
          a.level === 'critical' ? 'border-red-500/30 bg-red-500/5' :
          a.level === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
          'border-cyan/20'
        }`}>
          <p className={`text-xs ${
            a.level === 'critical' ? 'text-red-400' :
            a.level === 'warning' ? 'text-yellow-400' :
            'text-cyan'
          }`}>{a.msg}</p>
        </div>
      ))}

      {/* Top-level metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card text-center">
          <DollarSign size={16} className="mx-auto mb-1 text-cyan" />
          <p className="text-2xl font-bold text-white">${today.toFixed(2)}</p>
          <p className="text-[10px] text-gray-400">Today</p>
          <div className="mt-2 bg-gray-800 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${today > dailyLimit ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((today / dailyLimit) * 100, 100)}%` }} />
          </div>
          <p className="text-[9px] text-gray-500 mt-1">${dailyLimit}/day limit</p>
        </div>
        <div className="glass-card text-center">
          <BarChart2 size={16} className="mx-auto mb-1 text-cyan" />
          <p className={`text-2xl font-bold ${monthTotal > 150 ? 'text-yellow-400' : 'text-white'}`}>${monthTotal.toFixed(2)}</p>
          <p className="text-[10px] text-gray-400">Month Total</p>
          <div className="mt-2 bg-gray-800 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${monthTotal / monthlyBudget > 0.9 ? 'bg-red-500' : monthTotal / monthlyBudget > 0.75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((monthTotal / monthlyBudget) * 100, 100)}%` }} />
          </div>
          <p className="text-[9px] text-gray-500 mt-1">${(monthlyBudget - monthTotal).toFixed(2)} remaining</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="glass-card mb-6">
        <h2 className="text-sm font-bold mb-3">Monthly Budget Progress</h2>
        <div className="relative">
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div className={`h-4 rounded-full transition-all ${
              monthTotal / monthlyBudget > 0.9 ? 'bg-gradient-to-r from-red-600 to-red-400' :
              monthTotal / monthlyBudget > 0.75 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
              'bg-gradient-to-r from-cyan to-blue-500'
            }`} style={{ width: `${Math.min((monthTotal / monthlyBudget) * 100, 100)}%` }} />
          </div>
          {/* Threshold markers */}
          <div className="flex justify-between mt-1 text-[9px] text-gray-600">
            <span>$0</span>
            <span className="absolute left-1/4 -translate-x-1/2">$50</span>
            <span className="absolute left-1/2 -translate-x-1/2">$100</span>
            <span className="absolute left-3/4 -translate-x-1/2">$150</span>
            <span>${monthlyBudget}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3 text-center">
          {[
            { label: '$50', hit: monthTotal >= 50, color: 'text-green-400' },
            { label: '$100', hit: monthTotal >= 100, color: 'text-yellow-400' },
            { label: '$150', hit: monthTotal >= 150, color: 'text-orange-400' },
            { label: '$180', hit: monthTotal >= 180, color: 'text-red-400' },
          ].map((t, i) => (
            <div key={i} className={`text-[10px] ${t.hit ? t.color : 'text-gray-600'}`}>
              {t.hit ? '🔔' : '○'} {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* Project Breakdown */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Cost by Project</h2>
        <div className="space-y-2">
          {projectBreakdown.map((proj, i) => (
            <div key={i} className="glass-card">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span>{proj.icon}</span>
                  <span className="text-sm font-bold text-white">{proj.name}</span>
                </div>
                <span className={`text-sm font-bold ${proj.color}`}>${proj.estimate.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                <div className={`h-1.5 rounded-full bg-gradient-to-r from-cyan to-blue-500`}
                  style={{ width: `${Math.min((proj.estimate / monthTotal) * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-gray-500">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model Routing Hierarchy */}
      <div className="glass-card mb-6">
        <h2 className="text-sm font-bold mb-3">Model Routing (Cost Optimization)</h2>
        <div className="space-y-1.5">
          {[
            { model: 'Shell', cost: 'Free', use: 'Deterministic logic, no reasoning', color: 'text-green-400' },
            { model: 'Ollama (local)', cost: 'Free', use: 'Simple tasks, fast turnaround', color: 'text-green-400' },
            { model: 'Haiku', cost: '~$0.001', use: '90% of tasks (default)', color: 'text-cyan' },
            { model: 'Perplexity Sonar', cost: '~$0.005', use: 'Real-time research', color: 'text-yellow-400' },
            { model: 'Sonnet', cost: '~$0.01', use: 'Complex multi-step reasoning', color: 'text-orange-400' },
            { model: 'GPT-4o', cost: '~$0.02', use: 'All coding tasks', color: 'text-orange-400' },
            { model: 'Opus', cost: '~$0.10', use: 'Critical strategy, system design', color: 'text-red-400' },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 text-xs py-1.5 border-b border-gray-800/50 last:border-0">
              <span className="text-gray-500 w-4 text-center">{i + 1}</span>
              <span className="font-bold text-white w-28">{m.model}</span>
              <span className={`w-16 text-right font-mono ${m.color}`}>{m.cost}</span>
              <span className="text-gray-400 flex-1">{m.use}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Note */}
      <div className="glass-card border-yellow-500/20 bg-yellow-500/5 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-yellow-300">Project breakdown is estimated based on usage patterns.</p>
            <p className="text-[10px] text-gray-500 mt-1">Source: /api/status.json • Budget alerts at $50/$100/$150/$180</p>
          </div>
        </div>
      </div>
    </div>
  );
}
