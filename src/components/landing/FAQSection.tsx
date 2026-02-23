'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

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
    <section id="faq" className="py-24 lg:py-32 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#B07A45] mb-4" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4EFE8]" style={{ fontFamily: "'Clash Display', sans-serif" }}>
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
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="border border-[#222] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span
                    className="text-[#F4EFE8] font-semibold text-base lg:text-lg pr-4"
                    style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '20px' }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#B07A45] text-2xl font-light flex-shrink-0 leading-none"
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
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 pb-5 text-[#7A746C] leading-relaxed"
                        style={{ fontFamily: "'Satoshi', sans-serif", fontSize: '16px' }}
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
