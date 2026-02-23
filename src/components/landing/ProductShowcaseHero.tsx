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

/* Triplicate for seamless infinite scroll */
const colAItems = [...columnA, ...columnA, ...columnA];
const colBItems = [...columnB, ...columnB, ...columnB];

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

/* ── Trusted-by logos (placeholder avatars) ── */
const trustedLogos = [
  { name: 'SecuredTampa', initial: 'ST' },
  { name: 'Just Four Kicks', initial: 'JFK' },
  { name: 'CardLedger', initial: 'CL' },
  { name: 'Nextera', initial: 'NX' },
];

/* ── Component ── */
export default function ProductShowcaseHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: colors.bg }}>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 py-28 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

        {/* ─── LEFT SIDE (55%) ─── */}
        <motion.div
          className="w-full lg:w-[55%] lg:pr-16"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Bronze label */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <span
              className="h-px w-8"
              style={{ backgroundColor: colors.bronze }}
            />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              AI Infrastructure
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] mb-6"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Your business runs on decisions.{' '}
            <span style={{ color: colors.bronze }}>We make them faster.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-[19px] max-w-xl leading-relaxed mb-10"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            We audit your operations, find the gaps, and build AI systems that
            close them — custom automation, apps, and intelligence layers
            designed around how your business actually works.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeUp} className="flex flex-col items-start gap-3 mb-8">
            <a
              href="#booking"
              className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-semibold text-white overflow-hidden group"
              style={{
                fontFamily: fonts.body,
                background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
                boxShadow: `0 0 0 0 ${colors.bronze}00`,
                transition: 'box-shadow 0.4s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px 4px ${colors.bronze}55`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${colors.bronze}00`;
              }}
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10">Book Your Free Audit →</span>
            </a>
            <p
              className="text-sm"
              style={{ fontFamily: fonts.body, color: colors.muted }}
            >
              No commitment. 30-minute strategy call.
            </p>
          </motion.div>

          {/* Trusted by */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span
              className="text-xs tracking-[0.15em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.muted }}
            >
              Trusted by
            </span>
            <div className="flex items-center gap-3">
              {trustedLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.muted,
                    fontFamily: fonts.body,
                    border: `1px solid ${colors.border}`,
                  }}
                  title={logo.name}
                >
                  {logo.initial}
                </div>
              ))}
              <span
                className="text-xs ml-1"
                style={{ color: colors.muted, fontFamily: fonts.body }}
              >
                + more
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT SIDE (45%) — Infinite Scroll with 3D Perspective ─── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease }}
          className="hidden lg:flex w-[45%] h-[620px] relative gap-5 overflow-hidden"
          style={{
            perspective: '1200px',
          }}
        >
          {/* Bronze glow behind columns */}
          <div
            className="absolute inset-0 z-0 opacity-30 blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.bronze}40 0%, transparent 70%)`,
            }}
          />

          {/* Top & bottom cream fade masks */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28"
            style={{ background: `linear-gradient(to bottom, ${colors.bg}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28"
            style={{ background: `linear-gradient(to top, ${colors.bg}, transparent)` }}
          />

          {/* 3D tilted container */}
          <div
            className="relative z-10 flex gap-5 w-full h-full"
            style={{
              transform: 'rotateY(-6deg) rotateX(2deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Column A — scrolls UP */}
            <div className="flex-1 overflow-hidden relative">
              <div className="scroll-col-up flex flex-col gap-5">
                {colAItems.map((item, i) => (
                  <MockupCard key={`a-${i}`} item={item} />
                ))}
              </div>
            </div>

            {/* Column B — scrolls DOWN (offset) */}
            <div className="flex-1 overflow-hidden relative -mt-24">
              <div className="scroll-col-down flex flex-col gap-5">
                {colBItems.map((item, i) => (
                  <MockupCard key={`b-${i}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} style={{ color: `${colors.bronze}80` }} />
        </motion.div>
      </motion.div>

      {/* CSS keyframes for infinite scroll */}
      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-33.333%); }
          100% { transform: translateY(0); }
        }
        .scroll-col-up {
          animation: scroll-up 30s linear infinite;
        }
        .scroll-col-down {
          animation: scroll-down 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

/* ── Mockup Card — Glassmorphism style ── */
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
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = 'scale(1.04)';
          el.style.border = `1.5px solid ${colors.bronze}80`;
          el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.08), 0 0 20px ${colors.bronze}30`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = 'scale(1)';
          el.style.border = `1.5px solid ${colors.border}`;
          el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)';
        }}
      >
        <Image
          src={item.src}
          alt={item.label}
          width={300}
          height={210}
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
