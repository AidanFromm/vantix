'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Star, Award, Shield, Zap } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';
import type { LucideIcon } from 'lucide-react';

const ease = animations.easing as unknown as [number, number, number, number];

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  metric: string;
}

const testimonials: Testimonial[] = [
  {
    quote: 'Vantix completely transformed our digital presence. The ROI from their work paid for itself within the first month. They don\'t just build websites — they build revenue machines.',
    name: 'Marcus D.',
    role: 'Founder & CEO',
    company: 'Just4Keepers',
    metric: '847% ROAS',
  },
  {
    quote: 'We went from zero online presence to dominating our local market. The automation alone saves us 30+ hours a week. Best investment we\'ve made.',
    name: 'James R.',
    role: 'Owner',
    company: 'Secured Tampa',
    metric: '340% Traffic Growth',
  },
  {
    quote: 'From concept to a live product with 2,400+ waitlist signups in 21 days. Vantix moves faster than any agency I\'ve worked with — and delivers better results.',
    name: 'Alex T.',
    role: 'Co-Founder',
    company: 'CardLedger',
    metric: '$1.82 CPL',
  },
];

interface TrustItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

const trustItems: TrustItem[] = [
  { icon: Award, label: 'Businesses Scaled', value: '50+' },
  { icon: Shield, label: 'Client Retention', value: '98%' },
  { icon: Zap, label: 'Avg. ROAS', value: '6.2x' },
];

export default function VideoTrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-28 md:py-40" style={{ backgroundColor: colors.bgElevated }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-20 md:mb-24"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
            style={{ fontFamily: fonts.body, color: colors.bronze }}
          >
            Trusted By Leaders
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: fonts.display, color: colors.text, letterSpacing: '-0.035em' }}
          >
            Results That
            <br />
            <span style={{ color: colors.bronze }}>Speak</span>
          </h2>
          <p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            We don&apos;t just promise growth — we prove it. Every engagement is measured, tracked, and optimized.
          </p>
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 md:mb-20"
        >
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
                className="rounded-2xl p-8 md:p-10 text-center group transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: `${colors.bronze}10`,
                    border: `1px solid ${colors.borderAccent}`,
                  }}
                >
                  <Icon size={22} strokeWidth={1.5} style={{ color: colors.bronze }} />
                </div>
                <div
                  className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight"
                  style={{ fontFamily: fonts.display, color: colors.bronze }}
                >
                  {item.value}
                </div>
                <div
                  className="text-sm font-medium uppercase tracking-[0.15em]"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease }}
              className="group rounded-2xl p-8 md:p-10 relative overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1"
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {/* Hover accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${colors.bronze}, transparent)` }}
              />

              {/* Quote icon */}
              <Quote
                size={24}
                strokeWidth={1}
                className="mb-6 opacity-30"
                style={{ color: colors.bronze }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={14} fill={colors.bronze} strokeWidth={0} style={{ color: colors.bronze }} />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-[15px] leading-[1.75] flex-1 mb-8"
                style={{ fontFamily: fonts.body, color: colors.text }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ fontFamily: fonts.display, color: colors.text }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ fontFamily: fonts.body, color: colors.muted }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
                <div
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{
                    background: `${colors.bronze}12`,
                    border: `1px solid ${colors.borderAccent}`,
                    color: colors.bronze,
                  }}
                >
                  {t.metric}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
