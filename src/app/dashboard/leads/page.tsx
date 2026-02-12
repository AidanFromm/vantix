'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Phone, Mail, Globe, Star, RefreshCw,
  ArrowUpDown, ChevronLeft, ChevronRight, Clock, Filter, X,
  Zap, TrendingUp, Target, MapPin, Download, SkipForward,
  BarChart3, ArrowRight, Trophy, XCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScraperLead {
  name: string;
  phone: string;
  email: string;
  website: string;
  category: string;
  city: string;
  state: string;
  source: string;
  description: string;
  found_at: string;
  web_status: string;
  score: number;
}

interface LeadTracking {
  [leadName: string]: {
    status: 'contacted' | 'responded' | 'proposal' | 'won' | 'lost';
    updatedAt: string;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'vantix_lead_tracking';
const ROWS_PER_PAGE = 12;

const FUNNEL_STAGES = ['total', 'contacted', 'responded', 'proposal', 'won'] as const;
const FUNNEL_LABELS: Record<string, string> = {
  total: 'Total Leads',
  contacted: 'Contacted',
  responded: 'Responded',
  proposal: 'Proposal Sent',
  won: 'Closed / Won',
};
const FUNNEL_COLORS: Record<string, string> = {
  total: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  responded: 'bg-orange-500',
  proposal: 'bg-purple-500',
  won: 'bg-emerald-500',
};

const REACH_TIMES = [
  { window: 'Tuesday - Thursday, 10:00 AM - 11:30 AM', reason: 'Highest answer rates for B2B cold outreach' },
  { window: 'Wednesday, 2:00 PM - 4:00 PM', reason: 'Decision makers available after lunch' },
  { window: 'Monday, 8:00 AM - 9:00 AM', reason: 'Early week planning -- top of mind' },
];

type TabId = 'all' | 'hitlist' | 'funnel' | 'analytics' | 'winloss';

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: 'all', label: 'All Leads', icon: Users },
  { id: 'hitlist', label: 'Hit List', icon: Target },
  { id: 'funnel', label: 'Funnel', icon: BarChart3 },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'winloss', label: 'Win/Loss', icon: Trophy },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scoreColor = (score: number) => {
  if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score >= 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
};

const webStatusLabel = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    no_website: { label: 'No Website', color: 'text-red-400' },
    facebook_only: { label: 'Facebook Only', color: 'text-yellow-400' },
    has_website: { label: 'Has Website', color: 'text-emerald-400' },
    weak_website: { label: 'Weak Site', color: 'text-orange-400' },
  };
  return map[status] || { label: status, color: 'text-[var(--color-muted)]' };
};

function loadTracking(): LeadTracking {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveTracking(t: LeadTracking) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch { /* ignore */ }
}

function loadLocalLeads(): ScraperLead[] {
  try {
    const raw = localStorage.getItem('vantix_leads_export');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed?.leads && Array.isArray(parsed.leads)) return parsed.leads;
    }
  } catch { /* ignore */ }
  return [];
}

