'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const benefits = [
  'Full audit of your current digital infrastructure',
  'Custom growth roadmap with actionable next steps',
  'ROI projections based on your industry data',
  'No obligation — just clarity on your next move',
];

export default function BookingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="booking" className="py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16 md:mb-20"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
            style={{ fontFamily: fonts.body, color: colors.bronze }}
          >
            Let&apos;s Talk
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: fonts.display, color: colors.text, letterSpacing: '-0.035em' }}
          >
            Ready to Build Something
            <br />
            <span style={{ color: colors.bronze }}>Extraordinary?</span>
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Book a free strategy call. We&apos;ll audit your current setup and show you exactly where the growth is.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left — Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <div
              className="rounded-2xl p-8 md:p-10"
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${colors.bronze}10`, border: `1px solid ${colors.borderAccent}` }}
                >
                  <Calendar size={18} strokeWidth={1.5} style={{ color: colors.bronze }} />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold tracking-tight"
                    style={{ fontFamily: fonts.display, color: colors.text }}
                  >
                    Free Strategy Call
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock size={12} style={{ color: colors.muted }} />
                    <span className="text-xs" style={{ color: colors.muted }}>30 minutes</span>
                  </div>
                </div>
              </div>

              <h4
                className="text-sm font-semibold uppercase tracking-[0.12em] mb-5"
                style={{ color: colors.textSecondary }}
              >
                What you&apos;ll get
              </h4>

              <ul className="space-y-4 mb-8">
                {benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={16}
                      strokeWidth={2}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: colors.positive }}
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: fonts.body, color: colors.text }}
                    >
                      {b}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <a
                href="#booking"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
                style={{ color: colors.bronze }}
              >
                Book now
                <ArrowRight size={14} strokeWidth={2} />
              </a>
            </div>
          </motion.div>

          {/* Right — Calendly embed */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
              minHeight: '650px',
            }}
          >
            <iframe
              src="https://calendly.com/usevantix/30min"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a call with Vantix"
              className="w-full"
              style={{ minHeight: '650px' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
