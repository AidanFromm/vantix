'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('vantix_notifications') || '[]');
    setNotifications(saved);
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('vantix_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('vantix_notifications', '[]');
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('vantix_notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('vantix_notifications', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-muted)]">
            <Bell size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No notifications</p>
            <p className="text-sm mt-1">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-[#EEE6DC]/5 transition-colors ${!notif.read ? 'bg-[#EEE6DC]/[0.02]' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-[#B07A45]" />}
                      <span className="font-medium">{notif.title}</span>
                    </div>
                    <p className="text-sm text-[var(--color-muted)]">{notif.message}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-2">
                      {new Date(notif.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="p-1.5 rounded-lg hover:bg-[#EEE6DC]/10 transition-colors"
                        title="Mark as read"
                      >
                        <Check size={14} className="text-[var(--color-muted)]" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-[#EEE6DC]/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-[var(--color-muted)]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
