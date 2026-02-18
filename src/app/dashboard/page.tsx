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

// ─── Seed Data ───────────────────────────────────────────────────────
const SEED_INVOICES: Invoice[] = [
  { id: '1', client: 'SecuredTampa', amount: 2000, status: 'paid', date: '2026-01-15', paidDate: '2026-01-20' },
  { id: '2', client: 'SecuredTampa', amount: 2500, status: 'outstanding', date: '2026-02-01', dueDate: '2026-03-01' },
  { id: '3', client: 'JFK', amount: 1500, status: 'paid', date: '2025-12-01', paidDate: '2025-12-10' },
  { id: '4', client: 'JFK', amount: 800, status: 'paid', date: '2026-01-10', paidDate: '2026-01-15' },
  { id: '5', client: 'Dave App', amount: 3200, status: 'paid', date: '2025-11-15', paidDate: '2025-11-20' },
  { id: '6', client: 'Local Roofing Co', amount: 1800, status: 'outstanding', date: '2026-02-10', dueDate: '2026-03-10' },
  { id: '7', client: 'SecuredTampa', amount: 1200, status: 'paid', date: '2025-10-01', paidDate: '2025-10-05' },
  { id: '8', client: 'JFK', amount: 600, status: 'paid', date: '2025-09-15', paidDate: '2025-09-20' },
];

const SEED_PROJECTS: Project[] = [
  { id: '1', name: 'SecuredTampa Website', client: 'SecuredTampa', status: 'active', progress: 90, value: 4500 },
  { id: '2', name: 'JFK Maintenance', client: 'JFK', status: 'active', progress: 45, value: 2400 },
  { id: '3', name: 'Dave App StockX Integration', client: 'Dave', status: 'active', progress: 60, value: 3200 },
  { id: '4', name: 'Local Roofing SEO', client: 'Local Roofing Co', status: 'completed', progress: 100, value: 1800 },
];

const SEED_LEADS: Lead[] = [
  { id: '1', name: 'Mike Torres', company: 'Tampa Electric', stage: 'new', value: 5000, source: 'Website', createdAt: '2026-02-15' },
  { id: '2', name: 'Sarah Chen', company: 'Bayshore Dental', stage: 'contacted', value: 3500, source: 'Referral', createdAt: '2026-02-10' },
  { id: '3', name: 'James Wright', company: 'Gulf Coast HVAC', stage: 'qualified', value: 8000, source: 'Cold Outreach', createdAt: '2026-02-05' },
  { id: '4', name: 'Lisa Park', company: 'Clearwater Realty', stage: 'proposal', value: 6000, source: 'Website', createdAt: '2026-01-28' },
  { id: '5', name: 'Tom Bradley', company: 'Suncoast Auto', stage: 'won', value: 4200, source: 'Referral', createdAt: '2026-01-15' },
];

const SEED_TASKS: TaskItem[] = [
  { id: '1', title: 'Finalize SecuredTampa homepage design', dueDate: '2026-02-19', status: 'in-progress', priority: 'high', project: 'SecuredTampa' },
  { id: '2', title: 'Send JFK monthly report', dueDate: '2026-02-20', status: 'pending', priority: 'medium', project: 'JFK' },
  { id: '3', title: 'Follow up with Gulf Coast HVAC', dueDate: '2026-02-21', status: 'pending', priority: 'high', project: 'Sales' },
  { id: '4', title: 'Deploy StockX API update', dueDate: '2026-02-22', status: 'pending', priority: 'medium', project: 'Dave App' },
  { id: '5', title: 'Prepare proposal for Clearwater Realty', dueDate: '2026-02-23', status: 'pending', priority: 'high', project: 'Sales' },
  { id: '6', title: 'Invoice Local Roofing Co final payment', dueDate: '2026-02-24', status: 'pending', priority: 'low', project: 'Billing' },
];

const SEED_ACTIVITIES: ActivityItem[] = [
  { id: '1', description: 'Invoice #006 sent to Local Roofing Co', timestamp: '2026-02-18T01:30:00', type: 'invoice' },
  { id: '2', description: 'New lead from website: Mike Torres', timestamp: '2026-02-17T22:15:00', type: 'lead' },
  { id: '3', description: 'Payment received from SecuredTampa - $2,000', timestamp: '2026-02-17T18:00:00', type: 'payment' },
  { id: '4', description: 'Proposal sent to Clearwater Realty', timestamp: '2026-02-17T14:30:00', type: 'proposal' },
  { id: '5', description: 'Task completed: SEO audit for Local Roofing', timestamp: '2026-02-17T11:00:00', type: 'task' },
  { id: '6', description: 'Follow-up email sent to Sarah Chen', timestamp: '2026-02-16T16:45:00', type: 'email' },
  { id: '7', description: 'JFK maintenance update deployed', timestamp: '2026-02-16T10:30:00', type: 'deploy' },
  { id: '8', description: 'Meeting scheduled with Gulf Coast HVAC', timestamp: '2026-02-15T15:00:00', type: 'meeting' },
  { id: '9', description: 'New lead from referral: Sarah Chen', timestamp: '2026-02-15T09:00:00', type: 'lead' },
  { id: '10', description: 'Contract signed with Suncoast Auto', timestamp: '2026-02-14T13:00:00', type: 'contract' },
];

