'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const clientLogos = [
  { name: 'Just Four Kicks', logo: '/logos/j4k.jpg' },
  { name: 'Secured Tampa', logo: '/logos/secured-tampa.jpg' },
  { name: 'CardLedger', logo: '/logos/cardledger.png' },
];

export default function VideoTrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-16 sm:py-24 md:py-44 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line react/no-unknown-property */}
        <video
          autoPlay
          muted
          playsInline
          loop
          webkit-playsinline="true"
          className="w-full h-full object-cover"
        >
          <source src="/media-assets/videos/vantix-video-3.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.75) 50%, rgba(10,10,10,0.9) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center"
            style={{ backgroundColor: `${colors.bronze}15`, border: `1px solid ${colors.bronze}30` }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.bronze} strokeWidth="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>

          <blockquote
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 tracking-tight leading-[1.2]"
            style={{ fontFamily: fonts.display, color: '#ffffff' }}
          >
            Built by founders who ship,{' '}
            <span style={{ color: colors.bronze }}>not consultants who talk.</span>
          </blockquote>

          <p
            className="text-lg mb-12 max-w-2xl mx-auto"
            style={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.5)' }}
          >
            Every system we build, we&apos;d use ourselves. Because we do.
          </p>
        </motion.div>

        {/* Client logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="flex flex-col items-center gap-6"
        >
          <span
            className="text-[11px] tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: fonts.body, color: 'rgba(255,255,255,0.35)' }}
          >
            Trusted Partners
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
            {clientLogos.map((logo) => (
              <div
                key={logo.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                title={logo.name}
              >
                <img
                  src={logo.logo}
                  alt={logo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
