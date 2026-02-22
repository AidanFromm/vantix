'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TracingBeamProps {
  children: ReactNode;
  className?: string;
}

export default function TracingBeam({ children, className = '' }: TracingBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-[#E3D9CD]">
        <motion.div
          className="w-full origin-top"
          style={{
            height,
            background: 'linear-gradient(to bottom, #B07A45, #C89A6A)',
          }}
        />
      </div>
      <div className="pl-12">{children}</div>
    </div>
  );
}
