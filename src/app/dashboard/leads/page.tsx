'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, LayoutGrid, List, X, ChevronDown, Phone, Mail, Building2,
  Globe, Users, Megaphone, MessageSquare, MoreVertical, ArrowRight,
  TrendingUp, Clock, Search, Edit2, Trash2, Eye, Activity
} from 'lucide-react';

/* ─── Types ─── */
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: Source;
  stage: Stage;
  score: number;
  notes: string;
  createdAt: string;
  stageChangedAt: string;
  activities: ActivityEntry[];
}

interface ActivityEntry {
  id: string;
  date: string;
  text: string;
}

type Stage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
type Source = 'Website' | 'Referral' | 'Cold Email' | 'Social' | 'Other';
type ViewMode = 'kanban' | 'list';

const STAGES: { key: Stage; label: string; color: string; bg: string; border: string }[] = [
  { key: 'new', label: 'New', color: '#7A746C', bg: '#E3D9CD', border: '#CFC5B8' },
  { key: 'contacted', label: 'Contacted', color: '#B07A45', bg: '#E8DDD0', border: '#D4C4B0' },
  { key: 'qualified', label: 'Qualified', color: '#8E5E34', bg: '#E4D5C4', border: '#CEBC A6' },
  { key: 'proposal', label: 'Proposal Sent', color: '#6B4226', bg: '#DCC9B4', border: '#C4AD94' },
  { key: 'won', label: 'Won', color: '#2D7A4F', bg: '#D4E8DC', border: '#B4D4C0' },
  { key: 'lost', label: 'Lost', color: '#A0403C', bg: '#EADADA', border: '#D4BABA' },
];

const SOURCES: Source[] = ['Website', 'Referral', 'Cold Email', 'Social', 'Other'];
const STORAGE_KEY = 'vantix_leads';

