-- ============================================================
-- VANTIX BRAIN V2: HIVE MIND UPGRADE
-- ============================================================
-- SAFE MIGRATION: Only creates NEW tables + adds columns to existing.
-- Does NOT drop, rename, or alter existing columns.
-- Run in Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- 1. HIVE MIND KNOWLEDGE UPGRADES (add columns to brain_knowledge)
-- ============================================================
-- Add confidence scoring, usage tracking, verification, and linking

ALTER TABLE brain_knowledge
  ADD COLUMN IF NOT EXISTS confidence numeric DEFAULT 0.8,
  ADD COLUMN IF NOT EXISTS times_used integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_verified timestamptz,
  ADD COLUMN IF NOT EXISTS related_to text[],
  ADD COLUMN IF NOT EXISTS source_bot text,
  ADD COLUMN IF NOT EXISTS source_mistake_id uuid;

COMMENT ON COLUMN brain_knowledge.confidence IS 'How reliable is this knowledge (0.0-1.0). Auto-increases when verified, decreases when contradicted.';
COMMENT ON COLUMN brain_knowledge.times_used IS 'How many times a bot referenced this knowledge before starting work.';
COMMENT ON COLUMN brain_knowledge.last_verified IS 'Last time a bot confirmed this knowledge is still accurate.';
COMMENT ON COLUMN brain_knowledge.related_to IS 'Array of brain_knowledge keys that relate to this entry.';


-- ============================================================
-- 2. BRAIN LEARNINGS (Real-time learning feed — the hive mind nerve center)
-- ============================================================
-- When a bot discovers something, it goes here.
-- All bots pull new learnings on every heartbeat.

CREATE TABLE IF NOT EXISTS brain_learnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL,
  project_id text,
  category text NOT NULL DEFAULT 'discovery',
    -- discovery: found something new
    -- optimization: found a faster/better way
    -- warning: found a pitfall to avoid
    -- pattern: recognized a recurring pattern
    -- technique: learned a new technique
  title text NOT NULL,
  description text NOT NULL,
  evidence text,               -- proof (error log, commit SHA, URL)
  confidence numeric DEFAULT 0.7,
  promoted_to_knowledge boolean DEFAULT false,  -- true once added to brain_knowledge
  acknowledged_by text[] DEFAULT '{}',          -- which bots have seen this
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learnings_bot ON brain_learnings(bot_id);
CREATE INDEX IF NOT EXISTS idx_learnings_created ON brain_learnings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learnings_promoted ON brain_learnings(promoted_to_knowledge);

COMMENT ON TABLE brain_learnings IS 'Real-time learning feed. Bots post discoveries here. Other bots pull new entries on every heartbeat. High-confidence learnings get promoted to brain_knowledge.';


-- ============================================================
-- 3. BRAIN MISTAKES (Learn from failures — never repeat them)
-- ============================================================
-- Every mistake becomes a prevention rule for the whole hive.

CREATE TABLE IF NOT EXISTS brain_mistakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL,
  project_id text,
  error_type text NOT NULL,
    -- build_fail | runtime_error | bad_ux | reverted_commit
    -- wrong_file | merge_conflict | broke_feature | security_issue
    -- missed_requirement | slow_performance | bad_data
  title text NOT NULL,
  description text NOT NULL,
  root_cause text,
  fix_applied text,
  prevention_rule text,         -- auto-generated rule to prevent recurrence
  severity text DEFAULT 'medium',  -- low | medium | high | critical
  commit_sha text,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mistakes_bot ON brain_mistakes(bot_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_type ON brain_mistakes(error_type);
CREATE INDEX IF NOT EXISTS idx_mistakes_resolved ON brain_mistakes(resolved);

COMMENT ON TABLE brain_mistakes IS 'Every mistake gets logged with root cause and prevention rule. Prevention rules auto-sync to brain_knowledge so the entire hive learns from one bots failure.';


-- ============================================================
-- 4. BRAIN BOT SCORES (Performance tracking — bots get better over time)
-- ============================================================
-- Weekly snapshots of each bot performance.

CREATE TABLE IF NOT EXISTS brain_bot_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  tasks_assigned integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  tasks_failed integer DEFAULT 0,
  avg_completion_hours numeric,
  bugs_introduced integer DEFAULT 0,
  bugs_fixed integer DEFAULT 0,
  commits_pushed integer DEFAULT 0,
  commits_reverted integer DEFAULT 0,
  knowledge_contributed integer DEFAULT 0,   -- learnings shared
  mistakes_made integer DEFAULT 0,
  build_pass_rate numeric,                    -- 0.0-1.0
  overall_score numeric,                      -- calculated composite score
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(bot_id, period_start)
);

