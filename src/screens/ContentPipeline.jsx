import React, { useState } from 'react';
import { FileText, Twitter, Linkedin, Instagram, Calendar, ChevronDown } from 'lucide-react';

const platforms = {
  substack: { icon: '📰', label: 'Substack', color: '#FF6719' },
  twitter: { icon: '🐦', label: 'Twitter', color: '#1DA1F2' },
  linkedin: { icon: '💼', label: 'LinkedIn', color: '#0A66C2' },
  instagram: { icon: '📸', label: 'Instagram', color: '#E1306C' },
};

const initialContent = {
  ideas: [
    { id: '1', title: 'The Compound Effect of Discipline', platform: 'substack', day: 'Monday', notes: 'Market discipline parallels with business execution' },
    { id: '2', title: 'Why 90% of Traders Lose', platform: 'twitter', day: 'Thursday', notes: 'Thread: common mistakes, how systems fix them' },
    { id: '3', title: 'The AI Manager Playbook', platform: 'substack', day: 'Wednesday', notes: 'How to use AI agents as force multipliers in business' },
  ],
  research: [
    { id: '4', title: 'RLM Growth Case Study', platform: 'linkedin', day: 'Tuesday', notes: 'How a family painting company scaled to $2.8M YTD' },
  ],
  drafting: [
    { id: '5', title: 'Bennett\'s Brief #7 — AI Automation Lessons', platform: 'substack', day: 'Friday', notes: '1,247 words. 80% complete. Topic: what I learned automating my businesses with AI agents.' },
  ],
  editing: [],
  ready: [
    { id: '6', title: 'Markets reward discipline (tweet)', platform: 'twitter', day: 'Daily', notes: 'Queued in Buffer. Posts at 9 AM PT.' },
  ],
  published: [
    { id: '7', title: 'Your System Doesn\'t Care About Your Feelings', platform: 'substack', day: 'April 3', notes: 'Issue #1. 38% open rate.' },
    { id: '8', title: 'The Delegation Trap', platform: 'substack', day: 'April 4', notes: 'Issue #2. Strong engagement.' },
    { id: '9', title: 'Why Systems Beat Talent', platform: 'substack', day: 'April 5', notes: 'Issue #3. Most shared.' },
    { id: '10', title: 'The Execution Trap', platform: 'substack', day: 'April 6', notes: 'Issue #4.' },
    { id: '11', title: 'Discipline Is a Skill', platform: 'substack', day: 'April 7', notes: 'Issue #5.' },
    { id: '12', title: 'The 80/20 of Everything', platform: 'substack', day: 'April 8', notes: 'Issue #6.' },
  ],
  distributed: [
    { id: '13', title: '90 tweets loaded in Buffer queue', platform: 'twitter', day: 'Ongoing', notes: 'Daily posting at 9 AM PT. Auto via Buffer.' },
  ],
};

const columns = [
  { key: 'ideas', label: 'Ideas', color: 'from-gray-500 to-gray-600' },
  { key: 'research', label: 'Research', color: 'from-blue-500 to-blue-600' },
  { key: 'drafting', label: 'Drafting', color: 'from-yellow-500 to-yellow-600' },
  { key: 'editing', label: 'Editing', color: 'from-orange-500 to-orange-600' },
  { key: 'ready', label: 'Ready', color: 'from-green-500 to-green-600' },
  { key: 'published', label: 'Published', color: 'from-purple-500 to-purple-600' },
  { key: 'distributed', label: 'Distributed', color: 'from-cyan-500 to-cyan-600' },
];

const weeklyThemes = [
  { day: 'Monday', theme: 'Market Analysis + Business Parallels' },
  { day: 'Tuesday', theme: 'Leadership & Management' },
  { day: 'Wednesday', theme: 'Systems & Processes' },
  { day: 'Thursday', theme: 'Trading Discipline' },
  { day: 'Friday', theme: 'Weekend Read (lifestyle/reflection)' },
];

export default function ContentPipeline() {
  const [content, setContent] = useState(initialContent);
  const [expanded, setExpanded] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const handleDragStart = (e, itemId, source) => {
    setDraggedItem(itemId);
    setDragSource(source);
  };

  const handleDrop = (e, destination) => {
    e.preventDefault();
    if (draggedItem && dragSource && dragSource !== destination) {
      const item = content[dragSource].find(i => i.id === draggedItem);
      setContent(prev => ({
        ...prev,
        [dragSource]: prev[dragSource].filter(i => i.id !== draggedItem),
        [destination]: [...prev[destination], item],
      }));
    }
    setDraggedItem(null);
    setDragSource(null);
  };

  const totalContent = Object.values(content).flat().length;

  return (
    <div className="w-full h-full overflow-x-auto pb-24 pt-6 px-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold glow-text mb-2">Content Pipeline</h1>
        <p className="text-gray-400">{totalContent} items • Bennett's Brief + Social</p>
      </div>

      {/* Weekly Schedule Toggle */}
      <button
        onClick={() => setShowSchedule(!showSchedule)}
        className="mb-4 flex items-center gap-2 px-3 py-2 bg-dark-card border border-cyan/20 rounded-lg text-sm text-cyan hover:bg-cyan/10 transition-colors"
      >
        <Calendar size={14} />
        Weekly Schedule
        <ChevronDown size={14} className={`transition-transform ${showSchedule ? 'rotate-180' : ''}`} />
      </button>

      {showSchedule && (
        <div className="mb-6 glass-card">
          <h3 className="text-sm font-bold text-white mb-3">Weekly Content Themes</h3>
          <div className="space-y-2">
            {weeklyThemes.map(t => (
              <div key={t.day} className="flex items-center gap-3 text-sm">
                <span className="text-cyan font-mono w-24">{t.day}</span>
                <span className="text-gray-300">{t.theme}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="flex gap-4 min-w-full overflow-x-auto pb-4">
        {columns.map(col => (
          <div
            key={col.key}
            className="flex-shrink-0 w-72 bg-dark-card/30 rounded-lg p-3 border border-cyan/10"
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, col.key)}
          >
            <div className={`bg-gradient-to-r ${col.color} rounded-lg p-2.5 mb-3 text-white font-semibold text-sm flex justify-between items-center`}>
              <span>{col.label}</span>
              <span className="bg-black/30 px-2 py-0.5 rounded text-xs">{content[col.key].length}</span>
            </div>

            <div className="space-y-2">
              {content[col.key].map(item => {
                const p = platforms[item.platform];
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => handleDragStart(e, item.id, col.key)}
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    className="glass-card cursor-pointer hover:border-cyan/30 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className="text-sm">{p?.icon}</span>
                      <h4 className="text-xs font-medium text-white flex-1">{item.title}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-1.5 py-0.5 rounded border border-cyan/20 text-cyan font-mono">{p?.label}</span>
                      <span className="text-[9px] text-gray-500">{item.day}</span>
                    </div>

                    {expanded === item.id && (
                      <div className="mt-2 pt-2 border-t border-cyan/10">
                        <p className="text-[10px] text-gray-400">{item.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {content[col.key].length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-xs">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
