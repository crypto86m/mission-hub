import React, { useState } from 'react';
import { Rewind, FastForward, Play, Pause, Clock } from 'lucide-react';

const timeline = [
  { time: '6:00 AM', event: 'Pre-market brief generated', agent: 'Charles', type: 'action' },
  { time: '6:20 AM', event: 'Trading session started — 3 strategies active', agent: 'Trading Bot', type: 'action' },
  { time: '7:30 AM', event: 'QQQ Bollinger squeeze detected', agent: 'Trading Bot', type: 'trade' },
  { time: '8:00 AM', event: 'Email responder processed 12 emails', agent: 'Email Responder', type: 'action' },
  { time: '8:30 AM', event: 'Buffer tweet posted (daily 9 AM queue)', agent: 'Social Media', type: 'content' },
  { time: '9:15 AM', event: 'Marriott contract flagged for review', agent: 'Email Responder', type: 'alert' },
  { time: '10:00 AM', event: 'TSLA trade executed +$12.50', agent: 'Trading Bot', type: 'trade' },
  { time: '10:30 AM', event: 'Hotel Oxbow bid generated — $410K', agent: 'RLM Estimator', type: 'action' },
  { time: '11:00 AM', event: 'Content Agent: Issue #7 draft at 60%', agent: 'Content Agent', type: 'content' },
  { time: '12:00 PM', event: 'Cost monitor: $89 spent (45% of daily)', agent: 'Cost Monitor', type: 'alert' },
  { time: '1:00 PM', event: 'Trading session closed — +$18.50 day', agent: 'Trading Bot', type: 'trade' },
  { time: '2:00 PM', event: 'Content Agent: Issue #7 at 80%', agent: 'Content Agent', type: 'content' },
  { time: '3:00 PM', event: 'Cost monitor: $142 spent (71% of daily)', agent: 'Cost Monitor', type: 'alert' },
  { time: '4:00 PM', event: 'Discord: 28 messages logged across 14 channels', agent: 'Discord Bot', type: 'action' },
  { time: '5:00 PM', event: 'Prospect Research: Still idle — 24h+', agent: 'Prospect Research', type: 'warning' },
];

const typeColors = {
  action: '#00D4FF',
  trade: '#A855F7',
  content: '#F97316',
  alert: '#F59E0B',
  warning: '#EF4444',
};

export default function TimeTravelSlider() {
  const [position, setPosition] = useState(timeline.length - 1);
  const [playing, setPlaying] = useState(false);

  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setPosition(p => {
        if (p >= timeline.length - 1) { setPlaying(false); return p; }
        return p + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [playing]);

  const current = timeline[position];

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-cyan" />
        <h3 className="text-sm font-bold text-white">Time Travel</h3>
        <span className="text-[10px] text-gray-400 font-mono ml-auto">{current?.time}</span>
      </div>

      {/* Current Event */}
      <div className="mb-3 p-2.5 rounded-lg border border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[current?.type] }} />
          <span className="text-xs font-medium text-white">{current?.agent}</span>
        </div>
        <p className="text-[10px] text-gray-300">{current?.event}</p>
      </div>

      {/* Timeline Slider */}
      <input
        type="range"
        min={0}
        max={timeline.length - 1}
        value={position}
        onChange={e => setPosition(Number(e.target.value))}
        className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button onClick={() => setPosition(p => Math.max(0, p - 1))} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white">
          <Rewind size={14} />
        </button>
        <button onClick={() => setPlaying(!playing)} className="p-2 rounded-lg bg-cyan/20 text-cyan border border-cyan/30">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={() => setPosition(p => Math.min(timeline.length - 1, p + 1))} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white">
          <FastForward size={14} />
        </button>
      </div>

      {/* Mini timeline dots */}
      <div className="flex gap-0.5 mt-2 justify-center">
        {timeline.map((t, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full cursor-pointer transition-all"
            style={{
              backgroundColor: i <= position ? typeColors[t.type] : '#374151',
              transform: i === position ? 'scale(1.5)' : 'scale(1)',
            }}
            onClick={() => setPosition(i)}
          />
        ))}
      </div>
    </div>
  );
}
