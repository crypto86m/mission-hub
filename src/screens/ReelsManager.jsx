import React, { useState, useEffect } from 'react';
import { Film, Copy, CheckCircle } from 'lucide-react';

export default function ReelsManager() {
  const [reels, setReels] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reels.json')
      .then(res => res.json())
      .then(data => {
        setReels(data.reels || []);
        if (data.reels && data.reels.length > 0) {
          setSelectedReel(data.reels[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading reels:', err);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 text-white">
        <p>Loading reels...</p>
      </div>
    );
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="p-8 text-white">
        <p>No reels available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 overflow-y-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Film size={32} className="text-cyan" />
          Instagram Reels ({reels.length})
        </h1>
        <p className="text-gray-400 mt-1">Production-ready reels ready to post</p>
      </div>

      {/* Reels List */}
      <div className="grid grid-cols-1 gap-3">
        {reels.map((reel, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedReel(reel)}
            className={`text-left p-4 rounded-lg border transition-all ${
              selectedReel?.id === reel.id
                ? 'border-cyan bg-cyan/10'
                : 'border-gray-700 hover:border-cyan/50 bg-dark-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">{reel.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{reel.day} • {reel.target}</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Ready</span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Reel Details */}
      {selectedReel && (
        <div className="bg-dark-card rounded-lg border border-cyan/20 p-6 space-y-4">
          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              controls
              style={{
                width: '100%',
                maxHeight: '500px',
                backgroundColor: '#000'
              }}
            >
              <source src={`http://100.65.157.30:5555/video/${selectedReel.id}`} type="video/mp4" />
              <source src={`/downloads/${selectedReel.id}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Video streaming from Mac mini via Tailscale
          </p>
          <h2 className="text-2xl font-bold text-white mt-4">{selectedReel.title}</h2>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-dark-bg/50 rounded p-3">
              <p className="text-gray-400">Duration</p>
              <p className="text-white font-semibold">{selectedReel.duration}</p>
            </div>
            <div className="bg-dark-bg/50 rounded p-3">
              <p className="text-gray-400">Target</p>
              <p className="text-cyan font-semibold">{selectedReel.target}</p>
            </div>
            <div className="bg-dark-bg/50 rounded p-3">
              <p className="text-gray-400">Theme</p>
              <p className="text-white font-semibold">{selectedReel.theme}</p>
            </div>
            <div className="bg-dark-bg/50 rounded p-3">
              <p className="text-gray-400">Vibe</p>
              <p className="text-white font-semibold">{selectedReel.vibe}</p>
            </div>
          </div>

          {/* Caption */}
          <div>
            <h3 className="font-bold text-white mb-2">Caption</h3>
            <div className="bg-dark-bg/50 rounded p-4 text-gray-300 text-sm whitespace-pre-wrap">
              {selectedReel.caption}
            </div>
            <button
              onClick={() => copyToClipboard(selectedReel.caption)}
              className={`w-full mt-2 py-2 rounded font-semibold flex items-center justify-center gap-2 transition-colors ${
                copied
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-cyan text-dark-bg hover:bg-cyan/80'
              }`}
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Caption'}
            </button>
          </div>

          {/* Hashtags */}
          <div>
            <h3 className="font-bold text-white mb-2">Hashtags</h3>
            <div className="bg-dark-bg/50 rounded p-4 text-cyan text-sm font-mono">
              {selectedReel.hashtags}
            </div>
            <button
              onClick={() => copyToClipboard(selectedReel.hashtags)}
              className="w-full mt-2 py-2 rounded font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Copy Hashtags
            </button>
          </div>

          {/* File Info */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-bold text-white mb-2">File Details</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Size: {selectedReel.fileSize}</p>
              <p>Format: {selectedReel.format}</p>
              {selectedReel.colorGrade && <p>Color Grade: {selectedReel.colorGrade}</p>}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Download from local workspace: <br />
              <code className="text-gray-400">/instagram/reels/{selectedReel.id}.mp4</code>
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <CheckCircle size={18} />
              Ready to Upload
            </h4>
            <ol className="space-y-1 text-sm text-gray-300 list-decimal list-inside">
              <li>Download MP4 from workspace</li>
              <li>Open Instagram → Create → Reels</li>
              <li>Upload video</li>
              <li>Copy & paste caption</li>
              <li>Add hashtags</li>
              <li>Post at 9 AM PT</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
