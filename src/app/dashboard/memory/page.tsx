'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Tag, User, Plus, X } from 'lucide-react';

interface Memory {
  id: string;
  date: string;
  type: 'decision' | 'learning' | 'context' | 'note';
  content: string;
  tags: string[];
  author: string;
}

const STORAGE_KEY = 'vantix_memories';

const defaultMemories: Memory[] = [
  {
    id: '1',
    date: '2026-02-10',
    type: 'decision',
    content: 'Dashboard uses localStorage for all persistence - no Supabase dependency. Each page has its own key with try/catch fallbacks.',
    tags: ['architecture', 'dashboard', 'localStorage'],
    author: 'Vantix',
  },
  {
    id: '2',
    date: '2026-02-09',
    type: 'milestone' as any,
    content: 'Sports Arb Bot FOK fix deployed - bot running stable with WebSocket auto-reconnect on DigitalOcean.',
    tags: ['sports-bot', 'deployment'],
    author: 'Botskii',
  },
  {
    id: '3',
    date: '2026-02-09',
    type: 'learning',
    content: 'CardLedger beats all competitors (Unboxed, Tradeblock) on features. Needs camera scanner implementation and Apple Sign In to launch.',
    tags: ['cardledger', 'competitive-analysis'],
    author: 'Botskii',
  },
  {
    id: '4',
    date: '2026-02-08',
    type: 'context',
    content: 'Dave (Secured Tampa) still has not sent Clover merchant credentials. Follow up needed. Stripe webhooks are live.',
    tags: ['dave', 'secured-tampa', 'clover'],
    author: 'Aidan',
  },
  {
    id: '5',
    date: '2026-02-07',
    type: 'decision',
    content: 'Vantix is the agency name. Short, future-focused, scales from agency to tech company. Domain: usevantix.com',
    tags: ['branding', 'vantix'],
    author: 'Kyle',
  },
  {
    id: '6',
    date: '2026-02-07',
    type: 'context',
    content: 'Kyle runs sneaker wholesale business - sells to stores across America. Agency is a side business with Aidan.',
    tags: ['kyle', 'business'],
    author: 'Aidan',
  },
  {
    id: '7',
    date: '2026-02-05',
    type: 'learning',
    content: 'StockX API v2 does not return images - must construct from urlKey using CDN URL pattern.',
    tags: ['stockx', 'api'],
    author: 'Botskii',
  },
];

const typeColors: Record<string, string> = {
  decision: 'bg-blue-500/20 text-blue-400',
  learning: 'bg-green-500/20 text-green-400',
  context: 'bg-purple-500/20 text-purple-400',
  note: 'bg-yellow-500/20 text-yellow-400',
  milestone: 'bg-emerald-500/20 text-emerald-400',
};

function loadMemories(): Memory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fallback */ }
  return defaultMemories;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ content: '', type: 'note' as Memory['type'], tags: '' });

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const saveMemories = useCallback((updated: Memory[]) => {
    setMemories(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }, []);

  const addMemory = () => {
    if (!newMemory.content.trim()) return;
    const mem: Memory = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newMemory.type,
      content: newMemory.content,
      tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: 'You',
    };
    saveMemories([mem, ...memories]);
    setNewMemory({ content: '', type: 'note', tags: '' });
    setShowAddForm(false);
  };

  const deleteMemory = (id: string) => {
    saveMemories(memories.filter(m => m.id !== id));
  };

  const filteredMemories = memories.filter((m) => {
    const matchesSearch = searchQuery === '' ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === null || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Memory</h1>
          <p className="text-[var(--color-muted)] mt-1">Searchable log of decisions, learnings, and context</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black px-4 py-2 rounded-xl font-medium transition-all"
        >
          <Plus size={20} />
          Add Memory
        </button>
      </div>

      {/* Add Memory Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">New Memory</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <textarea
              value={newMemory.content}
              onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
              className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent)] transition-colors min-h-[80px] resize-none"
              placeholder="What do you want to remember?"
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-muted)] mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newMemory.tags}
                  onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                  className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                  placeholder="e.g. project, idea, client"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-muted)] mb-1">Type</label>
                <select
                  value={newMemory.type}
                  onChange={(e) => setNewMemory({ ...newMemory, type: e.target.value as Memory['type'] })}
                  className="bg-[var(--color-primary)] border border-[var(--color-border)] rounded-xl px-4 py-2 focus:outline-none text-sm"
                >
                  <option value="note">Note</option>
                  <option value="decision">Decision</option>
                  <option value="learning">Learning</option>
                  <option value="context">Context</option>
                </select>
              </div>
            </div>
            <button
              onClick={addMemory}
              disabled={!newMemory.content.trim()}
              className="bg-[var(--color-accent)] text-black px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent)]/80"
            >
              Save Memory
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder="Search memories..."
          />
        </div>
        <div className="flex gap-2">
          {['decision', 'learning', 'context', 'note'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={`px-4 py-2 rounded-xl capitalize transition-colors ${
                filterType === type
                  ? 'bg-[var(--color-accent)] text-black font-medium'
                  : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-muted)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-4">
        {filteredMemories.map((memory) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded capitalize ${typeColors[memory.type] || typeColors.note}`}>
                  {memory.type}
                </span>
                <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                  <Calendar size={12} />
                  {memory.date}
                </span>
                <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                  <User size={12} />
                  {memory.author}
                </span>
              </div>
              <button
                onClick={() => deleteMemory(memory.id)}
                className="p-1 opacity-0 group-hover:opacity-100 text-[var(--color-muted)] hover:text-red-400 transition-all"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-white mb-4">{memory.content}</p>
            <div className="flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-white/5 border border-[var(--color-border)] rounded flex items-center gap-1">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
        {filteredMemories.length === 0 && (
          <div className="text-center py-12 text-[var(--color-muted)]">
            <p>No memories match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

