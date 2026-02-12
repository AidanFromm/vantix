'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  User,
  AlertTriangle,
  Clock,
  CheckCircle2,
  BarChart3,
  Tag,
} from 'lucide-react';

// --- Types ---

type Column = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Assignee = 'Kyle' | 'Aidan' | 'Vantix' | 'Botskii';

interface Task {
  id: string;
  title: string;
  description: string;
  column: Column;
  assignee: Assignee;
  priority: Priority;
  dueDate: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

// --- Constants ---

const STORAGE_KEY = 'vantix_tasks';
const COLUMNS: { key: Column; label: string }[] = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

const ASSIGNEES: Assignee[] = ['Kyle', 'Aidan', 'Vantix', 'Botskii'];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; border: string; bg: string }> = {
  low: { label: 'Low', color: 'text-gray-400', border: 'border-l-gray-500', bg: 'bg-gray-500/10' },
  medium: { label: 'Medium', color: 'text-yellow-400', border: 'border-l-yellow-500', bg: 'bg-yellow-500/10' },
  high: { label: 'High', color: 'text-orange-400', border: 'border-l-orange-500', bg: 'bg-orange-500/10' },
  urgent: { label: 'Urgent', color: 'text-red-400', border: 'border-l-red-500', bg: 'bg-red-500/10' },
};

const ASSIGNEE_COLORS: Record<Assignee, string> = {
  Kyle: 'bg-purple-500/20 text-purple-400',
  Aidan: 'bg-blue-500/20 text-blue-400',
  Vantix: 'bg-emerald-500/20 text-emerald-400',
  Botskii: 'bg-cyan-500/20 text-cyan-400',
};

const DEFAULT_TAGS = ['frontend', 'backend', 'design', 'bug', 'feature', 'ops', 'docs'];

const defaultTasks: Task[] = [];

// --- Helpers ---

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // migrate old format
      if (parsed.length > 0 && 'status' in parsed[0] && !('column' in parsed[0])) {
        return parsed.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          column: t.status === 'done' ? 'done' as Column : 'todo' as Column,
          assignee: t.assignee === 'bot1' ? 'Vantix' : t.assignee === 'bot2' ? 'Botskii' : 'Kyle',
          priority: t.priority || 'medium',
          dueDate: '',
          tags: [],
          createdAt: t.createdAt || new Date().toISOString().split('T')[0],
          completedAt: t.status === 'done' ? t.createdAt : undefined,
        }));
      }
      return parsed;
    }
  } catch { /* fallback */ }
  return defaultTasks;
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.column === 'done') return false;
  return new Date(task.dueDate) < new Date(new Date().toISOString().split('T')[0]);
}

function isCompletedThisWeek(task: Task): boolean {
  if (!task.completedAt) return false;
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return new Date(task.completedAt) >= weekAgo;
}

