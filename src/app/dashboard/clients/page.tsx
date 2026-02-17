'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Users, Mail, Phone, DollarSign,
  Globe, Clock, TrendingUp, Zap, Edit3, Loader2, Trash2,
} from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient } from '@/lib/supabase';
import type { Client, ClientStatus } from '@/lib/types';

const STATUS_CONFIG: Record<ClientStatus, { label: string; dot: string; color: string; bg: string; border: string }> = {
  lead: { label: 'Lead', dot: 'bg-blue-500', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  prospect: { label: 'Prospect', dot: 'bg-amber-500', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  active: { label: 'Active', dot: 'bg-emerald-500', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  inactive: { label: 'Inactive', dot: 'bg-gray-400', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
  churned: { label: 'Churned', dot: 'bg-red-500', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

const PIPELINE: ClientStatus[] = ['lead', 'prospect', 'active', 'inactive', 'churned'];
function formatCurrency(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n); }
function formatDate(d: string) { const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff}d ago`; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function getInitials(name: string) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

function ClientModal({ client, onClose, onSave }: { client?: Client | null; onClose: () => void; onSave: (data: Partial<Client>) => Promise<void> }) {
  const [form, setForm] = useState({
    name: client?.name || '', contact_name: client?.contact_name || '', contact_email: client?.contact_email || '',
    contact_phone: client?.contact_phone || '', industry: client?.industry || '', website: client?.website || '',
    status: client?.status || 'lead' as ClientStatus, contract_value: client?.contract_value || 0, notes: client?.notes || '',
    tags: client?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#FAFAFA] border border-[#E8E2DA] rounded-xl px-4 py-3 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name, contact_name: form.contact_name || undefined, contact_email: form.contact_email || undefined,
        contact_phone: form.contact_phone || undefined, industry: form.industry || undefined, website: form.website || undefined,
        status: form.status, contract_value: form.contract_value, notes: form.notes || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], type: 'company',
      });
      onClose();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2D2A26]/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-lg bg-white border border-[#E8E2DA] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E8E2DA] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D2A26]">{client ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F5F0EB] text-[#8C857C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Company / Client Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Contact Name</label><input type="text" value={form.contact_name} onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Email</label><input type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Phone</label><input type="tel" value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Industry</label><input type="text" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Website</label><input type="text" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-[#8C857C] mb-1.5 block">Contract Value</label><input type="number" value={form.contract_value} onChange={e => setForm(p => ({ ...p, contract_value: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {PIPELINE.map(s => { const cfg = STATUS_CONFIG[s]; return <button key={s} type="button" onClick={() => setForm(p => ({ ...p, status: s }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'bg-[#F5F0EB] text-[#8C857C] border-[#E8E2DA]'}`}>{cfg.label}</button>; })}
            </div>
          </div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Tags (comma separated)</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className={inputCls} /></div>
          <div><label className="text-xs text-[#8C857C] mb-1.5 block">Notes</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#F5F0EB] text-[#8C857C] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-[#B8895A] text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : client ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    try {
      const { data } = await getClients({ search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined });
      setClients(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { loadClients(); }, [loadClients]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalValue: clients.reduce((s, c) => s + (c.contract_value || 0), 0),
    lifetimeValue: clients.reduce((s, c) => s + (c.lifetime_value || 0), 0),
  }), [clients]);

  const handleSave = async (data: Partial<Client>) => {
    if (editingClient) { const { error } = await updateClient(editingClient.id, data); if (error) throw error; }
    else { const { error } = await createClient(data); if (error) throw error; }
    await loadClients();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return;
    setDeleting(id);
    try { const { error } = await deleteClient(id); if (error) throw error; await loadClients(); }
    catch (err) { console.error(err); } finally { setDeleting(null); }
  };

  if (loading) return <div className="space-y-6 animate-pulse"><div className="h-8 w-48 bg-[#E8E2DA] rounded-lg" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#E8E2DA]/50 rounded-2xl" />)}</div></div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26]">Clients</h1><p className="text-sm text-[#8C857C] mt-1">Manage your client relationships</p></div>
        <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#B8895A] hover:bg-[#A67A4B] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-[#B8895A]/20 text-sm"><Plus size={18} /> Add Client</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Clients', value: String(stats.total), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Active', value: String(stats.active), icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Contract Value', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'text-[#B8895A]', bg: 'bg-[#B8895A]/10', border: 'border-[#B8895A]/20' },
          { label: 'Lifetime Revenue', value: formatCurrency(stats.lifetimeValue), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-white border ${stat.border} rounded-2xl p-4 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#8C857C]">{stat.label}</span><stat.icon size={18} className={stat.color} /></div>
            <p className="text-2xl font-bold text-[#2D2A26]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C857C]" />
          <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8E2DA] rounded-xl text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50" />
        </div>
        <div className="flex gap-2">
          {PIPELINE.map(s => {
            const cfg = STATUS_CONFIG[s];
            return <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border hidden sm:block ${statusFilter === s ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'bg-white text-[#8C857C] border-[#E8E2DA] hover:text-[#2D2A26]'}`}>{cfg.label}</button>;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((client, i) => {
          const sc = STATUS_CONFIG[client.status] || STATUS_CONFIG.lead;
          return (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-[#E8E2DA] p-5 hover:border-[#B8895A]/30 hover:shadow-lg transition-all shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8CFA0]/40 to-[#D4B07C]/40 border border-[#D4B07C]/30 flex items-center justify-center text-lg font-bold text-[#B8895A] shrink-0">{getInitials(client.name)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#2D2A26] truncate group-hover:text-[#B8895A] transition-colors">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bg} ${sc.color} ${sc.border}`}>{sc.label}</span>
                    {client.industry && <span className="text-[10px] text-[#8C857C]">{client.industry}</span>}
                  </div>
                </div>
              </div>
              {client.contact_name && <div className="mb-3"><p className="text-sm text-[#2D2A26] truncate">{client.contact_name}</p>{client.contact_email && <p className="text-xs text-[#8C857C] truncate">{client.contact_email}</p>}</div>}
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-xs text-[#8C857C]">Contract Value</p><p className="text-lg font-bold text-[#B8895A]">{formatCurrency(client.contract_value || 0)}</p></div>
                <div className="text-right"><p className="text-xs text-[#8C857C]">Created</p><p className="text-sm text-[#2D2A26]">{formatDate(client.created_at)}</p></div>
              </div>
              {(client.tags?.length ?? 0) > 0 && <div className="flex flex-wrap gap-1.5 mb-3">{client.tags!.slice(0, 3).map(tag => <span key={tag} className="px-2 py-0.5 rounded-md bg-[#F5F0EB] text-[10px] text-[#8C857C]">{tag}</span>)}</div>}
              <div className="flex items-center gap-2 pt-3 border-t border-[#E8E2DA]">
                {client.contact_email && <a href={`mailto:${client.contact_email}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg bg-[#F5F0EB] text-[#8C857C] hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"><Mail size={14} /></a>}
                {client.contact_phone && <a href={`tel:${client.contact_phone}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg bg-[#F5F0EB] text-[#8C857C] hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"><Phone size={14} /></a>}
                <button onClick={() => { setEditingClient(client); setShowModal(true); }} className="w-8 h-8 rounded-lg bg-[#F5F0EB] text-[#8C857C] hover:text-[#B8895A] hover:bg-[#B8895A]/10 flex items-center justify-center transition-colors ml-auto"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(client.id)} disabled={deleting === client.id} className="w-8 h-8 rounded-lg bg-[#F5F0EB] text-[#8C857C] hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors">
                  {deleting === client.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E2DA] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]"><Users size={28} className="text-[#8C857C]" /></div>
          <h3 className="text-lg font-medium text-[#2D2A26] mb-2">{search || statusFilter !== 'all' ? 'No clients found' : 'No clients yet'}</h3>
          <p className="text-sm text-[#8C857C] mb-6">{search || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add your first client to get started'}</p>
          {!search && statusFilter === 'all' && <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B8895A]/10 text-[#B8895A] rounded-xl hover:bg-[#B8895A]/20 text-sm font-medium"><Plus size={16} /> Add Your First Client</button>}
        </div>
      )}

      <AnimatePresence>{showModal && <ClientModal client={editingClient} onClose={() => { setShowModal(false); setEditingClient(undefined); }} onSave={handleSave} />}</AnimatePresence>
    </div>
  );
}
