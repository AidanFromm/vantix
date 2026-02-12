'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Phone, SearchCheck } from 'lucide-react';
import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(16,185,129,0.15) 0%, transparent 50%)' }} />
      <div className="hidden md:block"><Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#10b981" /></div>

      <motion.div style={isMobile ? {} : { opacity, y }} className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24 w-full">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2 text-sm text-[var(--color-accent)] mb-6 md:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Now Accepting New Clients — Worldwide
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[84px] font-bold leading-[1.05] tracking-tight mb-6 md:mb-8">
            We Don&apos;t Just Build<br />
            Websites. We Build<br />
            <span className="gradient-text">Businesses.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-lg md:text-xl lg:text-2xl text-[var(--color-muted)] max-w-2xl leading-relaxed mb-8 md:mb-12">
            Websites, apps, automation, and systems — everything your business needs to launch, grow, and scale. From startups to enterprise, worldwide.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg active:scale-95"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Project
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.a>
            <motion.a
              href="tel:9084987753"
              className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-medium text-base md:text-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <Phone size={18} />
              (908) 498-7753
            </motion.a>
            <Link
              href="/audit"
              className="inline-flex items-center justify-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] text-sm md:text-base font-medium transition-colors underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-[var(--color-accent)]"
            >
              <SearchCheck size={16} />
              Free Website Audit
            </Link>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
