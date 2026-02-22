'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

interface Stat {
  value: string;
  numericPart: number | null;
  prefix: string;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: '40+', numericPart: 40, prefix: '', suffix: '+', label: 'Hours Saved Weekly' },
  { value: '3x', numericPart: 3, prefix: '', suffix: 'x', label: 'More Leads Captured' },
  { value: '24/7', numericPart: null, prefix: '', suffix: '', label: 'AI Never Sleeps' },
  { value: '3', numericPart: 3, prefix: '', suffix: '', label: 'Week Average Build' },
];

function AnimatedNumber({ stat }: { stat: Stat }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState('0');

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (isInView && stat.numericPart !== null) {
      motionVal.set(stat.numericPart);
    }
  }, [isInView, stat.numericPart, motionVal]);

  useEffect(() => {
    if (stat.numericPart === null) {
      setDisplayed(stat.value);
      return;
    }
    const unsub = spring.on('change', (v: number) => {
      setDisplayed(`${stat.prefix}${Math.round(v)}${stat.suffix}`);
    });
    return unsub;
  }, [spring, stat]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <span
        className="text-5xl md:text-7xl font-bold text-[#B07A45] block"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {displayed}
      </span>
      {/* Bronze underline */}
      <motion.div
        className="h-[2px] bg-[#B07A45] mx-auto mt-3 mb-4"
        initial={{ width: 0 }}
        animate={isInView ? { width: '3rem' } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <span
        className="text-sm text-[#4B4B4B]"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function ROISection() {
  return (
    <section className="bg-[#F4EFE8] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <AnimatedNumber key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
