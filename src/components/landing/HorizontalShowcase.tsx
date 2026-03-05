'use client';

import { useRef, useEffect, useState } from 'react';
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

function ShowcaseCard({ item }: { item: (typeof showcaseItems)[number] }) {
  return (
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
          sizes="(max-width: 768px) 80vw, 50vw"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: `linear-gradient(to top, ${colors.surface}, transparent)` }}
        />
      </div>
      <div className="p-6 sm:p-8">
        <h3
          className="text-xl sm:text-2xl font-bold mb-2"
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
  );
}

function MobileShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.scrollWidth / showcaseItems.length;
      setActiveIndex(Math.round(scrollLeft / cardWidth));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section style={{ backgroundColor: colors.bg }} className="py-16">
      {/* Header */}
      <div className="px-6 mb-8">
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
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Built for scale. <span style={{ color: colors.bronze }}>Designed to convert.</span>
        </h2>
      </div>

      {/* Swipeable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-6 overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {showcaseItems.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[85vw] max-w-[400px] group"
            style={{ scrollSnapAlign: 'center' }}
          >
            <ShowcaseCard item={item} />
          </div>
        ))}
        {/* End spacer so last card can snap to center */}
        <div className="flex-shrink-0 w-4" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {showcaseItems.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 6,
              backgroundColor: i === activeIndex ? colors.bronze : colors.border,
            }}
          />
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
      className="relative"
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
          className="flex gap-8 px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {showcaseItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[60vw] lg:w-[50vw] max-w-[900px] group"
            >
              <ShowcaseCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function HorizontalShowcase() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile ? <MobileShowcase /> : <DesktopShowcase />;
}
