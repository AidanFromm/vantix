'use client';

import { useState, useEffect } from 'react';
import { Image, ExternalLink, Plus, Eye, Calendar, Tag, Loader2 } from 'lucide-react';
import { getData, createRecord } from '@/lib/data';

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

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getData<PortfolioItem>('portfolio');
      setItems(d);
      setLoading(false);
    })();
  }, []);

  const allTags = [...new Set(items.flatMap(i => i.tags))];
  const filtered = selectedTag ? items.filter(i => i.tags.includes(selectedTag)) : items;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#B07A45]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Showcase your best work</p>
        </div>
        <button className="px-4 py-2 bg-[#B07A45] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#8E5E34] transition-colors">
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {items.length > 0 && (
        <>
          {/* Tags filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                !selectedTag
                  ? 'bg-[#B07A45] text-white'
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
                    ? 'bg-[#B07A45] text-white'
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
              <div key={item.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[#B07A45]/50 transition-colors">
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-[#B07A45]/20 to-[#B07A45]/5 flex items-center justify-center">
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
                        className="text-[10px] px-2 py-0.5 bg-[#B07A45]/20 text-[#B07A45] rounded-full"
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
              <Tag size={32} className="mx-auto mb-2 opacity-50" />
              <p>No items match that tag</p>
            </div>
          )}
        </>
      )}

      {items.length === 0 && (
        <div className="text-center py-16 text-[var(--color-muted)]">
          <Image size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium mb-4">No portfolio items yet</p>
          <button className="px-4 py-2 bg-[#B07A45] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#8E5E34] transition-colors mx-auto">
            <Plus size={16} />
            Add Project
          </button>
        </div>
      )}
    </div>
  );
}
