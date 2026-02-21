'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// APPLE-STYLE SCROLL HERO
// Pinned for 3 viewport heights of scrolling
// Phase 1: Title + subtitle reveal
// Phase 2: Product screens fly in from edges, arrange in showcase
// Phase 3: Center screen zooms to fill, fades to transition
// ============================================

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip heavy animations on mobile

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%', // 3 viewport heights of scroll
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // ── Phase 1: Text reveal (0% → 25%) ──
      // Badge slides down
      tl.fromTo(
        '.sh-badge',
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
        0
      );
      // Headline words stagger in
      tl.fromTo(
        '.sh-headline',
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: 'power3.out' },
        0.05
      );
      // Subtitle fades in
      tl.fromTo(
        '.sh-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
        0.15
      );
      // CTA button
      tl.fromTo(
        '.sh-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' },
        0.2
      );

      // ── Phase 2: Screens fly in (25% → 60%) ──
      // Center screen rises from below
      tl.fromTo(
        '.sh-screen-center',
        { y: 200, opacity: 0, scale: 0.8, rotateX: 15 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.25, ease: 'power3.out' },
        0.25
      );
      // Left screen slides from left
      tl.fromTo(
        '.sh-screen-left',
        { x: -300, opacity: 0, rotateY: 25, scale: 0.7 },
        { x: 0, opacity: 1, rotateY: 8, scale: 0.85, duration: 0.2, ease: 'power2.out' },
        0.32
      );
      // Right screen slides from right
      tl.fromTo(
        '.sh-screen-right',
        { x: 300, opacity: 0, rotateY: -25, scale: 0.7 },
        { x: 0, opacity: 1, rotateY: -8, scale: 0.85, duration: 0.2, ease: 'power2.out' },
        0.32
      );

      // Text fades up while screens settle
      tl.to(
        '.sh-text-group',
        { y: -60, opacity: 0, duration: 0.15, ease: 'power2.in' },
        0.45
      );

      // ── Phase 3: Center screen zooms to fill (60% → 100%) ──
      // Side screens drift out
      tl.to(
        '.sh-screen-left',
        { x: -400, opacity: 0, scale: 0.5, duration: 0.2, ease: 'power2.in' },
        0.6
      );
      tl.to(
        '.sh-screen-right',
        { x: 400, opacity: 0, scale: 0.5, duration: 0.2, ease: 'power2.in' },
        0.6
      );
      // Center zooms up
      tl.to(
        '.sh-screen-center',
        {
          scale: 1.15,
          y: -20,
          rotateX: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        0.6
      );

      // Feature labels appear
      tl.fromTo(
        '.sh-feature-1',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.1 },
        0.75
      );
      tl.fromTo(
        '.sh-feature-2',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.1 },
        0.78
      );
      tl.fromTo(
        '.sh-feature-3',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1 },
        0.81
      );

      // Final fade down for smooth transition
      tl.to(
        '.sh-inner',
        { opacity: 0.3, y: 30, duration: 0.1, ease: 'power1.in' },
        0.92
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  // ── Mobile: simple animated hero (no scroll pinning) ──
  if (isMobile) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#F4EFE8] pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4EFE8] via-[#F4EFE8] to-[#EEE6DC]" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C2A8]/60 bg-[#EEE6DC]/80 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#8E5E34] animate-pulse" />
            <span className="text-xs text-[#7A746C] font-medium">AI-First Agency — Building 24/7</span>
          </div>

          <h1 className="text-[2.5rem] leading-[1.05] font-bold tracking-[-0.03em] text-[#1C1C1C] mb-4">
            Your Competitors Are
            <br />
            <span className="text-[#B07A45]">Automating.</span>{' '}
            <span className="text-[#8E5E34]">Are You?</span>
          </h1>

          <p className="text-base text-[#7A746C] max-w-md mx-auto leading-relaxed mb-6">
            We build AI-powered platforms, dashboards, and automation systems that run your business while you sleep.
          </p>

          <a
            href="#booking"
            className="bronze-btn text-white font-semibold rounded-full px-8 py-4 shadow-md inline-flex items-center gap-2"
          >
            Book Your Free AI Audit
            <ArrowRight size={18} />
          </a>

          <div className="mt-8 relative">
            <Image
              src="/macbook-dashboard.png"
              alt="Vantix AI Dashboard"
              width={600}
              height={375}
              className="rounded-xl shadow-2xl border border-[#E3D9CD]"
              priority
            />
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop: Full GSAP scroll animation ──
  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-[#F4EFE8]"
    >
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(176,122,69,0.08),transparent)]" />

      <div className="sh-inner relative z-10 h-full flex flex-col items-center justify-center">
        {/* ── Text Group ── */}
        <div className="sh-text-group text-center max-w-4xl mx-auto px-6 mb-8">
          <div className="sh-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C2A8]/60 bg-[#EEE6DC]/80 mb-6 shadow-sm backdrop-blur-sm opacity-0">
            <span className="w-2 h-2 rounded-full bg-[#8E5E34] animate-pulse" />
            <span className="text-xs sm:text-sm text-[#7A746C] font-medium">
              2 Humans + 2 AI Assistants — Building 24/7
            </span>
          </div>

          <h1 className="sh-headline text-5xl lg:text-7xl font-bold tracking-[-0.03em] text-[#1C1C1C] leading-[0.95] mb-6 opacity-0">
            Your Competitors Are
            <br />
            <span className="text-[#B07A45]">Automating.</span>{' '}
            <span className="text-[#8E5E34]">Are You?</span>
          </h1>

          <p className="sh-subtitle text-lg text-[#7A746C] max-w-2xl mx-auto leading-relaxed mb-8 opacity-0">
            We build AI-powered platforms, dashboards, and automation systems
            that run your business while you sleep.
          </p>

          <a
            href="#booking"
            className="sh-cta bronze-btn text-white font-semibold rounded-full px-8 py-4 shadow-md inline-flex items-center gap-2 hover:shadow-lg hover:brightness-110 transition-all opacity-0"
          >
            Book Your Free AI Audit
            <ArrowRight size={18} />
          </a>
        </div>

        {/* ── Screens Container (perspective) ── */}
        <div className="relative w-full max-w-6xl mx-auto px-6" style={{ perspective: '1200px' }}>
          {/* Center Screen — Main Dashboard */}
          <div className="sh-screen-center relative mx-auto opacity-0" style={{ maxWidth: '720px' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E3D9CD]/50">
              {/* Browser chrome bar */}
              <div className="bg-[#1C1C1C] px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="bg-[#2A2A2A] rounded-md px-3 py-1 text-xs text-[#888] max-w-xs mx-auto text-center">
                    usevantix.com/dashboard
                  </div>
                </div>
              </div>
              <Image
                src="/macbook-dashboard.png"
                alt="Vantix AI Command Center"
                width={720}
                height={450}
                className="w-full"
                priority
              />
            </div>
          </div>

          {/* Left Screen — AI Dashboard Analytics */}
          <div
            className="sh-screen-left absolute top-8 -left-4 lg:left-8 opacity-0"
            style={{ maxWidth: '340px', transformOrigin: 'right center' }}
          >
            <div className="rounded-xl overflow-hidden shadow-xl border border-[#E3D9CD]/40">
              <Image
                src="/mockup-1.png"
                alt="AI Dashboard Analytics"
                width={340}
                height={220}
                className="w-full"
                priority
              />
            </div>
          </div>

          {/* Right Screen — Workflow Builder */}
          <div
            className="sh-screen-right absolute top-8 -right-4 lg:right-8 opacity-0"
            style={{ maxWidth: '340px', transformOrigin: 'left center' }}
          >
            <div className="rounded-xl overflow-hidden shadow-xl border border-[#E3D9CD]/40">
              <Image
                src="/mockup-2.png"
                alt="AI Workflow Builder"
                width={340}
                height={220}
                className="w-full"
                priority
              />
            </div>
          </div>

          {/* ── Feature Labels (appear in phase 3) ── */}
          <div className="sh-feature-1 absolute top-1/2 -left-2 lg:left-0 -translate-y-1/2 opacity-0">
            <div className="bg-[#1C1C1C] text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#28C840]" />
              11 AI Agents Active
            </div>
          </div>

          <div className="sh-feature-2 absolute top-1/2 -right-2 lg:right-0 -translate-y-1/2 opacity-0">
            <div className="bg-[#1C1C1C] text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B07A45]" />
              Revenue +340%
            </div>
          </div>

          <div className="sh-feature-3 absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0">
            <div className="bg-[#1C1C1C] text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5F57] animate-pulse" />
              Live — 24/7 Operations
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A39B90] animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="opacity-50">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>
    </section>
  );
}
