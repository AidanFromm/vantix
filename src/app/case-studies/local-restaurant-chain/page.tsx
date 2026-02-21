'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, UtensilsCrossed, Globe, Clock, TrendingUp,
  ShoppingCart, Smartphone, Palette, MapPin, Users, Star, CheckCircle2,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stats = [
  { label: 'Online Order Growth', value: '200%', icon: TrendingUp },
  { label: 'Locations Unified', value: '3', icon: MapPin },
  { label: 'Build Time', value: '5 Weeks', icon: Clock },
  { label: 'Customer Satisfaction', value: '4.8★', icon: Star },
];

const techStack = [
  'Next.js', 'Supabase', 'Stripe', 'Tailwind CSS', 'Resend', 'Google Maps API',
];

export default function RestaurantCaseStudyPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] scroll-smooth">
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/case-studies" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Case Studies
          </Link>
          <Link
            href="/#booking"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#8E5E34] shadow-sm hover:shadow-sm transition-all"
            style={{ background: 'linear-gradient(to right, #C89A6A, #C89A6A)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#F4EFE8] shadow-sm flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-[#8E5E34]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8E5E34] uppercase tracking-wider">Food & Hospitality</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Regional Restaurant Group</h1>
            </div>
          </div>
          <p className="text-lg text-[#7A746C] max-w-2xl leading-relaxed">
            A family-owned restaurant chain with 3 locations was losing market share to delivery apps.
            They needed a unified online ordering platform, a cohesive brand identity, and the tools
            to drive customers to order direct — not through third-party apps taking 30% commissions.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="rounded-xl p-5 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm text-center"
            >
              <stat.icon className="w-5 h-5 text-[#8E5E34] mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-[#7A746C] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenge */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
          <div className="rounded-2xl p-8 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm space-y-4 text-[#7A746C] leading-relaxed">
            <p>
              The restaurant group had been relying on third-party delivery platforms for online orders.
              While these apps brought visibility, they were eating into margins — commissions of 25-30%
              on every order made profitability nearly impossible on delivery items.
            </p>
            <p>
              Each of the three locations had its own menu format, inconsistent branding, and no shared
              customer database. Loyal regulars at one location had no idea the other two existed.
              Marketing efforts were fragmented, and there was no way to run promotions across all locations.
            </p>
            <p>
              The owners wanted a single, branded online ordering experience that worked for all three
              locations — with real-time menu management, integrated payments, and a loyalty program
              to keep customers coming back direct.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Solution */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Globe, title: 'Unified Ordering Platform', desc: 'A single branded website with location-specific menus, real-time availability, and integrated checkout — no third-party commissions.' },
              { icon: Palette, title: 'Complete Brand Refresh', desc: 'New visual identity applied consistently across all locations, packaging, social media, and the digital platform.' },
              { icon: Smartphone, title: 'Mobile-First Design', desc: 'Over 70% of orders come from phones. The platform was built mobile-first with one-tap reordering and saved favorites.' },
              { icon: Users, title: 'Loyalty & CRM System', desc: 'Automated loyalty program with points, rewards, and personalized promotions based on order history across all locations.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-6 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm">
                <item.icon className="w-6 h-6 text-[#8E5E34] mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[#7A746C] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">The Results</h2>
          <div className="rounded-2xl p-8 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm space-y-3">
            {[
              'Online orders increased by 200% within 6 months of launch',
              'Third-party app dependency dropped from 85% to 30% of online orders',
              'Average order value increased 18% with smart upsell prompts',
              'Loyalty program enrolled 2,400+ members in the first 4 months',
              'Customer acquisition cost dropped by 40% through direct ordering',
              'All three locations now share a single customer database and marketing platform',
            ].map((result) => (
              <div key={result} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8E5E34] shrink-0 mt-0.5" />
                <p className="text-[#7A746C] leading-relaxed">{result}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full border border-[#E3D9CD] text-sm text-[#7A746C] bg-[#F4EFE8] shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="rounded-2xl p-10 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to grow your restaurant&apos;s online orders?</h2>
            <p className="text-[#7A746C] mb-6 max-w-lg mx-auto">
              Let&apos;s build a custom ordering platform that keeps your margins intact and your customers coming back.
            </p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium shadow-sm transition-colors"
              style={{ background: 'linear-gradient(to right, #8E5E34, #B07A45)' }}
            >
              Book a Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
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
