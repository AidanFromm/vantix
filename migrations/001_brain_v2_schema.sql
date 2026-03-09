-- ============================================================
-- VANTIX BRAIN V2 — Complete Schema Upgrade
-- Run against: obprrtqyzpaudfeyftyd.supabase.co
-- Date: 2026-03-09
-- Author: VantixHQ (Vix)
-- ============================================================

-- Enable required extensions (vector and pg_cron must be enabled in Supabase Dashboard first)
-- Go to Database → Extensions → enable "vector", "pg_cron", "pg_net" if not already
-- Vector extension: enable in Dashboard > Database > Extensions > search "vector" > Enable
-- Then run: CREATE EXTENSION IF NOT EXISTS vector;
-- Embeddings columns will be added separately after vector is enabled
DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS vector; EXCEPTION WHEN others THEN RAISE NOTICE 'vector extension not available - embeddings skipped'; END $$;
-- pg_cron and pg_net are managed extensions — enable via Dashboard > Database > Extensions
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- ENSURE CORE TABLES EXIST (in case they were never created)
-- ============================================================
CREATE TABLE IF NOT EXISTS brain_projects (
  id text PRIMARY KEY,
  name text,
  client_id text,
  repo text,
  repo_remotes jsonb,
  website text,
  supabase_url text,
  supabase_ref text,
  vercel_project text,
  tech_stack text[],
  framework text,
  deploy_platform text,
  status text DEFAULT 'active',
  brand_colors jsonb,
  brand_rules text,
  setup_instructions text,
  important_files text,
  gotchas text,
  architecture_notes text,
  dependencies text,
  notes text,
  updated_by text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_knowledge (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text,
  key text,
  value text,
  project_id text,
  tags text[],
  added_by text,
  verified_by text,
  updated_at timestamptz DEFAULT now(),
  confidence numeric DEFAULT 0.5,
  times_used int DEFAULT 0,
  last_verified timestamptz,
  related_to text[],
  source_bot text,
  source_mistake_id uuid
);

CREATE TABLE IF NOT EXISTS brain_credentials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  service text,
  key_name text,
  key_value text,
  env_var text,
  environment text,
  notes text,
  added_by text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_decisions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  title text,
  decision text,
  reasoning text,
  category text,
  scope text,
  alternatives jsonb,
  decided_by text,
  stakeholders text[],
  decided_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  superseded_by uuid,
  reversal_reason text,
  expires_at timestamptz,
  reversible boolean DEFAULT true,
  impact_level text DEFAULT 'medium',
  related_task_id uuid,
  related_incident_id uuid,
  reference_urls text[],
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_discoveries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  category text,
  title text,
  details text,
  tags text[],
  verified boolean DEFAULT false,
  verified_by text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_chat_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  message text,
  update_type text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  description text,
  project_id text,
  requested_by text,
  assigned_to text,
  priority text DEFAULT 'medium',
  required_capabilities text[],
  status text DEFAULT 'pending',
  blockers text,
  result text,
  estimated_minutes int,
  actual_minutes int,
  created_at timestamptz DEFAULT now(),
  claimed_at timestamptz,
  completed_at timestamptz,
  due_by timestamptz,
  depends_on uuid,
  required_skills text[]
);

CREATE TABLE IF NOT EXISTS brain_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  title text,
  description text,
  assigned_to text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  created_by text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  deadline timestamptz,
  depends_on uuid,
  blocks uuid,
  verified_commit text,
  verified_at timestamptz,
  sla_hours int,
  escalated boolean DEFAULT false,
  auto_assign_next boolean DEFAULT false,
  estimated_hours numeric,
  actual_hours numeric,
  sprint_id text,
  review_status text,
  test_status text,
  initiative_id uuid
);

