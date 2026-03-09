-- ============================================================
-- SEED DATA — Run after main migration
-- Sets up initial cost budgets, populates knowledge graph,
-- and configures the system for immediate use
-- ============================================================

-- 1. Set up cost budgets
INSERT INTO brain_cost_budgets (bot_id, period, budget_usd, alert_threshold_pct) VALUES
  ('vantixhq', 'daily', 5.00, 80),
  ('botskii', 'daily', 5.00, 80),
  ('denver', 'daily', 5.00, 80),
  ('vantix', 'daily', 5.00, 80),
  (NULL, 'daily', 25.00, 80),        -- overall daily
  (NULL, 'monthly', 300.00, 70)       -- overall monthly
ON CONFLICT DO NOTHING;

-- 2. Populate knowledge graph for all projects
SELECT populate_project_graph('j4k');
SELECT populate_project_graph('cardledger');
SELECT populate_project_graph('mixzokickz');
SELECT populate_project_graph('vantix');
SELECT populate_project_graph('securedtampa');
SELECT populate_project_graph('sportsbots');
SELECT populate_project_graph('horizon');

-- 3. Add key SOPs based on existing knowledge
INSERT INTO brain_sops (title, category, description, steps, tags, created_by) VALUES
(
  'Starting Work on a Project',
  'workflow',
  'Standard procedure for beginning any work session',
  '[
    {"step": 1, "action": "Call bot_session_start(bot_id, project_id) to load context"},
    {"step": 2, "action": "Call check_learnings(project_id) and READ the results"},
    {"step": 3, "action": "Check brain_file_locks for locked files"},
    {"step": 4, "action": "Claim task via claim_task_smart(bot_id, capabilities)"},
    {"step": 5, "action": "Lock any files you will edit via brain_file_locks"},
    {"step": 6, "action": "Pull latest from git before making changes"},
    {"step": 7, "action": "Run build to verify starting state is clean"}
  ]'::jsonb,
  ARRAY['workflow', 'mandatory'],
  'system'
),
(
  'Deploying to Production',
  'deployment',
  'Standard deployment checklist',
  '[
    {"step": 1, "action": "Run full build locally - must pass with zero errors"},
    {"step": 2, "action": "Run tests if they exist"},
    {"step": 3, "action": "Check brain_file_locks - no conflicts"},
    {"step": 4, "action": "Commit with descriptive message including [TASK-id]"},
    {"step": 5, "action": "Push to ALL remotes (origin + any secondary)"},
    {"step": 6, "action": "Wait for Vercel/deploy to complete"},
    {"step": 7, "action": "Verify deployment URL loads correctly"},
    {"step": 8, "action": "Log to brain_deployments with commit SHA + status"},
    {"step": 9, "action": "Complete task via complete_task(id, result, sha)"},
    {"step": 10, "action": "Post update to brain_live"}
  ]'::jsonb,
  ARRAY['deployment', 'mandatory', 'checklist'],
  'system'
),
(
  'Handling Errors and Bugs',
  'debugging',
  'What to do when you encounter or cause a bug',
  '[
    {"step": 1, "action": "Log the error to brain_mistakes immediately"},
    {"step": 2, "action": "Check brain_learnings for similar past issues"},
    {"step": 3, "action": "Fix the bug"},
    {"step": 4, "action": "Verify the fix with a build/test"},
    {"step": 5, "action": "Call log_learning() with the lesson and prevention rule"},
    {"step": 6, "action": "If critical: create brain_incidents entry"},
    {"step": 7, "action": "Checkpoint your progress via checkpoint_task()"},
    {"step": 8, "action": "If you cannot fix it: call fail_task() - do NOT silently move on"}
  ]'::jsonb,
  ARRAY['debugging', 'mandatory', 'error-handling'],
  'system'
),
(
  'Handing Off Work to Another Bot',
  'handoff',
  'How to properly hand off work between bots',
  '[
    {"step": 1, "action": "Commit and push all current work"},
    {"step": 2, "action": "Document current state in brain_context"},
    {"step": 3, "action": "Release all file locks"},
    {"step": 4, "action": "Create brain_handoffs entry with: context, files_involved, what_needs_done"},
    {"step": 5, "action": "Post to brain_live with event_type=handoff"},
    {"step": 6, "action": "Checkpoint the task if partially complete"},
    {"step": 7, "action": "Call bot_session_end() with handoff_notes"}
  ]'::jsonb,
  ARRAY['handoff', 'collaboration', 'mandatory'],
  'system'
),
(
  'End of Session Wrap-Up',
  'workflow',
  'What every bot must do before going idle',
  '[
    {"step": 1, "action": "Commit and push any uncommitted work"},
    {"step": 2, "action": "Complete or checkpoint all active tasks"},
    {"step": 3, "action": "Log API usage to brain_api_logs if not already"},
    {"step": 4, "action": "Call bot_session_end(bot_id, project, summary, decisions, files_touched)"},
    {"step": 5, "action": "This auto-releases locks, logs memory, and sets status to idle"}
  ]'::jsonb,
  ARRAY['workflow', 'mandatory', 'session'],
  'system'
)
ON CONFLICT DO NOTHING;

