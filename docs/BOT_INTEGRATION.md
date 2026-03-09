# Bot Integration Guide — Brain V2

## How Each Bot Should Use the New System

### 1. Session Lifecycle (MANDATORY for all bots)

```
┌──────────────────────────────────────────────────┐
│                  BOT SESSION                      │
│                                                   │
│  1. bot_session_start(bot_id, project_id)        │
│     → Returns: pending tasks, locks, learnings    │
│     → Auto-sends heartbeat                        │
│                                                   │
│  2. check_learnings(project_id, context)          │
│     → Returns: past mistakes, SOPs, knowledge     │
│     → READ THESE before doing anything            │
│                                                   │
│  3. claim_task_smart(bot_id, capabilities)        │
│     → Returns: best matching task from queue      │
│     → Task is now LOCKED to you                   │
│                                                   │
│  4. Work on task...                               │
│     → checkpoint_task() every significant step    │
│     → Log API calls to brain_api_logs             │
│                                                   │
│  5a. Success: complete_task(id, result, sha)      │
│  5b. Failure: fail_task(id, error)                │
│     → Auto-retries if under max_retries           │
│     → Auto-creates incident if permanently failed │
│                                                   │
│  6. bot_session_end(bot_id, project, summary...)  │
│     → Saves session context                       │
│     → Releases all file locks                     │
│     → Logs to memory                              │
│     → Sets status to idle                         │
└──────────────────────────────────────────────────┘
```

### 2. API Call Logging

After EVERY Claude/OpenAI API call, log it:

```sql
INSERT INTO brain_api_logs (
  bot_id, provider, model, prompt_tokens, completion_tokens,
  total_tokens, cost_usd, latency_ms, status, project_id
) VALUES (
  'botskii', 'claude', 'claude-3.5-sonnet',
  1500, 800, 2300, 0.0092, 3200, 'success', 'cardledger'
);
```

**Cost calculation reference:**
| Model | Input $/1M tokens | Output $/1M tokens |
|-------|-------------------|---------------------|
| Claude Sonnet 3.5 | $3.00 | $15.00 |
| Claude Opus 4 | $15.00 | $75.00 |
| Claude Haiku 3.5 | $0.25 | $1.25 |

### 3. Learning from Mistakes

When you fix a bug or make a mistake:

```sql
SELECT log_learning(
  'botskii',                    -- bot_id
  'cardledger',                 -- project_id
  'Build failed: missing import', -- trigger event
  'Always check imports after moving files', -- lesson
  'Added missing import to page.tsx', -- fix
  'Run build check before committing', -- prevention
  'high',                       -- severity
  ARRAY['typescript', 'imports'] -- tags
);
```

High-severity learnings auto-create knowledge entries.

### 4. Decision Logging

Before any architecture/tech decision:

```sql
INSERT INTO brain_decisions (
  project_id, title, decision, reasoning, category,
  decided_by, impact_level, reversible
) VALUES (
  'j4k',
  'Switch from StockX to GOAT for pricing',
  'Use GOAT Algolia API instead of StockX',
  'StockX blocks server requests with 403. GOAT Algolia is open.',
  'integration',
  'botskii',
  'high',
  true
);
```

### 5. Task Routing (for Vix/coordinators)

Auto-assign tasks to the best bot:

```sql
SELECT route_task(
  'Fix card search dedup',           -- title
  'Search results showing duplicates', -- description
  'cardledger',                       -- project
  'high',                             -- priority
  ARRAY['react', 'supabase'],        -- required skills
  'vantixhq',                        -- requested by
  30                                  -- estimated minutes
);
-- Returns: { task_id, assigned_to, match_score }
```

### 6. Checkpoint System

For long tasks, save progress regularly:

```sql
SELECT checkpoint_task(
  'task-uuid-here',
  '{"step": 3, "files_done": ["page.tsx", "api.ts"], "remaining": ["test.ts"]}'::jsonb
);
```

If the bot crashes, the next bot to claim the task gets the checkpoint data.

### 7. Event Stream

All significant events auto-log to `brain_stream`. You can also manually log:

```sql
SELECT log_stream_event(
  'bot',                    -- actor_type
  'denver',                 -- actor_id
  'deploy.success',         -- event_type
  'Deployed CardLedger v2.1', -- title
  'Fixed search, added pricing', -- details
  'cardledger',             -- project_id
  NULL,                     -- task_id
  ARRAY['deploy', 'cardledger'], -- tags
  'high'                    -- importance
);
```

### 8. Health Dashboard

Quick system check:

```sql
SELECT * FROM brain_overview;
```

Returns single row with:
- active_bots, tasks_in_progress, tasks_pending, tasks_completed_24h
- queue_active, queue_pending, queue_failed
- open_incidents, commits_24h, deploys_24h, cost_24h
- total_knowledge, active_learnings, active_sops

### 9. Bot Comparison

```sql
SELECT * FROM brain_bot_comparison;
```

Shows each bot's 30-day stats: tasks completed/failed, commits, learnings, cost.

### 10. Knowledge Graph

After setting up a project, populate its graph:

```sql
SELECT populate_project_graph('cardledger');
SELECT populate_project_graph('j4k');
SELECT populate_project_graph('mixzokickz');
```

Then query relationships:

```sql
SELECT get_context_web('project', 'cardledger', 2);
-- Returns all related entities up to 2 hops
```
