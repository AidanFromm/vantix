'use client';

import { useState } from 'react';
import { Landmark, CreditCard, Receipt, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  account: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Secured Tampa Payment', amount: 4500, type: 'income', category: 'Project', date: '2026-02-10', account: 'Business' },
  { id: '2', description: 'DigitalOcean', amount: 24, type: 'expense', category: 'Infrastructure', date: '2026-02-01', account: 'Business' },
  { id: '3', description: 'Vercel Pro', amount: 20, type: 'expense', category: 'Software', date: '2026-02-01', account: 'Business' },
  { id: '4', description: 'Domain Renewal', amount: 15, type: 'expense', category: 'Infrastructure', date: '2026-02-05', account: 'Business' },
  { id: '5', description: 'Figma Subscription', amount: 12, type: 'expense', category: 'Software', date: '2026-02-01', account: 'Business' },
];

export default function FinancesPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = typeFilter === 'all' ? transactions : transactions.filter(t => t.type === typeFilter);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finances</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Detailed financial tracking and analysis</p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Total Income</span>
            <TrendingUp size={16} className="text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">${income.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Total Expenses</span>
            <TrendingDown size={16} className="text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">${expenses.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Net Balance</span>
            <Landmark size={16} className={balance >= 0 ? 'text-green-400' : 'text-red-400'} />
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense breakdown */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
        <h3 className="font-semibold mb-4">Expense Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="text-sm">{category}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10b981] rounded-full" 
                    style={{ width: `${(amount / expenses) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-16 text-right">${amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-[var(--color-muted)]" />
        {(['all', 'income', 'expense'] as const).map(f => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              typeFilter === f
                ? 'bg-[#10b981] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold">All Transactions</h3>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(tx => (
            <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {tx.type === 'income' ? (
                    <TrendingUp size={14} className="text-green-400" />
                  ) : (
                    <Receipt size={14} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-[var(--color-muted)]">{tx.category} • {tx.account}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount}
                </p>
                <p className="text-xs text-[var(--color-muted)]">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
