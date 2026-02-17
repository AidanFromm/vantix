'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, User, AlertTriangle, Clock, CheckCircle2,
  BarChart3, Tag, Calendar, Link2, GripVertical, ArrowRight,
  Layers, CircleDot, Eye, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- Types ---
type Column = 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Assignee = 'Kyle' | 'Aidan' | 'Vantix' | 'Botskii';

interface Task {
  id: string;
  title: string;
  description: string;
  column: Column;
  priority: Priority;
  assignee: Assignee;
  due_date?: string;
  project_link?: string;
  created_at: string;
}

// --- Supabase ---
async function getTasks() {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  return { data: data as Task[] | null, error };
}
async function createTask(t: Partial<Task>) {
  const { data, error } = await supabase.from('tasks').insert(t).select().single();
  return { data: data as Task | null, error };
}
async function updateTask(id: string, u: Partial<Task>) {
  const { data, error } = await supabase.from('tasks').update(u).eq('id', id).select().single();
  return { data: data as Task | null, error };
}
async function deleteTask(id: string) {
  return await supabase.from('tasks').delete().eq('id', id);
}

// --- Config ---
const COLUMNS: { key: Column; label: string; icon: typeof Clock; color: string; bg: string }[] = [
  { key: 'todo', label: 'To Do', icon: CircleDot, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  { key: 'in_progress', label: 'In Progress', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'review', label: 'Review', icon: Eye, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

const PRIORITY_CFG: Record<Priority, { color: string; bg: string }> = {
  low: { color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  medium: { color: 'text-blue-400', bg: 'bg-blue-400/10' },
  high: { color: 'text-amber-400', bg: 'bg-amber-400/10' },
  urgent: { color: 'text-red-400', bg: 'bg-red-400/10' },
};

const ASSIGNEES: Assignee[] = ['Kyle', 'Aidan', 'Vantix', 'Botskii'];
const ASSIGNEE_COLORS: Record<Assignee, string> = {
  Kyle: 'bg-blue-500', Aidan: 'bg-purple-500', Vantix: 'bg-emerald-500', Botskii: 'bg-amber-500',
};

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dragTask, setDragTask] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', column: 'todo' as Column, priority: 'medium' as Priority,
    assignee: 'Kyle' as Assignee, due_date: '', project_link: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await getTasks(); if (data) setTasks(data); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ title: '', description: '', column: 'todo', priority: 'medium', assignee: 'Kyle', due_date: '', project_link: '' });
    setEditId(null); setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editId) await updateTask(editId, form);
      else await createTask(form);
      resetForm(); load();
    } catch {}
  };

  const handleDrop = async (col: Column) => {
    if (!dragTask) return;
    try { await updateTask(dragTask, { column: col }); load(); } catch {}
    setDragTask(null);
  };

  const startEdit = (t: Task) => {
    setForm({ title: t.title, description: t.description, column: t.column, priority: t.priority, assignee: t.assignee, due_date: t.due_date || '', project_link: t.project_link || '' });
    setEditId(t.id); setShowForm(true);
  };

  const moveTask = async (id: string, direction: 'left' | 'right') => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const colKeys = COLUMNS.map(c => c.key);
    const idx = colKeys.indexOf(task.column);
    const newIdx = direction === 'right' ? Math.min(idx + 1, colKeys.length - 1) : Math.max(idx - 1, 0);
    if (newIdx === idx) return;
    try { await updateTask(id, { column: colKeys[newIdx] }); load(); } catch {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl"><Layers className="w-6 h-6 text-emerald-400" /></div>
            Tasks
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Kanban board for project task management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{tasks.length} total</span>
            <span className="text-zinc-700">|</span>
            <span className="text-emerald-400">{tasks.filter(t => t.column === 'done').length} done</span>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.column === col.key);
            const ColIcon = col.icon;
            return (
              <div key={col.key}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(col.key)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 min-h-[300px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${col.bg}`}><ColIcon className={`w-3.5 h-3.5 ${col.color}`} /></div>
                    <span className="text-sm font-semibold text-white">{col.label}</span>
                  </div>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <AnimatePresence mode="popLayout">
                  {colTasks.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-zinc-600 text-sm">
                      No tasks
                    </motion.div>
                  ) : (
                    <div className="space-y-2.5">
                      {colTasks.map(task => {
                        const pcfg = PRIORITY_CFG[task.priority];
                        return (
                          <motion.div key={task.id} layout variants={fadeUp} initial="hidden" animate="visible" exit="hidden"
                            draggable onDragStart={() => setDragTask(task.id)}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-all group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-white leading-snug flex-1 mr-2">{task.title}</p>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(task)} className="p-1 text-zinc-500 hover:text-white rounded"><Tag className="w-3 h-3" /></button>
                                <button onClick={async () => { await deleteTask(task.id); load(); }} className="p-1 text-zinc-500 hover:text-red-400 rounded"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                            {task.description && <p className="text-xs text-zinc-500 mb-2.5 line-clamp-2">{task.description}</p>}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${pcfg.bg} ${pcfg.color}`}>{task.priority}</span>
                                <div className="flex items-center gap-1">
                                  <div className={`w-4 h-4 rounded-full ${ASSIGNEE_COLORS[task.assignee]} flex items-center justify-center`}>
                                    <span className="text-[8px] font-bold text-white">{task.assignee[0]}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveTask(task.id, 'left')} className="p-1 text-zinc-600 hover:text-white rounded" title="Move left"><ArrowRight className="w-3 h-3 rotate-180" /></button>
                                <button onClick={() => moveTask(task.id, 'right')} className="p-1 text-zinc-600 hover:text-white rounded" title="Move right"><ArrowRight className="w-3 h-3" /></button>
                              </div>
                            </div>
                            {task.due_date && (
                              <div className="flex items-center gap-1 mt-2 text-[10px] text-zinc-500">
                                <Calendar className="w-3 h-3" />{new Date(task.due_date).toLocaleDateString()}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit' : 'New'} Task</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Task title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none" placeholder="Describe the task..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Column</label>
                    <select value={form.column} onChange={e => setForm(f => ({ ...f, column: e.target.value as Column }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Priority</label>
                    <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      {(['low','medium','high','urgent'] as Priority[]).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Assignee</label>
                    <select value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value as Assignee }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Due Date</label>
                    <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Project Link</label>
                  <input value={form.project_link} onChange={e => setForm(f => ({ ...f, project_link: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="https://..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.title} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl font-medium transition-colors">
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
