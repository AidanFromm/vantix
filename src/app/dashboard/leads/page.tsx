'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Phone, Mail, Clock, X, Zap, Target,
  Plus, Building2, DollarSign, Loader2, Trash2, Trophy,
  Download, LayoutGrid, List, UserCheck,
} from 'lucide-react';

interface Lead {
  id: string; name: string; email?: string; phone?: string; company?: string;
  status: string; estimated_value?: number; score: number; source?: string;
  notes?: string; tags: string[]; created_at: string; updated_at: string;
  role?: string; last_contacted_at?: string;
}
interface ScrapedLead {
  id: string; business_name?: string; email?: string; phone?: string;
  status: string; created_at: string;
}

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSet<T>(key: string, data: T[]) {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function generateId(): string { return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36); }

const KANBAN_STATUSES: { id: LeadStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'new', label: 'New', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'contacted', label: 'Contacted', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { id: 'qualified', label: 'Qualified', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'proposal', label: 'Proposal', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'negotiation', label: 'Negotiation', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'won', label: 'Won', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'lost', label: 'Lost', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
];

const ALL_STATUSES = [...KANBAN_STATUSES];

function formatCurrency(v: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v); }
function daysSince(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000); }
function formatDate(d: string) { const diff = daysSince(d); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff}d ago`; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-600 bg-emerald-50' : score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${color}`}>{score}</span>;
}

