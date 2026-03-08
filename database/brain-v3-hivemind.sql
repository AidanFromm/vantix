-- ═══════════════════════════════════════════════════════════════════
-- ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗██╗  ██╗
-- ██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║╚██╗██╔╝
-- ██║   ██║███████║██╔██╗ ██║   ██║   ██║ ╚███╔╝ 
-- ╚██╗ ██╔╝██╔══██║██║╚██╗██║   ██║   ██║ ██╔██╗ 
--  ╚████╔╝ ██║  ██║██║ ╚████║   ██║   ██║██╔╝ ██╗
--   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝
--           H I V E M I N D   B R A I N   V 3
-- ═══════════════════════════════════════════════════════════════════
-- Version: 3.0
-- Purpose: Multi-agent hivemind for Vantix LLC
-- Architecture: Theory of Mind + Dependency Enforcement + Activity Stream
-- Informed by: ArXiv 2603.00142 (ToM in MAS), Agent Architecture Framework
-- Supabase: obprrtqyzpaudfeyftyd
-- ═══════════════════════════════════════════════════════════════════
--
-- WHAT'S NEW IN V3 (vs V2 Ultimate):
-- 1. ACTIVITY STREAM (brain_stream) — unified feed of ALL company activity
-- 2. CHAT LOGGING (brain_conversations) — every human/bot conversation summarized
-- 3. DEPENDENCY ENFORCEMENT — tasks can't start until deps are done (function enforced)
-- 4. THEORY OF MIND (brain_beliefs) — bots track what other bots/humans know
-- 5. LEARNING LOOP (brain_mistakes + brain_retros) — learn from failures automatically
-- 6. SKILL REGISTRY (brain_skills) — what each bot can do, with proficiency scores
-- 7. SMART ROUTING — assign tasks to best-fit bot based on skills + load
-- 8. KNOWLEDGE GRAPH (brain_knowledge_links) — connect related knowledge
-- 9. RECURRING REVENUE TRACKING — proper MRR/ARR with churn detection
-- 10. VA TRACKING (brain_va_activity) — monitor human VA work
--
-- MIGRATION STRATEGY: This is ADDITIVE. It adds new tables and upgrades
-- existing ones without dropping what's already populated. Run this on top
-- of the existing schema.
-- ═══════════════════════════════════════════════════════════════════


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  1. ACTIVITY STREAM — The Pulse of the Company               ║
-- ║  Every meaningful thing that happens, in one feed             ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- The single most important table. Every bot writes here.
-- Any bot can query: "What happened today?" "What did Denver do?" "Any client updates?"
CREATE TABLE IF NOT EXISTS brain_stream (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts timestamptz DEFAULT now() NOT NULL,
  
  -- WHO
  actor_type text NOT NULL CHECK (actor_type IN ('bot', 'human', 'va', 'system', 'client')),
  actor_id text NOT NULL, -- bot_id, human_id, 'arjhay', 'system', client_id
  
  -- WHAT
  event_type text NOT NULL, -- see below for taxonomy
  title text NOT NULL,
  details text, -- longer description, markdown OK
  
  -- CONTEXT
  project_id text, -- null = company-wide
  client_id text, -- null if not client-related
  task_id uuid, -- link to brain_queue if task-related
  
  -- METADATA
  tags text[] DEFAULT '{}',
  importance text DEFAULT 'normal' CHECK (importance IN ('low', 'normal', 'high', 'critical')),
  
  -- For chat summaries
  chat_source text, -- 'telegram', 'slack', 'email', etc.
  chat_group_id text, -- which chat/group this came from
  
  -- Dedup
  idempotency_key text UNIQUE -- prevent double-logging
);

