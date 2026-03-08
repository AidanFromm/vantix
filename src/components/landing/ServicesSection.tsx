'use client';

import { motion } from 'framer-motion';
import { Globe, Lightning, Palette, TrendUp } from '@phosphor-icons/react';

const services = [
  {
    icon: Globe,
    title: 'Web Design & Development',
    description: 'Custom websites built for speed, conversion, and brand consistency. No templates.',
    tags: ['Next.js', 'React', 'E-Commerce', 'CMS'],
  },
  {
    icon: Lightning,
    title: 'AI Automation',
    description: 'Intelligent workflows that save your team hours every week. From chatbots to data pipelines.',
    tags: ['Chatbots', 'Workflows', 'Integrations', 'AI'],
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Logos, color systems, and brand guidelines that make your company instantly recognizable.',
    tags: ['Logo Design', 'Brand Guide', 'Typography', 'Color'],
  },
  {
    icon: TrendUp,
    title: 'Growth & SEO',
    description: 'Data-driven strategies to increase your organic traffic and convert more visitors.',
    tags: ['SEO', 'Analytics', 'Content', 'Strategy'],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32" style={{ backgroundColor: '#F3F0EB' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">What We Do</h2>
          <p className="text-lg text-[#6B6B6B]">Four disciplines. One unified approach.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-black/[0.06] shadow-sm"
            >
              <service.icon size={36} weight="light" className="text-[#B8935A] mb-5" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{service.title}</h3>
              <p className="text-[#6B6B6B] text-base mb-5 leading-relaxed">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-[#F3F0EB] text-[#6B6B6B]">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
