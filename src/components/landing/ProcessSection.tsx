'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    description:
      '30 minutes. We learn your business inside and out. Pain points, goals, current tools — everything.',
  },
  {
    number: '02',
    title: 'Strategy & Blueprint',
    description:
      'Custom AI roadmap tailored to your business. No cookie-cutter solutions. You approve before we build.',
  },
  {
    number: '03',
    title: 'Build Sprint',
    description:
      '2-4 weeks of focused development. Daily updates. You see progress in real-time through your own dashboard.',
  },
  {
    number: '04',
    title: 'Launch & Optimize',
    description:
      'Go live with full support. We monitor performance, gather data, and continuously improve.',
  },
];

function StepItem({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative pl-12 md:pl-20 pb-16 last:pb-0"
    >
      {/* Dot */}
      <div className="absolute left-0 md:left-4 top-1 w-3 h-3 rounded-full bg-[#B07A45] z-10">
        {isInView && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#B07A45]"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <span
        className="text-sm font-semibold text-[#B07A45] tracking-widest"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {step.number}
      </span>
      <h3
        className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mt-1 mb-3"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {step.title}
      </h3>
      <p
        className="text-[#4B4B4B] leading-relaxed max-w-md text-lg"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.6'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="bg-[#F4EFE8] py-20 md:py-32" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className="text-3xl md:text-5xl font-bold text-[#1C1C1C] text-center mb-20"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          How It Works
        </h2>
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-[5px] md:left-[19px] top-0 bottom-0 w-[2px] bg-[#E3D9CD]" />
          {/* Animated fill */}
          <motion.div
            className="absolute left-[5px] md:left-[19px] top-0 w-[2px] bg-gradient-to-b from-[#B07A45] to-[#D8C2A8]"
            style={{ height: lineHeight }}
          />
          {steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
