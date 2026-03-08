-- ============================================================================
-- 🧠 VANTIX BRAIN V3 — $100M System Upgrade
-- Complete SQL for 10 new tables + indexes + triggers + RPC functions
-- 
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- All tables use the brain_ prefix for consistency
-- 
-- Created: March 7, 2026 by Vix (@VantixHQBot)
-- ============================================================================

-- ============================================================================
-- TABLE 1: brain_learnings — Bot Learning System (CRITICAL)
-- 
-- The #1 missing piece. Every mistake, fix, and pattern gets logged here.
-- Before starting any task, bots query this table for relevant lessons.
-- Includes confidence scoring and automatic relevance decay.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_learnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id TEXT NOT NULL,                          -- which bot learned this
  project_id TEXT REFERENCES brain_projects(id), -- project context (nullable for global lessons)
  
  -- What happened
  trigger_event TEXT NOT NULL,                   -- what went wrong or what was discovered
  trigger_category TEXT NOT NULL DEFAULT 'code', -- code | design | process | data | security | deploy | api
  trigger_file TEXT,                             -- file path that was involved (if applicable)
  trigger_commit TEXT,                           -- commit SHA where the issue occurred
  
  -- What was learned
  lesson TEXT NOT NULL,                          -- the actual learning / takeaway
  fix_applied TEXT,                              -- what was done to fix it
  prevention TEXT,                               -- how to prevent it in the future
  
  -- Scoring & relevance
  severity TEXT NOT NULL DEFAULT 'medium',       -- critical | high | medium | low
  confidence REAL NOT NULL DEFAULT 0.8,          -- 0.0-1.0 how confident we are this lesson is correct
  times_applied INTEGER NOT NULL DEFAULT 0,      -- how many times this lesson has been used
  times_helped INTEGER NOT NULL DEFAULT 0,       -- times it actually prevented a repeat mistake
  last_applied_at TIMESTAMPTZ,                   -- when it was last relevant
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',                      -- searchable tags like ['react', 'typescript', 'import']
  related_learning_ids UUID[] DEFAULT '{}',      -- links to related lessons
  superseded_by UUID REFERENCES brain_learnings(id), -- if this lesson was replaced by a better one
  is_active BOOLEAN NOT NULL DEFAULT true,       -- soft delete / archive
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast learning lookups
CREATE INDEX IF NOT EXISTS idx_learnings_bot ON brain_learnings(bot_id);
CREATE INDEX IF NOT EXISTS idx_learnings_project ON brain_learnings(project_id);
CREATE INDEX IF NOT EXISTS idx_learnings_category ON brain_learnings(trigger_category);
CREATE INDEX IF NOT EXISTS idx_learnings_severity ON brain_learnings(severity);
CREATE INDEX IF NOT EXISTS idx_learnings_active ON brain_learnings(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_learnings_tags ON brain_learnings USING GIN(tags);

-- Full-text search on lessons
CREATE INDEX IF NOT EXISTS idx_learnings_fts ON brain_learnings 
  USING GIN(to_tsvector('english', trigger_event || ' ' || lesson || ' ' || COALESCE(fix_applied, '')));

COMMENT ON TABLE brain_learnings IS 'Bot learning system. Every mistake and fix logged here. Bots check before working to avoid repeating errors.';


-- ============================================================================
-- TABLE 2: brain_metrics — Bot Performance Tracking (CRITICAL)
-- 
-- Daily/weekly performance stats per bot. Drives smart task routing —
-- assign tasks to the bot with the best track record for that type of work.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id TEXT NOT NULL,
  project_id TEXT REFERENCES brain_projects(id),
  
  -- Time period
  period TEXT NOT NULL DEFAULT 'daily',          -- daily | weekly | monthly | sprint
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Task metrics
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_failed INTEGER NOT NULL DEFAULT 0,
  tasks_reassigned INTEGER NOT NULL DEFAULT 0,   -- tasks that had to be given to another bot
  avg_completion_hours REAL,                     -- average time to complete a task
  fastest_task_hours REAL,
  slowest_task_hours REAL,
  
  -- Code metrics
  commits_pushed INTEGER NOT NULL DEFAULT 0,
  lines_added INTEGER NOT NULL DEFAULT 0,
  lines_deleted INTEGER NOT NULL DEFAULT 0,
  files_changed INTEGER NOT NULL DEFAULT 0,
  
  -- Quality metrics
  builds_broken INTEGER NOT NULL DEFAULT 0,      -- times a push broke the build
  bugs_introduced INTEGER NOT NULL DEFAULT 0,    -- bugs traced back to this bot
  bugs_fixed INTEGER NOT NULL DEFAULT 0,
  merge_conflicts INTEGER NOT NULL DEFAULT 0,
  rollbacks INTEGER NOT NULL DEFAULT 0,          -- commits that had to be reverted
  
  -- Collaboration metrics
  handoffs_sent INTEGER NOT NULL DEFAULT 0,
  handoffs_received INTEGER NOT NULL DEFAULT 0,
  alerts_raised INTEGER NOT NULL DEFAULT 0,
  learnings_logged INTEGER NOT NULL DEFAULT 0,
  
  -- Composite scores (0-100)
  speed_score REAL,                              -- based on avg completion time vs estimate
  quality_score REAL,                            -- based on bugs/builds broken/rollbacks
  reliability_score REAL,                        -- based on task success rate
  collaboration_score REAL,                      -- based on handoffs/learnings/alerts
  overall_score REAL,                            -- weighted composite
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate entries
  UNIQUE(bot_id, project_id, period, period_start)
);

