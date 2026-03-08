-- Fix: brain_activity doesn't have a 'status' column
-- Replace the INSERT at the end of get_task_context

CREATE OR REPLACE FUNCTION get_task_context(
  p_bot_id TEXT,
  p_project_id TEXT,
  p_task_description TEXT DEFAULT '',
  p_task_category TEXT DEFAULT 'general'
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

  -- 2. Get relevant knowledge entries
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

  -- 4. Get active decisions
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

  -- 5. Get active incidents
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

  -- 6. Get recent memory from ALL bots
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
      AND bot_id != p_bot_id
    ORDER BY created_at DESC
    LIMIT 10
  ) m;

  -- 7. Get recent handoffs
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

  -- Build full context
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

  -- Log context pull (fixed: no 'status' column)
  INSERT INTO brain_activity (project_id, bot_id, action, details)
  VALUES (p_project_id, p_bot_id, 'context_pull', 
    'Pulled task context for category: ' || p_task_category);

  RETURN result;
END;
$$;
