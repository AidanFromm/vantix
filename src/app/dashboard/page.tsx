'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, FolderKanban, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface User {
  name: string;
  role: string;
}

const stats = [
  { label: 'Active Projects', value: '3', icon: FolderKanban, change: 'Secured, JFK, Vantix' },
  { label: 'Open Tasks', value: '8', icon: CheckSquare, change: '3 high priority' },
  { label: 'Clients', value: '1', icon: Users, change: 'Dave (Secured Tampa)' },
  { label: 'Team Members', value: '4', icon: Clock, change: 'Kyle, Aidan, Vantix, Botskii' },
];

const recentActivity = [
  { type: 'task', message: 'Scan system V2: two-phase workflow, batch mode, sound effects', time: 'Feb 9, 3:30 AM', user: 'Vantix' },
  { type: 'task', message: 'Removed demo credentials from login page', time: 'Feb 9, 3:00 AM', user: 'Vantix' },
  { type: 'task', message: 'Secured website dev server setup with Supabase env', time: 'Feb 9, 3:05 AM', user: 'Vantix' },
  { type: 'project', message: 'Stripe webhook: auto inventory decrement on purchase', time: 'Feb 8', user: 'Botskii' },
  { type: 'project', message: 'JFK codebase review completed (security, performance, features)', time: 'Feb 7', user: 'Vantix' },
  { type: 'task', message: 'Vantix AI assistant fully set up — Telegram, memory, voice transcription', time: 'Feb 7', user: 'Vantix' },
];

const upcomingTasks = [
  { title: 'Clover POS integration', priority: 'high', project: 'Secured Tampa' },
  { title: 'StockX OAuth HTTPS callback setup', priority: 'high', project: 'Secured Tampa' },
  { title: 'Stripe checkout flow', priority: 'high', project: 'Secured Tampa' },
  { title: 'Customer-facing website polish', priority: 'medium', project: 'Secured Tampa' },
  { title: 'Leads page — shared backend for team', priority: 'medium', project: 'Vantix' },
  { title: 'JFK inventory system improvements', priority: 'low', project: 'Just Four Kicks' },
];

export default function DashboardOverview() {
  const [user, setUser] = useState<User | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('vantix_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {greeting}, {user?.name || 'there'} 👋
        </h1>
        <p className="text-[var(--color-muted)] mt-1">Here&apos;s what&apos;s happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[var(--color-muted)] text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-2 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {stat.change}
                  </p>
                </div>
                <div className="w-10 h-10 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-[var(--color-accent)]" size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-accent)]">
                  {activity.user[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-[var(--color-muted)]">{activity.message}</span>
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {upcomingTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-[var(--color-primary)] rounded-lg border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-3">
                  {task.priority === 'high' && (
                    <AlertCircle className="text-red-400" size={18} />
                  )}
                  {task.priority === 'medium' && (
                    <AlertCircle className="text-yellow-400" size={18} />
                  )}
                  {task.priority === 'low' && (
                    <AlertCircle className="text-green-400" size={18} />
                  )}
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">{task.project}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
