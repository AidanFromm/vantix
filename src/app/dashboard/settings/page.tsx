'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, User, Shield, Database, 
  Github, CreditCard, Cloud, Zap, CheckCircle2, Info
} from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: string;
}

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  benefits: string[];
  status: 'connected' | 'ready';
  color: string;
}

const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    description: 'Automatically pull project status, commits, and issues into your dashboard.',
    benefits: ['See latest commits per project', 'Track open issues and PRs', 'Auto-update project activity logs'],
    status: 'ready',
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    description: 'Track payments, revenue, and client invoices directly in Vantix.',
    benefits: ['See total revenue per client', 'Track payment status on projects', 'Get notified on new payments'],
    status: 'ready',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: Database,
    description: 'Store all your client data, project notes, and files securely.',
    benefits: ['Persistent client files and notes', 'Real-time sync across team', 'Secure auth for all members'],
    status: 'ready',
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: Cloud,
    description: 'Monitor deployments and get build status for all your projects.',
    benefits: ['See deployment status live', 'Get notified on build failures', 'Quick links to preview URLs'],
    status: 'ready',
    color: 'from-gray-700 to-gray-900',
  },
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vantix_user');
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getStatusBadge = (status: Integration['status']) => {
    if (status === 'connected') {
      return (
        <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          <CheckCircle2 size={12} /> Connected
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
        <Zap size={12} /> Ready to Connect
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-[var(--color-muted)] mt-1">Manage integrations and team access</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center">
            <User className="text-[var(--color-accent)]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p className="text-sm text-[var(--color-muted)]">Logged in as {user?.name}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted)] mb-1">Name</p>
            <p className="font-medium">{user?.name || '-'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted)] mb-1">Email</p>
            <p className="font-medium">{user?.email || '-'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted)] mb-1">Role</p>
            <p className="font-medium capitalize">{user?.role || '-'}</p>
          </div>
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Zap className="text-[var(--color-accent)]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Integrations</h2>
            <p className="text-sm text-[var(--color-muted)]">Connect external services to power up Vantix</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
          <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">
            Integrations let you pull data from other services directly into Vantix.
            Once connected, you will see live updates in your Projects, Clients, and Dashboard.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isExpanded = expandedIntegration === integration.id;
            return (
              <motion.div key={integration.id} layout
                className="bg-[var(--color-primary)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="p-4 cursor-pointer" onClick={() => setExpandedIntegration(isExpanded ? null : integration.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-[var(--color-muted)]">{integration.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </div>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-[var(--color-border)] p-4 bg-white/5"
                  >
                    <h4 className="text-sm font-medium mb-3">What you will get:</h4>
                    <ul className="space-y-2">
                      {integration.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                          <CheckCircle2 size={14} className="text-green-400" /> {benefit}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-4 w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black py-3 rounded-xl font-medium transition-all">
                      Connect {integration.name}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Team Members */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Shield className="text-purple-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-sm text-[var(--color-muted)]">{teamMembers.length} members with access</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div key={member.name}
              className="flex items-center gap-4 p-4 bg-[var(--color-primary)] rounded-xl border border-[var(--color-border)]">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                member.type === 'bot'
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {member.name[0]}
              </div>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-[var(--color-muted)]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black'
          }`}
        >
          <Save size={20} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </motion.div>
    </div>
  );
}

