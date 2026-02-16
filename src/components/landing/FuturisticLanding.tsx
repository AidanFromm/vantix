'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowDown, Globe, Smartphone, Cpu, Database, Check, Star, Zap, Clock, Shield, MessageSquare, ChevronDown, Users, TrendingUp, Award } from 'lucide-react';

// ============================================
// FUTURISTIC LANDING - Premium Marketing Copy
// ============================================

export function FuturisticLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#fafafa] text-gray-900 min-h-screen">
      <Navigation />
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <WhatWeDoSection />
      <WhyUsSection />
      <ProcessSection />
      <ResultsSection />
      <TestimonialsSection />
      <WhoIsThisFor />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : ''
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-wide">VANTIX</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#services" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
          <Link href="#results" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Results</Link>
          <Link href="#process" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Process</Link>
          <Link href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
        </div>

        <Link
          href="#contact"
          className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-full hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25"
        >
          Get a Free Quote
        </Link>
      </div>
    </nav>
  );
}

// ============================================
// HERO - Hook + Promise
// ============================================
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-transparent" />
      
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d1fae5 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-[15%] w-64 h-64 bg-gradient-to-br from-emerald-200/40 to-cyan-200/20 rounded-3xl blur-sm"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-32 left-[10%] w-48 h-48 bg-gradient-to-br from-emerald-300/30 to-transparent rounded-full blur-sm"
      />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="max-w-4xl">
          {/* Urgency tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-emerald-100 mb-8"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Only taking <span className="font-semibold text-emerald-600">3 new clients</span> this month</span>
          </motion.div>

          {/* Main headline - Pain point + Solution */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] text-gray-900 mb-6"
          >
            Stop losing money to{' '}
            <span className="text-emerald-500">outdated tech</span>
            {' '}and manual busywork
          </motion.h1>

          {/* Subheadline - Benefit-focused */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
          >
            We build custom websites, apps, and automation systems that{' '}
            <span className="text-gray-900 font-medium">actually make you money</span>—not 
            just look pretty. In 3-5 weeks, you&apos;ll have a system that works as hard as you do.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="#contact"
              className="group px-8 py-4 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              Get Your Free Strategy Call
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#results"
              className="px-8 py-4 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all border border-gray-200"
            >
              See Client Results
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-gray-600">5.0 from 15+ clients</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} className="text-emerald-500" />
              <span>100% satisfaction guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} className="text-emerald-500" />
              <span>24hr response time</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ============================================
