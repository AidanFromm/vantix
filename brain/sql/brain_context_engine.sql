-- ============================================================================
-- 🧠 BRAIN CONTEXT ENGINE — "Brain-First" Protocol
-- 
-- Bots call these functions BEFORE starting any task to get:
-- 1. Relevant knowledge for the task
-- 2. Past learnings/mistakes to avoid
-- 3. Recent decisions that affect this work
-- 4. Active incidents to be aware of
-- 5. Memory from other bots about related work
--
-- This is what makes the Brain a competitive advantage.
-- ============================================================================

-- ============================================================================
-- FUNCTION: get_task_context()
-- 
-- THE MAIN FUNCTION. Call this before starting ANY task.
-- Returns everything a bot needs to know in one call.
-- ============================================================================
CREATE OR REPLACE FUNCTION get_task_context(
  p_bot_id TEXT,
  p_project_id TEXT,
  p_task_description TEXT DEFAULT '',
  p_task_category TEXT DEFAULT 'general'  -- frontend | backend | database | api | design | security
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
  v_knowledge JSONB;
  v_learnings JSONB;
  v_decisions JSONB;
  v_incidents JSONB;
  v_memory JSONB;
  v_brand JSONB;
  v_recent_handoffs JSONB;
  v_project_rules JSONB;
BEGIN
  -- 1. Get brand rules and project config
  SELECT jsonb_build_object(
    'brand_colors', p.brand_colors,
    'brand_rules', p.brand_rules,
    'tech_stack', p.tech_stack,
    'gotchas', p.gotchas,
    'architecture_notes', p.architecture_notes
  ) INTO v_brand
  FROM brain_projects p
  WHERE p.id = p_project_id;

  -- 2. Get relevant knowledge entries (search by category + full text)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'key', k.key,
    'value', k.value,
    'category', k.category
  )), '[]'::jsonb) INTO v_knowledge
  FROM (
    SELECT key, value, category
    FROM brain_knowledge
    WHERE (project_id = p_project_id OR project_id IS NULL)
      AND (
        category = p_task_category
        OR category IN ('rule', 'protocol', 'technique')
        OR (p_task_description != '' AND 
            to_tsvector('english', key || ' ' || value) @@ 
            plainto_tsquery('english', p_task_description))
      )
    ORDER BY 
      CASE WHEN category = p_task_category THEN 0
           WHEN category = 'rule' THEN 1
           WHEN category = 'protocol' THEN 2
           ELSE 3
      END
    LIMIT 30
  ) k;

  -- 3. Get relevant learnings (mistakes to avoid)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'trigger', l.trigger_event,
    'lesson', l.lesson,
    'fix', l.fix_applied,
    'prevention', l.prevention,
    'severity', l.severity
  )), '[]'::jsonb) INTO v_learnings
  FROM (
    SELECT trigger_event, lesson, fix_applied, prevention, severity
    FROM brain_learnings
    WHERE is_active = true
      AND (project_id = p_project_id OR project_id IS NULL)
      AND (
        trigger_category = p_task_category
        OR severity IN ('critical', 'high')
        OR (p_task_description != '' AND 
            to_tsvector('english', trigger_event || ' ' || lesson) @@ 
            plainto_tsquery('english', p_task_description))
      )
    ORDER BY 
      CASE severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 ELSE 2 END,
      times_helped DESC
    LIMIT 10
  ) l;

  -- 4. Get active decisions that affect this project
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'title', d.title,
    'decision', d.decision,
    'reasoning', d.reasoning,
    'decided_by', d.decided_by
  )), '[]'::jsonb) INTO v_decisions
  FROM (
    SELECT title, decision, reasoning, decided_by
    FROM brain_decisions
    WHERE status = 'active'
      AND (project_id = p_project_id OR project_id IS NULL)
    ORDER BY decided_at DESC
    LIMIT 10
  ) d;

  -- 5. Get active incidents (things that are broken)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'title', i.title,
    'severity', i.severity,
    'status', i.status,
    'affected_files', i.affected_files
  )), '[]'::jsonb) INTO v_incidents
  FROM (
    SELECT title, severity, status, affected_files
    FROM brain_incidents
    WHERE status NOT IN ('resolved', 'closed')
      AND project_id = p_project_id
    ORDER BY 
      CASE severity WHEN 'P1' THEN 0 WHEN 'P2' THEN 1 ELSE 2 END
    LIMIT 5
  ) i;

  -- 6. Get recent memory from ALL bots about this project
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'bot', m.bot_id,
    'summary', m.summary,
    'decisions', m.decisions,
    'action_items', m.action_items
  )), '[]'::jsonb) INTO v_memory
  FROM (
    SELECT bot_id, summary, decisions, action_items
    FROM brain_memory_log
    WHERE (project_id = p_project_id OR project_id IS NULL)
      AND bot_id != p_bot_id  -- other bots' memories, not my own
    ORDER BY created_at DESC
    LIMIT 10
  ) m;

  -- 7. Get recent handoffs that might affect this work
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'from', h.bot_id,
    'message', h.message,
    'data', h.data,
    'time', h.created_at
  )), '[]'::jsonb) INTO v_recent_handoffs
  FROM (
    SELECT bot_id, message, data, created_at
    FROM brain_live
    WHERE event_type IN ('handoff', 'alert', 'discovery')
      AND created_at > NOW() - INTERVAL '24 hours'
    ORDER BY created_at DESC
    LIMIT 10
  ) h;

  -- Build the full context response
  result = jsonb_build_object(
    'project', COALESCE(v_brand, '{}'::jsonb),
    'knowledge', COALESCE(v_knowledge, '[]'::jsonb),
    'learnings', COALESCE(v_learnings, '[]'::jsonb),
    'decisions', COALESCE(v_decisions, '[]'::jsonb),
    'active_incidents', COALESCE(v_incidents, '[]'::jsonb),
    'team_memory', COALESCE(v_memory, '[]'::jsonb),
    'recent_handoffs', COALESCE(v_recent_handoffs, '[]'::jsonb),
    'meta', jsonb_build_object(
      'bot_id', p_bot_id,
      'project_id', p_project_id,
      'task_category', p_task_category,
      'generated_at', NOW()
    )
  );

  -- Log that this bot pulled context (for metrics)
  INSERT INTO brain_activity (project_id, bot_id, action, details, status)
  VALUES (p_project_id, p_bot_id, 'context_pull', 
    'Pulled task context for category: ' || p_task_category, 'completed')
  ON CONFLICT DO NOTHING;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_task_context IS 'THE main function. Call before ANY task. Returns: project config, relevant knowledge, past learnings, active decisions, incidents, team memory, and recent handoffs. One call = full context.';


