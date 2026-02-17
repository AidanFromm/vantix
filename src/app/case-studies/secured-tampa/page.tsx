'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, ShoppingCart, Server, CreditCard,
  Truck, Mail, Barcode, Package, CheckCircle2, Calendar, Phone,
  Globe, Database, Layers
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stats = [
  { label: 'Pages Built', value: '122' },
  { label: 'API Routes', value: '50+' },
  { label: 'Email Templates', value: '5' },
  { label: 'Build Time', value: '3 Weeks' },
];

const techStack = [
  'Next.js', 'Supabase', 'Stripe', 'Tailwind CSS', 'Resend', 'GoShippo', 'Clover POS',
];

export default function SecuredTampaPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D2A26]">
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E8E2DA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/case-studies" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Case Studies
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
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-xs font-semibold text-[#B8895A] uppercase tracking-wider mb-3">Sneakers & Collectibles</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">SecuredTampa</h1>
          <p className="text-lg text-[#8C857C] max-w-2xl">
            How we built a 122-page custom e-commerce platform with full inventory management and POS integration in just 3 weeks.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-6 text-center bg-[#FAFAFA] border border-[#E8E2DA] shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]">
              <p className="text-3xl font-bold text-[#B8895A]">{s.value}</p>
              <p className="text-sm text-[#8C857C] mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Challenge */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
          <div className="space-y-3 text-[#5C5650] leading-relaxed">
            <p>Dave, the owner of SecuredTampa, had no online presence. Shopify had terminated his account, leaving him without an e-commerce platform entirely.</p>
            <p>He was running his brick-and-mortar store with a disorganized Lightspeed POS system that couldn't keep up with his growing inventory of sneakers, collectibles, and Pokemon cards.</p>
            <p>Dave needed a completely custom solution — one that unified his online and in-store operations, handled his unique inventory categories, and gave him full control over his business.</p>
          </div>
        </motion.div>
      </section>

      {/* Solution */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-6">The Solution</h2>
          <p className="text-[#5C5650] leading-relaxed mb-6">
            We built a full custom e-commerce platform with integrated inventory management and POS connectivity — from scratch, in 3 weeks.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: ShoppingCart, text: 'Full e-commerce storefront with 122 pages' },
              { icon: Server, text: '50+ API routes powering the backend' },
              { icon: Database, text: 'Clover POS integration for in-store sales' },
              { icon: CreditCard, text: 'Stripe payment processing' },
              { icon: Truck, text: 'GoShippo shipping & label generation' },
              { icon: Mail, text: '5 custom email templates via Resend' },
              { icon: Barcode, text: 'Barcode scanning system for inventory' },
              { icon: Package, text: 'Pokemon card inventory management' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 p-3 rounded-xl">
                <item.icon className="w-5 h-5 text-[#B8895A] mt-0.5 shrink-0" />
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
              <span key={t} className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#FAFAFA] border border-[#E8E2DA] shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff]">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-6">The Results</h2>
          <ul className="space-y-3">
            {[
              'Complete custom platform replacing Shopify — fully owned by the client',
              'Unified online and in-store inventory management',
              'Automated order processing with real-time POS sync',
              'Professional storefront with category-specific browsing',
              'Streamlined shipping with automated label generation',
              'Barcode scanning for fast inventory intake and lookup',
            ].map((r) => (
              <li key={r} className="flex items-start gap-3 text-[#5C5650]">
                <CheckCircle2 className="w-5 h-5 text-[#B8895A] mt-0.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-12 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-3xl font-bold mb-4">Get Similar Results for Your Business</h2>
          <p className="text-[#8C857C] mb-8 max-w-lg mx-auto">
            Whether you need a custom platform, AI automation, or a complete digital transformation — we can build it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] transition-all"
              style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
            >
              Book a Consultation <ArrowRight className="w-4 h-4" />
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
