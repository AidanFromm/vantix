# 🧠 Vantix Brain V2 — The Ultimate Bot Intelligence System

Complete infrastructure upgrade for the Vantix 4-bot fleet. Event-driven, self-healing, learning, observable.

## What This Does

| Feature | Before | After |
|---------|--------|-------|
| Task assignment | Manual in chat | Auto-routed by skill + workload |
| Bot communication | Polling every few min | Instant pg_notify triggers |
| Error recovery | Task hangs forever | Auto-retry with checkpoints |
| Memory | Raw log dumping | Summarized SOPs + semantic search |
| Cost tracking | None | Per-bot token/dollar tracking |
| Git tracking | Manual verification | Auto-linked commits → tasks |
| Health monitoring | Manual SSH checks | Auto health checks every 15 min |
| Daily reporting | None | Auto-generated daily briefings |
| Knowledge | Static entries | Self-improving from learnings |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vix (HQ)  │     │   Botskii    │     │   Denver    │
│  Mac Mini   │────▶│   Desktop    │────▶│  Mac Mini   │
└──────┬──────┘     └──────┬───────┘     └──────┬──────┘
       │                   │                     │
       └───────────┬───────┴─────────────────────┘
                   ▼
         ┌─────────────────┐
         │  Supabase Brain  │
         │  (PostgreSQL)    │
         ├─────────────────┤
         │ pg_notify events │──▶ Instant bot alerts
         │ brain_queue      │──▶ Resilient task queue
         │ brain_api_logs   │──▶ Cost observability
         │ brain_sops       │──▶ Smart memory
         │ brain_stream     │──▶ Central event bus
         │ cron jobs        │──▶ Health checks + briefings
         └─────────────────┘
```

## Installation

### Step 1: Run the SQL Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/obprrtqyzpaudfeyftyd/sql)
2. Open the SQL Editor
3. Copy-paste the contents of `migrations/001_brain_v2_schema.sql`
4. Click **Run**

This creates:
- 3 new tables (brain_sops, brain_memory_summaries, brain_api_logs, brain_cost_budgets, brain_code_ownership, brain_event_dispatch)
- 7 database triggers (event notifications on all key tables)
- 15 RPC functions (smart task claiming, checkpoints, health checks, etc.)
- 3 cron jobs (health check every 15min, timeout check every 5min, daily briefing at 8am EST)
- 5 new views (overview dashboard, bot comparison, cost dashboard, token usage, timeline)
- pgvector embeddings on knowledge, memory, and SOPs tables

### Step 2: Deploy Edge Functions (Optional)

```bash
cd supabase
supabase link --project-ref obprrtqyzpaudfeyftyd
supabase functions deploy brain-dispatcher
supabase functions deploy memory-curator
supabase functions deploy cost-alerter
```

### Step 3: Update Bot Configs

Each bot should call these RPCs in their workflow:

```
ON WAKE:     bot_session_start(bot_id, project_id)
BEFORE WORK: check_learnings(project_id, context)
CLAIM TASK:  claim_task_smart(bot_id, capabilities)
MID-WORK:    checkpoint_task(task_id, data)
ON ERROR:    fail_task(task_id, error)
ON SUCCESS:  complete_task(task_id, result, bot_id, commit_sha)
ON FINISH:   bot_session_end(bot_id, project_id, summary, decisions, files)
LOG COST:    INSERT INTO brain_api_logs (...)
```

## New RPC Functions

| Function | Purpose |
|----------|---------|
| `brain_heartbeat(bot_id, status, task, project)` | Fixed heartbeat with pending work check |
| `bot_session_start(bot_id, project_id)` | Load full context on wake |
| `bot_session_end(bot_id, project, summary, decisions, files)` | Save everything on sleep |
| `claim_task_smart(bot_id, capabilities)` | Skill-matched task claiming |
| `checkpoint_task(task_id, data)` | Save mid-task progress |
| `fail_task(task_id, error)` | Retry-aware failure handling |
| `complete_task(task_id, result, bot_id, commit_sha)` | Mark task done |
| `route_task(title, desc, project, priority, skills)` | Auto-assign to best bot |
| `check_learnings(project_id, context)` | Pre-work learning check |
| `log_learning(bot_id, project, trigger, lesson, fix, prevention)` | Log + auto-knowledge |
| `check_task_timeouts()` | Find and fail timed-out tasks |
| `brain_health_check()` | Comprehensive health scan |
| `generate_daily_briefing()` | Daily summary generation |
| `get_context_web(entity_type, entity_id)` | Knowledge graph traversal |
| `populate_project_graph(project_id)` | Auto-build project relationships |
| `log_stream_event(...)` | Central event stream logger |

## New Tables

| Table | Purpose |
|-------|---------|
| `brain_sops` | Standard Operating Procedures extracted from learnings |
| `brain_memory_summaries` | Compressed memory by time period + bot |
| `brain_api_logs` | Every API call with tokens, cost, latency |
| `brain_cost_budgets` | Spending limits per bot/project |
| `brain_code_ownership` | File ownership + complexity tracking |
| `brain_event_dispatch` | Event delivery tracking |

## New Views

| View | Purpose |
|------|---------|
| `brain_overview` | Single-row dashboard with all key metrics |
| `brain_bot_comparison` | Side-by-side bot performance (30d) |
| `brain_cost_dashboard` | Token usage + costs by bot/day |
| `brain_token_usage` | 24h/7d/30d token summaries per bot |
| `brain_timeline` | Last 100 events from the stream |

## Cron Jobs

| Schedule | Function | Purpose |
|----------|----------|---------|
| Every 5 min | `check_task_timeouts()` | Fail stuck tasks |
| Every 15 min | `brain_health_check()` | Check bot health + overdue tasks |
| Daily 8am EST | `generate_daily_briefing()` | Morning summary |

## Bot Integration Guide

See `docs/BOT_INTEGRATION.md` for the complete guide on how each bot should use the new system.