-- Event type taxonomy:
-- WORK: 'commit', 'deploy', 'build', 'test', 'review', 'fix'
-- TASK: 'task_created', 'task_started', 'task_completed', 'task_blocked', 'task_failed'
-- CLIENT: 'client_message', 'client_feedback', 'client_payment', 'client_request'
-- TEAM: 'chat_summary', 'decision', 'handoff', 'meeting_note', 'daily_standup'
-- KNOWLEDGE: 'learned', 'discovered', 'documented', 'mistake', 'retro'
-- SYSTEM: 'alert', 'incident', 'recovery', 'cron_run', 'health_check'
-- BUSINESS: 'lead_new', 'lead_updated', 'deal_won', 'deal_lost', 'invoice_sent', 'payment_received'
-- VA: 'va_task_assigned', 'va_task_completed', 'va_research', 'va_report'

CREATE INDEX IF NOT EXISTS idx_stream_ts ON brain_stream (ts DESC);
CREATE INDEX IF NOT EXISTS idx_stream_actor ON brain_stream (actor_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_stream_project ON brain_stream (project_id, ts DESC) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stream_type ON brain_stream (event_type, ts DESC);
CREATE INDEX IF NOT EXISTS idx_stream_importance ON brain_stream (importance, ts DESC) WHERE importance IN ('high', 'critical');
CREATE INDEX IF NOT EXISTS idx_stream_tags ON brain_stream USING gin (tags);


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  2. CONVERSATION LOG — Summarize Every Chat                  ║
-- ║  Bots summarize their chats so everyone stays informed       ║
-- ╚═══════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS brain_conversations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  
  -- Source
  bot_id text NOT NULL, -- which bot was in the conversation
  chat_platform text NOT NULL, -- 'telegram', 'discord', 'email', 'voice'
  chat_id text, -- platform-specific chat/group ID
  chat_name text, -- human-readable name
  
  -- Participants
  participants text[] NOT NULL, -- ['aidan', 'kyle', 'botskii']
  
  -- Content
  summary text NOT NULL, -- 3-5 sentence summary of what was discussed
  key_decisions text[], -- bullet points of decisions made
  action_items text[], -- things that need to happen
  topics text[], -- tags for what was discussed
  
  -- Links
  project_ids text[], -- which projects were discussed
  task_ids uuid[], -- related tasks
  
  -- Raw message count (not content — just volume indicator)
  message_count integer,
  time_span_minutes integer
);

CREATE INDEX IF NOT EXISTS idx_convos_bot ON brain_conversations (bot_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_convos_topics ON brain_conversations USING gin (topics);


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  3. THEORY OF MIND — What Does Each Agent Know?              ║
-- ║  Track beliefs about other agents' knowledge state           ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Each bot maintains beliefs about what others know.
-- This prevents: "Hey did you know X?" when everyone already knows X.
-- And enables: "Denver doesn't know about the MixzoKickz deploy, I should tell them."
CREATE TABLE IF NOT EXISTS brain_beliefs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  -- Who believes what about whom
  believer_id text NOT NULL, -- the bot forming the belief
  subject_id text NOT NULL, -- who the belief is ABOUT
  
  -- The belief
  topic text NOT NULL, -- 'mixzokickz_deploy_v2', 'kyle_wants_light_theme', etc.
  belief text NOT NULL, -- what we think they know/want/plan
  confidence decimal(3,2) DEFAULT 0.50, -- 0.00 to 1.00
  
  -- Lifecycle
  formed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  invalidated_at timestamptz, -- set when proven wrong
  
  -- Evidence
  evidence text, -- why we believe this
  source_stream_id bigint, -- link to brain_stream event that formed this belief
  
  UNIQUE(believer_id, subject_id, topic)
);

CREATE INDEX IF NOT EXISTS idx_beliefs_active ON brain_beliefs (believer_id, subject_id) 
  WHERE invalidated_at IS NULL;


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  4. SKILL REGISTRY — Who Can Do What                         ║
-- ║  Used for smart task routing                                  ║
-- ╚═══════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS brain_skills (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  bot_id text NOT NULL,
  skill_name text NOT NULL, -- 'nextjs', 'react', 'python', 'design', 'seo', 'copywriting', 'devops'
  proficiency integer DEFAULT 5 CHECK (proficiency BETWEEN 1 AND 10), -- 1=novice, 10=expert
  tasks_completed integer DEFAULT 0, -- auto-incremented on task completion
  avg_quality decimal(3,1), -- average review score for this skill
  last_used_at timestamptz,
  notes text, -- "learned Stripe integration on MixzoKickz project"
  UNIQUE(bot_id, skill_name)
);