CREATE TABLE IF NOT EXISTS brain_handoffs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_bot text,
  to_bot text,
  project_id text,
  reason text,
  context text,
  files_involved text[],
  current_state text,
  what_needs_done text,
  status text DEFAULT 'pending',
  accepted_by text,
  accepted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_bot text,
  to_bot text,
  priority text DEFAULT 'normal',
  category text,
  title text,
  message text,
  action_required boolean DEFAULT false,
  read boolean DEFAULT false,
  read_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_bot text,
  to_bot text,
  message text,
  message_type text,
  priority text DEFAULT 'normal',
  related_task_id uuid,
  related_project text,
  read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_incidents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  title text,
  description text,
  severity text DEFAULT 'minor',
  category text,
  status text DEFAULT 'open',
  detected_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz,
  identified_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  time_to_acknowledge_min int,
  time_to_resolve_min int,
  detected_by text,
  assigned_to text,
  resolved_by text,
  root_cause text,
  root_cause_category text,
  affected_files text[],
  affected_users_estimate int,
  fix_description text,
  fix_commit text,
  fix_verified boolean DEFAULT false,
  rollback_required boolean DEFAULT false,
  postmortem text,
  action_items text[],
  learning_id uuid,
  revenue_impact numeric,
  downtime_minutes int,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_live (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  event_type text,
  message text,
  target_bot text,
  data jsonb,
  responded boolean DEFAULT false,
  response text,
  response_by text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_heartbeats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  status text,
  current_task text,
  blockers text,
  last_commit_sha text,
  project_id text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_bots (
  id text PRIMARY KEY,
  name text,
  machine text,
  owner text,
  status text DEFAULT 'offline',
  capabilities text[],
  specialties text[],
  telegram_handle text,
  model text,
  timezone text,
  last_seen_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_file_locks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  file_path text,
  reason text,
  locked_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  released_at timestamptz
);

CREATE TABLE IF NOT EXISTS brain_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  action text,
  target text,
  details text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE TABLE IF NOT EXISTS brain_context (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  bot_id text,
  context_type text,
  title text,
  details text,
  files_affected text[],
  importance text DEFAULT 'normal',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_memory_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  source text,
  summary text,
  decisions text[],
  preferences text[],
  action_items text[],
  people_mentioned text[],
  project_id text,
  session_context text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_session_context (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  session_date date,
  files_touched text[],
  key_decisions text[],
  fragile_areas text[],
  learned text[],
  handoff_notes text,
  context_type text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_learnings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  trigger_event text,
  trigger_category text,
  trigger_file text,
  trigger_commit text,
  lesson text,
  fix_applied text,
  prevention text,
  severity text DEFAULT 'medium',
  confidence numeric DEFAULT 0.5,
  times_applied int DEFAULT 0,
  times_helped int DEFAULT 0,
  last_applied_at timestamptz,
  tags text[],
  related_learning_ids uuid[],
  superseded_by uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_mistakes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  project_id text,
  error_type text,
  title text,
  description text,
  root_cause text,
  fix_applied text,
  prevention_rule text,
  severity text,
  commit_sha text,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_git_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  repo text,
  branch text,
  commit_sha text,
  commit_message text,
  author text,
  files_changed text[],
  task_id uuid,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_deployments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  bot_id text,
  platform text,
  environment text,
  commit_hash text,
  commit_message text,
  status text,
  url text,
  build_time_seconds int,
  changes_summary text,
  rollback_hash text,
  deployed_at timestamptz DEFAULT now(),
  pre_checks jsonb,
  build_passed boolean,
  env_clean boolean,
  rollback_sha text,
  deploy_url text,
  health_check_passed boolean,
  auto_rollback boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS brain_skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,
  skill_name text,
  proficiency int DEFAULT 5,
  tasks_completed int DEFAULT 0,
  avg_quality numeric,
  last_used_at timestamptz,
  notes text
);

CREATE TABLE IF NOT EXISTS brain_knowledge_graph (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  source_type text,
  source_name text,
  relationship text,
  target_type text,
  target_name text,
  notes text,
  discovered_by text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_stream (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  actor_type text,
  actor_id text,
  event_type text,
  title text,
  details text,
  project_id text,
  client_id text,
  task_id uuid,
  tags text[],
  importance text DEFAULT 'normal',
  chat_source text,
  chat_group_id text,
  idempotency_key text UNIQUE
);

CREATE TABLE IF NOT EXISTS brain_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text,
  author_bot text,
  reviewer_bot text,
  commit_hash text,
  files_changed text[],
  summary text,
  review_status text DEFAULT 'pending',
  review_notes text,
  issues_found jsonb,
  quality_score numeric,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

CREATE TABLE IF NOT EXISTS ai_daily_briefings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date,
  summary text,
  key_metrics jsonb,
  action_items jsonb,
  predictions jsonb,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- PHASE 1: EVENT-DRIVEN INFRASTRUCTURE
-- ============================================================

-- Notification function for realtime events
CREATE OR REPLACE FUNCTION notify_brain_event()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'record_id', NEW.id,
    'bot_id', COALESCE(NEW.bot_id, NEW.assigned_to, NEW.from_bot, NULL),
    'target_bot', CASE 
      WHEN TG_TABLE_NAME = 'brain_live' THEN NEW.target_bot
      WHEN TG_TABLE_NAME = 'brain_handoffs' THEN NEW.to_bot
      WHEN TG_TABLE_NAME = 'brain_queue' THEN NEW.assigned_to
      WHEN TG_TABLE_NAME = 'brain_tasks' THEN NEW.assigned_to
      WHEN TG_TABLE_NAME = 'brain_notifications' THEN NEW.to_bot
      WHEN TG_TABLE_NAME = 'brain_messages' THEN NEW.to_bot
      ELSE NULL
    END,
    'event_type', CASE
      WHEN TG_TABLE_NAME = 'brain_live' THEN NEW.event_type
      ELSE TG_OP
    END,
    'priority', CASE
      WHEN TG_TABLE_NAME = 'brain_queue' THEN NEW.priority
      WHEN TG_TABLE_NAME = 'brain_tasks' THEN NEW.priority
      WHEN TG_TABLE_NAME = 'brain_notifications' THEN NEW.priority
      ELSE NULL
    END,
    'project_id', COALESCE(NEW.project_id, NULL),
    'timestamp', NOW()
  );
  
  -- Notify on general channel
  PERFORM pg_notify('brain_events', payload::text);
  
  -- Notify on bot-specific channel if target exists
  IF payload->>'target_bot' IS NOT NULL THEN
    PERFORM pg_notify('bot_' || (payload->>'target_bot'), payload::text);
  END IF;
  
  -- Notify on high-priority channel
  IF COALESCE(payload->>'priority', '') IN ('critical', 'urgent', 'p0') THEN
    PERFORM pg_notify('brain_urgent', payload::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all key tables
DROP TRIGGER IF EXISTS brain_queue_notify ON brain_queue;
CREATE TRIGGER brain_queue_notify
  AFTER INSERT OR UPDATE ON brain_queue
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

DROP TRIGGER IF EXISTS brain_tasks_notify ON brain_tasks;
CREATE TRIGGER brain_tasks_notify
  AFTER INSERT OR UPDATE ON brain_tasks
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

DROP TRIGGER IF EXISTS brain_live_notify ON brain_live;
CREATE TRIGGER brain_live_notify
  AFTER INSERT ON brain_live
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

DROP TRIGGER IF EXISTS brain_handoffs_notify ON brain_handoffs;
CREATE TRIGGER brain_handoffs_notify
  AFTER INSERT ON brain_handoffs
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

DROP TRIGGER IF EXISTS brain_notifications_notify ON brain_notifications;
CREATE TRIGGER brain_notifications_notify
  AFTER INSERT ON brain_notifications
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

DROP TRIGGER IF EXISTS brain_messages_notify ON brain_messages;
CREATE TRIGGER brain_messages_notify
  AFTER INSERT ON brain_messages
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

DROP TRIGGER IF EXISTS brain_incidents_notify ON brain_incidents;
CREATE TRIGGER brain_incidents_notify
  AFTER INSERT ON brain_incidents
  FOR EACH ROW EXECUTE FUNCTION notify_brain_event();

-- Event dispatch log (tracks what was dispatched and delivery status)
CREATE TABLE IF NOT EXISTS brain_event_dispatch (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_source text NOT NULL,        -- table that triggered
  event_action text NOT NULL,        -- INSERT/UPDATE
  record_id text,
  target_bot text,
  channel text NOT NULL,             -- pg_notify channel used
  payload jsonb NOT NULL,
  dispatched_at timestamptz DEFAULT now(),
  delivered boolean DEFAULT false,
  delivered_at timestamptz,
  delivery_method text,              -- telegram, http, realtime
  error text
);

CREATE INDEX IF NOT EXISTS idx_event_dispatch_target ON brain_event_dispatch(target_bot, dispatched_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_dispatch_undelivered ON brain_event_dispatch(delivered) WHERE delivered = false;

-- ============================================================
-- PHASE 2: MEMORY INTELLIGENCE
-- ============================================================

-- Standard Operating Procedures (extracted from learnings)
CREATE TABLE IF NOT EXISTS brain_sops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,             -- deployment, debugging, client-onboarding, code-review, etc.
  description text,
  steps jsonb NOT NULL,               -- ordered array of step objects
  prerequisites text[],
  project_id text REFERENCES brain_projects(id),
  source_learnings uuid[],           -- brain_learnings IDs that formed this SOP
  source_mistakes uuid[],            -- brain_mistakes IDs
  version int DEFAULT 1,
  is_current boolean DEFAULT true,
  superseded_by uuid REFERENCES brain_sops(id),
  times_used int DEFAULT 0,
  last_used_at timestamptz,
  effectiveness_score numeric(3,2),   -- 0-1, tracked from outcomes
  tags text[],
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sops_category ON brain_sops(category) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_sops_project ON brain_sops(project_id) WHERE is_current = true;

-- Memory summaries (compressed from raw logs)
CREATE TABLE IF NOT EXISTS brain_memory_summaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  bot_id text,
  project_id text,
  summary text NOT NULL,
  key_facts text[],                   -- extracted bullet points
  decisions_made text[],
  lessons_learned text[],
  files_touched text[],
  tasks_completed uuid[],            -- brain_tasks IDs
  raw_entry_count int,               -- how many entries were summarized
  raw_entry_ids uuid[],              -- original brain_memory_log IDs
  embedding jsonb,            -- for semantic search
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memory_summaries_period ON brain_memory_summaries(period_start DESC, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_memory_summaries_bot ON brain_memory_summaries(bot_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_memory_summaries_project ON brain_memory_summaries(project_id, period_start DESC);

-- Add embedding columns to existing tables
DO $$ BEGIN
  ALTER TABLE brain_knowledge ADD COLUMN IF NOT EXISTS embedding jsonb;
  ALTER TABLE brain_knowledge ADD COLUMN IF NOT EXISTS last_accessed_at timestamptz;
  ALTER TABLE brain_knowledge ADD COLUMN IF NOT EXISTS access_count int DEFAULT 0;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add archival support to brain_memory_log
DO $$ BEGIN
  ALTER TABLE brain_memory_log ADD COLUMN IF NOT EXISTS archived_at timestamptz;
  ALTER TABLE brain_memory_log ADD COLUMN IF NOT EXISTS summary_id uuid REFERENCES brain_memory_summaries(id);
  ALTER TABLE brain_memory_log ADD COLUMN IF NOT EXISTS embedding jsonb;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add embedding to brain_sops
DO $$ BEGIN
  ALTER TABLE brain_sops ADD COLUMN IF NOT EXISTS embedding jsonb;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Knowledge access tracking trigger
CREATE OR REPLACE FUNCTION track_knowledge_access()
RETURNS trigger AS $$
BEGIN
  -- Track reads via a special function call
  UPDATE brain_knowledge 
  SET access_count = COALESCE(access_count, 0) + 1,
      last_accessed_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 3: QUEUE RESILIENCE + STATE MACHINE
-- ============================================================

-- Upgrade brain_queue with resilience fields
DO $$ BEGIN
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS retry_count int DEFAULT 0;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS max_retries int DEFAULT 3;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS last_error text;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS checkpoint_data jsonb;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS started_at timestamptz;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS timeout_minutes int DEFAULT 60;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS parent_task_id uuid;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS subtask_order int;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS failed_at timestamptz;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS execution_log jsonb DEFAULT '[]'::jsonb;
  ALTER TABLE brain_queue ADD COLUMN IF NOT EXISTS context_snapshot jsonb;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Upgrade brain_tasks with better tracking
DO $$ BEGIN
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS retry_count int DEFAULT 0;
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS checkpoint_data jsonb;
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS execution_log jsonb DEFAULT '[]'::jsonb;
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS time_estimate_minutes int;
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS actual_minutes int;
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS quality_score numeric(3,2);
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS verification_notes text;
  ALTER TABLE brain_tasks ADD COLUMN IF NOT EXISTS tags text[];
EXCEPTION WHEN others THEN NULL;
END $$;

-- Smart task claiming — matches bot capabilities to task requirements
CREATE OR REPLACE FUNCTION claim_task_smart(
  p_bot_id text,
  p_capabilities text[] DEFAULT '{}'
)
RETURNS jsonb AS $$
DECLARE
  v_task record;
  v_result jsonb;
BEGIN
  -- Find best matching unclaimed task
  SELECT q.* INTO v_task
  FROM brain_queue q
  WHERE q.status IN ('pending', 'queued')
    AND (q.assigned_to IS NULL OR q.assigned_to = p_bot_id)
    AND q.retry_count < q.max_retries
    AND (q.depends_on IS NULL OR NOT EXISTS (
      SELECT 1 FROM brain_queue dep 
      WHERE dep.id = q.depends_on 
      AND dep.status NOT IN ('done', 'completed')
    ))
  ORDER BY 
    CASE q.priority 
      WHEN 'critical' THEN 0 
      WHEN 'urgent' THEN 1
      WHEN 'p0' THEN 1
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      WHEN 'low' THEN 4 
      ELSE 5 
    END,
    q.created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  
  IF v_task IS NULL THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'no matching tasks available');
  END IF;
  
  -- Claim the task
  UPDATE brain_queue
  SET status = 'in_progress',
      assigned_to = p_bot_id,
      claimed_at = now(),
      started_at = now(),
      execution_log = COALESCE(execution_log, '[]'::jsonb) || jsonb_build_object(
        'event', 'claimed',
        'bot', p_bot_id,
        'at', now()::text
      )
  WHERE id = v_task.id;
  
  RETURN jsonb_build_object(
    'claimed', true,
    'task_id', v_task.id,
    'title', v_task.title,
    'description', v_task.description,
    'project_id', v_task.project_id,
    'priority', v_task.priority,
    'checkpoint_data', v_task.checkpoint_data,
    'retry_count', v_task.retry_count,
    'context_snapshot', v_task.context_snapshot
  );
END;
$$ LANGUAGE plpgsql;

-- Checkpoint a task mid-execution
CREATE OR REPLACE FUNCTION checkpoint_task(
  p_task_id uuid,
  p_checkpoint_data jsonb,
  p_bot_id text DEFAULT NULL
)
RETURNS jsonb AS $$
BEGIN
  UPDATE brain_queue
  SET checkpoint_data = p_checkpoint_data,
      execution_log = COALESCE(execution_log, '[]'::jsonb) || jsonb_build_object(
        'event', 'checkpoint',
        'bot', COALESCE(p_bot_id, assigned_to),
        'at', now()::text,
        'data_keys', (SELECT array_agg(key) FROM jsonb_object_keys(p_checkpoint_data) AS key)
      )
  WHERE id = p_task_id;
  
  RETURN jsonb_build_object('success', true, 'task_id', p_task_id);
END;
$$ LANGUAGE plpgsql;

-- Fail a task with retry logic
CREATE OR REPLACE FUNCTION fail_task(
  p_task_id uuid,
  p_error text,
  p_bot_id text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_task record;
BEGIN
  SELECT * INTO v_task FROM brain_queue WHERE id = p_task_id;
  
  IF v_task IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'task not found');
  END IF;
  
  IF v_task.retry_count + 1 >= v_task.max_retries THEN
    -- Max retries exceeded — mark as failed permanently
    UPDATE brain_queue
    SET status = 'failed',
        last_error = p_error,
        retry_count = retry_count + 1,
        failed_at = now(),
        execution_log = COALESCE(execution_log, '[]'::jsonb) || jsonb_build_object(
          'event', 'failed_permanent',
          'bot', COALESCE(p_bot_id, assigned_to),
          'error', p_error,
          'at', now()::text
        )
    WHERE id = p_task_id;
    
    -- Auto-create incident for failed tasks
    INSERT INTO brain_incidents (project_id, title, description, severity, category, status, detected_by, assigned_to)
    VALUES (
      v_task.project_id,
      'Task failed after ' || v_task.max_retries || ' retries: ' || v_task.title,
      'Error: ' || p_error || E'\nTask ID: ' || p_task_id || E'\nCheckpoint: ' || COALESCE(v_task.checkpoint_data::text, 'none'),
      CASE v_task.priority WHEN 'critical' THEN 'critical' WHEN 'high' THEN 'major' ELSE 'minor' END,
      'task_failure',
      'open',
      COALESCE(p_bot_id, 'system'),
      NULL
    );
    
    RETURN jsonb_build_object('success', true, 'retrying', false, 'reason', 'max retries exceeded', 'incident_created', true);
  ELSE
    -- Retry — reset for next attempt
    UPDATE brain_queue
    SET status = 'pending',
        last_error = p_error,
        retry_count = retry_count + 1,
        assigned_to = NULL,
        claimed_at = NULL,
        started_at = NULL,
        execution_log = COALESCE(execution_log, '[]'::jsonb) || jsonb_build_object(
          'event', 'retry',
          'bot', COALESCE(p_bot_id, assigned_to),
          'error', p_error,
          'retry_number', v_task.retry_count + 1,
          'at', now()::text
        )
    WHERE id = p_task_id;
    
    RETURN jsonb_build_object('success', true, 'retrying', true, 'retry_count', v_task.retry_count + 1);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Complete a task successfully
CREATE OR REPLACE FUNCTION complete_task(
  p_task_id uuid,
  p_result text DEFAULT NULL,
  p_bot_id text DEFAULT NULL,
  p_commit_sha text DEFAULT NULL
)
RETURNS jsonb AS $$
BEGIN
  UPDATE brain_queue
  SET status = 'done',
      result = p_result,
      completed_at = now(),
      actual_minutes = EXTRACT(EPOCH FROM (now() - COALESCE(started_at, claimed_at, created_at))) / 60,
      execution_log = COALESCE(execution_log, '[]'::jsonb) || jsonb_build_object(
        'event', 'completed',
        'bot', COALESCE(p_bot_id, assigned_to),
        'result', p_result,
        'commit_sha', p_commit_sha,
        'at', now()::text
      )
  WHERE id = p_task_id;
  
  -- Also update brain_tasks if linked
  UPDATE brain_tasks
  SET status = 'done',
      completed_at = now(),
      verified_commit = p_commit_sha
  WHERE id = p_task_id;
  
  RETURN jsonb_build_object('success', true, 'task_id', p_task_id);
END;
$$ LANGUAGE plpgsql;

-- Task timeout checker
CREATE OR REPLACE FUNCTION check_task_timeouts()
RETURNS jsonb AS $$
DECLARE
  v_count int := 0;
  v_task record;
BEGIN
  FOR v_task IN
    SELECT * FROM brain_queue
    WHERE status = 'in_progress'
    AND started_at IS NOT NULL
    AND started_at + (timeout_minutes || ' minutes')::interval < now()
  LOOP
    PERFORM fail_task(v_task.id, 'Task timed out after ' || v_task.timeout_minutes || ' minutes', 'system');
    v_count := v_count + 1;
  END LOOP;
  
  RETURN jsonb_build_object('timed_out_tasks', v_count);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 4: OBSERVABILITY + TOKEN TRACKING
-- ============================================================

-- API call logging
CREATE TABLE IF NOT EXISTS brain_api_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text NOT NULL,
  provider text NOT NULL,             -- claude, openai, brave, supabase, etc.
  model text,                         -- claude-3.5-sonnet, gpt-4, etc.
  endpoint text,                      -- /messages, /chat/completions, etc.
  prompt_tokens int,
  completion_tokens int,
  total_tokens int,
  cost_usd numeric(10,6),
  latency_ms int,
  status text,                        -- success, error, rate_limited, timeout
  error text,
  session_id text,
  project_id text,
  task_id uuid,
  metadata jsonb,                     -- extra context
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_logs_bot ON brain_api_logs(bot_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_project ON brain_api_logs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_provider ON brain_api_logs(provider, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_cost ON brain_api_logs(cost_usd DESC) WHERE cost_usd > 0;

-- Cost budgets per bot/project
CREATE TABLE IF NOT EXISTS brain_cost_budgets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text,                        -- NULL = all bots
  project_id text,                    -- NULL = all projects
  period text NOT NULL DEFAULT 'daily', -- daily, weekly, monthly
  budget_usd numeric(10,2) NOT NULL,
  spent_usd numeric(10,2) DEFAULT 0,
  alert_threshold_pct int DEFAULT 80,
  hard_limit boolean DEFAULT false,   -- if true, block requests over budget
  last_alert_at timestamptz,
  reset_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(bot_id, project_id, period)
);

-- Cost dashboard view
CREATE OR REPLACE VIEW brain_cost_dashboard AS
SELECT 
  bot_id,
  provider,
  model,
  project_id,
  date_trunc('day', created_at) AS day,
  COUNT(*) AS total_calls,
  SUM(prompt_tokens) AS total_prompt_tokens,
  SUM(completion_tokens) AS total_completion_tokens,
  SUM(total_tokens) AS total_tokens,
  SUM(cost_usd) AS total_cost_usd,
  AVG(latency_ms) AS avg_latency_ms,
  COUNT(*) FILTER (WHERE status = 'error') AS error_count,
  COUNT(*) FILTER (WHERE status = 'rate_limited') AS rate_limited_count
FROM brain_api_logs
GROUP BY bot_id, provider, model, project_id, date_trunc('day', created_at);

-- Token usage by bot (last 24h, 7d, 30d)
CREATE OR REPLACE VIEW brain_token_usage AS
SELECT 
  bot_id,
  SUM(total_tokens) FILTER (WHERE created_at > now() - interval '24 hours') AS tokens_24h,
  SUM(cost_usd) FILTER (WHERE created_at > now() - interval '24 hours') AS cost_24h,
  SUM(total_tokens) FILTER (WHERE created_at > now() - interval '7 days') AS tokens_7d,
  SUM(cost_usd) FILTER (WHERE created_at > now() - interval '7 days') AS cost_7d,
  SUM(total_tokens) FILTER (WHERE created_at > now() - interval '30 days') AS tokens_30d,
  SUM(cost_usd) FILTER (WHERE created_at > now() - interval '30 days') AS cost_30d,
  COUNT(*) FILTER (WHERE created_at > now() - interval '24 hours') AS calls_24h,
  AVG(latency_ms) FILTER (WHERE created_at > now() - interval '24 hours') AS avg_latency_24h
FROM brain_api_logs
GROUP BY bot_id;

-- ============================================================
-- PHASE 5: GIT INTELLIGENCE
-- ============================================================

-- Code ownership tracking
CREATE TABLE IF NOT EXISTS brain_code_ownership (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text NOT NULL REFERENCES brain_projects(id),
  file_path text NOT NULL,
  primary_owner text,                 -- bot_id who owns this file
  last_modified_by text,
  touch_count int DEFAULT 1,
  last_modified_at timestamptz DEFAULT now(),
  complexity_score numeric(5,2),      -- calculated from file analysis
  risk_score numeric(3,2),            -- how risky is this file to change
  dependencies text[],                -- files this depends on
  dependents text[],                  -- files that depend on this
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, file_path)
);

CREATE INDEX IF NOT EXISTS idx_code_ownership_project ON brain_code_ownership(project_id);
CREATE INDEX IF NOT EXISTS idx_code_ownership_owner ON brain_code_ownership(primary_owner);

-- Upgrade brain_git_events
DO $$ BEGIN
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS lines_added int;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS lines_deleted int;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS diff_summary text;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS build_status text;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS deploy_triggered boolean DEFAULT false;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS pr_number int;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS pr_status text;
  ALTER TABLE brain_git_events ADD COLUMN IF NOT EXISTS linked_task_ids uuid[];
EXCEPTION WHEN others THEN NULL;
END $$;

-- Auto-link git commits to tasks
CREATE OR REPLACE FUNCTION link_commit_to_tasks()
RETURNS trigger AS $$
DECLARE
  v_task_id uuid;
  v_task_ids uuid[] := '{}';
  v_match text;
BEGIN
  -- Parse task IDs from commit message patterns: [TASK-xxx], #xxx, task:xxx
  FOR v_match IN 
    SELECT (regexp_matches(NEW.commit_message, '\[?(?:TASK-|task:|#)([a-f0-9-]+)\]?', 'gi'))[1]
  LOOP
    BEGIN
      v_task_id := v_match::uuid;
      v_task_ids := array_append(v_task_ids, v_task_id);
      
      -- Update the task with the commit SHA
      UPDATE brain_tasks 
      SET verified_commit = NEW.commit_sha,
          status = CASE WHEN status = 'in_progress' THEN 'review' ELSE status END
      WHERE id = v_task_id;
    EXCEPTION WHEN others THEN
      -- Not a valid UUID, skip
      NULL;
    END;
  END LOOP;
  
  -- Store linked task IDs
  IF array_length(v_task_ids, 1) > 0 THEN
    NEW.linked_task_ids := v_task_ids;
  END IF;
  
  -- Update code ownership
  IF NEW.files_changed IS NOT NULL THEN
    DECLARE
      v_file text;
    BEGIN
      FOR v_file IN SELECT unnest(NEW.files_changed)
      LOOP
        INSERT INTO brain_code_ownership (project_id, file_path, primary_owner, last_modified_by, last_modified_at)
        VALUES (
          COALESCE((SELECT id FROM brain_projects WHERE repo LIKE '%' || split_part(NEW.repo, '/', 2) LIMIT 1), 'unknown'),
          v_file,
          NEW.author,
          NEW.author,
          now()
        )
        ON CONFLICT (project_id, file_path) DO UPDATE SET
          last_modified_by = NEW.author,
          touch_count = brain_code_ownership.touch_count + 1,
          last_modified_at = now(),
          primary_owner = CASE 
            WHEN brain_code_ownership.touch_count > 5 AND NEW.author != brain_code_ownership.primary_owner 
            THEN brain_code_ownership.primary_owner  -- keep existing owner if they have history
            ELSE NEW.author
          END;
      END LOOP;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS git_events_link ON brain_git_events;
CREATE TRIGGER git_events_link
  BEFORE INSERT ON brain_git_events
  FOR EACH ROW EXECUTE FUNCTION link_commit_to_tasks();

-- ============================================================
-- PHASE 6: INTELLIGENT TASK ROUTING
-- ============================================================

CREATE OR REPLACE FUNCTION route_task(
  p_title text,
  p_description text DEFAULT '',
  p_project_id text DEFAULT NULL,
  p_priority text DEFAULT 'medium',
  p_required_skills text[] DEFAULT '{}',
  p_requested_by text DEFAULT 'system',
  p_estimated_minutes int DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_best_bot text;
  v_task_id uuid;
  v_score numeric;
BEGIN
  -- Find best bot based on skills + workload + past performance
  SELECT s.bot_id, 
    (
      -- Skill match score (0-50 points)
      COALESCE((
        SELECT SUM(proficiency) 
        FROM brain_skills sk 
        WHERE sk.bot_id = s.bot_id 
        AND sk.skill_name = ANY(p_required_skills)
      ), 0) * 5
      +
      -- Availability score (0-30 points) — fewer active tasks = higher score
      (30 - LEAST(30, COALESCE((
        SELECT COUNT(*) FROM brain_queue q 
        WHERE q.assigned_to = s.bot_id 
        AND q.status = 'in_progress'
      ), 0) * 10))
      +
      -- Project familiarity (0-20 points)
      CASE WHEN EXISTS (
        SELECT 1 FROM brain_tasks t 
        WHERE t.assigned_to = s.bot_id 
        AND t.project_id = p_project_id 
        AND t.status = 'done'
      ) THEN 20 ELSE 0 END
    ) AS total_score
  INTO v_best_bot, v_score
  FROM brain_bots s
  WHERE s.status != 'offline'
  ORDER BY total_score DESC
  LIMIT 1;
  
  -- Create the task in brain_queue
  INSERT INTO brain_queue (
    title, description, project_id, priority, 
    required_skills, assigned_to, requested_by,
    estimated_minutes, status
  ) VALUES (
    p_title, p_description, p_project_id, p_priority,
    p_required_skills, v_best_bot, p_requested_by,
    p_estimated_minutes, 'pending'
  ) RETURNING id INTO v_task_id;
  
  -- Also create in brain_tasks for tracking
  INSERT INTO brain_tasks (
    id, title, description, project_id, priority,
    assigned_to, created_by, status, time_estimate_minutes
  ) VALUES (
    v_task_id, p_title, p_description, p_project_id, p_priority,
    v_best_bot, p_requested_by, 'pending', p_estimated_minutes
  ) ON CONFLICT (id) DO NOTHING;
  
  RETURN jsonb_build_object(
    'task_id', v_task_id,
    'assigned_to', v_best_bot,
    'match_score', v_score,
    'priority', p_priority
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 7: DECISION + LEARNING ENFORCEMENT
-- ============================================================

-- Pre-work learning check
CREATE OR REPLACE FUNCTION check_learnings(
  p_project_id text,
  p_context text DEFAULT '',
  p_file_paths text[] DEFAULT '{}'
)
RETURNS jsonb AS $$
DECLARE
  v_learnings jsonb := '[]'::jsonb;
  v_mistakes jsonb := '[]'::jsonb;
  v_sops jsonb := '[]'::jsonb;
  v_knowledge jsonb := '[]'::jsonb;
BEGIN
  -- Get relevant learnings
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', id, 'lesson', lesson, 'fix_applied', fix_applied, 
    'prevention', prevention, 'severity', severity
  )), '[]'::jsonb) INTO v_learnings
  FROM brain_learnings
  WHERE (project_id = p_project_id OR project_id IS NULL)
    AND is_active = true
  ORDER BY severity DESC, created_at DESC
  LIMIT 10;
  
  -- Get relevant mistakes (unresolved)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', id, 'title', title, 'root_cause', root_cause,
    'prevention_rule', prevention_rule
  )), '[]'::jsonb) INTO v_mistakes
  FROM brain_mistakes
  WHERE (project_id = p_project_id OR project_id IS NULL)
    AND resolved = false
  LIMIT 5;
  
  -- Get relevant SOPs
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', id, 'title', title, 'category', category, 'steps', steps
  )), '[]'::jsonb) INTO v_sops
  FROM brain_sops
  WHERE (project_id = p_project_id OR project_id IS NULL)
    AND is_current = true
  LIMIT 5;
  
  -- Get file-specific knowledge
  IF array_length(p_file_paths, 1) > 0 THEN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'key', key, 'value', value, 'confidence', confidence
    )), '[]'::jsonb) INTO v_knowledge
    FROM brain_knowledge
    WHERE project_id = p_project_id
      AND (tags && p_file_paths OR key ILIKE ANY(
        SELECT '%' || unnest(p_file_paths) || '%'
      ))
    LIMIT 10;
  END IF;
  
  RETURN jsonb_build_object(
    'learnings', v_learnings,
    'active_mistakes', v_mistakes,
    'applicable_sops', v_sops,
    'file_knowledge', v_knowledge,
    'total_items', jsonb_array_length(v_learnings) + jsonb_array_length(v_mistakes) + jsonb_array_length(v_sops) + jsonb_array_length(v_knowledge)
  );
