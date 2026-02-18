'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, User, Calendar } from 'lucide-react';

interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  name: string;
  phone: string;
  date: string;
  duration: string;
  notes?: string;
}

const mockCalls: Call[] = [
  { id: '1', type: 'incoming', name: 'Dave (Secured Tampa)', phone: '+1 (813) 555-0123', date: '2026-02-12 14:30', duration: '12:34', notes: 'Discussed inventory system updates' },
  { id: '2', type: 'outgoing', name: 'New Lead - Mike', phone: '+1 (720) 555-0456', date: '2026-02-12 11:15', duration: '5:22', notes: 'Initial consultation call' },
  { id: '3', type: 'missed', name: 'Unknown', phone: '+1 (303) 555-0789', date: '2026-02-11 16:45', duration: '0:00' },
  { id: '4', type: 'incoming', name: 'Kyle', phone: '+1 (908) 555-1234', date: '2026-02-11 10:00', duration: '23:15', notes: 'Vantix planning session' },
];

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');

  const filteredCalls = filter === 'all' ? calls : calls.filter(c => c.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming size={16} className="text-[#C89A6A]" />;
      case 'outgoing': return <PhoneOutgoing size={16} className="text-[#C89A6A]" />;
      case 'missed': return <PhoneMissed size={16} className="text-[#B0614A]" />;
      default: return <Phone size={16} />;
    }
  };

  const stats = {
    total: calls.length,
    incoming: calls.filter(c => c.type === 'incoming').length,
    outgoing: calls.filter(c => c.type === 'outgoing').length,
    missed: calls.filter(c => c.type === 'missed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phone Calls</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Track and log all business calls</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Calls', value: stats.total, icon: Phone, color: 'text-white' },
          { label: 'Incoming', value: stats.incoming, icon: PhoneIncoming, color: 'text-[#C89A6A]' },
          { label: 'Outgoing', value: stats.outgoing, icon: PhoneOutgoing, color: 'text-[#C89A6A]' },
          { label: 'Missed', value: stats.missed, icon: PhoneMissed, color: 'text-[#B0614A]' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-[var(--color-muted)]">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'incoming', 'outgoing', 'missed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === f
                ? 'bg-[#B07A45] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Call list */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {filteredCalls.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            <Phone size={32} className="mx-auto mb-2 opacity-50" />
            <p>No calls to display</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredCalls.map(call => (
              <div key={call.id} className="p-4 hover:bg-[#EEE6DC]/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(call.type)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{call.name}</span>
                        <span className="text-xs text-[var(--color-muted)]">{call.phone}</span>
                      </div>
                      {call.notes && (
                        <p className="text-sm text-[var(--color-muted)] mt-1">{call.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[var(--color-muted)]">
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar size={12} />
                      {call.date}
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Clock size={12} />
                      {call.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--color-muted)] text-center">
        💡 Tip: Connect with a VoIP service to auto-log calls
      </p>
    </div>
  );
}
