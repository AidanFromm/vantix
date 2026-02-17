'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Bot, Zap, Brain, Wrench,
  CheckCircle2, Calendar, Phone, MessageSquare, BarChart3,
  Cpu, Settings, Workflow
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const woodButtonStyle = {
  background: `repeating-linear-gradient(95deg, transparent, transparent 3px, rgba(139,90,43,0.04) 3px, rgba(139,90,43,0.04) 5px), repeating-linear-gradient(85deg, transparent, transparent 7px, rgba(160,120,60,0.03) 7px, rgba(160,120,60,0.03) 9px), linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878, #E6C78C)`,
  border: '1px solid rgba(139,90,43,0.2)',
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
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D2A26] scroll-smooth">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E8E2DA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#B8895A] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#5C4033] shadow-[4px_4px_10px_#c8c4be,-4px_-4px_10px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8] transition-all"
            style={woodButtonStyle}
          >
            Book Your Free Audit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.p
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-[#B8895A] text-sm font-semibold uppercase tracking-widest mb-4"
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
          className="text-lg text-[#8C857C] max-w-2xl mx-auto"
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
              className="rounded-2xl p-8 bg-white border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_28px_#c8c4be,-12px_-12px_28px_#ffffff] hover:border-[#B8895A]/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[#FAFAFA] shadow-[inset_4px_4px_8px_#d1cdc7,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-6">
                <s.icon className="w-7 h-7 text-[#B8895A]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-[#B8895A] text-sm font-semibold mb-4">{s.price}</p>
              <p className="text-[#8C857C] mb-6 leading-relaxed">{s.description}</p>
              <ul className="space-y-2.5 mb-6">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#5C5650]">
                    <CheckCircle2 className="w-4 h-4 text-[#B8895A] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8895A] hover:text-[#9A7048] transition-colors">
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
          className="rounded-2xl p-12 bg-white border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]"
        >
          <Calendar className="w-10 h-10 text-[#B8895A] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-[#8C857C] mb-8 max-w-lg mx-auto">
            Book a free AI audit. We&apos;ll map every automation opportunity in your business and show you the projected ROI — before you spend a dollar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8] transition-all"
              style={woodButtonStyle}
            >
              Book Your Free Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+19084987753"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#E8E2DA] text-sm font-semibold shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:border-[#B8895A]/20 transition-all"
            >
              <Phone className="w-4 h-4" /> (908) 498-7753
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E2DA] py-8 text-center text-sm text-[#8C857C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2D2A26] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2D2A26] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
