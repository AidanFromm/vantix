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
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] scroll-smooth">
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/case-studies" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#8E5E34] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Case Studies
          </Link>
          <Link
            href="/#booking"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#8E5E34] shadow-sm hover:shadow-inner transition-all"
            
          >
            Get Results Like This
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-xs font-semibold text-[#8E5E34] uppercase tracking-wider mb-3">Client Case Study</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Shopify Shut Them Down.<br />We Built Something Better in 3 Weeks.
          </h1>
          <p className="text-lg text-[#7A746C] max-w-2xl">
            How SecuredTampa went from selling sneakers through Instagram DMs to running a 122-page custom e-commerce platform with full POS integration — and never looked back.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-6 text-center bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
              <s.icon className="w-5 h-5 text-[#8E5E34] mx-auto mb-2" />
              <p className="text-3xl font-bold text-[#8E5E34]">{s.value}</p>
              <p className="text-sm text-[#7A746C] mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
          <h2 className="text-2xl font-bold mb-4">The Problem: Dead in the Water</h2>
          <div className="space-y-4 text-[#4B4B4B] leading-relaxed">
            <p>Dave runs SecuredTampa — a growing sneaker, collectibles, and Pokémon card business in Tampa, FL. Business was booming. Then Shopify terminated his account.</p>
            <p>Overnight, he lost his entire online storefront. No e-commerce. No checkout. No shipping automation. He was left running a growing business through Instagram DMs and a disorganized Lightspeed POS system that couldn&apos;t keep up.</p>
            <p><strong className="text-[#1C1C1C]">The clock was ticking.</strong> Every day without a platform meant lost sales, frustrated customers, and competitors gaining ground. He needed a complete solution — fast.</p>
          </div>
        </motion.div>
      </section>

      {/* The Discovery */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
          <h2 className="text-2xl font-bold mb-4">The Discovery: Not a Shopify Replacement — Something Better</h2>
          <div className="space-y-4 text-[#4B4B4B] leading-relaxed">
            <p>During our initial audit, we realized Dave didn&apos;t just need another e-commerce platform. He needed a unified system that connected his online store, in-store POS, inventory management, shipping, and customer communications — all in one place.</p>
            <p>No off-the-shelf solution could do this. Shopify couldn&apos;t. BigCommerce couldn&apos;t. Dave needed something custom — and he needed it yesterday.</p>
          </div>
        </motion.div>
      </section>

      {/* The Solution */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
          <h2 className="text-2xl font-bold mb-2">The Solution: 122 Pages in 3 Weeks</h2>
          <p className="text-[#8E5E34] text-sm font-medium mb-6">Built from scratch. Deployed in production. Running 24/7.</p>
          <p className="text-[#4B4B4B] leading-relaxed mb-6">
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
              <div key={item.text} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F4EFE8] transition-colors">
                <item.icon className="w-5 h-5 text-[#8E5E34] mt-0.5 shrink-0" />
                <span className="text-sm text-[#4B4B4B]">{item.text}</span>
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
              <span key={t} className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm hover:border-[#8E5E34]/20 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#8E5E34]/20 shadow-sm">
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
              <li key={r} className="flex items-start gap-3 text-[#4B4B4B]">
                <CheckCircle2 className="w-5 h-5 text-[#8E5E34] mt-0.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Testimonial */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm text-center">
          <MessageSquare className="w-8 h-8 text-[#8E5E34]/30 mx-auto mb-4" />
          <blockquote className="text-xl md:text-2xl text-[#1C1C1C] font-medium leading-relaxed mb-6 max-w-2xl mx-auto">
            &ldquo;Shopify shut us down and I thought it was over. Vantix built something better than I ever had — in 3 weeks. The POS integration alone saves me hours every day. I own the whole thing now, no platform can take it away.&rdquo;
          </blockquote>
          <p className="text-[#1C1C1C] font-semibold">Dave</p>
          <p className="text-[#7A746C] text-sm">Founder, SecuredTampa</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-12 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready for Results Like This?</h2>
          <p className="text-[#7A746C] mb-8 max-w-lg mx-auto">
            Whether you need a custom platform, AI automation, or a complete digital transformation — we deliver in weeks, not months. Let&apos;s talk about your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#booking"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#8E5E34] font-semibold rounded-full shadow-sm hover:shadow-inner transition-all"
              
            >
              Book Your Free AI Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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