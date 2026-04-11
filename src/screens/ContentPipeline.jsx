import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, ChevronDown, ChevronRight, Instagram, Twitter, BookOpen } from 'lucide-react';

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
        copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20'
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : (label || 'Copy')}
    </button>
  );
}

export default function ContentPipeline() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('newsletters');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch('/api/content.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-5xl animate-pulse-soft">⚡</span>
    </div>
  );

  if (!data) return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-gray-400">Failed to load content</p>
    </div>
  );

  const tabs = [
    { key: 'newsletters', label: "Bennett's Brief", icon: <BookOpen size={14} />, count: data.newsletters?.length || 0 },
    { key: 'instagram', label: 'Instagram', icon: <Instagram size={14} />, count: data.instagram?.length || 0 },
    { key: 'tweets', label: 'Tweets', icon: <Twitter size={14} />, count: data.tweets?.length || 0 },
  ];

  return (
    <div className="w-full h-full overflow-y-auto pb-24 pt-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold glow-text mb-2">Content Hub</h1>
        <p className="text-gray-400 text-sm">
          {data.newsletters?.length || 0} articles • {data.instagram?.length || 0} IG posts • {data.tweets?.length || 0} tweets
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-cyan/15 text-cyan border border-cyan/40'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Newsletter Content */}
      {activeTab === 'newsletters' && (
        <div className="space-y-3">
          {(data.newsletters || []).map(article => {
            const isExpanded = expanded === article.id;
            return (
              <div key={article.id} className="glass-card">
                <button
                  onClick={() => setExpanded(isExpanded ? null : article.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  {isExpanded ? <ChevronDown size={16} className="text-cyan shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{article.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono border ${
                        article.status === 'published' ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                      }`}>{article.status?.toUpperCase()}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{article.date} • {article.wordCount} words • {article.platform}</p>
                  </div>
                  <CopyButton text={article.body} label="Copy Full Article" />
                </button>

                {isExpanded && (
                  <div className="mt-4 border-t border-cyan/10 pt-3">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto bg-black/20 rounded-lg p-4">{article.body}</pre>
                    <div className="flex gap-2 mt-3">
                      <CopyButton text={article.title} label="Copy Title" />
                      <CopyButton text={article.body} label="Copy Body" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Instagram Content */}
      {activeTab === 'instagram' && (
        <div className="space-y-3">
          {(data.instagram || []).map(post => {
            const isExpanded = expanded === post.id;
            return (
              <div key={post.id} className="glass-card">
                <button
                  onClick={() => setExpanded(isExpanded ? null : post.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  {isExpanded ? <ChevronDown size={16} className="text-pink-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-white">{post.title}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      <span className="text-pink-400 border border-pink-400/30 bg-pink-400/10 px-1 py-0.5 rounded text-[9px] font-mono mr-1">{post.status?.toUpperCase()}</span>
                      Reel • @benjamin86m
                    </p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 border-t border-pink-400/10 pt-3 space-y-3">
                    {/* Script */}
                    {post.script && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-pink-400">📹 Script</h4>
                          <CopyButton text={post.script.replace(/^### Script.*\n/, '').replace(/```/g, '').trim()} label="Copy Script" />
                        </div>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans bg-black/20 rounded-lg p-3 max-h-48 overflow-y-auto">{post.script.replace(/^### Script.*\n/, '').replace(/```/g, '').trim()}</pre>
                      </div>
                    )}

                    {/* Caption */}
                    {post.caption && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-pink-400">📝 Caption + Hashtags</h4>
                          <CopyButton text={post.caption.replace(/^### Caption.*\n/, '').replace(/```/g, '').trim()} label="Copy Caption" />
                        </div>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans bg-black/20 rounded-lg p-3 max-h-48 overflow-y-auto">{post.caption.replace(/^### Caption.*\n/, '').replace(/```/g, '').trim()}</pre>
                      </div>
                    )}

                    {/* Full post details */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-gray-400">📋 Full Details</h4>
                        <CopyButton text={post.body} label="Copy Everything" />
                      </div>
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans bg-black/20 rounded-lg p-3 max-h-64 overflow-y-auto">{post.body}</pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tweets */}
      {activeTab === 'tweets' && (
        <div className="space-y-2">
          <div className="glass-card mb-4 border-yellow-500/20 bg-yellow-500/5">
            <p className="text-xs text-yellow-300">⚠️ Twitter API blocked — 89 tweets queued but can't post. Waiting on API key regeneration.</p>
          </div>
          {(data.tweets || []).map((tweet, i) => (
            <div key={tweet.id} className="glass-card flex items-start gap-3">
              <span className="text-[10px] text-gray-500 font-mono mt-0.5 shrink-0">#{i + 1}</span>
              <p className="text-xs text-gray-300 flex-1">{tweet.text}</p>
              <CopyButton text={tweet.text} label="Copy" />
            </div>
          ))}
          {(data.tweets?.length || 0) > 0 && (
            <p className="text-[10px] text-gray-500 text-center mt-2">Showing first {data.tweets.length} of 90 queued tweets</p>
          )}
        </div>
      )}
    </div>
  );
}
