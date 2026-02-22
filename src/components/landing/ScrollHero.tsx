'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// SCROLL HERO V4 — Premium Agency Showcase
//
// Key fix: Text visible IMMEDIATELY on load
// Scroll only controls dashboard reveal
// Clean, confident, premium feel
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

  // ═══ DESKTOP: Entrance animation (on load) + scroll animation ═══
  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // ── ENTRANCE: Animate text in on page load ──
      const entrance = gsap.timeline({ delay: 0.3 });

      entrance.fromTo('.sh-badge',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
      entrance.fromTo('.sh-word',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.2
      );
      entrance.fromTo('.sh-word-bronze',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        0.5
      );
      entrance.fromTo('.sh-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.8
      );
      entrance.fromTo('.sh-cta',
        { y: 15, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.3)' },
        1.0
      );
      entrance.fromTo('.sh-scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.2
      );

      // ── SCROLL: Dashboard reveal on scroll ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      // Text lifts away
      tl.to('.sh-text-wrap', {
        y: -120,
        opacity: 0,
        scale: 0.92,
        duration: 0.15,
        ease: 'power3.in',
      }, 0);

      tl.to('.sh-scroll-hint', { opacity: 0, duration: 0.05 }, 0);

      // Dashboard rises with 3D perspective
      tl.fromTo('.sh-dashboard',
        { y: '50vh', opacity: 0, rotateX: 20, scale: 0.75 },
        { y: 0, opacity: 1, rotateX: 8, scale: 0.88, duration: 0.25, ease: 'power3.out' },
        0.1
      );

      // Glow appears
      tl.fromTo('.sh-glow',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' },
        0.15
      );

      // Dashboard straightens
      tl.to('.sh-dashboard', {
        rotateX: 0,
        scale: 1.02,
        y: -10,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.35);

      // Stat cards fly in
      tl.fromTo('.sh-stat-1',
        { x: -80, y: 20, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.5
      );
      tl.fromTo('.sh-stat-2',
        { x: 80, y: -20, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.53
      );
      tl.fromTo('.sh-stat-3',
        { x: -60, y: -15, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.56
      );
      tl.fromTo('.sh-stat-4',
        { x: 60, y: 15, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.59
      );

      // Background transition dark → cream
      tl.to('.sh-bg-dark', { opacity: 0, duration: 0.15 }, 0.72);
      tl.to('.sh-bg-cream', { opacity: 1, duration: 0.15 }, 0.72);

      // Everything fades for seamless exit
      tl.to('.sh-stage', {
        opacity: 0,
        y: 60,
        scale: 0.96,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.88);

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // ═══ MOBILE ═══
  if (isMobile) {
    return (
      <section className="relative overflow-hidden bg-[#0C0A09] pt-24 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-[#B07A45]/8 blur-[100px]" />
        
        <div className="relative z-10 max-w-lg mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B07A45]/20 bg-[#B07A45]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#B07A45] animate-pulse" />
            <span className="text-xs text-[#B07A45]/80 font-medium tracking-wide">AI-First Agency</span>
          </div>

          <h1 className="text-[2.2rem] leading-[1.1] font-bold tracking-[-0.03em] text-white mb-2">
            Your Competitors
          </h1>
          <h1 className="text-[2.2rem] leading-[1.1] font-bold tracking-[-0.03em] mb-5">
            <span className="bg-gradient-to-r from-[#C89A6A] via-[#D4A574] to-[#B07A45] bg-clip-text text-transparent">
              Are Automating.
            </span>{' '}
            <span className="bg-gradient-to-r from-[#B07A45] to-[#8E5E34] bg-clip-text text-transparent">
              Are You?
            </span>
          </h1>

          <p className="text-[15px] text-[#999] leading-relaxed mb-7 max-w-sm mx-auto">
            We build AI-powered platforms and automation systems that run your business while you sleep.
          </p>

          <a href="#booking" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B07A45] to-[#8E5E34] text-white font-semibold rounded-full px-7 py-3.5 shadow-[0_0_30px_rgba(176,122,69,0.3)] transition-all">
            Book Your Free AI Audit
            <ArrowRight size={16} />
          </a>

          <div className="mt-10 relative">
            <div className="absolute -inset-4 bg-gradient-to-b from-[#B07A45]/15 via-[#B07A45]/5 to-transparent rounded-2xl blur-xl" />
            <div className="relative rounded-xl overflow-hidden border border-[#B07A45]/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="bg-[#1A1A1A] px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-2">
                  <div className="bg-[#0F0F0F] rounded px-3 py-1 text-[10px] text-[#555] text-center font-mono">usevantix.com/dashboard</div>
                </div>
              </div>
              <Image src="/dash-overview.png" alt="Vantix AI Dashboard" width={600} height={400} className="w-full block" priority />
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <div className="bg-[#B07A45]/10 border border-[#B07A45]/15 rounded-full px-4 py-2 text-xs text-[#D4A574] font-medium">11 AI Agents</div>
            <div className="bg-[#B07A45]/10 border border-[#B07A45]/15 rounded-full px-4 py-2 text-xs text-[#D4A574] font-medium">108 Leads</div>
            <div className="bg-[#B07A45]/10 border border-[#B07A45]/15 rounded-full px-4 py-2 text-xs text-[#D4A574] font-medium">24/7 Live</div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F4EFE8] to-transparent" />
      </section>
    );
  }

  // ═══ DESKTOP ═══
  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background layers */}
      <div className="sh-bg-dark absolute inset-0 bg-[#0C0A09] z-0" />
      <div className="sh-bg-cream absolute inset-0 bg-[#F4EFE8] z-0 opacity-0" />

      {/* Ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#B07A45]/[0.03] blur-[150px] top-[-200px] left-1/2 -translate-x-1/2" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#B07A45]/[0.02] blur-[100px] bottom-[20%] left-[15%]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#8E5E34]/[0.02] blur-[80px] top-[40%] right-[10%]" />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(176,122,69,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(176,122,69,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F4EFE8] to-transparent z-40 pointer-events-none" />

      <div className="sh-stage relative z-10 h-full">

        {/* ═══ Text — visible on load ═══ */}
        <div className="sh-text-wrap absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
          <div className="sh-badge opacity-0 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#B07A45]/20 bg-[#B07A45]/[0.06] mb-8 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#B07A45]" />
            <span className="text-sm text-[#B07A45]/80 font-medium tracking-wide">AI-First Agency — Building 24/7</span>
          </div>

          <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] flex flex-wrap justify-center gap-x-[0.3em]">
            <span className="sh-word opacity-0 inline-block">Your</span>
            <span className="sh-word opacity-0 inline-block">Competitors</span>
            <span className="sh-word opacity-0 inline-block">Are</span>
          </h1>

          <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.95] flex flex-wrap justify-center gap-x-[0.3em] mt-2">
            <span className="sh-word-bronze opacity-0 inline-block bg-gradient-to-r from-[#C89A6A] via-[#D4A574] to-[#B07A45] bg-clip-text text-transparent">Automating.</span>
            <span className="sh-word-bronze opacity-0 inline-block bg-gradient-to-r from-[#B07A45] via-[#D4A574] to-[#C89A6A] bg-clip-text text-transparent">Are</span>
            <span className="sh-word-bronze opacity-0 inline-block bg-gradient-to-r from-[#C89A6A] to-[#8E5E34] bg-clip-text text-transparent">You?</span>
          </h1>

          <p className="sh-sub text-lg lg:text-xl text-[#888] max-w-2xl mx-auto leading-relaxed mt-8 text-center opacity-0">
            We build AI-powered platforms, dashboards, and automation systems
            that run your business while you sleep.
          </p>

          <a href="#booking" className="sh-cta opacity-0 mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-[#B07A45] to-[#8E5E34] text-white font-semibold rounded-full px-8 py-4 shadow-[0_0_40px_rgba(176,122,69,0.25)] hover:shadow-[0_0_50px_rgba(176,122,69,0.35)] transition-all">
            Book Your Free AI Audit
            <ArrowRight size={18} />
          </a>
        </div>

        {/* ═══ Dashboard Container ═══ */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ perspective: '1200px' }}>

          <div className="sh-glow absolute opacity-0" style={{ width: 'min(80vw, 1000px)', bottom: '10%' }}>
            <div className="w-full h-[180px] bg-gradient-to-t from-[#B07A45]/12 via-[#B07A45]/4 to-transparent rounded-full blur-[50px]" />
          </div>

          <div className="sh-dashboard absolute opacity-0" style={{ width: 'min(78vw, 960px)', transformStyle: 'preserve-3d' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] border border-white/[0.06]">
              <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-6">
                  <div className="bg-[#0F0F0F] rounded-lg px-4 py-1.5 text-[13px] text-[#555] max-w-md mx-auto text-center font-mono flex items-center justify-center gap-2">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M5 0.5v4.5m0 2v4.5M0.5 5.5h4m1 0h4" stroke="#28C840" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    usevantix.com/dashboard
                  </div>
                </div>
              </div>
              <Image src="/dash-overview.png" alt="Vantix AI Command Center" width={960} height={640} className="w-full block" priority />
            </div>
          </div>

          {/* Stat cards */}
          <div className="sh-stat-1 absolute opacity-0" style={{ left: '3%', top: '20%' }}>
            <div className="bg-[#1C1C1C]/85 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#28C840] shadow-[0_0_6px_rgba(40,200,64,0.5)] animate-pulse" />
                <span className="text-[10px] text-[#777] uppercase tracking-wider font-medium">Live Agents</span>
              </div>
              <div className="text-2xl font-bold text-white">11</div>
              <div className="text-[11px] text-[#B07A45] mt-0.5">All systems operational</div>
            </div>
          </div>

          <div className="sh-stat-2 absolute opacity-0" style={{ right: '3%', top: '20%' }}>
            <div className="bg-[#1C1C1C]/85 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10l3-4 2 2 3-5" stroke="#B07A45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[10px] text-[#777] uppercase tracking-wider font-medium">Pipeline</span>
              </div>
              <div className="text-2xl font-bold text-white">$47K</div>
              <div className="text-[11px] text-[#28C840] mt-0.5">+340% this quarter</div>
            </div>
          </div>

          <div className="sh-stat-3 absolute opacity-0" style={{ left: '5%', bottom: '22%' }}>
            <div className="bg-[#1C1C1C]/85 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B07A45] shadow-[0_0_6px_rgba(176,122,69,0.5)]" />
                <span className="text-[10px] text-[#777] uppercase tracking-wider font-medium">Active Leads</span>
              </div>
              <div className="text-2xl font-bold text-white">108</div>
              <div className="text-[11px] text-[#B07A45] mt-0.5">Auto-generated by AI</div>
            </div>
          </div>

          <div className="sh-stat-4 absolute opacity-0" style={{ right: '5%', bottom: '22%' }}>
            <div className="bg-[#1C1C1C]/85 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/[0.06] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5F57] animate-pulse shadow-[0_0_6px_rgba(255,95,87,0.5)]" />
                <span className="text-[10px] text-[#777] uppercase tracking-wider font-medium">Operations</span>
              </div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-[11px] text-[#888] mt-0.5">Always building</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="sh-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0">
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#666]">Scroll to explore</span>
        <div className="w-[22px] h-[34px] rounded-full border-2 border-[#444] flex justify-center pt-2">
          <div className="w-[3px] h-[6px] rounded-full bg-[#B07A45] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
