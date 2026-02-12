'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DollarSign, Users, Zap, CheckSquare, Phone, ArrowRight,
  Plus, FileText, RefreshCw, Clock, AlertCircle, Mail, Send,
} from 'lucide-react';

function ls<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface CallRecord {
  id?: string;
  call_id?: string;
  from?: string;
  to?: string;
  callerName?: string;
  caller_name?: string;
  created_at?: string;
  started_at?: string;
  date?: string;
  summary?: string;
  status?: string;
  call_length?: number;
}

interface Task {
  id?: string;
  title?: string;
  status?: string;
  dueDate?: string;
  priority?: string;
}

interface RevenueEntry {
  amount: number;
  status?: string;
}

interface SentEmail {
  email: string;
  business: string;
  subject: string;
  template: string;
  date: string;
  timestamp: string;
}

interface OutreachData {
  totalSent: number;
  sentToday: number;
  totalLeads: number;
  leadsWithEmail: number;
  recentEmails: SentEmail[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function OverviewPage() {
  const [clients, setClients] = useState<unknown[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [outreach, setOutreach] = useState<OutreachData>({ totalSent: 0, sentToday: 0, totalLeads: 0, leadsWithEmail: 0, recentEmails: [] });
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setClients(ls<unknown[]>('vantix_clients', []));
    const allTasks = ls<Task[]>('vantix_tasks', []);
    setTasks(allTasks);

    const revData = ls<{ income?: RevenueEntry[] }>('vantix_revenue', { income: [] });
    const incomeArr: RevenueEntry[] = Array.isArray(revData) ? revData : (revData.income || []);
    setRevenue(incomeArr.reduce((s, e) => s + (e.amount || 0), 0));

    // Fetch calls
    try {
      const res = await fetch('/api/calls');
      if (res.ok) {
        const data = await res.json();
        setCalls(Array.isArray(data) ? data : (data.calls || []));
      }
    } catch {}

    // Fetch outreach
    try {
      const res = await fetch('/api/outreach');
      if (res.ok) {
        const data = await res.json();
        setOutreach(data);
      }
    } catch {}

    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, [load]);

  const openTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'completed');
  const today = new Date().toISOString().slice(0, 10);
  const dueTasks = tasks.filter(t => {
    if (t.status === 'done' || t.status === 'completed') return false;
    if (!t.dueDate) return false;
    return t.dueDate <= today;
  });

  const recentCalls = [...calls].sort((a, b) =>
    (b.created_at || b.started_at || b.date || '').localeCompare(a.created_at || a.started_at || a.date || '')
  ).slice(0, 5);

  const recentOutreach = outreach.recentEmails.slice(0, 5);

  const priorityColor: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-blue-500/20 text-blue-400',
  };

