'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowDown, Bot, Globe, Zap, BarChart3, Mail, Package,
  Phone, Sparkles, Clock, Users, TrendingUp, Shield, ChevronDown,
  MessageSquare, Calendar, Search, Cpu, CheckCircle2, ExternalLink,
  Twitter, Linkedin, Instagram, Menu, X
} from 'lucide-react';

// ============================================
// VANTIX AI - Warm Neumorphic Landing Page
// ============================================

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

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
    { label: 'Services', href: '#services' },
    { label: 'Results', href: '#roi' },
    { label: 'Process', href: '#process' },
    { label: 'Team', href: '#team' },
    { label: 'FAQ', href: '#faq' },
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
        <a href="#" className="text-2xl font-bold text-[#2D2A26] tracking-tight">
          vantix<span className="text-[#B8895A]">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[#8C857C] hover:text-[#2D2A26] transition-colors">
              {l.label}
            </a>
          ))}
          <a href="/login" className="text-sm text-[#8C857C] hover:text-[#2D2A26] transition-colors">
            Login
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 text-[#5C4033] text-sm font-semibold rounded-full transition-all shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8]"
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.05) 2px, rgba(139,90,43,0.05) 4px), linear-gradient(135deg, #E8CFA0 0%, #D4B07C 30%, #C9A06E 50%, #DDB98A 70%, #E8CFA0 100%)`,
            }}
          >
            Book a Call
          </a>
        </div>
        <button className="md:hidden text-[#2D2A26]" onClick={() => setMobileOpen(!mobileOpen)}>
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
              <a href="/login" onClick={() => setMobileOpen(false)} className="text-[#8C857C] hover:text-[#2D2A26] transition-colors">
                Login
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="px-6 py-2.5 text-[#5C4033] text-sm font-semibold rounded-full text-center shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff]" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.05) 2px, rgba(139,90,43,0.05) 4px), linear-gradient(135deg, #E8CFA0 0%, #D4B07C 30%, #C9A06E 50%, #DDB98A 70%, #E8CFA0 100%)` }}>
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
          backgroundImage: `
            linear-gradient(to right, #E8E5E0 1px, transparent 1px),
            linear-gradient(to bottom, #E8E5E0 1px, transparent 1px)
          `,
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
      {/* Subtle warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,137,90,0.06)_0%,transparent_60%)]" />

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C5C3BE] bg-white mb-8 shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff]"
        >
          <span className="w-2 h-2 rounded-full bg-[#B8895A] animate-pulse" />
          <span className="text-sm text-[#8C857C] font-medium">AI-First Digital Transformation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#2D2A26] leading-[0.95] tracking-tight mb-6"
        >
          Your Business.
          <br />
          <span className="text-[#B8895A]">
            Powered by AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg sm:text-xl text-[#8C857C] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We build AI systems that generate revenue, cut costs, and run your operations — while you focus on growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#services"
            className="group px-8 py-4 text-[#5C4033] font-semibold rounded-full transition-all inline-flex items-center justify-center gap-2 shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] hover:shadow-[inset_4px_4px_8px_#b8965f,inset_-4px_-4px_8px_#e8d4a8] hover:scale-[1.02]"
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.05) 2px, rgba(139,90,43,0.05) 4px), linear-gradient(135deg, #E8CFA0 0%, #D4B07C 30%, #C9A06E 50%, #DDB98A 70%, #E8CFA0 100%)`,
            }}
          >
            See What AI Can Do For You
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowDown size={20} className="text-[#C5C3BE] animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SOCIAL PROOF BAR
// ============================================
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function SocialProofBar() {
  return (
    <section className="relative py-12 border-y border-[#E8E5E0] bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center"
        >
          {[
            { prefix: '$', target: 2, suffix: 'M+', label: 'Client Revenue Powered' },
            { prefix: '', target: 50, suffix: '+', label: 'AI Systems Deployed' },
            { prefix: '', target: 98, suffix: '%', label: 'Client Retention Rate' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-[#B8895A]">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
              </span>
              <span className="text-sm text-[#8C857C] mt-1">{stat.label}</span>
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
    'Answering the same customer questions manually',
    'Missing leads because you were busy',
    'Spending hours on email campaigns',
    'Guessing what your customers want',
    'Hiring more staff to keep up',
  ];

  const after = [
    'AI chatbot handles 90% of inquiries 24/7',
    'AI captures and qualifies every lead instantly',
    'AI writes, sends, and optimizes every email',
    'Real-time analytics predict customer behavior',
    'AI scales your operations at zero headcount cost',
  ];

  return (
    <section className="py-24 md:py-32 relative">
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
            You are spending 40+ hours a week on tasks AI can handle in seconds
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Before */}
          <motion.div variants={fadeUp} className="relative p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#E8E5E0]/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#C5C3BE]" />
              <span className="text-[#8C857C] font-semibold text-sm uppercase tracking-wider">Without AI</span>
            </div>
            <ul className="space-y-4">
              {before.map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 text-[#8C857C]">
                  <X size={16} className="text-[#C5C3BE] mt-1 shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div variants={fadeUp} className="relative p-8 rounded-3xl bg-white shadow-[8px_8px_20px_#c8c4be,-8px_-8px_20px_#ffffff] border border-[#B8895A]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#B8895A]" />
              <span className="text-[#B8895A] font-semibold text-sm uppercase tracking-wider">With Vantix AI</span>
            </div>
            <ul className="space-y-4">
              {after.map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 text-[#2D2A26]">
                  <CheckCircle2 size={16} className="text-[#B8895A] mt-1 shrink-0" />
                  <span>{item}</span>
                </motion.li>
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
  { icon: Bot, title: 'AI Chatbots', desc: '24/7 customer support and lead qualification. Your best salesperson never sleeps, never calls in sick, never asks for a raise.' },
  { icon: Globe, title: 'AI-Powered Websites', desc: 'Self-optimizing, conversion-focused websites that learn from every visitor and get better over time. Automatically.' },
  { icon: Search, title: 'Automated Lead Generation', desc: 'Find customers while you sleep. AI identifies, qualifies, and nurtures prospects across every channel.' },
  { icon: BarChart3, title: 'AI Analytics & Insights', desc: 'Real-time business intelligence that tells you what is happening, why, and what to do next. No more guessing.' },
  { icon: Mail, title: 'AI Email Marketing', desc: 'Writes, personalizes, sends, and follows up. Every email tailored to every recipient. At scale.' },
  { icon: Package, title: 'AI Inventory Management', desc: 'Demand prediction and auto-reorder. Never overstock, never run out, never lose a sale to poor planning.' },
  { icon: Phone, title: 'AI Phone Agents', desc: 'Answer calls, book appointments, qualify leads. Your AI receptionist handles it all — and never puts anyone on hold.' },
  { icon: Sparkles, title: 'Custom AI Solutions', desc: 'If you can dream it, we can automate it. Bespoke AI systems built for your exact business needs.' },
];

function ServicesSection() {
  const { ref, inView } = useAnimateInView();

  return (
    <section id="services" className="py-24 md:py-32 relative">
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
            AI Systems That Run Your Business
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C857C] mt-4 max-w-2xl mx-auto">
            While your competitors are figuring out ChatGPT, we are building AI systems that run entire businesses.
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
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
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
// ROI SECTION
// ============================================
function ROISection() {
  const { ref, inView } = useAnimateInView();

  const stats = [
    { value: '40+', label: 'Hours Saved Per Week', icon: Clock },
    { value: '3x', label: 'More Qualified Leads', icon: TrendingUp },
    { value: '24/7', label: 'Availability', icon: Shield },
    { value: '$0', label: 'Additional Staff Needed', icon: Users },
  ];

  return (
    <section id="roi" className="py-24 md:py-32 relative">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            ROI
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            The Numbers Don&apos;t Lie
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
// CASE STUDY
// ============================================
function CaseStudy() {
  const { ref, inView } = useAnimateInView();

  return (
    <section className="py-24 md:py-32 relative">
      <GridBackground variant="solid" />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4 text-center">
            Case Study
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
                  From Instagram DMs to a full AI-powered e-commerce platform
                </p>
                <p className="text-[#8C857C] leading-relaxed mb-6">
                  Secured Tampa was running their entire business through Instagram DMs — manually responding to every inquiry, tracking orders in spreadsheets, and losing customers to slow response times. We built them a complete AI-powered e-commerce ecosystem with automated customer service, intelligent product recommendations, and real-time inventory management.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['AI Chatbot', 'E-Commerce', 'Automation', 'Analytics'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full border border-[#B8895A]/20 bg-[#B8895A]/5 text-[#B8895A] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '300%', label: 'Increase in Online Sales' },
                  { value: '85%', label: 'Faster Response Time' },
                  { value: '24/7', label: 'Customer Support Active' },
                  { value: '40hrs', label: 'Saved Per Week' },
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
    { num: '01', title: 'Discovery Call', desc: 'We learn your business inside and out. Every pain point, every bottleneck, every missed opportunity.', icon: Phone },
    { num: '02', title: 'AI Audit', desc: 'We map every process that can be automated and build a custom AI strategy with projected ROI.', icon: Search },
    { num: '03', title: 'Build & Deploy', desc: 'Our team builds your AI systems and deploys them seamlessly into your existing operations.', icon: Cpu },
    { num: '04', title: 'Monitor & Scale', desc: 'We continuously optimize your AI systems and scale what works. Your business gets smarter every day.', icon: TrendingUp },
  ];

  return (
    <section id="process" className="py-24 md:py-32 relative">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            Our Process
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            How We Work
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-3xl mx-auto relative"
        >
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#B8895A]/50 via-[#C5C3BE]/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="relative pl-16 md:pl-20 pb-12 last:pb-0">
              <div className="absolute left-3 md:left-5 w-6 h-6 rounded-full bg-white border-2 border-[#B8895A] flex items-center justify-center shadow-[5px_5px_12px_#c8c4be,-5px_-5px_12px_#ffffff]">
                <div className="w-2 h-2 rounded-full bg-[#B8895A]" />
              </div>
              <span className="text-[#C5C3BE] text-xs font-mono font-bold">{step.num}</span>
              <h3 className="text-xl font-bold text-[#2D2A26] mt-1 mb-2">{step.title}</h3>
              <p className="text-[#8C857C] leading-relaxed">{step.desc}</p>
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
      role: 'Founder & AI Architect',
      desc: 'Obsessed with building AI systems that make businesses unstoppable. Kyle architects every solution from the ground up with one goal: measurable ROI.',
    },
    {
      name: 'Aidan Fromm',
      role: 'Co-Founder & Technical Lead',
      desc: 'Full-stack engineer who turns complex AI concepts into production-ready systems. Aidan ensures every deployment is bulletproof and built to scale.',
    },
  ];

  return (
    <section id="team" className="py-24 md:py-32 relative">
      <GridBackground variant="solid" />
      <div className="max-w-7xl mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4">
            The Team
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2A26]">
            Built by Builders
          </motion.h2>
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
              <div className="w-20 h-20 rounded-full bg-[#FAFAFA] border-2 border-[#B8895A]/20 mx-auto mb-5 flex items-center justify-center shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff]">
                <span className="text-2xl font-bold text-[#B8895A]">{t.name.split(' ').map(n => n[0]).join('')}</span>
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
    <motion.div
      variants={fadeUp}
      className="rounded-2xl bg-white shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FAFAFA]/50 transition-colors"
      >
        <span className="text-[#2D2A26] font-medium pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-[#C5C3BE] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
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
    </motion.div>
  );
}

function FAQSection() {
  const { ref, inView } = useAnimateInView();

  const faqs = [
    { q: 'How long does it take to deploy an AI system?', a: 'Most AI systems are live within 2-4 weeks. Simple chatbots and automation can be deployed in under a week. Complex custom solutions may take 4-8 weeks. Either way, you start seeing ROI fast.' },
    { q: 'What if AI makes mistakes with my customers?', a: 'Every system we build has human oversight built in. AI handles the volume, and edge cases get routed to your team. We also continuously train and optimize so accuracy only improves over time.' },
    { q: 'Do I need technical knowledge to use these systems?', a: 'Zero. We build everything with dead-simple dashboards. If you can use a smartphone, you can manage your AI systems. Plus, we provide full training and ongoing support.' },
    { q: 'What does it cost?', a: 'Every business is different. We price based on the complexity and scope of what you need. Book a discovery call and we will give you a transparent quote with projected ROI — most clients see positive returns within 30 days.' },
    { q: 'Can AI really replace hiring more staff?', a: 'Not replace — augment. AI handles the repetitive, high-volume tasks so your team can focus on high-value work. One AI system can do the work of 3-5 employees in specific functions, at a fraction of the cost.' },
    { q: 'What happens if something breaks?', a: 'We monitor every system 24/7. If an issue arises, we catch it before you even notice. All clients get priority support with guaranteed response times. Your business never skips a beat.' },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 relative">
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
            Questions? Answered.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================
function FinalCTA() {
  const { ref, inView } = useAnimateInView();

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA] via-[#F0EDE8] to-[#FAFAFA]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,137,90,0.08)_0%,transparent_60%)]" />
      <div className="max-w-4xl mx-auto px-6 text-center relative" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2A26] leading-tight mb-6">
            Ready to Let AI
            <br />
            <span className="text-[#B8895A]">
              Run Your Business?
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C857C] text-lg max-w-2xl mx-auto mb-10">
            Book a free discovery call. We will show you exactly which parts of your business AI can transform — and what the ROI looks like.
          </motion.p>
          <motion.div variants={fadeUp}>
            <a
              href="https://cal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-10 py-5 text-[#5C4033] font-bold text-lg rounded-full transition-all shadow-[10px_10px_24px_#c8c4be,-10px_-10px_24px_#ffffff] hover:shadow-[inset_4px_4px_8px_#b8965f,inset_-4px_-4px_8px_#e8d4a8] hover:scale-[1.02]"
              style={{
                background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.05) 2px, rgba(139,90,43,0.05) 4px), linear-gradient(135deg, #E8CFA0 0%, #D4B07C 30%, #C9A06E 50%, #DDB98A 70%, #E8CFA0 100%)`,
              }}
            >
              <Calendar size={20} />
              Book Your Free Discovery Call
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          <motion.p variants={fadeUp} className="text-[#C5C3BE] text-sm mt-6">
            No commitment. No pressure. Just a conversation about what is possible.
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
    <footer className="border-t border-[#E8E5E0] py-12 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <span className="text-2xl font-bold text-[#2D2A26] tracking-tight">
              vantix<span className="text-[#B8895A]">.</span>
            </span>
            <p className="text-[#8C857C] mt-4 max-w-sm leading-relaxed">
              We deploy AI systems that generate revenue, cut costs, and automate operations for businesses ready to scale.
            </p>
          </div>
          <div>
            <h4 className="text-[#2D2A26] font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Services', 'Results', 'Process', 'Team', 'FAQ'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-[#8C857C] hover:text-[#2D2A26] text-sm transition-colors">{l}</a>
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
    <div className="bg-[#FAFAFA] text-[#2D2A26] min-h-screen selection:bg-[#B8895A]/20 selection:text-[#2D2A26]">
      <Navigation />
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <ServicesSection />
      <ROISection />
      <CaseStudy />
      <ProcessSection />
      <TeamSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
