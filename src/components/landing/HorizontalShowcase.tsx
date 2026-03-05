'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts } from '@/lib/design-tokens';

const showcaseItems = [
  {
    image: '/media-assets/images/product-2.png',
    title: 'AI Dashboards',
    description: 'Real-time analytics that surface the metrics that matter.',
  },
  {
    image: '/media-assets/images/product-4.png',
    title: 'E-Commerce Platforms',
    description: 'Custom storefronts engineered for conversion and scale.',
  },
  {
    image: '/media-assets/images/product-5.png',
    title: 'CRM & Pipeline',
    description: 'Track every lead from first touch to closed deal.',
  },
  {
    image: '/media-assets/images/product-10.png',
    title: 'Multi-Device Ecosystem',
    description: 'Seamless experiences across every screen and device.',
  },
  {
    image: '/media-assets/images/workspace.png',
    title: 'Workspace Intelligence',
    description: 'Your entire operation visible from a single command center.',
  },
];

function MobileShowcase() {
  return (
    <section className="py-16 sm:py-24 overflow-hidden lg:hidden" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          <span
            className="text-[11px] font-semibold tracking-[0.25em] uppercase"
            style={{ fontFamily: fonts.body, color: colors.bronze }}
          >
            What We Build
          </span>
          <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
        </div>
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Built for scale. <span style={{ color: colors.bronze }}>Designed to convert.</span>
        </h2>
      </div>

      {/* Horizontal snap-scroll on mobile */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-6 pb-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {showcaseItems.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[85vw] sm:w-[70vw] snap-center"
          >
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="85vw"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-24"
                  style={{ background: `linear-gradient(to top, ${colors.surface}, transparent)` }}
                />
              </div>
              <div className="p-5">
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(showcaseItems.length - 1) * 75}%`]);

  return (
    <section
      ref={containerRef}
      className="relative hidden lg:block"
      style={{
        height: `${showcaseItems.length * 100}vh`,
        backgroundColor: colors.bg,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              What We Build
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-5xl font-bold tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Built for scale. <span style={{ color: colors.bronze }}>Designed to convert.</span>
          </h2>
        </div>

        {/* Horizontal scroll track */}
        <motion.div
          style={{ x }}
          className="flex gap-8 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {showcaseItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[50vw] max-w-[900px] group"
            >
              <div
                className="relative rounded-3xl overflow-hidden border transition-all duration-500 group-hover:shadow-2xl"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                    sizes="50vw"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-24"
                    style={{ background: `linear-gradient(to top, ${colors.surface}, transparent)` }}
                  />
                </div>
                <div className="p-8">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: fonts.display, color: colors.text }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: fonts.body, color: colors.muted }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function HorizontalShowcase() {
  return (
    <>
      <MobileShowcase />
      <DesktopShowcase />
    </>
  );
}
