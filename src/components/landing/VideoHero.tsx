'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const trustedLogos = [
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg' },
  { name: 'Secured Tampa', logo: '/logos/secured-tampa.jpg' },
  { name: 'CardLedger', logo: '/logos/cardledger.png' },
];

export default function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: colors.bg }}
    >
      {/* ── Animated gradient mesh background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Base dark */}
        <div className="absolute inset-0" style={{ background: colors.bg }} />

        {/* Animated mesh orbs */}
        <motion.div className="absolute inset-0" style={{ y: meshY }}>
          {/* Top-right bronze glow */}
          <motion.div
            className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full opacity-[0.07]"
            style={{
              background: `radial-gradient(circle, ${colors.bronze} 0%, transparent 70%)`,
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -25, 15, 0],
              scale: [1, 1.08, 0.95, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Center-left copper glow */}
          <motion.div
            className="absolute top-[30%] -left-[15%] w-[60vw] h-[60vw] rounded-full opacity-[0.05]"
            style={{
              background: `radial-gradient(circle, ${colors.copper} 0%, transparent 70%)`,
              filter: 'blur(100px)',
            }}
            animate={{
              x: [0, -20, 30, 0],
              y: [0, 20, -15, 0],
              scale: [1, 0.92, 1.06, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Bottom-center peach glow */}
          <motion.div
            className="absolute -bottom-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-[0.04]"
            style={{
              background: `radial-gradient(circle, ${colors.peach} 0%, transparent 70%)`,
              filter: 'blur(90px)',
            }}
            animate={{
              x: [0, 25, -15, 0],
              y: [0, -20, 10, 0],
              scale: [1, 1.05, 0.93, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Subtle noise/grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />

        {/* Top vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(184,147,90,0.04) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 pt-40 sm:pt-48 lg:pt-52 pb-24 lg:pb-32">
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
          }}
        >
          {/* Overline */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="h-px w-12" style={{ backgroundColor: colors.bronze }} />
            <span
              className="text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              AI-Powered Infrastructure
            </span>
          </motion.div>

          {/* Massive headline — 80px on desktop */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
            className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-extrabold tracking-[-0.04em] leading-[1.04] mb-10"
            style={{ fontFamily: fonts.display, color: '#ffffff' }}
          >
            Your business runs
            <br />
            on decisions.{' '}
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.bronzeLight}, ${colors.bronze}, ${colors.copper})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              We make
              <br className="hidden sm:block" />
              them faster.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="text-lg sm:text-xl lg:text-[1.375rem] max-w-2xl leading-[1.7] mb-14"
            style={{ fontFamily: fonts.body, color: 'rgba(240,235,227,0.6)' }}
          >
            We audit your operations, find the gaps, and build AI systems that close them — so every decision is faster, sharper, and backed by data.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="flex flex-wrap items-center gap-5 mb-20 lg:mb-24"
          >
            {/* Primary CTA — bronze gradient pill */}
            <a
              href="#booking"
              className="relative inline-flex items-center gap-2.5 px-10 py-4.5 rounded-full text-lg font-semibold text-white overflow-hidden group transition-all duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: fonts.body,
                background: `linear-gradient(135deg, ${colors.copper}, ${colors.bronze}, ${colors.bronzeDark})`,
                boxShadow: `0 8px 40px rgba(200,127,78,0.35), 0 2px 12px rgba(184,147,90,0.2)`,
              }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10">Book Your Free Audit</span>
              <svg className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            {/* Secondary text */}
            <span
              className="text-sm"
              style={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.4)' }}
            >
              No commitment &middot; 30-minute strategy call
            </span>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="flex flex-col gap-4"
          >
            <span
              className="text-[11px] tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.35)' }}
            >
              Trusted by
            </span>
            <div className="flex items-center gap-4">
              {trustedLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-300 hover:border-white/25"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                  title={logo.name}
                >
                  <img
                    src={logo.logo}
                    alt={logo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <span
                className="text-xs ml-1"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: fonts.body }}
              >
                + more
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.35)' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
