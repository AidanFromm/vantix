'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
  radius?: number;
  glow?: boolean;
  glowColor?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  strength = 0.35,
  radius = 200,
  glow = false,
  glowColor = '#10b981',
  variant = 'default',
  size = 'md',
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Motion values for smooth animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animation for smooth movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Rotation based on mouse position
  const rotateX = useTransform(springY, [-20, 20], [10, -10]);
  const rotateY = useTransform(springX, [-20, 20], [-10, 10]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || disabled) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Only apply effect within radius
      if (distance < radius) {
        const force = (radius - distance) / radius;
        x.set(distanceX * strength * force);
        y.set(distanceY * strength * force);
      }
    },
    [strength, radius, disabled, x, y]
  );

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    default: 'bg-emerald-500 text-white hover:bg-emerald-400',
    outline:
      'bg-transparent border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10',
    ghost: 'bg-transparent text-emerald-400 hover:bg-emerald-500/10',
    gradient:
      'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white',
  };

  const Component = href ? motion.a : motion.button;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      style={{ perspective: 500 }}
    >
      <Component
        href={href}
        onClick={onClick}
        disabled={disabled}
        style={{
          x: springX,
          y: springY,
          rotateX,
          rotateY,
        }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200',
          'transform-gpu backface-hidden',
          sizeClasses[size],
          variantClasses[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* Glow effect */}
        {glow && (
          <>
            {/* Background glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl -z-10"
              style={{ backgroundColor: glowColor }}
              animate={{
                opacity: isHovered ? 0.6 : 0.3,
                scale: isHovered ? 1.3 : 1.1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Ring glow */}
            <motion.div
              className="absolute inset-0 rounded-full -z-10"
              style={{
                boxShadow: `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}30`,
              }}
              animate={{
                boxShadow: isHovered
                  ? `0 0 30px ${glowColor}80, 0 0 60px ${glowColor}40, 0 0 90px ${glowColor}20`
                  : `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}30`,
              }}
            />
          </>
        )}

        {/* Gradient shimmer overlay for gradient variant */}
        {variant === 'gradient' && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: isHovered ? ['100%', '-100%'] : '-100%',
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}

        {/* Press effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-black/20"
          animate={{
            opacity: isPressed ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Component>
    </div>
  );
}

// Magnetic icon button
export function MagneticIconButton({
  children,
  className,
  onClick,
  size = 'md',
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <MagneticButton
      onClick={onClick}
      variant="ghost"
      glow={glow}
      className={cn(
        'rounded-full p-0',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </MagneticButton>
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

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      className="inline-block"
    >
      <motion.a
        href={href}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className={cn(
          'group relative inline-flex items-center gap-2 text-lg font-medium text-white transition-colors hover:text-emerald-400',
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
          className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    </div>
  );
}

// Ripple button with magnetic effect
export function RippleMagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <MagneticButton variant="gradient" glow className={className}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="relative w-full h-full overflow-hidden"
      >
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute bg-[#EEE6DC]/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
        {children}
      </button>
    </MagneticButton>
  );
}
