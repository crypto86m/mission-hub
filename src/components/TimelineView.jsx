import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TimelineView({ workflows, onSelectWorkflow, onStartReplay }) {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'waiting':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'blocked':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  // Calculate timeline positions
  const allStartTimes = workflows.map((w) => new Date(w.startTime).getTime());
  const minTime = Math.min(...allStartTimes);
  const maxTime = Math.max(
    ...workflows.map((w) => {
      const start = new Date(w.startTime).getTime();
      const durationMs = parseInt(w.duration) * 60 * 1000 || 60 * 60 * 1000;
      return start + durationMs;
    })
  );

  const timeRange = maxTime - minTime || 3600000;
  const timelineWidth = 600;

  const getTimelinePosition = (timestamp) => {
    const offset = new Date(timestamp).getTime() - minTime;
    return (offset / timeRange) * timelineWidth;
  };

  const getTimelineWidth = (startTime, duration) => {
    const durationMs = parseInt(duration) * 60 * 1000 || 60 * 60 * 1000;
    return (durationMs / timeRange) * timelineWidth;
  };

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-6">
      <div className="space-y-4">
        {workflows.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No workflows to display</p>
          </div>
        ) : (
          workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`glass-card cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan/20 ${getStatusBgColor(
                workflow.status
              )}`}
              onClick={() => onSelectWorkflow(workflow)}
            >
              <div className="flex items-start gap-4">
                {/* Timeline bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{workflow.name}</h3>
                      <p className="text-sm text-gray-400">{workflow.stage}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === workflow.id ? null : workflow.id);
                      }}
                      className="text-gray-400 hover:text-cyan transition-colors"
                    >
                      {expandedId === workflow.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{workflow.stage}</span>
                      <span className="text-xs font-semibold">{Math.round(workflow.completion)}%</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getStatusColor(
                          workflow.status
                        )}`}
                        style={{ width: `${workflow.completion}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline visualization */}
                  <div className="relative h-12 bg-dark-bg rounded-lg overflow-x-auto mb-2">
                    <div className="absolute inset-0 flex items-center p-2">
                      {/* Timeline bar background */}
                      <div
                        className={`absolute h-6 rounded ${getStatusColor(
                          workflow.status
                        )} opacity-30`}
                        style={{
                          left: `${getTimelinePosition(workflow.startTime)}px`,
                          width: `${getTimelineWidth(
                            workflow.startTime,
                            workflow.duration
                          )}px`,
                        }}
                      ></div>

                      {/* Timeline bar with glow */}
                      <div
                        className={`absolute h-6 rounded ${getStatusColor(
                          workflow.status
                        )} shadow-lg`}
                        style={{
                          left: `${getTimelinePosition(workflow.startTime)}px`,
                          width: `${Math.max(
                            getTimelineWidth(workflow.startTime, workflow.duration),
                            4
                          )}px`,
                        }}
                      ></div>

                      {/* Progress indicator */}
                      <div
                        className="absolute w-0.5 h-8 bg-cyan"
                        style={{
                          left: `${
                            getTimelinePosition(workflow.startTime) +
                            getTimelineWidth(workflow.startTime, workflow.duration) *
                              (workflow.completion / 100)
                          }px`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-semibold">{workflow.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cost</p>
                      <p className="font-semibold text-green-400">{workflow.cost}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Agents</p>
                      <p className="font-semibold">{workflow.agents.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-semibold capitalize">{workflow.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === workflow.id && (
                <div className="border-t border-cyan/20 mt-4 pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expected Completion</p>
                      <p className="text-sm font-semibold">
                        {new Date(workflow.expectedCompletion).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Started</p>
                      <p className="text-sm font-semibold">
                        {new Date(workflow.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Agents */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Agents</p>
                    <div className="flex flex-wrap gap-1">
                      {workflow.agents.map((agent, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-cyan/20 text-cyan rounded text-xs font-semibold"
                        >
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dependencies */}
                  {workflow.dependencies && workflow.dependencies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Dependencies</p>
                      <div className="space-y-1">
                        {workflow.dependencies.map((dep, idx) => (
                          <div
                            key={idx}
                            className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs border border-yellow-500/30"
                          >
                            {dep}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* History */}
                  {workflow.history && workflow.history.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Stage History</p>
                      <div className="space-y-2">
                        {workflow.history.map((stage, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between">
                              <span className="font-semibold">{stage.stage}</span>
                              <span className="text-gray-500">{stage.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartReplay(workflow);
                      }}
                      className="flex-1 px-3 py-2 bg-cyan/20 hover:bg-cyan/30 text-cyan rounded transition-colors text-sm font-semibold"
                    >
                      ▶ Start Replay
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
