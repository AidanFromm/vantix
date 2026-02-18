'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, ArrowDown, Check, Star, Zap, Clock, Shield, 
  MessageSquare, ChevronDown, Users, TrendingUp, Award,
  Lightbulb, Wrench, HeartHandshake, Target, BarChart3,
  Bot, Code2, Sparkles, Play, Calendar, Phone, Mail
} from 'lucide-react';

// ============================================
// CONSULTANT LANDING - Premium AI Consulting
// Positioning: "AI Consultants Who Actually Build"
// Copywriting: PAS + BAB + 4 U's frameworks
// ============================================

export function ConsultantLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#F5EFE7] text-gray-900 min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <LogoBar />
      <ProblemSection />
      <SolutionSection />
      <ServiceTiers />
      <ProofSection />
      <DifferentiatorSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// ============================================
// NAVIGATION - Clean, minimal, trust-building
// ============================================
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <span className="text-white font-bold text-lg">V</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-gray-900 tracking-tight text-lg">VANTIX</span>
              <span className="block text-[10px] text-gray-400 tracking-widest uppercase -mt-0.5">AI Consulting</span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#services" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Services</Link>
            <Link href="#results" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Results</Link>
            <Link href="#process" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Process</Link>
            <Link href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">FAQ</Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="tel:9084987753"
              className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Phone size={14} />
              (908) 498-7753
            </Link>
            <Link
              href="#contact"
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
            >
              Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// HERO - Hook with consultant positioning
