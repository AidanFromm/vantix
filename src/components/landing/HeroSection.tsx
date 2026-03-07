'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';
import { ArrowDown } from '@phosphor-icons/react';
import Image from 'next/image';

const rotatingWords = ['convert', 'scale', 'dominate', 'grow'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Logo watermark — subtle background element */}
      <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
        <Image
          src="/portfolio/vantix-logo.png"
          alt=""
          width={500}
          height={500}
          className="w-64 md:w-96"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto w-full pt-32 pb-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-8 h-[1px]" style={{ backgroundColor: colors.bronze }} />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: colors.bronze, fontFamily: fonts.mono }}
          >
            Design Studio
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight mb-8"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          We build brands
          <br />
          that{' '}
          <span className="relative inline-block" style={{ minWidth: '3ch' }}>
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

        {/* Subtext + CTA row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl max-w-lg leading-relaxed"
            style={{ color: colors.textSecondary, fontFamily: fonts.body }}
          >
            Brand identity, web design, and AI automation — built from the same
            foundation so nothing ever feels disconnected.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colors.bronze,
                color: colors.bg,
                fontFamily: fonts.display,
              }}
            >
              Start a Project
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:border-opacity-30"
              style={{
                color: colors.text,
                fontFamily: fonts.display,
                border: `1px solid ${colors.border}`,
              }}
            >
              View Our Work
            </a>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap gap-x-12 gap-y-4 mt-20 pt-8"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          {[
            { label: 'Projects Delivered', value: '50+' },
            { label: 'Client Revenue Generated', value: '$5.8M+' },
            { label: 'Client Retention', value: '98%' },
          ].map((stat) => (
            <div key={stat.label}>
              <span
                className="text-2xl md:text-3xl font-bold"
                style={{ color: colors.text, fontFamily: fonts.display }}
              >
                {stat.value}
              </span>
              <p
                className="text-xs uppercase tracking-[0.15em] mt-1"
                style={{ color: colors.textMuted, fontFamily: fonts.mono }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} weight="light" style={{ color: colors.textMuted }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
