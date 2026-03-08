-- ============================================================================
-- 🧠 BRAIN V3 FIX — Drop conflicting old tables + recreate with new schema
-- 
-- Some tables were created earlier with different columns.
-- This script safely drops them and recreates with the full V3 schema.
-- Run this INSTEAD of brain_v3_upgrade.sql if you got errors.
-- ============================================================================

-- Drop old conflicting tables (CASCADE drops dependent objects)
DROP TABLE IF EXISTS brain_learnings CASCADE;
DROP TABLE IF EXISTS brain_metrics CASCADE;
DROP TABLE IF EXISTS brain_clients CASCADE;
DROP TABLE IF EXISTS brain_revenue CASCADE;
DROP TABLE IF EXISTS brain_incidents CASCADE;
DROP TABLE IF EXISTS brain_decisions CASCADE;
DROP TABLE IF EXISTS brain_sprints CASCADE;
DROP TABLE IF EXISTS brain_tests CASCADE;
DROP TABLE IF EXISTS brain_competitors CASCADE;
DROP TABLE IF EXISTS brain_retros CASCADE;

-- Drop old functions that reference old schemas
DROP FUNCTION IF EXISTS search_learnings CASCADE;
DROP FUNCTION IF EXISTS get_bot_performance CASCADE;
DROP FUNCTION IF EXISTS get_revenue_summary CASCADE;
DROP FUNCTION IF EXISTS get_best_bot_for_task CASCADE;
DROP FUNCTION IF EXISTS get_active_incidents CASCADE;
DROP FUNCTION IF EXISTS get_new_learnings CASCADE;

-- Drop old indexes that might conflict
DO $$ BEGIN
  EXECUTE (SELECT string_agg('DROP INDEX IF EXISTS ' || indexname || ' CASCADE;', E'\n') FROM pg_indexes WHERE tablename LIKE 'brain_%' AND indexname LIKE 'idx_%');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop old views
DROP VIEW IF EXISTS brain_monthly_pnl CASCADE;
DROP VIEW IF EXISTS brain_bot_leaderboard CASCADE;
DROP VIEW IF EXISTS brain_incident_dashboard CASCADE;
DROP VIEW IF EXISTS brain_client_health CASCADE;

-- Now run the full V3 creation (copy everything from brain_v3_upgrade.sql below)
-- ============================================================================

-- TABLE 1: brain_learnings
CREATE TABLE brain_learnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id TEXT NOT NULL,
  project_id TEXT,
  trigger_event TEXT NOT NULL,
  trigger_category TEXT NOT NULL DEFAULT 'code',
  trigger_file TEXT,
  trigger_commit TEXT,
  lesson TEXT NOT NULL,
  fix_applied TEXT,
  prevention TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  confidence REAL NOT NULL DEFAULT 0.8,
  times_applied INTEGER NOT NULL DEFAULT 0,
  times_helped INTEGER NOT NULL DEFAULT 0,
  last_applied_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  related_learning_ids UUID[] DEFAULT '{}',
  superseded_by UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learnings_bot ON brain_learnings(bot_id);
CREATE INDEX IF NOT EXISTS idx_learnings_project ON brain_learnings(project_id);
CREATE INDEX IF NOT EXISTS idx_learnings_category ON brain_learnings(trigger_category);
CREATE INDEX IF NOT EXISTS idx_learnings_severity ON brain_learnings(severity);
CREATE INDEX IF NOT EXISTS idx_learnings_active ON brain_learnings(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_learnings_tags ON brain_learnings USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_learnings_fts ON brain_learnings 
  USING GIN(to_tsvector('english', trigger_event || ' ' || lesson || ' ' || COALESCE(fix_applied, '')));


-- TABLE 2: brain_metrics
CREATE TABLE brain_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id TEXT NOT NULL,
  project_id TEXT,
  period TEXT NOT NULL DEFAULT 'daily',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_failed INTEGER NOT NULL DEFAULT 0,
  tasks_reassigned INTEGER NOT NULL DEFAULT 0,
  avg_completion_hours REAL,
  fastest_task_hours REAL,
  slowest_task_hours REAL,
  commits_pushed INTEGER NOT NULL DEFAULT 0,
  lines_added INTEGER NOT NULL DEFAULT 0,
  lines_deleted INTEGER NOT NULL DEFAULT 0,
  files_changed INTEGER NOT NULL DEFAULT 0,
  builds_broken INTEGER NOT NULL DEFAULT 0,
  bugs_introduced INTEGER NOT NULL DEFAULT 0,
  bugs_fixed INTEGER NOT NULL DEFAULT 0,
  merge_conflicts INTEGER NOT NULL DEFAULT 0,
  rollbacks INTEGER NOT NULL DEFAULT 0,
  handoffs_sent INTEGER NOT NULL DEFAULT 0,
  handoffs_received INTEGER NOT NULL DEFAULT 0,
  alerts_raised INTEGER NOT NULL DEFAULT 0,
  learnings_logged INTEGER NOT NULL DEFAULT 0,
  speed_score REAL,
  quality_score REAL,
  reliability_score REAL,
  collaboration_score REAL,
  overall_score REAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bot_id, project_id, period, period_start)
);

