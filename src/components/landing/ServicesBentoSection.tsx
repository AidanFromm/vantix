'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

interface Service {
  title: string;
  description: string;
  image: string;
  video?: string;
  gridClass: string;
}

const services: Service[] = [
  {
    title: 'AI Dashboards',
    description: 'Real-time analytics dashboards that surface the metrics you need — not 47 charts nobody reads.',
    image: '/media-assets/images/product-2.png',
    video: '/media-assets/videos/generated-1.mp4',
    gridClass: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Custom Websites',
    description: 'High-performance sites engineered for conversion and speed — not templates with your logo.',
    image: '/media-assets/images/product-4.png',
    video: '/media-assets/videos/generated-2.mp4',
    gridClass: '',
  },
  {
    title: 'AI Chatbots',
    description: 'Custom assistants trained on your data, handling questions, qualifying leads 24/7.',
    image: '/media-assets/images/product-1.png',
    video: '/media-assets/videos/generated-3.mp4',
    gridClass: '',
  },
  {
    title: 'Automation',
    description: 'AI-powered workflows that replace repetitive tasks and keep operations running autonomously.',
    image: '/media-assets/images/product-6.png',
    video: '/media-assets/videos/vantix-vd-4.mp4',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'Analytics',
    description: 'Clean data, clear decisions. Real-time intelligence for real-time business.',
    image: '/media-assets/images/workspace.png',
    gridClass: '',
  },
  {
    title: 'Lead Generation',
    description: 'AI-driven systems that identify, qualify, and nurture leads so you spend time closing, not chasing.',
    image: '/media-assets/images/product-5.png',
    gridClass: '',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [hovered, setHovered] = useState(false);
  const isLarge = service.gridClass.includes('col-span-2') && service.gridClass.includes('row-span-2');

  const handleHover = (entering: boolean) => {
    setHovered(entering);
    if (service.video && videoRef.current) {
      if (entering) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      className={`group relative rounded-3xl overflow-hidden border cursor-default
        transition-all duration-500 ${service.gridClass}`}
      style={{
        backgroundColor: colors.darkSurface,
        borderColor: '#2a2a2a',
        minHeight: isLarge ? '420px' : '260px',
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* Image / Video top portion */}
      <div className="relative w-full overflow-hidden" style={{ height: isLarge ? '60%' : '55%' }}>
        <Image
          src={service.image}
          alt={service.title}
          fill
          className={`object-cover transition-all duration-700 ${hovered && service.video ? 'opacity-0' : 'opacity-100 group-hover:scale-105'}`}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {service.video && (
          <video
            ref={videoRef}
            muted
            playsInline
            loop
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={service.video} type="video/mp4" />
          </video>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: `linear-gradient(to top, ${colors.darkSurface}, transparent)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-7 md:p-9">
        <h3
          className={`font-semibold mb-3 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}
          style={{ fontFamily: fonts.display, color: '#ffffff' }}
        >
          {service.title}
        </h3>
        <p
          className={`leading-relaxed ${isLarge ? 'text-lg max-w-lg' : 'text-sm'}`}
          style={{ fontFamily: fonts.body, color: colors.muted }}
        >
          {service.description}
        </p>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          boxShadow: `inset 0 0 0 1px ${colors.bronze}40, 0 16px 48px ${colors.bronze}12`,
        }}
      />
    </motion.div>
  );
}

export default function ServicesBentoSection() {
  return (
    <section id="services" className="py-24 md:py-36" style={{ backgroundColor: colors.dark }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-5"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              Our Services
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: '#ffffff' }}
          >
            What We Build
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-center text-lg mb-16 max-w-2xl mx-auto"
          style={{ fontFamily: fonts.body, color: colors.muted }}
        >
          End-to-end AI systems designed around how your business actually works.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
