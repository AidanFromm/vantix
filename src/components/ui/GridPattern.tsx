'use client';

import { useId, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: [number, number][];
  strokeDasharray?: string;
  className?: string;
  fade?: 'all' | 'top' | 'bottom' | 'radial' | 'none';
  animate?: boolean;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares,
  strokeDasharray,
  className,
  fade = 'radial',
  animate = true,
  ...props
}: GridPatternProps & React.SVGProps<SVGSVGElement>) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const fadeGradients: Record<string, string> = {
    all: `linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)`,
    top: `linear-gradient(to bottom, transparent, black 50%)`,
    bottom: `linear-gradient(to top, transparent, black 50%)`,
    radial: `radial-gradient(ellipse at center, black 30%, transparent 70%)`,
    none: 'none',
  };

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{
        maskImage: fadeGradients[fade],
        WebkitMaskImage: fadeGradients[fade],
      }}
    >
      <svg
        ref={ref}
        aria-hidden="true"
        className={cn(
          'absolute inset-0 h-full w-full fill-white/[0.02] stroke-white/[0.05]',
        )}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />

        {/* Animated highlighted squares */}
        {squares && (
          <svg x={x} y={y} className="overflow-visible">
            {squares.map(([squareX, squareY], index) => (
              <motion.rect
                key={`${squareX}-${squareY}`}
                strokeWidth="0"
                width={width - 1}
                height={height - 1}
                x={squareX * width + 1}
                y={squareY * height + 1}
                initial={animate ? { opacity: 0 } : false}
                animate={
                  isInView
                    ? {
                        opacity: [0, 0.3, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 4,
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                }}
                className="fill-[#B07A45]/50/30"
              />
            ))}
          </svg>
        )}
      </svg>
    </div>
  );
}

// Grid with dots instead of lines
export function DotPattern({
  className,
  size = 20,
  radius = 1,
  fade = 'radial',
}: {
  className?: string;
  size?: number;
  radius?: number;
  fade?: 'all' | 'top' | 'bottom' | 'radial' | 'none';
}) {
  const id = useId();

  const fadeGradients: Record<string, string> = {
    all: `linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)`,
    top: `linear-gradient(to bottom, transparent, black 50%)`,
    bottom: `linear-gradient(to top, transparent, black 50%)`,
    radial: `radial-gradient(ellipse at center, black 30%, transparent 70%)`,
    none: 'none',
  };

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{
        maskImage: fadeGradients[fade],
        WebkitMaskImage: fadeGradients[fade],
      }}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern
            id={id}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="fill-white/10"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

// Perspective grid (like retro 80s style)
export function PerspectiveGrid({
  className,
  lineCount = 20,
  color = '#B07A45',
}: {
  className?: string;
  lineCount?: number;
  color?: string;
}) {
  const horizontalLines = Array.from({ length: lineCount }, (_, i) => i);
  const verticalLines = Array.from({ length: lineCount * 2 }, (_, i) => i);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0"
        style={{
          perspective: '500px',
          perspectiveOrigin: '50% 30%',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: 'rotateX(60deg)',
            transformOrigin: '50% 0%',
          }}
        >
          <svg
            className="absolute w-full h-[200%] -top-1/2"
            style={{ opacity: 0.3 }}
          >
            {/* Horizontal lines */}
            {horizontalLines.map((i) => {
              const y = (i / lineCount) * 100;
              return (
                <motion.line
                  key={`h-${i}`}
                  x1="0%"
                  y1={`${y}%`}
                  x2="100%"
                  y2={`${y}%`}
                  stroke={color}
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
              );
            })}

            {/* Vertical lines */}
            {verticalLines.map((i) => {
              const x = (i / (lineCount * 2)) * 100;
              return (
                <motion.line
                  key={`v-${i}`}
                  x1={`${x}%`}
                  y1="0%"
                  x2={`${x}%`}
                  y2="100%"
                  stroke={color}
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.02 }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Horizon glow */}
      <div
        className="absolute inset-x-0 top-1/3 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 40px 20px ${color}40`,
        }}
      />
    </div>
  );
}

// Animated noise texture
export function NoiseOverlay({
  className,
  opacity = 0.03,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 bg-repeat',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  );
}

// Gradient mesh background
export function GradientMesh({
  className,
  colors = ['#B07A45', '#B07A45', '#B07A45'],
}: {
  className?: string;
  colors?: string[];
}) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute w-[60%] h-[60%] rounded-full blur-[100px]"
          style={{
            background: color,
            opacity: 0.3,
          }}
          animate={{
            x: [
              `${Math.random() * 40}%`,
              `${Math.random() * 40 + 30}%`,
              `${Math.random() * 40}%`,
            ],
            y: [
              `${Math.random() * 40}%`,
              `${Math.random() * 40 + 30}%`,
              `${Math.random() * 40}%`,
            ],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Beam/ray effect
export function BeamPattern({
  className,
  beamCount = 6,
  color = '#B07A45',
}: {
  className?: string;
  beamCount?: number;
  color?: string;
}) {
  const beams = Array.from({ length: beamCount }, (_, i) => ({
    rotation: (i * 360) / beamCount,
    delay: i * 0.2,
  }));

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden opacity-20',
        className
      )}
    >
      {beams.map((beam, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-[200%] h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            transformOrigin: 'center',
          }}
          animate={{
            rotate: [beam.rotation, beam.rotation + 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
            delay: beam.delay,
          }}
        />
      ))}
    </div>
  );
}
