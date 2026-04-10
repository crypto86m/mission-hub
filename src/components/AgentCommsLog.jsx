import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const handoffs = [
  { id: 1, from: 'Market Research', to: 'Trading Bot', data: '3 setups identified: QQQ squeeze, SPY RSI, TSLA gap', time: '6:15 AM', status: 'delivered', color: '#A855F7' },
  { id: 2, from: 'Content Agent', to: 'Social Media', data: 'Issue #7 draft ready for distribution queue', time: '2:30 PM', status: 'pending', color: '#F97316' },
  { id: 3, from: 'Email Responder', to: 'Charles (CBV2)', data: 'Flagged: Marriott contract reply needs review', time: '10:45 AM', status: 'delivered', color: '#22C55E' },
  { id: 4, from: 'Cost Monitor', to: 'Charles (CBV2)', data: 'Budget alert: $142/$200 daily (71%)', time: '3:00 PM', status: 'delivered', color: '#EF4444' },
  { id: 5, from: 'RLM Estimator', to: 'Email Responder', data: 'Hotel Oxbow bid ready — queue follow-up email', time: '11:30 AM', status: 'delivered', color: '#3B82F6' },
  { id: 6, from: 'Trading Bot', to: 'Discord Bot', data: 'Trade executed: QQQ $445C +$12.50', time: '10:15 AM', status: 'delivered', color: '#A855F7' },
  { id: 7, from: 'Prospect Research', to: 'Email Responder', data: 'No new leads found — pipeline empty', time: 'Yesterday', status: 'delivered', color: '#6B7280' },
  { id: 8, from: 'Charles (CBV2)', to: 'All Agents', data: 'Operational Excellence Standard activated', time: 'Apr 7', status: 'broadcast', color: '#00D4FF' },
];

export default function AgentCommsLog() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-cyan" />
        <h2 className="text-sm font-bold text-white">Agent Communications</h2>
        <span className="text-[10px] font-mono text-gray-400 ml-auto">{handoffs.length} handoffs today</span>
      </div>
      {handoffs.map(h => (
        <div key={h.id} className="glass-card py-2.5 px-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-medium text-white">{h.from}</span>
            <ArrowRight size={10} className="text-cyan" />
            <span className="text-[10px] font-medium text-white">{h.to}</span>
            <span className={`ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-mono ${
              h.status === 'delivered' ? 'text-green-400 border border-green-400/20 bg-green-400/5' :
              h.status === 'pending' ? 'text-yellow-400 border border-yellow-400/20 bg-yellow-400/5' :
              'text-cyan border border-cyan/20 bg-cyan/5'
            }`}>{h.status}</span>
          </div>
          <p className="text-[10px] text-gray-400">{h.data}</p>
          <p className="text-[9px] text-gray-500 font-mono mt-1">{h.time}</p>
        </div>
      ))}
    </div>
  );
}
