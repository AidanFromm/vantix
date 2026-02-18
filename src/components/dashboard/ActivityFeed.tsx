'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Phone,
  Zap,
} from 'lucide-react';

type ActivityType = 'client' | 'email' | 'payment' | 'document' | 'task' | 'alert' | 'meeting' | 'message' | 'call' | 'lead';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  user?: string;
  link?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  className?: string;
}

const iconMap: Record<ActivityType, React.ElementType> = {
  client: User,
  email: Mail,
  payment: DollarSign,
  document: FileText,
  task: CheckCircle,
  alert: AlertCircle,
  meeting: Calendar,
  message: MessageSquare,
  call: Phone,
  lead: Zap,
};

const colorMap: Record<ActivityType, string> = {
  client: 'bg-[#7BA3C4]/10 text-[#7BA3C4] border-[#7BA3C4]/20',
  email: 'bg-[#9B8ABF]/10 text-[#9B8ABF] border-[#9B8ABF]/20',
  payment: 'bg-[#8DB580]/10 text-[#8DB580] border-[#8DB580]/20',
  document: 'bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/20',
  task: 'bg-[#8DB580]/10 text-[#6B9A5E] border-[#8DB580]/20',
  alert: 'bg-[#C4735B]/10 text-[#C4735B] border-[#C4735B]/20',
  meeting: 'bg-[#7BA3C4]/10 text-[#6890B0] border-[#7BA3C4]/20',
  message: 'bg-[#C48A9B]/10 text-[#C48A9B] border-[#C48A9B]/20',
  call: 'bg-[#D4A843]/10 text-[#B8923A] border-[#D4A843]/20',
  lead: 'bg-[#9B6C3C]/10 text-[#9B6C3C] border-[#9B6C3C]/20',
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDayLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (activityDate.getTime() === today.getTime()) return 'Today';
  if (activityDate.getTime() === yesterday.getTime()) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const Icon = iconMap[activity.type];
  const colors = colorMap[activity.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group flex gap-3 py-3 px-2 rounded-xl hover:bg-[#EFE6DA] transition-colors cursor-pointer"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl border ${colors} flex items-center justify-center`}>
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1E1E1E] truncate group-hover:text-[#9B6C3C] transition-colors">
          {activity.title}
        </p>
        {activity.description && (
          <p className="text-xs text-[#7A746C] truncate mt-0.5">{activity.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {activity.user && (
            <span className="text-xs text-[#A9A29A]">{activity.user}</span>
          )}
          <span className="text-xs text-[#A9A29A]">&middot;</span>
          <span className="text-xs text-[#A9A29A]">{getRelativeTime(activity.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ActivityFeed({ activities, maxItems = 10, className = '' }: ActivityFeedProps) {
  // Group activities by day
  const groupedActivities = useMemo(() => {
    const sorted = [...activities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxItems);

    const groups: { label: string; items: Activity[] }[] = [];
    let currentLabel = '';

    sorted.forEach((activity) => {
      const label = getDayLabel(activity.timestamp);
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, items: [] });
      }
      groups[groups.length - 1].items.push(activity);
    });

    return groups;
  }, [activities, maxItems]);

  if (activities.length === 0) {
    return (
      <div className={`bg-white border border-[#D8CFC4] rounded-2xl shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff] p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-[#EFE6DA] flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={20} className="text-[#7A746C]" />
          </div>
          <p className="text-sm text-[#7A746C]">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#D8CFC4] rounded-2xl shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#D8CFC4]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1E1E1E]">Recent Activity</h3>
          <span className="text-xs text-[#7A746C] bg-[#EFE6DA] px-2 py-1 rounded-full">
            {activities.length} total
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {groupedActivities.map((group, groupIndex) => (
            <div key={group.label}>
              {/* Day Header */}
              <div className="sticky top-0 z-10 px-5 py-2 bg-[#F5EFE7]/90 backdrop-blur-md border-b border-[#D8CFC4]">
                <span className="text-xs font-medium text-[#7A746C] uppercase tracking-wider">
                  {group.label}
                </span>
              </div>

              {/* Activities */}
              <div className="px-3 py-1">
                {group.items.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={groupIndex * 10 + index}
                  />
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <div className="px-5 py-3 border-t border-[#D8CFC4] bg-[#F5EFE7]/50">
        <button className="text-sm text-[#9B6C3C] hover:text-[#9A7348] transition-colors font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
}