-- Seed initial skills
INSERT INTO brain_skills (bot_id, skill_name, proficiency, notes) VALUES
  ('botskii', 'react', 9, 'Built CardLedger, Vantix dashboard, J4K'),
  ('botskii', 'nextjs', 9, 'Built MixzoKickz, SecuredTampa, Vantix landing'),
  ('botskii', 'typescript', 9, 'Primary language across all projects'),
  ('botskii', 'supabase', 9, 'Auth, RLS, edge functions, migrations'),
  ('botskii', 'tailwindcss', 9, 'All projects use Tailwind'),
  ('botskii', 'design', 8, 'UI Bible built, Quattro-inspired redesigns'),
  ('botskii', 'python', 7, 'Sports bots, scripting'),
  ('botskii', 'seo', 6, 'SEO playbook built, learning'),
  ('botskii', 'devops', 7, 'Vercel, DigitalOcean, SSH, PM2'),
  ('botskii', 'stripe', 8, 'MixzoKickz live payments'),
  ('botskii', 'replicate', 7, 'Image gen, AI design tools'),
  ('botskii', 'copywriting', 6, 'Landing pages, cold emails'),
  ('denver', 'react', 9, NULL),
  ('denver', 'nextjs', 9, NULL),
  ('denver', 'typescript', 9, NULL),
  ('denver', 'supabase', 8, NULL),
  ('denver', 'design', 8, NULL),
  ('denver', 'devops', 8, 'Mac Mini M4, better hardware'),
  ('vantixhq', 'react', 8, NULL),
  ('vantixhq', 'nextjs', 8, NULL),
  ('vantixhq', 'research', 8, 'Kyle uses for business research')
ON CONFLICT (bot_id, skill_name) DO UPDATE SET 
  proficiency = EXCLUDED.proficiency,
  notes = COALESCE(EXCLUDED.notes, brain_skills.notes);


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  5. DEPENDENCY ENFORCEMENT — Tasks Can't Jump the Queue      ║
-- ║  Task B blocked until Task A completes                       ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Add depends_on to brain_queue if not exists
DO $$ BEGIN
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS depends_on uuid[];
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS required_skills text[];
EXCEPTION WHEN others THEN NULL;
END $$;

-- Function: Can this task be started? (checks all dependencies are done)
CREATE OR REPLACE FUNCTION brain_can_start_task(p_task_id uuid) RETURNS boolean AS $$
DECLARE
  v_deps uuid[];
  v_blocked integer;
BEGIN
  SELECT depends_on INTO v_deps FROM brain_queue WHERE id = p_task_id;
  
  -- No dependencies = can start
  IF v_deps IS NULL OR array_length(v_deps, 1) IS NULL THEN
    RETURN true;
  END IF;
  
  -- Count incomplete dependencies
  SELECT COUNT(*) INTO v_blocked
  FROM brain_queue
  WHERE id = ANY(v_deps) AND status != 'done';
  
  RETURN v_blocked = 0;
END;
$$ LANGUAGE plpgsql;

-- Enhanced task claiming with dependency check
CREATE OR REPLACE FUNCTION brain_claim_task_v3(p_bot_id text, p_task_id uuid) RETURNS jsonb AS $$
DECLARE
  v_can_start boolean;
  v_task record;
