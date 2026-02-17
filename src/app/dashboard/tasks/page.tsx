'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Clock, CheckCircle2,
  Layers, CircleDot, Eye, Zap, Calendar, ArrowRight, Loader2, Tag,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Column = 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Assignee = 'Kyle' | 'Aidan' | 'Vantix' | 'Botskii';

interface Task { id: string; title: string; description: string; column: Column; priority: Priority; assignee: Assignee; due_date?: string; project_link?: string; created_at: string; }

async function getTasks() { try { const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false }); return { data: data as Task[] | null, error }; } catch { return { data: null, error: null }; } }
async function createTask(t: Partial<Task>) { const { data, error } = await supabase.from('tasks').insert(t).select().single(); return { data: data as Task | null, error }; }
async function updateTask(id: string, u: Partial<Task>) { const { data, error } = await supabase.from('tasks').update(u).eq('id', id).select().single(); return { data: data as Task | null, error }; }
async function deleteTask(id: string) { return await supabase.from('tasks').delete().eq('id', id); }

const COLUMNS: { key: Column; label: string; icon: typeof Clock; color: string; bg: string }[] = [
  { key: 'todo', label: 'To Do', icon: CircleDot, color: 'text-[#8C857C]', bg: 'bg-[#8C857C]/10' },
  { key: 'in_progress', label: 'In Progress', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'review', label: 'Review', icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const PRIORITY_CFG: Record<Priority, { color: string; bg: string }> = {
  low: { color: 'text-[#8C857C]', bg: 'bg-[#F5F0EB]' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50' },
  high: { color: 'text-amber-600', bg: 'bg-amber-50' },
  urgent: { color: 'text-red-600', bg: 'bg-red-50' },
};

const ASSIGNEES: Assignee[] = ['Kyle', 'Aidan', 'Vantix', 'Botskii'];
const ASSIGNEE_COLORS: Record<Assignee, string> = { Kyle: 'bg-blue-500', Aidan: 'bg-purple-500', Vantix: 'bg-[#B8895A]', Botskii: 'bg-amber-500' };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dragTask, setDragTask] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', column: 'todo' as Column, priority: 'medium' as Priority, assignee: 'Kyle' as Assignee, due_date: '', project_link: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await getTasks(); setTasks(data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ title: '', description: '', column: 'todo', priority: 'medium', assignee: 'Kyle', due_date: '', project_link: '' }); setEditId(null); setShowForm(false); };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try { if (editId) await updateTask(editId, form); else await createTask(form); resetForm(); load(); } catch {}
  };

  const handleDrop = async (col: Column) => { if (!dragTask) return; try { await updateTask(dragTask, { column: col }); load(); } catch {} setDragTask(null); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    setDeleting(id);
    try { await deleteTask(id); load(); } catch {} finally { setDeleting(null); }
  };

  const startEdit = (t: Task) => { setForm({ title: t.title, description: t.description || '', column: t.column, priority: t.priority, assignee: t.assignee, due_date: t.due_date || '', project_link: t.project_link || '' }); setEditId(t.id); setShowForm(true); };

  const moveTask = async (id: string, direction: 'left' | 'right') => {
    const task = tasks.find(t => t.id === id); if (!task) return;
    const keys = COLUMNS.map(c => c.key); const idx = keys.indexOf(task.column);
    const newIdx = direction === 'right' ? Math.min(idx + 1, keys.length - 1) : Math.max(idx - 1, 0);
    if (newIdx === idx) return;
    try { await updateTask(id, { column: keys[newIdx] }); load(); } catch {}
  };

  const inputCls = 'w-full bg-[#FAFAFA] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50';

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2A26] flex items-center gap-3"><div className="p-2 bg-[#B8895A]/10 rounded-xl"><Layers className="w-6 h-6 text-[#B8895A]" /></div>Tasks</h1>
          <p className="text-[#8C857C] mt-1 text-sm">Kanban board for project task management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[#8C857C]"><span>{tasks.length} total</span><span>|</span><span className="text-emerald-600">{tasks.filter(t => t.column === 'done').length} done</span></div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#B8895A] hover:bg-[#A67A4B] text-white rounded-xl font-medium transition-colors"><Plus className="w-4 h-4" /> New Task</button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#B8895A] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.column === col.key);
            const ColIcon = col.icon;
            return (
              <div key={col.key} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(col.key)}
                className="bg-white border border-[#E8E2DA] rounded-xl p-4 min-h-[300px] shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${col.bg}`}><ColIcon className={`w-3.5 h-3.5 ${col.color}`} /></div><span className="text-sm font-semibold text-[#2D2A26]">{col.label}</span></div>
                  <span className="text-xs text-[#8C857C] bg-[#F5F0EB] px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <AnimatePresence mode="popLayout">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-[#8C857C]/50 text-sm">No tasks</div>
                  ) : (
                    <div className="space-y-2.5">
                      {colTasks.map(task => {
                        const pcfg = PRIORITY_CFG[task.priority];
                        return (
                          <motion.div key={task.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            draggable onDragStart={() => setDragTask(task.id)}
                            className="bg-[#FAFAFA] border border-[#E8E2DA] rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-[#B8895A]/30 transition-all group">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-[#2D2A26] leading-snug flex-1 mr-2">{task.title}</p>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(task)} className="p-1 text-[#8C857C] hover:text-[#B8895A] rounded"><Tag className="w-3 h-3" /></button>
                                <button onClick={() => handleDelete(task.id)} className="p-1 text-[#8C857C] hover:text-red-500 rounded">
                                  {deleting === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            {task.description && <p className="text-xs text-[#8C857C] mb-2.5 line-clamp-2">{task.description}</p>}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${pcfg.bg} ${pcfg.color}`}>{task.priority}</span>
                                <div className={`w-4 h-4 rounded-full ${ASSIGNEE_COLORS[task.assignee]} flex items-center justify-center`}><span className="text-[8px] font-bold text-white">{task.assignee[0]}</span></div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveTask(task.id, 'left')} className="p-1 text-[#8C857C] hover:text-[#2D2A26] rounded"><ArrowRight className="w-3 h-3 rotate-180" /></button>
                                <button onClick={() => moveTask(task.id, 'right')} className="p-1 text-[#8C857C] hover:text-[#2D2A26] rounded"><ArrowRight className="w-3 h-3" /></button>
                              </div>
                            </div>
                            {task.due_date && <div className="flex items-center gap-1 mt-2 text-[10px] text-[#8C857C]"><Calendar className="w-3 h-3" />{new Date(task.due_date).toLocaleDateString()}</div>}
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

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#2D2A26]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white border border-[#E8E2DA] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#2D2A26] mb-6">{editId ? 'Edit' : 'New'} Task</h2>
              <div className="space-y-4">
                <div><label className="block text-xs text-[#8C857C] mb-1.5">Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Task title" /></div>
                <div><label className="block text-xs text-[#8C857C] mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#8C857C] mb-1.5">Column</label><select value={form.column} onChange={e => setForm(f => ({ ...f, column: e.target.value as Column }))} className={inputCls}>{COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}</select></div>
                  <div><label className="block text-xs text-[#8C857C] mb-1.5">Priority</label><select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className={inputCls}>{(['low','medium','high','urgent'] as Priority[]).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs text-[#8C857C] mb-1.5">Assignee</label><select value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value as Assignee }))} className={inputCls}>{ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                  <div><label className="block text-xs text-[#8C857C] mb-1.5">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} /></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-[#8C857C] hover:text-[#2D2A26]">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.title} className="px-6 py-2.5 bg-[#B8895A] hover:bg-[#A67A4B] disabled:opacity-40 text-white rounded-xl font-medium transition-colors">{editId ? 'Update' : 'Create'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
