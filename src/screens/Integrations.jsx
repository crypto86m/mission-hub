import { useState, useEffect } from 'react';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await fetch('/api/integrations.json');
        if (!response.ok) throw new Error('Failed to fetch integrations');
        const data = await response.json();
        setIntegrations(data.integrations || []);
        setError(null);
      } catch (err) {
        console.error('Error loading integrations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  const statuses = [...new Set(integrations.map(i => i.status || 'unknown'))].sort();
  const categories = [...new Set(integrations.map(i => i.category || 'Other'))].sort();

  const filtered = integrations.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                         (i.category && i.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || i.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || i.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusColors = {
    'active': 'border-green-500/30 bg-green-500/10 text-green-400',
    'configured': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    'degraded': 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    'error': 'border-red-500/30 bg-red-500/10 text-red-400',
    'planned': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    'offline': 'border-gray-500/30 bg-gray-500/10 text-gray-400',
  };

  const getIntegrationIcon = (integration) => {
    const iconMap = {
      'alpaca': '📈',
      'tradingview': '📊',
      'stripe': '💳',
      'discord': '💬',
      'telegram': '📩',
      'bluebubbles': '💬',
      'twilio': '☎️',
      'gmail': '📧',
      'anthropic': '🧠',
      'openai': '🤖',
      'perplexity': '🔍',
      'firecrawl': '🔥',
      'supabase': '⚡',
      'github': '🐙',
      'vercel': '▲',
      'cloudflare': '☁️',
      'elevenlabs': '🎙️',
      'mac-mini': '🖥️',
      'runway': '🎬',
      'twitter': '🐦',
      'instagram': '📸',
      'slack': '💼',
      'notion': '📄',
      'zapier': '⚡',
      'google-drive': '📁',
      'zalo': '💬',
      'whatsapp': '📲',
      'imessage': '💬',
      'substack': '📰',
      'mailchimp': '📬',
      'hermes': '🌐',
    };
    return iconMap[integration.id] || '🔧';
  };

  const getIntegrationColor = (integration) => {
    const colorMap = {
      'alpaca': '#FBBF24',
      'tradingview': '#2962FF',
      'stripe': '#635BFF',
      'discord': '#5865F2',
      'telegram': '#0088CC',
      'bluebubbles': '#007AFF',
      'gmail': '#EA4335',
      'anthropic': '#D97706',
      'openai': '#10B981',
      'perplexity': '#3B82F6',
      'cloudflare': '#F38020',
      'elevenlabs': '#FF6B35',
      'mac-mini': '#A855F7',
      'github': '#F0F0F0',
      'vercel': '#FFFFFF',
      'supabase': '#3ECF8E',
      'twitter': '#1DA1F2',
      'instagram': '#E1306C',
    };
    return colorMap[integration.id] || '#6366F1';
  };

  const testConnection = async (integration) => {
    setTesting(integration.id);
    setTestResult(null);
    try {
      const startTime = performance.now();
      const response = await fetch(integration.configUrl || '#', { method: 'HEAD' });
      const endTime = performance.now();
      setTestResult({ name: integration.id, status: 'success', ms: Math.round(endTime - startTime) });
    } catch (err) {
      setTestResult({ name: integration.id, status: 'error', error: err.message });
    } finally {
      setTesting(null);
    }
  };

  const configureIntegration = (integration) => {
    if (integration.configUrl) {
      window.open(integration.configUrl, '_blank');
    } else {
      alert(`No configuration URL available for ${integration.name}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Loading integrations...</p>
        </div>
      </div>
    );
  }

  const activeCount = integrations.filter(i => i.status === 'active').length;
  const totalCount = integrations.length;

  return (
    <div className="w-full h-full bg-black text-white p-4 md:p-6 overflow-y-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400">
          ⚠️ Error loading integrations: {error}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-sm text-gray-400">{activeCount}/{totalCount} ACTIVE • FULL SYSTEM AUDIT</p>
      </div>

      <input
        type="text"
        placeholder="Search integrations..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-3 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
      />

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        <button 
          onClick={() => setFilterStatus('All')} 
          className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap transition-all ${filterStatus === 'All' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
        >
          All
        </button>
        {statuses.map(s => (
          <button 
            key={s} 
            onClick={() => setFilterStatus(s)} 
            className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap transition-all capitalize ${filterStatus === s ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button 
          onClick={() => setFilterCategory('All')} 
          className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap transition-all ${filterCategory === 'All' ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button 
            key={c} 
            onClick={() => setFilterCategory(c)} 
            className={`px-3 py-1 text-[10px] rounded-full border whitespace-nowrap transition-all ${filterCategory === c ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No integrations found matching your search.</p>
        </div>
      ) : (
        (filterCategory === 'All' ? categories : [filterCategory]).map(cat => {
          const catItems = filtered.filter(i => i.category === cat);
          if (catItems.length === 0) return null;
          
          return (
            <div key={cat} className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</h2>
              <div className="space-y-2">
                {catItems.map(i => (
                  <button
                    key={i.id}
                    onClick={() => setExpanded(expanded === i.id ? null : i.id)}
                    className="w-full text-left bg-gray-900/60 border border-gray-800 rounded-xl p-3 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center text-lg flex-shrink-0" style={{ borderColor: getIntegrationColor(i) + '40', backgroundColor: getIntegrationColor(i) + '10' }}>
                        {getIntegrationIcon(i)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium text-white truncate">{i.name}</h3>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-mono capitalize ${statusColors[i.status] || statusColors['offline']}`}>
                            {i.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">{i.type || 'Integration'} • Last: {i.lastHealthCheck ? new Date(i.lastHealthCheck).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>

                    {expanded === i.id && (
                      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2 text-[10px]">
                        {i.purpose && <div><span className="text-gray-500">Purpose:</span> <span className="text-white">{i.purpose}</span></div>}
                        <div><span className="text-gray-500">Auth Method:</span> <span className="text-cyan-400">{i.authMethod}</span></div>
                        {i.envFile && <div><span className="text-gray-500">Env File:</span> <span className="text-cyan-400 font-mono">{i.envFile}</span></div>}
                        {i.docs && (
                          <div>
                            <a href={i.docs} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                              📖 View Documentation
                            </a>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <div
                            onClick={e => { e.stopPropagation(); testConnection(i); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer select-none transition-all ${
                              testing === i.id
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse'
                                : testResult?.name === i.id && testResult.status === 'success'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 active:bg-cyan-400/30'
                            }`}
                          >
                            {testing === i.id ? '⏳ Testing...' : testResult?.name === i.id && testResult.status === 'success' ? `✅ ${testResult.ms}ms` : '🔌 Test Connection'}
                          </div>
                          {i.configUrl && (
                            <div
                              onClick={e => { e.stopPropagation(); configureIntegration(i); }}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700 cursor-pointer select-none active:bg-gray-700 transition-all"
                            >
                              ⚙️ Configure
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Integrations;
// Vercel rebuild trigger - 1777648608