-- ============================================================================
-- FUNCTION: get_build_rules()
-- 
-- Quick call to get just the rules/conventions for building.
-- Lighter than get_task_context for simple tasks.
-- ============================================================================
CREATE OR REPLACE FUNCTION get_build_rules(
  p_project_id TEXT,
  p_category TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'brand', jsonb_build_object(
      'colors', p.brand_colors,
      'rules', p.brand_rules
    ),
    'tech_stack', p.tech_stack,
    'rules', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('key', k.key, 'value', k.value)), '[]'::jsonb)
      FROM brain_knowledge k
      WHERE k.project_id = p_project_id
        AND (p_category IS NULL OR k.category = p_category OR k.category = 'rule')
      LIMIT 20
    )
  ) INTO result
  FROM brain_projects p
  WHERE p.id = p_project_id;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

COMMENT ON FUNCTION get_build_rules IS 'Quick lookup: brand rules, tech stack, and conventions for a project. Lighter than get_task_context.';


-- ============================================================================
-- FUNCTION: log_learning_quick()
-- 
-- Quick way to log a learning after making a mistake.
-- ============================================================================
CREATE OR REPLACE FUNCTION log_learning_quick(
  p_bot_id TEXT,
  p_project_id TEXT,
  p_what_happened TEXT,
  p_lesson TEXT,
  p_how_to_prevent TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'medium',
  p_category TEXT DEFAULT 'code'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO brain_learnings (
    bot_id, project_id, trigger_event, trigger_category,
    lesson, prevention, severity
  ) VALUES (
    p_bot_id, p_project_id, p_what_happened, p_category,
    p_lesson, p_how_to_prevent, p_severity
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION log_learning_quick IS 'Quick way to log a mistake/learning. Returns the learning ID.';


-- ============================================================================
-- FUNCTION: search_knowledge()
-- 
-- Full-text search across all knowledge entries.
-- ============================================================================
CREATE OR REPLACE FUNCTION search_knowledge(
  p_query TEXT,
  p_project_id TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 15
)
RETURNS TABLE(key TEXT, value TEXT, category TEXT, project_id TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT k.key, k.value, k.category, k.project_id
  FROM brain_knowledge k
  WHERE (p_project_id IS NULL OR k.project_id = p_project_id OR k.project_id IS NULL)
    AND (p_category IS NULL OR k.category = p_category)
    AND to_tsvector('english', k.key || ' ' || k.value) @@ plainto_tsquery('english', p_query)
  ORDER BY ts_rank(
    to_tsvector('english', k.key || ' ' || k.value),
    plainto_tsquery('english', p_query)
  ) DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION search_knowledge IS 'Full-text search across brain_knowledge. Search by query with optional project/category filters.';


-- ============================================================================
-- Add full-text search index on brain_knowledge if not exists
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON brain_knowledge 
  USING GIN(to_tsvector('english', key || ' ' || value));

CREATE INDEX IF NOT EXISTS idx_knowledge_project_cat ON brain_knowledge(project_id, category);


-- ============================================================================
-- DONE! Context Engine is live.
-- 
-- Usage:
--   Before ANY task:  SELECT get_task_context('denver', 'cardledger', 'rebuild landing page', 'frontend');
--   Quick rules:      SELECT get_build_rules('cardledger', 'design');
--   Search knowledge: SELECT * FROM search_knowledge('glass morphism card', 'cardledger');
--   Log mistake:      SELECT log_learning_quick('denver', 'cardledger', 'Used wrong color', 'Always check brand_colors first', 'Pull get_build_rules() before styling');
-- ============================================================================
