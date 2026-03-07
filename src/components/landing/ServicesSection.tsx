'use client';

import { motion } from 'framer-motion';
import { Globe, Robot, Palette, ChartLineUp } from '@phosphor-icons/react';
import { colors, fonts } from '@/lib/design-tokens';

const services = [
  {
    icon: Globe,
    title: 'Web Design & Development',
    desc: 'High-performance websites built for conversion and scale.',
    tags: ['Web', 'React', 'Next.js', 'UI Components'],
  },
  {
    icon: Robot,
    title: 'AI Automation',
    desc: 'Custom AI agents and workflows that eliminate repetitive tasks.',
    tags: ['Agents', 'Workflows', 'Chatbots', 'Integration'],
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    desc: 'Your visual foundation built to last.',
    tags: ['Logo System', 'Typography', 'Color', 'Guidelines'],
  },
  {
    icon: ChartLineUp,
    title: 'Growth & SEO',
    desc: 'Data-driven strategies that deliver measurable results.',
    tags: ['SEO', 'Analytics', 'Paid Ads', 'Content'],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Everything connects by design.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg mb-16 max-w-xl"
          style={{ color: colors.textSecondary, fontFamily: fonts.body }}
        >
          Brand identity, web, and AI — built from the same foundation.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl p-8 transition-all duration-300"
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.bronze}40`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <s.icon size={32} weight="light" color={colors.bronze} className="mb-5" />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: colors.textSecondary, fontFamily: fonts.body }}
              >
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: colors.bgElevated,
                      color: colors.textSecondary,
                      border: `1px solid ${colors.border}`,
                      fontFamily: fonts.body,
                    }}
                  >
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