// Framework: AIDA (Attention → Interest → Desire → Action)
// ============================================
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-[100vh] flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-transparent to-transparent" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating accent shapes */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-40 right-[10%] w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-cyan-100/20 rounded-[60px] blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 left-[5%] w-60 h-60 bg-gradient-to-br from-emerald-300/20 to-transparent rounded-full blur-xl"
      />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-4xl">
          {/* Trust badge - establishes credibility immediately */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100 mb-8"
          >
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">K</div>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">A</div>
            </div>
            <span className="text-sm text-gray-600">
              Trusted by founders doing <span className="font-semibold text-gray-900">$10M+ in revenue</span>
            </span>
          </motion.div>

          {/* Main headline - Problem-aware, solution-focused */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-gray-900 mb-6 tracking-tight"
          >
            AI consultants
            <br />
            who <span className="text-emerald-500">actually build</span>
          </motion.h1>

          {/* Subheadline - Value proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
          >
            Most consultants hand you a strategy deck and disappear.
            <br className="hidden md:block" />
            <span className="text-gray-900 font-medium">We consult, build, and manage</span>—so your AI actually works.
          </motion.p>

          {/* Social proof line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <Bot size={16} className="text-emerald-500" />
            <span>We run AI systems for our own businesses—not just our clients&apos;.</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="#contact"
              className="group px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl shadow-gray-900/10"
            >
              <Calendar size={18} />
              Book a Free Discovery Call
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#results"
              className="px-8 py-4 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all border border-gray-200 flex items-center gap-2"
            >
              <Play size={16} />
              See Our Work
            </Link>
          </motion.div>

          {/* Quick stats - builds trust fast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200 max-w-lg"
          >
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">50+</p>
              <p className="text-xs text-gray-500 mt-1">Projects Shipped</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">3-5</p>
              <p className="text-xs text-gray-500 mt-1">Weeks to Launch</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">100%</p>
              <p className="text-xs text-gray-500 mt-1">Satisfaction Rate</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-300"
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ============================================
// LOGO BAR - Social proof from real clients
// ============================================
function LogoBar() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="text-center text-sm text-gray-400 mb-8 tracking-wide uppercase">Trusted by growing businesses</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {/* Real client logos - text placeholder style */}
          {[
            { name: 'CardLedger', subtitle: 'Portfolio App' },
            { name: 'SecuredTampa', subtitle: 'E-Commerce' },
            { name: 'Wholesale Platform', subtitle: 'B2B Automation' },
          ].map((client, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-xl font-semibold text-gray-800 tracking-tight">{client.name}</span>
              <span className="text-xs text-gray-400">{client.subtitle}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROBLEM SECTION - Agitate the pain
// Framework: PAS (Problem → Agitate → Solution)
// ============================================
function ProblemSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#F5EFE7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - The problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-red-500 font-medium text-sm tracking-wide uppercase mb-4">The Problem</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight mb-6">
              80% of AI projects fail.
              <br />
              <span className="text-gray-400">Here&apos;s why.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              You&apos;ve seen the demos. ChatGPT, automation, AI agents—the potential is real. But when 
              you try to implement it? Consultants hand you a 100-page strategy doc. Developers build 
              something that breaks. And you&apos;re left with expensive tools gathering dust.
            </p>
            <div className="space-y-4">
              {[
                'Consultants who strategize but can\'t execute',
                'Developers who code but don\'t understand business',
                'Solutions that work in demos but fail in production',
                'No one to manage it after launch',
              ].map((problem, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-red-500 text-xs">✕</span>
                  </div>
                  <p className="text-gray-600">{problem}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 lg:p-12">
              <div className="space-y-4">
                {/* Failed project cards */}
                {[
                  { title: 'AI Chatbot', status: 'Abandoned', reason: '"Too complex to maintain"' },
                  { title: 'Automation System', status: 'Failed', reason: '"Broke after 2 weeks"' },
                  { title: 'Data Pipeline', status: 'Over Budget', reason: '"3x original estimate"' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-red-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">{item.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 italic">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SOLUTION SECTION - The bridge (BAB framework)
// ============================================
function SolutionSection() {
  return (
    <section className="py-24 lg:py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-3xl p-8 lg:p-12 border border-emerald-700/30">
              <div className="space-y-4">
                {/* Success project cards */}
                {[
                  { title: 'E-Commerce Platform', result: 'Multi-million processed', status: '99.9% uptime' },
                  { title: 'Trading Bot', result: '24/7 automated', status: 'Running 14 months' },
                  { title: 'CardLedger App', result: '250K+ cards tracked', status: 'Live on web' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{item.title}</span>
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">{item.status}</span>
                    </div>
                    <p className="text-sm text-emerald-200">{item.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-4">The Solution</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight mb-6">
              Strategy. Build. Manage.
              <br />
              <span className="text-emerald-400">One partner.</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We don&apos;t just consult—we execute. And we don&apos;t just build—we stick around to make 
              sure it keeps working. Full-stack AI implementation from people who run AI systems 
              for their own businesses, not just PowerPoint presentations.
            </p>
            <div className="space-y-4">
              {[
                'AI strategy grounded in what actually works',
                'Custom development by senior engineers',
                'Ongoing management and optimization',
                'One team from idea to scale',
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check size={12} className="text-emerald-400" />
                  </div>
                  <p className="text-gray-200">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SERVICE TIERS - Clear pricing structure
// ============================================
function ServiceTiers() {
  const tiers = [
    {
      icon: Lightbulb,
      name: 'Discovery',
      tagline: 'Strategy & Roadmap',
      price: 'From $500',
      duration: '1-2 weeks',
      description: 'Deep-dive audit of your business + custom AI roadmap with ROI projections.',
      features: [
        '90-minute strategy session',
        'Business process audit',
        'AI opportunity mapping',
        'Custom implementation roadmap',
        'ROI projections & timeline',
        '30-minute review call',
      ],
      cta: 'Book Discovery',
      popular: false,
    },
    {
      icon: Wrench,
      name: 'Build',
      tagline: 'Implementation',
      price: 'From $2,500',
      duration: '3-6 weeks',
      description: 'We build your custom AI solution—website, app, automation, or all three.',
      features: [
        'Everything in Discovery',
        'Custom AI/automation build',
        'Integration with your tools',
        'Training for your team',
        '30 days of support',
        'Documentation & handoff',
      ],
      cta: 'Start Building',
      popular: true,
    },
    {
      icon: HeartHandshake,
      name: 'Partner',
      tagline: 'Ongoing Retainer',
      price: 'From $500/mo',
      duration: 'Ongoing',
      description: 'Continuous optimization, support, and new development. Your AI team on call.',
      features: [
        'Dedicated AI consultant',
        'Monthly strategy call',
        'Continuous optimization',
        'Priority support (24hr)',
        'New feature development',
        'Performance reporting',
      ],
      cta: 'Become a Partner',
      popular: false,
    },
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">How We Work</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Three ways to work with us
          </h2>
          <p className="text-gray-500 text-lg">
            Start with strategy. Scale to full partnership. Always know exactly what you&apos;re getting.
          </p>
        </motion.div>

        {/* Tiers grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.popular 
                  ? 'bg-gray-900 text-white ring-2 ring-emerald-500' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                tier.popular ? 'bg-emerald-500' : 'bg-white shadow-sm border border-gray-200'
              }`}>
                <tier.icon size={24} className={tier.popular ? 'text-white' : 'text-emerald-500'} />
              </div>

              {/* Header */}
              <h3 className={`text-2xl font-semibold mb-1 ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mb-4 ${tier.popular ? 'text-emerald-300' : 'text-emerald-600'}`}>
                {tier.tagline}
              </p>

              {/* Price */}
              <div className="mb-4">
                <span className={`text-3xl font-bold ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </span>
                <span className={`text-sm ml-2 ${tier.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tier.duration}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-6 ${tier.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check size={16} className={`mt-0.5 flex-shrink-0 ${
                      tier.popular ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                    <span className={`text-sm ${tier.popular ? 'text-gray-200' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="#contact"
                className={`block w-full py-3 px-6 rounded-full text-center font-medium transition-all ${
                  tier.popular
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Custom projects note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-12"
        >
          Need something custom? <Link href="#contact" className="text-emerald-600 hover:underline">Let&apos;s talk</Link> about your specific requirements.
        </motion.p>
      </div>
    </section>
  );
}

// ============================================
// PROOF SECTION - Results & case studies
// ============================================
function ProofSection() {
  const results = [
    {
      metric: '40+',
      label: 'Hours Saved Weekly',
      project: 'B2B Wholesale Platform',
      description: 'Built custom inventory management, automated pricing, and fulfillment systems. Handles thousands of orders monthly.',
    },
    {
      metric: '250K+',
      label: 'Cards Tracked',
      project: 'CardLedger',
      description: 'Portfolio tracker for card collectors. Real-time pricing from 16 TCGs, P&L tracking, market analytics.',
    },
    {
      metric: '24/7',
      label: 'Automated Operations',
      project: 'Trading Systems',
      description: 'AI-powered bots running continuously. While clients sleep, their systems work.',
    },
  ];

  return (
    <section id="results" className="py-24 lg:py-32 bg-[#F5EFE7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Proof</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            We don&apos;t just build.
            <br />
            <span className="text-emerald-500">We ship results.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Real projects. Real businesses. Real revenue.
          </p>
        </motion.div>

        {/* Results grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {results.map((result, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
            >
              <div className="mb-6">
                <p className="text-4xl lg:text-5xl font-bold text-emerald-500 mb-1">{result.metric}</p>
                <p className="text-sm text-gray-500">{result.label}</p>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.project}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{result.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// DIFFERENTIATOR - Why Vantix
// ============================================
function DifferentiatorSection() {
  const diffs = [
    {
      icon: Bot,
      title: 'We use what we build',
      description: 'We run AI systems for our own businesses. Every recommendation comes from real experience, not theory.',
    },
    {
      icon: Zap,
      title: 'Startup speed, senior talent',
      description: 'Move fast without sacrificing quality. Most projects launch in 3-5 weeks with senior-level execution.',
    },
    {
      icon: Target,
      title: 'Business outcomes first',
      description: 'We don\'t build tech for tech\'s sake. Every solution is designed around ROI and measurable results.',
    },
    {
      icon: Shield,
      title: 'We stick around',
      description: 'No ghosting after launch. Ongoing support, optimization, and partnership for as long as you need us.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Why Vantix</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
              Not your typical
              <br />
              <span className="text-gray-400">consulting firm.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Big consulting firms charge $50K for a strategy deck. Agencies build things that break. 
              Freelancers disappear. We&apos;re different—and that&apos;s the point.
            </p>
          </motion.div>

          {/* Right - Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {diffs.map((diff, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <diff.icon size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{diff.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{diff.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS - How it works
// ============================================
function ProcessSection() {
  const steps = [
    { 
      num: '01', 
      title: 'Discovery Call', 
      duration: '30 min',
      description: 'We learn your business, identify AI opportunities, and see if we\'re a fit. You\'ll leave with clarity—even if we don\'t work together.' 
    },
    { 
      num: '02', 
      title: 'Strategy & Scope', 
      duration: '2-3 days',
      description: 'Custom roadmap with fixed pricing. No surprises. You know exactly what you\'re getting, when, and for how much.' 
    },
    { 
      num: '03', 
      title: 'Build & Iterate', 
      duration: '3-5 weeks',
      description: 'We build with weekly demos. You see progress, give feedback, and stay in control of the outcome.' 
    },
    { 
      num: '04', 
      title: 'Launch & Optimize', 
      duration: 'Ongoing',
      description: 'We ship, train your team, and stick around. Continuous optimization to keep your AI working as your business grows.' 
    },
  ];

  return (
    <section id="process" className="py-24 lg:py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-4">Process</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6">
            Idea to launch in weeks.
            <br />
            <span className="text-emerald-400">Not months.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-emerald-500">{step.num}</span>
                <span className="text-xs font-medium text-gray-500 bg-white/10 px-2 py-1 rounded">{step.duration}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "They built our entire platform in 4 weeks. Other agencies quoted us 6 months. The system handles thousands of orders monthly without breaking a sweat.",
      name: "Wholesale Client",
      title: "B2B E-Commerce",
      metric: "4 Week Delivery"
    },
    {
      quote: "Finally, developers who actually deliver. No excuses, no delays—just results. Our app went from idea to live in under 5 weeks.",
      name: "Dave",
      title: "Founder, SecuredTampa",
      metric: "5 Weeks to Launch"
    },
    {
      quote: "The automation systems they built save us 40+ hours a week. Best investment we've made in years. And they actually stick around to optimize.",
      name: "Trading Client",
      title: "E-Commerce",
      metric: "40+ hrs/week saved"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-600 font-medium text-sm tracking-wide uppercase mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900">
            Don&apos;t take our word for it
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  {t.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "How is Vantix different from other AI consultants?",
      answer: "Most consultants hand you a strategy deck and disappear. We consult, build, and manage—all in one. Plus, we run AI systems for our own businesses, so every recommendation comes from real experience."
    },
    {
      question: "How much does a typical project cost?",
      answer: "Discovery calls are free. Strategy packages start at $500. Build projects range from $2,500-$15,000 depending on complexity. Ongoing partnerships start at $500/month. We provide fixed pricing upfront—no surprises."
    },
    {
      question: "How long does implementation take?",
      answer: "Most projects launch in 3-5 weeks. Simple automations can be done in 1-2 weeks. Complex systems might take 6-8 weeks. We'll give you a clear timeline before we start."
    },
    {
      question: "What if I'm not technical?",
      answer: "Perfect—that's who we work with. We explain everything in plain English, give weekly demos, and handle all the technical complexity. You focus on your business."
    },
    {
      question: "Do you offer ongoing support?",
      answer: "Yes. Every project includes 30 days of support. For ongoing optimization and development, our Partnership tier provides continuous management starting at $500/month."
    },
    {
      question: "What types of AI do you work with?",
      answer: "Everything from chatbots and automation to custom ML models and trading systems. We're tool-agnostic—we use whatever technology best solves your specific problem."
    }
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900">
            Questions? Answers.
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================
function FinalCTA() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-300">Limited spots available this month</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
            Ready to make AI
            <br />
            <span className="text-emerald-400">actually work?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Book a free 30-minute discovery call. We&apos;ll analyze your business, 
            identify AI opportunities, and map out next steps—no commitment required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="mailto:usevantix@gmail.com?subject=Discovery%20Call%20Request"
              className="group px-8 py-4 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/25"
            >
              <Calendar size={18} />
              Book Your Free Call
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="tel:9084987753"
              className="px-8 py-4 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Phone size={18} />
              (908) 498-7753
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-400" />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-400" />
              <span>No commitment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-400" />
              <span>Response within 24 hours</span>
            </div>
          </div>
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
    <footer className="py-12 px-6 lg:px-12 bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <span className="font-semibold text-white">VANTIX</span>
              <span className="block text-xs text-gray-500">AI Consulting</span>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <a href="mailto:usevantix@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} />
              usevantix@gmail.com
            </a>
            <a href="tel:9084987753" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} />
              (908) 498-7753
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © 2026 Vantix LLC • New Jersey, USA
          </p>
        </div>
      </div>
    </footer>
  );
}
