'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Status = 'active' | 'idle' | 'error' | 'offline' | 'warning' | 'success';

interface StatusDotProps {
  status: Status;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<
  Status,
  {
    color: string;
    bgColor: string;
    ringColor: string;
    label: string;
  }
> = {
  active: {
    color: 'bg-[#B07A45]/50',
    bgColor: 'bg-[#B07A45]/50/20',
    ringColor: 'ring-[#B07A45]/50/30',
    label: 'Active',
  },
  success: {
    color: 'bg-[#B07A45]/50',
    bgColor: 'bg-[#B07A45]/50/20',
    ringColor: 'ring-[#B07A45]/50/30',
    label: 'Success',
  },
  idle: {
    color: 'bg-[#B07A45]',
    bgColor: 'bg-[#B07A45]/20',
    ringColor: 'ring-[#B07A45]/30',
    label: 'Idle',
  },
  warning: {
    color: 'bg-[#B07A45]',
    bgColor: 'bg-[#B07A45]/20',
    ringColor: 'ring-[#B07A45]/30',
    label: 'Warning',
  },
  error: {
    color: 'bg-[#B0614A]/50',
    bgColor: 'bg-[#B0614A]/50/20',
    ringColor: 'ring-[#B0614A]/50/30',
    label: 'Error',
  },
  offline: {
    color: 'bg-[#F4EFE8]0',
    bgColor: 'bg-[#F4EFE8]0/20',
    ringColor: 'ring-[#F4EFE8]0/30',
    label: 'Offline',
  },
};

const sizeConfig = {
  sm: {
    dot: 'w-2 h-2',
    ring: 'w-4 h-4',
    text: 'text-xs',
    gap: 'gap-1.5',
  },
  md: {
    dot: 'w-3 h-3',
    ring: 'w-5 h-5',
    text: 'text-sm',
    gap: 'gap-2',
  },
  lg: {
    dot: 'w-4 h-4',
    ring: 'w-7 h-7',
    text: 'text-base',
    gap: 'gap-2.5',
  },
};

export function StatusDot({
  status,
  label,
  showLabel = false,
  size = 'md',
  pulse = true,
  className,
}: StatusDotProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const shouldPulse = pulse && (status === 'active' || status === 'success');

  return (
    <div className={cn('flex items-center', sizeStyles.gap, className)}>
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
        {shouldPulse && (
          <motion.span
            className={cn(
              'absolute rounded-full',
              sizeStyles.ring,
              config.bgColor
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Main dot */}
        <motion.span
          className={cn(
            'relative rounded-full ring-2',
            sizeStyles.dot,
            config.color,
            config.ringColor
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span className={cn('text-[#A39B90]', sizeStyles.text)}>
          {label || config.label}
        </span>
      )}
    </div>
  );
}

// Status badge with background
export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        config.bgColor,
        'border border-white/5',
        className
      )}
    >
      <StatusDot status={status} size="sm" />
      <span className="text-sm font-medium text-white">
        {label || config.label}
      </span>
    </motion.div>
  );
}

// Connection status with animated icon
export function ConnectionStatus({
  isConnected,
  className,
}: {
  isConnected: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div
        className="relative"
        animate={isConnected ? {} : { x: [-1, 1, -1] }}
        transition={{ duration: 0.1, repeat: isConnected ? 0 : Infinity }}
      >
        {/* Signal bars */}
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className={cn(
                'w-1 rounded-full',
                isConnected ? 'bg-[#B07A45]/50' : 'bg-[#4B4B4B]'
              )}
              style={{ height: `${bar * 25}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isConnected ? 1 : bar === 1 ? 1 : 0.3 }}
              transition={{ delay: bar * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      <span
        className={cn(
          'text-sm font-medium',
          isConnected ? 'text-[#C89A6A]' : 'text-[#F4EFE8]0'
        )}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

// Live indicator (like YouTube live)
export function LiveIndicator({
  isLive = true,
  className,
}: {
  isLive?: boolean;
  className?: string;
}) {
  if (!isLive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#B0614A]/50/20 border border-[#B0614A]/50/30',
        className
      )}
    >
      <motion.span
        className="w-2 h-2 rounded-full bg-[#B0614A]/50"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className="text-xs font-bold text-[#B0614A] uppercase tracking-wider">
        Live
      </span>
    </motion.div>
  );
}

// Activity indicator with animated dots
export function ActivityIndicator({
  text = 'Loading',
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-[#A39B90]">{text}</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#B07A45]/50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Progress status with percentage
export function ProgressStatus({
  progress,
  label,
  className,
}: {
  progress: number;
  label?: string;
  className?: string;
}) {
  const status: Status = progress >= 100 ? 'success' : progress > 0 ? 'active' : 'idle';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <StatusDot status={status} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-[#E3D9CD] truncate">{label}</span>
          <span className="text-sm font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B07A45]/50 to-[#B07A45] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
