'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const faqs = [
  { q: 'How much does it cost?', a: 'Every project is different. Most clients invest between $2,500 - $10,000+ depending on scope. We\'ll give you an exact quote after our discovery call — no surprises.' },
  { q: 'How long does a project take?', a: 'Most projects launch in 2-4 weeks. Complex platforms may take 4-6 weeks. You\'ll see daily progress updates through your own dashboard.' },
  { q: 'What\'s included in the build?', a: 'Everything. Design, development, testing, deployment, and 30 days of post-launch support. We also set up hosting, domains, and all third-party integrations.' },
  { q: 'What industries do you work with?', a: 'Any business that wants to automate and scale. We\'ve built for retail, e-commerce, wholesale, services, and more. If you have a process, we can automate it.' },
  { q: 'Do you offer ongoing support?', a: 'Yes. After the initial 30-day support period, we offer maintenance plans starting at $100/month for updates, monitoring, and continuous improvements.' },
  { q: 'How do I get started?', a: 'Book a free 30-minute AI audit call. We\'ll map out exactly what AI can do for your business and give you a custom roadmap — even if you don\'t hire us.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E3D9CD] py-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <span
          className="text-lg font-medium text-[#1C1C1C] pr-4"
          style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
        >
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`text-[#B07A45] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p
              className="text-[#4B4B4B] leading-relaxed pt-4"
              style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-[#F4EFE8]">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1C1C] text-center mb-14"
          style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
        >
          Common Questions
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
