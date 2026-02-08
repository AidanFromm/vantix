'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white transition-colors',
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'pointer-events-none absolute -inset-[10px] opacity-50',
            '[--aurora:repeating-linear-gradient(100deg,#10b981_10%,#059669_15%,#047857_20%,#065f46_25%,#10b981_30%)]',
            '[background-image:var(--aurora)]',
            '[background-size:200%_100%]',
            'animate-aurora',
            'filter blur-[80px]',
            showRadialGradient &&
              '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]'
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute -inset-[10px] opacity-30',
            '[--aurora:repeating-linear-gradient(100deg,#10b981_10%,#34d399_15%,#6ee7b7_20%,#a7f3d0_25%,#10b981_30%)]',
            '[background-image:var(--aurora)]',
            '[background-size:200%_100%]',
            'animate-aurora-slow',
            'filter blur-[100px]',
            showRadialGradient &&
              '[mask-image:radial-gradient(ellipse_at_0%_100%,black_10%,transparent_70%)]'
          )}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Gradient mesh background
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl" />
      <div className="absolute -right-1/4 top-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-bl from-teal-500/20 to-transparent blur-3xl" />
      <div className="absolute -bottom-1/4 left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-tr from-green-500/20 to-transparent blur-3xl" />
    </div>
  );
}

// Animated gradient orbs
export function GradientOrbs({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="animate-float-slow absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/30 to-transparent blur-3xl" />
      <div className="animate-float-medium absolute right-1/4 top-1/2 h-80 w-80 rounded-full bg-gradient-to-bl from-teal-400/25 to-transparent blur-3xl" />
      <div className="animate-float-fast absolute bottom-1/4 left-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-green-400/20 to-transparent blur-3xl" />
    </div>
  );
}
