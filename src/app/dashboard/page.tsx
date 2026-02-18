'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, Briefcase, Users, Plus,
  UserPlus, FileText, BarChart3, Clock, Target,
  Activity, RefreshCw, ArrowRight, CheckCircle2, AlertTriangle,
  Phone, Calendar, X, Bell,
} from 'lucide-react';
import Link from 'next/link';

interface BookingAlert { id: string; name: string; email: string; phone?: string; date: string; time: string; notes?: string; created_at: string; dismissed?: boolean; }
interface InvoiceData { id: string; status: string; total?: number; amount?: number; paid_at?: string; paid_date?: string; due_date?: string; created_at: string; client_id?: string; invoice_number?: string; }
interface LeadData { id: string; status: string; estimated_value?: number; name: string; company?: string; created_at: string; }
interface ProjectData { id: string; status: string; name: string; health?: string; budget?: number; spent?: number; progress?: number; client_id?: string; deadline?: string; }
interface TaskData { id: string; title: string; due_date?: string; column: string; priority: string; }
interface ActivityData { id: string; type: string; title: string; description?: string; created_at: string; }
interface ClientData { id: string; name: string; contact_name?: string; }

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number; let frame: number;
    const animate = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 1500, 1); setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span className="tabular-nums">{prefix === '$' ? `$${display.toLocaleString()}` : display.toLocaleString()}</span>;
}

