'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const trustedLogos = [
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg' },
  { name: 'Secured Tampa', logo: '/logos/secured-tampa.jpg' },
  { name: 'CardLedger', logo: '/logos/cardledger.png' },
];

export default function VideoHero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 pt-28 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        {/* LEFT: Headlines */}
        <motion.div
          className="w-full lg:w-[55%] lg:pr-16"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="h-px w-10" style={{ backgroundColor: colors.bronze }} />
            <span
              className="text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              AI-Powered Infrastructure
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
            className="text-[2.5rem] sm:text-5xl lg:text-[3.75rem] font-bold tracking-[-0.035em] leading-[1.06] mb-7"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Your business runs on decisions.{' '}
            <span style={{ color: colors.bronze }}>We make them faster.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="text-lg sm:text-xl max-w-xl leading-[1.7] mb-10"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            We audit your operations, find the gaps, and build AI systems that close them.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="flex flex-col items-start gap-3 mb-12"
          >
            <a
              href="#booking"
              className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-semibold text-white overflow-hidden group"
              style={{
                fontFamily: fonts.body,
                background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
                boxShadow: `0 8px 32px ${colors.bronze}30`,
              }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10">Book Your Free Audit</span>
            </a>
            <p className="text-sm" style={{ fontFamily: fonts.body, color: colors.muted }}>
              No commitment. 30-minute strategy call.
            </p>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="flex flex-col gap-4"
          >
            <span
              className="text-[11px] tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: fonts.body, color: colors.muted }}
            >
              Trusted by
            </span>
            <div className="flex items-center gap-4">
              {trustedLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-300"
                  style={{ border: `1px solid ${colors.border}` }}
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
                style={{ color: colors.muted, fontFamily: fonts.body }}
              >
                + more
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Product image on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="hidden lg:flex w-[45%] justify-center"
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              boxShadow: `0 32px 80px ${colors.bronze}15`,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Image
              src="/media-assets/images/product-10.png"
              alt="Vantix multi-device ecosystem"
              width={600}
              height={450}
              className="w-full h-auto"
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
        </motion.div>
      </div>

      {/* Mobile product image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease }}
        className="lg:hidden px-5 pb-12"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${colors.border}` }}
        >
          <Image
            src="/media-assets/images/product-10.png"
            alt="Vantix multi-device ecosystem"
            width={600}
            height={450}
            className="w-full h-auto"
            priority
            sizes="100vw"
          />
        </div>
      </motion.div>
    </section>
  );
}
