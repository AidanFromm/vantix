'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const caseStudies = [
  {
    name: 'Just Four Kicks',
    logo: '/logos/j4k.jpg',
    image: '/media-assets/images/product-4.png',
    metric: '$5.8M Revenue Managed',
    stat2: '200+ Stores',
    stat3: '80+ Features',
    description: 'Custom wholesale platform with tiered pricing, automated invoicing, and real-time inventory sync across 200+ retail locations.',
    href: '/case-studies/just-four-kicks',
  },
  {
    name: 'Secured Tampa',
    logo: '/logos/secured-tampa-logo.png',
    image: '/media-assets/images/secured-tampa-og.png',
    metric: 'Full Platform in 3 Weeks',
    stat2: '$4,500 Build',
    stat3: 'E-Commerce',
    description: 'Complete e-commerce platform with barcode scanning, automated inventory management, and integrated payment processing.',
    href: '/case-studies/secured-tampa',
  },
  {
    name: 'Horizon Asphalt',
    logo: '/logos/horizon.png',
    image: '/media-assets/images/horizon-hero.jpg',
    metric: 'Commercial Lead Gen',
    stat2: 'Google Workspace',
    stat3: 'NJ Coverage',
    description: 'Professional lead generation site with integrated email infrastructure for commercial property managers across New Jersey.',
    href: '#',
  },
];

function CaseStudyCard({ study, index }: { study: typeof caseStudies[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease }}
      className={`flex flex-col lg:flex-row items-stretch gap-0 rounded-3xl overflow-hidden border ${isEven ? '' : 'lg:flex-row-reverse'}`}
      style={{ backgroundColor: colors.darkSurface, borderColor: '#2a2a2a' }}
    >
      {/* Image */}
      <div className="relative w-full lg:w-1/2 min-h-[280px] sm:min-h-[360px] overflow-hidden group">
        <Image
          src={study.image}
          alt={study.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: `linear-gradient(to top, ${colors.darkSurface}, transparent 40%)` }}
        />
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
        {/* Client logo */}
        {study.logo && (
          <div className="mb-5">
            <Image
              src={study.logo}
              alt={`${study.name} logo`}
              width={48}
              height={48}
              className="rounded-full object-cover"
              style={{ border: `1px solid ${colors.bronze}30` }}
            />
          </div>
        )}
        <h3
          className="text-2xl sm:text-3xl font-bold mb-4"
          style={{ fontFamily: fonts.display, color: '#fff' }}
        >
          {study.name}
        </h3>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[study.metric, study.stat2, study.stat3].map((stat, j) => (
            <span
              key={j}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                fontFamily: fonts.body,
                color: colors.bronze,
                backgroundColor: `${colors.bronze}12`,
                border: `1px solid ${colors.bronze}20`,
              }}
            >
              {stat}
            </span>
          ))}
        </div>

        <p
          className="text-base sm:text-lg leading-relaxed mb-8"
          style={{ fontFamily: fonts.body, color: colors.muted }}
        >
          {study.description}
        </p>

        <Link
          href={study.href}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group/link"
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section id="work" className="py-24 md:py-36 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Subtle bronze glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{ background: `radial-gradient(ellipse, ${colors.bronze}, transparent)` }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
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
            style={{ fontFamily: fonts.display, color: '#fff' }}
          >
            Real Results. <span style={{ color: colors.bronze }}>Real Businesses.</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            See how we&apos;ve transformed operations for businesses like yours.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={i} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
