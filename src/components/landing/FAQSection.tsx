'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const faqs = [
  {
    q: 'What does an AI audit actually involve?',
    a: 'We spend 2-3 hours mapping your current operations \u2014 tools, workflows, team structure, pain points. Then we deliver a prioritized report showing where AI creates the most value, what it costs, and what the ROI timeline looks like. No obligation after that.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Most projects go from audit to production in 3-6 weeks. Simpler automation or chatbot deployments can be live in under two weeks. We work in focused sprints so you see progress weekly.',
  },
  {
    q: 'What industries do you work with?',
    a: 'We\u2019re industry-agnostic. Our current clients span retail, e-commerce, collectibles, and local services. The methodology adapts \u2014 the operational patterns that waste time are surprisingly similar across industries.',
  },
  {
    q: 'Do you only work with AI projects?',
    a: 'No. We build custom websites, mobile apps, dashboards, and automation systems with or without AI components. AI is a tool in our kit, not the only one.',
  },
  {
    q: 'What does it cost?',
    a: 'Projects typically range from $2,500 to $15,000 depending on scope. We quote after the audit so pricing reflects what you actually need, not a one-size package.',
  },
  {
    q: 'Can you work with our existing tools?',
    a: 'Yes. We build around your stack. Shopify, Airtable, Notion, Supabase, custom APIs \u2014 we integrate rather than replace.',
  },
  {
    q: 'What happens after launch?',
    a: 'We offer ongoing optimization packages, but they\u2019re optional. Every project includes 30 days of post-launch support and monitoring at no extra charge.',
  },
  {
    q: 'What makes Vantix different from other agencies?',
    a: 'Two things: we actually build (our founders are the engineers), and our AI agents work 24/7 on optimization after launch. You\u2019re not hiring a middleman \u2014 you\u2019re hiring the people who write the code.',
  },
];

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 lg:py-36" style={{ backgroundColor: colors.dark }}>
      <div className="max-w-3xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: `${colors.bronze}60` }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              FAQ
            </span>
            <span className="h-px w-8" style={{ backgroundColor: `${colors.bronze}60` }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.bg }}
          >
            Questions we get asked
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                className="rounded-2xl overflow-hidden transition-colors duration-300"
                style={{
                  border: `1px solid ${isOpen ? `${colors.bronze}40` : '#222'}`,
                  backgroundColor: isOpen ? `${colors.bronze}08` : 'transparent',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left group"
                >
                  <span
                    className="font-semibold text-lg lg:text-xl pr-4"
                    style={{ fontFamily: fonts.display, color: colors.bg }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="text-2xl font-light flex-shrink-0 leading-none"
                    style={{ color: colors.bronze }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-7 pb-6 leading-relaxed text-base"
                        style={{ fontFamily: fonts.body, color: colors.muted }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