-- 4. Add brain v2 knowledge entries
INSERT INTO brain_knowledge (category, key, value, project_id, tags, added_by, confidence, source_bot) VALUES
(
  'operations',
  'Brain V2 RPC Functions Reference',
  'Key RPCs: bot_session_start(bot_id, project) - loads full context on wake. bot_session_end(bot_id, project, summary, decisions, files) - saves everything on sleep. claim_task_smart(bot_id, capabilities) - skill-matched task claiming. checkpoint_task(task_id, data) - save mid-task progress. fail_task(task_id, error) - retry-aware failure. complete_task(task_id, result, bot_id, sha) - mark done. route_task(title, desc, project, priority, skills) - auto-assign. check_learnings(project, context) - pre-work learning check. log_learning(bot_id, project, trigger, lesson, fix, prevention) - log + auto-knowledge. brain_heartbeat(bot_id, status, task, project) - heartbeat with pending work check.',
  'vantix',
  ARRAY['brain-v2', 'rpc', 'reference'],
  'vantixhq',
  1.0,
  'vantixhq'
),
(
  'operations',
  'Brain V2 Event System',
  'All key tables have pg_notify triggers: brain_queue, brain_tasks, brain_live, brain_handoffs, brain_notifications, brain_messages, brain_incidents. Events fire on INSERT/UPDATE. Channels: brain_events (all), bot_<id> (per-bot), brain_urgent (critical/urgent only). Edge Function brain-dispatcher can route events to Telegram. Cron: health check every 15min, timeout check every 5min, daily briefing at 8am EST.',
  'vantix',
  ARRAY['brain-v2', 'events', 'triggers', 'realtime'],
  'vantixhq',
  1.0,
  'vantixhq'
),
(
  'operations',
  'Brain V2 Observability',
  'Log ALL API calls to brain_api_logs with: bot_id, provider, model, prompt_tokens, completion_tokens, total_tokens, cost_usd, latency_ms, status. Cost budgets in brain_cost_budgets (per bot/project, daily/weekly/monthly). Views: brain_cost_dashboard (by bot/day), brain_token_usage (24h/7d/30d per bot), brain_overview (single-row dashboard), brain_bot_comparison (30d side-by-side).',
  'vantix',
  ARRAY['brain-v2', 'observability', 'costs', 'tokens'],
  'vantixhq',
  1.0,
  'vantixhq'
);

-- 5. Verify everything
SELECT 'Tables' AS check_type, COUNT(*) AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'brain_%'
UNION ALL
SELECT 'Functions', COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE 'brain_%' OR routine_name IN ('claim_task_smart', 'checkpoint_task', 'fail_task', 'complete_task', 'route_task', 'check_learnings', 'log_learning', 'log_stream_event', 'notify_brain_event', 'populate_project_graph', 'get_context_web', 'bot_session_start', 'bot_session_end', 'check_task_timeouts')
UNION ALL
SELECT 'Triggers', COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public'
UNION ALL
SELECT 'SOPs', COUNT(*) FROM brain_sops
UNION ALL
SELECT 'Cost Budgets', COUNT(*) FROM brain_cost_budgets
UNION ALL
SELECT 'Knowledge Graph Links', COUNT(*) FROM brain_knowledge_graph;
