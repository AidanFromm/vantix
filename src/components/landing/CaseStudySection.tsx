'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Building2, ShieldCheck, CreditCard } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';
import type { LucideIcon } from 'lucide-react';

const ease = animations.easing as unknown as [number, number, number, number];

interface CaseStudy {
  client: string;
  industry: string;
  icon: LucideIcon;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  highlight: string;
}

const caseStudies: CaseStudy[] = [
  {
    client: 'Just4Keepers',
    industry: 'Sports & E-commerce',
    icon: Building2,
    challenge: 'No digital infrastructure — great product, zero online presence or lead capture system.',
    solution: 'Built their entire online ecosystem: website, ad funnels, CRM automations, and e-commerce platform from scratch.',
    results: [
      { label: 'Revenue Generated', value: '$5.8M+' },
      { label: 'Leads Captured', value: '3,300+' },
      { label: 'ROAS', value: '847%' },
      { label: 'Lead Volume', value: '12x' },
    ],
    highlight: '$5.8M+ in revenue generated',
  },
  {
    client: 'Secured Tampa',
    industry: 'Security Services',
    icon: ShieldCheck,
    challenge: 'Outdated website losing credibility with high-value commercial clients in a competitive market.',
    solution: 'Premium website redesign with lead funnel, local SEO strategy, and automated follow-up sequences.',
    results: [
      { label: 'Organic Traffic', value: '+340%' },
      { label: 'Lead Quality', value: '4x' },
      { label: 'Close Rate', value: '+28%' },
      { label: 'Revenue Growth', value: '2.1x' },
    ],
    highlight: '340% organic traffic increase',
  },
  {
    client: 'CardLedger',
    industry: 'SaaS / FinTech',
    icon: CreditCard,
    challenge: 'Early-stage SaaS with no marketing infrastructure or user acquisition strategy.',
    solution: 'Brand identity, landing page, waitlist funnel, and paid acquisition across Meta & Google.',
    results: [
      { label: 'Waitlist Signups', value: '2,400+' },
      { label: 'Cost Per Lead', value: '$1.82' },
      { label: 'Conversion Rate', value: '14.3%' },
      { label: 'Time to Launch', value: '21 days' },
    ],
    highlight: '$1.82 cost per lead',
  },
];

export default function CaseStudySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

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
            Client Results
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: fonts.display, color: colors.text, letterSpacing: '-0.035em' }}
          >
            Real Numbers.
            <br />
            <span style={{ color: colors.bronze }}>Real Growth.</span>
          </h2>
          <p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            We don&apos;t deal in vanity metrics. Here&apos;s what happens when strategy meets execution.
          </p>
        </motion.div>

        {/* Case Study Cards */}
        <div className="space-y-8">
          {caseStudies.map((study, idx) => {
            const Icon = study.icon;
            return (
              <motion.div
                key={study.client}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + idx * 0.15, ease }}
                className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Hover border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ border: `1px solid ${colors.borderAccent}` }}
                />

                <div className="p-8 md:p-10 lg:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
                    {/* Left — Info */}
                    <div className="flex-1">
                      {/* Client header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `${colors.bronze}10`,
                            border: `1px solid ${colors.borderAccent}`,
                          }}
                        >
                          <Icon size={22} strokeWidth={1.5} style={{ color: colors.bronze }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-2xl font-bold tracking-tight"
                              style={{ fontFamily: fonts.display, color: colors.text }}
                            >
                              {study.client}
                            </h3>
                            <ArrowUpRight
                              size={18}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              style={{ color: colors.bronze }}
                            />
                          </div>
                          <span
                            className="text-xs font-medium uppercase tracking-[0.12em]"
                            style={{ color: colors.muted }}
                          >
                            {study.industry}
                          </span>
                        </div>
                      </div>

                      {/* Challenge & Solution */}
                      <div className="space-y-4 mb-8 lg:mb-0">
                        <div>
                          <span
                            className="text-[11px] font-bold uppercase tracking-[0.15em] block mb-1.5"
                            style={{ color: colors.textSecondary }}
                          >
                            Challenge
                          </span>
                          <p
                            className="text-[15px] leading-relaxed"
                            style={{ fontFamily: fonts.body, color: colors.muted }}
                          >
                            {study.challenge}
                          </p>
                        </div>
                        <div>
                          <span
                            className="text-[11px] font-bold uppercase tracking-[0.15em] block mb-1.5"
                            style={{ color: colors.textSecondary }}
                          >
                            Solution
                          </span>
                          <p
                            className="text-[15px] leading-relaxed"
                            style={{ fontFamily: fonts.body, color: colors.muted }}
                          >
                            {study.solution}
                          </p>
                        </div>
                      </div>

                      {/* Highlight badge */}
                      <div
                        className="hidden lg:inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold mt-4"
                        style={{
                          background: `${colors.bronze}12`,
                          border: `1px solid ${colors.borderAccent}`,
                          color: colors.bronze,
                        }}
                      >
                        {study.highlight}
                      </div>
                    </div>

                    {/* Right — Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 lg:gap-5 lg:w-[380px] flex-shrink-0">
                      {study.results.map((r, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-5 text-center transition-all duration-300"
                          style={{
                            backgroundColor: colors.surface,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <div
                            className="text-xl md:text-2xl font-extrabold mb-1"
                            style={{ fontFamily: fonts.display, color: colors.bronze }}
                          >
                            {r.value}
                          </div>
                          <div
                            className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                            style={{ fontFamily: fonts.body, color: colors.muted }}
                          >
                            {r.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
