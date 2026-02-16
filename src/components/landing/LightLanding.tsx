'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ExternalLink, Code2, Smartphone, Cpu, Zap, Mail, Phone } from 'lucide-react';

// ============================================
// PROJECT DATA
// ============================================
const projects = [
  {
    id: 1,
    number: '01',
    year: '2024',
    title: 'Just Four Kicks',
    subtitle: 'B2B Wholesale Platform',
    story: 'We built the infrastructure behind a $5.8M sneaker wholesale operation. Custom inventory management, tiered pricing for 300+ stores, and automated fulfillment that scales.',
    description: 'Full-stack e-commerce platform with React, Node.js, and Supabase.',
    gradient: 'from-orange-500/10 via-red-500/5 to-transparent',
    accentColor: '#f97316',
    stats: [
      { label: 'Revenue', value: '$5.8M' },
      { label: 'Active Stores', value: '300+' },
      { label: 'Products', value: '10K+' },
    ],
  },
  {
    id: 2,
    number: '02',
    year: '2025',
    title: 'CardLedger',
    subtitle: 'Portfolio Tracker',
    story: 'The smartest portfolio tracker for card collectors. We built real-time pricing across 16 TCGs, P&L tracking, and AI-powered market insights.',
    description: 'React + TypeScript PWA with Pokemon TCG API and custom pricing engine.',
    gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
    accentColor: '#0ea5e9',
    stats: [
      { label: 'Cards Tracked', value: '250K+' },
      { label: 'TCG Games', value: '16' },
      { label: 'Daily Users', value: '2K+' },
    ],
  },
  {
    id: 3,
    number: '03',
    year: '2025',
    title: 'SecuredTampa',
    subtitle: 'E-Commerce Store',
    story: 'A custom sneaker and Pokemon store with inventory management, barcode scanning, and automated pricing. Built to handle high-volume sales.',
    description: 'Next.js storefront with Supabase backend and Stripe integration.',
    gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    accentColor: '#a855f7',
    stats: [
      { label: 'Products', value: '1,000+' },
      { label: 'Monthly Sales', value: '$50K+' },
      { label: 'Conversion', value: '4.2%' },
    ],
  },
  {
    id: 4,
    number: '04',
    year: '2026',
    title: 'AI Systems',
    subtitle: 'Automation & Bots',
    story: 'Custom AI-powered automation systems. Trading bots, data scrapers, workflow automation—tools that work 24/7 so you don\'t have to.',
    description: 'Python + Node.js automation with OpenAI, websockets, and cloud deployment.',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    accentColor: '#10b981',
    stats: [
      { label: 'Automations', value: '50+' },
      { label: 'Hours Saved', value: '10K+' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
];

const services = [
  { icon: Code2, title: 'Web Development', description: 'Custom websites and web apps built with modern frameworks.' },
  { icon: Smartphone, title: 'Mobile Apps', description: 'iOS and Android apps that users actually love.' },
  { icon: Cpu, title: 'Automation', description: 'AI-powered systems that work while you sleep.' },
  { icon: Zap, title: 'Systems', description: 'Backend infrastructure that scales with your business.' },
];

// ============================================
// NAVIGATION
// ============================================
function LightNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-100' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-medium tracking-wide text-gray-900">
          <span className="text-emerald-500">V</span>ANTIX
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="#work" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Work
          </Link>
          <Link href="#services" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Services
          </Link>
          <Link
            href="#contact"
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ============================================
// HERO SECTION
// ============================================
function LightHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]"
    >
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated gradient orb */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 via-cyan-200/30 to-transparent rounded-full blur-[100px]"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-700 font-medium">Digital Agency • New Jersey</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 mb-6"
        >
          We Build
          <br />
          <span className="font-normal bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Digital
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto mb-12"
        >
          Websites. Apps. Automation.
          <br />
          <span className="text-gray-900">Solutions that actually work.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#work"
            className="group px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            See Our Work
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-full transition-all"
          >
            Get in Touch
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ============================================
// PROJECT CHAPTER
// ============================================
function ProjectChapter({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-30% 0px -30% 0px' });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id={index === 0 ? 'work' : undefined}
      className="relative min-h-screen flex items-center py-20 bg-white overflow-hidden"
    >
      {/* Background gradient */}
      <motion.div
        style={{ opacity }}
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
      />
      
      {/* Large background number */}
      <motion.div
        style={{ y, opacity }}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
      >
        <span 
          className="text-[25rem] font-extralight leading-none"
          style={{ 
            color: project.accentColor,
            opacity: 0.05,
          }}
        >
          {project.number}
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Number + Year */}
            <div className="flex items-center gap-4 mb-6">
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: project.accentColor }}
              >
                {project.number}
              </span>
              <div className="h-px w-12" style={{ backgroundColor: project.accentColor + '40' }} />
              <span className="text-sm text-gray-400">{project.year}</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-2">
              {project.title}
            </h2>
            
            {/* Subtitle */}
            <p 
              className="text-lg md:text-xl font-medium mb-6"
              style={{ color: project.accentColor }}
            >
              {project.subtitle}
            </p>

            {/* Story */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 max-w-lg">
              {project.story}
            </p>

            {/* Tech description */}
            <p className="text-gray-400 text-sm mb-8">
              {project.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-8">
              {project.stats.map((stat, i) => (
                <div key={i}>
                  <p 
                    className="text-3xl md:text-4xl font-light"
                    style={{ color: project.accentColor }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ x: 5 }}
              className="group flex items-center gap-2 text-sm font-medium text-gray-900"
            >
              View Case Study
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Right - Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Device mockup container */}
            <div 
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-2xl shadow-gray-200/50"
            >
              {/* Browser chrome */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4">
                  <div className="h-5 bg-white rounded border border-gray-200 max-w-xs mx-auto" />
                </div>
              </div>
              
              {/* Content placeholder */}
              <div className="absolute inset-0 mt-10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: project.accentColor + '15' }}
                  >
                    <ExternalLink size={28} style={{ color: project.accentColor }} />
                  </div>
                  <p className="text-gray-400 text-sm">Live Preview</p>
                  <p className="text-gray-300 text-xs mt-1">Coming Soon</p>
                </div>
              </div>

              {/* Ambient glow */}
              <div 
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-32 blur-3xl rounded-full"
                style={{ backgroundColor: project.accentColor + '20' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SERVICES SECTION
// ============================================
function ServicesSection() {
  return (
    <section id="services" className="py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-4">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            Full-Stack <span className="font-normal">Digital Services</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                <service.icon size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-4">Let&apos;s Work Together</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6">
            Ready to build
            <br />
            <span className="font-normal bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              something great?
            </span>
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
            We&apos;re always looking for ambitious projects.
            Tell us about yours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:usevantix@gmail.com"
              className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all"
            >
              <Mail size={18} />
              usevantix@gmail.com
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="tel:9084987753"
              className="flex items-center gap-3 px-8 py-4 border border-gray-300 text-gray-700 hover:border-gray-400 rounded-full transition-all"
            >
              <Phone size={18} />
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
    <footer className="py-8 px-6 bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© 2026 Vantix LLC. All rights reserved.</p>
        <p>New Jersey, USA</p>
      </div>
    </footer>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export function LightLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <LightNav />
      <LightHero />
      
      {projects.map((project, index) => (
        <ProjectChapter key={project.id} project={project} index={index} />
      ))}
      
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
