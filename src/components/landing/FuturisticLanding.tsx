'use client';

import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowRight, Bot, Globe, Zap, BarChart3, Mail, Package,
  Phone, Sparkles, Clock, Users, TrendingUp, Shield, ChevronDown,
  MessageSquare, Calendar, Search, Cpu, CheckCircle2,
  Menu, X, Target, Layers, Rocket, Settings,
  Star, Quote
} from 'lucide-react';

// ============================================
// VANTIX AI - Clean Authority Landing Page
// ============================================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 12 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const bronzeButtonClass = "bronze-btn text-white font-semibold rounded-full px-8 py-4 shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200";

function useAnimateInView(threshold = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

// ============================================
// ANIMATED COUNTER HOOK
// ============================================
function useCounter(target: number, inView: boolean, duration = 2000) {
  const hasAnimated = useRef(false);
  const [count, setCount] = useState(target);
  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    setCount(0);
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [inView, target, duration]);
  return count;
}

// ============================================
// TYPEWRITER HOOK
// ============================================
function useTypewriter(phrases: string[], typingSpeed = 60, deletingSpeed = 30, pauseMs = 2000) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, typingSpeed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, deletingSpeed);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return text;
}

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      className="fixed top-0 left-0 right-0 z-50 bg-[#F4EFE8]/95 backdrop-blur-sm border-b border-[#E3D9CD]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <Image src="/logo-nav.png" alt="Vantix logo" width={36} height={36} className="w-9 h-9 object-contain" priority />
          <span className="text-2xl font-extrabold text-[#B07A45] tracking-tight">vantix<span className="text-[#8E5E34]">.</span></span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[#7A746C] hover:text-[#B07A45] transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            className={`${bronzeButtonClass} rounded-full px-6 py-2.5 text-sm`}
          >
            Book a Call
          </a>
        </div>
        <button className="md:hidden text-[#B07A45]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F4EFE8]/95 backdrop-blur-sm border-b border-[#E3D9CD] overflow-hidden"
          >
            <div className="px-5 py-3 flex flex-col gap-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-[#7A746C] hover:text-[#B07A45] transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="#booking" onClick={() => setMobileOpen(false)} className={`${bronzeButtonClass} rounded-full px-6 py-2.5 text-sm text-center`}>
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
// HERO SECTION
// ============================================
function HeroSection() {
  const typedText = useTypewriter([
    'We automate customer support',
    'We build custom platforms',
    'We deploy AI that never sleeps',
    'We scale your operations',
  ]);

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#F4EFE8]">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4EFE8] via-[#F4EFE8] to-[#EEE6DC] z-0" />
      {/* Decorative bronze accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 sm:h-32 bg-gradient-to-b from-transparent to-[#B07A45]/20 z-10" />

      <div className="relative z-20 max-w-5xl mx-auto px-5 sm:px-6 text-center pt-28 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C2A8]/60 bg-[#EEE6DC]/80 mb-6 sm:mb-8 shadow-sm backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#8E5E34] animate-pulse" />
          <span className="text-xs sm:text-sm text-[#7A746C] font-medium">2 Humans + 2 AI Assistants - Building 24/7</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[2.5rem] leading-[1] sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-[#1C1C1C] sm:leading-[0.93] mb-4 sm:mb-8"
        >
          Your Competitors Are
          <br />
          <span className="text-[#B07A45]">Automating.</span> <span className="text-[#8E5E34]">Are You?</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="h-10 sm:h-12 flex items-center justify-center mb-6 sm:mb-8"
        >
          <p className="text-base sm:text-lg text-[#7A746C] max-w-2xl mx-auto leading-relaxed">
            <span>{typedText}</span>
            <span className="inline-block w-0.5 h-5 bg-[#8E5E34] ml-1 animate-pulse" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#booking"
            className={`group ${bronzeButtonClass} rounded-full inline-flex items-center justify-center gap-2 hover:scale-[1.02]`}
          >
            Book Your Free AI Audit
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-6 sm:mt-10 flex items-center justify-center gap-5 sm:gap-8"
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[#B07A45]">122</p>
            <p className="text-[10px] sm:text-xs text-[#7A746C] uppercase tracking-wider mt-1">Pages Built</p>
          </div>
          <div className="w-px h-8 bg-[#E3D9CD]" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[#B07A45]">3 Weeks</p>
            <p className="text-[10px] sm:text-xs text-[#7A746C] uppercase tracking-wider mt-1">Delivery</p>
          </div>
          <div className="w-px h-8 bg-[#E3D9CD]" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[#B07A45]">24/7</p>
            <p className="text-[10px] sm:text-xs text-[#7A746C] uppercase tracking-wider mt-1">AI Operations</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// ANIMATED COUNTER TRUST BAR
// ============================================
function AnimatedCounterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const hours = useCounter(40, inView);
  const pages = useCounter(122, inView);
  const weeks = useCounter(3, inView, 1000);

  const metrics = [
    { value: `${hours}+`, label: 'Hours Saved Per Client Weekly' },
    { value: `${pages}`, label: 'Pages Built for SecuredTampa' },
    { value: `${weeks}`, label: 'Week Average Delivery' },
    { value: '24/7', label: 'AI Operations' },
  ];

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {metrics.map((m, i) => (
            <motion.div key={i} variants={popIn} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-[#8E5E34] tabular-nums">{m.value}</span>
              <span className="text-sm text-[#7A746C] mt-1">{m.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// BEFORE / AFTER INTERACTIVE COMPARISON
// ============================================
function BeforeAfterSection() {
  const [showAfter, setShowAfter] = useState(false);
  const { ref, inView } = useAnimateInView();

  const before = [
    'Manual processes',
    'Scattered tools',
    '9-5 operations',
    'Slow response times',
  ];

  const after = [
    'Automated workflows',
    'Unified platform',
    '24/7 AI operations',
    'Instant responses',
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative" ref={ref}>
      <div className="max-w-5xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            The Transformation
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45]">
            See the Difference
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative"
        >
          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setShowAfter(!showAfter)}
              className="relative flex items-center bg-[#EEE6DC] rounded-full p-1.5 shadow-sm border border-[#E3D9CD]"
            >
              <span className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${!showAfter ? 'bg-[#B07A45] text-white' : 'text-[#7A746C]'}`}>
                Before
              </span>
              <span className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${showAfter ? 'bg-[#B07A45] text-white' : 'text-[#7A746C]'}`}>
                After Vantix
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
            <AnimatePresence mode="wait">
              {!showAfter ? (
                <motion.div
                  key="before"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="md:col-span-2 p-4 sm:p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-[#E3D9CD]" />
                    <span className="text-[#7A746C] font-semibold text-sm uppercase tracking-wider">Without AI Automation</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {before.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#EEE6DC]">
                        <X size={18} className="text-[#E3D9CD] shrink-0" />
                        <span className="text-[#7A746C] font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="after"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="md:col-span-2 p-4 sm:p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#8E5E34]/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-[#8E5E34]" />
                    <span className="text-[#8E5E34] font-semibold text-sm uppercase tracking-wider">With Vantix AI</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {after.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#8E5E34]/5">
                        <CheckCircle2 size={18} className="text-[#8E5E34] shrink-0" />
                        <span className="text-[#B07A45] font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
    'AI handles 90% of inquiries instantly - day and night',
    'Every lead captured, qualified, and followed up in seconds',
    'Personalized emails written, sent, and optimized automatically',
    'Real-time analytics telling you exactly what to do next',
    'Scale operations without adding a single headcount',
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            The Problem
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45] leading-tight max-w-3xl mx-auto">
            You&apos;re Working 60-Hour Weeks on Tasks AI Can Handle in Seconds
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeLeft} className="relative p-4 sm:p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#E3D9CD]" />
              <span className="text-[#7A746C] font-semibold text-sm uppercase tracking-wider">Before Vantix</span>
            </div>
            <ul className="space-y-4">
              {before.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#7A746C] text-base leading-relaxed">
                  <X size={16} className="text-[#E3D9CD] mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeRight} className="relative p-4 sm:p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#8E5E34]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#8E5E34]" />
              <span className="text-[#8E5E34] font-semibold text-sm uppercase tracking-wider">After Vantix</span>
            </div>
            <ul className="space-y-4">
              {after.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#B07A45] text-base leading-relaxed">
                  <CheckCircle2 size={16} className="text-[#8E5E34] mt-1 shrink-0" />
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
  { icon: Bot, title: 'AI Chatbots & Agents', desc: 'Your best salesperson - never sleeps, never calls in sick, qualifies every lead and books every appointment. 24/7.' },
  { icon: Globe, title: 'AI-Powered Websites', desc: 'Self-optimizing platforms that learn from every visitor. More conversions. More revenue. Zero guesswork.' },
  { icon: Search, title: 'Automated Lead Gen', desc: 'Find, qualify, and nurture prospects across every channel - while you focus on closing deals.' },
  { icon: BarChart3, title: 'AI Analytics', desc: 'Know exactly what\u2019s happening, why it\u2019s happening, and what to do next. Decisions powered by data, not hunches.' },
  { icon: Mail, title: 'AI Email & Outreach', desc: 'Personalized at scale. Every email tailored, timed, and optimized for maximum response rates.' },
  { icon: Package, title: 'Smart Inventory', desc: 'Demand prediction meets auto-reorder. Never overstock. Never run out. Never miss a sale.' },
  { icon: Phone, title: 'AI Phone Agents', desc: 'Answer calls, book appointments, handle inquiries. Your AI receptionist sounds human and works around the clock.' },
  { icon: Sparkles, title: 'Custom AI Systems', desc: 'If your business does it, we can automate it. Bespoke AI built for your exact workflow and goals.' },
];

function ServicesSection() {
  return (
    <section id="services" className="py-8 sm:py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            What We Deploy
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45] leading-tight">
            AI That Runs Your Business.<br />Not Just Advises On It.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#7A746C] text-base leading-relaxed mt-4 max-w-2xl mx-auto">
            While competitors write whitepapers about AI, we deploy systems that generate revenue from day one.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              className="group relative p-4 sm:p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD] hover:border-[#8E5E34]/20 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EEE6DC] flex items-center justify-center mb-5 group-hover:bg-[#8E5E34]/10 transition-colors">
                <s.icon size={22} className="text-[#8E5E34]" />
              </div>
              <h3 className="text-[#B07A45] font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-[#7A746C] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PRODUCT SHOWCASE (AI Dashboard + Workflow)
// ============================================
function ProductShowcase() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* AI Dashboard Mockup */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12 lg:mb-16"
        >
          <motion.div variants={fadeLeft} className="lg:w-5/12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">AI Dashboards</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] leading-tight mb-4">
              See everything your AI is doing. In real time.
            </h3>
            <p className="text-[#7A746C] leading-relaxed mb-6">
              Monitor active AI agents, track automation performance, and measure revenue impact - all from one unified command center.
            </p>
            <a href="#booking" className={bronzeButtonClass + " inline-flex items-center gap-2 text-sm px-6 py-3"}>
              Book a Demo <ArrowRight size={16} />
            </a>
          </motion.div>
          <motion.div variants={fadeRight} className="lg:w-7/12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C89A6A]/20 to-transparent rounded-2xl blur-2xl" />
              <Image
                src="/mockup-1.png"
                alt="Vantix AI Dashboard showing real-time agent monitoring and automation performance metrics"
                width={800}
                height={500}
                className="relative rounded-2xl shadow-2xl border border-[#E3D9CD]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Workflow Builder Mockup */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row-reverse items-center gap-12"
        >
          <motion.div variants={fadeRight} className="lg:w-5/12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">Workflow Automation</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] leading-tight mb-4">
              Automate mission-critical workflows with AI
            </h3>
            <p className="text-[#7A746C] leading-relaxed mb-6">
              AI agents that handle calls, live chats, outreach, and customer operations - connected in intelligent workflows that run 24/7.
            </p>
            <a href="#booking" className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-full border border-[#D8C2A8] text-[#1C1C1C] font-medium hover:bg-[#EEE6DC] transition-colors">
              Schedule a Call <ArrowRight size={16} />
            </a>
          </motion.div>
          <motion.div variants={fadeLeft} className="lg:w-7/12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-[#C89A6A]/20 to-transparent rounded-2xl blur-2xl" />
              <Image
                src="/mockup-2.png"
                alt="Vantix workflow automation builder with connected AI agents and intelligent routing"
                width={800}
                height={500}
                className="relative rounded-2xl shadow-2xl border border-[#E3D9CD]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FLOATING TECH STACK
// ============================================
function TechStackSection() {
  const techs = [
    'OpenClaw', 'Claude Code', 'Replicate', 'Gemini', 'Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Framer Motion', 'OpenAI', 'Vercel', 'Node.js', 'Resend', 'Twilio', 'n8n', 'Cal.com', 'GoShippo',
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            Our Stack
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45]">
            Built With the Best
          </motion.h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {techs.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="px-6 py-4 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD] text-[#B07A45] font-semibold text-sm"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CASE STUDY HIGHLIGHT
// ============================================
function CaseStudyHighlight() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4 text-center">
            Featured Work
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="relative p-5 md:p-8 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#8E5E34]/15 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8E5E34]/5 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-6 sm:gap-10 items-center">
              <motion.div variants={fadeLeft}>
                <h3 className="text-2xl md:text-3xl font-bold text-[#B07A45] mb-2">Secured Tampa</h3>
                <p className="text-[#8E5E34] text-sm font-medium mb-6">
                  From Instagram DMs to a 122-page e-commerce empire - in 3 weeks.
                </p>
                <p className="text-[#7A746C] text-base leading-relaxed mb-6">
                  Shopify shut them down. They were running a growing sneaker business through Instagram DMs. We built a complete AI-powered e-commerce platform with automated inventory, POS integration, and intelligent customer service - replacing everything Shopify couldn&apos;t handle.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['E-Commerce', 'POS Integration', 'AI Automation', 'Custom Platform'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full border border-[#8E5E34]/20 bg-[#8E5E34]/5 text-[#8E5E34] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/case-studies/secured-tampa"
                  className="group inline-flex items-center gap-2 text-[#8E5E34] font-semibold hover:text-[#B07A45] transition-colors"
                >
                  Read the Full Case Study
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '122', label: 'Pages Built' },
                  { value: '3 Weeks', label: 'Concept to Launch' },
                  { value: '50+', label: 'API Routes' },
                  { value: '24/7', label: 'AI Operations Live' },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={popIn}
                    className="p-5 rounded-xl bg-[#EEE6DC] shadow-sm text-center"
                  >
                    <div className="text-2xl font-bold text-[#8E5E34]">{m.value}</div>
                    <div className="text-xs text-[#7A746C] mt-1">{m.label}</div>
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
// ANIMATED PROCESS TIMELINE - ALL LEFT
// ============================================
function ProcessTimeline() {
  const steps = [
    { icon: Search, title: 'Discovery', desc: 'We map every bottleneck, manual process, and missed opportunity in your business. You get a clear picture of what AI can fix.', timeline: 'Week 1' },
    { icon: Target, title: 'Strategy', desc: 'A tailored blueprint with projected savings, implementation timeline, and exactly what your AI systems will do.', timeline: 'Week 1-2' },
    { icon: Layers, title: 'Build', desc: 'We build your AI systems in weeks, not months. Half our team works while you sleep - speed is in our DNA.', timeline: 'Week 2-4' },
    { icon: Rocket, title: 'Deploy', desc: 'Systems go live with monitoring, failsafes, and human escalation paths. Launch day is a non-event because everything is tested.', timeline: 'Week 4' },
    { icon: TrendingUp, title: 'Optimize', desc: 'Your AI gets smarter every day. We monitor, optimize, and scale what works - so results compound over time.', timeline: 'Ongoing' },
  ];

  return (
    <section id="process" className="py-8 sm:py-12 lg:py-16 relative bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45]">
            From First Call to Full Automation
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8E5E34]/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="relative flex items-start gap-6 mb-8 last:mb-0"
            >
              {/* Timeline dot */}
              <motion.div
                variants={popIn}
                className="absolute left-6 w-3 h-3 rounded-full bg-[#8E5E34] border-4 border-[#F4EFE8] shadow-md -translate-x-1.5 mt-6 z-10"
              />

              <div className="ml-12 flex-1">
                <div className="p-5 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8E5E34]/10 flex items-center justify-center">
                      <step.icon size={18} className="text-[#8E5E34]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#B07A45]">{step.title}</h3>
                      <span className="text-xs text-[#8E5E34] font-medium">{step.timeline}</span>
                    </div>
                  </div>
                  <p className="text-[#7A746C] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIAL
// ============================================
function TestimonialSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 relative">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            Client Results
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45] mb-8">
            Don&apos;t Take Our Word For It
          </motion.h2>
          <motion.div
            variants={scaleUp}
            className="relative p-6 md:p-10 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD]"
          >
            {/* Quotation mark */}
            <div className="text-[#8E5E34]/10 text-8xl font-serif leading-none mb-2 select-none">&ldquo;</div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-[#8E5E34] fill-[#8E5E34]" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-[#B07A45] font-medium leading-relaxed mb-8">
              Shopify shut us down and we were stuck selling through Instagram DMs. Vantix built us a complete custom platform - 122 pages, POS integration, shipping, everything - in 3 weeks. It&apos;s better than anything Shopify could have done.
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#B07A45] text-white font-bold text-lg">
                D
              </div>
              <div className="text-left">
                <p className="text-[#B07A45] font-semibold">Dave</p>
                <p className="text-[#7A746C] text-sm">Founder, SecuredTampa</p>
              </div>
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
  const stats = [
    { value: '40+', label: 'Hours Reclaimed Per Week', icon: Clock },
    { value: '3x', label: 'More Qualified Leads', icon: TrendingUp },
    { value: '24/7', label: 'Operations Never Stop', icon: Shield },
    { value: '$0', label: 'Extra Hires Needed', icon: Users },
  ];

  return (
    <section id="roi" className="py-8 sm:py-12 lg:py-16 relative bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            Your ROI
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45]">
            The Math Speaks for Itself
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={popIn}
              className="text-center p-4 sm:p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD]"
            >
              <s.icon size={28} className="text-[#8E5E34] mx-auto mb-4" />
              <div className="text-3xl md:text-4xl font-bold text-[#8E5E34] mb-1">{s.value}</div>
              <div className="text-sm text-[#7A746C]">{s.label}</div>
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
  const team = [
    {
      name: 'Kyle Ventura',
      role: 'Founder & AI Strategist',
      desc: 'Obsessed with one question: what would your business look like if it ran itself? Kyle architects AI systems that answer that - with measurable ROI on every project.',
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
    <section id="team" className="py-8 sm:py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            Who We Are
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45]">
            A 4-Person Team.<br />Half of Us Never Sleep.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#7A746C] text-base leading-relaxed mt-4 max-w-2xl mx-auto">
            2 humans who obsess over your success. 2 AI assistants who build, research, and optimize around the clock. Small enough to care. Powerful enough to deliver enterprise results.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-5 sm:gap-8 max-w-3xl mx-auto"
        >
          {team.map((t, i) => (
            <motion.div
              key={i}
              variants={i === 0 ? fadeLeft : fadeRight}
              className="p-6 rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD] text-center"
            >
              <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden shadow-sm border-2 border-[#E3D9CD]">
                <Image src={t.photo} alt={`${t.name}, ${t.role} at Vantix`} width={112} height={112} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="text-xl font-bold text-[#B07A45]">{t.name}</h3>
              <p className="text-[#8E5E34] text-sm font-medium mb-4">{t.role}</p>
              <p className="text-[#7A746C] text-sm leading-relaxed">{t.desc}</p>
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
    <div className="rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#EEE6DC] transition-colors"
      >
        <span className="text-[#B07A45] font-medium pr-4">{q}</span>
        <ChevronDown size={18} className={`text-[#E3D9CD] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
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
            <p className="px-6 pb-6 text-[#7A746C] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    { q: 'How fast can you deploy an AI system?', a: 'Most systems go live in 2-4 weeks. Simple automations and chatbots can launch in under a week. We built a 122-page e-commerce platform with POS integration in just 3 weeks - speed is built into our DNA because half our team works 24/7.' },
    { q: 'What if AI makes mistakes with my customers?', a: 'Every system includes human oversight and escalation paths. AI handles the volume - edge cases route to your team. We continuously train and optimize, so accuracy improves over time. You stay in control.' },
    { q: 'Do I need technical knowledge?', a: 'None. We build everything with simple dashboards you can manage from your phone. Full training included. Ongoing support included. If you can send an email, you can run your AI systems.' },
    { q: 'What does it cost?', a: 'Every project is custom-priced based on scope and complexity. We provide a detailed quote with projected ROI so you can see the payback before you commit. Book a free audit - we\'ll give you real numbers, not a range.' },
    { q: 'Can AI really replace hiring more staff?', a: 'It augments and eliminates the need. One AI system can handle the workload of 3-5 employees for specific functions - customer service, lead qualification, data entry, scheduling. Your existing team gets freed up for high-value work that actually grows the business.' },
    { q: 'What happens if something breaks?', a: 'We monitor every system 24/7. Issues get caught before you notice them. All clients get priority support with guaranteed response times. We treat your downtime like our emergency - because it is.' },
  ];

  return (
    <section id="faq" className="py-8 sm:py-12 lg:py-16 relative bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-5 sm:mb-8"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">
            FAQ
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45]">
            Every Question. Answered.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
// BOOKING SECTION (Custom Calendar)
// ============================================
const TIME_SLOTS = [
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM',
];

function getCalendarDays(month: number, year: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function isWeekend(d: Date) {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isPastOrToday(d: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d <= today;
}

function formatDateStr(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function toISO(d: Date, timeStr: string) {
  const [time, ampm] = timeStr.split(' ');
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, parseInt(mStr));
  return dt.toISOString();
}

function BookingSection() {
  const { ref } = useAnimateInView();
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const calendarDays = getCalendarDays(viewMonth, viewYear);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const canGoPrev = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth());
  const goNext = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };
  const goPrev = () => { if (!canGoPrev) return; if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !selectedDate || !selectedTime) return;
    const dateStr = formatDateStr(selectedDate);
    const booking = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: dateStr,
      time: selectedTime,
      notes: '',
    };
    // POST to API (handles Supabase insert + emails + notifications)
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
    } catch { /* noop */ }
    // localStorage fallback
    try {
      const full = { id: 'booking-' + Date.now(), ...booking, created_at: new Date().toISOString(), dismissed: false };
      const existing = JSON.parse(localStorage.getItem('vantix_bookings') || '[]');
      existing.push(full);
      localStorage.setItem('vantix_bookings', JSON.stringify(existing));
    } catch { /* noop */ }
    // Cal.com webhook (non-blocking)
    fetch('/api/bookings/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerEvent: 'BOOKING_CREATED',
        payload: {
          attendees: [{ name: form.name, email: form.email, phone: form.phone }],
          startTime: toISO(selectedDate, selectedTime),
          responses: { notes: '' },
        },
      }),
    }).catch(() => {});
    setSubmitted(true);
  };

  // step: 0=date, 1=time, 2=form, 3=done
  const step = submitted ? 3 : selectedTime ? 2 : selectedDate ? 1 : 0;

  return (
    <section id="booking" className="py-8 sm:py-12 lg:py-16 relative">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 relative" ref={ref}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-5 sm:mb-8">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4">Start This Week</motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B07A45] mb-4">Book Your Free Consultation</motion.h2>
          <motion.p variants={fadeUp} className="text-[#7A746C] text-base leading-relaxed max-w-2xl mx-auto">Pick a time that works for you. 30 minutes, zero pressure.</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD] overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 3 ? (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-12">
                <CheckCircle2 className="mx-auto mb-4 text-[#8E5E34]" size={48} />
                <h3 className="text-2xl font-bold text-[#B07A45] mb-2">You&apos;re booked!</h3>
                <p className="text-[#7A746C]">We&apos;ll email you to confirm your {selectedTime} slot on {selectedDate ? formatDateStr(selectedDate) : ''}.</p>
              </motion.div>
            ) : (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Calendar Grid */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={goPrev} disabled={!canGoPrev}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${canGoPrev ? 'hover:bg-[#E3D9CD] text-[#B07A45]' : 'text-[#E3D9CD] cursor-not-allowed'}`}>
                      <ChevronDown size={18} className="rotate-90" />
                    </button>
                    <p className="text-sm font-semibold text-[#1C1C1C] tracking-wide">{monthNames[viewMonth]} {viewYear}</p>
                    <button onClick={goNext}
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#E3D9CD] text-[#B07A45] transition-all">
                      <ChevronDown size={18} className="-rotate-90" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {dayHeaders.map((dh) => (
                      <div key={dh} className="text-center text-[10px] font-semibold text-[#A39B90] uppercase tracking-wider py-2">{dh}</div>
                    ))}
                    {calendarDays.map((d, i) => {
                      if (!d) return <div key={`empty-${i}`} />;
                      const past = d <= today;
                      const weekend = isWeekend(d);
                      const disabled = past || weekend;
                      const active = selectedDate && isSameDay(d, selectedDate);
                      const isToday = isSameDay(d, today);
                      return (
                        <button key={d.toISOString()} disabled={disabled}
                          onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                            ${active ? 'bg-[#8E5E34] text-white shadow-md' :
                              disabled ? 'text-[#E3D9CD] cursor-not-allowed' :
                              isToday ? 'bg-[#B07A45]/10 text-[#B07A45] font-bold' :
                              'text-[#4B4B4B] hover:bg-[#E3D9CD] cursor-pointer'}`}>
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <AnimatePresence mode="wait">
                  {step >= 1 && (
                    <motion.div key="times" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                      <p className="text-sm font-medium text-[#B07A45] mb-3">Select a time <span className="text-[#A39B90] font-normal">(Eastern Time)</span></p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIME_SLOTS.map((t) => {
                          const active = selectedTime === t;
                          return (
                            <button key={t} onClick={() => setSelectedTime(t)}
                              className={`py-2.5 rounded-lg text-sm font-medium transition-all
                                ${active ? 'bg-[#8E5E34] text-white shadow-md' : 'bg-[#EEE6DC] text-[#B07A45] hover:bg-[#E3D9CD]'}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <AnimatePresence mode="wait">
                  {step >= 2 && (
                    <motion.form key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSubmit} className="overflow-hidden">
                      <p className="text-sm font-medium text-[#B07A45] mb-3">Your details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <input type="text" required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="px-4 py-2.5 rounded-lg border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#7A746C] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E5E34]/30" />
                        <input type="email" required placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="px-4 py-2.5 rounded-lg border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#7A746C] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E5E34]/30" />
                        <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="px-4 py-2.5 rounded-lg border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#7A746C] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E5E34]/30" />
                      </div>
                      <button type="submit" className={`${bronzeButtonClass} w-full`}>
                        Confirm Booking - {selectedDate && selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
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
      <div id="contact-form" className="max-w-lg mx-auto mt-8 bg-[#EEE6DC] rounded-xl p-6 shadow-sm text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-[#8E5E34]" />
        <h3 className="text-xl font-bold text-[#B07A45] mb-2">You&apos;re In.</h3>
        <p className="text-[#7A746C]">We&apos;ll reach out within 24 hours with next steps. Check your inbox.</p>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 bg-[#EEE6DC] rounded-xl p-6 shadow-sm">
      <p className="text-center text-[#7A746C] text-sm mb-6">Prefer to type? Drop us a message and we&apos;ll follow up within 24 hours.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#B07A45] mb-1.5">Name *</label>
          <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#E3D9CD] focus:outline-none focus:border-[#8E5E34] focus:ring-1 focus:ring-[#8E5E34]/30 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B07A45] mb-1.5">Email *</label>
          <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#E3D9CD] focus:outline-none focus:border-[#8E5E34] focus:ring-1 focus:ring-[#8E5E34]/30 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B07A45] mb-1.5">Phone <span className="text-[#E3D9CD]">(optional)</span></label>
          <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#E3D9CD] focus:outline-none focus:border-[#8E5E34] focus:ring-1 focus:ring-[#8E5E34]/30 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B07A45] mb-1.5">What&apos;s eating your time?</label>
          <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Tell us about the manual tasks, bottlenecks, or goals you want AI to tackle..." className="w-full px-4 py-3 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#B07A45] placeholder-[#E3D9CD] focus:outline-none focus:border-[#8E5E34] focus:ring-1 focus:ring-[#8E5E34]/30 transition-all resize-none" />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`w-full group inline-flex items-center justify-center gap-2 ${bronzeButtonClass} disabled:opacity-60`}
        >
          {status === 'sending' ? 'Sending...' : 'Start Automating This Week'}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        {status === 'error' && <p className="text-[#B0614A]/50 text-sm text-center">Something went wrong. Please try again.</p>}
      </div>
    </form>
  );
}

function FinalCTA() {
  return (
    <section id="contact" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-[#EEE6DC] rounded-xl mx-3 sm:mx-4 lg:mx-0 shadow-sm border border-[#E3D9CD]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#B07A45] leading-tight mb-6">
            Every Day You Wait,
            <br />
            <span className="text-[#8E5E34]">Your Competitors Pull Ahead.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#7A746C] text-base leading-relaxed max-w-2xl mx-auto mb-4">
            Book a free AI audit. In 30 minutes, we&apos;ll show you exactly which tasks to automate first and what the payback looks like. No commitment. No pressure.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[#B07A45] font-semibold text-lg mb-8">
            <a href="tel:9084987753" className="hover:text-[#8E5E34] transition-colors inline-flex items-center gap-2">
              <Phone size={18} />
              (908) 498-7753
            </a>
          </motion.p>
          <motion.div variants={fadeUp}>
            <a
              href="#booking"
              className={`group inline-flex items-center gap-2 ${bronzeButtonClass} rounded-full px-10 py-5 text-lg hover:scale-[1.02]`}
            >
              <Calendar size={20} />
              Book Your Free AI Audit
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          <motion.p variants={fadeUp} className="text-[#8E5E34]/60 text-sm mt-6 font-medium">
            Limited availability — book your spot before we fill up.
          </motion.p>
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
    <footer className="py-10 sm:py-16 bg-[#EEE6DC] border-t border-[#E3D9CD] mt-4">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B07A45]/10 flex items-center justify-center text-[#B07A45] font-extrabold text-sm">V</div>
              <span className="text-2xl font-extrabold text-[#1C1C1C] tracking-tight">vantix<span className="text-[#B07A45]">.</span></span>
            </div>
            <p className="text-[#7A746C] mt-4 max-w-sm leading-relaxed">
              AI systems that generate revenue, eliminate busywork, and scale your operations - deployed in weeks, not months.
            </p>
          </div>
          <div>
            <h4 className="text-[#1C1C1C] font-semibold text-sm mb-4">Pages</h4>
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
                  <a href={l.href} className="text-[#7A746C] hover:text-[#B07A45] text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#1C1C1C] font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-[#7A746C]">
              <li>
                <a href="tel:9084987753" className="hover:text-[#B07A45] transition-colors">(908) 498-7753</a>
              </li>
              <li>
                <a href="mailto:hello@usevantix.com" className="hover:text-[#B07A45] transition-colors">hello@usevantix.com</a>
              </li>
            </ul>
            <h4 className="text-[#1C1C1C] font-semibold text-sm mt-6 mb-4">Follow</h4>
            <ul className="space-y-2 text-sm text-[#7A746C]">
              <li>
                <a href="https://instagram.com/usevantix" target="_blank" rel="noopener noreferrer" className="hover:text-[#B07A45] transition-colors">Instagram</a>
              </li>
              <li>
                <a href="https://x.com/usevantix" target="_blank" rel="noopener noreferrer" className="hover:text-[#B07A45] transition-colors">X / Twitter</a>
              </li>
              <li>
                <a href="https://linkedin.com/company/usevantix" target="_blank" rel="noopener noreferrer" className="hover:text-[#B07A45] transition-colors">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#E3D9CD] text-center">
          <p className="text-[#A39B90] text-sm">
            © {new Date().getFullYear()} Vantix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
// ============================================
// STICKY CTA BAR
// ============================================
function StickyCTABar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-40 safe-padding-bottom"
        >
          <div className="bg-[#F4EFE8]/95 backdrop-blur-md border-t border-[#E3D9CD] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-[#7A746C] hidden sm:block">
                Ready to automate? Book a free 30-min AI audit.
              </p>
              <a
                href="#booking"
                className={`${bronzeButtonClass} text-sm px-6 py-2.5 whitespace-nowrap flex-shrink-0 sm:ml-auto`}
              >
                Book Free Audit
                <ArrowRight size={16} className="inline ml-2" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FuturisticLanding() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4EFE8] text-[#B07A45] min-h-screen selection:bg-[#8E5E34]/20 selection:text-[#B07A45] scroll-smooth">
      <header>
        <Navigation />
      </header>
      <main>
        <HeroSection />
        <AnimatedCounterSection />
        <ProductShowcase />
        <BeforeAfterSection />
        <ProblemSection />
        <ServicesSection />
        <TechStackSection />
        <ProcessTimeline />
        <CaseStudyHighlight />
        <TestimonialSection />
        <ROISection />
        <TeamSection />
        <FAQSection />
        <BookingSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
