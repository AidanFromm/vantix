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
    dot: 'bg-[#8DB580]',
    bg: 'bg-[#8DB580]/10 border-[#8DB580]/20',
    text: 'text-[#6B9A5E]',
  },
  warning: {
    dot: 'bg-[#D4A843]',
    bg: 'bg-[#D4A843]/10 border-[#D4A843]/20',
    text: 'text-[#B8923A]',
  },
  error: {
    dot: 'bg-[#C4735B]',
    bg: 'bg-[#C4735B]/10 border-[#C4735B]/20',
    text: 'text-[#B0614A]',
  },
  info: {
    dot: 'bg-[#7BA3C4]',
    bg: 'bg-[#7BA3C4]/10 border-[#7BA3C4]/20',
    text: 'text-[#6890B0]',
  },
  neutral: {
    dot: 'bg-[#A89F94]',
    bg: 'bg-[#A89F94]/10 border-[#A89F94]/20',
    text: 'text-[#A89F94]',
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
