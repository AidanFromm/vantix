'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, Users, Building2, Mail, Phone, DollarSign,
  FolderKanban, FileText, MessageSquare, Clock, Star, ArrowLeft,
  TrendingUp, Receipt, ChevronDown, Edit3, Save, Trash2,
  Heart, Filter, BarChart3, Zap, RefreshCw, StickyNote,
  ExternalLink, Calendar, Tag, Activity, Paperclip, Eye,
  MoreHorizontal, ChevronRight, Globe, MapPin, UserPlus, Briefcase,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

interface ClientNote {
  id: string;
  content: string;
  author: string;
  date: string;
}

interface ClientFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface ActivityEntry {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'invoice' | 'project';
  description: string;
  date: string;
  user: string;
}

interface ProjectRef {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  value: number;
}

interface InvoiceRef {
  id: string;
  number: string;
  amount: number;
  status: 'paid' | 'sent' | 'overdue' | 'draft';
  dueDate: string;
}

interface Client {
  id: string;
  company: string;
  website?: string;
  industry?: string;
  address?: string;
  status: 'active' | 'inactive' | 'lead';
  monthlyValue: number;
  totalRevenue: number;
  tags: string[];
  contacts: Contact[];
  notes: ClientNote[];
  files: ClientFile[];
  activities: ActivityEntry[];
  projects: ProjectRef[];
  invoices: InvoiceRef[];
  createdAt: string;
  lastActivityAt: string;
}

type Tab = 'overview' | 'contacts' | 'projects' | 'invoices' | 'activity' | 'notes' | 'files';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'contacts', label: 'Contacts', icon: Users },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'invoices', label: 'Invoices', icon: Receipt },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'files', label: 'Files', icon: Paperclip },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const STORAGE_KEY = 'vantix_clients_v2';

function getInitialClients(): Client[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'dave-secured-tampa',
      company: 'Secured Tampa',
      website: 'securedtampa.com',
      industry: 'E-commerce/Retail',
      status: 'active',
      monthlyValue: 0,
      totalRevenue: 2000,
      tags: ['E-commerce', 'Sneakers', 'Pokemon'],
      contacts: [{ id: '1', name: 'Dave', email: '', phone: '', role: 'Owner', isPrimary: true }],
      notes: [{ id: '1', content: 'Owes $2,500 + 3% of online sales for 3 months. Total deal: $4,500 base + rev share.', author: 'System', date: now }],
      files: [],
      activities: [],
      projects: [{ id: 'dave-app', name: 'Dave App', status: 'active', progress: 90, value: 4500 }],
      invoices: [
        { id: 'inv-1', number: 'INV-001', amount: 2000, status: 'paid', dueDate: '2026-02-01' },
        { id: 'inv-2', number: 'INV-002', amount: 2500, status: 'sent', dueDate: '2026-02-28' },
      ],
      createdAt: '2026-01-15T00:00:00Z',
      lastActivityAt: now,
    },
    {
      id: 'j4k',
      company: 'Just Four Kicks (J4K)',
      website: 'justfourkicks.store',
      industry: 'B2B Wholesale',
      status: 'active',
      monthlyValue: 0,
      totalRevenue: 0,
      tags: ['B2B', 'Sneakers', 'Kyle'],
      contacts: [{ id: '1', name: 'Kyle', email: '', phone: '', role: 'CEO', isPrimary: true }],
      notes: [{ id: '1', content: 'Kyle partnership - ongoing platform maintenance and features.', author: 'System', date: now }],
      files: [],
      activities: [],
      projects: [{ id: 'j4k-maintenance', name: 'Platform Maintenance', status: 'active', progress: 100, value: 0 }],
      invoices: [],
      createdAt: '2026-01-01T00:00:00Z',
      lastActivityAt: now,
    },
    {
      id: 'cardledger',
      company: 'CardLedger',
      website: 'usecardledger.com',
      industry: 'Fintech/Collectibles',
      status: 'active',
      monthlyValue: 0,
      totalRevenue: 0,
      tags: ['Internal', 'App', 'iOS'],
      contacts: [{ id: '1', name: 'Aidan', email: '', phone: '', role: 'Founder', isPrimary: true }],
      notes: [{ id: '1', content: 'Internal project - portfolio tracker for collectible cards.', author: 'System', date: now }],
      files: [],
      activities: [],
      projects: [{ id: 'cardledger-v2', name: 'CardLedger V2', status: 'active', progress: 65, value: 0 }],
      invoices: [],
      createdAt: '2026-01-01T00:00:00Z',
      lastActivityAt: now,
    },
    {
      id: '601-prospect',
      company: '601',
      website: '',
      industry: 'E-commerce/Shopify',
      status: 'lead',
      monthlyValue: 0,
      totalRevenue: 0,
      tags: ['Prospect', 'Shopify', 'Hot Lead'],
      contacts: [],
      notes: [{ id: '1', content: 'Hot lead - Shopify upgrade project, trying to close $2,000 deal.', author: 'System', date: now }],
      files: [],
      activities: [],
      projects: [],
      invoices: [],
      createdAt: now,
      lastActivityAt: now,
    },
  ];
}

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return getInitialClients(); // Start with real clients
}

