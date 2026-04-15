import React from 'react';
import { Upload, Calendar, Film, Zap } from 'lucide-react';

export default function QuickActions({ phase1, phase2 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-dark-card border border-cyan/20 rounded-lg p-4 text-center">
        <Film className="mx-auto mb-2 text-cyan" size={24} />
        <p className="text-sm font-bold text-white">{phase1?.ready || 0}/{phase1?.total || 0}</p>
        <p className="text-xs text-gray-400">Phase 1 Ready</p>
      </div>
      <div className="bg-dark-card border border-cyan/20 rounded-lg p-4 text-center">
        <Calendar className="mx-auto mb-2 text-cyan" size={24} />
        <p className="text-sm font-bold text-white">{phase2?.total || 0}</p>
        <p className="text-xs text-gray-400">Phase 2 Posts</p>
      </div>
      <div className="bg-dark-card border border-cyan/20 rounded-lg p-4 text-center">
        <Upload className="mx-auto mb-2 text-gray-500" size={24} />
        <p className="text-sm font-bold text-gray-500">—</p>
        <p className="text-xs text-gray-500">Upload Queue</p>
      </div>
      <div className="bg-dark-card border border-cyan/20 rounded-lg p-4 text-center">
        <Zap className="mx-auto mb-2 text-gray-500" size={24} />
        <p className="text-sm font-bold text-gray-500">—</p>
        <p className="text-xs text-gray-500">Auto-Post</p>
      </div>
    </div>
  );
}