// --- Components ---

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-[#111] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  colIndex,
  totalCols,
  onMove,
  onDelete,
}: {
  task: Task;
  colIndex: number;
  totalCols: number;
  onMove: (id: string, direction: 'left' | 'right') => void;
  onDelete: (id: string) => void;
}) {
  const prio = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative p-3 rounded-lg border-l-[3px] ${prio.border} bg-[#111] border border-white/[0.06] hover:border-white/[0.12] transition-colors ${overdue ? 'ring-1 ring-red-500/40' : ''}`}
    >
      {overdue && (
        <div className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-0.5">
          <AlertTriangle size={10} className="text-white" />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
        <button
          onClick={() => onDelete(task.id)}
          className="p-0.5 opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${ASSIGNEE_COLORS[task.assignee]}`}>
          {task.assignee}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${prio.bg} ${prio.color}`}>
          {prio.label}
        </span>
        {task.tags.map(tag => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-500">
            {tag}
          </span>
        ))}
      </div>
      {task.dueDate && (
        <p className={`text-[10px] mt-1.5 ${overdue ? 'text-red-400' : 'text-neutral-600'}`}>
          Due: {task.dueDate}
        </p>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
        <button
          onClick={() => onMove(task.id, 'left')}
          disabled={colIndex === 0}
          className="p-1 rounded hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} className="text-neutral-400" />
        </button>
        <button
          onClick={() => onMove(task.id, 'right')}
          disabled={colIndex === totalCols - 1}
          className="p-1 rounded hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} className="text-neutral-400" />
        </button>
      </div>
    </motion.div>
  );
}

// --- Main ---

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<Assignee | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [myTasksMode, setMyTasksMode] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: 'Kyle' as Assignee,
    priority: 'medium' as Priority,
    dueDate: '',
    tags: [] as string[],
  });

  useEffect(() => {
    setTasks(loadTasks());
    setLoaded(true);
  }, []);

  const save = useCallback((updated: Task[]) => {
    setTasks(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  }, []);

  const moveTask = useCallback((id: string, direction: 'left' | 'right') => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== id) return t;
        const idx = COLUMNS.findIndex(c => c.key === t.column);
        const newIdx = direction === 'left' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= COLUMNS.length) return t;
        const newCol = COLUMNS[newIdx].key;
        return {
          ...t,
          column: newCol,
          completedAt: newCol === 'done' ? new Date().toISOString().split('T')[0] : undefined,
        };
      });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    save(tasks.filter(t => t.id !== id));
  }, [tasks, save]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    save([
      {
        id: Date.now().toString(),
        ...newTask,
        column: 'todo',
        createdAt: new Date().toISOString().split('T')[0],
      },
      ...tasks,
    ]);
    setNewTask({ title: '', description: '', assignee: 'Kyle', priority: 'medium', dueDate: '', tags: [] });
    setShowAdd(false);
  };

  const toggleTag = (tag: string) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const filtered = useMemo(() => {
    let f = tasks;
    if (myTasksMode) f = f.filter(t => t.assignee === 'Kyle');
    if (filterAssignee !== 'all') f = f.filter(t => t.assignee === filterAssignee);
    if (filterPriority !== 'all') f = f.filter(t => t.priority === filterPriority);
    if (filterTag !== 'all') f = f.filter(t => t.tags.includes(filterTag));
    return f;
  }, [tasks, filterAssignee, filterPriority, filterTag, myTasksMode]);

  const stats = useMemo(() => ({
    total: tasks.length,
    inProgress: tasks.filter(t => t.column === 'in_progress').length,
    completedWeek: tasks.filter(isCompletedThisWeek).length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach(t => t.tags.forEach(tag => s.add(tag)));
    return Array.from(s).sort();
  }, [tasks]);

  if (!loaded) return null;

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Task Board</h1>
          <p className="text-sm text-neutral-500 mt-1">{tasks.length} tasks across {COLUMNS.length} columns</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMyTasksMode(!myTasksMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${myTasksMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.04] text-neutral-400 border border-white/[0.06] hover:border-white/[0.12]'}`}
          >
            <User size={14} />
            My Tasks
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Tasks" value={stats.total} icon={BarChart3} color="bg-white/[0.06] text-white" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="bg-blue-500/20 text-blue-400" />
        <StatCard label="Done This Week" value={stats.completedWeek} icon={CheckCircle2} color="bg-emerald-500/20 text-emerald-400" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} color="bg-red-500/20 text-red-400" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-neutral-500" />
        <select
          value={filterAssignee}
          onChange={e => setFilterAssignee(e.target.value as any)}
          className="bg-[#111] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500/50"
        >
          <option value="all">All Assignees</option>
          {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as any)}
          className="bg-[#111] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500/50"
        >
          <option value="all">All Priorities</option>
          {(['low', 'medium', 'high', 'urgent'] as Priority[]).map(p => <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>)}
        </select>
        <select
          value={filterTag}
          onChange={e => setFilterTag(e.target.value)}
          className="bg-[#111] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500/50"
        >
          <option value="all">All Tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' as any }}>
        {COLUMNS.map((col, colIdx) => {
          const colTasks = filtered.filter(t => t.column === col.key);
          return (
            <div key={col.key} className="flex-shrink-0 w-[260px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-neutral-300">{col.label}</h3>
                <span className="text-xs text-neutral-600 bg-white/[0.04] px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                <AnimatePresence>
                  {colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      colIndex={colIdx}
                      totalCols={COLUMNS.length}
                      onMove={moveTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </AnimatePresence>
                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-neutral-700 text-xs">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111] border border-white/[0.06] rounded-xl p-5 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">New Task</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-white/[0.06] rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title..."
                className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
              />
              <input
                type="text"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Description..."
                className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value as Assignee })}
                    className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                  >
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                  >
                    {(['low', 'medium', 'high', 'urgent'] as Priority[]).map(p => <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-[10px] px-2 py-1 rounded transition-colors ${newTask.tags.includes(tag) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.04] text-neutral-500 border border-white/[0.06]'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={addTask}
                disabled={!newTask.title.trim()}
                className="w-full bg-emerald-500 text-black py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 hover:bg-emerald-600"
              >
                Create Task
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

