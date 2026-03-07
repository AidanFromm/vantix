'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'How long does a typical project take?', a: 'Most projects take 2-4 weeks from kickoff to launch. Larger enterprise projects may take 6-8 weeks. We provide a detailed timeline during our discovery call.' },
  { q: 'What do I need to get started?', a: 'Just a clear idea of your goals. We handle everything from strategy to design to development. A brief call is all we need to kick things off.' },
  { q: 'Do you offer ongoing support?', a: 'Yes. All packages include 30 days of post-launch support. We also offer monthly retainer packages for ongoing maintenance, updates, and growth.' },
  { q: 'Can you work with my existing brand?', a: 'Absolutely. We can build on your existing brand guidelines or refine them as part of the project. We are flexible and work with what you have.' },
  { q: 'What technologies do you use?', a: 'We primarily build with Next.js, React, and Tailwind CSS. For e-commerce, we integrate with Shopify or custom solutions. We choose the best tool for each project.' },
  { q: 'What if I am not happy with the design?', a: 'We include multiple rounds of revisions in every package. We work collaboratively and iterate until you are thrilled with the result.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-black/[0.06] rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-4 p-6 text-left"
              >
                <span className="text-sm font-bold text-[#B8935A] flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-base font-semibold text-[#1A1A1A] flex-1">{faq.q}</span>
                <span className="text-[#6B6B6B] text-xl flex-shrink-0">
                  {open === i ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pl-16 text-[#6B6B6B] leading-relaxed text-sm">
                      {faq.a}
                    </div>
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
