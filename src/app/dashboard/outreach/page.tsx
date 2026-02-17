'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Send, Plus, Trash2, Edit3, Eye, BarChart3,
  Users, ArrowUpRight, MessageSquare, AlertCircle, Clock,
  CheckCircle, XCircle, Target, Zap, TrendingUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getLeads } from '@/lib/supabase';
import type { Lead } from '@/lib/types';

// --- Types ---
interface Campaign {
  id: string;
  name: string;
  subject: string;
  body_template: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
  lead_ids?: string[];
  created_at: string;
  updated_at?: string;
}

// --- Supabase ---
async function getCampaigns() {
  const { data, error } = await supabase.from('email_campaigns').select('*').order('created_at', { ascending: false });
  return { data: data as Campaign[] | null, error };
}
async function createCampaign(c: Partial<Campaign>) {
  const { data, error } = await supabase.from('email_campaigns').insert(c).select().single();
  return { data: data as Campaign | null, error };
}
async function updateCampaign(id: string, u: Partial<Campaign>) {
  const { data, error } = await supabase.from('email_campaigns').update(u).eq('id', id).select().single();
  return { data: data as Campaign | null, error };
}
async function deleteCampaign(id: string) {
  return await supabase.from('email_campaigns').delete().eq('id', id);
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  draft: { color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  active: { color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  paused: { color: 'text-amber-400', bg: 'bg-amber-400/10' },
  completed: { color: 'text-blue-400', bg: 'bg-blue-400/10' },
};

export default function OutreachPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', subject: '', body_template: '', status: 'draft' as Campaign['status'] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([getCampaigns(), getLeads()]);
      if (cRes.data) setCampaigns(cRes.data);
      if (lRes.data) setLeads(lRes.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalSent = campaigns.reduce((s, c) => s + (c.sent || 0), 0);
  const totalOpened = campaigns.reduce((s, c) => s + (c.opened || 0), 0);
  const totalReplied = campaigns.reduce((s, c) => s + (c.replied || 0), 0);
  const totalBounced = campaigns.reduce((s, c) => s + (c.bounced || 0), 0);
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';
  const replyRate = totalSent > 0 ? ((totalReplied / totalSent) * 100).toFixed(1) : '0';

  const resetForm = () => { setForm({ name: '', subject: '', body_template: '', status: 'draft' }); setEditId(null); setShowForm(false); };

  const handleSubmit = async () => {
    try {
      const payload: Partial<Campaign> = { ...form, sent: 0, opened: 0, replied: 0, bounced: 0 };
      if (editId) await updateCampaign(editId, form);
      else await createCampaign(payload);
      resetForm(); load();
    } catch {}
  };

  const startEdit = (c: Campaign) => {
    setForm({ name: c.name, subject: c.subject, body_template: c.body_template, status: c.status });
    setEditId(c.id); setShowForm(true);
  };

  const detailCampaign = campaigns.find(c => c.id === detailId);

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl"><Mail className="w-6 h-6 text-emerald-400" /></div>
            Email Outreach
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Campaign management and email performance tracking</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Campaigns', value: campaigns.length, icon: Mail, color: 'text-zinc-400' },
          { label: 'Emails Sent', value: totalSent, icon: Send, color: 'text-blue-400' },
          { label: 'Opened', value: totalOpened, icon: Eye, color: 'text-amber-400' },
          { label: 'Replied', value: totalReplied, icon: MessageSquare, color: 'text-emerald-400' },
          { label: 'Open Rate', value: `${openRate}%`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Reply Rate', value: `${replyRate}%`, icon: Target, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-zinc-500">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Leads summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-sm font-medium text-white">{leads.length} leads in database</span>
              <span className="text-xs text-zinc-500 ml-3">{leads.filter(l => l.email).length} with email</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>New: {leads.filter(l => l.status === 'new').length}</span>
            <span>Contacted: {leads.filter(l => l.status === 'contacted').length}</span>
            <span>Qualified: {leads.filter(l => l.status === 'qualified').length}</span>
          </div>
        </div>
      </motion.div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : campaigns.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center">
          <div className="p-4 bg-zinc-800/50 rounded-2xl mb-4"><Mail className="w-8 h-8 text-zinc-600" /></div>
          <p className="text-zinc-400 font-medium mb-1">No campaigns yet</p>
          <p className="text-zinc-600 text-sm mb-4">Create your first email campaign to start outreach</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 inline mr-1" /> Create Campaign
          </button>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
          {campaigns.map(c => {
            const cfg = STATUS_CFG[c.status] || STATUS_CFG.draft;
            const cOpenRate = c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(0) : '0';
            const cReplyRate = c.sent > 0 ? ((c.replied / c.sent) * 100).toFixed(0) : '0';
            return (
              <motion.div key={c.id} variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold truncate">{c.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-3 truncate">Subject: {c.subject}</p>
                    {/* Performance bar */}
                    <div className="flex items-center gap-6 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Send className="w-3 h-3" />{c.sent} sent</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-amber-400" />{c.opened} opened ({cOpenRate}%)</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-emerald-400" />{c.replied} replied ({cReplyRate}%)</span>
                      <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" />{c.bounced} bounced</span>
                    </div>
                    {/* Mini bar chart */}
                    {c.sent > 0 && (
                      <div className="flex gap-0.5 mt-2 h-1.5 rounded-full overflow-hidden bg-zinc-800 w-full max-w-xs">
                        <div className="bg-emerald-500 rounded-l-full" style={{ width: `${(c.replied / c.sent) * 100}%` }} />
                        <div className="bg-amber-500" style={{ width: `${((c.opened - c.replied) / c.sent) * 100}%` }} />
                        <div className="bg-zinc-600" style={{ width: `${((c.sent - c.opened - c.bounced) / c.sent) * 100}%` }} />
                        <div className="bg-red-500 rounded-r-full" style={{ width: `${(c.bounced / c.sent) * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(c)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDetailId(c.id)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                    <button onClick={async () => { await deleteCampaign(c.id); load(); }} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {detailCampaign && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-1">{detailCampaign.name}</h2>
              <p className="text-sm text-zinc-500 mb-6">Subject: {detailCampaign.subject}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Sent', value: detailCampaign.sent, color: 'text-blue-400' },
                  { label: 'Opened', value: detailCampaign.opened, color: 'text-amber-400' },
                  { label: 'Replied', value: detailCampaign.replied, color: 'text-emerald-400' },
                  { label: 'Bounced', value: detailCampaign.bounced, color: 'text-red-400' },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-800 rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-zinc-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Email Template</h3>
                <div className="bg-zinc-800 rounded-xl p-4 text-sm text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto">{detailCampaign.body_template || 'No template set'}</div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => setDetailId(null)} className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit' : 'New'} Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Campaign Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Q1 Cold Outreach" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Subject Line</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Quick question about your website" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Body Template</label>
                  <textarea value={form.body_template} onChange={e => setForm(f => ({ ...f, body_template: e.target.value }))} rows={8} className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono text-sm" placeholder={"Hi {{name}},\n\nI noticed your business {{company}} and..."} />
                  <p className="text-xs text-zinc-600 mt-1">Use {'{{name}}'}, {'{{company}}'}, {'{{email}}'} as merge tags</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.name || !form.subject} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl font-medium transition-colors">
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
