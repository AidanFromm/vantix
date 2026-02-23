'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

/* ── Mockup data ── */
const columnA = [
  { src: '/vantix-mockups/mockup-1-dashboard.png', label: 'AI Dashboard' },
  { src: '/vantix-mockups/mockup-2-chatbot.png', label: 'Smart Chatbot' },
  { src: '/vantix-mockups/mockup-3-website.png', label: 'Custom App' },
  { src: '/vantix-mockups/mockup-4-lead-engine.png', label: 'Lead Engine' },
];

const columnB = [
  { src: '/vantix-mockups/mockup-5-api-integration.png', label: 'API Integration' },
  { src: '/vantix-mockups/mockup-6-mobile-app.png', label: 'Workflow Automation' },
  { src: '/vantix-mockups/mockup-7-analytics.png', label: 'Analytics Suite' },
  { src: '/vantix-mockups/mockup-8-automation.png', label: 'Automation Hub' },
];

const allItems = [...columnA, ...columnB];

/* Duplicate for seamless loop */
const colAItems = [...columnA, ...columnA];
const colBItems = [...columnB, ...columnB];
const mobileItems = [...allItems, ...allItems, ...allItems];

/* ── Shared animation config ── */
const ease = animations.easing as unknown as [number, number, number, number];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const trustedLogos = [
  { name: 'SecuredTampa', logo: '/logos/secured-tampa.jpg', bg: '#e2dfda' },
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg', bg: '#ffffff' },
  { name: 'CardLedger', logo: '/logos/cardledger.png', bg: '#f0f0f0' },
];

export default function ProductShowcaseHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ backgroundColor: colors.bg }}>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 pt-28 sm:pt-24 pb-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

        {/* ─── LEFT SIDE ─── */}
        <motion.div
          className="w-full lg:w-[55%] lg:pr-16"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              AI Infrastructure
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] mb-6"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Your business runs on decisions.{' '}
            <span style={{ color: colors.bronze }}>We make them faster.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-[19px] max-w-xl leading-relaxed mb-10"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            We audit your operations, find the gaps, and build AI systems that
            close them — custom automation, apps, and intelligence layers
            designed around how your business actually works.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col items-start gap-3 mb-8">
            <a
              href="#booking"
              className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-semibold text-white overflow-hidden group"
              style={{
                fontFamily: fonts.body,
                background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
              }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10">Book Your Free Audit →</span>
            </a>
            <p className="text-sm" style={{ fontFamily: fonts.body, color: colors.muted }}>
              No commitment. 30-minute strategy call.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: fonts.body, color: colors.muted }}>
              Trusted by
            </span>
            <div className="flex items-center gap-3">
              {trustedLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden"
                  style={{ backgroundColor: logo.bg || colors.surface, border: `1px solid ${colors.border}` }}
                  title={logo.name}
                >
                  {logo.logo ? (
                    <img src={logo.logo} alt={logo.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold" style={{ color: colors.muted }}>{logo.name.charAt(0)}</span>
                  )}
                </div>
              ))}
              <span className="text-xs ml-1" style={{ color: colors.muted, fontFamily: fonts.body }}>+ more</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT SIDE — DESKTOP: Vertical infinite scroll ─── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease }}
          className="hidden lg:flex w-[45%] h-[620px] relative gap-5 overflow-hidden"
          style={{ perspective: '1200px' }}
        >
          <div className="absolute inset-0 z-0 opacity-30 blur-3xl" style={{ background: `radial-gradient(ellipse at center, ${colors.bronze}40 0%, transparent 70%)` }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28" style={{ background: `linear-gradient(to bottom, ${colors.bg}, transparent)` }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28" style={{ background: `linear-gradient(to top, ${colors.bg}, transparent)` }} />

          <div className="relative z-10 flex gap-5 w-full h-full" style={{ transform: 'rotateY(-6deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
            <div className="flex-1 overflow-hidden">
              <div className="desktop-scroll-up flex flex-col gap-5">
                {colAItems.map((item, i) => (
                  <MockupCard key={`a-${i}`} item={item} />
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-hidden -mt-24">
              <div className="desktop-scroll-down flex flex-col gap-5">
                {colBItems.map((item, i) => (
                  <MockupCard key={`b-${i}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── MOBILE: Scrollable + auto-scroll marquee ─── */}
      <div className="lg:hidden w-full py-8 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8" style={{ background: `linear-gradient(to right, ${colors.bg}, transparent)` }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8" style={{ background: `linear-gradient(to left, ${colors.bg}, transparent)` }} />
        <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="mobile-marquee flex gap-4 w-max px-4">
            {[...allItems, ...allItems, ...allItems, ...allItems].map((item, i) => (
              <div key={`m-${i}`} className="flex-shrink-0 w-44">
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: colors.border, background: 'rgba(255,255,255,0.3)' }}>
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={176}
                    height={123}
                    sizes="176px"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <span className="block mt-2 text-center text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
                  {item.label}
                </span>
              </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator removed */}

      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        @keyframes scroll-down {
          0% { transform: translate3d(0, -50%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .desktop-scroll-up {
          animation: scroll-up 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .desktop-scroll-down {
          animation: scroll-down 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .mobile-marquee {
          animation: marquee-left 8s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .desktop-scroll-up,
          .desktop-scroll-down,
          .mobile-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function MockupCard({ item }: { item: { src: string; label: string } }) {
  return (
    <div className="group flex flex-col items-center">
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1.5px solid ${colors.border}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        <Image
          src={item.src}
          alt={item.label}
          width={300}
          height={210}
          sizes="300px"
          loading="lazy"
          className="w-full h-auto object-cover"
        />
      </div>
      <span
        className="mt-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase"
        style={{ fontFamily: fonts.body, color: colors.bronze }}
      >
        {item.label}
      </span>
    </div>
  );
}