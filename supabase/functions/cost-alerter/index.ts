// Cost Alerter — Checks API costs against budgets, sends alerts
// Called via cron or webhook
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const alerts: string[] = [];

  try {
    // Get all budgets
    const { data: budgets } = await supabase.from("brain_cost_budgets").select("*");

    if (!budgets || budgets.length === 0) {
      return new Response(JSON.stringify({ message: "No budgets configured" }), { status: 200 });
    }

    for (const budget of budgets) {
      // Calculate period boundaries
      const now = new Date();
      let periodStart: Date;

      switch (budget.period) {
        case "daily":
          periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "weekly":
          const dayOfWeek = now.getDay();
          periodStart = new Date(now);
          periodStart.setDate(now.getDate() - dayOfWeek);
          periodStart.setHours(0, 0, 0, 0);
          break;
        case "monthly":
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          continue;
      }

      // Sum costs for this period
      let query = supabase
        .from("brain_api_logs")
        .select("cost_usd")
        .gte("created_at", periodStart.toISOString());

      if (budget.bot_id) query = query.eq("bot_id", budget.bot_id);
      if (budget.project_id) query = query.eq("project_id", budget.project_id);

      const { data: logs } = await query;
      const totalSpent = (logs || []).reduce((sum, l) => sum + (l.cost_usd || 0), 0);

      // Update spent amount
      await supabase
        .from("brain_cost_budgets")
        .update({ spent_usd: totalSpent, updated_at: new Date().toISOString() })
        .eq("id", budget.id);

      // Check threshold
      const pctUsed = (totalSpent / budget.budget_usd) * 100;

      if (pctUsed >= budget.alert_threshold_pct) {
        // Only alert if we haven't alerted in the last hour
        if (!budget.last_alert_at || new Date(budget.last_alert_at) < new Date(Date.now() - 3600000)) {
          const scope = budget.bot_id
            ? `Bot ${budget.bot_id}`
            : budget.project_id
            ? `Project ${budget.project_id}`
            : "Overall";

          const alertMsg = `💰 COST ALERT: ${scope} at ${pctUsed.toFixed(1)}% of ${budget.period} budget ($${totalSpent.toFixed(2)} / $${budget.budget_usd})`;

          alerts.push(alertMsg);

          // Post alert to brain_live
          await supabase.from("brain_live").insert({
            bot_id: "system",
            event_type: "alert",
            message: alertMsg,
            target_bot: budget.bot_id || "all",
            data: {
              type: "cost_alert",
              budget_id: budget.id,
              spent: totalSpent,
              budget: budget.budget_usd,
              pct: pctUsed,
              period: budget.period,
            },
          });

          // Update last alert time
          await supabase
            .from("brain_cost_budgets")
            .update({ last_alert_at: new Date().toISOString() })
            .eq("id", budget.id);
        }
      }
    }

    return new Response(
      JSON.stringify({
        checked: budgets.length,
        alerts_sent: alerts.length,
        alerts,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
});
