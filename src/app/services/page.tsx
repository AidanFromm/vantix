'use client';

import { motion } from 'framer-motion';
import {
  Globe, AppWindow, ShoppingCart, Zap, Smartphone, Wrench,
  Check, ArrowRight, Calendar, Code2, Database, Palette,
  BarChart3, Mail, GitBranch, Shield, Gauge, Search,
  CreditCard, Truck, Users, Bot, Workflow, Server
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const services = [
  {
    icon: Globe,
    title: 'Custom Websites',
    description: 'Full-stack web development. Not templates. Custom-built from scratch with modern frameworks. SEO optimized, mobile-first, fast.',
    features: [
      'Fully custom design — no themes or templates',
      'Built with React, Next.js & Tailwind CSS',
      'Mobile-first responsive design',
      'SEO optimized from day one',
      'Lightning-fast performance (90+ Lighthouse)',
      'CMS integration if needed',
    ],
    included: [
      'Discovery & strategy session',
      'Custom UI/UX design',
      'Full development & testing',
      'SEO setup & optimization',
      'Analytics integration',
      'Launch support & handoff',
    ],
    useCase: 'A local law firm needed a professional web presence that ranks on Google. We built a custom Next.js site with structured data, blog system, and contact forms — they went from page 3 to the top 5 results in 8 weeks.',
  },
  {
    icon: AppWindow,
    title: 'Web Applications',
    description: 'Complex business tools: dashboards, inventory systems, CRMs, portals. Database-backed with real-time features.',
    features: [
      'Custom dashboards & admin panels',
      'Real-time data & notifications',
      'Role-based access control',
      'Database design & optimization',
      'API development & integration',
      'Scalable cloud architecture',
    ],
    included: [
      'Requirements analysis & planning',
      'Database architecture design',
      'Full-stack development',
      'User authentication & security',
      'Testing & QA',
      'Deployment & documentation',
    ],
    useCase: 'A logistics company was tracking shipments in spreadsheets. We built a real-time dashboard with automated status updates, driver assignments, and client notifications — saving 20+ hours per week.',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    description: 'Custom online stores that actually work for your business. Not cookie-cutter Shopify. Inventory management, payment processing, shipping integration.',
    features: [
      'Custom storefront design',
      'Inventory management system',
      'Stripe & payment processing',
      'Shipping rate calculation & tracking',
      'Order management dashboard',
      'Customer accounts & wishlists',
    ],
    included: [
      'Store architecture & planning',
      'Product catalog setup',
      'Payment gateway integration',
      'Shipping provider integration',
      'Admin dashboard',
      'Launch & go-live support',
    ],
    useCase: 'A sneaker reseller needed a store that could handle drops with thousands of concurrent users. We built a custom platform with real-time inventory, automated pricing, and integrated shipping — handling 5x the traffic of their old Shopify setup.',
  },
  {
    icon: Zap,
    title: 'Automation & Systems',
    description: 'Business process automation. Email campaigns, lead generation, data pipelines, API integrations. Save hours of manual work.',
    features: [
      'Email campaign automation',
      'Lead generation & scoring',
      'Data pipeline development',
      'API integrations (any platform)',
      'Workflow automation',
      'Custom reporting & alerts',
    ],
    included: [
      'Process audit & mapping',
      'Integration architecture',
      'Custom automation development',
      'Testing & validation',
      'Monitoring setup',
      'Training & documentation',
    ],
    useCase: 'An e-commerce brand was manually processing orders across 3 platforms. We built an automation system that syncs inventory, routes orders, and sends tracking updates — eliminating 30+ hours of weekly manual work.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications. React Native. App store deployment.',
    features: [
      'Cross-platform (iOS & Android)',
      'Native performance with React Native',
      'Push notifications',
      'Offline support',
      'App store optimization',
      'Backend API development',
    ],
    included: [
      'App strategy & wireframing',
      'UI/UX design for mobile',
      'Cross-platform development',
      'Backend & API setup',
      'App store submission',
      'Post-launch support',
    ],
    useCase: 'A fitness studio needed a branded app for class bookings, payments, and push reminders. We built a cross-platform app that increased recurring bookings by 40% in the first month.',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    description: 'Ongoing support plans. Bug fixes, updates, hosting management, performance monitoring. Starting at $100/mo.',
    features: [
      'Priority bug fixes',
      'Security updates & patches',
      'Performance monitoring',
      'Hosting management',
      'Content updates',
      'Monthly health reports',
    ],
    included: [
      'Dedicated support channel',
      'Monthly performance review',
      'Uptime monitoring (99.9%)',
      'Regular backups',
      'Security scanning',
      'Priority response times',
    ],
    useCase: 'A growing SaaS company needed reliable ongoing support without hiring a full dev team. Our maintenance plan handles all updates, monitoring, and fixes — so they can focus on their business.',
  },
];

const technologies = [
  { name: 'React', icon: Code2 },
  { name: 'Next.js', icon: Globe },
  { name: 'Node.js', icon: Server },
  { name: 'Python', icon: Bot },
  { name: 'Supabase', icon: Database },
  { name: 'Stripe', icon: CreditCard },
  { name: 'Tailwind', icon: Palette },
  { name: 'React Native', icon: Smartphone },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Git', icon: GitBranch },
  { name: 'Vercel', icon: Gauge },
  { name: 'REST & GraphQL', icon: Workflow },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.58, 1] as const },
  }),
};

