'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Layout, Target, BarChart3, Mail, Phone } from 'lucide-react';

const services = [
  {
    icon: Bot,
    title: 'AI Chatbots & Assistants',
    description: '24/7 customer support that sounds human. Answers questions, books appointments, qualifies leads.',
    large: true,
  },
  {
    icon: Layout,
    title: 'Custom Business Platforms',
    description: 'E-commerce, inventory, POS — all in one system built for YOUR workflow.',
    large: true,
  },
  {
    icon: Target,
    title: 'Automated Lead Generation',
    description: 'Find prospects, send personalized outreach, follow up automatically.',
    large: false,
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence Dashboards',
    description: 'See every metric that matters. Real-time. From any device.',
    large: false,
  },
  {
    icon: Mail,
    title: 'Email & SMS Automation',
    description: 'Drip campaigns, order confirmations, appointment reminders — on autopilot.',
    large: false,
  },
  {
    icon: Phone,
    title: 'AI Phone Agents',
    description: 'Handle calls, take orders, schedule appointments. Never miss a customer.',
    large: false,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        bg-[#EEE6DC] rounded-2xl p-6 md:p-8 border border-[#E3D9CD]
        hover:scale-[1.02] hover:border-[#D8C2A8] transition-all duration-300
        ${service.large ? 'md:col-span-2 min-h-[200px] md:min-h-[300px] relative overflow-hidden' : ''}
      `}
    >
      {service.large && (
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <pattern id={`pat-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#B07A45" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#pat-${index})`} />
          </svg>
        </div>
      )}
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-[#D8C2A8]/30 flex items-center justify-center mb-5">
          <Icon className="w-6 h-6 text-[#B07A45]" />
        </div>
        <h3
          className={`font-semibold text-[#4B3621] mb-3 ${service.large ? 'text-2xl md:text-3xl' : 'text-xl'}`}
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {service.title}
        </h3>
        <p
          className={`text-[#6B5B4E] leading-relaxed ${service.large ? 'text-lg max-w-lg' : ''}`}
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
    <section className="bg-[#EEE6DC] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-3xl md:text-5xl font-bold text-[#4B3621] text-center mb-16"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          What We Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
