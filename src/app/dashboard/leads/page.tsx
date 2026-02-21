'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Plus, LayoutGrid, List, X, ChevronDown, Phone, Mail, Building2,
  Globe, Users, TrendingUp, TrendingDown, Clock, Search, Trash2,
  Target, Trophy, PhoneCall, Send, MessageSquare, Filter,
  GripVertical, ExternalLink, FileText, ChevronRight, Check,
  ArrowUpDown, Download, MoreHorizontal, Zap, Eye, Calendar,
  User, Hash, StickyNote, Activity, AlertCircle
} from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';

/* ─── Types ─── */
interface EmailEntry {
  date: string;
  subject: string;
  status?: string;
}

interface ActivityEntry {
  date: string;
  type: string;
  text: string;
}

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  score: number;
  stage: string;
  source: string;
  ai_audit: string;
  notes: string;
  last_contacted: string;
  email_history: EmailEntry[];
  activity: ActivityEntry[];
  created_at: string;
  updated_at: string;
}

type ViewMode = 'kanban' | 'list';
type SortField = 'company_name' | 'contact_name' | 'email' | 'score' | 'stage' | 'source' | 'last_contacted';
type SortDir = 'asc' | 'desc';

const STAGES = ['new', 'contacted', 'replied', 'call_booked', 'proposal_sent', 'won', 'lost'] as const;
const STAGE_LABELS: Record<string, string> = {
  'new': 'New', 'contacted': 'Contacted', 'replied': 'Replied',
  'call_booked': 'Call Booked', 'proposal_sent': 'Proposal Sent', 'won': 'Won', 'lost': 'Lost',
};
const SOURCES = ['cold_outreach', 'website', 'referral', 'social_media', 'other'] as const;

const STAGE_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  'new':             { dot: '#7A746C', bg: '#E3D9CD', text: '#7A746C' },
  'contacted':       { dot: '#B07A45', bg: '#E8DDD0', text: '#B07A45' },
  'replied':         { dot: '#8E5E34', bg: '#E4D5C4', text: '#8E5E34' },
  'call_booked':     { dot: '#6B4226', bg: '#DCC9B4', text: '#6B4226' },
  'proposal_sent':   { dot: '#4A6741', bg: '#D8E4D4', text: '#4A6741' },
  'won':             { dot: '#2D7A4F', bg: '#D4E8DC', text: '#2D7A4F' },
  'lost':            { dot: '#A0403C', bg: '#EADADA', text: '#A0403C' },
};

function scoreColor(score: number) {
  if (score <= 3) return { bg: '#EADADA', text: '#A0403C' };
  if (score <= 6) return { bg: '#E8DDD0', text: '#B07A45' };
  return { bg: '#D4E8DC', text: '#2D7A4F' };
}

function sourceIcon(s: string) {
  switch (s) {
    case 'Apollo': return <Zap size={12} />;
    case 'Brave': return <Search size={12} />;
    default: return <User size={12} />;
  }
}

function formatDate(d: string | undefined) {
  if (!d) return '--';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return '--'; }
}