COMMENT ON TABLE brain_bot_scores IS 'Weekly performance scorecards per bot. Used to track improvement over time and optimize task assignment.';


-- ============================================================
-- 5. BRAIN TEST RESULTS (Automated testing — zero trust deploys)
-- ============================================================
-- Every deploy gets tested. Results logged here.

CREATE TABLE IF NOT EXISTS brain_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  bot_id text NOT NULL,         -- who ran the test
  trigger_type text NOT NULL,   -- post_deploy | scheduled | manual | pre_push
  commit_sha text,
  deploy_url text,
  total_tests integer DEFAULT 0,
  passed integer DEFAULT 0,
  failed integer DEFAULT 0,
  skipped integer DEFAULT 0,
  errors jsonb DEFAULT '[]',    -- array of {page, error, screenshot_url}
  console_errors jsonb DEFAULT '[]',
  performance jsonb,            -- {avg_load_ms, slowest_page, lighthouse_score}
  mobile_tested boolean DEFAULT false,
  status text DEFAULT 'running',  -- running | passed | failed | error
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_tests_project ON brain_test_results(project_id);
CREATE INDEX IF NOT EXISTS idx_tests_status ON brain_test_results(status);
CREATE INDEX IF NOT EXISTS idx_tests_started ON brain_test_results(started_at DESC);

COMMENT ON TABLE brain_test_results IS 'Automated test results for every deploy and scheduled test run. Tracks page errors, console errors, performance, and mobile compatibility.';


-- ============================================================
-- 6. BRAIN INITIATIVES (Autonomous work — bots find their own tasks)
-- ============================================================
-- Bots propose work. Low-risk = auto-approved. High-risk = needs human approval.

CREATE TABLE IF NOT EXISTS brain_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL,          -- who proposed it
  project_id text,
  category text NOT NULL,
    -- code_cleanup | performance | security | bug_fix
    -- feature_idea | optimization | documentation
    -- competitor_insight | ux_improvement | tech_debt
  title text NOT NULL,
  description text NOT NULL,
  rationale text,                -- why this matters
  estimated_hours numeric,
  risk_level text DEFAULT 'low', -- low | medium | high
    -- low = auto-approved (cleanup, tests, docs)
    -- medium = needs bot lead (Vix) approval
    -- high = needs human (Aidan/Kyle) approval
  status text DEFAULT 'proposed',
    -- proposed | approved | rejected | in_progress | completed | cancelled
  approved_by text,              -- vantixhq | aidan | kyle
  assigned_to text,              -- which bot picks it up
  commit_sha text,
  impact_notes text,             -- what changed after completion
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_initiatives_status ON brain_initiatives(status);
CREATE INDEX IF NOT EXISTS idx_initiatives_risk ON brain_initiatives(risk_level);
CREATE INDEX IF NOT EXISTS idx_initiatives_bot ON brain_initiatives(bot_id);

COMMENT ON TABLE brain_initiatives IS 'Autonomous work proposals. Bots scan for improvements and propose them here. Low-risk items auto-execute. Medium/high need approval. This is how bots stay productive without being asked.';


-- ============================================================
-- 7. BRAIN INCIDENTS (already exists — adding new columns only)
-- ============================================================
-- Existing columns: id, project_id, severity, title, description, error_details,
--   detected_by, assigned_to, status, resolution, resolved_at, notify_founders,
--   created_at, updated_at

ALTER TABLE brain_incidents
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS steps_to_reproduce text,
  ADD COLUMN IF NOT EXISTS affected_pages text[],
  ADD COLUMN IF NOT EXISTS commit_sha text,
  ADD COLUMN IF NOT EXISTS resolution_hours numeric;

COMMENT ON COLUMN brain_incidents.category IS 'bug | outage | performance | security | data_issue | ux_broken';
COMMENT ON COLUMN brain_incidents.resolution_hours IS 'Auto-calculated time from created_at to resolved_at.';


-- ============================================================
-- 8. BRAIN SPRINTS (Sprint planning — deadlines and velocity)
-- ============================================================

