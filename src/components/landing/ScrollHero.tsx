'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// SCROLL HERO V3 — Premium Agency Showcase
// 
// Inspired by Linear, Vercel, Stripe, Apple
// Dark-to-cream transition, 3D dashboard reveal,
// character animations, ambient particles, glass cards
//
// Phases (pinned 4x viewport):
// 1. (0→20%)  Dark bg, text reveals word-by-word
// 2. (20→45%) Text lifts, dashboard rises with 3D perspective
// 3. (45→70%) Dashboard straightens, zooms, glass stat cards fly in
// 4. (70→90%) Background transitions dark→cream, dashboard fades
// 5. (90→100%) Clean exit into rest of page
// ============================================

function DotGrid() {
  return (
    <div className="sh-dots absolute inset-0 overflow-hidden pointer-events-none opacity-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(176,122,69,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    </div>
  );
}

function AmbientOrbs() {
  return (
    <div className="sh-orbs absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#B07A45]/[0.04] blur-[120px] -top-[200px] left-1/2 -translate-x-1/2" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#B07A45]/[0.03] blur-[100px] bottom-[10%] left-[10%]" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#8E5E34]/[0.03] blur-[80px] top-[30%] right-[5%]" />
    </div>
  );
}

export default function ScrollHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ═══════════════════════════════════════════
  // DESKTOP GSAP ANIMATION
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1.8,
          anticipatePin: 1,
        },
      });

      // ═══ PHASE 1: Text Reveal (0 → 0.20) ═══

      // Dot grid fades in
      tl.to('.sh-dots', { opacity: 1, duration: 0.05 }, 0);

      // Badge slides down
      tl.fromTo('.sh-badge',
        { y: -40, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, duration: 0.06, ease: 'back.out(1.7)' },
        0.01
      );

      // Words reveal one by one — line 1
      tl.fromTo('.sh-word',
        { y: 60, opacity: 0, rotateX: -40 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.04, stagger: 0.015, ease: 'power3.out' },
        0.04
      );

      // Line 2 — bronze gradient text
      tl.fromTo('.sh-word-bronze',
        { y: 60, opacity: 0, rotateX: -40 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.04, stagger: 0.02, ease: 'power3.out' },
        0.09
      );

      // Subtitle fades up
      tl.fromTo('.sh-sub',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.06, ease: 'power2.out' },
        0.13
      );

      // CTA button pops in
      tl.fromTo('.sh-cta',
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(1.5)' },
        0.16
      );

      // ═══ PHASE 2: Dashboard Rises (0.20 → 0.45) ═══

      // Text group lifts and fades
      tl.to('.sh-text-wrap', {
        y: -150,
        opacity: 0,
        scale: 0.9,
        duration: 0.1,
        ease: 'power3.in',
      }, 0.22);

      // Dashboard container rises from below with 3D tilt
      tl.fromTo('.sh-dashboard',
        { y: '60vh', opacity: 0, rotateX: 25, scale: 0.7 },
        { y: 0, opacity: 1, rotateX: 12, scale: 0.85, duration: 0.2, ease: 'power3.out' },
        0.25
      );

      // Glow pulse appears under dashboard
      tl.fromTo('.sh-glow',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.15, ease: 'power2.out' },
        0.3
      );

      // ═══ PHASE 3: Dashboard Straightens + Stats (0.45 → 0.70) ═══

      // Dashboard straightens out and scales up
      tl.to('.sh-dashboard', {
        rotateX: 0,
        scale: 1,
        y: -20,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.45);

      // Glass stat cards fly in from edges
      tl.fromTo('.sh-stat-1',
        { x: -100, y: 30, opacity: 0, scale: 0.8, rotateY: 15 },
        { x: 0, y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.08, ease: 'back.out(1.3)' },
        0.52
      );
      tl.fromTo('.sh-stat-2',
        { x: 100, y: -30, opacity: 0, scale: 0.8, rotateY: -15 },
        { x: 0, y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.08, ease: 'back.out(1.3)' },
        0.55
      );
      tl.fromTo('.sh-stat-3',
        { x: -80, y: -20, opacity: 0, scale: 0.8 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.08, ease: 'back.out(1.3)' },
        0.58
      );
      tl.fromTo('.sh-stat-4',
        { x: 80, y: 20, opacity: 0, scale: 0.8 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.08, ease: 'back.out(1.3)' },
        0.61
      );

      // ═══ PHASE 4: BG Transition + Exit (0.70 → 1.0) ═══

      // Background transitions from dark to cream
      tl.to('.sh-bg-dark', {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.inOut',
      }, 0.72);

      tl.to('.sh-bg-cream', {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.inOut',
      }, 0.72);

      // Dashboard + stats scale down slightly and fade
      tl.to('.sh-stage', {
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.88);

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // ═══════════════════════════════════════════
  // MOBILE: Animated but lightweight
  // ═══════════════════════════════════════════
  if (isMobile) {
    return (
      <section className="relative overflow-hidden bg-[#0C0A09] pt-24 pb-16">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#B07A45]/10 blur-[80px]" />
        
        <div className="relative z-10 max-w-lg mx-auto px-5 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B07A45]/20 bg-[#B07A45]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#B07A45] animate-pulse" />
            <span className="text-xs text-[#B07A45]/80 font-medium tracking-wide">AI-First Agency</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.2rem] leading-[1.1] font-bold tracking-[-0.03em] text-white mb-3">
            Your Competitors{' '}
            <span className="text-[#B07A45]">Are Automating.</span>
          </h1>
          <h1 className="text-[2.2rem] leading-[1.1] font-bold tracking-[-0.03em] mb-5">
            <span className="bg-gradient-to-r from-[#B07A45] via-[#D4A574] to-[#B07A45] bg-clip-text text-transparent">
              Are You?
            </span>
          </h1>

          <p className="text-[15px] text-[#999] leading-relaxed mb-7 max-w-sm mx-auto">
            We build AI-powered platforms and automation systems that run your business while you sleep.
          </p>

          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B07A45] to-[#8E5E34] text-white font-semibold rounded-full px-7 py-3.5 shadow-[0_0_30px_rgba(176,122,69,0.3)] hover:shadow-[0_0_40px_rgba(176,122,69,0.4)] transition-all"
          >
            Book Your Free AI Audit
            <ArrowRight size={16} />
          </a>

          {/* Dashboard Preview */}
          <div className="mt-10 relative">
            {/* Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-b from-[#B07A45]/20 via-[#B07A45]/5 to-transparent rounded-2xl blur-xl" />
            
            <div className="relative rounded-xl overflow-hidden border border-[#B07A45]/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              {/* Mini browser chrome */}
              <div className="bg-[#1C1C1C] px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-2">
                  <div className="bg-[#2A2A2A] rounded px-3 py-1 text-[10px] text-[#666] text-center font-mono">
                    usevantix.com/dashboard
                  </div>
                </div>
              </div>
              <Image
                src="/dash-overview.png"
                alt="Vantix AI Dashboard"
                width={600}
                height={400}
                className="w-full block"
                priority
              />
            </div>
          </div>

          {/* Mini stats row */}
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <div className="bg-[#B07A45]/10 border border-[#B07A45]/15 rounded-full px-4 py-2 text-xs text-[#D4A574] font-medium">
              11 AI Agents Active
            </div>
            <div className="bg-[#B07A45]/10 border border-[#B07A45]/15 rounded-full px-4 py-2 text-xs text-[#D4A574] font-medium">
              108 Leads
            </div>
            <div className="bg-[#B07A45]/10 border border-[#B07A45]/15 rounded-full px-4 py-2 text-xs text-[#D4A574] font-medium">
              24/7 Live
            </div>
          </div>
        </div>

        {/* Transition gradient to cream */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F4EFE8] to-transparent" />
      </section>
    );
  }

  // ═══════════════════════════════════════════
  // DESKTOP: Full GSAP Pinned Scroll Animation
  // ═══════════════════════════════════════════
  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background layers */}
      <div className="sh-bg-dark absolute inset-0 bg-[#0C0A09] z-0" />
      <div className="sh-bg-cream absolute inset-0 bg-[#F4EFE8] z-0 opacity-0" />

      {/* Ambient orbs */}
      <AmbientOrbs />

      {/* Dot grid */}
      <DotGrid />

      {/* Bottom gradient for seamless page transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F4EFE8] to-transparent z-40 pointer-events-none" />

      <div className="sh-stage relative z-10 h-full">

        {/* ═══ Text Group ═══ */}
        <div className="sh-text-wrap absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
          {/* Badge */}
          <div className="sh-badge opacity-0 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#B07A45]/20 bg-[#B07A45]/5 mb-8 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#B07A45]" />
            <span className="text-sm text-[#B07A45]/80 font-medium tracking-wide">
              AI-First Agency — Building 24/7
            </span>
          </div>

          {/* Headline line 1 — word by word */}
          <div className="overflow-hidden" style={{ perspective: '800px' }}>
            <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] flex flex-wrap justify-center gap-x-[0.3em]">
              <span className="sh-word opacity-0 inline-block">Your</span>
              <span className="sh-word opacity-0 inline-block">Competitors</span>
              <span className="sh-word opacity-0 inline-block">Are</span>
            </h1>
          </div>

          {/* Headline line 2 — bronze gradient */}
          <div className="overflow-hidden mt-2" style={{ perspective: '800px' }}>
            <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.95] flex flex-wrap justify-center gap-x-[0.3em]">
              <span className="sh-word-bronze opacity-0 inline-block bg-gradient-to-r from-[#C89A6A] via-[#D4A574] to-[#B07A45] bg-clip-text text-transparent">
                Automating.
              </span>
              <span className="sh-word-bronze opacity-0 inline-block bg-gradient-to-r from-[#B07A45] via-[#D4A574] to-[#C89A6A] bg-clip-text text-transparent">
                Are
              </span>
              <span className="sh-word-bronze opacity-0 inline-block bg-gradient-to-r from-[#C89A6A] to-[#8E5E34] bg-clip-text text-transparent">
                You?
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="sh-sub text-lg lg:text-xl text-[#888] max-w-2xl mx-auto leading-relaxed mt-8 text-center opacity-0">
            We build AI-powered platforms, dashboards, and automation systems
            that run your business while you sleep.
          </p>

          {/* CTA */}
          <a
            href="#booking"
            className="sh-cta opacity-0 mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-[#B07A45] to-[#8E5E34] text-white font-semibold rounded-full px-8 py-4 shadow-[0_0_40px_rgba(176,122,69,0.25)] hover:shadow-[0_0_50px_rgba(176,122,69,0.35)] transition-all"
          >
            Book Your Free AI Audit
            <ArrowRight size={18} />
          </a>
        </div>

        {/* ═══ Dashboard Container ═══ */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ perspective: '1200px' }}>
          
          {/* Glow under dashboard */}
          <div className="sh-glow absolute opacity-0" style={{ width: 'min(80vw, 1000px)', bottom: '8%' }}>
            <div className="w-full h-[200px] bg-gradient-to-t from-[#B07A45]/15 via-[#B07A45]/5 to-transparent rounded-full blur-[60px]" />
          </div>

          {/* Dashboard frame */}
          <div 
            className="sh-dashboard absolute opacity-0"
            style={{ 
              width: 'min(78vw, 960px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] border border-white/[0.08]">
              {/* Browser chrome — dark sleek */}
              <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-6">
                  <div className="bg-[#0F0F0F] rounded-lg px-4 py-1.5 text-[13px] text-[#666] max-w-md mx-auto text-center font-mono flex items-center justify-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v3.5M6 7.5V11M1 6h3.5M7.5 6H11" stroke="#28C840" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    usevantix.com/dashboard
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-4 rounded bg-[#222] flex items-center justify-center">
                    <div className="w-2 h-2 border border-[#444] rounded-sm" />
                  </div>
                </div>
              </div>
              
              {/* Dashboard screenshot */}
              <Image
                src="/dash-overview.png"
                alt="Vantix AI Command Center — Live Dashboard"
                width={960}
                height={640}
                className="w-full block"
                priority
              />
            </div>

            {/* Reflection effect */}
            <div className="mt-1 rounded-2xl overflow-hidden opacity-[0.12] scale-y-[-1] blur-[2px]" style={{ height: '80px', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)' }}>
              <Image
                src="/dash-overview.png"
                alt=""
                width={960}
                height={640}
                className="w-full block"
                aria-hidden
              />
            </div>
          </div>

          {/* ═══ Glass Stat Cards ═══ */}

          {/* Top-left: AI Agents */}
          <div className="sh-stat-1 absolute opacity-0" style={{ left: '3%', top: '18%' }}>
            <div className="bg-[#1C1C1C]/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.6)] animate-pulse" />
                <span className="text-[11px] text-[#888] uppercase tracking-wider font-medium">Live Agents</span>
              </div>
              <div className="text-2xl font-bold text-white">11</div>
              <div className="text-xs text-[#B07A45] mt-0.5">All systems operational</div>
            </div>
          </div>

          {/* Top-right: Revenue */}
          <div className="sh-stat-2 absolute opacity-0" style={{ right: '3%', top: '18%' }}>
            <div className="bg-[#1C1C1C]/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10l3-4 2 2 3-5" stroke="#B07A45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[11px] text-[#888] uppercase tracking-wider font-medium">Pipeline Value</span>
              </div>
              <div className="text-2xl font-bold text-white">$47K</div>
              <div className="text-xs text-[#28C840] mt-0.5">+340% this quarter</div>
            </div>
          </div>

          {/* Bottom-left: Leads */}
          <div className="sh-stat-3 absolute opacity-0" style={{ left: '5%', bottom: '20%' }}>
            <div className="bg-[#1C1C1C]/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#B07A45] shadow-[0_0_8px_rgba(176,122,69,0.5)]" />
                <span className="text-[11px] text-[#888] uppercase tracking-wider font-medium">Active Leads</span>
              </div>
              <div className="text-2xl font-bold text-white">108</div>
              <div className="text-xs text-[#B07A45] mt-0.5">Auto-generated by AI</div>
            </div>
          </div>

          {/* Bottom-right: Uptime */}
          <div className="sh-stat-4 absolute opacity-0" style={{ right: '5%', bottom: '20%' }}>
            <div className="bg-[#1C1C1C]/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5F57] animate-pulse shadow-[0_0_8px_rgba(255,95,87,0.6)]" />
                <span className="text-[11px] text-[#888] uppercase tracking-wider font-medium">Operations</span>
              </div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-[#888] mt-0.5">Always building</div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="sh-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#666]">
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium">Scroll to explore</span>
        <div className="w-[22px] h-[34px] rounded-full border-2 border-[#444] flex justify-center pt-2">
          <div className="w-[3px] h-[6px] rounded-full bg-[#B07A45] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
