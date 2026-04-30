import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function WorkflowGraph({ workflows, agents, onSelectWorkflow, onStartReplay }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth || 1000;
        const height = containerRef.current.offsetHeight || 600;
        setDimensions({
          width: Math.max(width, 800),
          height: Math.max(height, 600),
        });
      }
    };

    // Initial update with small delay to ensure DOM is ready
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Update dimensions when workflows change
  useEffect(() => {
    if (containerRef.current && dimensions.width === 0) {
      const width = containerRef.current.offsetWidth || 1000;
      const height = containerRef.current.offsetHeight || 600;
      setDimensions({
        width: Math.max(width, 800),
        height: Math.max(height, 600),
      });
    }
  }, [workflows]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in-progress':
        return '#3b82f6';
      case 'waiting':
        return '#eab308';
      case 'blocked':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusGlow = (status) => {
    switch (status) {
      case 'completed':
        return 'rgba(34, 197, 94, 0.4)';
      case 'in-progress':
        return 'rgba(59, 130, 246, 0.4)';
      case 'waiting':
        return 'rgba(234, 179, 8, 0.4)';
      case 'blocked':
        return 'rgba(239, 68, 68, 0.4)';
      default:
        return 'rgba(107, 114, 128, 0.4)';
    }
  };

  // Layout workflows in a force-directed-like pattern
  const layoutWorkflows = () => {
    const w = dimensions.width || 1000;
    const h = dimensions.height || 600;
    const nodeWidth = 200;
    const nodeHeight = 140;
    const padding = 40;
    const cols = Math.max(2, Math.floor((w - padding) / (nodeWidth + 30)));
    const rows = Math.ceil(workflows.length / cols);

    return workflows.map((wf, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padding + col * (nodeWidth + 30);
      const y = padding + row * (nodeHeight + 40);
      return { ...wf, x, y };
    });
  };

  const layoutedWorkflows = layoutWorkflows();
  
  // Ensure we have valid dimensions
  const displayWidth = dimensions.width || 1000;
  const displayHeight = dimensions.height || 600;

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-br from-dark-bg to-dark-bg/80 relative overflow-hidden" style={{ minHeight: '600px' }}>
      <svg
        ref={svgRef}
        width={displayWidth}
        height={displayHeight}
        className="absolute inset-0"
        style={{ display: 'block' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Status-specific glow filters */}
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feFlood floodColor="#22c55e" floodOpacity="0.6" />
            <feComposite in="SourceGraphic" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines (workflow dependencies) */}
        {layoutedWorkflows.map((wf, idx) => {
          if (wf.dependencies && wf.dependencies.length > 0) {
            return wf.dependencies.map((dep, depIdx) => {
              const depWf = layoutedWorkflows.find((w) => w.name.includes(dep.split('(')[0]));
              if (!depWf) return null;

              const x1 = wf.x + 100;
              const y1 = wf.y;
              const x2 = depWf.x + 100;
              const y2 = depWf.y + 140;

              return (
                <g key={`dep-${idx}-${depIdx}`}>
                  {/* Connection line */}
                  <path
                    d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}`}
                    stroke="rgba(0, 212, 255, 0.2)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Animated arrow */}
                  <defs>
                    <marker
                      id={`arrow-${idx}-${depIdx}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                    >
                      <circle cx="5" cy="5" r="3" fill="rgba(0, 212, 255, 0.5)" />
                    </marker>
                  </defs>
                </g>
              );
            });
          }
          return null;
        })}

        {/* Workflow nodes */}
        {layoutedWorkflows.map((wf) => {
          const nodeColor = getStatusColor(wf.status);
          const nodeGlow = getStatusGlow(wf.status);
          const isHovered = hoveredNode === wf.id;

          return (
            <g key={wf.id}>
              {/* Node background glow */}
              <rect
                x={wf.x - 100}
                y={wf.y - 5}
                width="200"
                height="140"
                fill={nodeGlow}
                rx="12"
                filter="url(#glow)"
                opacity={isHovered ? 1 : 0.5}
                className="transition-opacity duration-200"
              />

              {/* Node border */}
              <rect
                x={wf.x - 100}
                y={wf.y - 5}
                width="200"
                height="140"
                fill="rgba(26, 26, 26, 0.8)"
                stroke={nodeColor}
                strokeWidth={isHovered ? 3 : 2}
                rx="12"
                className="cursor-pointer transition-all duration-200 hover:stroke-cyan hover:stroke-width-3"
                onMouseEnter={() => setHoveredNode(wf.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectWorkflow(wf)}
              />

              {/* Status indicator dot */}
              <circle
                cx={wf.x - 90}
                cy={wf.y}
                r="6"
                fill={nodeColor}
                filter="url(#glow)"
                className={wf.status === 'in-progress' ? 'animate-pulse-glow' : ''}
              />

              {/* Node title */}
              <text
                x={wf.x}
                y={wf.y + 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="white"
                className="pointer-events-none"
              >
                {wf.name.length > 20 ? wf.name.substring(0, 17) + '...' : wf.name}
              </text>

              {/* Node stage */}
              <text
                x={wf.x}
                y={wf.y + 28}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(200, 200, 200, 0.8)"
                className="pointer-events-none"
              >
                {wf.stage}
              </text>

              {/* Progress bar */}
              <rect
                x={wf.x - 80}
                y={wf.y + 38}
                width="160"
                height="6"
                fill="rgba(255, 255, 255, 0.1)"
                rx="3"
              />
              <rect
                x={wf.x - 80}
                y={wf.y + 38}
                width={160 * (wf.completion / 100)}
                height="6"
                fill={nodeColor}
                rx="3"
                className="transition-all duration-500"
              />

              {/* Completion percentage */}
              <text
                x={wf.x}
                y={wf.y + 60}
                textAnchor="middle"
                fontSize="10"
                fill={nodeColor}
                fontWeight="600"
                className="pointer-events-none"
              >
                {Math.round(wf.completion)}%
              </text>

              {/* Cost */}
              <text
                x={wf.x}
                y={wf.y + 78}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(150, 150, 150, 0.9)"
                className="pointer-events-none"
              >
                {wf.cost}
              </text>

              {/* Agents indicator */}
              <text
                x={wf.x}
                y={wf.y + 95}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(100, 200, 255, 0.8)"
                className="pointer-events-none"
              >
                {wf.agents.length} agents
              </text>

              {/* Hover action buttons */}
              {isHovered && (
                <g>
                  <rect
                    x={wf.x - 45}
                    y={wf.y + 105}
                    width="90"
                    height="25"
                    fill="rgba(0, 212, 255, 0.15)"
                    stroke="rgba(0, 212, 255, 0.5)"
                    rx="6"
                  />
                  <text
                    x={wf.x}
                    y={wf.y + 125}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#00d4ff"
                    fontWeight="600"
                    className="cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartReplay(wf);
                    }}
                  >
                    ▶ Replay
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Empty state */}
      {workflows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No workflows to display</p>
            <p className="text-gray-600 text-sm mt-2">Workflows will appear here as they're created</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card">
        <p className="text-xs font-semibold text-cyan mb-2">Status</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>Waiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
