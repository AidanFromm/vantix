'use client';

import { useState, useEffect } from 'react';
import {
  FolderOpen, Plus, X, ChevronDown, ArrowLeft, CheckCircle2,
  Circle, Clock, Pause, Calendar, DollarSign, Target, Edit2, Trash2
} from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';

interface Milestone {
  name: string;
  done: boolean;
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  endDate: string;
  description: string;
  milestones: Milestone[];
}

const SEED: Project[] = [];

const CLIENTS = ['SecuredTampa', 'JFK Maintenance', 'Vantix Internal'];

const defaultStatusMeta = { label: 'Unknown', style: 'bg-gray-100 text-gray-600', icon: Circle };
const statusMeta: Record<string, { label: string; style: string; icon: typeof Circle }> = {
  active: { label: 'Active', style: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  completed: { label: 'Completed', style: 'bg-[#B07A45]/20 text-[#8E5E34]', icon: Target },
  'on-hold': { label: 'On Hold', style: 'bg-[#D6D2CD] text-[#4B4B4B]', icon: Pause },
  planning: { label: 'Planning', style: 'bg-blue-100 text-blue-700', icon: Circle },
  in_progress: { label: 'In Progress', style: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  review: { label: 'Review', style: 'bg-amber-100 text-amber-700', icon: Clock },
  delivered: { label: 'Delivered', style: 'bg-[#B07A45]/20 text-[#8E5E34]', icon: Target },
};

const fmt = (n: number | undefined | null) => '$' + (n || 0).toLocaleString('en-US');

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  // form
  const [fName, setFName] = useState('');
  const [fClient, setFClient] = useState(CLIENTS[0]);
  const [fStatus, setFStatus] = useState<Project['status']>('active');
  const [fBudget, setFBudget] = useState(0);
  const [fStart, setFStart] = useState('');
  const [fEnd, setFEnd] = useState('');
  const [fDesc, setFDesc] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getData<Project>('projects');
        setProjects(data.length ? data : SEED);
      } catch { setProjects(SEED); }
    })();
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  function openCreate() {
    setEditing(null); setFName(''); setFClient(CLIENTS[0]); setFStatus('active');
    setFBudget(0); setFStart(''); setFEnd(''); setFDesc(''); setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p); setFName(p.name); setFClient(p.client); setFStatus(p.status);
    setFBudget(p.budget); setFStart(p.startDate); setFEnd(p.endDate); setFDesc(p.description);
    setModalOpen(true);
  }

  async function saveProject() {
    const updates = { name: fName, client: fClient, status: fStatus, budget: fBudget, startDate: fStart, endDate: fEnd, description: fDesc };
    if (editing) {
      try { await updateRecord('projects', editing.id, updates); } catch {}
      setProjects(prev => prev.map(p => p.id === editing.id ? { ...p, ...updates } : p));
    } else {
      const rec = { ...updates, spent: 0, progress: 0, milestones: [] };
      try {
        const created = await createRecord<Project>('projects', rec);
        setProjects(prev => [created, ...prev]);
      } catch {
        const np: Project = { id: crypto.randomUUID(), ...rec } as Project;
        setProjects(prev => [np, ...prev]);
      }
    }
    setModalOpen(false);
  }

  function toggleMilestone(projId: string, msIdx: number) {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p;
      const ms = (p.milestones || []).map((m, i) => i === msIdx ? { ...m, done: !m.done } : m);
      const progress = ms.length ? Math.round(ms.filter(m => m.done).length / ms.length * 100) : (p.progress || 0);
      const updated = { ...p, milestones: ms, progress };
      if (selected?.id === projId) setSelected(updated);
      return updated;
    }));
  }

  async function deleteProject(id: string) {
    try { await deleteRecord('projects', id); } catch {}
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  // Detail view
  if (selected) {
    const p = projects.find(pr => pr.id === selected.id) || selected;
    const pct = p.budget ? Math.min(100, Math.round(p.spent / p.budget * 100)) : 0;
    const sm = statusMeta[p.status] || defaultStatusMeta;
    return (
      <div className="min-h-screen bg-[#F4EFE8] p-6 md:p-10">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-[#B07A45] mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">{p.name}</h1>
            <p className="text-sm text-[#7A746C] mt-1">{p.client}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${sm.style}`}>{sm.label}</span>
        </div>
        <p className="text-sm text-[#4B4B4B] mb-8 leading-relaxed">{p.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Budget */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <h3 className="text-xs text-[#7A746C] uppercase tracking-wide mb-3 flex items-center gap-1"><DollarSign size={14} /> Budget</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#4B4B4B]">Spent: {fmt(p.spent)}</span>
              <span className="text-[#1C1C1C] font-semibold">/ {fmt(p.budget)}</span>
            </div>
            <div className="h-2.5 bg-[#E3D9CD] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#C89A6A] to-[#B07A45] transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-[#7A746C] mt-1 text-right">{pct}%</p>
          </div>
          {/* Timeline */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <h3 className="text-xs text-[#7A746C] uppercase tracking-wide mb-3 flex items-center gap-1"><Calendar size={14} /> Timeline</h3>
            <div className="flex justify-between text-sm text-[#4B4B4B]">
              <div><span className="text-[#7A746C] text-xs block">Start</span>{p.startDate}</div>
              <div className="text-right"><span className="text-[#7A746C] text-xs block">End</span>{p.endDate || 'Ongoing'}</div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
          <h3 className="text-xs text-[#7A746C] uppercase tracking-wide mb-4 flex items-center gap-1"><Target size={14} /> Milestones</h3>
          {(p.milestones || []).length === 0 && <p className="text-sm text-[#7A746C]">No milestones yet.</p>}
          <div className="space-y-2">
            {(p.milestones || []).map((m, i) => (
              <button key={i} onClick={() => toggleMilestone(p.id, i)}
                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-[#E3D9CD]/60 transition text-sm">
                {m.done
                  ? <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  : <Circle size={18} className="text-[#7A746C] shrink-0" />}
                <span className={m.done ? 'line-through text-[#7A746C]' : 'text-[#1C1C1C]'}>{m.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Projects</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow hover:opacity-90 transition">
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'active', 'completed', 'on-hold'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition ${
              filter === f ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white shadow' : 'bg-[#EEE6DC] text-[#4B4B4B] border border-[#E3D9CD] hover:bg-[#E3D9CD]'
            }`}>
            {f === 'all' ? 'All' : f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(p => {
          const pct = p.budget ? Math.min(100, Math.round(p.spent / p.budget * 100)) : 0;
          const sm = statusMeta[p.status] || defaultStatusMeta;
          return (
            <div key={p.id} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 hover:shadow-md transition cursor-pointer group"
              onClick={() => setSelected(p)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-[#B07A45]" />
                  <h3 className="font-semibold text-[#1C1C1C] text-sm">{p.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sm.style}`}>{sm.label}</span>
              </div>
              <p className="text-xs text-[#7A746C] mb-4">{p.client}</p>

              {/* Budget bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#7A746C]">{fmt(p.spent)} / {fmt(p.budget)}</span>
                  <span className="text-[#1C1C1C] font-semibold">{p.progress}%</span>
                </div>
                <div className="h-2 bg-[#E3D9CD] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#C89A6A] to-[#B07A45] transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-[#7A746C]">
                  <Clock size={12} /> {p.endDate || 'Ongoing'}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={e => { e.stopPropagation(); openEdit(p); }} className="p-1 rounded hover:bg-[#E3D9CD] text-[#4B4B4B]"><Edit2 size={14} /></button>
                  <button onClick={e => { e.stopPropagation(); deleteProject(p.id); }} className="p-1 rounded hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {!filtered.length && (
          <div className="col-span-full text-center py-12 text-[#7A746C] text-sm">No projects found.</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1C1C1C]">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><X size={18} /></button>
            </div>

            {[
              { label: 'Project Name', value: fName, set: setFName, type: 'text' },
            ].map(f => (
              <div key={f.label} className="mb-4">
                <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                  className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Client</label>
              <div className="relative">
                <select value={fClient} onChange={e => setFClient(e.target.value)}
                  className="w-full appearance-none bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40">
                  {CLIENTS.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-[#7A746C] pointer-events-none" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Status</label>
              <div className="relative">
                <select value={fStatus} onChange={e => setFStatus(e.target.value as Project['status'])}
                  className="w-full appearance-none bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-[#7A746C] pointer-events-none" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Budget</label>
              <input type="number" value={fBudget || ''} onChange={e => setFBudget(+e.target.value)}
                className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Start Date</label>
                <input type="date" value={fStart} onChange={e => setFStart(e.target.value)}
                  className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
              </div>
              <div>
                <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">End Date</label>
                <input type="date" value={fEnd} onChange={e => setFEnd(e.target.value)}
                  className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Description</label>
              <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} rows={3}
                className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 resize-none" />
            </div>

            <button onClick={saveProject}
              className="w-full py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow hover:opacity-90 transition">
              {editing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
