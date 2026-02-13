'use client';

import { useState, useEffect } from 'react';
import { Inbox, Mail, MessageSquare, AlertCircle, Check, Archive, Star, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'contact' | 'audit' | 'notification';
  from: string;
  email?: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [contactRes, auditRes] = await Promise.all([
          fetch('/api/contact').then(r => r.json()).catch(() => ({ submissions: [] })),
          fetch('/api/audit-submit').then(r => r.json()).catch(() => ({ submissions: [] })),
        ]);

        const saved = JSON.parse(localStorage.getItem('vantix_inbox') || '{}');
        
        const contactMsgs: Message[] = (contactRes.submissions || []).map((s: any) => ({
          id: s.id,
          type: 'contact',
          from: s.name || 'Unknown',
          email: s.email,
          subject: 'Contact Form Submission',
          preview: s.message?.slice(0, 100) || 'No message',
          date: s.created_at || new Date().toISOString(),
          read: saved[s.id]?.read || false,
          starred: saved[s.id]?.starred || false,
        }));

        const auditMsgs: Message[] = (auditRes.submissions || []).map((s: any) => ({
          id: s.id,
          type: 'audit',
          from: s.name || 'Unknown',
          email: s.email,
          subject: 'Free Audit Request',
          preview: `Website: ${s.website || 'Not provided'}`,
          date: s.created_at || new Date().toISOString(),
          read: saved[s.id]?.read || false,
          starred: saved[s.id]?.starred || false,
        }));

        setMessages([...contactMsgs, ...auditMsgs].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch (e) {
        console.error('Failed to load inbox:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    const saved = JSON.parse(localStorage.getItem('vantix_inbox') || '{}');
    saved[id] = { ...saved[id], ...updates };
    localStorage.setItem('vantix_inbox', JSON.stringify(saved));
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'starred') return m.starred;
    return true;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    starred: messages.filter(m => m.starred).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#10b981]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {stats.unread} unread • {stats.total} total
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {([
          { key: 'all', label: 'All', count: stats.total },
          { key: 'unread', label: 'Unread', count: stats.unread },
          { key: 'starred', label: 'Starred', count: stats.starred },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              filter === f.key
                ? 'bg-[#10b981] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === f.key ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            <Inbox size={32} className="mx-auto mb-2 opacity-50" />
            <p>No messages</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                  !msg.read ? 'bg-white/[0.02]' : ''
                }`}
                onClick={() => updateMessage(msg.id, { read: true })}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateMessage(msg.id, { starred: !msg.starred });
                    }}
                    className="mt-1"
                  >
                    <Star
                      size={16}
                      className={msg.starred ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--color-muted)]'}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!msg.read ? 'text-white' : 'text-[var(--color-muted)]'}`}>
                          {msg.from}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          msg.type === 'contact' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {msg.type === 'contact' ? 'Contact' : 'Audit'}
                        </span>
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        )}
                      </div>
                      <span className="text-xs text-[var(--color-muted)]">
                        {new Date(msg.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{msg.subject}</p>
                    <p className="text-sm text-[var(--color-muted)] truncate">{msg.preview}</p>
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#10b981] hover:underline mt-1 inline-block"
                      >
                        {msg.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
