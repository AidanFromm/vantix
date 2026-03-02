'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus, DollarSign, AlertTriangle, CheckCircle, Clock,
  Trash2, Send, Download, Edit2, Share2, FileText, ChevronDown, Phone, Copy
} from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';

interface LineItem {
  description: string;
  qty: number;
  rate: number;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  phone: string;
  items: LineItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  notes: string;
  sentAt?: string;
  paidAt?: string;
}

const statusStyle: Record<string, string> = {
  draft: 'bg-[#E3D9CD] text-[#7A746C]',
  sent: 'bg-[#C89A6A]/20 text-[#B07A45]',
  paid: 'bg-[#8E5E34]/20 text-[#8E5E34]',
  overdue: 'bg-[#B07A45]/20 text-[#B07A45]',
};

const STATS_CARDS = [
  { label: 'Outstanding', key: 'outstanding', icon: Clock, color: 'text-[#B07A45]' },
  { label: 'Overdue', key: 'overdue', icon: AlertTriangle, color: 'text-[#B07A45]' },
  { label: 'Paid', key: 'paid', icon: CheckCircle, color: 'text-[#8E5E34]' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Invoice['status'] | string>('all');
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsInvoice, setSmsInvoice] = useState<Invoice | null>(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [smsPhone, setSmsPhone] = useState('');

  // Form state for create/edit
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ description: '', qty: 1, rate: 0 }]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getData<Invoice>('invoices');
        setInvoices(data);
      } catch { setInvoices([]); }
    })();
  }, []);

  const filteredInvoices = useMemo(() => {
    if (filterStatus === 'all') {
      return invoices;
    }
    return invoices.filter(inv => inv.status === filterStatus);
  }, [invoices, filterStatus]);

  const stats = useMemo(() => {
    const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'draft').reduce((s, i) => s + i.total, 0);
    const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
    const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    return { outstanding, overdue, paid };
  }, [invoices]);

  const fmt = useCallback((n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 }), []);
  const calcTotal = (li: LineItem[]) => li.reduce((s, i) => s + i.qty * i.rate, 0);

  const openCreate = () => {
    setEditing(null);
    setClient('');
    setPhone('');
    setItems([{ description: '', qty: 1, rate: 0 }]);
    setDueDate('');
    setNotes('');
    setModalOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setClient(inv.client);
    setPhone(inv.phone);
    setItems([...inv.items]);
    setDueDate(inv.dueDate);
    setNotes(inv.notes);
    setModalOpen(true);
  };

  const saveInvoice = async () => {
    const total = calcTotal(items);
    if (editing) {
      try {
        await updateRecord('invoices', editing.id, { client, phone, items, total, dueDate, notes });
      } catch { /* handle error */ }
      setInvoices(prev => prev.map(i => i.id === editing.id ? { ...i, client, phone, items, total, dueDate, notes } : i));
    } else {
      const num = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
      const rec = { number: num, client, phone, items, total, status: 'draft' as const, dueDate, createdAt: new Date().toISOString().slice(0, 10), notes };
      try {
        const created = await createRecord<Invoice>('invoices', rec);
        setInvoices(prev => [created, ...prev]);
      } catch {
        const inv: Invoice = { id: crypto.randomUUID(), ...rec };
        setInvoices(prev => [inv, ...prev]);
      }
    }
    setModalOpen(false);
  };

  const markPaid = async (id: string) => {
    try {
      await updateRecord('invoices', id, { status: 'paid', paidAt: new Date().toISOString() });
    } catch { /* handle error */ }
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' as const, paidAt: new Date().toISOString() } : i));
  };

  const deleteInv = async (id: string) => {
    try {
      await deleteRecord('invoices', id);
    } catch { /* handle error */ }
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (idx: number, field: keyof LineItem, val: string | number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };

  const copyShareLink = (id: string) => {
    const link = `https://usevantix.com/invoice/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Invoice link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link:', err));
  };

  const openSmsModal = (inv: Invoice) => {
    setSmsInvoice(inv);
    setSmsPhone(inv.phone || '');
    setSmsMessage(`Invoice ${inv.number} from Vantix - ${fmt(inv.total)}. View: https://usevantix.com/invoice/${inv.id}`);
    setSmsModalOpen(true);
  };

  const sendSms = async () => {
    if (!smsInvoice || !smsPhone) return;

    try {
      const response = await fetch('/api/invoices/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: smsInvoice.id,
          phone: smsPhone,
          message: smsMessage,
          invoiceNumber: smsInvoice.number,
          invoiceTotal: smsInvoice.total,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('SMS sent successfully!');
        setInvoices(prev => prev.map(i => i.id === smsInvoice.id ? { ...i, status: 'sent' as const, sentAt: new Date().toISOString() } : i));
        setSmsModalOpen(false);
        setSmsInvoice(null);
        setSmsMessage('');
        setSmsPhone('');
      } else {
        alert(`Failed to send SMS: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS due to a network error.');
    }
  };


  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] p-4 pb-20 font-sans md:p-10 md:pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-4 sm:mb-0">Invoices</h1>
      </div>

      {/* Stats Summary - Horizontal scroll on mobile */}
      <div className="overflow-x-auto no-scrollbar mb-6">
        <div className="flex gap-4 min-w-max">
          {STATS_CARDS.map(s => (
            <div key={s.label} className="bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm rounded-xl p-4 w-[160px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <s.icon size={16} className={s.color} />
                <span className="text-xs text-[#7A746C] uppercase tracking-wide">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-[#1C1C1C]">{fmt(stats[s.key as keyof typeof stats])}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter by Status */}
      <div className="flex justify-center gap-2 mb-6">
        {[ 'all', 'draft', 'sent', 'paid', 'overdue' ].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
              ${filterStatus === status ? 'bg-[#B07A45] text-white' : 'bg-[#EEE6DC] text-[#4B4B4B] hover:bg-[#E3D9CD]'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Invoice Cards */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 && (
          <p className="text-center text-[#7A746C] p-8 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-sm">No invoices found for this status.</p>
        )}
        {filteredInvoices.map(inv => (
          <div key={inv.id} className="bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm rounded-xl overflow-hidden">
            {/* Collapsed Card Header */}
            <div
              className="flex justify-between items-center p-4 cursor-pointer big-tap-target"
              onClick={() => setExpandedCard(expandedCard === inv.id ? null : inv.id)}
            >
              <div>
                <p className="text-sm text-[#7A746C]">{inv.client}</p>
                <p className="font-bold text-lg text-[#1C1C1C]">{inv.number} - {fmt(inv.total)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[inv.status]}`}>
                  {inv.status}
                </span>
                <ChevronDown size={18} className={`text-[#7A746C] transition-transform ${expandedCard === inv.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded Card Content */}
            {expandedCard === inv.id && (
              <div className="border-t border-[#E3D9CD] p-4">
                <div className="mb-4">
                  <p className="text-xs uppercase text-[#7A746C] mb-1">Due Date:</p>
                  <p className="font-medium text-[#1C1C1C]">{new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>

                <p className="text-xs uppercase text-[#7A746C] mb-2">Line Items:</p>
                <div className="space-y-2 mb-4">
                  {inv.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between text-sm text-[#4B4B4B]">
                      <span>{item.description} ({item.qty} x {fmt(item.rate)})</span>
                      <span>{fmt(item.qty * item.rate)}</span>
                    </div>
                  ))}
                </div>

                <p className="font-bold text-base text-[#1C1C1C] text-right mb-4">Total: {fmt(inv.total)}</p>

                {inv.notes && (
                  <div className="mb-4">
                    <p className="text-xs uppercase text-[#7A746C] mb-1">Notes:</p>
                    <p className="text-sm text-[#4B4B4B] whitespace-pre-wrap">{inv.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E3D9CD]">
                  {inv.status !== 'paid' && (
                    <button onClick={() => markPaid(inv.id)} title="Mark as Paid"
                      className="flex-1 min-w-[120px] justify-center flex items-center gap-2 px-4 py-2 bg-[#C89A6A]/20 text-[#8E5E34] rounded-xl text-sm font-medium hover:bg-[#C89A6A]/40 transition big-tap-target">
                      <CheckCircle size={16} /> Mark Paid
                    </button>
                  )}
                  <button onClick={() => openSmsModal(inv)} title="Send via SMS"
                    className="flex-1 min-w-[120px] justify-center flex items-center gap-2 px-4 py-2 bg-[#C89A6A]/20 text-[#B07A45] rounded-xl text-sm font-medium hover:bg-[#C89A6A]/40 transition big-tap-target">
                    <Send size={16} /> Send SMS
                  </button>
                  <button onClick={() => copyShareLink(inv.id)} title="View/Share Link"
                    className="flex-1 min-w-[120px] justify-center flex items-center gap-2 px-4 py-2 bg-[#C89A6A]/20 text-[#B07A45] rounded-xl text-sm font-medium hover:bg-[#C89A6A]/40 transition big-tap-target">
                    <Share2 size={16} /> Share Link
                  </button>
                  <button onClick={() => openEdit(inv)} title="Edit"
                    className="flex-1 min-w-[120px] justify-center flex items-center gap-2 px-4 py-2 bg-[#C89A6A]/20 text-[#4B4B4B] rounded-xl text-sm font-medium hover:bg-[#C89A6A]/40 transition big-tap-target">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => deleteInv(inv.id)} title="Delete"
                    className="flex-1 min-w-[120px] justify-center flex items-center gap-2 px-4 py-2 bg-[#E3D9CD] text-red-500 rounded-xl text-sm font-medium hover:bg-[#D6D2CD] transition big-tap-target">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Action Button for Create Invoice */}
      <button onClick={openCreate}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-[#B07A45] text-white shadow-lg z-40 big-tap-target hover:bg-[#8E5E34] transition-colors md:hidden">
        <Plus size={24} />
      </button>

      {/* Desktop Create Invoice Button */}
      <button onClick={openCreate}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow hover:opacity-90 transition fixed top-6 right-6 z-40">
          <Plus size={16} /> Create Invoice
        </button>

      {/* Create/Edit Invoice Modal (Full-screen on mobile) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center p-0 md:p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-t-2xl md:rounded-2xl w-full max-h-[95vh] overflow-y-auto p-6 transition-all duration-300 ease-out transform translate-y-0 md:max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1C1C]">{editing ? 'Edit Invoice' : 'Create Invoice'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C] big-tap-target">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <label htmlFor="clientName" className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Client Name</label>
            <input
              id="clientName"
              type="text"
              placeholder="Client Name"
              value={client}
              onChange={e => setClient(e.target.value)}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] mb-4 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target"
            />

            <label htmlFor="clientPhone" className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Client Phone</label>
            <input
              id="clientPhone"
              type="tel"
              placeholder="(123) 456-7890"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] mb-4 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target"
            />

            <label className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Line Items</label>
            <div className="space-y-3 mb-3">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input placeholder="Description" value={it.description} onChange={e => updateItem(idx, 'description', e.target.value)}
                    className="flex-1 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target" />
                  <input type="number" placeholder="Qty" value={it.qty} onChange={e => updateItem(idx, 'qty', +e.target.value)}
                    className="w-16 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-2 py-2.5 text-sm text-[#1C1C1C] text-center focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target" />
                  <input type="number" placeholder="Rate" value={it.rate || ''} onChange={e => updateItem(idx, 'rate', +e.target.value)}
                    className="w-24 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-2 py-2.5 text-sm text-[#1C1C1C] text-right focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target" />
                  {items.length > 1 && (
                    <button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:text-red-700 big-tap-target"><Trash2 size={20} /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setItems(prev => [...prev, { description: '', qty: 1, rate: 0 }])}
              className="text-sm text-[#B07A45] font-medium mb-4 hover:underline big-tap-target">+ Add line item</button>

            <div className="text-right mb-4 text-base font-bold text-[#1C1C1C]">Total: {fmt(calcTotal(items))}</div>

            <label htmlFor="dueDate" className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Due Date</label>
            <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] mb-4 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target" />

            <label htmlFor="notes" className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Notes</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] mb-6 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 resize-none big-tap-target" />

            <button onClick={saveInvoice}
              className="w-full py-3 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-base font-medium shadow hover:opacity-90 transition big-tap-target">
              {editing ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {smsModalOpen && smsInvoice && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center p-0 md:p-4" onClick={() => setSmsModalOpen(false)}>
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-t-2xl md:rounded-2xl w-full max-h-[95vh] overflow-y-auto p-6 transition-all duration-300 ease-out transform translate-y-0 md:max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1C1C]">Send SMS for Invoice {smsInvoice.number}</h2>
              <button onClick={() => setSmsModalOpen(false)} className="p-2 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C] big-tap-target">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <label htmlFor="smsPhone" className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Recipient Phone</label>
            <input
              id="smsPhone"
              type="tel"
              placeholder="(123) 456-7890"
              value={smsPhone}
              onChange={e => setSmsPhone(e.target.value)}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] mb-4 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 big-tap-target"
            />

            <label htmlFor="smsMessage" className="block text-xs text-[#7A746C] uppercase tracking-wide mb-1">Message</label>
            <textarea
              id="smsMessage"
              value={smsMessage}
              onChange={e => setSmsMessage(e.target.value)}
              rows={4}
              className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] mb-6 focus:outline-none focus:ring-2 focus:ring-[#B07A45]/40 resize-none big-tap-target"
            />

            <button onClick={sendSms}
              className="w-full py-3 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-base font-medium shadow hover:opacity-90 transition big-tap-target">
              Send SMS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const NoInvoicesYet = () => (
  <div className="text-center py-10 text-[#7A746C]">
    <FileText size={48} className="mx-auto mb-4" />
    <p className="text-lg font-medium">No invoices found.</p>
    <p className="text-sm">Tap the '+' button to create your first invoice.</p>
  </div>
);
