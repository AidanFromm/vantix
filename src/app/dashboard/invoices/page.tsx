'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, FileText, DollarSign, Clock, AlertTriangle,
  CheckCircle2, Send, ArrowLeft, Trash2, Edit3, Receipt, Loader2, Filter, ChevronDown,
} from 'lucide-react';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getClients, getProjects } from '@/lib/supabase';
import type { Invoice, InvoiceStatus, Client, Project } from '@/lib/types';

function formatCurrency(n: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n); }
function formatDate(d: string): string { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: FileText },
  sent: { label: 'Sent', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Send },
  paid: { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', icon: X },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const c = statusConfig[status]; if (!c) return null; const Icon = c.icon;
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color} ${c.bg} border ${c.border}`}><Icon size={12} />{c.label}</span>;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [iRes, cRes, pRes] = await Promise.all([getInvoices({ status: statusFilter !== 'all' ? statusFilter : undefined }), getClients(), getProjects()]);
      setInvoices(iRes.data || []);
      setClients(cRes.data || []);
      setProjects(pRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(inv => inv.client?.name?.toLowerCase().includes(q) || inv.invoice_number?.toLowerCase().includes(q));
  }, [invoices, search]);

  const stats = useMemo(() => {
    let outstanding = 0, paid = 0, overdueCount = 0;
    invoices.forEach(inv => {
      const amt = inv.total || inv.amount || 0;
      if (inv.status === 'paid') paid += amt;
      else if (inv.status === 'sent' || inv.status === 'overdue') { outstanding += amt; if (inv.status === 'overdue') overdueCount++; }
    });
    return { outstanding, paid, overdueCount, total: invoices.length };
  }, [invoices]);

  const handleSave = async (data: Partial<Invoice>) => {
    try {
      if (editingInvoice) { const { error } = await updateInvoice(editingInvoice.id, data); if (error) throw error; }
      else { const { error } = await createInvoice(data); if (error) throw error; }
      setShowForm(false); setEditingInvoice(null); await loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    setDeleting(id);
    try { const { error } = await deleteInvoice(id); if (error) throw error; await loadData(); }
    catch (err) { console.error(err); } finally { setDeleting(null); }
  };

  const handleStatusChange = async (id: string, status: InvoiceStatus) => {
    try {
      const updates: Partial<Invoice> = { status };
      if (status === 'paid') updates.paid_at = new Date().toISOString().split('T')[0];
      await updateInvoice(id, updates);
      await loadData();
    } catch (err) { console.error(err); }
  };

  const statCards = [
    { label: 'Outstanding', value: formatCurrency(stats.outstanding), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Paid', value: formatCurrency(stats.paid), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Overdue', value: String(stats.overdueCount), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'All Invoices', value: String(stats.total), icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-[#2D2A26]">Invoices</h1><p className="text-sm text-[#8C857C] mt-0.5">Manage invoices and track payments</p></div>
        <button onClick={() => { setEditingInvoice(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#B8895A] hover:bg-[#A67A4B] text-white rounded-xl font-medium text-sm transition-colors"><Plus size={16} /> New Invoice</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl bg-white border ${s.border} p-4 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={18} className={s.color} /></div>
              <div><p className="text-xs text-[#8C857C]">{s.label}</p><p className={`text-lg font-bold text-[#2D2A26]`}>{s.value}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#B8895A] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C857C]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client or invoice number..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E2DA] rounded-xl text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-white border border-[#E8E2DA] rounded-xl px-3 py-2 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50">
              <option value="all">All Status</option>
              {(['draft','sent','paid','overdue','cancelled'] as const).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Receipt size={40} className="mx-auto mb-3 text-[#8C857C]/30" />
              <p className="text-sm text-[#8C857C]">{search || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}</p>
              {!search && statusFilter === 'all' && <button onClick={() => { setEditingInvoice(null); setShowForm(true); }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#B8895A]/10 text-[#B8895A] rounded-xl text-sm font-medium"><Plus size={14} /> Create Your First Invoice</button>}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-[#E8E2DA] overflow-hidden shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#E8E2DA] text-[#8C857C] text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Invoice</th>
                    <th className="text-left px-5 py-3 font-medium">Client</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Due Date</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(inv => {
                      const amt = inv.total || inv.amount || 0;
                      return (
                        <tr key={inv.id} className="border-b border-[#E8E2DA]/50 hover:bg-[#F5F0EB]/50 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-[#B8895A] font-medium">{inv.invoice_number || inv.id.slice(0, 8)}</td>
                          <td className="px-5 py-3.5 text-[#2D2A26]">{inv.client?.name || 'N/A'}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                          <td className="px-5 py-3.5 text-right text-[#2D2A26] font-medium">{formatCurrency(amt)}</td>
                          <td className="px-5 py-3.5 text-[#8C857C]">{inv.due_date ? formatDate(inv.due_date) : 'N/A'}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {inv.status === 'draft' && <button onClick={() => handleStatusChange(inv.id, 'sent')} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50" title="Mark Sent"><Send size={14} /></button>}
                              {(inv.status === 'sent' || inv.status === 'overdue') && <button onClick={() => handleStatusChange(inv.id, 'paid')} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50" title="Mark Paid"><CheckCircle2 size={14} /></button>}
                              <button onClick={() => { setEditingInvoice(inv); setShowForm(true); }} className="p-1.5 rounded-lg text-[#8C857C] hover:text-[#B8895A] hover:bg-[#B8895A]/10"><Edit3 size={14} /></button>
                              <button onClick={() => handleDelete(inv.id)} disabled={deleting === inv.id} className="p-1.5 rounded-lg text-[#8C857C] hover:text-red-500 hover:bg-red-50">
                                {deleting === inv.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              </button>
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
        </>
      )}

      <AnimatePresence>
        {showForm && <InvoiceFormModal invoice={editingInvoice} clients={clients} projects={projects} onClose={() => { setShowForm(false); setEditingInvoice(null); }} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}

function InvoiceFormModal({ invoice, clients, projects, onClose, onSave }: { invoice: Invoice | null; clients: Client[]; projects: Project[]; onClose: () => void; onSave: (data: Partial<Invoice>) => Promise<void> }) {
  const [form, setForm] = useState({
    invoice_number: invoice?.invoice_number || '',
    client_id: invoice?.client_id || '',
    project_id: invoice?.project_id || '',
    total: invoice?.total || invoice?.amount || 0,
    status: invoice?.status || 'draft' as InvoiceStatus,
    due_date: invoice?.due_date || '',
    paid_at: invoice?.paid_at || invoice?.paid_date || '',
    notes: invoice?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#FAFAFA] border border-[#E8E2DA] rounded-xl px-4 py-3 text-sm text-[#2D2A26] focus:outline-none focus:border-[#B8895A]/50';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.total) return;
    setSaving(true);
    try {
      await onSave({
        invoice_number: form.invoice_number || undefined,
        client_id: form.client_id || undefined,
        project_id: form.project_id || undefined,
        total: form.total,
        status: form.status,
        due_date: form.due_date || undefined,
        paid_at: form.paid_at || undefined,
        notes: form.notes || undefined,
      });
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#2D2A26]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white border border-[#E8E2DA] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#E8E2DA] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D2A26]">{invoice ? 'Edit Invoice' : 'New Invoice'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F5F0EB] text-[#8C857C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-[#8C857C] mb-1.5">Invoice Number</label><input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} placeholder="INV-1001" className={inputCls} /></div>
            <div><label className="block text-xs text-[#8C857C] mb-1.5">Amount ($) *</label><input type="number" min={0} step={0.01} value={form.total || ''} onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))} className={inputCls} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-[#8C857C] mb-1.5">Client</label><select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} className={inputCls}><option value="">Select client...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-xs text-[#8C857C] mb-1.5">Project</label><select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} className={inputCls}><option value="">Select project...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
          <div><label className="block text-xs text-[#8C857C] mb-1.5">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['draft','sent','paid','overdue','cancelled'] as InvoiceStatus[]).map(s => {
                const cfg = statusConfig[s];
                return <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s, ...(s === 'paid' && !f.paid_at ? { paid_at: new Date().toISOString().split('T')[0] } : {}) }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'bg-[#F5F0EB] text-[#8C857C] border-[#E8E2DA]'}`}>{cfg.label}</button>;
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-[#8C857C] mb-1.5">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} /></div>
            <div><label className="block text-xs text-[#8C857C] mb-1.5">Paid Date</label><input type="date" value={form.paid_at} onChange={e => setForm(f => ({ ...f, paid_at: e.target.value }))} className={inputCls} /></div>
          </div>
          <div><label className="block text-xs text-[#8C857C] mb-1.5">Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#F5F0EB] text-[#8C857C] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.total} className="flex-1 px-4 py-3 rounded-xl bg-[#B8895A] text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : invoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
