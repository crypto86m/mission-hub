import React from 'react';

export default function AgentOrb({ agent, expandedAgent, setExpandedAgent }) {
  const isExpanded = expandedAgent === agent.id;

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-sm">
        {/* SVG Central Orb */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.2))' }}
        >
          {/* Orbital rings */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(0, 212, 255, 0.1)"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="rgba(0, 212, 255, 0.08)"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="none"
            stroke="rgba(0, 212, 255, 0.1)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Center Agent Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan to-blue-600 flex flex-col items-center justify-center transition-all duration-300 border-2 border-cyan glow-center hover:scale-110 active:scale-95"
          >
            <div className="text-5xl mb-1">{agent.avatar}</div>
            <div className="status-dot active absolute bottom-2 right-2"></div>
          </button>
        </div>

        {/* Agent Name & Status */}
        <div className="absolute top-0 left-0 right-0 text-center pt-4 z-10">
          <h3 className="text-lg font-bold text-white">{agent.name}</h3>
          <p className="text-xs text-gray-400">{agent.title}</p>
        </div>

        {/* Expanded Details Card */}
        {isExpanded && (
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-72 glass-card animate-float z-30">
            <h4 className="font-semibold text-white mb-2">{agent.name}</h4>
            <p className="text-sm text-gray-300 mb-3">{agent.description}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-300 rounded">
                Active
              </span>
              <span className="text-xs px-2 py-1 bg-cyan/10 border border-cyan/30 text-cyan rounded">
                {agent.role}
              </span>
              <span className="text-xs px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded">
                {agent.lastActive}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
