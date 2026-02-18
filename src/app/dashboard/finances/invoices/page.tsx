'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Plus, DollarSign, AlertTriangle, CheckCircle, Clock,
  Trash2, Send, Download, Edit2, X, ChevronDown
} from 'lucide-react';

interface LineItem {
  description: string;
  qty: number;
  rate: number;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  items: LineItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  notes: string;
}

const STORAGE_KEY = 'vantix_invoices';

const SEED: Invoice[] = [];

const CLIENTS = ['SecuredTampa', 'JFK Maintenance', 'Vantix Internal'];

function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
}

function saveInvoices(inv: Invoice[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inv)); } catch {}
}

const statusStyle: Record<string, string> = {
  draft: 'bg-[#D6D2CD] text-[#4B4B4B]',
  sent: 'bg-[#B07A45]/20 text-[#8E5E34]',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-600',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);

  // form state
  const [client, setClient] = useState(CLIENTS[0]);
  const [items, setItems] = useState<LineItem[]>([{ description: '', qty: 1, rate: 0 }]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { setInvoices(loadInvoices()); }, []);
  useEffect(() => { if (invoices.length) saveInvoices(invoices); }, [invoices]);

  const stats = useMemo(() => {
    const outstanding = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0);
    const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
    const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    const avg = invoices.length ? invoices.reduce((s, i) => s + i.total, 0) / invoices.length : 0;
    return { outstanding, overdue, paid, avg };
  }, [invoices]);

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
  const calcTotal = (li: LineItem[]) => li.reduce((s, i) => s + i.qty * i.rate, 0);

  function openCreate() {
    setEditing(null); setClient(CLIENTS[0]); setItems([{ description: '', qty: 1, rate: 0 }]);
    setDueDate(''); setNotes(''); setModalOpen(true);
  }

  function openEdit(inv: Invoice) {
    setEditing(inv); setClient(inv.client); setItems([...inv.items]);
    setDueDate(inv.dueDate); setNotes(inv.notes); setModalOpen(true);
  }

  function save() {
    const total = calcTotal(items);
    if (editing) {
      setInvoices(prev => prev.map(i => i.id === editing.id ? { ...i, client, items, total, dueDate, notes } : i));
    } else {
      const num = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
      const inv: Invoice = {
        id: crypto.randomUUID(), number: num, client, items, total,
        status: 'draft', dueDate, createdAt: new Date().toISOString().slice(0, 10), notes,
      };
      setInvoices(prev => [...prev, inv]);
    }
    setModalOpen(false);
  }

  function markPaid(id: string) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' as const } : i));
  }

  function deleteInv(id: string) {
    setInvoices(prev => prev.filter(i => i.id !== id));
  }

  function updateItem(idx: number, field: keyof LineItem, val: string | number) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Invoices</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow hover:opacity-90 transition">
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Outstanding', value: fmt(stats.outstanding), icon: Clock, color: 'text-[#B07A45]' },
          { label: 'Overdue', value: fmt(stats.overdue), icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Paid This Month', value: fmt(stats.paid), icon: CheckCircle, color: 'text-green-600' },
          { label: 'Average Invoice', value: fmt(Math.round(stats.avg)), icon: DollarSign, color: 'text-[#8E5E34]' },
        ].map(s => (
          <div key={s.label} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color} />
              <span className="text-xs text-[#7A746C] uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-[#1C1C1C]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3D9CD] text-[#7A746C] text-xs uppercase tracking-wide">
                <th className="text-left p-4">Invoice #</th>
                <th className="text-left p-4">Client</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Due Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-[#E3D9CD] last:border-0 hover:bg-[#E3D9CD]/40 transition">
                  <td className="p-4 font-medium text-[#1C1C1C]">{inv.number}</td>
                  <td className="p-4 text-[#4B4B4B]">{inv.client}</td>
                  <td className="p-4 text-right font-semibold text-[#1C1C1C]">{fmt(inv.total)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#4B4B4B]">{inv.dueDate}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {inv.status !== 'paid' && (
                        <button onClick={() => markPaid(inv.id)} title="Mark as Paid"
                          className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition"><CheckCircle size={16} /></button>
                      )}
                      <button title="Send Reminder" className="p-1.5 rounded-lg hover:bg-[#B07A45]/10 text-[#B07A45] transition"><Send size={16} /></button>
                      <button title="Download PDF" className="p-1.5 rounded-lg hover:bg-[#B07A45]/10 text-[#8E5E34] transition"><Download size={16} /></button>
                      <button onClick={() => openEdit(inv)} title="Edit" className="p-1.5 rounded-lg hover:bg-[#B07A45]/10 text-[#4B4B4B] transition"><Edit2 size={16} /></button>
                      <button onClick={() => deleteInv(inv.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!invoices.length && (
                <tr><td colSpan={6} className="p-8 text-center text-[#7A746C]">No invoices yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1C1C1C]">{editing ? 'Edit Invoice' : 'Create Invoice'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><X size={18} /></button>
            </div>

            <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Client</label>
            <div className="relative mb-4">
              <select value={client} onChange={e => setClient(e.target.value)}
                className="w-full appearance-none bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40">
                {CLIENTS.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-[#7A746C] pointer-events-none" />
            </div>

            <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Line Items</label>
            <div className="space-y-2 mb-2">
              {items.map((it, idx) => (
                <div key={idx} className="flex gap-2">
                  <input placeholder="Description" value={it.description} onChange={e => updateItem(idx, 'description', e.target.value)}
                    className="flex-1 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
                  <input type="number" placeholder="Qty" value={it.qty} onChange={e => updateItem(idx, 'qty', +e.target.value)}
                    className="w-16 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-3 py-2 text-sm text-[#1C1C1C] text-center focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
                  <input type="number" placeholder="Rate" value={it.rate || ''} onChange={e => updateItem(idx, 'rate', +e.target.value)}
                    className="w-24 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-3 py-2 text-sm text-[#1C1C1C] text-right focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />
                  {items.length > 1 && (
                    <button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setItems(prev => [...prev, { description: '', qty: 1, rate: 0 }])}
              className="text-xs text-[#B07A45] font-medium mb-4 hover:underline">+ Add line item</button>

            <div className="text-right mb-4 text-sm font-bold text-[#1C1C1C]">Total: {fmt(calcTotal(items))}</div>

            <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] mb-4 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40" />

            <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] mb-6 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 resize-none" />

            <button onClick={save}
              className="w-full py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow hover:opacity-90 transition">
              {editing ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
