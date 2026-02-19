'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Target, Download, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { getData } from '@/lib/data';
import type { Invoice, Client, Lead, TeamMember, Task } from '@/lib/types';

type DateRange = 'month' | 'quarter' | 'year' | 'all';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const FUNNEL_STAGES: { status: string; label: string }[] = [
  { status: 'new', label: 'Leads' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'qualified', label: 'Qualified' },
  { status: 'proposal', label: 'Proposal' },
  { status: 'won', label: 'Won' },
];

function safeGetLS(key: string, fallback: string): string {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function safeSetLS(key: string, val: string) {
  try { localStorage.setItem(key, val); } catch { /* noop */ }
}

function getDateField(inv: Invoice): string {
  return inv.paid_at || inv.paid_date || inv.created_at || '';
}

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>('year');
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setRange(safeGetLS('vantix_report_range', 'year') as DateRange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [inv, cli, ld, tm, tk] = await Promise.all([
          getData<Invoice>('invoices'),
          getData<Client>('clients'),
          getData<Lead>('leads'),
          getData<TeamMember>('team_members'),
          getData<Task>('tasks'),
        ]);
        if (cancelled) return;
        setInvoices(inv);
        setClients(cli);
        setLeads(ld);
        setTeamMembers(tm);
        setTasks(tk);
      } catch { /* graceful fallback — empty arrays */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRange = (r: DateRange) => {
    setRange(r);
    safeSetLS('vantix_report_range', r);
  };

  // Filter paid invoices by date range
  const paidInvoices = useMemo(() => invoices.filter(i => i.status === 'paid'), [invoices]);

  const filteredPaidInvoices = useMemo(() => {
    const now = new Date();
    return paidInvoices.filter(inv => {
      if (range === 'all') return true;
      const d = getDateField(inv);
      if (!d) return false;
      const date = new Date(d);
      if (range === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (range === 'quarter') {
        const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return date >= qStart && date <= now;
      }
      // year
      return date.getFullYear() === now.getFullYear();
    });
  }, [paidInvoices, range]);

  // Revenue data grouped by month
  const revenueData = useMemo(() => {
    const map = new Map<string, number>();
    filteredPaidInvoices.forEach(inv => {
      const d = getDateField(inv);
      if (!d) return;
      const date = new Date(d);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + (inv.total || inv.amount || 0));
    });
    // Sort by key and map to {month, value}
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        month: MONTHS[parseInt(key.split('-')[1])],
        value,
      }));
  }, [filteredPaidInvoices]);

  // Client metrics
  const clientMetrics = useMemo(() => {
    if (clients.length === 0) return [];
    // Build invoice totals per client
    const clientInvMap = new Map<string, { paid: number; total: number; projects: Set<string> }>();
    invoices.forEach(inv => {
      if (!inv.client_id) return;
      const entry = clientInvMap.get(inv.client_id) || { paid: 0, total: 0, projects: new Set<string>() };
      const amt = inv.total || inv.amount || 0;
      entry.total += amt;
      if (inv.status === 'paid') entry.paid += amt;
      if (inv.project_id) entry.projects.add(inv.project_id);
      clientInvMap.set(inv.client_id, entry);
    });

    return clients
      .map(c => {
        const inv = clientInvMap.get(c.id);
        const ltv = c.lifetime_value || inv?.paid || 0;
        const projects = inv?.projects.size || 0;
        const profitMargin = inv && inv.total > 0 ? Math.round((inv.paid / inv.total) * 100) : 0;
        return { name: c.name, ltv, projects, profitMargin };
      })
      .filter(c => c.ltv > 0 || c.projects > 0)
      .sort((a, b) => b.ltv - a.ltv)
      .slice(0, 10);
  }, [clients, invoices]);

  // Funnel stages
  const funnelStages = useMemo(() => {
    const countMap = new Map<string, number>();
    leads.forEach(l => countMap.set(l.status, (countMap.get(l.status) || 0) + 1));
    return FUNNEL_STAGES.map(s => ({
      label: s.label,
      count: countMap.get(s.status) || 0,
    }));
  }, [leads]);

  const funnelTotal = funnelStages[0]?.count || 0;

  // Team data
  const teamData = useMemo(() => {
    if (teamMembers.length === 0) return [];
    const taskMap = new Map<string, { completed: number; projects: Set<string> }>();
    tasks.forEach(t => {
      if (!t.assigned_to) return;
      const entry = taskMap.get(t.assigned_to) || { completed: 0, projects: new Set<string>() };
      if (t.status === 'done') entry.completed++;
      if (t.project_id) entry.projects.add(t.project_id);
      taskMap.set(t.assigned_to, entry);
    });
    return teamMembers.map(m => {
      // Try matching by name or id
      const byId = taskMap.get(m.id);
      const byName = taskMap.get(m.name?.toLowerCase?.() || '');
      const entry = byId || byName || { completed: 0, projects: new Set<string>() };
      return {
        name: m.name,
        tasksCompleted: entry.completed,
        projectsDelivered: entry.projects.size,
      };
    });
  }, [teamMembers, tasks]);

  const maxRev = revenueData.length > 0 ? Math.max(...revenueData.map(r => r.value)) : 1;
  const totalYTD = revenueData.reduce((s, r) => s + r.value, 0);

  const exportCSV = useCallback(() => {
    const rows: string[][] = [
      ['Month','Revenue'],
      ...revenueData.map(r => [r.month, r.value.toString()]),
      [],
      ['Client','LTV','Projects','Profit Margin %'],
      ...clientMetrics.map(c => [c.name, c.ltv.toString(), c.projects.toString(), c.profitMargin.toString()]),
      [],
      ['Funnel Stage','Count'],
      ...funnelStages.map(f => [f.label, f.count.toString()]),
      [],
      ['Team Member','Tasks Completed','Projects Delivered'],
      ...teamData.map(t => [t.name, t.tasksCompleted.toString(), t.projectsDelivered.toString()]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'vantix-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [revenueData, clientMetrics, funnelStages, teamData]);

  const rangeButtons: { label: string; value: DateRange }[] = [
    { label: 'This Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Year', value: 'year' },
    { label: 'All Time', value: 'all' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4EFE8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B07A45] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#B07A45]" /> Reports & Analytics
          </h1>
          <p className="text-[#7A746C] text-sm mt-1">Performance overview and business metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden">
            {rangeButtons.map(b => (
              <button key={b.value} onClick={() => handleRange(b.value)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${range === b.value ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'}`}>
                {b.label}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#B07A45]" /> Revenue
          </h2>
          <span className="text-sm font-medium text-[#B07A45]">Total: ${totalYTD.toLocaleString()}</span>
        </div>
        {revenueData.length > 0 ? (
          <div className="flex items-end gap-2 h-48">
            {revenueData.map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#7A746C]">${(r.value / 1000).toFixed(0)}k</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-[#B07A45] to-[#C89A6A] transition-all duration-500"
                  style={{ height: `${(r.value / maxRev) * 100}%`, minHeight: 4 }} />
                <span className="text-[10px] text-[#7A746C]">{r.month}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-[#7A746C] text-sm">
            No paid invoices in this period
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Metrics */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#B07A45]" /> Client Metrics
          </h2>
          {clientMetrics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#7A746C] border-b border-[#E3D9CD]">
                    <th className="text-left py-2 font-medium">Client</th>
                    <th className="text-right py-2 font-medium">LTV</th>
                    <th className="text-right py-2 font-medium">Projects</th>
                    <th className="text-right py-2 font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {clientMetrics.map((c, i) => (
                    <tr key={i} className="border-b border-[#E3D9CD]/50">
                      <td className="py-2 text-[#1C1C1C] font-medium">{c.name}</td>
                      <td className="py-2 text-right text-[#4B4B4B]">${c.ltv.toLocaleString()}</td>
                      <td className="py-2 text-right text-[#4B4B4B]">{c.projects}</td>
                      <td className="py-2 text-right">
                        <span className={`font-medium ${c.profitMargin >= 40 ? 'text-green-700' : 'text-[#B07A45]'}`}>{c.profitMargin}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-[#7A746C] text-sm">
              No client data available
            </div>
          )}
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#B07A45]" /> Lead Conversion Funnel
          </h2>
          {funnelTotal > 0 ? (
            <div className="space-y-3">
              {funnelStages.map((s, i) => {
                const pct = funnelTotal > 0 ? (s.count / funnelTotal) * 100 : 0;
                const convRate = i > 0 && funnelStages[i - 1].count > 0
                  ? ((s.count / funnelStages[i - 1].count) * 100).toFixed(1)
                  : '100';
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#1C1C1C] font-medium">{s.label}</span>
                      <span className="text-[#7A746C]">{s.count} ({convRate}%)</span>
                    </div>
                    <div className="h-6 bg-[#F4EFE8] rounded-lg overflow-hidden">
                      <div className="h-full rounded-lg bg-gradient-to-r from-[#B07A45] to-[#C89A6A] transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-[#7A746C] mt-2">
                Overall conversion: {funnelTotal > 0 ? ((funnelStages[4].count / funnelTotal) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-[#7A746C] text-sm">
              No leads in the pipeline
            </div>
          )}
        </div>
      </div>

      {/* Team Productivity */}
      <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-[#B07A45]" /> Team Productivity
        </h2>
        {teamData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamData.map((t, i) => {
              const maxTasks = Math.max(...teamData.map(d => d.tasksCompleted), 1);
              return (
                <div key={i} className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl p-4">
                  <p className="text-[#1C1C1C] font-medium text-sm">{t.name}</p>
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-[#7A746C] mb-1">
                        <span>Tasks</span><span>{t.tasksCompleted}</span>
                      </div>
                      <div className="h-2 bg-[#E3D9CD] rounded-full">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#B07A45] to-[#C89A6A]"
                          style={{ width: `${(t.tasksCompleted / maxTasks) * 100}%` }} />
                      </div>
                    </div>
                    <p className="text-xs text-[#7A746C]">{t.projectsDelivered} projects delivered</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-[#7A746C] text-sm">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
}
