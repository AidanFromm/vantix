'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

interface CaseStudy {
  name: string;
  image: string;
  metric: string;
  description: string;
  href: string;
}

const caseStudies: CaseStudy[] = [
  {
    name: 'Just Four Kicks',
    image: '/media-assets/images/product-4.png',
    metric: '$5.8M revenue managed',
    description: '200+ stores served. 80+ features built. Custom wholesale platform with tiered pricing, automated invoicing, and real-time inventory sync.',
    href: '/case-studies/just-four-kicks',
  },
  {
    name: 'Secured Tampa',
    image: '/media-assets/images/client-results.png',
    metric: 'Full platform in 3 weeks',
    description: '$4,500 build. Complete e-commerce platform with barcode scanning, automated inventory, and integrated payment processing.',
    href: '/case-studies/secured-tampa',
  },
  {
    name: 'Horizon Asphalt',
    image: '/media-assets/images/hero-bg.jpg',
    metric: 'Lead gen + Google Workspace',
    description: 'Commercial property focus. Professional lead generation site with integrated Google Workspace for team communication.',
    href: '#',
  },
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease }}
      className="group flex-shrink-0 w-[85vw] sm:w-[380px] lg:w-auto lg:flex-1 rounded-3xl overflow-hidden border transition-all duration-300 md:hover:-translate-y-2"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${colors.bronze}30`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${colors.bronze}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = colors.border;
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <Image
          src={study.image}
          alt={study.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 380px, 33vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${colors.bg}, transparent 60%)` }}
        />
      </div>

      {/* Content */}
      <div className="p-7 sm:p-8 -mt-8 relative z-10">
        <h3
          className="text-xl sm:text-2xl font-bold mb-2"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {study.name}
        </h3>
        <div
          className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          style={{
            fontFamily: fonts.body,
            color: colors.bronze,
            backgroundColor: `${colors.bronze}10`,
            border: `1px solid ${colors.bronze}20`,
          }}
        >
          {study.metric}
        </div>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          {study.description}
        </p>
        <Link
          href={study.href}
          className="text-sm font-semibold transition-colors duration-200 group/link flex items-center gap-1"
          style={{ fontFamily: fonts.body, color: colors.bronze }}
        >
          View Case Study
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover/link:translate-x-1 transition-transform duration-200">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
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
            <span
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
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

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={i} study={study} index={i} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
