'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
  className,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next]);

  // Touch/swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.touchStartX = touch.clientX.toString();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const startX = parseFloat((e.currentTarget as HTMLElement).dataset.touchStartX || '0');
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
  }, [next, prev]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <div className={cn('relative', className)}>
      {/* Main testimonial card */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-8 md:p-12 min-h-[280px] sm:min-h-[300px] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Quote icon */}
        <Quote className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 text-emerald-500/20" />
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="relative z-10"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4 sm:mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-400 text-emerald-400" />
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium leading-relaxed mb-6 sm:mb-8 text-white/90 pr-0 sm:pr-12">
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 sm:gap-4">
              {testimonials[current].avatar ? (
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-emerald-500/30"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-base sm:text-lg md:text-xl font-bold text-white flex-shrink-0">
                  {testimonials[current].name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-white truncate">{testimonials[current].name}</p>
                <p className="text-xs sm:text-sm text-white/60 truncate">
                  {testimonials[current].role}
                  {testimonials[current].company && `, ${testimonials[current].company}`}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows - hidden on mobile, use swipe instead */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 hidden sm:flex gap-2">
          <button
            onClick={prev}
            className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors border border-white/10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={next}
            className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors border border-white/10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>

        {/* Swipe hint on mobile */}
        <p className="absolute bottom-4 right-4 text-[10px] text-white/30 sm:hidden">
          Swipe to navigate
        </p>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={cn(
              'h-1.5 sm:h-2 rounded-full transition-all duration-300',
              i === current
                ? 'w-6 sm:w-8 bg-emerald-500'
                : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Alternative: Testimonial grid with hover effects
export function TestimonialGrid({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  return (
    <div className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {testimonials.map((testimonial, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-colors"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500" />
          
          <div className="relative z-10">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white/80 leading-relaxed mb-6">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/60">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