  const statusColor: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    ended: 'bg-emerald-500/20 text-emerald-400',
    'closed-won': 'bg-emerald-500/20 text-emerald-400',
    'in-progress': 'bg-blue-500/20 text-blue-400',
    missed: 'bg-red-500/20 text-red-400',
    failed: 'bg-red-500/20 text-red-400',
    'closed-lost': 'bg-red-500/20 text-red-400',
    queued: 'bg-amber-500/20 text-amber-400',
    'new-lead': 'bg-blue-500/20 text-blue-400',
    'no-answer': 'bg-amber-500/20 text-amber-400',
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <RefreshCw size={20} className="text-[#10b981]" />
        </motion.div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Leads', value: outreach.totalLeads, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Emails Sent', value: outreach.totalSent, icon: Send, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Clients', value: (clients as unknown[]).length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Open Tasks', value: openTasks.length, icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Total Calls', value: calls.length, icon: Phone, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Revenue', value: revenue, prefix: '$', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <motion.div className="space-y-5 pb-12" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">At a glance</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-white transition-colors px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[#10b981]/30">
          <RefreshCw size={13} strokeWidth={1.5} /> Refresh
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[#10b981]/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium">{s.label}</span>
              <div className={`${s.bg} ${s.color} p-1.5 rounded-lg`}>
                <s.icon size={16} strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {s.prefix || ''}{s.value.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Calls + Recent Outreach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Calls */}
        <motion.div variants={item}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Phone size={16} strokeWidth={1.5} className="text-[#10b981]" />
              Recent Calls
            </h2>
            <Link href="/dashboard/calls" className="text-[11px] text-[#10b981] hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentCalls.length === 0 && (
              <p className="text-xs text-[var(--color-muted)] py-6 text-center">No calls yet</p>
            )}
            {recentCalls.map((call, i) => {
              const name = call.callerName || call.caller_name || call.from || 'Unknown';
              const time = call.created_at || call.started_at || call.date || '';
              const st = (call.status || 'completed').toLowerCase();
              return (
                <div key={call.id || call.call_id || i} className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <Phone size={14} strokeWidth={1.5} className="text-[var(--color-muted)] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white truncate">{name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[st] || 'bg-white/10 text-white/60'}`}>
                        {st}
                      </span>
                    </div>
                    {call.summary && (
                      <p className="text-[11px] text-[var(--color-muted)] truncate mt-0.5">{call.summary}</p>
                    )}
                    {time && (
                      <span className="text-[10px] text-[var(--color-muted)]">{timeAgo(time)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Outreach */}
        <motion.div variants={item}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mail size={16} strokeWidth={1.5} className="text-[#10b981]" />
              Recent Outreach
            </h2>
            <Link href="/dashboard/outreach" className="text-[11px] text-[#10b981] hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentOutreach.length === 0 && (
              <p className="text-xs text-[var(--color-muted)] py-6 text-center">No emails sent yet</p>
            )}
            {recentOutreach.map((email, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                <Send size={14} strokeWidth={1.5} className="text-[var(--color-muted)] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white truncate">{email.business}</span>
                    <span className="text-[10px] text-[var(--color-muted)]">{email.date}</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] truncate mt-0.5">{email.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tasks Due + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tasks Due */}
        <motion.div variants={item}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock size={16} strokeWidth={1.5} className="text-[#10b981]" />
              Tasks Due
            </h2>
            <Link href="/dashboard/tasks" className="text-[11px] text-[#10b981] hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {dueTasks.length === 0 && (
              <p className="text-xs text-[var(--color-muted)] py-6 text-center">Nothing due today</p>
            )}
            {dueTasks.slice(0, 5).map((task, i) => {
              const p = (task.priority || 'medium').toLowerCase();
              const overdue = task.dueDate && task.dueDate < today;
              return (
                <div key={task.id || i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  {overdue ? (
                    <AlertCircle size={14} strokeWidth={1.5} className="text-red-400 shrink-0" />
                  ) : (
                    <CheckSquare size={14} strokeWidth={1.5} className="text-[var(--color-muted)] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-white truncate block">{task.title || 'Untitled'}</span>
                    {task.dueDate && (
                      <span className={`text-[10px] ${overdue ? 'text-red-400' : 'text-[var(--color-muted)]'}`}>
                        {overdue ? 'Overdue' : 'Due'}: {task.dueDate}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColor[p] || 'bg-white/10 text-white/60'}`}>
                    {p}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Plus size={16} strokeWidth={1.5} className="text-[#10b981]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Log a Call', href: '/dashboard/calls', icon: Phone },
              { label: 'Add Lead', href: '/dashboard/leads', icon: Zap },
              { label: 'Create Task', href: '/dashboard/tasks', icon: CheckSquare },
              { label: 'New Proposal', href: '/dashboard/proposals', icon: FileText },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[#10b981]/40 hover:bg-[#10b981]/5 transition-all">
                <a.icon size={16} strokeWidth={1.5} className="text-[#10b981]" />
                <span className="text-xs text-[var(--color-muted)] font-medium">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