END;
$$ LANGUAGE plpgsql;

-- Log a learning from a mistake
CREATE OR REPLACE FUNCTION log_learning(
  p_bot_id text,
  p_project_id text,
  p_trigger_event text,
  p_lesson text,
  p_fix_applied text,
  p_prevention text,
  p_severity text DEFAULT 'medium',
  p_tags text[] DEFAULT '{}'
)
RETURNS jsonb AS $$
DECLARE
  v_learning_id uuid;
BEGIN
  INSERT INTO brain_learnings (
    bot_id, project_id, trigger_event, lesson,
    fix_applied, prevention, severity, tags, is_active
  ) VALUES (
    p_bot_id, p_project_id, p_trigger_event, p_lesson,
    p_fix_applied, p_prevention, p_severity, p_tags, true
  ) RETURNING id INTO v_learning_id;
  
  -- Auto-create knowledge entry from high-severity learnings
  IF p_severity IN ('critical', 'high') THEN
    INSERT INTO brain_knowledge (category, key, value, project_id, tags, added_by, confidence, source_bot, source_mistake_id)
    VALUES (
      'learning',
      'LEARNED: ' || left(p_lesson, 100),
      p_lesson || E'\nPrevention: ' || p_prevention || E'\nFix: ' || p_fix_applied,
      p_project_id,
      p_tags,
      p_bot_id,
      0.8,
      p_bot_id,
      v_learning_id
    );
  END IF;
  
  RETURN jsonb_build_object('learning_id', v_learning_id, 'auto_knowledge', p_severity IN ('critical', 'high'));
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 8: PROACTIVE INTELLIGENCE
-- ============================================================

