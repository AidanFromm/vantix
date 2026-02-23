'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Building2, Server, TrendingUp,
  Clock, Package, BarChart3, Globe, ShoppingCart,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stats = [
  { label: 'Annual Revenue', value: '$5.8M', icon: TrendingUp },
  { label: 'Order Mgmt Saved', value: '80%', icon: Clock },
  { label: 'Margin Improvement', value: '12%', icon: BarChart3 },
  { label: 'Stores Digitized', value: '200+', icon: Building2 },
];

const techStack = [
  'Next.js', 'Supabase', 'Stripe', 'n8n', 'Tailwind CSS', 'Vercel', 'Redis', 'Custom Python Pipelines',
];

export default function JustFourKicksPage() {
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
            <Building2 className="w-5 h-5 text-[#B07A45]" />
            <span className="text-sm font-semibold text-[#7A746C] uppercase tracking-wider">B2B Wholesale</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
            Just Four Kicks
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="text-xl text-[#7A746C] max-w-2xl">
            Scaling $5.8M revenue with custom infrastructure — from manual spreadsheets to automated wholesale operations.
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
            <p>Just Four Kicks was processing $5.8M in annual revenue through a patchwork of spreadsheets, manual invoicing, and phone-based order management. With 200+ retail store relationships, every order required multiple touchpoints — creating bottlenecks, errors, and missed margins.</p>
            <p>Their team was spending the majority of each day on order processing instead of business development, and had no real-time visibility into inventory levels across their wholesale network.</p>
          </div>
        </motion.div>
      </section>

      {/* Solution */}
      <section className="pb-16 px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>The Solution</h2>
          <div className="rounded-2xl border border-[#E3D9CD] bg-white/60 p-8 space-y-4 text-[#7A746C] text-lg">
            <p>We built a custom B2B wholesale platform with automated order management, real-time inventory sync, and integrated invoicing. Retail partners now place orders through a branded portal with live pricing and availability.</p>
            <p>Automated workflows handle order confirmation, shipping notifications, and payment tracking — reducing the order lifecycle from days to minutes. A custom analytics dashboard gives leadership real-time visibility into margins, popular SKUs, and store performance.</p>
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
            Ready to Scale Your Operations?
          </h2>
          <p className="text-[#7A746C] text-lg mb-8 max-w-xl mx-auto">
            Start with a free audit. We&apos;ll map your current workflows and show you exactly where AI and automation can save you time and money.
          </p>
          <Link href="/#booking" className="inline-flex items-center gap-2 px-8 py-4 bg-[#B07A45] text-white rounded-full font-semibold hover:bg-[#96663A] transition-all">
            Book Your Free Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
