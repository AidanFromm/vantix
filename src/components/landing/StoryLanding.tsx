'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ExternalLink } from 'lucide-react';

// ============================================
// STORY LANDING - Premium Scroll Experience
// ============================================

// Project data - each becomes a "chapter"
const projects = [
  {
    id: 1,
    year: '2024',
    title: 'Just Four Kicks',
    subtitle: 'B2B Wholesale Platform',
    description: 'Full-stack e-commerce platform powering $5.8M in sneaker wholesale. Custom inventory management, tiered pricing, and automated fulfillment.',
    color: 'from-orange-500/20 via-red-500/10 to-transparent',
    accentColor: '#f97316',
    stats: [
      { label: 'Revenue', value: '$5.8M' },
      { label: 'Stores', value: '300+' },
    ],
    image: '/projects/j4k-preview.png',
  },
  {
    id: 2,
    year: '2025',
    title: 'CardLedger',
    subtitle: 'Portfolio Tracker',
    description: 'The smartest portfolio tracker for card collectors. Real-time pricing, P&L tracking, and market insights across Pokemon, MTG, and more.',
    color: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    accentColor: '#0ea5e9',
    stats: [
      { label: 'Cards Tracked', value: '250K+' },
      { label: 'TCGs', value: '16' },
    ],
    image: '/projects/cardledger-preview.png',
  },
  {
    id: 3,
    year: '2025',
    title: 'SecuredTampa',
    subtitle: 'E-Commerce Store',
    description: 'Custom sneaker and Pokemon card store with inventory management, barcode scanning, and automated pricing updates.',
    color: 'from-purple-500/20 via-pink-500/10 to-transparent',
    accentColor: '#a855f7',
    stats: [
      { label: 'Products', value: '1,000+' },
      { label: 'Sales', value: '$50K+' },
    ],
    image: '/projects/secured-preview.png',
  },
  {
    id: 4,
    year: '2026',
    title: 'AI Automation',
    subtitle: 'Custom Bots & Systems',
    description: 'Intelligent automation systems including trading bots, data scrapers, and AI-powered business tools.',
    color: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: '#10b981',
    stats: [
      { label: 'Automations', value: '50+' },
      { label: 'Hours Saved', value: '10K+' },
    ],
    image: '/projects/automation-preview.png',
  },
];

// ============================================
// HERO SECTION - Opening Chapter
// ============================================
function HeroChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale, y }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Small label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-emerald-400/80 text-sm tracking-[0.3em] uppercase mb-8"
        >
          Digital Agency
        </motion.p>

        {/* Main title - large and thin */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-tight mb-6"
        >
          <span className="text-white">We Build</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Digital
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-lg md:text-xl font-light max-w-xl mx-auto mb-12"
        >
          Websites. Apps. Automation.
          <br />
          Solutions that actually work.
        </motion.p>

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
            className="flex flex-col items-center gap-2 text-white/30"
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
// PROJECT CHAPTER - Each project gets full screen
// ============================================
function ProjectChapter({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-40% 0px -40% 0px' });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
    >
      {/* Background gradient */}
      <motion.div
        style={{ opacity }}
        className={`absolute inset-0 bg-gradient-radial ${project.color}`}
      />
      
      {/* Year - large background text */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span 
          className="text-[20rem] md:text-[30rem] font-extralight text-white/[0.02] leading-none"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {project.year}
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Chapter number */}
          <div className="flex items-center gap-4 mb-6">
            <span 
              className="text-sm font-mono"
              style={{ color: project.accentColor }}
            >
              0{index + 1}
            </span>
            <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: project.accentColor + '40' }} />
            <span className="text-white/40 text-sm">{project.year}</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-2">
            {project.title}
          </h2>
          
          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl font-light mb-6"
            style={{ color: project.accentColor }}
          >
            {project.subtitle}
          </p>

          {/* Description */}
          <p className="text-white/50 text-base md:text-lg font-light leading-relaxed mb-8 max-w-md">
            {project.description}
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-8">
            {project.stats.map((stat, i) => (
              <div key={i}>
                <p className="text-2xl md:text-3xl font-light text-white">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ x: 5 }}
            className="group flex items-center gap-2 text-sm tracking-wide"
            style={{ color: project.accentColor }}
          >
            View Project
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Right - Visual placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          {/* Glass card container */}
          <div 
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${project.accentColor}10, transparent)`,
              border: `1px solid ${project.accentColor}20`,
            }}
          >
            {/* Inner glow */}
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${project.accentColor}15, transparent 60%)`,
              }}
            />
            
            {/* Placeholder content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: project.accentColor + '20' }}
                >
                  <ExternalLink size={24} style={{ color: project.accentColor }} />
                </div>
                <p className="text-white/30 text-sm">Preview Coming Soon</p>
              </div>
            </div>

            {/* Corner accents */}
            <div 
              className="absolute top-4 left-4 w-8 h-8 border-l border-t rounded-tl-lg"
              style={{ borderColor: project.accentColor + '40' }}
            />
            <div 
              className="absolute bottom-4 right-4 w-8 h-8 border-r border-b rounded-br-lg"
              style={{ borderColor: project.accentColor + '40' }}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ============================================
// CONTACT CHAPTER - Closing
// ============================================
function ContactChapter() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-emerald-400/80 text-sm tracking-[0.3em] uppercase mb-8"
        >
          Let&apos;s Work Together
        </motion.p>

        {/* Main text */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extralight text-white mb-8"
        >
          Ready to build
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            something great?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-white/40 text-lg md:text-xl font-light max-w-xl mx-auto mb-12"
        >
          We&apos;re always looking for ambitious projects.
          <br />
          Tell us about yours.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="mailto:usevantix@gmail.com"
            className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-full transition-all flex items-center gap-2"
          >
            Get in Touch
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            href="tel:9084987753"
            className="px-8 py-4 border border-white/20 hover:border-white/40 text-white/80 hover:text-white rounded-full transition-all"
          >
            (908) 498-7753
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MAIN EXPORT - Story Landing Page
// ============================================
export function StoryLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Fixed navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-wider">
            <span className="text-emerald-400">V</span>ANTIX
          </Link>
          
          <Link
            href="mailto:usevantix@gmail.com"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Story chapters */}
      <HeroChapter />
      
      {projects.map((project, index) => (
        <ProjectChapter key={project.id} project={project} index={index} />
      ))}
      
      <ContactChapter />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-white/30">
          <p>© 2026 Vantix LLC</p>
          <p>New Jersey, USA</p>
        </div>
      </footer>
    </div>
  );
}
