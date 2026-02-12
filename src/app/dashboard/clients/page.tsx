'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Users, Building2, Mail, Phone, DollarSign,
  FolderKanban, FileText, MessageSquare, Clock, Star, ArrowLeft,
  TrendingUp, Receipt, GitPullRequest, ChevronDown, Trash2, Edit2, Save,
  Heart, Filter, BarChart3, Zap, RefreshCw, StickyNote, Share2,
} from 'lucide-react';
import {
  getAllClientNames, getClientOverview, runAllSyncs, ls, lsSet, KEYS,
  type ClientOverview, type PipelineLead, type Project, type Invoice, type Proposal,
  type Communication, type TimeEntry, type FeedbackEntry,
} from '@/lib/databridge';

// ─── Types ───────────────────────────────────────────────────────

interface ClientRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  status: 'active' | 'completed' | 'prospect';
  startDate: string;
  notes: { id: string; content: string; author: string; date: string }[];
  files: { id: string; name: string; content: string; lastUpdated: string }[];
}

type Tab = 'overview' | 'pipeline' | 'projects' | 'invoices' | 'proposals' | 'comms' | 'time' | 'feedback';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'pipeline', label: 'Pipeline', icon: GitPullRequest },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'invoices', label: 'Invoices', icon: Receipt },
  { key: 'proposals', label: 'Proposals', icon: FileText },
  { key: 'comms', label: 'Comms', icon: MessageSquare },
  { key: 'time', label: 'Time', icon: Clock },
  { key: 'feedback', label: 'Feedback', icon: Star },
];

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function healthColor(score: number) {
  if (score >= 70) return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30';
  if (score >= 40) return 'text-amber-400 bg-amber-400/10 border-amber-500/30';
  return 'text-red-400 bg-red-400/10 border-red-500/30';
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  prospect: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

// ─── Component ───────────────────────────────────────────────────

export default function ClientsPage() {
  const [clientNames, setClientNames] = useState<string[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [overview, setOverview] = useState<ClientOverview | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '' });
  const [loaded, setLoaded] = useState(false);

  // Load + merge clients from all systems
  const load = useCallback(() => {
    // Run syncs first
    try { runAllSyncs(); } catch { /* */ }

    const names = getAllClientNames();
    setClientNames(names);

    // Merge with existing client records
    const existing = ls<ClientRecord[]>(KEYS.clients, []);
    const merged = [...existing];

    for (const name of names) {
      const found = merged.find(c =>
        c.company?.toLowerCase() === name.toLowerCase() || c.name?.toLowerCase() === name.toLowerCase()
      );
      if (!found) {
        // Determine status
        const ov = getClientOverview(name);
        let status: 'active' | 'completed' | 'prospect' = 'prospect';
        if (ov.projects.some(p => p.stage !== 'complete' && p.stage !== 'completed')) status = 'active';
        else if (ov.projects.some(p => p.stage === 'complete' || p.stage === 'completed')) status = 'completed';
        else if (ov.pipelineDeals.length > 0) status = 'prospect';

        merged.push({
          id: uid(),
          name: name,
          company: name,
          email: ov.pipelineDeals[0]?.contactEmail || '',
          phone: ov.pipelineDeals[0]?.contactPhone || null,
          status,
          startDate: ov.pipelineDeals[0]?.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
          notes: [],
          files: [],
        });
      }
    }

    setClients(merged);
    lsSet(KEYS.clients, merged);
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Select a client
  const selectClient = (name: string) => {
    setSelected(name);
    setActiveTab('overview');
    setOverview(getClientOverview(name));
  };

  // Add client
  const handleAddClient = () => {
    if (!newClient.company.trim()) return;
    const updated = [...clients, {
      id: uid(),
      name: newClient.name || newClient.company,
      company: newClient.company,
      email: newClient.email,
      phone: newClient.phone || null,
      status: 'prospect' as const,
      startDate: new Date().toISOString().slice(0, 10),
      notes: [],
      files: [],
    }];
    setClients(updated);
    lsSet(KEYS.clients, updated);
    setNewClient({ name: '', company: '', email: '', phone: '' });
    setShowAdd(false);
  };

  // Filter
  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const lifetimeValue = clients.reduce((s, c) => {
    const ov = getClientOverview(c.company || c.name);
    return s + ov.totalRevenue;
  }, 0);
  const avgProjectSize = (() => {
    const projects = ls<Project[]>(KEYS.projects, []);
    const invoices = ls<Invoice[]>(KEYS.invoices, []);
    const total = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.items.reduce((a, it) => a + it.amount, 0), 0);
    return projects.length ? Math.round(total / projects.length) : 0;
  })();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <RefreshCw size={24} className="text-emerald-400" />
        </motion.div>
      </div>
    );
  }

  // ─── 360 Detail View ──────────────────────────────────────────
  if (selected && overview) {
    const client = clients.find(c => c.company === selected || c.name === selected);
    return (
      <div className="space-y-4 sm:space-y-6 pb-12">
        {/* Back */}
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Clients
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center text-2xl font-bold text-[var(--color-accent)]">
              {selected[0]}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{selected}</h1>
              <div className="flex items-center gap-3 mt-1">
                {client && <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[client.status]}`}>{client.status}</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${healthColor(overview.healthScore)}`}>
                  <Heart size={9} className="inline mr-1" />{overview.healthScore}% Health
                </span>
              </div>
            </div>
          </div>
          {client?.email && (
            <a href={`mailto:${client.email}`} className="text-xs text-[var(--color-muted)] hover:text-white flex items-center gap-1">
              <Mail size={13} /> {client.email}
            </a>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Revenue', value: `$${overview.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400 bg-emerald-400/10' },
            { label: 'Owed', value: `$${overview.totalOwed.toLocaleString()}`, icon: Receipt, color: 'text-red-400 bg-red-400/10' },
            { label: 'Hours', value: String(overview.totalHours), icon: Clock, color: 'text-blue-400 bg-blue-400/10' },
            { label: 'Projects', value: String(overview.projects.length), icon: FolderKanban, color: 'text-purple-400 bg-purple-400/10' },
          ].map(s => (
            <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg ${s.color}`}><s.icon size={13} /></div>
                <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{s.label}</span>
              </div>
              <div className="text-lg font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                activeTab === t.key ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 sm:p-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">360° Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Pipeline Deals:</span> <span className="text-white font-medium ml-1">{overview.pipelineDeals.length}</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Proposals:</span> <span className="text-white font-medium ml-1">{overview.proposals.length}</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Invoices (Paid/Total):</span> <span className="text-white font-medium ml-1">{overview.invoices.filter(i => i.status === 'paid').length}/{overview.invoices.length}</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Communications:</span> <span className="text-white font-medium ml-1">{overview.communications.length}</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Feedback:</span> <span className="text-white font-medium ml-1">{overview.feedback.length} entries</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Referrals:</span> <span className="text-white font-medium ml-1">{overview.referrals.length}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Pipeline Deals</h3>
              {overview.pipelineDeals.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No pipeline deals</p>}
              {overview.pipelineDeals.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                  <div>
                    <span className="text-white font-medium">{d.businessName}</span>
                    <span className="text-[var(--color-muted)] ml-2">Stage: {d.stage.replace(/_/g, ' ')}</span>
                  </div>
                  {d.value && <span className="text-emerald-400 font-medium">${d.value.toLocaleString()}</span>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Projects</h3>
              {overview.projects.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No projects</p>}
              {overview.projects.map(p => (
                <div key={p.id} className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{p.projectName}</span>
                    <span className="text-[var(--color-muted)]">{p.stage}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-[var(--color-muted)]">
                    <span>{p.progress}%</span>
                    <span>Due: {p.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Invoices</h3>
              {overview.invoices.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No invoices</p>}
              {overview.invoices.map(inv => {
                const total = inv.items.reduce((a, it) => a + it.amount, 0);
                const sc: Record<string, string> = { paid: 'text-emerald-400', sent: 'text-blue-400', overdue: 'text-red-400', draft: 'text-[var(--color-muted)]' };
                return (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                    <div>
                      <span className="text-white font-medium">{inv.number}</span>
                      <span className={`ml-2 ${sc[inv.status] || ''}`}>{inv.status}</span>
                    </div>
                    <span className="text-white font-medium">${total.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Proposals</h3>
              {overview.proposals.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No proposals</p>}
              {overview.proposals.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                  <div>
                    <span className="text-white font-medium">{p.projectTitle}</span>
                    <span className="text-[var(--color-muted)] ml-2">{p.status}</span>
                  </div>
                  <span className="text-emerald-400 font-medium">${p.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comms' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Communications</h3>
              {overview.communications.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No communications logged</p>}
              {overview.communications.map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{c.type}</span>
                    <span className="text-[var(--color-muted)]">{c.date}</span>
                  </div>
                  <p className="text-[var(--color-muted)]">{c.summary}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'time' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Time Tracked — {overview.totalHours}h total</h3>
              {overview.timeEntries.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No time entries</p>}
              {overview.timeEntries.slice(0, 20).map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                  <span className="text-[var(--color-muted)]">{t.date} — {t.description || t.project || ''}</span>
                  <span className="text-white font-medium">{t.hours}h</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Feedback</h3>
              {overview.feedback.length === 0 && <p className="text-xs text-[var(--color-muted)] py-4 text-center">No feedback</p>}
              {overview.feedback.map(f => (
                <div key={f.id} className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < f.rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--color-border)]'} />
                    ))}
                    <span className="text-[var(--color-muted)] ml-2">{f.date}</span>
                  </div>
                  {f.comment && <p className="text-[var(--color-muted)]">{f.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ─── Client List View ─────────────────────────────────────────
  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Unified 360° view across all systems</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black px-4 py-2 rounded-xl font-medium transition-all text-sm"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Clients', value: totalClients, icon: Users, color: 'text-blue-400 bg-blue-400/10' },
          { label: 'Active', value: activeClients, icon: Zap, color: 'text-emerald-400 bg-emerald-400/10' },
          { label: 'Lifetime Value', value: `$${lifetimeValue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-400 bg-amber-400/10' },
          { label: 'Avg Project', value: `$${avgProjectSize.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400 bg-purple-400/10' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${s.color}`}><s.icon size={13} /></div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="text-lg font-bold text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed', 'prospect'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs capitalize transition-colors ${
                filterStatus === s ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filtered.map((client, i) => {
          const ov = getClientOverview(client.company || client.name);
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => selectClient(client.company || client.name)}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-lg font-bold text-[var(--color-accent)] shrink-0">
                  {(client.company || client.name)[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{client.company || client.name}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${statusColors[client.status]}`}>{client.status}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${healthColor(ov.healthScore)}`}>
                      {ov.healthScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-[11px] text-[var(--color-muted)]">
                    {ov.projects.length > 0 && <span>{ov.projects.length} project{ov.projects.length !== 1 ? 's' : ''}</span>}
                    {ov.totalRevenue > 0 && <span className="text-emerald-400">${ov.totalRevenue.toLocaleString()}</span>}
                    {ov.invoices.filter(i => i.status === 'overdue').length > 0 && (
                      <span className="text-red-400">{ov.invoices.filter(i => i.status === 'overdue').length} overdue</span>
                    )}
                  </div>
                </div>
                <ChevronDown size={16} className="text-[var(--color-muted)] -rotate-90 group-hover:text-white transition-colors shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
          <p className="text-sm text-[var(--color-muted)]">{search ? 'No clients match your search' : 'No clients yet'}</p>
        </div>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Add Client</h2>
                <button onClick={() => setShowAdd(false)} className="text-[var(--color-muted)] hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Company / Business', key: 'company', icon: Building2 },
                  { label: 'Contact Name', key: 'name', icon: Users },
                  { label: 'Email', key: 'email', icon: Mail },
                  { label: 'Phone', key: 'phone', icon: Phone },
                ].map(f => (
                  <div key={f.key} className="relative">
                    <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      placeholder={f.label}
                      value={(newClient as any)[f.key]}
                      onChange={e => setNewClient({ ...newClient, [f.key]: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddClient}
                  disabled={!newClient.company.trim()}
                  className="w-full py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  Add Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

