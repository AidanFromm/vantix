'use client';

import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowColor?: string;
  glowIntensity?: 'subtle' | 'medium' | 'intense';
  borderRadius?: string;
  showSpotlight?: boolean;
}

export function GlowCard({
  children,
  className,
  containerClassName,
  glowColor = 'from-emerald-500 via-teal-500 to-cyan-500',
  glowIntensity = 'medium',
  borderRadius = '1.5rem',
  showSpotlight = true,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for spotlight
  const spotlightX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const spotlightY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      350px circle at ${spotlightX}px ${spotlightY}px,
      rgba(16, 185, 129, 0.15),
      transparent 80%
    )
  `;

  const intensityMap = {
    subtle: 'opacity-30 blur-xl',
    medium: 'opacity-50 blur-2xl',
    intense: 'opacity-70 blur-3xl',
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('group relative', containerClassName)}
      style={{ borderRadius }}
    >
      {/* Animated gradient border */}
      <motion.div
        className={cn(
          'absolute -inset-px rounded-[inherit] bg-gradient-to-r',
          glowColor,
          'transition-opacity duration-500'
        )}
        style={{
          borderRadius,
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: isHovered 
            ? ['0% 50%', '100% 50%', '0% 50%']
            : '0% 50%',
          opacity: isHovered ? 1 : 0.3,
        }}
        transition={{
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          },
          opacity: { duration: 0.3 },
        }}
      />

      {/* Glow effect behind the card */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-[inherit] bg-gradient-to-r',
          glowColor,
          intensityMap[glowIntensity],
          'transition-all duration-500'
        )}
        style={{ borderRadius }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      {/* Main card content */}
      <div
        className={cn(
          'relative overflow-hidden',
          'bg-black/60 backdrop-blur-xl',
          'border border-white/5',
          className
        )}
        style={{ borderRadius }}
      >
        {/* Spotlight effect on hover */}
        {showSpotlight && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlightBackground, borderRadius }}
          />
        )}

        {/* Inner gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"
          style={{ borderRadius }}
        />

        {/* Children */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

// Variant: Simple glow card without spotlight
export function SimpleGlowCard({
  children,
  className,
  glowColor = 'emerald',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'purple' | 'blue' | 'orange';
}) {
  const colorMap = {
    emerald: 'hover:shadow-emerald-500/20 hover:border-emerald-500/30',
    purple: 'hover:shadow-purple-500/20 hover:border-purple-500/30',
    blue: 'hover:shadow-blue-500/20 hover:border-blue-500/30',
    orange: 'hover:shadow-orange-500/20 hover:border-orange-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-black/40 backdrop-blur-xl',
        'border border-white/10',
        'shadow-2xl shadow-black/50',
        'transition-all duration-300',
        colorMap[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Variant: Holographic card with rainbow border
export function HolographicCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotation({
      x: (y - 0.5) * 20,
      y: (x - 0.5) * -20,
    });
  };

  const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn('group relative', className)}
    >
      {/* Rainbow border */}
      <div
        className="absolute -inset-px rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(
            var(--border-angle, 0deg),
            #ff0080,
            #7928ca,
            #0070f3,
            #38bdf8,
            #10b981,
            #facc15,
            #ff0080
          )`,
          animation: 'borderRotate 4s linear infinite',
        }}
      />

      {/* Content */}
      <div className="relative rounded-2xl bg-black/80 backdrop-blur-xl p-6">
        {/* Holographic shine overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(
              105deg,
              transparent 40%,
              rgba(255, 255, 255, 0.1) 45%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.1) 55%,
              transparent 60%
            )`,
          }}
        />
        {children}
      </div>

      <style jsx global>{`
        @keyframes borderRotate {
          from {
            --border-angle: 0deg;
          }
          to {
            --border-angle: 360deg;
          }
        }

        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </motion.div>
  );
}
