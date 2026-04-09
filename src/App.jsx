import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, Users, Settings } from 'lucide-react';
import Dashboard from './screens/Dashboard';
import Tasks from './screens/Tasks';
import CalendarScreen from './screens/Calendar';
import Agents from './screens/Agents';
import SettingsScreen from './screens/Settings';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <CalendarScreen />;
      case 'agents':
        return <Agents />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur border-t border-cyan/20">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto w-full">
          <TabButton
            icon={<Home size={24} />}
            label="Home"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <TabButton
            icon={<CheckSquare size={24} />}
            label="Tasks"
            active={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          />
          <TabButton
            icon={<Calendar size={24} />}
            label="Calendar"
            active={activeTab === 'calendar'}
            onClick={() => setActiveTab('calendar')}
          />
          <TabButton
            icon={<Users size={24} />}
            label="Agents"
            active={activeTab === 'agents'}
            onClick={() => setActiveTab('agents')}
          />
          <TabButton
            icon={<Settings size={24} />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-colors ${
        active
          ? 'text-cyan'
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