const SEED_CLIENTS: Client[] = [
  { id: '1', name: 'SecuredTampa', health: 92, revenue: 4500, status: 'active', lastContact: '2026-02-17' },
  { id: '2', name: 'JFK (justfourkicks)', health: 78, revenue: 2900, status: 'active', lastContact: '2026-02-16' },
  { id: '3', name: 'Dave App', health: 85, revenue: 3200, status: 'active', lastContact: '2026-02-14' },
  { id: '4', name: 'Local Roofing Co', health: 65, revenue: 1800, status: 'active', lastContact: '2026-02-10' },
  { id: '5', name: 'Suncoast Auto', health: 95, revenue: 4200, status: 'new', lastContact: '2026-02-14' },
];

// ─── Revenue by month (seed) ────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: 'Sep', amount: 600 },
  { month: 'Oct', amount: 1200 },
  { month: 'Nov', amount: 3200 },
  { month: 'Dec', amount: 1500 },
  { month: 'Jan', amount: 3000 },
  { month: 'Feb', amount: 2000 },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${n.toLocaleString()}`;
}

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

function getPriorityColor(p?: string) {
  if (p === 'high') return 'text-red-500';
  if (p === 'medium') return 'text-[#B07A45]';
  return 'text-[#7A746C]';
}

// ─── Skeleton ────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E3D9CD] rounded-lg ${className}`} />;
}