function priorityScore(lead: ScraperLead): number {
  let s = lead.score * 10;
  if (lead.email) s += 15;
  if (lead.phone) s += 15;
  if (lead.web_status === 'no_website' || lead.web_status === 'weak_website') s += 10;
  if (lead.web_status === 'facebook_only') s += 5;
  return s;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<ScraperLead[]>([]);
  const [tracking, setTracking] = useState<LeadTracking>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('all');

  // All Leads filters
  const [search, setSearch] = useState('');
  const [scoreRange, setScoreRange] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'score' | 'name' | 'city'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Hit list
  const [batchOffset, setBatchOffset] = useState(0);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const json = await res.json();
        const apiLeads: ScraperLead[] = json.leads || [];
        const localLeads = loadLocalLeads();
        const byName = new Map<string, ScraperLead>();
        for (const l of apiLeads) byName.set(l.name, l);
        for (const l of localLeads) { if (!byName.has(l.name)) byName.set(l.name, l); }
        setLeads(Array.from(byName.values()));
        setLastSync(new Date().toISOString());
      } else {
        const local = loadLocalLeads();
        if (local.length) setLeads(local);
      }
    } catch {
      const local = loadLocalLeads();
      if (local.length) setLeads(local);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setTracking(loadTracking());
    fetchLeads().finally(() => setLoading(false));
  }, [fetchLeads]);

  const handleSync = async () => {
    setSyncing(true);
    await fetchLeads();
    setSyncing(false);
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const cities = useMemo(() => [...new Set(leads.map((l) => l.city).filter(Boolean))].sort(), [leads]);
  const categories = useMemo(() => [...new Set(leads.map((l) => l.category).filter(Boolean))].sort(), [leads]);

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (scoreRange === 'high') result = result.filter((l) => l.score >= 8);
    else if (scoreRange === 'mid') result = result.filter((l) => l.score >= 5 && l.score <= 7);
    else if (scoreRange === 'low') result = result.filter((l) => l.score >= 1 && l.score <= 4);
    if (cityFilter !== 'all') result = result.filter((l) => l.city === cityFilter);
    if (categoryFilter !== 'all') result = result.filter((l) => l.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.name.toLowerCase().includes(q) || l.category.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'score') cmp = a.score - b.score;
      else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'city') cmp = a.city.localeCompare(b.city);
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [leads, scoreRange, cityFilter, categoryFilter, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ROWS_PER_PAGE));
  const pagedLeads = filteredLeads.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const ranked = useMemo(() => [...leads].sort((a, b) => priorityScore(b) - priorityScore(a)), [leads]);
  const hitList = useMemo(() => {
    const unworked = ranked.filter((l) => !tracking[l.name] || tracking[l.name].status === 'contacted');
    return unworked.slice(batchOffset, batchOffset + 10);
  }, [ranked, tracking, batchOffset]);
  const hotLeads = useMemo(() => ranked.filter((l) => l.score >= 8), [ranked]);

  const funnelCounts = useMemo(() => {
    const counts: Record<string, number> = { total: leads.length, contacted: 0, responded: 0, proposal: 0, won: 0 };
    Object.values(tracking).forEach((t) => {
      if (t.status === 'contacted') counts.contacted++;
      if (t.status === 'responded') { counts.contacted++; counts.responded++; }
      if (t.status === 'proposal') { counts.contacted++; counts.responded++; counts.proposal++; }
      if (t.status === 'won') { counts.contacted++; counts.responded++; counts.proposal++; counts.won++; }
    });
    return counts;
  }, [leads, tracking]);

  const lostCount = useMemo(() => Object.values(tracking).filter((t) => t.status === 'lost').length, [tracking]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { total: number; hot: number }> = {};
    leads.forEach((l) => {
      const cat = l.category || 'Unknown';
      if (!map[cat]) map[cat] = { total: 0, hot: 0 };
      map[cat].total++;
      if (l.score >= 8) map[cat].hot++;
    });
    return Object.entries(map).sort((a, b) => b[1].hot - a[1].hot).slice(0, 10);
  }, [leads]);

  const cityBreakdown = useMemo(() => {
    const map: Record<string, { total: number; hot: number; avgScore: number }> = {};
    leads.forEach((l) => {
      const city = l.city || 'Unknown';
      if (!map[city]) map[city] = { total: 0, hot: 0, avgScore: 0 };
      map[city].total++;
      map[city].avgScore += l.score;
      if (l.score >= 8) map[city].hot++;
    });
    Object.values(map).forEach((v) => { v.avgScore = Math.round((v.avgScore / v.total) * 10) / 10; });
    return Object.entries(map).sort((a, b) => b[1].hot - a[1].hot || b[1].avgScore - a[1].avgScore).slice(0, 12);
  }, [leads]);

  // Win/loss tracked leads
  const wonLeads = useMemo(() => Object.entries(tracking).filter(([, t]) => t.status === 'won').map(([name, t]) => ({ name, ...t })), [tracking]);
  const lostLeads = useMemo(() => Object.entries(tracking).filter(([, t]) => t.status === 'lost').map(([name, t]) => ({ name, ...t })), [tracking]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const updateTracking = (name: string, status: LeadTracking[string]['status']) => {
    setTracking((prev) => {
      const next = { ...prev, [name]: { status, updatedAt: new Date().toISOString() } };
      saveTracking(next);
      return next;
    });
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const activeFilterCount = [scoreRange !== 'all', cityFilter !== 'all', categoryFilter !== 'all'].filter(Boolean).length;
  const clearFilters = () => { setScoreRange('all'); setCityFilter('all'); setCategoryFilter('all'); setPage(1); };

  const exportHotLeads = () => {
    const csv = ['Name,Category,City,Phone,Email,Score,Priority']
      .concat(hotLeads.map((l) => `"${l.name}","${l.category}","${l.city}","${l.phone}","${l.email}",${l.score},${priorityScore(l)}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'hot-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const emailTopN = (n: number) => {
    const emails = hotLeads.slice(0, n).map((l) => l.email).filter(Boolean);
    if (emails.length) window.open(`mailto:${emails.join(',')}`);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalLeads = leads.length;
  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = leads.filter((l) => l.phone).length;
  const avgScore = leads.length > 0 ? (leads.reduce((s, l) => s + l.score, 0) / leads.length).toFixed(1) : '0';

  const statCards = [
    { label: 'Total Leads', value: totalLeads.toString(), icon: Users, accent: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Hot Leads', value: hotLeads.length.toString(), icon: TrendingUp, accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Won', value: funnelCounts.won.toString(), icon: Trophy, accent: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Avg Score', value: avgScore, icon: Star, accent: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  const funnelMax = Math.max(funnelCounts.total, 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads Center</h1>
          <p className="text-[var(--color-muted)] mt-1">Database, outreach, and conversion tracking</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-muted)]">
            <Clock size={12} />
            {lastSync ? <span>Synced: {new Date(lastSync).toLocaleTimeString()}</span> : <span>Not yet synced</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => emailTopN(5)}
            className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm font-medium">
            <Mail size={15} /> Email top 5
          </button>
          <button onClick={exportHotLeads}
            className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] border border-[var(--color-border)] hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Download size={15} /> Export
          </button>
          <button onClick={handleSync} disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 text-sm font-medium">
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> Sync
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--color-muted)]">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon size={18} className={card.accent} />
                </div>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-[var(--color-muted)] hover:text-white'
              }`}>
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* ═══ ALL LEADS ═══ */}
        {activeTab === 'all' && (
          <motion.div key="all" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-white/5 text-[var(--color-muted)] hover:text-white border-transparent'
                  }`}>
                  <Filter size={16} /> Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
                  )}
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-white transition-colors">
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input type="text" placeholder="Search leads..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
              </div>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-2 block">Score Range</label>
                      <select value={scoreRange} onChange={(e) => { setScoreRange(e.target.value as typeof scoreRange); setPage(1); }}
                        className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
                        <option value="all">All Scores</option>
                        <option value="high">High (8-10)</option>
                        <option value="mid">Medium (5-7)</option>
                        <option value="low">Low (1-4)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-2 block">City</label>
                      <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                        className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
                        <option value="all">All Cities</option>
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-2 block">Category</label>
                      <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
                        <option value="all">All Categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] text-left">
                      <th className="px-5 py-4 font-medium">
                        <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">
                          Business {sortField === 'name' && <ArrowUpDown size={14} />}
                        </button>
                      </th>
                      <th className="px-5 py-4 font-medium">Category</th>
                      <th className="px-5 py-4 font-medium">
                        <button onClick={() => toggleSort('city')} className="flex items-center gap-1 hover:text-white transition-colors">
                          City {sortField === 'city' && <ArrowUpDown size={14} />}
                        </button>
                      </th>
                      <th className="px-5 py-4 font-medium">Phone</th>
                      <th className="px-5 py-4 font-medium">Email</th>
                      <th className="px-5 py-4 font-medium">Web Status</th>
                      <th className="px-5 py-4 font-medium">
                        <button onClick={() => toggleSort('score')} className="flex items-center gap-1 hover:text-white transition-colors">
                          Score {sortField === 'score' && <ArrowUpDown size={14} />}
                        </button>
                      </th>
                      <th className="px-5 py-4 font-medium">Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedLeads.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-16 text-[var(--color-muted)]">No leads match your filters</td></tr>
                    ) : (
                      pagedLeads.map((lead, i) => {
                        const ws = webStatusLabel(lead.web_status);
                        const status = tracking[lead.name]?.status;
                        return (
                          <motion.tr key={`${lead.name}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                            className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-4 font-medium text-white">{lead.name}</td>
                            <td className="px-5 py-4 text-[var(--color-muted)] capitalize">{lead.category}</td>
                            <td className="px-5 py-4 text-[var(--color-muted)]">{lead.city}{lead.state ? `, ${lead.state}` : ''}</td>
                            <td className="px-5 py-4 text-[var(--color-muted)]">
                              {lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                                  <Phone size={13} /> {lead.phone}
                                </a>
                              ) : <span className="opacity-40">--</span>}
                            </td>
                            <td className="px-5 py-4 text-[var(--color-muted)]">
                              {lead.email ? (
                                <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                                  <Mail size={13} /> {lead.email}
                                </a>
                              ) : <span className="opacity-40">--</span>}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`flex items-center gap-1.5 text-sm ${ws.color}`}>
                                <Globe size={14} /> {ws.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${scoreColor(lead.score)}`}>
                                {lead.score}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <select value={status || ''} onChange={(e) => { if (e.target.value) updateTracking(lead.name, e.target.value as LeadTracking[string]['status']); }}
                                className="bg-white/5 border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500/50 text-[var(--color-muted)]">
                                <option value="">--</option>
                                <option value="contacted">Contacted</option>
                                <option value="responded">Responded</option>
                                <option value="proposal">Proposal</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                              </select>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">
                    {(page - 1) * ROWS_PER_PAGE + 1}-{Math.min(page * ROWS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"><ChevronLeft size={16} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ HIT LIST ═══ */}
        {activeTab === 'hitlist' && (
          <motion.div key="hitlist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--color-muted)]">Top unworked leads ranked by conversion likelihood</p>
              <button onClick={() => setBatchOffset((o) => o + 10)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-[var(--color-muted)] border border-[var(--color-border)] hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
                <SkipForward size={15} /> Next batch
              </button>
            </div>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                <span className="text-sm font-medium">Batch {Math.floor(batchOffset / 10) + 1}</span>
                <span className="text-xs text-[var(--color-muted)]">{hitList.length} leads</span>
              </div>
              {hitList.length === 0 ? (
                <div className="text-center py-16 text-[var(--color-muted)]">All leads in the current pool have been worked. Reset or skip batch.</div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {hitList.map((lead, i) => {
                    const status = tracking[lead.name]?.status;
                    return (
                      <motion.div key={lead.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                            {batchOffset + i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{lead.name}</p>
                            <p className="text-xs text-[var(--color-muted)] truncate">{lead.category} -- {lead.city}{lead.state ? `, ${lead.state}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                            {lead.score}/10
                          </span>
                          <span className="text-[10px] text-[var(--color-muted)]">P:{priorityScore(lead)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center transition-colors" title={lead.phone}>
                              <Phone size={14} className="text-emerald-400" />
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors" title={lead.email}>
                              <Mail size={14} className="text-blue-400" />
                            </a>
                          )}
                          <button onClick={() => updateTracking(lead.name, 'won')}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${status === 'won' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 hover:bg-emerald-500/10 text-[var(--color-muted)] hover:text-emerald-400'}`}
                            title="Mark as Won"><Trophy size={14} /></button>
                          <button onClick={() => updateTracking(lead.name, 'lost')}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${status === 'lost' ? 'bg-red-500/30 text-red-300' : 'bg-white/5 hover:bg-red-500/10 text-[var(--color-muted)] hover:text-red-400'}`}
                            title="Mark as Lost"><XCircle size={14} /></button>
                          <select value={status || ''} onChange={(e) => { if (e.target.value) updateTracking(lead.name, e.target.value as LeadTracking[string]['status']); }}
                            className="bg-white/5 border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500/50 text-[var(--color-muted)]">
                            <option value="">Stage...</option>
                            <option value="contacted">Contacted</option>
                            <option value="responded">Responded</option>
                            <option value="proposal">Proposal</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ FUNNEL ═══ */}
        {activeTab === 'funnel' && (
          <motion.div key="funnel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-6">Conversion Funnel</h2>
              <div className="space-y-4">
                {FUNNEL_STAGES.map((stage, i) => {
                  const count = funnelCounts[stage];
                  const pct = funnelMax > 0 ? (count / funnelMax) * 100 : 0;
                  return (
                    <div key={stage}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-[var(--color-muted)]">{FUNNEL_LABELS[stage]}</span>
                        <span className="text-sm font-semibold">{count}</span>
                      </div>
                      <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 2)}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className={`h-full ${FUNNEL_COLORS[stage]} rounded-lg flex items-center justify-end pr-3`}>
                          {pct > 10 && <span className="text-xs font-semibold text-white">{Math.round(pct)}%</span>}
                        </motion.div>
                      </div>
                      {i < FUNNEL_STAGES.length - 1 && (
                        <div className="flex justify-center py-1 text-[var(--color-muted)]"><ArrowRight size={14} className="rotate-90" /></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center gap-4">
                <span className="text-sm text-red-400">Lost: {lostCount}</span>
                {funnelCounts.total > 0 && (
                  <span className="text-sm text-[var(--color-muted)]">
                    Win rate: {funnelCounts.won > 0 ? Math.round((funnelCounts.won / (funnelCounts.won + lostCount)) * 100) : 0}%
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Clock size={18} className="text-emerald-400" /> Best Time to Reach Out</h2>
              <div className="space-y-3">
                {REACH_TIMES.map((rt, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{rt.window}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{rt.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Category breakdown */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Category Breakdown</h2>
              <div className="space-y-3">
                {categoryBreakdown.map(([cat, data]) => {
                  const hotPct = data.total > 0 ? (data.hot / data.total) * 100 : 0;
                  return (
                    <div key={cat} className="flex items-center gap-4">
                      <span className="text-sm text-[var(--color-muted)] w-40 truncate capitalize" title={cat}>{cat}</span>
                      <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(hotPct, 2)}%` }}
                          transition={{ duration: 0.5 }} className="h-full bg-emerald-500/60 rounded-lg" />
                      </div>
                      <span className="text-xs text-[var(--color-muted)] w-20 text-right">{data.hot} hot / {data.total}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* City heatmap */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><MapPin size={18} className="text-emerald-400" /> City Heatmap</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cityBreakdown.map(([city, data], i) => (
                  <motion.div key={city} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)] hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{city}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">{data.hot} hot</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                      <span>{data.total} total</span>
                      <span>Avg: {data.avgScore}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: `${Math.min((data.avgScore / 10) * 100, 100)}%` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ WIN/LOSS ═══ */}
        {activeTab === 'winloss' && (
          <motion.div key="winloss" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Won', value: wonLeads.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Trophy },
                { label: 'Lost', value: lostLeads.length, color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
                { label: 'Win Rate', value: wonLeads.length + lostLeads.length > 0 ? `${Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100)}%` : '--', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: BarChart3 },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[var(--color-muted)]">{s.label}</span>
                      <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                        <Icon size={16} className={s.color} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Won leads */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-border)]">
                <h2 className="font-semibold flex items-center gap-2"><Trophy size={16} className="text-emerald-400" /> Won ({wonLeads.length})</h2>
              </div>
              {wonLeads.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-muted)] text-sm">No won leads yet</div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {wonLeads.map((l) => (
                    <div key={l.name} className="px-5 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{l.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--color-muted)]">{new Date(l.updatedAt).toLocaleDateString()}</span>
                        <button onClick={() => updateTracking(l.name, 'lost')} className="text-xs text-[var(--color-muted)] hover:text-red-400 transition-colors">Move to lost</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lost leads */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-border)]">
                <h2 className="font-semibold flex items-center gap-2"><XCircle size={16} className="text-red-400" /> Lost ({lostLeads.length})</h2>
              </div>
              {lostLeads.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-muted)] text-sm">No lost leads</div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {lostLeads.map((l) => (
                    <div key={l.name} className="px-5 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{l.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--color-muted)]">{new Date(l.updatedAt).toLocaleDateString()}</span>
                        <button onClick={() => updateTracking(l.name, 'won')} className="text-xs text-[var(--color-muted)] hover:text-emerald-400 transition-colors">Move to won</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

