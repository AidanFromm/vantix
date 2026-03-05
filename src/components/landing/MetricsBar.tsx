'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

interface Metric {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const metrics: Metric[] = [
  { prefix: '$', value: 5.8, suffix: 'M+', label: 'Revenue Managed' },
  { value: 200, suffix: '+', label: 'Stores Served' },
  { value: 80, suffix: '+', label: 'Features Built' },
  { value: 3, suffix: '+', label: 'Active Clients' },
];

function AnimatedCounter({ metric, inView }: { metric: Metric; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = metric.value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= metric.value) {
        setCount(metric.value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, metric.value]);

  const display = metric.value % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toString();

  return (
    <div className="text-center px-2 sm:px-4 py-4 sm:py-6">
      <div
        className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-1 sm:mb-2"
        style={{ fontFamily: fonts.display, color: colors.bronze }}
      >
        {metric.prefix || ''}{display}{metric.suffix}
      </div>
      <div
        className="text-xs sm:text-sm lg:text-base tracking-wide uppercase"
        style={{ fontFamily: fonts.body, color: colors.muted }}
      >
        {metric.label}
      </div>
    </div>
  );
}

export default function MetricsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{ backgroundColor: colors.dark }}
    >
      {/* Subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: `${colors.bronze}08` }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <AnimatedCounter metric={m} inView={inView} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
