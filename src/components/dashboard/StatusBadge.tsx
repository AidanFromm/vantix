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
    dot: 'bg-[#B07A45]',
    bg: 'bg-[#B07A45]/10 border-[#B07A45]/20',
    text: 'text-[#B07A45]',
  },
  warning: {
    dot: 'bg-[#C89A6A]',
    bg: 'bg-[#C89A6A]/10 border-[#C89A6A]/20',
    text: 'text-[#B07A45]',
  },
  error: {
    dot: 'bg-[#B07A45]',
    bg: 'bg-[#B07A45]/10 border-[#B07A45]/20',
    text: 'text-[#8E5E34]',
  },
  info: {
    dot: 'bg-[#7A746C]',
    bg: 'bg-[#7A746C]/10 border-[#7A746C]/20',
    text: 'text-[#7A746C]',
  },
  neutral: {
    dot: 'bg-[#7A746C]',
    bg: 'bg-[#7A746C]/10 border-[#7A746C]/20',
    text: 'text-[#7A746C]',
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
