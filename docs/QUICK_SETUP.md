# Quick Setup — 5 Minutes

## Step 1: Run the Migration (2 min)

1. Open https://supabase.com/dashboard/project/obprrtqyzpaudfeyftyd/sql
2. Create new query
3. Paste contents of `migrations/001_brain_v2_schema.sql`
4. Click **Run**
5. Should see "Success" — all tables, triggers, functions, cron jobs created

## Step 2: Populate Knowledge Graph (1 min)

Run this in SQL editor:

```sql
-- Populate graphs for all projects
SELECT populate_project_graph('j4k');
SELECT populate_project_graph('cardledger');
SELECT populate_project_graph('mixzokickz');
SELECT populate_project_graph('vantix');
SELECT populate_project_graph('securedtampa');
SELECT populate_project_graph('sportsbots');
SELECT populate_project_graph('horizon');
```

## Step 3: Set Cost Budgets (1 min)

```sql
-- Daily budgets per bot
INSERT INTO brain_cost_budgets (bot_id, period, budget_usd) VALUES
  ('vantixhq', 'daily', 5.00),
  ('botskii', 'daily', 5.00),
  ('denver', 'daily', 5.00),
  ('vantix', 'daily', 5.00);

-- Monthly overall budget
INSERT INTO brain_cost_budgets (period, budget_usd) VALUES
  ('monthly', 200.00);
```

## Step 4: Verify (1 min)

```sql
-- Check everything is working
SELECT * FROM brain_overview;

-- Check cron jobs are scheduled
SELECT * FROM cron.job;

-- Test heartbeat
SELECT brain_heartbeat('vantixhq', 'online', 'testing brain v2', 'vantix');

-- Test session start
SELECT bot_session_start('vantixhq', 'vantix');
```

## Done!

The brain is now:
- ✅ Event-driven (pg_notify on all key tables)
- ✅ Self-healing (auto-retry failed tasks, timeout detection)
- ✅ Observable (API logs, cost tracking, health checks)
- ✅ Learning (learnings → knowledge pipeline)
- ✅ Auto-reporting (daily briefings, health checks)
- ✅ Smart routing (skill-based task assignment)

## What Bots Need to Change

Each bot's AGENTS.md needs updated workflow:

**OLD:**
```
1. GET brain_status
2. GET brain_tasks
3. Do work
4. POST brain_context
```

**NEW:**
```
1. SELECT bot_session_start(bot_id, project)  -- loads everything at once
2. SELECT check_learnings(project, context)    -- learn from past mistakes
3. SELECT claim_task_smart(bot_id, skills)     -- get best task
4. Do work (with checkpoint_task every major step)
5. SELECT complete_task(id, result, sha)       -- or fail_task on error
6. INSERT INTO brain_api_logs (...)            -- log every API call
7. SELECT bot_session_end(bot_id, ...)         -- save everything
```
