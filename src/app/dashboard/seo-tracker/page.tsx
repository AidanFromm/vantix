'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Globe, ExternalLink, RefreshCw, Plus, Loader2 } from 'lucide-react';
import { getData } from '@/lib/data';

interface TrackedSite {
  id: string;
  domain: string;
  keywords: string[];
  lastChecked: string;
  metrics: {
    domainAuthority: number;
    backlinks: number;
    organicTraffic: number;
    change: number;
  };
}

export default function SEOTrackerPage() {
  const [sites, setSites] = useState<TrackedSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const d = await getData<TrackedSite>('seo_sites');
      setSites(d);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#B07A45]" />
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">SEO Tracker</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Monitor search rankings and organic traffic</p>
          </div>
        </div>
        <div className="text-center py-16 text-[var(--color-muted)]">
          <Globe size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium mb-4">No sites tracked yet</p>
          <button className="px-4 py-2 bg-[#B07A45] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#8E5E34] transition-colors mx-auto">
            <Plus size={16} />
            Add Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Tracker</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Monitor search rankings and organic traffic</p>
        </div>
        <button className="px-4 py-2 bg-[#B07A45] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#8E5E34] transition-colors">
          <Plus size={16} />
          Add Site
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-[var(--color-muted)]" />
            <span className="text-xs text-[var(--color-muted)]">Sites Tracked</span>
          </div>
          <p className="text-2xl font-bold">{sites.length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search size={16} className="text-[var(--color-muted)]" />
            <span className="text-xs text-[var(--color-muted)]">Total Keywords</span>
          </div>
          <p className="text-2xl font-bold">{sites.reduce((s, site) => s + site.keywords.length, 0)}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Total Traffic</span>
          </div>
          <p className="text-2xl font-bold">{sites.reduce((s, site) => s + site.metrics.organicTraffic, 0)}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Total Backlinks</span>
          </div>
          <p className="text-2xl font-bold">{sites.reduce((s, site) => s + site.metrics.backlinks, 0)}</p>
        </div>
      </div>

      {/* Sites list */}
      <div className="space-y-4">
        {sites.map(site => (
          <div key={site.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#B07A45]" />
                  <a 
                    href={`https://${site.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-[#B07A45] transition-colors"
                  >
                    {site.domain}
                  </a>
                  <ExternalLink size={12} className="text-[var(--color-muted)]" />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {site.keywords.map(kw => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 bg-[#EEE6DC]/5 text-[var(--color-muted)] rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-muted)]">Last: {site.lastChecked}</span>
                <button className="p-1.5 hover:bg-[#EEE6DC]/10 rounded-lg transition-colors">
                  <RefreshCw size={14} className="text-[var(--color-muted)]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-bg)] rounded-lg p-3">
                <span className="text-xs text-[var(--color-muted)]">Domain Authority</span>
                <p className="text-xl font-bold mt-1">{site.metrics.domainAuthority}</p>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3">
                <span className="text-xs text-[var(--color-muted)]">Backlinks</span>
                <p className="text-xl font-bold mt-1">{site.metrics.backlinks}</p>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3">
                <span className="text-xs text-[var(--color-muted)]">Organic Traffic</span>
                <p className="text-xl font-bold mt-1">{site.metrics.organicTraffic}</p>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3">
                <span className="text-xs text-[var(--color-muted)]">30-Day Change</span>
                <p className={`text-xl font-bold mt-1 flex items-center gap-1 ${site.metrics.change >= 0 ? 'text-[#C89A6A]' : 'text-[#B0614A]'}`}>
                  {site.metrics.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {site.metrics.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-muted)] text-center">
        Connect Google Search Console for real-time data
      </p>
    </div>
  );
}
