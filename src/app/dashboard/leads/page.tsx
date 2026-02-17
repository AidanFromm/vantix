'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Phone, Mail, Globe, Clock, Filter, X, Zap, Target,
  Plus, Building2, DollarSign, Tag, Loader2, Trash2, CheckCircle2,
  XCircle, Trophy, Sparkles, ArrowRight, BarChart3, Star, Download,
} from 'lucide-react';
import { getLeads, createLead, updateLead, getScrapedLeads } from '@/lib/supabase';
import type { Lead, LeadStatus, ScrapedLead } from '@/lib/types';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUSES: { id: LeadStatus; label: string; color: string; bgColor: string; borderColor: string }[] = [
  { id: 'new', label: 'New', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { id: 'contacted', label: 'Contacted', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { id: 'qualified', label: 'Qualified', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
  { id: 'proposal', label: 'Proposal', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  { id: 'won', label: 'Won', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  { id: 'lost', label: 'Lost', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.id, s]));

function formatCurrency(v: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v); }
function formatDate(d: string) { const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff}d ago`; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-400 bg-emerald-500/10' : score >= 50 ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10';
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${color}`}>{score}</span>;
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between"><div className="h-8 w-48 bg-white/5 rounded-lg" /><div className="h-10 w-32 bg-white/5 rounded-xl" /></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}</div>
      <div className="flex gap-4 overflow-hidden">{[...Array(6)].map((_, i) => <div key={i} className="min-w-[260px] h-[500px] bg-white/5 rounded-2xl" />)}</div>
    </div>
  );
}

// ─── Add/Edit Lead Modal ──────────────────────────────────────────────────────

