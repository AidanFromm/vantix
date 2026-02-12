'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, Inbox, CheckSquare, Clock } from 'lucide-react';
import Link from 'next/link';

interface User {
  name: string;
  role: string;
}

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

  const quickLinks = [
    { href: '/dashboard/leads', label: 'View Leads', icon: Inbox, desc: 'New inquiries' },
    { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare, desc: 'To-do list' },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban, desc: 'Active work' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {greeting}, {user?.name || 'there'}
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          Welcome to your dashboard.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <Link
              key={i}
              href={link.href}
              className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)]/30 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">
                    {link.label}
                  </p>
                  <p className="text-sm text-[var(--color-muted)] mt-1">{link.desc}</p>
                </div>
                <div className="w-10 h-10 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-[var(--color-accent)]" size={20} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="text-[var(--color-accent)]" size={20} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Dashboard Updates</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              This dashboard is your team hub. Use the sidebar to navigate between leads, tasks, and projects. 
              Need something added? Let us know.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
