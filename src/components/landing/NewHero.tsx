'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Spotlight from './Spotlight';
import TextGenerateEffect from './TextGenerateEffect';
import ShimmerButton from './ShimmerButton';

export default function NewHero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const handleImgMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 8, rotateY: x * 8 });
  }, []);

  const resetTilt = useCallback(() => setTilt({ rotateX: 0, rotateY: 0 }), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F4EFE8]">
      {/* Spotlight overlay */}
      <Spotlight />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center pt-28 sm:pt-24">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-[#1C1C1C] leading-[1.05] mb-6"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          We Build AI Systems That
          <br />
          Run Your Business.
        </motion.h1>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base sm:text-lg text-[#7A746C] max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          <TextGenerateEffect
            words="Automation. Dashboards. Chatbots. Lead engines. Deployed in weeks, not months."
            speed={0.06}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <a href="#booking">
            <ShimmerButton className="text-lg px-10 py-4 rounded-full">
              Book Your Free AI Audit
            </ShimmerButton>
          </a>
          <p className="text-sm text-[#7A746C]">
            No commitment. 30-minute strategy call.
          </p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleImgMouse}
          onMouseLeave={resetTilt}
          className="relative mt-12 sm:mt-16 mx-auto max-w-4xl perspective-[1200px]"
        >
          <motion.div
            animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative rounded-2xl shadow-2xl border border-[#E3D9CD] overflow-hidden"
          >
            <Image
              src="/hero-dashboard-new.jpg"
              alt="Vantix AI Dashboard"
              width={1200}
              height={700}
              className="w-full h-auto"
              priority
            />
            {/* Border beam effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, #B07A45 10%, transparent 20%)',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                  padding: '2px',
                  animation: 'border-beam-spin 4s linear infinite',
                }}
              />
            </div>
          </motion.div>
          <style jsx>{`
            @keyframes border-beam-spin {
              0% { background: conic-gradient(from 0deg, transparent 0%, #B07A45 10%, transparent 20%); }
              25% { background: conic-gradient(from 90deg, transparent 0%, #B07A45 10%, transparent 20%); }
              50% { background: conic-gradient(from 180deg, transparent 0%, #B07A45 10%, transparent 20%); }
              75% { background: conic-gradient(from 270deg, transparent 0%, #B07A45 10%, transparent 20%); }
              100% { background: conic-gradient(from 360deg, transparent 0%, #B07A45 10%, transparent 20%); }
            }
          `}</style>
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
          <ChevronDown size={28} className="text-[#B07A45]/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
