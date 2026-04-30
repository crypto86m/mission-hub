import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Eye, Edit2, Trash2, Calendar, X, Play } from 'lucide-react';

export default function PhaseStatus({ phase, phaseNumber }) {
  const [expandedId, setExpandedId] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

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

  const handlePreview = (e, video) => {
    e.stopPropagation();
    if (video.url) {
      setPreviewVideo(video);
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Preview Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-dark-card border border-cyan/30 rounded-xl overflow-hidden max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">{previewVideo.title}</h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player */}
            <div className="bg-black aspect-[9/16] max-h-[60vh] flex items-center justify-center">
              <video
                key={previewVideo.url}
                src={previewVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
                style={{ maxHeight: '60vh' }}
              >
                Your browser does not support video playback.
              </video>
            </div>

            {/* Caption Preview */}
            {previewVideo.caption && (
              <div className="p-4 border-t border-white/10">
                <p className="text-gray-300 text-sm">{previewVideo.caption}</p>
                {previewVideo.hashtags && (
                  <p className="text-cyan text-xs mt-2 opacity-70">{previewVideo.hashtags}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
              {video.url ? (
                <video
                  src={video.url}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  muted
                  preload="metadata"
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                />
              ) : null}
              <div className="relative z-10 text-cyan opacity-60 group-hover:opacity-100 transition-opacity">
                <Play size={32} className="drop-shadow-lg" />
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
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
                  <span className="text-cyan">Format:</span> {video.format?.toUpperCase()}
                </p>
                <p className={`font-semibold ${video.status === 'ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {getStatusLabel(video.status)}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="flex-1 bg-cyan/10 hover:bg-cyan/20 text-cyan text-xs py-1 rounded transition-colors flex items-center justify-center gap-1"
                  onClick={(e) => handlePreview(e, video)}
                >
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
          {phase.videos[expandedId].caption && (
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-1">Caption</p>
              <p className="text-white text-sm">{phase.videos[expandedId].caption}</p>
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 bg-cyan/20 hover:bg-cyan/30 text-cyan font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2"
              onClick={(e) => handlePreview(e, phase.videos[expandedId])}
            >
              <Play size={16} /> Preview Video
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
