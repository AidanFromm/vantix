'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoGridProps {
  className?: string;
  children?: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div className={cn('mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  children,
}: BentoGridItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all hover:border-[var(--color-accent)]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]',
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        {header && <div className="mb-4">{header}</div>}
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-[var(--color-accent)]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-[var(--color-muted)]">{description}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// Feature cards with number
export function FeatureCard({
  number,
  title,
  description,
  className,
}: {
  number: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group flex items-start gap-6 border-b border-[var(--color-border)] py-8 cursor-pointer',
        className
      )}
    >
      <span className="text-sm text-[var(--color-muted)] font-mono">{number}</span>
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-2 transition-colors group-hover:text-[var(--color-accent)]">
          {title}
        </h3>
        <p className="text-[var(--color-muted)]">{description}</p>
      </div>
      <motion.div
        className="text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ x: 5 }}
      >
        →
      </motion.div>
    </motion.div>
  );
}
