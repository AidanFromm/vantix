'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

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
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="relative pl-20 md:pl-28 pb-20 last:pb-0"
    >
      {/* Dot */}
      <div className="absolute left-[7px] md:left-[19px] top-2 z-10">
        <div
          className="w-3.5 h-3.5 rounded-full transition-colors duration-700"
          style={{ backgroundColor: isInView ? colors.bronze : colors.border }}
        />
      </div>

      {/* Large step number */}
      <span
        className="text-6xl md:text-7xl font-bold absolute left-12 md:left-14 -top-4 select-none"
        style={{ fontFamily: fonts.display, color: `${colors.bronze}15` }}
      >
        {step.number}
      </span>

      <div className="relative">
        <h3
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {step.title}
        </h3>
        <p
          className="leading-relaxed max-w-md text-lg"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-36" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-5"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              Our Process
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            How It Works
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-center text-lg mb-24 max-w-xl mx-auto"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          From audit to optimization in five focused steps.
        </motion.p>

        <div className="relative">
          {/* Line */}
          <div
            className="absolute left-[7px] md:left-[19px] top-0 bottom-0 w-[2px]"
            style={{ background: `linear-gradient(to bottom, ${colors.bronze}, ${colors.border})` }}
          />
          {steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
