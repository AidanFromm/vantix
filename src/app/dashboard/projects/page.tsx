'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Clock, DollarSign, Briefcase, Zap,
  AlertTriangle, CheckCircle2, Loader2, Calendar, Trash2,
} from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, getClients } from '@/lib/supabase';
import type { Project, ProjectStatus, Client } from '@/lib/types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  lead: { label: 'Lead', color: 'text-[#8C857C]', bg: 'bg-[#8C857C]/10', border: 'border-[#8C857C]/30' },
  proposal: { label: 'Proposal', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  active: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'on-hold': { label: 'On Hold', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  review: { label: 'Review', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  complete: { label: 'Complete', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  archived: { label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
};

function formatCurrency(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n); }
function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

function ProjectModal({ project, clients, onClose, onSave }: { project?: Project | null; clients: Client[]; onClose: () => void; onSave: (data: Partial<Project>) => Promise<void> }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    client_id: project?.client_id || '',
    status: project?.status || 'lead' as ProjectStatus,
    budget: project?.budget || 0,
    deadline: project?.deadline || '',
    description: project?.description || '',
    notes: project?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        client_id: form.client_id || undefined,
        status: form.status,
        budget: form.budget || undefined,
        deadline: form.deadline || undefined,
        description: form.description || undefined,
        notes: form.notes || undefined,
      });
      onClose();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const inputCls = 'w-full bg-[#FAFAFA] border border-[#E8E2DA] rounded-xl px-4 py-3 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50 transition-colors';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2D2A26]/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-white border border-[#E8E2DA] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E8E2DA] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D2A26]">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F5F0EB] text-[#8C857C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Project Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} /></div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Client</label>
            <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={inputCls}>
              <option value="">No client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ProjectStatus }))} className={inputCls}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Budget</label><input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#F5F0EB] text-[#8C857C] text-sm hover:bg-[#EDE7DF]">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-[#B8895A] text-white font-medium text-sm hover:bg-[#A67A4B] disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : project ? 'Update Project' : 'Create Project'}
            </button>
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

  const loadData = useCallback(async () => {
    try {
      const [projRes, clientRes] = await Promise.all([
        getProjects({ status: statusFilter !== 'all' ? statusFilter : undefined }),
        getClients(),
      ]);
      setProjects(projRes.data || []);
      setClients(clientRes.data || []);
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
    totalBudget: projects.reduce((s, p) => s + (p.budget || 0), 0),
    totalPaid: projects.reduce((s, p) => s + ((p as any).paid || p.spent || 0), 0),
  }), [projects]);

  const handleSave = async (data: Partial<Project>) => {
    if (editingProject) {
      const { error } = await updateProject(editingProject.id, data);
      if (error) throw error;
    } else {
      const { error } = await createProject(data);
      if (error) throw error;
    }
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    setDeleting(id);
    try {
      const { error } = await deleteProject(id);
      if (error) throw error;
      await loadData();
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[#E8E2DA] rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#E8E2DA]/50 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-[#E8E2DA]/50 rounded-2xl" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26]">Projects</h1><p className="text-sm text-[#8C857C] mt-1">Track and manage all your projects</p></div>
        <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#B8895A] hover:bg-[#A67A4B] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#B8895A]/20 text-sm"><Plus size={18} /> New Project</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Projects', value: String(stats.total), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Active', value: String(stats.active), icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Budget', value: formatCurrency(stats.totalBudget), icon: DollarSign, color: 'text-[#B8895A]', bg: 'bg-[#B8895A]/10', border: 'border-[#B8895A]/20' },
          { label: 'Total Paid', value: formatCurrency(stats.totalPaid), icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-white border ${stat.border} rounded-2xl p-4 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#8C857C]">{stat.label}</span><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={18} className={stat.color} /></div></div>
            <p className="text-xl sm:text-2xl font-bold text-[#2D2A26]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C857C]" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8E2DA] rounded-xl text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border border-[#E8E2DA] rounded-xl px-3 py-2 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 && !search && statusFilter === 'all' ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#B8895A]/10 flex items-center justify-center mb-6"><Briefcase size={40} className="text-[#B8895A]" /></div>
          <h3 className="text-xl font-semibold text-[#2D2A26] mb-2">No projects yet</h3>
          <p className="text-[#8C857C] max-w-md mb-6">Create your first project to start tracking work, budgets, and deadlines.</p>
          <button onClick={() => { setEditingProject(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#B8895A]/10 text-[#B8895A] border border-[#B8895A]/30 hover:bg-[#B8895A]/20 font-medium"><Plus size={18} /> Create Your First Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG.lead;
            const days = project.deadline ? daysUntil(project.deadline) : null;
            const paid = (project as any).paid || project.spent || 0;
            const progress = project.progress ?? (project.budget ? Math.round((paid / project.budget) * 100) : 0);

            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-2xl bg-white border border-[#E8E2DA] p-5 hover:border-[#B8895A]/30 hover:shadow-lg transition-all duration-300 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#2D2A26] truncate group-hover:text-[#B8895A] transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bg} ${sc.color} ${sc.border}`}>{sc.label}</span>
                      {project.client && <span className="text-[10px] text-[#8C857C]">{project.client.name}</span>}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#8C857C] mb-1"><span>Progress</span><span className="text-[#2D2A26] font-medium">{progress}%</span></div>
                  <div className="h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${progress >= 80 ? 'bg-emerald-500' : progress >= 50 ? 'bg-blue-500' : 'bg-[#B8895A]'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1 text-[#8C857C]"><DollarSign size={12} />{project.budget ? <span>{formatCurrency(paid)} / {formatCurrency(project.budget)}</span> : <span>No budget</span>}</div>
                  {days !== null && <div className={`flex items-center gap-1 ${days < 0 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-[#8C857C]'}`}><Clock size={12} />{days < 0 ? `${Math.abs(days)}d over` : `${days}d left`}</div>}
                </div>

                {(project.tags?.length ?? 0) > 0 && <div className="flex flex-wrap gap-1 mb-3">{project.tags!.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-[#F5F0EB] text-[10px] text-[#8C857C]">{t}</span>)}</div>}

                <div className="flex items-center gap-2 pt-3 border-t border-[#E8E2DA]">
                  <button onClick={() => { setEditingProject(project); setShowModal(true); }} className="flex-1 text-center px-3 py-2 rounded-lg bg-[#F5F0EB] text-[#8C857C] hover:text-[#B8895A] hover:bg-[#B8895A]/10 text-xs font-medium transition-colors">Edit</button>
                  <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id} className="px-3 py-2 rounded-lg bg-[#F5F0EB] text-[#8C857C] hover:text-red-500 hover:bg-red-50 text-xs transition-colors">
                    {deleting === project.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (search || statusFilter !== 'all') && (
        <div className="text-center py-12"><p className="text-[#8C857C]">No projects match your filters</p></div>
      )}

      <AnimatePresence>{showModal && <ProjectModal project={editingProject} clients={clients} onClose={() => { setShowModal(false); setEditingProject(undefined); }} onSave={handleSave} />}</AnimatePresence>
    </div>
  );
}
