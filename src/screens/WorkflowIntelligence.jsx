import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, BarChart3, Play, Pause, RotateCcw, Search } from 'lucide-react';
import WorkflowGraph from '../components/WorkflowGraph';
import TimelineView from '../components/TimelineView';
import OptimizationPanel from '../components/OptimizationPanel';
import SystemHealthWidget from '../components/SystemHealthWidget';
import FlowReplay from '../components/FlowReplay';
import { useWorkflowStore } from '../store/workflowStore';
import { useTaskStore } from '../store/taskStore';
import { generateMockWorkflows } from '../data/mockWorkflows';

export default function WorkflowIntelligence() {
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, in-progress, completed, blocked, waiting
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayWorkflow, setReplayWorkflow] = useState(null);
  
  const { 
    workflows, 
    agents, 
    setWorkflows, 
    setAgents, 
    alerts,
    updateWorkflowProgress,
  } = useWorkflowStore();

  // Initialize mock data
  useEffect(() => {
    if (workflows.length === 0) {
      const { workflows: mockWf, agents: mockAgents } = generateMockWorkflows();
      setWorkflows(mockWf);
      setAgents(mockAgents);
    }
  }, []);

  // Sync workflow node statuses from task store
  const taskSummary = useTaskStore(s => s.summary);
  const taskLoaded = useTaskStore(s => s.loaded);
  const taskInit = useTaskStore(s => s.initialize);
  useEffect(() => { if (!taskLoaded) taskInit(); }, [taskLoaded]);

  // Update workflow progress based on real task completion
  useEffect(() => {
    if (!taskLoaded || taskSummary.total === 0) return;
    const overallProgress = Math.round((taskSummary.completed / taskSummary.total) * 100);
    const overallStatus = taskSummary.blocked > 0 ? 'blocked' : taskSummary.inProgress > 0 ? 'in-progress' : overallProgress === 100 ? 'completed' : 'waiting';
    // Update first workflow to reflect real task state
    if (workflows.length > 0) {
      const first = workflows[0];
      if (first.completion !== overallProgress || first.status !== overallStatus) {
        updateWorkflowProgress(first.id, overallProgress);
      }
    }
  }, [taskSummary, taskLoaded, workflows]);

  // Filter workflows
  const filteredWorkflows = workflows.filter(wf => {
    const matchesSearch = 
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.agents.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const startReplay = useCallback((workflow) => {
    setReplayWorkflow(workflow);
    setIsReplayMode(true);
  }, []);

  const closeReplay = useCallback(() => {
    setIsReplayMode(false);
    setReplayWorkflow(null);
  }, []);

  return (
    <div className="w-full h-full overflow-auto flex flex-col bg-dark-bg">
      {/* Header */}
      <div className="p-6 border-b border-cyan/20 bg-dark-card/50 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold glow-text">Workflow Intelligence</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time orchestration & optimization</p>
          </div>
          <SystemHealthWidget alerts={alerts} />
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search workflows, agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-cyan/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-dark-bg border border-cyan/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 rounded transition-colors text-sm ${
                viewMode === 'graph'
                  ? 'bg-cyan text-dark-bg font-semibold'
                  : 'text-gray-400 hover:text-cyan'
              }`}
            >
              Graph
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded transition-colors text-sm ${
                viewMode === 'timeline'
                  ? 'bg-cyan text-dark-bg font-semibold'
                  : 'text-gray-400 hover:text-cyan'
              }`}
            >
              Timeline
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-cyan/30 rounded-lg text-white text-sm focus:border-cyan focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="waiting">Waiting</option>
          </select>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="px-6 py-3 bg-red-500/10 border-b border-red-500/30 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <div className="flex-1">
            <p className="text-red-400 text-sm font-semibold">
              {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
            </p>
            <p className="text-red-300/80 text-xs">
              {alerts.map(a => a.message).join(' • ')}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-x-auto overflow-y-auto flex max-w-full">
        {/* Visualization Area */}
        <div className="flex-1 flex flex-col overflow-auto min-w-0">
          {viewMode === 'graph' ? (
            <WorkflowGraph 
              workflows={filteredWorkflows} 
              agents={agents}
              onSelectWorkflow={setSelectedWorkflow}
              onStartReplay={startReplay}
            />
          ) : (
            <TimelineView 
              workflows={filteredWorkflows}
              onSelectWorkflow={setSelectedWorkflow}
              onStartReplay={startReplay}
            />
          )}
        </div>

        {/* Side Panel - Optimization */}
        <div className="w-80 border-l border-cyan/20 overflow-y-auto">
          {selectedWorkflow ? (
            <div className="p-4">
              <h3 className="font-semibold text-cyan mb-3">Workflow Details</h3>
              <div className="space-y-3 text-sm mb-4">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-semibold">{selectedWorkflow.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="font-semibold capitalize">{selectedWorkflow.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">Completion</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-dark-bg rounded h-2">
                      <div 
                        className="bg-cyan h-2 rounded transition-all duration-300"
                        style={{ width: `${selectedWorkflow.completion}%` }}
                      ></div>
                    </div>
                    <span>{Math.round(selectedWorkflow.completion)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="font-semibold">{selectedWorkflow.duration}</p>
                </div>
                <div>
                  <p className="text-gray-400">Cost</p>
                  <p className="font-semibold text-green-400">{selectedWorkflow.cost}</p>
                </div>
                <div>
                  <p className="text-gray-400">Agents ({selectedWorkflow.agents.length})</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedWorkflow.agents.map((agent, idx) => (
                      <span key={idx} className="px-2 py-1 bg-cyan/20 text-cyan rounded text-xs">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startReplay(selectedWorkflow)}
                className="w-full px-4 py-2 bg-cyan/20 hover:bg-cyan/30 text-cyan rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold mb-4"
              >
                <Play size={16} /> Start Replay
              </button>

              <div className="border-t border-cyan/20 pt-4">
                <OptimizationPanel workflow={selectedWorkflow} />
              </div>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center h-full text-gray-500">
              <p className="text-center text-sm">Select a workflow to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Replay Mode Modal */}
      {isReplayMode && replayWorkflow && (
        <FlowReplay workflow={replayWorkflow} onClose={closeReplay} />
      )}
    </div>
  );
}
