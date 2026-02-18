'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getInvoices } from '@/lib/supabase';

interface RevenueData {
  mrr: number;
  totalRevenue: number;
  avgDealSize: number;
  revenueGrowth: number;
  monthlyRevenue: { month: string; amount: number }[];
  revenueByClient: { client: string; amount: number }[];
  revenueBySource: { source: string; amount: number; color: string }[];
  projections: { month: string; amount: number; confidence: number }[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: invoices } = await getInvoices();
        const paid = (invoices || []).filter((i: any) => i.status === 'paid');
        const totalRevenue = paid.reduce((s: number, i: any) => s + (i.amount || i.total || 0), 0);
        const avgDealSize = paid.length > 0 ? Math.round(totalRevenue / paid.length) : 0;

        // Monthly revenue (last 12 months)
        const now = new Date();
        const monthlyRevenue: { month: string; amount: number }[] = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const amt = paid.filter((inv: any) => (inv.paid_date || inv.paid_at || inv.created_at || '').startsWith(prefix)).reduce((s: number, inv: any) => s + (inv.amount || inv.total || 0), 0);
          monthlyRevenue.push({ month: MONTHS[d.getMonth()], amount: amt });
        }

        // Revenue by client
        const byClient: Record<string, number> = {};
        paid.forEach((inv: any) => {
          const name = inv.client?.name || 'Unknown';
          byClient[name] = (byClient[name] || 0) + (inv.amount || inv.total || 0);
        });
        const revenueByClient = Object.entries(byClient).sort((a, b) => b[1] - a[1]).map(([client, amount]) => ({ client, amount }));

        // Simple MRR estimate (last 3 months avg)
        const last3 = monthlyRevenue.slice(-3);
        const mrr = last3.length > 0 ? Math.round(last3.reduce((s, m) => s + m.amount, 0) / last3.length) : 0;

        setData({
          mrr,
          totalRevenue,
          avgDealSize,
          revenueGrowth: 0,
          monthlyRevenue,
          revenueByClient,
          revenueBySource: totalRevenue > 0 ? [{ source: 'Projects', amount: totalRevenue, color: '#B07A45' }] : [],
          projections: [],
        });
      } catch {
        setData({
          mrr: 0, totalRevenue: 0, avgDealSize: 0, revenueGrowth: 0,
          monthlyRevenue: [], revenueByClient: [], revenueBySource: [], projections: [],
        });
      }
    })();
  }, []);

  if (!data) return <div className="min-h-screen bg-[#F4EFE8]" />;

  const maxMonthly = Math.max(...data.monthlyRevenue.map(m => m.amount));
  const maxClient = Math.max(...data.revenueByClient.map(c => c.amount));
  const totalSource = data.revenueBySource.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-7 h-7 text-[#B07A45]" />
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Revenue</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Monthly Recurring', value: `$${data.mrr.toLocaleString()}`, icon: DollarSign, sub: 'MRR' },
            { label: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: TrendingUp, sub: 'All time' },
            { label: 'Avg Deal Size', value: `$${data.avgDealSize.toLocaleString()}`, icon: Target, sub: 'Per project' },
            { label: 'Revenue Growth', value: `${data.revenueGrowth}%`, icon: data.revenueGrowth >= 0 ? ArrowUpRight : ArrowDownRight, sub: 'vs last quarter', positive: data.revenueGrowth >= 0 },
          ].map((card, i) => (
            <div key={i} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#7A746C]">{card.label}</span>
                <card.icon className="w-5 h-5 text-[#B07A45]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1C1C]">{card.value}</div>
              <div className={`text-xs mt-1 ${(card as any).positive === false ? 'text-red-500' : 'text-[#7A746C]'}`}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-56">
            {data.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-[#7A746C] font-medium">${(m.amount / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-gradient-to-t from-[#B07A45] to-[#C89A6A] rounded-t-lg transition-all hover:from-[#8E5E34] hover:to-[#B07A45]"
                  style={{ height: `${(m.amount / maxMonthly) * 100}%`, minHeight: 8 }}
                />
                <span className="text-xs text-[#7A746C]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Revenue by Client */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-5">Revenue by Client</h2>
            <div className="space-y-4">
              {data.revenueByClient.map((c, i) => (
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
          </div>

          {/* Revenue by Source */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-5">Revenue by Source</h2>
            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    return data.revenueBySource.map((s, i) => {
                      const pct = (s.amount / totalSource) * 100;
                      const dashArray = `${pct} ${100 - pct}`;
                      const el = (
                        <circle
                          key={i}
                          cx="18" cy="18" r="14"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="5"
                          strokeDasharray={dashArray}
                          strokeDashoffset={-offset}
                          className="transition-all"
                        />
                      );
                      offset += pct;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#1C1C1C]">${(totalSource / 1000).toFixed(0)}k</span>
                  <span className="text-xs text-[#7A746C]">Total</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {data.revenueBySource.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-[#4B4B4B]">{s.source}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#1C1C1C]">${s.amount.toLocaleString()}</span>
                    <span className="text-xs text-[#7A746C] ml-2">{((s.amount / totalSource) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-[#B07A45]" />
            <h2 className="text-lg font-semibold text-[#1C1C1C]">3-Month Forecast</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {data.projections.map((p, i) => (
              <div key={i} className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl p-5">
                <div className="text-sm text-[#7A746C] mb-1">{p.month}</div>
                <div className="text-2xl font-bold text-[#1C1C1C] mb-3">${p.amount.toLocaleString()}</div>
                <div className="w-full h-2 bg-[#E3D9CD] rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${p.confidence}%`,
                      background: p.confidence > 75 ? '#B07A45' : p.confidence > 60 ? '#C89A6A' : '#E3D9CD',
                    }}
                  />
                </div>
                <div className="text-xs text-[#7A746C]">{p.confidence}% confidence</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
