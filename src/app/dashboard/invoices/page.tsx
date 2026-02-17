'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, FileText, DollarSign, Clock, AlertTriangle,
  CheckCircle2, Send, Eye, Printer, ArrowLeft, Save, Trash2,
  Filter, ChevronDown, Edit3, CreditCard, Receipt, TrendingUp,
  Calendar, Hash, MoreHorizontal, Download, BadgeDollarSign, Loader2,
} from 'lucide-react';
import { getInvoices, createInvoice, updateInvoice, getClients, getProjects } from '@/lib/supabase';
import type { Invoice, InvoiceStatus, Client, Project } from '@/lib/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'text-gray-400', bg: 'bg-gray-500/10', icon: FileText },
  sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Send },
  paid: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-500/10', icon: X },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const c = statusConfig[status];
  if (!c) return null;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color} ${c.bg}`}>
      <Icon size={12} />
      {c.label}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [iRes, cRes, pRes] = await Promise.all([
        getInvoices({ status: statusFilter !== 'all' ? statusFilter : undefined }),
        getClients(),
        getProjects(),
      ]);
      if (iRes.data) setInvoices(iRes.data);
      if (cRes.data) setClients(cRes.data);
      if (pRes.data) setProjects(pRes.data);
    } catch (err) { console.error('Failed to load invoices:', err); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  // Auto-mark overdue
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    invoices.forEach(async (inv) => {
      if (inv.status === 'sent' && inv.due_date && inv.due_date < today) {
        try { await updateInvoice(inv.id, { status: 'overdue' }); } catch {}
      }
    });
  }, [invoices]);

  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(inv =>
      inv.client?.name?.toLowerCase().includes(q) ||
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.notes?.toLowerCase().includes(q)
    );
  }, [invoices, search]);

  const stats = useMemo(() => {
    let outstanding = 0;
    let paid = 0;
    let overdueCount = 0;
    invoices.forEach((inv) => {
      if (inv.status === 'paid') {
        paid += inv.amount;
      } else if (inv.status === 'sent' || inv.status === 'overdue') {
        outstanding += inv.amount;
        if (inv.status === 'overdue') overdueCount++;
      }
    });
    return { outstanding, paid, overdueCount, total: invoices.length };
  }, [invoices]);

  const handleSaveInvoice = async (data: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        const { error } = await updateInvoice(editingInvoice.id, data);
        if (error) throw error;
      } else {
        const { error } = await createInvoice(data);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingInvoice(null);
      await loadData();
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id: string, status: InvoiceStatus) => {
    try {
      const updates: Partial<Invoice> = { status };
      if (status === 'paid') updates.paid_date = new Date().toISOString().split('T')[0];
      await updateInvoice(id, updates);
      await loadData();
    } catch (err) { console.error(err); }
  };

  // ─── Stats Bar ─────────────────────────────────────────────────────────────

  const statCards = [
    { label: 'Total Outstanding', value: formatCurrency(stats.outstanding), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Paid', value: formatCurrency(stats.paid), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Overdue', value: String(stats.overdueCount), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'All Invoices', value: String(stats.total), icon: Receipt, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {selectedInvoice ? `Invoice ${selectedInvoice.invoice_number || ''}` : 'Invoices'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {selectedInvoice ? 'Invoice details' : 'Manage invoices and track payments'}
          </p>
        </div>
        {!selectedInvoice && (
          <button onClick={() => { setEditingInvoice(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-colors">
            <Plus size={16} /> New Invoice
          </button>
        )}
        {selectedInvoice && (
          <button onClick={() => setSelectedInvoice(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-colors">
            <ArrowLeft size={16} /> Back to List
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : selectedInvoice ? (
        /* Invoice Detail */
        <InvoiceDetail invoice={selectedInvoice} onStatusChange={handleStatusChange} onEdit={() => { setEditingInvoice(selectedInvoice); setShowForm(true); }} />
      ) : (
        /* Invoice List */
        <>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client or invoice number..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={14} /></button>}
            </div>
            <div className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-gray-400 hover:text-white transition-colors">
                <Filter size={14} />
                {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter]?.label || statusFilter}
                <ChevronDown size={14} />
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                  {(['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const).map((s) => (
                    <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${statusFilter === s ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {s === 'all' ? 'All Status' : statusConfig[s]?.label || s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Receipt size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{search || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}</p>
              {!search && statusFilter === 'all' && (
                <button onClick={() => { setEditingInvoice(null); setShowForm(true); }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  <Plus size={14} /> Create Your First Invoice
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-gray-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Invoice</th>
                      <th className="text-left px-5 py-3 font-medium">Client</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="text-right px-5 py-3 font-medium">Amount</th>
                      <th className="text-left px-5 py-3 font-medium">Due Date</th>
                      <th className="text-right px-5 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inv) => (
                      <tr key={inv.id} onClick={() => setSelectedInvoice(inv)}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors">
                        <td className="px-5 py-3.5 font-mono text-emerald-400 font-medium">{inv.invoice_number || inv.id.slice(0, 8)}</td>
                        <td className="px-5 py-3.5 text-white">{inv.client?.name || 'N/A'}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                        <td className="px-5 py-3.5 text-right text-white font-medium">{formatCurrency(inv.amount)}</td>
                        <td className="px-5 py-3.5 text-gray-400">{inv.due_date ? formatDate(inv.due_date) : 'N/A'}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button onClick={(e) => { e.stopPropagation(); setEditingInvoice(inv); setShowForm(true); }}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-colors">
                            <Edit3 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <InvoiceFormModal
            invoice={editingInvoice}
            clients={clients}
            projects={projects}
            onClose={() => { setShowForm(false); setEditingInvoice(null); }}
            onSave={handleSaveInvoice}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Invoice Detail ──────────────────────────────────────────────────────────

function InvoiceDetail({ invoice, onStatusChange, onEdit }: {
  invoice: Invoice;
  onStatusChange: (id: string, status: InvoiceStatus) => Promise<void>;
  onEdit: () => void;
}) {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        {invoice.status === 'draft' && (
          <button onClick={() => onStatusChange(invoice.id, 'sent')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-medium transition-colors">
            <Send size={14} /> Mark as Sent
          </button>
        )}
        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
          <button onClick={() => onStatusChange(invoice.id, 'paid')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-medium transition-colors">
            <CheckCircle2 size={14} /> Mark as Paid
          </button>
        )}
        <button onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
          <Edit3 size={14} /> Edit
        </button>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
          <Printer size={14} /> Print / PDF
        </button>
      </div>

      {/* Invoice Card */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-6 print:bg-white print:text-black print:border-gray-200">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Invoice</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 print:text-emerald-600">{invoice.invoice_number || invoice.id.slice(0, 8)}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={invoice.status} />
            <p className="text-xs text-gray-500 mt-2">Created {formatDate(invoice.created_at)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-white/[0.06] print:border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Client</p>
            <p className="text-white font-medium print:text-black">{invoice.client?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Project</p>
            <p className="text-white font-medium print:text-black">{invoice.project?.name || 'N/A'}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs text-gray-500 mb-1">Due Date</p>
            <p className="text-white font-medium print:text-black">{invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-3xl font-bold text-white print:text-black">{formatCurrency(invoice.amount)}</p>
          </div>
          {invoice.paid_date && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Paid On</p>
              <p className="text-emerald-400 font-medium">{formatDate(invoice.paid_date)}</p>
            </div>
          )}
        </div>

        {invoice.notes && (
          <div className="pt-4 border-t border-white/[0.06] print:border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-400 print:text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Invoice Form Modal ──────────────────────────────────────────────────────

function InvoiceFormModal({ invoice, clients, projects, onClose, onSave }: {
  invoice: Invoice | null;
  clients: Client[];
  projects: Project[];
  onClose: () => void;
  onSave: (data: Partial<Invoice>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    invoice_number: invoice?.invoice_number || '',
    client_id: invoice?.client_id || '',
    project_id: invoice?.project_id || '',
    amount: invoice?.amount || 0,
    status: invoice?.status || 'draft' as InvoiceStatus,
    issue_date: invoice?.issue_date || new Date().toISOString().split('T')[0],
    due_date: invoice?.due_date || '',
    paid_date: invoice?.paid_date || '',
    notes: invoice?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;
    setSaving(true);
    try {
      await onSave({
        invoice_number: form.invoice_number || undefined,
        client_id: form.client_id || undefined,
        project_id: form.project_id || undefined,
        amount: form.amount,
        status: form.status,
        issue_date: form.issue_date,
        due_date: form.due_date || undefined,
        paid_date: form.paid_date || undefined,
        notes: form.notes || undefined,
      });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{invoice ? 'Edit Invoice' : 'New Invoice'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Invoice Number</label>
              <input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} placeholder="INV-1001" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Amount ($) *</label>
              <input type="number" min={0} step={0.01} value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Client</label>
              <select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} className={inputCls}>
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Project</label>
              <select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} className={inputCls}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['draft', 'sent', 'paid', 'overdue', 'cancelled'] as InvoiceStatus[]).map(s => {
                const cfg = statusConfig[s];
                return (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s, ...(s === 'paid' && !f.paid_date ? { paid_date: new Date().toISOString().split('T')[0] } : {}) }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.status === s ? `${cfg.bg} ${cfg.color} border-white/20` : 'bg-white/5 text-gray-500 border-white/10'}`}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Issue Date</label>
              <input type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Due Date</label>
              <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Paid Date</label>
              <input type="date" value={form.paid_date} onChange={e => setForm(f => ({ ...f, paid_date: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Payment terms, details..." className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.amount}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : invoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
