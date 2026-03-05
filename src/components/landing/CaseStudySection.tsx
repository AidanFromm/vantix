'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

interface CaseStudy {
  name: string;
  image: string;
  challenge: string;
  solution: string;
  results: string[];
}

const caseStudies: CaseStudy[] = [
  {
    name: 'Secured Tampa',
    image: '/redesign/case-study-tampa.webp',
    challenge:
      'Manual inventory tracking across sneakers and Pokémon cards. No online presence, all sales through Instagram DMs.',
    solution:
      'Full e-commerce platform with barcode scanning, automated inventory, and integrated payment processing.',
    results: [
      '60% reduction in inventory time',
      '3x online sales in 90 days',
      '45 min/day saved on operations',
    ],
  },
  {
    name: 'Just Four Kicks',
    image: '/redesign/case-study-sneakers.webp',
    challenge:
      'Running on spreadsheets and manual coordination across 200+ retail stores.',
    solution:
      'Custom wholesale platform with tiered pricing, automated invoicing, and real-time inventory sync.',
    results: [
      '80% less time on order management',
      '12% improvement in margin tracking',
      '200+ stores onboarded digitally',
    ],
  },
  {
    name: 'CardLedger',
    image: '/redesign/case-study-cards.webp',
    challenge:
      'No good tool existed for tracking collectible card portfolios across Pokémon, sports cards, and TCGs.',
    solution:
      'Built a full portfolio tracker with real-time pricing, analytics, grading ROI calculator, and eBay integration.',
    results: [
      '500+ beta signups in first week',
      '4.8/5 user satisfaction',
      'Multi-platform launch ready',
    ],
  },
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className={`group relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}
        rounded-3xl overflow-hidden border transition-all duration-300`}
      style={{
        backgroundColor: colors.bg,
        borderColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${colors.bronze}30`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
      }}
    >
      {/* Bronze accent */}
      <div
        className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-1 h-0 group-hover:h-full transition-all duration-500 rounded-full hidden lg:block`}
        style={{ backgroundColor: colors.bronze }}
      />

      {/* Image */}
      <div className="relative w-full lg:w-2/5 h-64 lg:h-auto min-h-[300px] overflow-hidden">
        <Image
          src={study.image}
          alt={study.name}
          fill
          className="object-cover md:group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        <h3
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {study.name}
        </h3>

        <div className="space-y-5 mb-8">
          <div>
            <span
              className="text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              Challenge
            </span>
            <p className="mt-2 leading-relaxed" style={{ fontFamily: fonts.body, color: colors.textSecondary }}>
              {study.challenge}
            </p>
          </div>
          <div>
            <span
              className="text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              Solution
            </span>
            <p className="mt-2 leading-relaxed" style={{ fontFamily: fonts.body, color: colors.textSecondary }}>
              {study.solution}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {study.results.map((result, i) => (
            <span
              key={i}
              className="text-sm font-medium px-4 py-2.5 rounded-full"
              style={{
                fontFamily: fonts.body,
                color: colors.bronze,
                backgroundColor: `${colors.bronze}10`,
                border: `1px solid ${colors.bronze}20`,
              }}
            >
              {result}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudySection() {
  return (
    <section id="work" className="py-24 md:py-36" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-5"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              Case Studies
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Real Results. Real Businesses.
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-center text-lg mb-16 max-w-2xl mx-auto"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          See how we&apos;ve transformed operations for businesses like yours.
        </motion.p>

        <div className="space-y-6">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={i} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
