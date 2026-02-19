'use client';

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, Target, ArrowUpRight, ArrowDownRight, Plus, X } from 'lucide-react';
import { getData } from '@/lib/data';

interface Payment {
  id: string;
  amount: number;
  client: string;
  date: string;
  status: string;
}

interface Invoice {
  id: string;
  amount?: number;
  total?: number;
  client?: string | { name?: string };
  status: string;
  paid_date?: string;
  paid_at?: string;
  created_at?: string;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function RevenuePage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, i] = await Promise.all([
          getData<Payment>('payments'),
          getData<Invoice>('invoices'),
        ]);
        setPayments(p || []);
        setInvoices(i || []);
      } catch {
        setPayments([]);
        setInvoices([]);
      }
      setLoading(false);
    })();
  }, []);

  // Completed payments = actual revenue received
  const completedPayments = useMemo(() => payments.filter(p => p.status === 'completed'), [payments]);
  const totalRevenue = useMemo(() => completedPayments.reduce((s, p) => s + (p.amount || 0), 0), [completedPayments]);

  // Outstanding = unpaid invoices
  const outstandingInvoices = useMemo(() => invoices.filter(i => i.status === 'sent' || i.status === 'overdue' || i.status === 'draft'), [invoices]);
  const outstandingAmount = useMemo(() => outstandingInvoices.reduce((s, i) => s + (i.total || i.amount || 0), 0), [outstandingInvoices]);

  // Average deal size from completed payments
  const avgDealSize = useMemo(() => completedPayments.length > 0 ? Math.round(totalRevenue / completedPayments.length) : 0, [completedPayments, totalRevenue]);

  // Monthly revenue from payments (last 12 months)
  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const months: { month: string; amount: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amt = completedPayments
        .filter(p => (p.date || '').startsWith(prefix))
        .reduce((s, p) => s + (p.amount || 0), 0);
      months.push({ month: MONTHS[d.getMonth()], amount: amt });
    }
    return months;
  }, [completedPayments]);

  // Revenue by client from payments
  const revenueByClient = useMemo(() => {
    const byClient: Record<string, number> = {};
    completedPayments.forEach(p => {
      const name = p.client || 'Unknown';
      byClient[name] = (byClient[name] || 0) + (p.amount || 0);
    });
    return Object.entries(byClient).sort((a, b) => b[1] - a[1]).map(([client, amount]) => ({ client, amount }));
  }, [completedPayments]);

  if (loading) return <div className="min-h-screen bg-[#F4EFE8]" />;

  const maxMonthly = monthlyRevenue.length > 0 ? Math.max(...monthlyRevenue.map(m => m.amount), 1) : 1;
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
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">From {completedPayments.length} payment{completedPayments.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Outstanding</span>
              <Target className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${outstandingAmount.toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">{outstandingInvoices.length} unpaid invoice{outstandingInvoices.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Avg Payment</span>
              <TrendingUp className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${avgDealSize.toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">Per payment</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Pipeline</span>
              <ArrowUpRight className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${(totalRevenue + outstandingAmount).toLocaleString()}</div>
            <div className="text-xs mt-1 text-[#7A746C]">Revenue + outstanding</div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-6">Monthly Revenue (from Payments)</h2>
          {monthlyRevenue.every(m => m.amount === 0) ? (
            <div className="h-56 flex items-center justify-center text-[#7A746C] text-sm">No payment data yet</div>
          ) : (
            <div className="flex items-end gap-3 h-56">
              {monthlyRevenue.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-[#7A746C] font-medium">${m.amount > 0 ? (m.amount / 1000).toFixed(1) + 'k' : '0'}</span>
                  <div
                    className="w-full bg-gradient-to-t from-[#B07A45] to-[#C89A6A] rounded-t-lg transition-all hover:from-[#8E5E34] hover:to-[#B07A45]"
                    style={{ height: `${(m.amount / maxMonthly) * 100}%`, minHeight: m.amount > 0 ? 8 : 2 }}
                  />
                  <span className="text-xs text-[#7A746C]">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Client */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-5">Revenue by Client (Payments Received)</h2>
            {revenueByClient.length === 0 ? (
              <p className="text-sm text-[#7A746C]">No payments recorded yet</p>
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
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-5">Outstanding Invoices</h2>
            {outstandingInvoices.length === 0 ? (
              <p className="text-sm text-[#7A746C]">All invoices paid</p>
            ) : (
              <div className="space-y-3">
                {outstandingInvoices.map((inv, i) => {
                  const clientName = typeof inv.client === 'object' ? inv.client?.name || 'Unknown' : inv.client || 'Unknown';
                  return (
                    <div key={i} className="flex items-center justify-between bg-[#F4EFE8] rounded-xl px-4 py-3 border border-[#E3D9CD]">
                      <div>
                        <p className="text-sm font-medium text-[#1C1C1C]">{clientName}</p>
                        <p className="text-xs text-[#7A746C] capitalize">{inv.status}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#1C1C1C]">${(inv.total || inv.amount || 0).toLocaleString()}</span>
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
