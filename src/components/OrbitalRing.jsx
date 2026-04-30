import React from 'react';

export default function OrbitalRing({ companies, selectedCompany, setSelectedCompany }) {
  const centerX = 50;
  const centerY = 50;
  const radius = 35;

  const badgeSize = 60;
  const svgSize = 300;

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md aspect-square">
        {/* SVG Orbital Rings */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.1))' }}
        >
          {/* Outer rings */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(0, 212, 255, 0.1)"
            strokeWidth="0.5"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.7}
            fill="none"
            stroke="rgba(0, 212, 255, 0.08)"
            strokeWidth="0.5"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.4}
            fill="none"
            stroke="rgba(0, 212, 255, 0.1)"
            strokeWidth="0.5"
          />

          {/* Center glow circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill="rgba(0, 212, 255, 0.1)"
            stroke="rgba(0, 212, 255, 0.3)"
            strokeWidth="0.5"
          />

          {/* Orbital lines to badges */}
          {companies.map((company, index) => {
            const angle = (index / companies.length) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={`line-${company.id}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgba(0, 212, 255, 0.15)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            );
          })}
        </svg>

        {/* Center Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => setSelectedCompany(null)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-blue-600 flex items-center justify-center text-2xl glow-center hover:scale-110 transition-transform duration-300 border-2 border-cyan shadow-lg hover:shadow-glow-strong"
          >
            🛰️
          </button>
        </div>

        {/* Company Badges */}
        {companies.map((company, index) => {
          const angle = (index / companies.length) * Math.PI * 2 - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          const isSelected = selectedCompany?.id === company.id;

          return (
            <div
              key={company.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 30 : 10,
              }}
            >
              <button
                onClick={() => setSelectedCompany(company)}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-125 overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan to-blue-600 border-2 border-white scale-125 shadow-glow-strong'
                    : `bg-gradient-to-br ${company.color} border-2 border-cyan/50 hover:border-cyan hover:shadow-glow`
                }`}
              >
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain rounded-full bg-white p-1" />
                ) : (
                  <div className="text-3xl">{company.icon}</div>
                )}
              </button>
              <p className={`text-center mt-2 font-semibold text-xs transition-colors ${isSelected ? 'text-cyan' : 'text-gray-300'}`}>
                {company.name}
              </p>
              <p className="text-center text-xs text-gray-500">{company.stats}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
