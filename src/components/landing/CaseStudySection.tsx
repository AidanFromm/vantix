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
    image: '/media-assets/images/product-4.png',
    metric: '$5.8M Revenue Managed',
    stat2: '200+ Stores',
    stat3: '80+ Features',
    description: 'Custom wholesale platform with tiered pricing, automated invoicing, and real-time inventory sync.',
    href: '/case-studies/just-four-kicks',
  },
  {
    name: 'Secured Tampa',
    image: '/media-assets/images/client-results.png',
    metric: 'Full Platform in 3 Weeks',
    stat2: '$4,500 Build',
    stat3: 'E-Commerce',
    description: 'Complete e-commerce with barcode scanning, automated inventory, and integrated payments.',
    href: '/case-studies/secured-tampa',
  },
  {
    name: 'Horizon Asphalt',
    image: '/media-assets/images/hero-bg.jpg',
    metric: 'Commercial Lead Gen',
    stat2: 'Google Workspace',
    stat3: 'NJ Coverage',
    description: 'Professional lead generation site with integrated email infrastructure for commercial property managers.',
    href: '#',
  },
];

export default function CaseStudySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="work" className="py-24 md:py-36 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Subtle bronze glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{ background: `radial-gradient(ellipse, ${colors.bronze}, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
            style={{ fontFamily: fonts.display, color: '#fff' }}
          >
            Real Results. <span style={{ color: colors.bronze }}>Real Businesses.</span>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-center text-lg mb-16 max-w-2xl mx-auto"
          style={{ fontFamily: fonts.body, color: colors.muted }}
        >
          See how we&apos;ve transformed operations for businesses like yours.
        </motion.p>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
          {caseStudies.map((study, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease }}
              className="group flex-shrink-0 w-[85vw] sm:w-[380px] lg:w-auto lg:flex-1 snap-center rounded-3xl overflow-hidden border transition-all duration-300 md:hover:-translate-y-2"
              style={{
                backgroundColor: colors.darkSurface,
                borderColor: '#2a2a2a',
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
                  style={{ background: `linear-gradient(to top, ${colors.darkSurface}, transparent 50%)` }}
                />
              </div>

              {/* Content */}
              <div className="p-7 sm:p-8 -mt-6 relative z-10">
                <h3
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ fontFamily: fonts.display, color: '#fff' }}
                >
                  {study.name}
                </h3>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[study.metric, study.stat2, study.stat3].map((stat, j) => (
                    <span
                      key={j}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full"
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
                  className="text-sm leading-relaxed mb-6"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
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
