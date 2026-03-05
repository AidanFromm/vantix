'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

interface Stat {
  display: string;
  numericPart: number;
  prefix: string;
  suffix: string;
  label: string;
  isDivisor10?: boolean;
}

const stats: Stat[] = [
  { display: '3+', numericPart: 3, prefix: '', suffix: '+', label: 'Active clients served' },
  { display: '$5.8M+', numericPart: 58, prefix: '$', suffix: 'M+', label: 'Revenue managed across platforms', isDivisor10: true },
  { display: '80+', numericPart: 80, prefix: '', suffix: '+', label: 'Features built and deployed' },
  { display: '3 weeks', numericPart: 3, prefix: '', suffix: ' weeks', label: 'Average time to full deployment' },
];

function AnimatedNumber({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(`${stat.prefix}0${stat.suffix}`);

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (isInView) {
      motionVal.set(stat.numericPart);
    }
  }, [isInView, stat.numericPart, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', (v: number) => {
      if (stat.isDivisor10) {
        setDisplayed(`${stat.prefix}${(v / 10).toFixed(1)}${stat.suffix}`);
      } else {
        setDisplayed(`${stat.prefix}${Math.round(v)}${stat.suffix}`);
      }
    });
    return unsub;
  }, [spring, stat]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="text-center"
    >
      <span
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold block leading-none"
        style={{ fontFamily: fonts.display, color: colors.bronze }}
      >
        {displayed}
      </span>
      <motion.div
        className="mx-auto mt-4 mb-3"
        style={{ height: 2, backgroundColor: `${colors.bronze}40` }}
        initial={{ width: 0 }}
        animate={isInView ? { width: '3rem' } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <span
        className="text-sm md:text-base max-w-[220px] inline-block leading-snug"
        style={{ fontFamily: fonts.body, color: colors.muted }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function ROISection() {
  return (
    <section className="py-20 md:py-32" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              By the Numbers
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Measurable Impact
          </h2>
        </motion.div>
        {/* 2-col on mobile, 4-col on desktop — visible on ALL screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
          {stats.map((stat, i) => (
            <AnimatedNumber key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
