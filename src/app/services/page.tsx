'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Bot, Zap, Brain, Wrench,
  CheckCircle2, Calendar, Phone
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};


const services = [
  {
    icon: Zap,
    title: 'Kill Manual Work Forever',
    description: 'Every repetitive task in your business — data entry, email follow-ups, inventory updates, report generation — automated and running 24/7. Reclaim 40+ hours per week.',
    features: [
      'Workflow automation that eliminates entire job functions',
      'Data processing pipelines that never make mistakes',
      'CRM, inventory, and accounting sync — zero manual entry',
      'Custom API integrations connecting all your tools',
      'Email sequences that write, send, and optimize themselves',
    ],
    price: 'Starting at $4,500',
  },
  {
    icon: Bot,
    title: 'AI Agents That Sell & Support',
    description: 'Deploy conversational AI that qualifies leads, books appointments, and handles customer service — across web, SMS, phone, and social. Your best employee that never clocks out.',
    features: [
      'Trained on your exact business data and voice',
      'Multi-channel: website chat, SMS, Instagram, phone',
      'Lead qualification and automatic CRM routing',
      'Appointment scheduling with calendar integration',
      'Seamless human handoff for complex cases',
    ],
    price: 'Starting at $3,500',
  },
  {
    icon: Brain,
    title: 'AI Strategy That Pays for Itself',
    description: 'Not sure where to start? We audit your entire operation, identify the highest-ROI automation opportunities, and build a clear roadmap with projected payback timelines.',
    features: [
      'Full AI readiness assessment of your operations',
      'ROI projections for every automation opportunity',
      'Technology stack recommendations (no vendor lock-in)',
      'Prioritized implementation roadmap',
      'Ongoing advisory as your AI systems scale',
    ],
    price: 'Free initial audit',
  },
  {
    icon: Wrench,
    title: 'Custom Platforms — Built in Weeks',
    description: 'Need something that doesn\'t exist off the shelf? We build complete AI-powered platforms from scratch. E-commerce, inventory systems, analytics dashboards, internal tools — delivered in weeks, not months.',
    features: [
      'Full-stack web and mobile applications',
      'E-commerce with POS integration (we replaced Shopify)',
      'Real-time analytics dashboards with AI insights',
      'Document processing, OCR, and data extraction',
      'Computer vision and intelligent image analysis',
    ],
    price: 'Starting at $8,000',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] scroll-smooth">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#8E5E34] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/#booking"
            className="bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white font-semibold rounded-xl px-8 py-4 shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          >
            Book Your Free Audit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.p
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-[#8E5E34] text-sm font-semibold uppercase tracking-widest mb-4"
        >
          What We Deploy
        </motion.p>
        <motion.h1
          initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.05 } } }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          AI Systems That Run Your Business.<br />Not Just Advise On It.
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }}
          className="text-lg text-[#7A746C] max-w-2xl mx-auto"
        >
          From strategy to deployment to ongoing optimization — we handle everything.
          You focus on growth. We automate the rest.
        </motion.p>
      </section>

      {/* Service Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="rounded-2xl p-8 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm hover:shadow-sm hover:border-[#8E5E34]/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F4EFE8] shadow-sm flex items-center justify-center mb-6">
                <s.icon className="w-7 h-7 text-[#8E5E34]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-[#8E5E34] text-sm font-semibold mb-4">{s.price}</p>
              <p className="text-[#7A746C] mb-6 leading-relaxed">{s.description}</p>
              <ul className="space-y-2.5 mb-6">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#4B4B4B]">
                    <CheckCircle2 className="w-4 h-4 text-[#8E5E34] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/#booking" className="group inline-flex items-center gap-1.5 text-sm font-semibold bg-[#B07A45] hover:bg-[#8E5E34] text-white px-5 py-2.5 rounded-lg transition-colors">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 text-center">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl p-12 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm"
        >
          <Calendar className="w-10 h-10 text-[#8E5E34] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-[#7A746C] mb-8 max-w-lg mx-auto">
            Book a free AI audit. We&apos;ll map every automation opportunity in your business and show you the projected ROI — before you spend a dollar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#booking"
              className="bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white font-semibold rounded-xl px-8 py-4 shadow-md hover:shadow-lg hover:brightness-110 transition-all"
            >
              Book Your Free Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+19084987753"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#E3D9CD] text-sm font-semibold shadow-sm hover:shadow-sm hover:border-[#8E5E34]/20 transition-all"
            >
              <Phone className="w-4 h-4" /> (908) 498-7753
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E3D9CD] py-8 text-center text-sm text-[#7A746C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#1C1C1C] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1C1C1C] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}