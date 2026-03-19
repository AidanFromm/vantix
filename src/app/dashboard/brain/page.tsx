'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Target,
  ListTodo,
  GitBranch,
  Lightbulb,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Zap,
  Filter,
} from 'lucide-react';
import {
  fetchTeamStatus,
  fetchGoals,
  fetchTasks,
  fetchDecisions,
  fetchLessons,
  fetchEvents,
  type Agent,
  type Goal,
  type Task,
  type Decision,
  type Lesson,
  type ChatLogEntry,
} from '@/lib/brain-v3';

// ─── Helpers ──────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const statusColor: Record<string, string> = {
  online: '#22c55e',
  busy: '#f59e0b',
  offline: '#9ca3af',
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  P0: { label: 'P0', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  P1: { label: 'P1', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  P2: { label: 'P2', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  P3: { label: 'P3', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
};

const goalStatusColor: Record<string, string> = {
  active: '#22c55e',
  behind: '#ef4444',
  at_risk: '#f59e0b',
};

const severityColor: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#9ca3af',
};

const taskStatusTabs = ['all', 'todo', 'in_progress', 'review'] as const;
type TaskFilter = (typeof taskStatusTabs)[number];

// ─── Skeleton ─────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#E3D9CD]/60 ${className}`}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#B07A45]/10 flex items-center justify-center">
        <Icon size={16} className="text-[#B07A45]" />
      </div>
      <h2 className="text-lg font-bold text-[#1C1C1C]">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs font-medium text-[#7A746C] bg-[#EEE6DC] px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────

export default function BrainV3Page() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [events, setEvents] = useState<ChatLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');

  const loadAll = useCallback(async () => {
    try {
      const [a, g, t, d, l, e] = await Promise.all([
        fetchTeamStatus(),
        fetchGoals(),
        fetchTasks(),
        fetchDecisions(),
        fetchLessons(),
        fetchEvents(),
      ]);
      setAgents(a);
      setGoals(g);
      setTasks(t);
      setDecisions(d);
      setLessons(l);
      setEvents(e);
    } catch (err) {
      console.error('Brain V3 fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 30_000);
    return () => clearInterval(interval);
  }, [loadAll]);

  const filteredTasks = taskFilter === 'all' ? tasks : tasks.filter((t) => t.status === taskFilter);

  // Group lessons by category
  const lessonsByCategory = lessons.reduce<Record<string, Lesson[]>>((acc, l) => {
    const cat = l.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(l);
    return acc;
  }, {});

  const botNameMap = agents.reduce<Record<string, string>>((acc, a) => {
    acc[a.id] = a.display_name;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Brain V3 Command Center</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Real-time overview of your AI team, goals, tasks, and decisions
        </p>
      </motion.div>

      {/* ─── Team Status ──────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Cpu} title="Team Status" count={agents.length} />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-2xl p-5 hover:border-[#B07A45]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B07A45] to-[#8E5E34] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {agent.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1C1C1C] truncate">{agent.display_name}</p>
                  <p className="text-xs text-[#7A746C] truncate">{agent.role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColor[agent.status] || '#9ca3af' }}
                  />
                  <span className="text-[10px] font-medium text-[#7A746C] capitalize">{agent.status}</span>
                </div>
              </div>

              {agent.current_task && (
                <div className="mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-[#7A746C] mb-0.5">Current Task</p>
                  <p className="text-xs text-[#1C1C1C] truncate">{agent.current_task}</p>
                </div>
              )}

              {agent.current_project && (
                <div className="mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-[#7A746C] mb-0.5">Project</p>
                  <p className="text-xs text-[#1C1C1C] truncate">{agent.current_project}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E3D9CD]">
                <div className="flex items-center gap-1 text-[10px] text-[#7A746C]">
                  <Zap size={10} />
                  <span>Load: {agent.workload_score ?? 0}%</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#7A746C]">
                  <Clock size={10} />
                  <span>{agent.last_heartbeat ? timeAgo(agent.last_heartbeat) : 'n/a'}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {agents.length === 0 && (
            <p className="text-sm text-[#7A746C] col-span-full py-8 text-center">No agents found</p>
          )}
        </div>
      </section>

      {/* ─── Active Goals ─────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Target} title="Active Goals" count={goals.length} />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map((goal, i) => {
            const pct = goal.target_value > 0
              ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
              : (goal.progress ?? 0);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-2xl p-5 hover:border-[#B07A45]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#1C1C1C] leading-snug">{goal.title}</h3>
                  <span
                    className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      color: goalStatusColor[goal.status] || '#7A746C',
                      backgroundColor: `${goalStatusColor[goal.status] || '#7A746C'}18`,
                    }}
                  >
                    {goal.status?.replace('_', ' ')}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-xs text-[#7A746C] mb-3 line-clamp-2">{goal.description}</p>
                )}

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] text-[#7A746C] mb-1">
                    <span>{goal.target_metric || 'Progress'}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E3D9CD]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: goalStatusColor[goal.status] || '#B07A45',
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#7A746C]">
                  <span>{goal.current_value ?? 0} / {goal.target_value ?? '—'}</span>
                  {goal.deadline && <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>}
                </div>
              </motion.div>
            );
          })}
          {goals.length === 0 && (
            <p className="text-sm text-[#7A746C] col-span-full py-8 text-center">No active goals</p>
          )}
        </div>
      </section>

      {/* ─── Task Queue ───────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={ListTodo} title="Task Queue" count={tasks.length} />

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4 flex-wrap">
          <Filter size={14} className="text-[#7A746C] mr-1" />
          {taskStatusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTaskFilter(tab)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                taskFilter === tab
                  ? 'bg-[#B07A45] text-white'
                  : 'bg-[#EEE6DC] text-[#7A746C] hover:text-[#1C1C1C]'
              }`}
            >
              {tab === 'all' ? 'All' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredTasks.map((task, i) => {
            const pri = priorityConfig[task.priority] || priorityConfig.P3;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-xl px-5 py-3.5 hover:border-[#B07A45]/30 transition-colors flex items-center gap-4"
              >
                {/* Priority badge */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{ color: pri.color, backgroundColor: pri.bg }}
                >
                  {pri.label}
                </span>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1C] truncate">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-[#7A746C] truncate mt-0.5">{task.description}</p>
                  )}
                </div>

                {/* Assigned */}
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B07A45] to-[#8E5E34] flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">
                      {(botNameMap[task.assigned_to] || task.assigned_to || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-[#7A746C]">
                    {botNameMap[task.assigned_to] || task.assigned_to || '—'}
                  </span>
                </div>

                {/* Status */}
                <span className="text-[10px] font-medium text-[#7A746C] bg-[#EEE6DC] px-2 py-0.5 rounded-full flex-shrink-0 capitalize">
                  {task.status?.replace('_', ' ')}
                </span>

                {/* Deadline */}
                {task.deadline && (
                  <span className="hidden md:block text-[10px] text-[#7A746C] flex-shrink-0">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </motion.div>
            );
          })}
          {filteredTasks.length === 0 && (
            <p className="text-sm text-[#7A746C] py-8 text-center">No tasks matching filter</p>
          )}
        </div>
      </section>

      {/* ─── Two-column: Decisions + Lessons ──────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Decisions */}
        <section>
          <SectionHeader icon={GitBranch} title="Recent Decisions" count={decisions.length} />
          <div className="space-y-3">
            {decisions.map((dec, i) => (
              <motion.div
                key={dec.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-xl p-4 hover:border-[#B07A45]/30 transition-colors relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[7px] top-5 w-3 h-3 rounded-full border-2 border-[#B07A45] bg-[var(--color-bg)]" />

                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="text-sm font-semibold text-[#1C1C1C] leading-snug">{dec.title}</h4>
                  {dec.outcome_status && (
                    <span className="flex-shrink-0 ml-2">
                      {dec.outcome_status === 'success' ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                      ) : dec.outcome_status === 'failed' ? (
                        <AlertCircle size={14} className="text-red-500" />
                      ) : (
                        <Circle size={14} className="text-[#7A746C]" />
                      )}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#7A746C] mb-2">
                  <span className="font-medium text-[#B07A45]">{botNameMap[dec.bot_id] || dec.bot_id}</span>
                  {dec.decision_type && <> &middot; {dec.decision_type}</>}
                </p>

                {dec.chosen_option && (
                  <p className="text-xs text-[#1C1C1C] mb-1">
                    <span className="text-[#7A746C]">Chose:</span> {dec.chosen_option}
                  </p>
                )}
                {dec.reasoning && (
                  <p className="text-xs text-[#7A746C] line-clamp-2">{dec.reasoning}</p>
                )}

                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#E3D9CD]">
                  {dec.confidence != null && (
                    <span className="text-[10px] text-[#7A746C]">
                      Confidence: {Math.round(dec.confidence * 100)}%
                    </span>
                  )}
                  <span className="text-[10px] text-[#7A746C] ml-auto">
                    {dec.created_at ? timeAgo(dec.created_at) : ''}
                  </span>
                </div>
              </motion.div>
            ))}
            {decisions.length === 0 && (
              <p className="text-sm text-[#7A746C] py-8 text-center">No recent decisions</p>
            )}
          </div>
        </section>

        {/* Lessons Learned */}
        <section>
          <SectionHeader icon={Lightbulb} title="Lessons Learned" count={lessons.length} />
          <div className="space-y-4">
            {Object.entries(lessonsByCategory).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[#7A746C] mb-2">{cat}</p>
                <div className="space-y-2">
                  {items.map((lesson, i) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-xl p-4 hover:border-[#B07A45]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-semibold text-[#1C1C1C] leading-snug">{lesson.title}</h4>
                        <span
                          className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                          style={{
                            color: severityColor[lesson.severity] || '#7A746C',
                            backgroundColor: `${severityColor[lesson.severity] || '#7A746C'}18`,
                          }}
                        >
                          {lesson.severity}
                        </span>
                      </div>
                      {lesson.description && (
                        <p className="text-xs text-[#7A746C] line-clamp-2 mb-2">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-[10px] text-[#7A746C]">
                        {lesson.learned_by && (
                          <span>By: <span className="text-[#B07A45]">{botNameMap[lesson.learned_by] || lesson.learned_by}</span></span>
                        )}
                        {lesson.times_prevented > 0 && (
                          <span>Prevented: {lesson.times_prevented}x</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <p className="text-sm text-[#7A746C] py-8 text-center">No lessons recorded</p>
            )}
          </div>
        </section>
      </div>

      {/* ─── Live Events ──────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Activity} title="Live Events" count={events.length} />
        <div className="bg-[var(--color-card)] border border-[#E3D9CD] rounded-2xl divide-y divide-[#E3D9CD] overflow-hidden">
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="px-5 py-3 flex items-start gap-3 hover:bg-[#EEE6DC]/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B07A45] to-[#8E5E34] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-white">
                  {(botNameMap[ev.bot_id] || ev.bot_id || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#1C1C1C]">
                  <span className="font-semibold text-[#B07A45]">
                    {botNameMap[ev.bot_id] || ev.bot_id}
                  </span>
                  {ev.channel && (
                    <span className="text-[#7A746C]"> in #{ev.channel}</span>
                  )}
                </p>
                <p className="text-xs text-[#7A746C] mt-0.5 line-clamp-2">{ev.message}</p>
              </div>
              <span className="text-[10px] text-[#7A746C] flex-shrink-0 whitespace-nowrap">
                {ev.created_at ? timeAgo(ev.created_at) : ''}
              </span>
            </motion.div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-[#7A746C] py-8 text-center">No recent events</p>
          )}
        </div>
      </section>
    </div>
  );
}
