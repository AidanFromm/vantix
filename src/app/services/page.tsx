'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Cpu, Globe, MessageSquare, BarChart3, Target, Plug, ChevronDown } from 'lucide-react';
import FloatingNav from '@/components/landing/FloatingNav';
import FooterSection from '@/components/landing/FooterSection';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const services = [
  {
    icon: Cpu,
    title: 'AI Infrastructure & Automation',
    tagline: 'Let your systems think.',
    description:
      'We identify the workflows consuming your team\'s time — data entry, order routing, report generation, status updates, inventory management — and replace them with AI-powered automation that runs 24/7 without errors, without breaks, and without complaints.',
    extended:
      'This isn\'t about plugging in a chatbot and calling it a day. We design end-to-end automation architectures: triggers, logic, exception handling, monitoring, and continuous improvement loops. Your systems get smarter over time because we build them that way.',
    bullets: [
      'Automated order processing and fulfillment routing',
      'Intelligent document parsing and data extraction',
      'Workflow orchestration across multiple platforms',
      'Anomaly detection and automated escalation',
      'Custom AI models trained on your operational data',
    ],
  },
  {
    icon: Globe,
    title: 'Custom Websites & Apps',
    tagline: 'Built to perform, not just to look good.',
    description:
      'Every site and application we deliver is engineered for speed, conversion, and scalability. We write clean code, optimize for mobile, and build with your growth trajectory in mind — so you\'re not rebuilding in 18 months.',
    extended:
      'We build digital products that perform — not portfolio pieces that look good in a screenshot and break in production.',
    bullets: [
      'High-conversion e-commerce stores with real-time inventory',
      'SaaS applications from MVP to scale',
      'Internal tools and admin dashboards',
      'Progressive web apps for mobile-first experiences',
      'Headless CMS and custom content architectures',
    ],
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbots & Assistants',
    tagline: 'Your best employee doesn\'t need sleep.',
    description:
      'We build chatbots and AI assistants trained on your specific data — product catalogs, pricing, policies, FAQs, internal knowledge bases. They handle customer inquiries, qualify leads, book appointments, and escalate to humans only when necessary.',
    extended:
      'A well-built AI assistant is the most cost-effective hire you\'ll ever make.',
    bullets: [
      'Customer-facing support bots across web, SMS, and social',
      'Internal knowledge assistants for your team',
      'Lead qualification and appointment scheduling bots',
      'AI agents that execute tasks, not just answer questions',
      'Multi-language support with natural conversation flow',
    ],
  },
  {
    icon: BarChart3,
    title: 'Dashboards & Analytics',
    tagline: 'See everything. Guess nothing.',
    description:
      'We build dashboards that surface the 5–10 metrics that actually matter for your role — not 47 charts exported from a BI tool nobody opens. Real-time data, clean design, and alerts that tell you when something needs attention.',
    extended:
      'Data is only useful if it changes decisions.',
    bullets: [
      'Executive dashboards with live revenue, pipeline, and operational KPIs',
      'Sales and marketing performance tracking',
      'Inventory and supply chain visibility',
      'Custom analytics with predictive modeling',
      'Automated reporting and scheduled digests',
    ],
  },
  {
    icon: Target,
    title: 'Lead Generation Engines',
    tagline: 'Pipeline that fills itself.',
    description:
      'We build AI-powered lead generation systems that identify your ideal customers, reach them through the right channels, score their intent, and nurture them until they\'re ready to talk. Your pipeline fills while your team focuses on revenue.',
    extended:
      'Your sales team should be closing — not prospecting.',
    bullets: [
      'AI-driven prospect identification and enrichment',
      'Automated outreach sequences with dynamic personalization',
      'Lead scoring models trained on your conversion data',
      'CRM integration and real-time pipeline dashboards',
      'Multi-channel campaigns (email, LinkedIn, SMS)',
    ],
  },
  {
    icon: Plug,
    title: 'API Integration & Data Pipelines',
    tagline: 'Make your tools talk to each other.',
    description:
      'We build the connective tissue between your platforms — APIs, data pipelines, webhooks, and sync layers that eliminate manual data transfer, reduce errors, and give you a single source of truth across your entire operation.',
    extended:
      'Your tools should work together. Right now, they probably don\'t.',
    bullets: [
      'Custom API development and third-party integrations',
      'Real-time data sync between platforms and databases',
      'ETL pipelines with validation, transformation, and error handling',
      'Warehouse and ERP connectivity',
      'Legacy system modernization and migration',
    ],
  },
];

function ServiceBlock({ service, index }: { service: typeof services[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUp}
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-start`}
    >
      {/* Icon side */}
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgAlt }}>
        <Icon size={28} style={{ color: colors.bronze }} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: colors.bronze }}>
          {service.tagline}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: fonts.display }}>
          {service.title}
        </h3>
        <p className="text-base leading-relaxed mb-5" style={{ color: colors.muted }}>
          {service.description}
        </p>

        <ul className="space-y-2 mb-5">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm" style={{ color: colors.muted }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.bronze }} />
              {b}
            </li>
          ))}
        </ul>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: colors.bronze }}
        >
          {expanded ? 'Show Less' : 'Learn More'}
          <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {expanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 text-sm leading-relaxed"
            style={{ color: colors.muted }}
          >
            {service.extended}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <FloatingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 text-center">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: fonts.display }}
          >
            What We Build
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.12 } } }}
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: colors.muted }}
          >
            Six core capabilities. One goal: make your business operate faster, leaner, and smarter.
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-20 md:space-y-28">
          {services.map((s, i) => (
            <ServiceBlock key={s.title} service={s} index={i} />
          ))}
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-16" style={{ backgroundColor: colors.bgAlt }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-lg sm:text-xl font-medium"
            style={{ color: colors.text }}
          >
            Every project is scoped after a free audit. No templates, no surprises.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto px-5 sm:px-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: fonts.display }}>
            Let&apos;s scope your project.
          </h2>
          <p className="text-base mb-8" style={{ color: colors.muted }}>
            Projects typically range from $5K–$50K+. We scope everything upfront so you know exactly what you&apos;re paying for.
          </p>
          <Link
            href="/#booking"
            className="inline-block px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:opacity-90"
            style={{ backgroundColor: colors.bronze }}
          >
            Book Your Audit →
          </Link>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
}
