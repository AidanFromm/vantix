'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowUpRight, 
  ExternalLink, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  BarChart3,
  Package,
  Smartphone,
  Monitor,
  TrendingUp,
  Star
} from 'lucide-react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/ui/scroll-animations';
import { MagneticArrowButton } from '@/components/ui/magnetic-button';

// ===========================================
// PROJECT DATA - REAL PROJECTS
// ===========================================
interface ProjectStat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface Project {
  title: string;
  subtitle: string;
  url: string;
  type: string;
  description: string;
  fullDescription: string;
  tech: string[];
  stats: ProjectStat[];
  gradient: string;
  accentColor: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: 'Just Four Kicks',
    subtitle: 'J4K',
    url: 'https://justfourkicks.store',
    type: 'B2B Wholesale Sneaker Platform',
    description: 'Full-stack e-commerce platform for sneaker wholesale distribution.',
    fullDescription: 'Enterprise-grade B2B platform featuring admin dashboard, customer portal, staff management, FedEx integration, tiered pricing system, and real-time inventory management.',
    tech: ['React', 'TypeScript', 'Supabase', 'Vercel', 'FedEx API'],
    stats: [
      { label: 'Orders Processed', value: '35K+', icon: <DollarSign size={16} /> },
      { label: 'Active SKUs', value: '2,500+', icon: <Package size={16} /> },
      { label: 'B2B Customers', value: '150+', icon: <Users size={16} /> },
    ],
    gradient: 'from-[#B07A45]/50 via-[#B07A45] to-[#B07A45]',
    accentColor: 'emerald',
    featured: true,
  },
  {
    title: 'Secured Tampa',
    subtitle: 'Dave App',
    url: 'https://securedtampa.com',
    type: 'Sneaker & Pokemon E-commerce',
    description: 'Full inventory system with barcode scanning and product management.',
    fullDescription: 'Comprehensive e-commerce solution with barcode scanning, product grouping, Pokemon card tracking, admin portal, and customer-facing shop with real-time inventory sync.',
    tech: ['Next.js', 'Supabase', 'Barcode API', 'Stripe'],
    stats: [
      { label: 'Products Tracked', value: '10K+', icon: <Package size={16} /> },
      { label: 'Daily Scans', value: '500+', icon: <BarChart3 size={16} /> },
      { label: 'Order Accuracy', value: '99.9%', icon: <TrendingUp size={16} /> },
    ],
    gradient: 'from-[#B07A45] via-[#B07A45]/50 to-[#B07A45]',
    accentColor: 'violet',
  },
  {
    title: 'CardLedger',
    subtitle: 'Portfolio Tracker',
    url: 'https://usecardledger.com',
    type: 'Collectibles Portfolio Tracker',
    description: 'Track and manage your card collection portfolio with real-time pricing.',
    fullDescription: 'Native iOS app for tracking collectible cards including Pokemon, sports cards, and TCGs. Features real-time pricing, portfolio analytics, and comprehensive inventory management.',
    tech: ['React', 'TypeScript', 'Capacitor', 'iOS', 'Price APIs'],
    stats: [
      { label: 'Cards Tracked', value: '50K+', icon: <ShoppingCart size={16} /> },
      { label: 'iOS Downloads', value: '1,200+', icon: <Smartphone size={16} /> },
      { label: 'User Rating', value: '4.8★', icon: <Star size={16} /> },
    ],
    gradient: 'from-[#B07A45] via-[#B07A45] to-[#B0614A]/50',
    accentColor: 'amber',
  },
];

