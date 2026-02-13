'use client';

import { motion } from 'framer-motion';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<StatusType, { dot: string; bg: string; text: string }> = {
  success: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
  },
  warning: {
    dot: 'bg-yellow-500',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    text: 'text-yellow-400',
  },
  error: {
    dot: 'bg-red-500',
    bg: 'bg-red-500/10 border-red-500/20',
    text: 'text-red-400',
  },
  info: {
    dot: 'bg-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
  },
  neutral: {
    dot: 'bg-gray-500',
    bg: 'bg-gray-500/10 border-gray-500/20',
    text: 'text-gray-400',
  },
};

const sizeConfig = {
  sm: {
    badge: 'px-2 py-0.5 text-xs',
    dot: 'w-1.5 h-1.5',
    gap: 'gap-1.5',
  },
  md: {
    badge: 'px-2.5 py-1 text-xs',
    dot: 'w-2 h-2',
    gap: 'gap-2',
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm',
    dot: 'w-2.5 h-2.5',
    gap: 'gap-2',
  },
};

export default function StatusBadge({
  status,
  label,
  pulse = false,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const colors = statusConfig[status];
  const sizing = sizeConfig[size];

  return (
    <span
      className={`
        inline-flex items-center ${sizing.gap} ${sizing.badge}
        ${colors.bg} ${colors.text}
        border rounded-full font-medium
        ${className}
      `}
    >
      <span className="relative flex-shrink-0">
        <span className={`block ${sizing.dot} rounded-full ${colors.dot}`} />
        {pulse && (
          <motion.span
            className={`absolute inset-0 ${sizing.dot} rounded-full ${colors.dot}`}
            animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </span>
      <span>{label}</span>
    </span>
  );
}

// Convenience components
export function ActiveBadge({ label = 'Active', ...props }: Omit<StatusBadgeProps, 'status' | 'label'> & { label?: string }) {
  return <StatusBadge status="success" label={label} pulse {...props} />;
}

export function PendingBadge({ label = 'Pending', ...props }: Omit<StatusBadgeProps, 'status' | 'label'> & { label?: string }) {
  return <StatusBadge status="warning" label={label} {...props} />;
}

export function InactiveBadge({ label = 'Inactive', ...props }: Omit<StatusBadgeProps, 'status' | 'label'> & { label?: string }) {
  return <StatusBadge status="error" label={label} {...props} />;
}

export function DraftBadge({ label = 'Draft', ...props }: Omit<StatusBadgeProps, 'status' | 'label'> & { label?: string }) {
  return <StatusBadge status="neutral" label={label} {...props} />;
}
