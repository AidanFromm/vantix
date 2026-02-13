'use client';

import { useState } from 'react';
import { Scale, FileText, CheckCircle, Clock, AlertTriangle, Plus, Download } from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  client: string;
  value: number;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  startDate?: string;
  endDate?: string;
  type: 'project' | 'retainer' | 'service';
}

const mockContracts: Contract[] = [
  { id: '1', title: 'Website Development Agreement', client: 'Secured Tampa', value: 4500, status: 'signed', startDate: '2026-02-01', endDate: '2026-03-01', type: 'project' },
  { id: '2', title: 'Monthly Maintenance Retainer', client: 'Coffee Shop Denver', value: 500, status: 'signed', startDate: '2026-01-01', type: 'retainer' },
  { id: '3', title: 'E-commerce Development', client: 'Sneaker Store NYC', value: 8500, status: 'sent', type: 'project' },
  { id: '4', title: 'App Development Contract', client: 'Fitness Startup', value: 12000, status: 'draft', type: 'project' },
];

export default function ContractsPage() {
  const [contracts] = useState<Contract[]>(mockContracts);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'expired'>('all');

  const filtered = filter === 'all' ? contracts : contracts.filter(c => c.status === filter);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
      draft: { bg: 'bg-gray-500/20 text-gray-400', icon: <FileText size={12} /> },
      sent: { bg: 'bg-blue-500/20 text-blue-400', icon: <Clock size={12} /> },
      signed: { bg: 'bg-green-500/20 text-green-400', icon: <CheckCircle size={12} /> },
      expired: { bg: 'bg-red-500/20 text-red-400', icon: <AlertTriangle size={12} /> },
    };
    const style = styles[status];
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${style.bg}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  const activeValue = contracts.filter(c => c.status === 'signed').reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Manage client agreements and contracts</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
          <Plus size={16} />
          New Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Total Contracts</span>
          <p className="text-2xl font-bold mt-1">{contracts.length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Active</span>
          <p className="text-2xl font-bold mt-1 text-green-400">{contracts.filter(c => c.status === 'signed').length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Pending Signature</span>
          <p className="text-2xl font-bold mt-1 text-yellow-400">{contracts.filter(c => c.status === 'sent').length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Active Value</span>
          <p className="text-2xl font-bold mt-1">${activeValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'draft', 'sent', 'signed', 'expired'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filter === f
                ? 'bg-[#10b981] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Contracts list */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(contract => (
            <div key={contract.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Scale size={16} className="text-[var(--color-muted)] mt-0.5" />
                  <div>
                    <p className="font-medium">{contract.title}</p>
                    <p className="text-sm text-[var(--color-muted)]">{contract.client}</p>
                    <span className="text-xs text-[var(--color-muted)] bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">
                      {contract.type}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-semibold">${contract.value.toLocaleString()}</p>
                  {getStatusBadge(contract.status)}
                </div>
              </div>
              {(contract.startDate || contract.endDate) && (
                <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-muted)] ml-7">
                  {contract.startDate && <span>Start: {contract.startDate}</span>}
                  {contract.endDate && <span>End: {contract.endDate}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted)] text-center">
        💡 Tip: Connect DocuSign or PandaDoc for e-signatures
      </p>
    </div>
  );
}
