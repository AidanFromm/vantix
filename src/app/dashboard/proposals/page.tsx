'use client';

import { useState } from 'react';
import { FileText, Plus, Send, Eye, Download, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  client: string;
  value: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  createdAt: string;
  sentAt?: string;
}

const mockProposals: Proposal[] = [
  { id: '1', title: 'E-commerce Platform Development', client: 'Sneaker Store NYC', value: 8500, status: 'sent', createdAt: '2026-02-10', sentAt: '2026-02-11' },
  { id: '2', title: 'Mobile App MVP', client: 'Fitness Startup', value: 12000, status: 'viewed', createdAt: '2026-02-08', sentAt: '2026-02-09' },
  { id: '3', title: 'Website Redesign Package', client: 'Local Restaurant', value: 3500, status: 'draft', createdAt: '2026-02-12' },
  { id: '4', title: 'Inventory System', client: 'Secured Tampa', value: 4500, status: 'accepted', createdAt: '2026-02-01', sentAt: '2026-02-02' },
];

export default function ProposalsPage() {
  const [proposals] = useState<Proposal[]>(mockProposals);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'>('all');

  const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText size={14} className="text-gray-400" />;
      case 'sent': return <Send size={14} className="text-blue-400" />;
      case 'viewed': return <Eye size={14} className="text-yellow-400" />;
      case 'accepted': return <CheckCircle size={14} className="text-green-400" />;
      case 'rejected': return <XCircle size={14} className="text-red-400" />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500/20 text-gray-400',
      sent: 'bg-blue-500/20 text-blue-400',
      viewed: 'bg-yellow-500/20 text-yellow-400',
      accepted: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || '';
  };

  const totalValue = proposals.reduce((s, p) => s + p.value, 0);
  const acceptedValue = proposals.filter(p => p.status === 'accepted').reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Create and track client proposals</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
          <Plus size={16} />
          New Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Total Proposals</span>
          <p className="text-2xl font-bold mt-1">{proposals.length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Total Value</span>
          <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Accepted Value</span>
          <p className="text-2xl font-bold mt-1 text-green-400">${acceptedValue.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <span className="text-xs text-[var(--color-muted)]">Win Rate</span>
          <p className="text-2xl font-bold mt-1">{proposals.length > 0 ? Math.round((proposals.filter(p => p.status === 'accepted').length / proposals.length) * 100) : 0}%</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected'] as const).map(f => (
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

      {/* Proposals list */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(proposal => (
            <div key={proposal.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(proposal.status)}
                  <div>
                    <p className="font-medium">{proposal.title}</p>
                    <p className="text-sm text-[var(--color-muted)]">{proposal.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#10b981]">${proposal.value.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(proposal.status)}`}>
                    {proposal.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-muted)]">
                <span>Created: {proposal.createdAt}</span>
                {proposal.sentAt && <span>Sent: {proposal.sentAt}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
