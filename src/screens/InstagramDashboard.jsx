import React, { useState, useEffect } from 'react';
import { Film, Users, TrendingUp, Calendar, Settings, Zap, RefreshCw, Upload } from 'lucide-react';
import OverviewCard from '../components/instagram/OverviewCard';
import PhaseStatus from '../components/instagram/PhaseStatus';
import Phase2ContentMap from '../components/instagram/Phase2ContentMap';
import PostingSchedule from '../components/instagram/PostingSchedule';
import EngagementProjections from '../components/instagram/EngagementProjections';
import AnalyticsHub from '../components/instagram/AnalyticsHub';
import QuickActions from '../components/instagram/QuickActions';
import { loadInstagramData, loadPhase1Videos, loadPhase2Posts } from '../utils/instagram-data-loader';
import ReadyToPost from '../components/instagram/ReadyToPost';

export default function InstagramDashboard() {
  const [data, setData] = useState(null);
  const [phase1, setPhase1] = useState(null);
  const [phase2, setPhase2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const instagramData = await loadInstagramData();
        const phase1Data = await loadPhase1Videos();
        const phase2Data = await loadPhase2Posts();

        setData(instagramData);
        setPhase1(phase1Data);
        setPhase2(phase2Data);
      } catch (err) {
        console.error('Failed to load Instagram data:', err);
      }
      setLoading(false);
      setLastRefresh(new Date());
    };

    loadData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data || !phase1 || !phase2) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-cyan" size={32} />
          <p className="text-gray-400">Loading Instagram Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Film className="text-cyan" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-white">Instagram Dashboard</h1>
              <p className="text-gray-400">Content Management & Performance Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCw size={16} />
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>

        {/* Ready to Post — Curated Content Plan */}
        <div className="mb-8">
          <ReadyToPost />
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <OverviewCard data={data} phase1Count={phase1.total} phase2Count={phase2.total} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions phase1={phase1} phase2={phase2} />
        </div>

        {/* Phase 1 Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Film size={24} className="text-cyan" />
            Phase 1: Core Videos (10 Posts)
          </h2>
          <PhaseStatus phase={phase1} phaseNumber={1} />
        </div>

        {/* Phase 2 Content Map */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-cyan" />
            Phase 2: Content Map (100 Posts)
          </h2>
          <Phase2ContentMap phase={phase2} />
        </div>

        {/* Posting Schedule */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-cyan" />
            20-Week Posting Schedule
          </h2>
          <PostingSchedule phase2={phase2} />
        </div>

        {/* Engagement Projections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users size={24} className="text-cyan" />
            Growth Projections
          </h2>
          <EngagementProjections data={data} />
        </div>

        {/* Analytics Hub */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-cyan" />
            Analytics & Insights
          </h2>
          <AnalyticsHub data={data} />
        </div>
      </div>
    </div>
  );
}
