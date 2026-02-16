'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================
// PROJECT DATA - Like wine vintages
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
// MAIN CINEMATIC LANDING
// ============================================
export function CinematicLanding() {
  const [currentProject, setCurrentProject] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for subtle parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const nextProject = () => setCurrentProject((p) => (p + 1) % projects.length);
  const prevProject = () => setCurrentProject((p) => (p - 1 + projects.length) % projects.length);

  if (!mounted) return null;

  const project = projects[currentProject];

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1f1a 50%, #0a0a0a 100%)',
      }}
    >
      {/* ============================================ */}
      {/* AMBIENT BACKGROUND EFFECTS */}
      {/* ============================================ */}
      
      {/* Main ambient glow */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* ============================================ */}
      {/* NAVIGATION - Minimal */}
      {/* ============================================ */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
        <Link href="/" className="text-sm tracking-[0.3em] text-white/80 hover:text-white transition-colors">
          VANTIX
        </Link>
        <Link 
          href="mailto:usevantix@gmail.com"
          className="text-sm tracking-wider text-white/50 hover:text-white transition-colors"
        >
          CONTACT
        </Link>
      </nav>

      {/* ============================================ */}
      {/* LARGE YEAR - Background Typography */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.year}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <motion.span 
            style={{ 
              x: smoothX, 
              y: smoothY,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(16,185,129,0.15)',
              textShadow: '0 0 100px rgba(16,185,129,0.1)',
            }}
            className="text-[20rem] md:text-[30rem] lg:text-[40rem] font-extralight leading-none tracking-tighter"
          >
            {project.year}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      {/* ============================================ */}
      {/* MAIN CONTENT - Three Column Layout */}
      {/* ============================================ */}
      <div className="relative z-10 h-full flex items-center px-8 lg:px-16">
        <div className="w-full grid grid-cols-12 gap-8 items-center">
          
          {/* LEFT PANEL - Story */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="col-span-12 lg:col-span-3"
          >
            {/* Glass panel */}
            <div 
              className="p-8 rounded-2xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
                border: '1px solid rgba(16,185,129,0.15)',
                boxShadow: '0 0 60px rgba(16,185,129,0.05)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-emerald-400/60 text-xs tracking-[0.3em] uppercase mb-4">
                    {project.year} PROJECT
                  </p>
                  <h3 className="text-white/90 text-lg font-light leading-relaxed mb-6">
                    {project.story}
                  </h3>
                  
                  {/* Stats */}
                  <div className="space-y-3 pt-6 border-t border-emerald-500/10">
                    {Object.entries(project.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-white/40 capitalize">{key}</span>
                        <span className="text-emerald-400 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CENTER - Project Name (Hero) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="col-span-12 lg:col-span-6 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Project name - stacked */}
                <div className="mb-8">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight text-white leading-none">
                    {project.name}
                  </h1>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none mt-2"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {project.subtitle}
                  </h2>
                </div>

                {/* Tagline */}
                <p className="text-white/50 text-sm md:text-base tracking-[0.2em] uppercase mb-12">
                  {project.tagline}
                </p>

                {/* Neon line glow */}
                <div className="relative h-[2px] w-48 mx-auto mb-12">
                  <div className="absolute inset-0 bg-emerald-500" />
                  <div 
                    className="absolute inset-0 blur-md"
                    style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}
                  />
                  <div 
                    className="absolute -inset-4 blur-xl opacity-50"
                    style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}
                  />
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm tracking-wider hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center gap-3 mx-auto"
                >
                  VIEW PROJECT
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* RIGHT PANEL - Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="col-span-12 lg:col-span-3"
          >
            {/* Glass panel */}
            <div 
              className="p-8 rounded-2xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
                border: '1px solid rgba(16,185,129,0.15)',
                boxShadow: '0 0 60px rgba(16,185,129,0.05)',
              }}
            >
              <p className="text-emerald-400/60 text-xs tracking-[0.3em] uppercase mb-6">
                ALL PROJECTS
              </p>
              
              {/* Project list */}
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <motion.button
                    key={p.id}
                    onClick={() => setCurrentProject(i)}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      i === currentProject 
                        ? 'bg-emerald-500/15 border border-emerald-500/30' 
                        : 'hover:bg-emerald-500/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-mono ${i === currentProject ? 'text-emerald-400' : 'text-white/30'}`}>
                        0{i + 1}
                      </span>
                      <div>
                        <p className={`text-sm font-medium ${i === currentProject ? 'text-white' : 'text-white/60'}`}>
                          {p.name} {p.subtitle}
                        </p>
                        <p className="text-xs text-white/30">{p.year}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================ */}
      {/* BOTTOM CONTROLS */}
      {/* ============================================ */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8 lg:px-16">
        {/* Arrow navigation */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevProject}
            className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400/60 hover:border-emerald-500/60 hover:text-emerald-400 transition-all"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextProject}
            className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400/60 hover:border-emerald-500/60 hover:text-emerald-400 transition-all"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-3">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentProject(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentProject 
                  ? 'w-8 bg-emerald-400' 
                  : 'w-2 bg-emerald-500/30 hover:bg-emerald-500/50'
              }`}
            />
          ))}
        </div>

        {/* Contact info */}
        <div className="hidden md:flex items-center gap-6 text-sm text-white/30">
          <span>(908) 498-7753</span>
          <span>NJ, USA</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* CORNER ACCENTS */}
      {/* ============================================ */}
      <div className="absolute top-20 left-8 w-16 h-16 border-l border-t border-emerald-500/20 rounded-tl-lg" />
      <div className="absolute top-20 right-8 w-16 h-16 border-r border-t border-emerald-500/20 rounded-tr-lg" />
      <div className="absolute bottom-20 left-8 w-16 h-16 border-l border-b border-emerald-500/20 rounded-bl-lg" />
      <div className="absolute bottom-20 right-8 w-16 h-16 border-r border-b border-emerald-500/20 rounded-br-lg" />
    </div>
  );
}
