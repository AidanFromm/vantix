'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Clock, DollarSign, Briefcase, Users, Zap,
  AlertTriangle, CheckCircle2, Loader2, Filter, BarChart3,
  Calendar, ArrowRight, ChevronRight, FileText, Target, TrendingUp,
} from 'lucide-react';
import { getProjects, createProject, updateProject, getClients } from '@/lib/supabase';
import type { Project, ProjectStatus, ProjectHealth, Client } from '@/lib/types';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  lead: { label: 'Lead', color: 'text-slate-400', bgColor: 'bg-slate-500/10', borderColor: 'border-slate-500/30' },
  proposal: { label: 'Proposal', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  active: { label: 'Active', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  'on-hold': { label: 'On Hold', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
  review: { label: 'Review', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  complete: { label: 'Complete', color: 'text-teal-400', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/30' },
  archived: { label: 'Archived', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' },
};

const HEALTH_CONFIG: Record<ProjectHealth, { icon: typeof CheckCircle2; color: string; label: string }> = {
  green: { icon: CheckCircle2, color: 'text-emerald-400', label: 'On Track' },
  yellow: { icon: AlertTriangle, color: 'text-amber-400', label: 'At Risk' },
  red: { icon: AlertTriangle, color: 'text-red-400', label: 'Critical' },
};

const KANBAN_STATUSES: ProjectStatus[] = ['lead', 'proposal', 'active', 'review', 'complete'];

function formatCurrency(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n); }
function formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between"><div className="h-8 w-48 bg-white/5 rounded-lg" /><div className="h-10 w-36 bg-white/5 rounded-xl" /></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-2xl" />)}</div>
    </div>
  );
}

// ─── Add/Edit Project Modal ───────────────────────────────────────────────────

