'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, DollarSign, Users, Target,
  Calendar, Filter, Briefcase, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

interface Invoice { id: string; status: string; total?: number; amount?: number; paid_at?: string; paid_date?: string; due_date?: string; created_at: string; client_id?: string; project_id?: string; }
interface Lead { id: string; status: string; estimated_value?: number; created_at: string; }
interface Project { id: string; name: string; status: string; budget?: number; spent?: number; }
interface Expense { id: string; category?: string; amount: number; description?: string; date?: string; created_at: string; }

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}

function formatCurrency(n: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n); }

function BarChartSVG({ data, color = '#8E5E34' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = 36;
  const gap = 12;
  const chartH = 120;
  const chartW = data.length * (barW + gap) + gap;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line key={i} x1={0} x2={chartW} y1={chartH * (1 - pct)} y2={chartH * (1 - pct)} stroke="#E3D9CD" strokeWidth="0.5" />
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * (chartH - 10);
        const x = gap + i * (barW + gap);
        return (
          <g key={i}>
            <rect x={x} y={chartH - h} width={barW} height={h} rx={4} fill={color} fillOpacity={0.75} />
            <rect x={x} y={chartH - h} width={barW} height={h} rx={4} fill={color} fillOpacity={0.15} />
            {d.value > 0 && (
              <text x={x + barW / 2} y={chartH - h - 6} textAnchor="middle" className="fill-[#1C1C1C]" fontSize="9" fontWeight="600">
                ${(d.value / 1000).toFixed(d.value >= 1000 ? 1 : 0)}{d.value >= 1000 ? 'k' : ''}
              </text>
            )}
            <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" className="fill-[#7A746C]" fontSize="10">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function HorizontalBars({ data, maxWidth = 300 }: { data: { label: string; value: number; color: string }[]; maxWidth?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#7A746C]">{d.label}</span>
            <span className="text-xs font-semibold text-[#1C1C1C]">{formatCurrency(d.value)}</span>
          </div>
          <div className="h-5 bg-[#EEE6DC] rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max((d.value / max) * 100, d.value > 0 ? 8 : 0)}%` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="h-full rounded-lg"
              style={{ backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'ytd' | '3m' | '6m' | '12m'>('ytd');

  const loadData = useCallback(() => {
    try {
      setInvoices(lsGet<Invoice>('vantix_invoices'));
      setLeads(lsGet<Lead>('vantix_leads'));
      setProjects(lsGet<Project>('vantix_projects'));
      setExpenses(lsGet<Expense>('vantix_expenses'));
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const rangeStart = useMemo(() => {
    const now = new Date();
    switch (dateRange) {
      case 'ytd': return new Date(now.getFullYear(), 0, 1);
      case '3m': return new Date(now.getFullYear(), now.getMonth() - 3, 1);
      case '6m': return new Date(now.getFullYear(), now.getMonth() - 6, 1);
      case '12m': return new Date(now.getFullYear(), now.getMonth() - 12, 1);
    }
  }, [dateRange]);

  const filteredInvoices = useMemo(() => invoices.filter(i => new Date(i.paid_at || i.paid_date || i.created_at) >= rangeStart), [invoices, rangeStart]);

  // Revenue by month
  const revenueByMonth = useMemo(() => {
    const months: { label: string; value: number }[] = [];
    const now = new Date();
    const numMonths = dateRange === '3m' ? 3 : dateRange === '6m' ? 6 : dateRange === '12m' ? 12 : now.getMonth() + 1;
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear(); const month = d.getMonth();
      const total = invoices
        .filter(inv => {
          if (inv.status !== 'paid') return false;
          const pd = new Date(inv.paid_at || inv.paid_date || inv.created_at);
          return pd.getFullYear() === year && pd.getMonth() === month;
        })
        .reduce((s, inv) => s + (inv.total || inv.amount || 0), 0);
      months.push({ label, value: total });
    }
    return months;
  }, [invoices, dateRange]);

  // Expense breakdown by category
  const expenseBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.filter(e => new Date(e.date || e.created_at) >= rangeStart).forEach(e => {
      const cat = e.category || 'Other';
      cats[cat] = (cats[cat] || 0) + (e.amount || 0);
    });
    const colors = ['#8E5E34', '#B07A45', '#B07A45', '#B07A45', '#B07A45', '#8E5E34', '#B07A45'];
    return Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
  }, [expenses, rangeStart]);

  // Project profitability
  const projectProfit = useMemo(() => {
    return projects.filter(p => p.budget).map(p => {
      const revenue = invoices.filter(i => i.project_id === p.id && i.status === 'paid').reduce((s, i) => s + (i.total || i.amount || 0), 0);
      const spent = p.spent || 0;
      return { name: p.name, budget: p.budget || 0, revenue, spent, profit: revenue - spent };
    }).sort((a, b) => b.profit - a.profit);
  }, [projects, invoices]);

  // Lead conversion
  const leadConversion = useMemo(() => {
    const total = leads.length || 1;
    const won = leads.filter(l => l.status === 'won').length;
    const lost = leads.filter(l => l.status === 'lost').length;
    const active = leads.filter(l => !['won', 'lost'].includes(l.status)).length;
    return { total: leads.length, won, lost, active, rate: Math.round((won / total) * 100) };
  }, [leads]);

  // Top metrics
  const totalRevenue = useMemo(() => filteredInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || i.amount || 0), 0), [filteredInvoices]);
  const totalExpenses = useMemo(() => expenses.filter(e => new Date(e.date || e.created_at) >= rangeStart).reduce((s, e) => s + (e.amount || 0), 0), [expenses, rangeStart]);
  const netProfit = totalRevenue - totalExpenses;
  const avgDealSize = useMemo(() => {
    const won = leads.filter(l => l.status === 'won');
    return won.length ? won.reduce((s, l) => s + (l.estimated_value || 0), 0) / won.length : 0;
  }, [leads]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[#E3D9CD] rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[#E3D9CD]/50 rounded-2xl" />)}</div>
    </div>
  );

  const metrics = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10', trend: totalRevenue > 0 },
    { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: TrendingUp, color: 'text-[#B0614A]/50', bg: 'bg-[#B0614A]/5', border: 'border-[#B0614A]/10', trend: false },
    { label: 'Net Profit', value: formatCurrency(netProfit), icon: BarChart3, color: netProfit >= 0 ? 'text-[#8E5E34]' : 'text-[#B0614A]/50', bg: 'bg-[#8E5E34]/10', border: 'border-[#8E5E34]/20', trend: netProfit >= 0 },
    { label: 'Conversion Rate', value: `${leadConversion.rate}%`, icon: Target, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10', trend: leadConversion.rate > 20 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#8E5E34]/10"><BarChart3 size={22} className="text-[#8E5E34]" /></div>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Reports</h1>
            <p className="text-sm text-[#7A746C]">Analytics and business insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#7A746C]" />
          <div className="flex bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-1">
            {(['ytd', '3m', '6m', '12m'] as const).map(r => (
              <button key={r} onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateRange === r ? 'bg-[#8E5E34]/10 text-[#8E5E34]' : 'text-[#7A746C] hover:text-[#1C1C1C]'}`}>
                {r === 'ytd' ? 'YTD' : r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-[#EEE6DC] border ${m.border} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#7A746C] uppercase tracking-wide">{m.label}</span>
              <div className={`p-2 rounded-xl ${m.bg}`}><m.icon size={16} className={m.color} /></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#1C1C1C]">{m.value}</span>
              {m.trend ? <ArrowUpRight size={16} className="text-[#B07A45]/50 mb-1" /> : <ArrowDownRight size={16} className="text-[#B0614A] mb-1" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue by Month + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E3D9CD] flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#8E5E34]/10"><BarChart3 size={14} className="text-[#8E5E34]" /></div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Revenue by Month</h3>
          </div>
          <div className="p-4">
            {revenueByMonth.some(m => m.value > 0) ? (
              <BarChartSVG data={revenueByMonth} />
            ) : (
              <div className="text-center py-6 text-sm text-[#7A746C]">No revenue data for this period</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E3D9CD] flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#B07A45]/5"><DollarSign size={14} className="text-[#8E5E34]" /></div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Expense Breakdown</h3>
          </div>
          <div className="p-4">
            {expenseBreakdown.length > 0 ? (
              <HorizontalBars data={expenseBreakdown} />
            ) : (
              <div className="text-center py-6 text-sm text-[#7A746C]">No expense data</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Project Profitability + Lead Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E3D9CD] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B07A45]/5"><Briefcase size={16} className="text-[#8E5E34]" /></div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Project Profitability</h3>
          </div>
          <div className="p-5">
            {projectProfit.length > 0 ? (
              <div className="space-y-3">
                {projectProfit.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD]">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1C1C] truncate">{p.name}</p>
                      <p className="text-xs text-[#7A746C]">Budget: {formatCurrency(p.budget)} | Spent: {formatCurrency(p.spent)}</p>
                    </div>
                    <div className={`text-sm font-bold ${p.profit >= 0 ? 'text-[#8E5E34]' : 'text-[#B0614A]/50'}`}>
                      {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-[#7A746C]">No project data with budgets</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E3D9CD] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B07A45]/5"><Users size={16} className="text-[#8E5E34]" /></div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Lead Conversion</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Total Leads', value: leadConversion.total, color: 'text-[#8E5E34]' },
                { label: 'Won', value: leadConversion.won, color: 'text-[#8E5E34]' },
                { label: 'Lost', value: leadConversion.lost, color: 'text-[#B0614A]/50' },
                { label: 'Active', value: leadConversion.active, color: 'text-[#8E5E34]' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-center">
                  <p className="text-xs text-[#7A746C]">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Conversion funnel visual */}
            <div className="space-y-2">
              {[
                { label: 'Won', pct: leadConversion.total ? (leadConversion.won / leadConversion.total) * 100 : 0, color: '#B07A45' },
                { label: 'Active', pct: leadConversion.total ? (leadConversion.active / leadConversion.total) * 100 : 0, color: '#8E5E34' },
                { label: 'Lost', pct: leadConversion.total ? (leadConversion.lost / leadConversion.total) * 100 : 0, color: '#8E5E34' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-[#7A746C] w-12 text-right">{s.label}</span>
                  <div className="flex-1 h-5 bg-[#EEE6DC] rounded-lg overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(s.pct, s.pct > 0 ? 8 : 0)}%` }} transition={{ duration: 0.6 }}
                      className="h-full rounded-lg flex items-center px-2" style={{ backgroundColor: s.color }}>
                      {s.pct > 10 && <span className="text-[10px] font-bold text-white">{Math.round(s.pct)}%</span>}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#8E5E34]/5 border border-[#8E5E34]/20 text-center">
              <p className="text-xs text-[#7A746C]">Avg Deal Size</p>
              <p className="text-lg font-bold text-[#8E5E34]">{formatCurrency(avgDealSize)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}