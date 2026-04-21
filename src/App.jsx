import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, Users, Workflow, Settings, Building2, Brain, Plug, Database, Trophy, CheckCircle, FileVideo, Share2, Activity } from 'lucide-react';
import Dashboard from './screens/Dashboard';
import Tasks from './screens/Tasks';
import CalendarScreen from './screens/Calendar';
import Agents from './screens/Agents';
import WorkflowIntelligence from './screens/WorkflowIntelligence';
import Intelligence from './screens/Intelligence';
import SettingsScreen from './screens/Settings';
import RLMDashboard from './screens/RLMDashboard';
import Integrations from './screens/Integrations';
import MemoryBank from './screens/MemoryBank';
import WeeklyScorecard from './screens/WeeklyScorecard';
import Approvals from './screens/Approvals';
import ContentPipeline from './screens/ContentPipeline';
import SocialPublisher from './screens/SocialPublisher';
import SystemOps from './screens/SystemOps';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'calendar': return <CalendarScreen />;
      case 'agents': return <Agents />;
      case 'intelligence': return <Intelligence />;
      case 'workflows': return <WorkflowIntelligence />;
      case 'rlm': return <RLMDashboard />;
      case 'integrations': return <Integrations />;
      case 'memory': return <MemoryBank />;
      case 'scorecard': return <WeeklyScorecard />;
      case 'approvals': return <Approvals />;
      case 'content': return <ContentPipeline />;
      case 'social': return <SocialPublisher />;
      case 'sysops': return <SystemOps />;
      case 'settings': return <SettingsScreen />;
      default: return <Dashboard />;
    }
  };

  const tabs = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { id: 'calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { id: 'agents', icon: <Users size={20} />, label: 'Agents' },
    { id: 'intelligence', icon: <Brain size={20} />, label: 'Intel' },
    { id: 'workflows', icon: <Workflow size={20} />, label: 'Flows' },
    { id: 'rlm', icon: <Building2 size={20} />, label: 'RLM' },
    { id: 'integrations', icon: <Plug size={20} />, label: 'Integrations' },
    { id: 'memory', icon: <Database size={20} />, label: 'Memory' },
    { id: 'scorecard', icon: <Trophy size={20} />, label: 'Scorecard' },
    { id: 'approvals', icon: <CheckCircle size={20} />, label: 'Approvals' },
    { id: 'content', icon: <FileVideo size={20} />, label: 'Content' },
    { id: 'social', icon: <Share2 size={20} />, label: 'Social' },
    { id: 'sysops', icon: <Activity size={20} />, label: 'System' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      <div className="flex-1 overflow-hidden pb-20">
        {renderScreen()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur border-t border-cyan/20 overflow-x-auto">
        <div className="flex items-center h-20 min-w-max px-2 gap-1">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[56px] ${
        active
          ? 'text-cyan bg-cyan/15 border border-cyan/30'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-[10px] whitespace-nowrap">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-cyan" />}
    </button>
  );
}
