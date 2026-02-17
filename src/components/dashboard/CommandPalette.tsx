'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Users,
  Target,
  FolderKanban,
  DollarSign,
  Settings,
  Plus,
  FileText,
  UserPlus,
  Clock,
  Building2,
  ArrowRight,
  Command as CommandIcon,
  Sparkles,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string[];
  onSelect: () => void;
  keywords?: string[];
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

interface RecentItem {
  id: string;
  label: string;
  type: 'project' | 'client';
  icon: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Recent items (would typically come from localStorage/API)
  // ---------------------------------------------------------------------------
  const recentItems: RecentItem[] = [
    { id: 'recent-1', label: 'Dave App', type: 'project', icon: <FolderKanban size={16} /> },
    { id: 'recent-2', label: 'Secured Tampa', type: 'client', icon: <Building2 size={16} /> },
    { id: 'recent-3', label: 'Mobile Redesign', type: 'project', icon: <FolderKanban size={16} /> },
    { id: 'recent-4', label: 'Acme Corp', type: 'client', icon: <Building2 size={16} /> },
  ];

  // ---------------------------------------------------------------------------
  // Command groups
  // ---------------------------------------------------------------------------
  const commandGroups: CommandGroup[] = [
    {
      heading: 'Pages',
      items: [
        {
          id: 'page-dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard size={16} />,
          shortcut: ['⌘', '1'],
          onSelect: () => router.push('/dashboard'),
          keywords: ['home', 'overview', 'main'],
        },
        {
          id: 'page-clients',
          label: 'Clients',
          icon: <Users size={16} />,
          shortcut: ['⌘', '2'],
          onSelect: () => router.push('/dashboard/clients'),
          keywords: ['customers', 'accounts', 'companies'],
        },
        {
          id: 'page-leads',
          label: 'Leads',
          icon: <Target size={16} />,
          shortcut: ['⌘', '3'],
          onSelect: () => router.push('/dashboard/leads'),
          keywords: ['prospects', 'opportunities', 'pipeline'],
        },
        {
          id: 'page-projects',
          label: 'Projects',
          icon: <FolderKanban size={16} />,
          shortcut: ['⌘', '4'],
          onSelect: () => router.push('/dashboard/projects'),
          keywords: ['work', 'tasks', 'kanban'],
        },
        {
          id: 'page-financial',
          label: 'Financial',
          icon: <DollarSign size={16} />,
          shortcut: ['⌘', '5'],
          onSelect: () => router.push('/dashboard/financial'),
          keywords: ['money', 'revenue', 'invoices', 'expenses'],
        },
        {
          id: 'page-settings',
          label: 'Settings',
          icon: <Settings size={16} />,
          shortcut: ['⌘', ','],
          onSelect: () => router.push('/dashboard/settings'),
          keywords: ['preferences', 'config', 'profile', 'account'],
        },
      ],
    },
    {
      heading: 'Actions',
      items: [
        {
          id: 'action-new-project',
          label: 'Create new project',
          icon: <Plus size={16} />,
          shortcut: ['⌘', 'N'],
          onSelect: () => {
            router.push('/dashboard/projects?new=true');
          },
          keywords: ['add', 'create', 'project', 'new'],
        },
        {
          id: 'action-new-invoice',
          label: 'Create invoice',
          icon: <FileText size={16} />,
          shortcut: ['⌘', 'I'],
          onSelect: () => {
            router.push('/dashboard/financial?new=invoice');
          },
          keywords: ['bill', 'payment', 'invoice', 'money'],
        },
        {
          id: 'action-new-lead',
          label: 'Add new lead',
          icon: <UserPlus size={16} />,
          shortcut: ['⌘', 'L'],
          onSelect: () => {
            router.push('/dashboard/leads?new=true');
          },
          keywords: ['prospect', 'opportunity', 'lead', 'add'],
        },
        {
          id: 'action-new-client',
          label: 'Add new client',
          icon: <Building2 size={16} />,
          shortcut: ['⌘', 'Shift', 'C'],
          onSelect: () => {
            router.push('/dashboard/clients?new=true');
          },
          keywords: ['customer', 'company', 'client', 'add'],
        },
      ],
    },
  ];

