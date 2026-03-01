'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Target,
  GitMerge,
  Users,
  BookOpen,
  MessageSquare,
  FileText,
  Send,
  FolderOpen,
  Briefcase,
  Github,
  DollarSign,
  Receipt,
  CreditCard,
  TrendingDown,
  PenTool,
  Image,
  Search,
  UsersRound,
  Bot,
  Brain,
  StickyNote,
  Settings,
  Shield,
  Bell,
  Crosshair,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: any }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
      { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/dashboard/tracking', label: 'Tracking', icon: Crosshair },
    ],
  },
  {
    label: 'CLIENTS',
    items: [
      { href: '/dashboard/leads', label: 'Leads', icon: Target },
      { href: '/dashboard/pipeline', label: 'Pipeline', icon: GitMerge },
      { href: '/dashboard/clients', label: 'Clients', icon: Users },
      { href: '/dashboard/bookings', label: 'Bookings', icon: BookOpen },
    ],
  },
  {
    label: 'COMMUNICATIONS',
    items: [
      { href: '/dashboard/communications/inbox', label: 'Inbox', icon: MessageSquare },
      { href: '/dashboard/communications/templates', label: 'Templates', icon: FileText },
      { href: '/dashboard/outreach', label: 'Outreach', icon: Send },
    ],
  },
  {
    label: 'PROJECTS',
    items: [
      { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
      { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
      { href: '/dashboard/github', label: 'GitHub', icon: Github },
    ],
  },
  {
    label: 'FINANCES',
    items: [
      { href: '/dashboard/finances/revenue', label: 'Revenue', icon: DollarSign },
      { href: '/dashboard/finances/invoices', label: 'Invoices', icon: Receipt },
      { href: '/dashboard/finances/expenses', label: 'Expenses', icon: TrendingDown },
      { href: '/dashboard/finances/subscriptions', label: 'Subscriptions', icon: CreditCard },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { href: '/dashboard/knowledge', label: 'Blog / Knowledge', icon: PenTool },
      { href: '/dashboard/media', label: 'Media', icon: Image },
      { href: '/dashboard/seo-tracker', label: 'SEO Tracker', icon: Search },
    ],
  },
  {
    label: 'TEAM',
    items: [
      { href: '/dashboard/team-hub', label: 'Team Hub', icon: UsersRound },
      { href: '/dashboard/bots', label: 'Bots', icon: Bot },
      { href: '/dashboard/memory', label: 'Memory', icon: Brain },
      { href: '/dashboard/notepad', label: 'Notepad', icon: StickyNote },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/dashboard/vault', label: 'Vault', icon: Shield },
      { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
];

// ─── Context ─────────────────────────────────────────────────────────
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved) setIsCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ─── Component ───────────────────────────────────────────────────────
interface SidebarProps {
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // All groups expanded by default
    const init: Record<string, boolean> = {};
    navGroups.forEach((g) => { init[g.label] = true; });
    return init;
  });
  const [pendingBookings, setPendingBookings] = useState(0);

  // Pending bookings badge
  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem('vantix_bookings');
        if (raw) {
          const bookings = JSON.parse(raw);
          setPendingBookings(bookings.filter((b: { status: string }) => b.status === 'Pending').length);
        }
      } catch {}
    };
    check();
    window.addEventListener('storage', check);
    const interval = setInterval(check, 5000);
    return () => { window.removeEventListener('storage', check); clearInterval(interval); };
  }, []);

  // Close mobile on navigate
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Auto-expand group containing active item
  useEffect(() => {
    navGroups.forEach((group) => {
      if (group.items.some((item) => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))) {
        setExpandedGroups((prev) => ({ ...prev, [group.label]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#E3D9CD]">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img src="/logo-nav.png" alt="Vantix" className="w-8 h-8 rounded-lg" />
            {!isCollapsed && (
              <span className="text-lg font-bold text-[#1C1C1C] tracking-tight">
                vantix.
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md bg-[#EEE6DC] hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#1C1C1C] transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-[#7A746C] hover:text-[#1C1C1C] hover:bg-[#EEE6DC] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => {
          const expanded = expandedGroups[group.label] ?? true;
          const groupHasActive = group.items.some((item) => isActive(item.href));

          return (
            <div key={group.label} className="mb-1">
              {/* Group header */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`flex items-center justify-between w-full px-3 py-1.5 mb-0.5 rounded-md transition-colors ${
                    groupHasActive ? 'text-[#B07A45]' : 'text-[#A39B90] hover:text-[#7A746C]'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest font-semibold">
                    {group.label}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
                  />
                </button>
              ) : (
                <div className="my-2 mx-2 border-t border-[#E3D9CD]" />
              )}

              {/* Group items */}
              {isCollapsed ? (
                // Always show icons when collapsed
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center justify-center py-2 rounded-lg transition-all duration-150 ${
                          active
                            ? 'bg-[#B07A45]/10 text-[#B07A45] border-l-2 border-[#B07A45]'
                            : 'text-[#7A746C] hover:text-[#4B4B4B] hover:bg-[#EEE6DC]'
                        }`}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        {item.href === '/dashboard/bookings' && pendingBookings > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B07A45]" />
                        )}
                        {/* Tooltip */}
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1C1C1C] text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-lg pointer-events-none">
                          {item.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pb-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                                active
                                  ? 'bg-[#B07A45]/10 text-[#B07A45] font-semibold border-l-2 border-[#B07A45] ml-0'
                                  : 'text-[#7A746C] hover:text-[#4B4B4B] hover:bg-[#EEE6DC]'
                              }`}
                            >
                              <Icon size={18} className="flex-shrink-0" />
                              <span className="text-sm">{item.label}</span>
                              {item.href === '/dashboard/bookings' && pendingBookings > 0 && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-[#B07A45] flex-shrink-0" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* User avatar */}
      <div className="px-4 py-3 border-t border-[#E3D9CD]">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B07A45] to-[#8E5E34] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1C] truncate">{user.name}</p>
              <p className="text-[10px] text-[#7A746C] truncate">{user.role || user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[#E3D9CD]">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[#7A746C] hover:text-[#B07A45] hover:bg-[#B07A45]/10 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#F4EFE8]/90 backdrop-blur-xl border border-[#E3D9CD] rounded-lg shadow-sm"
      >
        <Menu size={20} className="text-[#1C1C1C]" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-[#1C1C1C]/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-[#F4EFE8] border-r border-[#E3D9CD]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none
        `}
        style={{ width: mobileOpen ? 280 : undefined }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}


