'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// APPLE-STYLE SCROLL HERO — V2
// 3 phases over 3 viewport-heights of pinned scroll:
//
// Phase 1 (0→30%): Title + subtitle reveal with stagger
// Phase 2 (30→65%): Text lifts away, 3 dashboard screens
//   fly in and arrange in a perspective showcase layout
// Phase 3 (65→100%): Side screens exit, center screen
//   expands dramatically to near-fullscreen with browser
//   chrome, floating metric pills animate in, then the
//   whole thing fades down with a gradient wipe for
//   seamless transition into rest of page
// ============================================

export default function ScrollHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1.5, // smooth catch-up
          anticipatePin: 1,
        },
      });

      // ═══ PHASE 1: Text Reveal (0 → 0.28) ═══

      // Badge drops in
      tl.fromTo('.sh-badge',
        { y: -30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.08, ease: 'back.out(1.5)' },
        0
      );

      // Headline line 1
      tl.fromTo('.sh-h1-line1',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12, ease: 'power3.out' },
        0.04
      );

      // Headline line 2 (bronze text)
      tl.fromTo('.sh-h1-line2',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12, ease: 'power3.out' },
        0.08
      );

      // Subtitle
      tl.fromTo('.sh-sub',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' },
        0.14
      );

      // CTA button
      tl.fromTo('.sh-cta',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.08, ease: 'back.out(1.2)' },
        0.18
      );

      // Hold text visible briefly
      // (gap from 0.26 to 0.28)

      // ═══ PHASE 2: Screens Fly In (0.28 → 0.62) ═══

      // Text group rises and fades
      tl.to('.sh-text-wrap', {
        y: -100,
        opacity: 0,
        scale: 0.95,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.28);

      // Center screen — rises from bottom with perspective tilt
      tl.fromTo('.sh-main-screen',
        { y: 300, opacity: 0, rotateX: 20, scale: 0.75 },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 0.2, ease: 'power3.out' },
        0.32
      );

      // Left screen — slides from far left with rotation
      tl.fromTo('.sh-left-screen',
        { x: -500, opacity: 0, rotateY: 35, scale: 0.6 },
        { x: 0, opacity: 0.9, rotateY: 12, scale: 0.78, duration: 0.18, ease: 'power2.out' },
        0.38
      );

      // Right screen — slides from far right with rotation
      tl.fromTo('.sh-right-screen',
        { x: 500, opacity: 0, rotateY: -35, scale: 0.6 },
        { x: 0, opacity: 0.9, rotateY: -12, scale: 0.78, duration: 0.18, ease: 'power2.out' },
        0.38
      );

      // Brief hold with all 3 screens visible (0.56 → 0.62)

      // ═══ PHASE 3: Expand + Metrics (0.62 → 1.0) ═══

      // Side screens drift away and fade
      tl.to('.sh-left-screen', {
        x: -600,
        opacity: 0,
        rotateY: 45,
        scale: 0.4,
        duration: 0.15,
        ease: 'power3.in',
      }, 0.62);

      tl.to('.sh-right-screen', {
        x: 600,
        opacity: 0,
        rotateY: -45,
        scale: 0.4,
        duration: 0.15,
        ease: 'power3.in',
      }, 0.62);

      // Center screen expands dramatically
      tl.to('.sh-main-screen', {
        scale: 1.25,
        y: -10,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.65);

      // Floating metric pills stagger in
      tl.fromTo('.sh-pill-1',
        { y: 20, opacity: 0, x: -20 },
        { y: 0, opacity: 1, x: 0, duration: 0.08, ease: 'back.out(1.5)' },
        0.75
      );
      tl.fromTo('.sh-pill-2',
        { y: 20, opacity: 0, x: 20 },
        { y: 0, opacity: 1, x: 0, duration: 0.08, ease: 'back.out(1.5)' },
        0.78
      );
      tl.fromTo('.sh-pill-3',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.08, ease: 'back.out(1.5)' },
        0.81
      );
      tl.fromTo('.sh-pill-4',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.08, ease: 'back.out(1.5)' },
        0.84
      );

      // Final: everything fades with downward drift for seamless transition
      tl.to('.sh-stage', {
        opacity: 0,
        y: 60,
        scale: 0.97,
        duration: 0.1,
        ease: 'power2.in',
      }, 0.92);

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // ═══ MOBILE: Clean static hero ═══
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

          <div className="mt-8 relative rounded-xl overflow-hidden shadow-2xl border border-[#E3D9CD]">
            <Image
              src="/dash-overview.png"
              alt="Vantix AI Dashboard"
              width={600}
              height={400}
              className="w-full"
              priority
            />
          </div>
        </div>
      </section>
    );
  }

  // ═══ DESKTOP: Full GSAP Scroll Animation ═══
  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#F4EFE8]">
      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(176,122,69,0.06),transparent)]" />

      {/* Bottom gradient for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4EFE8] to-transparent z-30 pointer-events-none" />

      <div className="sh-stage relative z-10 h-full flex flex-col items-center justify-center">

        {/* ═══ Text Group ═══ */}
        <div className="sh-text-wrap text-center max-w-4xl mx-auto px-6 absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="sh-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D8C2A8]/60 bg-[#EEE6DC]/80 mb-7 shadow-sm backdrop-blur-sm opacity-0">
            <span className="w-2 h-2 rounded-full bg-[#8E5E34] animate-pulse" />
            <span className="text-sm text-[#7A746C] font-medium">
              2 Humans + 2 AI Assistants — Building 24/7
            </span>
          </div>

          <div className="sh-h1-line1 opacity-0">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.04em] text-[#1C1C1C] leading-[0.95]">
              Your Competitors Are
            </h1>
          </div>
          <div className="sh-h1-line2 opacity-0 mt-2">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.04em] leading-[0.95]">
              <span className="text-[#B07A45]">Automating.</span>{' '}
              <span className="text-[#8E5E34]">Are You?</span>
            </h1>
          </div>

          <p className="sh-sub text-lg lg:text-xl text-[#7A746C] max-w-2xl mx-auto leading-relaxed mt-7 opacity-0">
            We build AI-powered platforms, dashboards, and automation systems
            that run your business while you sleep.
          </p>

          <a
            href="#booking"
            className="sh-cta bronze-btn text-white font-semibold rounded-full px-8 py-4 shadow-md inline-flex items-center gap-2 hover:shadow-lg hover:brightness-110 transition-all mt-8 opacity-0"
          >
            Book Your Free AI Audit
            <ArrowRight size={18} />
          </a>
        </div>

        {/* ═══ Screens Container ═══ */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ perspective: '1400px' }}>

          {/* === Center Screen === */}
          <div className="sh-main-screen absolute opacity-0" style={{ width: 'min(72vw, 900px)' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.25)] border border-[#d4c4b0]/40">
              {/* Browser chrome */}
              <div className="bg-[#1C1C1C] px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[#2A2A2A] rounded-lg px-4 py-1.5 text-xs text-[#888] max-w-sm mx-auto text-center font-mono">
                    usevantix.com/dashboard
                  </div>
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>
              {/* Dashboard screenshot */}
              <Image
                src="/dash-overview.png"
                alt="Vantix AI Command Center — Live Dashboard"
                width={900}
                height={600}
                className="w-full block"
                priority
              />
            </div>
          </div>

          {/* === Left Screen === */}
          <div
            className="sh-left-screen absolute opacity-0"
            style={{
              width: 'min(30vw, 380px)',
              left: '2%',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="rounded-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-[#d4c4b0]/30">
              <Image
                src="/mockup-1.png"
                alt="AI Analytics Dashboard"
                width={380}
                height={260}
                className="w-full block"
                priority
              />
            </div>
          </div>

          {/* === Right Screen === */}
          <div
            className="sh-right-screen absolute opacity-0"
            style={{
              width: 'min(30vw, 380px)',
              right: '2%',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="rounded-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-[#d4c4b0]/30">
              <Image
                src="/mockup-2.png"
                alt="AI Workflow Builder"
                width={380}
                height={260}
                className="w-full block"
                priority
              />
            </div>
          </div>

          {/* ═══ Floating Metric Pills (Phase 3) ═══ */}
          <div className="sh-pill-1 absolute opacity-0" style={{ left: '5%', top: '22%' }}>
            <div className="bg-[#1C1C1C]/90 backdrop-blur-md text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_6px_rgba(40,200,64,0.5)]" />
              11 AI Agents Active
            </div>
          </div>

          <div className="sh-pill-2 absolute opacity-0" style={{ right: '5%', top: '22%' }}>
            <div className="bg-[#1C1C1C]/90 backdrop-blur-md text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 border border-white/5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M4 4l3-3 3 3" stroke="#28C840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Revenue +340%
            </div>
          </div>

          <div className="sh-pill-3 absolute opacity-0" style={{ left: '8%', bottom: '18%' }}>
            <div className="bg-[#1C1C1C]/90 backdrop-blur-md text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B07A45] shadow-[0_0_6px_rgba(176,122,69,0.5)]" />
              108 Leads in Pipeline
            </div>
          </div>

          <div className="sh-pill-4 absolute opacity-0" style={{ right: '8%', bottom: '18%' }}>
            <div className="bg-[#1C1C1C]/90 backdrop-blur-md text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] animate-pulse shadow-[0_0_6px_rgba(255,95,87,0.5)]" />
              Live — 24/7 Operations
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-[#A39B90]">
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-[#A39B90]/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#A39B90]/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
