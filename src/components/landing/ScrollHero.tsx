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

  // ═══ MOBILE: Full pinned scroll animation (matching desktop) ═══
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const ctx = gsap.context(() => {
      // ── ENTRANCE: Animate text in on page load ──
      const entrance = gsap.timeline({ delay: 0.2 });

      entrance.fromTo('.shm-badge',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      entrance.fromTo('.shm-word',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.15
      );
      entrance.fromTo('.shm-word-bronze',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        0.4
      );
      entrance.fromTo('.shm-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.7
      );
      entrance.fromTo('.shm-cta',
        { y: 15, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        0.85
      );
      entrance.fromTo('.shm-scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.0
      );

      // ── SCROLL: Pinned dashboard reveal ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // Text lifts away
      tl.to('.shm-text-wrap', {
        y: -100,
        opacity: 0,
        scale: 0.92,
        duration: 0.15,
        ease: 'power3.in',
      }, 0);

      tl.to('.shm-scroll-hint', { opacity: 0, duration: 0.05 }, 0);

      // Dashboard rises with 3D perspective
      tl.fromTo('.shm-dashboard',
        { y: '60vh', opacity: 0, rotateX: 18, scale: 0.7 },
        { y: 0, opacity: 1, rotateX: 6, scale: 0.85, duration: 0.25, ease: 'power3.out' },
        0.1
      );

      // Glow appears
      tl.fromTo('.shm-glow',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' },
        0.15
      );

      // Dashboard straightens
      tl.to('.shm-dashboard', {
        rotateX: 0,
        scale: 1,
        y: -5,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.35);

      // Stat pills fly in
      tl.fromTo('.shm-stat-1',
        { x: -50, y: 15, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.5
      );
      tl.fromTo('.shm-stat-2',
        { x: 50, y: -15, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.53
      );
      tl.fromTo('.shm-stat-3',
        { x: -40, y: -10, opacity: 0, scale: 0.85 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'back.out(1.3)' },
        0.56
      );

      // Background transition: dark to cream
      tl.fromTo('.shm-bg-cream',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.inOut' },
        0.6
      );

      // Everything fades for seamless exit
      tl.to('.shm-stage', {
        opacity: 0,
        y: 50,
        scale: 0.96,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.88);

    }, mobileRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section ref={mobileRef} className="relative h-screen overflow-hidden">
        {/* Dark background */}
        <div className="absolute inset-0 bg-[#0C0A09] z-0" />
        {/* Cream overlay for transition */}
        <div className="shm-bg-cream absolute inset-0 bg-[#F4EFE8] z-[1] opacity-0" />

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#B07A45]/[0.06] blur-[100px] z-[2]" />

        <div className="shm-stage relative z-10 h-full">

          {/* ═══ Text — visible on load ═══ */}
          <div className="shm-text-wrap absolute inset-0 flex flex-col items-center justify-center z-20 px-5">
            <div className="shm-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B07A45]/30 bg-[#1A1714]/80 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B07A45] animate-pulse" />
              <span className="text-xs text-[#A39B90] font-medium">AI-First Agency — Building 24/7</span>
            </div>

            <h1 className="text-[2.2rem] leading-[1.05] font-bold tracking-[-0.03em] text-[#F4EFE8] flex flex-wrap justify-center gap-x-[0.25em]">
              <span className="shm-word opacity-0 inline-block">Your</span>
              <span className="shm-word opacity-0 inline-block">Competitors</span>
              <span className="shm-word opacity-0 inline-block">Are</span>
            </h1>

            <h1 className="text-[2.2rem] leading-[1.05] font-bold tracking-[-0.03em] flex flex-wrap justify-center gap-x-[0.25em] mt-1 mb-4">
              <span className="shm-word-bronze opacity-0 inline-block text-[#B07A45]">Automating.</span>
              <span className="shm-word-bronze opacity-0 inline-block text-[#8E5E34]">Are</span>
              <span className="shm-word-bronze opacity-0 inline-block text-[#B07A45]">You?</span>
            </h1>

            <p className="shm-sub opacity-0 text-sm text-[#A39B90] max-w-xs mx-auto leading-relaxed text-center mb-6">
              We build AI-powered platforms, dashboards, and automation systems that run your business while you sleep.
            </p>

            <a href="#booking" className="shm-cta opacity-0 bronze-btn text-white font-semibold rounded-full px-7 py-3.5 shadow-md inline-flex items-center gap-2 text-sm">
              Book Your Free AI Audit
              <ArrowRight size={16} />
            </a>
          </div>

          {/* ═══ Dashboard Container ═══ */}
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ perspective: '800px' }}>

            <div className="shm-glow absolute opacity-0" style={{ width: '90vw', bottom: '12%' }}>
              <div className="w-full h-[100px] bg-gradient-to-t from-[#B07A45]/8 via-[#B07A45]/3 to-transparent rounded-full blur-[30px]" />
            </div>

            <div className="shm-dashboard absolute inset-x-4 opacity-0" style={{ transformStyle: 'preserve-3d' }}>
              <div className="relative rounded-xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]">
                <Image src="/hero-dashboard-new.jpg" alt="Vantix AI Dashboard" width={960} height={640} className="w-full block" priority />
              </div>
            </div>

            {/* Stat pills */}
            <div className="shm-stat-1 absolute opacity-0" style={{ left: '3%', top: '18%' }}>
              <div className="bg-[#EEE6DC] rounded-xl px-3 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-[#E3D9CD]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B07A45] animate-pulse" />
                  <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Live Agents</span>
                </div>
                <div className="text-lg font-bold text-[#1C1C1C]">11</div>
              </div>
            </div>

            <div className="shm-stat-2 absolute opacity-0" style={{ right: '3%', top: '18%' }}>
              <div className="bg-[#EEE6DC] rounded-xl px-3 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-[#E3D9CD]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B07A45]" />
                  <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Leads</span>
                </div>
                <div className="text-lg font-bold text-[#1C1C1C]">108</div>
              </div>
            </div>

            <div className="shm-stat-3 absolute opacity-0" style={{ left: '8%', bottom: '20%' }}>
              <div className="bg-[#EEE6DC] rounded-xl px-3 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-[#E3D9CD]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B07A45] animate-pulse" />
                  <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Uptime</span>
                </div>
                <div className="text-lg font-bold text-[#1C1C1C]">24/7</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="shm-scroll-hint absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-0">
          <span className="text-[9px] tracking-[0.25em] uppercase font-medium text-[#A39B90]">Scroll</span>
          <div className="w-[18px] h-[28px] rounded-full border-2 border-[#A39B90]/40 flex justify-center pt-1.5">
            <div className="w-[2.5px] h-[5px] rounded-full bg-[#B07A45]/60 animate-bounce" />
          </div>
        </div>
      </section>
    );
  }

  // ═══ DESKTOP ═══
  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background — cream */}
      <div className="absolute inset-0 bg-[#F4EFE8] z-0" />

      {/* Ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#B07A45]/[0.05] blur-[150px] top-[-200px] left-1/2 -translate-x-1/2" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#B07A45]/[0.03] blur-[100px] bottom-[20%] left-[15%]" />
      </div>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="rgba(176,122,69,0.08)" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#EEE6DC] to-transparent z-40 pointer-events-none" />

      <div className="sh-stage relative z-10 h-full">

        {/* ═══ Text — visible on load ═══ */}
        <div className="sh-text-wrap absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
          <div className="sh-badge opacity-0 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#D8C2A8]/60 bg-[#EEE6DC]/80 mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles size={14} className="text-[#B07A45]" />
            <span className="text-sm text-[#7A746C] font-medium tracking-wide">AI-First Agency — Building 24/7</span>
          </div>

          <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] text-[#1C1C1C] leading-[0.95] flex flex-wrap justify-center gap-x-[0.3em]">
            <span className="sh-word opacity-0 inline-block">Your</span>
            <span className="sh-word opacity-0 inline-block">Competitors</span>
            <span className="sh-word opacity-0 inline-block">Are</span>
          </h1>

          <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.95] flex flex-wrap justify-center gap-x-[0.3em] mt-2">
            <span className="sh-word-bronze opacity-0 inline-block text-[#B07A45]">Automating.</span>
            <span className="sh-word-bronze opacity-0 inline-block text-[#8E5E34]">Are</span>
            <span className="sh-word-bronze opacity-0 inline-block text-[#B07A45]">You?</span>
          </h1>

          <p className="sh-sub text-lg lg:text-xl text-[#7A746C] max-w-2xl mx-auto leading-relaxed mt-8 text-center opacity-0">
            We build AI-powered platforms, dashboards, and automation systems
            that run your business while you sleep.
          </p>

          <a href="#booking" className="sh-cta opacity-0 mt-8 inline-flex items-center gap-2 bronze-btn text-white font-semibold rounded-full px-8 py-4 shadow-md hover:shadow-lg hover:brightness-110 transition-all">
            Book Your Free AI Audit
            <ArrowRight size={18} />
          </a>
        </div>

        {/* ═══ Dashboard Container ═══ */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ perspective: '1200px' }}>

              <div className="sh-glow absolute opacity-0" style={{ width: 'min(80vw, 1000px)', bottom: '10%' }}>
            <div className="w-full h-[150px] bg-gradient-to-t from-[#B07A45]/8 via-[#B07A45]/3 to-transparent rounded-full blur-[40px]" />
          </div>

          <div className="sh-dashboard absolute opacity-0" style={{ width: 'min(78vw, 960px)', transformStyle: 'preserve-3d' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.18)]">
              <Image src="/hero-dashboard-new.jpg" alt="Vantix AI Command Center" width={960} height={640} className="w-full block" priority />
            </div>
          </div>

          {/* Stat cards */}
          <div className="sh-stat-1 absolute opacity-0" style={{ left: '3%', top: '20%' }}>
            <div className="bg-[#EEE6DC] rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E3D9CD] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B07A45] animate-pulse" />
                <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Live Agents</span>
              </div>
              <div className="text-2xl font-bold text-[#1C1C1C]">11</div>
              <div className="text-[11px] text-[#B07A45] mt-0.5">All systems operational</div>
            </div>
          </div>

          <div className="sh-stat-2 absolute opacity-0" style={{ right: '3%', top: '20%' }}>
            <div className="bg-[#EEE6DC] rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E3D9CD] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10l3-4 2 2 3-5" stroke="#B07A45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Pipeline</span>
              </div>
              <div className="text-2xl font-bold text-[#1C1C1C]">$47K</div>
              <div className="text-[11px] text-[#B07A45] mt-0.5">+340% this quarter</div>
            </div>
          </div>

          <div className="sh-stat-3 absolute opacity-0" style={{ left: '5%', bottom: '22%' }}>
            <div className="bg-[#EEE6DC] rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E3D9CD] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B07A45]" />
                <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Active Leads</span>
              </div>
              <div className="text-2xl font-bold text-[#1C1C1C]">108</div>
              <div className="text-[11px] text-[#B07A45] mt-0.5">Auto-generated by AI</div>
            </div>
          </div>

          <div className="sh-stat-4 absolute opacity-0" style={{ right: '5%', bottom: '22%' }}>
            <div className="bg-[#EEE6DC] rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E3D9CD] min-w-[170px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B07A45] animate-pulse" />
                <span className="text-[10px] text-[#7A746C] uppercase tracking-wider font-medium">Operations</span>
              </div>
              <div className="text-2xl font-bold text-[#1C1C1C]">24/7</div>
              <div className="text-[11px] text-[#7A746C] mt-0.5">Always building</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="sh-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0">
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#A39B90]">Scroll to explore</span>
        <div className="w-[22px] h-[34px] rounded-full border-2 border-[#D8C2A8]/50 flex justify-center pt-2">
          <div className="w-[3px] h-[6px] rounded-full bg-[#B07A45]/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
