import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Eye, Edit2, Trash2, Calendar } from 'lucide-react';

export default function PhaseStatus({ phase, phaseNumber }) {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'pending_text':
        return <Clock size={20} className="text-yellow-400" />;
      case 'pending_audio':
        return <Clock size={20} className="text-yellow-400" />;
      default:
        return <AlertCircle size={20} className="text-red-400" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'pending_text':
        return 'Pending Text';
      case 'pending_audio':
        return 'Pending Audio';
      default:
        return 'Unknown';
    }
  };

  const statusCounts = {
    ready: phase.videos.filter(v => v.status === 'ready').length,
    pending_text: phase.videos.filter(v => v.status === 'pending_text').length,
    pending_audio: phase.videos.filter(v => v.status === 'pending_audio').length,
  };

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-card border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold text-2xl">{statusCounts.ready}</p>
          <p className="text-gray-400 text-sm">Ready</p>
        </div>
        <div className="bg-dark-card border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold text-2xl">{statusCounts.pending_text}</p>
          <p className="text-gray-400 text-sm">Pending Text</p>
        </div>
        <div className="bg-dark-card border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold text-2xl">{statusCounts.pending_audio}</p>
          <p className="text-gray-400 text-sm">Pending Audio</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {phase.videos.map((video, idx) => (
          <div
            key={idx}
            className="bg-dark-card border border-cyan/20 rounded-lg overflow-hidden hover:border-cyan/50 transition-colors group cursor-pointer"
            onClick={() => setExpandedId(expandedId === idx ? null : idx)}
          >
            {/* Thumbnail */}
            <div className="relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 aspect-square flex items-center justify-center">
              <div className="text-cyan opacity-50 group-hover:opacity-100 transition-opacity">
                <Film size={32} />
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-2">
                {getStatusIcon(video.status)}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3">
              <p className="font-semibold text-white text-sm truncate mb-2">{video.title}</p>
              <div className="space-y-1 text-xs">
                <p className="text-gray-400">
                  <span className="text-cyan">Duration:</span> {video.duration}
                </p>
                <p className="text-gray-400">
                  <span className="text-cyan">Format:</span> {video.format.toUpperCase()}
                </p>
                <p className={`font-semibold ${video.status === 'ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {getStatusLabel(video.status)}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 bg-cyan/10 hover:bg-cyan/20 text-cyan text-xs py-1 rounded transition-colors flex items-center justify-center gap-1">
                  <Eye size={12} /> Preview
                </button>
                <button className="flex-1 bg-blue/10 hover:bg-blue/20 text-blue text-xs py-1 rounded transition-colors flex items-center justify-center gap-1">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Post Details */}
      {expandedId !== null && phase.videos[expandedId] && (
        <div className="bg-dark-card border border-cyan/30 rounded-lg p-6 mt-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{phase.videos[expandedId].title}</h3>
            <button onClick={() => setExpandedId(null)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Duration</p>
              <p className="text-white font-semibold">{phase.videos[expandedId].duration}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Format</p>
              <p className="text-white font-semibold">{phase.videos[expandedId].format}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className={`font-semibold flex items-center gap-2 ${
                phase.videos[expandedId].status === 'ready' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {getStatusIcon(phase.videos[expandedId].status)}
                {getStatusLabel(phase.videos[expandedId].status)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">CTA</p>
              <p className="text-white font-semibold">{phase.videos[expandedId].cta}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-cyan/20 hover:bg-cyan/30 text-cyan font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2">
              <Eye size={16} /> Preview Video
            </button>
            <button className="flex-1 bg-blue/20 hover:bg-blue/30 text-blue font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2">
              <Calendar size={16} /> Schedule
            </button>
            <button className="flex-1 bg-red/20 hover:bg-red/30 text-red font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2">
              <Trash2 size={16} /> Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Film({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
    </svg>
  );
}
