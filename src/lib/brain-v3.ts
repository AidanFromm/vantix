import { supabase } from './supabase-client';

export interface Agent {
  id: string;
  display_name: string;
  role: string;
  status: string;
  current_task: string | null;
  current_project: string | null;
  workload_score: number;
  last_heartbeat: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  goal_type: string;
  target_metric: string;
  target_value: number;
  current_value: number;
  deadline: string;
  progress: number;
  status: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  priority: string;
  status: string;
  project_id: string;
  estimated_hours: number;
  deadline: string;
}

export interface Decision {
  id: string;
  title: string;
  bot_id: string;
  decision_type: string;
  chosen_option: string;
  reasoning: string;
  outcome_status: string;
  confidence: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  learned_by: string;
  applies_to: string;
  times_prevented: number;
}

export interface ChatLogEntry {
  id: string;
  bot_id: string;
  message: string;
  channel: string;
  created_at: string;
}

export async function fetchTeamStatus(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('v3_agents')
    .select('id, display_name, role, status, current_task, current_project, workload_score, last_heartbeat');
  if (error) throw error;
  return data || [];
}

export async function fetchGoals(): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('v3_goals')
    .select('*')
    .eq('status', 'active');
  if (error) throw error;
  return data || [];
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('v3_tasks')
    .select('*')
    .neq('status', 'done');
  if (error) throw error;
  return data || [];
}

export async function fetchDecisions(): Promise<Decision[]> {
  const { data, error } = await supabase
    .from('v3_decisions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data || [];
}

export async function fetchLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('v3_lessons')
    .select('*')
    .eq('active', true);
  if (error) throw error;
  return data || [];
}

export async function fetchEvents(): Promise<ChatLogEntry[]> {
  const { data, error } = await supabase
    .from('v3_chat_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}
