'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CaseStudy {
  name: string;
  label: string;
  brief: string;
  stats: string[];
}

const caseStudies: CaseStudy[] = [
  {
    name: 'SecuredTampa',
    label: 'E-Commerce + Inventory Platform',
    brief:
      '"They built our entire platform in 3 weeks. Inventory, POS, shipping — everything." — Dave, Owner',
    stats: ['122 Pages', '3 Weeks', '50+ APIs', 'Clover POS'],
  },
  {
    name: 'Just Four Kicks',
    label: 'B2B Wholesale Platform',
    brief:
      'Migrated from a broken template to a full enterprise wholesale platform serving 200+ retail stores.',
    stats: ['200+ Stores', '80+ Features', 'StockX API', 'Custom Scan'],
  },
];

function StatTicker({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-sm md:text-base font-semibold text-[#B07A45]"
      style={{ fontFamily: 'Clash Display, sans-serif' }}
    >
      {value}
    </motion.span>
  );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-[#EEE6DC] rounded-2xl p-8 border border-[#E3D9CD] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <span
        className="text-xs uppercase tracking-widest text-[#B07A45] font-semibold"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {study.label}
      </span>
      <h3
        className="text-2xl md:text-3xl font-bold text-[#4B3621] mt-3 mb-4"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {study.name}
      </h3>
      <p className="text-[#6B5B4E] leading-relaxed mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
        {study.brief}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E3D9CD]">
        {study.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <StatTicker value={stat} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function CaseStudySection() {
  return (
    <section className="bg-[#EEE6DC] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-3xl md:text-5xl font-bold text-[#4B3621] text-center mb-16"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          Real Results. Real Businesses.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={i} study={study} index={i} />
          ))}
        </div>

        {/* Testimonial strip */}
        <div className="bg-[#F4EFE8] rounded-2xl p-8 md:p-12 text-center relative">
          <span className="text-6xl md:text-8xl text-[#B07A45] opacity-30 absolute top-4 left-8 leading-none select-none"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            &ldquo;
          </span>
          <p
            className="text-xl md:text-2xl text-[#4B3621] font-medium leading-relaxed max-w-3xl mx-auto relative z-10"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            They built our entire platform in 3 weeks. Inventory, POS, shipping — everything.
          </p>
          <p className="text-[#B07A45] mt-4 font-semibold" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            — Dave, Owner of SecuredTampa
          </p>
          <span className="text-6xl md:text-8xl text-[#B07A45] opacity-30 absolute bottom-4 right-8 leading-none select-none"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            &rdquo;
          </span>
        </div>
      </div>
    </section>
  );
}
