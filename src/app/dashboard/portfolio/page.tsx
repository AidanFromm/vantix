'use client';

import { useState } from 'react';
import { Image, ExternalLink, Plus, Eye, Calendar, Tag } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  tags: string[];
  date: string;
  views: number;
}

const mockPortfolio: PortfolioItem[] = [
  { 
    id: '1', 
    title: 'Secured Tampa', 
    description: 'E-commerce platform for sneaker and Pokemon card store with Clover POS integration',
    tags: ['Next.js', 'Supabase', 'Stripe', 'iOS'],
    date: '2026-02',
    views: 124,
    url: 'https://securedtampa.com'
  },
  { 
    id: '2', 
    title: 'CardLedger', 
    description: 'Portfolio tracker for collectible cards - Pokemon, sports cards, TCGs',
    tags: ['React', 'TypeScript', 'Capacitor', 'Supabase'],
    date: '2026-01',
    views: 89,
    url: 'https://usecardledger.com'
  },
  { 
    id: '3', 
    title: 'Vantix Dashboard', 
    description: 'Internal agency management dashboard',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    date: '2026-02',
    views: 45
  },
];

export default function PortfolioPage() {
  const [items] = useState<PortfolioItem[]>(mockPortfolio);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(items.flatMap(i => i.tags))];
  const filtered = selectedTag ? items.filter(i => i.tags.includes(selectedTag)) : items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Showcase your best work</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Tags filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
            !selectedTag
              ? 'bg-[#10b981] text-white'
              : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
          }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              selectedTag === tag
                ? 'bg-[#10b981] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] hover:text-white border border-[var(--color-border)]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Portfolio grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[#10b981]/50 transition-colors">
            {/* Image placeholder */}
            <div className="aspect-video bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 flex items-center justify-center">
              <Image size={32} className="text-[var(--color-muted)]" />
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-[#EEE6DC]/10 rounded transition-colors"
                  >
                    <ExternalLink size={14} className="text-[var(--color-muted)]" />
                  </a>
                )}
              </div>
              
              <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-[10px] px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {item.date}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {item.views} views
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          <Image size={32} className="mx-auto mb-2 opacity-50" />
          <p>No portfolio items found</p>
        </div>
      )}
    </div>
  );
}
