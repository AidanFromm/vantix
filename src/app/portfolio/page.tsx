'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowRight, ExternalLink, Clock, Code2, BarChart3, Shield,
  ShoppingCart, Package, Scan, TabletSmartphone, CreditCard,
  Users, Mail, Tag, Search, LayoutDashboard, Truck, Star,
  AlertTriangle, CheckCircle2, Zap, Globe, Instagram, MapPin,
  ChevronRight, Layers, Database, Bug, Box, Percent, Heart,
  CalendarDays, Receipt,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const metrics = [
  { value: '100+', label: 'Projects Delivered', icon: Layers },
  { value: '50+', label: 'API Routes', icon: Code2 },
  { value: '20+', label: 'Admin Features', icon: LayoutDashboard },
  { value: '<2', label: 'Weeks to Launch', icon: Clock },
];

const techStack = [
  'Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL',
  'Stripe', 'GoShippo', 'StockX API', 'Resend', 'Sentry',
  'Tailwind CSS', 'Vercel',
];

const features = [
  { icon: ShoppingCart, title: 'Full E-Commerce Store', desc: 'Product listings, cart, checkout with Stripe payments, order tracking, and customer accounts.' },
  { icon: Scan, title: 'Barcode Scanning', desc: 'Scan products directly into inventory. Instant lookup and pricing from StockX market data.' },
  { icon: TabletSmartphone, title: 'iPad POS Kiosk', desc: 'In-store point-of-sale system optimized for iPad. Process walk-in purchases with ease.' },
  { icon: Package, title: 'Inventory Management', desc: 'Real-time stock tracking, reconciliation, bulk imports, and automated low-stock alerts.' },
  { icon: Truck, title: 'Shipping Labels', desc: 'GoShippo integration for one-click label generation. USPS, UPS, FedEx rate comparison.' },
  { icon: Star, title: 'Pokemon Card Grading', desc: 'Custom grading workflow for Pokemon cards. Condition tracking and pricing tiers.' },
  { icon: Users, title: 'Staff Management', desc: 'Role-based access for employees. Activity logs, permissions, and shift tracking.' },
  { icon: Mail, title: 'Email Notifications', desc: 'Automated order confirmations, shipping updates, and marketing emails via Resend.' },
  { icon: Tag, title: 'Drops System', desc: 'Scheduled product drops with countdown timers. Build hype and drive traffic.' },
  { icon: Percent, title: 'Discount Codes', desc: 'Flexible coupon system with percentage, fixed amount, and per-product rules.' },
  { icon: Heart, title: 'Customer Wishlists', desc: 'Customers save and track items. Restock notifications drive repeat purchases.' },
  { icon: Search, title: 'Advanced Search', desc: 'Filter by brand, size, price, category. Instant results across the entire catalog.' },
  { icon: LayoutDashboard, title: 'Admin Dashboard', desc: 'Complete business overview. Sales analytics, inventory health, and customer insights.' },
  { icon: Receipt, title: 'Walk-in Purchase Flow', desc: 'Streamlined in-store checkout. Cash, card, or Zelle with receipt generation.' },
  { icon: Bug, title: 'Error Monitoring', desc: 'Sentry integration for real-time error tracking and performance monitoring.' },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#1C1C1C] text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16,185,129,0.08) 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-[#C89A6A] text-sm font-medium tracking-wider uppercase mb-6">
              <ChevronRight size={14} />
              Case Study
            </Link>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
          >
            Secured Tampa
            <br />
            <span className="bg-gradient-to-r from-[#C89A6A] to-[#8E5E34] bg-clip-text text-transparent">
              Custom E-Commerce Platform
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-[#A39B90] max-w-2xl mb-8"
          >
            A full-stack e-commerce and inventory management platform built from scratch for a sneaker and Pokemon card retail store — replacing Shopify, Lightspeed, and Instagram DMs with one unified system.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-wrap items-center gap-4 text-sm text-[#F4EFE8]/60"
          >
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Tampa Premium Outlets, FL</span>
            <span className="w-1 h-1 rounded-full bg-[#1C1C1C]" />
            <span className="flex items-center gap-1.5"><Instagram size={14} /> @securedtampa</span>
            <span className="w-1 h-1 rounded-full bg-[#1C1C1C]" />
            <span className="flex items-center gap-1.5"><Globe size={14} /> securedtampa.com</span>
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="relative p-6 rounded-2xl bg-[#EEE6DC]/[0.02] border border-[#1C1C1C] text-center group hover:border-[#B07A45]/30 transition-colors"
            >
              <m.icon size={20} className="mx-auto mb-3 text-[#C89A6A] opacity-60" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{m.value}</div>
              <div className="text-sm text-[#F4EFE8]/60">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Challenge */}
      <section className="px-6 md:px-12 lg:px-24 py-20 border-t border-[#1C1C1C]/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 text-[#B0614A] text-sm font-medium uppercase tracking-wider mb-4">
              <AlertTriangle size={16} />
              The Challenge
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Growing Business<br />
              <span className="text-[#F4EFE8]/60">Held Back by Its Tools</span>
            </h2>
            <p className="text-[#A39B90] leading-relaxed mb-6">
              Dave built Secured Tampa into a thriving sneaker and Pokemon card business at Tampa Premium Outlets, growing to 7,200+ Instagram followers. But his tech stack was working against him.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <div className="space-y-4">
              {[
                { title: 'Shopify Terminated', desc: 'Account shut down — a common issue for resale businesses. No warning, no recourse.' },
                { title: 'Fragmented Operations', desc: 'Lightspeed POS for in-store, Instagram stories for marketing, Zelle for online payments. Nothing connected.' },
                { title: 'No Website', desc: 'Thousands of followers with no place to send them. Every sale required manual DMs and payment coordination.' },
                { title: 'Inventory Chaos', desc: 'No unified system to track stock across online and in-store. Manual spreadsheets and guesswork.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#B0614A]/[0.04] border border-[#B0614A]/10">
                  <h4 className="font-semibold text-[#B0614A] mb-1">{item.title}</h4>
                  <p className="text-sm text-[#F4EFE8]/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Solution */}
      <section className="px-6 md:px-12 lg:px-24 py-20 border-t border-[#1C1C1C]/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 text-[#C89A6A] text-sm font-medium uppercase tracking-wider mb-4">
              <CheckCircle2 size={16} />
              The Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              One Platform<br />
              <span className="text-[#F4EFE8]/60">To Run Everything</span>
            </h2>
            <p className="text-[#A39B90] leading-relaxed mb-6">
              We built securedtampa.com — a fully custom e-commerce platform with integrated inventory management, POS system, shipping, and admin dashboard. No third-party platform dependencies. Dave owns his entire stack.
            </p>
            <a
              href="https://securedtampa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#C89A6A] hover:text-[#C89A6A] font-medium transition-colors"
            >
              Visit securedtampa.com <ExternalLink size={16} />
            </a>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <div className="space-y-4">
              {[
                { title: 'Custom E-Commerce', desc: 'Full storefront with product pages, cart, Stripe checkout, and customer accounts. No platform risk.' },
                { title: 'Unified Inventory', desc: 'One system for online and in-store stock. Barcode scanning, StockX price syncing, and reconciliation.' },
                { title: 'Built-in POS', desc: 'iPad kiosk for walk-in purchases. Process sales, generate receipts, and update inventory in real-time.' },
                { title: 'Complete Admin Suite', desc: 'Dashboard with sales analytics, staff management, shipping labels, email campaigns, and more.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#B07A45]/[0.04] border border-[#B07A45]/10">
                  <h4 className="font-semibold text-[#C89A6A] mb-1">{item.title}</h4>
                  <p className="text-sm text-[#F4EFE8]/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Before / After */}
      <section className="px-6 md:px-12 lg:px-24 py-20 border-t border-[#1C1C1C]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Before <span className="text-[#F4EFE8]/60">&</span> After
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="p-6 md:p-8 rounded-2xl bg-[#B0614A]/[0.03] border border-[#B0614A]/10"
            >
              <h3 className="text-lg font-bold text-[#B0614A] mb-5 flex items-center gap-2">
                <AlertTriangle size={18} /> Before Vantix
              </h3>
              <ul className="space-y-3">
                {[
                  'Shopify account terminated — no online store',
                  'Sales through Instagram DMs and Zelle transfers',
                  'Lightspeed POS with no e-commerce integration',
                  'Manual inventory tracked in spreadsheets',
                  'No shipping automation or label printing',
                  'No email marketing or customer database',
                  'Paying $200-800/mo for disconnected tools',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#A39B90]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B0614A]/50 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="p-6 md:p-8 rounded-2xl bg-[#B07A45]/[0.03] border border-[#B07A45]/10"
            >
              <h3 className="text-lg font-bold text-[#C89A6A] mb-5 flex items-center gap-2">
                <CheckCircle2 size={18} /> After Vantix
              </h3>
              <ul className="space-y-3">
                {[
                  'Fully custom website at securedtampa.com',
                  'Professional e-commerce with Stripe checkout',
                  'Integrated POS system on iPad for in-store sales',
                  'Real-time inventory with barcode scanning',
                  'One-click shipping labels via GoShippo',
                  'Automated emails, wishlists, and customer accounts',
                  '$100/mo maintenance — saving hundreds monthly',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#A39B90]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B07A45] mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 lg:px-24 py-20 border-t border-[#1C1C1C]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <p className="text-[#C89A6A] text-sm font-medium uppercase tracking-wider mb-3">What We Built</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Feature <span className="bg-gradient-to-r from-[#C89A6A] to-[#8E5E34] bg-clip-text text-transparent">Highlights</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 6}
                className="p-5 rounded-xl bg-[#EEE6DC]/[0.02] border border-[#1C1C1C] hover:border-[#B07A45]/20 transition-colors group"
              >
                <f.icon size={20} className="text-[#C89A6A] mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-[#F4EFE8]/60 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 md:px-12 lg:px-24 py-20 border-t border-[#1C1C1C]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
            <p className="text-[#C89A6A] text-sm font-medium uppercase tracking-wider mb-3">Technology</p>
            <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="flex flex-wrap justify-center gap-3"
          >
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[#B07A45]/[0.08] text-[#C89A6A] border border-[#B07A45]/15 hover:border-[#B07A45]/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="px-6 md:px-12 lg:px-24 py-20 border-t border-[#1C1C1C]/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { label: 'Project Value', value: '$4,500', sub: 'One-time build cost' },
            { label: 'Ongoing Cost', value: '$100/mo', sub: 'Hosting + maintenance' },
            { label: 'Monthly Savings', value: '$200-800', sub: 'vs. Shopify + tools' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="p-6 rounded-2xl bg-[#EEE6DC]/[0.02] border border-[#1C1C1C] text-center"
            >
              <p className="text-sm text-[#F4EFE8]/60 mb-2">{item.label}</p>
              <p className="text-3xl font-bold text-[#C89A6A] mb-1">{item.value}</p>
              <p className="text-xs text-[#4B4B4B]">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-[#1C1C1C]/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-[#C89A6A] text-sm font-medium uppercase tracking-wider mb-4">Your Turn</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Want Something<br />
              <span className="bg-gradient-to-r from-[#C89A6A] to-[#8E5E34] bg-clip-text text-transparent">Like This?</span>
            </h2>
            <p className="text-lg text-[#A39B90] mb-10 max-w-xl mx-auto">
              Every business has unique challenges. Let us build a custom solution that fits yours — no templates, no platform risk, no monthly gouging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#B07A45] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#C89A6A] transition-colors"
              >
                Book a Free Consultation
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-[#1C1C1C] text-[#A39B90] px-8 py-4 rounded-xl font-medium hover:border-[#B07A45]/30 hover:text-white transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