CREATE TABLE IF NOT EXISTS brain_sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,             -- "Week of Mar 10" or "CardLedger V5 Sprint 1"
  project_id text,                -- null = cross-project sprint
  goals text[] NOT NULL,          -- what we want to accomplish
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'planned',  -- planned | active | completed | cancelled
  tasks_planned integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  velocity numeric,               -- tasks completed / days
  retro_notes text,               -- auto-generated retrospective
  created_by text DEFAULT 'vantixhq',
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE brain_sprints IS 'Sprint planning with goals, deadlines, and velocity tracking. Vix creates sprints weekly and generates retros automatically.';


-- ============================================================
-- 9. BRAIN NOTIFICATIONS (Bot-to-bot async messaging queue)
-- ============================================================

CREATE TABLE IF NOT EXISTS brain_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_bot text NOT NULL,
  to_bot text NOT NULL,
  priority text DEFAULT 'normal', -- low | normal | urgent
  category text DEFAULT 'info',   -- info | request | alert | blocker | handoff
  title text NOT NULL,
  message text NOT NULL,
  action_required boolean DEFAULT false,
  read boolean DEFAULT false,
  read_at timestamptz,
  expires_at timestamptz,          -- auto-dismiss after this time
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_to ON brain_notifications(to_bot, read);
CREATE INDEX IF NOT EXISTS idx_notif_created ON brain_notifications(created_at DESC);

COMMENT ON TABLE brain_notifications IS 'Async bot-to-bot messaging. Bots check for unread notifications on every heartbeat. Enables handoffs, blockers, and coordination without humans.';


-- ============================================================
-- 10. BRAIN REVIEWS (already exists — adding new columns only)
-- ============================================================

ALTER TABLE brain_reviews
  ADD COLUMN IF NOT EXISTS author_bot text,
  ADD COLUMN IF NOT EXISTS reviewer_bot text,
  ADD COLUMN IF NOT EXISTS commit_sha text,
  ADD COLUMN IF NOT EXISTS files_changed text[],
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS issues_found jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_reviews_status ON brain_reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_project ON brain_reviews(project_id);


-- ============================================================
-- 11. BRAIN SCHEDULES (already exists — adding new columns only)
-- ============================================================
-- Existing columns: id, title, description, cron_expression, timezone,
--   assigned_to, project_id, playbook_id, enabled, last_run_at, next_run_at, created_at

ALTER TABLE brain_schedules
  ADD COLUMN IF NOT EXISTS last_status text,
  ADD COLUMN IF NOT EXISTS bot_id text;


-- ============================================================
-- 12. ADD TASK UPGRADES (new columns on brain_tasks)
-- ============================================================

ALTER TABLE brain_tasks
  ADD COLUMN IF NOT EXISTS estimated_hours numeric,
  ADD COLUMN IF NOT EXISTS actual_hours numeric,
  ADD COLUMN IF NOT EXISTS sprint_id uuid,
  ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS test_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS initiative_id uuid;

COMMENT ON COLUMN brain_tasks.estimated_hours IS 'Estimated hours to complete. Used for sprint velocity calculations.';
COMMENT ON COLUMN brain_tasks.actual_hours IS 'Actual hours taken. Compared to estimate for accuracy tracking.';
COMMENT ON COLUMN brain_tasks.sprint_id IS 'Which sprint this task belongs to.';
COMMENT ON COLUMN brain_tasks.review_status IS 'Code review status: none | pending | approved | changes_requested.';
COMMENT ON COLUMN brain_tasks.test_status IS 'Test status: none | pending | passed | failed.';


-- ============================================================
-- 13. HELPER FUNCTIONS
-- ============================================================

-- Function: Promote a learning to knowledge
CREATE OR REPLACE FUNCTION promote_learning_to_knowledge(p_learning_id uuid)
RETURNS void AS $$
DECLARE
  v_learning record;
BEGIN
  SELECT * INTO v_learning FROM brain_learnings WHERE id = p_learning_id;

  IF v_learning IS NULL THEN
    RAISE EXCEPTION 'Learning not found';
  END IF;

  INSERT INTO brain_knowledge (category, key, value, project_id, added_by, confidence, source_bot)
  VALUES (
    'lesson',
    v_learning.title,
    v_learning.description,
    v_learning.project_id,
    v_learning.bot_id,
    v_learning.confidence,
    v_learning.bot_id
  );

  UPDATE brain_learnings SET promoted_to_knowledge = true WHERE id = p_learning_id;