CREATE INDEX IF NOT EXISTS idx_metrics_bot ON brain_metrics(bot_id);
CREATE INDEX IF NOT EXISTS idx_metrics_period ON brain_metrics(period_start DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_overall ON brain_metrics(overall_score DESC NULLS LAST);

COMMENT ON TABLE brain_metrics IS 'Bot performance tracking. Daily/weekly stats drive smart task routing and identify improvement areas.';


-- ============================================================================
-- TABLE 3: brain_clients — CRM (CRITICAL)
-- 
-- Every client, prospect, and lead. Deal sizes, contacts, renewal dates.
-- The business side of Vantix.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identity
  name TEXT NOT NULL,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'prospect',       -- prospect | active | paused | churned | closed
  type TEXT NOT NULL DEFAULT 'client',           -- client | partner | internal | lead
  
  -- Contacts
  primary_contact TEXT,
  primary_email TEXT,
  primary_phone TEXT,
  secondary_contact TEXT,
  secondary_email TEXT,
  
  -- Deal info
  deal_size NUMERIC(12,2),                       -- total contract value
  mrr NUMERIC(10,2),                             -- monthly recurring revenue
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,                           -- stripe | invoice | crypto | other
  billing_cycle TEXT DEFAULT 'monthly',          -- monthly | quarterly | annual | one-time
  
  -- Timeline
  first_contact DATE,
  contract_start DATE,
  contract_end DATE,
  last_contact DATE,
  next_followup DATE,
  
  -- Relationship
  satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 10),
  health_status TEXT DEFAULT 'healthy',          -- healthy | at-risk | churning
  referral_source TEXT,                          -- how they found us
  
  -- Projects
  project_ids TEXT[] DEFAULT '{}',               -- linked brain_projects ids
  
  -- Notes
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_status ON brain_clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_health ON brain_clients(health_status);
CREATE INDEX IF NOT EXISTS idx_clients_followup ON brain_clients(next_followup) WHERE next_followup IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_tags ON brain_clients USING GIN(tags);

COMMENT ON TABLE brain_clients IS 'CRM. Every client, prospect, and lead with contacts, deal sizes, and renewal tracking.';


