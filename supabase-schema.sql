-- MISSION CONTROL — SUPABASE SCHEMA
-- Run this in the Supabase SQL editor

-- 1. Agent Status Table
CREATE TABLE IF NOT EXISTS agent_status (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  task TEXT,
  status TEXT DEFAULT 'idle',
  model TEXT,
  group_name TEXT,
  objective TEXT,
  tasks_completed INTEGER DEFAULT 0,
  success_rate REAL DEFAULT 0,
  efficiency REAL DEFAULT 0,
  reliability REAL DEFAULT 0,
  revenue REAL DEFAULT 0,
  cost_per_day REAL DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  latency REAL DEFAULT 0,
  throughput INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Company Metrics Table
CREATE TABLE IF NOT EXISTS company_metrics (
  id SERIAL PRIMARY KEY,
  company_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  change_text TEXT,
  trend TEXT DEFAULT 'neutral',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
  id SERIAL PRIMARY KEY,
  agent TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  risk TEXT DEFAULT 'MEDIUM',
  value TEXT,
  icon_type TEXT,
  color TEXT,
  status TEXT DEFAULT 'pending',
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activity Feed Table
CREATE TABLE IF NOT EXISTS activity_feed (
  id SERIAL PRIMARY KEY,
  company_id TEXT,
  agent_id TEXT,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  color TEXT DEFAULT '#00D4FF',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Cost Tracking Table
CREATE TABLE IF NOT EXISTS cost_tracking (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_spend REAL DEFAULT 0,
  monthly_spend REAL DEFAULT 0,
  monthly_forecast REAL DEFAULT 0,
  budget_limit REAL DEFAULT 200,
  daily_limit REAL DEFAULT 20,
  provider_breakdown JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trading P&L Table
CREATE TABLE IF NOT EXISTS trading_pnl (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  unrealized_pnl REAL DEFAULT 0,
  realized_pnl REAL DEFAULT 0,
  account_value REAL DEFAULT 500,
  open_positions INTEGER DEFAULT 0,
  daily_limit REAL DEFAULT 80,
  win_rate REAL DEFAULT 0,
  trades_today INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA — Agents
INSERT INTO agent_status (id, name, role, task, status, model, group_name, objective, tasks_completed, success_rate, efficiency, reliability, revenue, cost_per_day, api_calls, latency, throughput) VALUES
  ('charles', 'Charles (CBV2)', 'Primary AI Agent', 'Orchestrate all agents', 'active', 'Opus 4.6', 'Core', 'Maximize revenue, minimize cost', 4521, 94, 92, 97, 2800000, 142, 12847, 1.2, 226),
  ('trading-bot', 'Trading Bot', 'Live Trading', 'Bollinger Squeeze QQQ', 'active', 'GPT-4o', 'Developers', 'Execute 3 live strategies', 892, 52, 78, 88, 500, 18, 3421, 0.8, 45),
  ('email-responder', 'Email Responder', 'Auto-Reply', 'Processing inbox', 'active', 'Haiku', 'Operators', 'Reply non-sensitive, flag urgent', 1247, 91, 97, 99, 80000, 5, 2494, 0.3, 62),
  ('content-agent', 'Content Agent', 'Newsletter', 'Drafting Brief #7', 'active', 'Sonnet', 'Writers', 'Draft Issue #7 — AI Automation Lessons', 287, 96, 88, 98, 3400, 12, 574, 3.2, 14),
  ('social-agent', 'Social Media', 'Distribution', 'Idle — awaiting content', 'idle', 'GPT-4o', 'Writers', 'Queue tweets, LinkedIn, Instagram', 90, 100, 70, 100, 0, 2, 180, 1.0, 5),
  ('market-research', 'Market Research', 'Analysis', 'Pre-market scan', 'active', 'Perplexity', 'Researchers', 'Scan gaps, identify setups', 365, 89, 95, 96, 0, 8, 1820, 2.1, 18),
  ('prospect-research', 'Prospect Research', 'Lead Gen', 'Idle', 'idle', 'Perplexity', 'Researchers', 'Find AI Support customers', 42, 76, 60, 80, 0, 4, 84, 3.8, 2),
  ('cost-monitor', 'Cost Monitor', 'Budget Guardian', 'Tracking API spend', 'active', 'Custom', 'Operators', 'Track spend, alert thresholds', 730, 100, 100, 100, 0, 0, 2190, 0.1, 37),
  ('discord-bot', 'Discord Bot', '14-Channel Monitor', 'Monitoring channels', 'active', 'Haiku', 'Operators', 'Monitor all channels 24/7', 4521, 99, 99, 100, 0, 3, 9042, 0.1, 226),
  ('rlm-estimator', 'RLM Estimator', 'Bid Generator', 'Hotel Oxbow bid', 'processing', 'GPT-4o', 'Developers', 'Generate $410K bid', 354, 87, 82, 90, 410000, 22, 708, 4.5, 18)
ON CONFLICT (id) DO UPDATE SET
  task = EXCLUDED.task,
  status = EXCLUDED.status,
  tasks_completed = EXCLUDED.tasks_completed,
  updated_at = NOW();

-- SEED DATA — Approvals
INSERT INTO approvals (agent, title, description, risk, value, status) VALUES
  ('Trading Bot', 'TSLA Bull Put Spread', 'Sell $245P / Buy $240P — 7 DTE. Max risk $250. 68% probability.', 'HIGH', '$250 risk', 'pending'),
  ('Email Responder', 'Marriott Contract Reply', 'Auto-generated response to Marriott RFP. $80K opportunity.', 'MEDIUM', '$80K opportunity', 'pending'),
  ('Content Writer', 'Bennett''s Brief #7', 'Newsletter draft complete. 1,247 words. Ready to publish.', 'LOW', 'Public visibility', 'pending'),
  ('RLM Estimator', 'Hotel Oxbow Bid', 'Exterior repaint bid. 42,000 sqft. $410K estimate. 28% margin.', 'MEDIUM', '$410K revenue', 'pending')
ON CONFLICT DO NOTHING;

-- SEED DATA — Activity Feed
INSERT INTO activity_feed (agent_id, text, type, color) VALUES
  ('rlm-estimator', 'Hotel Oxbow bid generated — $410K estimate', 'success', '#22C55E'),
  ('trading-bot', 'QQQ Bollinger squeeze signal detected', 'trade', '#A855F7'),
  ('email-responder', 'Auto-replied to vendor inquiry', 'action', '#22C55E'),
  ('content-agent', 'Issue #7 draft at 80% (1,247 words)', 'action', '#F97316'),
  ('discord-bot', '28 messages logged in #general', 'action', '#3B82F6'),
  ('cost-monitor', 'Daily spend $142 / $200 budget', 'alert', '#F59E0B'),
  ('market-research', 'Pre-market scan — 3 setups found', 'action', '#A855F7'),
  ('prospect-research', 'Idle for 24h — review needed', 'warning', '#EF4444')
ON CONFLICT DO NOTHING;

-- SEED DATA — Cost Tracking
INSERT INTO cost_tracking (date, daily_spend, monthly_spend, monthly_forecast, budget_limit, daily_limit, provider_breakdown) VALUES
  (CURRENT_DATE, 142, 187, 187, 200, 20, '{"anthropic": 89, "openai": 52, "perplexity": 18, "other": 28}')
ON CONFLICT DO NOTHING;

-- SEED DATA — Trading P&L
INSERT INTO trading_pnl (date, unrealized_pnl, realized_pnl, account_value, open_positions, daily_limit, win_rate, trades_today) VALUES
  (CURRENT_DATE, 18.50, 0, 518.50, 2, 80, 52, 3)
ON CONFLICT DO NOTHING;

-- SEED DATA — Company Metrics
INSERT INTO company_metrics (company_id, company_name, metric_name, metric_value, change_text, trend) VALUES
  ('rlm', 'RLM Enterprises', 'Active Projects', '354', '+12 this week', 'up'),
  ('rlm', 'RLM Enterprises', 'YTD Revenue', '$2.8M', '+18% vs last year', 'up'),
  ('rlm', 'RLM Enterprises', 'Profit Margin', '34%', '+2% vs Q1', 'up'),
  ('rlm', 'RLM Enterprises', 'Pipeline', '$1.2M', '23 pending bids', 'neutral'),
  ('nvcc', 'Napa Valley Car Club', 'Active Members', '128', '+4 this month', 'up'),
  ('nvcc', 'Napa Valley Car Club', 'YTD Revenue', '$145K', '+22% vs last year', 'up'),
  ('nvcc', 'Napa Valley Car Club', 'Fleet Value', '$4.2M', '12 vehicles', 'neutral'),
  ('nvcc', 'Napa Valley Car Club', 'Rating', '4.8★', 'Top 5%', 'up'),
  ('trading', 'Trading', 'Account Balance', '$500', 'Starting capital', 'neutral'),
  ('trading', 'Trading', 'Win Rate', '52%', 'Target: 55%+', 'up'),
  ('trading', 'Trading', 'Active Strategies', '3', 'Bollinger, ORB, RSI', 'neutral'),
  ('trading', 'Trading', 'Daily Target', '$15-25', '3-5% daily', 'neutral'),
  ('brief', 'Bennett''s Brief', 'Subscribers', '287', '+23 this week', 'up'),
  ('brief', 'Bennett''s Brief', 'Open Rate', '38%', 'Industry avg: 21%', 'up'),
  ('brief', 'Bennett''s Brief', 'Issues Published', '6', 'Weekly cadence', 'neutral'),
  ('brief', 'Bennett''s Brief', 'Reach', '18.7K', 'Cross-platform', 'up'),
  ('ai-support', 'AI Support', 'Status', 'Live', 'All 8 phases complete', 'up'),
  ('ai-support', 'AI Support', 'Pricing Tiers', '3', 'Starter/Pro/Enterprise', 'neutral'),
  ('ai-support', 'AI Support', 'Pages', '12', '33 API endpoints', 'neutral'),
  ('ai-support', 'AI Support', 'MRR Target', '$5K', 'By April 30', 'neutral')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (open for now)
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_pnl ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (tighten later)
CREATE POLICY "Allow all" ON agent_status FOR ALL USING (true);
CREATE POLICY "Allow all" ON company_metrics FOR ALL USING (true);
CREATE POLICY "Allow all" ON approvals FOR ALL USING (true);
CREATE POLICY "Allow all" ON activity_feed FOR ALL USING (true);
CREATE POLICY "Allow all" ON cost_tracking FOR ALL USING (true);
CREATE POLICY "Allow all" ON trading_pnl FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_status;
ALTER PUBLICATION supabase_realtime ADD TABLE approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE cost_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE trading_pnl;
