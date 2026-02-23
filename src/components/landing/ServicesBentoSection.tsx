'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Globe, MessageSquare, BarChart3, Target, Plug } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = service.icon;
  const isLarge = service.gridClass.includes('col-span') || service.gridClass.includes('row-span');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-[#EEE6DC] rounded-2xl p-6 md:p-8 border border-transparent
        hover:border-[#B07A45]/40 md:hover:-translate-y-1
        transition-colors duration-300 overflow-hidden ${service.gridClass}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B07A45]/[0.03] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-[#D8C2A8]/30 flex items-center justify-center mb-5
          group-hover:bg-[#B07A45]/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-[#B07A45] md:group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h3
          className={`font-semibold text-[#1C1C1C] mb-3 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {service.title}
        </h3>
        <p
          className={`text-[#4B4B4B] leading-relaxed ${isLarge ? 'text-lg max-w-lg' : 'line-clamp-3'}`}
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ServicesBentoSection() {
  return (
    <section id="services" className="bg-[#EEE6DC] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-[#1C1C1C] text-center mb-4"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          What We Build
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#4B4B4B] text-center text-lg mb-16 max-w-2xl mx-auto"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
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
