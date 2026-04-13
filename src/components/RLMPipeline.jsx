import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp, DollarSign, Target } from 'lucide-react';

export default function RLMPipeline() {
  const [bidData, setBidData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);

  useEffect(() => {
    loadRLMData();
  }, []);

  const loadRLMData = async () => {
    try {
      // Mock data loading from JSON files
      const bids = [
        {
          bid_number: "RLM-2026-001",
          client: "Sample Hotel",
          project: "Exterior repaint 12k sqft",
          value: 48500,
          submitted: "2026-03-20",
          status: "Submitted",
          daysOverdue: 14,
          priority: "high",
          contact: "John Smith",
          winProbability: 30
        },
        {
          bid_number: "RLM-2026-002",
          client: "Napa Winery",
          project: "Interior common areas",
          value: 22000,
          submitted: "2026-03-25",
          status: "Submitted",
          daysOverdue: 9,
          priority: "medium",
          contact: "Sarah Johnson",
          winProbability: 70
        },
        {
          bid_number: "RLM-2026-003",
          client: "Medical Center",
          project: "3rd floor renovation",
          value: 67000,
          submitted: "2026-04-02",
          status: "Estimating",
          daysOverdue: 0,
          priority: "low",
          contact: "Dr. Robert Lee",
          winProbability: 80
        }
      ];

      const projects = [
        {
          name: "Marriott Renovation",
          client: "Marriott Hotels",
          location: "San Francisco",
          status: "In Progress",
          completion: "2026-04-30",
          progress: 65,
          revenue: 185000
        },
        {
          name: "Winery Repaint",
          client: "Stag's Leap",
          location: "Napa Valley",
          status: "Scheduled",
          completion: "2026-05-15",
          progress: 10,
          revenue: 92000
        },
        {
          name: "Hospital Wing",
          client: "Kaiser Permanente",
          location: "Sacramento",
          status: "Scheduled",
          completion: "2026-05-20",
          progress: 0,
          revenue: 156000
        }
      ];

      setBidData(bids);
      setProjectData(projects);
      setLoading(false);
    } catch (error) {
      console.error('Error loading RLM data:', error);
      setLoading(false);
    }
  };

  const totalPipeline = bidData.reduce((sum, bid) => sum + bid.value, 0);
  const expectedValue = bidData.reduce((sum, bid) => sum + (bid.value * (bid.winProbability / 100)), 0);
  const activeProjects = projectData.length;
  const ytdRevenue = 2800000;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'low':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return <Clock size={16} className="text-blue-400" />;
      case 'Estimating':
        return <Target size={16} className="text-cyan-400" />;
      case 'In Progress':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'Closed':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-card animate-pulse">
        <p className="text-gray-400">Loading RLM pipeline data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">YTD Revenue</p>
          <p className="text-2xl font-bold text-green-400">${(ytdRevenue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">Active Bids</p>
          <p className="text-2xl font-bold text-cyan">{bidData.length}</p>
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">Pipeline Value</p>
          <p className="text-2xl font-bold text-blue-400">${(totalPipeline / 1000).toFixed(0)}K</p>
        </div>
        <div className="glass-card">
          <p className="text-xs text-gray-400 mb-1">Expected Value</p>
          <p className="text-2xl font-bold text-purple-400">${(expectedValue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-cyan flex items-center gap-2">
          <TrendingUp size={20} />
          Active Projects ({activeProjects})
        </h3>
        <div className="space-y-2">
          {projectData.map((project, idx) => (
            <div key={idx} className="glass-card border-l-4 border-cyan/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-xs text-gray-400">{project.location} • {project.client}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'In Progress' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan to-blue-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bid Status */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-cyan flex items-center gap-2">
          <DollarSign size={20} />
          Bid Pipeline
        </h3>
        <div className="space-y-2">
          {bidData.map((bid) => (
            <div
              key={bid.bid_number}
              onClick={() => setSelectedBid(selectedBid?.bid_number === bid.bid_number ? null : bid)}
              className={`glass-card cursor-pointer transition-all border-l-4 ${
                bid.priority === 'high'
                  ? 'border-red-500/50 hover:bg-red-500/5'
                  : bid.priority === 'medium'
                  ? 'border-yellow-500/50 hover:bg-yellow-500/5'
                  : 'border-green-500/50 hover:bg-green-500/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(bid.status)}
                    <p className="font-semibold">{bid.bid_number}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{bid.client} • {bid.project}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${(bid.value / 1000).toFixed(0)}K</p>
                  <p className={`text-xs font-medium ${
                    bid.winProbability >= 70 ? 'text-green-400' : bid.winProbability >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {bid.winProbability}% win
                  </p>
                </div>
              </div>

              {bid.daysOverdue > 0 && (
                <div className="mb-2 p-1.5 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {bid.daysOverdue} DAYS OVERDUE - Follow-up required
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{bid.status}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(bid.priority)}`}>
                  {bid.priority.toUpperCase()}
                </span>
              </div>

              {selectedBid?.bid_number === bid.bid_number && (
                <div className="mt-3 pt-3 border-t border-gray-700 text-xs space-y-1">
                  <p><span className="text-gray-400">Contact:</span> {bid.contact}</p>
                  <p><span className="text-gray-400">Submitted:</span> {bid.submitted}</p>
                  <p className="text-gray-300 mt-2">
                    <span className="text-cyan font-semibold">Action Required:</span> {
                      bid.daysOverdue > 0 ? `Final follow-up - ${bid.daysOverdue} days overdue` : 'Track progress'
                    }
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Health Summary */}
      <div className="glass-card border-l-4 border-cyan/50">
        <h4 className="font-semibold mb-2 text-cyan">Pipeline Health</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-400">Overdue Bids</p>
            <p className="text-lg font-bold text-red-400">{bidData.filter(b => b.daysOverude > 0).length}</p>
          </div>
          <div>
            <p className="text-gray-400">Win Probability</p>
            <p className="text-lg font-bold text-green-400">
              {Math.round(bidData.reduce((sum, b) => sum + b.winProbability, 0) / bidData.length)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