const sourceIcon = (s: Source) => {
  switch (s) {
    case 'Website': return <Globe size={14} />;
    case 'Referral': return <Users size={14} />;
    case 'Cold Email': return <Mail size={14} />;
    case 'Social': return <Megaphone size={14} />;
    default: return <MessageSquare size={14} />;
  }
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function daysBetween(a: string, b: string) {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function conversionProbability(score: number, stage: Stage): number {
  const stageMultiplier: Record<Stage, number> = {
    new: 0.15, contacted: 0.30, qualified: 0.55, proposal: 0.75, won: 1.0, lost: 0.0,
  };
  return Math.round(score * stageMultiplier[stage]);
}

function scoreBadgeColor(score: number) {
  if (score >= 80) return { bg: '#D4E8DC', text: '#2D7A4F' };
  if (score >= 50) return { bg: '#E8DDD0', text: '#8E5E34' };
  return { bg: '#EADADA', text: '#A0403C' };
}

/* ─── No seed data — starts empty, fully editable ─── */

function loadLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

/* ─── Components ─── */

function ScoreBadge({ score }: { score: number }) {
  const c = scoreBadgeColor(score);
  return (
    <span style={{ background: c.bg, color: c.text }} className="text-xs font-semibold px-2 py-0.5 rounded-full">
      {score}
    </span>
  );
}

function StageDropdown({ current, onMove }: { current: Stage; onMove: (s: Stage) => void }) {
  const [open, setOpen] = useState(false);
  const targets = STAGES.filter(s => s.key !== current);
  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="p-1 rounded hover:bg-black/5 transition-colors">
        <MoreVertical size={16} className="text-[#7A746C]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 z-50 bg-white rounded-xl shadow-lg border border-[#E3D9CD] py-1 min-w-[160px]">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider">Move to</div>
            {targets.map(s => (
              <button key={s.key} onClick={(e) => { e.stopPropagation(); onMove(s.key); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#F4EFE8] flex items-center gap-2 text-[#4B4B4B]">
                <ArrowRight size={12} style={{ color: s.color }} /> {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LeadCard({ lead, onMove, onClick }: { lead: Lead; onMove: (s: Stage) => void; onClick: () => void }) {
  const days = daysBetween(lead.stageChangedAt, new Date().toISOString());
  return (
    <div onClick={onClick}
      className="bg-white rounded-xl p-3.5 border border-[#E3D9CD] hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <div className="font-semibold text-sm text-[#1C1C1C] truncate flex-1">{lead.name}</div>
        <StageDropdown current={lead.stage} onMove={onMove} />
      </div>
      <div className="text-xs text-[#4B4B4B] flex items-center gap-1.5 mb-1.5">
        <Building2 size={12} className="text-[#7A746C] shrink-0" /> <span className="truncate">{lead.company}</span>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-1.5 text-[10px] text-[#7A746C]">
          {sourceIcon(lead.source)} {lead.source}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#7A746C] flex items-center gap-1"><Clock size={10} />{days}d</span>
          <ScoreBadge score={lead.score} />
        </div>
      </div>
    </div>
  );
}

function LeadDetailPanel({ lead, onClose, onEdit, onDelete }: { lead: Lead; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  const stage = STAGES.find(s => s.key === lead.stage) || STAGES[0];
  const prob = conversionProbability(lead.score, lead.stage);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative w-full max-w-md bg-[#F4EFE8] h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1C1C1C]">{lead.name}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#EEE6DC]"><X size={20} className="text-[#7A746C]" /></button>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#EEE6DC] text-[#4B4B4B] hover:bg-[#E3D9CD] transition-colors">
              <Edit2 size={12} /> Edit
            </button>
            <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#EADADA] text-[#A0403C] hover:bg-[#DFC8C8] transition-colors">
              <Trash2 size={12} /> Delete
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-[#E3D9CD]">
              <div className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider mb-3">Contact</div>
              <div className="space-y-2 text-sm text-[#4B4B4B]">
                <div className="flex items-center gap-2"><Mail size={14} className="text-[#B07A45]" /> {lead.email}</div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-[#B07A45]" /> {lead.phone}</div>
                <div className="flex items-center gap-2"><Building2 size={14} className="text-[#B07A45]" /> {lead.company}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E3D9CD]">
              <div className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider mb-3">Pipeline</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-[#7A746C]">Stage</div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: stage.bg, color: stage.color }}>{stage.label}</span>
                </div>
                <div>
                  <div className="text-[10px] text-[#7A746C]">Source</div>
                  <div className="text-sm text-[#4B4B4B] flex items-center gap-1">{sourceIcon(lead.source)} {lead.source}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#7A746C]">Score</div>
                  <ScoreBadge score={lead.score} />
                </div>
                <div>
                  <div className="text-[10px] text-[#7A746C]">Conversion</div>
                  <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: prob >= 60 ? '#2D7A4F' : prob >= 30 ? '#B07A45' : '#A0403C' }}>
                    <TrendingUp size={14} /> {prob}%
                  </div>
                </div>
              </div>
            </div>

            {lead.notes && (
              <div className="bg-white rounded-xl p-4 border border-[#E3D9CD]">
                <div className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider mb-2">Notes</div>
                <p className="text-sm text-[#4B4B4B]">{lead.notes}</p>
              </div>
            )}

            <div className="bg-white rounded-xl p-4 border border-[#E3D9CD]">
              <div className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity size={14} /> Activity Log
              </div>
              <div className="space-y-3">
                {(lead.activities || []).slice().reverse().map(a => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B07A45] mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs text-[#7A746C]">{new Date(a.date).toLocaleDateString()}</div>
                      <div className="text-sm text-[#4B4B4B]">{a.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const emptyLead = (): Omit<Lead, 'id' | 'createdAt' | 'stageChangedAt' | 'activities'> => ({
  name: '', email: '', phone: '', company: '', source: 'Website', stage: 'new', score: 50, notes: '',
});

function LeadModal({ lead, onSave, onClose }: { lead: Lead | null; onSave: (data: Partial<Lead>) => void; onClose: () => void }) {
  const [form, setForm] = useState(lead ? { name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, source: lead.source, stage: lead.stage, score: lead.score, notes: lead.notes } : emptyLead());
  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));
  const isEdit = !!lead;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-[#F4EFE8] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1C1C1C]">{isEdit ? 'Edit Lead' : 'Add Lead'}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#EEE6DC]"><X size={20} className="text-[#7A746C]" /></button>
          </div>

          <div className="space-y-3.5">
            {(['name', 'email', 'phone', 'company'] as const).map(field => (
              <div key={field}>
                <label className="text-xs font-medium text-[#7A746C] capitalize">{field}</label>
                <input value={(form as Record<string, string | number>)[field] as string} onChange={e => set(field, e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45] transition-colors"
                  placeholder={`Enter ${field}`} />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#7A746C]">Source</label>
                <select value={form.source} onChange={e => set('source', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30">
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#7A746C]">Stage</label>
                <select value={form.stage} onChange={e => set('stage', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30">
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#7A746C]">Score (1-100)</label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min={1} max={100} value={form.score} onChange={e => set('score', +e.target.value)}
                  className="flex-1 accent-[#B07A45]" />
                <ScoreBadge score={form.score} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#7A746C]">Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none" />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#E3D9CD] text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] transition-colors">Cancel</button>
            <button onClick={() => onSave(form)} disabled={!form.name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-40">
              {isEdit ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [modalLead, setModalLead] = useState<Lead | null | 'new'>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setLeads(loadLeads()); setMounted(true); }, []);

  const persist = useCallback((updated: Lead[]) => { setLeads(updated); saveLeads(updated); }, []);

  const moveLead = useCallback((id: string, stage: Stage) => {
    persist(leads.map(l => l.id === id ? { ...l, stage, stageChangedAt: new Date().toISOString(), activities: [...(l.activities || []), { id: uid(), date: new Date().toISOString(), text: `Moved to ${(STAGES.find(s => s.key === stage) || { label: stage }).label}` }] } : l));
  }, [leads, persist]);

  const saveLead = useCallback((data: Partial<Lead>) => {
    if (modalLead === 'new') {
      const now = new Date().toISOString();
      const newLead: Lead = { id: uid(), name: '', email: '', phone: '', company: '', source: 'Website', stage: 'new', score: 50, notes: '', createdAt: now, stageChangedAt: now, activities: [{ id: uid(), date: now, text: 'Lead created' }], ...data };
      persist([...leads, newLead]);
    } else if (modalLead) {
      const oldStage = (modalLead as Lead).stage;
      persist(leads.map(l => {
        if (l.id !== (modalLead as Lead).id) return l;
        const updated = { ...l, ...data };
        if (data.stage && data.stage !== oldStage) {
          updated.stageChangedAt = new Date().toISOString();
          updated.activities = [...(updated.activities || []), { id: uid(), date: new Date().toISOString(), text: `Moved to ${(STAGES.find(s => s.key === data.stage) || { label: data.stage }).label}` }];
        }
        return updated;
      }));
    }
    setModalLead(null);
  }, [modalLead, leads, persist]);

  const deleteLead = useCallback((id: string) => {
    persist(leads.filter(l => l.id !== id));
    setDetailLead(null);
  }, [leads, persist]);

  const filtered = leads.filter(l =>
    !search || [l.name, l.company, l.source].some(f => (f || '').toLowerCase().includes(search.toLowerCase()))
  );

  if (!mounted) return <div className="min-h-screen bg-[#F4EFE8]" />;

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Lead Pipeline</h1>
          <p className="text-sm text-[#7A746C] mt-0.5">{leads.length} total leads</p>
        </div>
        <button onClick={() => setModalLead('new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold hover:shadow-lg transition-all">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="flex items-center bg-[#EEE6DC] rounded-xl p-1">
          {([['kanban', LayoutGrid], ['list', List]] as [ViewMode, typeof LayoutGrid][]).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C] hover:text-[#4B4B4B]'}`}>
              <Icon size={14} /> {v === 'kanban' ? 'Kanban' : 'List'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#EEE6DC] border border-[#E3D9CD] text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
          {STAGES.filter(s => s.key !== 'lost').map(stage => {
            const colLeads = filtered.filter(l => l.stage === stage.key);
            // Show lost leads in the Won column too
            const lostLeads = stage.key === 'won' ? filtered.filter(l => l.stage === 'lost') : [];
            return (
              <div key={stage.key} className="min-w-[260px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                    <span className="text-sm font-semibold text-[#1C1C1C]">{stage.label}</span>
                  </div>
                  <span className="text-xs text-[#7A746C] bg-[#EEE6DC] px-2 py-0.5 rounded-full">{colLeads.length + lostLeads.length}</span>
                </div>
                <div className="space-y-2.5 bg-[#EEE6DC]/50 rounded-xl p-2.5 min-h-[120px] border border-[#E3D9CD]/50">
                  {colLeads.map(l => (
                    <LeadCard key={l.id} lead={l} onMove={s => moveLead(l.id, s)} onClick={() => setDetailLead(l)} />
                  ))}
                  {lostLeads.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="w-2 h-2 rounded-full bg-[#A0403C]" />
                        <span className="text-xs font-semibold text-[#A0403C]">Lost</span>
                      </div>
                      {lostLeads.map(l => (
                        <LeadCard key={l.id} lead={l} onMove={s => moveLead(l.id, s)} onClick={() => setDetailLead(l)} />
                      ))}
                    </>
                  )}
                  {colLeads.length === 0 && lostLeads.length === 0 && (
                    <div className="text-center py-6 text-xs text-[#7A746C]">No leads</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-[#E3D9CD] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#EEE6DC] text-[#7A746C]">
                  {['Name', 'Company', 'Source', 'Score', 'Stage', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D9CD]">
                {filtered.map(l => {
                  const stage = STAGES.find(s => s.key === l.stage) || STAGES[0];
                  return (
                    <tr key={l.id} className="hover:bg-[#F4EFE8]/50 cursor-pointer transition-colors" onClick={() => setDetailLead(l)}>
                      <td className="px-4 py-3 font-medium text-[#1C1C1C]">{l.name}</td>
                      <td className="px-4 py-3 text-[#4B4B4B]">{l.company}</td>
                      <td className="px-4 py-3 text-[#4B4B4B]"><span className="flex items-center gap-1.5">{sourceIcon(l.source)} {l.source}</span></td>
                      <td className="px-4 py-3"><ScoreBadge score={l.score} /></td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: stage.bg, color: stage.color }}>{stage.label}</span>
                      </td>
                      <td className="px-4 py-3 text-[#7A746C]">{new Date(l.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={e => { e.stopPropagation(); setModalLead(l); }} className="p-1.5 rounded-lg hover:bg-[#EEE6DC]"><Edit2 size={14} className="text-[#7A746C]" /></button>
                          <button onClick={e => { e.stopPropagation(); deleteLead(l.id); }} className="p-1.5 rounded-lg hover:bg-[#EADADA]"><Trash2 size={14} className="text-[#A0403C]" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalLead && (
        <LeadModal lead={modalLead === 'new' ? null : modalLead} onSave={saveLead} onClose={() => setModalLead(null)} />
      )}

      {/* Detail Panel */}
      {detailLead && (
        <LeadDetailPanel
          lead={leads.find(l => l.id === detailLead.id) || detailLead}
          onClose={() => setDetailLead(null)}
          onEdit={() => { setModalLead(detailLead); setDetailLead(null); }}
          onDelete={() => deleteLead(detailLead.id)}
        />
      )}
    </div>
  );
}
