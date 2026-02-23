'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

interface Stat {
  display: string;
  numericPart: number | null;
  prefix: string;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { display: '37%', numericPart: 37, prefix: '', suffix: '%', label: 'Average reduction in manual operating hours' },
  { display: '2.4x', numericPart: 24, prefix: '', suffix: 'x', label: 'Faster order processing for e-commerce clients' },
  { display: '$180K+', numericPart: 180, prefix: '$', suffix: 'K+', label: 'Annual savings identified across engagements' },
  { display: '< 4 weeks', numericPart: null, prefix: '', suffix: '', label: 'Average time from audit to first deployment' },
];

function AnimatedNumber({ stat }: { stat: Stat }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(stat.numericPart !== null ? `${stat.prefix}0${stat.suffix}` : stat.display);

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (isInView && stat.numericPart !== null) {
      motionVal.set(stat.numericPart);
    }
  }, [isInView, stat.numericPart, motionVal]);

  useEffect(() => {
    if (stat.numericPart === null) {
      if (isInView) setDisplayed(stat.display);
      return;
    }
    const isDivisor10 = stat.display.includes('2.4');
    const unsub = spring.on('change', (v: number) => {
      if (isDivisor10) {
        setDisplayed(`${stat.prefix}${(v / 10).toFixed(1)}${stat.suffix}`);
      } else {
        setDisplayed(`${stat.prefix}${Math.round(v)}${stat.suffix}`);
      }
    });
    return unsub;
  }, [spring, stat, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <span
        className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#B07A45] block leading-none"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {displayed}
      </span>
      <motion.div
        className="h-[2px] bg-[#B07A45]/40 mx-auto mt-4 mb-4"
        initial={{ width: 0 }}
        animate={isInView ? { width: '3rem' } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <span
        className="text-sm md:text-base text-[#6B6B6B] max-w-[200px] inline-block leading-snug"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function ROISection() {
  return (
    <section className="bg-[#F4EFE8] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, i) => (
            <AnimatedNumber key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
