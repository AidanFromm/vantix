'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Clock, DollarSign, Briefcase, Zap,
  AlertTriangle, CheckCircle2, Loader2, Trash2, Users, Flag, Shield,
} from 'lucide-react';
import Link from 'next/link';

interface Client { id: string; name: string; status: string; }
interface Project {
  id: string; name: string; client_id?: string; status: string; health?: string;
  deadline?: string; budget?: number; spent: number; progress: number;
  description?: string; tags: string[]; notes?: string; milestones?: { name: string; done: boolean }[];
  created_at: string; updated_at: string; client?: Client;
}
type ProjectStatus = string;

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSet<T>(key: string, data: T[]) {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function generateId(): string { return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36); }

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  lead: { label: 'Lead', color: 'text-[#7A746C]', bg: 'bg-[#7A746C]/10', border: 'border-[#7A746C]/30' },
  proposal: { label: 'Proposal', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/20' },
  active: { label: 'Active', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/20' },
  'on-hold': { label: 'On Hold', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#D8C2A8]' },
  review: { label: 'Review', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/20' },
  complete: { label: 'Complete', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#D8C2A8]' },
  archived: { label: 'Archived', color: 'text-[#F4EFE8]0', bg: 'bg-[#F4EFE8]', border: 'border-[#E3D9CD]' },
};

function formatCurrency(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n); }
function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

function computeHealth(project: Project): { label: string; color: string; icon: typeof CheckCircle2 } {
  if (!project.deadline) return { label: 'On Track', color: 'text-[#8E5E34]', icon: CheckCircle2 };
  const days = daysUntil(project.deadline);
  const progress = project.progress || 0;
  if (days < 0) return { label: 'Behind', color: 'text-[#8E5E34]', icon: AlertTriangle };
  if (days <= 7 && progress < 80) return { label: 'At Risk', color: 'text-[#8E5E34]', icon: AlertTriangle };
  if (days <= 14 && progress < 50) return { label: 'At Risk', color: 'text-[#8E5E34]', icon: AlertTriangle };
  return { label: 'On Track', color: 'text-[#8E5E34]', icon: CheckCircle2 };
}

function ProjectModal({ project, clients, onClose, onSave }: { project?: Project | null; clients: Client[]; onClose: () => void; onSave: (data: Partial<Project>) => void }) {
  const [form, setForm] = useState({
    name: project?.name || '', client_id: project?.client_id || '', status: project?.status || 'lead',
    budget: project?.budget || 0, spent: project?.spent || 0, progress: project?.progress || 0,
    deadline: project?.deadline || '', description: project?.description || '', notes: project?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50 transition-colors';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!form.name.trim()) return; setSaving(true);
    onSave({ name: form.name, client_id: form.client_id || undefined, status: form.status, budget: form.budget || undefined, spent: form.spent, progress: form.progress, deadline: form.deadline || undefined, description: form.description || undefined, notes: form.notes || undefined });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1C1C1C]/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E3D9CD] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1C1C1C]">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-[#7A746C] mb-1.5 block">Project Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} /></div>
          <div><label className="text-xs text-[#7A746C] mb-1.5 block">Client</label>
            <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={inputCls}>
              <option value="">No client</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-[#7A746C] mb-1.5 block">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Budget</label><input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Spent</label><input type="number" value={form.spent} onChange={e => setForm(p => ({ ...p, spent: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Progress %</label><input type="number" min={0} max={100} value={form.progress} onChange={e => setForm(p => ({ ...p, progress: parseInt(e.target.value) || 0 }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-[#7A746C] mb-1.5 block">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className={inputCls} /></div>
          <div><label className="text-xs text-[#7A746C] mb-1.5 block">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#EEE6DC] text-[#7A746C] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-[#8E5E34] text-white font-medium text-sm disabled:opacity-50">{project ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(() => {
    try {
      const allClients = lsGet<Client>('vantix_clients');
      setClients(allClients);
      let projs = lsGet<Project>('vantix_projects');
      // Attach client data
      projs = projs.map(p => ({ ...p, client: allClients.find(c => c.id === p.client_id) }));
      if (statusFilter !== 'all') projs = projs.filter(p => p.status === statusFilter);
      setProjects(projs);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(p => p.name.toLowerCase().includes(q) || p.client?.name?.toLowerCase().includes(q));
  }, [projects, search]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    totalBudget: projects.reduce((s, p) => s + (p.budget || 0), 0),
    totalSpent: projects.reduce((s, p) => s + (p.spent || 0), 0),
  }), [projects]);

  const handleSave = (data: Partial<Project>) => {
    try {
      const items = lsGet<Project>('vantix_projects');
      const now = new Date().toISOString();
      if (editingProject) {
        const idx = items.findIndex(p => p.id === editingProject.id);
        if (idx >= 0) items[idx] = { ...items[idx], ...data, updated_at: now };
      } else {
        items.unshift({ id: generateId(), spent: 0, progress: 0, health: 'green', tags: [], created_at: now, updated_at: now, ...data } as Project);
      }
      lsSet('vantix_projects', items);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this project?')) return;
    setDeleting(id);
    try { const items = lsGet<Project>('vantix_projects').filter(p => p.id !== id); lsSet('vantix_projects', items); loadData(); } catch (e) { console.error(e); }
    setDeleting(null);
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[#E3D9CD] rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#E3D9CD]/50 rounded-2xl" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">Projects</h1><p className="text-sm text-[#7A746C] mt-1">Track and manage all your projects</p></div>
        <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#8E5E34] hover:bg-[#B07A45] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#8E5E34]/20 text-sm"><Plus size={18} /> New Project</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Projects', value: String(stats.total), icon: Briefcase, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
          { label: 'Active', value: String(stats.active), icon: Zap, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
          { label: 'Total Budget', value: formatCurrency(stats.totalBudget), icon: DollarSign, color: 'text-[#8E5E34]', bg: 'bg-[#8E5E34]/10', border: 'border-[#8E5E34]/20' },
          { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: CheckCircle2, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-[#EEE6DC] border ${stat.border} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#7A746C]">{stat.label}</span><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={18} className={stat.color} /></div></div>
            <p className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 && !search && statusFilter === 'all' ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#8E5E34]/10 flex items-center justify-center mb-6"><Briefcase size={40} className="text-[#8E5E34]" /></div>
          <h3 className="text-xl font-semibold text-[#1C1C1C] mb-2">No projects yet</h3>
          <p className="text-[#7A746C] max-w-md mb-6">Create your first project to start tracking work.</p>
          <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8E5E34]/10 text-[#8E5E34] border border-[#8E5E34]/30 font-medium"><Plus size={18} /> Create Your First Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG.lead;
            const days = project.deadline ? daysUntil(project.deadline) : null;
            const progress = project.progress || 0;
            const healthInfo = computeHealth(project);
            const HealthIcon = healthInfo.icon;
            const budgetPct = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;
            const overBudget = project.budget ? project.spent > project.budget : false;
            const milestones = project.milestones || [];

            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-2xl bg-[#EEE6DC] border border-[#E3D9CD] p-5 hover:border-[#8E5E34]/30 hover:shadow-lg transition-all duration-300 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#1C1C1C] truncate group-hover:text-[#8E5E34] transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bg} ${sc.color} ${sc.border}`}>{sc.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${healthInfo.color}`}>
                        <HealthIcon size={10} /> {healthInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#7A746C] mb-1"><span>Progress</span><span className="text-[#1C1C1C] font-medium">{progress}%</span></div>
                  <div className="h-2.5 bg-[#EEE6DC] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${progress >= 80 ? 'bg-[#B07A45]/50' : progress >= 50 ? 'bg-[#B07A45]/50' : 'bg-[#8E5E34]'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>

                {/* Budget vs Actual */}
                {project.budget ? (
                  <div className="mb-3 p-2.5 rounded-lg bg-[#F4EFE8] border border-[#E3D9CD]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#7A746C]">Budget</span>
                      <span className={`font-semibold ${overBudget ? 'text-[#8E5E34]' : 'text-[#1C1C1C]'}`}>{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span>
                    </div>
                    <div className="h-1.5 bg-[#E3D9CD] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${overBudget ? 'bg-[#B0614A]/50' : budgetPct > 80 ? 'bg-[#B07A45]' : 'bg-[#B07A45]/50'}`} style={{ width: `${Math.min(budgetPct, 100)}%` }} />
                    </div>
                  </div>
                ) : null}

                {/* Milestones */}
                {milestones.length > 0 && (
                  <div className="mb-3 flex items-center gap-1.5">
                    <Flag size={12} className="text-[#7A746C]" />
                    <div className="flex gap-1">
                      {milestones.slice(0, 5).map((m, mi) => (
                        <div key={mi} className={`w-3 h-3 rounded-full border ${m.done ? 'bg-[#B07A45]/50 border-[#C89A6A]' : 'bg-[#EEE6DC] border-[#E3D9CD]'}`} title={m.name} />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#7A746C]">{milestones.filter(m => m.done).length}/{milestones.length}</span>
                  </div>
                )}

                {/* Client + Deadline */}
                <div className="flex items-center justify-between text-xs mb-3">
                  {project.client ? (
                    <Link href="/dashboard/clients" className="flex items-center gap-1 text-[#8E5E34] hover:underline"><Users size={12} />{project.client.name}</Link>
                  ) : <span className="text-[#7A746C]">No client</span>}
                  {days !== null && <div className={`flex items-center gap-1 ${days < 0 ? 'text-[#B0614A]/50' : days <= 7 ? 'text-[#B07A45]' : 'text-[#7A746C]'}`}><Clock size={12} />{days < 0 ? `${Math.abs(days)}d over` : `${days}d left`}</div>}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#E3D9CD]">
                  <button onClick={() => { setEditingProject(project); setShowModal(true); }} className="flex-1 text-center px-3 py-2 rounded-lg bg-[#EEE6DC] text-[#7A746C] hover:text-[#8E5E34] hover:bg-[#8E5E34]/10 text-xs font-medium transition-colors">Edit</button>
                  <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id} className="px-3 py-2 rounded-lg bg-[#EEE6DC] text-[#7A746C] hover:text-[#B0614A]/50 hover:bg-[#B0614A]/5 text-xs transition-colors">
                    {deleting === project.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (search || statusFilter !== 'all') && (
        <div className="text-center py-12"><p className="text-[#7A746C]">No projects match your filters</p></div>
      )}

      <AnimatePresence>{showModal && <ProjectModal project={editingProject} clients={clients} onClose={() => { setShowModal(false); setEditingProject(undefined); }} onSave={handleSave} />}</AnimatePresence>
    </div>
  );
}