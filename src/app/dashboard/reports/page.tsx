'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, FileText } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'clients' | 'projects' | 'performance';
  period: string;
  generatedAt: string;
}

const mockReports: Report[] = [
  { id: '1', name: 'February Revenue Report', type: 'revenue', period: 'Feb 2026', generatedAt: '2026-02-12' },
  { id: '2', name: 'January Client Report', type: 'clients', period: 'Jan 2026', generatedAt: '2026-02-01' },
  { id: '3', name: 'Q4 2025 Performance', type: 'performance', period: 'Q4 2025', generatedAt: '2026-01-15' },
];

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports);

  // Mock metrics
  const metrics = {
    revenue: { value: 4500, change: 125 },
    clients: { value: 3, change: 2 },
    projects: { value: 2, change: 1 },
    avgDeal: { value: 4500, change: 15 },
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign size={14} className="text-green-400" />;
      case 'clients': return <Users size={14} className="text-blue-400" />;
      case 'projects': return <FileText size={14} className="text-purple-400" />;
      case 'performance': return <TrendingUp size={14} className="text-yellow-400" />;
      default: return <BarChart3 size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Analytics and business insights</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
          <Download size={16} />
          Export All
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--color-muted)]">Revenue</span>
            <span className="text-xs text-green-400">+{metrics.revenue.change}%</span>
          </div>
          <p className="text-2xl font-bold">${metrics.revenue.value.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--color-muted)]">Active Clients</span>
            <span className="text-xs text-green-400">+{metrics.clients.change}</span>
          </div>
          <p className="text-2xl font-bold">{metrics.clients.value}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--color-muted)]">Projects</span>
            <span className="text-xs text-green-400">+{metrics.projects.change}</span>
          </div>
          <p className="text-2xl font-bold">{metrics.projects.value}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--color-muted)]">Avg Deal Size</span>
            <span className="text-xs text-green-400">+{metrics.avgDeal.change}%</span>
          </div>
          <p className="text-2xl font-bold">${metrics.avgDeal.value.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Revenue Over Time</h3>
        <div className="h-48 flex items-end justify-around gap-2">
          {[30, 45, 25, 60, 80, 55, 90, 70, 85, 100, 75, 95].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-[#10b981]/30 hover:bg-[#10b981]/50 rounded-t transition-colors"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-[var(--color-muted)]">
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Reports */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold">Saved Reports</h3>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {reports.map(report => (
            <div key={report.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(report.type)}
                <div>
                  <p className="font-medium text-sm">{report.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{report.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-muted)]">{report.generatedAt}</span>
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <Download size={14} className="text-[var(--color-muted)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