function MetricSkeleton() {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

// ─── Components ──────────────────────────────────────────────────────
function MetricCard({
  icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#7A746C] text-sm font-medium">{label}</span>
        <div className="text-[#B07A45]">{icon}</div>
      </div>
      <div className="text-[#1C1C1C] text-2xl font-bold tracking-tight">{value}</div>
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: typeof MONTHLY_REVENUE }) {
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#1C1C1C] font-bold text-sm">Monthly Revenue</h3>
        <span className="text-[#7A746C] text-xs">Last 6 months</span>
      </div>
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[#7A746C] text-[10px] font-medium">{formatCurrency(d.amount)}</span>
            <div className="w-full relative group">
              <div
                className="w-full bg-gradient-to-t from-[#B07A45] to-[#C89A6A] rounded-t-md transition-all duration-500 hover:from-[#C89A6A] hover:to-[#D4A96E]"
                style={{ height: `${(d.amount / max) * 120}px` }}
              />
            </div>
            <span className="text-[#7A746C] text-xs font-medium">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineCard({ leads }: { leads: Lead[] }) {
  const stages = [
    { key: 'new', label: 'New', color: 'bg-blue-400' },
    { key: 'contacted', label: 'Contacted', color: 'bg-yellow-400' },
    { key: 'qualified', label: 'Qualified', color: 'bg-orange-400' },
    { key: 'proposal', label: 'Proposal', color: 'bg-purple-400' },
    { key: 'won', label: 'Won', color: 'bg-green-500' },
  ];
  const counts = stages.map((s) => ({
    ...s,
    count: leads.filter((l) => l.stage === s.key || l.status === s.key).length,
  }));
  const totalValue = leads.reduce((s, l) => s + (l.value || 0), 0);

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1C1C1C] font-bold text-sm">Lead Pipeline</h3>
        <span className="text-[#B07A45] text-xs font-semibold">{formatMoney(totalValue)}</span>
      </div>
      <div className="space-y-3">
        {counts.map((s) => (
          <div key={s.key} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${s.color} shrink-0`} />
            <span className="text-[#7A746C] text-xs flex-1">{s.label}</span>
            <span className="text-[#1C1C1C] text-sm font-semibold">{s.count}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[#E3D9CD]">
        <div className="flex items-center justify-between">
          <span className="text-[#7A746C] text-xs">Total leads</span>
          <span className="text-[#1C1C1C] text-sm font-bold">{leads.length}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1C1C1C] font-bold text-sm">Recent Activity</h3>
        <Activity size={16} className="text-[#7A746C]" />
      </div>
      <div className="space-y-1">
        {activities.slice(0, 10).map((a) => (
          <div key={a.id} className="flex items-start gap-3 py-2 group">
            <div className="mt-0.5 text-[#B07A45] shrink-0">
              {getActivityIcon(a.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1C1C1C] text-xs leading-relaxed truncate">
                {a.description || a.action || a.message}
              </p>
            </div>
            <span className="text-[#7A746C] text-[10px] shrink-0 mt-0.5">
              {a.timestamp ? timeAgo(a.timestamp) : a.createdAt ? timeAgo(a.createdAt) : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingTasks({ tasks }: { tasks: TaskItem[] }) {
  const upcoming = tasks
    .filter((t) => t.status !== 'completed' && t.status !== 'done')
    .sort((a, b) => (a.dueDate || a.due || '').localeCompare(b.dueDate || b.due || ''))
    .slice(0, 6);

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1C1C1C] font-bold text-sm">Upcoming</h3>
        <Calendar size={16} className="text-[#7A746C]" />
      </div>
      <div className="space-y-1">
        {upcoming.map((t) => {
          const due = t.dueDate || t.due || '';
          const dateStr = due ? new Date(due + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          return (
            <div key={t.id} className="flex items-center gap-3 py-2">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getPriorityColor(t.priority).replace('text-', 'bg-')}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[#1C1C1C] text-xs truncate">{t.title}</p>
                <p className="text-[#7A746C] text-[10px]">{t.project}</p>
              </div>
              <span className="text-[#7A746C] text-[10px] shrink-0">{dateStr}</span>
            </div>
          );
        })}
      </div>
      <Link href="/dashboard/tasks" className="flex items-center gap-1 mt-3 pt-3 border-t border-[#E3D9CD] text-[#B07A45] text-xs font-medium hover:underline">
        View all tasks <ChevronRight size={12} />
      </Link>
    </div>
  );
}

function ClientHealth({ clients }: { clients: Client[] }) {
  const sorted = [...clients].sort((a, b) => (b.health || 0) - (a.health || 0));
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1C1C1C] font-bold text-sm">Client Health</h3>
        <Heart size={16} className="text-[#7A746C]" />
      </div>
      <div className="space-y-3">
        {sorted.map((c) => {
          const health = c.health || 0;
          const color = health >= 85 ? 'bg-green-500' : health >= 70 ? 'bg-yellow-400' : 'bg-red-400';
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#1C1C1C] text-xs font-medium">{c.name}</span>
                <span className="text-[#7A746C] text-[10px]">{health}%</span>
              </div>
              <div className="h-1.5 bg-[#E3D9CD] rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${health}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <Link href="/dashboard/clients" className="flex items-center gap-1 mt-3 pt-3 border-t border-[#E3D9CD] text-[#B07A45] text-xs font-medium hover:underline">
        View all clients <ChevronRight size={12} />
      </Link>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'New Invoice', icon: <FileText size={18} />, href: '/dashboard/invoices?action=new' },
    { label: 'Add Lead', icon: <UserPlus size={18} />, href: '/dashboard/leads?action=new' },
    { label: 'Create Task', icon: <CheckSquare size={18} />, href: '/dashboard/tasks?action=new' },
    { label: 'Send Email', icon: <Mail size={18} />, href: '/dashboard/outreach' },
  ];

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1C1C1C] font-bold text-sm">Quick Actions</h3>
        <Zap size={16} className="text-[#7A746C]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            {a.icon}
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [inv, proj, ld, tsk, act, cl] = await Promise.all([
          getData('invoices').catch(() => []),
          getData('projects').catch(() => []),
          getData('leads').catch(() => []),
          getData('tasks').catch(() => []),
          getData('activities').catch(() => []),
          getData('clients').catch(() => []),
        ]);
        setInvoices(inv.length ? inv : SEED_INVOICES);
        setProjects(proj.length ? proj : SEED_PROJECTS);
        setLeads(ld.length ? ld : SEED_LEADS);
        setTasks(tsk.length ? tsk : SEED_TASKS);
        setActivities(act.length ? act : SEED_ACTIVITIES);
        setClients(cl.length ? cl : SEED_CLIENTS);
      } catch {
        setInvoices(SEED_INVOICES);
        setProjects(SEED_PROJECTS);
        setLeads(SEED_LEADS);
        setTasks(SEED_TASKS);
        setActivities(SEED_ACTIVITIES);
        setClients(SEED_CLIENTS);
      }
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

  if (loading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 space-y-6">
        <div>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <MetricSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><Skeleton className="h-64" /></div>
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1C1C1C] text-xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[#7A746C] text-sm mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Row 1 — Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<DollarSign size={18} />}
          label="Total Revenue"
          value={formatMoney(totalRevenue)}
          trend="+12.5% from last month"
          trendUp={true}
        />
        <MetricCard
          icon={<Clock size={18} />}
          label="Outstanding"
          value={formatMoney(outstanding)}
          trend={`${invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').length} invoices pending`}
          trendUp={false}
        />
        <MetricCard
          icon={<Briefcase size={18} />}
          label="Active Projects"
          value={String(activeProjects)}
          trend="+1 this month"
          trendUp={true}
        />
        <MetricCard
          icon={<Target size={18} />}
          label="Active Leads"
          value={String(activeLeads)}
          trend={`${formatMoney(leads.reduce((s, l) => s + (l.value || 0), 0))} pipeline`}
          trendUp={true}
        />
      </div>

      {/* Row 2 — Chart + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={MONTHLY_REVENUE} />
        </div>
        <PipelineCard leads={leads} />
      </div>

      {/* Row 3 — Activity + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed activities={activities} />
        <UpcomingTasks tasks={tasks} />
      </div>

      {/* Row 4 — Client Health + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClientHealth clients={clients} />
        <QuickActions />
      </div>
    </div>
  );
}
