'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, FileText, DollarSign, Clock, AlertTriangle,
  CheckCircle2, Send, Eye, Printer, ArrowLeft, Save, Trash2,
  Filter, ChevronDown, Edit3, CreditCard, Receipt, TrendingUp,
  Calendar, Hash, MoreHorizontal, Download, BadgeDollarSign,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  note: string;
}

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  status: InvoiceStatus;
  items: LineItem[];
  payments: Payment[];
  notes: string;
  createdAt: string;
  dueDate: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'vantix_invoices';

function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveInvoices(invoices: Invoice[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {
    // storage full or unavailable
  }
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function nextInvoiceNumber(invoices: Invoice[]): string {
  const nums = invoices
    .map((i) => parseInt(i.number.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1001;
  return `INV-${next}`;
}

function invoiceTotal(inv: Invoice): number {
  return inv.items.reduce((s, i) => s + i.quantity * i.rate, 0);
}

function invoicePaid(inv: Invoice): number {
  return inv.payments.reduce((s, p) => s + p.amount, 0);
}

function invoiceBalance(inv: Invoice): number {
  return invoiceTotal(inv) - invoicePaid(inv);
}

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
};

// ─── Components ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const c = statusConfig[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color} ${c.bg}`}>
      <Icon size={12} />
      {c.label}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type View = 'list' | 'create' | 'detail';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setInvoices(loadInvoices());
  }, []);

  const persist = useCallback((next: Invoice[]) => {
    setInvoices(next);
    saveInvoices(next);
  }, []);

  // Auto-mark overdue
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let changed = false;
    const updated = invoices.map((inv) => {
      if (inv.status === 'sent' && inv.dueDate < today) {
        changed = true;
        return { ...inv, status: 'overdue' as InvoiceStatus };
      }
      return inv;
    });
    if (changed) persist(updated);
  }, [invoices, persist]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          inv.clientName.toLowerCase().includes(q) ||
          inv.number.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    let outstanding = 0;
    let paid = 0;
    let overdueCount = 0;
    invoices.forEach((inv) => {
      const total = invoiceTotal(inv);
      const paidAmt = invoicePaid(inv);
      if (inv.status === 'paid') {
        paid += total;
      } else {
        outstanding += total - paidAmt;
        if (inv.status === 'overdue') overdueCount++;
      }
    });
    return { outstanding, paid, overdueCount, total: invoices.length };
  }, [invoices]);

  const selected = selectedId ? invoices.find((i) => i.id === selectedId) ?? null : null;

  function openDetail(id: string) {
    setSelectedId(id);
    setView('detail');
  }

  function deleteInvoice(id: string) {
    persist(invoices.filter((i) => i.id !== id));
    setView('list');
    setSelectedId(null);
  }

  function updateInvoice(updated: Invoice) {
    persist(invoices.map((i) => (i.id === updated.id ? updated : i)));
  }

  function createInvoice(inv: Invoice) {
    persist([inv, ...invoices]);
    setSelectedId(inv.id);
    setView('detail');
  }

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
        <div className="flex items-center gap-3">
          {view !== 'list' && (
            <button
              onClick={() => { setView('list'); setSelectedId(null); }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {view === 'list' ? 'Invoices' : view === 'create' ? 'New Invoice' : `Invoice ${selected?.number ?? ''}`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {view === 'list' ? 'Manage invoices and track payments' : view === 'create' ? 'Create a new invoice' : 'Invoice details and payment history'}
            </p>
          </div>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Plus size={16} />
            New Invoice
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4"
            >
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

      {/* Views */}
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InvoiceList
              invoices={filtered}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              onSelect={openDetail}
              onDelete={deleteInvoice}
            />
          </motion.div>
        )}
        {view === 'create' && (
          <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CreateInvoiceForm
              existingInvoices={invoices}
              onCreate={createInvoice}
              onCancel={() => setView('list')}
            />
          </motion.div>
        )}
        {view === 'detail' && selected && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InvoiceDetail
              invoice={selected}
              onUpdate={updateInvoice}
              onDelete={() => deleteInvoice(selected.id)}
              onBack={() => { setView('list'); setSelectedId(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Invoice List ────────────────────────────────────────────────────────────

interface InvoiceListProps {
  invoices: Invoice[];
  search: string;
  setSearch: (s: string) => void;
  statusFilter: InvoiceStatus | 'all';
  setStatusFilter: (s: InvoiceStatus | 'all') => void;
  filterOpen: boolean;
  setFilterOpen: (b: boolean) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function InvoiceList({ invoices, search, setSearch, statusFilter, setStatusFilter, filterOpen, setFilterOpen, onSelect, onDelete }: InvoiceListProps) {
  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or invoice number..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Filter size={14} />
            {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter].label}
            <ChevronDown size={14} />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
              {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                    statusFilter === s ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  {s === 'all' ? 'All Status' : statusConfig[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {invoices.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Receipt size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No invoices found</p>
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
                  <th className="text-right px-5 py-3 font-medium">Balance</th>
                  <th className="text-left px-5 py-3 font-medium">Due Date</th>
                  <th className="text-right px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onSelect(inv.id)}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-emerald-400 font-medium">{inv.number}</td>
                    <td className="px-5 py-3.5 text-white">{inv.clientName}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-3.5 text-right text-white font-medium">{formatCurrency(invoiceTotal(inv))}</td>
                    <td className="px-5 py-3.5 text-right text-gray-400">{formatCurrency(invoiceBalance(inv))}</td>
                    <td className="px-5 py-3.5 text-gray-400">{formatDate(inv.dueDate)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(inv.id); }}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Create Invoice Form ─────────────────────────────────────────────────────

interface CreateFormProps {
  existingInvoices: Invoice[];
  onCreate: (inv: Invoice) => void;
  onCancel: () => void;
}

function CreateInvoiceForm({ existingInvoices, onCreate, onCancel }: CreateFormProps) {
  const [clientName, setClientName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: genId(), description: '', quantity: 1, rate: 0 },
  ]);

  function addItem() {
    setItems([...items, { id: genId(), description: '', quantity: 1, rate: 0 }]);
  }

  function removeItem(id: string) {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  }

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  const total = items.reduce((s, i) => s + i.quantity * i.rate, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !dueDate) return;
    const inv: Invoice = {
      id: genId(),
      number: nextInvoiceNumber(existingInvoices),
      clientName: clientName.trim(),
      status: 'draft',
      items: items.filter((i) => i.description.trim()),
      payments: [],
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      dueDate,
    };
    onCreate(inv);
  }

  const inputCls = 'w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Invoice Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Client Name</label>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Acme Corp" className={inputCls} required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} required />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Payment terms, additional details..." className={inputCls} />
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Items / Services</h2>
          <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
              <div className="col-span-12 md:col-span-5">
                {idx === 0 && <label className="block text-xs text-gray-500 mb-1.5">Description</label>}
                <input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Service or product"
                  className={inputCls}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                {idx === 0 && <label className="block text-xs text-gray-500 mb-1.5">Qty</label>}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  className={inputCls}
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                {idx === 0 && <label className="block text-xs text-gray-500 mb-1.5">Rate ($)</label>}
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.rate || ''}
                  onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 md:col-span-2 flex items-end gap-2">
                {idx === 0 && <label className="block text-xs text-gray-500 mb-1.5 invisible">X</label>}
                <div className="flex items-center gap-2 py-2.5">
                  <span className="text-sm text-gray-400 font-medium">{formatCurrency(item.quantity * item.rate)}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-white/[0.06]">
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-white">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Save size={16} /> Create Invoice
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-medium text-sm transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Invoice Detail ──────────────────────────────────────────────────────────

interface DetailProps {
  invoice: Invoice;
  onUpdate: (inv: Invoice) => void;
  onDelete: () => void;
  onBack: () => void;
}

function InvoiceDetail({ invoice, onUpdate, onDelete, onBack }: DetailProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [payNote, setPayNote] = useState('');

  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);

  function changeStatus(status: InvoiceStatus) {
    onUpdate({ ...invoice, status });
  }

  function addPayment(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) return;
    const payment: Payment = {
      id: genId(),
      amount,
      date: new Date().toISOString(),
      method: payMethod.trim() || 'Other',
      note: payNote.trim(),
    };
    const newPayments = [...invoice.payments, payment];
    const newPaid = newPayments.reduce((s, p) => s + p.amount, 0);
    const newStatus = newPaid >= total ? 'paid' : invoice.status;
    onUpdate({ ...invoice, payments: newPayments, status: newStatus });
    setPayAmount('');
    setPayMethod('');
    setPayNote('');
    setShowPaymentForm(false);
  }

  function removePayment(id: string) {
    const newPayments = invoice.payments.filter((p) => p.id !== id);
    const newPaid = newPayments.reduce((s, p) => s + p.amount, 0);
    const newStatus = invoice.status === 'paid' && newPaid < total ? 'sent' : invoice.status;
    onUpdate({ ...invoice, payments: newPayments, status: newStatus });
  }

  function handlePrint() {
    window.print();
  }

  const inputCls = 'w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50';

  return (
    <div className="max-w-4xl space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        {invoice.status === 'draft' && (
          <button onClick={() => changeStatus('sent')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-medium transition-colors">
            <Send size={14} /> Mark as Sent
          </button>
        )}
        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
          <button onClick={() => changeStatus('paid')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-medium transition-colors">
            <CheckCircle2 size={14} /> Mark as Paid
          </button>
        )}
        <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
          <CreditCard size={14} /> Record Payment
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
          <Printer size={14} /> Print / PDF
        </button>
        <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-colors ml-auto">
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {/* Payment Form */}
      <AnimatePresence>
        {showPaymentForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addPayment}
            className="rounded-2xl bg-white/[0.03] border border-emerald-500/20 p-5 space-y-4 overflow-hidden"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BadgeDollarSign size={16} className="text-emerald-400" /> Record Payment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount ($)</label>
                <input type="number" min={0.01} step={0.01} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder={balance.toFixed(2)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Method</label>
                <input value={payMethod} onChange={(e) => setPayMethod(e.target.value)} placeholder="Bank transfer, Check, etc." className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Note</label>
                <input value={payNote} onChange={(e) => setPayNote(e.target.value)} placeholder="Optional note" className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors">
                Save Payment
              </button>
              <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Invoice Card */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-6 print:bg-white print:text-black print:border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Invoice</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 print:text-emerald-600">{invoice.number}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={invoice.status} />
            <p className="text-xs text-gray-500 mt-2">Created {formatDate(invoice.createdAt)}</p>
          </div>
        </div>

        {/* Client & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-white/[0.06] print:border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Bill To</p>
            <p className="text-white font-medium print:text-black">{invoice.clientName}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs text-gray-500 mb-1">Due Date</p>
            <p className="text-white font-medium print:text-black">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/[0.06] print:border-gray-200">
              <th className="text-left pb-2 font-medium">Description</th>
              <th className="text-right pb-2 font-medium">Qty</th>
              <th className="text-right pb-2 font-medium">Rate</th>
              <th className="text-right pb-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-white/[0.03] print:border-gray-100">
                <td className="py-3 text-white print:text-black">{item.description}</td>
                <td className="py-3 text-right text-gray-400 print:text-gray-600">{item.quantity}</td>
                <td className="py-3 text-right text-gray-400 print:text-gray-600">{formatCurrency(item.rate)}</td>
                <td className="py-3 text-right text-white font-medium print:text-black">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white print:text-black font-medium">{formatCurrency(total)}</span>
            </div>
            {paid > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paid</span>
                <span className="text-emerald-400">-{formatCurrency(paid)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t border-white/[0.06] print:border-gray-200">
              <span className="text-white print:text-black font-semibold">Balance Due</span>
              <span className="text-white print:text-black font-bold text-lg">{formatCurrency(balance)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="pt-4 border-t border-white/[0.06] print:border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-400 print:text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Payment History */}
      {invoice.payments.length > 0 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-4 print:hidden">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CreditCard size={16} className="text-emerald-400" /> Payment History
          </h3>
          <div className="space-y-2">
            {invoice.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{formatCurrency(p.amount)}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.date)} -- {p.method}{p.note ? ` -- ${p.note}` : ''}</p>
                  </div>
                </div>
                <button onClick={() => removePayment(p.id)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
