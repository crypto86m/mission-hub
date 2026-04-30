import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

const initialNotifications = [
  { id: 1, type: 'approval', title: 'TSLA Bull Put Spread', message: 'Trading Bot needs approval — $250 risk, HIGH priority', time: '2m ago', read: false, icon: 'alert' },
  { id: 2, type: 'alert', title: 'Cost Warning', message: 'Daily spend $142 — 71% of $200 limit', time: '15m ago', read: false, icon: 'cost' },
  { id: 3, type: 'success', title: 'Hotel Oxbow Bid Generated', message: 'RLM Estimator completed $410K bid estimate', time: '1h ago', read: false, icon: 'success' },
  { id: 4, type: 'alert', title: 'Prospect Research Idle', message: 'Agent idle for 24h+ — needs reassignment', time: '3h ago', read: true, icon: 'alert' },
  { id: 5, type: 'trade', title: 'QQQ Squeeze Signal', message: 'Bollinger Squeeze detected — monitoring for entry', time: '5m ago', read: false, icon: 'trade' },
];

const iconMap = {
  alert: <AlertTriangle size={16} className="text-yellow-400" />,
  success: <CheckCircle size={16} className="text-green-400" />,
  trade: <TrendingUp size={16} className="text-purple-400" />,
  cost: <DollarSign size={16} className="text-red-400" />,
};

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Send browser push notification
  const sendPush = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logos/mc-icon.png',
        badge: '/logos/mc-icon.png',
        vibrate: [200, 100, 200],
      });
    }
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Bell size={20} className={unreadCount > 0 ? 'text-cyan' : 'text-gray-400'} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setIsOpen(false)}>
          <div
            className="w-80 max-w-full h-full bg-gray-900/98 backdrop-blur-xl border-l border-gray-700 overflow-y-auto"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideInRight 0.2s ease-out' }}
          >
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

            {/* Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Notifications</h2>
                <p className="text-[10px] text-gray-400">{unreadCount} unread</p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-cyan hover:text-white">Mark all read</button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-2 space-y-1">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3 rounded-lg border transition-all ${
                    n.read
                      ? 'bg-gray-800/30 border-gray-800/50'
                      : 'bg-gray-800/60 border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{iconMap[n.icon]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-xs font-medium truncate ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</h3>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-[9px] text-gray-500 mt-1 font-mono">{n.time}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }} className="text-gray-600 hover:text-gray-400 shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell size={24} className="mx-auto mb-2 text-gray-600" />
                  <p className="text-xs text-gray-500">All caught up</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
