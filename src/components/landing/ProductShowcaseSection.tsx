'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const showcaseItems = [
  {
    src: '/media-assets/images/product-10.png',
    alt: 'Multi-device ecosystem',
    label: 'Every Device',
  },
  {
    src: '/media-assets/images/product-11.png',
    alt: 'Product suite overview',
    label: 'Full Suite',
  },
  {
    src: '/media-assets/images/workspace.png',
    alt: 'Analytics workspace',
    label: 'Command Center',
  },
];

export default function ProductShowcaseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="relative py-24 md:py-36 overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Background video */}
      <div className="absolute inset-0 z-0 opacity-20">
        <video
          src="/media-assets/videos/cinematic-showcase.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(to bottom, ${colors.dark} 0%, transparent 30%, transparent 70%, ${colors.dark} 100%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: `${colors.bronze}60` }} />
            <span
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              Product Ecosystem
            </span>
            <span className="h-px w-8" style={{ backgroundColor: `${colors.bronze}60` }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-5"
            style={{ fontFamily: fonts.display, color: colors.bg }}
          >
            One system.{' '}
            <span style={{ color: colors.bronze }}>Every screen.</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Your business, orchestrated across every device and touchpoint.
          </p>
        </motion.div>

        {/* Showcase cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease }}
              className="group relative rounded-3xl overflow-hidden"
              style={{
                border: `1px solid ${colors.bronze}20`,
                backgroundColor: `${colors.darkSurface}80`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${colors.dark}90, transparent)` }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="text-xs font-semibold tracking-[0.2em] uppercase"
                  style={{ fontFamily: fonts.body, color: colors.bronze }}
                >
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