-- Health check function (called by cron)
CREATE OR REPLACE FUNCTION brain_health_check()
RETURNS jsonb AS $$
DECLARE
  v_stale_bots jsonb;
  v_overdue_tasks jsonb;
  v_incidents jsonb;
  v_alerts jsonb := '[]'::jsonb;
BEGIN
  -- Check for stale bots (no heartbeat in 30 min)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'bot_id', bot_id, 'last_seen', created_at,
    'minutes_ago', EXTRACT(EPOCH FROM (now() - created_at)) / 60
  )), '[]'::jsonb) INTO v_stale_bots
  FROM (
    SELECT DISTINCT ON (bot_id) bot_id, created_at
    FROM brain_heartbeats
    ORDER BY bot_id, created_at DESC
  ) latest
  WHERE created_at < now() - interval '30 minutes';
  
  -- Check for overdue tasks
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'task_id', id, 'title', title, 'assigned_to', assigned_to,
    'due_by', due_by, 'hours_overdue', EXTRACT(EPOCH FROM (now() - due_by)) / 3600
  )), '[]'::jsonb) INTO v_overdue_tasks
  FROM brain_tasks
  WHERE deadline < now()
    AND status NOT IN ('done', 'completed', 'cancelled')
  LIMIT 10;
  
  -- Check for unresolved incidents
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', id, 'title', title, 'severity', severity,
    'hours_open', EXTRACT(EPOCH FROM (now() - detected_at)) / 3600
  )), '[]'::jsonb) INTO v_incidents
  FROM brain_incidents
  WHERE status IN ('open', 'acknowledged')
  LIMIT 5;
  
  -- Generate alerts for anything found
  IF jsonb_array_length(v_stale_bots) > 0 THEN
    INSERT INTO brain_live (bot_id, event_type, message, target_bot, data)
    VALUES ('system', 'alert', 
      'HEALTH CHECK: ' || jsonb_array_length(v_stale_bots) || ' bot(s) stale',
      'all', v_stale_bots);
  END IF;
  
  IF jsonb_array_length(v_overdue_tasks) > 0 THEN
    INSERT INTO brain_live (bot_id, event_type, message, target_bot, data)
    VALUES ('system', 'alert',
      'HEALTH CHECK: ' || jsonb_array_length(v_overdue_tasks) || ' overdue task(s)',
      'all', v_overdue_tasks);
  END IF;
  
  RETURN jsonb_build_object(
    'stale_bots', v_stale_bots,
    'overdue_tasks', v_overdue_tasks,
    'open_incidents', v_incidents,
    'checked_at', now()
  );
