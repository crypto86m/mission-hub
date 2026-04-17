import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, Users, Workflow, Settings, Plug, Brain, Trophy, Database, Instagram, Share2, Film, Zap, Activity, TrendingUp, DollarSign } from 'lucide-react';
import Dashboard from './screens/Dashboard';
import Tasks from './screens/Tasks';
import CalendarScreen from './screens/Calendar';
import Agents from './screens/Agents';
import WorkflowIntelligence from './screens/WorkflowIntelligence';
import SettingsScreen from './screens/Settings';
import Integrations from './screens/Integrations';
import AgentIntelligence from './screens/AgentIntelligence';
import WeeklyScorecard from './screens/WeeklyScorecard';
import ContentPipeline from './screens/ContentPipeline';
import MemoryBank from './screens/MemoryBank';
import InstagramCalendar from './screens/InstagramCalendar';
import SocialPublisher from './screens/SocialPublisher';
import EditingBriefs from './screens/EditingBriefs';
import ReelsManager from './screens/ReelsManager';
import Approvals from './screens/Approvals';
import SystemOps from './screens/SystemOps';
import TradingScreen from './screens/TradingScreen';
import CostsScreen from './screens/CostsScreen';
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
      case 'content':
        return <ContentPipeline />;
      case 'memory':
        return <MemoryBank />;
      case 'instagram':
        return <InstagramCalendar />;
      case 'social':
        return <SocialPublisher />;
      case 'editing':
        return <EditingBriefs />;
      case 'reels':
        return <ReelsManager />;
      case 'approvals':
        return <Approvals />;
      case 'system':
        return <SystemOps />;
      case 'trading':
        return <TradingScreen />;
      case 'costs':
        return <CostsScreen />;
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
            label="Content"
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
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
            icon={<Database size={24} />}
            label="Memory"
            active={activeTab === 'memory'}
            onClick={() => setActiveTab('memory')}
          />
          <TabButton
            icon={<Instagram size={24} />}
            label="Instagram"
            active={activeTab === 'instagram'}
            onClick={() => setActiveTab('instagram')}
          />
          <TabButton
            icon={<Share2 size={24} />}
            label="Social"
            active={activeTab === 'social'}
            onClick={() => setActiveTab('social')}
          />
          <TabButton
            icon={<Film size={24} />}
            label="Editing"
            active={activeTab === 'editing'}
            onClick={() => setActiveTab('editing')}
          />
          <TabButton
            icon={<Film size={24} />}
            label="Reels"
            active={activeTab === 'reels'}
            onClick={() => setActiveTab('reels')}
          />
          <TabButton
            icon={<Trophy size={24} />}
            label="Scorecard"
            active={activeTab === 'scorecard'}
            onClick={() => setActiveTab('scorecard')}
          />
          <TabButton
            icon={<Zap size={24} />}
            label="Approvals"
            active={activeTab === 'approvals'}
            onClick={() => setActiveTab('approvals')}
          />
          <TabButton
            icon={<TrendingUp size={24} />}
            label="Trading"
            active={activeTab === 'trading'}
            onClick={() => setActiveTab('trading')}
          />
          <TabButton
            icon={<DollarSign size={24} />}
            label="Costs"
            active={activeTab === 'costs'}
            onClick={() => setActiveTab('costs')}
          />
          <TabButton
            icon={<Activity size={24} />}
            label="System"
            active={activeTab === 'system'}
            onClick={() => setActiveTab('system')}
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
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[56px] ${
        active
          ? 'text-cyan bg-cyan/15 border-2 border-cyan/50 shadow-[0_0_12px_rgba(0,212,255,0.3)]'
          : 'text-gray-400 hover:text-gray-200 border-2 border-transparent'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-cyan mt-0.5" />}
    </button>
  );
}
/* Force rebuild */
// Force rebuild Sun Apr 12 10:05:59 PDT 2026
