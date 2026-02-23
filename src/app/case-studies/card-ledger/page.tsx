'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Layers, Users, Star,
  Smartphone, Globe, BarChart3,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stats = [
  { label: 'Beta Signups', value: '500+', icon: Users },
  { label: 'User Satisfaction', value: '4.8/5', icon: Star },
  { label: 'Platforms', value: '3', icon: Smartphone },
  { label: 'Time to Beta', value: '8 Weeks', icon: Globe },
];

const techStack = [
  'Next.js', 'Swift/SwiftUI', 'Supabase', 'OpenAI', 'Stripe', 'Tailwind CSS', 'Replicate', 'Vercel',
];

export default function CardLedgerPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C]">
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/case-studies" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#B07A45] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Case Studies
          </Link>
          <Link href="/#booking" className="px-5 py-2 text-sm font-semibold rounded-full bg-[#B07A45] text-white hover:bg-[#96663A] transition-all">
            Book a Call
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-[#B07A45]" />
            <span className="text-sm font-semibold text-[#7A746C] uppercase tracking-wider">SaaS / Collectibles</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
            CardLedger
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="text-xl text-[#7A746C] max-w-2xl">
            Building a product from zero to beta launch — a multi-platform collectibles management app powered by AI.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-[#E3D9CD] bg-white/60 p-6 text-center">
              <s.icon className="w-5 h-5 text-[#B07A45] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#B07A45]">{s.value}</div>
              <div className="text-xs text-[#7A746C] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenge */}
      <section className="pb-16 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>The Challenge</h2>
          <div className="rounded-2xl border border-[#E3D9CD] bg-white/60 p-8 space-y-4 text-[#7A746C] text-lg">
            <p>The collectibles market — trading cards, sneakers, memorabilia — lacked a unified platform for tracking portfolio value across categories. Collectors were using spreadsheets, notes apps, and fragmented tools with no real-time pricing or AI-powered insights.</p>
            <p>CardLedger needed to go from concept to a functional multi-platform beta in under 3 months, with AI-powered card recognition, real-time market pricing, and a beautiful user experience.</p>
          </div>
        </motion.div>
      </section>

      {/* Solution */}
      <section className="pb-16 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>The Solution</h2>
          <div className="rounded-2xl border border-[#E3D9CD] bg-white/60 p-8 space-y-4 text-[#7A746C] text-lg">
            <p>We designed and built CardLedger from scratch — a native iOS app (SwiftUI) with a companion web dashboard (Next.js). Users can scan cards with their camera for instant AI identification, track portfolio value over time, and get market insights.</p>
            <p>The backend leverages Supabase for real-time data sync, OpenAI for card recognition and description generation, and Stripe for subscription management. A custom analytics engine tracks market trends and alerts users to value changes.</p>
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="pb-16 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((t) => (
              <span key={t} className="px-4 py-2 rounded-full border border-[#E3D9CD] bg-white/60 text-sm font-medium">{t}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="pb-32 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-2xl border border-[#B07A45] bg-white/60 p-12">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
            Have a Product Idea?
          </h2>
          <p className="text-[#7A746C] text-lg mb-8 max-w-xl mx-auto">
            We take ideas from concept to launch. Start with a free audit and we&apos;ll map the fastest path to your MVP.
          </p>
          <Link href="/#booking" className="inline-flex items-center gap-2 px-8 py-4 bg-[#B07A45] text-white rounded-full font-semibold hover:bg-[#96663A] transition-all">
            Book Your Free Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
