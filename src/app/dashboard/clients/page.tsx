'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users, UserPlus, Search, Filter, X, Edit2, Trash2, ChevronDown, ChevronRight,
  Building2, Mail, Phone, Tag, FileText, DollarSign, Activity, Clock, AlertTriangle,
  CheckCircle2, XCircle, BarChart3, Plus, MessageSquare
} from 'lucide-react';

// --- Types ---
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Active' | 'At Risk' | 'Churned';
  healthScore: number;
  revenue: number;
  tags: string[];
  notes: string;
  lastContact: string;
  createdAt: string;
  projects: { name: string; status: string }[];
  invoices: { id: string; amount: number; status: string; date: string }[];
  activity: { action: string; date: string }[];
}

// --- localStorage helpers ---
function lsGet<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function lsSet(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

const SEED_CLIENTS: Client[] = [];

const emptyClient: Omit<Client, 'id' | 'createdAt' | 'projects' | 'invoices' | 'activity'> = {
  name: '', email: '', phone: '', company: '', status: 'Active', healthScore: 50,
  revenue: 0, tags: [], notes: '', lastContact: new Date().toISOString().split('T')[0],
};

// --- Components ---

function StatusBadge({ status }: { status: Client['status'] }) {
  const map: Record<string, { bg: string; icon: typeof CheckCircle2 }> = {
    active: { bg: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    Active: { bg: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    inactive: { bg: 'bg-gray-100 text-gray-600', icon: XCircle },
    'at risk': { bg: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
    'At Risk': { bg: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
    churned: { bg: 'bg-red-100 text-red-700', icon: XCircle },
    Churned: { bg: 'bg-red-100 text-red-700', icon: XCircle },
    prospect: { bg: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  };
  const { bg, icon: Icon } = map[status] || map[(status || '').toLowerCase()] || map['active'] || { bg: 'bg-gray-100 text-gray-600', icon: CheckCircle2 };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

function HealthBar({ score: rawScore }: { score: number }) {
  const score = rawScore || 0;
  const color = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full bg-[#E3D9CD] overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-[#7A746C]">{score}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-[#F4EFE8]">
        <Icon size={18} className="text-[#B07A45]" />
      </div>
      <div>
        <p className="text-xs text-[#7A746C]">{label}</p>
        <p className="text-lg font-semibold text-[#1C1C1C]">{value}</p>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1C1C1C]">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ClientForm({ initial, onSave, onCancel }: {
  initial: typeof emptyClient & { id?: string };
  onSave: (data: typeof emptyClient & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState('');
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-3">
      {(['name', 'email', 'phone', 'company'] as const).map(field => (
        <div key={field}>
          <label className="block text-xs text-[#7A746C] mb-1 capitalize">{field}</label>
          <input
            className="w-full px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-[#1C1C1C] text-sm focus:outline-none focus:ring-1 focus:ring-[#B07A45]"
            value={(form as Record<string, unknown>)[field] as string} onChange={e => set(field, e.target.value)}
          />
        </div>
      ))}
      <div>
        <label className="block text-xs text-[#7A746C] mb-1">Status</label>
        <select className="w-full px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-[#1C1C1C] text-sm"
          value={form.status} onChange={e => set('status', e.target.value)}>
          <option>Active</option><option>At Risk</option><option>Churned</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-[#7A746C] mb-1">Health Score: {form.healthScore}</label>
        <input type="range" min={0} max={100} value={form.healthScore} onChange={e => set('healthScore', +e.target.value)}
          className="w-full accent-[#B07A45]" />
      </div>
      <div>
        <label className="block text-xs text-[#7A746C] mb-1">Revenue ($)</label>
        <input type="number" className="w-full px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-[#1C1C1C] text-sm"
          value={form.revenue} onChange={e => set('revenue', +e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-[#7A746C] mb-1">Tags</label>
        <div className="flex flex-wrap gap-1 mb-1">
          {(form.tags || []).map(t => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B07A45]/10 text-[#B07A45] text-xs">
              {t} <button onClick={() => set('tags', (form.tags || []).filter(x => x !== t))}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <input className="flex-1 px-3 py-1.5 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-sm"
            value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { set('tags', [...(form.tags || []), tagInput.trim()]); setTagInput(''); e.preventDefault(); } }}
            placeholder="Add tag + Enter" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#7A746C] mb-1">Notes</label>
        <textarea className="w-full px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-[#1C1C1C] text-sm h-20 resize-none"
          value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={() => onSave(form)}
          className="flex-1 py-2 rounded-xl bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-medium hover:from-[#B07A45] hover:to-[#8E5E34] transition-all">
          Save
        </button>
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-[#E3D9CD] text-[#4B4B4B] text-sm hover:bg-[#EEE6DC]">Cancel</button>
      </div>
    </div>
  );
}

function DetailPanel({ client, onClose }: { client: Client; onClose: () => void }) {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1C1C1C]">{client.name}</h3>
          <p className="text-sm text-[#7A746C]">{client.company}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4EFE8] text-[#7A746C]"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-[#4B4B4B]"><Mail size={14} className="text-[#B07A45]" /> {client.email}</div>
        <div className="flex items-center gap-2 text-[#4B4B4B]"><Phone size={14} className="text-[#B07A45]" /> {client.phone}</div>
        <div className="flex items-center gap-2 text-[#4B4B4B]"><StatusBadge status={client.status} /></div>
        <div className="flex items-center gap-2 text-[#4B4B4B]"><BarChart3 size={14} className="text-[#B07A45]" /> Health: {client.healthScore}</div>
      </div>

      {(client.tags || []).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {(client.tags || []).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[#B07A45]/10 text-[#B07A45] text-xs flex items-center gap-1"><Tag size={10} />{t}</span>
          ))}
        </div>
      )}

      {/* Projects */}
      <div>
        <h4 className="text-sm font-medium text-[#1C1C1C] mb-2 flex items-center gap-1"><FileText size={14} className="text-[#B07A45]" /> Projects</h4>
        {(client.projects || []).length === 0 ? <p className="text-xs text-[#7A746C]">No projects</p> : (
          <div className="space-y-1">
            {(client.projects || []).map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-[#F4EFE8] rounded-lg px-3 py-2 text-sm">
                <span className="text-[#1C1C1C]">{p.name}</span>
                <span className="text-xs text-[#7A746C]">{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div>
        <h4 className="text-sm font-medium text-[#1C1C1C] mb-2 flex items-center gap-1"><DollarSign size={14} className="text-[#B07A45]" /> Invoices</h4>
        {(client.invoices || []).length === 0 ? <p className="text-xs text-[#7A746C]">No invoices</p> : (
          <div className="space-y-1">
            {(client.invoices || []).map((inv, i) => (
              <div key={i} className="flex items-center justify-between bg-[#F4EFE8] rounded-lg px-3 py-2 text-sm">
                <span className="text-[#1C1C1C]">{inv.id}</span>
                <span className="text-[#4B4B4B]">${(inv.amount || 0).toLocaleString()}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity */}
      <div>
        <h4 className="text-sm font-medium text-[#1C1C1C] mb-2 flex items-center gap-1"><Activity size={14} className="text-[#B07A45]" /> Activity</h4>
        {(client.activity || []).length === 0 ? <p className="text-xs text-[#7A746C]">No activity</p> : (
          <div className="space-y-1">
            {(client.activity || []).map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#4B4B4B]">
                <Clock size={12} className="text-[#7A746C]" />
                <span>{a.action}</span>
                <span className="text-xs text-[#7A746C] ml-auto">{a.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      {client.notes && (
        <div>
          <h4 className="text-sm font-medium text-[#1C1C1C] mb-2 flex items-center gap-1"><MessageSquare size={14} className="text-[#B07A45]" /> Notes</h4>
          <p className="text-sm text-[#4B4B4B] bg-[#F4EFE8] rounded-lg p-3">{client.notes}</p>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = lsGet<Client[]>('vantix_clients', []);
    setClients(stored.length > 0 ? stored : SEED_CLIENTS);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) lsSet('vantix_clients', clients);
  }, [clients, mounted]);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = !search || (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.company || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [clients, search, filterStatus]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'Active').length,
    atRisk: clients.filter(c => c.status === 'At Risk').length,
    revenue: clients.reduce((s, c) => s + (c.revenue || 0), 0),
  }), [clients]);

  const handleSave = (data: typeof emptyClient & { id?: string }) => {
    if (data.id) {
      setClients(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
    } else {
      const newClient: Client = {
        ...data, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0],
        projects: [], invoices: [], activity: [{ action: 'Client created', date: new Date().toISOString().split('T')[0] }],
      } as Client;
      setClients(prev => [...prev, newClient]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selectedClient = clients.find(c => c.id === selectedId) || null;

  if (!mounted) return <div className="min-h-screen bg-[#F4EFE8]" />;

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-[#B07A45]" />
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Clients</h1>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-medium hover:from-[#B07A45] hover:to-[#8E5E34] transition-all shadow-sm">
          <UserPlus size={16} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Clients" value={stats.total} />
        <StatCard icon={CheckCircle2} label="Active" value={stats.active} />
        <StatCard icon={AlertTriangle} label="At Risk" value={stats.atRisk} />
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <input className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-[#1C1C1C] text-sm focus:outline-none focus:ring-1 focus:ring-[#B07A45]"
            placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <select className="pl-9 pr-8 py-2 rounded-xl border border-[#E3D9CD] bg-[#EEE6DC] text-[#1C1C1C] text-sm appearance-none"
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>All</option><option>Active</option><option>At Risk</option><option>Churned</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Table */}
        <div className={`flex-1 ${selectedClient ? 'hidden lg:block' : ''}`}>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E3D9CD] text-[#7A746C] text-xs">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Health</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Revenue</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Last Contact</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-[#7A746C]">No clients found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id} onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                    className={`border-b border-[#E3D9CD] cursor-pointer transition-colors hover:bg-[#F4EFE8] ${selectedId === c.id ? 'bg-[#F4EFE8]' : ''}`}>
                    <td className="px-4 py-3 font-medium text-[#1C1C1C]">
                      <div className="flex items-center gap-2">
                        {selectedId === c.id ? <ChevronDown size={14} className="text-[#B07A45]" /> : <ChevronRight size={14} className="text-[#7A746C]" />}
                        {c.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#4B4B4B] hidden md:table-cell">{c.company}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><HealthBar score={c.healthScore} /></td>
                    <td className="px-4 py-3 text-[#4B4B4B] hidden md:table-cell">{c.revenue > 0 ? `$${c.revenue.toLocaleString()}` : 'Ongoing'}</td>
                    <td className="px-4 py-3 text-[#7A746C] hidden lg:table-cell">{c.lastContact}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); setEditing(c); setModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><Edit2 size={14} /></button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(c.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-[#7A746C] hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedClient && (
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <DetailPanel client={selectedClient} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Client' : 'Add Client'}>
        <ClientForm
          initial={editing ? { name: editing.name || '', email: editing.email || '', phone: editing.phone || '', company: editing.company || '', status: editing.status || 'Active', healthScore: editing.healthScore || 0, revenue: editing.revenue || 0, tags: editing.tags || [], notes: editing.notes || '', lastContact: editing.lastContact || '', id: editing.id } : { ...emptyClient }}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