-- ============================================================================
-- TABLE 4: brain_revenue — Financial Tracking (CRITICAL)
-- 
-- MRR, ARR, expenses, profit per project per month.
-- Answer "are we making money?" at any time.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id),
  client_id UUID REFERENCES brain_clients(id),
  
  -- Period
  period_month DATE NOT NULL,                    -- first day of the month (2026-03-01)
  
  -- Revenue
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  revenue_type TEXT NOT NULL DEFAULT 'recurring', -- recurring | one-time | retainer | commission
  mrr NUMERIC(10,2) DEFAULT 0,                   -- monthly recurring portion
  
  -- Costs
  hosting_cost NUMERIC(10,2) DEFAULT 0,          -- Vercel, Supabase, etc.
  api_cost NUMERIC(10,2) DEFAULT 0,              -- external API costs
  tool_cost NUMERIC(10,2) DEFAULT 0,             -- AI tokens, services
  other_cost NUMERIC(10,2) DEFAULT 0,
  total_cost NUMERIC(10,2) GENERATED ALWAYS AS (hosting_cost + api_cost + tool_cost + other_cost) STORED,
  
  -- Profit
  gross_profit NUMERIC(12,2) GENERATED ALWAYS AS (revenue - (hosting_cost + api_cost + tool_cost + other_cost)) STORED,
  margin_pct REAL,                               -- calculated on insert/update
  
  -- Status
  status TEXT DEFAULT 'projected',               -- projected | invoiced | paid | overdue
  invoice_id TEXT,
  paid_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, client_id, period_month, revenue_type)
);

