'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Send, Eye, CheckCircle, Clock, XCircle, ArrowLeft,
  Printer, Trash2, Edit3, DollarSign, Calendar, User, List, ChevronDown,
  AlertCircle, Briefcase, Target,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getClients } from '@/lib/supabase';
import type { Client } from '@/lib/types';

// --- Types ---
interface Proposal {
  id: string;
  client_id?: string;
  client_name?: string;
  project_name: string;
  scope: string;
  deliverables: string[];
  timeline: string;
  price: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
  sent_at?: string;
  updated_at?: string;
}

// --- Supabase helpers ---
async function getProposals() {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as Proposal[] | null, error };
}

async function createProposal(p: Partial<Proposal>) {
  const { data, error } = await supabase.from('proposals').insert(p).select().single();
  return { data: data as Proposal | null, error };
}

async function updateProposal(id: string, updates: Partial<Proposal>) {
  const { data, error } = await supabase.from('proposals').update(updates).eq('id', id).select().single();
  return { data: data as Proposal | null, error };
}

async function deleteProposal(id: string) {
  const { error } = await supabase.from('proposals').delete().eq('id', id);
  return { error };
}

// --- Constants ---
const STATUSES = ['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected'] as const;

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  draft: { icon: Edit3, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  sent: { icon: Send, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  viewed: { icon: Eye, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  accepted: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// --- Component ---
export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    client_id: '', client_name: '', project_name: '', scope: '',
    deliverables: [''], timeline: '', price: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([getProposals(), getClients()]);
      if (pRes.data) setProposals(pRes.data);
      if (cRes.data) setClients(cRes.data);
    } catch { /* handled */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);
  const previewProposal = proposals.find(p => p.id === previewId);

  const resetForm = () => {
    setForm({ client_id: '', client_name: '', project_name: '', scope: '', deliverables: [''], timeline: '', price: 0 });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      const payload: Partial<Proposal> = {
        client_id: form.client_id || undefined,
        client_name: form.client_name || clients.find(c => c.id === form.client_id)?.name || 'Unknown',
        project_name: form.project_name,
        scope: form.scope,
        deliverables: form.deliverables.filter(d => d.trim()),
        timeline: form.timeline,
        price: form.price,
        status: 'draft',
      };
      if (editId) {
        await updateProposal(editId, payload);
      } else {
        await createProposal(payload);
      }
      resetForm();
      load();
    } catch { /* handled */ }
  };

  const handleStatusChange = async (id: string, status: Proposal['status']) => {
    try {
      const updates: Partial<Proposal> = { status };
      if (status === 'sent') updates.sent_at = new Date().toISOString();
      await updateProposal(id, updates);
      load();
    } catch { /* handled */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProposal(id);
      load();
    } catch { /* handled */ }
  };

  const startEdit = (p: Proposal) => {
    setForm({
      client_id: p.client_id || '',
      client_name: p.client_name || '',
      project_name: p.project_name,
      scope: p.scope,
      deliverables: p.deliverables?.length ? p.deliverables : [''],
      timeline: p.timeline,
      price: p.price,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  // --- Preview / Print View ---
  if (previewProposal) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 p-4 md:p-8">
        <button onClick={() => setPreviewId(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Proposals
        </button>
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 print:bg-white print:text-black print:border-none">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white print:text-black">Vantix</h1>
              <p className="text-zinc-400 print:text-gray-500 text-sm mt-1">Digital Solutions Agency</p>
            </div>
            <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
          <div className="border-t border-zinc-800 print:border-gray-200 pt-8 mb-8">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-zinc-500 print:text-gray-400 mb-1">Prepared for</p>
                <p className="text-white print:text-black font-medium">{previewProposal.client_name || 'Client'}</p>
              </div>
              <div>
                <p className="text-zinc-500 print:text-gray-400 mb-1">Date</p>
                <p className="text-white print:text-black font-medium">{new Date(previewProposal.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white print:text-black mb-4">{previewProposal.project_name}</h2>
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Scope of Work</h3>
            <p className="text-zinc-300 print:text-gray-700 leading-relaxed whitespace-pre-wrap">{previewProposal.scope}</p>
          </div>
          {previewProposal.deliverables?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Deliverables</h3>
              <ul className="space-y-2">
                {previewProposal.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 print:text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Timeline</h3>
              <p className="text-zinc-300 print:text-gray-700">{previewProposal.timeline || 'TBD'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Investment</h3>
              <p className="text-3xl font-bold text-white print:text-black">${previewProposal.price.toLocaleString()}</p>
            </div>
          </div>
          <div className="border-t border-zinc-800 print:border-gray-200 pt-6 text-center text-zinc-500 print:text-gray-400 text-xs">
            Vantix — usevantix@gmail.com — vantix.dev
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl"><FileText className="w-6 h-6 text-emerald-400" /></div>
            Proposals
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Build, send, and track client proposals</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Proposal
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {(['draft','sent','viewed','accepted','rejected'] as const).map(s => {
          const count = proposals.filter(p => p.status === s).length;
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <motion.div key={s} variants={fadeUp}
              onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${filter === s ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${cfg.bg}`}><Icon className={`w-3.5 h-3.5 ${cfg.color}`} /></div>
                <span className="text-xs text-zinc-500 capitalize">{s}</span>
              </div>
              <p className="text-xl font-bold text-white">{count}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === s ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center">
          <div className="p-4 bg-zinc-800/50 rounded-2xl mb-4"><FileText className="w-8 h-8 text-zinc-600" /></div>
          <p className="text-zinc-400 font-medium mb-1">No proposals yet</p>
          <p className="text-zinc-600 text-sm mb-4">Create your first proposal to get started</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 inline mr-1" /> Create Proposal
          </button>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
          {filtered.map(p => {
            const cfg = STATUS_CONFIG[p.status];
            const Icon = cfg.icon;
            return (
              <motion.div key={p.id} variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold truncate">{p.project_name}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{p.client_name || 'No client'}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${p.price?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPreviewId(p.id)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Preview">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => startEdit(p)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {p.status === 'draft' && (
                      <button onClick={() => handleStatusChange(p.id, 'sent')} className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Mark Sent">
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {p.status === 'sent' && (
                      <button onClick={() => handleStatusChange(p.id, 'viewed')} className="p-2 text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Mark Viewed">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {(p.status === 'viewed' || p.status === 'sent') && (
                      <>
                        <button onClick={() => handleStatusChange(p.id, 'accepted')} className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Accept">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusChange(p.id, 'rejected')} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit Proposal' : 'New Proposal'}</h2>

              <div className="space-y-5">
                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Client</label>
                  <select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value, client_name: clients.find(c => c.id === e.target.value)?.name || '' }))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="">Select a client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Project Name</label>
                  <input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="E-commerce Platform Redesign" />
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Scope of Work</label>
                  <textarea value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))} rows={4}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Describe the project scope..." />
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Deliverables</label>
                  <div className="space-y-2">
                    {form.deliverables.map((d, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={d} onChange={e => {
                          const arr = [...form.deliverables];
                          arr[i] = e.target.value;
                          setForm(f => ({ ...f, deliverables: arr }));
                        }}
                          className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                          placeholder={`Deliverable ${i + 1}`} />
                        {form.deliverables.length > 1 && (
                          <button onClick={() => setForm(f => ({ ...f, deliverables: f.deliverables.filter((_, j) => j !== i) }))}
                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setForm(f => ({ ...f, deliverables: [...f.deliverables, ''] }))}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add deliverable
                    </button>
                  </div>
                </div>

                {/* Timeline & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Timeline</label>
                    <input value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="2-4 weeks" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Price ($)</label>
                    <input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="5000" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.project_name}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors">
                  {editId ? 'Update' : 'Create'} Proposal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
