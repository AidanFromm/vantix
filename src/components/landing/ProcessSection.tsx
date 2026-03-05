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
    image: '/media-assets/images/product-3.png',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Our team builds your systems in focused sprints. You see progress weekly, not quarterly.',
    image: '/media-assets/images/product-2.png',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'We deploy to production with monitoring, testing, and zero downtime. Then optimize continuously.',
    image: '/media-assets/images/product-5.png',
  },
];

function TimelineStep({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease }}
      className={`relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}
    >
      {/* Image card */}
      <div className="w-full lg:w-[45%]">
        <div
          className="rounded-2xl sm:rounded-3xl overflow-hidden border group"
          style={{ borderColor: '#2a2a2a', backgroundColor: colors.darkSurface }}
        >
          <div className="relative h-52 sm:h-64 overflow-hidden">
            <Image
              src={step.image}
              alt={step.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${colors.darkSurface}, transparent 60%)` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline node (desktop only) */}
      <div className="hidden lg:flex flex-col items-center z-10">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            backgroundColor: colors.bronze,
            color: '#fff',
            fontFamily: fonts.display,
            boxShadow: `0 0 24px ${colors.bronze}40`,
          }}
        >
          {step.number}
        </div>
      </div>

      {/* Text content */}
      <div className="w-full lg:w-[45%]">
        {/* Mobile step number */}
        <div className="lg:hidden flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: colors.bronze, color: '#fff', fontFamily: fonts.display }}
          >
            {step.number}
          </div>
          <div className="h-px flex-1" style={{ backgroundColor: '#2a2a2a' }} />
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ fontFamily: fonts.display, color: '#fff' }}
        >
          {step.title}
        </h3>
        <p
          className="text-base sm:text-lg leading-relaxed"
          style={{ fontFamily: fonts.body, color: colors.muted }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="process" className="py-16 sm:py-24 md:py-36 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Background glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(ellipse, ${colors.bronze}10, transparent)` }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12 sm:mb-20"
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
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: '#fff' }}
          >
            Four steps. <span style={{ color: colors.bronze }}>Zero guesswork.</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            From audit to launch — clear milestones, real progress, no surprises.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop only) */}
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]"
            style={{ backgroundColor: `${colors.bronze}30` }}
          />
          <div className="flex flex-col gap-16 lg:gap-24">
            {steps.map((step, i) => (
              <TimelineStep key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
