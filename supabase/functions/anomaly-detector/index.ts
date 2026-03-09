// Anomaly Detector — Hourly health check for cost spikes, missing bots, failed deploys
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface Anomaly {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  data: Record<string, unknown>;
}

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const anomalies: Anomaly[] = [];

  try {
    // 1. Check for cost spikes (2x average)
    const { data: recentCosts } = await supabase
      .from("brain_api_logs")
      .select("bot_id, cost_usd")
      .gte("created_at", new Date(Date.now() - 3600000).toISOString()); // last hour

    const { data: avgCosts } = await supabase
      .from("brain_api_logs")
      .select("bot_id, cost_usd")
      .gte("created_at", new Date(Date.now() - 24 * 3600000).toISOString());

    if (recentCosts && avgCosts) {
      const hourlyByBot: Record<string, number> = {};
      for (const log of recentCosts) {
        hourlyByBot[log.bot_id] = (hourlyByBot[log.bot_id] || 0) + (log.cost_usd || 0);
      }

      const dailyByBot: Record<string, number> = {};
      for (const log of avgCosts) {
        dailyByBot[log.bot_id] = (dailyByBot[log.bot_id] || 0) + (log.cost_usd || 0);
      }

      for (const [bot, hourlyCost] of Object.entries(hourlyByBot)) {
        const avgHourly = (dailyByBot[bot] || 0) / 24;
        if (avgHourly > 0 && hourlyCost > avgHourly * 3) {
          anomalies.push({
            type: "cost_spike",
            severity: hourlyCost > avgHourly * 5 ? "critical" : "high",
            message: `${bot} cost spike: $${hourlyCost.toFixed(4)}/hr vs avg $${avgHourly.toFixed(4)}/hr`,
            data: { bot, hourly_cost: hourlyCost, avg_hourly: avgHourly },
          });
        }
      }
    }

    // 2. Check for missing bots (no heartbeat in 30 min)
    const { data: bots } = await supabase
      .from("brain_bots")
      .select("id, name, last_seen_at, status")
      .neq("status", "offline");

    if (bots) {
      const thirtyMinAgo = new Date(Date.now() - 30 * 60000);
      for (const bot of bots) {
        if (bot.last_seen_at && new Date(bot.last_seen_at) < thirtyMinAgo) {
          const minutesAgo = Math.round((Date.now() - new Date(bot.last_seen_at).getTime()) / 60000);
          anomalies.push({
            type: "bot_stale",
            severity: minutesAgo > 120 ? "high" : "medium",
            message: `${bot.name} hasn't checked in for ${minutesAgo} minutes`,
            data: { bot_id: bot.id, last_seen: bot.last_seen_at, minutes_ago: minutesAgo },
          });
        }
      }
    }

    // 3. Check for failed deployments (last hour)
    const { data: failedDeploys } = await supabase
      .from("brain_deployments")
      .select("*")
      .eq("status", "failed")
      .gte("deployed_at", new Date(Date.now() - 3600000).toISOString());

    if (failedDeploys) {
      for (const deploy of failedDeploys) {
        anomalies.push({
          type: "deploy_failed",
          severity: "high",
          message: `Failed deploy: ${deploy.project_id} by ${deploy.bot_id}`,
          data: { project: deploy.project_id, commit: deploy.commit_hash },
        });
      }
    }

    // 4. Check for tasks stuck in_progress too long (> 2 hours)
    const { data: stuckTasks } = await supabase
      .from("brain_tasks")
      .select("id, title, assigned_to, started_at")
      .eq("status", "in_progress")
      .lt("started_at", new Date(Date.now() - 2 * 3600000).toISOString());

    if (stuckTasks) {
      for (const task of stuckTasks) {
        const hoursStuck = Math.round((Date.now() - new Date(task.started_at).getTime()) / 3600000);
        anomalies.push({
          type: "task_stuck",
          severity: hoursStuck > 6 ? "high" : "medium",
          message: `Task stuck ${hoursStuck}h: "${task.title}" (${task.assigned_to})`,
          data: { task_id: task.id, hours: hoursStuck },
        });
      }
    }

    // 5. Check for high error rates (> 20% in last hour)
    if (recentCosts && recentCosts.length > 10) {
      const { data: errors } = await supabase
        .from("brain_api_logs")
        .select("status")
        .gte("created_at", new Date(Date.now() - 3600000).toISOString())
        .eq("status", "error");

      if (errors) {
        const errorRate = errors.length / recentCosts.length;
        if (errorRate > 0.2) {
          anomalies.push({
            type: "high_error_rate",
            severity: errorRate > 0.5 ? "critical" : "high",
            message: `API error rate: ${(errorRate * 100).toFixed(1)}% (${errors.length}/${recentCosts.length})`,
            data: { error_rate: errorRate, errors: errors.length, total: recentCosts.length },
          });
        }
      }
    }

    // Post anomalies to brain_live
    for (const anomaly of anomalies) {
      await supabase.from("brain_live").insert({
        bot_id: "anomaly-detector",
        event_type: "alert",
        message: `🔍 ANOMALY [${anomaly.severity}]: ${anomaly.message}`,
        target_bot: "all",
        data: anomaly,
      });
    }

    // Create incidents for critical anomalies
    for (const anomaly of anomalies.filter((a) => a.severity === "critical")) {
      await supabase.from("brain_incidents").insert({
        title: `Auto-detected: ${anomaly.message}`,
        description: JSON.stringify(anomaly.data, null, 2),
        severity: "critical",
        category: anomaly.type,
        status: "open",
        detected_by: "anomaly-detector",
      });
    }

    return new Response(
      JSON.stringify({
        anomalies_found: anomalies.length,
        anomalies,
        checked_at: new Date().toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
});
