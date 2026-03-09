// Memory Curator — Runs daily to summarize old logs, extract SOPs, archive raw data
// Schedule: Daily at 2am EST via pg_cron or external cron
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";

interface MemoryLogEntry {
  id: string;
  bot_id: string;
  source: string;
  summary: string;
  decisions: string[];
  preferences: string[];
  action_items: string[];
  project_id: string;
  created_at: string;
}

async function summarizeWithClaude(entries: MemoryLogEntry[]): Promise<{
  summary: string;
  key_facts: string[];
  decisions: string[];
  lessons: string[];
}> {
  if (!ANTHROPIC_API_KEY) {
    // Fallback: simple concatenation
    return {
      summary: entries.map((e) => e.summary).join("\n"),
      key_facts: entries.flatMap((e) => e.action_items || []),
      decisions: entries.flatMap((e) => e.decisions || []),
      lessons: [],
    };
  }

  const prompt = `Analyze these bot memory log entries and create a concise summary.

ENTRIES:
${entries.map((e) => `[${e.bot_id}/${e.project_id}] ${e.summary}\nDecisions: ${(e.decisions || []).join(", ")}\nActions: ${(e.action_items || []).join(", ")}`).join("\n---\n")}

Return JSON with:
- summary: 2-3 sentence overview of what happened
- key_facts: array of important facts to remember (max 10)
- decisions: array of decisions that were made
- lessons: array of lessons learned or patterns noticed`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await resp.json();
  try {
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text, key_facts: [], decisions: [], lessons: [] };
  } catch {
    return {
      summary: entries.map((e) => e.summary).join(" | "),
      key_facts: [],
      decisions: entries.flatMap((e) => e.decisions || []),
      lessons: [],
    };
  }
}

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const results = { summaries_created: 0, entries_archived: 0, errors: [] as string[] };

  try {
    // Get unarchived entries older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: entries, error } = await supabase
      .from("brain_memory_log")
      .select("*")
      .is("archived_at", null)
      .lt("created_at", sevenDaysAgo)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;
    if (!entries || entries.length === 0) {
      return new Response(JSON.stringify({ message: "No entries to process", ...results }), {
        status: 200,
      });
    }

    // Group entries by bot_id + project_id
    const groups: Record<string, MemoryLogEntry[]> = {};
    for (const entry of entries) {
      const key = `${entry.bot_id}:${entry.project_id || "general"}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    }

    // Summarize each group
    for (const [groupKey, groupEntries] of Object.entries(groups)) {
      try {
        const [botId, projectId] = groupKey.split(":");
        const periodStart = groupEntries[0].created_at;
        const periodEnd = groupEntries[groupEntries.length - 1].created_at;

        // Summarize with Claude (or fallback)
        const { summary, key_facts, decisions, lessons } = await summarizeWithClaude(groupEntries);

        // Insert summary
        const { data: summaryData, error: summaryError } = await supabase
          .from("brain_memory_summaries")
          .insert({
            period_start: periodStart,
            period_end: periodEnd,
            bot_id: botId,
            project_id: projectId === "general" ? null : projectId,
            summary,
            key_facts,
            decisions_made: decisions,
            lessons_learned: lessons,
            raw_entry_count: groupEntries.length,
            raw_entry_ids: groupEntries.map((e) => e.id),
          })
          .select("id")
          .single();

        if (summaryError) {
          results.errors.push(`Summary error for ${groupKey}: ${summaryError.message}`);
          continue;
        }

        // Archive the raw entries
        const entryIds = groupEntries.map((e) => e.id);
        await supabase
          .from("brain_memory_log")
          .update({
            archived_at: new Date().toISOString(),
            summary_id: summaryData.id,
          })
          .in("id", entryIds);

        results.summaries_created++;
        results.entries_archived += entryIds.length;

        // Extract SOPs from lessons if patterns found
        if (lessons.length >= 2) {
          await supabase.from("brain_sops").insert({
            title: `SOP from ${botId} learnings (${new Date().toLocaleDateString()})`,
            category: "auto-extracted",
            description: `Auto-generated from ${groupEntries.length} memory entries`,
            steps: lessons.map((l, i) => ({ step: i + 1, action: l })),
            source_learnings: [],
            project_id: projectId === "general" ? null : projectId,
            created_by: "memory-curator",
            tags: ["auto-generated"],
          });
        }
      } catch (e) {
        results.errors.push(`Error processing ${groupKey}: ${(e as Error).message}`);
      }
    }

    // Log to brain_stream
    await supabase.rpc("log_stream_event", {
      p_actor_type: "system",
      p_actor_id: "memory-curator",
      p_event_type: "memory.curated",
      p_title: `Memory curator: ${results.summaries_created} summaries, ${results.entries_archived} entries archived`,
      p_importance: "normal",
      p_tags: ["memory", "maintenance"],
    });

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
});
