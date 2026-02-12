export type NotificationType =
  | 'new_lead'
  | 'invoice_overdue'
  | 'project_deadline'
  | 'client_replied'
  | 'intake_submitted'
  | 'meeting_reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = 'vantix_notifications';
const PREFS_KEY = 'vantix_notification_prefs';

export const notificationTypeLabels: Record<NotificationType, string> = {
  new_lead: 'New Lead',
  invoice_overdue: 'Invoice Overdue',
  project_deadline: 'Project Deadline',
  client_replied: 'Client Replied',
  intake_submitted: 'Intake Submitted',
  meeting_reminder: 'Meeting Reminder',
};

function readStorage(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(notifications: Notification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // silent
  }
}

export function getNotifications(): Notification[] {
  return readStorage();
}

export function getUnreadCount(): number {
  return readStorage().filter((n) => !n.read).length;
}

export function addNotification(
  type: NotificationType,
  title: string,
  description: string
): Notification {
  const notifications = readStorage();
  const n: Notification = {
    id: crypto.randomUUID(),
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(n);
  writeStorage(notifications);
  return n;
}

export function markAsRead(id: string) {
  const notifications = readStorage();
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifications[idx].read = true;
    writeStorage(notifications);
  }
}

export function markAllRead() {
  const notifications = readStorage().map((n) => ({ ...n, read: true }));
  writeStorage(notifications);
}

export function clearAll() {
  writeStorage([]);
}

export function deleteNotification(id: string) {
  writeStorage(readStorage().filter((n) => n.id !== id));
}

export function getPreferences(): Record<NotificationType, boolean> {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // silent
  }
  return {
    new_lead: true,
    invoice_overdue: true,
    project_deadline: true,
    client_replied: true,
    intake_submitted: true,
    meeting_reminder: true,
  };
}

export function setPreferences(prefs: Record<NotificationType, boolean>) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // silent
  }
}

export function seedNotifications() {
  const existing = readStorage();
  if (existing.length > 0) return;

  const now = Date.now();
  const min = 60_000;
  const hr = 3_600_000;

  const seeds: Omit<Notification, 'id'>[] = [];

  const notifications: Notification[] = seeds.map((s) => ({
    ...s,
    id: crypto.randomUUID(),
  }));

  writeStorage(notifications);
}