BEGIN
  -- Check dependencies first
  SELECT brain_can_start_task(p_task_id) INTO v_can_start;
  IF NOT v_can_start THEN
    RETURN jsonb_build_object('success', false, 'reason', 'dependencies_not_met');
  END IF;
  
  -- Check not already claimed
  SELECT * INTO v_task FROM brain_queue WHERE id = p_task_id;
  IF v_task.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'task_not_pending', 'status', v_task.status);
  END IF;
  
  -- Claim it
  UPDATE brain_queue 
  SET assigned_to = p_bot_id, status = 'claimed', claimed_at = now()
  WHERE id = p_task_id AND status = 'pending';
  
  IF FOUND THEN
    -- Log to stream
    INSERT INTO brain_stream (actor_type, actor_id, event_type, title, task_id, project_id, importance)
    VALUES ('bot', p_bot_id, 'task_started', 'Claimed: ' || v_task.title, p_task_id, v_task.project_id, 'normal');
    
    RETURN jsonb_build_object('success', true, 'task', v_task.title);
  ELSE
    RETURN jsonb_build_object('success', false, 'reason', 'claim_failed');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Complete task + auto-update skills
CREATE OR REPLACE FUNCTION brain_complete_task_v3(
  p_bot_id text, 
  p_task_id uuid, 
  p_result text,
  p_quality_score integer DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_task record;
  v_skill text;
BEGIN
  SELECT * INTO v_task FROM brain_queue WHERE id = p_task_id AND assigned_to = p_bot_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_your_task');
  END IF;
  
  -- Complete the task
  UPDATE brain_queue SET 
    status = 'done', 
    result = p_result, 
    completed_at = now(),
    actual_minutes = EXTRACT(EPOCH FROM (now() - claimed_at))::int / 60
  WHERE id = p_task_id;
  
  -- Update skill usage stats
  IF v_task.required_skills IS NOT NULL THEN
    FOREACH v_skill IN ARRAY v_task.required_skills LOOP
      INSERT INTO brain_skills (bot_id, skill_name, tasks_completed, last_used_at)
      VALUES (p_bot_id, v_skill, 1, now())
      ON CONFLICT (bot_id, skill_name) 
      DO UPDATE SET tasks_completed = brain_skills.tasks_completed + 1, last_used_at = now();
    END LOOP;
  END IF;
  
  -- Log to stream
  INSERT INTO brain_stream (actor_type, actor_id, event_type, title, details, task_id, project_id)
  VALUES ('bot', p_bot_id, 'task_completed', 'Done: ' || v_task.title, p_result, p_task_id, v_task.project_id);
  
  -- Check if this unblocks other tasks
  -- (just log it — bots will pick up unblocked tasks on next check)
  IF EXISTS (SELECT 1 FROM brain_queue WHERE p_task_id = ANY(depends_on) AND status = 'pending') THEN
    INSERT INTO brain_stream (actor_type, actor_id, event_type, title, importance)
    VALUES ('system', 'brain', 'alert', 'Tasks unblocked by completion of: ' || v_task.title, 'high');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'minutes', EXTRACT(EPOCH FROM (now() - v_task.claimed_at))::int / 60);
END;
$$ LANGUAGE plpgsql;


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  6. LEARNING LOOP — Get Smarter Over Time                    ║
-- ║  Track mistakes, run retros, build prevention rules          ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- What went wrong
CREATE TABLE IF NOT EXISTS brain_mistakes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  bot_id text NOT NULL,
  project_id text,
  
  -- What happened
  category text NOT NULL, -- 'bug_shipped', 'wrong_approach', 'miscommunication', 'data_loss', 'downtime', 'wasted_time', 'scope_creep'
  title text NOT NULL,
  what_happened text NOT NULL,
  root_cause text,
  
  -- Impact
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  time_wasted_minutes integer,
  
  -- Prevention
  lesson_learned text,
  prevention_rule text, -- gets added to brain_knowledge as a 'rule'
  
  -- Link to related context
  stream_ids bigint[], -- related brain_stream events
  resolved boolean DEFAULT false
);

