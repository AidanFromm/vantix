'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingDown, TrendingUp, Briefcase, Users, Plus,
  UserPlus, FileText, BarChart3, Zap, Clock, Sparkles, Target,
  Activity, RefreshCw,
} from 'lucide-react';
import { getDashboardStats, getActivities, getProjects, getInvoices } from '@/lib/supabase';
import type { DashboardStats, Activity as ActivityType, Project, Invoice } from '@/lib/types';

function AnimatedNumber({ value, prefix = '', duration = 1500 }: { value: number; prefix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number; let frame: number;
    const animate = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span className="tabular-nums">{prefix === '$' ? `$${display.toLocaleString()}` : display.toLocaleString()}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-[#E8E2DA] rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-[#E8E2DA]/50 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-80 bg-[#E8E2DA]/50 rounded-2xl" /><div className="h-80 bg-[#E8E2DA]/50 rounded-2xl" /></div>
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([getDashboardStats(), getActivities(15), getProjects({ status: 'active' })]);
      const statsRes = results[0].status === 'fulfilled' ? results[0].value : { data: null };
      const activitiesRes = results[1].status === 'fulfilled' ? results[1].value : { data: null };
      const projectsRes = results[2].status === 'fulfilled' ? results[2].value : { data: null };
      if (statsRes.data) setStats(statsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
    loadData();
  }, [loadData]);

  if (isLoading) return <LoadingSkeleton />;

  const kpiData = stats ? [
    { title: 'Revenue', value: stats.totalRevenue, prefix: '$', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Outstanding', value: stats.outstandingAmount, prefix: '$', icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', sub: `${stats.outstandingInvoices} invoices` },
    { title: 'Active Projects', value: stats.activeProjects, prefix: '', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { title: 'New Leads', value: stats.newLeads, prefix: '', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  ] : [];

  const getRelativeTime = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000); const d = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`; return `${d}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) { case 'payment': return { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' }; case 'project': return { icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' }; case 'lead': return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' }; default: return { icon: Activity, color: 'text-[#8C857C]', bg: 'bg-[#F5F0EB]' }; }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2D2A26]">{greeting}, <span className="text-[#B8895A]">Commander</span></h1>
          <p className="text-[#8C857C] mt-1">Here&apos;s your business at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-lg hover:bg-[#F5F0EB] text-[#8C857C] hover:text-[#2D2A26] transition-colors"><RefreshCw size={16} /></button>
          <div className="flex items-center gap-2 text-sm text-[#8C857C]"><Clock size={14} /><span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.length > 0 ? kpiData.map((data, i) => (
          <motion.div key={data.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-white border ${data.border} rounded-2xl p-5 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff] hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-[#8C857C] uppercase tracking-wide">{data.title}</span>
              <div className={`p-2.5 rounded-xl ${data.bg}`}><data.icon size={18} className={data.color} /></div>
            </div>
            <h3 className={`text-3xl lg:text-4xl font-bold text-[#2D2A26] tracking-tight`}><AnimatedNumber value={data.value} prefix={data.prefix} duration={1500 + i * 200} /></h3>
            {(data as any).sub && <p className="text-xs text-[#8C857C] mt-2">{(data as any).sub}</p>}
          </motion.div>
        )) : [...Array(4)].map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-[#E8E2DA] rounded-2xl p-5 flex flex-col items-center justify-center min-h-[140px] shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
            <BarChart3 size={20} className="text-[#B8895A] mb-2" /><p className="text-xs text-[#8C857C]">No data yet</p>
          </motion.div>
        ))}
      </div>

      {/* Activity + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white border border-[#E8E2DA] rounded-2xl overflow-hidden shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
          <div className="px-6 py-4 border-b border-[#E8E2DA]"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-blue-50"><Sparkles size={18} className="text-blue-600" /></div><div><h3 className="text-sm font-semibold text-[#2D2A26]">Recent Activity</h3><p className="text-xs text-[#8C857C]">What&apos;s happening</p></div></div></div>
          <div className="p-4 space-y-1 max-h-[320px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center"><Sparkles size={24} className="text-blue-300 mb-3" /><p className="text-sm text-[#2D2A26] mb-1">No activity yet</p><p className="text-xs text-[#8C857C]">Activity will appear here as you work</p></div>
            ) : activities.map((a, i) => {
              const { icon: Icon, color, bg } = getIcon(a.type);
              return (
                <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F0EB] transition-all cursor-pointer">
                  <div className={`p-2 rounded-lg ${bg}`}><Icon size={14} className={color} /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm text-[#2D2A26] truncate group-hover:text-[#B8895A] transition-colors">{a.title}</p>{a.description && <p className="text-xs text-[#B8895A] font-medium">{a.description}</p>}</div>
                  <span className="text-xs text-[#8C857C] shrink-0">{getRelativeTime(a.created_at)}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-white border border-[#E8E2DA] rounded-2xl overflow-hidden shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
          <div className="px-6 py-4 border-b border-[#E8E2DA]"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-[#B8895A]/10"><Briefcase size={18} className="text-[#B8895A]" /></div><div><h3 className="text-sm font-semibold text-[#2D2A26]">Active Projects</h3><p className="text-xs text-[#8C857C]">{projects.length} in progress</p></div></div></div>
          <div className="p-4 space-y-3">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center"><Briefcase size={24} className="text-[#B8895A]/30 mb-3" /><p className="text-sm text-[#2D2A26] mb-1">No active projects</p><p className="text-xs text-[#8C857C]">Create your first project to get started</p></div>
            ) : projects.slice(0, 5).map((project, i) => {
              const paid = (project as any).paid || project.spent || 0;
              const progress = project.progress ?? (project.budget ? Math.round((paid / project.budget) * 100) : 0);
              const healthColor = (project.health === 'yellow') ? 'bg-yellow-400' : (project.health === 'red') ? 'bg-red-400' : 'bg-emerald-400';
              return (
                <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="group p-4 rounded-xl bg-[#FAFAFA] hover:bg-[#F5F0EB] border border-[#E8E2DA] hover:border-[#B8895A]/20 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${healthColor}`} /><span className="text-sm font-medium text-[#2D2A26] group-hover:text-[#B8895A] transition-colors">{project.name}</span></div><span className="text-sm font-semibold text-[#2D2A26]">{progress}%</span></div>
                  <div className="relative h-2 bg-[#E8E2DA] rounded-full overflow-hidden"><motion.div className={`absolute inset-y-0 left-0 rounded-full ${healthColor}`} initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 1, delay: 0.8 + i * 0.1 }} /></div>
                  <div className="flex items-center justify-between mt-2"><p className="text-xs text-[#8C857C]">{project.client?.name || 'No client'}</p>{project.budget ? <p className="text-xs text-[#B8895A]">${paid.toLocaleString()} / ${project.budget.toLocaleString()}</p> : null}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white border border-[#E8E2DA] rounded-2xl overflow-hidden shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]">
        <div className="px-6 py-4 border-b border-[#E8E2DA]"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-purple-50"><Zap size={18} className="text-purple-600" /></div><h3 className="text-sm font-semibold text-[#2D2A26]">Quick Actions</h3></div></div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Project', icon: Plus, href: '/dashboard/projects', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Add Lead', icon: UserPlus, href: '/dashboard/leads', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'New Client', icon: Users, href: '/dashboard/clients', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'View Reports', icon: BarChart3, href: '/dashboard/financial', color: 'text-[#B8895A]', bg: 'bg-[#B8895A]/10' },
          ].map((action, i) => (
            <motion.a key={action.label} href={action.href} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.08 }} whileHover={{ scale: 1.03 }}
              className="group flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFA] hover:bg-[#F5F0EB] border border-[#E8E2DA] hover:border-[#B8895A]/20 transition-all">
              <div className={`p-2 rounded-lg ${action.bg}`}><action.icon size={14} className={action.color} /></div>
              <span className="text-sm text-[#8C857C] group-hover:text-[#2D2A26] transition-colors">{action.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