END;
$$ LANGUAGE plpgsql;


-- Function: Auto-create knowledge from mistake prevention rule
CREATE OR REPLACE FUNCTION create_prevention_rule(p_mistake_id uuid)
RETURNS void AS $$
DECLARE
  v_mistake record;
  v_knowledge_id uuid;
BEGIN
  SELECT * INTO v_mistake FROM brain_mistakes WHERE id = p_mistake_id AND prevention_rule IS NOT NULL;

  IF v_mistake IS NULL THEN
    RAISE EXCEPTION 'Mistake not found or has no prevention rule';
  END IF;

  INSERT INTO brain_knowledge (category, key, value, project_id, added_by, confidence, source_bot, source_mistake_id)
  VALUES (
    'rule',
    'PREVENT: ' || v_mistake.title,
    v_mistake.prevention_rule,
    v_mistake.project_id,
    v_mistake.bot_id,
    0.95,
    v_mistake.bot_id,
    v_mistake.id
  )
  RETURNING id INTO v_knowledge_id;

  UPDATE brain_mistakes SET resolved = true, resolved_at = now() WHERE id = p_mistake_id;
END;
$$ LANGUAGE plpgsql;


-- Function: Get unread notifications for a bot
CREATE OR REPLACE FUNCTION get_bot_notifications(p_bot_id text)
RETURNS SETOF brain_notifications AS $$
BEGIN
  RETURN QUERY
    SELECT * FROM brain_notifications
    WHERE to_bot = p_bot_id
      AND read = false
      AND (expires_at IS NULL OR expires_at > now())
    ORDER BY
      CASE priority WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 WHEN 'low' THEN 2 END,
      created_at DESC;
END;
$$ LANGUAGE plpgsql;


-- Function: Get new learnings a bot hasn't seen yet
CREATE OR REPLACE FUNCTION get_new_learnings(p_bot_id text)
RETURNS SETOF brain_learnings AS $$
BEGIN
  RETURN QUERY
    SELECT * FROM brain_learnings
    WHERE NOT (p_bot_id = ANY(acknowledged_by))
    ORDER BY created_at DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;


-- Function: Acknowledge learnings (bot has absorbed them)
CREATE OR REPLACE FUNCTION acknowledge_learnings(p_bot_id text, p_learning_ids uuid[])
RETURNS void AS $$
BEGIN
  UPDATE brain_learnings
  SET acknowledged_by = array_append(acknowledged_by, p_bot_id)
  WHERE id = ANY(p_learning_ids)
    AND NOT (p_bot_id = ANY(acknowledged_by));
END;
$$ LANGUAGE plpgsql;


-- Function: Calculate bot score for a period
CREATE OR REPLACE FUNCTION calculate_bot_score(
  p_bot_id text,
  p_start date,
  p_end date
) RETURNS numeric AS $$
DECLARE
  v_completion_rate numeric;
  v_bug_rate numeric;
  v_knowledge_score numeric;
  v_total numeric;
BEGIN
  -- Completion rate (40% weight)
  SELECT COALESCE(
    COUNT(*) FILTER (WHERE status = 'completed')::numeric /
    NULLIF(COUNT(*), 0), 0
  ) INTO v_completion_rate
  FROM brain_tasks
  WHERE assigned_to = p_bot_id
    AND created_at >= p_start
    AND created_at < p_end + 1;

  -- Bug rate inverted (30% weight) — fewer bugs = higher score
  SELECT 1.0 - COALESCE(
    COUNT(*)::numeric /
    NULLIF((SELECT COUNT(*) FROM brain_tasks WHERE assigned_to = p_bot_id AND created_at >= p_start AND created_at < p_end + 1), 0), 0
  ) INTO v_bug_rate
  FROM brain_mistakes
  WHERE bot_id = p_bot_id
    AND created_at >= p_start
    AND created_at < p_end + 1;

  -- Knowledge contribution (30% weight)
  SELECT LEAST(
    COUNT(*)::numeric / 5.0, 1.0  -- cap at 5 contributions for full score
  ) INTO v_knowledge_score
  FROM brain_learnings
  WHERE bot_id = p_bot_id
    AND created_at >= p_start
    AND created_at < p_end + 1;

  v_total := (v_completion_rate * 0.4) + (COALESCE(v_bug_rate, 1.0) * 0.3) + (v_knowledge_score * 0.3);

  RETURN ROUND(v_total * 100, 1);  -- return as percentage
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 14. SEED INITIAL SCHEDULES (autonomous work)
-- ============================================================

