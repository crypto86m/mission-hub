import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Clock, Ban,
  Play, Pause, ThumbsUp, ThumbsDown, X, Bug, ArrowUp, Zap, Shield,
  User, TrendingUp, Filter, BarChart3, RefreshCw, Eye, ChevronUp
} from 'lucide-react';
import { useTaskStore, STATE_COLORS, STATE_LABELS, VALID_STATES, calcRiskScore, calcPriorityScore } from '../store/taskStore';

// ── State icon map ──────────────────────────────────────────────
const StateIcon = ({ status, size = 14 }) => {
  const props = { size, className: `shrink-0 mt-0.5 ${STATE_COLORS[status]?.text || 'text-gray-400'}` };
  switch (status) {
    case 'completed': return <CheckCircle {...props} />;
    case 'in_progress': return <Play {...props} />;
    case 'awaiting_approval': return <ThumbsUp {...props} />;
    case 'delayed': return <Pause {...props} />;
    case 'blocked': return <Ban {...props} />;
    default: return <Clock {...props} />;
  }
};

// ── Delay Modal ─────────────────────────────────────────────────
function DelayModal({ task, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onCancel}>
      <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-5 w-80 max-w-[90vw] shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-orange-400 mb-2">⏸ Delay Task</h3>
        <p className="text-xs text-gray-400 mb-3 truncate">{task.title}</p>
        <textarea
          autoFocus
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Why is this task delayed? (required)"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 resize-none h-24 focus:border-orange-400 focus:outline-none"
        />
        <div className="flex gap-2 mt-3">
          <button onClick={onCancel} className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-gray-700 text-gray-300 hover:bg-gray-600">Cancel</button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed"
          >Confirm Delay</button>
        </div>
      </div>
    </div>
  );
}

// ── Block Modal ─────────────────────────────────────────────────
function BlockModal({ task, allTasks, onConfirm, onCancel }) {
  const [selectedDep, setSelectedDep] = useState('');
  const otherTasks = allTasks.filter(t => t.id !== task.id && t.status !== 'completed');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onCancel}>
      <div className="bg-gray-900 border border-red-500/30 rounded-xl p-5 w-80 max-w-[90vw] shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-red-400 mb-2">🚫 Block Task</h3>
        <p className="text-xs text-gray-400 mb-3 truncate">{task.title}</p>
        <p className="text-xs text-gray-500 mb-2">Select blocking dependency:</p>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {otherTasks.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedDep(t.id)}
              className={`p-2 rounded-lg text-xs cursor-pointer border ${
                selectedDep === t.id
                  ? 'bg-red-500/20 border-red-500/40 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="font-medium">{t.title}</span>
              <span className="text-[10px] ml-2 opacity-60">[{t.projectName}]</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={onCancel} className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-gray-700 text-gray-300 hover:bg-gray-600">Cancel</button>
          <button
            onClick={() => selectedDep && onConfirm(selectedDep)}
            disabled={!selectedDep}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 disabled:opacity-30 disabled:cursor-not-allowed"
          >Confirm Block</button>
        </div>
      </div>
    </div>
  );
}

// ── Action Button ───────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, color, onClick, processing }) {
  const colorMap = {
    green:  'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/40 active:bg-green-500/50',
    blue:   'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/40 active:bg-blue-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/40 active:bg-yellow-500/50',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/40 active:bg-orange-500/50',
    red:    'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/40 active:bg-red-500/50',
    cyan:   'bg-cyan/20 text-cyan border-cyan/30 hover:bg-cyan/40 active:bg-cyan/50',
    gray:   'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/40 active:bg-gray-500/50',
  };
  return (
    <button
      onClick={onClick}
      disabled={processing}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${processing ? 'opacity-50 cursor-wait' : 'cursor-pointer'} ${colorMap[color] || colorMap.gray}`}
    >
      {processing ? <RefreshCw size={12} className="animate-spin" /> : <Icon size={12} />}
      {label}
    </button>
  );
}