function generateId() {
  return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ─── Stats Bar ─── */
function StatsBar({ leads }: { leads: Lead[] }) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);

  const thisWeek = leads.filter(l => new Date(l.created_at) >= weekAgo);
  const lastWeek = leads.filter(l => {
    const d = new Date(l.created_at);
    return d >= twoWeeksAgo && d < weekAgo;
  });

  const count = (arr: Lead[], stage?: string) => stage ? arr.filter(l => l.stage === stage).length : arr.length;
  const inSequence = (arr: Lead[]) => arr.filter(l => ['contacted', 'replied'].includes(l.stage)).length;
  const replied = (arr: Lead[]) => arr.filter(l => l.stage === 'replied').length;
  const booked = (arr: Lead[]) => arr.filter(l => l.stage === 'call_booked').length;
  const won = (arr: Lead[]) => arr.filter(l => l.stage === 'won').length;

  const totalWon = leads.filter(l => l.stage === 'won').length;
  const convRate = leads.length > 0 ? Math.round((totalWon / leads.length) * 100) : 0;

  const change = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const stats = [
    { label: 'Total Leads', value: leads.length, delta: change(thisWeek.length, lastWeek.length), icon: Target },
    { label: 'In Sequence', value: inSequence(leads), delta: change(inSequence(thisWeek), inSequence(lastWeek)), icon: Send },
    { label: 'Replied', value: replied(leads), delta: change(replied(thisWeek), replied(lastWeek)), icon: MessageSquare },
    { label: 'Calls Booked', value: booked(leads), delta: change(booked(thisWeek), booked(lastWeek)), icon: PhoneCall },
    { label: 'Won', value: totalWon, delta: change(won(thisWeek), won(lastWeek)), icon: Trophy },
    { label: 'Conversion Rate', value: `${convRate}%`, delta: 0, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD]">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#F4EFE8] flex items-center justify-center">
                <Icon size={16} className="text-[#B07A45]" />
              </div>
              {typeof s.delta === 'number' && s.delta !== 0 && (
                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.delta > 0 ? 'text-[#2D7A4F]' : 'text-[#A0403C]'}`}>
                  {s.delta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(s.delta)}%
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-[#1C1C1C]">{s.value}</div>
            <div className="text-[11px] text-[#7A746C] mt-0.5">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Score Badge ─── */
function ScoreBadge({ score }: { score: number }) {
  const c = scoreColor(score);
  return (
    <span style={{ background: c.bg, color: c.text }} className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums">
      {score}
    </span>
  );
}

/* ─── Source Badge ─── */
function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#7A746C] bg-[#F4EFE8] px-2 py-0.5 rounded-full border border-[#E3D9CD]">
      {sourceIcon(source)} {source}
    </span>
  );
}

/* ─── Stage Badge ─── */
function StageBadge({ stage }: { stage: string }) {
  const c = STAGE_COLORS[stage] || STAGE_COLORS['new'];
  return (
    <span style={{ background: c.bg, color: c.text }} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
      {STAGE_LABELS[stage] || stage}
    </span>
  );
}

/* ─── Kanban Card ─── */
function KanbanCard({ lead, onClick, onDragStart }: { lead: Lead; onClick: () => void; onDragStart: (e: React.DragEvent) => void }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-[#EEE6DC] rounded-xl p-3.5 border border-[#E3D9CD] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="font-semibold text-sm text-[#1C1C1C] truncate flex-1">{lead.company_name || 'Unnamed'}</div>
        <ScoreBadge score={lead.score} />
      </div>
      <div className="text-xs text-[#4B4B4B] flex items-center gap-1.5 mb-2">
        <User size={12} className="text-[#7A746C] shrink-0" />
        <span className="truncate">{lead.contact_name || '--'}</span>
      </div>
      <div className="flex items-center justify-between">
        <SourceBadge source={lead.source || 'Manual'} />
        <span className="text-[10px] text-[#7A746C] flex items-center gap-1">
          <Clock size={10} /> {formatDate(lead.last_contacted || lead.updated_at)}
        </span>
      </div>
    </div>
  );
}

/* ─── Kanban View ─── */
function KanbanView({ leads, onOpenDetail, onMoveLead }: {
  leads: Lead[];
  onOpenDetail: (lead: Lead) => void;
  onMoveLead: (id: string, stage: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(stage);
  };

  const handleDragLeave = () => setDragOver(null);

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    if (id) onMoveLead(id, stage);
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
      {STAGES.map((stage) => {
        const colLeads = leads.filter(l => l.stage === stage);
        const isDragTarget = dragOver === stage;
        return (
          <div
            key={stage}
            className="min-w-[280px] flex-shrink-0 lg:flex-1"
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: STAGE_COLORS[stage]?.dot || '#7A746C' }} />
                <span className="text-sm font-semibold text-[#1C1C1C]">{STAGE_LABELS[stage] || stage}</span>
              </div>
              <span className="text-xs text-[#7A746C] bg-[#EEE6DC] px-2 py-0.5 rounded-full">{colLeads.length}</span>
            </div>
            <div className={`space-y-2.5 rounded-xl p-2.5 min-h-[120px] border transition-colors ${
              isDragTarget ? 'bg-[#B07A45]/10 border-[#B07A45]/30' : 'bg-[#EEE6DC]/50 border-[#E3D9CD]/50'
            }`}>
              {colLeads.map(l => (
                <KanbanCard
                  key={l.id}
                  lead={l}
                  onClick={() => onOpenDetail(l)}
                  onDragStart={(e) => handleDragStart(e, l.id)}
                />
              ))}
              {colLeads.length === 0 && (
                <div className="text-center py-8 text-xs text-[#7A746C]">No leads</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── List View ─── */
function ListView({ leads, onOpenDetail, onDeleteLeads, onMoveLeads }: {
  leads: Lead[];
  onOpenDetail: (lead: Lead) => void;
  onDeleteLeads: (ids: string[]) => void;
  onMoveLeads: (ids: string[], stage: string) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('created_at' as SortField);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortField];
      const bv = (b as unknown as Record<string, unknown>)[sortField];
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av || '').localeCompare(String(bv || ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [leads, sortField, sortDir]);

  const allSelected = leads.length > 0 && selected.size === leads.length;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(leads.map(l => l.id)));
  };
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const exportCSV = () => {
    const ids = Array.from(selected);
    const rows = leads.filter(l => ids.includes(l.id));
    const headers = ['Company', 'Contact', 'Email', 'Score', 'Stage', 'Source', 'Last Contact'];
    const csv = [headers.join(','), ...rows.map(r =>
      [r.company_name, r.contact_name, r.email, r.score, r.stage, r.source, r.last_contacted || ''].map(v => `"${v}"`).join(',')
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads-export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-[#B07A45] select-none"
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown size={10} className={sortField === field ? 'text-[#B07A45]' : 'opacity-30'} />
      </span>
    </th>
  );

  return (
    <div>
      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-[#EEE6DC] rounded-xl border border-[#E3D9CD]">
          <span className="text-sm font-medium text-[#1C1C1C]">{selected.size} selected</span>
          <div className="relative">
            <button
              onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] hover:bg-[#F4EFE8] flex items-center gap-1"
            >
              Move to stage <ChevronDown size={12} />
            </button>
            {bulkMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBulkMenuOpen(false)} />
                <div className="absolute left-0 top-9 z-50 bg-[#F4EFE8] rounded-xl shadow-lg border border-[#E3D9CD] py-1 min-w-[160px]">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => { onMoveLeads(Array.from(selected), s); setSelected(new Set()); setBulkMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#F4EFE8] text-[#4B4B4B] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: STAGE_COLORS[s]?.dot }} /> {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => { onDeleteLeads(Array.from(selected)); setSelected(new Set()); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#EADADA] text-[#A0403C] hover:bg-[#DFC8C8] flex items-center gap-1"
          >
            <Trash2 size={12} /> Delete
          </button>
          <button
            onClick={exportCSV}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] hover:bg-[#F4EFE8] flex items-center gap-1"
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      )}

      <div className="bg-[#EEE6DC] rounded-2xl border border-[#E3D9CD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EEE6DC] text-[#7A746C]">
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll} className={`w-4 h-4 rounded border flex items-center justify-center ${allSelected ? 'bg-[#B07A45] border-[#B07A45]' : 'border-[#E3D9CD] bg-[#F4EFE8]'}`}>
                    {allSelected && <Check size={10} className="text-white" />}
                  </button>
                </th>
                <SortHeader field="company_name">Company</SortHeader>
                <SortHeader field="contact_name">Contact</SortHeader>
                <SortHeader field="email">Email</SortHeader>
                <SortHeader field="score">Score</SortHeader>
                <SortHeader field="stage">Stage</SortHeader>
                <SortHeader field="source">Source</SortHeader>
                <SortHeader field="last_contacted">Last Contact</SortHeader>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3D9CD]">
              {sorted.map(l => (
                <tr key={l.id} className="hover:bg-[#F4EFE8]/50 cursor-pointer transition-colors" onClick={() => onOpenDetail(l)}>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggle(l.id)} className={`w-4 h-4 rounded border flex items-center justify-center ${selected.has(l.id) ? 'bg-[#B07A45] border-[#B07A45]' : 'border-[#E3D9CD] bg-[#F4EFE8]'}`}>
                      {selected.has(l.id) && <Check size={10} className="text-white" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1C1C1C]">{l.company_name || '--'}</td>
                  <td className="px-4 py-3 text-[#4B4B4B]">{l.contact_name || '--'}</td>
                  <td className="px-4 py-3 text-[#4B4B4B]">{l.email || '--'}</td>
                  <td className="px-4 py-3"><ScoreBadge score={l.score} /></td>
                  <td className="px-4 py-3"><StageBadge stage={l.stage} /></td>
                  <td className="px-4 py-3"><SourceBadge source={l.source || 'Manual'} /></td>
                  <td className="px-4 py-3 text-[#7A746C]">{formatDate(l.last_contacted)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onOpenDetail(l)} className="p-1.5 rounded-lg hover:bg-[#EEE6DC]">
                      <Eye size={14} className="text-[#7A746C]" />
                    </button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-[#7A746C]">No leads found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Panel ─── */
function DetailPanel({ lead, onClose, onUpdate, onDelete }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [stage, setStage] = useState(lead.stage);
  const [notesDirty, setNotesDirty] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setNotes(lead.notes || ''); setStage(lead.stage); setNotesDirty(false); }, [lead]);

  const saveNotes = () => {
    const newActivity: ActivityEntry = { date: new Date().toISOString(), type: 'note', text: 'Note updated' };
    onUpdate(lead.id, { notes, activity: [...(lead.activity || []), newActivity] });
    setNotesDirty(false);
  };

  const changeStage = (s: string) => {
    setStage(s);
    const newActivity: ActivityEntry = { date: new Date().toISOString(), type: 'stage', text: `Stage changed to ${s}` };
    onUpdate(lead.id, { stage: s, activity: [...(lead.activity || []), newActivity] });
  };

  const sc = scoreColor(lead.score);
  const emailHistory = lead.email_history || [];
  const activities = lead.activity || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg bg-[#F4EFE8] h-full overflow-y-auto shadow-2xl animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[#1C1C1C] truncate">{lead.company_name || 'Unnamed Lead'}</h2>
              {lead.website && (
                <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#B07A45] flex items-center gap-1 mt-1 hover:underline">
                  <ExternalLink size={12} /> {lead.website}
                </a>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#EEE6DC] ml-2">
              <X size={20} className="text-[#7A746C]" />
            </button>
          </div>

          {/* Contact Card */}
          <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD] mb-4">
            <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-3">Contact</div>
            <div className="space-y-2 text-sm text-[#4B4B4B]">
              <div className="flex items-center gap-2"><User size={14} className="text-[#B07A45]" /> {lead.contact_name || '--'}</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-[#B07A45]" /> {lead.email || '--'}</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-[#B07A45]" /> {lead.phone || '--'}</div>
            </div>
          </div>

          {/* Score + Stage */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD]">
              <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-2">Lead Score</div>
              <div className="flex items-center gap-2">
                <span style={{ background: sc.bg, color: sc.text }} className="text-2xl font-bold px-3 py-1 rounded-lg">{lead.score}</span>
                <span className="text-[10px] text-[#7A746C]">/10</span>
              </div>
            </div>
            <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD]">
              <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-2">Stage</div>
              <select
                value={stage}
                onChange={e => changeStage(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* AI Audit */}
          {lead.ai_audit && (
            <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD] mb-4">
              <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap size={12} /> AI Audit Summary
              </div>
              <p className="text-sm text-[#4B4B4B]">{lead.ai_audit}</p>
            </div>
          )}

          {/* Notes */}
          <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD] mb-4">
            <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-2">Notes</div>
            <textarea
              value={notes}
              onChange={e => { setNotes(e.target.value); setNotesDirty(true); }}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none"
              placeholder="Add notes..."
            />
            {notesDirty && (
              <button onClick={saveNotes}
                className="mt-2 px-4 py-1.5 rounded-lg bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-xs font-semibold hover:shadow-md transition-all">
                Save Notes
              </button>
            )}
          </div>

          {/* Email History */}
          <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD] mb-4">
            <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Mail size={12} /> Email History
            </div>
            {emailHistory.length > 0 ? (
              <div className="space-y-2">
                {emailHistory.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B07A45] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#7A746C]">{formatDate(e.date)}</div>
                      <div className="text-[#4B4B4B] truncate">{e.subject}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A746C]">No emails sent yet</p>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#EEE6DC] rounded-xl p-4 border border-[#E3D9CD] mb-4">
            <div className="text-[10px] font-semibold text-[#7A746C] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Activity size={12} /> Activity Timeline
            </div>
            {activities.length > 0 ? (
              <div className="space-y-3">
                {[...activities].reverse().slice(0, 10).map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B07A45] mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs text-[#7A746C]">{formatDate(a.date)}</div>
                      <div className="text-sm text-[#4B4B4B]">{a.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A746C]">No activity yet</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {lead.email && (
              <a href={`mailto:${lead.email}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EEE6DC] text-[#4B4B4B] text-xs font-medium hover:bg-[#E3D9CD] transition-colors">
                <Mail size={12} /> Send Email
              </a>
            )}
            <button onClick={() => { onDelete(lead.id); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EADADA] text-[#A0403C] text-xs font-medium hover:bg-[#DFC8C8] transition-colors">
              <Trash2 size={12} /> Delete Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Lead Modal ─── */
function AddLeadModal({ onSave, onClose }: { onSave: (data: Partial<Lead>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '', website: '', notes: '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.company_name.trim() && !form.contact_name.trim()) return;
    onSave({
      ...form,
      score: 5,
      stage: 'new',
      source: 'Manual',
      ai_audit: '',
      email_history: [],
      activity: [{ date: new Date().toISOString(), type: 'created', text: 'Lead created manually' }],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-[#F4EFE8] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1C1C1C]">Add Lead</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#EEE6DC]"><X size={20} className="text-[#7A746C]" /></button>
          </div>
          <div className="space-y-3.5">
            {([
              ['company_name', 'Company Name', Building2],
              ['contact_name', 'Contact Name', User],
              ['email', 'Email', Mail],
              ['phone', 'Phone', Phone],
              ['website', 'Website', Globe],
            ] as const).map(([field, label, Icon]) => (
              <div key={field}>
                <label className="text-xs font-medium text-[#7A746C] flex items-center gap-1"><Icon size={12} /> {label}</label>
                <input
                  value={(form as Record<string, string>)[field]}
                  onChange={e => set(field, e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45] transition-colors"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-[#7A746C] flex items-center gap-1"><StickyNote size={12} /> Notes</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#E3D9CD] text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.company_name.trim() && !form.contact_name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-40">
              Add Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Bar ─── */
function FilterBar({ filters, onChange }: {
  filters: { stage: string; source: string; scoreMin: number; scoreMax: number; dateFrom: string; search: string };
  onChange: (f: typeof filters) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (k: string, v: string | number) => onChange({ ...filters, [k]: v });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
        <input
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          placeholder="Search company or contact..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#EEE6DC] border border-[#E3D9CD] text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
        />
      </div>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
        open || filters.stage || filters.source || filters.dateFrom
          ? 'bg-[#B07A45]/10 border-[#B07A45]/30 text-[#B07A45]'
          : 'bg-[#EEE6DC] border-[#E3D9CD] text-[#7A746C] hover:text-[#4B4B4B]'
      }`}>
        <Filter size={14} /> Filters
        {(filters.stage || filters.source || filters.dateFrom) && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#B07A45]" />
        )}
      </button>

      {open && (
        <div className="w-full sm:w-auto flex flex-wrap gap-2">
          <select value={filters.stage} onChange={e => set('stage', e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-xs text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30">
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.source} onChange={e => set('source', e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-xs text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30">
            <option value="">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#7A746C]">Score</span>
            <input type="number" min={1} max={10} value={filters.scoreMin} onChange={e => set('scoreMin', +e.target.value)}
              className="w-12 px-2 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-xs text-[#1C1C1C] focus:outline-none" />
            <span className="text-[10px] text-[#7A746C]">-</span>
            <input type="number" min={1} max={10} value={filters.scoreMax} onChange={e => set('scoreMax', +e.target.value)}
              className="w-12 px-2 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-xs text-[#1C1C1C] focus:outline-none" />
          </div>
          <input type="date" value={filters.dateFrom} onChange={e => set('dateFrom', e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-xs text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          {(filters.stage || filters.source || filters.dateFrom || filters.scoreMin !== 1 || filters.scoreMax !== 10) && (
            <button onClick={() => onChange({ stage: '', source: '', scoreMin: 1, scoreMax: 10, dateFrom: '', search: filters.search })}
              className="text-xs text-[#A0403C] hover:underline">Clear</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<ViewMode>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState({ stage: '', source: '', scoreMin: 1, scoreMax: 10, dateFrom: '', search: '' });

  useEffect(() => {
    (async () => {
      try {
        const data = await getData<Lead>('leads');
        // Normalize: map old field names if needed
        const normalized = data.map(l => ({
          ...l,
          company_name: l.company_name || (l as unknown as Record<string, unknown>).company as string || (l as unknown as Record<string, unknown>).name as string || '',
          contact_name: l.contact_name || '',
          stage: l.stage || (l as unknown as Record<string, unknown>).status as string || 'New',
          score: typeof l.score === 'number' ? (l.score > 10 ? Math.round(l.score / 10) : l.score) : 5,
          source: l.source || 'Manual',
          email_history: l.email_history || [],
          activity: l.activity || [],
        }));
        setLeads(normalized);
      } catch { setLeads([]); }
      setMounted(true);
    })();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filters.stage && l.stage !== filters.stage) return false;
      if (filters.source && l.source !== filters.source) return false;
      if (l.score < filters.scoreMin || l.score > filters.scoreMax) return false;
      if (filters.dateFrom && l.created_at < filters.dateFrom) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!(l.company_name || '').toLowerCase().includes(s) && !(l.contact_name || '').toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [leads, filters]);

  const moveLead = useCallback(async (id: string, stage: string) => {
    const now = new Date().toISOString();
    const lead = leads.find(l => l.id === id);
    if (!lead || lead.stage === stage) return;
    const newActivity: ActivityEntry = { date: now, type: 'stage', text: `Stage changed to ${stage}` };
    const updates: Partial<Lead> = { stage, activity: [...(lead.activity || []), newActivity], updated_at: now };
    try { await updateRecord('leads', id, updates as Record<string, unknown>); } catch {}
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } as Lead : l));
  }, [leads]);

  const moveLeadsBulk = useCallback(async (ids: string[], stage: string) => {
    const now = new Date().toISOString();
    for (const id of ids) {
      const lead = leads.find(l => l.id === id);
      if (!lead || lead.stage === stage) continue;
      const newActivity: ActivityEntry = { date: now, type: 'stage', text: `Stage changed to ${stage}` };
      const updates: Partial<Lead> = { stage, activity: [...(lead.activity || []), newActivity], updated_at: now };
      try { await updateRecord('leads', id, updates as Record<string, unknown>); } catch {}
    }
    setLeads(prev => prev.map(l => ids.includes(l.id) ? { ...l, stage, updated_at: now } : l));
  }, [leads]);

  const addLead = useCallback(async (data: Partial<Lead>) => {
    const now = new Date().toISOString();
    const rec = { ...data, last_contacted: '', created_at: now, updated_at: now };
    try {
      const created = await createRecord<Lead>('leads', rec as Record<string, unknown>);
      setLeads(prev => [created, ...prev]);
    } catch {
      const newLead = { id: generateId(), ...rec } as Lead;
      setLeads(prev => [newLead, ...prev]);
    }
    setShowAddModal(false);
  }, []);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    try { await updateRecord('leads', id, updates as Record<string, unknown>); } catch {}
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } as Lead : l));
    if (detailLead?.id === id) setDetailLead(prev => prev ? { ...prev, ...updates } as Lead : null);
  }, [detailLead]);

  const deleteLeads = useCallback(async (ids: string[]) => {
    for (const id of ids) { try { await deleteRecord('leads', id); } catch {} }
    setLeads(prev => prev.filter(l => !ids.includes(l.id)));
    if (detailLead && ids.includes(detailLead.id)) setDetailLead(null);
  }, [detailLead]);

  if (!mounted) return <div className="min-h-screen bg-[#F4EFE8]" />;

  return (
    <div className="min-h-screen bg-[#F4EFE8]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Lead Pipeline</h1>
          <p className="text-sm text-[#7A746C] mt-0.5">{leads.length} total leads</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold hover:shadow-lg transition-all">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Stats */}
      <StatsBar leads={leads} />

      {/* View Toggle + Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-[#EEE6DC] rounded-xl p-1">
          {([['kanban', LayoutGrid, 'Kanban'], ['list', List, 'List']] as [ViewMode, typeof LayoutGrid, string][]).map(([v, Icon, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === v ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C] hover:text-[#4B4B4B]'
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {/* Views */}
      {view === 'kanban' ? (
        <KanbanView leads={filtered} onOpenDetail={setDetailLead} onMoveLead={moveLead} />
      ) : (
        <ListView leads={filtered} onOpenDetail={setDetailLead} onDeleteLeads={deleteLeads} onMoveLeads={moveLeadsBulk} />
      )}

      {/* Add Modal */}
      {showAddModal && <AddLeadModal onSave={addLead} onClose={() => setShowAddModal(false)} />}

      {/* Detail Panel */}
      {detailLead && (
        <DetailPanel
          lead={leads.find(l => l.id === detailLead.id) || detailLead}
          onClose={() => setDetailLead(null)}
          onUpdate={updateLead}
          onDelete={(id) => deleteLeads([id])}
        />
      )}
    </div>
  );
}
