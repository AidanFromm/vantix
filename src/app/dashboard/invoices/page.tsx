'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, FileText, DollarSign, Clock, AlertTriangle,
  CheckCircle2, Send, Trash2, Edit3, Receipt, Loader2, Printer,
} from 'lucide-react';

interface Client { id: string; name: string; }
interface Project { id: string; name: string; }
interface Invoice {
  id: string; invoice_number?: string; client_id?: string; project_id?: string;
  total: number; amount?: number; status: string; due_date?: string;
  paid_at?: string; paid_date?: string; notes?: string; created_at: string;
  client?: Client; project?: Project;
}
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSet<T>(key: string, data: T[]) {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function generateId(): string { return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36); }

function formatCurrency(n: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n); }
function formatDate(d: string): string { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'text-[#F4EFE8]0', bg: 'bg-[#F4EFE8]', border: 'border-[#E3D9CD]', icon: FileText },
  sent: { label: 'Sent', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/20', icon: Send },
  paid: { label: 'Paid', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/20', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'text-[#8E5E34]', bg: 'bg-[#B0614A]/5', border: 'border-[#B0614A]/20', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', color: 'text-[#A39B90]', bg: 'bg-[#F4EFE8]', border: 'border-[#E3D9CD]', icon: X },
};

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status as InvoiceStatus]; if (!c) return null; const Icon = c.icon;
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color} ${c.bg} border ${c.border}`}><Icon size={12} />{c.label}</span>;
}

function autoDetectOverdue(invoices: Invoice[]): Invoice[] {
  const today = new Date().toISOString().split('T')[0];
  return invoices.map(inv => {
    if (inv.status === 'sent' && inv.due_date && inv.due_date < today) {
      return { ...inv, status: 'overdue' };
    }
    return inv;
  });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(() => {
    try {
      const allClients = lsGet<Client>('vantix_clients');
      const allProjects = lsGet<Project>('vantix_projects');
      setClients(allClients);
      setProjects(allProjects);
      let invs = lsGet<Invoice>('vantix_invoices');
      invs = autoDetectOverdue(invs);
      invs = invs.map(inv => ({
        ...inv,
        client: allClients.find(c => c.id === inv.client_id),
        project: allProjects.find(p => p.id === inv.project_id),
      }));
      if (statusFilter !== 'all') invs = invs.filter(i => i.status === statusFilter);
      // Persist overdue detection
      lsSet('vantix_invoices', lsGet<Invoice>('vantix_invoices').map(inv => {
        if (inv.status === 'sent' && inv.due_date && inv.due_date < new Date().toISOString().split('T')[0]) return { ...inv, status: 'overdue' };
        return inv;
      }));
      setInvoices(invs);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(inv => inv.client?.name?.toLowerCase().includes(q) || inv.invoice_number?.toLowerCase().includes(q));
  }, [invoices, search]);

  const stats = useMemo(() => {
    const all = lsGet<Invoice>('vantix_invoices');
    const detected = autoDetectOverdue(all);
    let outstanding = 0, paid = 0, overdueCount = 0, total = 0;
    detected.forEach(inv => {
      const amt = inv.total || inv.amount || 0;
      total += amt;
      if (inv.status === 'paid') paid += amt;
      else if (inv.status === 'sent' || inv.status === 'overdue') { outstanding += amt; if (inv.status === 'overdue') overdueCount++; }
    });
    return { outstanding, paid, overdueCount, total: detected.length, grandTotal: total };
  }, [invoices]);

  const handleSave = (data: Partial<Invoice>) => {
    try {
      const items = lsGet<Invoice>('vantix_invoices');
      const now = new Date().toISOString();
      if (editingInvoice) {
        const idx = items.findIndex(i => i.id === editingInvoice.id);
        if (idx >= 0) items[idx] = { ...items[idx], ...data };
      } else {
        items.unshift({ id: generateId(), created_at: now, status: 'draft', total: 0, ...data } as Invoice);
      }
      lsSet('vantix_invoices', items);
      setShowForm(false); setEditingInvoice(null); loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    setDeleting(id);
    try { lsSet('vantix_invoices', lsGet<Invoice>('vantix_invoices').filter(i => i.id !== id)); loadData(); } catch (e) { console.error(e); }
    setDeleting(null);
  };

  const handleStatusChange = (id: string, status: string) => {
    try {
      const items = lsGet<Invoice>('vantix_invoices');
      const idx = items.findIndex(i => i.id === id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], status };
        if (status === 'paid') items[idx].paid_at = new Date().toISOString().split('T')[0];
      }
      lsSet('vantix_invoices', items);
      // Log activity
      const activities = lsGet<Record<string, unknown>>('vantix_activities');
      activities.unshift({ id: generateId(), type: 'payment', title: `Invoice ${items[idx]?.invoice_number || id.slice(0, 8)} marked as ${status}`, created_at: new Date().toISOString() });
      lsSet('vantix_activities', activities);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handlePrint = (inv: Invoice) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Invoice ${inv.invoice_number || inv.id.slice(0,8)}</title><style>body{font-family:system-ui;padding:40px;color:#1C1C1C}h1{color:#8E5E34}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #E3D9CD}.total{font-size:24px;font-weight:bold}</style></head><body>`);
    w.document.write(`<h1>INVOICE</h1><p><strong>${inv.invoice_number || inv.id.slice(0,8)}</strong></p>`);
    w.document.write(`<p>Client: ${inv.client?.name || 'N/A'}</p>`);
    w.document.write(`<p>Date: ${formatDate(inv.created_at)}</p>`);
    w.document.write(`<p>Due: ${inv.due_date ? formatDate(inv.due_date) : 'N/A'}</p>`);
    w.document.write(`<p>Status: ${inv.status.toUpperCase()}</p>`);
    w.document.write(`<hr/><p class="total">Total: ${formatCurrency(inv.total || inv.amount || 0)}</p>`);
    if (inv.notes) w.document.write(`<p><em>${inv.notes}</em></p>`);
    w.document.write(`</body></html>`);
    w.document.close();
    w.print();
  };

  const statCards = [
    { label: 'Outstanding', value: formatCurrency(stats.outstanding), icon: Clock, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
    { label: 'Paid', value: formatCurrency(stats.paid), icon: CheckCircle2, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
    { label: 'Overdue', value: String(stats.overdueCount), icon: AlertTriangle, color: 'text-[#8E5E34]', bg: 'bg-[#B0614A]/5', border: 'border-[#B0614A]/10' },
    { label: 'All Invoices', value: String(stats.total), icon: Receipt, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-[#1C1C1C]">Invoices</h1><p className="text-sm text-[#7A746C] mt-0.5">Manage invoices and track payments</p></div>
        <button onClick={() => { setEditingInvoice(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#8E5E34] hover:bg-[#B07A45] text-white rounded-xl font-medium text-sm transition-colors"><Plus size={16} /> New Invoice</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl bg-[#EEE6DC] border ${s.border} p-4 shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={18} className={s.color} /></div>
              <div><p className="text-xs text-[#7A746C]">{s.label}</p><p className="text-lg font-bold text-[#1C1C1C]">{s.value}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#8E5E34] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client or invoice number..." className="w-full pl-10 pr-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50">
              <option value="all">All Status</option>
              {(['draft','sent','paid','overdue','cancelled'] as const).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Receipt size={40} className="mx-auto mb-3 text-[#7A746C]/30" />
              <p className="text-sm text-[#7A746C]">{search || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}</p>
              {!search && statusFilter === 'all' && <button onClick={() => { setEditingInvoice(null); setShowForm(true); }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#8E5E34]/10 text-[#8E5E34] rounded-xl text-sm font-medium"><Plus size={14} /> Create Your First Invoice</button>}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#EEE6DC] border border-[#E3D9CD] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#E3D9CD] text-[#7A746C] text-xs uppercase tracking-wider">
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
                        <tr key={inv.id} className="border-b border-[#E3D9CD]/50 hover:bg-[#EEE6DC]/50 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-[#8E5E34] font-medium">{inv.invoice_number || inv.id.slice(0, 8)}</td>
                          <td className="px-5 py-3.5 text-[#1C1C1C]">{inv.client?.name || 'N/A'}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                          <td className="px-5 py-3.5 text-right text-[#1C1C1C] font-medium">{formatCurrency(amt)}</td>
                          <td className="px-5 py-3.5 text-[#7A746C]">{inv.due_date ? formatDate(inv.due_date) : 'N/A'}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {inv.status === 'draft' && <button onClick={() => handleStatusChange(inv.id, 'sent')} className="p-1.5 rounded-lg text-[#B07A45]/50 hover:bg-[#B07A45]/5" title="Mark Sent"><Send size={14} /></button>}
                              {(inv.status === 'sent' || inv.status === 'overdue') && <button onClick={() => handleStatusChange(inv.id, 'paid')} className="p-1.5 rounded-lg text-[#B07A45]/50 hover:bg-[#B07A45]/5" title="Record Payment"><CheckCircle2 size={14} /></button>}
                              <button onClick={() => handlePrint(inv)} className="p-1.5 rounded-lg text-[#7A746C] hover:text-[#8E5E34] hover:bg-[#8E5E34]/10" title="Print/PDF"><Printer size={14} /></button>
                              <button onClick={() => { setEditingInvoice(inv); setShowForm(true); }} className="p-1.5 rounded-lg text-[#7A746C] hover:text-[#8E5E34] hover:bg-[#8E5E34]/10"><Edit3 size={14} /></button>
                              <button onClick={() => handleDelete(inv.id)} disabled={deleting === inv.id} className="p-1.5 rounded-lg text-[#7A746C] hover:text-[#B0614A]/50 hover:bg-[#B0614A]/5">
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

function InvoiceFormModal({ invoice, clients, projects, onClose, onSave }: { invoice: Invoice | null; clients: Client[]; projects: Project[]; onClose: () => void; onSave: (data: Partial<Invoice>) => void }) {
  const [form, setForm] = useState({
    invoice_number: invoice?.invoice_number || '',
    client_id: invoice?.client_id || '',
    project_id: invoice?.project_id || '',
    total: invoice?.total || invoice?.amount || 0,
    status: invoice?.status || 'draft',
    due_date: invoice?.due_date || '',
    paid_at: invoice?.paid_at || invoice?.paid_date || '',
    notes: invoice?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!form.total) return; setSaving(true);
    onSave({ invoice_number: form.invoice_number || undefined, client_id: form.client_id || undefined, project_id: form.project_id || undefined, total: form.total, status: form.status, due_date: form.due_date || undefined, paid_at: form.paid_at || undefined, notes: form.notes || undefined });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1C1C1C]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#E3D9CD] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1C1C1C]">{invoice ? 'Edit Invoice' : 'New Invoice'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-[#7A746C] mb-1.5">Invoice Number</label><input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} placeholder="INV-1001" className={inputCls} /></div>
            <div><label className="block text-xs text-[#7A746C] mb-1.5">Amount ($) *</label><input type="number" min={0} step={0.01} value={form.total || ''} onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))} className={inputCls} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-[#7A746C] mb-1.5">Client</label><select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} className={inputCls}><option value="">Select...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-xs text-[#7A746C] mb-1.5">Project</label><select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} className={inputCls}><option value="">Select...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
          <div><label className="block text-xs text-[#7A746C] mb-1.5">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['draft','sent','paid','overdue','cancelled'] as const).map(s => {
                const cfg = statusConfig[s];
                return <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s, ...(s === 'paid' && !f.paid_at ? { paid_at: new Date().toISOString().split('T')[0] } : {}) }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'bg-[#EEE6DC] text-[#7A746C] border-[#E3D9CD]'}`}>{cfg.label}</button>;
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-[#7A746C] mb-1.5">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} /></div>
            <div><label className="block text-xs text-[#7A746C] mb-1.5">Paid Date</label><input type="date" value={form.paid_at} onChange={e => setForm(f => ({ ...f, paid_at: e.target.value }))} className={inputCls} /></div>
          </div>
          <div><label className="block text-xs text-[#7A746C] mb-1.5">Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className={inputCls + ' resize-none'} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#EEE6DC] text-[#7A746C] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.total} className="flex-1 px-4 py-3 rounded-xl bg-[#8E5E34] text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : invoice ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}