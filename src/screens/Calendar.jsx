import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 9)); // April 9, 2026
  const [selectedDay, setSelectedDay] = useState(9);
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const events = {
    // Daily recurring events (shown on every relevant day)
    7: [
      { id: 100, title: 'Pre-Market Brief', time: '6:00 AM', duration: '20 min', category: 'trading', location: 'Auto (Charles)' },
      { id: 101, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Live' },
      { id: 102, title: 'Operational Excellence Standard deployed', time: '8:37 PM', duration: 'Event', category: 'automation', location: 'Mission Control' },
    ],
    8: [
      { id: 200, title: 'Pre-Market Brief', time: '6:00 AM', duration: '20 min', category: 'trading', location: 'Auto (Charles)' },
      { id: 201, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Live' },
      { id: 202, title: 'Mission Control Lovable build started', time: '8:28 AM', duration: 'Event', category: 'content', location: 'lovable.dev' },
    ],
    9: [
      { id: 1, title: 'Pre-Market Brief', time: '6:00 AM', duration: '20 min', category: 'trading', location: 'Auto (Charles)' },
      { id: 2, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Live' },
      { id: 3, title: 'Buffer Tweet Post', time: '9:00 AM', duration: '1 min', category: 'content', location: 'Buffer → Twitter' },
      { id: 4, title: 'Agent Intelligence Center deployed', time: '5:42 PM', duration: 'Event', category: 'automation', location: 'Mission Control' },
      { id: 5, title: 'Full Integrations audit (27)', time: '3:26 PM', duration: 'Event', category: 'automation', location: 'Mission Control' },
    ],
    10: [
      { id: 6, title: 'Pre-Market Brief', time: '6:00 AM', duration: '20 min', category: 'trading', location: 'Auto (Charles)' },
      { id: 7, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Live' },
      { id: 8, title: 'Buffer Tweet Post', time: '9:00 AM', duration: '1 min', category: 'content', location: 'Buffer → Twitter' },
      { id: 9, title: 'Supabase tables created & seeded', time: '8:46 AM', duration: 'Event', category: 'automation', location: 'Supabase' },
      { id: 10, title: 'Bennett\'s Brief #7 target publish', time: '3:00 PM', duration: '15 min', category: 'content', location: 'Substack' },
    ],
    11: [
      { id: 11, title: 'Pre-Market Brief', time: '6:00 AM', duration: '20 min', category: 'trading', location: 'Auto (Charles)' },
      { id: 12, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Live' },
      { id: 50, title: '🎬 IG Reel: Weekend Mindset', time: '9:00 AM', duration: '1 min', category: 'content', location: 'Instagram @benjamin86m' },
      { id: 51, title: 'Morning Briefing', time: '7:00 AM', duration: '5 min', category: 'automation', location: 'Discord #general' },
    ],
    12: [
      { id: 52, title: '🎬 IG Reel: My Fleet (NVCC)', time: '9:00 AM', duration: '1 min', category: 'content', location: 'Instagram @benjamin86m' },
    ],
    // Sunday
    // 13 already has weekly review
    13: [
      { id: 14, title: 'Weekly cost review', time: '5:00 PM', duration: '30 min', category: 'automation', location: 'Mission Control' },
      { id: 15, title: 'Weekly Scorecard generated', time: '6:00 PM', duration: '5 min', category: 'automation', location: 'Auto (Charles)' },
    ],
    14: [
      { id: 16, title: 'Pre-Market Brief', time: '6:00 AM', duration: '20 min', category: 'trading', location: 'Auto (Charles)' },
      { id: 17, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Live' },
      { id: 53, title: '🎬 IG Reel: No Excuses', time: '9:00 AM', duration: '1 min', category: 'content', location: 'Instagram @benjamin86m' },
      { id: 54, title: 'Morning Briefing', time: '7:00 AM', duration: '5 min', category: 'automation', location: 'Discord #general' },
    ],
    15: [
      { id: 18, title: 'NVCC membership renewals due (8 members)', time: '9:00 AM', duration: 'All day', category: 'business', location: 'NVCC CRM' },
    ],
    20: [
      { id: 19, title: 'Sunday Operational Review', time: '6:00 PM', duration: '30 min', category: 'automation', location: 'Auto (Charles)' },
      { id: 20, title: 'Weekly Scorecard', time: '6:00 PM', duration: '5 min', category: 'automation', location: 'Mission Control' },
    ],
    30: [
      { id: 21, title: 'AI Support — $5K MRR target deadline', time: '11:59 PM', duration: 'Deadline', category: 'business', location: 'ai-support-self.vercel.app' },
      { id: 22, title: 'Monthly budget review ($200 limit)', time: '5:00 PM', duration: '30 min', category: 'automation', location: 'Mission Control' },
    ],
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'trading':
        return 'from-purple-500 to-purple-600';
      case 'business':
        return 'from-blue-500 to-blue-600';
      case 'content':
        return 'from-orange-500 to-orange-600';
      case 'automation':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-cyan-500 to-cyan-600';
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const dayEvents = events[selectedDay] || [];

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <h1 className="text-3xl font-bold glow-text mb-2">Calendar</h1>
      <p className="text-gray-400 mb-6">Manage your schedule and events</p>

      {/* View Mode Selector */}
      <div className="flex gap-2 mb-6">
        {['month', 'week', 'day'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === mode
                ? 'bg-cyan text-dark-bg font-semibold'
                : 'bg-dark-card text-gray-300 hover:text-cyan'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="glass-card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-cyan/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-cyan" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-cyan/10 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-cyan" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && setSelectedDay(day)}
              className={`aspect-square rounded-lg transition-all flex items-center justify-center text-sm font-medium relative ${
                day === null
                  ? ''
                  : day === selectedDay
                  ? 'bg-cyan text-dark-bg'
                  : events[day]
                  ? 'bg-blue-500/20 text-cyan border border-cyan/30 hover:bg-cyan/20'
                  : 'bg-dark-card/50 text-gray-300 hover:bg-dark-card'
              }`}
            >
              {day}
              {day && events[day] && day !== selectedDay && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Events */}
      {dayEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">
            Events for April {selectedDay}, 2026
          </h3>
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`glass-card bg-gradient-to-r ${getCategoryColor(
                  event.category
                )} bg-opacity-10`}
              >
                <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                <div className="flex flex-col gap-1 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan" />
                    <span>
                      {event.time} ({event.duration})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs px-2 py-1 bg-dark-bg/50 rounded capitalize">
                    {event.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dayEvents.length === 0 && (
        <div className="glass-card text-center py-12">
          <Clock size={32} className="mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No events on April {selectedDay}</p>
        </div>
      )}
    </div>
  );
}
