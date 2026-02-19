'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Send, Plus, Trash2, Edit3, Eye, BarChart3,
  Users, ArrowUpRight, MessageSquare, AlertCircle, Clock,
  CheckCircle, XCircle, Target, Zap, TrendingUp,
} from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';
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

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  draft: { color: 'text-[#7A746C]', bg: 'bg-[#A39B90]/10' },
  active: { color: 'text-[#B07A45]', bg: 'bg-[#B07A45]/10' },
  paused: { color: 'text-[#B07A45]', bg: 'bg-[#B07A45]/10' },
  completed: { color: 'text-[#B07A45]', bg: 'bg-[#B07A45]/10' },
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
      const [cData, lData] = await Promise.all([
        getData<Campaign>('email_campaigns'),
        getData<Lead>('leads'),
      ]);
      setCampaigns(cData);
      setLeads(lData);
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
      if (editId) await updateRecord('email_campaigns', editId, form);
      else await createRecord('email_campaigns', { ...payload, id: crypto.randomUUID() });
      resetForm(); load();
    } catch {}
  };

  const startEdit = (c: Campaign) => {
    setForm({ name: c.name, subject: c.subject, body_template: c.body_template, status: c.status });
    setEditId(c.id); setShowForm(true);
  };

  const detailCampaign = campaigns.find(c => c.id === detailId);

  return (
    <div className="p-4 md:p-8 space-y-6 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-3">
            <div className="p-2 bg-[#B07A45]/10 rounded-xl"><Mail className="w-6 h-6 text-[#B07A45]" /></div>
            Email Outreach
          </h1>
          <p className="text-[#7A746C] mt-1 text-sm">Campaign management and email performance tracking</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] hover:opacity-90 text-[#1C1C1C] rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Campaigns', value: campaigns.length, icon: Mail, color: 'text-[#7A746C]' },
          { label: 'Emails Sent', value: totalSent, icon: Send, color: 'text-[#B07A45]' },
          { label: 'Opened', value: totalOpened, icon: Eye, color: 'text-[#B07A45]' },
          { label: 'Replied', value: totalReplied, icon: MessageSquare, color: 'text-[#B07A45]' },
          { label: 'Open Rate', value: `${openRate}%`, icon: TrendingUp, color: 'text-[#B07A45]' },
          { label: 'Reply Rate', value: `${replyRate}%`, icon: Target, color: 'text-[#B07A45]' },
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

      {/* Leads summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#B07A45]" />
            <div>
              <span className="text-sm font-medium text-[#1C1C1C]">{leads.length} leads in database</span>
              <span className="text-xs text-[#7A746C] ml-3">{leads.filter(l => l.email).length} with email</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#7A746C]">
            <span>New: {leads.filter(l => l.status === 'new').length}</span>
            <span>Contacted: {leads.filter(l => l.status === 'contacted').length}</span>
            <span>Qualified: {leads.filter(l => l.status === 'qualified').length}</span>
          </div>
        </div>
      </motion.div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#B07A45] border-t-transparent rounded-full animate-spin" /></div>
      ) : campaigns.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center">
          <div className="p-4 bg-[#EEE6DC] rounded-2xl mb-4"><Mail className="w-8 h-8 text-[#4B4B4B]" /></div>
          <p className="text-[#7A746C] font-medium mb-1">No campaigns yet</p>
          <p className="text-[#4B4B4B] text-sm mb-4">Create your first email campaign to start outreach</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] hover:opacity-90 text-[#1C1C1C] rounded-xl text-sm font-medium transition-colors">
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
              <motion.div key={c.id} variants={fadeUp} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 hover:border-[#B07A45]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[#1C1C1C] font-semibold truncate">{c.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-[#7A746C] mb-3 truncate">Subject: {c.subject}</p>
                    {/* Performance bar */}
                    <div className="flex items-center gap-6 text-xs text-[#7A746C]">
                      <span className="flex items-center gap-1"><Send className="w-3 h-3" />{c.sent} sent</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-[#B07A45]" />{c.opened} opened ({cOpenRate}%)</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-[#B07A45]" />{c.replied} replied ({cReplyRate}%)</span>
                      <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" />{c.bounced} bounced</span>
                    </div>
                    {/* Mini bar chart */}
                    {c.sent > 0 && (
                      <div className="flex gap-0.5 mt-2 h-1.5 rounded-full overflow-hidden bg-[#EEE6DC] w-full max-w-xs">
                        <div className="bg-[#B07A45]/50 rounded-l-full" style={{ width: `${(c.replied / c.sent) * 100}%` }} />
                        <div className="bg-[#B07A45]" style={{ width: `${((c.opened - c.replied) / c.sent) * 100}%` }} />
                        <div className="bg-[#4B4B4B]" style={{ width: `${((c.sent - c.opened - c.bounced) / c.sent) * 100}%` }} />
                        <div className="bg-[#B0614A]/50 rounded-r-full" style={{ width: `${(c.bounced / c.sent) * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(c)} className="p-2 text-[#7A746C] hover:text-[#1C1C1C] hover:bg-[#E3D9CD] rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDetailId(c.id)} className="p-2 text-[#7A746C] hover:text-[#1C1C1C] hover:bg-[#E3D9CD] rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                    <button onClick={async () => { await deleteRecord('email_campaigns', c.id); load(); }} className="p-2 text-[#7A746C] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#EEE6DC]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-xl p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">{detailCampaign.name}</h2>
              <p className="text-sm text-[#7A746C] mb-6">Subject: {detailCampaign.subject}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Sent', value: detailCampaign.sent, color: 'text-[#B07A45]' },
                  { label: 'Opened', value: detailCampaign.opened, color: 'text-[#B07A45]' },
                  { label: 'Replied', value: detailCampaign.replied, color: 'text-[#B07A45]' },
                  { label: 'Bounced', value: detailCampaign.bounced, color: 'text-red-500' },
                ].map((m, i) => (
                  <div key={i} className="bg-[#EEE6DC] rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-[#7A746C] mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#7A746C] mb-2">Email Template</h3>
                <div className="bg-[#EEE6DC] rounded-xl p-4 text-sm text-[#4B4B4B] whitespace-pre-wrap max-h-48 overflow-y-auto">{detailCampaign.body_template || 'No template set'}</div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => setDetailId(null)} className="px-5 py-2.5 text-[#7A746C] hover:text-[#1C1C1C] transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#EEE6DC]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">{editId ? 'Edit' : 'New'} Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Campaign Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" placeholder="Q1 Cold Outreach" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Subject Line</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors" placeholder="Quick question about your website" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7A746C] mb-1.5">Body Template</label>
                  <textarea value={form.body_template} onChange={e => setForm(f => ({ ...f, body_template: e.target.value }))} rows={8} className="w-full px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#A39B90] focus:outline-none focus:ring-1 focus:ring-[#B07A45] transition-colors resize-none font-mono text-sm" placeholder={"Hi {{name}},\n\nI noticed your business {{company}} and..."} />
                  <p className="text-xs text-[#4B4B4B] mt-1">Use {'{{name}}'}, {'{{company}}'}, {'{{email}}'} as merge tags</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={resetForm} className="px-5 py-2.5 text-[#7A746C] hover:text-[#1C1C1C] transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.name || !form.subject} className="px-6 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] hover:opacity-90 disabled:opacity-40 text-[#1C1C1C] rounded-xl font-medium transition-colors">
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
