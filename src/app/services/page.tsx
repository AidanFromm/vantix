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

const services = [
  {
    icon: Zap,
    title: 'AI Automation',
    description: 'Eliminate repetitive tasks and streamline operations with intelligent automation systems that work around the clock.',
    features: [
      'Workflow automation & orchestration',
      'Data processing & ETL pipelines',
      'Email & notification automation',
      'CRM & inventory sync',
      'Custom API integrations',
    ],
  },
  {
    icon: Bot,
    title: 'AI Chatbots & Agents',
    description: 'Deploy conversational AI that handles customer inquiries, books appointments, and qualifies leads — 24/7.',
    features: [
      'Custom-trained on your business data',
      'Multi-channel deployment (web, SMS, social)',
      'Lead qualification & routing',
      'Appointment scheduling integration',
      'Human handoff when needed',
    ],
  },
  {
    icon: Brain,
    title: 'AI Strategy & Consulting',
    description: 'Get a clear roadmap for AI adoption. We audit your operations, identify high-impact opportunities, and build a plan.',
    features: [
      'AI readiness assessment',
      'ROI analysis & prioritization',
      'Technology stack recommendations',
      'Implementation roadmap',
      'Ongoing advisory & optimization',
    ],
  },
  {
    icon: Wrench,
    title: 'Custom AI Solutions',
    description: 'Bespoke AI-powered applications built from the ground up — e-commerce platforms, inventory systems, analytics dashboards, and more.',
    features: [
      'Full-stack web & mobile applications',
      'E-commerce & POS integrations',
      'Real-time analytics dashboards',
      'Document processing & OCR',
      'Computer vision & image analysis',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D2A26]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E8E2DA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#5C4033] shadow-[4px_4px_10px_#c8c4be,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] transition-all"
            style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.h1
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          What We Build
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }}
          className="text-lg text-[#8C857C] max-w-2xl mx-auto"
        >
          AI-powered systems that generate revenue, cut costs, and run while you sleep.
          From strategy to deployment — we handle everything.
        </motion.p>
      </section>

      {/* Service Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="rounded-2xl p-8 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] hover:shadow-[12px_12px_28px_#c8c4be,-12px_-12px_28px_#ffffff] transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[#FAFAFA] shadow-[inset_4px_4px_8px_#d1cdc7,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-6">
                <s.icon className="w-7 h-7 text-[#B8895A]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-[#8C857C] mb-6 leading-relaxed">{s.description}</p>
              <ul className="space-y-2.5 mb-6">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#5C5650]">
                    <CheckCircle2 className="w-4 h-4 text-[#B8895A] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8895A] hover:text-[#9A7048] transition-colors">
                Learn More <ArrowRight className="w-4 h-4" />
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
          className="rounded-2xl p-12 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]"
        >
          <Calendar className="w-10 h-10 text-[#B8895A] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Book a Free Consultation</h2>
          <p className="text-[#8C857C] mb-8 max-w-lg mx-auto">
            Tell us about your business and we'll show you exactly how AI can drive results — no commitment, no fluff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] transition-all"
              style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
            >
              Schedule a Call <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+19084987753"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#E8E2DA] text-sm font-semibold shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] transition-all"
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
