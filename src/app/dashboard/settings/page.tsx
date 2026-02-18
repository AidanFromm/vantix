'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Shield, Database, Github, CreditCard, Cloud, Zap, CheckCircle2, Info } from 'lucide-react';

interface UserData { name: string; email: string; role: string; }
interface Integration { id: string; name: string; icon: React.ElementType; description: string; benefits: string[]; status: 'connected' | 'ready'; color: string; }

const integrations: Integration[] = [
  { id: 'github', name: 'GitHub', icon: Github, description: 'Pull project status, commits, and issues into your dashboard.', benefits: ['See latest commits per project', 'Track open issues and PRs', 'Auto-update project activity'], status: 'ready', color: 'from-gray-500 to-gray-700' },
  { id: 'stripe', name: 'Stripe', icon: CreditCard, description: 'Track payments, revenue, and client invoices.', benefits: ['See total revenue per client', 'Track payment status', 'Get notified on payments'], status: 'ready', color: 'from-purple-500 to-indigo-500' },
  { id: 'supabase', name: 'Supabase', icon: Database, description: 'Store client data, project notes, and files securely.', benefits: ['Persistent files and notes', 'Real-time sync', 'Secure auth'], status: 'ready', color: 'from-emerald-500 to-emerald-600' },
  { id: 'vercel', name: 'Vercel', icon: Cloud, description: 'Monitor deployments and build status.', benefits: ['See deployment status', 'Build failure alerts', 'Preview URLs'], status: 'ready', color: 'from-gray-600 to-gray-800' },
];

const teamMembers = [
  { name: 'Kyle', role: 'Admin', type: 'human' },
  { name: 'Aidan', role: 'Admin', type: 'human' },
  { name: 'Vantix', role: 'AI - OpenClaw', type: 'bot' },
  { name: 'Botskii', role: 'AI - OpenClaw', type: 'bot' },
];

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [saved, setSaved] = useState(false);
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);

  useEffect(() => { try { const stored = localStorage.getItem('vantix_user'); if (stored) setUser(JSON.parse(stored)); } catch {} }, []);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div><h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">Settings</h1><p className="text-[#A89F94] mt-1 text-sm">Manage integrations and team access</p></div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#D8CFC4] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-[#B07A45]/10 flex items-center justify-center"><User className="text-[#B07A45]" size={20} /></div><div><h2 className="text-xl font-semibold text-[#1E1E1E]">Your Profile</h2><p className="text-sm text-[#A89F94]">Logged in as {user?.name || 'Unknown'}</p></div></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[{ label: 'Name', value: user?.name }, { label: 'Email', value: user?.email }, { label: 'Role', value: user?.role }].map(f => (
            <div key={f.label} className="p-4 rounded-xl bg-[#F5EFE7] border border-[#D8CFC4]"><p className="text-xs text-[#A89F94] mb-1">{f.label}</p><p className="font-medium text-[#1E1E1E] capitalize">{f.value || '-'}</p></div>
          ))}
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#D8CFC4] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-[#B07A45]/10 flex items-center justify-center"><Zap className="text-[#B07A45]" size={20} /></div><div><h2 className="text-xl font-semibold text-[#1E1E1E]">Integrations</h2><p className="text-sm text-[#A89F94]">Connect external services to power up Vantix</p></div></div>
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3"><Info size={18} className="text-blue-600 shrink-0 mt-0.5" /><p className="text-sm text-blue-700">Integrations let you pull data from other services directly into Vantix.</p></div>
        <div className="space-y-4 mt-6">
          {integrations.map(integration => {
            const Icon = integration.icon;
            const isExpanded = expandedIntegration === integration.id;
            return (
              <div key={integration.id} className="bg-[#F5EFE7] rounded-xl border border-[#D8CFC4] overflow-hidden hover:border-[#B07A45]/30 transition-colors">
                <div className="p-4 cursor-pointer" onClick={() => setExpandedIntegration(isExpanded ? null : integration.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center`}><Icon className="text-white" size={24} /></div>
                      <div><h3 className="font-semibold text-[#1E1E1E]">{integration.name}</h3><p className="text-sm text-[#A89F94]">{integration.description}</p></div>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200"><Zap size={12} /> Ready</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-[#D8CFC4] p-4 bg-white">
                    <h4 className="text-sm font-medium text-[#1E1E1E] mb-3">What you&apos;ll get:</h4>
                    <ul className="space-y-2">{integration.benefits.map((b, i) => <li key={i} className="flex items-center gap-2 text-sm text-[#A89F94]"><CheckCircle2 size={14} className="text-emerald-500" /> {b}</li>)}</ul>
                    <button className="mt-4 w-full bg-[#B07A45] hover:bg-[#A67A4B] text-white py-3 rounded-xl font-medium transition-all">Connect {integration.name}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-[#D8CFC4] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Shield className="text-purple-500" size={20} /></div><div><h2 className="text-xl font-semibold text-[#1E1E1E]">Team Members</h2><p className="text-sm text-[#A89F94]">{teamMembers.length} members with access</p></div></div>
        <div className="grid md:grid-cols-2 gap-4">
          {teamMembers.map(member => (
            <div key={member.name} className="flex items-center gap-4 p-4 bg-[#F5EFE7] rounded-xl border border-[#D8CFC4]">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${member.type === 'bot' ? 'bg-[#B07A45]/10 text-[#B07A45]' : 'bg-purple-50 text-purple-500'}`}>{member.name[0]}</div>
              <div><h3 className="font-medium text-[#1E1E1E]">{member.name}</h3><p className="text-sm text-[#A89F94]">{member.role}</p></div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end">
        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#B07A45] hover:bg-[#A67A4B] text-white'}`}><Save size={20} />{saved ? 'Saved!' : 'Save Changes'}</button>
      </motion.div>
    </div>
  );
}