END;
$$ LANGUAGE plpgsql;

-- Daily briefing generator
CREATE OR REPLACE FUNCTION generate_daily_briefing()
RETURNS jsonb AS $$
DECLARE
  v_tasks_completed int;
  v_tasks_created int;
  v_commits int;
  v_incidents int;
  v_active_bots int;
  v_top_contributor text;
  v_briefing_id uuid;
BEGIN
  -- Gather metrics from last 24h
  SELECT COUNT(*) INTO v_tasks_completed
  FROM brain_tasks WHERE completed_at > now() - interval '24 hours';
  
  SELECT COUNT(*) INTO v_tasks_created
  FROM brain_tasks WHERE created_at > now() - interval '24 hours';
  
  SELECT COUNT(*) INTO v_commits
  FROM brain_git_events WHERE created_at > now() - interval '24 hours';
  
  SELECT COUNT(*) INTO v_incidents
  FROM brain_incidents WHERE detected_at > now() - interval '24 hours';
  
  SELECT COUNT(DISTINCT bot_id) INTO v_active_bots
  FROM brain_heartbeats WHERE created_at > now() - interval '24 hours';
  
  SELECT bot_id INTO v_top_contributor
  FROM brain_git_events
  WHERE created_at > now() - interval '24 hours'
  GROUP BY bot_id
  ORDER BY COUNT(*) DESC
  LIMIT 1;
  
  -- Store briefing
  INSERT INTO ai_daily_briefings (date, summary, key_metrics, action_items)
  VALUES (
    CURRENT_DATE,
    format('Daily Report: %s tasks completed, %s new tasks, %s commits, %s incidents. %s bots active. Top contributor: %s',
      v_tasks_completed, v_tasks_created, v_commits, v_incidents, v_active_bots, COALESCE(v_top_contributor, 'none')),
    jsonb_build_object(
      'tasks_completed', v_tasks_completed,
      'tasks_created', v_tasks_created,
      'commits', v_commits,
      'incidents', v_incidents,
      'active_bots', v_active_bots,
      'top_contributor', v_top_contributor
    ),
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('task', title, 'assigned_to', assigned_to, 'priority', priority)), '[]'::jsonb)
     FROM brain_tasks WHERE status IN ('pending', 'in_progress') AND priority IN ('critical', 'high', 'urgent') LIMIT 5)
  ) RETURNING id INTO v_briefing_id;
  
  RETURN jsonb_build_object(
    'briefing_id', v_briefing_id,
    'tasks_completed', v_tasks_completed,
    'tasks_created', v_tasks_created,
    'commits', v_commits,
    'incidents', v_incidents,
    'active_bots', v_active_bots
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 9: KNOWLEDGE GRAPH
-- ============================================================

-- Get context web — traverse relationships
CREATE OR REPLACE FUNCTION get_context_web(
  p_entity_type text,
  p_entity_id text,
  p_max_hops int DEFAULT 2
)
RETURNS jsonb AS $$
DECLARE
  v_result jsonb := '[]'::jsonb;
BEGIN
  -- Direct relationships
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'source_type', source_type,
    'source_name', source_name,
    'relationship', relationship,
    'target_type', target_type,
    'target_name', target_name,
    'hop', 1
  )), '[]'::jsonb) INTO v_result
  FROM brain_knowledge_graph
  WHERE (source_type = p_entity_type AND source_name = p_entity_id)
     OR (target_type = p_entity_type AND target_name = p_entity_id);
  
  -- Second hop if requested
  IF p_max_hops >= 2 THEN
    v_result := v_result || COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'source_type', g2.source_type,
        'source_name', g2.source_name,
        'relationship', g2.relationship,
        'target_type', g2.target_type,
        'target_name', g2.target_name,
        'hop', 2
      ))
      FROM brain_knowledge_graph g1
      JOIN brain_knowledge_graph g2 ON (
        (g2.source_type = g1.target_type AND g2.source_name = g1.target_name)
        OR (g2.target_type = g1.source_type AND g2.target_name = g1.source_name)
      )
      WHERE (g1.source_type = p_entity_type AND g1.source_name = p_entity_id)
         OR (g1.target_type = p_entity_type AND g1.target_name = p_entity_id)
    ), '[]'::jsonb);
  END IF;
  
  RETURN jsonb_build_object(
    'entity', jsonb_build_object('type', p_entity_type, 'id', p_entity_id),
    'relationships', v_result,
    'total', jsonb_array_length(v_result)
  );
