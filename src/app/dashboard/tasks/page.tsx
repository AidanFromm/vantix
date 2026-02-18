'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Clock, CheckCircle2,
  Layers, CircleDot, Eye, Zap, Calendar, ArrowRight, Loader2, Tag,
  LayoutGrid, List, Filter,
} from 'lucide-react';

type Column = 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string; title: string; description: string; column: Column; priority: Priority;
  assignee: string; due_date?: string; project_id?: string; project_link?: string; created_at: string;
}
interface Project { id: string; name: string; }

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSet<T>(key: string, data: T[]) {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function generateId(): string { return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36); }

const COLUMNS: { key: Column; label: string; icon: typeof Clock; color: string; bg: string }[] = [
  { key: 'todo', label: 'To Do', icon: CircleDot, color: 'text-[#9C8575]', bg: 'bg-[#9C8575]/10' },
  { key: 'in_progress', label: 'In Progress', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'review', label: 'Review', icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const PRIORITY_CFG: Record<Priority, { color: string; bg: string }> = {
  low: { color: 'text-[#9C8575]', bg: 'bg-[#E8D5C4]' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50' },
  high: { color: 'text-amber-600', bg: 'bg-amber-50' },
  urgent: { color: 'text-red-600', bg: 'bg-red-50' },
};

function getDueDateColor(due_date?: string): string {
  if (!due_date) return 'text-[#9C8575]';
  const d = new Date(due_date); const now = new Date();
  now.setHours(0, 0, 0, 0); d.setHours(0, 0, 0, 0);
  if (d < now) return 'text-red-500';
  if (d.getTime() === now.getTime()) return 'text-amber-500';
  return 'text-[#9C8575]';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dragTask, setDragTask] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [quickAdd, setQuickAdd] = useState<{ col: Column; title: string } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', column: 'todo' as Column, priority: 'medium' as Priority, assignee: 'Kyle', due_date: '', project_id: '' });

  const load = useCallback(() => {
    try {
      setTasks(lsGet<Task>('vantix_tasks'));
      setProjects(lsGet<Project>('vantix_projects'));
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredTasks = useMemo(() => {
    if (projectFilter === 'all') return tasks;
    return tasks.filter(t => t.project_id === projectFilter);
  }, [tasks, projectFilter]);

  const resetForm = () => { setForm({ title: '', description: '', column: 'todo', priority: 'medium', assignee: 'Kyle', due_date: '', project_id: '' }); setEditId(null); setShowForm(false); };

  const saveTasks = (newTasks: Task[]) => { lsSet('vantix_tasks', newTasks); setTasks(newTasks); };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    try {
      const items = lsGet<Task>('vantix_tasks');
      const now = new Date().toISOString();
      if (editId) {
        const idx = items.findIndex(t => t.id === editId);
        if (idx >= 0) items[idx] = { ...items[idx], ...form };
      } else {
        items.unshift({ id: generateId(), created_at: now, ...form } as Task);
      }
      saveTasks(items);
      resetForm();
    } catch {}
  };

  const handleQuickAdd = (col: Column, title: string) => {
    if (!title.trim()) return;
    try {
      const items = lsGet<Task>('vantix_tasks');
      items.unshift({ id: generateId(), title, description: '', column: col, priority: 'medium', assignee: 'Kyle', created_at: new Date().toISOString() } as Task);
      saveTasks(items);
      setQuickAdd(null);
    } catch {}
  };

  const handleDrop = (col: Column) => {
    if (!dragTask) return;
    try {
      const items = lsGet<Task>('vantix_tasks');
      const idx = items.findIndex(t => t.id === dragTask);
      if (idx >= 0) { items[idx] = { ...items[idx], column: col }; saveTasks(items); }
    } catch {}
    setDragTask(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this task?')) return;
    setDeleting(id);
    try { saveTasks(lsGet<Task>('vantix_tasks').filter(t => t.id !== id)); } catch {}
    setDeleting(null);
  };

  const startEdit = (t: Task) => { setForm({ title: t.title, description: t.description || '', column: t.column, priority: t.priority, assignee: t.assignee || 'Kyle', due_date: t.due_date || '', project_id: t.project_id || '' }); setEditId(t.id); setShowForm(true); };

  const moveTask = (id: string, direction: 'left' | 'right') => {
    const task = tasks.find(t => t.id === id); if (!task) return;
    const keys = COLUMNS.map(c => c.key); const idx = keys.indexOf(task.column);
    const newIdx = direction === 'right' ? Math.min(idx + 1, keys.length - 1) : Math.max(idx - 1, 0);
    if (newIdx === idx) return;
    try {
      const items = lsGet<Task>('vantix_tasks');
      const ti = items.findIndex(t => t.id === id);
      if (ti >= 0) { items[ti] = { ...items[ti], column: keys[newIdx] }; saveTasks(items); }
    } catch {}
  };

  const inputCls = 'w-full bg-[#F5EDE4] border border-[#E8D8CA] rounded-xl px-4 py-2.5 text-sm text-[#2C1810] focus:outline-none focus:border-[#8B5E3C]/50';

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] flex items-center gap-3"><div className="p-2 bg-[#8B5E3C]/10 rounded-xl"><Layers className="w-6 h-6 text-[#8B5E3C]" /></div>Tasks</h1>
          <p className="text-[#9C8575] mt-1 text-sm">Manage your team&apos;s tasks</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-[#9C8575]"><span>{filteredTasks.length} total</span><span>|</span><span className="text-emerald-600">{filteredTasks.filter(t => t.column === 'done').length} done</span></div>
          <div className="flex bg-white border border-[#E8D8CA] rounded-xl p-1">
            <button onClick={() => setViewMode('kanban')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'kanban' ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' : 'text-[#9C8575]'}`}><LayoutGrid size={13} /> Kanban</button>
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' : 'text-[#9C8575]'}`}><List size={13} /> List</button>
          </div>
          <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="bg-white border border-[#E8D8CA] rounded-xl px-3 py-1.5 text-xs text-[#2C1810] focus:outline-none focus:border-[#8B5E3C]/50">
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#A67A4B] text-white rounded-xl font-medium transition-colors text-sm"><Plus className="w-4 h-4" /> New Task</button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" /></div>
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.column === col.key);
            const ColIcon = col.icon;
            return (
              <div key={col.key} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(col.key)}
                className="bg-white border border-[#E8D8CA] rounded-xl p-4 min-h-[300px] shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${col.bg}`}><ColIcon className={`w-3.5 h-3.5 ${col.color}`} /></div><span className="text-sm font-semibold text-[#2C1810]">{col.label}</span></div>
                  <span className="text-xs text-[#9C8575] bg-[#E8D5C4] px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>

                {/* Quick Add */}
                {quickAdd?.col === col.key ? (
                  <div className="mb-3">
                    <input autoFocus value={quickAdd.title} onChange={e => setQuickAdd({ ...quickAdd, title: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(col.key, quickAdd.title); if (e.key === 'Escape') setQuickAdd(null); }}
                      placeholder="Task title..." className="w-full bg-[#F5EDE4] border border-[#8B5E3C]/30 rounded-lg px-3 py-2 text-sm text-[#2C1810] focus:outline-none" />
                    <div className="flex gap-2 mt-1.5">
                      <button onClick={() => handleQuickAdd(col.key, quickAdd.title)} className="px-3 py-1 bg-[#8B5E3C] text-white rounded-lg text-xs">Add</button>
                      <button onClick={() => setQuickAdd(null)} className="px-3 py-1 text-[#9C8575] text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setQuickAdd({ col: col.key, title: '' })} className="w-full mb-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-[#E8D8CA] text-[#9C8575] hover:border-[#8B5E3C]/30 hover:text-[#8B5E3C] text-xs transition-colors">
                    <Plus size={12} /> Quick add
                  </button>
                )}

                <AnimatePresence mode="popLayout">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-[#9C8575]/50 text-sm">No tasks</div>
                  ) : (
                    <div className="space-y-2.5">
                      {colTasks.map(task => {
                        const pcfg = PRIORITY_CFG[task.priority];
                        const dueDateColor = getDueDateColor(task.due_date);
                        const proj = projects.find(p => p.id === task.project_id);
                        return (
                          <motion.div key={task.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            draggable onDragStart={() => setDragTask(task.id)}
                            className="bg-[#F5EDE4] border border-[#E8D8CA] rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-[#8B5E3C]/30 transition-all group">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-[#2C1810] leading-snug flex-1 mr-2">{task.title}</p>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(task)} className="p-1 text-[#9C8575] hover:text-[#8B5E3C] rounded"><Tag className="w-3 h-3" /></button>
                                <button onClick={() => handleDelete(task.id)} className="p-1 text-[#9C8575] hover:text-red-500 rounded">
                                  {deleting === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            {task.description && <p className="text-xs text-[#9C8575] mb-2.5 line-clamp-2">{task.description}</p>}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${pcfg.bg} ${pcfg.color}`}>{task.priority}</span>
                                {proj && <span className="text-[10px] text-[#9C8575] bg-[#E8D5C4] px-1.5 py-0.5 rounded truncate max-w-[80px]">{proj.name}</span>}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveTask(task.id, 'left')} className="p-1 text-[#9C8575] hover:text-[#2C1810] rounded"><ArrowRight className="w-3 h-3 rotate-180" /></button>
                                <button onClick={() => moveTask(task.id, 'right')} className="p-1 text-[#9C8575] hover:text-[#2C1810] rounded"><ArrowRight className="w-3 h-3" /></button>
                              </div>
                            </div>
                            {task.due_date && <div className={`flex items-center gap-1 mt-2 text-[10px] ${dueDateColor}`}><Calendar className="w-3 h-3" />{new Date(task.due_date).toLocaleDateString()}</div>}
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
      ) : (
        /* List View */
        <div className="rounded-2xl bg-white border border-[#E8D8CA] overflow-hidden shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E8D8CA] text-[#9C8575] text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Task</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Priority</th>
              <th className="text-left px-5 py-3 font-medium">Due Date</th>
              <th className="text-left px-5 py-3 font-medium">Project</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filteredTasks.map(task => {
                const col = COLUMNS.find(c => c.key === task.column)!;
                const pcfg = PRIORITY_CFG[task.priority];
                const dueDateColor = getDueDateColor(task.due_date);
                const proj = projects.find(p => p.id === task.project_id);
                return (
                  <tr key={task.id} className="border-b border-[#E8D8CA]/50 hover:bg-[#E8D5C4]/50 transition-colors">
                    <td className="px-5 py-3.5 text-[#2C1810] font-medium">{task.title}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs font-medium ${col.color}`}>{col.label}</span></td>
                    <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${pcfg.bg} ${pcfg.color}`}>{task.priority}</span></td>
                    <td className={`px-5 py-3.5 text-xs ${dueDateColor}`}>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                    <td className="px-5 py-3.5 text-xs text-[#9C8575]">{proj?.name || '-'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(task)} className="p-1.5 rounded-lg text-[#9C8575] hover:text-[#8B5E3C]"><Tag size={14} /></button>
                        <button onClick={() => handleDelete(task.id)} className="p-1.5 rounded-lg text-[#9C8575] hover:text-red-500">
                          {deleting === task.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#2C1810]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white border border-[#E8D8CA] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#2C1810] mb-6">{editId ? 'Edit' : 'New'} Task</h2>
              <div className="space-y-4">
                <div><label className="block text-xs text-[#9C8575] mb-1.5">Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Task title" /></div>
                <div><label className="block text-xs text-[#9C8575] mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#9C8575] mb-1.5">Column</label><select value={form.column} onChange={e => setForm(f => ({ ...f, column: e.target.value as Column }))} className={inputCls}>{COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}</select></div>
                  <div><label className="block text-xs text-[#9C8575] mb-1.5">Priority</label><select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className={inputCls}>{(['low','medium','high','urgent'] as Priority[]).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#9C8575] mb-1.5">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} /></div>
                  <div><label className="block text-xs text-[#9C8575] mb-1.5">Project</label><select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} className={inputCls}><option value="">None</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-[#9C8575] hover:text-[#2C1810]">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.title} className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A67A4B] disabled:opacity-40 text-white rounded-xl font-medium transition-colors">{editId ? 'Update' : 'Create'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
