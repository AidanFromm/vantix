'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Bot, Globe, Zap, BarChart3, Mail, Package,
  Phone, Sparkles, Clock, Users, TrendingUp, Shield, ChevronDown,
  MessageSquare, Calendar, Search, Cpu, CheckCircle2,
  Twitter, Linkedin, Instagram, Menu, X, Target, Layers, Rocket, Settings
} from 'lucide-react';

// ============================================
// VANTIX AI - Warm Neumorphic Landing Page
// ============================================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const woodButtonStyle = {
  background: `repeating-linear-gradient(95deg, transparent, transparent 3px, rgba(139,90,43,0.04) 3px, rgba(139,90,43,0.04) 5px), repeating-linear-gradient(85deg, transparent, transparent 7px, rgba(160,120,60,0.03) 7px, rgba(160,120,60,0.03) 9px), linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878, #E6C78C)`,
  border: '1px solid rgba(139,90,43,0.2)',
};

function WoodDivider() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div
        className="h-px w-full"
        style={{
          background: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(139,90,43,0.06) 4px, rgba(139,90,43,0.06) 6px), linear-gradient(to right, transparent, #D4A85C40, #C89B4E30, #D4A85C40, transparent)`,
        }}
      />
    </div>
  );
}

function useAnimateInView(threshold = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/case-studies' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-[#E8E5E0]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5C4033] font-extrabold text-sm" style={woodButtonStyle}>V</div>
          <span className="text-2xl font-extrabold text-[#3A3632] tracking-tight">vantix<span className="text-[#B8895A]">.</span></span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[#8C857C] hover:text-[#2D2A26] transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            className="px-6 py-2.5 text-[#5C4033] text-sm font-semibold rounded-full transition-all shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8]"
            style={woodButtonStyle}
          >
            Book a Call
          </a>
        </div>
        <button className="md:hidden text-[#2D2A26]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAFAFA]/95 backdrop-blur-xl border-b border-[#E8E5E0] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-[#8C857C] hover:text-[#2D2A26] transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="#booking" onClick={() => setMobileOpen(false)} className="px-6 py-2.5 text-[#5C4033] text-sm font-semibold rounded-full text-center shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff]" style={woodButtonStyle}>
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ============================================
// GRID BACKGROUND
// ============================================
function GridBackground({ variant = 'grid' }: { variant?: 'grid' | 'solid' }) {
  if (variant === 'solid') {
    return <div className="absolute inset-0 bg-[#FAFAFA]" />;
  }
  return (
    <div className="absolute inset-0 bg-[#FAFAFA]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #E8E5E0 1px, transparent 1px), linear-gradient(to bottom, #E8E5E0 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBackground />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,137,90,0.06)_0%,transparent_60%)]" />

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C5C3BE] bg-white mb-8 shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff]"
        >
          <span className="w-2 h-2 rounded-full bg-[#B8895A] animate-pulse" />
          <span className="text-sm text-[#8C857C] font-medium">2 Humans + 2 AI Assistants — Building 24/7</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#2D2A26] leading-[0.93] tracking-tight mb-8"
        >
          Your Competitors Are
          <br />
          Automating. <span className="text-[#B8895A]">Are You?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg sm:text-xl text-[#8C857C] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We deploy AI systems that reclaim 40+ hours of your week, capture every lead, and run your operations — while you sleep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#booking"
            className="group px-8 py-4 text-[#5C4033] font-semibold rounded-full transition-all inline-flex items-center justify-center gap-2 shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] hover:shadow-[inset_4px_4px_8px_#b8965f,inset_-4px_-4px_8px_#e8d4a8] hover:scale-[1.02]"
            style={woodButtonStyle}
          >
            Book Your Free AI Audit
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-sm text-[#B8895A]/70 mt-8 font-medium"
        >
          122-page platform built in 3 weeks · $50K+ in projects delivered · 24/7 AI operations
        </motion.p>
      </div>
    </section>
  );
}

// ============================================
// TRUST BAR
// ============================================
function TrustBar() {
  const { ref, inView } = useAnimateInView();

  const metrics = [
    { value: '40+', label: 'Hours Saved Weekly' },
    { value: '122', label: 'Pages in 3 Weeks' },
    { value: '24/7', label: 'AI Never Sleeps' },
    { value: '85%', label: 'Faster Response Time' },
  ];

  return (
    <section className="relative py-14 border-y border-[#E8E5E0] bg-[#FAFAFA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {metrics.map((m, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-[#B8895A]">{m.value}</span>
              <span className="text-sm text-[#8C857C] mt-1">{m.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// THE PROBLEM
// ============================================
function ProblemSection() {
  const { ref, inView } = useAnimateInView();

  const before = [
    'Drowning in repetitive tasks that eat your entire week',
    'Losing leads because nobody responded fast enough',
    'Spending hours writing emails that barely convert',
    'Making decisions based on gut feeling, not data',
    'Hiring more staff just to keep the lights on',
  ];

  const after = [
    'AI handles 90% of inquiries instantly — day and night',
    'Every lead captured, qualified, and followed up in seconds',
    'Personalized emails written, sent, and optimized automatically',
    'Real-time analytics telling you exactly what to do next',
    'Scale operations without adding a single headcount',
  ];

  return (
    <section className="py-24 relative">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            The Problem
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26] leading-tight max-w-3xl mx-auto">
            You&apos;re Working 60-Hour Weeks on Tasks AI Can Handle in Seconds
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="relative p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#E8E5E0]/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#C5C3BE]" />
              <span className="text-[#8C857C] font-semibold text-sm uppercase tracking-wider">Before Vantix</span>
            </div>
            <ul className="space-y-4">
              {before.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#8C857C]">
                  <X size={16} className="text-[#C5C3BE] mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="relative p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#B8895A]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#B8895A]" />
              <span className="text-[#B8895A] font-semibold text-sm uppercase tracking-wider">After Vantix</span>
            </div>
            <ul className="space-y-4">
              {after.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#2D2A26]">
                  <CheckCircle2 size={16} className="text-[#B8895A] mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SERVICES
// ============================================
const services = [
  { icon: Bot, title: 'AI Chatbots & Agents', desc: 'Your best salesperson — never sleeps, never calls in sick, qualifies every lead and books every appointment. 24/7.' },
  { icon: Globe, title: 'AI-Powered Websites', desc: 'Self-optimizing platforms that learn from every visitor. More conversions. More revenue. Zero guesswork.' },
  { icon: Search, title: 'Automated Lead Gen', desc: 'Find, qualify, and nurture prospects across every channel — while you focus on closing deals.' },
  { icon: BarChart3, title: 'AI Analytics', desc: 'Know exactly what&apos;s happening, why it&apos;s happening, and what to do next. Decisions powered by data, not hunches.' },
  { icon: Mail, title: 'AI Email & Outreach', desc: 'Personalized at scale. Every email tailored, timed, and optimized for maximum response rates.' },
  { icon: Package, title: 'Smart Inventory', desc: 'Demand prediction meets auto-reorder. Never overstock. Never run out. Never miss a sale.' },
  { icon: Phone, title: 'AI Phone Agents', desc: 'Answer calls, book appointments, handle inquiries. Your AI receptionist sounds human and works around the clock.' },
  { icon: Sparkles, title: 'Custom AI Systems', desc: 'If your business does it, we can automate it. Bespoke AI built for your exact workflow and goals.' },
];

function ServicesSection() {
  const { ref, inView } = useAnimateInView();

  return (
    <section id="services" className="py-24 relative">
      <GridBackground variant="solid" />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            What We Deploy
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26] leading-tight">
            AI That Runs Your Business.<br />Not Just Advises On It.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C857C] mt-4 max-w-2xl mx-auto">
            While competitors write whitepapers about AI, we deploy systems that generate revenue from day one.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_28px_#c0bcb6,-12px_-12px_28px_#ffffff] border border-transparent hover:border-[#B8895A]/20 transition-all cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] flex items-center justify-center mb-5 group-hover:bg-[#B8895A]/10 transition-colors shadow-[inset_2px_2px_4px_#d1cdc7,inset_-2px_-2px_4px_#ffffff]">
                <s.icon size={22} className="text-[#B8895A]" />
              </div>
              <h3 className="text-[#2D2A26] font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-[#8C857C] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CASE STUDY HIGHLIGHT
// ============================================
function CaseStudyHighlight() {
  const { ref, inView } = useAnimateInView();

  return (
    <section className="py-24 relative">
      <GridBackground variant="solid" />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4 text-center">
            Featured Work
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="relative p-8 md:p-12 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#B8895A]/15 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8895A]/5 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#2D2A26] mb-2">Secured Tampa</h3>
                <p className="text-[#B8895A] text-sm font-medium mb-6">
                  From Instagram DMs to a 122-page e-commerce empire — in 3 weeks.
                </p>
                <p className="text-[#8C857C] leading-relaxed mb-6">
                  Shopify shut them down. They were running a growing sneaker business through Instagram DMs. We built a complete AI-powered e-commerce platform with automated inventory, POS integration, and intelligent customer service — replacing everything Shopify couldn&apos;t handle.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['E-Commerce', 'POS Integration', 'AI Automation', 'Custom Platform'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full border border-[#B8895A]/20 bg-[#B8895A]/5 text-[#B8895A] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/case-studies/secured-tampa"
                  className="group inline-flex items-center gap-2 text-[#B8895A] font-semibold hover:text-[#96703F] transition-colors"
                >
                  Read the Full Case Study
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '122', label: 'Pages Built' },
                  { value: '3 wks', label: 'Concept to Launch' },
                  { value: '50+', label: 'API Routes' },
                  { value: '24/7', label: 'AI Operations Live' },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="p-5 rounded-2xl bg-[#FAFAFA] shadow-[inset_2px_2px_4px_#d1cdc7,inset_-2px_-2px_4px_#ffffff] text-center"
                  >
                    <div className="text-2xl font-bold text-[#B8895A]">{m.value}</div>
                    <div className="text-xs text-[#8C857C] mt-1">{m.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS
// ============================================
function ProcessSection() {
  const { ref, inView } = useAnimateInView();

  const steps = [
    { num: '01', title: 'Free AI Audit', desc: 'We map every bottleneck, manual process, and missed opportunity in your business. You get a clear picture of what AI can fix — and the ROI to expect.', icon: Search },
    { num: '02', title: 'Custom Blueprint', desc: 'A tailored strategy with projected savings, implementation timeline, and exactly what your AI systems will do. No vague proposals.', icon: Target },
    { num: '03', title: 'Rapid Deployment', desc: 'We build and deploy your AI systems in weeks, not months. Half our team works while you sleep — so timelines that shock you are our standard.', icon: Rocket },
    { num: '04', title: 'Scale & Optimize', desc: 'Your AI gets smarter every day. We monitor, optimize, and scale what works — so your business compounds without adding headcount.', icon: TrendingUp },
  ];

  return (
    <section id="process" className="py-24 relative">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            From First Call to Full Automation in Weeks
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="relative p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] flex items-center justify-center mx-auto mb-5 shadow-[inset_2px_2px_4px_#d1cdc7,inset_-2px_-2px_4px_#ffffff]">
                <step.icon size={22} className="text-[#B8895A]" />
              </div>
              <span className="text-[#C5C3BE] text-xs font-mono font-bold">{step.num}</span>
              <h3 className="text-lg font-bold text-[#2D2A26] mt-1 mb-2">{step.title}</h3>
              <p className="text-[#8C857C] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIAL
// ============================================
function TestimonialSection() {
  const { ref, inView } = useAnimateInView();

  return (
    <section className="py-24 relative">
      <GridBackground variant="solid" />
      <div className="max-w-4xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            Client Results
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26] mb-12">
            Don&apos;t Take Our Word For It
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="relative p-10 md:p-14 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#E8E5E0]/50"
          >
            <MessageSquare size={32} className="text-[#B8895A]/30 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl text-[#2D2A26] font-medium leading-relaxed mb-8">
              &ldquo;Shopify shut us down and we were stuck selling through Instagram DMs. Vantix built us a complete custom platform — 122 pages, POS integration, shipping, everything — in 3 weeks. It&apos;s better than anything Shopify could have done.&rdquo;
            </blockquote>
            <div>
              <p className="text-[#2D2A26] font-semibold">Dave</p>
              <p className="text-[#8C857C] text-sm">Founder, SecuredTampa</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// ROI SECTION
// ============================================
function ROISection() {
  const { ref, inView } = useAnimateInView();

  const stats = [
    { value: '40+', label: 'Hours Reclaimed Per Week', icon: Clock },
    { value: '3x', label: 'More Qualified Leads', icon: TrendingUp },
    { value: '24/7', label: 'Operations Never Stop', icon: Shield },
    { value: '$0', label: 'Extra Hires Needed', icon: Users },
  ];

  return (
    <section id="roi" className="py-24 relative">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            Your ROI
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            The Math Speaks for Itself
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff]"
            >
              <s.icon size={28} className="text-[#B8895A] mx-auto mb-4" />
              <div className="text-3xl md:text-4xl font-bold text-[#B8895A] mb-1">{s.value}</div>
              <div className="text-sm text-[#8C857C]">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TEAM
// ============================================
function TeamSection() {
  const { ref, inView } = useAnimateInView();

  const team = [
    {
      name: 'Kyle Ventura',
      role: 'Founder & AI Strategist',
      desc: 'Obsessed with one question: what would your business look like if it ran itself? Kyle architects AI systems that answer that — with measurable ROI on every project.',
      photo: '/team-kyle.jpg',
    },
    {
      name: 'Aidan Fromm',
      role: 'Co-Founder & Lead Engineer',
      desc: 'Turns ambitious AI blueprints into production-ready systems. Built a 122-page e-commerce platform in 3 weeks. Moves fast. Ships faster.',
      photo: '/team-aidan.jpg',
    },
  ];

  return (
    <section id="team" className="py-24 relative">
      <GridBackground variant="solid" />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            Who We Are
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            A 4-Person Team.<br />Half of Us Never Sleep.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C857C] mt-4 max-w-2xl mx-auto">
            2 humans who obsess over your success. 2 AI assistants who build, research, and optimize around the clock. Small enough to care. Powerful enough to deliver enterprise results.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {team.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-10 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] text-center"
            >
              <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] border-2 border-white/80">
                <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-[#2D2A26]">{t.name}</h3>
              <p className="text-[#B8895A] text-sm font-medium mb-4">{t.role}</p>
              <p className="text-[#8C857C] text-sm leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FAFAFA]/50 transition-colors"
      >
        <span className="text-[#2D2A26] font-medium pr-4">{q}</span>
        <ChevronDown size={18} className={`text-[#C5C3BE] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[#8C857C] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const { ref, inView } = useAnimateInView();

  const faqs = [
    { q: 'How fast can you deploy an AI system?', a: 'Most systems go live in 2–4 weeks. Simple automations and chatbots can launch in under a week. We built a 122-page e-commerce platform with POS integration in just 3 weeks — speed is built into our DNA because half our team works 24/7.' },
    { q: 'What if AI makes mistakes with my customers?', a: 'Every system includes human oversight and escalation paths. AI handles the volume — edge cases route to your team. We continuously train and optimize, so accuracy improves over time. You stay in control.' },
    { q: 'Do I need technical knowledge?', a: 'None. We build everything with simple dashboards you can manage from your phone. Full training included. Ongoing support included. If you can send an email, you can run your AI systems.' },
    { q: 'What does it cost?', a: 'Projects typically start at $4,500 for focused automations and scale based on complexity. Every quote includes projected ROI so you can see the payback before you commit. Book a free audit — we\'ll give you real numbers, not a range.' },
    { q: 'Can AI really replace hiring more staff?', a: 'It augments and eliminates the need. One AI system can handle the workload of 3–5 employees for specific functions — customer service, lead qualification, data entry, scheduling. Your existing team gets freed up for high-value work that actually grows the business.' },
    { q: 'What happens if something breaks?', a: 'We monitor every system 24/7. Issues get caught before you notice them. All clients get priority support with guaranteed response times. We treat your downtime like our emergency — because it is.' },
  ];

  return (
    <section id="faq" className="py-24 relative">
      <GridBackground />
      <div className="max-w-3xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            FAQ
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            Every Question. Answered.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((f, i) => (
            <motion.div key={i} variants={fadeUp}>
              <FAQItem q={f.q} a={f.a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// BOOKING SECTION (Calendly)
// ============================================
function BookingSection() {
  const { ref, inView } = useAnimateInView();

  return (
    <section id="booking" className="py-24 relative">
      <GridBackground variant="solid" />
      <div className="max-w-4xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            Start This Week
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26] mb-4">
            Book Your Free AI Audit
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C857C] text-lg max-w-2xl mx-auto">
            30 minutes. Zero pressure. We&apos;ll map every AI opportunity in your business and show you exactly what the ROI looks like. Pick a time below.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#E8E5E0] overflow-hidden"
          style={{ minHeight: '660px' }}
        >
          <iframe
            src="https://calendly.com/usevantix/consultation"
            width="100%"
            height="660"
            frameBorder="0"
            title="Schedule a consultation"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus('sending');
    try {
      const { supabase, createLead } = await import('@/lib/supabase');
      try {
        await supabase.from('chat_leads').insert({
          visitor_name: form.name,
          email: form.email,
          phone: form.phone || null,
          interested_in: form.message || null,
        });
      } catch { /* table may not exist */ }
      try {
        await createLead({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          source: 'Website Form',
          status: 'new',
          notes: form.message || undefined,
          score: 0,
          tags: ['website-contact'],
        });
      } catch { /* table may not exist */ }
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div id="contact-form" className="max-w-lg mx-auto mt-12 bg-white rounded-2xl p-8 shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-[#B8895A]" />
        <h3 className="text-xl font-bold text-[#2D2A26] mb-2">You&apos;re In.</h3>
        <p className="text-[#8C857C]">We&apos;ll reach out within 24 hours with next steps. Check your inbox.</p>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="max-w-lg mx-auto mt-12 bg-white rounded-2xl p-8 shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
      <p className="text-center text-[#8C857C] text-sm mb-6">Prefer to type? Drop us a message and we&apos;ll follow up within 24 hours.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#5C4033] mb-1.5">Name *</label>
          <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] bg-[#FAFAFA] text-[#2D2A26] placeholder-[#C5C3BE] focus:outline-none focus:border-[#B8895A] focus:ring-1 focus:ring-[#B8895A]/30 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4033] mb-1.5">Email *</label>
          <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] bg-[#FAFAFA] text-[#2D2A26] placeholder-[#C5C3BE] focus:outline-none focus:border-[#B8895A] focus:ring-1 focus:ring-[#B8895A]/30 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4033] mb-1.5">Phone <span className="text-[#C5C3BE]">(optional)</span></label>
          <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] bg-[#FAFAFA] text-[#2D2A26] placeholder-[#C5C3BE] focus:outline-none focus:border-[#B8895A] focus:ring-1 focus:ring-[#B8895A]/30 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4033] mb-1.5">What&apos;s eating your time?</label>
          <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Tell us about the manual tasks, bottlenecks, or goals you want AI to tackle..." className="w-full px-4 py-3 rounded-xl border border-[#E8E5E0] bg-[#FAFAFA] text-[#2D2A26] placeholder-[#C5C3BE] focus:outline-none focus:border-[#B8895A] focus:ring-1 focus:ring-[#B8895A]/30 transition-all resize-none" />
        </div>
        <button type="submit" disabled={status === 'sending'} className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 text-[#5C4033] font-bold text-base rounded-full transition-all shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8] hover:scale-[1.01] disabled:opacity-60" style={woodButtonStyle}>
          {status === 'sending' ? 'Sending...' : 'Start Automating This Week'}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
      </div>
    </form>
  );
}

function FinalCTA() {
  const { ref, inView } = useAnimateInView();

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA] via-[#F0EDE8] to-[#FAFAFA]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,137,90,0.08)_0%,transparent_60%)]" />
      <div className="max-w-4xl mx-auto px-6 text-center relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2A26] leading-tight mb-6">
            Every Day You Wait,
            <br />
            <span className="text-[#B8895A]">Your Competitors Pull Ahead.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C857C] text-lg max-w-2xl mx-auto mb-4">
            Book a free AI audit. In 30 minutes, we&apos;ll show you exactly which tasks to automate first and what the payback looks like. No commitment. No pressure.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[#2D2A26] font-semibold text-lg mb-10">
            <a href="tel:9084987753" className="hover:text-[#B8895A] transition-colors inline-flex items-center gap-2">
              <Phone size={18} />
              (908) 498-7753
            </a>
          </motion.p>
          <motion.div variants={fadeUp}>
            <a
              href="#booking"
              className="group inline-flex items-center gap-2 px-10 py-5 text-[#5C4033] font-bold text-lg rounded-full transition-all shadow-[10px_10px_24px_#c8c4be,-10px_-10px_24px_#ffffff] hover:shadow-[inset_4px_4px_8px_#b8965f,inset_-4px_-4px_8px_#e8d4a8] hover:scale-[1.02]"
              style={woodButtonStyle}
            >
              <Calendar size={20} />
              Book Your Free AI Audit
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          <motion.p variants={fadeUp} className="text-[#B8895A]/60 text-sm mt-6 font-medium">
            Limited availability — we take on 3 new clients per month.
          </motion.p>
          <motion.div variants={fadeUp}>
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="border-t border-[#E8E5E0] py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5C4033] font-extrabold text-sm" style={woodButtonStyle}>V</div>
              <span className="text-2xl font-extrabold text-[#3A3632] tracking-tight">vantix<span className="text-[#B8895A]">.</span></span>
            </div>
            <p className="text-[#8C857C] mt-4 max-w-sm leading-relaxed">
              AI systems that generate revenue, eliminate busywork, and scale your operations — deployed in weeks, not months.
            </p>
          </div>
          <div>
            <h4 className="text-[#2D2A26] font-semibold text-sm mb-4">Pages</h4>
            <ul className="space-y-2">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Work', href: '/case-studies' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Blog', href: '/blog' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[#8C857C] hover:text-[#2D2A26] text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#2D2A26] font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-[#8C857C]">
              <li>
                <a href="tel:9084987753" className="hover:text-[#2D2A26] transition-colors">(908) 498-7753</a>
              </li>
              <li>
                <a href="mailto:usevantix@gmail.com" className="hover:text-[#2D2A26] transition-colors">usevantix@gmail.com</a>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="text-[#C5C3BE] hover:text-[#B8895A] transition-colors">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#E8E5E0] pt-8 text-center">
          <p className="text-[#C5C3BE] text-sm">
            {new Date().getFullYear()} Vantix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export function FuturisticLanding() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAFAFA] text-[#2D2A26] min-h-screen selection:bg-[#B8895A]/20 selection:text-[#2D2A26] scroll-smooth">
      <Navigation />
      <HeroSection />
      <TrustBar />
      <WoodDivider />
      <ProblemSection />
      <WoodDivider />
      <ServicesSection />
      <WoodDivider />
      <ProcessSection />
      <WoodDivider />
      <CaseStudyHighlight />
      <WoodDivider />
      <TestimonialSection />
      <WoodDivider />
      <ROISection />
      <WoodDivider />
      <TeamSection />
      <WoodDivider />
      <FAQSection />
      <WoodDivider />
      <BookingSection />
      <WoodDivider />
      <FinalCTA />
      <Footer />
    </div>
  );
}
