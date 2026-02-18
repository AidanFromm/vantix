'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
  color?: string;
}

// 3D Tilt Card for Portfolio
export function Portfolio3DCard({
  item,
  index,
}: {
  item: PortfolioItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const gradientColors = item.color || 'from-[#B07A45]/50 to-[#B07A45]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-[#B07A45]/50/30"
      >
        {/* Image/Preview area */}
        <div className={cn(
          'relative h-48 md:h-56 bg-gradient-to-br',
          gradientColors,
          'overflow-hidden'
        )}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/20 text-6xl font-bold">
                {item.title.charAt(0)}
              </div>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category badge */}
          <motion.div
            style={{ translateZ: '50px' }}
            className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/20"
          >
            {item.category}
          </motion.div>

          {/* Link button */}
          {item.link && (
            <motion.a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ translateZ: '60px' }}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#EEE6DC]/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#EEE6DC]/20"
            >
              <ExternalLink size={18} />
            </motion.a>
          )}
        </div>

        {/* Content */}
        <motion.div
          style={{ translateZ: '40px' }}
          className="p-6"
        >
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C89A6A] transition-colors">
            {item.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {item.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-md bg-[#EEE6DC]/5 text-white/60 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

// Portfolio grid container
export function PortfolioGrid({
  items,
  className,
}: {
  items: PortfolioItem[];
  className?: string;
}) {
  return (
    <div className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8', className)}>
      {items.map((item, i) => (
        <Portfolio3DCard key={i} item={item} index={i} />
      ))}
    </div>
  );
}

// Featured case study card (larger)
export function FeaturedCaseStudy({
  item,
  className,
}: {
  item: PortfolioItem & { results?: string[] };
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5',
        'backdrop-blur-xl border border-white/10 hover:border-[#B07A45]/50/30 transition-colors',
        className
      )}
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image side */}
        <div className="relative h-64 md:h-auto overflow-hidden">
          <div className={cn(
            'absolute inset-0 bg-gradient-to-br',
            item.color || 'from-[#B07A45]/50 to-[#B07A45]'
          )}>
            {item.image && (
              <motion.img
                src={item.image}
                alt={item.title}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
        </div>

        {/* Content side */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <span className="text-[#C89A6A] text-sm font-medium uppercase tracking-wider mb-2">
            {item.category}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {item.title}
          </h3>
          <p className="text-white/70 leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-[#B07A45]/50/10 text-[#C89A6A] border border-[#B07A45]/50/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href={item.link || '#'}
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 text-[#C89A6A] font-medium group"
          >
            View Case Study
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