function ProjectModal({ project, clients, onClose, onSave }: { project?: Project | null; clients: Client[]; onClose: () => void; onSave: (data: Partial<Project>) => Promise<void> }) {
  const [form, setForm] = useState({
    name: project?.name || '', client_id: project?.client_id || '', status: project?.status || 'lead' as ProjectStatus,
    health: project?.health || 'green' as ProjectHealth, budget: project?.budget || 0, spent: project?.spent || 0,
    progress: project?.progress || 0, deadline: project?.deadline || '', description: project?.description || '',
    notes: project?.notes || '', tags: project?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name, client_id: form.client_id || undefined, status: form.status, health: form.health,
        budget: form.budget || undefined, spent: form.spent, progress: form.progress,
        deadline: form.deadline || undefined, description: form.description || undefined,
        notes: form.notes || undefined, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
      onClose();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-gray-500 mb-1.5 block">Project Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Client</label>
            <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50">
              <option value="">No client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ProjectStatus }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Health</label>
              <div className="flex gap-2">
                {(['green', 'yellow', 'red'] as ProjectHealth[]).map(h => {
                  const cfg = HEALTH_CONFIG[h];
                  return <button key={h} type="button" onClick={() => setForm(p => ({ ...p, health: h }))} className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${form.health === h ? `${cfg.color} bg-white/5 border-white/20` : 'text-gray-500 border-white/10 hover:bg-white/5'}`}>{cfg.label}</button>;
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Budget</label><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" /><input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: parseFloat(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Spent</label><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="number" value={form.spent} onChange={e => setForm(p => ({ ...p, spent: parseFloat(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Progress %</label><input type="number" min={0} max={100} value={form.progress} onChange={e => setForm(p => ({ ...p, progress: parseInt(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          </div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 resize-none" /></div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Tags</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="web, mobile, priority" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Project Detail Drawer ────────────────────────────────────────────────────

function ProjectDrawer({ project, onClose, onEdit }: { project: Project; onClose: () => void; onEdit: () => void }) {
  const sc = STATUS_CONFIG[project.status];
  const hc = HEALTH_CONFIG[project.health];
  const HealthIcon = hc.icon;
  const days = project.deadline ? daysUntil(project.deadline) : null;
  const budgetPct = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="relative w-full max-w-xl h-full bg-[#0d0d0d]/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2"><HealthIcon size={20} className={hc.color} /><h2 className="text-xl font-bold text-white">{project.name}</h2></div>
              <div className="flex items-center gap-2"><span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bgColor} ${sc.color} ${sc.borderColor}`}>{sc.label}</span>{project.client && <span className="text-xs text-gray-500">{project.client.name}</span>}</div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-white">{project.progress}%</p><p className="text-xs text-gray-500">Complete</p></div>
            <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-emerald-400">{project.budget ? formatCurrency(project.budget - project.spent) : 'N/A'}</p><p className="text-xs text-gray-500">Remaining</p></div>
            <div className="bg-white/5 rounded-xl p-3 text-center"><p className={`text-2xl font-bold ${days !== null ? (days < 0 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-blue-400') : 'text-gray-500'}`}>{days !== null ? Math.abs(days) : 'N/A'}</p><p className="text-xs text-gray-500">{days !== null ? (days < 0 ? 'Days Over' : 'Days Left') : 'No Deadline'}</p></div>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          {/* Progress bar */}
          <div><h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Progress</h4><div className="h-3 bg-white/5 rounded-full overflow-hidden"><motion.div className={`h-full rounded-full ${project.progress >= 80 ? 'bg-emerald-500' : project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1 }} /></div><p className="text-xs text-gray-500 mt-1 text-right">{project.progress}% complete</p></div>
          {/* Budget */}
          {project.budget ? (
            <div><h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Budget</h4><div className="bg-white/5 rounded-xl p-4"><div className="flex justify-between mb-2"><span className="text-gray-400 text-sm">Spent</span><span className="text-white text-sm">{formatCurrency(project.spent)}</span></div><div className="flex justify-between mb-3"><span className="text-gray-400 text-sm">Total</span><span className="text-white text-sm">{formatCurrency(project.budget)}</span></div><div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${budgetPct > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(budgetPct, 100)}%` }} /></div><p className="text-xs text-gray-500 mt-2 text-right">{budgetPct}% used</p></div></div>
          ) : null}
          {project.description && <div><h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</h4><p className="text-sm text-white">{project.description}</p></div>}
          {project.deadline && <div><h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Deadline</h4><p className="text-sm text-white flex items-center gap-2"><Calendar size={14} className="text-gray-500" />{formatDate(project.deadline)}</p></div>}
          {project.tags && project.tags.length > 0 && <div className="flex flex-wrap gap-2">{project.tags.map(t => <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-500">{t}</span>)}</div>}
          {project.notes && <div><h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Notes</h4><p className="text-sm text-white whitespace-pre-wrap">{project.notes}</p></div>}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end"><button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm"><FileText size={14} /> Edit Project</button></div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [projRes, clientRes] = await Promise.all([
        getProjects({ status: statusFilter !== 'all' ? statusFilter : undefined }),
        getClients(),
      ]);
      if (projRes.data) setProjects(projRes.data);
      if (clientRes.data) setClients(clientRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
    atRisk: projects.filter(p => p.health !== 'green').length,
    totalBudget: projects.reduce((s, p) => s + (p.budget || 0), 0),
    totalSpent: projects.reduce((s, p) => s + p.spent, 0),
  }), [projects]);

  const projectsByStatus = useMemo(() => {
    const grouped: Record<string, Project[]> = {};
    KANBAN_STATUSES.forEach(s => grouped[s] = []);
    filtered.forEach(p => { if (grouped[p.status]) grouped[p.status].push(p); });
    return grouped;
  }, [filtered]);

  const handleSaveProject = async (data: Partial<Project>) => {
    if (editingProject) {
      const { error } = await updateProject(editingProject.id, data);
      if (error) throw error;
    } else {
      const { error } = await createProject(data);
      if (error) throw error;
    }
    await loadData();
  };

  const handleDropProject = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const { error } = await updateProject(projectId, { status: newStatus });
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Projects</h1><p className="text-sm text-gray-500 mt-1">Track and manage all your projects</p></div>
        <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm"><Plus size={18} /> New Project</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Projects', value: String(stats.total), icon: Briefcase, accent: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Active', value: String(stats.active), icon: Zap, accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'At Risk', value: String(stats.atRisk), icon: AlertTriangle, accent: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Total Budget', value: formatCurrency(stats.totalBudget), icon: DollarSign, accent: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-gradient-to-br from-white/[0.08] to-white/[0.02] border ${stat.border} rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{stat.label}</span><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={18} className={stat.accent} /></div></div>
            <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>Grid</button>
            <button onClick={() => setViewMode('kanban')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'kanban' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'}`}>Kanban</button>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50">
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 && !search && statusFilter === 'all' ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6"><Briefcase size={40} className="text-emerald-400" /></div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-500 max-w-md mb-6">Create your first project to start tracking work, budgets, and deadlines.</p>
          <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"><Plus size={18} /> Create Your First Project</button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const sc = STATUS_CONFIG[project.status];
            const hc = HEALTH_CONFIG[project.health];
            const HealthIcon = hc.icon;
            const days = project.deadline ? daysUntil(project.deadline) : null;
            const budgetPct = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;

            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setSelectedProject(project)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 p-5 cursor-pointer hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bgColor} ${sc.color} ${sc.borderColor}`}>{sc.label}</span>
                      {project.client && <span className="text-[10px] text-gray-500">{project.client.name}</span>}
                    </div>
                  </div>
                  <HealthIcon size={18} className={hc.color} />
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span className="text-white font-medium">{project.progress}%</span></div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full ${project.progress >= 80 ? 'bg-emerald-500' : project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.05 }} />
                  </div>
                </div>

                {/* Budget & Deadline */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1 text-gray-500"><DollarSign size={12} />{project.budget ? <span>{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span> : <span>No budget</span>}</div>
                  {days !== null && <div className={`flex items-center gap-1 ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-gray-500'}`}><Clock size={12} />{days < 0 ? `${Math.abs(days)}d over` : `${days}d left`}</div>}
                </div>

                {project.tags && project.tags.length > 0 && <div className="flex flex-wrap gap-1 mb-3">{project.tags.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-500">{t}</span>)}</div>}

                {/* Budget bar */}
                {project.budget ? (
                  <div className="pt-3 border-t border-white/10">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${budgetPct > 90 ? 'bg-red-500' : budgetPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(budgetPct, 100)}%` }} /></div>
                    <p className="text-[10px] text-gray-500 mt-1 text-right">{budgetPct}% of budget used</p>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Kanban View */
        <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex gap-4 lg:grid lg:grid-cols-5 lg:gap-3 min-w-max lg:min-w-0">
            {KANBAN_STATUSES.map((status, i) => {
              const sc = STATUS_CONFIG[status];
              const col = projectsByStatus[status] || [];
              return (
                <motion.div key={status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="min-w-[260px] w-[260px] lg:min-w-0 lg:w-auto lg:flex-1">
                  <div className={`px-3 py-3 rounded-t-xl border border-b-0 bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-white/[0.1]`}>
                    <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${sc.bgColor.replace('/10', '')}`} /><h3 className={`font-semibold text-sm ${sc.color}`}>{sc.label}</h3><span className="text-xs px-1.5 py-0.5 rounded-md bg-white/10 text-gray-500">{col.length}</span></div>
                  </div>
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('projectId'); if (id) handleDropProject(id, status); }}
                    className="p-2.5 rounded-b-xl border border-t-0 border-white/[0.1] min-h-[300px] space-y-2.5"
                  >
                    {col.map(p => {
                      const hc = HEALTH_CONFIG[p.health]; const HI = hc.icon;
                      return (
                        <div key={p.id} draggable onDragStart={e => { e.dataTransfer.setData('projectId', p.id); e.dataTransfer.effectAllowed = 'move'; }}>
                          <motion.div layout className="group cursor-pointer rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.1] hover:border-emerald-500/40 p-3.5 transition-all" onClick={() => setSelectedProject(p)}>
                            <div className="flex items-start justify-between mb-2"><h3 className="font-semibold text-white text-sm truncate group-hover:text-emerald-300 flex-1">{p.name}</h3><HI size={14} className={hc.color} /></div>
                            {p.client && <p className="text-xs text-gray-500 mb-2">{p.client.name}</p>}
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                            <div className="flex items-center justify-between text-[10px] text-gray-500"><span>{p.progress}%</span>{p.budget && <span>{formatCurrency(p.spent)}/{formatCurrency(p.budget)}</span>}</div>
                          </motion.div>
                        </div>
                      );
                    })}
                    {col.length === 0 && <div className="py-10 text-center"><Briefcase size={18} className="mx-auto mb-2 text-gray-600" /><p className="text-xs text-gray-600">No projects</p></div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty search result */}
      {filtered.length === 0 && (search || statusFilter !== 'all') && (
        <div className="text-center py-12"><p className="text-gray-500">No projects match your filters</p></div>
      )}

      {/* Drawer */}
      <AnimatePresence>{selectedProject && <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} onEdit={() => { setEditingProject(selectedProject); setShowModal(true); setSelectedProject(null); }} />}</AnimatePresence>

      {/* Modal */}
      <AnimatePresence>{showModal && <ProjectModal project={editingProject} clients={clients} onClose={() => { setShowModal(false); setEditingProject(undefined); }} onSave={handleSaveProject} />}</AnimatePresence>
    </div>
  );
}
