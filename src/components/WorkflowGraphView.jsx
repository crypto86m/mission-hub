import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Zap, AlertCircle, Clock } from 'lucide-react';

export default function WorkflowGraphView({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
  getStatusBadge
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth || 1000,
          height: containerRef.current.offsetHeight || 700
        });
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Calculate node positions using force-directed layout
  const layoutNodes = () => {
    const w = dimensions.width || 1000;
    const h = dimensions.height || 700;
    const nodeWidth = 220;
    const nodeHeight = 160;
    const padding = 60;
    const horizontalGap = nodeWidth + 50;
    const verticalGap = nodeHeight + 60;

    // Create grid layout for workflows
    const cols = Math.max(2, Math.floor((w - padding) / horizontalGap));
    const rows = Math.ceil(workflows.length / cols);

    return workflows.map((wf, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padding + col * horizontalGap + horizontalGap / 2;
      const y = padding + row * verticalGap + verticalGap / 2;
      return { ...wf, x, y };
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { fill: '#22C55E', fillRGB: 'rgb(34, 197, 94)' };
      case 'in-progress':
        return { fill: '#3B82F6', fillRGB: 'rgb(59, 130, 246)' };
      case 'waiting':
        return { fill: '#EAB308', fillRGB: 'rgb(234, 179, 8)' };
      case 'blocked':
        return { fill: '#EF4444', fillRGB: 'rgb(239, 68, 68)' };
      default:
        return { fill: '#6B7280', fillRGB: 'rgb(107, 114, 128)' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⚡';
      case 'blocked':
        return '!';
      case 'waiting':
        return '⏱';
      default:
        return '•';
    }
  };

  const layoutedNodes = layoutNodes();
  const displayWidth = dimensions.width || 1000;
  const displayHeight = dimensions.height || 700;

  if (workflows.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No workflows to visualize</p>
          <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] relative overflow-auto"
      style={{ minHeight: '700px' }}
    >
      <svg
        ref={svgRef}
        width={displayWidth}
        height={displayHeight}
        className="absolute top-0 left-0"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Glow effects for each status */}
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feFlood floodColor="#22C55E" floodOpacity="0.3" />
            <feComposite in="SourceGraphic" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feFlood floodColor="#3B82F6" floodOpacity="0.3" />
            <feComposite in="SourceGraphic" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feFlood floodColor="#EAB308" floodOpacity="0.3" />
            <feComposite in="SourceGraphic" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feFlood floodColor="#EF4444" floodOpacity="0.3" />
            <feComposite in="SourceGraphic" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Connection line markers */}
          <marker
            id="arrowBlue"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" opacity="0.4" />
          </marker>
          <marker
            id="arrowGreen"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" opacity="0.4" />
          </marker>
        </defs>

        {/* Connection lines between related workflows */}
        {layoutedNodes.map((node, idx) => {
          // Connect in-progress to waiting workflows
          if (node.status === 'in-progress' && idx < layoutedNodes.length - 1) {
            const nextNode = layoutedNodes[idx + 1];
            return (
              <g key={`connection-${idx}`}>
                <path
                  d={`M ${node.x + 100} ${node.y + 70} Q ${(node.x + nextNode.x) / 2} ${(node.y + nextNode.y) / 2 + 30} ${nextNode.x - 100} ${nextNode.y - 70}`}
                  stroke="#00D4FF"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowBlue)"
                />
              </g>
            );
          }
          return null;
        })}

        {/* Workflow nodes */}
        {layoutedNodes.map((node) => {
          const isSelected = selectedWorkflow?.id === node.id;
          const isHovered = hoveredNode === node.id;
          const statusColor = getStatusColor(node.status);
          const glovFilter = {
            'completed': 'url(#glow-green)',
            'in-progress': 'url(#glow-blue)',
            'waiting': 'url(#glow-yellow)',
            'blocked': 'url(#glow-red)'
          }[node.status] || 'url(#glow-blue)';

          const nodeWidth = 220;
          const nodeHeight = 160;

          return (
            <g
              key={node.id}
              onClick={() => onSelectWorkflow(node)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow background */}
              {(isSelected || isHovered) && (
                <rect
                  x={node.x - nodeWidth / 2 - 10}
                  y={node.y - nodeHeight / 2 - 10}
                  width={nodeWidth + 20}
                  height={nodeHeight + 20}
                  fill={statusColor.fill}
                  opacity="0.05"
                  rx="16"
                />
              )}

              {/* Node background */}
              <rect
                x={node.x - nodeWidth / 2}
                y={node.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                fill="#1A1A1A"
                stroke={isSelected ? '#00D4FF' : statusColor.fill}
                strokeWidth={isSelected ? 2.5 : 1.5}
                rx="12"
                filter={isSelected ? glovFilter : 'none'}
                opacity={isHovered || isSelected ? 1 : 0.9}
                className="transition-all duration-200"
              />

              {/* Top accent line */}
              <rect
                x={node.x - nodeWidth / 2}
                y={node.y - nodeHeight / 2}
                width={nodeWidth}
                height="3"
                fill={statusColor.fill}
                rx="3"
              />

              {/* Status icon with glow */}
              <circle
                cx={node.x - nodeWidth / 2 + 20}
                cy={node.y - nodeHeight / 2 + 20}
                r="10"
                fill={statusColor.fill}
                opacity={isHovered || isSelected ? 1 : 0.8}
                filter={isHovered || isSelected ? glovFilter : 'none'}
              />
              <text
                x={node.x - nodeWidth / 2 + 20}
                y={node.y - nodeHeight / 2 + 25}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill="white"
                pointerEvents="none"
              >
                {getStatusIcon(node.status)}
              </text>

              {/* Title */}
              <text
                x={node.x}
                y={node.y - 40}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="white"
                pointerEvents="none"
              >
                {node.name.length > 25 ? node.name.substring(0, 22) + '...' : node.name}
              </text>

              {/* Stage */}
              <text
                x={node.x}
                y={node.y - 20}
                textAnchor="middle"
                fontSize="11"
                fill="#999999"
                pointerEvents="none"
              >
                {node.stage}
              </text>

              {/* Progress bar background */}
              <rect
                x={node.x - 80}
                y={node.y + 5}
                width="160"
                height="8"
                fill="rgba(255, 255, 255, 0.05)"
                rx="4"
              />

              {/* Progress bar fill */}
              <rect
                x={node.x - 80}
                y={node.y + 5}
                width={160 * (node.completion / 100)}
                height="8"
                fill={statusColor.fill}
                rx="4"
                className="transition-all duration-500"
              />

              {/* Percentage text */}
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={statusColor.fill}
                pointerEvents="none"
              >
                {Math.round(node.completion)}%
              </text>

              {/* Duration & Cost */}
              <text
                x={node.x}
                y={node.y + 55}
                textAnchor="middle"
                fontSize="10"
                fill="#888888"
                pointerEvents="none"
              >
                {node.duration}
              </text>

              {/* Agents count */}
              <text
                x={node.x}
                y={node.y + 70}
                textAnchor="middle"
                fontSize="10"
                fill="#888888"
                pointerEvents="none"
              >
                {node.agents.length} agents
              </text>

              {/* Interactive hover area for better click target */}
              <rect
                x={node.x - nodeWidth / 2}
                y={node.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-[#1A1A1A]/95 border border-[#00D4FF]/20 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold text-[#00D4FF] mb-3">Status Legend</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-400">Waiting</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-400">Blocked</span>
          </div>
        </div>
      </div>

      {/* Selected Workflow Info Panel */}
      {selectedWorkflow && (
        <div className="absolute top-6 right-6 bg-[#1A1A1A]/95 border border-[#00D4FF]/20 rounded-xl p-5 backdrop-blur-sm max-w-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white mb-1">{selectedWorkflow.name}</h3>
            <p className="text-xs text-gray-500">{selectedWorkflow.stage}</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="text-gray-300 font-medium capitalize">{selectedWorkflow.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Progress:</span>
              <span className="text-gray-300 font-medium">{selectedWorkflow.completion}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="text-gray-300 font-medium">{selectedWorkflow.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cost:</span>
              <span className="text-green-400 font-medium">{selectedWorkflow.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Agents:</span>
              <span className="text-gray-300 font-medium">{selectedWorkflow.agents.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
