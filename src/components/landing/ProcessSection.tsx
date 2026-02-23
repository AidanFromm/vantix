'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Audit',
    description: 'We dig into your operations, tools, and workflows to find where AI creates the most leverage.',
  },
  {
    number: '02',
    title: 'Blueprint',
    description: 'You get a clear, prioritized roadmap — what to build, in what order, and exactly what it costs.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Our team builds your systems in focused sprints. You see progress weekly, not quarterly.',
  },
  {
    number: '04',
    title: 'Deploy',
    description: 'We launch to production with monitoring, testing, and zero downtime migrations.',
  },
  {
    number: '05',
    title: 'Optimize',
    description: 'Post-launch, we track performance and refine. Your systems get smarter over time.',
  },
];

function StepItem({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-16 md:pl-24 pb-16 last:pb-0"
    >
      {/* Simple dot */}
      <div className="absolute left-[5px] md:left-[19px] top-2 z-10">
        <div className={`w-3 h-3 rounded-full transition-colors duration-700 ${
          isInView ? 'bg-[#B07A45]' : 'bg-[#D8C2A8]'
        }`} />
      </div>

      <span
        className="text-5xl md:text-6xl font-bold text-[#B07A45]/20 absolute left-10 md:left-12 -top-3 select-none"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {step.number}
      </span>

      <div className="relative">
        <h3
          className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3"
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
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="process" className="bg-[#F4EFE8] py-20 md:py-32" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-[#1C1C1C] text-center mb-4"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#4B4B4B] text-center text-lg mb-20 max-w-xl mx-auto"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          From audit to optimization in five focused steps.
        </motion.p>

        <div className="relative">
          {/* Static background line */}
          <div className="absolute left-[5px] md:left-[19px] top-0 bottom-0 w-[2px] bg-[#E3D9CD]" />
          <div className="absolute left-[5px] md:left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#B07A45] to-[#D8C2A8]" />
          {steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
