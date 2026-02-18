'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Globe, 
  Code2, 
  Sparkles, 
  TrendingUp,
  Shield,
  Rocket,
} from 'lucide-react';

// Floating badge component
export function FloatingBadge({
  children,
  className,
  delay = 0,
  x = 0,
  y = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x, y }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [y, y - 15, y],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 4,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={cn(
        'absolute px-4 py-2 rounded-full bg-[#EEE6DC]/5 backdrop-blur-md border border-white/10',
        'text-sm font-medium text-white/80 shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Floating stats card
export function FloatingStat({
  value,
  label,
  icon: Icon,
  className,
  delay = 0,
}: {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 5,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={cn(
        'absolute px-5 py-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5',
        'backdrop-blur-xl border border-white/10 shadow-2xl',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-[#B07A45]/50/20">
            <Icon size={18} className="text-[#C89A6A]" />
          </div>
        )}
        <div>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/60">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Collection of floating elements for hero
export function HeroFloatingElements() {
  return (
    <>
      {/* Floating badges - hidden on small screens to avoid overlap */}
      <FloatingBadge 
        className="hidden sm:block top-[20%] left-[5%] md:left-[10%]" 
        delay={0.5}
      >
        <span className="flex items-center gap-2">
          <Zap size={14} className="text-[#C89A6A]" />
          Lightning Fast
        </span>
      </FloatingBadge>

      <FloatingBadge 
        className="hidden sm:block top-[15%] right-[5%] md:right-[12%]" 
        delay={0.7}
      >
        <span className="flex items-center gap-2">
          <Globe size={14} className="text-[#C89A6A]" />
          Global Reach
        </span>
      </FloatingBadge>

      <FloatingBadge 
        className="hidden md:block bottom-[25%] left-[8%] md:left-[15%]" 
        delay={0.9}
      >
        <span className="flex items-center gap-2">
          <Shield size={14} className="text-[#C89A6A]" />
          Enterprise Ready
        </span>
      </FloatingBadge>

      <FloatingBadge 
        className="hidden md:block bottom-[30%] right-[5%] md:right-[10%]" 
        delay={1.1}
      >
        <span className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#C89A6A]" />
          AI Powered
        </span>
      </FloatingBadge>

      {/* Floating stats */}
      <FloatingStat
        value="500+"
        label="Projects Delivered"
        icon={Rocket}
        className="hidden md:flex top-[35%] left-[3%]"
        delay={1.3}
      />

      <FloatingStat
        value="99.9%"
        label="Uptime Guaranteed"
        icon={TrendingUp}
        className="hidden md:flex top-[40%] right-[3%]"
        delay={1.5}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#B07A45]/50/10 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#B07A45]/10 blur-[120px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating icons */}
      <motion.div
        className="absolute top-[60%] left-[20%] hidden lg:block"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Code2 size={32} className="text-[#B07A45]/50/30" />
      </motion.div>

      <motion.div
        className="absolute top-[50%] right-[20%] hidden lg:block"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Sparkles size={28} className="text-[#B07A45]/30" />
      </motion.div>
    </>
  );
}

// Floating card with glassmorphism
export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-white/10 to-white/5',
        'backdrop-blur-xl border border-white/10',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        className
      )}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
