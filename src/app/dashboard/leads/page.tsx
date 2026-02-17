'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Phone, Mail, Clock, X, Zap, Target,
  Plus, Building2, DollarSign, Loader2, Trash2, Trophy,
  XCircle, Download,
} from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead, getScrapedLeads } from '@/lib/supabase';
import type { Lead, LeadStatus, ScrapedLead } from '@/lib/types';

const STATUSES: { id: LeadStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'new', label: 'New', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'contacted', label: 'Contacted', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { id: 'qualified', label: 'Qualified', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'proposal', label: 'Proposal', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'won', label: 'Won', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'lost', label: 'Lost', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
];

function formatCurrency(v: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v); }
function formatDate(d: string) { const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff}d ago`; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-600 bg-emerald-50' : score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${color}`}>{score}</span>;
}

function LeadModal({ lead, onClose, onSave }: { lead?: Lead | null; onClose: () => void; onSave: (data: Partial<Lead>) => Promise<void> }) {
  const [form, setForm] = useState({
    name: lead?.name || '', email: lead?.email || '', phone: lead?.phone || '', company: lead?.company || '',
    status: lead?.status || 'new' as LeadStatus, estimated_value: lead?.estimated_value || 0, score: lead?.score || 50,
    source: lead?.source || '', notes: lead?.notes || '', tags: lead?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#FAFAFA] border border-[#E8E2DA] rounded-xl px-4 py-3 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50';

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
      <div className="absolute inset-0 bg-[#2D2A26]/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-white border border-[#E8E2DA] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E8E2DA] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D2A26]">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F5F0EB] text-[#8C857C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Phone</label><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Company</label><input type="text" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Source</label><input type="text" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Estimated Value</label><input type="number" value={form.estimated_value} onChange={e => setForm(p => ({ ...p, estimated_value: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Score (0-100)</label><input type="number" min={0} max={100} value={form.score} onChange={e => setForm(p => ({ ...p, score: parseInt(e.target.value) || 0 }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-2">{STATUSES.map(s => <button key={s.id} type="button" onClick={() => setForm(p => ({ ...p, status: s.id }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s.id ? `${s.bg} ${s.color} ${s.border}` : 'bg-[#F5F0EB] text-[#8C857C] border-[#E8E2DA]'}`}>{s.label}</button>)}</div>
          </div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Tags</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className={inputCls} /></div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Notes</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#F5F0EB] text-[#8C857C] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-[#B8895A] text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function KanbanColumn({ status, leads, onSelect, onDrop, onDelete, deleting }: {
  status: typeof STATUSES[0]; leads: Lead[]; onSelect: (l: Lead) => void;
  onDrop: (id: string, s: LeadStatus) => void; onDelete: (id: string) => void; deleting: string | null;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const totalValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] flex-shrink-0 lg:min-w-0 lg:w-auto lg:flex-1 h-full">
      <div className={`px-3 py-3 rounded-t-xl border border-b-0 bg-white transition-all ${isDragOver ? 'border-[#B8895A]/50 bg-[#B8895A]/5' : 'border-[#E8E2DA]'}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2"><h3 className={`font-semibold text-sm ${status.color}`}>{status.label}</h3><span className="text-xs px-1.5 py-0.5 rounded-md bg-[#F5F0EB] text-[#8C857C] font-medium">{leads.length}</span></div>
        </div>
        <div className="text-xs text-[#8C857C]">Total: <span className="text-[#B8895A] font-semibold">{formatCurrency(totalValue)}</span></div>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false); const id = e.dataTransfer.getData('leadId'); if (id) onDrop(id, status.id); }}
        className={`flex-1 p-2.5 rounded-b-xl border border-t-0 min-h-[300px] max-h-[calc(100vh-400px)] overflow-y-auto transition-all ${isDragOver ? 'bg-[#B8895A]/5 border-[#B8895A]/40' : 'border-[#E8E2DA]'}`}
      >
        <div className="flex flex-col gap-2.5">
          {leads.map(lead => (
            <div key={lead.id} draggable onDragStart={e => { e.dataTransfer.setData('leadId', lead.id); e.dataTransfer.effectAllowed = 'move'; }}>
              <motion.div layout className="group cursor-pointer rounded-xl bg-white border border-[#E8E2DA] hover:border-[#B8895A]/40 p-3.5 transition-all shadow-sm" onClick={() => onSelect(lead)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0"><h3 className="font-semibold text-[#2D2A26] text-sm truncate group-hover:text-[#B8895A]">{lead.name}</h3>{lead.company && <p className="text-xs text-[#8C857C] truncate flex items-center gap-1 mt-0.5"><Building2 size={11} />{lead.company}</p>}</div>
                  <ScoreBadge score={lead.score || 0} />
                </div>
                {lead.estimated_value ? <div className="flex items-center gap-1 text-[#B8895A] mb-2"><DollarSign size={14} /><span className="font-bold text-sm">{formatCurrency(lead.estimated_value)}</span></div> : null}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8C857C]"><Clock size={10} />{formatDate(lead.created_at)}</div>
                  <button onClick={e => { e.stopPropagation(); onDelete(lead.id); }} className="p-1 rounded text-[#8C857C] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    {deleting === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
          {leads.length === 0 && <div className="py-10 text-center"><Users size={18} className="mx-auto mb-2 text-[#8C857C]/40" /><p className="text-xs text-[#8C857C]">No leads here</p></div>}
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<ScrapedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'pipeline' | 'scraped'>('pipeline');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [leadsRes, scrapedRes] = await Promise.all([getLeads({ search: search || undefined }), getScrapedLeads()]);
      setLeads(leadsRes.data || []);
      setScrapedLeads(scrapedRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search]);

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

  const handleSave = async (data: Partial<Lead>) => {
    if (editingLead) { const { error } = await updateLead(editingLead.id, data); if (error) throw error; }
    else { const { error } = await createLead(data); if (error) throw error; }
    await loadData();
  };

  const handleDrop = async (leadId: string, newStatus: LeadStatus) => {
    try { const { error } = await updateLead(leadId, { status: newStatus }); if (error) throw error; setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l)); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    setDeleting(id);
    try { const { error } = await deleteLead(id); if (error) throw error; await loadData(); }
    catch (err) { console.error(err); } finally { setDeleting(null); }
  };

  const handleConvertScraped = async (scraped: ScrapedLead) => {
    try { await createLead({ name: scraped.business_name || 'Unknown', email: scraped.email || undefined, phone: scraped.phone || undefined, company: scraped.business_name || undefined, status: 'new', score: 30, source: 'Scraper', tags: ['scraped'] }); await loadData(); }
    catch (err) { console.error(err); }
  };

  if (loading) return <div className="space-y-6 animate-pulse"><div className="h-8 w-48 bg-[#E8E2DA] rounded-lg" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#E8E2DA]/50 rounded-2xl" />)}</div></div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26]">Leads</h1><p className="text-sm text-[#8C857C] mt-1">Manage your sales pipeline</p></div>
        <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#B8895A] hover:bg-[#A67A4B] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#B8895A]/20 text-sm"><Plus size={18} /> Add Lead</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: String(stats.total), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'New Leads', value: String(stats.newLeads), icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
          { label: 'Pipeline Value', value: formatCurrency(stats.pipelineValue), icon: Target, color: 'text-[#B8895A]', bg: 'bg-[#B8895A]/10', border: 'border-[#B8895A]/20' },
          { label: 'Won Value', value: formatCurrency(stats.wonValue), icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-white border ${stat.border} rounded-2xl p-4 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#8C857C]">{stat.label}</span><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={18} className={stat.color} /></div></div>
            <p className="text-xl sm:text-2xl font-bold text-[#2D2A26]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex bg-white border border-[#E8E2DA] rounded-xl p-1">
          <button onClick={() => setActiveView('pipeline')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'pipeline' ? 'bg-[#B8895A]/10 text-[#B8895A]' : 'text-[#8C857C]'}`}><Target size={15} /> Pipeline</button>
          <button onClick={() => setActiveView('scraped')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'scraped' ? 'bg-[#B8895A]/10 text-[#B8895A]' : 'text-[#8C857C]'}`}><Download size={15} /> Scraped ({scrapedLeads.length})</button>
        </div>
        {activeView === 'pipeline' && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C857C]" />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-[#E8E2DA] rounded-xl pl-10 pr-4 py-2 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50" />
          </div>
        )}
      </div>

      {activeView === 'pipeline' ? (
        leads.length === 0 && !search ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#B8895A]/10 flex items-center justify-center mb-6"><Target size={40} className="text-[#B8895A]" /></div>
            <h3 className="text-xl font-semibold text-[#2D2A26] mb-2">No leads yet</h3>
            <p className="text-[#8C857C] max-w-md mb-6">Start building your sales pipeline by adding leads.</p>
            <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#B8895A]/10 text-[#B8895A] border border-[#B8895A]/30 font-medium"><Plus size={18} /> Add Your First Lead</button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex gap-4 lg:grid lg:grid-cols-6 lg:gap-3 min-w-max lg:min-w-0">
              {STATUSES.map((status, i) => (
                <motion.div key={status.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <KanbanColumn status={status} leads={leadsByStatus[status.id] || []} onSelect={l => { setEditingLead(l); setShowModal(true); }} onDrop={handleDrop} onDelete={handleDelete} deleting={deleting} />
                </motion.div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* Scraped leads */
        scrapedLeads.length === 0 ? (
          <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#B8895A]/10 flex items-center justify-center"><Search size={28} className="text-[#B8895A]" /></div><h3 className="font-semibold text-[#2D2A26] mb-2">No scraped leads yet</h3><p className="text-sm text-[#8C857C]">Scraped leads from your email scraper will appear here.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {scrapedLeads.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="p-4 rounded-xl bg-white border border-[#E8E2DA] hover:border-[#B8895A]/30 transition-all shadow-sm">
                <h4 className="text-sm font-semibold text-[#2D2A26] truncate mb-2">{s.business_name || 'Unknown Business'}</h4>
                <div className="space-y-1 mb-3">
                  {s.email && <p className="text-xs text-[#8C857C] flex items-center gap-1.5"><Mail size={11} />{s.email}</p>}
                  {s.phone && <p className="text-xs text-[#8C857C] flex items-center gap-1.5"><Phone size={11} />{s.phone}</p>}
                </div>
                {s.status !== 'added_to_leads' && s.status !== 'ignored' && (
                  <button onClick={() => handleConvertScraped(s)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#B8895A]/10 text-[#B8895A] hover:bg-[#B8895A]/20 text-xs font-medium"><Plus size={12} /> Convert to Lead</button>
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