function saveClients(clients: Client[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)); } catch { /* ignore */ }
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-500', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  inactive: { label: 'Inactive', color: 'bg-gray-500', textColor: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' },
  lead: { label: 'Lead', color: 'bg-amber-500', textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
};

const invoiceStatusConfig = {
  paid: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  sent: { label: 'Sent', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  overdue: { label: 'Overdue', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  draft: { label: 'Draft', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' },
};

const activityIcons = {
  email: Mail,
  call: Phone,
  meeting: Calendar,
  note: StickyNote,
  invoice: Receipt,
  project: FolderKanban,
};

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [valueRange, setValueRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Detail view
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState<{
    company: string; website: string; industry: string; contactName: string; email: string; phone: string; status: 'active' | 'inactive' | 'lead';
  }>({
    company: '', website: '', industry: '', contactName: '', email: '', phone: '', status: 'lead',
  });

  // Note input
  const [newNote, setNewNote] = useState('');

  // Load clients
  useEffect(() => {
    setClients(loadClients());
    setLoading(false);
  }, []);

  // Save clients on change
  useEffect(() => {
    if (!loading) saveClients(clients);
  }, [clients, loading]);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    clients.forEach(c => c.tags.forEach(t => tags.add(t)));
    return [...tags].sort();
  }, [clients]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || 
        c.company.toLowerCase().includes(q) ||
        c.contacts.some(ct => ct.name.toLowerCase().includes(q) || ct.email.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchTag = tagFilter === 'all' || c.tags.includes(tagFilter);
      const matchValue = valueRange === 'all' ||
        (valueRange === 'high' && c.monthlyValue >= 5000) ||
        (valueRange === 'mid' && c.monthlyValue >= 2000 && c.monthlyValue < 5000) ||
        (valueRange === 'low' && c.monthlyValue < 2000);
      return matchSearch && matchStatus && matchTag && matchValue;
    });
  }, [clients, search, statusFilter, tagFilter, valueRange]);

  // Stats
  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalMRR: clients.reduce((s, c) => s + c.monthlyValue, 0),
    totalRevenue: clients.reduce((s, c) => s + c.totalRevenue, 0),
  }), [clients]);

  // Add client
  const handleAddClient = () => {
    if (!newClient.company.trim()) return;
    const client: Client = {
      id: uid(),
      company: newClient.company,
      website: newClient.website || undefined,
      industry: newClient.industry || undefined,
      status: newClient.status,
      monthlyValue: 0,
      totalRevenue: 0,
      tags: [],
      contacts: newClient.contactName ? [{
        id: uid(),
        name: newClient.contactName,
        email: newClient.email,
        phone: newClient.phone,
        role: '',
        isPrimary: true,
      }] : [],
      notes: [],
      files: [],
      activities: [{
        id: uid(),
        type: 'note',
        description: 'Client created',
        date: new Date().toISOString(),
        user: 'You',
      }],
      projects: [],
      invoices: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    setClients(prev => [client, ...prev]);
    setNewClient({ company: '', website: '', industry: '', contactName: '', email: '', phone: '', status: 'lead' });
    setShowAddModal(false);
  };

  // Add note
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedClient) return;
    const note: ClientNote = {
      id: uid(),
      content: newNote,
      author: 'You',
      date: new Date().toISOString(),
    };
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id 
        ? { ...c, notes: [note, ...c.notes], lastActivityAt: new Date().toISOString() }
        : c
    ));
    setSelectedClient(prev => prev ? { ...prev, notes: [note, ...prev.notes] } : null);
    setNewNote('');
  };

  // Delete client
  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    setSelectedClient(null);
  };

  // Active filter count
  const activeFilterCount = [statusFilter !== 'all', tagFilter !== 'all', valueRange !== 'all'].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <RefreshCw size={24} className="text-emerald-400" />
        </motion.div>
      </div>
    );
  }

  // ─── Detail Slide-Over ─────────────────────────────────────────────────────
  const renderDetailPanel = () => {
    if (!selectedClient) return null;
    const client = selectedClient;
    const primary = client.contacts.find(c => c.isPrimary) || client.contacts[0];
    const sc = statusConfig[client.status];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedClient(null)} />
        
        {/* Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl h-full bg-[#0d0d0d]/95 backdrop-blur-xl border-l border-[var(--color-border)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--color-border)] shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-400 shadow-lg shadow-emerald-500/5">
                  {getInitials(client.company)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{client.company}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sc.bgColor} ${sc.textColor} ${sc.borderColor} font-medium uppercase tracking-wider`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.color} mr-1.5`} />
                      {sc.label}
                    </span>
                    {client.industry && (
                      <span className="text-xs text-[var(--color-muted)]">{client.industry}</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-muted)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: 'Monthly Value', value: formatCurrency(client.monthlyValue), icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
                { label: 'Total Revenue', value: formatCurrency(client.totalRevenue), icon: TrendingUp, color: 'text-blue-400 bg-blue-500/10' },
                { label: 'Projects', value: String(client.projects.length), icon: FolderKanban, color: 'text-purple-400 bg-purple-500/10' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-md ${s.color}`}><s.icon size={12} /></div>
                    <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{s.label}</span>
                  </div>
                  <div className="text-base font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 border-b border-[var(--color-border)] flex gap-1 overflow-x-auto shrink-0">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  activeTab === t.key ? 'bg-emerald-500/20 text-emerald-400' : 'text-[var(--color-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Contact info */}
                    {primary && (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                        <h4 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Primary Contact</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-sm font-bold text-blue-400">
                            {getInitials(primary.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{primary.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{primary.role || 'No role'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {primary.email && (
                            <a href={`mailto:${primary.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                              <Mail size={12} /> {primary.email}
                            </a>
                          )}
                          {primary.phone && (
                            <a href={`tel:${primary.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors">
                              <Phone size={12} /> {primary.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Website & Address */}
                    <div className="grid grid-cols-2 gap-3">
                      {client.website && (
                        <a href={client.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-white hover:border-emerald-500/30 transition-colors">
                          <Globe size={14} className="text-emerald-400" />
                          <span className="truncate">{client.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink size={12} className="ml-auto shrink-0" />
                        </a>
                      )}
                      {client.address && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)] text-sm text-[var(--color-muted)]">
                          <MapPin size={14} className="text-blue-400 shrink-0" />
                          <span className="truncate">{client.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {client.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {client.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                            <Tag size={10} className="inline mr-1" />{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recent activity */}
                    <div>
                      <h4 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                        {client.activities.slice(0, 5).map(activity => {
                          const Icon = activityIcons[activity.type];
                          return (
                            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <Icon size={14} className="text-[var(--color-muted)]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{activity.description}</p>
                                <p className="text-xs text-[var(--color-muted)]">{formatDate(activity.date)}</p>
                              </div>
                            </div>
                          );
                        })}
                        {client.activities.length === 0 && (
                          <p className="text-sm text-[var(--color-muted)] text-center py-4">No activity yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <div className="space-y-3">
                    {client.contacts.map(contact => (
                      <div key={contact.id} className="p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)] hover:border-emerald-500/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-sm font-bold text-blue-400">
                            {getInitials(contact.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white">{contact.name}</p>
                              {contact.isPrimary && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Primary</span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--color-muted)]">{contact.role || 'No role'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors">
                              <Mail size={12} /> Email
                            </a>
                          )}
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors">
                              <Phone size={12} /> Call
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                    {client.contacts.length === 0 && (
                      <div className="text-center py-8">
                        <Users size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">No contacts added</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-3">
                    {client.projects.map(project => (
                      <div key={project.id} className="p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-white">{project.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            project.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                          <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${project.progress}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-[var(--color-muted)]">
                          <span>{project.progress}% complete</span>
                          <span>{formatCurrency(project.value)}</span>
                        </div>
                      </div>
                    ))}
                    {client.projects.length === 0 && (
                      <div className="text-center py-8">
                        <FolderKanban size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">No projects yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'invoices' && (
                  <div className="space-y-3">
                    {client.invoices.map(invoice => {
                      const isc = invoiceStatusConfig[invoice.status];
                      return (
                        <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                          <div>
                            <p className="text-sm font-medium text-white">{invoice.number}</p>
                            <p className="text-xs text-[var(--color-muted)]">Due: {invoice.dueDate}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white">{formatCurrency(invoice.amount)}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${isc.color}`}>
                              {isc.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {client.invoices.length === 0 && (
                      <div className="text-center py-8">
                        <Receipt size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">No invoices yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3">
                    {client.activities.map(activity => {
                      const Icon = activityIcons[activity.type];
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon size={14} className="text-[var(--color-muted)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-muted)]">
                              <span>{activity.user}</span>
                              <span>•</span>
                              <span>{formatDate(activity.date)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {client.activities.length === 0 && (
                      <div className="text-center py-8">
                        <Activity size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">No activity recorded</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    {/* Add note */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                        className="flex-1 px-4 py-2.5 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                      <button onClick={handleAddNote} disabled={!newNote.trim()}
                        className="px-4 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 disabled:opacity-50 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Notes list */}
                    {client.notes.map(note => (
                      <div key={note.id} className="p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                        <p className="text-sm text-white">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-muted)]">
                          <span>{note.author}</span>
                          <span>•</span>
                          <span>{formatDate(note.date)}</span>
                        </div>
                      </div>
                    ))}
                    {client.notes.length === 0 && !newNote && (
                      <div className="text-center py-6">
                        <StickyNote size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">No notes yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="space-y-3">
                    {client.files.map(file => (
                      <div key={file.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <FileText size={18} className="text-[var(--color-muted)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-xs text-[var(--color-muted)]">{file.size} • {formatDate(file.uploadedAt)}</p>
                        </div>
                      </div>
                    ))}
                    {client.files.length === 0 && (
                      <div className="text-center py-8">
                        <Paperclip size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
                        <p className="text-sm text-[var(--color-muted)]">No files uploaded</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between shrink-0">
            <button onClick={() => handleDeleteClient(client.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm">
              <Trash2 size={14} /> Delete
            </button>
            <div className="flex gap-2">
              {primary?.email && (
                <a href={`mailto:${primary.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors text-sm">
                  <Mail size={14} /> Email
                </a>
              )}
              {primary?.phone && (
                <a href={`tel:${primary.phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm">
                  <Phone size={14} /> Call
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ─── Main View ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm"
        >
          <Plus size={18} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Clients', value: stats.total, icon: Users, color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
          { label: 'Active', value: stats.active, icon: Zap, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
          { label: 'Monthly Revenue', value: formatCurrency(stats.totalMRR), icon: DollarSign, color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20' },
          { label: 'Lifetime Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400', borderColor: 'border-purple-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.iconColor} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            
            {/* Glassmorphism overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search clients, contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/[0.03] backdrop-blur-sm border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
            showFilters || activeFilterCount > 0
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-white/[0.03] text-[var(--color-muted)] border-[var(--color-border)] hover:text-white'
          }`}
        >
          <Filter size={16} /> Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-[var(--color-border)]">
              <div>
                <label className="text-xs text-[var(--color-muted)] mb-2 block">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-muted)] mb-2 block">Tags</label>
                <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
                  <option value="all">All Tags</option>
                  {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-muted)] mb-2 block">Value Range</label>
                <select value={valueRange} onChange={e => setValueRange(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50">
                  <option value="all">All Values</option>
                  <option value="high">$5,000+</option>
                  <option value="mid">$2,000 - $5,000</option>
                  <option value="low">Under $2,000</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map((client, i) => {
          const primary = client.contacts.find(c => c.isPrimary) || client.contacts[0];
          const sc = statusConfig[client.status];
          
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => { setSelectedClient(client); setActiveTab('overview'); }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-[var(--color-border)] p-5 cursor-pointer hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
            >
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0">
                  {getInitials(client.company)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {client.company}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.bgColor} ${sc.textColor} ${sc.borderColor}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.color} mr-1`} />
                      {sc.label}
                    </span>
                    {client.industry && (
                      <span className="text-[10px] text-[var(--color-muted)]">{client.industry}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact */}
              {primary && (
                <div className="mb-4">
                  <p className="text-sm text-white truncate">{primary.name}</p>
                  <p className="text-xs text-[var(--color-muted)] truncate">{primary.email}</p>
                </div>
              )}

              {/* Value & Activity */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[var(--color-muted)]">Monthly Value</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(client.monthlyValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-muted)]">Last Activity</p>
                  <p className="text-sm text-white">{formatDate(client.lastActivityAt)}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {client.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-[var(--color-muted)]">
                    {tag}
                  </span>
                ))}
                {client.tags.length > 3 && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-[var(--color-muted)]">
                    +{client.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
                {primary?.email && (
                  <a href={`mailto:${primary.email}`} onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-[var(--color-muted)] hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                    <Mail size={14} />
                  </a>
                )}
                {primary?.phone && (
                  <a href={`tel:${primary.phone}`} onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-[var(--color-muted)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                    <Phone size={14} />
                  </a>
                )}
                <button onClick={e => { e.stopPropagation(); setSelectedClient(client); setActiveTab('overview'); }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors ml-auto">
                  <Eye size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-[var(--color-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {search || activeFilterCount > 0 ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            {search || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Add your first client to get started'}
          </p>
          {!search && activeFilterCount === 0 && (
            <button onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors text-sm font-medium">
              <Plus size={16} /> Add Client
            </button>
          )}
        </div>
      )}

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedClient && renderDetailPanel()}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0d0d0d]/95 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Add New Client</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-muted)] hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Company Info */}
                <div className="space-y-3">
                  <h3 className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Company Information</h3>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={newClient.company}
                      onChange={e => setNewClient({ ...newClient, company: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                      <input
                        type="text"
                        placeholder="Website"
                        value={newClient.website}
                        onChange={e => setNewClient({ ...newClient, website: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                      <input
                        type="text"
                        placeholder="Industry"
                        value={newClient.industry}
                        onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Primary Contact</h3>
                  <div className="relative">
                    <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={newClient.contactName}
                      onChange={e => setNewClient({ ...newClient, contactName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newClient.email}
                        onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={newClient.phone}
                        onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2 block">Status</label>
                  <div className="flex gap-2">
                    {(['lead', 'active', 'inactive'] as const).map(status => {
                      const sc = statusConfig[status];
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setNewClient({ ...newClient, status })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                            newClient.status === status
                              ? `${sc.bgColor} ${sc.textColor} ${sc.borderColor}`
                              : 'bg-white/5 text-[var(--color-muted)] border-[var(--color-border)] hover:text-white'
                          }`}
                        >
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleAddClient} disabled={!newClient.company.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-emerald-500/20">
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
