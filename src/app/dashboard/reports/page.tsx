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

function BarChartSVG({ data, color = '#6B3A1F' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = 36;
  const gap = 12;
  const chartH = 120;
  const chartW = data.length * (barW + gap) + gap;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line key={i} x1={0} x2={chartW} y1={chartH * (1 - pct)} y2={chartH * (1 - pct)} stroke="#E0CCBA" strokeWidth="0.5" />
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * (chartH - 10);
        const x = gap + i * (barW + gap);
        return (
          <g key={i}>
            <rect x={x} y={chartH - h} width={barW} height={h} rx={4} fill={color} fillOpacity={0.75} />
            <rect x={x} y={chartH - h} width={barW} height={h} rx={4} fill={color} fillOpacity={0.15} />
            {d.value > 0 && (
              <text x={x + barW / 2} y={chartH - h - 6} textAnchor="middle" className="fill-[#4A2112]" fontSize="9" fontWeight="600">
                ${(d.value / 1000).toFixed(d.value >= 1000 ? 1 : 0)}{d.value >= 1000 ? 'k' : ''}
              </text>
            )}
            <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" className="fill-[#8B6B56]" fontSize="10">{d.label}</text>
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
            <span className="text-xs text-[#8B6B56]">{d.label}</span>
            <span className="text-xs font-semibold text-[#4A2112]">{formatCurrency(d.value)}</span>
          </div>
          <div className="h-5 bg-[#E8D5C4] rounded-lg overflow-hidden">
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
    const colors = ['#6B3A1F', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
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
      <div className="h-8 w-48 bg-[#E0CCBA] rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[#E0CCBA]/50 rounded-2xl" />)}</div>
    </div>
  );

  const metrics = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: totalRevenue > 0 },
    { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', trend: false },
    { label: 'Net Profit', value: formatCurrency(netProfit), icon: BarChart3, color: netProfit >= 0 ? 'text-[#6B3A1F]' : 'text-red-500', bg: 'bg-[#6B3A1F]/10', border: 'border-[#6B3A1F]/20', trend: netProfit >= 0 },
    { label: 'Conversion Rate', value: `${leadConversion.rate}%`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', trend: leadConversion.rate > 20 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#6B3A1F]/10"><BarChart3 size={22} className="text-[#6B3A1F]" /></div>
          <div>
            <h1 className="text-2xl font-bold text-[#4A2112]">Reports</h1>
            <p className="text-sm text-[#8B6B56]">Analytics and business insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#8B6B56]" />
          <div className="flex bg-white border border-[#E0CCBA] rounded-xl p-1">
            {(['ytd', '3m', '6m', '12m'] as const).map(r => (
              <button key={r} onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateRange === r ? 'bg-[#6B3A1F]/10 text-[#6B3A1F]' : 'text-[#8B6B56] hover:text-[#4A2112]'}`}>
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
            className={`bg-white border ${m.border} rounded-2xl p-5 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#8B6B56] uppercase tracking-wide">{m.label}</span>
              <div className={`p-2 rounded-xl ${m.bg}`}><m.icon size={16} className={m.color} /></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#4A2112]">{m.value}</span>
              {m.trend ? <ArrowUpRight size={16} className="text-emerald-500 mb-1" /> : <ArrowDownRight size={16} className="text-red-400 mb-1" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue by Month + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white border border-[#E0CCBA] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E0CCBA] flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#6B3A1F]/10"><BarChart3 size={14} className="text-[#6B3A1F]" /></div>
            <h3 className="text-sm font-semibold text-[#4A2112]">Revenue by Month</h3>
          </div>
          <div className="p-4">
            {revenueByMonth.some(m => m.value > 0) ? (
              <BarChartSVG data={revenueByMonth} />
            ) : (
              <div className="text-center py-6 text-sm text-[#8B6B56]">No revenue data for this period</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white border border-[#E0CCBA] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E0CCBA] flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50"><DollarSign size={14} className="text-purple-600" /></div>
            <h3 className="text-sm font-semibold text-[#4A2112]">Expense Breakdown</h3>
          </div>
          <div className="p-4">
            {expenseBreakdown.length > 0 ? (
              <HorizontalBars data={expenseBreakdown} />
            ) : (
              <div className="text-center py-6 text-sm text-[#8B6B56]">No expense data</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Project Profitability + Lead Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white border border-[#E0CCBA] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E0CCBA] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50"><Briefcase size={16} className="text-blue-600" /></div>
            <h3 className="text-sm font-semibold text-[#4A2112]">Project Profitability</h3>
          </div>
          <div className="p-5">
            {projectProfit.length > 0 ? (
              <div className="space-y-3">
                {projectProfit.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F0DFD1] border border-[#E0CCBA]">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4A2112] truncate">{p.name}</p>
                      <p className="text-xs text-[#8B6B56]">Budget: {formatCurrency(p.budget)} | Spent: {formatCurrency(p.spent)}</p>
                    </div>
                    <div className={`text-sm font-bold ${p.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-[#8B6B56]">No project data with budgets</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white border border-[#E0CCBA] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E0CCBA] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50"><Users size={16} className="text-emerald-600" /></div>
            <h3 className="text-sm font-semibold text-[#4A2112]">Lead Conversion</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Total Leads', value: leadConversion.total, color: 'text-blue-600' },
                { label: 'Won', value: leadConversion.won, color: 'text-emerald-600' },
                { label: 'Lost', value: leadConversion.lost, color: 'text-red-500' },
                { label: 'Active', value: leadConversion.active, color: 'text-[#6B3A1F]' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-[#F0DFD1] border border-[#E0CCBA] text-center">
                  <p className="text-xs text-[#8B6B56]">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Conversion funnel visual */}
            <div className="space-y-2">
              {[
                { label: 'Won', pct: leadConversion.total ? (leadConversion.won / leadConversion.total) * 100 : 0, color: '#10B981' },
                { label: 'Active', pct: leadConversion.total ? (leadConversion.active / leadConversion.total) * 100 : 0, color: '#6B3A1F' },
                { label: 'Lost', pct: leadConversion.total ? (leadConversion.lost / leadConversion.total) * 100 : 0, color: '#EF4444' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-[#8B6B56] w-12 text-right">{s.label}</span>
                  <div className="flex-1 h-5 bg-[#E8D5C4] rounded-lg overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(s.pct, s.pct > 0 ? 8 : 0)}%` }} transition={{ duration: 0.6 }}
                      className="h-full rounded-lg flex items-center px-2" style={{ backgroundColor: s.color }}>
                      {s.pct > 10 && <span className="text-[10px] font-bold text-white">{Math.round(s.pct)}%</span>}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#6B3A1F]/5 border border-[#6B3A1F]/20 text-center">
              <p className="text-xs text-[#8B6B56]">Avg Deal Size</p>
              <p className="text-lg font-bold text-[#6B3A1F]">{formatCurrency(avgDealSize)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
