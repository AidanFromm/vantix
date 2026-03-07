'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';
import { ArrowUpRight } from '@phosphor-icons/react';
import Image from 'next/image';

const projects = [
  {
    name: 'E-Commerce Platform',
    client: 'Just Four Kicks',
    category: 'Web Design & Development',
    description: 'Complete B2B wholesale platform with admin dashboard, staff portal, and customer storefront. 200+ stores served.',
    image: '/portfolio/project-2.jpg',
    metrics: '$5.82M Revenue',
    span: 'md:col-span-2', // Featured — wider
  },
  {
    name: 'Business Analytics',
    client: 'Vantix Dashboard',
    category: 'SaaS Application',
    description: 'Real-time revenue analytics, customer growth tracking, and KPI monitoring dashboard.',
    image: '/portfolio/project-1.jpg',
    metrics: '50+ KPIs Tracked',
    span: 'md:col-span-1',
  },
  {
    name: 'CRM & Lead Management',
    client: 'Enterprise Client',
    category: 'AI Automation',
    description: 'Intelligent lead qualification, sales funnel visualization, and geographic lead mapping with AI-powered insights.',
    image: '/portfolio/project-3.jpg',
    metrics: '23% Conversion Rate',
    span: 'md:col-span-1',
  },
  {
    name: 'AI Chatbot System',
    client: 'Secured Tampa',
    category: 'AI Integration',
    description: 'Customer-facing AI chatbot with intelligent routing, bulk pricing automation, and seamless team handoff.',
    image: '/portfolio/project-4.jpg',
    metrics: '24/7 Automated Support',
    span: 'md:col-span-2', // Featured — wider
  },
];

export default function ProjectsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="work"
      ref={ref}
      className="px-6 md:px-12 py-28 md:py-40"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm uppercase tracking-[0.25em] mb-4"
              style={{ color: colors.bronze, fontFamily: fonts.mono }}
            >
              Selected Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: fonts.display, color: colors.text }}
            >
              Projects that speak{' '}
              <span style={{ color: colors.bronze }}>for themselves.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg mt-6 md:mt-0 md:max-w-sm md:text-right"
            style={{ color: colors.textSecondary, fontFamily: fonts.body }}
          >
            Real results from real clients. Every project built to perform.
          </motion.p>
        </div>

        {/* Project Grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${project.span}`}
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to top, ${colors.bg}ee 0%, transparent 60%)`,
                  }}
                />
                {/* Metric badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(10,10,10,0.7)',
                    color: colors.bronze,
                    border: `1px solid ${colors.bronze}30`,
                    fontFamily: fonts.mono,
                  }}
                >
                  {project.metrics}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.2em] mb-2"
                      style={{ color: colors.bronze, fontFamily: fonts.mono }}
                    >
                      {project.category}
                    </p>
                    <h3
                      className="text-xl md:text-2xl font-semibold mb-2"
                      style={{ fontFamily: fonts.display, color: colors.text }}
                    >
                      {project.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: colors.textSecondary, fontFamily: fonts.body }}
                    >
                      {project.description}
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: colors.bgCardHover,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <ArrowUpRight
                      size={18}
                      weight="light"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: colors.text }}
                    />
                  </div>
                </div>
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${colors.bronze}50` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
