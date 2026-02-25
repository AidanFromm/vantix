'use client';

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, BarChart3, Target, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

interface InvoiceRow {
  id: string;
  client_id: string;
  total: number;
  amount_paid: number;
  status: string;
  created_at: string;
  client_name?: string;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function RevenuePage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch invoices
        const { data: invData } = await supabase.from('invoices').select('*');
        // Fetch clients for name lookup
        const { data: clientData } = await supabase.from('clients').select('id, company_name');
        
        const clientMap: Record<string, string> = {};
        (clientData || []).forEach((c: { id: string; company_name: string }) => {
          clientMap[c.id] = c.company_name;
        });

        const merged = (invData || []).map((inv: InvoiceRow) => ({
          ...inv,
          client_name: clientMap[inv.client_id] || 'Unknown',
        }));

        setInvoices(merged);
      } catch {
        setInvoices([]);
      }
      setLoading(false);
    })();
  }, []);

  // Total Revenue = sum of amount_paid across all invoices
  const totalRevenue = useMemo(() => invoices.reduce((s, i) => s + (i.amount_paid || 0), 0), [invoices]);

  // Outstanding = sum of (total - amount_paid) for unpaid invoices
  const outstandingInvoices = useMemo(() => invoices.filter(i => i.status !== 'paid'), [invoices]);
  const outstandingAmount = useMemo(() => outstandingInvoices.reduce((s, i) => s + ((i.total || 0) - (i.amount_paid || 0)), 0), [outstandingInvoices]);

  // Avg payment per invoice
  const paidInvoices = useMemo(() => invoices.filter(i => (i.amount_paid || 0) > 0), [invoices]);
  const avgPayment = useMemo(() => paidInvoices.length > 0 ? Math.round(totalRevenue / paidInvoices.length) : 0, [paidInvoices, totalRevenue]);

  // Revenue by client
  const revenueByClient = useMemo(() => {
    const byClient: Record<string, number> = {};
    invoices.forEach(i => {
      const name = i.client_name || 'Unknown';
      byClient[name] = (byClient[name] || 0) + (i.amount_paid || 0);
    });
    return Object.entries(byClient).filter(([, amt]) => amt > 0).sort((a, b) => b[1] - a[1]).map(([client, amount]) => ({ client, amount }));
  }, [invoices]);

  if (loading) return <div className="min-h-screen bg-[#F4EFE8]" />;

  const maxClient = revenueByClient.length > 0 ? Math.max(...revenueByClient.map(c => c.amount), 1) : 1;

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-7 h-7 text-[#B07A45]" />
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Revenue</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">From {paidInvoices.length} invoice{paidInvoices.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Outstanding</span>
              <Target className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${outstandingAmount.toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">{outstandingInvoices.length} unpaid invoice{outstandingInvoices.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Avg Payment</span>
              <TrendingUp className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${avgPayment.toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">Per invoice</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Pipeline</span>
              <ArrowUpRight className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${(totalRevenue + outstandingAmount).toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">Revenue + outstanding</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Client */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-5">Revenue by Client</h2>
            {revenueByClient.length === 0 ? (
              <p className="text-sm text-[#7A746C]">No revenue recorded yet</p>
            ) : (
              <div className="space-y-4">
                {revenueByClient.map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#4B4B4B] font-medium">{c.client}</span>
                      <span className="text-[#1C1C1C] font-semibold">${c.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3 bg-[#E3D9CD] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B07A45] to-[#C89A6A] rounded-full transition-all"
                        style={{ width: `${(c.amount / maxClient) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outstanding Invoices */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-5">Outstanding Invoices</h2>
            {outstandingInvoices.length === 0 ? (
              <p className="text-sm text-[#7A746C]">All invoices paid</p>
            ) : (
              <div className="space-y-3">
                {outstandingInvoices.map((inv, i) => {
                  const remaining = (inv.total || 0) - (inv.amount_paid || 0);
                  return (
                    <div key={i} className="flex items-center justify-between bg-[#F4EFE8] rounded-xl px-4 py-3 border border-[#E3D9CD]">
                      <div>
                        <p className="text-sm font-medium text-[#1C1C1C]">{inv.client_name}</p>
                        <p className="text-xs text-[#7A746C] capitalize">{inv.status}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-[#1C1C1C]">${remaining.toLocaleString()} remaining</span>
                        <p className="text-xs text-[#7A746C]">of ${(inv.total || 0).toLocaleString()} total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