-- Retrospectives — periodic team reflection
CREATE TABLE IF NOT EXISTS brain_retros (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  
  -- Generated by any bot, reviewing the period
  author_bot text NOT NULL,
  
  -- Retro content
  what_went_well text[] NOT NULL,
  what_went_wrong text[] NOT NULL,
  action_items text[] NOT NULL,
  
  -- Metrics for the period
  tasks_completed integer,
  tasks_failed integer,
  revenue_earned decimal(10,2),
  incidents integer,
  avg_task_minutes decimal(8,2),
  
  -- Knowledge generated
  new_rules text[], -- rules to add to brain_knowledge
  new_playbooks text[] -- playbooks to create/update
);


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  7. SMART TASK ROUTING — Assign to Best-Fit Bot              ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Given required skills and current load, find the best bot
CREATE OR REPLACE FUNCTION brain_best_bot_for_task(
  p_required_skills text[],
  p_project_id text DEFAULT NULL
) RETURNS TABLE(bot_id text, score numeric, reason text) AS $$
BEGIN
  RETURN QUERY
  WITH bot_load AS (
    SELECT q.assigned_to as bid, COUNT(*) as active_tasks
    FROM brain_queue q
    WHERE q.status IN ('claimed', 'in_progress')
    GROUP BY q.assigned_to
  ),
  bot_skill_match AS (
    SELECT s.bot_id as bid,
      AVG(s.proficiency)::numeric as avg_skill,
      COUNT(*)::numeric / GREATEST(array_length(p_required_skills, 1), 1) as coverage
    FROM brain_skills s
    WHERE s.skill_name = ANY(p_required_skills)
    GROUP BY s.bot_id
  ),
  project_exp AS (
    SELECT c.bot_id as bid, COUNT(*) as project_familiarity
    FROM brain_context c
    WHERE c.project_id = p_project_id AND p_project_id IS NOT NULL
    GROUP BY c.bot_id
  )
  SELECT 
    b.id,
    ROUND(
      COALESCE(sm.avg_skill, 0) * 3 -- skill match (0-30)
      + COALESCE(sm.coverage, 0) * 20 -- skill coverage (0-20)
      + COALESCE(pe.project_familiarity, 0)::numeric * 0.5 -- familiarity (0-∞)
      - COALESCE(bl.active_tasks, 0)::numeric * 5 -- load penalty
    , 1) as score,
    format('skills:%s load:%s familiar:%s', 
      COALESCE(sm.avg_skill, 0)::int,
      COALESCE(bl.active_tasks, 0),
      COALESCE(pe.project_familiarity, 0))
  FROM brain_bots b
  LEFT JOIN bot_skill_match sm ON sm.bid = b.id
  LEFT JOIN bot_load bl ON bl.bid = b.id
  LEFT JOIN project_exp pe ON pe.bid = b.id
  WHERE b.status = 'online'
  ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  8. VA TRACKING — Human Assistant Monitoring                  ║
-- ╚═══════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS brain_va_activity (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  va_name text NOT NULL, -- 'arjhay'
  
  -- What they did
  activity_type text NOT NULL, -- 'research', 'data_entry', 'outreach', 'testing', 'content', 'admin'
  title text NOT NULL,
  details text,
  
  -- Time tracking
  started_at timestamptz,
  duration_minutes integer,
  
  -- Output
  deliverable text, -- link/description of what was produced
  quality_rating integer CHECK (quality_rating BETWEEN 1 AND 5), -- rated by bot or human
  
  -- Context
  project_id text,
  assigned_by text -- who gave them this task
);


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  9. KNOWLEDGE GRAPH — Connect Related Knowledge              ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Links between knowledge entries, projects, clients, etc.
CREATE TABLE IF NOT EXISTS brain_knowledge_links (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  -- Source → Target (directional)
  source_type text NOT NULL, -- 'knowledge', 'project', 'client', 'skill', 'mistake'
  source_id text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  
  -- Relationship
  relationship text NOT NULL, -- 'relates_to', 'depends_on', 'caused_by', 'learned_from', 'applies_to', 'supersedes'
  strength decimal(3,2) DEFAULT 0.50, -- how strong the connection is
  
  created_by text,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(source_type, source_id, target_type, target_id, relationship)
);

