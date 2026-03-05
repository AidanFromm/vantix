'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

/* ── Mockup data for scroll cards ── */
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
const colAItems = [...columnA, ...columnA];
const colBItems = [...columnB, ...columnB];

const trustedLogos = [
  { name: 'SecuredTampa', logo: '/logos/secured-tampa.jpg' },
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg' },
  { name: 'CardLedger', logo: '/logos/cardledger.png' },
];

export default function VideoHero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Start fading at 4 seconds (1 second before end of 5s video)
    if (video.duration - video.currentTime <= 1.2 && !videoFading) {
      setVideoFading(true);
    }
  }, [videoFading]);

  const handleEnded = useCallback(() => {
    setVideoEnded(true);
  }, []);

  return (
    <>
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.bg }}
      >
        {/* ── Video Layer ── */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="/videos/hero.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: videoFading ? 0 : 1 }}
          />
          {/* Cream overlay that appears as video fades */}
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

                {/* ─── RIGHT: Desktop mockup scroll ─── */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease }}
                  className="hidden lg:flex w-[45%] h-[620px] relative gap-5 overflow-hidden"
                  style={{ perspective: '1200px' }}
                >
                  <div
                    className="absolute inset-0 z-0 opacity-20 blur-3xl"
                    style={{ background: `radial-gradient(ellipse at center, ${colors.bronze}40 0%, transparent 70%)` }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32"
                    style={{ background: `linear-gradient(to bottom, ${colors.bg}, transparent)` }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32"
                    style={{ background: `linear-gradient(to top, ${colors.bg}, transparent)` }}
                  />

                  <div
                    className="relative z-10 flex gap-5 w-full h-full"
                    style={{ transform: 'rotateY(-6deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="hero-scroll-up flex flex-col gap-5">
                        {colAItems.map((item, i) => (
                          <MockupCard key={`a-${i}`} item={item} />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden -mt-24">
                      <div className="hero-scroll-down flex flex-col gap-5">
                        {colBItems.map((item, i) => (
                          <MockupCard key={`b-${i}`} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ── Mobile mockup marquee (after video ends) ── */}
          <AnimatePresence>
            {videoEnded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="lg:hidden w-full py-6 relative"
              >
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8"
                  style={{ background: `linear-gradient(to right, ${colors.bg}, transparent)` }}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8"
                  style={{ background: `linear-gradient(to left, ${colors.bg}, transparent)` }}
                />
                <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="hero-marquee flex gap-4 w-max px-4">
                    {[...allItems, ...allItems, ...allItems, ...allItems].map((item, i) => (
                      <div key={`m-${i}`} className="flex-shrink-0 w-44">
                        <div
                          className="rounded-xl overflow-hidden border"
                          style={{ borderColor: colors.border, background: 'rgba(255,255,255,0.3)' }}
                        >
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
                        <span
                          className="block mt-2 text-center text-[10px] font-semibold tracking-[0.15em] uppercase"
                          style={{ fontFamily: fonts.body, color: colors.bronze }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

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
        .hero-scroll-up {
          animation: scroll-up 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .hero-scroll-down {
          animation: scroll-down 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .hero-marquee {
          animation: marquee-left 12s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-scroll-up,
          .hero-scroll-down,
          .hero-marquee {
            animation: none;
          }
        }
      `}</style>
    </>
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
