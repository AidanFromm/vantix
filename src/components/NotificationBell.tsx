'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, X, Inbox, DollarSign, Clock, MessageSquare, ClipboardList, Calendar } from 'lucide-react';
import Link from 'next/link';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
  clearAll,
  seedNotifications,
  type Notification,
  type NotificationType,
} from '@/lib/notifications';

const typeIcons: Record<NotificationType, React.ElementType> = {
  new_lead: Inbox,
  invoice_overdue: DollarSign,
  project_deadline: Clock,
  client_replied: MessageSquare,
  intake_submitted: ClipboardList,
  meeting_reminder: Calendar,
};

const typeColors: Record<NotificationType, string> = {
  new_lead: 'text-[#8B5E3C]',
  invoice_overdue: 'text-[#C4735B]',
  project_deadline: 'text-[#D4A843]',
  client_replied: 'text-[#7BA3C4]',
  intake_submitted: 'text-[#9B8ABF]',
  meeting_reminder: 'text-[#6890B0]',
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    setNotifications(getNotifications());
    setUnread(getUnreadCount());
  }, []);

  useEffect(() => {
    seedNotifications();
    refresh();
  }, [refresh]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = (id: string) => {
    markAsRead(id);
    refresh();
  };

  const handleMarkAllRead = () => {
    markAllRead();
    refresh();
  };

  const handleClearAll = () => {
    clearAll();
    refresh();
    setOpen(false);
  };

  const recent = notifications.slice(0, 8);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-[#9C8575] hover:text-[#2C1810] hover:bg-[#E8D5C4] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#8B5E3C] text-white text-[10px] font-bold px-1"
            >
              {unread > 99 ? '99+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[380px] max-w-[calc(100vw-2rem)] bg-white border border-[#E8D8CA] rounded-2xl shadow-[8px_8px_24px_#d1cdc7,-8px_-8px_24px_#ffffff] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8D8CA]">
              <h3 className="font-semibold text-sm text-[#2C1810]">Notifications</h3>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button onClick={handleMarkAllRead} className="p-1.5 rounded-md text-[#9C8575] hover:text-[#2C1810] hover:bg-[#E8D5C4] transition-colors" title="Mark all read">
                    <CheckCheck size={16} />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={handleClearAll} className="p-1.5 rounded-md text-[#9C8575] hover:text-[#C4735B] hover:bg-[#C4735B]/10 transition-colors" title="Clear all">
                    <Trash2 size={16} />
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-md text-[#9C8575] hover:text-[#2C1810] hover:bg-[#E8D5C4] transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {recent.length === 0 ? (
                <div className="py-12 text-center text-[#9C8575] text-sm">No notifications</div>
              ) : (
                recent.map((n) => {
                  const Icon = typeIcons[n.type];
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-[#E8D5C4] transition-colors border-b border-[#E8D8CA] last:border-b-0 ${!n.read ? 'bg-[#8B5E3C]/[0.04]' : ''}`}
                    >
                      <div className={`mt-0.5 ${typeColors[n.type]}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium truncate ${!n.read ? 'text-[#2C1810]' : 'text-[#9C8575]'}`}>{n.title}</span>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#8B5E3C] flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-[#9C8575] mt-0.5 line-clamp-2">{n.description}</p>
                        <p className="text-[10px] text-[#A9A29A] mt-1">{timeAgo(n.timestamp)}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="block text-center py-2.5 text-xs text-[#8B5E3C] hover:bg-[#E8D5C4] transition-colors border-t border-[#E8D8CA] font-medium"
              >
                View all notifications
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
