'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Code2, Megaphone, Palette, TrendingUp, ArrowRight } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';
import type { LucideIcon } from 'lucide-react';

const ease = animations.easing as unknown as [number, number, number, number];

interface Service {
  title: string;
  desc: string;
  icon: LucideIcon;
  featured?: boolean;
  tag?: string;
}

const services: Service[] = [
  {
    title: 'AI Automation',
    desc: 'Custom AI agents and workflows that eliminate repetitive tasks, accelerate decision-making, and unlock operational intelligence across your entire business. From lead qualification to data processing — we automate the work that slows you down.',
    icon: Bot,
    featured: true,
    tag: 'Most Popular',
  },
  {
    title: 'Web Development',
    desc: 'High-performance websites and applications built for conversion and scale. Every pixel designed to move visitors toward action.',
    icon: Code2,
  },
  {
    title: 'Paid Advertising',
    desc: 'Data-driven campaigns across Meta, Google, and TikTok that deliver measurable ROI — not vanity metrics.',
    icon: Megaphone,
  },
  {
    title: 'Brand & Creative',
    desc: 'Premium brand identities and creative assets that command attention, build trust, and differentiate.',
    icon: Palette,
  },
  {
    title: 'SEO & Growth',
    desc: 'Organic strategies that compound over time — turning search into your most reliable revenue channel.',
    icon: TrendingUp,
  },
];

export default function ServicesBentoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const featured = services[0];
  const rest = services.slice(1);
  const FeaturedIcon = featured.icon;

  return (
    <section ref={ref} className="py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
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
            What We Do
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: fonts.display, color: colors.text, letterSpacing: '-0.035em' }}
          >
            Services Built
            <br />
            <span style={{ color: colors.bronze }}>for Growth</span>
          </h2>
          <p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Every service is designed to compound — so your business doesn&apos;t just grow, it accelerates.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured card — spans 2 rows on lg */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="group relative md:col-span-2 lg:col-span-1 lg:row-span-2 rounded-2xl p-10 md:p-12 overflow-hidden transition-all duration-500 hover:-translate-y-1"
            style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.borderAccent}`,
              boxShadow: '0 0 60px rgba(184,147,90,0.06), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Bronze gradient border glow on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                boxShadow: '0 0 80px rgba(184,147,90,0.15), inset 0 1px 0 rgba(184,147,90,0.2)',
              }}
            />

            {/* Gradient accent top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.bronze}, transparent)`,
              }}
            />

            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, ${colors.bronze}10, transparent 70%)`,
              }}
            />

            <div className="relative z-10 flex flex-col h-full min-h-[320px] lg:min-h-0">
              {/* Tag */}
              {featured.tag && (
                <div
                  className="inline-flex self-start items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${colors.bronze}20, ${colors.copper}15)`,
                    border: `1px solid ${colors.borderAccent}`,
                    color: colors.bronze,
                  }}
                >
                  {featured.tag}
                </div>
              )}

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10"
                style={{
                  background: `linear-gradient(135deg, ${colors.bronze}15, ${colors.copper}08)`,
                  border: `1px solid ${colors.borderAccent}`,
                }}
              >
                <FeaturedIcon
                  size={30}
                  strokeWidth={1.5}
                  style={{ color: colors.bronze }}
                />
              </div>

              <h3
                className="text-2xl md:text-3xl font-bold mb-5 tracking-tight"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                {featured.title}
              </h3>
              <p
                className="text-base md:text-[17px] leading-[1.7] flex-1"
                style={{ fontFamily: fonts.body, color: colors.muted }}
              >
                {featured.desc}
              </p>

              <div className="mt-10 flex items-center gap-2 group/link cursor-pointer">
                <span
                  className="text-sm font-semibold transition-colors duration-300 group-hover/link:text-[#D4B87A]"
                  style={{ color: colors.bronze }}
                >
                  Learn more
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                  style={{ color: colors.bronze }}
                />
              </div>
            </div>
          </motion.div>

          {/* Smaller cards */}
          {rest.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease }}
                className="group relative rounded-2xl p-8 md:p-9 overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `1px solid ${colors.borderAccent}`,
                    boxShadow: '0 0 40px rgba(184,147,90,0.08)',
                  }}
                />

                {/* Corner glow on hover */}
                <div
                  className="absolute top-0 left-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top left, ${colors.bronze}08, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500"
                    style={{
                      background: `${colors.bronze}08`,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="transition-colors duration-500 group-hover:text-[#B8935A]"
                      style={{ color: colors.muted }}
                    />
                  </div>

                  <h3
                    className="text-xl font-bold mb-3 tracking-tight"
                    style={{ fontFamily: fonts.display, color: colors.text }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm leading-[1.7]"
                    style={{ fontFamily: fonts.body, color: colors.muted }}
                  >
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
