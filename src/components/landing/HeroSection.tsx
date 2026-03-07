'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingWords = ['convert', 'scale', 'dominate'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left - Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-semibold tracking-widest uppercase text-[#B8935A] mb-6"
            >
              Brand & Web Studio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] mb-6"
            >
              We design brands that{' '}
              <span className="block mt-2 relative h-[1.2em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ opacity: 0, y: 30, rotateX: -40 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -30, rotateX: 40 }}
                    transition={{ duration: 0.4 }}
                    className="absolute left-0 gradient-text-static"
                  >
                    {rotatingWords[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#6B6B6B] mb-8 max-w-md"
            >
              We build brands and websites from the same foundation — so nothing ever feels disconnected.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center px-7 py-3.5 bg-[#B8935A] hover:bg-[#A07D4A] text-white font-semibold rounded-lg transition-colors text-base"
              >
                Start a Project
              </a>
              <a
                href="#work"
                className="text-[#6B6B6B] hover:text-[#1A1A1A] font-medium transition-colors text-base"
              >
                View Our Work →
              </a>
            </motion.div>
          </div>

          {/* Right - Device Mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[480px] hidden md:block"
          >
            {/* Browser frame */}
            <div
              className="absolute top-4 left-0 w-[380px] h-[260px] rounded-xl shadow-lg overflow-hidden border border-black/[0.08]"
              style={{ transform: 'rotate(-3deg)' }}
            >
              {/* Title bar */}
              <div className="h-8 bg-[#F3F0EB] flex items-center px-3 gap-1.5 border-b border-black/[0.06]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5695E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#61C554]" />
                <span className="ml-4 text-[10px] text-[#999] font-mono">vantix.dev</span>
              </div>
              {/* Screen content */}
              <div
                className="h-full"
                style={{
                  background: 'linear-gradient(135deg, #B8935A 0%, #D4B87A 40%, #7D5F35 100%)',
                }}
              >
                {/* Simulated UI */}
                <div className="p-6 space-y-3">
                  <div className="w-24 h-2 bg-white/30 rounded" />
                  <div className="w-48 h-3 bg-white/20 rounded" />
                  <div className="w-36 h-3 bg-white/20 rounded" />
                  <div className="mt-6 flex gap-3">
                    <div className="w-20 h-8 bg-white/25 rounded-md" />
                    <div className="w-20 h-8 bg-white/15 rounded-md" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-16 bg-white/10 rounded-lg" />
                    <div className="h-16 bg-white/10 rounded-lg" />
                    <div className="h-16 bg-white/10 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phone frame */}
            <div
              className="absolute bottom-8 right-8 w-[160px] h-[300px] rounded-[28px] shadow-xl overflow-hidden border-[3px] border-[#E8E5E0]"
              style={{ transform: 'rotate(5deg)' }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#E8E5E0] rounded-b-xl z-10" />
              <div
                className="h-full"
                style={{
                  background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                }}
              >
                <div className="p-4 pt-8 space-y-2">
                  <div className="w-12 h-1.5 bg-white/30 rounded" />
                  <div className="w-20 h-2 bg-white/20 rounded" />
                  <div className="w-16 h-2 bg-white/20 rounded" />
                  <div className="mt-4 h-24 bg-white/10 rounded-lg" />
                  <div className="mt-2 flex gap-1.5">
                    <div className="flex-1 h-8 bg-white/10 rounded" />
                    <div className="flex-1 h-8 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent dot */}
            <div className="absolute top-16 right-4 w-4 h-4 rounded-full bg-[#B8935A]/30" />
            <div className="absolute bottom-32 left-16 w-6 h-6 rounded-full bg-[#B8935A]/20" />
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 pt-10 border-t border-black/[0.06] flex flex-wrap items-center gap-3"
        >
          <span className="text-sm text-[#999] mr-4">Trusted by 25+ companies</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-[#B8935A]/40" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
