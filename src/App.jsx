import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, Users, Workflow, Settings, Plug, Brain, Trophy } from 'lucide-react';
import Dashboard from './screens/Dashboard';
import Tasks from './screens/Tasks';
import CalendarScreen from './screens/Calendar';
import Agents from './screens/Agents';
import WorkflowIntelligence from './screens/WorkflowIntelligence';
import SettingsScreen from './screens/Settings';
import Integrations from './screens/Integrations';
import AgentIntelligence from './screens/AgentIntelligence';
import WeeklyScorecard from './screens/WeeklyScorecard';
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
      case 'workflows':
        return <WorkflowIntelligence />;
      case 'settings':
        return <SettingsScreen />;
      case 'integrations':
        return <Integrations />;
      case 'intelligence':
        return <AgentIntelligence />;
      case 'scorecard':
        return <WeeklyScorecard />;
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
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur border-t border-cyan/20 overflow-x-auto">
        <div className="flex justify-around items-center h-20 min-w-max px-2">
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
            icon={<Workflow size={24} />}
            label="Workflows"
            active={activeTab === 'workflows'}
            onClick={() => setActiveTab('workflows')}
          />
          <TabButton
            icon={<Brain size={24} />}
            label="Intel"
            active={activeTab === 'intelligence'}
            onClick={() => setActiveTab('intelligence')}
          />
          <TabButton
            icon={<Plug size={24} />}
            label="Integrations"
            active={activeTab === 'integrations'}
            onClick={() => setActiveTab('integrations')}
          />
          <TabButton
            icon={<Trophy size={24} />}
            label="Scorecard"
            active={activeTab === 'scorecard'}
            onClick={() => setActiveTab('scorecard')}
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
/* Force rebuild */
