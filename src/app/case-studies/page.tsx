'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, ShoppingCart, Building2, Layers } from 'lucide-react';

const FloatingNav = dynamic(() => import('@/components/landing/FloatingNav'), { ssr: false });
const FooterSection = dynamic(() => import('@/components/landing/FooterSection'));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const studies = [
  {
    slug: 'secured-tampa',
    client: 'Secured Tampa',
    tagline: 'From Instagram DMs to E-commerce Platform',
    industry: 'Retail (Sneakers & Collectibles)',
    icon: ShoppingCart,
    results: [
      { metric: '60%', label: 'Less inventory time' },
      { metric: '3x', label: 'Online sales' },
      { metric: '45 min', label: 'Saved per day' },
    ],
  },
  {
    slug: 'just-four-kicks',
    client: 'Just Four Kicks',
    tagline: 'Scaling $5.8M Revenue with Custom Infrastructure',
    industry: 'B2B Wholesale',
    icon: Building2,
    results: [
      { metric: '80%', label: 'Less order mgmt time' },
      { metric: '12%', label: 'Margin improvement' },
      { metric: '200+', label: 'Stores digital' },
    ],
  },
  {
    slug: 'card-ledger',
    client: 'CardLedger',
    tagline: 'Building a Product from Zero to Beta Launch',
    industry: 'SaaS / Collectibles',
    icon: Layers,
    results: [
      { metric: '500+', label: 'Beta signups' },
      { metric: '4.8/5', label: 'Satisfaction' },
      { metric: '3', label: 'Platforms ready' },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C]">
      <FloatingNav />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p variants={fadeUp} initial="hidden" animate="visible"
            className="text-[#B07A45] font-semibold tracking-widest uppercase text-sm mb-4">
            Case Studies
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
            Real Results
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="text-[#7A746C] text-lg md:text-xl max-w-2xl mx-auto">
            See how we&apos;ve helped businesses transform with AI-powered solutions.
          </motion.p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {studies.map((s, i) => (
            <motion.div
              key={s.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/case-studies/${s.slug}`} className="group block">
                <div className="rounded-2xl border border-[#E3D9CD] bg-white/60 p-8 md:p-10 hover:border-[#B07A45] hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <s.icon className="w-5 h-5 text-[#B07A45]" />
                        <span className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider">{s.industry}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
                        {s.client}
                      </h2>
                      <p className="text-[#7A746C] text-lg mb-6">{s.tagline}</p>
                      <div className="flex flex-wrap gap-6">
                        {s.results.map((r) => (
                          <div key={r.label} className="text-center">
                            <div className="text-2xl font-bold text-[#B07A45]">{r.metric}</div>
                            <div className="text-xs text-[#7A746C] mt-1">{r.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#B07A45] font-semibold group-hover:gap-3 transition-all shrink-0 mt-4 md:mt-0">
                      Read Study <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
