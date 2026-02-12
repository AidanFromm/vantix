'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Inbox,
  DollarSign,
  GitPullRequest,
  BarChart3,
  Mail,
  FileText,
  Scale,
  Search,
  Image,
  Landmark,
  Handshake,
  Phone,
  Users2,
  Zap,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import SettingsResetButton from '@/components/SettingsResetButton';

interface User {
  email: string;
  name: string;
  role: string;
}

function useInboxCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = async () => {
      try {
        const [c, a] = await Promise.all([
          fetch('/api/contact').then(r => r.json()).catch(() => ({ submissions: [] })),
          fetch('/api/audit-submit').then(r => r.json()).catch(() => ({ submissions: [] })),
        ]);
        const all = [...(c.submissions || []), ...(a.submissions || [])];
        const saved = JSON.parse(localStorage.getItem('vantix_inbox') || '{}');
        const newCount = all.filter((s: { id: string; status?: string }) => {
          const status = saved[s.id]?.status || s.status || 'new';
          return status === 'new';
        }).length;
        setCount(newCount);
      } catch {}
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Zap },
  { href: '/dashboard/calls', label: 'Phone Calls', icon: Phone },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/revenue', label: 'Money', icon: DollarSign },
  { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
];

const moreNav: NavItem[] = [
  { href: '/dashboard/outreach', label: 'Outreach', icon: Mail },
  { href: '/dashboard/deal-room', label: 'Deal Room', icon: Handshake },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: GitPullRequest },
  { href: '/dashboard/proposals', label: 'Proposals', icon: FileText },
  { href: '/dashboard/contracts', label: 'Contracts', icon: Scale },
  { href: '/dashboard/finances', label: 'Finances', icon: Landmark },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Image },
  { href: '/dashboard/seo-tracker', label: 'SEO Tracker', icon: Search },
  { href: '/dashboard/team-hub', label: 'Team Hub', icon: Users2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const inboxCount = useInboxCount();

  useEffect(() => {
    const stored = localStorage.getItem('vantix_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Auto-expand More if active route is in moreNav
  useEffect(() => {
    if (moreNav.some(item => pathname === item.href)) {
      setMoreOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('vantix_user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-accent)]" />
      </div>
    );
  }

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-[#10b981] text-white'
            : 'text-[var(--color-muted)] hover:text-white hover:bg-white/5'
        }`}
        style={{ fontSize: 14 }}
      >
        <Icon size={16} strokeWidth={1.5} />
        <span className="flex-1">{item.label}</span>
        {item.label === 'Inbox' && inboxCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
            {inboxCount}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex dashboard-scope">
      {/* Mobile hamburger */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg"
          style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-60 bg-[var(--color-card)] border-r border-[var(--color-border)] transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ maxHeight: '100dvh' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo + close */}
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <Link href="/" className="text-xl font-bold gradient-text">
              Vantix
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-white hover:bg-white/5 transition-colors"
              style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* User */}
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981] text-sm font-bold">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[11px] text-[var(--color-muted)]">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex flex-col" style={{ gap: 2 }}>
              {mainNav.map(renderNavItem)}
            </div>

            {/* More section */}
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center w-full px-3 py-1 rounded-lg hover:bg-white/5 transition-colors"
                style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', opacity: 0.7 }}
              >
                <span className="flex-1 text-left">More</span>
                {moreOpen ? <ChevronDown size={14} strokeWidth={1.5} /> : <ChevronRight size={14} strokeWidth={1.5} />}
              </button>
              {moreOpen && (
                <div className="flex flex-col mt-1" style={{ gap: 2 }}>
                  {moreNav.map(renderNavItem)}
                </div>
              )}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-[var(--color-border)]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[var(--color-muted)] hover:text-white hover:bg-white/5 transition-colors"
              style={{ fontSize: 14 }}
            >
              <LogOut size={16} strokeWidth={1.5} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:ml-0">
        <div className="fixed top-3 right-4 z-50 lg:absolute lg:top-4 lg:right-6 flex items-center gap-2">
          <SettingsResetButton />
          <NotificationBell />
        </div>
        <div className="p-4 pt-16 lg:pt-6 lg:p-8" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