INSERT INTO brain_schedules (assigned_to, project_id, title, description, cron_expression, enabled, bot_id)
VALUES
  ('botskii', 'cardledger', 'Price Data Refresh', 'Refresh product prices from PriceCharting API for all 11K+ products', '0 */6 * * *', true, 'botskii'),
  ('botskii', 'cardledger', 'Portfolio Snapshots', 'Run record_all_snapshots for daily portfolio value tracking', '0 0 * * *', true, 'botskii'),
  ('vantixhq', null, 'Full Test Suite', 'Run automated tests on all active projects (CardLedger, J4K, MixzoKickz)', '0 2 * * *', true, 'vantixhq'),
  ('vantixhq', null, 'Security Audit', 'Check for exposed keys, outdated deps, and security issues across all repos', '0 6 * * *', true, 'vantixhq'),
  ('vantixhq', null, 'Weekly Competitor Check', 'Analyze Card Ladder, Collectr, and other competitors for new features', '0 8 * * 1', true, 'vantixhq'),
  ('vantixhq', null, 'Weekly Retro Generator', 'Generate weekly retrospective from brain data and post to group chat', '0 9 * * 0', true, 'vantixhq'),
  ('vantixhq', null, 'Bot Scorecard', 'Calculate and log weekly performance scores for all bots', '0 9 * * 0', true, 'vantixhq'),
  ('denver', null, 'Code Quality Scan', 'Scan all projects for unused imports, dead code, inconsistent styling', '0 4 * * *', true, 'denver'),
  ('vantix', null, 'Dependency Audit', 'Check all projects for outdated npm packages and known vulnerabilities', '0 5 * * 1', true, 'vantix')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 15. KNOWLEDGE RULES FOR HIVE MIND PROTOCOL
-- ============================================================

INSERT INTO brain_knowledge (category, key, value, added_by, confidence)
VALUES
  ('rule', 'Hive Mind Protocol', 'ALL bots MUST on every heartbeat: 1) Pull get_new_learnings(bot_id) and acknowledge them, 2) Check get_bot_notifications(bot_id) for messages, 3) Check brain_schedules for due tasks, 4) Check brain_initiatives for approved work. This is the hive mind sync loop.', 'vantixhq', 1.0),
  ('rule', 'Mistake Logging Required', 'When a bot encounters an error and fixes it, they MUST log it to brain_mistakes with root_cause, fix_applied, and prevention_rule. The prevention rule auto-becomes brain_knowledge for the whole hive.', 'vantixhq', 1.0),
  ('rule', 'Initiative Autonomy Levels', 'LOW risk initiatives (code cleanup, tests, docs, perf) = auto-approved, just do it. MEDIUM risk (UI changes, refactors) = Vix approves. HIGH risk (billing, auth, data, external actions) = Aidan or Kyle must approve.', 'vantixhq', 1.0),
  ('rule', 'Knowledge Before Coding', 'Before starting ANY coding task, bot MUST query brain_knowledge for the project AND check brain_mistakes for related past errors. Skipping this step = automatic mistake entry.', 'vantixhq', 1.0),
  ('rule', 'Learning Sharing Required', 'When a bot discovers something useful (better approach, gotcha, optimization), they MUST post to brain_learnings immediately. Hoarding knowledge = lower bot score.', 'vantixhq', 1.0)
ON CONFLICT DO NOTHING;


-- ============================================================
-- DONE! Brain V2 Hive Mind is ready.
-- ============================================================
-- New tables: 9 (brain_learnings, brain_mistakes, brain_bot_scores,
--   brain_test_results, brain_initiatives, brain_incidents,
--   brain_sprints, brain_notifications, brain_reviews, brain_schedules)
-- Upgraded tables: 2 (brain_knowledge + brain_tasks with new columns)
-- New functions: 6 (promote_learning, create_prevention_rule,
--   get_bot_notifications, get_new_learnings, acknowledge_learnings,
--   calculate_bot_score)
-- Seeded: 9 autonomous schedules + 5 hive mind protocol rules
-- ============================================================
