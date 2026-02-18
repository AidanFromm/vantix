'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, Plus, X, Filter, Receipt, CreditCard, Monitor, FolderOpen,
  Repeat, ShoppingBag, TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  Trash2, Edit3,
} from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';

// ── Types ──
type ExpenseCategory = 'API' | 'Hosting' | 'Domain' | 'Subscription' | 'Hardware' | 'Contractor' | 'Marketing' | 'Other';
type ExpenseType = 'One-Time' | 'Subscription';
type Project = 'SecuredTampa' | 'JFK' | 'Vantix General' | '';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  vendor: string;
  project: Project;
  date: string;
  recurring_interval?: string;
  notes?: string;
  created_at?: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

const CATEGORIES: ExpenseCategory[] = ['API', 'Hosting', 'Domain', 'Subscription', 'Hardware', 'Contractor', 'Marketing', 'Other'];
const PROJECTS: Project[] = ['SecuredTampa', 'JFK', 'Vantix General', ''];
const PROJECT_COLORS: Record<string, string> = {
  SecuredTampa: 'bg-blue-100 text-blue-700',
  JFK: 'bg-purple-100 text-purple-700',
  'Vantix General': 'bg-[#B07A45]/10 text-[#B07A45]',
};
const INTERVALS = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const SEED: Expense[] = [];

