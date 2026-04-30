import React, { useMemo } from 'react';
import { Lightbulb, TrendingDown, Zap } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

export default function OptimizationPanel({ workflow }) {
  const { suggestOptimizations, analyzeWorkflowBottlenecks } = useWorkflowStore();

  const suggestions = useMemo(
    () => suggestOptimizations(workflow.id),
    [workflow.id, suggestOptimizations]
  );

  const bottlenecks = useMemo(
    () =>
      analyzeWorkflowBottlenecks().filter(
        (b) => b.workflowId === workflow.id || b.workflowName === workflow.name
      ),
    [workflow.id, workflow.name, analyzeWorkflowBottlenecks]
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'parallelization':
        return <Zap size={16} />;
      case 'consolidation':
        return <TrendingDown size={16} />;
      case 'agent-replacement':
        return <Zap size={16} />;
      default:
        return <Lightbulb size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Bottlenecks */}
      {bottlenecks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <h4 className="font-semibold text-red-400">Bottlenecks Detected</h4>
          </div>
          <div className="space-y-2">
            {bottlenecks.map((bottleneck, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg border text-xs ${getSeverityColor(
                  bottleneck.severity
                )}`}
              >
                <div className="font-semibold capitalize mb-1">
                  {bottleneck.type.replace(/-/g, ' ')}
                </div>
                {bottleneck.type === 'dependency' && (
                  <p>Blocked by: {bottleneck.blockedOn.join(', ')}</p>
                )}
                {bottleneck.type === 'slow-progress' && (
                  <p>{bottleneck.currentCompletion}% complete after {bottleneck.currentCompletion}h</p>
                )}
                {bottleneck.type === 'low-success-rate' && (
                  <p>{bottleneck.agentName} success rate: {bottleneck.successRate}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-cyan" />
            <h4 className="font-semibold text-cyan">Optimization Opportunities</h4>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-lg bg-cyan/10 border border-cyan/30 text-xs"
              >
                <div className="flex items-start gap-2 mb-1">
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1">
                    <p className="font-semibold text-cyan capitalize">
                      {suggestion.type.replace(/-/g, ' ')}
                    </p>
                    <p className="text-gray-300 mt-1">{suggestion.description}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-cyan/20">
                  {suggestion.potentialTimeSavings && (
                    <p className="text-cyan">
                      ⏱ Time savings: {suggestion.potentialTimeSavings}
                    </p>
                  )}
                  {suggestion.potentialCostSavings && (
                    <p className="text-green-400">
                      💰 Cost savings: {suggestion.potentialCostSavings}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No issues state */}
      {bottlenecks.length === 0 && suggestions.length === 0 && (
        <div className="px-3 py-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <p className="text-sm text-green-400 font-semibold">✓ Workflow is optimized</p>
          <p className="text-xs text-green-400/70 mt-1">No bottlenecks detected</p>
        </div>
      )}

      {/* Stats */}
      <div className="border-t border-cyan/20 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Cost per hour</span>
          <span className="text-sm font-semibold text-green-400">
            ${(parseFloat(workflow.cost.replace('$', '')) / 2.25).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Agents efficiency</span>
          <div className="flex gap-1">
            {workflow.agents.slice(0, 3).map((agent, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full bg-green-400"
              ></div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Time remaining</span>
          <span className="text-sm font-semibold">
            {Math.max(0, Math.round((100 - workflow.completion) * 2.25 / 100))} min
          </span>
        </div>
      </div>
    </div>
  );
}