// ── Task Action Buttons (state-dependent) ───────────────────────
function TaskActions({ task, onDelay, onBlock }) {
  const { startTask, submitForApproval, approveTask, rejectApproval, reopenTask, unblockTask } = useTaskStore();
  const [processing, setProcessing] = useState(null);

  const act = async (action, fn) => {
    setProcessing(action);
    await fn();
    setProcessing(null);
  };

  const s = task.status;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 ml-5">
      {s === 'pending' && (
        <>
          <ActionBtn icon={Play} label="Start" color="blue" processing={processing === 'start'} onClick={() => act('start', () => startTask(task.id))} />
          <ActionBtn icon={Pause} label="Delay" color="orange" processing={processing === 'delay'} onClick={() => onDelay(task)} />
          <ActionBtn icon={Ban} label="Block" color="red" processing={processing === 'block'} onClick={() => onBlock(task)} />
        </>
      )}
      {s === 'in_progress' && (
        <>
          <ActionBtn icon={ThumbsUp} label="Submit for Approval" color="yellow" processing={processing === 'submit'} onClick={() => act('submit', () => submitForApproval(task.id))} />
          <ActionBtn icon={Pause} label="Delay" color="orange" processing={processing === 'delay'} onClick={() => onDelay(task)} />
          <ActionBtn icon={Ban} label="Block" color="red" processing={processing === 'block'} onClick={() => onBlock(task)} />
        </>
      )}
      {s === 'awaiting_approval' && (
        <>
          <ActionBtn icon={CheckCircle} label="Approve" color="green" processing={processing === 'approve'} onClick={() => act('approve', () => approveTask(task.id))} />
          <ActionBtn icon={ThumbsDown} label="Reject" color="red" processing={processing === 'reject'} onClick={() => act('reject', () => rejectApproval(task.id))} />
          <ActionBtn icon={Pause} label="Delay" color="orange" processing={processing === 'delay'} onClick={() => onDelay(task)} />
        </>
      )}
      {s === 'completed' && (
        <ActionBtn icon={RefreshCw} label="Reopen" color="gray" processing={processing === 'reopen'} onClick={() => act('reopen', () => reopenTask(task.id))} />
      )}
      {s === 'delayed' && (
        <>
          <ActionBtn icon={Play} label="Resume" color="blue" processing={processing === 'resume'} onClick={() => act('resume', () => startTask(task.id))} />
          <ActionBtn icon={Ban} label="Block" color="red" processing={processing === 'block'} onClick={() => onBlock(task)} />
        </>
      )}
      {s === 'blocked' && (
        <>
          <ActionBtn icon={Zap} label="Unblock" color="cyan" processing={processing === 'unblock'} onClick={() => act('unblock', () => unblockTask(task.id))} />
          <ActionBtn icon={Pause} label="Delay" color="orange" processing={processing === 'delay'} onClick={() => onDelay(task)} />
        </>
      )}
    </div>
  );
}

