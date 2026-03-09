// Git Watcher — GitHub webhook receiver
// Logs commits, PRs, build failures to brain tables
// Setup: Add webhook URL to GitHub repo settings → Payload URL: https://obprrtqyzpaudfeyftyd.supabase.co/functions/v1/git-watcher
// Content type: application/json | Events: Pushes, Pull requests, Workflow runs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("GITHUB_WEBHOOK_SECRET") || "";

interface GitHubPushEvent {
  ref: string;
  commits: Array<{
    id: string;
    message: string;
    author: { name: string; username: string };
    added: string[];
    removed: string[];
    modified: string[];
  }>;
  repository: { full_name: string };
}

interface GitHubPREvent {
  action: string;
  pull_request: {
    number: number;
    title: string;
    state: string;
    user: { login: string };
    head: { sha: string };
    changed_files: number;
    additions: number;
    deletions: number;
    merged: boolean;
  };
  repository: { full_name: string };
}

interface GitHubWorkflowEvent {
  action: string;
  workflow_run: {
    conclusion: string;
    head_sha: string;
    name: string;
    html_url: string;
  };
  repository: { full_name: string };
}

Deno.serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const event = req.headers.get("x-github-event");
  const body = await req.json();

  try {
    switch (event) {
      case "push": {
        const push = body as GitHubPushEvent;
        const branch = push.ref.replace("refs/heads/", "");

        for (const commit of push.commits) {
          const filesChanged = [
            ...commit.added,
            ...commit.modified,
            ...commit.removed,
          ];

          // Map GitHub username to bot_id
          const botId = mapAuthorToBot(commit.author.username || commit.author.name);

          await supabase.from("brain_git_events").insert({
            repo: push.repository.full_name,
            branch,
            commit_sha: commit.id,
            commit_message: commit.message,
            author: botId,
            files_changed: filesChanged,
            lines_added: commit.added.length + commit.modified.length,
            lines_deleted: commit.removed.length,
          });

          // Log to stream
          await supabase.rpc("log_stream_event", {
            p_actor_type: "bot",
            p_actor_id: botId,
            p_event_type: "git.push",
            p_title: `Commit: ${commit.message.substring(0, 80)}`,
            p_details: `${filesChanged.length} files changed on ${branch}`,
            p_project_id: mapRepoToProject(push.repository.full_name),
            p_tags: ["git", "commit"],
            p_importance: branch === "main" ? "high" : "normal",
            p_idempotency_key: `commit:${commit.id}`,
          });
        }

        return new Response(
          JSON.stringify({ processed: push.commits.length }),
          { status: 200 }
        );
      }

      case "pull_request": {
        const pr = body as GitHubPREvent;
        const botId = mapAuthorToBot(pr.pull_request.user.login);

        await supabase.from("brain_git_events").insert({
          repo: pr.repository.full_name,
          branch: "pr",
          commit_sha: pr.pull_request.head.sha,
          commit_message: `PR #${pr.pull_request.number}: ${pr.pull_request.title}`,
          author: botId,
          pr_number: pr.pull_request.number,
          pr_status: pr.pull_request.merged ? "merged" : pr.pull_request.state,
          lines_added: pr.pull_request.additions,
          lines_deleted: pr.pull_request.deletions,
        });

        // Auto-create review request
        if (pr.action === "opened" || pr.action === "ready_for_review") {
          // Find best reviewer (not the author)
          const { data: bots } = await supabase
            .from("brain_bots")
            .select("id")
            .neq("id", botId)
            .eq("status", "online")
            .limit(1);

          if (bots && bots.length > 0) {
            await supabase.from("brain_reviews").insert({
              project_id: mapRepoToProject(pr.repository.full_name),
              author_bot: botId,
              reviewer_bot: bots[0].id,
              commit_hash: pr.pull_request.head.sha,
              summary: pr.pull_request.title,
              review_status: "pending",
            });
          }
        }

        return new Response(JSON.stringify({ pr: pr.pull_request.number }), {
          status: 200,
        });
      }

      case "workflow_run": {
        const wf = body as GitHubWorkflowEvent;

        if (wf.workflow_run.conclusion === "failure") {
          // Auto-create incident for build failures
          await supabase.from("brain_incidents").insert({
            project_id: mapRepoToProject(wf.repository.full_name),
            title: `Build failed: ${wf.workflow_run.name}`,
            description: `Workflow "${wf.workflow_run.name}" failed.\nCommit: ${wf.workflow_run.head_sha}\nURL: ${wf.workflow_run.html_url}`,
            severity: "major",
            category: "build_failure",
            status: "open",
            detected_by: "git-watcher",
          });
        }

        // Update git event with build status
        await supabase
          .from("brain_git_events")
          .update({ build_status: wf.workflow_run.conclusion })
          .eq("commit_sha", wf.workflow_run.head_sha);

        return new Response(
          JSON.stringify({ conclusion: wf.workflow_run.conclusion }),
          { status: 200 }
        );
      }

      case "ping": {
        return new Response(JSON.stringify({ pong: true }), { status: 200 });
      }

      default:
        return new Response(
          JSON.stringify({ skipped: true, event }),
          { status: 200 }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
});

function mapAuthorToBot(username: string): string {
  const mapping: Record<string, string> = {
    AidanFromm: "botskii", // Aidan's commits often through Botskii
    vantixhq: "vantixhq",
    VantixHQ: "vantixhq",
    denver: "denver",
    usevantix: "vantix",
    justfourkicks: "vantix",
  };
  return mapping[username] || username;
}

function mapRepoToProject(fullName: string): string {
  const mapping: Record<string, string> = {
    "AidanFromm/card-ledger": "cardledger",
    "AidanFromm/Mixzo": "mixzokickz",
    "AidanFromm/vantix": "vantix",
    "AidanFromm/Dave-App": "securedtampa",
    "AidanFromm/Sports": "sportsbots",
    "AidanFromm/Horizon-Asphalt": "horizon",
    "justfourkicksllc/justfourkicks": "j4k",
  };
  return mapping[fullName] || fullName;
}
