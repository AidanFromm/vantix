'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Calendar, Phone, Printer, Copy, CheckCircle } from 'lucide-react';

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

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
  sent: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Awaiting Payment' },
  paid: { bg: 'bg-green-50', text: 'text-green-700', label: 'Paid' },
  overdue: { bg: 'bg-red-50', text: 'text-red-600', label: 'Overdue' },
};

export default function PublicInvoicePage() {
  const params = useParams();
  const id = params?.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Try Supabase first, then localStorage
    (async () => {
      try {
        const { supabase } = await import('@/lib/supabase-client');
        const { data } = await supabase.from('invoices').select('*').eq('id', id).single();
        if (data) {
          setInvoice(data as Invoice);
          setLoading(false);
          return;
        }
      } catch {}
      // Fallback: localStorage
      try {
        const raw = localStorage.getItem('vantix_invoices');
        if (raw) {
          const all: Invoice[] = JSON.parse(raw);
          const found = all.find(i => i.id === id);
          if (found) { setInvoice(found); setLoading(false); return; }
        }
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  const copyZelle = () => {
    navigator.clipboard.writeText('usevantix@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4EFE8]">
        <div className="w-10 h-10 rounded-full border-2 border-[#B07A45]/30 border-t-[#B07A45] animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE8] px-6">
        <FileText size={48} className="text-[#B07A45] mb-4" />
        <h1 className="text-xl font-bold text-[#1C1C1C] mb-2">Invoice Not Found</h1>
        <p className="text-[#7A746C] text-sm text-center">This invoice may have been removed or the link is invalid.</p>
      </div>
    );
  }

  const st = statusStyle[invoice.status] || statusStyle.draft;

  return (
    <div className="min-h-screen bg-[#F4EFE8]">
      {/* Header */}
      <header className="bg-[#1C1C1C] text-white px-6 py-8">
        <div className="max-w-lg mx-auto">
          <p className="text-[#B07A45] text-sm font-medium tracking-widest uppercase mb-1">vantix.</p>
          <h1 className="text-2xl font-bold mb-1">Invoice {invoice.number}</h1>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
            {st.label}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        {/* Details */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#7A746C]">Client</span>
            <span className="font-medium text-[#1C1C1C]">{invoice.client}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#7A746C]">Date</span>
            <span className="text-[#4B4B4B]">{invoice.createdAt}</span>
          </div>
          {invoice.dueDate && (
            <div className="flex justify-between text-sm">
              <span className="text-[#7A746C]">Due Date</span>
              <span className="text-[#4B4B4B]">{invoice.dueDate}</span>
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E3D9CD]">
            <p className="text-xs text-[#7A746C] uppercase tracking-wide font-medium">Items</p>
          </div>
          <div className="divide-y divide-[#E3D9CD]">
            {(invoice.items || []).map((item, i) => (
              <div key={i} className="px-5 py-4 flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-[#1C1C1C]">{item.description}</p>
                  <p className="text-xs text-[#7A746C] mt-0.5">{item.qty} x {fmt(item.rate)}</p>
                </div>
                <p className="text-sm font-semibold text-[#1C1C1C]">{fmt(item.qty * item.rate)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t-2 border-[#B07A45]/30 flex justify-between items-center">
            <p className="text-sm font-bold text-[#1C1C1C]">Total</p>
            <p className="text-xl font-bold text-[#B07A45]">{fmt(invoice.total)}</p>
          </div>
        </div>

        {/* Payment Info */}
        {invoice.status !== 'paid' && (
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <p className="text-xs text-[#7A746C] uppercase tracking-wide font-medium mb-3">Payment Method</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1C1C1C]">Zelle</p>
                <p className="text-sm text-[#4B4B4B]">usevantix@gmail.com</p>
              </div>
              <button onClick={copyZelle}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#B07A45] text-white rounded-lg text-xs font-medium active:scale-95 transition">
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {invoice.status === 'paid' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-green-700">This invoice has been paid</p>
            {invoice.paidAt && <p className="text-xs text-green-600 mt-1">{new Date(invoice.paidAt).toLocaleDateString()}</p>}
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <p className="text-xs text-[#7A746C] uppercase tracking-wide font-medium mb-2">Notes</p>
            <p className="text-sm text-[#4B4B4B] whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Print */}
        <button onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#1C1C1C] text-white rounded-xl text-sm font-medium active:scale-[0.98] transition no-print">
          <Printer size={16} /> Print / Save PDF
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-[#A39B90] pb-4">
          Powered by <span className="text-[#B07A45] font-medium">vantix.</span>
        </p>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          header { background: #1C1C1C !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
