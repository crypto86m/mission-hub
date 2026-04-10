import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Clock, Ban, ExternalLink } from 'lucide-react';

export default function Tasks() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [filter, setFilter] = useState('all'); // all, blocked, in_progress, done

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

  const statusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle size={14} className="text-green-400 shrink-0" />;
      case 'in_progress': return <Clock size={14} className="text-blue-400 shrink-0 animate-pulse" />;
      case 'blocked': return <Ban size={14} className="text-red-400 shrink-0" />;
      default: return <Clock size={14} className="text-gray-500 shrink-0" />;
    }
  };

  const priorityBadge = (p) => {
    const colors = {
      HIGH: 'text-red-400 border-red-400/30 bg-red-400/10',
      MEDIUM: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
      LOW: 'text-green-400 border-green-400/30 bg-green-400/10',
    };
    return <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${colors[p] || colors.MEDIUM}`}>{p}</span>;
  };

  const statusBadge = (s) => {
    const colors = {
      done: 'text-green-400 border-green-400/30 bg-green-400/10',
      in_progress: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      blocked: 'text-red-400 border-red-400/30 bg-red-400/10',
      pending: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
    };
    const labels = { done: 'DONE', in_progress: 'IN PROGRESS', blocked: 'BLOCKED', pending: 'PENDING' };
    return <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${colors[s] || colors.pending}`}>{labels[s] || s}</span>;
  };

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

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: summary.total, color: 'text-white' },
          { label: 'Done', value: summary.completed, color: 'text-green-400' },
          { label: 'In Progress', value: summary.inProgress, color: 'text-blue-400' },
          { label: 'Blocked', value: summary.blocked, color: 'text-red-400' },
          { label: 'Pending', value: summary.pending, color: 'text-gray-400' },
        ].map((card, i) => (
          <div key={i} className="glass-card text-center py-3">
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Blockers Alert */}
      {blockers.length > 0 && (
        <div className="mb-6 glass-card border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-lg font-bold text-red-400">Blockers Requiring Your Attention</h2>
          </div>
          <div className="space-y-3">
            {blockers.map(b => (
              <div key={b.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{b.system}</span>
                  <span className="text-[10px] text-red-300">{b.daysSinceRaised} day{b.daysSinceRaised !== 1 ? 's' : ''} blocked</span>
                </div>
                <p className="text-xs text-gray-300 mb-2">{b.description}</p>
                <p className="text-xs text-red-300">💥 Impact: {b.impact}</p>
                {b.needsFromBenjamin && (
                  <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                    <p className="text-xs text-yellow-300">👉 <strong>Needs from you:</strong> {b.needsFromBenjamin}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'in_progress', 'blocked', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filter === f 
                ? 'bg-cyan/20 text-cyan border border-cyan/40' 
                : 'bg-dark-card/30 text-gray-400 border border-gray-600/20 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All Projects' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-3">
        {filteredProjects.map(project => {
          const isExpanded = expandedProject === project.id;
          const doneTasks = project.tasks.filter(t => t.status === 'done').length;
          const totalTasks = project.tasks.length;
          const blockedTasks = project.tasks.filter(t => t.status === 'blocked');
          
          return (
            <div key={project.id} className="glass-card">
              {/* Project Header */}
              <button
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                {isExpanded 
                  ? <ChevronDown size={16} className="text-cyan shrink-0" />
                  : <ChevronRight size={16} className="text-gray-400 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{project.name}</span>
                    {priorityBadge(project.priority)}
                    {statusBadge(project.status)}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{project.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-mono text-cyan">{doneTasks}/{totalTasks}</p>
                  <div className="w-20 h-1.5 bg-gray-700 rounded-full mt-1">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        project.progress >= 90 ? 'bg-green-400' :
                        project.progress >= 50 ? 'bg-blue-400' :
                        'bg-yellow-400'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Tasks */}
              {isExpanded && (
                <div className="mt-4 space-y-2 border-t border-cyan/10 pt-3">
                  {project.tasks.map(task => (
                    <div key={task.id} className={`flex items-start gap-2 p-2 rounded-lg ${
                      task.status === 'blocked' ? 'bg-red-500/5 border border-red-500/10' :
                      task.status === 'done' ? 'bg-green-500/5 border border-green-500/10 opacity-70' :
                      task.status === 'in_progress' ? 'bg-blue-500/5 border border-blue-500/10' :
                      'bg-gray-500/5 border border-gray-500/10'
                    }`}>
                      {statusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </p>
                        {task.blocker && (
                          <p className="text-[10px] text-red-300 mt-0.5">🚫 {task.blocker}</p>
                        )}
                        {task.note && (
                          <p className="text-[10px] text-gray-400 mt-0.5">📝 {task.note}</p>
                        )}
                        {task.proof && (
                          <p className="text-[10px] text-cyan mt-0.5">
                            ✅ {task.proof.startsWith('http') 
                              ? <a href={task.proof} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{task.proof}</a>
                              : task.proof
                            }
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {task.completedAt && <span className="text-[9px] text-gray-500">Completed: {task.completedAt}</span>}
                          {task.assignee && <span className="text-[9px] text-gray-500">→ {task.assignee}</span>}
                          {task.needsBenjamin && <span className="text-[9px] text-yellow-400 font-semibold">⚠️ NEEDS BENJAMIN</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
