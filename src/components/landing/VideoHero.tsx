'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const trustedLogos = [
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg' },
  { name: 'Secured Tampa', logo: '/logos/secured-tampa.jpg' },
  { name: 'CardLedger', logo: '/logos/cardledger.png' },
];

export default function VideoHero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration - video.currentTime <= 1.2 && !videoFading) {
      setVideoFading(true);
    }
  }, [videoFading]);

  const handleEnded = useCallback(() => {
    setVideoEnded(true);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* ── Video Layer ── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/media-assets/videos/hero-final.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoFading ? 0 : 1 }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundColor: colors.bg,
            opacity: videoFading ? 1 : 0,
          }}
        />
      </div>

      {/* ── Content Layer (appears after video) ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence>
          {videoEnded && (
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 pt-24 pb-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
              {/* ─── LEFT: Headlines ─── */}
              <motion.div
                className="w-full lg:w-[55%] lg:pr-16"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
                }}
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
                  className="flex items-center gap-3 mb-8"
                >
                  <span className="h-px w-10" style={{ backgroundColor: colors.bronze }} />
                  <span
                    className="text-xs font-semibold tracking-[0.25em] uppercase"
                    style={{ fontFamily: fonts.body, color: colors.bronze }}
                  >
                    AI-Powered Operations
                  </span>
                </motion.div>

                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
                  className="text-[2.5rem] sm:text-5xl lg:text-[3.75rem] font-bold tracking-[-0.035em] leading-[1.06] mb-7"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  Your business runs on decisions.{' '}
                  <span style={{ color: colors.bronze }}>We make them faster.</span>
                </motion.h1>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
                  className="text-lg sm:text-xl max-w-xl leading-[1.7] mb-10"
                  style={{ fontFamily: fonts.body, color: colors.muted }}
                >
                  We audit your operations, find the gaps, and build AI systems that close them.
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
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
                    <span className="relative z-10">Book Your Free Audit →</span>
                  </a>
                  <p className="text-sm" style={{ fontFamily: fonts.body, color: colors.muted }}>
                    No commitment. 30-minute strategy call.
                  </p>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
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
                        className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden ring-1 ring-[#E3D9CD] hover:ring-[#B07A45]/40 transition-all duration-300"
                        title={logo.name}
                      >
                        <Image
                          src={logo.logo}
                          alt={logo.name}
                          width={48}
                          height={48}
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

              {/* ─── RIGHT: Product showcase image ─── */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease }}
                className="hidden lg:flex w-[45%] items-center justify-center relative"
              >
                <div
                  className="absolute inset-0 z-0 opacity-30 blur-3xl"
                  style={{ background: `radial-gradient(ellipse at center, ${colors.bronze}30 0%, transparent 70%)` }}
                />
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <Image
                    src="/media-assets/images/product-10.png"
                    alt="Vantix multi-device ecosystem"
                    width={560}
                    height={420}
                    priority
                    className="w-full h-auto rounded-2xl drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Mobile: product image (after video ends) ── */}
        <AnimatePresence>
          {videoEnded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="lg:hidden w-full px-6 pb-8"
            >
              <Image
                src="/media-assets/images/product-10.png"
                alt="Vantix multi-device ecosystem"
                width={560}
                height={420}
                className="w-full h-auto rounded-2xl"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
