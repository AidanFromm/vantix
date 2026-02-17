'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Users, Building2, Mail, Phone, DollarSign,
  Globe, MapPin, Clock, Filter, TrendingUp, Zap, Eye,
  Tag, Edit3, Loader2, ChevronRight, UserPlus, Briefcase,
} from 'lucide-react';
import { getClients, createClient, updateClient } from '@/lib/supabase';
import type { Client, ClientStatus } from '@/lib/types';

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; textColor: string; bgColor: string; borderColor: string }> = {
  lead: { label: 'Lead', color: 'bg-blue-500', textColor: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  prospect: { label: 'Prospect', color: 'bg-amber-500', textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
  active: { label: 'Active', color: 'bg-emerald-500', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  inactive: { label: 'Inactive', color: 'bg-gray-500', textColor: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' },
  churned: { label: 'Churned', color: 'bg-red-500', textColor: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
};

const PIPELINE_STAGES: ClientStatus[] = ['lead', 'prospect', 'active', 'inactive', 'churned'];

function formatCurrency(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n); }
function formatDate(d: string) { const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff}d ago`; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function getInitials(name: string) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between"><div className="h-8 w-48 bg-white/5 rounded-lg" /><div className="h-10 w-32 bg-white/5 rounded-xl" /></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}</div>
      <div className="h-12 bg-white/5 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-56 bg-white/5 rounded-2xl" />)}</div>
    </div>
  );
}

// ─── Add/Edit Client Modal ───────────────────────────────────────────────────

interface ClientFormData { name: string; contact_name: string; contact_email: string; contact_phone: string; industry: string; website: string; status: ClientStatus; contract_value: number; notes: string; tags: string; }

function ClientModal({ client, onClose, onSave }: { client?: Client | null; onClose: () => void; onSave: (data: Partial<Client>) => Promise<void> }) {
  const [form, setForm] = useState<ClientFormData>({
    name: client?.name || '', contact_name: client?.contact_name || '', contact_email: client?.contact_email || '',
    contact_phone: client?.contact_phone || '', industry: client?.industry || '', website: client?.website || '',
    status: client?.status || 'lead', contract_value: client?.contract_value || 0, notes: client?.notes || '',
    tags: client?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name, contact_name: form.contact_name || undefined, contact_email: form.contact_email || undefined,
        contact_phone: form.contact_phone || undefined, industry: form.industry || undefined, website: form.website || undefined,
        status: form.status, contract_value: form.contract_value, notes: form.notes || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        type: 'company',
      });
      onClose();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{client ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Company / Client Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Acme Corp" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Contact Name</label><input type="text" value={form.contact_name} onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Email</label><input type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} placeholder="john@acme.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Phone</label><input type="tel" value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} placeholder="(555) 000-0000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Industry</label><input type="text" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="Technology" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block">Website</label><input type="text" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="acme.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block">Contract Value</label><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" /><input type="number" value={form.contract_value} onChange={e => setForm(p => ({ ...p, contract_value: parseFloat(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div></div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {PIPELINE_STAGES.map(s => {
                const cfg = STATUS_CONFIG[s];
                return <button key={s} type="button" onClick={() => setForm(p => ({ ...p, status: s }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s ? `${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor}` : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'}`}>{cfg.label}</button>;
              })}
            </div>
          </div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Tags (comma separated)</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e-commerce, shopify, priority" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" /></div>
          <div><label className="text-xs text-gray-500 mb-1.5 block">Notes</label><textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Add notes about this client..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : client ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Client Detail Drawer ────────────────────────────────────────────────────

