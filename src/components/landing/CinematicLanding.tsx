'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowDown } from 'lucide-react';

// ============================================
// PROJECT DATA
// ============================================
const projects = [
  {
    id: 1,
    year: '2024',
    name: 'JUST FOUR',
    subtitle: 'KICKS',
    tagline: '$5.8M Wholesale Platform',
    story: '2024 was an incredible year for B2B commerce. We built the infrastructure that powers 300+ stores, processing thousands of orders with custom tiered pricing and automated fulfillment.',
    stats: { revenue: '$5.8M', stores: '300+', products: '10K+' },
  },
  {
    id: 2,
    year: '2025',
    name: 'CARD',
    subtitle: 'LEDGER',
    tagline: 'Portfolio Tracker',
    story: '2025 marked the rise of collectible investing. CardLedger tracks 250K+ cards across 16 TCGs with real-time pricing, P&L analytics, and AI-powered market insights.',
    stats: { cards: '250K+', tcgs: '16', users: '2K+' },
  },
  {
    id: 3,
    year: '2026',
    name: 'AI',
    subtitle: 'SYSTEMS',
    tagline: 'Intelligent Automation',
    story: '2026 is the year of AI automation. Custom bots, data pipelines, and intelligent systems that work 24/7. From trading algorithms to workflow automation.',
    stats: { automations: '50+', hours: '10K+', uptime: '99.9%' },
  },
];

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y, scale }}
      className="relative h-screen flex items-center justify-center"
    >
      {/* Ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-400/80 tracking-wider">DIGITAL AGENCY</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-4"
        >
          We Build
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Digital
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/40 text-lg md:text-xl font-light max-w-md mx-auto mb-12"
        >
          Websites. Apps. Automation.
          <br />
          Solutions that actually work.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="#projects"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
          >
            View Our Work
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
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
            className="flex flex-col items-center gap-2 text-emerald-400/40"
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
// PROJECT SECTION - Full screen each
// ============================================
function ProjectSection({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-40% 0px -40% 0px' });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id={index === 0 ? 'projects' : undefined}
      className="relative min-h-screen flex items-center py-20"
    >
      {/* Large year in background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span 
          className="text-[18rem] md:text-[28rem] lg:text-[36rem] font-extralight leading-none tracking-tighter"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(16,185,129,0.1)',
          }}
        >
          {project.year}
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left - Story Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div 
              className="p-8 rounded-2xl backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
                border: '1px solid rgba(16,185,129,0.15)',
              }}
            >
              <p className="text-emerald-400/60 text-xs tracking-[0.3em] uppercase mb-4">
                {project.year} PROJECT
              </p>
              <p className="text-white/80 text-base leading-relaxed mb-8">
                {project.story}
              </p>
              
              {/* Stats */}
              <div className="space-y-3 pt-6 border-t border-emerald-500/10">
                {Object.entries(project.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-white/40 capitalize">{key}</span>
                    <span className="text-emerald-400 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center - Project Name */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-4 text-center"
          >
            {/* Number */}
            <p className="text-emerald-400/40 text-sm font-mono mb-4">
              0{index + 1}
            </p>

            {/* Name */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none mb-2">
              {project.name}
            </h2>
            <h3 
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-none mb-6"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.subtitle}
            </h3>

            {/* Tagline */}
            <p className="text-white/40 text-sm tracking-widest uppercase mb-8">
              {project.tagline}
            </p>

            {/* Glow line */}
            <div className="relative h-[2px] w-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-emerald-500" />
              <div className="absolute inset-0 blur-sm bg-emerald-400" />
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="group px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm tracking-wider hover:bg-emerald-500/20 transition-all inline-flex items-center gap-2"
            >
              VIEW PROJECT
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Right - Empty or additional info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 hidden lg:block"
          >
            {/* Decorative element */}
            <div className="flex justify-end">
              <div 
                className="w-64 h-64 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, transparent 100%)',
                  border: '1px solid rgba(16,185,129,0.1)',
                }}
              />
            </div>
          </motion.div>
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
    <section className="relative min-h-[70vh] flex items-center justify-center py-20">
      {/* Ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-emerald-400/60 text-sm tracking-[0.3em] uppercase mb-6"
        >
          Let&apos;s Work Together
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-4"
        >
          Ready to build
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light mb-12"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          something great?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="mailto:usevantix@gmail.com"
            className="group px-8 py-4 bg-emerald-500 text-black font-medium rounded-full hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            Get in Touch
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="tel:9084987753"
            className="px-8 py-4 border border-emerald-500/30 text-emerald-400 rounded-full hover:bg-emerald-500/10 transition-all"
          >
            (908) 498-7753
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export function CinematicLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure we start at the top
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0a0f0d 50%, #0a0a0a 100%)',
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-sm tracking-[0.3em] text-white/80 hover:text-white transition-colors">
          VANTIX
        </Link>
        <Link 
          href="mailto:usevantix@gmail.com"
          className="text-sm tracking-wider text-white/40 hover:text-white transition-colors"
        >
          CONTACT
        </Link>
      </nav>

      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Sections */}
      <HeroSection />
      
      {projects.map((project, index) => (
        <ProjectSection key={project.id} project={project} index={index} />
      ))}
      
      <ContactSection />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-emerald-500/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-white/30">
          <p>© 2026 Vantix LLC</p>
          <p>New Jersey, USA</p>
        </div>
      </footer>
    </div>
  );
}
