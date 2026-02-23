'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

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
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className={`group relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} 
        bg-[#EEE6DC] rounded-2xl overflow-hidden border border-transparent
        hover:border-[#B07A45]/30 transition-all duration-300`}
    >
      {/* Bronze accent line */}
      <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-1 h-0 bg-[#B07A45] 
        group-hover:h-full transition-all duration-500 rounded-full hidden lg:block`} />

      {/* Image */}
      <div className="relative w-full lg:w-2/5 h-64 lg:h-auto min-h-[280px] overflow-hidden">
        <Image
          src={study.image}
          alt={study.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
        <h3
          className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-6"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {study.name}
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <span
              className="text-xs uppercase tracking-widest text-[#B07A45] font-semibold"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Challenge
            </span>
            <p className="text-[#4B4B4B] mt-1 leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              {study.challenge}
            </p>
          </div>
          <div>
            <span
              className="text-xs uppercase tracking-widest text-[#B07A45] font-semibold"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Solution
            </span>
            <p className="text-[#4B4B4B] mt-1 leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              {study.solution}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-wrap gap-3">
          {study.results.map((result, i) => (
            <span
              key={i}
              className="text-sm font-medium text-[#B07A45] bg-[#B07A45]/10 px-4 py-2 rounded-full"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
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
    <section id="work" className="bg-[#EEE6DC] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-[#1C1C1C] text-center mb-4"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          Real Results. Real Businesses.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#4B4B4B] text-center text-lg mb-16 max-w-2xl mx-auto"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
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
