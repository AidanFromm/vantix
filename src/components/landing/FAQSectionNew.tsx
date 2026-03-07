'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from '@phosphor-icons/react';
import { colors, fonts } from '@/lib/design-tokens';

const faqs = [
  {
    num: '01',
    q: 'What makes Vantix different?',
    a: 'Most agencies separate design from development. We don\'t. Your brand identity, website, and AI automation are built by the same team, from the same foundation — so everything feels cohesive from day one.',
  },
  {
    num: '02',
    q: 'How long does a project take?',
    a: 'Starter projects ship in 5-7 business days. Growth packages take 2-3 weeks. Enterprise engagements run 4-6 weeks. We\'ll confirm your timeline before anything kicks off.',
  },
  {
    num: '03',
    q: 'What does the process look like?',
    a: 'Four clear phases: Discover (goals & vision), Strategy (positioning & architecture), Design & Build (wireframes to production), and Launch & Optimize (go live, measure, iterate).',
  },
  {
    num: '04',
    q: 'Can packages be customized?',
    a: 'Absolutely. Our tiers are starting points. If you need something specific — like AI automation without a full rebrand — we\'ll build a scope that fits.',
  },
  {
    num: '05',
    q: 'Do you offer ongoing support?',
    a: 'Yes. Every tier includes post-launch support (14-120 days depending on plan). We also offer retainer arrangements for teams that want continuous iteration.',
  },
  {
    num: '06',
    q: 'How do we get started?',
    a: 'Book a call or fill out the contact form below. We\'ll have a 15-minute conversation to see if we\'re a fit — no pressure, no pitch decks.',
  },
];

export default function FAQSectionNew() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          FAQs
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg mb-16"
          style={{ color: colors.textSecondary, fontFamily: fonts.body }}
        >
          Everything you need to know before we start.
        </motion.p>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="border-b"
              style={{ borderColor: colors.border }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-5 py-6 text-left group"
              >
                <span
                  className="text-sm font-semibold shrink-0"
                  style={{ color: colors.bronze, fontFamily: fonts.mono }}
                >
                  {faq.num}
                </span>
                <span
                  className="text-base md:text-lg font-medium flex-1 transition-colors duration-200 group-hover:text-[#B8935A]"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {faq.q}
                </span>
                {open === i ? (
                  <Minus size={20} weight="light" color={colors.bronze} className="shrink-0" />
                ) : (
                  <Plus size={20} weight="light" color={colors.textMuted} className="shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="pb-6 pl-10 text-sm leading-relaxed max-w-xl"
                      style={{ color: colors.textSecondary, fontFamily: fonts.body }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
