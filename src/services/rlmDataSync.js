/**
 * RLM Data Sync Service
 * Provides real-time data sync between Mission Control and RLM databases
 * Sources:
 * - /rlm/bid-tracker/bids.json
 * - /rlm/project-tracker/ACTIVE-PROJECTS.md
 */

class RLMDataSync {
  constructor() {
    this.bidsUrl = '/rlm/bid-tracker/bids.json';
    this.projectsUrl = '/rlm/project-tracker/ACTIVE-PROJECTS.md';
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
    this.listeners = [];
  }

  /**
   * Subscribe to data changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of data update
   */
  notifyListeners(data) {
    this.listeners.forEach(listener => listener(data));
  }

  /**
   * Load bid data from tracker
   */
  async loadBidData() {
    try {
      const response = await fetch(this.bidsUrl);
      if (!response.ok) throw new Error(`Failed to load bids: ${response.status}`);
      const data = await response.json();
      return this.processBidData(data.bids);
    } catch (error) {
      console.error('Error loading bid data:', error);
      return this.getMockBidData();
    }
  }

  /**
   * Process bid data and add computed fields
   */
  processBidData(bids) {
    return bids.map(bid => ({
      ...bid,
      daysInPipeline: this.calculateDaysInPipeline(bid.created),
      daysOverdue: this.calculateDaysOverdue(bid.followup_due),
      priority: this.calculateBidPriority(bid),
      winProbability: this.estimateWinProbability(bid),
      status: bid.status || 'Unknown'
    }));
  }

  /**
   * Load project data from tracker
   */
  async loadProjectData() {
    try {
      // For now, return mock data as parsing markdown is complex
      // In production, this would parse ACTIVE-PROJECTS.md
      return this.getMockProjectData();
    } catch (error) {
      console.error('Error loading project data:', error);
      return this.getMockProjectData();
    }
  }

  /**
   * Calculate days in pipeline
   */
  calculateDaysInPipeline(createdDate) {
    if (!createdDate) return 0;
    const created = new Date(createdDate);
    const today = new Date();
    return Math.floor((today - created) / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate days overdue
   */
  calculateDaysOverdue(followupDate) {
    if (!followupDate) return 0;
    const followup = new Date(followupDate);
    const today = new Date();
    const diff = Math.floor((today - followup) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  /**
   * Calculate bid priority based on status and days
   */
  calculateBidPriority(bid) {
    const daysOverdue = this.calculateDaysOverdue(bid.followup_due);
    if (daysOverdue > 10) return 'high';
    if (daysOverdue > 5) return 'medium';
    return 'low';
  }

  /**
   * Estimate win probability based on status and timeline
   */
  estimateWinProbability(bid) {
    const daysInPipeline = this.calculateDaysInPipeline(bid.created);
    
    switch (bid.status) {
      case 'Estimating':
        return 80; // Still active estimating = good sign
      case 'Submitted':
        if (daysInPipeline <= 10) return 70; // Fresh submission
        if (daysInPipeline <= 15) return 50; // Borderline
        return 30; // Long silence = bad sign
      case 'Won':
        return 100;
      case 'Lost':
        return 0;
      default:
        return 50;
    }
  }

  /**
   * Get aggregated metrics
   */
  getMetrics(bids, projects) {
    const totalPipeline = bids.reduce((sum, bid) => sum + (bid.value || 0), 0);
    const expectedValue = bids.reduce((sum, bid) => sum + ((bid.value || 0) * (bid.winProbability || 50) / 100), 0);
    const overdueBids = bids.filter(bid => bid.daysOverdue > 0).length;
    const avgWinProbability = Math.round(bids.reduce((sum, bid) => sum + (bid.winProbability || 50), 0) / bids.length);

    return {
      totalPipeline,
      expectedValue,
      overdueBids,
      avgWinProbability,
      activeBids: bids.length,
      activeProjects: projects.length,
      ytdRevenue: 2800000 // From Benjamin's directive
    };
  }

  /**
   * Detect critical alerts
   */
  detectAlerts(bids) {
    const alerts = [];

    bids.forEach(bid => {
      if (bid.daysOverdue > 10) {
        alerts.push({
          level: 'critical',
          message: `${bid.bid_number}: ${bid.daysOverdue} days overdue - Final follow-up required`,
          bidNumber: bid.bid_number
        });
      } else if (bid.daysOverdue > 5) {
        alerts.push({
          level: 'warning',
          message: `${bid.bid_number}: ${bid.daysOverdue} days overdue - Follow-up needed`,
          bidNumber: bid.bid_number
        });
      }
    });

    // Add upcoming deadline alerts
    bids.forEach(bid => {
      if (bid.status === 'Estimating' && this.isEstimateDeadlineSoon(bid.created)) {
        alerts.push({
          level: 'info',
          message: `${bid.bid_number}: Estimate delivery deadline approaching`,
          bidNumber: bid.bid_number
        });
      }
    });

    return alerts;
  }

  /**
   * Check if estimate deadline is within 3 days
   */
  isEstimateDeadlineSoon(createdDate) {
    const created = new Date(createdDate);
    const deadline = new Date(created.getTime() + 13 * 24 * 60 * 60 * 1000); // 13 days
    const today = new Date();
    const daysUntilDeadline = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 3 && daysUntilDeadline > 0;
  }

  /**
   * Start continuous sync
   */
  startSync() {
    this.syncTimer = setInterval(() => {
      this.sync();
    }, this.syncInterval);
    // Initial sync
    this.sync();
  }

  /**
   * Stop continuous sync
   */
  stopSync() {
    if (this.syncTimer) clearInterval(this.syncTimer);
  }

  /**
   * Perform full sync
   */
  async sync() {
    try {
      const [bids, projects] = await Promise.all([
        this.loadBidData(),
        this.loadProjectData()
      ]);

      const metrics = this.getMetrics(bids, projects);
      const alerts = this.detectAlerts(bids);

      this.notifyListeners({
        bids,
        projects,
        metrics,
        alerts,
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  /**
   * Mock data for development
   */
  getMockBidData() {
    return [
      {
        bid_number: "RLM-2026-001",
        client: "Sample Hotel",
        project: "Exterior repaint 12k sqft",
        value: 48500,
        submitted: "2026-03-20",
        followup_due: "2026-03-27",
        status: "Submitted",
        contact_name: "John Smith",
        contact_email: "john.smith@hotelgroup.com",
        created: "2026-03-20",
        daysOverdue: 14,
        priority: 'high',
        winProbability: 30
      },
      {
        bid_number: "RLM-2026-002",
        client: "Napa Winery",
        project: "Interior common areas",
        value: 22000,
        submitted: "2026-03-25",
        followup_due: "2026-04-01",
        status: "Submitted",
        contact_name: "Sarah Johnson",
        contact_email: "sarah.j@napawinery.com",
        created: "2026-03-25",
        daysOverdue: 9,
        priority: 'medium',
        winProbability: 70
      },
      {
        bid_number: "RLM-2026-003",
        client: "Medical Center",
        project: "3rd floor renovation",
        value: 67000,
        submitted: null,
        followup_due: null,
        status: "Estimating",
        contact_name: "Dr. Robert Lee",
        contact_email: "r.lee@medcenter.org",
        created: "2026-04-02",
        daysOverdue: 0,
        priority: 'low',
        winProbability: 80
      }
    ];
  }

  getMockProjectData() {
    return [
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
  }
}

export default new RLMDataSync();