function RevenueChart({ invoices }: { invoices: InvoiceData[] }) {
  const monthData = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();
      const month = d.getMonth();
      const total = invoices
        .filter(inv => {
          if (inv.status !== 'paid') return false;
          const paidDate = inv.paid_at || inv.paid_date || inv.created_at;
          const pd = new Date(paidDate);
          return pd.getFullYear() === year && pd.getMonth() === month;
        })
        .reduce((s, inv) => s + (inv.total || inv.amount || 0), 0);
      months.push({ label: monthStr, value: total });
    }
    return months;
  }, [invoices]);

  const max = Math.max(...monthData.map(m => m.value), 1);
  const chartH = 140;
  const chartW = 400;
  const padding = 40;
  const usableW = chartW - padding * 2;
  const usableH = chartH - 30;

  const points = monthData.map((m, i) => ({
    x: padding + (i / (monthData.length - 1)) * usableW,
    y: 10 + usableH - (m.value / max) * usableH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${points[points.length - 1].x} ${chartH - 20} L ${points[0].x} ${chartH - 20} Z`;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E5E34" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8E5E34" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line key={i} x1={padding} x2={chartW - padding} y1={10 + usableH * (1 - pct)} y2={10 + usableH * (1 - pct)} stroke="#E3D9CD" strokeWidth="0.5" />
      ))}
      <path d={areaD} fill="url(#revGrad)" />
      <path d={pathD} fill="none" stroke="#8E5E34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#8E5E34" strokeWidth="2" />
          <text x={p.x} y={chartH - 6} textAnchor="middle" className="fill-[#7A746C]" fontSize="10">{monthData[i].label}</text>
          {monthData[i].value > 0 && <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-[#1C1C1C]" fontSize="9" fontWeight="600">${(monthData[i].value / 1000).toFixed(1)}k</text>}
        </g>
      ))}
    </svg>
  );
}

function LeadFunnel({ leads }: { leads: LeadData[] }) {
  const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const stageLabels: Record<string, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost' };
  const stageColors: Record<string, string> = { new: '#B07A45', contacted: '#B07A45', qualified: '#B07A45', proposal: '#B07A45', negotiation: '#B07A45', won: '#B07A45', lost: '#8E5E34' };

  const counts = stages.map(s => ({ stage: s, count: leads.filter(l => l.status === s).length }));
  const maxCount = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="space-y-2">
      {counts.filter(c => c.count > 0 || ['new', 'won', 'lost'].includes(c.stage)).map(({ stage, count }) => (
        <div key={stage} className="flex items-center gap-3">
          <span className="text-xs text-[#7A746C] w-20 text-right">{stageLabels[stage]}</span>
          <div className="flex-1 h-6 bg-[#EEE6DC] rounded-lg overflow-hidden">
            <div className="h-full rounded-lg transition-all duration-500 flex items-center px-2" style={{ width: `${Math.max((count / maxCount) * 100, count > 0 ? 12 : 0)}%`, backgroundColor: stageColors[stage] }}>
              {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-[#E3D9CD] rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-[#E3D9CD]/50 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-80 bg-[#E3D9CD]/50 rounded-2xl" /><div className="h-80 bg-[#E3D9CD]/50 rounded-2xl" /></div>
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [bookings, setBookings] = useState<BookingAlert[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/data');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
        setInvoices(data.invoices || []);
        setLeads(data.leads || []);
        setProjects(data.projects || []);
        setTasks(data.tasks || []);
        setActivities(data.activities || []);
        setBookings((data.bookings || []).filter((b: BookingAlert) => !b.dismissed));
        // Sync to localStorage as cache
        try {
          localStorage.setItem('vantix_clients', JSON.stringify(data.clients || []));
          localStorage.setItem('vantix_invoices', JSON.stringify(data.invoices || []));
          localStorage.setItem('vantix_leads', JSON.stringify(data.leads || []));
          localStorage.setItem('vantix_projects', JSON.stringify(data.projects || []));
          localStorage.setItem('vantix_tasks', JSON.stringify(data.tasks || []));
          localStorage.setItem('vantix_activities', JSON.stringify(data.activities || []));
          localStorage.setItem('vantix_bookings', JSON.stringify(data.bookings || []));
        } catch { /* */ }
        setIsLoading(false);
        return;
      }
    } catch { /* API failed, fall back to localStorage */ }
    // localStorage fallback
    try {
      setClients(lsGet<ClientData>('vantix_clients'));
      setInvoices(lsGet<InvoiceData>('vantix_invoices'));
      setLeads(lsGet<LeadData>('vantix_leads'));
      setProjects(lsGet<ProjectData>('vantix_projects'));
      setTasks(lsGet<TaskData>('vantix_tasks'));
      setActivities(lsGet<ActivityData>('vantix_activities'));
      setBookings(lsGet<BookingAlert>('vantix_bookings').filter(b => !b.dismissed));
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
    loadData();
  }, [loadData]);

  const revenueStats = useMemo(() => {
    const now = new Date();
    const thisMonth = invoices.filter(i => { if (i.status !== 'paid') return false; const d = new Date(i.paid_at || i.paid_date || i.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, i) => s + (i.total || i.amount || 0), 0);
    const lastMonth = invoices.filter(i => { if (i.status !== 'paid') return false; const d = new Date(i.paid_at || i.paid_date || i.created_at); const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear(); }).reduce((s, i) => s + (i.total || i.amount || 0), 0);
    const ytd = invoices.filter(i => { if (i.status !== 'paid') return false; const d = new Date(i.paid_at || i.paid_date || i.created_at); return d.getFullYear() === now.getFullYear(); }).reduce((s, i) => s + (i.total || i.amount || 0), 0);
    return { thisMonth, lastMonth, ytd };
  }, [invoices]);

  const pipelineByStage = useMemo(() => {
    const stages: Record<string, number> = {};
    leads.filter(l => !['won', 'lost'].includes(l.status)).forEach(l => { stages[l.status] = (stages[l.status] || 0) + (l.estimated_value || 0); });
    return stages;
  }, [leads]);

  const activeProjectStats = useMemo(() => {
    const active = projects.filter(p => p.status === 'active');
    return { total: active.length, onTrack: active.filter(p => p.health !== 'red' && p.health !== 'yellow').length, atRisk: active.filter(p => p.health === 'yellow').length, behind: active.filter(p => p.health === 'red').length };
  }, [projects]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const week = new Date(now.getTime() + 7 * 86400000);
    return tasks.filter(t => t.due_date && t.column !== 'done' && new Date(t.due_date) <= week).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()).slice(0, 5);
  }, [tasks]);

  const recentActivities = useMemo(() => activities.slice(0, 8), [activities]);

  const totalPipeline = Object.values(pipelineByStage).reduce((s, v) => s + v, 0);

  const getRelativeTime = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000); const d = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`; return `${d}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) { case 'payment': return { icon: DollarSign, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5' }; case 'project': return { icon: Briefcase, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5' }; case 'lead': return { icon: Users, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5' }; default: return { icon: Activity, color: 'text-[#7A746C]', bg: 'bg-[#EEE6DC]' }; }
  };

  const outstandingInvoices = useMemo(() => {
    return invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled');
  }, [invoices]);

  const totalOutstanding = useMemo(() => {
    return outstandingInvoices.reduce((s, i) => s + (i.total || i.amount || 0), 0);
  }, [outstandingInvoices]);

  const getClientName = useCallback((clientId?: string) => {
    if (!clientId) return 'Unknown';
    const client = clients.find(c => c.id === clientId);
    return client?.name || client?.contact_name || clientId;
  }, [clients]);

  const markPaid = useCallback(async (invoiceId: string) => {
    const updated = invoices.map(i =>
      i.id === invoiceId ? { ...i, status: 'paid', paid_at: new Date().toISOString() } : i
    );
    setInvoices(updated);
    localStorage.setItem('vantix_invoices', JSON.stringify(updated));
    try { await fetch('/api/dashboard/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'invoices', data: updated }) }); } catch { /* */ }
  }, [invoices]);

  const dismissBooking = (id: string) => {
    try {
      const all = lsGet<BookingAlert>('vantix_bookings');
      const updated = all.map(b => b.id === id ? { ...b, dismissed: true } : b);
      localStorage.setItem('vantix_bookings', JSON.stringify(updated));
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (e) { console.error(e); }
  };

  if (isLoading) return <LoadingSkeleton />;

  const kpiData = [
    { title: 'This Month', value: revenueStats.thisMonth, prefix: '$', icon: DollarSign, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
    { title: 'Last Month', value: revenueStats.lastMonth, prefix: '$', icon: TrendingUp, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
    { title: 'YTD Revenue', value: revenueStats.ytd, prefix: '$', icon: BarChart3, color: 'text-[#8E5E34]', bg: 'bg-[#8E5E34]/10', border: 'border-[#8E5E34]/20' },
    { title: 'Pipeline', value: totalPipeline, prefix: '$', icon: Target, color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5', border: 'border-[#B07A45]/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1C1C1C]">{greeting}, <span className="text-[#8E5E34]">Commander</span></h1>
          <p className="text-[#7A746C] mt-1">Here&apos;s your business at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C] hover:text-[#1C1C1C] transition-colors"><RefreshCw size={16} /></button>
          <div className="flex items-center gap-2 text-sm text-[#7A746C]"><Clock size={14} /><span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((data, i) => (
          <motion.div key={data.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-[#EEE6DC] border ${data.border} rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-[#7A746C] uppercase tracking-wide">{data.title}</span>
              <div className={`p-2.5 rounded-xl ${data.bg}`}><data.icon size={18} className={data.color} /></div>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-[#1C1C1C] tracking-tight"><AnimatedNumber value={data.value} prefix={data.prefix} /></h3>
          </motion.div>
        ))}
      </div>

      {/* Booking Alerts */}
      {bookings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-[#8E5E34]/10 border border-[#8E5E34]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-3 rounded-xl bg-[#8E5E34]/20">
                  <Bell size={20} className="text-[#8E5E34]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1C]">New Consultation Booked</p>
                  <p className="text-sm text-[#7A746C]">
                    <span className="font-medium text-[#1C1C1C]">{booking.name}</span> — {booking.email}
                    {booking.phone && <> — {booking.phone}</>}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#7A746C]">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {booking.time}</span>
                  </div>
                  {booking.notes && <p className="text-xs text-[#7A746C] mt-1 italic">&quot;{booking.notes}&quot;</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                {booking.phone && (
                  <a href={`tel:${booking.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B07A45] hover:bg-[#8E5E34] text-white text-sm font-medium shadow-sm hover:shadow transition-all">
                    <Phone size={14} /> Call
                  </a>
                )}
                <a href={`mailto:${booking.email}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EEE6DC] border border-[#E3D9CD] text-sm font-medium text-[#1C1C1C] hover:bg-[#EEE6DC] transition-all">
                  Email
                </a>
                <button onClick={() => dismissBooking(booking.id)} className="p-2 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#1C1C1C] transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Accounts Receivable */}
      {outstandingInvoices.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E3D9CD] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#B0614A]/5"><DollarSign size={18} className="text-[#B0614A]/50" /></div>
              <div>
                <h3 className="text-sm font-semibold text-[#1C1C1C]">Outstanding Payments</h3>
                <p className="text-xs text-[#7A746C]">{outstandingInvoices.length} unpaid invoice{outstandingInvoices.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#1C1C1C]">${totalOutstanding.toLocaleString()}</p>
              <p className="text-xs text-[#7A746C]">total outstanding</p>
            </div>
          </div>
          <div className="divide-y divide-[#E3D9CD]">
            {outstandingInvoices.map(inv => {
              const dueDate = inv.due_date ? new Date(inv.due_date) : null;
              const now = new Date();
              const daysOverdue = dueDate ? Math.floor((now.getTime() - dueDate.getTime()) / 86400000) : 0;
              const isOverdue = daysOverdue > 0;
              return (
                <div key={inv.id} className="px-6 py-3 flex items-center gap-4 hover:bg-[#EEE6DC] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C]">{getClientName(inv.client_id)}</p>
                    <p className="text-xs text-[#7A746C]">{inv.invoice_number || inv.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1C1C1C]">${(inv.total || inv.amount || 0).toLocaleString()}</p>
                    {dueDate && (
                      <p className={`text-xs ${isOverdue ? 'text-[#B0614A]/50 font-medium' : 'text-[#7A746C]'}`}>
                        {isOverdue ? `${daysOverdue}d overdue` : `Due ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                      </p>
                    )}
                  </div>
                  <button onClick={() => markPaid(inv.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#B07A45]/5 text-[#8E5E34] hover:bg-[#B07A45]/10 border border-[#B07A45]/20 transition-colors">
                    Mark Paid
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Revenue Chart + Lead Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E3D9CD] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#8E5E34]/10"><TrendingUp size={18} className="text-[#8E5E34]" /></div>
            <div><h3 className="text-sm font-semibold text-[#1C1C1C]">Revenue (Last 6 Months)</h3><p className="text-xs text-[#7A746C]">Paid invoices over time</p></div>
          </div>
          <div className="p-6"><RevenueChart invoices={invoices} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E3D9CD] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B07A45]/5"><Target size={18} className="text-[#8E5E34]" /></div>
            <div><h3 className="text-sm font-semibold text-[#1C1C1C]">Lead Funnel</h3><p className="text-xs text-[#7A746C]">{leads.length} total leads</p></div>
          </div>
          <div className="p-5"><LeadFunnel leads={leads} /></div>
        </motion.div>
      </div>

      {/* Active Projects + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[#8E5E34]/10"><Briefcase size={18} className="text-[#8E5E34]" /></div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Active Projects</h3>
          </div>
          <div className="text-4xl font-bold text-[#1C1C1C] mb-4">{activeProjectStats.total}</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#B07A45]/50" /> On Track</span><span className="font-semibold text-[#1C1C1C]">{activeProjectStats.onTrack}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><AlertTriangle size={14} className="text-[#B07A45]" /> At Risk</span><span className="font-semibold text-[#1C1C1C]">{activeProjectStats.atRisk}</span></div>
            <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><AlertTriangle size={14} className="text-[#B0614A]/50" /> Behind</span><span className="font-semibold text-[#1C1C1C]">{activeProjectStats.behind}</span></div>
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E3D9CD] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#B07A45]/5"><Clock size={18} className="text-[#8E5E34]" /></div>
              <h3 className="text-sm font-semibold text-[#1C1C1C]">Upcoming Tasks</h3>
            </div>
            <Link href="/dashboard/tasks" className="text-xs text-[#8E5E34] hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="p-4 space-y-2">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-[#7A746C] text-center py-6">No upcoming tasks</p>
            ) : upcomingTasks.map(t => {
              const due = new Date(t.due_date!);
              const now = new Date();
              const isOverdue = due < now;
              const isToday = due.toDateString() === now.toDateString();
              return (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEE6DC] transition-colors">
                  <div className={`w-2 h-2 rounded-full ${isOverdue ? 'bg-[#B0614A]/50' : isToday ? 'bg-[#B07A45]' : 'bg-[#8E5E34]'}`} />
                  <div className="flex-1 min-w-0"><p className="text-sm text-[#1C1C1C] truncate">{t.title}</p></div>
                  <span className={`text-xs ${isOverdue ? 'text-[#B0614A]/50' : isToday ? 'text-[#B07A45]' : 'text-[#7A746C]'}`}>{due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E3D9CD] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B07A45]/5"><Activity size={18} className="text-[#8E5E34]" /></div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-1 max-h-[260px] overflow-y-auto">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-[#7A746C] text-center py-6">No activity yet</p>
            ) : recentActivities.map(a => {
              const { icon: Icon, color, bg } = getActivityIcon(a.type);
              return (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEE6DC] transition-colors">
                  <div className={`p-1.5 rounded-lg ${bg}`}><Icon size={12} className={color} /></div>
                  <div className="flex-1 min-w-0"><p className="text-xs text-[#1C1C1C] truncate">{a.title}</p></div>
                  <span className="text-[10px] text-[#7A746C]">{getRelativeTime(a.created_at)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E3D9CD] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#B07A45]/5"><Plus size={18} className="text-[#8E5E34]" /></div>
          <h3 className="text-sm font-semibold text-[#1C1C1C]">Quick Actions</h3>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Lead', icon: UserPlus, href: '/dashboard/leads', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5' },
            { label: 'New Project', icon: Briefcase, href: '/dashboard/projects', color: 'text-[#8E5E34]', bg: 'bg-[#8E5E34]/10' },
            { label: 'New Invoice', icon: FileText, href: '/dashboard/invoices', color: 'text-[#8E5E34]', bg: 'bg-[#B07A45]/5' },
            { label: 'View Reports', icon: BarChart3, href: '/dashboard/reports', color: 'text-[#8E5E34]', bg: 'bg-[#8E5E34]/10' },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="group flex items-center gap-3 p-3 rounded-xl bg-[#F4EFE8] hover:bg-[#EEE6DC] border border-[#E3D9CD] hover:border-[#8E5E34]/20 transition-all">
              <div className={`p-2 rounded-lg ${action.bg}`}><action.icon size={14} className={action.color} /></div>
              <span className="text-sm text-[#7A746C] group-hover:text-[#1C1C1C] transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}