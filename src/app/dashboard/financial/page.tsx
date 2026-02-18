'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, FileText,
  Plus, Download, Calendar, Clock, AlertCircle,
  CheckCircle, Send, Edit3, CreditCard, Zap,
  Trash2, RefreshCw, PieChart, ArrowUpRight, ArrowDownRight, X, Loader2,
} from 'lucide-react';
import { getInvoices, getExpenses, createExpense, deleteExpense as deleteExpenseFn, getSubscriptionMetas, saveSubscriptionMeta, removeSubscriptionMeta } from '@/lib/supabase';
import type { Invoice, Expense, SubscriptionMeta } from '@/lib/types';

const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const CATEGORY_COLORS: Record<string, string> = {
  'Infrastructure': '#10b981', 'Software & Subscriptions': '#3b82f6', 'AI Services': '#8b5cf6',
  'Marketing & Advertising': '#ec4899', 'Contractor/Freelancer': '#f59e0b', 'Other': '#6b7280',
};

export default function FinancialPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [subscriptionMetas, setSubscriptionMetas] = useState<SubscriptionMeta[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [iRes, eRes] = await Promise.all([getInvoices(), getExpenses()]);
      setInvoices(iRes.data || []);
      setExpenses(eRes.data || []);
      setSubscriptionMetas(getSubscriptionMetas());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpis = useMemo(() => {
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || i.amount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue');
    return {
      totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses,
      outstandingCount: outstanding.length,
      outstandingAmount: outstanding.reduce((s, i) => s + (i.total || i.amount || 0), 0),
    };
  }, [invoices, expenses]);

  const expenseBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    expenses.forEach(exp => { const cat = exp.category || 'Other'; breakdown[cat] = (breakdown[cat] || 0) + (exp.amount || 0); });
    return Object.entries(breakdown).map(([name, amount]) => ({ name, amount, color: CATEGORY_COLORS[name] || '#6b7280' })).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const totalMonthlyExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    setDeleting(id);
    try { await deleteExpenseFn(id); removeSubscriptionMeta(id); await loadData(); }
    catch (err) { console.error(err); } finally { setDeleting(null); }
  };

  const getSubMeta = (id: string) => subscriptionMetas.find(m => m.expense_id === id);

  const downloadReport = () => {
    const report = [`Vantix Financial Report`, `Generated: ${new Date().toLocaleDateString()}`, '', `Total Revenue: ${formatCurrency(kpis.totalRevenue)}`, `Total Expenses: ${formatCurrency(kpis.totalExpenses)}`, `Net Profit: ${formatCurrency(kpis.netProfit)}`, `Outstanding: ${kpis.outstandingCount} (${formatCurrency(kpis.outstandingAmount)})`, '', '=== Invoices ===', ...invoices.map(inv => `${inv.invoice_number || inv.id.slice(0,8)}: ${inv.client?.name || 'N/A'} - ${formatCurrency(inv.total || inv.amount || 0)} (${inv.status})`), '', '=== Expenses ===', ...expenses.map(exp => `${exp.expense_date}: ${exp.description || exp.vendor || 'N/A'} - ${formatCurrency(exp.amount)} (${exp.category || 'Other'})`)].join('\n');
    const blob = new Blob([report], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `vantix-financial-${new Date().toISOString().split('T')[0]}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#9B6C3C] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">Financial Overview</h1><p className="text-[#7A746C] mt-1 text-sm">Revenue, expenses, and invoice management</p></div>
        <button onClick={downloadReport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#7A746C] border border-[#D8CFC4] hover:text-[#1E1E1E] hover:bg-[#EFE6DA] transition-colors text-sm font-medium"><Download size={16} /> Report</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Expenses', value: formatCurrency(kpis.totalExpenses), icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Net Profit', value: formatCurrency(kpis.netProfit), icon: TrendingUp, color: kpis.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600', bg: kpis.netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50', border: kpis.netProfit >= 0 ? 'border-emerald-100' : 'border-red-100' },
          { label: 'Outstanding', value: `${kpis.outstandingCount} inv`, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-white border ${stat.border} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3"><span className="text-sm text-[#7A746C]">{stat.label}</span><div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon size={20} className={stat.color} /></div></div>
            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={() => setShowAddExpense(true)}
          className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors">
          <Receipt size={18} /><span className="font-medium text-sm">Log Expense</span>
        </motion.button>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} onClick={downloadReport}
          className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors">
          <Download size={18} /><span className="font-medium text-sm">Download Report</span>
        </motion.button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-[#D8CFC4] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#D8CFC4]"><h2 className="text-lg font-semibold text-[#1E1E1E] flex items-center gap-2"><FileText size={20} className="text-[#9B6C3C]" /> Invoices</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#D8CFC4] text-left text-[#7A746C] text-xs uppercase"><th className="px-5 py-4 font-medium">Client</th><th className="px-5 py-4 font-medium">Amount</th><th className="px-5 py-4 font-medium">Due Date</th><th className="px-5 py-4 font-medium">Status</th></tr></thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-[#7A746C]">No invoices yet</td></tr>
              ) : invoices.map(inv => {
                const amt = inv.total || inv.amount || 0;
                const sc = { draft: 'text-gray-500 bg-gray-50', sent: 'text-blue-600 bg-blue-50', paid: 'text-emerald-600 bg-emerald-50', overdue: 'text-red-600 bg-red-50', cancelled: 'text-gray-400 bg-gray-50' }[inv.status] || '';
                return (
                  <tr key={inv.id} className="border-b border-[#D8CFC4]/50 hover:bg-[#EFE6DA]/50 transition-colors">
                    <td className="px-5 py-4"><p className="font-medium text-[#1E1E1E]">{inv.client?.name || 'N/A'}</p><p className="text-xs text-[#7A746C]">{inv.invoice_number || inv.id.slice(0, 8)}</p></td>
                    <td className="px-5 py-4 font-semibold text-[#9B6C3C]">{formatCurrency(amt)}</td>
                    <td className="px-5 py-4 text-[#7A746C]">{inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc}`}>{inv.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#D8CFC4] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#D8CFC4] flex items-center justify-between"><h2 className="text-lg font-semibold text-[#1E1E1E] flex items-center gap-2"><Receipt size={20} className="text-amber-500" /> Recent Expenses</h2><span className="text-sm text-[#7A746C]">{formatCurrency(totalMonthlyExpenses)}</span></div>
          <div className="divide-y divide-[#D8CFC4] max-h-80 overflow-y-auto">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12"><Receipt size={24} className="text-[#7A746C]/30 mb-3" /><p className="text-[#7A746C] text-sm">No expenses logged</p></div>
            ) : expenses.map(expense => {
              const subMeta = getSubMeta(expense.id);
              return (
              <div key={expense.id} className="px-5 py-4 hover:bg-[#EFE6DA]/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[expense.category || 'Other'] || '#6b7280' }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-[#1E1E1E] truncate">{subMeta?.company_name || expense.description || expense.vendor || 'Expense'}</p>
                      {subMeta && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 shrink-0">{subMeta.billing_cycle}</span>}
                    </div>
                    <p className="text-xs text-[#7A746C]">{expense.category || 'Other'}{expense.vendor ? ` · ${expense.vendor}` : ''}{subMeta ? ` · Next: ${new Date(subMeta.next_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right"><p className="font-semibold text-amber-600">-{formatCurrency(expense.amount)}</p><p className="text-xs text-[#7A746C]">{new Date(expense.expense_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#7A746C] hover:text-red-500 transition-all">
                    {deleting === expense.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#D8CFC4] rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1E1E1E] flex items-center gap-2 mb-5"><PieChart size={20} className="text-amber-500" /> Expense Breakdown</h2>
          {expenseBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8"><PieChart size={32} className="text-[#7A746C]/30 mb-4" /><p className="text-[#7A746C] text-sm">No expense data</p></div>
          ) : (
            <div className="space-y-3">
              {expenseBreakdown.map(cat => {
                const pct = totalMonthlyExpenses > 0 ? ((cat.amount / totalMonthlyExpenses) * 100).toFixed(1) : '0';
                return (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} /><span className="text-sm text-[#7A746C]">{cat.name}</span></div>
                    <div className="flex items-center gap-3"><div className="w-20 h-1.5 bg-[#EFE6DA] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} /></div><span className="text-sm font-medium text-[#1E1E1E] w-16 text-right">{formatCurrency(cat.amount)}</span></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && <AddExpenseModal onClose={() => setShowAddExpense(false)} onSave={async (data, subMeta) => { try { const { data: created } = await createExpense(data); if (subMeta && created?.id) { saveSubscriptionMeta({ ...subMeta, expense_id: created.id }); } setShowAddExpense(false); await loadData(); } catch (err) { console.error(err); } }} />}
      </AnimatePresence>
    </div>
  );
}

function AddExpenseModal({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<Expense>, subMeta?: SubscriptionMeta) => Promise<void> }) {
  const [form, setForm] = useState({
    description: '', amount: 0, category: '', vendor: '',
    expense_date: new Date().toISOString().split('T')[0],
    expense_type: 'one-time' as 'one-time' | 'subscription',
    billing_cycle: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    next_due_date: '',
    company_name: '',
  });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-[#F5EFE7] border border-[#D8CFC4] rounded-xl px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#9B6C3C]/50';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.amount) return;
    setSaving(true);
    try {
      const subMeta = form.expense_type === 'subscription' ? {
        expense_id: '', // will be set after creation
        expense_type: 'subscription' as const,
        billing_cycle: form.billing_cycle,
        next_due_date: form.next_due_date || form.expense_date,
        company_name: form.company_name || form.vendor || form.description,
        amount: form.amount,
        category: form.category || undefined,
        description: form.description || undefined,
      } : undefined;
      await onSave({
        description: form.description, amount: form.amount,
        category: form.category || undefined, vendor: form.vendor || undefined,
        expense_date: form.expense_date,
        expense_type: form.expense_type,
        billing_cycle: form.expense_type === 'subscription' ? form.billing_cycle : undefined,
        next_due_date: form.expense_type === 'subscription' ? (form.next_due_date || form.expense_date) : undefined,
        company_name: form.expense_type === 'subscription' ? (form.company_name || undefined) : undefined,
      }, subMeta);
    }
    catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1E1E1E]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white border border-[#D8CFC4] rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-[#1E1E1E] mb-4">Log Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense Type Toggle */}
          <div>
            <label className="text-xs text-[#7A746C] mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {(['one-time', 'subscription'] as const).map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, expense_type: t }))}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${form.expense_type === t ? 'bg-[#9B6C3C]/10 text-[#9B6C3C] border-[#9B6C3C]/30' : 'bg-[#EFE6DA] text-[#7A746C] border-[#D8CFC4]'}`}>
                  {t === 'one-time' ? 'One-Time' : 'Subscription'}
                </button>
              ))}
            </div>
          </div>
          <div><label className="text-xs text-[#7A746C] mb-1.5 block">Description</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Amount *</label><input type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} required /></div>
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Date</label><input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}><option value="">Select...</option>{['Software & Subscriptions','Equipment & Hardware','Professional Services','Marketing & Advertising','Contractor/Freelancer','Travel & Meals','Other'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-xs text-[#7A746C] mb-1.5 block">Vendor</label><input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} className={inputCls} /></div>
          </div>
          {/* Subscription-specific fields */}
          {form.expense_type === 'subscription' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-[#7A746C] mb-1.5 block">Company Name</label><input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="e.g. Vercel, OpenAI" className={inputCls} /></div>
                <div><label className="text-xs text-[#7A746C] mb-1.5 block">Billing Cycle</label>
                  <select value={form.billing_cycle} onChange={e => setForm(f => ({ ...f, billing_cycle: e.target.value as 'monthly' | 'quarterly' | 'yearly' }))} className={inputCls}>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-[#7A746C] mb-1.5 block">Next Due Date</label><input type="date" value={form.next_due_date} onChange={e => setForm(f => ({ ...f, next_due_date: e.target.value }))} className={inputCls} /></div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-[#EFE6DA] text-[#7A746C] text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.amount} className="flex-1 px-4 py-3 rounded-xl bg-[#9B6C3C] text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Add Expense'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}