// ===========================================
// 3D PORTFOLIO CARD COMPONENT
// ===========================================
function PortfolioCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  const brightness = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.9, 1, 1.1]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full"
      >
        {/* Glassmorphism card */}
        <div className={cn(
          'relative overflow-hidden rounded-3xl h-full',
          'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
          'backdrop-blur-2xl',
          'border border-white/[0.08]',
          'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
          'transition-all duration-500',
          isHovered && 'border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.4)]'
        )}>
          
          {/* Top gradient section - Device mockup area */}
          <div className={cn(
            'relative h-44 sm:h-52 md:h-64 overflow-hidden',
            'bg-gradient-to-br',
            project.gradient
          )}>
            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 opacity-60">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.2),transparent_50%)]" />
            </div>

            {/* Device mockup */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ translateZ: '40px' }}
            >
              <div className="relative">
                {/* Browser window mockup */}
                <motion.div
                  animate={{ 
                    y: isHovered ? -10 : 0,
                    rotateY: isHovered ? 5 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative w-52 sm:w-64 md:w-80"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Browser chrome */}
                  <div className="bg-[#1C1C1C]/90 backdrop-blur rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#B0614A]/50/80" />
                      <div className="w-3 h-3 rounded-full bg-[#B07A45]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#B07A45]/50/80" />
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="bg-[#1C1C1C] rounded-md px-3 py-1 text-xs text-white/60 truncate">
                        {project.url.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Browser content - Screenshot placeholder */}
                  <div className="bg-gradient-to-br from-[#1C1C1C] to-[#1C1C1C] h-28 sm:h-36 md:h-48 rounded-b-xl overflow-hidden relative">
                    {/* Placeholder content representing the site */}
                    <div className="absolute inset-0 p-4">
                      <div className="h-3 w-24 bg-[#EEE6DC]/20 rounded mb-3" />
                      <div className="h-2 w-full bg-[#EEE6DC]/10 rounded mb-2" />
                      <div className="h-2 w-3/4 bg-[#EEE6DC]/10 rounded mb-4" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 bg-[#EEE6DC]/5 rounded" />
                        <div className="h-16 bg-[#EEE6DC]/5 rounded" />
                        <div className="h-16 bg-[#EEE6DC]/5 rounded" />
                      </div>
                    </div>
                    
                    {/* Shine effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>

                {/* Shadow under device */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/40 blur-xl rounded-full" />
              </div>
            </motion.div>

            {/* Type badge */}
            <motion.div
              style={{ translateZ: '60px' }}
              className="absolute top-3 left-3 sm:top-5 sm:left-5"
            >
              <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/40 backdrop-blur-xl text-[10px] sm:text-xs font-semibold text-white border border-white/20">
                {project.type}
              </span>
            </motion.div>

            {/* External link */}
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ translateZ: '60px' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'absolute top-5 right-5',
                'w-10 h-10 rounded-full',
                'bg-[#EEE6DC]/10 backdrop-blur-xl',
                'flex items-center justify-center',
                'border border-white/20',
                'opacity-0 group-hover:opacity-100',
                'transition-all duration-300',
                'hover:bg-[#EEE6DC]/20'
              )}
            >
              <ExternalLink size={18} className="text-white" />
            </motion.a>
          </div>

          {/* Content section */}
          <motion.div
            style={{ translateZ: '30px' }}
            className="p-4 sm:p-6 md:p-8"
          >
            {/* Title row */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-[#C89A6A] transition-colors duration-300">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <span className="text-white/40 text-xs sm:text-sm font-medium">{project.subtitle}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-4 sm:mb-6 line-clamp-2 group-hover:text-white/70 transition-colors">
              {project.fullDescription}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {project.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + i * 0.1 + 0.3 }}
                  className={cn(
                    'relative p-2 sm:p-3 rounded-lg sm:rounded-xl overflow-hidden',
                    'bg-gradient-to-br from-white/[0.06] to-white/[0.02]',
                    'border border-white/[0.06]'
                  )}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 text-white/40 text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                    <span className="hidden sm:inline-flex">{stat.icon}</span>
                    <span className="truncate">{stat.label}</span>
                  </div>
                  <p className={cn(
                    'text-sm sm:text-base md:text-lg font-bold',
                    project.accentColor === 'emerald' && 'text-[#C89A6A]',
                    project.accentColor === 'violet' && 'text-[#C89A6A]',
                    project.accentColor === 'amber' && 'text-[#C89A6A]',
                  )}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tech.map((tech, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + i * 0.05 + 0.5 }}
                  className={cn(
                    'px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg',
                    'bg-[#EEE6DC]/[0.04] text-white/70',
                    'border border-white/[0.06]',
                    'hover:bg-[#EEE6DC]/[0.08] hover:border-white/[0.12]',
                    'transition-all duration-200'
                  )}
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* View Project link */}
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6',
                'text-xs sm:text-sm font-semibold',
                project.accentColor === 'emerald' && 'text-[#C89A6A] hover:text-[#C89A6A]',
                project.accentColor === 'violet' && 'text-[#C89A6A] hover:text-[#C89A6A]',
                project.accentColor === 'amber' && 'text-[#C89A6A] hover:text-[#C89A6A]',
                'transition-colors duration-200 group/link'
              )}
            >
              View Project
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Ambient glow effect */}
          <div className={cn(
            'absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl -z-10',
            'bg-gradient-to-br',
            project.gradient
          )} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===========================================
