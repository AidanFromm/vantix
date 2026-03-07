'use client';

import { motion } from 'framer-motion';
import { Check } from '@phosphor-icons/react';

const tiers = [
  {
    name: 'Starter',
    price: '$2,500',
    desc: 'Perfect for small businesses launching their online presence.',
    features: ['5-page custom website', 'Mobile responsive design', 'Basic SEO setup', 'Contact form integration', '2 rounds of revisions', '2-week delivery'],
    popular: false,
  },
  {
    name: 'Growth',
    price: '$5,000',
    desc: 'For businesses ready to scale with a serious digital presence.',
    features: ['10-page custom website', 'Brand identity package', 'Advanced SEO & analytics', 'CMS integration', 'E-commerce ready', '4 rounds of revisions', '3-week delivery', 'Priority support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$10,000+',
    desc: 'Full-service brand and web solution for established companies.',
    features: ['Unlimited pages', 'Complete brand identity', 'Custom AI integrations', 'Advanced animations', 'Performance optimization', 'Unlimited revisions', 'Dedicated project manager', 'Ongoing support'],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32" style={{ backgroundColor: '#F3F0EB' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-[#6B6B6B]">No hidden fees. No surprises. Just great work.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 border shadow-sm ${
                tier.popular ? 'border-[#B8935A] shadow-md' : 'border-black/[0.06]'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B8935A] text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-[#1A1A1A]">{tier.price}</span>
              </div>
              <p className="text-sm text-[#6B6B6B] mb-6">{tier.desc}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#1A1A1A]">
                    <Check size={18} weight="regular" className="text-[#B8935A] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                  tier.popular
                    ? 'bg-[#B8935A] hover:bg-[#A07D4A] text-white'
                    : 'bg-[#F3F0EB] hover:bg-[#E8E5DF] text-[#1A1A1A]'
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
