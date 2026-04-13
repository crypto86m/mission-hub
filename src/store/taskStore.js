import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// ── Valid states & transition rules ──────────────────────────────
const VALID_STATES = ['pending', 'in_progress', 'awaiting_approval', 'completed', 'delayed', 'blocked'];

const TRANSITIONS = {
  pending:             ['in_progress', 'blocked', 'delayed'],
  in_progress:         ['awaiting_approval', 'blocked', 'delayed', 'pending'],
  awaiting_approval:   ['completed', 'in_progress', 'delayed'],
  completed:           ['in_progress'],           // reopen
  delayed:             ['in_progress', 'pending', 'blocked'],
  blocked:             ['in_progress', 'pending', 'delayed'],
};

const STATE_COLORS = {
  pending:           { bg: 'bg-gray-500/10',   border: 'border-gray-500/20', text: 'text-gray-400',   dot: 'bg-gray-400' },
  in_progress:       { bg: 'bg-blue-500/10',   border: 'border-blue-500/20', text: 'text-blue-400',   dot: 'bg-blue-400' },
  awaiting_approval: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  completed:         { bg: 'bg-green-500/10',  border: 'border-green-500/20', text: 'text-green-400',  dot: 'bg-green-400' },
  delayed:           { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-400' },
  blocked:           { bg: 'bg-red-500/10',    border: 'border-red-500/20',   text: 'text-red-400',    dot: 'bg-red-400' },
};

const STATE_LABELS = {
  pending: 'Pending', in_progress: 'In Progress', awaiting_approval: 'Awaiting Approval',
  completed: 'Completed', delayed: 'Delayed', blocked: 'Blocked',
};

// ── Helper: map old status names to new engine states ────────────
function normalizeStatus(s) {
  if (!s) return 'pending';
  const map = { done: 'completed', active: 'in_progress' };
  return map[s] || (VALID_STATES.includes(s) ? s : 'pending');
}

// ── Persist task state record to Supabase activity_feed ─────────
async function persistToSupabase(taskId, state, audit) {
  try {
    await supabase.from('activity_feed').insert({
      agent_id: 'task_engine',
      type: 'task_state',
      text: JSON.stringify({ taskId, ...state, lastAudit: audit }),
      company_id: 'mission_control',
    });
  } catch (e) {
    console.error('[taskStore] Supabase persist error:', e);
  }
}

// ── Load persisted state overlay from Supabase ──────────────────
async function loadPersistedStates() {
  try {
    const { data, error } = await supabase
      .from('activity_feed')
      .select('text, created_at')
      .eq('agent_id', 'task_engine')
      .eq('type', 'task_state')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error || !data) return {};
    // Latest state per taskId wins
    const map = {};
    for (const row of data) {
      try {
        const parsed = JSON.parse(row.text);
        if (parsed.taskId && !map[parsed.taskId]) {
          map[parsed.taskId] = parsed;
        }
      } catch { /* skip malformed */ }
    }
    return map;
  } catch {
    return {};
  }
}

// ── Predictive intelligence helpers ─────────────────────────────
function calcRiskScore(task) {
  let risk = 0;
  // Age risk: days since creation
  if (task.createdAt) {
    const age = (Date.now() - new Date(task.createdAt).getTime()) / 86400000;
    if (age > 7) risk += 3;
    else if (age > 3) risk += 2;
    else risk += 1;
  }
  // State-change churn
  if (task.auditTrail) {
    risk += Math.min(task.auditTrail.length, 5);
  }
  // Dependency count
  if (task.dependencies?.length) risk += task.dependencies.length * 2;
  // Currently delayed/blocked = high risk
  if (task.status === 'delayed') risk += 4;
  if (task.status === 'blocked') risk += 5;
  return Math.min(risk, 10);
}

