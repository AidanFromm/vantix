'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

export default function FinalCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="py-32 md:py-44 relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${colors.bronze}06 0%, transparent 60%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-96 max-w-[80%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.bronze}40, transparent)`,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] mb-10"
            style={{
              background: `${colors.bronze}10`,
              border: `1px solid ${colors.borderAccent}`,
              color: colors.bronze,
            }}
          >
            <Sparkles size={14} strokeWidth={2} />
            Don&apos;t wait
          </motion.div>

          {/* Headline */}
          <h2
            className="text-4xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.05] mb-8"
            style={{
              fontFamily: fonts.display,
              color: colors.text,
              letterSpacing: '-0.04em',
            }}
          >
            Stop Leaving
            <br />
            Revenue{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              on the Table
            </span>
          </h2>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Your competitors are already investing in AI, automation, and premium digital infrastructure.
            The question isn&apos;t <em>if</em> — it&apos;s <em>when</em>.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 px-10 md:px-14 py-5 rounded-full text-lg font-bold transition-all duration-500 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.bronze}, ${colors.copper})`,
                color: colors.bg,
                boxShadow: `0 8px 40px ${colors.bronze}35, 0 2px 8px rgba(0,0,0,0.3)`,
                fontFamily: fonts.display,
              }}
            >
              Book Your Free Strategy Call
              <ArrowRight
                size={20}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          {/* Subtext under CTA */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="mt-6 text-sm"
            style={{ color: colors.textMuted }}
          >
            No obligation. No pitch deck. Just a conversation about growth.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
