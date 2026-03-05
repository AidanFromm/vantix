'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

export default function BeforeAfterSection() {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => { if (dragging) handleMove(e.clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { handleMove(e.touches[0].clientX); };

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 md:py-36 overflow-hidden"
      style={{ backgroundColor: colors.dark }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              Transformation
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: '#ffffff' }}
          >
            Before Vantix. <span style={{ color: colors.bronze }}>After Vantix.</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Drag the slider to see the difference we make.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          ref={containerRef}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-ew-resize select-none"
          style={{ border: `1px solid #2a2a2a` }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {/* Full image (After - right side) */}
          <div className="relative aspect-[16/9]">
            <Image
              src="/media-assets/images/product-12.png"
              alt="After Vantix transformation"
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* Before overlay (clipped to left side) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/media-assets/images/product-12.png"
                alt="Before Vantix"
                fill
                className="object-cover grayscale brightness-50"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              {/* Before label */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontFamily: fonts.body }}>
                Before
              </div>
            </div>
          </div>

          {/* After label */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${colors.bronze}CC`, color: '#fff', fontFamily: fonts.body }}>
            After
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-[3px]"
            style={{
              left: `${sliderPos}%`,
              transform: 'translateX(-50%)',
              backgroundColor: colors.bronze,
              boxShadow: `0 0 12px ${colors.bronze}60`,
            }}
          >
            {/* Handle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.bronze,
                boxShadow: `0 4px 16px ${colors.bronze}40`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 4l-6 8 6 8M16 4l6 8-6 8" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
