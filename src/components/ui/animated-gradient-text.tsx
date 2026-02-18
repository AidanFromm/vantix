'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function AnimatedGradientText({
  children,
  className,
  animate = true,
}: AnimatedGradientTextProps) {
  return (
    <motion.span
      className={cn(
        'inline-block bg-gradient-to-r from-[#C89A6A] via-[#C89A6A] to-[#C89A6A] bg-clip-text text-transparent',
        animate && 'bg-[length:200%_auto] animate-gradient',
        className
      )}
      style={{
        backgroundSize: animate ? '200% auto' : undefined,
        animation: animate ? 'gradient 3s linear infinite' : undefined,
      }}
    >
      {children}
    </motion.span>
  );
}

// Text that types out letter by letter
export function TypewriterText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.1,
            delay: delay + i * 0.03,
            ease: 'easeOut',
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Glowing text with animated shine
export function GlowingText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-[#B07A45]/50/0 via-[#B07A45]/50/50 to-[#B07A45]/50/0 blur-xl"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </span>
  );
}

// Split text that reveals word by word
export function SplitRevealText({
  children,
  className,
  delay = 0,
  stagger = 0.1,
}: {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = children.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}
