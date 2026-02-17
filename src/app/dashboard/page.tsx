'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DollarSign, TrendingDown, TrendingUp, Briefcase, Users, Plus,
  UserPlus, FileText, BarChart3, Zap, Clock, Sparkles, Target,
  ArrowUpRight, ArrowDownRight, Activity, Loader2, RefreshCw,
} from 'lucide-react';
import { getDashboardStats, getActivities, getProjects, getInvoices } from '@/lib/supabase';
import type { DashboardStats, Activity as ActivityType, Project, Invoice } from '@/lib/types';

// ============================================================================
// ANIMATED COUNTER
// ============================================================================
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1500 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number; let frame: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  const formatted = prefix === '$' ? `${prefix}${display.toLocaleString()}` : `${display.toLocaleString()}${suffix}`;
  return <span className="tabular-nums">{formatted}</span>;
}

// ============================================================================
// SPARKLINE
// ============================================================================
function Sparkline({ data, color = '#10b981', width = 80, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (!data || data.length < 2) return null;
  const pad = 2; const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const pts = data.map((v, i) => `${pad + (i / (data.length - 1)) * (width - pad * 2)},${height - pad - ((v - min) / range) * (height - pad * 2)}`);
  const gid = `sp-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs><linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={color} stopOpacity="0.4" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`${pad},${height} ${pts.join(' ')} ${width - pad},${height}`} fill={`url(#${gid})`} />
      <motion.path d={`M ${pts.join(' L ')}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }} />
    </svg>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================
function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2"><div className="h-8 w-64 bg-white/5 rounded-lg" /><div className="h-4 w-48 bg-white/5 rounded-lg" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-80 bg-white/5 rounded-2xl" /><div className="h-80 bg-white/5 rounded-2xl" /></div>
    </div>
  );
}

// ============================================================================
// KPI CARD
// ============================================================================
interface KPIData { title: string; value: number; prefix?: string; suffix?: string; trend: number; trendLabel: string; sparkline: number[]; icon: React.ElementType; color: string; }

function KPICard({ data, index }: { data: KPIData; index: number }) {
  const Icon = data.icon; const isPos = data.trend >= 0;
  const TrendIcon = isPos ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="group relative overflow-hidden">
      <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/20">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `linear-gradient(135deg, ${data.color}10 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${data.color}15` }}><Icon size={18} style={{ color: data.color }} /></div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">{data.title}</span>
            </div>
            <Sparkline data={data.sparkline} color={isPos ? '#10b981' : '#ef4444'} />
          </div>
          <div className="mb-3"><h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight"><AnimatedNumber value={data.value} prefix={data.prefix} suffix={data.suffix} duration={1500 + index * 200} /></h3></div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}><TrendIcon size={12} /><span>{isPos ? '+' : ''}{data.trend}%</span></div>
            <span className="text-xs text-gray-500">{data.trendLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// REVENUE CHART
// ============================================================================
function RevenueChart({ data }: { data: { month: string; revenue: number; expenses: number }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-emerald-500/10"><BarChart3 size={18} className="text-emerald-400" /></div><div><h3 className="text-sm font-semibold text-white">Revenue Trend</h3><p className="text-xs text-gray-500">Last 6 months</p></div></div>
          <div className="flex items-center gap-4 text-xs"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-gray-400">Revenue</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-500" /><span className="text-gray-400">Expenses</span></div></div>
        </div>
        <div className="h-64">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-xl bg-emerald-500/10 mb-4"><BarChart3 size={32} className="text-emerald-400" /></div>
              <p className="text-sm text-white mb-2">No financial data yet</p>
              <p className="text-xs text-gray-500 max-w-xs">Start adding invoices and expenses to see your revenue trends here</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }} labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: '8px' }} itemStyle={{ color: '#9ca3af', fontSize: '12px' }} formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="expenses" stroke="#8b5cf6" strokeWidth={2} fill="url(#expensesGradient)" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// ACTIVITY FEED
// ============================================================================
function ActivityFeed({ activities }: { activities: ActivityType[] }) {
  const getRelativeTime = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000); const d = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`; if (d === 1) return 'Yesterday'; return `${d}d ago`;
  };
  const getIcon = (type: string) => {
    switch (type) { case 'payment': return { icon: DollarSign, color: '#10b981' }; case 'project': return { icon: Briefcase, color: '#3b82f6' }; case 'lead': return { icon: Users, color: '#8b5cf6' }; case 'client': return { icon: UserPlus, color: '#f59e0b' }; default: return { icon: Activity, color: '#6b7280' }; }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-blue-500/10"><Sparkles size={18} className="text-blue-400" /></div><div><h3 className="text-sm font-semibold text-white">Recent Activity</h3><p className="text-xs text-gray-500">What is happening in your business</p></div></div></div>
      <div className="p-4 space-y-1 max-h-[320px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center"><div className="p-3 rounded-xl bg-blue-500/10 mb-3"><Sparkles size={24} className="text-blue-400" /></div><p className="text-sm text-white mb-1">No activity yet</p><p className="text-xs text-gray-500">Activity will appear here as you work</p></div>
        ) : (
          <AnimatePresence>
            {activities.map((a, i) => {
              const { icon: Icon, color } = getIcon(a.type);
              return (
                <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                  <div className="p-2 rounded-lg transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15` }}><Icon size={14} style={{ color }} /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm text-white truncate group-hover:text-emerald-400 transition-colors">{a.title}</p>{a.description && <p className="text-xs text-emerald-400 font-medium">{a.description}</p>}</div>
                  <span className="text-xs text-gray-500 shrink-0">{getRelativeTime(a.created_at)}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// ACTIVE PROJECTS CARD
// ============================================================================
function ProjectsCard({ projects }: { projects: Project[] }) {
  const getStatusColor = (health: string) => {
    switch (health) { case 'green': return { dot: 'bg-emerald-400', bar: 'bg-emerald-500' }; case 'yellow': return { dot: 'bg-yellow-400', bar: 'bg-yellow-500' }; default: return { dot: 'bg-red-400', bar: 'bg-red-500' }; }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-orange-500/10"><Briefcase size={18} className="text-orange-400" /></div><div><h3 className="text-sm font-semibold text-white">Active Projects</h3><p className="text-xs text-gray-500">{projects.length} in progress</p></div></div></div>
      <div className="p-4 space-y-3">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center"><div className="p-3 rounded-xl bg-orange-500/10 mb-3"><Briefcase size={24} className="text-orange-400" /></div><p className="text-sm text-white mb-1">No active projects</p><p className="text-xs text-gray-500">Create your first project to get started</p></div>
        ) : (
          projects.slice(0, 5).map((project, i) => {
            const colors = getStatusColor(project.health);
            return (
              <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${colors.dot}`} /><span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{project.name}</span></div><span className="text-sm font-semibold text-white">{project.progress}%</span></div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden"><motion.div className={`absolute inset-y-0 left-0 rounded-full ${colors.bar}`} initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: 'easeOut' }} /></div>
                <div className="flex items-center justify-between mt-2"><p className="text-xs text-gray-500">{project.client?.name || 'No client'}</p>{project.budget && <p className="text-xs text-emerald-400">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</p>}</div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// QUICK ACTIONS
// ============================================================================
function QuickActions() {
  const actions = [
    { label: 'New Project', icon: Plus, color: '#10b981', href: '/dashboard/projects' },
    { label: 'Add Lead', icon: UserPlus, color: '#3b82f6', href: '/dashboard/leads' },
    { label: 'New Client', icon: Users, color: '#8b5cf6', href: '/dashboard/clients' },
    { label: 'View Reports', icon: BarChart3, color: '#f59e0b', href: '#' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-purple-500/10"><Zap size={18} className="text-purple-400" /></div><div><h3 className="text-sm font-semibold text-white">Quick Actions</h3><p className="text-xs text-gray-500">Get things done fast</p></div></div></div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.a key={action.label} href={action.href} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.08 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all">
              <div className="p-2 rounded-lg transition-transform group-hover:scale-110" style={{ backgroundColor: `${action.color}15` }}><Icon size={14} style={{ color: action.color }} /></div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [chartData, setChartData] = useState<{ month: string; revenue: number; expenses: number }[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, activitiesRes, projectsRes, invoicesRes] = await Promise.all([
        getDashboardStats(),
        getActivities(15),
        getProjects({ status: 'active' }),
        getInvoices(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (invoicesRes.data) {
        setInvoices(invoicesRes.data);
        // Build chart data from invoices (group by month)
        const monthlyData: Record<string, { revenue: number; expenses: number }> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleDateString('en-US', { month: 'short' });
          monthlyData[key] = { revenue: 0, expenses: 0 };
        }
        invoicesRes.data.filter(inv => inv.status === 'paid' && inv.paid_date).forEach(inv => {
          const d = new Date(inv.paid_date!);
          const key = d.toLocaleDateString('en-US', { month: 'short' });
          if (monthlyData[key]) monthlyData[key].revenue += inv.amount;
        });
        setChartData(Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    loadData();
  }, [loadData]);

  const kpiData: KPIData[] = stats ? [
    { title: 'Revenue', value: stats.totalRevenue, prefix: '$', trend: stats.totalRevenue > 0 ? 12 : 0, trendLabel: 'total earned', sparkline: [0, 0, 0, 0, 0, stats.totalRevenue], icon: DollarSign, color: '#10b981' },
    { title: 'Outstanding', value: stats.outstandingAmount, prefix: '$', trend: 0, trendLabel: `${stats.outstandingInvoices} invoices`, sparkline: [0, 0, 0, 0, stats.outstandingAmount, stats.outstandingAmount], icon: TrendingDown, color: '#f59e0b' },
    { title: 'Active Projects', value: stats.activeProjects, suffix: '', trend: 0, trendLabel: 'in progress', sparkline: [0, 0, 1, 1, stats.activeProjects, stats.activeProjects], icon: Briefcase, color: '#8b5cf6' },
    { title: 'New Leads', value: stats.newLeads, suffix: '', trend: 0, trendLabel: 'in pipeline', sparkline: [0, 0, 0, stats.newLeads, stats.newLeads, stats.newLeads], icon: Target, color: '#3b82f6' },
  ] : [];

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            {greeting},&nbsp;
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Commander</span>
          </h1>
          <p className="text-gray-500 mt-1">Here is your business at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><RefreshCw size={16} /></button>
          <div className="flex items-center gap-2 text-sm text-gray-500"><Clock size={14} /><span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((data, i) => <KPICard key={data.title} data={data} index={i} />)}
        {kpiData.length === 0 && [...Array(4)].map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[140px]">
            <div className="p-3 rounded-xl bg-emerald-500/10 mb-3"><BarChart3 size={20} className="text-emerald-400" /></div>
            <p className="text-xs text-gray-500">No data yet</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><RevenueChart data={chartData} /></div>
        <div><ActivityFeed activities={activities} /></div>
      </div>

      {/* Projects + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ProjectsCard projects={projects} /></div>
        <div><QuickActions /></div>
      </div>
    </div>
  );
}