function LeadModal({ lead, onClose, onSave }: { lead?: Lead | null; onClose: () => void; onSave: (data: Partial<Lead>) => void }) {
  const [form, setForm] = useState({
    name: lead?.name || '', email: lead?.email || '', phone: lead?.phone || '', company: lead?.company || '',
    status: lead?.status || 'new', estimated_value: lead?.estimated_value || 0, score: lead?.score || 50,
    source: lead?.source || '', notes: lead?.notes || '', tags: lead?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#F0DFD1] border border-[#E0CCBA] rounded-xl px-4 py-3 text-sm text-[#4A2112] focus:outline-none focus:border-[#6B3A1F]/50';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    onSave({
      name: form.name, email: form.email || undefined, phone: form.phone || undefined, company: form.company || undefined,
      status: form.status, estimated_value: form.estimated_value, score: form.score, source: form.source || undefined,
      notes: form.notes || undefined, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#4A2112]/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-white border border-[#E0CCBA] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E0CCBA] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#4A2112]">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#E8D5C4] text-[#8B6B56]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Phone</label><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Company</label><input type="text" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Source</label><input type="text" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Estimated Value</label><input type="number" value={form.estimated_value} onChange={e => setForm(p => ({ ...p, estimated_value: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Score (0-100)</label><input type="number" min={0} max={100} value={form.score} onChange={e => setForm(p => ({ ...p, score: parseInt(e.target.value) || 0 }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-2">{ALL_STATUSES.map(s => <button key={s.id} type="button" onClick={() => setForm(p => ({ ...p, status: s.id }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s.id ? `${s.bg} ${s.color} ${s.border}` : 'bg-[#E8D5C4] text-[#8B6B56] border-[#E0CCBA]'}`}>{s.label}</button>)}</div>
          </div>
          <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Tags</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className={inputCls} placeholder="tag1, tag2" /></div>
          <div><label className="text-xs text-[#8B6B56] mb-1.5 block">Notes</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#E8D5C4] text-[#8B6B56] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-[#6B3A1F] text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function KanbanCard({ lead, onSelect, onDelete, deleting }: { lead: Lead; onSelect: (l: Lead) => void; onDelete: (id: string) => void; deleting: string | null }) {
  const daysInStage = daysSince(lead.updated_at || lead.created_at);
  return (
    <div draggable onDragStart={e => { e.dataTransfer.setData('leadId', lead.id); e.dataTransfer.effectAllowed = 'move'; }}>
      <div className="group cursor-pointer rounded-xl bg-white border border-[#E0CCBA] hover:border-[#6B3A1F]/40 p-3.5 transition-all shadow-sm" onClick={() => onSelect(lead)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#4A2112] text-sm truncate group-hover:text-[#6B3A1F]">{lead.company || lead.name}</h3>
            <p className="text-xs text-[#8B6B56] truncate mt-0.5">{lead.name}</p>
          </div>
          <ScoreBadge score={lead.score || 0} />
        </div>
        {lead.estimated_value ? <div className="flex items-center gap-1 text-[#6B3A1F] mb-2"><DollarSign size={14} /><span className="font-bold text-sm">{formatCurrency(lead.estimated_value)}</span></div> : null}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-[#8B6B56]"><Clock size={10} />{daysInStage}d in stage</div>
          <button onClick={e => { e.stopPropagation(); onDelete(lead.id); }} className="p-1 rounded text-[#8B6B56] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            {deleting === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ status, leads, onSelect, onDrop, onDelete, deleting, onConvertToClient }: {
  status: typeof KANBAN_STATUSES[0]; leads: Lead[]; onSelect: (l: Lead) => void;
  onDrop: (id: string, s: string) => void; onDelete: (id: string) => void; deleting: string | null;
  onConvertToClient: (lead: Lead) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const totalValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] flex-shrink-0 lg:min-w-0 lg:w-auto lg:flex-1 h-full">
      <div className={`px-3 py-3 rounded-t-xl border border-b-0 bg-white transition-all ${isDragOver ? 'border-[#6B3A1F]/50 bg-[#6B3A1F]/5' : 'border-[#E0CCBA]'}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2"><h3 className={`font-semibold text-sm ${status.color}`}>{status.label}</h3><span className="text-xs px-1.5 py-0.5 rounded-md bg-[#E8D5C4] text-[#8B6B56] font-medium">{leads.length}</span></div>
        </div>
        <div className="text-xs text-[#8B6B56]">Total: <span className="text-[#6B3A1F] font-semibold">{formatCurrency(totalValue)}</span></div>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); const id = e.dataTransfer.getData('leadId'); if (id) onDrop(id, status.id); }}
        className={`flex-1 p-2.5 rounded-b-xl border border-t-0 min-h-[300px] max-h-[calc(100vh-400px)] overflow-y-auto transition-all ${isDragOver ? 'bg-[#6B3A1F]/5 border-[#6B3A1F]/40' : 'border-[#E0CCBA]'}`}
      >
        <div className="flex flex-col gap-2.5">
          {leads.map(lead => (
            <div key={lead.id}>
              <KanbanCard lead={lead} onSelect={onSelect} onDelete={onDelete} deleting={deleting} />
              {status.id === 'won' && (
                <button onClick={() => onConvertToClient(lead)} className="mt-1 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-medium transition-colors">
                  <UserCheck size={12} /> Convert to Client
                </button>
              )}
            </div>
          ))}
          {leads.length === 0 && <div className="py-10 text-center"><Users size={18} className="mx-auto mb-2 text-[#8B6B56]/40" /><p className="text-xs text-[#8B6B56]">No leads here</p></div>}
        </div>
      </div>
    </div>
  );
}

function ListView({ leads, onSelect, onDelete, deleting }: { leads: Lead[]; onSelect: (l: Lead) => void; onDelete: (id: string) => void; deleting: string | null }) {
  const statusCfg = Object.fromEntries(ALL_STATUSES.map(s => [s.id, s]));
  return (
    <div className="rounded-2xl bg-white border border-[#E0CCBA] overflow-hidden shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#E0CCBA] text-[#8B6B56] text-xs uppercase tracking-wider">
            <th className="text-left px-5 py-3 font-medium">Name</th>
            <th className="text-left px-5 py-3 font-medium">Company</th>
            <th className="text-left px-5 py-3 font-medium">Status</th>
            <th className="text-right px-5 py-3 font-medium">Value</th>
            <th className="text-right px-5 py-3 font-medium">Score</th>
            <th className="text-left px-5 py-3 font-medium">Created</th>
            <th className="text-right px-5 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {leads.map(lead => {
              const sc = statusCfg[lead.status] || statusCfg.new;
              return (
                <tr key={lead.id} className="border-b border-[#E0CCBA]/50 hover:bg-[#E8D5C4]/50 transition-colors cursor-pointer" onClick={() => onSelect(lead)}>
                  <td className="px-5 py-3.5 font-medium text-[#4A2112]">{lead.name}</td>
                  <td className="px-5 py-3.5 text-[#8B6B56]">{lead.company || '-'}</td>
                  <td className="px-5 py-3.5"><span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${sc.color} ${sc.bg} border ${sc.border}`}>{sc.label}</span></td>
                  <td className="px-5 py-3.5 text-right text-[#6B3A1F] font-medium">{lead.estimated_value ? formatCurrency(lead.estimated_value) : '-'}</td>
                  <td className="px-5 py-3.5 text-right"><ScoreBadge score={lead.score} /></td>
                  <td className="px-5 py-3.5 text-[#8B6B56]">{formatDate(lead.created_at)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={e => { e.stopPropagation(); onDelete(lead.id); }} className="p-1.5 rounded-lg text-[#8B6B56] hover:text-red-500 hover:bg-red-50">
                      {deleting === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<ScrapedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'scraped'>('kanban');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(() => {
    try {
      setLeads(lsGet<Lead>('vantix_leads'));
      setScrapedLeads(lsGet<ScrapedLead>('vantix_scraped_leads'));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    if (!search) return leads;
    const q = search.toLowerCase();
    return leads.filter(l => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q));
  }, [leads, search]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<string, Lead[]> = {};
    KANBAN_STATUSES.forEach(s => { grouped[s.id] = []; });
    filtered.forEach(l => { if (grouped[l.status]) grouped[l.status].push(l); else if (grouped.new) grouped.new.push(l); });
    return grouped;
  }, [filtered]);

  const stats = useMemo(() => ({
    total: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    pipelineValue: leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((s, l) => s + (l.estimated_value || 0), 0),
    wonValue: leads.filter(l => l.status === 'won').reduce((s, l) => s + (l.estimated_value || 0), 0),
  }), [leads]);

  const handleSave = (data: Partial<Lead>) => {
    try {
      const items = lsGet<Lead>('vantix_leads');
      const now = new Date().toISOString();
      if (editingLead) {
        const idx = items.findIndex(l => l.id === editingLead.id);
        if (idx >= 0) items[idx] = { ...items[idx], ...data, updated_at: now };
      } else {
        items.unshift({ id: generateId(), score: 50, tags: [], created_at: now, updated_at: now, ...data } as Lead);
      }
      lsSet('vantix_leads', items);
      setLeads(items);
    } catch (e) { console.error(e); }
  };

  const handleDrop = (leadId: string, newStatus: string) => {
    try {
      const items = lsGet<Lead>('vantix_leads');
      const idx = items.findIndex(l => l.id === leadId);
      if (idx >= 0) { items[idx] = { ...items[idx], status: newStatus, updated_at: new Date().toISOString() }; lsSet('vantix_leads', items); setLeads(items); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this lead?')) return;
    setDeleting(id);
    try {
      const items = lsGet<Lead>('vantix_leads').filter(l => l.id !== id);
      lsSet('vantix_leads', items);
      setLeads(items);
    } catch (e) { console.error(e); }
    setDeleting(null);
  };

  const handleConvertToClient = (lead: Lead) => {
    try {
      const clients = lsGet<Record<string, unknown>>('vantix_clients');
      const now = new Date().toISOString();
      clients.unshift({
        id: generateId(), name: lead.company || lead.name, type: 'company', status: 'active',
        contact_name: lead.name, contact_email: lead.email, contact_phone: lead.phone,
        contract_value: lead.estimated_value || 0, lifetime_value: lead.estimated_value || 0,
        tags: ['converted-lead'], lead_source: lead.source, created_at: now, updated_at: now,
      });
      lsSet('vantix_clients', clients);
      // Add activity
      const activities = lsGet<Record<string, unknown>>('vantix_activities');
      activities.unshift({ id: generateId(), type: 'lead', title: `Lead "${lead.name}" converted to client`, created_at: now });
      lsSet('vantix_activities', activities);
      alert(`${lead.company || lead.name} has been converted to a client!`);
    } catch (e) { console.error(e); }
  };

  const handleConvertScraped = (scraped: ScrapedLead) => {
    handleSave({ name: scraped.business_name || 'Unknown', email: scraped.email || undefined, phone: scraped.phone || undefined, company: scraped.business_name || undefined, status: 'new', score: 30, source: 'Scraper', tags: ['scraped'] });
  };

  if (loading) return <div className="space-y-6 animate-pulse"><div className="h-8 w-48 bg-[#E0CCBA] rounded-lg" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#E0CCBA]/50 rounded-2xl" />)}</div></div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-[#4A2112]">Leads</h1><p className="text-sm text-[#8B6B56] mt-1">Manage your sales pipeline</p></div>
        <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#6B3A1F] hover:bg-[#A67A4B] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#6B3A1F]/20 text-sm"><Plus size={18} /> Add Lead</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: String(stats.total), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'New Leads', value: String(stats.newLeads), icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
          { label: 'Pipeline Value', value: formatCurrency(stats.pipelineValue), icon: Target, color: 'text-[#6B3A1F]', bg: 'bg-[#6B3A1F]/10', border: 'border-[#6B3A1F]/20' },
          { label: 'Won Value', value: formatCurrency(stats.wonValue), icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-white border ${stat.border} rounded-2xl p-4 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#8B6B56]">{stat.label}</span><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={18} className={stat.color} /></div></div>
            <p className="text-xl sm:text-2xl font-bold text-[#4A2112]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex bg-white border border-[#E0CCBA] rounded-xl p-1">
          <button onClick={() => setViewMode('kanban')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'kanban' ? 'bg-[#6B3A1F]/10 text-[#6B3A1F]' : 'text-[#8B6B56]'}`}><LayoutGrid size={15} /> Kanban</button>
          <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-[#6B3A1F]/10 text-[#6B3A1F]' : 'text-[#8B6B56]'}`}><List size={15} /> List</button>
          <button onClick={() => setViewMode('scraped')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'scraped' ? 'bg-[#6B3A1F]/10 text-[#6B3A1F]' : 'text-[#8B6B56]'}`}><Download size={15} /> Scraped ({scrapedLeads.length})</button>
        </div>
        {viewMode !== 'scraped' && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6B56]" />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-[#E0CCBA] rounded-xl pl-10 pr-4 py-2 text-sm text-[#4A2112] focus:outline-none focus:border-[#6B3A1F]/50" />
          </div>
        )}
      </div>

      {viewMode === 'kanban' ? (
        filtered.length === 0 && !search ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#6B3A1F]/10 flex items-center justify-center mb-6"><Target size={40} className="text-[#6B3A1F]" /></div>
            <h3 className="text-xl font-semibold text-[#4A2112] mb-2">No leads yet</h3>
            <p className="text-[#8B6B56] max-w-md mb-6">Start building your sales pipeline by adding leads.</p>
            <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B3A1F]/10 text-[#6B3A1F] border border-[#6B3A1F]/30 font-medium"><Plus size={18} /> Add Your First Lead</button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex gap-4 lg:grid lg:grid-cols-7 lg:gap-3 min-w-max lg:min-w-0">
              {KANBAN_STATUSES.map((status, i) => (
                <motion.div key={status.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <KanbanColumn status={status} leads={leadsByStatus[status.id] || []} onSelect={l => { setEditingLead(l); setShowModal(true); }} onDrop={handleDrop} onDelete={handleDelete} deleting={deleting} onConvertToClient={handleConvertToClient} />
                </motion.div>
              ))}
            </div>
          </div>
        )
      ) : viewMode === 'list' ? (
        filtered.length === 0 ? (
          <div className="text-center py-16"><p className="text-sm text-[#8B6B56]">No leads found</p></div>
        ) : (
          <ListView leads={filtered} onSelect={l => { setEditingLead(l); setShowModal(true); }} onDelete={handleDelete} deleting={deleting} />
        )
      ) : (
        scrapedLeads.length === 0 ? (
          <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#6B3A1F]/10 flex items-center justify-center"><Search size={28} className="text-[#6B3A1F]" /></div><h3 className="font-semibold text-[#4A2112] mb-2">No scraped leads yet</h3></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {scrapedLeads.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="p-4 rounded-xl bg-white border border-[#E0CCBA] hover:border-[#6B3A1F]/30 transition-all shadow-sm">
                <h4 className="text-sm font-semibold text-[#4A2112] truncate mb-2">{s.business_name || 'Unknown Business'}</h4>
                <div className="space-y-1 mb-3">
                  {s.email && <p className="text-xs text-[#8B6B56] flex items-center gap-1.5"><Mail size={11} />{s.email}</p>}
                  {s.phone && <p className="text-xs text-[#8B6B56] flex items-center gap-1.5"><Phone size={11} />{s.phone}</p>}
                </div>
                {s.status !== 'added_to_leads' && s.status !== 'ignored' && (
                  <button onClick={() => handleConvertScraped(s)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#6B3A1F]/10 text-[#6B3A1F] hover:bg-[#6B3A1F]/20 text-xs font-medium"><Plus size={12} /> Convert to Lead</button>
                )}
              </motion.div>
            ))}
          </div>
        )
      )}

      <AnimatePresence>{showModal && <LeadModal lead={editingLead} onClose={() => { setShowModal(false); setEditingLead(undefined); }} onSave={handleSave} />}</AnimatePresence>
    </div>
  );
}
