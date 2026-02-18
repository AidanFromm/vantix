'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, Target, Download, Filter, DollarSign, CheckCircle } from 'lucide-react';

type DateRange = 'month' | 'quarter' | 'year' | 'all';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const revenueData = [
  { month: 'Mar', value: 12400 }, { month: 'Apr', value: 18200 }, { month: 'May', value: 15800 },
  { month: 'Jun', value: 22100 }, { month: 'Jul', value: 19500 }, { month: 'Aug', value: 24300 },
  { month: 'Sep', value: 21700 }, { month: 'Oct', value: 28900 }, { month: 'Nov', value: 26100 },
  { month: 'Dec', value: 31200 }, { month: 'Jan', value: 27800 }, { month: 'Feb', value: 33500 },
];

const clientMetrics = [
  { name: 'Apex Holdings', ltv: 48500, projects: 4, profitMargin: 42 },
  { name: 'Summit Digital', ltv: 36200, projects: 3, profitMargin: 38 },
  { name: 'Coastal Ventures', ltv: 29800, projects: 2, profitMargin: 51 },
  { name: 'Metro Finance', ltv: 22100, projects: 2, profitMargin: 35 },
  { name: 'Peak Industries', ltv: 18700, projects: 1, profitMargin: 44 },
];

const funnelStages = [
  { label: 'Leads', count: 248 },
  { label: 'Contacted', count: 186 },
  { label: 'Qualified', count: 94 },
  { label: 'Proposal', count: 52 },
  { label: 'Won', count: 31 },
];

const teamData = [
  { name: 'Alex Rivera', tasksCompleted: 47, projectsDelivered: 3 },
  { name: 'Jordan Lee', tasksCompleted: 52, projectsDelivered: 4 },
  { name: 'Sam Chen', tasksCompleted: 38, projectsDelivered: 2 },
  { name: 'Morgan Blake', tasksCompleted: 41, projectsDelivered: 3 },
];

function safeGetLS(key: string, fallback: string): string {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function safeSetLS(key: string, val: string) {
  try { localStorage.setItem(key, val); } catch { /* noop */ }
}

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>('year');

  useEffect(() => {
    setRange(safeGetLS('vantix_report_range', 'year') as DateRange);
  }, []);

  const handleRange = (r: DateRange) => {
    setRange(r);
    safeSetLS('vantix_report_range', r);
  };

  const filteredRevenue = range === 'month' ? revenueData.slice(-1)
    : range === 'quarter' ? revenueData.slice(-3)
    : revenueData;

  const maxRev = Math.max(...filteredRevenue.map(r => r.value));
  const totalYTD = filteredRevenue.reduce((s, r) => s + r.value, 0);

  const exportCSV = useCallback(() => {
    const rows = [
      ['Month','Revenue'],
      ...filteredRevenue.map(r => [r.month, r.value.toString()]),
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
  }, [filteredRevenue]);

  const rangeButtons: { label: string; value: DateRange }[] = [
    { label: 'This Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Year', value: 'year' },
    { label: 'All Time', value: 'all' },
  ];

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
          <span className="text-sm font-medium text-[#B07A45]">YTD: ${totalYTD.toLocaleString()}</span>
        </div>
        <div className="flex items-end gap-2 h-48">
          {filteredRevenue.map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#7A746C]">${(r.value / 1000).toFixed(0)}k</span>
              <div className="w-full rounded-t-md bg-gradient-to-t from-[#B07A45] to-[#C89A6A] transition-all duration-500"
                style={{ height: `${(r.value / maxRev) * 100}%`, minHeight: 4 }} />
              <span className="text-[10px] text-[#7A746C]">{r.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Metrics */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#B07A45]" /> Client Metrics
          </h2>
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
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#B07A45]" /> Lead Conversion Funnel
          </h2>
          <div className="space-y-3">
            {funnelStages.map((s, i) => {
              const pct = (s.count / funnelStages[0].count) * 100;
              const convRate = i > 0 ? ((s.count / funnelStages[i - 1].count) * 100).toFixed(1) : '100';
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
              Overall conversion: {((funnelStages[4].count / funnelStages[0].count) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Team Productivity */}
      <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-[#B07A45]" /> Team Productivity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamData.map((t, i) => {
            const maxTasks = Math.max(...teamData.map(d => d.tasksCompleted));
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
      </div>
    </div>
  );
}