// SOCIAL PROOF BAR - Quick credibility
// ============================================
function SocialProofBar() {
  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">$6M+</p>
            <p className="text-sm text-gray-500">Revenue Generated</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200" />
          <div>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">50+</p>
            <p className="text-sm text-gray-500">Projects Shipped</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200" />
          <div>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">99.9%</p>
            <p className="text-sm text-gray-500">Uptime Guaranteed</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200" />
          <div>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">3-5</p>
            <p className="text-sm text-gray-500">Weeks to Launch</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROBLEM SECTION - Agitate the pain
// ============================================
function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: "Drowning in manual tasks",
      description: "You're spending hours on repetitive work that could be automated. Time you could be using to grow your business."
    },
    {
      icon: TrendingUp,
      title: "Missing out on revenue",
      description: "Your current website or systems aren't converting. Every day you wait is money left on the table."
    },
    {
      icon: Users,
      title: "Can't find reliable developers",
      description: "You've tried freelancers who ghost. Agencies that overcharge and underdeliver. You need a partner who actually gets it done."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Sound Familiar?</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            You know you need better tech.
            <br />
            <span className="text-gray-400">But where do you start?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <problem.icon size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{problem.title}</h3>
              <p className="text-gray-500 leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// WHAT WE DO - The Solution
// ============================================
function WhatWeDoSection() {
  const services = [
    {
      icon: Globe,
      title: 'Web Apps & Websites',
      tagline: 'That actually convert',
      description: 'Custom-built sites that turn visitors into customers. Not templates—real solutions designed around YOUR business.',
      benefits: ['Mobile-first design', 'Lightning fast', 'SEO optimized', 'Analytics built-in'],
      price: 'From $2,500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      tagline: 'Your business in every pocket',
      description: 'iOS and Android apps your customers will actually use. Push notifications, offline mode, the whole package.',
      benefits: ['Native performance', 'App Store ready', 'Push notifications', 'Offline capable'],
      price: 'From $5,000'
    },
    {
      icon: Cpu,
      title: 'AI & Automation',
      tagline: 'Work smarter, not harder',
      description: 'Bots and systems that handle the boring stuff while you sleep. Imagine waking up to more sales, not more emails.',
      benefits: ['24/7 operation', 'Custom workflows', 'AI integrations', 'Real-time alerts'],
      price: 'From $3,000'
    },
    {
      icon: Database,
      title: 'Backend & APIs',
      tagline: 'The engine behind the scenes',
      description: 'Powerful, scalable infrastructure that grows with you. No more crashes when you go viral.',
      benefits: ['99.9% uptime', 'Auto-scaling', 'Secure by default', 'Real-time data'],
      price: 'From $4,000'
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
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Our Services</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Everything you need to
            <br />
            <span className="text-emerald-500">dominate online</span>
          </h2>
          <p className="text-gray-500 text-lg">
            No bloated packages. No hidden fees. Just exactly what you need to win.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 lg:p-10 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <service.icon size={28} className="text-emerald-500" />
                </div>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  {service.price}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.title}</h3>
              <p className="text-emerald-600 text-sm font-medium mb-4">{service.tagline}</p>
              <p className="text-gray-500 leading-relaxed mb-6">{service.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {service.benefits.map((benefit, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-emerald-500" />
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25"
          >
            Get a Custom Quote
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-gray-400 mt-4">Free consultation • No commitment</p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// WHY US - Differentiators
// ============================================
function WhyUsSection() {
  const reasons = [
    {
      icon: Zap,
      title: "We move fast",
      description: "Most projects launch in 3-5 weeks. Not 3-5 months. You'll have updates every step of the way."
    },
    {
      icon: MessageSquare,
      title: "We actually communicate",
      description: "No ghosting. No corporate BS. Direct access to the people building your product. 24hr response guarantee."
    },
    {
      icon: Shield,
      title: "We guarantee results",
      description: "If you're not happy, we'll make it right or refund you. That's how confident we are in our work."
    },
    {
      icon: Award,
      title: "We've done this before",
      description: "50+ projects. $6M+ in client revenue generated. We know what works because we've built what works."
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-4">Why Vantix</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
              We&apos;re not like other agencies.
              <br />
              <span className="text-gray-400">And that&apos;s the point.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Big agencies charge $50k for a basic website. Freelancers disappear mid-project. 
              We&apos;re the sweet spot: senior-level talent, startup speed, and prices that make sense.
            </p>
          </motion.div>

          {/* Right - Reasons */}
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                  <reason.icon size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{reason.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS - How We Work
// ============================================
function ProcessSection() {
  const steps = [
    { 
      num: '01', 
      title: 'Discovery Call', 
      duration: '30 min',
      description: 'We learn about your business, goals, and what\'s not working. You\'ll leave with clarity on next steps—even if we\'re not a fit.' 
    },
    { 
      num: '02', 
      title: 'Strategy & Quote', 
      duration: '2-3 days',
      description: 'We create a detailed roadmap and fixed-price quote. No surprises. You\'ll know exactly what you\'re getting and when.' 
    },
    { 
      num: '03', 
      title: 'Build Sprint', 
      duration: '3-5 weeks',
      description: 'We build your solution with weekly demos. You see progress every week and give feedback that actually gets implemented.' 
    },
    { 
      num: '04', 
      title: 'Launch & Beyond', 
      duration: 'Ongoing',
      description: 'We launch, train your team, and stick around for support. You\'re never left hanging after we ship.' 
    },
  ];

  return (
    <section id="process" className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Our Process</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            From idea to launch in
            <br />
            <span className="text-emerald-500">weeks, not months</span>
          </h2>
          <p className="text-gray-500 text-lg">
            A proven system that&apos;s shipped 50+ successful projects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 bg-white rounded-2xl border border-gray-100"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-200 to-transparent -translate-x-6 z-0" />
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-emerald-500">{step.num}</span>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">{step.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// RESULTS - Proof
// ============================================
function ResultsSection() {
  const projects = [
    { 
      name: 'Just Four Kicks', 
      result: '$5.8M Revenue',
      metric: '300+ stores served',
      type: 'B2B E-Commerce Platform',
      description: 'Built the entire tech stack for a wholesale sneaker operation. Custom inventory, tiered pricing, automated fulfillment.'
    },
    { 
      name: 'CardLedger', 
      result: '250K+ Cards',
      metric: 'Tracked across 16 TCGs',
      type: 'Portfolio Tracker App',
      description: 'The smartest portfolio tracker for card collectors. Real-time pricing, P&L tracking, market insights.'
    },
    { 
      name: 'Trading Systems', 
      result: '10,000+ Hours',
      metric: 'Automated annually',
      type: 'AI Automation',
      description: 'Custom trading bots and automation systems that operate 24/7. While our clients sleep, their systems work.'
    },
  ];

  return (
    <section id="results" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Case Studies</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Real projects.
            <br />
            <span className="text-emerald-500">Real results.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            We don&apos;t just build pretty things. We build things that make money.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all"
            >
              <p className="text-sm text-emerald-600 font-medium mb-3">{project.type}</p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{project.description}</p>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-3xl font-bold text-emerald-500 mb-1">{project.result}</p>
                <p className="text-sm text-gray-400">{project.metric}</p>
              </div>
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
      quote: "They built our entire platform in 4 weeks. Other agencies quoted us 6 months. The system handles $500K+ in monthly orders without breaking a sweat.",
      name: "Kyle",
      title: "CEO, Just Four Kicks",
      avatar: "K"
    },
    {
      quote: "Finally, developers who actually deliver. No excuses, no delays—just results. Our app went from idea to live in under 5 weeks.",
      name: "Dave",
      title: "Founder, SecuredTampa",
      avatar: "D"
    },
    {
      quote: "The automation systems they built save us 40+ hours a week. Best investment we've made in years.",
      name: "Client",
      title: "E-Commerce Owner",
      avatar: "C"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-2xl shadow-sm"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
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
// WHO IS THIS FOR
// ============================================
function WhoIsThisFor() {
  const ideal = [
    "Business owners who want to stop losing money to outdated systems",
    "Founders ready to launch their MVP in weeks, not months",
    "Companies that need reliable developers who actually deliver",
    "Anyone who's tired of agencies that overpromise and underdeliver"
  ];

  const notIdeal = [
    "Looking for the cheapest option (we're not)",
    "Want a $500 Fiverr website",
    "Not ready to invest in growth",
    "Need hand-holding on every decision"
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Is This You?</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900">
            We&apos;re not for everyone.
            <br />
            <span className="text-gray-400">And that&apos;s okay.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Ideal fit */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
              Perfect fit if you&apos;re...
            </h3>
            <ul className="space-y-4">
              {ideal.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not ideal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-gray-50 rounded-2xl border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">×</span>
              </div>
              Not ideal if you&apos;re...
            </h3>
            <ul className="space-y-4">
              {notIdeal.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-500">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ SECTION
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "How much does a typical project cost?",
      answer: "Projects range from $2,500 for a basic website to $25,000+ for complex apps and automation systems. We provide a fixed-price quote upfront so there are no surprises. Most clients invest between $5,000-$15,000."
    },
    {
      question: "How long does it take to build?",
      answer: "Most projects launch in 3-5 weeks. Simple websites can be done in 1-2 weeks. Complex apps might take 6-8 weeks. We'll give you a clear timeline before we start, and we stick to it."
    },
    {
      question: "What if I'm not happy with the result?",
      answer: "We have a 100% satisfaction guarantee. We'll revise until you're thrilled with the result, or we'll refund your money. In 5 years, we've never had to issue a refund—but the guarantee is there."
    },
    {
      question: "Do you offer ongoing support?",
      answer: "Yes! Every project includes 30 days of free support after launch. After that, we offer monthly maintenance plans starting at $500/month for updates, monitoring, and priority support."
    },
    {
      question: "I'm not technical. Will I understand what's happening?",
      answer: "Absolutely. We explain everything in plain English and give weekly demos so you can see progress. You'll never feel lost or confused—we're here to make this easy for you."
    },
    {
      question: "Can you work with my existing systems?",
      answer: "Yes. We've integrated with everything from Shopify to Salesforce to custom APIs. If you have existing tools, we'll work with them. No need to start from scratch."
    }
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} 
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
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
          {/* Urgency */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-300">Only taking 3 new clients this month</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
            Ready to stop leaving
            <br />
            <span className="text-emerald-400">money on the table?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Book a free 30-minute strategy call. We&apos;ll analyze your current setup, 
            identify opportunities, and give you a clear action plan—even if we&apos;re not a fit.
          </p>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="mailto:usevantix@gmail.com"
              className="group px-8 py-4 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              Book Your Free Strategy Call
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="tel:9084987753"
              className="px-8 py-4 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all"
            >
              (908) 498-7753
            </Link>
          </div>

          {/* Trust signals */}
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
              <span>24hr response</span>
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
    <footer className="py-8 px-6 lg:px-12 bg-gray-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="text-sm text-gray-500">© 2026 Vantix LLC</span>
        </div>
        <p className="text-sm text-gray-500">New Jersey, USA • usevantix@gmail.com</p>
      </div>
    </footer>
  );
}
