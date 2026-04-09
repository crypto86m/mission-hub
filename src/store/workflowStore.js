import { create } from 'zustand';

export const useWorkflowStore = create((set, get) => ({
  workflows: [],
  agents: [],
  alerts: [],

  setWorkflows: (workflows) => set({ workflows }),
  setAgents: (agents) => set({ agents }),

  updateWorkflowProgress: (workflowId, completion) => {
    set((state) => ({
      workflows: state.workflows.map((wf) =>
        wf.id === workflowId
          ? { ...wf, completion: Math.min(completion, 100) }
          : wf
      ),
    }));
  },

  updateWorkflowStatus: (workflowId, status) => {
    set((state) => ({
      workflows: state.workflows.map((wf) =>
        wf.id === workflowId ? { ...wf, status } : wf
      ),
    }));
  },

  updateAgentStatus: (agentId, status, currentTask = '') => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId
          ? { ...agent, status, currentTask, lastActionTime: new Date().toISOString() }
          : agent
      ),
    }));
  },

  addAlert: (type, message) => {
    set((state) => ({
      alerts: [...state.alerts, { id: Date.now(), type, message }],
    }));
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== Date.now()),
      }));
    }, 5000);
  },

  removeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  clearAlerts: () => set({ alerts: [] }),

  // Real-time metrics
  getSystemHealth: () => {
    const state = get();
    const blockedCount = state.workflows.filter((w) => w.status === 'blocked').length;
    const inProgressCount = state.workflows.filter((w) => w.status === 'in-progress').length;
    const completedCount = state.workflows.filter((w) => w.status === 'completed').length;

    let healthStatus = 'healthy';
    if (blockedCount > 0) healthStatus = 'warning';
    if (blockedCount > 2) healthStatus = 'critical';

    return {
      status: healthStatus,
      blocked: blockedCount,
      inProgress: inProgressCount,
      completed: completedCount,
      totalWorkflows: state.workflows.length,
    };
  },

  getAgentStats: (agentId) => {
    const state = get();
    const agent = state.agents.find((a) => a.id === agentId);
    if (!agent) return null;

    return {
      ...agent,
      efficiency: agent.speed * (agent.successRate / 100),
      hoursRunning: agent.recentTasks ? agent.recentTasks.length : 0,
    };
  },

  analyzeWorkflowBottlenecks: () => {
    const state = get();
    const bottlenecks = [];

    state.workflows.forEach((wf) => {
      if (wf.status === 'waiting' && wf.dependencies.length > 0) {
        bottlenecks.push({
          workflowId: wf.id,
          workflowName: wf.name,
          type: 'dependency',
          blockedOn: wf.dependencies,
          severity: 'high',
        });
      }

      if (wf.status === 'in-progress' && wf.completion < 20 && wf.duration > '4h') {
        bottlenecks.push({
          workflowId: wf.id,
          workflowName: wf.name,
          type: 'slow-progress',
          currentCompletion: wf.completion,
          severity: 'medium',
        });
      }
    });

    // Check agent performance
    state.agents.forEach((agent) => {
      if (agent.successRate < 90) {
        bottlenecks.push({
          agentId: agent.id,
          agentName: agent.name,
          type: 'low-success-rate',
          successRate: agent.successRate,
          severity: 'medium',
        });
      }
    });

    return bottlenecks;
  },

  suggestOptimizations: (workflowId) => {
    const state = get();
    const workflow = state.workflows.find((w) => w.id === workflowId);
    if (!workflow) return [];

    const suggestions = [];

    // Check for parallelization opportunities
    if (workflow.dependencies.length === 0 && workflow.agents.length > 1) {
      suggestions.push({
        type: 'parallelization',
        description: 'This workflow has no dependencies. Consider running all agent tasks in parallel.',
        potentialTimeSavings: '30-40%',
      });
    }

    // Check for redundant agents
    if (workflow.agents.length > 3) {
      suggestions.push({
        type: 'consolidation',
        description: 'Multiple agents assigned. Consider consolidating similar tasks.',
        potentialCostSavings: '20-25%',
      });
    }

    // Check for slow agents
    const slowAgents = workflow.agents.filter((agentName) => {
      const agent = state.agents.find((a) => a.name === agentName);
      return agent && agent.speed < 5;
    });

    if (slowAgents.length > 0) {
      suggestions.push({
        type: 'agent-replacement',
        description: `Replace slow agents: ${slowAgents.join(', ')}`,
        potentialTimeSavings: '15-20%',
      });
    }

    return suggestions;
  },
}));
