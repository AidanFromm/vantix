'use client';

import { useState } from 'react';
import { Mail, Send, Clock, CheckCircle, XCircle, Plus, User, Building } from 'lucide-react';

interface OutreachItem {
  id: string;
  company: string;
  contact: string;
  email: string;
  status: 'draft' | 'sent' | 'replied' | 'no-response';
  lastAction: string;
  notes?: string;
}

const mockOutreach: OutreachItem[] = [
  { id: '1', company: 'Local Gym', contact: 'Mike Johnson', email: 'mike@localgym.com', status: 'sent', lastAction: '2026-02-11', notes: 'Sent website audit offer' },
  { id: '2', company: 'Coffee Shop Denver', contact: 'Sarah', email: 'sarah@coffeedenver.com', status: 'replied', lastAction: '2026-02-10', notes: 'Interested, scheduling call' },
  { id: '3', company: 'Auto Repair Shop', contact: 'Owner', email: 'info@autorepair.com', status: 'no-response', lastAction: '2026-02-05' },
];

export default function OutreachPage() {
  const [items] = useState<OutreachItem[]>(mockOutreach);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'replied' | 'no-response'>('all');

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-500/20 text-gray-400',
      sent: 'bg-blue-500/20 text-blue-400',
      replied: 'bg-green-500/20 text-green-400',
      'no-response': 'bg-yellow-500/20 text-yellow-400',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Outreach</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Cold email & lead generation campaigns</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: items.length, icon: Mail },
          { label: 'Sent', value: items.filter(i => i.status === 'sent').length, icon: Send },
          { label: 'Replied', value: items.filter(i => i.status === 'replied').length, icon: CheckCircle },
          { label: 'No Response', value: items.filter(i => i.status === 'no-response').length, icon: Clock },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className="text-[var(--color-muted)]" />
              <span className="text-xs text-[var(--color-muted)]">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'draft', 'sent', 'replied', 'no-response'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filter === f
                ? 'bg-[#10b981] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            <Mail size={32} className="mx-auto mb-2 opacity-50" />
            <p>No outreach items</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(item => (
              <div key={item.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building size={14} className="text-[var(--color-muted)]" />
                      <span className="font-medium">{item.company}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                      <User size={12} />
                      <span>{item.contact}</span>
                      <span>•</span>
                      <a href={`mailto:${item.email}`} className="hover:text-white">{item.email}</a>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-[var(--color-muted)] mt-2">{item.notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">{item.lastAction}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
