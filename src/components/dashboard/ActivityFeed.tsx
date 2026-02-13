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
  client: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  email: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  payment: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  document: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  task: 'bg-green-500/10 text-green-400 border-green-500/20',
  alert: 'bg-red-500/10 text-red-400 border-red-500/20',
  meeting: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  message: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  call: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  lead: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
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
      className="group flex gap-3 py-3 px-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl border ${colors} flex items-center justify-center`}>
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
          {activity.title}
        </p>
        {activity.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{activity.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {activity.user && (
            <span className="text-xs text-gray-600">{activity.user}</span>
          )}
          <span className="text-xs text-gray-600">•</span>
          <span className="text-xs text-gray-600">{getRelativeTime(activity.timestamp)}</span>
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
      <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={20} className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
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
              <div className="sticky top-0 z-10 px-5 py-2 bg-black/60 backdrop-blur-md border-b border-white/5">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
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
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
}
