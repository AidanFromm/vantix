'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  client?: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', description: 'Secured Tampa — Dave deposit ($2K of $4.5K)', amount: 2000, date: '2026-01-15', category: 'Project', client: 'Dave' },
  { id: '2', type: 'expense', description: 'DigitalOcean Server', amount: 24, date: '2026-02-01', category: 'Infrastructure' },
  { id: '3', type: 'expense', description: 'Vercel Pro', amount: 20, date: '2026-02-01', category: 'Infrastructure' },
];

export default function RevenuePage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = income - expenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Money</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Track revenue, expenses, and profit</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                period === p
                  ? 'bg-[#10b981] text-white'
                  : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Revenue</span>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp size={16} className="text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">${income.toLocaleString()}</p>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Expenses</span>
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown size={16} className="text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">${expenses.toLocaleString()}</p>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-muted)]">Profit</span>
            <div className={`p-2 rounded-lg ${profit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <DollarSign size={16} className={profit >= 0 ? 'text-green-400' : 'text-red-400'} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${profit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h2 className="font-semibold">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 hover:bg-[#EEE6DC]/5 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {tx.type === 'income' ? (
                    <ArrowUpRight size={16} className="text-green-400" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span>{tx.category}</span>
                    {tx.client && (
                      <>
                        <span>•</span>
                        <span>{tx.client}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--color-muted)]">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted)] text-center">
        Pending: $2,500 remaining from Dave on delivery + $100/mo maintenance after launch
      </p>
    </div>
  );
}
