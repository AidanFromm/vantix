'use client';

import { useState } from 'react';
import { Search, Calendar, Tag, User } from 'lucide-react';

const memories = [
  {
    id: '1',
    date: '2024-02-07',
    type: 'decision',
    content: 'Stripe checkout first, then Clover - same webhook pattern for both',
    tags: ['stripe', 'clover', 'architecture'],
    author: 'Botskii',
  },
  {
    id: '2',
    date: '2024-02-07',
    type: 'learning',
    content: 'StockX API v2 does not return images - must construct from urlKey using CDN URL pattern',
    tags: ['stockx', 'api'],
    author: 'Botskii',
  },
  {
    id: '3',
    date: '2024-02-07',
    type: 'decision',
    content: 'NexGen as agency name - short, future-focused, scales from agency to tech company',
    tags: ['branding', 'nexgen'],
    author: 'Aidan',
  },
  {
    id: '4',
    date: '2024-02-06',
    type: 'learning',
    content: 'Microsoft Outlook login blocks headless browsers hard - use code relay method instead',
    tags: ['email', 'automation'],
    author: 'Botskii',
  },
  {
    id: '5',
    date: '2024-02-06',
    type: 'context',
    content: 'Kyle runs sneaker wholesale business - sells to stores across America. Agency is side business.',
    tags: ['kyle', 'business'],
    author: 'Aidan',
  },
];

const typeColors = {
  decision: 'bg-blue-500/20 text-blue-400',
  learning: 'bg-green-500/20 text-green-400',
  context: 'bg-purple-500/20 text-purple-400',
  note: 'bg-yellow-500/20 text-yellow-400',
};

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredMemories = memories.filter((m) => {
    const matchesSearch = searchQuery === '' || 
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === null || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Memory</h1>
        <p className="text-[var(--color-muted)] mt-1">Searchable log of decisions, learnings, and context</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder="Search memories..."
          />
        </div>
        <div className="flex gap-2">
          {['decision', 'learning', 'context'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filterType === type
                  ? 'bg-[var(--color-accent)] text-white'
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
          <div
            key={memory.id}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded capitalize ${typeColors[memory.type as keyof typeof typeColors]}`}>
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
            </div>
            <p className="text-white mb-4">{memory.content}</p>
            <div className="flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-white/5 border border-[var(--color-border)] rounded flex items-center gap-1"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
