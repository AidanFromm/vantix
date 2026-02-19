'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Target,
  FolderOpen,
  CheckSquare,
  DollarSign,
  MessageSquare,
  Image,
  FileText,
  Calendar,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: { href: string; label: string }[];
}

const navSections: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ],
  },
  {
    items: [
      { href: '/dashboard/clients', label: 'Clients', icon: Users },
      { href: '/dashboard/leads', label: 'Leads', icon: Target },
      { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
      { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
    ],
  },
  {
    items: [
      {
        href: '/dashboard/finances',
        label: 'Finances',
        icon: DollarSign,
        children: [
          { href: '/dashboard/finances/invoices', label: 'Invoices' },
          { href: '/dashboard/finances/payments', label: 'Payments' },
          { href: '/dashboard/finances/revenue', label: 'Revenue' },
          { href: '/dashboard/finances/expenses', label: 'Expenses' },
        ],
      },
    ],
  },
  {
    items: [
      {
        href: '/dashboard/communications',
        label: 'Communications',
        icon: MessageSquare,
        children: [
          { href: '/dashboard/communications/inbox', label: 'Inbox' },
          { href: '/dashboard/communications/templates', label: 'Templates' },
        ],
      },
    ],
  },
  {
    items: [
      { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
    ],
  },
  {
    items: [
      { href: '/dashboard/media', label: 'Media Library', icon: Image },
      { href: '/dashboard/proposals', label: 'Proposals', icon: FileText },
      { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
      { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    items: [
      { href: '/dashboard/knowledge', label: 'Knowledge Base', icon: BookOpen },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const teamMembers = [
  { initial: 'K', online: true },
  { initial: 'A', online: true },
  { initial: 'V', online: false },
  { initial: 'B', online: true },
];

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

interface SidebarProps {
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [pendingBookings, setPendingBookings] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vantix_bookings');
      if (raw) {
        const bookings = JSON.parse(raw);
        setPendingBookings(bookings.filter((b: { status: string }) => b.status === 'Pending').length);
      }
    } catch {}
    const handler = () => {
      try {
        const raw = localStorage.getItem('vantix_bookings');
        if (raw) {
          const bookings = JSON.parse(raw);
          setPendingBookings(bookings.filter((b: { status: string }) => b.status === 'Pending').length);
        }
      } catch {}
    };
    window.addEventListener('storage', handler);
    const interval = setInterval(handler, 5000);
    return () => { window.removeEventListener('storage', handler); clearInterval(interval); };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Auto-expand group if a child is active
  useEffect(() => {
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const childActive = item.children.some((c) => pathname === c.href);
          if (childActive) {
            setExpandedGroups((prev) => ({ ...prev, [item.href]: true }));
          }
        }
      });
    });
  }, [pathname]);

  const toggleGroup = (href: string) => {
    setExpandedGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    isActive(item.href) || (item.children?.some((c) => pathname === c.href) ?? false);

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const expanded = expandedGroups[item.href] ?? false;
    const active = hasChildren ? isGroupActive(item) : isActive(item.href);

    return (
      <div key={item.href}>
        {hasChildren ? (
          <button
            onClick={() => toggleGroup(item.href)}
            className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-all duration-150 ${
              isCollapsed ? 'justify-center' : ''
            } ${
              active
                ? 'bg-[#B07A45]/10 text-[#B07A45] font-semibold'
                : 'text-[#7A746C] hover:text-[#4B4B4B] hover:bg-[#EEE6DC]'
            }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="text-sm flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                />
              </>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#1C1C1C] text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-lg">
                {item.label}
              </div>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
              isCollapsed ? 'justify-center' : ''
            } ${
              active
                ? 'bg-[#B07A45]/10 text-[#B07A45] font-semibold'
                : 'text-[#7A746C] hover:text-[#4B4B4B] hover:bg-[#EEE6DC]'
            }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
            {item.href === '/dashboard/bookings' && pendingBookings > 0 && (
              <span className="ml-auto w-2 h-2 rounded-full bg-[#B07A45] flex-shrink-0" />
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#1C1C1C] text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-lg">
                {item.label}
              </div>
            )}
          </Link>
        )}

        {/* Sub-items */}
        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-7 mt-1 space-y-0.5 border-l border-[#E3D9CD] pl-3">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-1.5 rounded-md text-sm transition-all duration-150 ${
                        isActive(child.href)
                          ? 'bg-[#B07A45]/10 text-[#B07A45] font-semibold'
                          : 'text-[#7A746C] hover:text-[#4B4B4B] hover:bg-[#EEE6DC]'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
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
            onClick={() => isCollapsed ? setIsCollapsed(false) : setIsCollapsed(true)}
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
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && (
              <div className="my-3 border-t border-[#E3D9CD]" />
            )}
            <div className="space-y-0.5">
              {section.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* Team avatars */}
      <div className="px-4 py-3 border-t border-[#E3D9CD]">
        {!isCollapsed && (
          <p className="text-[10px] uppercase tracking-widest text-[#A39B90] font-semibold mb-2">
            Team
          </p>
        )}
        <div className={`flex ${isCollapsed ? 'flex-col items-center gap-2' : 'gap-2'}`}>
          {teamMembers.map((member, i) => (
            <div key={i} className="relative">
              <div className="w-8 h-8 rounded-full bg-[#EEE6DC] border border-[#E3D9CD] flex items-center justify-center">
                <span className="text-xs font-semibold text-[#7A746C]">{member.initial}</span>
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#F4EFE8] ${
                  member.online ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            </div>
          ))}
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
        animate={{ width: isCollapsed ? 72 : 256 }}
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
