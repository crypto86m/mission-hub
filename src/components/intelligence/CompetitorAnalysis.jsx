import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Shield, Zap, ChevronRight } from 'lucide-react';

export default function CompetitorAnalysis() {
  const [competitors] = useState([
    {
      id: 1,
      name: 'Intercom',
      category: 'AI Chat & Support',
      pricing: '$39-$99/month',
      users: '500K+',
      features: ['AI chat', 'Live chat', 'Knowledge base', 'Chatbots'],
      strengths: ['Brand recognition', 'Enterprise integrations', 'AI copilot'],
      weaknesses: ['High pricing', 'Steep learning curve'],
      marketShare: '18%',
      fundedAmount: '$190M',
      trend: '+12%',
    },
    {
      id: 2,
      name: 'Zendesk',
      category: 'Customer Support Platform',
      pricing: '$29-$99/month',
      users: '1M+',
      features: ['Ticketing', 'Multi-channel', 'AI bot', 'Reporting'],
      strengths: ['Established player', 'Deep integrations', 'Scale'],
      weaknesses: ['Complex pricing', 'Legacy UI'],
      marketShare: '25%',
      fundedAmount: '$345M',
      trend: '+8%',
    },
    {
      id: 3,
      name: 'Drift',
      category: 'Conversational AI',
      pricing: '$50-$120/month',
      users: '100K+',
      features: ['Conversational', 'Meeting booking', 'Intent AI', 'Lead routing'],
      strengths: ['Modern UX', 'AI-first approach', 'Fast setup'],
      weaknesses: ['Smaller team', 'Limited reporting'],
      marketShare: '8%',
      fundedAmount: '$85M',
      trend: '+5%',
    },
    {
      id: 4,
      name: 'HubSpot Service Hub',
      category: 'All-in-One Platform',
      pricing: '$50-$3,200/month',
      users: '2M+',
      features: ['CRM', 'Support', 'Ticketing', 'Automation'],
      strengths: ['Complete ecosystem', 'SMB-friendly', 'Free tier'],
      weaknesses: ['Hidden costs', 'UI complexity'],
      marketShare: '22%',
      fundedAmount: '$1.2B',
      trend: '+15%',
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const getPricingLevel = (pricing) => {
    if (pricing.includes('$39') || pricing.includes('$29')) return 'Budget';
    if (pricing.includes('$50') || pricing.includes('$99')) return 'Mid-Market';
    return 'Enterprise';
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">AI Support Platform Market</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-dark-bg/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Total Market Size</p>
            <p className="text-2xl font-bold text-cyan">$18.2B</p>
            <p className="text-xs text-green-400 mt-1">+22% YoY growth</p>
          </div>
          <div className="p-3 bg-dark-bg/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Consolidation Rate</p>
            <p className="text-2xl font-bold text-orange-400">35%</p>
            <p className="text-xs text-gray-500 mt-1">M&A deals/year</p>
          </div>
        </div>
      </div>

      {/* Competitive Positioning */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Competitive Positioning</h3>
        <div className="space-y-4">
          {/* Price vs Features scatter */}
          <div className="p-4 bg-dark-bg/50 rounded-lg">
            <p className="text-sm font-semibold mb-3">Price Position Analysis</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-green-400">
                <p className="font-semibold">Our Position (AI Support)</p>
                <p className="text-gray-300 mt-1">$49/month - $199/month</p>
                <p className="text-green-400 text-xs mt-1">20-30% cheaper than competitors</p>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400">
                  <p className="font-semibold text-xs">Budget Tier</p>
                  <p className="text-gray-300 text-xs mt-1">$29-$49</p>
                </div>
                <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded text-orange-400">
                  <p className="font-semibold text-xs">Premium Tier</p>
                  <p className="text-gray-300 text-xs mt-1">$100-$3,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-2">Direct Competitors</h3>
        {competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="glass-card overflow-hidden transition-all"
          >
            <div
              onClick={() => setExpandedId(expandedId === competitor.id ? null : competitor.id)}
              className="p-4 cursor-pointer hover:bg-cyan/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-cyan">{competitor.name}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-dark-bg border border-cyan/20">
                      {getPricingLevel(competitor.pricing)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{competitor.category}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <DollarSign size={14} />
                      {competitor.pricing}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users size={14} />
                      {competitor.users} users
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${competitor.trend.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp size={14} />
                      {competitor.trend} growth
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan">{competitor.marketShare}</p>
                  <p className="text-xs text-gray-400">market share</p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === competitor.id && (
                <div className="mt-4 pt-4 border-t border-cyan/10 space-y-3 animate-in fade-in">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-2">Key Features</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.features.map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-dark-bg rounded border border-gray-600">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-green-400 font-semibold mb-1">✓ Strengths</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {competitor.strengths.map((s, idx) => (
                          <li key={idx}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-red-400 font-semibold mb-1">✗ Weaknesses</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {competitor.weaknesses.map((w, idx) => (
                          <li key={idx}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-2 bg-dark-bg/50 rounded text-xs text-gray-400">
                    <p><span className="font-semibold text-cyan">Funded:</span> {competitor.fundedAmount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Opportunity Analysis */}
      <div className="glass-card p-6 border-l-4 border-green-500">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-green-400" />
          Market Opportunity
        </h3>
        <div className="space-y-3 text-sm">
          <p className="text-gray-300">
            <span className="text-green-400 font-semibold">✓ Underserved segment:</span> SMBs seeking cheaper, faster alternatives to Zendesk/HubSpot
          </p>
          <p className="text-gray-300">
            <span className="text-green-400 font-semibold">✓ Price advantage:</span> 30-40% cheaper than incumbents with comparable features
          </p>
          <p className="text-gray-300">
            <span className="text-green-400 font-semibold">✓ Speed-to-value:</span> 10x faster deployment vs competitors
          </p>
          <p className="text-gray-300">
            <span className="text-green-400 font-semibold">✓ Market momentum:</span> $18.2B TAM, +22% YoY growth
          </p>
        </div>
      </div>

      {/* Benjamin's Positioning */}
      <div className="glass-card p-6 bg-cyan/5 border border-cyan/30">
        <h3 className="text-lg font-semibold mb-3">Our Competitive Edge</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Shield size={16} className="text-cyan mt-0.5 flex-shrink-0" />
            <span>Founder-operated: Direct access to Benjamin for strategic guidance</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield size={16} className="text-cyan mt-0.5 flex-shrink-0" />
            <span>Open-source foundation: Transparency + community trust</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield size={16} className="text-cyan mt-0.5 flex-shrink-0" />
            <span>Vertical integration: AI Support + RLM Enterprises operations data</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield size={16} className="text-cyan mt-0.5 flex-shrink-0" />
            <span>Lean GTM: Customer acquisition through Bennett's Brief + community</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
