import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Clock, Ban } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Tasks() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionFeedback, setActionFeedback] = useState(null);
  const [processingTask, setProcessingTask] = useState(null);

  async function handleAction(taskId, taskTitle, projectName, action) {
    setProcessingTask(taskId + action);
    
    const label = action === 'approve' ? 'APPROVED' : action === 'prioritize' ? 'PRIORITIZED' : 'DISMISSED';
    const text = `✅ TASK ${label}: ${projectName}: ${taskTitle}`;
    
    try {
      // 1. Log to activity_feed (history/audit)
      await supabase.from('activity_feed').insert({
        text: text.slice(0, 250),
        agent_id: 'task_manager',
        type: action === 'dismiss' ? 'warning' : 'execution',
      });
      
      // 2. Create approval entry so the executor picks it up and ACTS on it
      const status = action === 'approve' ? 'approved' : action === 'prioritize' ? 'approved' : 'denied';
      const { error: approvalError } = await supabase.from('approvals').insert({
        agent_type: `Task: ${projectName}`,
        description: `[${label}] ${taskTitle}`,
        status: status,
        decided_at: new Date().toISOString(),
      });
      
      if (approvalError) console.error('Approval insert error:', approvalError);
      
      const emoji = action === 'approve' ? '✅' : action === 'prioritize' ? '📌' : '🚫';
      setActionFeedback(`${emoji} ${label}: ${taskTitle} — Charles will execute within 5 min`);
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      setActionFeedback(`❌ Failed: ${err.message || 'Unknown error'}`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
    
    setProcessingTask(null);
  }

  useEffect(() => {
    fetch('/api/tasks.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-5xl animate-pulse-soft">⚡</span>
    </div>
  );

  if (!data) return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-gray-400">Failed to load tasks</p>
    </div>
  );

  const { summary, projects, blockers } = data;

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => {
        if (filter === 'blocked') return p.tasks.some(t => t.status === 'blocked');
        return p.status === filter;
      });

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold glow-text mb-2">Projects & Tasks</h1>
        <p className="text-gray-400 text-sm">Last updated: {new Date(data.lastUpdated).toLocaleString()}</p>
      </div>

      {/* Toast */}
      {actionFeedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-900 border border-green-400 rounded-lg px-5 py-3 shadow-2xl">
          <p className="text-sm text-green-200 font-bold">{actionFeedback}</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {[
          { label: 'Total', value: summary.total, color: 'text-white' },
          { label: 'Done', value: summary.completed, color: 'text-green-400' },
          { label: 'Active', value: summary.inProgress, color: 'text-blue-400' },
          { label: 'Blocked', value: summary.blocked, color: 'text-red-400' },
          { label: 'Pending', value: summary.pending, color: 'text-gray-400' },
        ].map((c, i) => (
          <div key={i} className="glass-card text-center py-2">
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[9px] text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="mb-6 glass-card border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-base font-bold text-red-400">🚨 Blockers</h2>
          </div>
          {blockers.map(b => (
            <div key={b.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
              <p className="text-sm font-semibold text-white">{b.system} — {b.daysSinceRaised}d blocked</p>
              <p className="text-xs text-gray-300 mt-1">{b.description}</p>
              {b.needsFromBenjamin && (
                <p className="text-xs text-yellow-300 mt-1">👉 {b.needsFromBenjamin}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['all', 'in_progress', 'blocked', 'done'].map(f => (
          <div
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer select-none ${
              filter === f 
                ? 'bg-cyan/20 text-cyan border border-cyan/40' 
                : 'bg-dark-card/30 text-gray-400 border border-gray-600/20'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>

      {/* Projects */}
      {filteredProjects.map(project => {
        const isExpanded = expandedProject === project.id;
        const done = project.tasks.filter(t => t.status === 'done').length;
        const total = project.tasks.length;
        
        return (
          <div key={project.id} className="glass-card mb-3">
            {/* Project Header — div not button, prevents swallowing clicks */}
            <div
              onClick={() => setExpandedProject(isExpanded ? null : project.id)}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              {isExpanded 
                ? <ChevronDown size={16} className="text-cyan shrink-0" />
                : <ChevronRight size={16} className="text-gray-400 shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{project.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${
                    project.priority === 'HIGH' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                    project.priority === 'LOW' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                    'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  }`}>{project.priority}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{project.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-mono text-cyan">{done}/{total}</p>
                <div className="w-16 h-1.5 bg-gray-700 rounded-full mt-1">
                  <div className={`h-1.5 rounded-full ${
                    project.progress >= 90 ? 'bg-green-400' : project.progress >= 50 ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>

            {/* Tasks — outside the clickable header */}
            {isExpanded && (
              <div className="mt-3 space-y-2 border-t border-cyan/10 pt-3">
                {project.tasks.map(task => (
                  <div key={task.id} className={`p-2.5 rounded-lg ${
                    task.status === 'blocked' ? 'bg-red-500/5 border border-red-500/10' :
                    task.status === 'done' ? 'bg-green-500/5 border border-green-500/10 opacity-60' :
                    task.status === 'in_progress' ? 'bg-blue-500/5 border border-blue-500/10' :
                    'bg-gray-500/5 border border-gray-500/10'
                  }`}>
                    <div className="flex items-start gap-2">
                      {task.status === 'done' ? <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" /> :
                       task.status === 'blocked' ? <Ban size={14} className="text-red-400 shrink-0 mt-0.5" /> :
                       <Clock size={14} className="text-blue-400 shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </p>
                        {task.blocker && <p className="text-[10px] text-red-300 mt-0.5">🚫 {task.blocker}</p>}
                        {task.note && <p className="text-[10px] text-gray-400 mt-0.5">📝 {task.note}</p>}
                        {task.proof && <p className="text-[10px] text-cyan mt-0.5">✅ {task.proof}</p>}
                        {task.assignee && <p className="text-[9px] text-gray-500 mt-0.5">→ {task.assignee}</p>}
                      </div>
                    </div>
                    
                    {/* ACTION BUTTONS — separate div, not nested in any button */}
                    {task.status !== 'done' && (
                      <div className="flex gap-2 mt-2 ml-5">
                        {(task.status === 'pending' || task.status === 'blocked') && (
                          <div
                            onClick={() => handleAction(task.id, task.title, project.name, 'approve')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer select-none ${
                              processingTask === task.id + 'approve' 
                                ? 'bg-green-500/40 text-green-300 border border-green-500/50'
                                : 'bg-green-500/20 text-green-400 border border-green-500/30 active:bg-green-500/40'
                            }`}
                          >
                            {processingTask === task.id + 'approve' ? '⏳' : '▶️'} Approve
                          </div>
                        )}
                        {task.status === 'in_progress' && (
                          <div
                            onClick={() => handleAction(task.id, task.title, project.name, 'prioritize')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer select-none ${
                              processingTask === task.id + 'prioritize'
                                ? 'bg-cyan/40 text-cyan border border-cyan/50'
                                : 'bg-cyan/20 text-cyan border border-cyan/30 active:bg-cyan/40'
                            }`}
                          >
                            {processingTask === task.id + 'prioritize' ? '⏳' : '📌'} Prioritize
                          </div>
                        )}
                        <div
                          onClick={() => handleAction(task.id, task.title, project.name, 'dismiss')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer select-none ${
                            processingTask === task.id + 'dismiss'
                              ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20 active:bg-red-500/30'
                          }`}
                        >
                          {processingTask === task.id + 'dismiss' ? '⏳' : '✖️'} Dismiss
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
