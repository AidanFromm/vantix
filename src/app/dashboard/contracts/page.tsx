'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, FileText, CheckCircle, Clock, Send, Plus, ExternalLink,
  Trash2, Edit3, Calendar, User, DollarSign, Link2, AlertCircle, ArrowRight,
} from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';

// --- Types ---
interface Contract {
  id: string;
  proposal_id?: string;
  title: string;
  client_name: string;
  value: number;
  status: 'draft' | 'sent' | 'signed';
  type: 'project' | 'retainer' | 'service';
  documenso_url?: string;
  start_date?: string;
  end_date?: string;
  signed_date?: string;
  created_at: string;
  updated_at?: string;
}

const STATUS_CFG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  draft: { icon: Edit3, color: 'text-[#7A746C]', bg: 'bg-[#A39B90]/10' },
  sent: { icon: Send, color: 'text-[#B07A45]', bg: 'bg-[#B07A45]/10' },
  signed: { icon: CheckCircle, color: 'text-[#B07A45]', bg: 'bg-[#B07A45]/10' },
};

const TYPE_CFG: Record<string, string> = { project: 'text-[#B07A45]', retainer: 'text-[#B07A45]', service: 'text-[#B07A45]' };

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', client_name: '', value: 0, type: 'project' as Contract['type'], documenso_url: '', start_date: '', end_date: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await getData<Contract>('contracts'); setContracts(data); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? contracts : contracts.filter(c => c.status === filter);
  const totalValue = contracts.filter(c => c.status === 'signed').reduce((s, c) => s + (c.value || 0), 0);
  const pendingValue = contracts.filter(c => c.status !== 'signed').reduce((s, c) => s + (c.value || 0), 0);

  const resetForm = () => { setForm({ title: '', client_name: '', value: 0, type: 'project', documenso_url: '', start_date: '', end_date: '' }); setEditId(null); setShowForm(false); };

  const handleSubmit = async () => {
    try {
      const payload: Partial<Contract> = { ...form, status: 'draft' };
      if (editId) await updateRecord('contracts', editId, payload);
      else await createRecord('contracts', { ...payload, id: crypto.randomUUID() });
      resetForm(); load();
    } catch {}
  };

  const handleStatus = async (id: string, status: Contract['status']) => {
    const updates: Partial<Contract> = { status };
    if (status === 'signed') updates.signed_date = new Date().toISOString();
    try { await updateRecord('contracts', id, updates); load(); } catch {}
  };

  const startEdit = (c: Contract) => {
    setForm({ title: c.title, client_name: c.client_name, value: c.value, type: c.type, documenso_url: c.documenso_url || '', start_date: c.start_date || '', end_date: c.end_date || '' });
    setEditId(c.id); setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-3">
            <div className="p-2 bg-[#B07A45]/10 rounded-xl"><Scale className="w-6 h-6 text-[#B07A45]" /></div>
            Contracts
          </h1>
          <p className="text-[#7A746C] mt-1 text-sm">Manage contracts and e-signatures via Documenso</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] hover:opacity-90 text-[#1C1C1C] rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Contracts', value: contracts.length, icon: FileText, color: 'text-[#7A746C]' },
          { label: 'Signed Value', value: `$${totalValue.toLocaleString()}`, icon: CheckCircle, color: 'text-[#B07A45]' },
          { label: 'Pending Value', value: `$${pendingValue.toLocaleString()}`, icon: Clock, color: 'text-[#B07A45]' },
          { label: 'Signed', value: contracts.filter(c => c.status === 'signed').length, icon: Scale, color: 'text-[#B07A45]' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-[#7A746C]">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-[#1C1C1C]">{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'draft', 'sent', 'signed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === s ? 'bg-[#B07A45]/50 text-[#1C1C1C]' : 'bg-[#EEE6DC] text-[#7A746C] hover:bg-[#E3D9CD]'}`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#B07A45] border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center">
          <div className="p-4 bg-[#EEE6DC] rounded-2xl mb-4"><Scale className="w-8 h-8 text-[#4B4B4B]" /></div>
          <p className="text-[#7A746C] font-medium mb-1">No contracts found</p>
          <p className="text-[#4B4B4B] text-sm mb-4">Create a contract to start tracking agreements</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] hover:opacity-90 text-[#1C1C1C] rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 inline mr-1" /> Create Contract
          </button>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
          {filtered.map(c => {
            const cfg = STATUS_CFG[c.status];
            const Icon = cfg.icon;
            return (
              <motion.div key={c.id} variants={fadeUp} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 hover:border-[#B07A45]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[#1C1C1C] font-semibold truncate">{c.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{c.status}
                      </span>
                      <span className={`text-xs font-medium ${TYPE_CFG[c.type] || 'text-[#7A746C]'}`}>{c.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#7A746C] flex-wrap">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{c.client_name}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${(c.value || 0).toLocaleString()}</span>
                      {c.signed_date && <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-[#B07A45]" />Signed {new Date(c.signed_date).toLocaleDateString()}</span>}
                      {c.start_date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(c.start_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.documenso_url && (
                      <a href={c.documenso_url} target="_blank" rel="noopener noreferrer" className="p-2 text-[#7A746C] hover:text-[#B07A45] hover:bg-[#B07A45]/10 rounded-lg transition-colors" title="Open in Documenso">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => startEdit(c)} className="p-2 text-[#7A746C] hover:text-[#1C1C1C] hover:bg-[#E3D9CD] rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                    {c.status === 'draft' && <button onClick={() => handleStatus(c.id, 'sent')} className="p-2 text-[#7A746C] hover:text-[#B07A45] hover:bg-[#B07A45]/10 rounded-lg transition-colors" title="Mark Sent"><Send className="w-4 h-4" /></button>}
                    {c.status === 'sent' && <button onClick={() => handleStatus(c.id, 'signed')} className="p-2 text-[#7A746C] hover:text-[#B07A45] hover:bg-[#B07A45]/10 rounded-lg transition-colors" title="Mark Signed"><CheckCircle className="w-4 h-4" /></button>}
                    <button onClick={async () => { await deleteRecord('contracts', c.id); load(); }} className="p-2 text-[#7A746C] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#EEE6DC]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">{editId ? 'Edit' : 'New'} Contract</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" placeholder="Website Development Agreement" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Client</label>
                  <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" placeholder="Client name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Value ($)</label>
                    <input type="number" value={form.value || ''} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Contract['type'] }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors">
                      <option value="project">Project</option>
                      <option value="retainer">Retainer</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Documenso Link</label>
                  <input value={form.documenso_url} onChange={e => setForm(f => ({ ...f, documenso_url: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" placeholder="https://app.documenso.com/..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Start Date</label>
                    <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7A746C] mb-1.5">End Date</label>
                    <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-[#7A746C] hover:text-[#1C1C1C] transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.title} className="px-6 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] hover:opacity-90 disabled:opacity-40 text-[#1C1C1C] rounded-xl font-medium transition-colors">
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
