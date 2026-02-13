'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animate?: boolean;
  animationDuration?: number;
  shimmer?: boolean;
  as?: ElementType;
}

export function GradientText({
  children,
  className,
  colors = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'],
  animate = true,
  animationDuration = 3,
  shimmer = false,
  as: Component = 'span',
}: GradientTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  const gradient = `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`;

  return (
    <motion.span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={cn(
        'inline-block bg-clip-text text-transparent',
        shimmer && 'relative',
        className
      )}
      style={{
        backgroundImage: gradient,
        backgroundSize: animate ? '200% 100%' : '100% 100%',
      }}
      animate={
        animate && isInView
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : {}
      }
      transition={
        animate
          ? {
              duration: animationDuration,
              repeat: Infinity,
              ease: 'linear',
            }
          : {}
      }
    >
      {children}
      {shimmer && (
        <motion.span
          className="absolute inset-0 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(
              110deg,
              transparent 25%,
              rgba(255, 255, 255, 0.5) 50%,
              transparent 75%
            )`,
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['-100% 0%', '200% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1,
          }}
        >
          {children}
        </motion.span>
      )}
    </motion.span>
  );
}

// Pre-configured variants
export function EmeraldGradient({
  children,
  className,
  ...props
}: Omit<GradientTextProps, 'colors'>) {
  return (
    <GradientText
      colors={['#10b981', '#34d399', '#6ee7b7', '#34d399']}
      className={className}
      {...props}
    >
      {children}
    </GradientText>
  );
}

export function PurpleGradient({
  children,
  className,
  ...props
}: Omit<GradientTextProps, 'colors'>) {
  return (
    <GradientText
      colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#a78bfa']}
      className={className}
      {...props}
    >
      {children}
    </GradientText>
  );
}

export function SunsetGradient({
  children,
  className,
  ...props
}: Omit<GradientTextProps, 'colors'>) {
  return (
    <GradientText
      colors={['#f97316', '#fb923c', '#fbbf24', '#fb923c']}
      className={className}
      {...props}
    >
      {children}
    </GradientText>
  );
}

export function RainbowGradient({
  children,
  className,
  ...props
}: Omit<GradientTextProps, 'colors'>) {
  return (
    <GradientText
      colors={['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ef4444']}
      animationDuration={5}
      className={className}
      {...props}
    >
      {children}
    </GradientText>
  );
}

// Shimmer text effect (like skeleton loading but on text)
export function ShimmerText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="text-white">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-clip-text text-transparent"
        style={{ backgroundSize: '200% 100%' }}
        animate={{
          backgroundPosition: ['-100% 0%', '200% 0%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 2,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Typing gradient text with cursor
export function TypedGradientText({
  text,
  className,
  colors = ['#10b981', '#14b8a6', '#06b6d4'],
  typingSpeed = 50,
}: {
  text: string;
  className?: string;
  colors?: string[];
  typingSpeed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <span
      ref={ref}
      className={cn('inline-block', className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: i * (typingSpeed / 1000) }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-[3px] h-[1em] ml-1 bg-current"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  );
}

// Glowing text effect
export function GlowingText({
  children,
  className,
  glowColor = '#10b981',
  intensity = 'medium',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'subtle' | 'medium' | 'intense';
}) {
  const intensityMap = {
    subtle: '0 0 10px',
    medium: '0 0 20px',
    intense: '0 0 30px, 0 0 60px',
  };

  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ color: glowColor }}
      animate={{
        textShadow: [
          `${intensityMap[intensity]} ${glowColor}`,
          `${intensityMap[intensity]} ${glowColor}88`,
          `${intensityMap[intensity]} ${glowColor}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
