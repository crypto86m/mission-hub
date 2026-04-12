import React, { useState, useEffect } from 'react';
import { Play, Download, Share2, Check } from 'lucide-react';

const ReelsGallery = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState(null);

  useEffect(() => {
    fetch('/api/reels.json')
      .then(res => res.json())
      .then(data => {
        setReels(data.reels);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load reels:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading reels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">📹 Reels Created</h2>
        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
          {reels.length} Ready to Publish
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="bg-dark-card border border-gray-700 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all cursor-pointer group"
            onClick={() => setSelectedReel(selectedReel?.id === reel.id ? null : reel)}
          >
            {/* Thumbnail/Preview */}
            <div className="relative bg-black aspect-[9/16] flex items-center justify-center overflow-hidden">
              <video
                src={reel.url}
                className="w-full h-full object-cover"
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transition-all" />
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white text-sm leading-tight flex-1">
                  {reel.title}
                </h3>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded whitespace-nowrap">
                  ✓ Ready
                </span>
              </div>

              <p className="text-xs text-gray-400">{reel.description}</p>

              <div className="flex gap-2 text-xs text-gray-500 pt-2">
                <span>⏱️ {reel.duration}</span>
                <span>📦 {reel.size}</span>
              </div>

              <div className="flex gap-2 pt-3">
                <a
                  href={reel.url}
                  download={reel.filename}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 text-xs py-2 rounded transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs py-2 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.share?.({
                      title: reel.title,
                      text: reel.description,
                      url: window.location.href,
                    });
                  }}
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedReel && (
        <div className="bg-dark-card border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{selectedReel.title}</h3>
            <button
              onClick={() => setSelectedReel(null)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Hook</span>
              <p className="text-white font-semibold mt-1">"{selectedReel.hook}"</p>
            </div>
            <div>
              <span className="text-gray-400">Call to Action</span>
              <p className="text-white font-semibold mt-1">"{selectedReel.cta}"</p>
            </div>
          </div>

          <div>
            <span className="text-gray-400 text-sm">Suggested Hashtags</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedReel.hashtags.split(' ').map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded cursor-pointer hover:bg-purple-500/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <a
              href={selectedReel.url}
              download={selectedReel.filename}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
              Download & Post to Instagram
            </a>
          </div>
        </div>
      )}

      {/* No Reels Message */}
      {reels.length === 0 && (
        <div className="bg-dark-card border border-gray-700 rounded-xl p-8 text-center">
          <p className="text-gray-400">No reels created yet.</p>
        </div>
      )}
    </div>
  );
};

export default ReelsGallery;
