'use client';

import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Globe, ExternalLink, RefreshCw, Plus } from 'lucide-react';

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

const mockSites: TrackedSite[] = [
  { 
    id: '1', 
    domain: 'usevantix.com',
    keywords: ['agency', 'web development', 'digital solutions'],
    lastChecked: '2026-02-12',
    metrics: { domainAuthority: 15, backlinks: 24, organicTraffic: 150, change: 12 }
  },
  { 
    id: '2', 
    domain: 'usecardledger.com',
    keywords: ['card tracker', 'pokemon cards', 'collectibles'],
    lastChecked: '2026-02-12',
    metrics: { domainAuthority: 8, backlinks: 12, organicTraffic: 89, change: 25 }
  },
  { 
    id: '3', 
    domain: 'securedtampa.com',
    keywords: ['sneakers tampa', 'pokemon cards tampa'],
    lastChecked: '2026-02-11',
    metrics: { domainAuthority: 5, backlinks: 3, organicTraffic: 45, change: -5 }
  },
];

export default function SEOTrackerPage() {
  const [sites] = useState<TrackedSite[]>(mockSites);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Tracker</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Monitor search rankings and organic traffic</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
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
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-xs text-[var(--color-muted)]">Total Traffic</span>
          </div>
          <p className="text-2xl font-bold">{sites.reduce((s, site) => s + site.metrics.organicTraffic, 0)}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink size={16} className="text-blue-400" />
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
                  <Globe size={16} className="text-[#10b981]" />
                  <a 
                    href={`https://${site.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-[#10b981] transition-colors"
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
                <p className={`text-xl font-bold mt-1 flex items-center gap-1 ${site.metrics.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {site.metrics.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {site.metrics.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-muted)] text-center">
        💡 Connect Google Search Console for real-time data
      </p>
    </div>
  );
}