CREATE INDEX IF NOT EXISTS idx_revenue_period ON brain_revenue(period_month DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_project ON brain_revenue(project_id);
CREATE INDEX IF NOT EXISTS idx_revenue_status ON brain_revenue(status);

COMMENT ON TABLE brain_revenue IS 'Financial tracking. MRR, revenue, costs, profit per project per month.';


-- ============================================================================
-- TABLE 5: brain_incidents — Incident Management (HIGH)
-- 
-- When things break: severity, root cause, fix, impact, time to resolve.
-- Linked to brain_learnings so every incident creates a lesson.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Classification
  severity TEXT NOT NULL DEFAULT 'P3',           -- P1 (critical) | P2 (major) | P3 (minor) | P4 (cosmetic)
  category TEXT NOT NULL DEFAULT 'bug',          -- bug | outage | security | performance | data-loss | deploy-fail
  status TEXT NOT NULL DEFAULT 'open',           -- open | investigating | identified | fixing | resolved | closed
  
  -- Timeline
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  identified_at TIMESTAMPTZ,                     -- when root cause was found
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  
  -- Calculated response times
  time_to_acknowledge_min INTEGER,
  time_to_resolve_min INTEGER,
  
  -- Who
  detected_by TEXT NOT NULL,                     -- bot_id or person
  assigned_to TEXT,                              -- bot handling it
  resolved_by TEXT,
  
  -- Root cause
  root_cause TEXT,
  root_cause_category TEXT,                      -- code-error | config | dependency | infra | human-error | external
  affected_files TEXT[] DEFAULT '{}',
  affected_users_estimate INTEGER,
  
  -- Resolution
  fix_description TEXT,
  fix_commit TEXT,                               -- commit SHA of the fix
  fix_verified BOOLEAN DEFAULT false,
  rollback_required BOOLEAN DEFAULT false,
  
  -- Post-mortem
  postmortem TEXT,                               -- full write-up
  action_items TEXT[] DEFAULT '{}',              -- follow-up tasks
  learning_id UUID REFERENCES brain_learnings(id), -- linked lesson learned
  
  -- Impact
  revenue_impact NUMERIC(10,2),                  -- estimated $ lost
  downtime_minutes INTEGER,
  
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_project ON brain_incidents(project_id);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON brain_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON brain_incidents(status) WHERE status != 'closed';
CREATE INDEX IF NOT EXISTS idx_incidents_detected ON brain_incidents(detected_at DESC);

COMMENT ON TABLE brain_incidents IS 'Incident tracking with root cause analysis, resolution timeline, and post-mortems.';


-- ============================================================================
-- TABLE 6: brain_decisions — Decision Log (HIGH)
-- 
-- WHY we chose X over Y. Prevents re-debating the same things.
-- Every significant decision gets recorded with reasoning.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id),
  
  -- The decision
  title TEXT NOT NULL,                           -- short summary
  decision TEXT NOT NULL,                        -- what was decided
  reasoning TEXT NOT NULL,                       -- WHY this choice
  
  -- Context
  category TEXT NOT NULL DEFAULT 'technical',    -- technical | design | business | process | architecture | security
  scope TEXT DEFAULT 'project',                  -- global | project | feature
  
  -- Alternatives
  alternatives JSONB DEFAULT '[]',               -- [{name, description, pros, cons, rejected_reason}]
  
  -- Who & When
  decided_by TEXT NOT NULL,                      -- person or bot
  stakeholders TEXT[] DEFAULT '{}',              -- who was involved/consulted
  decided_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'active',         -- active | superseded | reversed | expired
  superseded_by UUID REFERENCES brain_decisions(id),
  reversal_reason TEXT,
  expires_at TIMESTAMPTZ,                        -- some decisions are time-bound
  
  -- Impact
  reversible BOOLEAN DEFAULT true,
  impact_level TEXT DEFAULT 'medium',            -- low | medium | high | critical
  
  -- References
  related_task_id UUID,
  related_incident_id UUID,
  reference_urls TEXT[] DEFAULT '{}',
  
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decisions_project ON brain_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON brain_decisions(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_decisions_category ON brain_decisions(category);
CREATE INDEX IF NOT EXISTS idx_decisions_fts ON brain_decisions 
  USING GIN(to_tsvector('english', title || ' ' || decision || ' ' || reasoning));

COMMENT ON TABLE brain_decisions IS 'Decision log with reasoning. Prevents re-debating. Tracks what was decided, why, and what alternatives were considered.';


-- ============================================================================
-- TABLE 7: brain_sprints — Sprint Planning (HIGH)
-- 
-- 1-2 week cycles with goals, velocity tracking, capacity per bot.
-- Moves us from ad-hoc to structured delivery.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_sprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id),
  name TEXT NOT NULL,                            -- e.g., "Sprint 12 — CardLedger Launch Prep"
  
  -- Timeline
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',       -- planning | active | completed | cancelled
  
  -- Goals
  goal TEXT NOT NULL,                            -- what we're trying to achieve
  key_deliverables TEXT[] DEFAULT '{}',           -- specific outcomes expected
  
  -- Capacity & Velocity
  planned_points INTEGER DEFAULT 0,              -- story points planned
  completed_points INTEGER DEFAULT 0,            -- story points done
  velocity REAL,                                 -- completed / planned ratio
  
  -- Per-bot allocation
  bot_allocations JSONB DEFAULT '{}',            -- {"denver": {"points": 20, "hours": 16}, ...}
  
  -- Review
  retro_went_well TEXT[] DEFAULT '{}',
  retro_went_wrong TEXT[] DEFAULT '{}',
  retro_action_items TEXT[] DEFAULT '{}',
  
  -- Links
  task_ids UUID[] DEFAULT '{}',                  -- tasks in this sprint
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sprints_project ON brain_sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON brain_sprints(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_sprints_dates ON brain_sprints(start_date DESC);

COMMENT ON TABLE brain_sprints IS 'Sprint planning. 1-2 week cycles with goals, velocity, capacity per bot, and retrospectives.';


-- ============================================================================
-- TABLE 8: brain_tests — QA & Test Tracking (HIGH)
-- 
-- Test results per commit/deploy. Regression detection. Coverage tracking.
-- Ensures we never ship broken code.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id) NOT NULL,
  commit_sha TEXT NOT NULL,
  bot_id TEXT,                                   -- who triggered the tests
  
  -- Test run info
  test_type TEXT NOT NULL DEFAULT 'build',       -- build | unit | integration | e2e | lint | typecheck
  runner TEXT,                                   -- vite | jest | playwright | tsc | eslint
  
  -- Results
  status TEXT NOT NULL DEFAULT 'running',        -- running | passed | failed | error | skipped
  total_tests INTEGER,
  passed INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  skipped INTEGER DEFAULT 0,
  errors TEXT[] DEFAULT '{}',                    -- error messages for failed tests
  
  -- Performance
  duration_ms INTEGER,
  
  -- Coverage (if applicable)
  coverage_pct REAL,
  coverage_lines INTEGER,
  coverage_branches INTEGER,
  
  -- Build info
  build_size_kb INTEGER,                         -- total build output size
  chunk_count INTEGER,                           -- number of JS chunks
  largest_chunk_kb INTEGER,
  
  -- Regression detection
  is_regression BOOLEAN DEFAULT false,           -- did this commit break previously passing tests?
  regression_details TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tests_project ON brain_tests(project_id);
