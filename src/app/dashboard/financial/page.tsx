'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, FileText,
  Plus, Download, Filter, Calendar, Clock, AlertCircle,
  CheckCircle, Send, Edit3, MoreHorizontal, ChevronDown,
  PieChart, ArrowUpRight, ArrowDownRight, CreditCard, Zap,
  Trash2, RefreshCw,
} from 'lucide-react';
import { AreaChart, DonutChart, BarChart } from '@tremor/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  client: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  vendor?: string;
  type: 'recurring' | 'one-time';
}

interface RevenueData {
  month: string;
  Revenue: number;
  Expenses: number;
}

// ─── Real Vantix Financial Data ───────────────────────────────────────────────

const mockRevenueData: RevenueData[] = [
  { month: 'Sep', Revenue: 0, Expenses: 0 },
  { month: 'Oct', Revenue: 0, Expenses: 0 },
  { month: 'Nov', Revenue: 0, Expenses: 50 },
  { month: 'Dec', Revenue: 0, Expenses: 50 },
  { month: 'Jan', Revenue: 0, Expenses: 50 },
  { month: 'Feb', Revenue: 2000, Expenses: 50 },
];

const mockInvoices: Invoice[] = [
  { id: 'INV-001', client: 'Secured Tampa (Dave)', amount: 2000, dueDate: '2025-02-01', status: 'paid', createdAt: '2025-01-15' },
  { id: 'INV-002', client: 'Secured Tampa (Dave)', amount: 2500, dueDate: '2025-02-28', status: 'sent', createdAt: '2025-02-10' }, // $2,500 remaining + 3% rev share
];

const mockExpenses: Expense[] = [
  { id: 'EXP-001', description: 'Hosting & Tools', amount: 50, category: 'Infrastructure', date: '2025-02-01', vendor: 'Various', type: 'recurring' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusConfig = (status: Invoice['status']) => {
  const configs = {
    draft: { label: 'Draft', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: Edit3 },
    sent: { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Send },
    paid: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle },
    overdue: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle },
  };
  return configs[status];
};

const CATEGORY_COLORS: Record<string, string> = {
  'Infrastructure': '#10b981',
  'Software': '#3b82f6',
  'AI Services': '#8b5cf6',
  'Operations': '#f59e0b',
  'Marketing': '#ec4899',
  'Other': '#6b7280',
};

// ─── Animated Counter Component ───────────────────────────────────────────────

