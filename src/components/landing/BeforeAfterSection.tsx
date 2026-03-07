'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check, ArrowRight, TrendingUp, Clock, Users, Zap } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';
import type { LucideIcon } from 'lucide-react';

const ease = animations.easing as unknown as [number, number, number, number];

const beforeItems = [
  'Generic template website that looks like everyone else',
  'Manual lead follow-up — hours wasted daily',
  'Inconsistent branding across every touchpoint',
  'No data-driven decisions — just guessing',
  'Scattered tools that don\'t talk to each other',
];

const afterItems = [
  'Custom high-converting platform built for your market',
  'AI-powered instant response — 24/7 lead engagement',
  'Premium cohesive brand identity that commands trust',
  'Real-time analytics dashboard with actionable insights',
  'Unified tech stack with seamless automations',
];

interface Metric {
  icon: LucideIcon;
  label: string;
  value: string;
  desc: string;
}

const metrics: Metric[] = [
  { icon: TrendingUp, label: 'Conversion Rate', value: '2x', desc: 'Average increase' },
  { icon: Users, label: 'More Leads', value: '300%', desc: 'Lead volume growth' },
  { icon: Clock, label: 'Time Saved', value: '40hrs', desc: 'Per week automated' },
  { icon: Zap, label: 'Faster Response', value: '<2min', desc: 'Average lead response' },
];

export default function BeforeAfterSection() {
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
            The Transformation
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: fonts.display, color: colors.text, letterSpacing: '-0.035em' }}
          >
            Before vs. After
            <br />
            <span style={{ color: colors.bronze }}>Vantix</span>
          </h2>
          <p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            The difference between where you are and where you could be.
          </p>
        </motion.div>

        {/* Before / After Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="rounded-2xl p-8 md:p-10 lg:p-12 relative overflow-hidden"
            style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* Red tint top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${colors.negative}40, transparent)` }}
            />

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-10"
              style={{ background: `${colors.negative}12`, color: colors.negative, border: `1px solid ${colors.negative}20` }}
            >
              <X size={12} strokeWidth={3} />
              Before Vantix
            </div>

            <ul className="space-y-6">
              {beforeItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${colors.negative}12` }}
                  >
                    <X size={12} strokeWidth={3} style={{ color: colors.negative }} />
                  </div>
                  <span
                    className="text-[15px] leading-relaxed"
                    style={{ fontFamily: fonts.body, color: colors.muted }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="rounded-2xl p-8 md:p-10 lg:p-12 relative overflow-hidden"
            style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.borderAccent}`,
              boxShadow: `0 0 60px ${colors.bronze}08, 0 8px 32px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Bronze tint top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${colors.bronze}, transparent)` }}
            />

            {/* Corner glow */}
            <div
              className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle at top right, ${colors.bronze}08, transparent 70%)` }}
            />

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-10"
              style={{ background: `${colors.bronze}15`, color: colors.bronze, border: `1px solid ${colors.borderAccent}` }}
            >
              <Check size={12} strokeWidth={3} />
              After Vantix
            </div>

            <ul className="space-y-6">
              {afterItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.08, ease }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${colors.positive}12` }}
                  >
                    <Check size={12} strokeWidth={3} style={{ color: colors.positive }} />
                  </div>
                  <span
                    className="text-[15px] leading-relaxed"
                    style={{ fontFamily: fonts.body, color: colors.text }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Transformation Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.1, ease }}
                className="rounded-2xl p-6 md:p-8 text-center group transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${colors.bronze}10` }}
                >
                  <Icon size={18} strokeWidth={1.5} style={{ color: colors.bronze }} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ArrowRight size={14} style={{ color: colors.bronze }} />
                  <span
                    className="text-2xl md:text-3xl font-extrabold"
                    style={{ fontFamily: fonts.display, color: colors.bronze }}
                  >
                    {m.value}
                  </span>
                </div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ fontFamily: fonts.body, color: colors.text }}
                >
                  {m.label}
                </div>
                <div
                  className="text-xs"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {m.desc}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