CREATE INDEX IF NOT EXISTS idx_tests_commit ON brain_tests(commit_sha);
CREATE INDEX IF NOT EXISTS idx_tests_status ON brain_tests(status) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_tests_created ON brain_tests(created_at DESC);

COMMENT ON TABLE brain_tests IS 'Test results per commit. Build health, regression detection, coverage tracking.';


-- ============================================================================
-- TABLE 9: brain_competitors — Competitive Intelligence (MEDIUM)
-- 
-- Track competitors, features, pricing, market changes.
-- Know the landscape to make better product decisions.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id) NOT NULL,
  
  -- Competitor info
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  
  -- Analysis
  features JSONB DEFAULT '[]',                   -- [{name, has_it: bool, quality: 1-5}]
  pricing JSONB DEFAULT '{}',                    -- {free_tier, pro_price, enterprise_price}
  tech_stack TEXT[] DEFAULT '{}',
  
  -- SWOT
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  opportunities TEXT[] DEFAULT '{}',             -- opportunities for us based on their weaknesses
  threats TEXT[] DEFAULT '{}',                   -- threats they pose to us
  
  -- Market position
  estimated_users TEXT,                          -- "10K-50K" range estimate
  estimated_revenue TEXT,
  funding TEXT,                                  -- "Series A, $5M" or "Bootstrapped"
  
  -- Tracking
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  change_log JSONB DEFAULT '[]',                 -- [{date, change_description}]
  
  status TEXT DEFAULT 'active',                  -- active | dead | acquired | irrelevant
  threat_level TEXT DEFAULT 'medium',            -- low | medium | high | critical
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitors_project ON brain_competitors(project_id);
CREATE INDEX IF NOT EXISTS idx_competitors_threat ON brain_competitors(threat_level);

COMMENT ON TABLE brain_competitors IS 'Competitive intelligence. Track competitor features, pricing, strengths, and market position.';


