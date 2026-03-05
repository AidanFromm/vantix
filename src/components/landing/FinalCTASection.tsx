'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

export default function FinalCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
        >
          <source src="/media-assets/videos/vantix-vd-1.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.9) 100%)',
          }}
        />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23B07A45'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Bronze glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none z-[1]"
        style={{ backgroundColor: `${colors.bronze}08` }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-24" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-5"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8" style={{ backgroundColor: `${colors.bronze}60` }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              Next Step
            </span>
            <span className="h-px w-8" style={{ backgroundColor: `${colors.bronze}60` }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold mb-7 tracking-tight leading-[1.1]"
            style={{ fontFamily: fonts.display, color: '#ffffff' }}
          >
            Stop managing chaos.{' '}
            <span style={{ color: colors.bronze }}>Start building infrastructure.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-lg mb-12"
          style={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.5)' }}
        >
          Book your audit. See the roadmap. Decide from there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <a
            href="#booking"
            className="relative inline-flex items-center gap-2 px-12 py-5 rounded-full text-lg font-semibold text-white overflow-hidden group"
            style={{
              fontFamily: fonts.body,
              background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
              boxShadow: `0 12px 40px ${colors.bronze}35`,
            }}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative z-10">Book Your Free Audit</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