function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '',
  duration = 1500,
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FinancialPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [revenueData] = useState<RevenueData[]>(mockRevenueData);
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | Invoice['status']>('all');
  const [chartPeriod, setChartPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Delete expense handler
  const handleDeleteExpense = (expense: Expense) => {
    setExpenseToDelete(expense);
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
      setExpenseToDelete(null);
    }
  };

  // ── Computed KPIs ─────────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const currentRevenue = revenueData.slice(-1)[0]?.Revenue || 0;
    const prevRevenue = revenueData.slice(-2, -1)[0]?.Revenue || currentRevenue;
    const revenueTrend = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    const currentExpenses = revenueData.slice(-1)[0]?.Expenses || 0;
    const prevExpenses = revenueData.slice(-2, -1)[0]?.Expenses || currentExpenses;
    const expenseTrend = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    const totalRevenue = revenueData.reduce((sum, d) => sum + d.Revenue, 0);
    const totalExpenses = revenueData.reduce((sum, d) => sum + d.Expenses, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitTrend = ((currentRevenue - currentExpenses) / (prevRevenue - prevExpenses) - 1) * 100;

    const outstanding = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue');
    const outstandingCount = outstanding.length;
    const outstandingAmount = outstanding.reduce((sum, inv) => sum + inv.amount, 0);

    return {
      totalRevenue,
      revenueTrend,
      totalExpenses,
      expenseTrend,
      netProfit,
      profitTrend,
      outstandingCount,
      outstandingAmount,
    };
  }, [revenueData, invoices]);

  // ── Filtered invoices ─────────────────────────────────────────────────────

  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === 'all') return invoices;
    return invoices.filter(inv => inv.status === invoiceFilter);
  }, [invoices, invoiceFilter]);

  // ── Expense category breakdown ────────────────────────────────────────────

  const expenseBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    expenses.forEach(exp => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return Object.entries(breakdown)
      .map(([name, amount]) => ({ name, amount, color: CATEGORY_COLORS[name] || '#6b7280' }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const totalMonthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // ── Actions ───────────────────────────────────────────────────────────────

  const downloadReport = () => {
    const report = [
      'Vantix Financial Report',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      '=== Summary ===',
      `Total Revenue: ${formatCurrency(kpis.totalRevenue)}`,
      `Total Expenses: ${formatCurrency(kpis.totalExpenses)}`,
      `Net Profit: ${formatCurrency(kpis.netProfit)}`,
      `Outstanding Invoices: ${kpis.outstandingCount} (${formatCurrency(kpis.outstandingAmount)})`,
      '',
      '=== Invoices ===',
      ...invoices.map(inv => `${inv.id}: ${inv.client} - ${formatCurrency(inv.amount)} (${inv.status})`),
      '',
      '=== Recent Expenses ===',
      ...expenses.map(exp => `${exp.date}: ${exp.description} - ${formatCurrency(exp.amount)} (${exp.category})`),
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vantix-financial-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Overview</h1>
          <p className="text-[var(--color-muted)] mt-1">Revenue, expenses, and invoice management</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] border border-[var(--color-border)] hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Download size={16} /> Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
            <AnimatedCounter value={kpis.totalRevenue} prefix="$" />
          </p>
          <div className="flex items-center gap-1 mt-2">
            {kpis.revenueTrend >= 0 ? (
              <ArrowUpRight size={14} className="text-emerald-400" />
            ) : (
              <ArrowDownRight size={14} className="text-red-400" />
            )}
            <span className={`text-xs font-medium ${kpis.revenueTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {kpis.revenueTrend >= 0 ? '+' : ''}{kpis.revenueTrend.toFixed(1)}%
            </span>
            <span className="text-xs text-[var(--color-muted)]">vs last month</span>
          </div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Total Expenses</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <CreditCard size={20} className="text-amber-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-400">
            <AnimatedCounter value={kpis.totalExpenses} prefix="$" />
          </p>
          <div className="flex items-center gap-1 mt-2">
            {kpis.expenseTrend <= 0 ? (
              <ArrowDownRight size={14} className="text-emerald-400" />
            ) : (
              <ArrowUpRight size={14} className="text-amber-400" />
            )}
            <span className={`text-xs font-medium ${kpis.expenseTrend <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {kpis.expenseTrend >= 0 ? '+' : ''}{kpis.expenseTrend.toFixed(1)}%
            </span>
            <span className="text-xs text-[var(--color-muted)]">vs last month</span>
          </div>
        </motion.div>

        {/* Net Profit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Net Profit</span>
            <div className={`w-10 h-10 rounded-xl ${kpis.netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
              <TrendingUp size={20} className={kpis.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'} />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${kpis.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <AnimatedCounter value={kpis.netProfit} prefix="$" />
          </p>
          <div className="flex items-center gap-1 mt-2">
            {!isNaN(kpis.profitTrend) && isFinite(kpis.profitTrend) && (
              <>
                {kpis.profitTrend >= 0 ? (
                  <ArrowUpRight size={14} className="text-emerald-400" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-400" />
                )}
                <span className={`text-xs font-medium ${kpis.profitTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpis.profitTrend >= 0 ? '+' : ''}{kpis.profitTrend.toFixed(1)}%
                </span>
              </>
            )}
            <span className="text-xs text-[var(--color-muted)]">margin</span>
          </div>
        </motion.div>

        {/* Outstanding Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Outstanding</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText size={20} className="text-blue-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">
            <AnimatedCounter value={kpis.outstandingCount} />
          </p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {formatCurrency(kpis.outstandingAmount)} pending
          </p>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">Revenue Trend</h2>
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {(['month', 'quarter', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  chartPeriod === period
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-[var(--color-muted)] hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {revenueData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <TrendingUp size={32} className="text-emerald-400" />
            </div>
            <p className="text-white font-medium mb-1">No revenue data yet</p>
            <p className="text-[var(--color-muted)] text-sm text-center max-w-xs">
              Start adding invoices and expenses to see your revenue trends
            </p>
          </div>
        ) : (
          <AreaChart
            className="h-72"
            data={revenueData}
            index="month"
            categories={['Revenue', 'Expenses']}
            colors={['emerald', 'amber']}
            valueFormatter={(value) => formatCurrency(value)}
            showLegend={true}
            showGridLines={true}
            showAnimation={true}
            curveType="monotone"
          />
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowCreateInvoice(true)}
          className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          <Plus size={18} />
          <span className="font-medium text-sm hidden sm:inline">Create Invoice</span>
          <span className="font-medium text-sm sm:hidden">Invoice</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          onClick={() => setShowAddExpense(true)}
          className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
        >
          <Receipt size={18} />
          <span className="font-medium text-sm hidden sm:inline">Log Expense</span>
          <span className="font-medium text-sm sm:hidden">Expense</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={downloadReport}
          className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          <Download size={18} />
          <span className="font-medium text-sm hidden sm:inline">Download Report</span>
          <span className="font-medium text-sm sm:hidden">Report</span>
        </motion.button>
      </div>

      {/* Invoices Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={20} className="text-emerald-400" />
            Invoices
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setInvoiceFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  invoiceFilter === status
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-[var(--color-muted)] hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]">
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Due Date</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                        <FileText size={24} className="text-emerald-400" />
                      </div>
                      <p className="text-white font-medium mb-1">No invoices yet</p>
                      <p className="text-[var(--color-muted)] text-sm">Create your first invoice to start tracking payments</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice, idx) => {
                  const statusConfig = getStatusConfig(invoice.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-white">{invoice.client}</p>
                          <p className="text-xs text-[var(--color-muted)]">{invoice.id}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-emerald-400">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-[var(--color-muted)] hover:text-white transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Expenses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Receipt size={20} className="text-amber-400" />
              Recent Expenses
            </h2>
            <span className="text-sm text-[var(--color-muted)]">
              {formatCurrency(totalMonthlyExpenses)}/mo
            </span>
          </div>
          <div className="divide-y divide-[var(--color-border)] max-h-80 overflow-y-auto">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                  <Receipt size={24} className="text-amber-400" />
                </div>
                <p className="text-white font-medium mb-1">No expenses logged</p>
                <p className="text-[var(--color-muted)] text-sm text-center">Start tracking your business expenses</p>
              </div>
            ) : (
              expenses.map((expense, idx) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.03 }}
                  className="px-5 py-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#6b7280' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-white truncate">{expense.description}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          expense.type === 'recurring' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                        }`}>
                          {expense.type === 'recurring' ? (
                            <span className="flex items-center gap-1">
                              <RefreshCw size={8} />
                              Monthly
                            </span>
                          ) : 'One-time'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-muted)]">{expense.category} • {expense.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="font-semibold text-amber-400">-{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-[var(--color-muted)]">{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--color-muted)] hover:text-red-400 transition-all"
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
            <PieChart size={20} className="text-amber-400" />
            Expense Breakdown
          </h2>
          <div className="flex flex-col items-center gap-6">
            {expenseBreakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <PieChart size={32} className="text-amber-400" />
                </div>
                <p className="text-white font-medium mb-1">No expense data</p>
                <p className="text-[var(--color-muted)] text-sm text-center">Log expenses to see category breakdown</p>
              </div>
            ) : (
              <>
                {/* Donut Chart */}
                <DonutChart
                  className="h-48"
                  data={expenseBreakdown}
                  category="amount"
                  index="name"
                  colors={['emerald', 'blue', 'violet', 'amber', 'pink', 'gray']}
                  valueFormatter={(value) => formatCurrency(value)}
                  showAnimation={true}
                />
                {/* Legend */}
                <div className="w-full space-y-3">
                  {expenseBreakdown.map((category) => {
                    const percentage = ((category.amount / totalMonthlyExpenses) * 100).toFixed(1);
                    return (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                          <span className="text-sm text-[var(--color-muted)]">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%`, backgroundColor: category.color }}
                            />
                          </div>
                          <span className="text-sm font-medium w-16 text-right">{formatCurrency(category.amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showCreateInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateInvoice(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Create Invoice</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Client Name</label>
                  <input
                    type="text"
                    placeholder="Enter client name"
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateInvoice(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateInvoice(false);
                    // Add invoice logic here
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium text-sm"
                >
                  Create Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddExpense(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Log Expense</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Expense Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm font-medium"
                    >
                      <RefreshCw size={14} />
                      Monthly Recurring
                    </button>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] border border-[var(--color-border)] hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                      One-time
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Category</label>
                  <select className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
                    <option value="">Select category</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Software">Software</option>
                    <option value="AI Services">AI Services</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[var(--color-muted)] mb-1.5 block">Vendor</label>
                  <input
                    type="text"
                    placeholder="Enter vendor name"
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddExpense(false);
                    // Add expense logic here
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors font-medium text-sm"
                >
                  Add Expense
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Expense Confirmation Modal */}
      <AnimatePresence>
        {expenseToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setExpenseToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Delete Expense</h3>
              <p className="text-sm text-[var(--color-muted)] text-center mb-6">
                Are you sure you want to delete <span className="text-white font-medium">"{expenseToDelete.description}"</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setExpenseToDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteExpense}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
