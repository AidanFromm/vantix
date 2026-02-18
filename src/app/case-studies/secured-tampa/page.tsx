'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, ShoppingCart, Server, CreditCard,
  Truck, Mail, Barcode, Package, CheckCircle2, Calendar, Phone,
  Globe, Database, Layers, MessageSquare, Clock, TrendingUp
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const woodButtonStyle = {
  background: `repeating-linear-gradient(95deg, transparent, transparent 3px, rgba(139,90,43,0.04) 3px, rgba(139,90,43,0.04) 5px), repeating-linear-gradient(85deg, transparent, transparent 7px, rgba(160,120,60,0.03) 7px, rgba(160,120,60,0.03) 9px), linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878, #E6C78C)`,
  border: '1px solid rgba(139,90,43,0.2)',
};

const stats = [
  { label: 'Pages Built', value: '122', icon: Globe },
  { label: 'API Routes', value: '50+', icon: Server },
  { label: 'Build Time', value: '3 Weeks', icon: Clock },
  { label: 'Uptime Since Launch', value: '99.9%', icon: TrendingUp },
];

const techStack = [
  'Next.js', 'Supabase', 'Stripe', 'Tailwind CSS', 'Resend', 'GoShippo', 'Clover POS',
];

export default function SecuredTampaPage() {
  return (
    <div className="min-h-screen bg-[#F0DFD1] text-[#2C1810] scroll-smooth">
      <nav className="sticky top-0 z-50 bg-[#F0DFD1]/90 backdrop-blur-md border-b border-[#E0CCBA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/case-studies" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#6B3A1F] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Case Studies
          </Link>
          <Link
            href="/#booking"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#5C4033] shadow-[4px_4px_10px_#c8c4be,-4px_-4px_10px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8] transition-all"
            style={woodButtonStyle}
          >
            Get Results Like This
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-xs font-semibold text-[#6B3A1F] uppercase tracking-wider mb-3">Client Case Study</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Shopify Shut Them Down.<br />We Built Something Better in 3 Weeks.
          </h1>
          <p className="text-lg text-[#8B6B56] max-w-2xl">
            How SecuredTampa went from selling sneakers through Instagram DMs to running a 122-page custom e-commerce platform with full POS integration — and never looked back.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-6 text-center bg-white border border-[#E0CCBA] shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]">
              <s.icon className="w-5 h-5 text-[#6B3A1F] mx-auto mb-2" />
              <p className="text-3xl font-bold text-[#6B3A1F]">{s.value}</p>
              <p className="text-sm text-[#8B6B56] mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-4">The Problem: Dead in the Water</h2>
          <div className="space-y-4 text-[#5C5650] leading-relaxed">
            <p>Dave runs SecuredTampa — a growing sneaker, collectibles, and Pokémon card business in Tampa, FL. Business was booming. Then Shopify terminated his account.</p>
            <p>Overnight, he lost his entire online storefront. No e-commerce. No checkout. No shipping automation. He was left running a growing business through Instagram DMs and a disorganized Lightspeed POS system that couldn&apos;t keep up.</p>
            <p><strong className="text-[#2C1810]">The clock was ticking.</strong> Every day without a platform meant lost sales, frustrated customers, and competitors gaining ground. He needed a complete solution — fast.</p>
          </div>
        </motion.div>
      </section>

      {/* The Discovery */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-4">The Discovery: Not a Shopify Replacement — Something Better</h2>
          <div className="space-y-4 text-[#5C5650] leading-relaxed">
            <p>During our initial audit, we realized Dave didn&apos;t just need another e-commerce platform. He needed a unified system that connected his online store, in-store POS, inventory management, shipping, and customer communications — all in one place.</p>
            <p>No off-the-shelf solution could do this. Shopify couldn&apos;t. BigCommerce couldn&apos;t. Dave needed something custom — and he needed it yesterday.</p>
          </div>
        </motion.div>
      </section>

      {/* The Solution */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-2">The Solution: 122 Pages in 3 Weeks</h2>
          <p className="text-[#6B3A1F] text-sm font-medium mb-6">Built from scratch. Deployed in production. Running 24/7.</p>
          <p className="text-[#5C5650] leading-relaxed mb-6">
            We designed and built a complete custom e-commerce platform with integrated inventory management, POS connectivity, automated shipping, and transactional emails — from the first line of code to production deployment in just 3 weeks.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: ShoppingCart, text: '122-page storefront with category-specific browsing' },
              { icon: Server, text: '50+ API routes powering the entire backend' },
              { icon: Database, text: 'Clover POS integration syncing online + in-store' },
              { icon: CreditCard, text: 'Stripe payments with automated invoicing' },
              { icon: Truck, text: 'GoShippo shipping with auto label generation' },
              { icon: Mail, text: '5 custom transactional email templates via Resend' },
              { icon: Barcode, text: 'Barcode scanning for instant inventory intake' },
              { icon: Package, text: 'Specialized Pokémon card inventory management' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F0DFD1] transition-colors">
                <item.icon className="w-5 h-5 text-[#6B3A1F] mt-0.5 shrink-0" />
                <span className="text-sm text-[#5C5650]">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-6 text-center">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((t) => (
              <span key={t} className="px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-[#E0CCBA] shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff] hover:border-[#6B3A1F]/20 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-white border border-[#6B3A1F]/20 shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-6">The Results: Back Online and Better Than Ever</h2>
          <ul className="space-y-3 mb-8">
            {[
              'Complete custom platform — fully owned by the client, no monthly platform fees',
              'Unified online and in-store inventory eliminating double-entry and stockouts',
              'Automated order processing with real-time Clover POS sync',
              'Professional storefront with category-specific browsing for sneakers, cards, and collectibles',
              'Automated shipping labels saving hours of manual processing per week',
              'Barcode scanning system for fast inventory intake and instant product lookup',
              '99.9% uptime since launch — zero critical outages',
            ].map((r) => (
              <li key={r} className="flex items-start gap-3 text-[#5C5650]">
                <CheckCircle2 className="w-5 h-5 text-[#6B3A1F] mt-0.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Testimonial */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] text-center">
          <MessageSquare className="w-8 h-8 text-[#6B3A1F]/30 mx-auto mb-4" />
          <blockquote className="text-xl md:text-2xl text-[#2C1810] font-medium leading-relaxed mb-6 max-w-2xl mx-auto">
            &ldquo;Shopify shut us down and I thought it was over. Vantix built something better than I ever had — in 3 weeks. The POS integration alone saves me hours every day. I own the whole thing now, no platform can take it away.&rdquo;
          </blockquote>
          <p className="text-[#2C1810] font-semibold">Dave</p>
          <p className="text-[#8B6B56] text-sm">Founder, SecuredTampa</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-12 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-3xl font-bold mb-4">Ready for Results Like This?</h2>
          <p className="text-[#8B6B56] mb-8 max-w-lg mx-auto">
            Whether you need a custom platform, AI automation, or a complete digital transformation — we deliver in weeks, not months. Let&apos;s talk about your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#booking"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8] transition-all"
              style={woodButtonStyle}
            >
              Book Your Free AI Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+19084987753"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#E0CCBA] text-sm font-semibold shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:border-[#6B3A1F]/20 transition-all"
            >
              <Phone className="w-4 h-4" /> (908) 498-7753
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[#E0CCBA] py-8 text-center text-sm text-[#8B6B56]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2C1810] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2C1810] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