END;
$$ LANGUAGE plpgsql;

-- Auto-populate knowledge graph from projects
CREATE OR REPLACE FUNCTION populate_project_graph(p_project_id text)
RETURNS jsonb AS $$
DECLARE
  v_project record;
  v_tech text;
  v_count int := 0;
BEGIN
  SELECT * INTO v_project FROM brain_projects WHERE id = p_project_id;
  
  IF v_project IS NULL THEN
    RETURN jsonb_build_object('error', 'project not found');
  END IF;
  
  -- Project → tech stack links
  IF v_project.tech_stack IS NOT NULL THEN
    FOR v_tech IN SELECT unnest(v_project.tech_stack)
    LOOP
      INSERT INTO brain_knowledge_graph (project_id, source_type, source_name, relationship, target_type, target_name, discovered_by)
      VALUES (p_project_id, 'project', p_project_id, 'uses', 'technology', v_tech, 'system')
      ON CONFLICT DO NOTHING;
      v_count := v_count + 1;
    END LOOP;
  END IF;
  
  -- Project → repo link
  IF v_project.repo IS NOT NULL THEN
    INSERT INTO brain_knowledge_graph (project_id, source_type, source_name, relationship, target_type, target_name, discovered_by)
    VALUES (p_project_id, 'project', p_project_id, 'hosted_at', 'repository', v_project.repo, 'system')
    ON CONFLICT DO NOTHING;
    v_count := v_count + 1;
  END IF;
  
  -- Project → website link
  IF v_project.website IS NOT NULL THEN
    INSERT INTO brain_knowledge_graph (project_id, source_type, source_name, relationship, target_type, target_name, discovered_by)
    VALUES (p_project_id, 'project', p_project_id, 'deployed_at', 'website', v_project.website, 'system')
    ON CONFLICT DO NOTHING;
    v_count := v_count + 1;
  END IF;
  
  RETURN jsonb_build_object('project', p_project_id, 'links_created', v_count);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 10: FIX BROKEN RPCS + ENHANCED HEARTBEAT