export default function ServicesPage() {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/usevantix/consultation' });
    } else {
      window.open('https://calendly.com/usevantix/consultation', '_blank');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
              Our Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              What We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Build
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              From custom websites to full-scale business platforms. We build software that works as hard as you do.
            </p>
          </motion.div>
        </section>

        {/* Services */}
        <section className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto pb-24 space-y-32">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={service.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeUp}
                id={service.title.toLowerCase().replace(/\s+/g, '-')}
              >
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  {/* Left: Info */}
                  <div className={isEven ? 'order-1' : 'order-1 md:order-2'}>
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                      >
                        <Icon size={28} className="text-emerald-400" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-bold">{service.title}</h2>
                    </div>
                    <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Key Features</h3>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-neutral-300">
                          <Check size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-emerald-500 text-black px-6 py-3 rounded-lg font-semibold text-sm hover:bg-emerald-400 transition-colors"
                    >
                      Get a Free Quote
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Right: Included + Use Case */}
                  <div className={isEven ? 'order-2' : 'order-2 md:order-1'}>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 mb-6">
                      <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-5">
                        What&apos;s Included
                      </h3>
                      <ul className="space-y-3">
                        {service.included.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-neutral-300">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check size={12} className="text-emerald-400" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-8">
                      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                        Example Use Case
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed italic">
                        &ldquo;{service.useCase}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Pricing Approach */}
        <section className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-2">
              Every project is different. We don&apos;t believe in one-size-fits-all pricing.
            </p>
            <p className="text-neutral-500 mb-8">
              Tell us what you need and we&apos;ll give you an honest, detailed quote — no surprises.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-emerald-500 text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
            >
              Get a Custom Quote
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>

        {/* Technologies */}
        <section className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Tech Stack</h2>
            <p className="text-neutral-400">We use the best tools for the job. Always.</p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {technologies.map((tech, i) => {
              const TechIcon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:border-emerald-500/30 transition-colors"
                >
                  <TechIcon size={24} className="text-emerald-400" />
                  <span className="text-xs text-neutral-400 font-medium">{tech.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-400 text-lg max-w-lg mx-auto mb-8">
              Book a free consultation. We&apos;ll discuss your project, timeline, and budget — no pressure.
            </p>
            <button
              onClick={openCalendly}
              className="inline-flex items-center gap-2 bg-emerald-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              <Calendar size={20} />
              Book a Free Consultation
            </button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
