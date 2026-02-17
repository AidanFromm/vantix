'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard,
  Calendar, Plus, Trash2, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, Wallet, AlertCircle,
} from 'lucide-react';
import { getInvoices, getExpenses, createExpense } from '@/lib/supabase';
import type { Invoice, Expense } from '@/lib/types';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function FinancesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expForm, setExpForm] = useState({ amount: 0, category: '', vendor: '', description: '', expense_date: '' });
  const [view, setView] = useState<'overview' | 'revenue' | 'expenses'>('overview');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [iRes, eRes] = await Promise.all([getInvoices(), getExpenses()]);
      if (iRes.data) setInvoices(iRes.data);
      if (eRes.data) setExpenses(eRes.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Computed
  const totalRevenue = useMemo(() => invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0), [invoices]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const outstanding = useMemo(() => invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0), [invoices]);
  const netProfit = totalRevenue - totalExpenses;

  // Monthly breakdown (last 12 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months: { month: string; revenue: number; expenses: number; profit: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const rev = invoices.filter(inv => inv.status === 'paid' && inv.paid_date?.startsWith(key)).reduce((s, inv) => s + (inv.amount || 0), 0);
      const exp = expenses.filter(e => e.expense_date?.startsWith(key)).reduce((s, e) => s + (e.amount || 0), 0);
      months.push({ month: MONTHS[d.getMonth()], revenue: rev, expenses: exp, profit: rev - exp });
    }
    return months;
  }, [invoices, expenses]);

  const maxBar = Math.max(...monthlyData.map(m => Math.max(m.revenue, m.expenses)), 1);

  // Expense categories
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach(e => { const c = e.category || 'Other'; cats[c] = (cats[c] || 0) + (e.amount || 0); });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const handleExpense = async () => {
    try {
      await createExpense(expForm);
      setExpForm({ amount: 0, category: '', vendor: '', description: '', expense_date: '' });
      setShowExpenseForm(false);
      load();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl"><Wallet className="w-6 h-6 text-emerald-400" /></div>
            Finances
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Revenue, expenses, and profit tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-800 rounded-xl p-1">
            {(['overview', 'revenue', 'expenses'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-emerald-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setShowExpenseForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* KPI Cards */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Revenue', value: totalRevenue, icon: TrendingUp, color: 'text-emerald-400', prefix: '$' },
              { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'text-red-400', prefix: '$' },
              { label: 'Net Profit', value: netProfit, icon: DollarSign, color: netProfit >= 0 ? 'text-emerald-400' : 'text-red-400', prefix: '$' },
              { label: 'Outstanding', value: outstanding, icon: Receipt, color: 'text-amber-400', prefix: '$' },
            ].map((kpi, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${kpi.color === 'text-emerald-400' ? 'bg-emerald-500/10' : kpi.color === 'text-red-400' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                  <span className="text-xs text-zinc-500">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.prefix}{Math.abs(kpi.value).toLocaleString()}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Revenue Chart */}
          {(view === 'overview' || view === 'revenue') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" /> Monthly Breakdown
                </h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> Expenses</span>
                </div>
              </div>
              <div className="flex items-end gap-2 h-48">
                {monthlyData.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex gap-0.5 items-end w-full justify-center h-40">
                      <div className="w-[40%] bg-emerald-500/80 rounded-t-sm transition-all hover:bg-emerald-400" style={{ height: `${(m.revenue / maxBar) * 100}%`, minHeight: m.revenue > 0 ? '4px' : '0' }} title={`$${m.revenue.toLocaleString()}`} />
                      <div className="w-[40%] bg-red-500/60 rounded-t-sm transition-all hover:bg-red-400" style={{ height: `${(m.expenses / maxBar) * 100}%`, minHeight: m.expenses > 0 ? '4px' : '0' }} title={`$${m.expenses.toLocaleString()}`} />
                    </div>
                    <span className="text-[10px] text-zinc-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories */}
            {(view === 'overview' || view === 'expenses') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-emerald-400" /> Expense Categories
                </h2>
                {categoryBreakdown.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600 text-sm">No expenses recorded</div>
                ) : (
                  <div className="space-y-3">
                    {categoryBreakdown.map(([cat, amount]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-300">{cat}</span>
                          <span className="text-zinc-400">${amount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(amount / totalExpenses) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Recent Transactions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-emerald-400" /> Recent Transactions
              </h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {[
                  ...invoices.filter(i => i.status === 'paid').map(i => ({
                    id: i.id, desc: i.client?.name || `Invoice #${i.invoice_number || i.id.slice(0,6)}`,
                    amount: i.amount, type: 'income' as const, date: i.paid_date || i.created_at,
                  })),
                  ...expenses.map(e => ({
                    id: e.id, desc: e.vendor || e.description || e.category || 'Expense',
                    amount: e.amount, type: 'expense' as const, date: e.expense_date,
                  })),
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15).map(t => (
                  <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-zinc-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-sm text-white">{t.desc}</p>
                        <p className="text-xs text-zinc-500">{new Date(t.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {invoices.length === 0 && expenses.length === 0 && (
                  <div className="text-center py-8 text-zinc-600 text-sm">No transactions yet</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Monthly P&L Table */}
          {view === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mt-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-emerald-400" /> Monthly P&L
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left text-zinc-500 font-medium py-2 pr-4">Month</th>
                      <th className="text-right text-zinc-500 font-medium py-2 px-4">Revenue</th>
                      <th className="text-right text-zinc-500 font-medium py-2 px-4">Expenses</th>
                      <th className="text-right text-zinc-500 font-medium py-2 pl-4">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.filter(m => m.revenue > 0 || m.expenses > 0).map((m, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        <td className="py-2.5 pr-4 text-white">{m.month}</td>
                        <td className="py-2.5 px-4 text-right text-emerald-400">${m.revenue.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right text-red-400">${m.expenses.toLocaleString()}</td>
                        <td className={`py-2.5 pl-4 text-right font-medium ${m.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${m.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                    {monthlyData.every(m => m.revenue === 0 && m.expenses === 0) && (
                      <tr><td colSpan={4} className="py-8 text-center text-zinc-600">No data for the last 12 months</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showExpenseForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowExpenseForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-6">Add Expense</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Amount ($)</label>
                    <input type="number" value={expForm.amount || ''} onChange={e => setExpForm(f => ({ ...f, amount: Number(e.target.value) }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Date</label>
                    <input type="date" value={expForm.expense_date} onChange={e => setExpForm(f => ({ ...f, expense_date: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category</label>
                  <select value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="">Select category...</option>
                    {['Software & Subscriptions', 'Equipment & Hardware', 'Professional Services', 'Marketing & Advertising', 'Contractor/Freelancer', 'Travel & Meals', 'Office Supplies', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Vendor</label>
                  <input value={expForm.vendor} onChange={e => setExpForm(f => ({ ...f, vendor: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Vercel, DigitalOcean, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
                  <input value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Monthly hosting" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowExpenseForm(false)} className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleExpense} disabled={!expForm.amount} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl font-medium transition-colors">
                  Add Expense
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
