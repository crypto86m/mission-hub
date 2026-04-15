import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, AlertTriangle } from 'lucide-react';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [viewMode, setViewMode] = useState('month');
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    fetch('/api/status.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => setLiveData(d))
      .catch(() => {});
  }, []);

  // Recurring automation events — these are real scheduled items
  const getRecurringEvents = (dayOfWeek, dayOfMonth) => {
    const events = [];
    // Weekdays only (Mon-Fri)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      events.push({ id: `trading-${dayOfMonth}`, title: 'Trading Session', time: '6:20 AM', duration: '6h 40m', category: 'trading', location: 'Alpaca Paper' });
    }
    // Daily
    events.push({ id: `heartbeat-${dayOfMonth}`, title: 'Heartbeat Check', time: 'Every 30 min', duration: 'Auto', category: 'automation', location: 'OpenClaw Cron' });
    // Sundays
    if (dayOfWeek === 0) {
      events.push({ id: `review-${dayOfMonth}`, title: 'Weekly Review', time: '6:00 PM', duration: '30 min', category: 'automation', location: 'Auto (Charles)' });
    }
    return events;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'trading': return 'from-purple-500 to-purple-600';
      case 'business': return 'from-blue-500 to-blue-600';
      case 'content': return 'from-orange-500 to-orange-600';
      case 'automation': return 'from-gray-500 to-gray-600';
      default: return 'from-cyan-500 to-cyan-600';
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
  const dayOfWeek = selectedDate.getDay();
  const dayEvents = getRecurringEvents(dayOfWeek, selectedDay);

  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 pt-6">
      <h1 className="text-3xl font-bold glow-text mb-2">Calendar</h1>
      <p className="text-gray-400 mb-4">Automated schedule & events</p>

      {/* Note about data source */}
      <div className="mb-4 glass-card border-yellow-500/20 bg-yellow-500/5 py-2 px-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-yellow-400 shrink-0" />
          <p className="text-xs text-yellow-300">
            Showing automated/recurring events. Google Calendar integration not connected — manual events not displayed.
          </p>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex gap-2 mb-6">
        {['month', 'week', 'day'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === mode ? 'bg-cyan text-dark-bg font-semibold' : 'bg-dark-card text-gray-300 hover:text-cyan'
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
            <button onClick={handlePrevMonth} className="p-2 hover:bg-cyan/10 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-cyan" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-cyan/10 rounded-lg transition-colors">
              <ChevronRight size={20} className="text-cyan" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isToday = isCurrentMonth && day === today.getDate();
            return (
              <button
                key={index}
                onClick={() => day && setSelectedDay(day)}
                className={`aspect-square rounded-lg transition-all flex items-center justify-center text-sm font-medium relative ${
                  day === null ? ''
                    : day === selectedDay ? 'bg-cyan text-dark-bg'
                    : isToday ? 'bg-blue-500/20 text-cyan border border-cyan/30'
                    : 'bg-dark-card/50 text-gray-300 hover:bg-dark-card'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Events */}
      <h3 className="text-lg font-bold mb-4">
        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </h3>

      {dayEvents.length > 0 ? (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <div key={event.id} className={`glass-card bg-gradient-to-r ${getCategoryColor(event.category)} bg-opacity-10`}>
              <h4 className="font-semibold text-white mb-2">{event.title}</h4>
              <div className="flex flex-col gap-1 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-cyan" />
                  <span>{event.time} ({event.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-cyan" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <span className="text-xs px-2 py-1 bg-dark-bg/50 rounded capitalize">{event.category}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card text-center py-12">
          <Clock size={32} className="mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No automated events on this day</p>
        </div>
      )}
    </div>
  );
}
