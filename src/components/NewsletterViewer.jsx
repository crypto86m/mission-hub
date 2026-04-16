import React, { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

export default function NewsletterViewer() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch latest articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newsletter/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data.articles || []);
      if (data.articles && data.articles.length > 0) {
        selectArticle(data.articles[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectArticle = async (article) => {
    try {
      setSelectedArticle(article);
      const response = await fetch(`/api/newsletter/articles/${article.id}`);
      if (!response.ok) throw new Error('Failed to fetch article content');
      const data = await response.json();
      setContent(data.content || '');
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">📬 Bennett's Brief</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Article List */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-3">Issues</h3>
          <div className="space-y-2">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => selectArticle(article)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedArticle?.id === article.id
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="font-medium text-sm">{article.title}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(article.date).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="lg:col-span-3">
          {selectedArticle ? (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedArticle.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Published {new Date(selectedArticle.date).toLocaleDateString()}
                </p>
              </div>

              {/* Copy Button */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>

              {/* Article Content */}
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                <div
                  className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
                />
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Word Count</p>
                  <p className="text-lg font-bold text-blue-900">
                    {content.split(' ').length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Reading Time</p>
                  <p className="text-lg font-bold text-green-900">
                    {Math.ceil(content.split(' ').length / 200)} min
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-lg font-bold text-purple-900">Ready</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Select an article to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
