'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const caseStudies = [
  {
    slug: 'secured-tampa',
    client: 'SecuredTampa',
    industry: 'Sneakers & Collectibles',
    metric: '122-page e-commerce platform built in 3 weeks',
    description: 'Custom e-commerce + inventory management + POS integration replacing Shopify for a Tampa-based sneaker and collectibles retailer.',
    icon: ShoppingCart,
    tags: ['E-Commerce', 'POS Integration', 'Inventory Management'],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C]">
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/#booking"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#8E5E34] shadow-sm hover:shadow-sm transition-all"
            style={{ background: 'linear-gradient(to right, #C89A6A, #C89A6A, #C89A6A, #C89A6A)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Case Studies
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }} className="text-lg text-[#7A746C] max-w-2xl mx-auto">
          Real projects. Real results. See how we help businesses transform with custom AI-powered solutions.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.slug}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
            >
              <Link href={`/case-studies/${cs.slug}`} className="block group">
                <div className="rounded-2xl p-8 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm hover:shadow-sm transition-shadow duration-300">
                  <div className="w-14 h-14 rounded-xl bg-[#F4EFE8] shadow-sm flex items-center justify-center mb-6">
                    <cs.icon className="w-7 h-7 text-[#8E5E34]" />
                  </div>
                  <p className="text-xs font-semibold text-[#8E5E34] uppercase tracking-wider mb-2">{cs.industry}</p>
                  <h3 className="text-2xl font-bold mb-2">{cs.client}</h3>
                  <p className="text-[#7A746C] text-sm mb-4 leading-relaxed">{cs.description}</p>
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-[#F4EFE8] shadow-inner">
                    <TrendingUp className="w-4 h-4 text-[#8E5E34] shrink-0" />
                    <span className="text-sm font-semibold">{cs.metric}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cs.tags.map((t) => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full border border-[#E3D9CD] text-[#7A746C]">{t}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8E5E34] group-hover:text-[#B07A45] transition-colors">
                    Read Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
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