function ClientDrawer({ client, onClose, onEdit }: { client: Client; onClose: () => void; onEdit: () => void }) {
  const sc = STATUS_CONFIG[client.status];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="relative w-full max-w-lg h-full bg-[#0d0d0d]/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-400">{getInitials(client.name)}</div>
              <div>
                <h2 className="text-xl font-bold text-white">{client.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sc.bgColor} ${sc.textColor} ${sc.borderColor} font-medium uppercase tracking-wider`}><span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.color} mr-1.5`} />{sc.label}</span>
                  {client.industry && <span className="text-xs text-gray-500">{client.industry}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Contract Value', value: formatCurrency(client.contract_value), icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
              { label: 'Lifetime Value', value: formatCurrency(client.lifetime_value), icon: TrendingUp, color: 'text-blue-400 bg-blue-500/10' },
              { label: 'Since', value: client.client_since ? formatDate(client.client_since) : 'N/A', icon: Clock, color: 'text-purple-400 bg-purple-500/10' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 mb-1"><div className={`p-1 rounded-md ${s.color}`}><s.icon size={12} /></div><span className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</span></div>
                <div className="text-base font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Contact Info */}
          {(client.contact_name || client.contact_email || client.contact_phone) && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
              {client.contact_name && <p className="text-sm font-medium text-white">{client.contact_name}</p>}
              {client.contact_role && <p className="text-xs text-gray-500 mb-2">{client.contact_role}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {client.contact_email && <a href={`mailto:${client.contact_email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"><Mail size={12} />{client.contact_email}</a>}
                {client.contact_phone && <a href={`tel:${client.contact_phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"><Phone size={12} />{client.contact_phone}</a>}
              </div>
            </div>
          )}
          {client.website && (
            <a href={`https://${client.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-gray-500 hover:text-white hover:border-emerald-500/30 transition-colors">
              <Globe size={14} className="text-emerald-400" /><span className="truncate">{client.website}</span>
            </a>
          )}
          {client.tags && client.tags.length > 0 && <div className="flex flex-wrap gap-2">{client.tags.map(tag => <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-500"><Tag size={10} className="inline mr-1" />{tag}</span>)}</div>}
          {client.notes && <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10"><h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Notes</h4><p className="text-sm text-white whitespace-pre-wrap">{client.notes}</p></div>}
        </div>
        <div className="p-4 border-t border-white/10 flex items-center justify-end">
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm"><Edit3 size={14} /> Edit Client</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null | undefined>(undefined); // undefined=closed, null=new, Client=edit
  const [showModal, setShowModal] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      const { data, error } = await getClients({ search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined });
      if (error) throw error;
      setClients(data || []);
    } catch (err) { console.error('Failed to load clients:', err); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { loadClients(); }, [loadClients]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalValue: clients.reduce((s, c) => s + c.contract_value, 0),
    lifetimeValue: clients.reduce((s, c) => s + c.lifetime_value, 0),
  }), [clients]);

  const handleSaveClient = async (data: Partial<Client>) => {
    if (editingClient) {
      const { error } = await updateClient(editingClient.id, data);
      if (error) throw error;
    } else {
      const { error } = await createClient(data);
      if (error) throw error;
    }
    await loadClients();
  };

  // Pipeline counts
  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PIPELINE_STAGES.forEach(s => counts[s] = clients.filter(c => c.status === s).length);
    return counts;
  }, [clients]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your client relationships</p>
        </div>
        <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm">
          <Plus size={18} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Clients', value: String(stats.total), icon: Users, color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
          { label: 'Active', value: String(stats.active), icon: Zap, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
          { label: 'Contract Value', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20' },
          { label: 'Lifetime Revenue', value: formatCurrency(stats.lifetimeValue), icon: TrendingUp, color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400', borderColor: 'border-purple-500/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} p-4`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span><stat.icon size={18} className={stat.iconColor} /></div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Bar */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/5">
        {PIPELINE_STAGES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const pct = stats.total > 0 ? (pipelineCounts[s] / stats.total) * 100 : 0;
          return pct > 0 ? <div key={s} className={`${cfg.color} transition-all`} style={{ width: `${pct}%` }} title={`${cfg.label}: ${pipelineCounts[s]}`} /> : null;
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        {PIPELINE_STAGES.map(s => {
          const cfg = STATUS_CONFIG[s];
          return <div key={s} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${cfg.color}`} /><span>{cfg.label}: {pipelineCounts[s]}</span></div>;
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div className="flex gap-2">
          {PIPELINE_STAGES.map(s => {
            const cfg = STATUS_CONFIG[s];
            return <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border hidden sm:block ${statusFilter === s ? `${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor}` : 'bg-white/[0.03] text-gray-500 border-white/10 hover:text-white'}`}>{cfg.label}</button>;
          })}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="sm:hidden bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50">
            <option value="all">All Status</option>
            {PIPELINE_STAGES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((client, i) => {
          const sc = STATUS_CONFIG[client.status];
          return (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setSelectedClient(client)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-white/10 p-5 cursor-pointer hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0">{getInitials(client.name)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bgColor} ${sc.textColor} ${sc.borderColor}`}><span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.color} mr-1`} />{sc.label}</span>
                    {client.industry && <span className="text-[10px] text-gray-500">{client.industry}</span>}
                  </div>
                </div>
              </div>
              {client.contact_name && <div className="mb-3"><p className="text-sm text-white truncate">{client.contact_name}</p>{client.contact_email && <p className="text-xs text-gray-500 truncate">{client.contact_email}</p>}</div>}
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-xs text-gray-500">Contract Value</p><p className="text-lg font-bold text-emerald-400">{formatCurrency(client.contract_value)}</p></div>
                <div className="text-right"><p className="text-xs text-gray-500">Created</p><p className="text-sm text-white">{formatDate(client.created_at)}</p></div>
              </div>
              {client.tags && client.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mb-3">{client.tags.slice(0, 3).map(tag => <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-500">{tag}</span>)}{client.tags.length > 3 && <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-500">+{client.tags.length - 3}</span>}</div>}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                {client.contact_email && <a href={`mailto:${client.contact_email}`} onClick={e => e.stopPropagation()} className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Mail size={14} /></a>}
                {client.contact_phone && <a href={`tel:${client.contact_phone}`} onClick={e => e.stopPropagation()} className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"><Phone size={14} /></a>}
                <button onClick={e => { e.stopPropagation(); setEditingClient(client); setShowModal(true); }} className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-colors ml-auto"><Edit3 size={14} /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {clients.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4"><Users size={28} className="text-gray-500" /></div>
          <h3 className="text-lg font-medium text-white mb-2">{search || statusFilter !== 'all' ? 'No clients found' : 'No clients yet'}</h3>
          <p className="text-sm text-gray-500 mb-6">{search || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add your first client to get started'}</p>
          {!search && statusFilter === 'all' && (
            <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors text-sm font-medium"><Plus size={16} /> Add Your First Client</button>
          )}
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedClient && <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} onEdit={() => { setEditingClient(selectedClient); setShowModal(true); setSelectedClient(null); }} />}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && <ClientModal client={editingClient} onClose={() => { setShowModal(false); setEditingClient(undefined); }} onSave={handleSaveClient} />}
      </AnimatePresence>
    </div>
  );
}
