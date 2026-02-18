'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
  glow?: boolean;
}

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  strength = 0.3,
  glow = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * strength;
    const y = (clientY - top - height / 2) * strength;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const Component = href ? motion.a : motion.button;

  // Check if className includes w-full to make container full width
  const isFullWidth = className?.includes('w-full');

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={cn('inline-block', isFullWidth && 'w-full')}
    >
      <Component
        href={href}
        onClick={onClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className={cn(
          'relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full transition-all duration-300',
          glow && 'shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]',
          className
        )}
      >
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B07A45]/50/20 to-[#B07A45]/20 blur-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Component>
    </div>
  );
}

// Arrow button with magnetic effect
export function MagneticArrowButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.2;
    const y = (clientY - top - height / 2) * 0.2;
    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Check if className includes w-full to make container full width
  const isFullWidth = className?.includes('w-full');

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      className={cn('inline-block', isFullWidth && 'w-full')}
    >
      <motion.a
        href={href}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className={cn(
          'group relative inline-flex items-center gap-2 text-base sm:text-lg font-medium text-white transition-colors hover:text-[#C89A6A] py-3 sm:py-0',
          className
        )}
      >
        <span>{children}</span>
        <motion.span
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          →
        </motion.span>
        <motion.div
          className="absolute -bottom-1 left-0 h-px bg-[#B07A45]/50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    </div>
  );
}