CREATE INDEX IF NOT EXISTS idx_knowledge_links_source ON brain_knowledge_links (source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_links_target ON brain_knowledge_links (target_type, target_id);


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  10. ENHANCED VIEWS — Smarter Queries                        ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Daily digest — what happened in the last 24 hours
CREATE OR REPLACE VIEW brain_daily_digest AS
SELECT 
  event_type,
  COUNT(*) as count,
  array_agg(title ORDER BY ts DESC) as items
FROM brain_stream
WHERE ts > now() - interval '24 hours'
GROUP BY event_type
ORDER BY count DESC;

-- Bot workload dashboard
CREATE OR REPLACE VIEW brain_bot_workload AS
SELECT 
  b.id,
  b.name,
  b.status,
  EXTRACT(EPOCH FROM (now() - b.last_seen_at))::int / 60 as minutes_since_seen,
  (SELECT COUNT(*) FROM brain_queue q WHERE q.assigned_to = b.id AND q.status IN ('claimed', 'in_progress')) as active_tasks,
  (SELECT COUNT(*) FROM brain_queue q WHERE q.assigned_to = b.id AND q.status = 'done' AND q.completed_at > now() - interval '24 hours') as completed_today,
  (SELECT string_agg(s.skill_name || ':' || s.proficiency, ', ' ORDER BY s.proficiency DESC) FROM brain_skills s WHERE s.bot_id = b.id AND s.proficiency >= 7) as top_skills
FROM brain_bots b
ORDER BY b.name;

-- Unblocked tasks ready to be claimed
CREATE OR REPLACE VIEW brain_available_tasks AS
SELECT q.*, p.name as project_name
FROM brain_queue q
LEFT JOIN brain_projects p ON q.project_id = p.id
WHERE q.status = 'pending'
  AND brain_can_start_task(q.id)
ORDER BY q.priority, q.created_at;

-- Knowledge search helper — most referenced knowledge
CREATE OR REPLACE VIEW brain_top_knowledge AS
SELECT k.id, k.category, k.key, k.value, k.tags,
  (SELECT COUNT(*) FROM brain_knowledge_links l 
   WHERE (l.source_type = 'knowledge' AND l.source_id = k.id::text)
   OR (l.target_type = 'knowledge' AND l.target_id = k.id::text)) as link_count
FROM brain_knowledge k
ORDER BY link_count DESC, k.updated_at DESC;

-- Client health — combining comms, financials, satisfaction
CREATE OR REPLACE VIEW brain_client_health AS
SELECT 
  c.id, c.name, c.company, c.satisfaction,
  c.lifetime_value,
  c.last_contact_at,
  EXTRACT(days FROM (now() - c.last_contact_at)) as days_since_contact,
  (SELECT COALESCE(SUM(f.amount), 0) FROM brain_financials f JOIN brain_projects p2 ON f.project_id = p2.id WHERE p2.client_id = c.id) as total_financial,
  (SELECT COUNT(*) FROM brain_incidents i JOIN brain_projects p ON i.project_id = p.id WHERE p.client_id = c.id AND i.status != 'resolved') as open_incidents,
  CASE 
    WHEN c.satisfaction = 'churning' THEN 'critical'
    WHEN c.last_contact_at < now() - interval '14 days' THEN 'at_risk'
    WHEN c.satisfaction = 'unhappy' THEN 'needs_attention'
    ELSE 'healthy'
  END as health_status
FROM brain_clients c;


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  11. ENHANCED FUNCTIONS — Smarter Operations                  ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Universal stream logger — call this from any bot
CREATE OR REPLACE FUNCTION brain_log(
  p_actor_type text,
  p_actor_id text,
  p_event_type text,
  p_title text,
  p_details text DEFAULT NULL,
  p_project_id text DEFAULT NULL,
  p_client_id text DEFAULT NULL,
  p_importance text DEFAULT 'normal',
  p_tags text[] DEFAULT '{}',
  p_idempotency_key text DEFAULT NULL
) RETURNS bigint AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO brain_stream (actor_type, actor_id, event_type, title, details, project_id, client_id, importance, tags, idempotency_key)
  VALUES (p_actor_type, p_actor_id, p_event_type, p_title, p_details, p_project_id, p_client_id, p_importance, p_tags, p_idempotency_key)
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Summarize conversations — bots call this after significant chats
CREATE OR REPLACE FUNCTION brain_log_conversation(
  p_bot_id text,
  p_platform text,
  p_chat_id text,
  p_chat_name text,
  p_participants text[],
  p_summary text,
  p_decisions text[] DEFAULT '{}',
  p_action_items text[] DEFAULT '{}',
  p_topics text[] DEFAULT '{}',
  p_project_ids text[] DEFAULT '{}',
  p_message_count integer DEFAULT 0
) RETURNS bigint AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO brain_conversations (bot_id, chat_platform, chat_id, chat_name, participants, summary, key_decisions, action_items, topics, project_ids, message_count)
  VALUES (p_bot_id, p_platform, p_chat_id, p_chat_name, p_participants, p_summary, p_decisions, p_action_items, p_topics, p_project_ids, p_message_count)
  RETURNING id INTO v_id;
  
  -- Also log to stream
  INSERT INTO brain_stream (actor_type, actor_id, event_type, title, details, tags, chat_source, chat_group_id)
  VALUES ('bot', p_bot_id, 'chat_summary', 'Chat: ' || p_chat_name, p_summary, p_topics, p_platform, p_chat_id);
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Log a mistake + auto-create knowledge rule
CREATE OR REPLACE FUNCTION brain_log_mistake(
  p_bot_id text,
  p_project_id text,
  p_category text,
  p_title text,
  p_what_happened text,
  p_root_cause text,
  p_lesson text,
  p_prevention_rule text DEFAULT NULL,
  p_severity text DEFAULT 'medium',
  p_time_wasted integer DEFAULT NULL
) RETURNS bigint AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO brain_mistakes (bot_id, project_id, category, title, what_happened, root_cause, lesson_learned, prevention_rule, severity, time_wasted_minutes)
  VALUES (p_bot_id, p_project_id, p_category, p_title, p_what_happened, p_root_cause, p_lesson, p_prevention_rule, p_severity, p_time_wasted)
  RETURNING id INTO v_id;
  
  -- Auto-create prevention rule in knowledge base
  IF p_prevention_rule IS NOT NULL THEN
    INSERT INTO brain_knowledge (category, key, value, project_id, added_by, tags)
    VALUES ('rule', 'Prevention: ' || p_title, p_prevention_rule, p_project_id, p_bot_id, ARRAY['auto-generated', 'from-mistake'])
    ON CONFLICT (category, key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  END IF;
  
  -- Log to stream
  INSERT INTO brain_stream (actor_type, actor_id, event_type, title, details, project_id, importance)
  VALUES ('bot', p_bot_id, 'mistake', 'Mistake: ' || p_title, p_what_happened, p_project_id, 
    CASE p_severity WHEN 'critical' THEN 'critical' WHEN 'high' THEN 'high' ELSE 'normal' END);
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Enhanced heartbeat with activity summary
CREATE OR REPLACE FUNCTION brain_heartbeat_v3(
  p_bot_id text,
  p_status text DEFAULT 'online',
  p_current_task text DEFAULT NULL,
  p_project_id text DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_pending_messages integer;
  v_available_tasks integer;
  v_pending_handoffs integer;
  v_open_incidents integer;
BEGIN
  -- Update bot status
  UPDATE brain_bots SET last_seen_at = now(), status = p_status WHERE id = p_bot_id;
  
  -- Count things that need attention
  SELECT COUNT(*) INTO v_pending_messages FROM brain_messages WHERE to_bot = p_bot_id AND read = false;
  SELECT COUNT(*) INTO v_available_tasks FROM brain_queue WHERE status = 'pending' AND (assigned_to = p_bot_id OR assigned_to IS NULL);
  SELECT COUNT(*) INTO v_pending_handoffs FROM brain_handoffs WHERE (to_bot = p_bot_id OR to_bot IS NULL) AND status = 'pending';
  SELECT COUNT(*) INTO v_open_incidents FROM brain_incidents WHERE status != 'resolved';
  
  RETURN jsonb_build_object(
    'pending_messages', v_pending_messages,
    'available_tasks', v_available_tasks,
    'pending_handoffs', v_pending_handoffs,
    'open_incidents', v_open_incidents,
    'heartbeat_at', now()
  );
END;
$$ LANGUAGE plpgsql;

-- Weekly retro generator helper
CREATE OR REPLACE FUNCTION brain_retro_data(
  p_start date,
  p_end date
) RETURNS jsonb AS $$
BEGIN
  RETURN jsonb_build_object(
    'tasks_completed', (SELECT COUNT(*) FROM brain_queue WHERE completed_at BETWEEN p_start AND p_end AND status = 'done'),
    'tasks_failed', (SELECT COUNT(*) FROM brain_queue WHERE completed_at BETWEEN p_start AND p_end AND status = 'cancelled'),
    'deploys', (SELECT COUNT(*) FROM brain_deployments WHERE deployed_at BETWEEN p_start AND p_end),
    'incidents', (SELECT COUNT(*) FROM brain_incidents WHERE created_at BETWEEN p_start AND p_end),
    'mistakes', (SELECT COUNT(*) FROM brain_mistakes WHERE ts BETWEEN p_start AND p_end),
    'knowledge_added', (SELECT COUNT(*) FROM brain_knowledge WHERE updated_at BETWEEN p_start AND p_end),
    'revenue', (SELECT COALESCE(SUM(amount), 0) FROM brain_financials WHERE paid_date BETWEEN p_start AND p_end AND type = 'payment_received'),
    'conversations', (SELECT COUNT(*) FROM brain_conversations WHERE ts BETWEEN p_start AND p_end),
    'stream_events', (SELECT COUNT(*) FROM brain_stream WHERE ts BETWEEN p_start AND p_end),
    'top_events', (SELECT jsonb_agg(row_to_json(t)) FROM (
      SELECT event_type, COUNT(*) as cnt FROM brain_stream WHERE ts BETWEEN p_start AND p_end GROUP BY event_type ORDER BY cnt DESC LIMIT 5
    ) t)
  );
END;
$$ LANGUAGE plpgsql;


-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  12. ROW LEVEL SECURITY                                       ║
-- ╚═══════════════════════════════════════════════════════════════╝

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'brain_stream', 'brain_conversations', 'brain_beliefs', 'brain_skills',
    'brain_mistakes', 'brain_retros', 'brain_va_activity', 'brain_knowledge_links'
  ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_%s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "allow_all_%s" ON %I FOR ALL USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════════
-- BRAIN V3 HIVEMIND COMPLETE
-- 
-- NEW TABLES: 7 (stream, conversations, beliefs, skills, mistakes,
--                retros, va_activity, knowledge_links)
-- NEW VIEWS: 5 (daily_digest, bot_workload, available_tasks,
--               top_knowledge, client_health)
-- NEW FUNCTIONS: 7 (brain_log, brain_log_conversation, brain_log_mistake,
--                   brain_heartbeat_v3, brain_retro_data,
--                   brain_claim_task_v3, brain_complete_task_v3,
--                   brain_can_start_task, brain_best_bot_for_task)
--
-- ADDITIVE: Does not drop existing tables. Safe to run on live DB.
--
-- BOT PROTOCOL (every session):
-- 1. brain_heartbeat_v3(bot_id) → get pending items count
-- 2. Check brain_messages for unread
-- 3. Check brain_available_tasks for work
-- 4. Log ALL significant actions to brain_log()
-- 5. Summarize chats with brain_log_conversation()
-- 6. Log mistakes with brain_log_mistake() → auto-creates rules
-- 7. End session: brain_heartbeat_v3(bot_id, 'idle')
-- ═══════════════════════════════════════════════════════════════
