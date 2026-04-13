import React, { useState, useCallback, useMemo } from 'react';
import { Search, LayoutGrid, Network, ChevronDown } from 'lucide-react';
import WorkflowCardGrid from '../components/WorkflowCardGrid';
import WorkflowGraphView from '../components/WorkflowGraphView';

const WORKFLOWS_DATA = [
  {
    id: 'trading-deploy',
    name: 'Trading Strategy Deploy',
    stage: 'Model Testing',
    completion: 65,
    status: 'in-progress',
    statusColor: '#3B82F6',
    agents: ['Opus', 'Haiku', 'Perplexity'],
    duration: '2h 45m',
    cost: '$12.50',
    startTime: '2026-04-09 10:15',
    lastUpdate: 'Just now',
    description: 'Deploying new trading model with backtesting validation'
  },
  {
    id: 'bennett-brief',
    name: "Bennett's Brief Issue #49",
    stage: 'Distribution',
    completion: 92,
    status: 'in-progress',
    statusColor: '#3B82F6',
    agents: ['Claude', 'Perplexity', 'Superhuman'],
    duration: '1h 20m',
    cost: '$3.20',
    startTime: '2026-04-09 12:30',
    lastUpdate: '2 mins ago',
    description: 'Newsletter generation and distribution workflow'
  },
  {
    id: 'rlm-analysis',
    name: 'RLM Analysis',
    stage: 'Awaiting Review',
    completion: 40,
    status: 'waiting',
    statusColor: '#EAB308',
    agents: ['Opus', 'Sonnet'],
    duration: '45m',
    cost: '$8.75',
    startTime: '2026-04-09 08:00',
    lastUpdate: '30 mins ago',
    description: 'Monthly business performance analysis and reporting'
  },
  {
    id: 'nvcc-campaign',
    name: 'NVCC Campaign',
    stage: 'Complete',
    completion: 100,
    status: 'completed',
    statusColor: '#22C55E',
    agents: ['Growth Agent', 'Content Agent'],
    duration: '3h 15m',
    cost: '$15.40',
    startTime: '2026-04-08 14:20',
    lastUpdate: '22 hours ago',
    description: 'Napa Valley Car Club social media campaign execution'
  },
  {
    id: 'ai-support',
    name: 'AI Support Onboarding',
    stage: 'Blocked',
    completion: 25,
    status: 'blocked',
    statusColor: '#EF4444',
    agents: ['Claude', 'Haiku'],
    duration: '1h 10m',
    cost: '$5.60',
    startTime: '2026-04-09 09:45',
    lastUpdate: '5 mins ago',
    description: 'AI Support platform customer onboarding workflow - missing API credentials'
  }
];

export default function WorkflowIntelligence() {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'graph'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'blocked', label: 'Blocked' }
  ];

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    return WORKFLOWS_DATA.filter(workflow => {
      const matchesSearch =
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.agents.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const configs = {
      'completed': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Complete' },
      'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'In Progress' },
      'waiting': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Waiting' },
      'blocked': { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Blocked' }
    };
    return configs[status] || configs['waiting'];
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden">
      {/* Header Section */}
      <div className="border-b border-[#00D4FF]/10 bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="px-6 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Workflows</h1>
            <p className="text-gray-400 text-sm">Real-time orchestration & execution monitoring</p>
          </div>

          {/* Controls Bar */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="text"
                placeholder="Search workflows, stages, agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#00D4FF]/20 rounded-lg text-white placeholder-gray-600 focus:border-[#00D4FF] focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-[#1A1A1A] border border-[#00D4FF]/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 rounded transition-all text-sm font-medium flex items-center gap-2 ${
                  viewMode === 'cards'
                    ? 'bg-[#00D4FF] text-[#0A0A0A]'
                    : 'text-gray-400 hover:text-[#00D4FF]'
                }`}
              >
                <LayoutGrid size={16} /> Cards
              </button>
              <button
                onClick={() => setViewMode('graph')}
                className={`px-3 py-2 rounded transition-all text-sm font-medium flex items-center gap-2 ${
                  viewMode === 'graph'
                    ? 'bg-[#00D4FF] text-[#0A0A0A]'
                    : 'text-gray-400 hover:text-[#00D4FF]'
                }`}
              >
                <Network size={16} /> Graph
              </button>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-[#1A1A1A] border border-[#00D4FF]/20 rounded-lg text-white text-sm focus:border-[#00D4FF] focus:outline-none appearance-none cursor-pointer pr-8"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
            </div>

            {/* Results Count */}
            <div className="px-3 py-2 text-sm text-gray-400">
              {filteredWorkflows.length} of {WORKFLOWS_DATA.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'cards' ? (
          <WorkflowCardGrid
            workflows={filteredWorkflows}
            selectedWorkflow={selectedWorkflow}
            expandedWorkflow={expandedWorkflow}
            onSelectWorkflow={setSelectedWorkflow}
            onExpandWorkflow={setExpandedWorkflow}
            getStatusBadge={getStatusBadge}
          />
        ) : (
          <WorkflowGraphView
            workflows={filteredWorkflows}
            selectedWorkflow={selectedWorkflow}
            onSelectWorkflow={setSelectedWorkflow}
            getStatusBadge={getStatusBadge}
          />
        )}
      </div>

      {/* Quick Stats Footer */}
      {filteredWorkflows.length > 0 && (
        <div className="border-t border-[#00D4FF]/10 bg-[#0A0A0A]/80 backdrop-blur-sm px-6 py-4">
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-gray-500">Total Workflows</p>
              <p className="text-xl font-semibold text-white">{filteredWorkflows.length}</p>
            </div>
            <div>
              <p className="text-gray-500">In Progress</p>
              <p className="text-xl font-semibold text-blue-400">
                {filteredWorkflows.filter(w => w.status === 'in-progress').length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-green-400">
                {filteredWorkflows.filter(w => w.status === 'completed').length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Alerts</p>
              <p className="text-xl font-semibold text-red-400">
                {filteredWorkflows.filter(w => w.status === 'blocked').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
