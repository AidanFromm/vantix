'use client';

import { useState } from 'react';
import { Handshake, FileText, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  client: string;
  value: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  lastActivity: string;
  closeDate?: string;
}

const mockDeals: Deal[] = [
  { id: '1', name: 'E-commerce Platform', client: 'Sneaker Store NYC', value: 8500, stage: 'proposal', lastActivity: '2026-02-11' },
  { id: '2', name: 'Mobile App MVP', client: 'Fitness Startup', value: 12000, stage: 'negotiation', lastActivity: '2026-02-10' },
  { id: '3', name: 'Website Redesign', client: 'Local Restaurant', value: 3500, stage: 'discovery', lastActivity: '2026-02-12' },
  { id: '4', name: 'Secured Tampa', client: 'Dave', value: 4500, stage: 'won', lastActivity: '2026-02-08', closeDate: '2026-02-10' },
];

const stageColors: Record<string, string> = {
  discovery: 'bg-[#B07A45]/50/20 text-[#C89A6A] border-[#B07A45]/50/30',
  proposal: 'bg-[#B07A45]/50/20 text-[#C89A6A] border-[#B07A45]/50/30',
  negotiation: 'bg-[#B07A45]/20 text-[#C89A6A] border-[#B07A45]/30',
  closing: 'bg-[#B07A45]/20 text-[#C89A6A] border-[#B07A45]/30',
  won: 'bg-[#B07A45]/50/20 text-[#C89A6A] border-[#B07A45]/50/30',
  lost: 'bg-[#B0614A]/50/20 text-[#B0614A] border-[#B0614A]/50/30',
};

export default function DealRoomPage() {
  const [deals] = useState<Deal[]>(mockDeals);

  const totalPipeline = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const wonDeals = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deal Room</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Track deals from discovery to close</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Handshake size={16} className="text-[var(--color-muted)]" />
            <span className="text-xs text-[var(--color-muted)]">Active Deals</span>
          </div>
          <p className="text-2xl font-bold">{deals.filter(d => !['won', 'lost'].includes(d.stage)).length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Pipeline Value</span>
          </div>
          <p className="text-2xl font-bold text-[#C89A6A]">${totalPipeline.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Won This Month</span>
          </div>
          <p className="text-2xl font-bold text-[#C89A6A]">${wonDeals.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Avg Close Time</span>
          </div>
          <p className="text-2xl font-bold">14 days</p>
        </div>
      </div>

      {/* Kanban-style stages */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {['discovery', 'proposal', 'negotiation', 'closing', 'won', 'lost'].map(stage => (
          <div key={stage} className="space-y-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center border ${stageColors[stage]}`}>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </div>
            {deals.filter(d => d.stage === stage).map(deal => (
              <div key={deal.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3">
                <p className="font-medium text-sm truncate">{deal.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{deal.client}</p>
                <p className="text-sm font-semibold text-[#B07A45] mt-2">${deal.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
