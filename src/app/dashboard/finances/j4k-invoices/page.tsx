'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Payment {
  date: string;
  method: string;
  amount: number;
}

interface InvoiceItem {
  name: string;
  variant?: string;
  sizes?: string;
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  date: string;
  customer: string;
  items: InvoiceItem[];
  subtotal: number;
  payments: Payment[];
  totalPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
}

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  partial: { label: 'Partial', color: 'bg-orange-100 text-orange-800', icon: Clock },
  unpaid: { label: 'Unpaid', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[invoice.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left gap-3 active:bg-[#E6DED3] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#1C1C1C] text-base">{invoice.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${cfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
          <div className="text-sm text-[#7A746C] mt-1">{invoice.date} · {invoice.items.length} items</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-[#1C1C1C]">{formatMoney(invoice.subtotal)}</div>
          {invoice.balance > 0 && (
            <div className="text-xs text-red-600 font-medium">Owes {formatMoney(invoice.balance)}</div>
          )}
        </div>
        <div className="shrink-0 text-[#7A746C]">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#E3D9CD] p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-[#7A746C]">Subtotal:</span> <span className="font-medium">{formatMoney(invoice.subtotal)}</span></div>
            <div><span className="text-[#7A746C]">Paid:</span> <span className="font-medium text-green-700">{formatMoney(invoice.totalPaid)}</span></div>
            <div><span className="text-[#7A746C]">Balance:</span> <span className="font-medium text-red-600">{formatMoney(invoice.balance)}</span></div>
            <div><span className="text-[#7A746C]">Customer:</span> <span className="font-medium">{invoice.customer}</span></div>
          </div>

          {invoice.payments.length > 0 && (
            <div className="text-sm">
              <div className="text-[#7A746C] font-medium mb-1">Payments:</div>
              {invoice.payments.map((p, i) => (
                <div key={i} className="flex justify-between text-[#4B4B4B]">
                  <span>{p.date} ({p.method})</span>
                  <span className="text-green-700 font-medium">{formatMoney(p.amount)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm">
            <div className="text-[#7A746C] font-medium mb-2">Line Items:</div>
            <div className="space-y-2">
              {invoice.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start gap-2 py-1 border-b border-[#E3D9CD] last:border-0">
                  <div className="min-w-0">
                    <div className="font-medium text-[#1C1C1C] text-sm">{item.name}</div>
                    {(item.variant || item.sizes) && (
                      <div className="text-xs text-[#7A746C]">{item.variant || item.sizes}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0 text-sm">
                    <div className="text-[#1C1C1C]">{item.qty} × {formatMoney(item.price)}</div>
                    <div className="text-[#7A746C] text-xs">{formatMoney(item.qty * item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function J4KInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/jfk_invoices.json')
      .then(r => r.json())
      .then(data => { setInvoices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalInvoiced = invoices.reduce((s, i) => s + i.subtotal, 0);
  const totalCollected = invoices.reduce((s, i) => s + i.totalPaid, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.balance, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#7A746C]">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1C]">J4K Invoices</h1>
        <p className="text-sm text-[#7A746C] mt-1">Closeout invoice tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#7A746C] text-sm mb-1">
            <DollarSign className="w-4 h-4" /> Total Invoiced
          </div>
          <div className="text-xl font-bold text-[#1C1C1C]">{formatMoney(totalInvoiced)}</div>
        </div>
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" /> Collected
          </div>
          <div className="text-xl font-bold text-green-700">{formatMoney(totalCollected)}</div>
        </div>
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
            <AlertCircle className="w-4 h-4" /> Outstanding
          </div>
          <div className="text-xl font-bold text-red-600">{formatMoney(totalOutstanding)}</div>
        </div>
      </div>

      {/* Invoice Cards */}
      <div className="space-y-3">
        {invoices.map(inv => (
          <InvoiceCard key={inv.id} invoice={inv} />
        ))}
      </div>
    </div>
  );
}