// ── Smart Alerts Banner ─────────────────────────────────────────
function SmartAlerts() {
  const alerts = useTaskStore(s => s.getSmartAlerts());
  if (alerts.length === 0) return null;
  return (
    <div className="mb-4 space-y-1.5">
      {alerts.map((a, i) => (
        <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium border ${
          a.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
        }`}>
          {a.text}
        </div>
      ))}
    </div>
  );
}

// ── Agent Performance Cards ─────────────────────────────────────
function AgentPerformance() {
  const stats = useTaskStore(s => s.getAgentStats());
  const [show, setShow] = useState(false);
  if (stats.length === 0) return null;
  return (
    <div className="mb-4">
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-2">
        <User size={14} /> Agent Performance {show ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {show && (
        <div className="grid grid-cols-2 gap-2">
          {stats.map(s => (
            <div key={s.agent} className="glass-card p-2.5">
              <p className="text-xs font-bold text-white mb-1">{s.agent}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="w-full h-1.5 bg-gray-700 rounded-full">
                    <div className={`h-1.5 rounded-full ${s.efficiency >= 80 ? 'bg-green-400' : s.efficiency >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${s.efficiency}%` }} />
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${s.efficiency >= 80 ? 'text-green-400' : s.efficiency >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{s.efficiency}%</span>
              </div>
              <div className="flex gap-3 mt-1.5 text-[10px] text-gray-500">
                <span>✅ {s.completed}</span>
                <span>⏸ {s.delayed}</span>
                <span>🚫 {s.blocked}</span>
                <span>🔄 {s.inProgress}</span>
              </div>
              {s.avgTransitionHrs !== null && <p className="text-[10px] text-gray-500 mt-0.5">Avg transition: {s.avgTransitionHrs}h</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Debug Panel ─────────────────────────────────────────────────
function DebugPanel() {
  const { auditLog, errors, tasks } = useTaskStore();
  const [tab, setTab] = useState('audit');
  // Find buttons without handlers (tasks with no valid transitions = dead UI check)
  const deadUI = tasks.filter(t => {
    const transitions = useTaskStore.getState().getValidTransitions(t.status);
    return transitions.length === 0 && t.status !== 'completed';
  });

  return (
    <div className="glass-card border-purple-500/30 bg-purple-500/5 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Bug size={14} className="text-purple-400" />
        <span className="text-xs font-bold text-purple-400">Debug Mode</span>
      </div>
      <div className="flex gap-2 mb-2">
        {['audit', 'errors', 'dead-ui'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-2 py-1 rounded text-[10px] font-mono ${tab === t ? 'bg-purple-500/20 text-purple-300' : 'text-gray-500 hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="max-h-40 overflow-y-auto text-[10px] font-mono">
        {tab === 'audit' && (
          auditLog.length === 0
            ? <p className="text-gray-600">No actions yet</p>
            : auditLog.slice(-20).reverse().map((a, i) => (
              <div key={i} className="text-gray-400 py-0.5 border-b border-gray-800">
                <span className="text-purple-400">{new Date(a.timestamp).toLocaleTimeString()}</span>
                {' '}{a.taskId}: {a.from} → <span className="text-white">{a.to}</span>
                {a.reason && <span className="text-orange-400"> ({a.reason})</span>}
              </div>
            ))
        )}
        {tab === 'errors' && (
          errors.length === 0
            ? <p className="text-gray-600">No errors</p>
            : errors.slice(-20).reverse().map((e, i) => (
              <div key={i} className="text-red-400 py-0.5 border-b border-gray-800">
                {new Date(e.ts).toLocaleTimeString()}: {e.msg}
              </div>
            ))
        )}
        {tab === 'dead-ui' && (
          deadUI.length === 0
            ? <p className="text-green-400">✅ All elements have handlers</p>
            : deadUI.map(t => (
              <div key={t.id} className="text-yellow-400 py-0.5">⚠️ {t.title} ({t.status}) — no valid transitions</div>
            ))
        )}
      </div>
    </div>
  );
}

// ── Main Tasks Screen ───────────────────────────────────────────
export default function Tasks() {
  const {
    tasks, projects, blockers, summary, loaded, debugMode, filter,
    initialize, subscribeRealtime, toggleDebug, setFilter, getStateColors,
    getSortedByPriority, getCriticalPath,
  } = useTaskStore();

  const [expandedProject, setExpandedProject] = useState(null);
  const [delayModal, setDelayModal] = useState(null);
  const [blockModal, setBlockModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('projects'); // projects | priority | critical

  // Initialize on mount
  useEffect(() => {
    initialize();
    const unsub = subscribeRealtime();
    return unsub;
  }, []);

  // Toast helper
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Delay handler
  const handleDelay = useCallback(async (reason) => {
    if (!delayModal) return;
    const result = await useTaskStore.getState().delayTask(delayModal.id, reason);
    if (result.ok) showToast(`⏸ Delayed: ${delayModal.title}`);
    else showToast(`❌ ${result.error}`, 'error');
    setDelayModal(null);
  }, [delayModal, showToast]);

  // Block handler
  const handleBlock = useCallback(async (blockedBy) => {
    if (!blockModal) return;
    const result = await useTaskStore.getState().blockTask(blockModal.id, blockedBy);
    if (result.ok) showToast(`🚫 Blocked: ${blockModal.title}`);
    else showToast(`❌ ${result.error}`, 'error');
    setBlockModal(null);
  }, [blockModal, showToast]);

  if (!loaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-5xl animate-pulse-soft">⚡</span>
      </div>
    );
  }

  // Filter tasks
  const filterStates = {
    all: null,
    active: ['in_progress', 'awaiting_approval'],
    pending: ['pending'],
    blocked: ['blocked', 'delayed'],
    done: ['completed'],
  };
  const activeFilterStates = filterStates[filter];

  const filteredProjects = projects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.id);
    const filtered = activeFilterStates ? projectTasks.filter(t => activeFilterStates.includes(t.status)) : projectTasks;
    const done = projectTasks.filter(t => t.status === 'completed').length;
    const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
    return { ...p, tasks: filtered, allTasks: projectTasks, done, total: projectTasks.length, progress };
  }).filter(p => p.tasks.length > 0);

  const prioritySorted = getSortedByPriority();
  const criticalPath = getCriticalPath();

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">
      {/* Modals */}
      {delayModal && <DelayModal task={delayModal} onConfirm={handleDelay} onCancel={() => setDelayModal(null)} />}
      {blockModal && <BlockModal task={blockModal} allTasks={tasks} onConfirm={handleBlock} onCancel={() => setBlockModal(null)} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg px-5 py-3 shadow-2xl border ${
          toast.type === 'error' ? 'bg-red-900 border-red-400' : 'bg-green-900 border-green-400'
        }`}>
          <p className={`text-sm font-bold ${toast.type === 'error' ? 'text-red-200' : 'text-green-200'}`}>{toast.msg}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold glow-text">Task Intelligence</h1>
          <p className="text-gray-500 text-[10px] mt-0.5">Real-time state engine • Every click triggers action</p>
        </div>
        <button onClick={toggleDebug} className={`p-2 rounded-lg border ${debugMode ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
          <Bug size={16} />
        </button>
      </div>

      {/* Smart Alerts */}
      <SmartAlerts />

      {/* Debug Panel */}
      {debugMode && <DebugPanel />}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total', value: summary.total, color: 'text-white', bg: 'bg-gray-500/10' },
          { label: 'Done', value: summary.completed, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Active', value: summary.inProgress, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Approval', value: summary.awaitingApproval, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map((c, i) => (
          <div key={i} className={`${c.bg} border border-gray-700/30 rounded-xl text-center py-2.5`}>
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[9px] text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Pending', value: summary.pending, color: 'text-gray-400', bg: 'bg-gray-500/10' },
          { label: 'Delayed', value: summary.delayed, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Blocked', value: summary.blocked, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((c, i) => (
          <div key={i} className={`${c.bg} border border-gray-700/30 rounded-xl text-center py-2`}>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[9px] text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Agent Performance */}
      <AgentPerformance />

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="mb-4 glass-card border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400">🚨 System Blockers</span>
          </div>
          {blockers.map(b => (
            <div key={b.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 mb-1.5">
              <p className="text-xs font-bold text-white">{b.system} — {b.daysSinceRaised}d</p>
              <p className="text-[10px] text-gray-300 mt-0.5">{b.description}</p>
              {b.needsFromBenjamin && <p className="text-[10px] text-yellow-300 mt-0.5">👉 {b.needsFromBenjamin}</p>}
            </div>
          ))}
        </div>
      )}

      {/* View Mode + Filter */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto">
        <div className="flex gap-1 mr-2 border-r border-gray-700 pr-2">
          {[
            { key: 'projects', label: '📁 Projects', icon: null },
            { key: 'priority', label: '📊 Priority', icon: null },
            { key: 'critical', label: '🔥 Critical Path', icon: null },
          ].map(v => (
            <button key={v.key} onClick={() => setViewMode(v.key)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${
              viewMode === v.key ? 'bg-cyan/20 text-cyan border border-cyan/40' : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}>{v.label}</button>
          ))}
        </div>
        {['all', 'active', 'pending', 'blocked', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono ${
            filter === f ? 'bg-cyan/15 text-cyan border border-cyan/30' : 'bg-gray-800/50 text-gray-500 border border-gray-700/30'
          }`}>
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Project View ──────────────────────────────────────── */}
      {viewMode === 'projects' && filteredProjects.map(project => {
        const isExpanded = expandedProject === project.id;
        return (
          <div key={project.id} className="glass-card mb-3">
            <div onClick={() => setExpandedProject(isExpanded ? null : project.id)} className="flex items-center gap-3 cursor-pointer select-none">
              {isExpanded ? <ChevronDown size={16} className="text-cyan shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{project.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${
                    project.priority === 'HIGH' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                    project.priority === 'LOW' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                    'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  }`}>{project.priority}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{project.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-mono text-cyan">{project.done}/{project.total}</p>
                <div className="w-16 h-1.5 bg-gray-700 rounded-full mt-1">
                  <div className={`h-1.5 rounded-full transition-all ${
                    project.progress >= 90 ? 'bg-green-400' : project.progress >= 50 ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-2 border-t border-cyan/10 pt-3">
                {project.tasks.map(task => {
                  const colors = getStateColors(task.status);
                  const risk = calcRiskScore(task);
                  return (
                    <div key={task.id} className={`p-2.5 rounded-lg ${colors.bg} border ${colors.border} transition-all`}>
                      <div className="flex items-start gap-2">
                        <StateIcon status={task.status} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-xs font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>{task.title}</p>
                            {risk >= 6 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-mono">Risk {risk}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${colors.bg} ${colors.text} border ${colors.border}`}>{STATE_LABELS[task.status]}</span>
                            {task.assignee && <span className="text-[9px] text-gray-500">→ {task.assignee}</span>}
                          </div>
                          {task.delayReason && <p className="text-[10px] text-orange-300 mt-1">⏸ {task.delayReason}</p>}
                          {task.blockedBy && <p className="text-[10px] text-red-300 mt-1">🚫 Blocked by: {tasks.find(t => t.id === task.blockedBy)?.title || task.blockedBy}</p>}
                          {task.blocker && <p className="text-[10px] text-red-300 mt-1">🚫 {task.blocker}</p>}
                          {task.note && <p className="text-[10px] text-gray-400 mt-1">📝 {task.note}</p>}
                          {task.proof && <p className="text-[10px] text-cyan mt-1">✅ {task.proof}</p>}
                        </div>
                      </div>
                      <TaskActions task={task} onDelay={setDelayModal} onBlock={setBlockModal} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Priority View ─────────────────────────────────────── */}
      {viewMode === 'priority' && (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-500 mb-2">Sorted by: urgency×3 + deps×2 + impact×2 + position</p>
          {(activeFilterStates ? prioritySorted.filter(t => activeFilterStates.includes(t.status)) : prioritySorted).map((task, idx) => {
            const colors = getStateColors(task.status);
            const score = calcPriorityScore(task, tasks);
            return (
              <div key={task.id} className={`p-2.5 rounded-lg ${colors.bg} border ${colors.border}`}>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-gray-500 w-5 text-right shrink-0">#{idx + 1}</span>
                  <StateIcon status={task.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-white">{task.title}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan/20 text-cyan border border-cyan/30 font-mono">P{score}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] ${colors.text}`}>{STATE_LABELS[task.status]}</span>
                      <span className="text-[9px] text-gray-600">•</span>
                      <span className="text-[9px] text-gray-500">{task.projectName}</span>
                    </div>
                  </div>
                </div>
                <TaskActions task={task} onDelay={setDelayModal} onBlock={setBlockModal} />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Critical Path View ────────────────────────────────── */}
      {viewMode === 'critical' && (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-500 mb-2">Tasks blocking the most other tasks</p>
          {criticalPath.length === 0 ? (
            <div className="glass-card text-center py-6">
              <p className="text-gray-500 text-sm">No dependency chains found</p>
              <p className="text-gray-600 text-[10px] mt-1">Add dependencies via Block action to see critical path</p>
            </div>
          ) : criticalPath.map(task => {
            const colors = getStateColors(task.status);
            return (
              <div key={task.id} className={`p-2.5 rounded-lg ${colors.bg} border ${colors.border}`}>
                <div className="flex items-start gap-2">
                  <StateIcon status={task.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-white">{task.title}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-mono">Blocks {task.blocksCount}</span>
                    </div>
                    <span className={`text-[9px] ${colors.text}`}>{STATE_LABELS[task.status]}</span>
                    <span className="text-[9px] text-gray-500 ml-2">{task.projectName}</span>
                  </div>
                </div>
                <TaskActions task={task} onDelay={setDelayModal} onBlock={setBlockModal} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