function calcPriorityScore(task, allTasks) {
  let score = 0;
  // Urgency from deadline proximity (x3)
  if (task.deadline) {
    const daysLeft = (new Date(task.deadline).getTime() - Date.now()) / 86400000;
    if (daysLeft < 0) score += 30;       // overdue
    else if (daysLeft < 2) score += 24;
    else if (daysLeft < 7) score += 15;
    else score += 6;
  } else {
    score += 9; // no deadline = medium urgency
  }
  // Dependency count: how many tasks depend ON this one (x2)
  const blocksCount = allTasks.filter(t =>
    t.dependencies?.includes(task.id)
  ).length;
  score += blocksCount * 2;
  // Business impact (x2) — HIGH=6, MEDIUM=4, LOW=2
  const impactMap = { HIGH: 6, MEDIUM: 4, LOW: 2 };
  score += impactMap[task.priority] || 4;
  // Workflow position bonus for in_progress
  if (task.status === 'in_progress') score += 3;
  if (task.status === 'blocked') score += 2;
  return score;
}

// ── The Store ───────────────────────────────────────────────────
export const useTaskStore = create((set, get) => ({
  // Core state
  tasks: [],
  projects: [],
  blockers: [],
  summary: { total: 0, completed: 0, inProgress: 0, blocked: 0, pending: 0, delayed: 0, awaitingApproval: 0 },
  auditLog: [],
  loaded: false,
  debugMode: false,
  filter: 'all',
  errors: [],

  // ── Getters ─────────────────────────────────────────────────
  getTask: (id) => get().tasks.find(t => t.id === id),
  getTasksByProject: (projectId) => get().tasks.filter(t => t.projectId === projectId),
  getTasksByState: (state) => get().tasks.filter(t => t.status === state),
  getTasksByAssignee: (assignee) => get().tasks.filter(t => t.assignee === assignee),
  getStateColors: (state) => STATE_COLORS[state] || STATE_COLORS.pending,
  getStateLabel: (state) => STATE_LABELS[state] || state,
  getValidTransitions: (state) => TRANSITIONS[state] || [],
  getAllStates: () => VALID_STATES,

  // ── Predictive intelligence ─────────────────────────────────
  getAtRiskTasks: () => {
    const tasks = get().tasks.filter(t => t.status !== 'completed');
    return tasks.filter(t => calcRiskScore(t) >= 6).sort((a, b) => calcRiskScore(b) - calcRiskScore(a));
  },

  getOverloadedAgents: () => {
    const tasks = get().tasks.filter(t => t.status === 'in_progress');
    const counts = {};
    tasks.forEach(t => { if (t.assignee) counts[t.assignee] = (counts[t.assignee] || 0) + 1; });
    return Object.entries(counts).filter(([, c]) => c > 3).map(([agent, count]) => ({ agent, count }));
  },

  getAgentStats: () => {
    const tasks = get().tasks;
    const stats = {};
    tasks.forEach(t => {
      if (!t.assignee) return;
      if (!stats[t.assignee]) stats[t.assignee] = { completed: 0, delayed: 0, blocked: 0, inProgress: 0, total: 0, totalTransitionTime: 0, transitions: 0 };
      const s = stats[t.assignee];
      s.total++;
      if (t.status === 'completed') s.completed++;
      if (t.status === 'delayed') s.delayed++;
      if (t.status === 'blocked') s.blocked++;
      if (t.status === 'in_progress') s.inProgress++;
      // Avg transition time from audit trail
      if (t.auditTrail?.length >= 2) {
        for (let i = 1; i < t.auditTrail.length; i++) {
          const dt = new Date(t.auditTrail[i].timestamp).getTime() - new Date(t.auditTrail[i - 1].timestamp).getTime();
          if (dt > 0) { s.totalTransitionTime += dt; s.transitions++; }
        }
      }
    });
    return Object.entries(stats).map(([agent, s]) => ({
      agent,
      ...s,
      efficiency: s.total > 0 ? Math.round((s.completed / Math.max(1, s.completed + s.delayed + s.blocked)) * 100) : 0,
      avgTransitionHrs: s.transitions > 0 ? Math.round(s.totalTransitionTime / s.transitions / 3600000 * 10) / 10 : null,
    }));
  },

  getSortedByPriority: () => {
    const tasks = get().tasks.filter(t => t.status !== 'completed');
    return [...tasks].sort((a, b) => calcPriorityScore(b, tasks) - calcPriorityScore(a, tasks));
  },

  getCriticalPath: () => {
    const tasks = get().tasks;
    // Tasks that block the most others
    return tasks
      .map(t => ({
        ...t,
        blocksCount: tasks.filter(o => o.dependencies?.includes(t.id)).length,
      }))
      .filter(t => t.blocksCount > 0 && t.status !== 'completed')
      .sort((a, b) => b.blocksCount - a.blocksCount);
  },

  getSmartAlerts: () => {
    const alerts = [];
    const atRisk = get().getAtRiskTasks();
    if (atRisk.length > 0) alerts.push({ type: 'warning', text: `⚠️ ${atRisk.length} task${atRisk.length > 1 ? 's' : ''} at risk of delay` });
    const overloaded = get().getOverloadedAgents();
    overloaded.forEach(({ agent, count }) => alerts.push({ type: 'danger', text: `🔴 ${agent} overloaded: ${count} active tasks` }));
    const blocked = get().tasks.filter(t => t.status === 'blocked');
    if (blocked.length > 0) alerts.push({ type: 'danger', text: `🚫 ${blocked.length} blocked task${blocked.length > 1 ? 's' : ''}` });
    return alerts;
  },

  // ── Computed summary ────────────────────────────────────────
  recalcSummary: () => {
    const tasks = get().tasks;
    set({
      summary: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        blocked: tasks.filter(t => t.status === 'blocked').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        delayed: tasks.filter(t => t.status === 'delayed').length,
        awaitingApproval: tasks.filter(t => t.status === 'awaiting_approval').length,
      },
    });
  },

  // ── State transition (THE core action) ──────────────────────
  transitionTask: async (taskId, newState, meta = {}) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { ok: false, error: 'Task not found' };

    const allowed = TRANSITIONS[task.status];
    if (!allowed?.includes(newState)) {
      const err = `Invalid transition: ${task.status} → ${newState}`;
      set(s => ({ errors: [...s.errors.slice(-49), { ts: Date.now(), msg: err }] }));
      return { ok: false, error: err };
    }

    // Validation gates
    if (newState === 'delayed' && !meta.reason) return { ok: false, error: 'Delay requires a reason' };
    if (newState === 'blocked' && !meta.blockedBy) return { ok: false, error: 'Block requires a dependency' };

    const auditEntry = {
      from: task.status,
      to: newState,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    const updatedTask = {
      ...task,
      status: newState,
      auditTrail: [...(task.auditTrail || []), auditEntry],
      ...(newState === 'completed' ? { completedAt: new Date().toISOString() } : {}),
      ...(newState === 'delayed' ? { delayReason: meta.reason } : {}),
      ...(newState === 'blocked' ? { blockedBy: meta.blockedBy } : {}),
      ...(newState === 'in_progress' ? { startedAt: task.startedAt || new Date().toISOString() } : {}),
      updatedAt: new Date().toISOString(),
    };

    // Instant UI update
    const newTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
    set({ tasks: newTasks });
    get().recalcSummary();

    // Audit log
    set(s => ({ auditLog: [...s.auditLog, { taskId, ...auditEntry }] }));

    // Persist to Supabase (non-blocking)
    persistToSupabase(taskId, { status: newState, updatedAt: updatedTask.updatedAt }, auditEntry);

    // If completed, check if any blocked tasks can unblock
    if (newState === 'completed') {
      const blockedTasks = newTasks.filter(t => t.status === 'blocked' && t.blockedBy === taskId);
      for (const bt of blockedTasks) {
        // Auto-unblock
        get().transitionTask(bt.id, 'pending', { reason: `Unblocked: ${task.title} completed`, auto: true });
      }
    }

    return { ok: true, task: updatedTask };
  },

  // ── Quick actions (convenience wrappers) ────────────────────
  startTask: (id) => get().transitionTask(id, 'in_progress', { action: 'start' }),
  submitForApproval: (id) => get().transitionTask(id, 'awaiting_approval', { action: 'submit_for_approval' }),
  approveTask: (id) => get().transitionTask(id, 'completed', { action: 'approve' }),
  rejectApproval: (id) => get().transitionTask(id, 'in_progress', { action: 'reject_approval' }),
  delayTask: (id, reason) => get().transitionTask(id, 'delayed', { action: 'delay', reason }),
  blockTask: (id, blockedBy) => get().transitionTask(id, 'blocked', { action: 'block', blockedBy }),
  reopenTask: (id) => get().transitionTask(id, 'in_progress', { action: 'reopen' }),
  unblockTask: (id) => get().transitionTask(id, 'in_progress', { action: 'unblock' }),

  // ── Toggle debug ────────────────────────────────────────────
  toggleDebug: () => set(s => ({ debugMode: !s.debugMode })),
  setFilter: (f) => set({ filter: f }),

  // ── Initialize: load from static JSON + overlay Supabase ───
  initialize: async () => {
    try {
      const [jsonResp, persisted] = await Promise.all([
        fetch('/api/tasks.json').then(r => r.json()),
        loadPersistedStates(),
      ]);

      const allTasks = [];
      const projects = jsonResp.projects.map(p => {
        const tasks = p.tasks.map(t => {
          const overlay = persisted[t.id];
          const base = {
            id: t.id,
            title: t.title,
            status: normalizeStatus(overlay?.status || t.status),
            projectId: p.id,
            projectName: p.name,
            priority: p.priority || 'MEDIUM',
            assignee: t.assignee || null,
            note: t.note || null,
            proof: t.proof || null,
            blocker: t.blocker || null,
            completedAt: overlay?.completedAt || t.completedAt || null,
            startedAt: overlay?.startedAt || null,
            createdAt: t.completedAt || jsonResp.lastUpdated || new Date().toISOString(),
            updatedAt: overlay?.updatedAt || jsonResp.lastUpdated || new Date().toISOString(),
            auditTrail: overlay?.lastAudit ? [overlay.lastAudit] : [],
            dependencies: t.dependencies || [],
            delayReason: overlay?.delayReason || null,
            blockedBy: overlay?.blockedBy || null,
            deadline: t.deadline || null,
            needsBenjamin: t.needsBenjamin || false,
          };
          allTasks.push(base);
          return base;
        });
        return { ...p, tasks, progress: undefined }; // progress recalculated dynamically
      });

      set({ tasks: allTasks, projects, blockers: jsonResp.blockers || [], loaded: true });
      get().recalcSummary();
    } catch (e) {
      console.error('[taskStore] Init error:', e);
      set({ loaded: true, errors: [{ ts: Date.now(), msg: `Init failed: ${e.message}` }] });
    }
  },

  // ── Realtime subscription ───────────────────────────────────
  subscribeRealtime: () => {
    const channel = supabase
      .channel('task-engine-rt')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_feed',
        filter: 'agent_id=eq.task_engine',
      }, (payload) => {
        try {
          const parsed = JSON.parse(payload.new.text);
          if (parsed.taskId && parsed.status) {
            // Apply remote state change locally
            set(s => ({
              tasks: s.tasks.map(t =>
                t.id === parsed.taskId
                  ? { ...t, status: parsed.status, updatedAt: parsed.updatedAt || new Date().toISOString() }
                  : t
              ),
            }));
            get().recalcSummary();
          }
        } catch { /* not task_state format, ignore */ }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
}));

// Export utilities
export { STATE_COLORS, STATE_LABELS, TRANSITIONS, VALID_STATES, calcRiskScore, calcPriorityScore };
