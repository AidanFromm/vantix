'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

/* ── Metrics data ── */
const metrics = [
  { value: 37, suffix: '%', label: 'reduction in manual hours' },
  { value: 2.4, suffix: 'x', label: 'faster processing', decimals: 1 },
  { value: 180, prefix: '$', suffix: 'K+', label: 'annual savings identified' },
];

export default function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="py-10 sm:py-12"
      style={{ backgroundColor: colors.bgAlt }}
    >
      <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
        {metrics.map((metric, i) => (
          <div key={metric.label} className="flex items-center">
            {/* Bronze divider (not before the first item) */}
            {i > 0 && (
              <div
                className="hidden sm:block w-px h-12 mx-10 flex-shrink-0"
                style={{ backgroundColor: colors.bronze + '40' }}
              />
            )}

            <div className="text-center sm:text-left">
              {/* Animated number */}
              <div
                className="text-3xl sm:text-4xl font-bold"
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
              <p
                className="text-sm mt-1"
                style={{ fontFamily: fonts.body, color: colors.muted }}
              >
                {metric.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Counter that animates from 0 to target ── */
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

    const duration = 1800; // ms
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(current.toFixed(decimals));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [active, target, decimals]);

  return <span>{display}</span>;
}