function lsGet<T>(key: string, fallback: T[]): T[] {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSet<T>(key: string, d: T[]) { try { localStorage.setItem(key, JSON.stringify(d)); } catch {} }

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const blankForm = { description: '', amount: '', category: 'Other' as ExpenseCategory, type: 'One-Time' as ExpenseType, vendor: '', project: '' as Project, date: new Date().toISOString().slice(0, 10), recurring_interval: '', notes: '' };
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    (async () => {
      try {
        const d = await getData<Expense>('expenses');
        setExpenses(d.length ? d : lsGet('vantix_expenses', SEED));
      } catch { setExpenses(lsGet('vantix_expenses', SEED)); }
      try {
        const p = await getData<Payment>('payments');
        setPayments(p.length ? p : lsGet('vantix_payments', []));
      } catch { setPayments(lsGet('vantix_payments', [])); }
    })();
  }, []);

  useEffect(() => { lsSet('vantix_expenses', expenses); }, [expenses]);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthExpenses = useMemo(() => expenses.filter(e => e.date.startsWith(thisMonth)), [expenses, thisMonth]);
  const totalMonth = useMemo(() => monthExpenses.reduce((s, e) => s + e.amount, 0), [monthExpenses]);
  const subsMonth = useMemo(() => monthExpenses.filter(e => e.type === 'Subscription').reduce((s, e) => s + e.amount, 0), [monthExpenses]);
  const oneTimeMonth = useMemo(() => monthExpenses.filter(e => e.type === 'One-Time').reduce((s, e) => s + e.amount, 0), [monthExpenses]);
  const byProject = useMemo(() => {
    const m: Record<string, number> = {};
    monthExpenses.forEach(e => { const k = e.project || 'Unassigned'; m[k] = (m[k] || 0) + e.amount; });
    return m;
  }, [monthExpenses]);

  const revenue = useMemo(() => payments.filter(p => p.date?.startsWith(thisMonth) && p.status === 'completed').reduce((s, p) => s + p.amount, 0), [payments, thisMonth]);
  const profit = revenue - totalMonth;

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (filterCategory !== 'All') list = list.filter(e => e.category === filterCategory);
    if (filterProject !== 'All') list = list.filter(e => (filterProject === 'None' ? !e.project : e.project === filterProject));
    if (filterType !== 'All') list = list.filter(e => e.type === filterType);
    list.sort((a, b) => sortField === 'date' ? (sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)) : (sortAsc ? a.amount - b.amount : b.amount - a.amount));
    return list;
  }, [expenses, filterCategory, filterProject, filterType, sortField, sortAsc]);

  const toggleSort = (f: 'date' | 'amount') => { if (sortField === f) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(false); } };

  const openAdd = () => { setEditId(null); setForm(blankForm); setShowModal(true); };
  const openEdit = (e: Expense) => {
    setEditId(e.id);
    setForm({ description: e.description, amount: String(e.amount), category: e.category, type: e.type, vendor: e.vendor, project: e.project, date: e.date, recurring_interval: e.recurring_interval || '', notes: e.notes || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    const rec: Omit<Expense, 'id'> & { id?: string } = {
      description: form.description, amount: parseFloat(form.amount) || 0, category: form.category, type: form.type,
      vendor: form.vendor, project: form.project, date: form.date, recurring_interval: form.type === 'Subscription' ? form.recurring_interval : undefined, notes: form.notes,
    };
    if (editId) {
      try { await updateRecord('expenses', editId, rec); } catch {}
      setExpenses(prev => prev.map(e => e.id === editId ? { ...e, ...rec } : e));
    } else {
      const id = crypto.randomUUID();
      try { await createRecord('expenses', { id, ...rec }); } catch {}
      setExpenses(prev => [{ id, ...rec } as Expense, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    try { await deleteRecord('expenses', id); } catch {}
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => sortField === field ? (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronDown size={14} className="opacity-30" />;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#F4EFE8]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Expenses</h1>
          <p className="text-sm text-[#7A746C]">Track and manage all business expenses</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Expenses (Month)', value: totalMonth, icon: Receipt, color: 'text-red-500' },
          { label: 'Subscriptions', value: subsMonth, icon: Repeat, color: 'text-[#B07A45]' },
          { label: 'One-Time', value: oneTimeMonth, icon: ShoppingBag, color: 'text-blue-500' },
        ].map((s) => (
          <div key={s.label} className="bg-[#EEE6DC] rounded-xl p-5 border border-[#E3D9CD]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#7A746C] uppercase tracking-wide font-medium">{s.label}</span>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-[#1C1C1C]">${s.value.toLocaleString()}</p>
          </div>
        ))}
        <div className="bg-[#EEE6DC] rounded-xl p-5 border border-[#E3D9CD]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#7A746C] uppercase tracking-wide font-medium">By Project</span>
            <FolderOpen size={16} className="text-[#7A746C]" />
          </div>
          <div className="space-y-1">
            {Object.entries(byProject).map(([p, v]) => (
              <div key={p} className="flex justify-between text-sm">
                <span className="text-[#4B4B4B]">{p}</span>
                <span className="font-semibold text-[#1C1C1C]">${v.toLocaleString()}</span>
              </div>
            ))}
            {Object.keys(byProject).length === 0 && <p className="text-sm text-[#7A746C]">No expenses this month</p>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#7A746C]" />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg px-3 py-1.5 text-sm text-[#4B4B4B] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg px-3 py-1.5 text-sm text-[#4B4B4B] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
          <option value="All">All Projects</option>
          <option value="None">No Project</option>
          {PROJECTS.filter(Boolean).map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg px-3 py-1.5 text-sm text-[#4B4B4B] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
          <option value="All">All Types</option>
          <option>One-Time</option>
          <option>Subscription</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3D9CD] text-left text-[#7A746C]">
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort('amount')}>
                  <span className="inline-flex items-center gap-1">Amount <SortIcon field="amount" /></span>
                </th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort('date')}>
                  <span className="inline-flex items-center gap-1">Date <SortIcon field="date" /></span>
                </th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-[#E3D9CD]/60 hover:bg-[#E3D9CD]/30 transition-colors">
                  <td className="px-4 py-3 text-[#1C1C1C] font-medium">{e.description}</td>
                  <td className="px-4 py-3 text-[#1C1C1C] font-semibold">${e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md bg-[#F4EFE8] text-[#4B4B4B] text-xs">{e.category}</span></td>
                  <td className="px-4 py-3 text-[#4B4B4B]">{e.type}</td>
                  <td className="px-4 py-3 text-[#4B4B4B]">{e.vendor}</td>
                  <td className="px-4 py-3">
                    {e.project ? <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${PROJECT_COLORS[e.project] || 'bg-gray-100 text-gray-600'}`}>{e.project}</span> : <span className="text-[#7A746C]">-</span>}
                  </td>
                  <td className="px-4 py-3 text-[#4B4B4B]">{e.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#7A746C] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-[#7A746C]">No expenses found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly P&L */}
      <div className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] p-6">
        <h2 className="text-lg font-bold text-[#1C1C1C] mb-4">Monthly P&L</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-xs text-[#7A746C] uppercase tracking-wide mb-1">Revenue</p>
            <p className="text-3xl font-bold text-green-600">${revenue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#7A746C] uppercase tracking-wide mb-1">Expenses</p>
            <p className="text-3xl font-bold text-red-500">${totalMonth.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#7A746C] uppercase tracking-wide mb-1">Profit</p>
            <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {profit >= 0 ? '' : '-'}${Math.abs(profit).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1C1C1C]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#F4EFE8] rounded-2xl shadow-xl w-full max-w-lg border border-[#E3D9CD] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E3D9CD]">
              <h3 className="text-lg font-bold text-[#1C1C1C]">{editId ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#7A746C] mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Amount ($)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ExpenseCategory })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Type</label>
                  <div className="flex rounded-lg overflow-hidden border border-[#E3D9CD]">
                    {(['One-Time', 'Subscription'] as ExpenseType[]).map(t => (
                      <button key={t} onClick={() => setForm({ ...form, type: t })} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${form.type === t ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : 'bg-[#EEE6DC] text-[#4B4B4B]'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Vendor</label>
                  <input value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Project</label>
                  <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value as Project })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
                    <option value="">None</option>
                    {PROJECTS.filter(Boolean).map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {form.type === 'Subscription' && (
                <div>
                  <label className="block text-xs font-medium text-[#7A746C] mb-1">Recurring Interval</label>
                  <select value={form.recurring_interval} onChange={e => setForm({ ...form, recurring_interval: e.target.value })} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
                    <option value="">Select...</option>
                    {INTERVALS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[#7A746C] mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] resize-none" />
              </div>
            </div>
            <div className="p-5 border-t border-[#E3D9CD] flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-[#7A746C] hover:text-[#1C1C1C] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={!form.description || !form.amount} className="px-5 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-40">
                {editId ? 'Update' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
