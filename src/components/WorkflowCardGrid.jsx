import React from 'react';
import { ChevronDown, Clock, DollarSign, Users, AlertCircle, CheckCircle, Zap } from 'lucide-react';

export default function WorkflowCardGrid({
  workflows,
  selectedWorkflow,
  expandedWorkflow,
  onSelectWorkflow,
  onExpandWorkflow,
  getStatusBadge
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Zap className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'waiting':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-red-500';
      case 'waiting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (workflows.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No workflows found</p>
          <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => {
            const isExpanded = expandedWorkflow === workflow.id;
            const badgeConfig = getStatusBadge(workflow.status);

            return (
              <div
                key={workflow.id}
                className="group relative overflow-hidden rounded-xl border border-[#00D4FF]/20 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] hover:border-[#00D4FF]/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#00D4FF]/20"
                onClick={() => onSelectWorkflow(workflow)}
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Background Glow on Hover */}
                <div className="absolute inset-0 bg-[#00D4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative p-5">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm leading-tight mb-1">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-gray-500">{workflow.stage}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {getStatusIcon(workflow.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`}>
                        {badgeConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className={`text-xs font-semibold ${
                        workflow.status === 'completed' ? 'text-green-400' :
                        workflow.status === 'in-progress' ? 'text-blue-400' :
                        workflow.status === 'blocked' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {workflow.completion}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#0A0A0A] rounded-full overflow-hidden border border-[#00D4FF]/10">
                      <div
                        className={`h-full ${getProgressColor(workflow.status)} transition-all duration-500 ease-out`}
                        style={{ width: `${workflow.completion}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[#00D4FF]/10">
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-xs font-medium text-gray-300">{workflow.duration}</p>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Cost</p>
                        <p className="text-xs font-medium text-green-400">{workflow.cost}</p>
                      </div>
                    </div>
                  </div>

                  {/* Agents */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <p className="text-xs text-gray-500">Agents ({workflow.agents.length})</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {workflow.agents.map((agent, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#00D4FF]/15 text-[#00D4FF] rounded text-xs font-medium border border-[#00D4FF]/30"
                        >
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Updated {workflow.lastUpdate}</span>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpandWorkflow(isExpanded ? null : workflow.id);
                    }}
                    className="w-full px-3 py-2 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-[#00D4FF]/30"
                  >
                    <span>{isExpanded ? 'Hide' : 'View'} Details</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#00D4FF]/10 px-5 py-4 bg-[#0A0A0A]/50 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-400">{workflow.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#00D4FF]/10">
                      <div>
                        <p className="text-xs text-gray-500">Started</p>
                        <p className="text-xs font-mono text-gray-400">{workflow.startTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-xs font-medium capitalize text-gray-300">{workflow.status}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
