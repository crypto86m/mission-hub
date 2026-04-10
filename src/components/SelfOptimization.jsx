import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    priority: 'high',
    type: 'efficiency',
    title: 'Reassign Prospect Research',
    description: 'Agent idle for 24h+. Current task (AI Support lead gen) has 0 results. Recommend: switch to NVCC prospect mining or disable to save $4/day.',
    impact: 'Save $4/day + potential NVCC leads',
    agent: 'Prospect Research',
    action: 'Reassign',
  },
  {
    id: 2,
    priority: 'high',
    type: 'revenue',
    title: 'Automate Content → Social Pipeline',
    description: 'Social Media Agent waits manually for Content Agent. Automate handoff: when draft status = "ready", auto-queue to Buffer.',
    impact: 'Eliminate 2-4h delay per content piece',
    agent: 'Social Media + Content Agent',
    action: 'Automate',
  },
  {
    id: 3,
    priority: 'medium',
    type: 'cost',
    title: 'Route RLM Estimator to Haiku',
    description: 'Currently using GPT-4o ($22/day). Bid generation quality is sufficient with Haiku at $3/day. 86% cost reduction.',
    impact: 'Save $19/day ($570/month)',
    agent: 'RLM Estimator',
    action: 'Switch Model',
  },
  {
    id: 4,
    priority: 'medium',
    type: 'revenue',
    title: 'Connect TradingView Webhooks',
    description: 'Trading Bot misses signals outside market hours. TradingView webhooks would enable 24/7 alert monitoring. Estimated +15% signal capture.',
    impact: '+15% trade signals captured',
    agent: 'Trading Bot',
    action: 'Integrate',
  },
  {
    id: 5,
    priority: 'low',
    type: 'efficiency',
    title: 'Batch Email Responder Runs',
    description: 'Currently checks every 30 min. Most emails arrive 8-10 AM. Optimize: check every 10 min during peak, every 2h off-peak.',
    impact: 'Reduce API calls by 60%',
    agent: 'Email Responder',
    action: 'Optimize',
  },
  {
    id: 6,
    priority: 'low',
    type: 'cost',
    title: 'Move Market Research to Off-Peak',
    description: 'Perplexity calls are cheapest during off-peak. Schedule pre-market research at 5:30 AM instead of 6:00 AM.',
    impact: 'Minor cost savings (~$1/day)',
    agent: 'Market Research',
    action: 'Reschedule',
  },
];

const priorityColors = {
  high: 'text-red-400 border-red-400/30 bg-red-400/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  low: 'text-green-400 border-green-400/30 bg-green-400/10',
};

const typeIcons = {
  efficiency: <Zap size={14} className="text-cyan" />,
  revenue: <TrendingUp size={14} className="text-green-400" />,
  cost: <TrendingDown size={14} className="text-yellow-400" />,
};

export default function SelfOptimization() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-yellow-400" />
        <h2 className="text-sm font-bold text-white">AI Optimization Recommendations</h2>
        <span className="text-[10px] font-mono text-gray-400 ml-auto">{recommendations.length} suggestions</span>
      </div>

      <div className="space-y-2">
        {recommendations.map(r => (
          <div key={r.id} className="glass-card">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="mt-0.5 shrink-0">{typeIcons[r.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-xs font-medium text-white">{r.title}</h3>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-mono ${priorityColors[r.priority]}`}>{r.priority}</span>
                </div>
                <p className="text-[10px] text-gray-400">{r.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-gray-500">Impact:</span>
                <span className="text-[9px] text-cyan font-mono">{r.impact}</span>
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-semibold bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20 transition-colors">
                {r.action} <ArrowRight size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