-- ============================================================================
-- TABLE 10: brain_retros — Retrospectives (MEDIUM)
-- 
-- Post-project and post-sprint reviews. What went well, what didn't,
-- what to change. Continuous improvement engine.
-- ============================================================================
CREATE TABLE IF NOT EXISTS brain_retros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  project_id TEXT REFERENCES brain_projects(id),
  sprint_id UUID REFERENCES brain_sprints(id),
  
  -- What are we reviewing?
  title TEXT NOT NULL,                           -- e.g., "CardLedger UI Overhaul Retro"
  type TEXT NOT NULL DEFAULT 'sprint',           -- sprint | project | incident | quarterly
  period_start DATE,
  period_end DATE,
  
  -- The retro content
  went_well TEXT[] DEFAULT '{}',                 -- things that worked
  went_wrong TEXT[] DEFAULT '{}',                -- things that didn't
  surprises TEXT[] DEFAULT '{}',                 -- unexpected things (good or bad)
  
  -- Action items
  action_items JSONB DEFAULT '[]',               -- [{description, assigned_to, deadline, status}]
  
  -- Metrics for the period
  metrics_snapshot JSONB DEFAULT '{}',           -- {tasks_completed, avg_velocity, bugs, etc}
  
  -- Participants
  participants TEXT[] DEFAULT '{}',              -- bot_ids + human names
  
  -- Ratings (1-5)
  team_morale INTEGER CHECK (team_morale BETWEEN 1 AND 5),
  process_rating INTEGER CHECK (process_rating BETWEEN 1 AND 5),
  output_quality INTEGER CHECK (output_quality BETWEEN 1 AND 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_retros_project ON brain_retros(project_id);
CREATE INDEX IF NOT EXISTS idx_retros_sprint ON brain_retros(sprint_id);
CREATE INDEX IF NOT EXISTS idx_retros_type ON brain_retros(type);

COMMENT ON TABLE brain_retros IS 'Retrospectives. Post-sprint and post-project reviews for continuous improvement.';


-- ============================================================================
-- RPC FUNCTIONS — Smart Queries
-- ============================================================================

-- Search learnings before starting a task
CREATE OR REPLACE FUNCTION search_learnings(
  p_bot_id TEXT,
  p_project_id TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF brain_learnings
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM brain_learnings
  WHERE is_active = true
    AND (p_project_id IS NULL OR project_id = p_project_id OR project_id IS NULL)
    AND (p_category IS NULL OR trigger_category = p_category)
    AND (p_search IS NULL OR 
         to_tsvector('english', trigger_event || ' ' || lesson || ' ' || COALESCE(fix_applied, '')) 
         @@ plainto_tsquery('english', p_search))
  ORDER BY 
    CASE severity 
      WHEN 'critical' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      ELSE 4 
    END,
    times_helped DESC,
    created_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION search_learnings IS 'Search bot learnings by project, category, or full-text search. Returns most relevant lessons first.';


-- Get bot performance summary
CREATE OR REPLACE FUNCTION get_bot_performance(
  p_bot_id TEXT,
  p_period TEXT DEFAULT 'weekly',
  p_limit INTEGER DEFAULT 4
)
RETURNS SETOF brain_metrics
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM brain_metrics
  WHERE bot_id = p_bot_id
    AND period = p_period
  ORDER BY period_start DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION get_bot_performance IS 'Get recent performance metrics for a specific bot.';


-- Get revenue summary for a period
CREATE OR REPLACE FUNCTION get_revenue_summary(
  p_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE
)
RETURNS TABLE(
  total_revenue NUMERIC,
  total_cost NUMERIC,
  total_profit NUMERIC,
  total_mrr NUMERIC,
  project_count BIGINT,
  client_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(r.revenue), 0) AS total_revenue,
    COALESCE(SUM(r.total_cost), 0) AS total_cost,
    COALESCE(SUM(r.gross_profit), 0) AS total_profit,
    COALESCE(SUM(r.mrr), 0) AS total_mrr,
    COUNT(DISTINCT r.project_id) AS project_count,
    COUNT(DISTINCT r.client_id) AS client_count
  FROM brain_revenue r
  WHERE r.period_month = p_month;
END;
$$;

COMMENT ON FUNCTION get_revenue_summary IS 'Get total revenue, costs, and profit for a given month.';


-- Smart task routing — find the best bot for a task type
CREATE OR REPLACE FUNCTION get_best_bot_for_task(
  p_category TEXT,  -- 'frontend' | 'backend' | 'database' | 'api' | 'security'
  p_project_id TEXT DEFAULT NULL
)
RETURNS TABLE(
  bot_id TEXT,
  overall_score REAL,
  tasks_completed INTEGER,
  quality_score REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.bot_id,
    AVG(m.overall_score)::REAL AS overall_score,
    SUM(m.tasks_completed)::INTEGER AS tasks_completed,
    AVG(m.quality_score)::REAL AS quality_score
  FROM brain_metrics m
  WHERE m.period = 'weekly'
    AND m.period_start >= CURRENT_DATE - INTERVAL '30 days'
    AND (p_project_id IS NULL OR m.project_id = p_project_id)
  GROUP BY m.bot_id
  ORDER BY AVG(m.overall_score) DESC NULLS LAST
  LIMIT 4;
END;
$$;

COMMENT ON FUNCTION get_best_bot_for_task IS 'Find the best bot for a task based on recent performance metrics.';


-- Active incident count
CREATE OR REPLACE FUNCTION get_active_incidents()
RETURNS TABLE(
  total_active BIGINT,
  p1_count BIGINT,
  p2_count BIGINT,
  oldest_unresolved TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) AS total_active,
    COUNT(*) FILTER (WHERE severity = 'P1') AS p1_count,
    COUNT(*) FILTER (WHERE severity = 'P2') AS p2_count,
    MIN(detected_at) AS oldest_unresolved
  FROM brain_incidents
  WHERE status NOT IN ('resolved', 'closed');
END;
$$;

COMMENT ON FUNCTION get_active_incidents IS 'Quick summary of active incidents by severity.';


-- ============================================================================
-- TRIGGERS — Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'brain_learnings', 'brain_clients', 'brain_revenue', 
      'brain_incidents', 'brain_decisions', 'brain_sprints',
      'brain_competitors'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER IF NOT EXISTS trigger_%s_updated_at 
       BEFORE UPDATE ON %I 
       FOR EACH ROW 
       EXECUTE FUNCTION update_updated_at()',
      tbl, tbl
    );
  END LOOP;
END;
$$;


-- ============================================================================
-- TRIGGER: Auto-create learning from resolved incident
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_learn_from_incident()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' AND NEW.root_cause IS NOT NULL THEN
    INSERT INTO brain_learnings (
      bot_id, project_id, trigger_event, trigger_category, 
      trigger_commit, lesson, fix_applied, prevention, severity, tags
    ) VALUES (
      COALESCE(NEW.resolved_by, NEW.detected_by),
      NEW.project_id,
      'Incident: ' || NEW.title,
      COALESCE(NEW.root_cause_category, 'code'),
      NEW.fix_commit,
      'Root cause: ' || NEW.root_cause,
      NEW.fix_description,
      'Action items: ' || array_to_string(NEW.action_items, '; '),
      CASE NEW.severity WHEN 'P1' THEN 'critical' WHEN 'P2' THEN 'high' ELSE 'medium' END,
      NEW.tags
    );
    
    -- Update the incident with the learning reference
    -- (done in application code to avoid recursion)
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_auto_learn_incident
  AFTER UPDATE ON brain_incidents
  FOR EACH ROW
  EXECUTE FUNCTION auto_learn_from_incident();


-- ============================================================================
-- TRIGGER: Calculate incident response times
-- ============================================================================
CREATE OR REPLACE FUNCTION calc_incident_times()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.acknowledged_at IS NOT NULL AND NEW.detected_at IS NOT NULL THEN
    NEW.time_to_acknowledge_min = EXTRACT(EPOCH FROM (NEW.acknowledged_at - NEW.detected_at)) / 60;
  END IF;
  IF NEW.resolved_at IS NOT NULL AND NEW.detected_at IS NOT NULL THEN
    NEW.time_to_resolve_min = EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.detected_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_incident_times
  BEFORE INSERT OR UPDATE ON brain_incidents
  FOR EACH ROW
  EXECUTE FUNCTION calc_incident_times();


-- ============================================================================
-- TRIGGER: Calculate revenue margin
-- ============================================================================
CREATE OR REPLACE FUNCTION calc_revenue_margin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.revenue > 0 THEN
    NEW.margin_pct = ((NEW.revenue - (NEW.hosting_cost + NEW.api_cost + NEW.tool_cost + NEW.other_cost)) / NEW.revenue * 100)::REAL;
  ELSE
    NEW.margin_pct = 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_revenue_margin
  BEFORE INSERT OR UPDATE ON brain_revenue
  FOR EACH ROW
  EXECUTE FUNCTION calc_revenue_margin();


-- ============================================================================
-- SEED DATA — Current clients and revenue
-- ============================================================================

-- Insert current clients
INSERT INTO brain_clients (name, company, status, type, primary_contact, deal_size, mrr, project_ids, notes, tags)
VALUES
  ('Kyle', 'Just Four Kicks (J4K)', 'active', 'internal', 'Kyle', 5820000, 0, ARRAY['j4k'], '$5.82M wholesale sneaker business. 200-300 stores. Goal: 1000+ stores.', ARRAY['founder', 'sneakers', 'wholesale']),
  ('Troy', 'MixzoKickz', 'active', 'client', 'Troy', 2400, 200, ARRAY['mixzo-kickz'], '$200/mo maintenance retainer. Sneaker cleaning + retail.', ARRAY['retainer', 'maintenance', 'sneakers']),
  ('Internal', 'CardLedger', 'active', 'internal', 'Aidan', 0, 0, ARRAY['cardledger'], 'Own product. Pre-revenue. SaaS target: $10-30/mo per user. Freemium model.', ARRAY['saas', 'tcg', 'product']),
  ('Internal', 'Vantix Agency', 'active', 'internal', 'Kyle & Aidan', 0, 0, ARRAY['vantix'], 'AI-powered dev agency. 3327 leads scraped, 866 verified. Building pipeline.', ARRAY['agency', 'leads', 'pipeline'])
ON CONFLICT DO NOTHING;

-- Insert current revenue data (March 2026)
INSERT INTO brain_revenue (project_id, period_month, revenue, revenue_type, mrr, hosting_cost, api_cost, tool_cost, notes, status)
VALUES
  ('mixzo-kickz', '2026-03-01', 200, 'retainer', 200, 0, 0, 0, 'Monthly maintenance retainer from Troy', 'paid'),
  ('cardledger', '2026-03-01', 0, 'recurring', 0, 25, 15, 50, 'Pre-revenue. Costs: Supabase ($25), APIs ($15), AI tokens ($50)', 'projected'),
  ('j4k', '2026-03-01', 0, 'recurring', 0, 20, 0, 0, 'Revenue tracked separately in J4K system. Hosting cost only.', 'projected'),
  ('vantix', '2026-03-01', 0, 'recurring', 0, 10, 5, 30, 'Agency costs: hosting ($10), APIs ($5), AI tools ($30). Building pipeline.', 'projected')
ON CONFLICT DO NOTHING;


-- ============================================================================
-- VIEWS — Quick dashboards
-- ============================================================================

-- Monthly P&L view
CREATE OR REPLACE VIEW brain_monthly_pnl AS
SELECT 
  period_month,
  SUM(revenue) AS total_revenue,
  SUM(total_cost) AS total_costs,
  SUM(gross_profit) AS total_profit,
  SUM(mrr) AS total_mrr,
  COUNT(DISTINCT project_id) AS active_projects,
  ROUND(AVG(margin_pct)::NUMERIC, 1) AS avg_margin_pct
FROM brain_revenue
GROUP BY period_month
ORDER BY period_month DESC;

-- Bot leaderboard view
CREATE OR REPLACE VIEW brain_bot_leaderboard AS
SELECT 
  bot_id,
  SUM(tasks_completed) AS total_tasks,
  AVG(overall_score)::REAL AS avg_score,
  AVG(quality_score)::REAL AS avg_quality,
  AVG(speed_score)::REAL AS avg_speed,
  SUM(bugs_introduced) AS total_bugs,
  SUM(builds_broken) AS total_builds_broken,
  SUM(learnings_logged) AS total_learnings
FROM brain_metrics
WHERE period_start >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY bot_id
ORDER BY AVG(overall_score) DESC NULLS LAST;

-- Active incidents dashboard
CREATE OR REPLACE VIEW brain_incident_dashboard AS
SELECT 
  severity,
  status,
  COUNT(*) AS count,
  AVG(time_to_resolve_min) AS avg_resolve_minutes,
  MIN(detected_at) AS oldest
FROM brain_incidents
WHERE status NOT IN ('closed')
GROUP BY severity, status
ORDER BY 
  CASE severity WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 WHEN 'P3' THEN 3 ELSE 4 END;

-- Client health overview
CREATE OR REPLACE VIEW brain_client_health AS
SELECT 
  c.name,
  c.company,
  c.status,
  c.mrr,
  c.health_status,
  c.satisfaction_score,
  c.next_followup,
  c.last_contact,
  CASE 
    WHEN c.next_followup < CURRENT_DATE THEN 'overdue'
    WHEN c.next_followup < CURRENT_DATE + INTERVAL '3 days' THEN 'upcoming'
    ELSE 'ok'
  END AS followup_status
FROM brain_clients c
WHERE c.status IN ('active', 'prospect')
ORDER BY 
  CASE c.health_status WHEN 'churning' THEN 1 WHEN 'at-risk' THEN 2 ELSE 3 END,
  c.next_followup ASC NULLS LAST;


-- ============================================================================
-- DONE! 🎉
-- 
-- Created:
--   10 new tables (brain_learnings, brain_metrics, brain_clients, brain_revenue,
--     brain_incidents, brain_decisions, brain_sprints, brain_tests, 
--     brain_competitors, brain_retros)
--   4 RPC functions (search_learnings, get_bot_performance, get_revenue_summary,
--     get_best_bot_for_task, get_active_incidents)
--   5 triggers (auto timestamps, incident→learning, incident times, revenue margin)
--   4 views (monthly P&L, bot leaderboard, incident dashboard, client health)
--   Seed data for current clients and March 2026 revenue
--
-- Total Brain: 27 tables, 5 RPC functions, 5 triggers, 4 views
-- Status: 100% 🧠
-- ============================================================================