// FEATURED PROJECT CARD (LARGER)
// ===========================================
function FeaturedProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className={cn(
        'relative overflow-hidden rounded-[2rem]',
        'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
        'backdrop-blur-2xl',
        'border border-white/[0.08]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'transition-all duration-500',
        isHovered && 'border-[#B07A45]/50/30 shadow-[0_20px_60px_rgba(16,185,129,0.15)]'
      )}>
        {/* Featured badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#B07A45]/50/20 border border-[#B07A45]/50/30 backdrop-blur-xl"
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C89A6A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#B07A45]/50"></span>
            </span>
            <span className="text-[#C89A6A] text-xs sm:text-sm font-semibold">Featured Project</span>
          </motion.span>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image/Preview side */}
          <div className={cn(
            'relative h-56 sm:h-72 lg:h-auto min-h-[220px] sm:min-h-[300px] lg:min-h-[400px] overflow-hidden',
            'bg-gradient-to-br',
            project.gradient
          )}>
            {/* Animated mesh overlay */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.2),transparent_50%)]" />
            </div>

            {/* Device mockup - Desktop */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <motion.div
                animate={{ 
                  y: isHovered ? -15 : 0,
                  rotateY: isHovered ? 8 : 0,
                  scale: isHovered ? 1.02 : 1,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full max-w-md"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {/* Monitor frame */}
                <div className="relative">
                  {/* Screen bezel */}
                  <div className="bg-[#1C1C1C] rounded-xl p-2 shadow-2xl">
                    {/* Browser chrome */}
                    <div className="bg-[#1C1C1C] rounded-t-lg px-3 py-2 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B0614A]/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B07A45]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B07A45]/50" />
                      </div>
                      <div className="flex-1 mx-2">
                        <div className="bg-[#1C1C1C] rounded px-3 py-1 text-[10px] text-white/50">
                          {project.url.replace('https://', '')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Screen content */}
                    <div className="bg-gradient-to-br from-[#1C1C1C] via-[#1C1C1C] to-[#1C1C1C] h-48 rounded-b-lg relative overflow-hidden">
                      {/* Placeholder UI elements */}
                      <div className="absolute inset-0 p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-4 w-28 bg-[#B07A45]/50/30 rounded" />
                          <div className="flex gap-2">
                            <div className="h-3 w-16 bg-[#EEE6DC]/10 rounded" />
                            <div className="h-3 w-16 bg-[#EEE6DC]/10 rounded" />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-12 bg-[#EEE6DC]/5 rounded-lg" />
                          ))}
                        </div>
                        <div className="h-20 bg-[#EEE6DC]/5 rounded-lg" />
                      </div>
                      
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                  
                  {/* Monitor stand */}
                  <div className="flex justify-center">
                    <div className="w-16 h-6 bg-[#1C1C1C] rounded-b-lg" />
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-2 bg-[#1C1C1C] rounded-full" />
                  </div>
                </div>

                {/* Reflection */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/30 blur-xl rounded-full" />
              </motion.div>
            </div>

            {/* Gradient overlay for text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Content side */}
          <div className="p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[#C89A6A] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3"
            >
              {project.type}
            </motion.span>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2"
            >
              {project.title}
            </motion.h3>
            
            {project.subtitle && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.35 }}
                className="text-white/40 text-base sm:text-lg mb-3 sm:mb-4"
              >
                {project.subtitle}
              </motion.span>
            )}
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed mb-5 sm:mb-6 md:mb-8"
            >
              {project.fullDescription}
            </motion.p>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8"
            >
              {project.stats.map((stat, i) => (
                <div 
                  key={i} 
                  className={cn(
                    'p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl',
                    'bg-gradient-to-br from-white/[0.06] to-transparent',
                    'border border-white/[0.06]'
                  )}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[#C89A6A]/60 text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                    <span className="hidden sm:inline-flex">{stat.icon}</span>
                    <span className="text-white/40 truncate">{stat.label}</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#C89A6A]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Tech stack */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6 md:mb-8"
            >
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm rounded-full bg-[#B07A45]/50/10 text-[#C89A6A] border border-[#B07A45]/50/20"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 text-[#C89A6A] font-semibold text-sm sm:text-base md:text-lg group/cta"
            >
              <span>View Live Project</span>
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#B07A45]/50/10 border border-[#B07A45]/50/20 group-hover/cta:bg-[#B07A45]/50/20 group-hover/cta:border-[#B07A45]/50/40 transition-all">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
              </span>
            </motion.a>
          </div>
        </div>

        {/* Ambient glow */}
        <div className={cn(
          'absolute -inset-2 rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl -z-10',
          'bg-gradient-to-br',
          project.gradient
        )} />
      </div>
    </motion.div>
  );
}

// ===========================================
// MAIN PORTFOLIO SECTION
// ===========================================
export function PortfolioSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Separate featured project from others
  const featuredProject = PROJECTS.find(p => p.featured);
  const otherProjects = PROJECTS.filter(p => !p.featured);

  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#1C1C1C]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 -left-40 w-80 h-80 bg-[#B07A45]/50/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#B07A45]/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div>
            <FadeInUp>
              <span className="inline-flex items-center gap-2 text-[#C89A6A] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-[#C89A6A]" />
                Our Work
              </span>
            </FadeInUp>
            
            <FadeInUp delay={0.1}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                Real projects.
                <br />
                <span className="bg-gradient-to-r from-[#C89A6A] via-[#C89A6A] to-[#C89A6A] bg-clip-text text-transparent">
                  Real results.
                </span>
              </h2>
            </FadeInUp>
            
            <FadeInUp delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-white/50 mt-3 sm:mt-4 max-w-xl">
                From concept to launch — here's what we've built for businesses like yours.
              </p>
            </FadeInUp>
          </div>
          
          <FadeInUp delay={0.3} className="mt-2 sm:mt-0">
            <MagneticArrowButton href="#contact" className="w-full sm:w-auto justify-center sm:justify-start">
              Start your project
            </MagneticArrowButton>
          </FadeInUp>
        </div>

        {/* Featured project */}
        {featuredProject && (
          <div className="mb-12">
            <FeaturedProjectCard project={featuredProject} />
          </div>
        )}

        {/* Other projects grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {otherProjects.map((project, i) => (
            <PortfolioCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 md:mt-20 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/[0.06]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {[
              { value: '50K+', label: 'Orders Processed' },
              { value: '50K+', label: 'Users Served' },
              { value: '99.9%', label: 'Uptime' },
              { value: '3', label: 'Live Products' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C89A6A] to-[#C89A6A] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs sm:text-sm mt-0.5 sm:mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PortfolioSection;
