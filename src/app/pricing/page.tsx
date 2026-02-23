'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Check, ArrowRight } from 'lucide-react';

const FloatingNav = dynamic(() => import('@/components/landing/FloatingNav'), { ssr: false });
const FooterSection = dynamic(() => import('@/components/landing/FooterSection'));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const tiers = [
  {
    name: 'Starter',
    price: '$2,500 – $5,000',
    popular: false,
    features: [
      'AI audit & roadmap',
      'Single automation or chatbot',
      'Basic dashboard setup',
      '30-day post-launch support',
    ],
    bestFor: 'Small businesses getting started with AI',
  },
  {
    name: 'Growth',
    price: '$5,000 – $15,000',
    popular: true,
    features: [
      'Full AI infrastructure audit',
      'Custom website or app build',
      'Up to 3 automation workflows',
      'Analytics dashboard',
      '60-day support + optimization',
    ],
    bestFor: 'Growing businesses ready to scale',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    popular: false,
    features: [
      'Complete digital transformation',
      'Multiple AI systems & integrations',
      'Dedicated ongoing support',
      'Priority development queue',
      'Custom SLA',
    ],
    bestFor: 'Established businesses with complex needs',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C]">
      <FloatingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[#B07A45] font-semibold tracking-widest uppercase text-sm mb-4"
          >
            Pricing
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-clash, sans-serif)' }}
          >
            Transparent Investment
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-[#7A746C] text-lg md:text-xl max-w-2xl mx-auto"
          >
            Every project starts with a free audit. Pricing reflects scope, not guesswork.
          </motion.p>
        </div>
      </section>

      {/* Tiers */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.popular
                  ? 'border-2 border-[#B07A45] bg-white shadow-xl'
                  : 'border border-[#E3D9CD] bg-white/60'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B07A45] text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-clash, sans-serif)' }}
              >
                {tier.name}
              </h3>
              <p className="text-3xl font-bold text-[#B07A45] mb-6">{tier.price}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[#1C1C1C]">
                    <Check className="w-5 h-5 text-[#B07A45] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#7A746C] mb-6">
                <span className="font-semibold">Best for:</span> {tier.bestFor}
              </p>
              <Link
                href="/#booking"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all text-sm ${
                  tier.popular
                    ? 'bg-[#B07A45] text-white hover:bg-[#96663A]'
                    : 'border border-[#B07A45] text-[#B07A45] hover:bg-[#B07A45] hover:text-white'
                }`}
              >
                Book Your Audit <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
