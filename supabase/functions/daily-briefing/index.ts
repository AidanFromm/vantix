// Daily Briefing — Generates morning summary and posts to Telegram
// Called by pg_cron daily at 8am EST or manually
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN_VIX") || "";
const TELEGRAM_GROUP_ID = "-1003723286656";

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Generate briefing via RPC
    const { data: briefing, error } = await supabase.rpc("generate_daily_briefing");
    if (error) throw error;

    // Get additional context
    const { data: overview } = await supabase.from("brain_overview").select("*").single();
    const { data: botComparison } = await supabase.from("brain_bot_comparison").select("*");
    const { data: pendingTasks } = await supabase
      .from("brain_tasks")
      .select("title, assigned_to, priority, project_id")
      .in("status", ["pending", "in_progress"])
      .order("priority")
      .limit(10);

    const { data: recentIncidents } = await supabase
      .from("brain_incidents")
      .select("title, severity, status")
      .in("status", ["open", "acknowledged"])
      .limit(5);

    const { data: costData } = await supabase
      .from("brain_token_usage")
      .select("*");

    // Build the message
    let message = `📊 *VANTIX DAILY BRIEFING — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}*\n\n`;

    if (overview) {
      message += `*System Status:*\n`;
      message += `🤖 ${overview.active_bots} bots active\n`;
      message += `✅ ${overview.tasks_completed_24h} tasks completed (24h)\n`;
      message += `📋 ${overview.tasks_pending} pending | ${overview.tasks_in_progress} in progress\n`;
      message += `💻 ${overview.commits_24h} commits | 🚀 ${overview.deploys_24h} deploys\n`;
      if (overview.open_incidents > 0) {
        message += `🚨 ${overview.open_incidents} open incidents\n`;
      }
      if (overview.cost_24h) {
        message += `💰 $${Number(overview.cost_24h).toFixed(2)} spent (24h)\n`;
      }
      message += `\n`;
    }

    // Bot performance
    if (botComparison && botComparison.length > 0) {
      message += `*Bot Performance (30d):*\n`;
      for (const bot of botComparison) {
        const statusEmoji = bot.status === "online" ? "🟢" : bot.status === "idle" ? "🟡" : "🔴";
        message += `${statusEmoji} ${bot.name}: ${bot.tasks_completed_30d} tasks, ${bot.commits_30d} commits`;
        if (bot.cost_30d > 0) message += `, $${Number(bot.cost_30d).toFixed(2)}`;
        message += `\n`;
      }
      message += `\n`;
    }

    // Pending work
    if (pendingTasks && pendingTasks.length > 0) {
      message += `*Pending Work:*\n`;
      for (const task of pendingTasks.slice(0, 5)) {
        const priorityEmoji = task.priority === "critical" ? "🔴" : task.priority === "high" ? "🟠" : "🟡";
        message += `${priorityEmoji} ${task.title} → ${task.assigned_to || "unassigned"}\n`;
      }
      if (pendingTasks.length > 5) {
        message += `...and ${pendingTasks.length - 5} more\n`;
      }
      message += `\n`;
    }

    // Incidents
    if (recentIncidents && recentIncidents.length > 0) {
      message += `*⚠️ Open Incidents:*\n`;
      for (const inc of recentIncidents) {
        message += `• [${inc.severity}] ${inc.title}\n`;
      }
      message += `\n`;
    }

    message += `_Brain: ${overview?.total_knowledge || 0} knowledge entries, ${overview?.active_learnings || 0} learnings, ${overview?.active_sops || 0} SOPs_`;

    // Send to Telegram
    if (TELEGRAM_BOT_TOKEN) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    }

    // Log to stream
    await supabase.rpc("log_stream_event", {
      p_actor_type: "system",
      p_actor_id: "daily-briefing",
      p_event_type: "briefing.generated",
      p_title: "Daily briefing generated and sent",
      p_importance: "normal",
      p_tags: ["briefing", "daily"],
    });

    return new Response(
      JSON.stringify({ sent: true, briefing, message_length: message.length }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
});
