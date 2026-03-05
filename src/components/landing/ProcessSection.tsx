'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const steps = [
  {
    number: '01',
    title: 'Audit',
    description: 'We dig into your operations, tools, and workflows to find where AI creates the most leverage.',
    image: '/media-assets/images/process.jpg',
  },
  {
    number: '02',
    title: 'Design',
    description: 'You get a clear, prioritized blueprint — what to build, in what order, and exactly what it costs.',
    image: null,
  },
  {
    number: '03',
    title: 'Build',
    description: 'Our team builds your systems in focused sprints. You see progress weekly, not quarterly.',
    image: null,
  },
  {
    number: '04',
    title: 'Launch',
    description: 'We deploy to production with monitoring, testing, and zero downtime. Then optimize continuously.',
    image: null,
  },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease }}
      className="group relative rounded-3xl overflow-hidden border transition-all duration-300 md:hover:-translate-y-2"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${colors.bronze}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${colors.bronze}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = colors.border;
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Step image (for audit) */}
      {step.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${colors.surface}, transparent)` }}
          />
        </div>
      )}

      <div className="p-8">
        {/* Number */}
        <span
          className="text-6xl font-bold select-none block mb-4"
          style={{ fontFamily: fonts.display, color: `${colors.bronze}20` }}
        >
          {step.number}
        </span>

        {/* Arrow connector (not on last) */}
        {index < steps.length - 1 && (
          <div
            className="hidden md:block absolute top-1/2 -right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.bronze} strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}

        <h3
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {step.title}
        </h3>
        <p
          className="leading-relaxed"
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
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-5"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              Our Process
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            How We Work
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-center text-lg mb-20 max-w-xl mx-auto"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          From audit to launch in four focused steps.
        </motion.p>

        {/* Process accent image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-16 flex justify-center"
        >
          <Image
            src="/media-assets/images/product-3.png"
            alt="Workflow process"
            width={600}
            height={200}
            className="w-full max-w-lg h-auto rounded-2xl opacity-80"
            loading="lazy"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
