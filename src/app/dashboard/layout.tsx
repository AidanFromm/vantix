'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarProvider, CommandPalette } from '@/components/dashboard';
import NotificationBell from '@/components/NotificationBell';

interface User {
  email: string;
  name: string;
  role: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vantix_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vantix_user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-emerald-500/10 blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-[#0a0a0a] dashboard-scope">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 px-4 lg:px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between">
              {/* Left side - spacer for mobile hamburger */}
              <div className="w-12 lg:w-0" />

              {/* Center - Command Palette */}
              <div className="flex-1 flex justify-center lg:justify-start lg:ml-0">
                <CommandPalette />
              </div>

              {/* Right side - Notifications */}
              <div className="flex items-center gap-3">
                <NotificationBell />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
