import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function PostingSchedule({ phase2 }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const postsPerWeek = 5;
  const totalWeeks = 20;
  const weeks = [];

  // Generate 20-week schedule
  for (let i = 0; i < totalWeeks; i++) {
    const startPost = i * postsPerWeek + 1;
    const endPost = Math.min((i + 1) * postsPerWeek, phase2.total);
    const startDate = new Date(2026, 3, 14); // Start April 14, 2026
    startDate.setDate(startDate.getDate() + i * 7);
    
    weeks.push({
      week: i + 1,
      posts: `${startPost}-${endPost}`,
      count: endPost - startPost + 1,
      startDate,
    });
  }

  const optimalTimes = [
    { time: '6:00 AM - 9:00 AM PT', reason: 'Morning commute + business users' },
    { time: '6:00 PM - 9:00 PM PT', reason: 'Evening wind-down + maximum reach' },
  ];

  const displayWeeks = weeks.slice(currentWeek, currentWeek + 4);

  return (
    <div className="space-y-8">
      {/* Posting Schedule Overview */}
      <div className="bg-dark-card border border-cyan/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">20-Week Rollout Plan</h3>
            <p className="text-gray-400 text-sm">5 posts per week across 20 weeks</p>
          </div>
          <div className="bg-cyan/10 rounded-lg px-4 py-2">
            <p className="text-cyan font-bold">{postsPerWeek} posts/week</p>
          </div>
        </div>

        {/* Optimal Posting Times */}
        <div className="mb-6 p-4 bg-dark-bg/50 rounded-lg border border-purple-500/30">
          <p className="text-white font-semibold mb-3 flex items-center gap-2">
            <Clock size={18} className="text-purple-400" />
            Optimal Posting Times
          </p>
          <div className="space-y-2">
            {optimalTimes.map((slot, idx) => (
              <p key={idx} className="text-gray-300 text-sm">
                <span className="text-purple-400 font-semibold">{slot.time}</span>
                <span className="text-gray-500"> — {slot.reason}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            className="p-2 hover:bg-cyan/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="text-cyan" />
          </button>
          <p className="text-gray-400 text-sm">
            Week {currentWeek + 1} - {Math.min(currentWeek + 4, totalWeeks)} of {totalWeeks}
          </p>
          <button
            onClick={() => setCurrentWeek(Math.min(totalWeeks - 4, currentWeek + 1))}
            disabled={currentWeek >= totalWeeks - 4}
            className="p-2 hover:bg-cyan/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} className="text-cyan" />
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayWeeks.map((week, idx) => (
            <div
              key={idx}
              className="bg-dark-bg border border-cyan/30 rounded-lg p-4 hover:border-cyan/60 transition-colors cursor-pointer"
            >
              <p className="text-cyan font-bold text-lg mb-2">Week {week.week}</p>
              <p className="text-white font-semibold text-sm mb-3">Posts {week.posts}</p>
              <p className="text-gray-400 text-xs mb-4">
                {week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
                {new Date(week.startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gradient-to-r from-cyan to-purple-500 rounded-full h-2" />
                <span className="text-cyan text-sm font-bold">{week.count}×</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next 7 Days Preview */}
      <div className="bg-dark-card border border-green-500/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">📅 Next 7 Days Preview</h3>
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const postNum = i + 1;
            
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-bg/50 rounded border border-cyan/20 hover:border-cyan/50 transition-colors">
                <div>
                  <p className="text-white font-semibold">Post {postNum}</p>
                  <p className="text-gray-400 text-sm">{dayName} · 7:00 AM PT</p>
                </div>
                <button className="px-3 py-1 bg-cyan/10 hover:bg-cyan/20 text-cyan rounded text-sm transition-colors">
                  Preview
                </button>
              </div>
            );
          })}
        </div>
        <button className="w-full mt-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-2 rounded transition-colors">
          Auto-Schedule All 100 Posts
        </button>
      </div>

      {/* Manual Reschedule Info */}
      <div className="bg-dark-bg/50 border border-orange-500/30 rounded-lg p-4">
        <p className="text-orange-400 font-semibold text-sm mb-2">💡 Manual Reschedule Available</p>
        <p className="text-gray-400 text-sm">
          Click any post to reschedule, change format, or modify copy. Changes sync to Instagram scheduling tool.
        </p>
      </div>
    </div>
  );
}
