'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({
  value,
  direction = 'up',
  className,
  duration = 2,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const spring = useSpring(direction === 'up' ? value : value, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });
  
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      // Reset to starting position then animate to target
      spring.jump(direction === 'up' ? 0 : value);
      spring.set(direction === 'up' ? value : 0);
    }
  }, [isInView, spring, value, direction]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Stats section with animated numbers
interface StatProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export function StatsSection({
  stats,
  className,
}: {
  stats: StatProps[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-8 md:grid-cols-4', className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <div className="text-4xl font-bold mb-2 gradient-text">
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </div>
          <div className="text-sm text-[var(--color-muted)] uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Percentage ring
export function PercentageRing({
  value,
  size = 120,
  strokeWidth = 8,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const strokeDashoffset = useTransform(
    spring,
    [0, 100],
    [circumference, circumference - (value / 100) * circumference]
  );

  useEffect(() => {
    if (isInView) {
      spring.set(100);
    }
  }, [isInView, spring]);

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatedCounter value={value} suffix="%" className="text-2xl font-bold" />
      </div>
    </div>
  );
}
