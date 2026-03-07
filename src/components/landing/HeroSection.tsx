'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

const rotatingWords = ['convert', 'scale', 'dominate'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-32 md:pt-52 md:pb-44"
      style={{ backgroundColor: colors.bg }}
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-sm uppercase tracking-[0.25em] mb-8"
        style={{ color: colors.textSecondary, fontFamily: fonts.body }}
      >
        Brand Identity & Web Design Studio
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight max-w-5xl"
        style={{ fontFamily: fonts.display, color: colors.text }}
      >
        We design brands that{' '}
        <span className="inline-block relative" style={{ minWidth: '3ch' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={rotatingWords[wordIndex]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="inline-block"
              style={{ color: colors.bronze }}
            >
              {rotatingWords[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-base md:text-lg max-w-xl leading-relaxed"
        style={{ color: colors.textSecondary, fontFamily: fonts.body }}
      >
        We build brands and websites from the same foundation — so nothing ever feels disconnected.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="mt-10"
      >
        <a
          href="#contact"
          className="inline-block px-10 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:brightness-110"
          style={{
            backgroundColor: colors.bronze,
            color: colors.bg,
            fontFamily: fonts.body,
          }}
        >
          Start a Project
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-12 text-xs uppercase tracking-[0.2em]"
        style={{ color: colors.textMuted, fontFamily: fonts.body }}
      >
        Trusted by 25+ founders & companies
      </motion.p>
    </section>
  );
}
