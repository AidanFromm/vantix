'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

export default function VideoSplitSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Video side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="w-full lg:w-1/2"
          >
            <div
              className="rounded-2xl sm:rounded-3xl overflow-hidden"
              style={{
                boxShadow: `0 24px 64px ${colors.bronze}12`,
                border: `1px solid ${colors.border}`,
              }}
            >
              <video
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-auto"
              >
                <source src="/media-assets/videos/cinematic-showcase.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="w-full lg:w-1/2"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
              <span
                className="text-[11px] font-semibold tracking-[0.25em] uppercase"
                style={{ fontFamily: fonts.body, color: colors.bronze }}
              >
                Full-Stack Intelligence
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold mb-6 tracking-tight leading-[1.1]"
              style={{ fontFamily: fonts.display, color: colors.text }}
            >
              One system. Every screen.{' '}
              <span style={{ color: colors.bronze }}>Every metric. Every decision.</span>
            </h2>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ fontFamily: fonts.body, color: colors.muted }}
            >
              We build unified platforms that connect your sales, operations, and analytics into a single source of truth. No more toggling between twelve tabs.
            </p>
            <div className="flex flex-col gap-4">
              {['Real-time data from every channel', 'AI-powered recommendations', 'Custom dashboards per team role'].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors.bronze }}
                  />
                  <span
                    className="text-base"
                    style={{ fontFamily: fonts.body, color: colors.textSecondary }}
                  >
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
