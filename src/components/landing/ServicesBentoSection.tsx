'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Globe, MessageSquare, BarChart3, Target, Plug } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  gridClass: string;
}

const services: Service[] = [
  {
    icon: Cpu,
    title: 'AI Infrastructure & Automation',
    description:
      'We design and deploy AI-powered workflows that replace repetitive tasks, route decisions intelligently, and keep your operations running without constant oversight.',
    gridClass: 'md:col-span-2',
  },
  {
    icon: Globe,
    title: 'Custom Websites & Apps',
    description:
      'High-performance websites and applications engineered for conversion, speed, and the way your customers actually behave — not a template with your logo on it.',
    gridClass: 'md:row-span-2',
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbots & Assistants',
    description:
      'Custom AI assistants trained on your data, your tone, and your workflows — handling questions, qualifying leads, and escalating only when it matters.',
    gridClass: '',
  },
  {
    icon: BarChart3,
    title: 'Dashboards & Analytics',
    description:
      'Real-time dashboards that surface the metrics you actually need — not 47 charts nobody reads. Clean data, clear decisions.',
    gridClass: '',
  },
  {
    icon: Target,
    title: 'Lead Generation Engines',
    description:
      'AI-driven systems that identify, qualify, and nurture leads — so your sales team spends time closing, not chasing.',
    gridClass: '',
  },
  {
    icon: Plug,
    title: 'API Integration & Data Pipelines',
    description:
      'We connect the systems you already use into a unified data layer — eliminating manual transfers, sync errors, and duct-taped spreadsheets.',
    gridClass: '',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const Icon = service.icon;
  const isLarge = service.gridClass.includes('col-span') || service.gridClass.includes('row-span');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      className={`group relative rounded-2xl p-7 md:p-9 border
        md:hover:-translate-y-1 transition-all duration-300 overflow-hidden ${service.gridClass}`}
      style={{
        backgroundColor: colors.bg,
        borderColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${colors.bronze}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${colors.bronze}05, transparent 60%)` }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300"
          style={{ backgroundColor: `${colors.bronze}10` }}
        >
          <Icon className="w-6 h-6 md:group-hover:scale-110 transition-transform duration-300" style={{ color: colors.bronze }} />
        </div>
        <h3
          className={`font-semibold mb-3 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {service.title}
        </h3>
        <p
          className={`leading-relaxed ${isLarge ? 'text-lg max-w-lg' : 'line-clamp-3'}`}
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ServicesBentoSection() {
  return (
    <section id="services" className="py-24 md:py-36" style={{ backgroundColor: colors.surface }}>
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
            style={{ fontFamily: fonts.display, color: colors.text }}
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
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
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
