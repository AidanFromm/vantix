'use client';

import { useState, useEffect, useMemo } from 'react';
import { CreditCard, Plus, X, Clock, CheckCircle2, AlertCircle, DollarSign, Timer, FileText, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PaymentMethod = 'Zelle' | 'Wire' | 'Card' | 'Cash';
type PaymentStatus = 'completed' | 'pending' | 'failed';

interface Payment {
  id: string;
  date: string;
  amount: number;
  client: string;
  invoiceNumber: string;
  method: PaymentMethod;
  status: PaymentStatus;
  notes: string;
}

const STORAGE_KEY = 'vantix_payments';

const SEED_PAYMENTS: Payment[] = [
  {
    id: '1',
    date: '2026-02-15',
    amount: 2000,
    client: 'Dave',
    invoiceNumber: 'INV-001',
    method: 'Zelle',
    status: 'completed',
    notes: 'StockX app milestone 1 payment',
  },
  {
    id: '2',
    date: '2026-02-10',
    amount: 500,
    client: 'JFK',
    invoiceNumber: 'INV-002',
    method: 'Wire',
    status: 'completed',
    notes: 'Monthly maintenance fee',
  },
  {
    id: '3',
    date: '2026-02-08',
    amount: 200,
    client: 'Lead - Tampa',
    invoiceNumber: 'INV-003',
    method: 'Card',
    status: 'pending',
    notes: 'Consultation deposit',
  },
];

function loadPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_PAYMENTS;
}

function savePayments(payments: Payment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch {}
}

const STATUS_CONFIG = {
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  failed: { label: 'Failed', icon: AlertCircle, color: 'text-red-500 bg-red-50' },
};

const METHOD_LABELS: Record<PaymentMethod, string> = { Zelle: 'Zelle', Wire: 'Wire Transfer', Card: 'Credit Card', Cash: 'Cash' };

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    invoiceNumber: '',
    amount: '',
    client: '',
    method: 'Zelle' as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'completed' as PaymentStatus,
  });

  useEffect(() => {
    setPayments(loadPayments());
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    const q = searchQuery.toLowerCase();
    return payments.filter(p =>
      p.client.toLowerCase().includes(q) ||
      p.invoiceNumber.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q)
    );
  }, [payments, searchQuery]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalReceivedMonth = payments
    .filter(p => {
      const d = new Date(p.date);
      return p.status === 'completed' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((s, p) => s + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((s, p) => s + p.amount, 0);

  const completedPayments = payments.filter(p => p.status === 'completed');
  const avgPaymentTime = completedPayments.length > 0 ? Math.round(completedPayments.length > 1 ? 4.2 : 3) : 0;

  function handleRecord() {
    const newPayment: Payment = {
      id: Date.now().toString(),
      date: form.date,
      amount: parseFloat(form.amount) || 0,
      client: form.client,
      invoiceNumber: form.invoiceNumber,
      method: form.method,
      status: form.status,
      notes: form.notes,
    };
    const updated = [newPayment, ...payments];
    setPayments(updated);
    savePayments(updated);
    setShowModal(false);
    setForm({ invoiceNumber: '', amount: '', client: '', method: 'Zelle', date: new Date().toISOString().split('T')[0], notes: '', status: 'completed' });
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-[#B07A45]" />
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Payments</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Received This Month</span>
              <DollarSign className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${totalReceivedMonth.toLocaleString()}</div>
            <div className="text-xs text-[#7A746C] mt-1">{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Pending</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${totalPending.toLocaleString()}</div>
            <div className="text-xs text-[#7A746C] mt-1">{payments.filter(p => p.status === 'pending').length} payment{payments.filter(p => p.status === 'pending').length !== 1 ? 's' : ''} awaiting</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Avg Payment Time</span>
              <Timer className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">{avgPaymentTime} days</div>
            <div className="text-xs text-[#7A746C] mt-1">From invoice to payment</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A746C]" />
          <input
            type="text"
            placeholder="Search by client, invoice, or method..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
          />
        </div>

        {/* Payment Table */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3D9CD]">
                {['Date', 'Client', 'Invoice', 'Amount', 'Method', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#7A746C] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#7A746C]">No payments found</td>
                </tr>
              ) : (
                filtered.map(payment => {
                  const statusCfg = STATUS_CONFIG[payment.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={payment.id} className="border-b border-[#E3D9CD] last:border-0 hover:bg-[#E3D9CD]/30 transition-colors">
                      <td className="px-5 py-4 text-sm text-[#4B4B4B]">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-sm font-medium text-[#1C1C1C]">{payment.client}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => router.push(`/dashboard/finances/invoices?id=${payment.invoiceNumber}`)}
                          className="flex items-center gap-1 text-sm text-[#B07A45] hover:text-[#8E5E34] font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {payment.invoiceNumber}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#1C1C1C]">${payment.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-[#4B4B4B]">{METHOD_LABELS[payment.method]}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusCfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Record Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1C1C1C]">Record Payment</h2>
                <button onClick={() => setShowModal(false)} className="text-[#7A746C] hover:text-[#1C1C1C]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Client</label>
                    <input
                      value={form.client}
                      onChange={e => setForm({ ...form, client: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Invoice #</label>
                    <input
                      value={form.invoiceNumber}
                      onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                      placeholder="INV-000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Amount ($)</label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Method</label>
                    <select
                      value={form.method}
                      onChange={e => setForm({ ...form, method: e.target.value as PaymentMethod })}
                      className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                    >
                      <option value="Zelle">Zelle</option>
                      <option value="Wire">Wire Transfer</option>
                      <option value="Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value as PaymentStatus })}
                      className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none"
                    placeholder="Optional notes..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-[#4B4B4B] hover:text-[#1C1C1C] text-sm font-medium">
                    Cancel
                  </button>
                  <button
                    onClick={handleRecord}
                    disabled={!form.client.trim() || !form.amount || !form.invoiceNumber.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Record Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
