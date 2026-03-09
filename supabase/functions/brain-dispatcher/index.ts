// Brain Dispatcher — Routes database events to bots via Telegram
// Triggered by: Database Webhook on brain_queue, brain_tasks, brain_live, brain_handoffs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TELEGRAM_BOT_TOKENS: Record<string, string> = {
  vantixhq: Deno.env.get("TELEGRAM_BOT_TOKEN_VIX") || "",
  botskii: Deno.env.get("TELEGRAM_BOT_TOKEN_BOTSKII") || "",
  denver: Deno.env.get("TELEGRAM_BOT_TOKEN_DENVER") || "",
  vantix: Deno.env.get("TELEGRAM_BOT_TOKEN_VANTIX") || "",
};
const TELEGRAM_GROUP_ID = "-1003723286656";

const BOT_HANDLES: Record<string, string> = {
  vantixhq: "@VantixHQBot",
  botskii: "@Goatskiibot",
  denver: "@VantixDenverBot",
  vantix: "@usevantixbot",
};

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  old_record?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();
    const { type, table, record } = payload;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    let message = "";
    let targetBot = "";
    let priority = "normal";

    // Route based on table + event type
    switch (table) {
      case "brain_queue": {
        if (type === "INSERT") {
          targetBot = (record.assigned_to as string) || "all";
          priority = (record.priority as string) || "medium";
          message = `🎯 New task queued: *${record.title}*\nPriority: ${priority}\nProject: ${record.project_id || "none"}\nAssigned: ${BOT_HANDLES[targetBot] || "unassigned"}`;
        } else if (type === "UPDATE" && record.status === "failed") {
          message = `❌ Task FAILED: *${record.title}*\nError: ${record.last_error}\nRetries: ${record.retry_count}/${record.max_retries}`;
          targetBot = "all";
          priority = "high";
        }
        break;
      }

      case "brain_tasks": {
        if (type === "INSERT") {
          targetBot = (record.assigned_to as string) || "all";
          message = `📋 Task assigned to ${BOT_HANDLES[targetBot] || targetBot}: *${record.title}*\nPriority: ${record.priority}\nProject: ${record.project_id}`;
        } else if (type === "UPDATE" && record.status === "done") {
          message = `✅ Task completed: *${record.title}* by ${record.assigned_to}\nCommit: ${record.verified_commit || "pending"}`;
        }
        break;
      }

      case "brain_live": {
        const eventType = record.event_type as string;
        targetBot = (record.target_bot as string) || "all";

        if (eventType === "alert") {
          message = `🚨 ALERT from ${record.bot_id}: ${record.message}`;
          priority = "urgent";
        } else if (eventType === "handoff") {
          message = `🤝 Handoff from ${record.bot_id} → ${BOT_HANDLES[targetBot] || targetBot}: ${record.message}`;
        } else if (eventType === "request") {
          message = `📨 Request from ${record.bot_id}: ${record.message}`;
        }
        break;
      }

      case "brain_handoffs": {
        targetBot = (record.to_bot as string) || "all";
        message = `🤝 HANDOFF: ${record.from_bot} → ${BOT_HANDLES[targetBot] || targetBot}\nReason: ${record.reason}\nProject: ${record.project_id}\nContext: ${record.context || "see brain"}`;
        priority = "high";
        break;
      }

      case "brain_incidents": {
        message = `🚨 INCIDENT [${record.severity}]: *${record.title}*\n${record.description}\nProject: ${record.project_id}`;
        targetBot = "all";
        priority = "urgent";
        break;
      }

      default:
        return new Response(JSON.stringify({ skipped: true, table }), {
          status: 200,
        });
    }

    if (!message) {
      return new Response(JSON.stringify({ skipped: true, reason: "no message generated" }), {
        status: 200,
      });
    }

    // Log the dispatch
    await supabase.from("brain_event_dispatch").insert({
      event_source: table,
      event_action: type,
      record_id: String(record.id || ""),
      target_bot: targetBot,
      channel: "telegram",
      payload: { table, type, record_id: record.id, message },
      delivery_method: "telegram",
    });

    // Send to Telegram group (all bots monitor this)
    // Use Vix's token as the dispatcher
    const vixToken = TELEGRAM_BOT_TOKENS.vantixhq;
    if (vixToken) {
      const telegramUrl = `https://api.telegram.org/bot${vixToken}/sendMessage`;
      const telegramResp = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: "Markdown",
          disable_notification: priority === "normal",
        }),
      });

      const result = await telegramResp.json();

      // Mark as delivered
      await supabase
        .from("brain_event_dispatch")
        .update({ delivered: true, delivered_at: new Date().toISOString() })
        .eq("record_id", String(record.id || ""))
        .order("dispatched_at", { ascending: false })
        .limit(1);

      return new Response(JSON.stringify({ dispatched: true, telegram: result.ok }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ dispatched: false, reason: "no telegram token" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
});