CREATE INDEX IF NOT EXISTS idx_metrics_bot ON brain_metrics(bot_id);
CREATE INDEX IF NOT EXISTS idx_metrics_period ON brain_metrics(period_start DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_overall ON brain_metrics(overall_score DESC NULLS LAST);


-- TABLE 3: brain_clients
CREATE TABLE brain_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'prospect',
  type TEXT NOT NULL DEFAULT 'client',
  primary_contact TEXT,
  primary_email TEXT,
  primary_phone TEXT,
  secondary_contact TEXT,
  secondary_email TEXT,
  deal_size NUMERIC(12,2),
  mrr NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  billing_cycle TEXT DEFAULT 'monthly',
  first_contact DATE,
  contract_start DATE,
  contract_end DATE,
  last_contact DATE,
  next_followup DATE,
  satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 10),
  health_status TEXT DEFAULT 'healthy',
  referral_source TEXT,
  project_ids TEXT[] DEFAULT '{}',
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_status ON brain_clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_health ON brain_clients(health_status);
CREATE INDEX IF NOT EXISTS idx_clients_followup ON brain_clients(next_followup) WHERE next_followup IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_tags ON brain_clients USING GIN(tags);


-- TABLE 4: brain_revenue
CREATE TABLE brain_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT,
  client_id UUID REFERENCES brain_clients(id),
  period_month DATE NOT NULL,
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  revenue_type TEXT NOT NULL DEFAULT 'recurring',
  mrr NUMERIC(10,2) DEFAULT 0,
  hosting_cost NUMERIC(10,2) DEFAULT 0,
  api_cost NUMERIC(10,2) DEFAULT 0,
  tool_cost NUMERIC(10,2) DEFAULT 0,
  other_cost NUMERIC(10,2) DEFAULT 0,
  total_cost NUMERIC(10,2) GENERATED ALWAYS AS (hosting_cost + api_cost + tool_cost + other_cost) STORED,
  gross_profit NUMERIC(12,2) GENERATED ALWAYS AS (revenue - (hosting_cost + api_cost + tool_cost + other_cost)) STORED,
  margin_pct REAL,
  status TEXT DEFAULT 'projected',
  invoice_id TEXT,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_period ON brain_revenue(period_month DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_project ON brain_revenue(project_id);
CREATE INDEX IF NOT EXISTS idx_revenue_status ON brain_revenue(status);


-- TABLE 5: brain_incidents
CREATE TABLE brain_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'P3',
  category TEXT NOT NULL DEFAULT 'bug',
  status TEXT NOT NULL DEFAULT 'open',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  identified_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  time_to_acknowledge_min INTEGER,
  time_to_resolve_min INTEGER,
  detected_by TEXT NOT NULL,
  assigned_to TEXT,
  resolved_by TEXT,
  root_cause TEXT,
  root_cause_category TEXT,
  affected_files TEXT[] DEFAULT '{}',
  affected_users_estimate INTEGER,
  fix_description TEXT,
  fix_commit TEXT,
  fix_verified BOOLEAN DEFAULT false,
  rollback_required BOOLEAN DEFAULT false,
  postmortem TEXT,
  action_items TEXT[] DEFAULT '{}',
  learning_id UUID REFERENCES brain_learnings(id),
  revenue_impact NUMERIC(10,2),
  downtime_minutes INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_project ON brain_incidents(project_id);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON brain_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON brain_incidents(status) WHERE status NOT IN ('resolved', 'closed');
CREATE INDEX IF NOT EXISTS idx_incidents_detected ON brain_incidents(detected_at DESC);


-- TABLE 6: brain_decisions
CREATE TABLE brain_decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT,
  title TEXT NOT NULL,
  decision TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'technical',
  scope TEXT DEFAULT 'project',
  alternatives JSONB DEFAULT '[]',
  decided_by TEXT NOT NULL,
  stakeholders TEXT[] DEFAULT '{}',
  decided_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  superseded_by UUID,
  reversal_reason TEXT,
  expires_at TIMESTAMPTZ,
  reversible BOOLEAN DEFAULT true,
  impact_level TEXT DEFAULT 'medium',
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


-- TABLE 7: brain_sprints
CREATE TABLE brain_sprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',
  goal TEXT NOT NULL,
  key_deliverables TEXT[] DEFAULT '{}',
  planned_points INTEGER DEFAULT 0,
  completed_points INTEGER DEFAULT 0,
  velocity REAL,
  bot_allocations JSONB DEFAULT '{}',
  retro_went_well TEXT[] DEFAULT '{}',
  retro_went_wrong TEXT[] DEFAULT '{}',
  retro_action_items TEXT[] DEFAULT '{}',
  task_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sprints_project ON brain_sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON brain_sprints(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_sprints_dates ON brain_sprints(start_date DESC);


-- TABLE 8: brain_tests
CREATE TABLE brain_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  bot_id TEXT,
  test_type TEXT NOT NULL DEFAULT 'build',
  runner TEXT,
  status TEXT NOT NULL DEFAULT 'running',
  total_tests INTEGER,
  passed INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  skipped INTEGER DEFAULT 0,
  errors TEXT[] DEFAULT '{}',
  duration_ms INTEGER,
  coverage_pct REAL,
  coverage_lines INTEGER,
  coverage_branches INTEGER,
  build_size_kb INTEGER,
  chunk_count INTEGER,
  largest_chunk_kb INTEGER,
  is_regression BOOLEAN DEFAULT false,
  regression_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tests_project ON brain_tests(project_id);
CREATE INDEX IF NOT EXISTS idx_tests_commit ON brain_tests(commit_sha);
CREATE INDEX IF NOT EXISTS idx_tests_status ON brain_tests(status) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_tests_created ON brain_tests(created_at DESC);


-- TABLE 9: brain_competitors
CREATE TABLE brain_competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  features JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  opportunities TEXT[] DEFAULT '{}',
  threats TEXT[] DEFAULT '{}',
  estimated_users TEXT,
  estimated_revenue TEXT,
  funding TEXT,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  change_log JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  threat_level TEXT DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitors_project ON brain_competitors(project_id);
CREATE INDEX IF NOT EXISTS idx_competitors_threat ON brain_competitors(threat_level);


-- TABLE 10: brain_retros
CREATE TABLE brain_retros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT,
  sprint_id UUID REFERENCES brain_sprints(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'sprint',
  period_start DATE,
  period_end DATE,
  went_well TEXT[] DEFAULT '{}',
  went_wrong TEXT[] DEFAULT '{}',
  surprises TEXT[] DEFAULT '{}',
  action_items JSONB DEFAULT '[]',
  metrics_snapshot JSONB DEFAULT '{}',
  participants TEXT[] DEFAULT '{}',
  team_morale INTEGER CHECK (team_morale BETWEEN 1 AND 5),
  process_rating INTEGER CHECK (process_rating BETWEEN 1 AND 5),
  output_quality INTEGER CHECK (output_quality BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_retros_project ON brain_retros(project_id);
CREATE INDEX IF NOT EXISTS idx_retros_sprint ON brain_retros(sprint_id);
CREATE INDEX IF NOT EXISTS idx_retros_type ON brain_retros(type);


-- ============================================================================
-- RPC FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION search_learnings(
  p_bot_id TEXT,
  p_project_id TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF brain_learnings
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM brain_learnings
  WHERE is_active = true
    AND (p_project_id IS NULL OR project_id = p_project_id OR project_id IS NULL)
    AND (p_category IS NULL OR trigger_category = p_category)
    AND (p_search IS NULL OR 
         to_tsvector('english', trigger_event || ' ' || lesson || ' ' || COALESCE(fix_applied, '')) 
         @@ plainto_tsquery('english', p_search))
  ORDER BY 
    CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
    times_helped DESC, created_at DESC
  LIMIT p_limit;
END; $$;

CREATE OR REPLACE FUNCTION get_bot_performance(
  p_bot_id TEXT,
  p_period TEXT DEFAULT 'weekly',
  p_limit INTEGER DEFAULT 4
)
RETURNS SETOF brain_metrics
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM brain_metrics
  WHERE bot_id = p_bot_id AND period = p_period
  ORDER BY period_start DESC LIMIT p_limit;
END; $$;

CREATE OR REPLACE FUNCTION get_revenue_summary(
  p_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE
)
RETURNS TABLE(total_revenue NUMERIC, total_cost NUMERIC, total_profit NUMERIC, total_mrr NUMERIC, project_count BIGINT, client_count BIGINT)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(r.revenue),0), COALESCE(SUM(r.total_cost),0), COALESCE(SUM(r.gross_profit),0),
    COALESCE(SUM(r.mrr),0), COUNT(DISTINCT r.project_id), COUNT(DISTINCT r.client_id)
  FROM brain_revenue r WHERE r.period_month = p_month;
END; $$;

CREATE OR REPLACE FUNCTION get_best_bot_for_task(
  p_category TEXT, p_project_id TEXT DEFAULT NULL
)
RETURNS TABLE(bot_id TEXT, overall_score REAL, tasks_completed INTEGER, quality_score REAL)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT m.bot_id, AVG(m.overall_score)::REAL, SUM(m.tasks_completed)::INTEGER, AVG(m.quality_score)::REAL
  FROM brain_metrics m
  WHERE m.period = 'weekly' AND m.period_start >= CURRENT_DATE - INTERVAL '30 days'
    AND (p_project_id IS NULL OR m.project_id = p_project_id)
  GROUP BY m.bot_id ORDER BY AVG(m.overall_score) DESC NULLS LAST LIMIT 4;
END; $$;

CREATE OR REPLACE FUNCTION get_active_incidents()
RETURNS TABLE(total_active BIGINT, p1_count BIGINT, p2_count BIGINT, oldest_unresolved TIMESTAMPTZ)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*), COUNT(*) FILTER (WHERE severity = 'P1'), COUNT(*) FILTER (WHERE severity = 'P2'), MIN(detected_at)
  FROM brain_incidents WHERE status NOT IN ('resolved', 'closed');
END; $$;


-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_learnings_ts BEFORE UPDATE ON brain_learnings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_ts BEFORE UPDATE ON brain_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_revenue_ts BEFORE UPDATE ON brain_revenue FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_incidents_ts BEFORE UPDATE ON brain_incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_decisions_ts BEFORE UPDATE ON brain_decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sprints_ts BEFORE UPDATE ON brain_sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_competitors_ts BEFORE UPDATE ON brain_competitors FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-learn from incidents
CREATE OR REPLACE FUNCTION auto_learn_from_incident() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' AND NEW.root_cause IS NOT NULL THEN
    INSERT INTO brain_learnings (bot_id, project_id, trigger_event, trigger_category, trigger_commit, lesson, fix_applied, prevention, severity, tags)
    VALUES (COALESCE(NEW.resolved_by, NEW.detected_by), NEW.project_id, 'Incident: ' || NEW.title,
      COALESCE(NEW.root_cause_category, 'code'), NEW.fix_commit, 'Root cause: ' || NEW.root_cause,
      NEW.fix_description, 'Action items: ' || array_to_string(NEW.action_items, '; '),
      CASE NEW.severity WHEN 'P1' THEN 'critical' WHEN 'P2' THEN 'high' ELSE 'medium' END, NEW.tags);
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incident_learn AFTER UPDATE ON brain_incidents FOR EACH ROW EXECUTE FUNCTION auto_learn_from_incident();

-- Auto-calc incident response times
CREATE OR REPLACE FUNCTION calc_incident_times() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.acknowledged_at IS NOT NULL AND NEW.detected_at IS NOT NULL THEN
    NEW.time_to_acknowledge_min = EXTRACT(EPOCH FROM (NEW.acknowledged_at - NEW.detected_at)) / 60;
  END IF;
  IF NEW.resolved_at IS NOT NULL AND NEW.detected_at IS NOT NULL THEN
    NEW.time_to_resolve_min = EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.detected_at)) / 60;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incident_times BEFORE INSERT OR UPDATE ON brain_incidents FOR EACH ROW EXECUTE FUNCTION calc_incident_times();

-- Auto-calc revenue margin
CREATE OR REPLACE FUNCTION calc_revenue_margin() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.revenue > 0 THEN
    NEW.margin_pct = ((NEW.revenue - (NEW.hosting_cost + NEW.api_cost + NEW.tool_cost + NEW.other_cost)) / NEW.revenue * 100)::REAL;
  ELSE NEW.margin_pct = 0; END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_revenue_margin BEFORE INSERT OR UPDATE ON brain_revenue FOR EACH ROW EXECUTE FUNCTION calc_revenue_margin();


-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW brain_monthly_pnl AS
SELECT period_month, SUM(revenue) AS total_revenue, SUM(total_cost) AS total_costs,
  SUM(gross_profit) AS total_profit, SUM(mrr) AS total_mrr,
  COUNT(DISTINCT project_id) AS active_projects, ROUND(AVG(margin_pct)::NUMERIC, 1) AS avg_margin_pct
FROM brain_revenue GROUP BY period_month ORDER BY period_month DESC;

CREATE OR REPLACE VIEW brain_bot_leaderboard AS
SELECT bot_id, SUM(tasks_completed) AS total_tasks, AVG(overall_score)::REAL AS avg_score,
  AVG(quality_score)::REAL AS avg_quality, AVG(speed_score)::REAL AS avg_speed,
  SUM(bugs_introduced) AS total_bugs, SUM(builds_broken) AS total_builds_broken
FROM brain_metrics WHERE period_start >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY bot_id ORDER BY AVG(overall_score) DESC NULLS LAST;

CREATE OR REPLACE VIEW brain_incident_dashboard AS
SELECT severity, status, COUNT(*) AS count, AVG(time_to_resolve_min) AS avg_resolve_minutes, MIN(detected_at) AS oldest
FROM brain_incidents WHERE status NOT IN ('closed')
GROUP BY severity, status ORDER BY CASE severity WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 WHEN 'P3' THEN 3 ELSE 4 END;

CREATE OR REPLACE VIEW brain_client_health AS
SELECT c.name, c.company, c.status, c.mrr, c.health_status, c.satisfaction_score, c.next_followup, c.last_contact,
  CASE WHEN c.next_followup < CURRENT_DATE THEN 'overdue' WHEN c.next_followup < CURRENT_DATE + INTERVAL '3 days' THEN 'upcoming' ELSE 'ok' END AS followup_status
FROM brain_clients c WHERE c.status IN ('active', 'prospect')
ORDER BY CASE c.health_status WHEN 'churning' THEN 1 WHEN 'at-risk' THEN 2 ELSE 3 END, c.next_followup ASC NULLS LAST;


-- ============================================================================
-- SEED DATA
-- ============================================================================

INSERT INTO brain_clients (name, company, status, type, primary_contact, deal_size, mrr, project_ids, notes, tags)
VALUES
  ('Kyle', 'Just Four Kicks (J4K)', 'active', 'internal', 'Kyle', 5820000, 0, ARRAY['j4k'], '$5.82M wholesale sneaker business', ARRAY['founder', 'sneakers']),
  ('Troy', 'MixzoKickz', 'active', 'client', 'Troy', 2400, 200, ARRAY['mixzo-kickz'], '$200/mo retainer', ARRAY['retainer', 'sneakers']),
  ('Internal', 'CardLedger', 'active', 'internal', 'Aidan', 0, 0, ARRAY['cardledger'], 'Own product. Pre-revenue SaaS.', ARRAY['saas', 'tcg']),
  ('Internal', 'Vantix Agency', 'active', 'internal', 'Kyle & Aidan', 0, 0, ARRAY['vantix'], 'AI dev agency. Building pipeline.', ARRAY['agency']);

INSERT INTO brain_revenue (project_id, period_month, revenue, revenue_type, mrr, hosting_cost, api_cost, tool_cost, notes, status)
VALUES
  ('mixzo-kickz', '2026-03-01', 200, 'retainer', 200, 0, 0, 0, 'Monthly retainer from Troy', 'paid'),
  ('cardledger', '2026-03-01', 0, 'recurring', 0, 25, 15, 50, 'Pre-revenue. Supabase+APIs+AI costs', 'projected'),
  ('j4k', '2026-03-01', 0, 'recurring', 0, 20, 0, 0, 'Revenue tracked in J4K system', 'projected'),
  ('vantix', '2026-03-01', 0, 'recurring', 0, 10, 5, 30, 'Agency costs while building pipeline', 'projected');


-- ============================================================================
-- DONE! 🎉 10 tables + 5 functions + 10 triggers + 4 views + seed data
-- ============================================================================
