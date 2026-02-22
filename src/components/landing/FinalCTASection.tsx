'use client';

import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function FinalCTASection() {
  return (
    <section id="booking" className="py-24 md:py-32 bg-[#EEE6DC]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1C1C1C] mb-4"
            style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
          >
            Ready to Automate Your Business?
          </h2>
          <p
            className="text-lg text-[#4B4B4B] mt-4 mb-10"
            style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
          >
            Book a free 30-minute AI audit. No strings attached.
          </p>

          <a
            href="#booking"
            className="inline-block bg-[#B07A45] hover:bg-[#8E5E34] text-white px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Book Your Free AI Audit
          </a>

          <div className="mt-8 flex items-center justify-center gap-2 text-[#7A746C]">
            <Phone size={16} />
            <a href="tel:+19084987753" className="hover:text-[#B07A45] transition-colors">(908) 498-7753</a>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-[#7A746C] text-sm">
            <Mail size={14} />
            <a href="mailto:hello@usevantix.com" className="hover:text-[#B07A45] transition-colors">or email hello@usevantix.com</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
