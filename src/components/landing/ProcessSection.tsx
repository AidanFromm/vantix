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

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="process" className="py-24 md:py-36 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Background glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-8"
        style={{ background: `radial-gradient(ellipse, ${colors.bronze}15, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
              className="group rounded-3xl overflow-hidden border transition-all duration-300 md:hover:-translate-y-2"
              style={{
                backgroundColor: colors.darkSurface,
                borderColor: '#2a2a2a',
              }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
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
                  style={{ background: `linear-gradient(to top, ${colors.darkSurface}, transparent 60%)` }}
                />
                {/* Step number overlay */}
                <span
                  className="absolute top-4 left-5 text-5xl font-bold select-none"
                  style={{ fontFamily: fonts.display, color: `${colors.bronze}30` }}
                >
                  {step.number}
                </span>
              </div>

              <div className="p-6 sm:p-7">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: fonts.display, color: '#fff' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
