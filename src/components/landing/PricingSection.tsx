'use client';

import { motion } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

const plans = [
  {
    name: 'Starter',
    price: '$2,500',
    desc: 'For startups and small businesses launching their digital presence.',
    timeline: '5-7 Business Days',
    features: [
      'Landing Page',
      'Basic SEO',
      'Mobile Responsive',
      '1 Round of Revisions',
      '14 Days Support',
    ],
    popular: false,
  },
  {
    name: 'Growth',
    price: '$5,000',
    desc: 'For brands scaling fast that need a complete digital overhaul.',
    timeline: '2-3 Weeks',
    features: [
      'Everything in Starter',
      'Multi-page Site',
      'Brand Guidelines',
      'AI Chatbot',
      'Social Media Kit',
      '60 Days Support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$10,000+',
    desc: 'For companies at a defining moment — full rebrand, full build.',
    timeline: '4-6 Weeks',
    features: [
      'Everything in Growth',
      'Custom AI Automation',
      'Full Brand Identity',
      'SEO Strategy',
      'Priority Support (120 days)',
    ],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Pricing Plans
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg mb-16 text-center max-w-md mx-auto"
          style={{ color: colors.textSecondary, fontFamily: fonts.body }}
        >
          Three tiers. Each built for a specific moment.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${plan.popular ? colors.bronze + '50' : colors.border}`,
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-8 text-xs font-semibold px-4 py-1 rounded-full"
                  style={{
                    backgroundColor: colors.bronze,
                    color: colors.bg,
                    fontFamily: fonts.body,
                  }}
                >
                  Most Popular
                </span>
              )}
              <h3
                className="text-lg font-semibold mb-1"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                {plan.name}
              </h3>
              <span
                className="text-4xl font-bold mb-3"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                {plan.price}
              </span>
              <p
                className="text-sm mb-2 leading-relaxed"
                style={{ color: colors.textSecondary, fontFamily: fonts.body }}
              >
                {plan.desc}
              </p>
              <p
                className="text-xs mb-6 uppercase tracking-wider"
                style={{ color: colors.textMuted, fontFamily: fonts.body }}
              >
                {plan.timeline}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: colors.textSecondary, fontFamily: fonts.body }}
                  >
                    <span style={{ color: colors.bronze }} className="mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="block text-center py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:brightness-110"
                style={{
                  backgroundColor: plan.popular ? colors.bronze : 'transparent',
                  color: plan.popular ? colors.bg : colors.text,
                  border: plan.popular ? 'none' : `1px solid ${colors.borderHover}`,
                  fontFamily: fonts.body,
                }}
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
