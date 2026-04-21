import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Phase2ContentMap({ phase }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    { name: 'Authority/Leadership', count: phase.categories.authority, color: 'from-purple-600 to-purple-400', icon: '👑' },
    { name: 'Lifestyle/Luxury', count: phase.categories.lifestyle, color: 'from-pink-600 to-pink-400', icon: '✨' },
    { name: 'Business/Operations', count: phase.categories.business, color: 'from-blue-600 to-blue-400', icon: '📊' },
    { name: 'Personal/Vulnerability', count: phase.categories.personal, color: 'from-red-600 to-red-400', icon: '❤️' },
    { name: 'Events/Community', count: phase.categories.events, color: 'from-green-600 to-green-400', icon: '🎉' },
  ];

  const formats = [
    { name: 'Reels', count: phase.formats.reels, percentage: Math.round((phase.formats.reels / phase.total) * 100), color: 'bg-cyan' },
    { name: 'Carousels', count: phase.formats.carousels, percentage: Math.round((phase.formats.carousels / phase.total) * 100), color: 'bg-purple-500' },
    { name: 'Static', count: phase.formats.static, percentage: Math.round((phase.formats.static / phase.total) * 100), color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Category Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Content by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
              className={`bg-gradient-to-br ${cat.color} p-6 rounded-lg cursor-pointer hover:shadow-lg transition-all transform hover:scale-105`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <p className="text-white font-bold text-2xl">{cat.count}</p>
              <p className="text-white/90 text-sm font-semibold">{cat.name}</p>
              <p className="text-white/70 text-xs mt-2">{Math.round((cat.count / phase.total) * 100)}% of content</p>
            </div>
          ))}
        </div>

        {/* Expanded Category Preview */}
        {expandedCategory !== null && (
          <div className="bg-dark-card border border-cyan/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>{categories[expandedCategory].icon}</span>
              {categories[expandedCategory].name} Sample Posts
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Total: {categories[expandedCategory].count} posts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample posts (placeholder) */}
              {[...Array(Math.min(4, categories[expandedCategory].count))].map((_, i) => (
                <div key={i} className="bg-dark-bg/50 border border-cyan/20 rounded p-4">
                  <p className="text-cyan font-semibold text-sm mb-2">Post {i + 1}</p>
                  <p className="text-gray-400 text-xs">Content preview would load here</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Format Distribution */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Content Format Mix</h3>
        <div className="space-y-4">
          {formats.map((fmt, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold">{fmt.name}</p>
                <div className="flex items-center gap-4">
                  <p className="text-cyan font-bold">{fmt.count} posts</p>
                  <p className="text-gray-400 text-sm w-8">{fmt.percentage}%</p>
                </div>
              </div>
              <div className="w-full bg-dark-card rounded-full h-3 overflow-hidden">
                <div
                  className={`${fmt.color} h-full transition-all duration-500`}
                  style={{ width: `${fmt.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Format Insights */}
        <div className="mt-6 bg-dark-card border border-cyan/20 rounded-lg p-4">
          <p className="text-white font-semibold mb-2">Format Recommendations</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ <span className="text-cyan">Reels (70%)</span> - Maximum reach & engagement (algorithm favors video)</li>
            <li>✓ <span className="text-purple-400">Carousels (20%)</span> - Deep storytelling, product showcases</li>
            <li>✓ <span className="text-pink-400">Static (10%)</span> - Key quotes, authority statements, graphics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