  // ---------------------------------------------------------------------------
  // Keyboard shortcuts
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Open with ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Page shortcuts
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        const pageShortcuts: Record<string, string> = {
          '1': '/dashboard',
          '2': '/dashboard/clients',
          '3': '/dashboard/leads',
          '4': '/dashboard/projects',
          '5': '/dashboard/financial',
          ',': '/dashboard/settings',
        };

        if (pageShortcuts[e.key]) {
          e.preventDefault();
          router.push(pageShortcuts[e.key]);
          setOpen(false);
        }
      }

      // Action shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/dashboard/projects?new=true');
        setOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        router.push('/dashboard/financial?new=invoice');
        setOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        router.push('/dashboard/leads?new=true');
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [router]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearch('');
    }
  }, [open]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false);
    callback();
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2.5 px-3.5 py-2 bg-white
                   border border-[#E8E2DA] hover:border-[#D4B07C]/40 rounded-xl 
                   shadow-[3px_3px_8px_#d1cdc7,-3px_-3px_8px_#ffffff]
                   hover:shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff]
                   transition-all duration-200 cursor-pointer"
      >
        <Search size={14} className="text-[#8C857C] group-hover:text-[#B8895A] transition-colors" />
        <span className="text-sm text-[#8C857C] group-hover:text-[#2D2A26] transition-colors hidden sm:inline">
          Search...
        </span>
        <div className="hidden sm:flex items-center gap-1 ml-1.5">
          <kbd className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-medium 
                        text-[#8C857C] bg-[#F5F0EB] border border-[#E8E2DA] rounded-md
                        group-hover:bg-[#EDE7DF] group-hover:border-[#D4B07C]/30 transition-all">
            ⌘
          </kbd>
          <kbd className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-medium 
                        text-[#8C857C] bg-[#F5F0EB] border border-[#E8E2DA] rounded-md
                        group-hover:bg-[#EDE7DF] group-hover:border-[#D4B07C]/30 transition-all">
            K
          </kbd>
        </div>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-md z-[100]"
            />

            {/* Command Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ 
                duration: 0.2, 
                ease: [0.16, 1, 0.3, 1]
              }}
              className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-[580px] z-[101] px-4"
            >
              <Command
                value={selectedValue}
                onValueChange={setSelectedValue}
                className="relative overflow-hidden rounded-2xl border border-[#E8E2DA]
                          bg-white/95 backdrop-blur-2xl shadow-[8px_8px_24px_#d1cdc7,-8px_-8px_24px_#ffffff]"
                loop
              >
                {/* Glow effect at top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#B8895A]/40 to-transparent" />

                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-[#E8E2DA]">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#B8895A]/10">
                    <Sparkles size={16} className="text-[#B8895A]" />
                  </div>
                  <Command.Input
                    ref={inputRef}
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent text-[15px] text-[#2D2A26] placeholder:text-[#8C857C] 
                              outline-none caret-[#B8895A]"
                  />
                  <kbd className="px-2 py-1 text-[11px] font-medium text-[#8C857C] bg-[#F5F0EB] 
                                 border border-[#E8E2DA] rounded-lg">
                    esc
                  </kbd>
                </div>

                {/* Results */}
                <Command.List className="max-h-[400px] overflow-y-auto overscroll-contain py-2 scroll-smooth">
                  <Command.Empty className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-[#F5F0EB]">
                      <Search size={20} className="text-[#8C857C]" />
                    </div>
                    <p className="text-sm text-[#8C857C]">No results found</p>
                    <p className="text-xs text-[#A9A29A] mt-1">Try a different search term</p>
                  </Command.Empty>

                  {/* Recent Section */}
                  {!search && recentItems.length > 0 && (
                    <Command.Group>
                      <div className="px-4 py-2 flex items-center gap-2">
                        <Clock size={12} className="text-[#A9A29A]" />
                        <span className="text-[11px] font-semibold text-[#A9A29A] uppercase tracking-wider">
                          Recent
                        </span>
                      </div>
                      {recentItems.map((item) => (
                        <Command.Item
                          key={item.id}
                          value={`${item.label} ${item.type}`}
                          onSelect={() => handleSelect(() => {
                            const path = item.type === 'project' 
                              ? `/dashboard/projects/${item.id}` 
                              : `/dashboard/clients/${item.id}`;
                            router.push(path);
                          })}
                          className="group mx-2 px-3 py-2.5 flex items-center gap-3 rounded-xl cursor-pointer
                                    text-[#8C857C] transition-all duration-150
                                    data-[selected=true]:bg-[#B8895A]/10 data-[selected=true]:text-[#B8895A]
                                    hover:bg-[#F5F0EB]"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg 
                                        bg-[#F5F0EB] group-data-[selected=true]:bg-[#B8895A]/15
                                        transition-colors duration-150">
                            {item.icon}
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className="text-sm font-medium text-[#2D2A26] group-data-[selected=true]:text-[#B8895A]">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-[#A9A29A] capitalize">
                              {item.type}
                            </span>
                          </div>
                          <ArrowRight 
                            size={14} 
                            className="opacity-0 -translate-x-2 group-data-[selected=true]:opacity-100 
                                      group-data-[selected=true]:translate-x-0 transition-all duration-150
                                      text-[#B8895A]" 
                          />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {/* Command Groups */}
                  {commandGroups.map((group) => (
                    <Command.Group key={group.heading}>
                      <div className="px-4 py-2 flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-semibold text-[#A9A29A] uppercase tracking-wider">
                          {group.heading}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#E8E2DA] to-transparent" />
                      </div>
                      {group.items.map((item) => (
                        <Command.Item
                          key={item.id}
                          value={`${item.label} ${item.keywords?.join(' ') || ''}`}
                          onSelect={() => handleSelect(item.onSelect)}
                          className="group mx-2 px-3 py-2.5 flex items-center gap-3 rounded-xl cursor-pointer
                                    text-[#8C857C] transition-all duration-150
                                    data-[selected=true]:bg-[#B8895A]/10 data-[selected=true]:text-[#B8895A]
                                    hover:bg-[#F5F0EB]"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg 
                                        bg-[#F5F0EB] group-data-[selected=true]:bg-[#B8895A]/15
                                        transition-colors duration-150">
                            {item.icon}
                          </div>
                          <span className="flex-1 text-sm font-medium text-[#2D2A26] 
                                         group-data-[selected=true]:text-[#B8895A] transition-colors">
                            {item.label}
                          </span>
                          {item.shortcut && (
                            <div className="flex items-center gap-1">
                              {item.shortcut.map((key, i) => (
                                <kbd
                                  key={i}
                                  className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center
                                            text-[10px] font-medium text-[#8C857C] 
                                            bg-[#F5F0EB] border border-[#E8E2DA] rounded-md
                                            group-data-[selected=true]:bg-[#B8895A]/10 
                                            group-data-[selected=true]:border-[#B8895A]/20
                                            group-data-[selected=true]:text-[#B8895A]
                                            transition-all duration-150"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                          <ArrowRight 
                            size={14} 
                            className="opacity-0 -translate-x-2 group-data-[selected=true]:opacity-100 
                                      group-data-[selected=true]:translate-x-0 transition-all duration-150
                                      text-[#B8895A]" 
                          />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E2DA] 
                              bg-gradient-to-r from-[#F5F0EB]/50 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A9A29A]">
                      <kbd className="min-w-[18px] h-[18px] px-1 flex items-center justify-center 
                                    bg-[#F5F0EB] rounded text-[10px]">↑</kbd>
                      <kbd className="min-w-[18px] h-[18px] px-1 flex items-center justify-center 
                                    bg-[#F5F0EB] rounded text-[10px]">↓</kbd>
                      <span className="ml-0.5">Navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#A9A29A]">
                      <kbd className="min-w-[18px] h-[18px] px-1 flex items-center justify-center 
                                    bg-[#F5F0EB] rounded text-[10px]">↵</kbd>
                      <span className="ml-0.5">Select</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#A9A29A]">
                    <CommandIcon size={12} className="text-[#B8895A]/60" />
                    <span>Command Palette</span>
                  </div>
                </div>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