function LeadModal({ lead, onClose, onSave }: { lead?: Lead | null; onClose: () => void; onSave: (data: Partial<Lead>) => Promise<void> }) {
  const [form, setForm] = useState({
    name: lead?.name || '', email: lead?.email || '', phone: lead?.phone || '', company: lead?.company || '',
    status: lead?.status || 'new' as LeadStatus, estimated_value: lead?.estimated_value || 0, score: lead?.score || 50,
    source: lead?.source || '', notes: lead?.notes || '', tags: lead?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name, email: form.email || undefined, phone: form.phone || undefined, company: form.company || undefined,
        status: form.status, estimated_value: form.estimated_value, score: form.score, source: form.source || undefined,
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
          <h2 className="text-lg font-semibold text-white">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-gray-500 mb-1.5 block">Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Phone</label><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Company</label><input type="text" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Source</label><input type="text" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} placeholder="Referral, Website..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Estimated Value</label><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" /><input type="number" value={form.estimated_value} onChange={e => setForm(p => ({ ...p, estimated_value: parseFloat(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Score (0-100)</label><input type="number" min={0} max={100} value={form.score} onChange={e => setForm(p => ({ ...p, score: parseInt(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-2">{STATUSES.map(s => <button key={s.id} type="button" onClick={() => setForm(p => ({ ...p, status: s.id }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s.id ? `${s.bgColor} ${s.color} ${s.borderColor}` : 'bg-white/5 text-gray-500 border-white/10'}`}>{s.label}</button>)}</div>
          </div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Tags</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="hot, priority, shopify" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" /></div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Notes</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({ status, leads, onSelect, onDrop }: { status: typeof STATUSES[0]; leads: Lead[]; onSelect: (l: Lead) => void; onDrop: (id: string, s: LeadStatus) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const totalValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] flex-shrink-0 lg:min-w-0 lg:w-auto lg:flex-1 h-full">
      <div className={`px-3 py-3 rounded-t-xl border border-b-0 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm transition-all ${isDragOver ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/[0.1]'}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${status.bgColor.replace('/10', '')}`} /><h3 className={`font-semibold text-sm ${status.color}`}>{status.label}</h3><span className="text-xs px-1.5 py-0.5 rounded-md bg-white/10 text-gray-500 font-medium">{leads.length}</span></div>
        </div>
        <div className="text-xs text-gray-500 pl-4">Total: <span className="text-emerald-400 font-semibold">{formatCurrency(totalValue)}</span></div>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); const id = e.dataTransfer.getData('leadId'); if (id) onDrop(id, status.id); }}
        className={`flex-1 p-2.5 rounded-b-xl border border-t-0 min-h-[300px] max-h-[calc(100vh-400px)] overflow-y-auto transition-all ${isDragOver ? 'bg-emerald-500/5 border-emerald-500/40' : 'border-white/[0.1]'}`}
      >
        <div className="flex flex-col gap-2.5">
          {leads.map(lead => (
            <div key={lead.id} draggable onDragStart={e => { e.dataTransfer.setData('leadId', lead.id); e.dataTransfer.effectAllowed = 'move'; }}>
              <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onSelect(lead)}
                className="group cursor-pointer rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.1] hover:border-emerald-500/40 p-3.5 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0"><h3 className="font-semibold text-white text-sm truncate group-hover:text-emerald-300">{lead.name}</h3>{lead.company && <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5"><Building2 size={11} />{lead.company}</p>}</div>
                  <ScoreBadge score={lead.score} />
                </div>
                {lead.estimated_value ? <div className="flex items-center gap-1 text-emerald-400 mb-2"><DollarSign size={14} /><span className="font-bold text-sm">{formatCurrency(lead.estimated_value)}</span></div> : null}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500"><Clock size={10} />{formatDate(lead.created_at)}</div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {lead.email && <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-md bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center"><Mail size={11} className="text-gray-500" /></a>}
                    {lead.phone && <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-md bg-white/5 hover:bg-blue-500/20 flex items-center justify-center"><Phone size={11} className="text-gray-500" /></a>}
                  </div>
                </div>
                {lead.tags && lead.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{lead.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{t}</span>)}</div>}
              </motion.div>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="py-10 text-center">
              <div className={`w-11 h-11 mx-auto mb-3 rounded-xl ${status.bgColor} flex items-center justify-center`}>
                {status.id === 'won' ? <Trophy size={18} className={status.color} /> : status.id === 'lost' ? <XCircle size={18} className={status.color} /> : <Users size={18} className={status.color} />}
              </div>
              <p className="text-xs text-gray-500 font-medium">No leads here</p>
              <p className="text-[10px] text-gray-500 opacity-60 mt-1">Drag cards to move</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Scraped Leads Tab ────────────────────────────────────────────────────────

const SCRAPED_STATUSES = [
  { id: 'all', label: 'All', color: 'text-gray-400', bg: 'bg-white/10' },
  { id: 'new', label: 'New', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'verified', label: 'Verified', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'sent', label: 'Sent', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'replied', label: 'Replied', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'dead', label: 'Dead', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'added_to_leads', label: 'Converted', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'ignored', label: 'Ignored', color: 'text-gray-500', bg: 'bg-gray-500/10' },
];

function ScrapedLeadsView({ scrapedLeads, onConvert }: { scrapedLeads: ScrapedLead[]; onConvert: (s: ScrapedLead) => void }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: scrapedLeads.length };
    scrapedLeads.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
    return counts;
  }, [scrapedLeads]);

  const filtered = useMemo(() => statusFilter === 'all' ? scrapedLeads : scrapedLeads.filter(s => s.status === statusFilter), [scrapedLeads, statusFilter]);

  if (scrapedLeads.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center"><Search size={28} className="text-emerald-400" /></div>
        <h3 className="font-semibold text-white mb-2">No scraped leads yet</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">Scraped leads from your email scraper will appear here. You can convert them to pipeline leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status counts */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SCRAPED_STATUSES.filter(s => s.id === 'all' || (statusCounts[s.id] || 0) > 0).map(s => (
          <button key={s.id} onClick={() => setStatusFilter(s.id)} className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${statusFilter === s.id ? `${s.bg} border-current ${s.color}` : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'}`}>
            <span className="text-lg font-bold">{statusCounts[s.id] || 0}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="p-4 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0"><h4 className="text-sm font-semibold text-white truncate">{s.business_name || 'Unknown Business'}</h4>{s.address && <p className="text-xs text-gray-500 truncate mt-0.5">{s.address}</p>}</div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.status === 'added_to_leads' ? 'bg-emerald-500/10 text-emerald-400' : s.status === 'ignored' ? 'bg-red-500/10 text-red-400' : s.status === 'replied' ? 'bg-purple-500/10 text-purple-400' : s.status === 'sent' ? 'bg-yellow-500/10 text-yellow-400' : s.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : s.status === 'dead' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>{s.status === 'added_to_leads' ? 'Converted' : s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
            </div>
            <div className="space-y-1 mb-3">
              {s.email && <p className="text-xs text-gray-400 flex items-center gap-1.5"><Mail size={11} />{s.email}</p>}
              {s.phone && <p className="text-xs text-gray-400 flex items-center gap-1.5"><Phone size={11} />{s.phone}</p>}
              {s.website && <p className="text-xs text-gray-400 flex items-center gap-1.5"><Globe size={11} />{s.website}</p>}
            </div>
            {s.status !== 'added_to_leads' && s.status !== 'ignored' && (
              <button onClick={() => onConvert(s)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-medium"><Plus size={12} /> Convert to Lead</button>
            )}
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-500 py-8 text-sm">No leads with status &ldquo;{statusFilter}&rdquo;</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<ScrapedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'pipeline' | 'scraped'>('pipeline');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [leadsRes, scrapedRes] = await Promise.all([
        getLeads({ search: search || undefined, status: filterStatus !== 'all' ? filterStatus : undefined }),
        getScrapedLeads(),
      ]);
      if (leadsRes.data) setLeads(leadsRes.data);
      if (scrapedRes.data) setScrapedLeads(scrapedRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, filterStatus]);

  useEffect(() => { loadData(); }, [loadData]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = { new: [], contacted: [], qualified: [], proposal: [], won: [], lost: [], unqualified: [], nurture: [] };
    leads.forEach(l => { if (grouped[l.status]) grouped[l.status].push(l); });
    return grouped;
  }, [leads]);

  const stats = useMemo(() => ({
    total: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    pipelineValue: leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((s, l) => s + (l.estimated_value || 0), 0),
    wonValue: leads.filter(l => l.status === 'won').reduce((s, l) => s + (l.estimated_value || 0), 0),
  }), [leads]);

  const handleSaveLead = async (data: Partial<Lead>) => {
    if (editingLead) {
      const { error } = await updateLead(editingLead.id, data);
      if (error) throw error;
    } else {
      const { error } = await createLead(data);
      if (error) throw error;
    }
    await loadData();
  };

  const handleDropLead = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const { error } = await updateLead(leadId, { status: newStatus });
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (err) { console.error(err); }
  };

  const handleConvertScraped = async (scraped: ScrapedLead) => {
    try {
      await createLead({ name: scraped.business_name || 'Unknown', email: scraped.email || undefined, phone: scraped.phone || undefined, company: scraped.business_name || undefined, status: 'new', score: 30, source: 'Scraper', tags: ['scraped'] });
      await loadData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Leads</h1><p className="text-sm text-gray-500 mt-1">Manage your sales pipeline</p></div>
        <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm"><Plus size={18} /> Add Lead</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: String(stats.total), icon: Users, accent: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'New Leads', value: String(stats.newLeads), icon: Zap, accent: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Pipeline Value', value: formatCurrency(stats.pipelineValue), icon: Target, accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Won Value', value: formatCurrency(stats.wonValue), icon: Trophy, accent: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-gradient-to-br from-white/[0.08] to-white/[0.02] border ${stat.border} rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{stat.label}</span><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={18} className={stat.accent} /></div></div>
            <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* View Toggle + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-xl p-1">
          <button onClick={() => setActiveView('pipeline')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'pipeline' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-white'}`}><Target size={15} /> Pipeline</button>
          <button onClick={() => setActiveView('scraped')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'scraped' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-white'}`}><Download size={15} /> Cold Outreach ({scrapedLeads.length})</button>
        </div>
        {activeView === 'pipeline' && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50" />
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeView === 'pipeline' ? (
        leads.length === 0 && !search && filterStatus === 'all' ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6"><Target size={40} className="text-emerald-400" /></div>
            <h3 className="text-xl font-semibold text-white mb-2">No leads yet</h3>
            <p className="text-gray-500 max-w-md mb-6">Start building your sales pipeline by adding leads manually or converting scraped leads.</p>
            <div className="flex gap-3">
              <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"><Plus size={18} /> Add Your First Lead</button>
              <button onClick={() => setActiveView('scraped')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 text-gray-500 border border-white/10 hover:text-white hover:bg-white/10 transition-colors font-medium"><Download size={18} /> View Scraped</button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex gap-4 lg:grid lg:grid-cols-6 lg:gap-3 min-w-max lg:min-w-0">
              {STATUSES.map((status, i) => (
                <motion.div key={status.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <KanbanColumn status={status} leads={leadsByStatus[status.id] || []} onSelect={l => { setEditingLead(l); setShowModal(true); }} onDrop={handleDropLead} />
                </motion.div>
              ))}
            </div>
          </div>
        )
      ) : (
        <ScrapedLeadsView scrapedLeads={scrapedLeads} onConvert={handleConvertScraped} />
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && <LeadModal lead={editingLead} onClose={() => { setShowModal(false); setEditingLead(undefined); }} onSave={handleSaveLead} />}
      </AnimatePresence>
    </div>
  );
}
