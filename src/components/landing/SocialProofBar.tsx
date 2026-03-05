'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

const metrics = [
  { value: 37, suffix: '%', label: 'Reduction in manual hours' },
  { value: 2.4, suffix: 'x', label: 'Faster processing', decimals: 1 },
  { value: 180, prefix: '$', suffix: 'K+', label: 'Annual savings identified' },
];

export default function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-20" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-0"
        >
          {metrics.map((metric, i) => (
            <div key={metric.label} className="flex items-center">
              {i > 0 && (
                <div
                  className="hidden sm:block w-px h-16 mx-14 flex-shrink-0"
                  style={{ background: `linear-gradient(to bottom, transparent, ${colors.bronze}40, transparent)` }}
                />
              )}
              <div className="text-center">
                <div
                  className="text-4xl sm:text-5xl font-bold tracking-tight"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {metric.prefix ?? ''}
                  <AnimatedCounter
                    target={metric.value}
                    decimals={metric.decimals ?? 0}
                    active={inView}
                  />
                  {metric.suffix}
                </div>
                <div
                  className="h-px w-8 mx-auto mt-3 mb-3"
                  style={{ backgroundColor: colors.bronze }}
                />
                <p
                  className="text-sm tracking-wide"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedCounter({
  target,
  decimals = 0,
  active,
}: {
  target: number;
  decimals?: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, target, decimals]);

  return <span>{display}</span>;
}
