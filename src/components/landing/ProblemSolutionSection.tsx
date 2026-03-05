'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const beforeItems = [
  { text: 'Manual processes eating your day' },
  { text: 'Lost leads slipping through cracks' },
  { text: 'Scattered data across 10 tools' },
  { text: 'Firefighting instead of growing' },
];

const afterItems = [
  { text: 'Automated workflows running 24/7' },
  { text: 'Every lead captured and nurtured' },
  { text: 'One dashboard for everything' },
  { text: 'Scaling with systems, not stress' },
];

export default function ProblemSolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const imageRef = useRef(null);
  const imageInView = useInView(imageRef, { once: true, amount: 0.2 });

  return (
    <section id="problem" className="py-24 sm:py-36" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
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
              The Transformation
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            From chaos to infrastructure.
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            See the difference when your business runs on systems instead of scrambling.
          </p>
        </motion.div>

        {/* Hero transformation image */}
        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={imageInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease }}
          className="relative mb-20 rounded-3xl overflow-hidden"
          style={{
            border: `1px solid ${colors.border}`,
            boxShadow: `0 24px 64px ${colors.bronze}10`,
          }}
        >
          <Image
            src="/media-assets/images/product-12.png"
            alt="Before and after Vantix transformation"
            width={1400}
            height={700}
            className="w-full h-auto"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </motion.div>

        {/* Before / After columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="rounded-3xl p-8 sm:p-10"
            style={{
              backgroundColor: colors.dark,
              border: `1px solid #222`,
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <span
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ fontFamily: fonts.body, color: '#ef4444' }}
              >
                Before Vantix
              </span>
            </div>
            <h3
              className="text-2xl sm:text-3xl font-bold mb-8"
              style={{ fontFamily: fonts.display, color: colors.bg }}
            >
              Running your business on duct tape.
            </h3>
            <div className="space-y-5">
              {beforeItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="flex items-start gap-4"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0 mt-2" />
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: fonts.body, color: colors.muted }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="rounded-3xl p-8 sm:p-10"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.bronze }} />
              <span
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ fontFamily: fonts.body, color: colors.bronze }}
              >
                After Vantix
              </span>
            </div>
            <h3
              className="text-2xl sm:text-3xl font-bold mb-8"
              style={{ fontFamily: fonts.display, color: colors.text }}
            >
              Running your business on infrastructure.
            </h3>
            <div className="space-y-5">
              {afterItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease }}
                  className="flex items-start gap-4"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: colors.bronze }} />
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: fonts.body, color: colors.textSecondary }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
