'use client';

import { useState, useEffect } from 'react';
import { getData } from '@/lib/data';
import {
  DollarSign,
  Clock,
  Briefcase,
  Users,
  TrendingUp,
  TrendingDown,
  FileText,
  UserPlus,
  CheckSquare,
  Mail,
  Activity,
  Calendar,
  Heart,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  MessageSquare,
  Star,
  Send,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import KPICard from '@/components/dashboard/KPICard';

// ─── Types ───────────────────────────────────────────────────────────
interface Invoice {
  id: string;
  client?: string;
  clientName?: string;
  amount?: number;
  total?: number;
  status?: string;
  date?: string;
  dueDate?: string;
  paidDate?: string;
}

interface Project {
  id: string;
  name?: string;
  client?: string;
  status?: string;
  progress?: number;
  value?: number;
  budget?: number;
}

interface Lead {
  id: string;
  name?: string;
  company?: string;
  stage?: string;
  status?: string;
  value?: number;
  source?: string;
  createdAt?: string;
}

interface TaskItem {
  id: string;
  title?: string;
  dueDate?: string;
  due?: string;
  status?: string;
  priority?: string;
  project?: string;
}

interface Client {
  id: string;
  name?: string;
  company?: string;
  health?: number;
  revenue?: number;
  status?: string;
  lastContact?: string;
}

interface ActivityItem {
  id: string;
  action?: string;
  description?: string;
  message?: string;
  timestamp?: string;
  createdAt?: string;
  date?: string;
  type?: string;
}

interface Booking {
  id: string;
  clientName?: string;
  client?: string;
  date?: string;
  time?: string;
  status?: string;
  type?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatMoney(n: number): string {
  return `$${n.toLocaleString()}`;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getActivityIcon(type?: string) {
  switch (type) {
    case 'invoice': return <FileText size={14} />;
    case 'lead': return <UserPlus size={14} />;
    case 'payment': return <DollarSign size={14} />;
    case 'proposal': return <Send size={14} />;
    case 'task': return <CheckSquare size={14} />;
    case 'email': return <Mail size={14} />;
    case 'deploy': return <Zap size={14} />;
    case 'meeting': return <Calendar size={14} />;
    case 'contract': return <Star size={14} />;
    default: return <Activity size={14} />;
  }
}

function getPriorityDot(p?: string) {
  if (p === 'high') return 'bg-red-500';
  if (p === 'medium') return 'bg-[#B07A45]';
  return 'bg-[#7A746C]';
}

// ─── Skeleton ────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E3D9CD] rounded-lg ${className}`} />;
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<{ id: string; amount?: number }[]>([]);
  const [payments, setPayments] = useState<{ id: string; amount?: number }[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vantix_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserName(parsed.name || parsed.username || parsed.email?.split('@')[0] || stored);
        } catch {
          setUserName(stored);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [inv, proj, ld, tsk, act, cl, exp, pay, bk] = await Promise.all([
          getData('invoices').catch(() => []),
          getData('projects').catch(() => []),
          getData('leads').catch(() => []),
          getData('tasks').catch(() => []),
          getData('activities').catch(() => []),
          getData('clients').catch(() => []),
          getData('expenses').catch(() => []),
          getData('payments').catch(() => []),
          getData('bookings').catch(() => []),
        ]);
        setInvoices(inv);
        setProjects(proj);
        setLeads(ld);
        setTasks(tsk);
        setActivities(act);
        setClients(cl);
        setExpenses(exp);
        setPayments(pay);
        setBookings(bk);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  // Compute metrics
  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + (i.amount || i.total || 0), 0);
  const outstanding = invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((s, i) => s + (i.amount || i.total || 0), 0);
  const activeProjects = projects.filter(
    (p) => p.status === 'active' || p.status === 'in-progress'
  ).length;
  const activeLeads = leads.filter(
    (l) => l.stage !== 'won' && l.stage !== 'lost' && l.status !== 'won' && l.status !== 'lost'
  ).length;
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  // Quick actions
  const quickActions = [
    { label: 'New Invoice', icon: FileText, href: '/dashboard/finances/invoices?action=new' },
    { label: 'Add Lead', icon: UserPlus, href: '/dashboard/leads?action=new' },
    { label: 'Create Task', icon: CheckSquare, href: '/dashboard/tasks?action=new' },
    { label: 'Send Email', icon: Mail, href: '/dashboard/outreach' },
  ];

  // Upcoming tasks
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed' && t.status !== 'done')
    .sort((a, b) => (a.dueDate || a.due || '').localeCompare(b.dueDate || b.due || ''))
    .slice(0, 5);

  // Recent leads
  const recentLeads = [...leads]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  // Upcoming bookings
  const upcomingBookings = [...bookings]
    .filter((b) => b.status !== 'cancelled')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Skeleton className="lg:col-span-3 h-80" />
          <Skeleton className="lg:col-span-2 h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ─── Header: Welcome + Quick Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1C1C1C] tracking-tight leading-tight">
            {userName ? `Welcome back, ${userName}` : 'Dashboard'}
          </h1>
          <p className="text-[14px] text-[#7A746C] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#EEE6DC] border border-[#E3D9CD] text-[#1C1C1C] rounded-lg text-xs font-medium hover:bg-[#B07A45]/10 hover:border-[#B07A45]/30 transition-all"
              >
                <Icon size={14} className="text-[#B07A45]" />
                {a.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── KPI Cards Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={totalRevenue}
          prefix="$"
          icon={DollarSign}
          trend={totalRevenue > 0 ? 12 : 0}
          trendLabel="vs last month"
          sparklineData={[40, 55, 45, 60, 52, 70, 65, 80]}
        />
        <KPICard
          title="Outstanding"
          value={outstanding}
          prefix="$"
          icon={Clock}
          trend={outstanding > 0 ? -5 : 0}
          trendLabel="pending"
          sparklineData={[30, 40, 35, 50, 45, 38, 42, 35]}
        />
        <KPICard
          title="Active Projects"
          value={activeProjects}
          icon={Briefcase}
          trend={8}
          trendLabel="this month"
          sparklineData={[2, 3, 3, 4, 3, 5, 4, activeProjects]}
        />
        <KPICard
          title="Active Leads"
          value={activeLeads}
          icon={Target}
          trend={activeLeads > 0 ? 15 : 0}
          trendLabel="growth"
          sparklineData={[5, 8, 6, 10, 9, 12, 11, activeLeads]}
        />
      </div>

      {/* ─── 2-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (60%) — Activity Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Activity Feed */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#B07A45] via-[#C89A6A] to-[#B07A45]" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1C1C1C] font-bold text-base">Recent Activity</h2>
                <Activity size={16} className="text-[#7A746C]" />
              </div>
              <div className="space-y-0.5">
                {activities.length === 0 && (
                  <p className="text-[#7A746C] text-sm py-4 text-center">No recent activity</p>
                )}
                {activities.slice(0, 12).map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-[#E3D9CD]/50 last:border-0">
                    <div className="mt-0.5 p-1.5 rounded-md bg-[#B07A45]/10 text-[#B07A45] shrink-0">
                      {getActivityIcon(a.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1C1C1C] text-sm leading-relaxed truncate">
                        {a.description || a.action || a.message}
                      </p>
                    </div>
                    <span className="text-[#7A746C] text-[11px] shrink-0 mt-0.5">
                      {a.timestamp ? timeAgo(a.timestamp) : a.createdAt ? timeAgo(a.createdAt) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#B07A45] via-[#C89A6A] to-[#B07A45]" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1C1C1C] font-bold text-base">Upcoming Tasks</h2>
                <CheckSquare size={16} className="text-[#7A746C]" />
              </div>
              <div className="space-y-1">
                {upcomingTasks.length === 0 && (
                  <p className="text-[#7A746C] text-sm py-4 text-center">No upcoming tasks</p>
                )}
                {upcomingTasks.map((t) => {
                  const due = t.dueDate || t.due || '';
                  const dateStr = due ? new Date(due + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                  return (
                    <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-[#E3D9CD]/50 last:border-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(t.priority)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1C1C1C] text-sm truncate">{t.title}</p>
                        {t.project && <p className="text-[#7A746C] text-[11px]">{t.project}</p>}
                      </div>
                      <span className="text-[#7A746C] text-[11px] shrink-0">{dateStr}</span>
                    </div>
                  );
                })}
              </div>
              <Link href="/dashboard/tasks" className="flex items-center gap-1 mt-3 pt-3 border-t border-[#E3D9CD] text-[#B07A45] text-xs font-medium hover:underline">
                View all tasks <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (40%) — Quick Links, Bookings, Recent Leads */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#B07A45] via-[#C89A6A] to-[#B07A45]" />
            <div className="p-5">
              <h2 className="text-[#1C1C1C] font-bold text-base mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Invoices', href: '/dashboard/finances/invoices', icon: FileText },
                  { label: 'Pipeline', href: '/dashboard/pipeline', icon: Target },
                  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
                  { label: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] hover:border-[#B07A45]/30 hover:bg-[#B07A45]/5 transition-all"
                    >
                      <Icon size={15} className="text-[#B07A45]" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#B07A45] via-[#C89A6A] to-[#B07A45]" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1C1C1C] font-bold text-base">Upcoming Bookings</h2>
                <Calendar size={16} className="text-[#7A746C]" />
              </div>
              <div className="space-y-1">
                {upcomingBookings.length === 0 && (
                  <p className="text-[#7A746C] text-sm py-4 text-center">No upcoming bookings</p>
                )}
                {upcomingBookings.map((b) => {
                  const dateStr = b.date ? new Date(b.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                  return (
                    <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-[#E3D9CD]/50 last:border-0">
                      <div className="w-9 h-9 rounded-lg bg-[#B07A45]/10 flex items-center justify-center text-[#B07A45] text-xs font-bold shrink-0">
                        {dateStr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1C1C1C] text-sm truncate">{b.clientName || b.client || 'Client'}</p>
                        <p className="text-[#7A746C] text-[11px]">{b.time || b.type || ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/dashboard/bookings" className="flex items-center gap-1 mt-3 pt-3 border-t border-[#E3D9CD] text-[#B07A45] text-xs font-medium hover:underline">
                View all bookings <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#B07A45] via-[#C89A6A] to-[#B07A45]" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1C1C1C] font-bold text-base">Recent Leads</h2>
                <Target size={16} className="text-[#7A746C]" />
              </div>
              <div className="space-y-1">
                {recentLeads.length === 0 && (
                  <p className="text-[#7A746C] text-sm py-4 text-center">No leads yet</p>
                )}
                {recentLeads.map((l) => (
                  <div key={l.id} className="flex items-center gap-3 py-2.5 border-b border-[#E3D9CD]/50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#B07A45]/10 flex items-center justify-center text-[#B07A45] text-xs font-bold shrink-0">
                      {(l.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1C1C1C] text-sm truncate">{l.name}</p>
                      <p className="text-[#7A746C] text-[11px]">{l.company || l.source || ''}</p>
                    </div>
                    {l.value && l.value > 0 && (
                      <span className="text-[#B07A45] text-xs font-semibold shrink-0">
                        {formatMoney(l.value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <Link href="/dashboard/leads" className="flex items-center gap-1 mt-3 pt-3 border-t border-[#E3D9CD] text-[#B07A45] text-xs font-medium hover:underline">
                View all leads <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