-- ============================================================

-- Fix brain_heartbeat RPC
CREATE OR REPLACE FUNCTION brain_heartbeat(
  p_bot_id text,
  p_status text DEFAULT 'online',
  p_current_task text DEFAULT NULL,
  p_project_id text DEFAULT NULL,
  p_blockers text DEFAULT NULL,
  p_last_commit_sha text DEFAULT NULL,
  p_session_id text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Insert heartbeat
  INSERT INTO brain_heartbeats (bot_id, status, current_task, project_id, blockers, last_commit_sha, session_id)
  VALUES (p_bot_id, p_status, p_current_task, p_project_id, p_blockers, p_last_commit_sha, p_session_id)
  RETURNING id INTO v_id;
  
  -- Update bot status
  INSERT INTO brain_bots (id, name, status, last_seen_at)
  VALUES (p_bot_id, p_bot_id, p_status, now())
  ON CONFLICT (id) DO UPDATE SET
    status = p_status,
    last_seen_at = now();
  
  -- Check for pending messages/tasks for this bot
  RETURN jsonb_build_object(
    'heartbeat_id', v_id,
    'pending_messages', (SELECT COUNT(*) FROM brain_messages WHERE to_bot = p_bot_id AND read = false),
    'pending_tasks', (SELECT COUNT(*) FROM brain_queue WHERE assigned_to = p_bot_id AND status = 'pending'),
    'pending_handoffs', (SELECT COUNT(*) FROM brain_handoffs WHERE to_bot = p_bot_id AND status = 'pending'),
    'unread_notifications', (SELECT COUNT(*) FROM brain_notifications WHERE to_bot = p_bot_id AND read = false),
    'active_incidents', (SELECT COUNT(*) FROM brain_incidents WHERE status IN ('open', 'acknowledged'))
  );
END;
$$ LANGUAGE plpgsql;

-- Bot session start — comprehensive context loader
CREATE OR REPLACE FUNCTION bot_session_start(
  p_bot_id text,
  p_project_id text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_heartbeat jsonb;
  v_context jsonb;
BEGIN
  -- Send heartbeat
  v_heartbeat := brain_heartbeat(p_bot_id, 'online', 'session_start', p_project_id);
  
  -- Load full context
  v_context := jsonb_build_object(
    'heartbeat', v_heartbeat,
    'active_locks', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('file_path', file_path, 'locked_by', locked_by, 'reason', reason)), '[]'::jsonb)
      FROM brain_file_locks WHERE released_at IS NULL AND (project_id = p_project_id OR p_project_id IS NULL)
    ),
    'recent_context', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('title', title, 'details', details, 'bot', bot_id, 'importance', importance)), '[]'::jsonb)
      FROM brain_context WHERE (project_id = p_project_id OR p_project_id IS NULL)
      ORDER BY created_at DESC LIMIT 5
    ),
    'my_tasks', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'title', title, 'status', status, 'priority', priority, 'project_id', project_id)), '[]'::jsonb)
      FROM brain_tasks WHERE assigned_to = p_bot_id AND status NOT IN ('done', 'completed', 'cancelled')
    ),
    'recent_learnings', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('lesson', lesson, 'prevention', prevention, 'severity', severity)), '[]'::jsonb)
      FROM brain_learnings WHERE (project_id = p_project_id OR project_id IS NULL) AND is_active = true
      ORDER BY created_at DESC LIMIT 5
    ),
    'project_gotchas', (
      SELECT gotchas FROM brain_projects WHERE id = p_project_id
    ),
    'recent_incidents', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('title', title, 'severity', severity, 'status', status)), '[]'::jsonb)
      FROM brain_incidents WHERE status NOT IN ('closed', 'resolved') LIMIT 3
    )
  );
  
  -- Log session start
  INSERT INTO brain_activity (bot_id, project_id, action, target, details, started_at)
  VALUES (p_bot_id, p_project_id, 'session_start', 'brain', 'Bot session started with full context load', now());
  
  RETURN v_context;
END;
$$ LANGUAGE plpgsql;

