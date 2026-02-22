'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// SCROLL HERO V5 — Apple-Level Rebuild
//
// Design principles:
// 1. SIMPLICITY — one clean animation, no clutter
// 2. PRECISION — exact easing, no springs or bounces
// 3. PERFORMANCE — only transform/opacity, GPU-accelerated
// 4. CONFIDENCE — slow, deliberate reveals (Apple pacing)
// 5. MOBILE — completely separate, optimized experience
//
// Architecture:
// - Dark section (100vh) with text + scroll indicator
// - Scroll drives: text fades up, dashboard scales in from below
// - Clean transition to cream content below
// - NO floating stat cards, NO badges, NO glow effects
// - Just typography + product shot, perfectly timed
// ============================================

// Apple's signature easing: cubic-bezier(0.25, 0.1, 0.25, 1)
const EASE_APPLE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
const EASE_REVEAL = 'power3.out';

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    // Respect reduced motion preferences
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);

    return () => {
      window.removeEventListener('resize', check);
      mq.removeEventListener('change', handler);
    };
  }, []);

  // ═══ DESKTOP ANIMATION ═══
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // ── Phase 1: Entrance animation (on load) ──
      const entrance = gsap.timeline({ delay: 0.2 });

      // Tagline fades in
      entrance.fromTo('.hero-tagline',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: EASE_REVEAL }
      );

      // Headline words stagger in (clean, no bounce)
      entrance.fromTo('.hero-headline-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
        0.15
      );

      // Subtitle
      entrance.fromTo('.hero-subtitle',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: EASE_REVEAL },
        0.6
      );

      // CTA button
      entrance.fromTo('.hero-cta',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE_REVEAL },
        0.8
      );

      // Scroll indicator
      entrance.fromTo('.hero-scroll-indicator',
        { opacity: 0 },
        { opacity: 0.6, duration: 0.8 },
        1.0
      );

      // ── Phase 2: Scroll-driven animation ──
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.8, // Tight scrub for responsive feel
          anticipatePin: 1,
        },
      });

      // Text content lifts and fades (0% → 30% of scroll)
      scrollTl.to('.hero-content', {
        y: -80,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 0);

      // Scroll indicator disappears immediately
      scrollTl.to('.hero-scroll-indicator', {
        opacity: 0,
        duration: 0.1,
      }, 0);

      // Dashboard rises into view with subtle 3D tilt (20% → 70%)
      scrollTl.fromTo('.hero-dashboard-wrap',
        {
          y: '60vh',
          opacity: 0,
          scale: 0.85,
          rotateX: 8,
        },
        {
          y: '0vh',
          opacity: 1,
          scale: 0.92,
          rotateX: 4,
          duration: 0.4,
          ease: EASE_APPLE,
        },
        0.15
      );

      // Dashboard settles to final position (60% → 85%)
      scrollTl.to('.hero-dashboard-wrap', {
        scale: 1,
        rotateX: 0,
        y: '-2vh',
        duration: 0.25,
        ease: 'power2.out',
      }, 0.55);

      // Brief hold, then fade out to transition to next section (85% → 100%)
      scrollTl.to('.hero-stage', {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
      }, 0.85);

    }, container);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  // ═══ MOBILE ANIMATION ═══
  useEffect(() => {
    if (!isMobile || prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Entrance
      const entrance = gsap.timeline({ delay: 0.15 });

      entrance.fromTo('.hero-tagline',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE_REVEAL }
      );
      entrance.fromTo('.hero-headline-line',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
        0.1
      );
      entrance.fromTo('.hero-subtitle',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE_REVEAL },
        0.5
      );
      entrance.fromTo('.hero-cta',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_REVEAL },
        0.7
      );
      entrance.fromTo('.hero-scroll-indicator',
        { opacity: 0 },
        { opacity: 0.5, duration: 0.6 },
        0.9
      );

      // Scroll animation (shorter on mobile)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      scrollTl.to('.hero-content', {
        y: -60,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 0);

      scrollTl.to('.hero-scroll-indicator', {
        opacity: 0,
        duration: 0.08,
      }, 0);

      scrollTl.fromTo('.hero-dashboard-wrap',
        { y: '50vh', opacity: 0, scale: 0.8 },
        { y: '0vh', opacity: 1, scale: 0.95, duration: 0.4, ease: EASE_APPLE },
        0.15
      );

      scrollTl.to('.hero-dashboard-wrap', {
        scale: 1,
        y: '-1vh',
        duration: 0.25,
        ease: 'power2.out',
      }, 0.55);

      scrollTl.to('.hero-stage', {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
      }, 0.85);

    }, container);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  // ═══ REDUCED MOTION: Show everything immediately ═══
  useEffect(() => {
    if (!prefersReducedMotion) return;
    // Make all elements visible without animation
    const elements = document.querySelectorAll('.hero-tagline, .hero-headline-line, .hero-subtitle, .hero-cta, .hero-scroll-indicator');
    elements.forEach(el => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* ═══ Background ═══ */}
      {/* Dark gradient — Apple uses near-black with subtle warmth */}
      <div className="absolute inset-0 bg-[#0a0a0a] z-0" />

      {/* Subtle radial gradient for depth (not a glow — just atmosphere) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(176,122,69,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ═══ Stage ═══ */}
      <div className="hero-stage relative z-10 h-full">

        {/* ═══ Text Content ═══ */}
        <div className="hero-content absolute inset-0 flex flex-col items-center justify-center z-20 px-5 md:px-6">

          {/* Tagline — small, understated, professional */}
          <p className="hero-tagline opacity-0 text-[11px] md:text-[13px] uppercase tracking-[0.3em] text-[#B07A45]/80 font-medium mb-6 md:mb-8">
            AI-Powered Development Agency
          </p>

          {/* Headline — large, clean, Apple typography */}
          <h1 className="text-center max-w-4xl">
            <span className="hero-headline-line opacity-0 block text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
              We build what runs
            </span>
            <span className="hero-headline-line opacity-0 block text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#B07A45] mt-1">
              your business.
            </span>
          </h1>

          {/* Subtitle — one clean line */}
          <p className="hero-subtitle opacity-0 text-[15px] md:text-lg text-white/50 max-w-lg text-center mt-6 md:mt-8 leading-relaxed font-light">
            AI platforms, dashboards, and automation — deployed in weeks, running 24/7.
          </p>

          {/* CTA */}
          <div className="hero-cta opacity-0 mt-8 md:mt-10">
            <a
              href="#booking"
              className="group inline-flex items-center gap-2.5 bg-[#B07A45] hover:bg-[#8E5E34] text-white font-medium rounded-full px-7 py-3.5 md:px-8 md:py-4 text-[14px] md:text-[15px] transition-all duration-300 shadow-[0_0_30px_rgba(176,122,69,0.2)]"
            >
              Book Your Free Consultation
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* ═══ Dashboard ═══ */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ perspective: '1200px' }}
        >
          <div
            className="hero-dashboard-wrap opacity-0"
            style={{
              width: isMobile ? '92vw' : 'min(80vw, 1000px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Shadow underneath */}
            <div className="absolute -bottom-8 left-[10%] right-[10%] h-16 bg-[#B07A45]/8 blur-[40px] rounded-full" />

            {/* Dashboard image */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_80px_-12px_rgba(0,0,0,0.5)]">
              <Image
                src="/hero-dashboard-new.jpg"
                alt="Vantix AI Dashboard"
                width={1200}
                height={800}
                className="w-full block"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Scroll Indicator ═══ */}
      <div className="hero-scroll-indicator absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/20" />
        <div className="w-1 h-1 rounded-full bg-white/30 animate-pulse" />
      </div>

      {/* ═══ Dark-to-Cream Transition ═══ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #F4EFE8)',
        }}
      />
    </section>
  );
}
