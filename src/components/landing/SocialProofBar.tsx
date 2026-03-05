'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts } from '@/lib/design-tokens';

const metrics = [
  { value: 3, suffix: '+', label: 'Active Clients' },
  { value: 5.8, prefix: '$', suffix: 'M+', label: 'Revenue Managed', decimals: 1 },
  { value: 80, suffix: '+', label: 'Features Built' },
];

const logos = [
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg' },
  { name: 'Secured Tampa', logo: '/logos/secured-tampa.jpg' },
  { name: 'CardLedger', logo: '/logos/cardledger.png' },
];

// Double the logos for infinite scroll
const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

export default function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-20" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-6xl mx-auto px-5">
        {/* Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-0 mb-14"
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

        {/* Logo marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
            style={{ background: `linear-gradient(to right, ${colors.surface}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
            style={{ background: `linear-gradient(to left, ${colors.surface}, transparent)` }}
          />
          <div className="flex gap-12 items-center social-marquee w-max">
            {marqueeLogos.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-3 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#E3D9CD]">
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes social-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        .social-marquee {
          animation: social-scroll 20s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .social-marquee { animation: none; }
        }
      `}</style>
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
