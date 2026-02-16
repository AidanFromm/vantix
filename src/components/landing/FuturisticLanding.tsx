'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowDown, Code2, Smartphone, Cpu, Zap, Globe, Database, Cloud, Lock, Check } from 'lucide-react';

// ============================================
// FUTURISTIC LANDING - White + Green + Tech
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
      <WhatWeDoSection />
      <ServicesDetailSection />
      <ProcessSection />
      <TechStackSection />
      <ResultsSection />
      <ContactSection />
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
          <Link href="#process" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Process</Link>
          <Link href="#tech" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Technology</Link>
        </div>

        <Link
          href="#contact"
          className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-full hover:bg-emerald-600 transition-colors"
        >
          Start a Project
        </Link>
      </div>
    </nav>
  );
}

// ============================================
// HERO - What We Do (Main Message)
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
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-emerald-100 mb-8"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-sm text-gray-600">Digital Agency • New Jersey</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] text-gray-900 mb-6"
          >
            We build the{' '}
            <span className="text-emerald-500">digital infrastructure</span>
            {' '}your business needs to scale
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
          >
            From custom web applications to AI-powered automation systems. 
            We turn complex technical challenges into elegant, scalable solutions 
            that drive real business results.
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
              Start Your Project
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#services"
              className="px-8 py-4 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all border border-gray-200"
            >
              See What We Build
            </Link>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-gray-200"
          >
            {[
              { value: '$6M+', label: 'Revenue Generated' },
              { value: '50+', label: 'Projects Delivered' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl md:text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
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
// WHAT WE DO - Overview
// ============================================
function WhatWeDoSection() {
  const services = [
    {
      icon: Globe,
      title: 'Web Applications',
      description: 'Custom web apps built with React, Next.js, and modern frameworks. From SaaS platforms to e-commerce solutions.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android. React Native and Swift.',
    },
    {
      icon: Cpu,
      title: 'AI & Automation',
      description: 'Intelligent systems that work 24/7. Trading bots, data pipelines, workflow automation, and AI integrations.',
    },
    {
      icon: Database,
      title: 'Backend Systems',
      description: 'Scalable APIs, databases, and infrastructure. Node.js, Python, PostgreSQL, and cloud deployment.',
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
          className="max-w-2xl mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">What We Build</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Full-stack digital solutions for modern businesses
          </h2>
          <p className="text-gray-500 text-lg">
            We handle everything from initial concept to deployment and maintenance. 
            No hand-offs, no miscommunication—just results.
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
              className="group p-8 lg:p-10 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <service.icon size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SERVICES DETAIL - Deep Dive
// ============================================
function ServicesDetailSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-cyan-50 rounded-3xl overflow-hidden">
              {/* Code-like visual */}
              <div className="p-8 font-mono text-sm">
                <div className="space-y-2 text-gray-400">
                  <p><span className="text-emerald-500">const</span> vantix = {'{'}</p>
                  <p className="pl-4"><span className="text-gray-600">services</span>: [</p>
                  <p className="pl-8 text-emerald-600">&apos;web_development&apos;,</p>
                  <p className="pl-8 text-emerald-600">&apos;mobile_apps&apos;,</p>
                  <p className="pl-8 text-emerald-600">&apos;ai_automation&apos;,</p>
                  <p className="pl-8 text-emerald-600">&apos;backend_systems&apos;</p>
                  <p className="pl-4">],</p>
                  <p className="pl-4"><span className="text-gray-600">mission</span>: <span className="text-cyan-600">&apos;build_digital_that_works&apos;</span></p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 px-6 py-3 bg-white rounded-xl shadow-lg">
              <p className="text-emerald-500 font-semibold">50+ Projects</p>
              <p className="text-gray-400 text-sm">Delivered</p>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Why Vantix</p>
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
              We don&apos;t just write code. We solve business problems.
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Every project starts with understanding your goals. We then architect 
              solutions that are not only technically excellent but actually move 
              the needle for your business.
            </p>

            <div className="space-y-4">
              {[
                'Custom solutions tailored to your specific needs',
                'Modern tech stack for performance and scalability',
                'Transparent communication throughout the project',
                'Ongoing support and maintenance included',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-emerald-600" />
                  </div>
                  <p className="text-gray-600">{item}</p>
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
// PROCESS - How We Work
// ============================================
function ProcessSection() {
  const steps = [
    { num: '01', title: 'Discovery', description: 'We learn about your business, goals, and technical requirements.' },
    { num: '02', title: 'Strategy', description: 'We architect the solution and create a detailed project roadmap.' },
    { num: '03', title: 'Build', description: 'Our team develops your solution with regular updates and feedback.' },
    { num: '04', title: 'Launch', description: 'We deploy, test, and ensure everything runs smoothly.' },
  ];

  return (
    <section id="process" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Our Process</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900">
            From idea to launch in weeks, not months
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-light text-emerald-200 mb-4">{step.num}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TECH STACK
// ============================================
function TechStackSection() {
  const tech = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Framework' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'AI/Automation' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Supabase', category: 'BaaS' },
    { name: 'AWS/Vercel', category: 'Cloud' },
  ];

  return (
    <section id="tech" className="py-24 lg:py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-4">Technology</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium">
            Built with modern tools for modern problems
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tech.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-colors"
            >
              <p className="font-semibold text-white mb-1">{t.name}</p>
              <p className="text-sm text-white/50">{t.category}</p>
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
    { name: 'Just Four Kicks', result: '$5.8M in wholesale revenue', type: 'E-Commerce Platform' },
    { name: 'CardLedger', result: '250K+ cards tracked', type: 'Portfolio Tracker' },
    { name: 'AI Trading Systems', result: '10K+ hours automated', type: 'Automation' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Results</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900">
            Real projects, real impact
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-2xl border border-gray-100"
            >
              <p className="text-sm text-emerald-500 font-medium mb-2">{project.type}</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{project.name}</h3>
              <p className="text-2xl font-semibold text-emerald-500">{project.result}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT
// ============================================
function ContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-emerald-500 font-medium text-sm tracking-wide uppercase mb-4">Get Started</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
            Ready to build something great?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Tell us about your project. We&apos;ll get back to you within 24 hours 
            with a free consultation and project estimate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:usevantix@gmail.com"
              className="group px-8 py-4 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              usevantix@gmail.com
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="tel:9084987753"
              className="px-8 py-4 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-all"
            >
              (908) 498-7753
            </Link>
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
    <footer className="py-8 px-6 lg:px-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">© 2026 Vantix LLC. All rights reserved.</p>
        <p className="text-sm text-gray-500">New Jersey, USA</p>
      </div>
    </footer>
  );
}
