'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

function CountUp({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const animate = useCallback(() => {
    if (!inView) return;
    const duration = 2200;
    const fps = 60;
    const totalFrames = Math.round(duration / (1000 / fps));
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;

      if (frame >= totalFrames) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Number(current.toFixed(decimals)));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  useEffect(() => {
    return animate();
  }, [animate]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 50, prefix: '', suffix: '+', label: 'Projects Delivered', decimals: 0 },
  { value: 3327, prefix: '', suffix: '', label: 'Leads Generated', decimals: 0 },
  { value: 5.82, prefix: '$', suffix: 'M', label: 'Client Revenue', decimals: 2 },
  { value: 98, prefix: '', suffix: '%', label: 'Client Retention', decimals: 0 },
];

export default function MetricsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        backgroundColor: colors.bgElevated,
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${colors.bronze}08 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0"
        >
          {stats.map((stat, i) => (
            <div key={i} className="relative flex items-center justify-center">
              {/* Vertical divider (desktop only) */}
              {i > 0 && (
                <div
                  className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${colors.bronze}35, transparent)`,
                  }}
                />
              )}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease }}
                className="text-center group"
              >
                {/* Number */}
                <div
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight mb-2 transition-colors duration-500"
                  style={{
                    fontFamily: fonts.display,
                    color: colors.text,
                    letterSpacing: '-0.03em',
                  }}
                >
                  <CountUp
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>

                {/* Bronze underline */}
                <div
                  className="w-8 h-0.5 mx-auto mb-3 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${colors.bronze}, ${colors.copper})`,
                  }}
                />

                {/* Label */}
                <div
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {stat.label}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-64"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.bronze}50, transparent)`,
        }}
      />
    </section>
  );
}