-- Bot session end — save everything
CREATE OR REPLACE FUNCTION bot_session_end(
  p_bot_id text,
  p_project_id text DEFAULT NULL,
  p_summary text DEFAULT NULL,
  p_decisions text[] DEFAULT '{}',
  p_files_touched text[] DEFAULT '{}',
  p_handoff_notes text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_session_id uuid;
BEGIN
  -- Log session context
  INSERT INTO brain_session_context (bot_id, project_id, session_date, files_touched, key_decisions, handoff_notes, context_type)
  VALUES (p_bot_id, p_project_id, CURRENT_DATE, p_files_touched, p_decisions, p_handoff_notes, 'session_end')
  RETURNING id INTO v_session_id;
  
  -- Log to memory
  INSERT INTO brain_memory_log (bot_id, source, summary, decisions, project_id)
  VALUES (p_bot_id, 'session_end', p_summary, p_decisions, p_project_id);
  
  -- Release all file locks held by this bot
  UPDATE brain_file_locks 
  SET released_at = now() 
  WHERE bot_id = p_bot_id AND released_at IS NULL;
  
  -- End active activities
  UPDATE brain_activity
  SET ended_at = now()
  WHERE bot_id = p_bot_id AND ended_at IS NULL;
  
  -- Send heartbeat with idle status
  PERFORM brain_heartbeat(p_bot_id, 'idle', NULL, p_project_id);
  
  RETURN jsonb_build_object(
    'session_id', v_session_id,
    'locks_released', (SELECT COUNT(*) FROM brain_file_locks WHERE bot_id = p_bot_id AND released_at = now()),
    'summary_logged', p_summary IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- UTILITY: STREAM EVENT LOGGER
-- ============================================================

-- Central event stream logger — ALL significant events go here
CREATE OR REPLACE FUNCTION log_stream_event(
  p_actor_type text,        -- bot, human, system, webhook
  p_actor_id text,
  p_event_type text,        -- task.created, task.completed, deploy.started, incident.opened, etc.
  p_title text,
  p_details text DEFAULT NULL,
  p_project_id text DEFAULT NULL,
  p_task_id uuid DEFAULT NULL,
  p_tags text[] DEFAULT '{}',
  p_importance text DEFAULT 'normal',  -- low, normal, high, critical
  p_idempotency_key text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Idempotency check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id INTO v_id FROM brain_stream WHERE idempotency_key = p_idempotency_key;
    IF v_id IS NOT NULL THEN
      RETURN v_id;
    END IF;
  END IF;
  
  INSERT INTO brain_stream (
    actor_type, actor_id, event_type, title, details,
    project_id, task_id, tags, importance, idempotency_key
  ) VALUES (
    p_actor_type, p_actor_id, p_event_type, p_title, p_details,
    p_project_id, p_task_id, p_tags, p_importance, p_idempotency_key
  ) RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Auto-log task changes to stream
CREATE OR REPLACE FUNCTION stream_task_changes()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_stream_event('bot', COALESCE(NEW.created_by, 'system'), 'task.created',
      'Task created: ' || NEW.title, NEW.description, NEW.project_id, NEW.id,
      COALESCE(NEW.tags, '{}'), 
      CASE NEW.priority WHEN 'critical' THEN 'critical' WHEN 'high' THEN 'high' ELSE 'normal' END);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      PERFORM log_stream_event('bot', COALESCE(NEW.assigned_to, 'system'), 
        'task.' || NEW.status,
        'Task ' || NEW.status || ': ' || NEW.title, NULL, NEW.project_id, NEW.id,
        COALESCE(NEW.tags, '{}'),
        CASE WHEN NEW.status IN ('done', 'completed') THEN 'normal' ELSE 'low' END);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_to_stream ON brain_tasks;
CREATE TRIGGER tasks_to_stream
  AFTER INSERT OR UPDATE ON brain_tasks
  FOR EACH ROW EXECUTE FUNCTION stream_task_changes();

-- Auto-log deployments to stream
CREATE OR REPLACE FUNCTION stream_deployment_changes()
RETURNS trigger AS $$
BEGIN
  PERFORM log_stream_event('bot', COALESCE(NEW.bot_id, 'system'), 
    'deploy.' || NEW.status,
    'Deploy ' || NEW.status || ': ' || COALESCE(NEW.project_id, 'unknown'),
    NEW.changes_summary, NEW.project_id, NULL,
    ARRAY['deployment'], 
    CASE NEW.status WHEN 'failed' THEN 'critical' WHEN 'success' THEN 'high' ELSE 'normal' END);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS deployments_to_stream ON brain_deployments;
CREATE TRIGGER deployments_to_stream
  AFTER INSERT ON brain_deployments
  FOR EACH ROW EXECUTE FUNCTION stream_deployment_changes();

-- Auto-log incidents to stream
CREATE OR REPLACE FUNCTION stream_incident_changes()
RETURNS trigger AS $$
BEGIN
  PERFORM log_stream_event('bot', COALESCE(NEW.detected_by, 'system'),
    'incident.' || COALESCE(NEW.status, 'opened'),
    'Incident: ' || NEW.title,
    NEW.description, NEW.project_id, NULL,
    COALESCE(NEW.tags, '{}'),
    CASE NEW.severity WHEN 'critical' THEN 'critical' WHEN 'major' THEN 'high' ELSE 'normal' END);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS incidents_to_stream ON brain_incidents;
CREATE TRIGGER incidents_to_stream
  AFTER INSERT OR UPDATE ON brain_incidents
  FOR EACH ROW EXECUTE FUNCTION stream_incident_changes();

-- ============================================================
-- CRON JOBS (via pg_cron)
-- Enable pg_cron in Dashboard > Database > Extensions first!
-- Then uncomment and run these separately:
-- ============================================================

-- SELECT cron.schedule('brain-health-check', '*/15 * * * *', 'SELECT brain_health_check()');
-- SELECT cron.schedule('brain-timeout-check', '*/5 * * * *', 'SELECT check_task_timeouts()');
-- SELECT cron.schedule('brain-daily-briefing', '0 13 * * *', 'SELECT generate_daily_briefing()');

-- To enable cron jobs:
-- 1. Go to Database > Extensions > search "pg_cron" > Enable
-- 2. Then run the 3 SELECT cron.schedule lines above

-- ============================================================
-- ENHANCED VIEWS
-- ============================================================

-- Brain overview dashboard
CREATE OR REPLACE VIEW brain_overview AS
SELECT 
  (SELECT COUNT(*) FROM brain_bots WHERE status != 'offline') AS active_bots,
  (SELECT COUNT(*) FROM brain_tasks WHERE status = 'in_progress') AS tasks_in_progress,
  (SELECT COUNT(*) FROM brain_tasks WHERE status = 'pending') AS tasks_pending,
  (SELECT COUNT(*) FROM brain_tasks WHERE completed_at > now() - interval '24 hours') AS tasks_completed_24h,
  (SELECT COUNT(*) FROM brain_queue WHERE status = 'in_progress') AS queue_active,
  (SELECT COUNT(*) FROM brain_queue WHERE status = 'pending') AS queue_pending,
  (SELECT COUNT(*) FROM brain_queue WHERE status = 'failed') AS queue_failed,
  (SELECT COUNT(*) FROM brain_incidents WHERE status IN ('open', 'acknowledged')) AS open_incidents,
  (SELECT COUNT(*) FROM brain_git_events WHERE created_at > now() - interval '24 hours') AS commits_24h,
  (SELECT COUNT(*) FROM brain_deployments WHERE deployed_at > now() - interval '24 hours') AS deploys_24h,
  (SELECT SUM(cost_usd) FROM brain_api_logs WHERE created_at > now() - interval '24 hours') AS cost_24h,
  (SELECT COUNT(*) FROM brain_knowledge) AS total_knowledge,
  (SELECT COUNT(*) FROM brain_learnings WHERE is_active = true) AS active_learnings,
  (SELECT COUNT(*) FROM brain_sops WHERE is_current = true) AS active_sops;

-- Bot performance comparison
CREATE OR REPLACE VIEW brain_bot_comparison AS
SELECT 
  b.id AS bot_id,
  b.name,
  b.status,
  b.last_seen_at,
  COALESCE(t.completed, 0) AS tasks_completed_30d,
  COALESCE(t.failed, 0) AS tasks_failed_30d,
  COALESCE(g.commits, 0) AS commits_30d,
  COALESCE(l.learnings, 0) AS learnings_logged,
  COALESCE(c.cost, 0) AS cost_30d
FROM brain_bots b
LEFT JOIN (
  SELECT assigned_to, 
    COUNT(*) FILTER (WHERE status IN ('done', 'completed')) AS completed,
    COUNT(*) FILTER (WHERE status = 'failed') AS failed
  FROM brain_tasks WHERE created_at > now() - interval '30 days'
  GROUP BY assigned_to
) t ON t.assigned_to = b.id
LEFT JOIN (
  SELECT author AS bot_id, COUNT(*) AS commits
  FROM brain_git_events WHERE created_at > now() - interval '30 days'
  GROUP BY author
) g ON g.bot_id = b.id
LEFT JOIN (
  SELECT bot_id, COUNT(*) AS learnings
  FROM brain_learnings WHERE is_active = true
  GROUP BY bot_id
) l ON l.bot_id = b.id
LEFT JOIN (
  SELECT bot_id, SUM(cost_usd) AS cost
  FROM brain_api_logs WHERE created_at > now() - interval '30 days'
  GROUP BY bot_id
) c ON c.bot_id = b.id;

-- Stream timeline (last 100 events)
CREATE OR REPLACE VIEW brain_timeline AS
SELECT id, ts, actor_type, actor_id, event_type, title, details, 
       project_id, task_id, tags, importance
FROM brain_stream
ORDER BY ts DESC
LIMIT 100;

-- ============================================================
-- GRANTS (ensure service role has access)
-- ============================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
