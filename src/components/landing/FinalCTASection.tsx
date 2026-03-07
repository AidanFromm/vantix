'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FinalCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 md:py-32" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            Stop Leaving Revenue<br />on the Table
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#9090A0' }}>
            Your competitors are already investing in AI, automation, and premium digital infrastructure. The question isn&apos;t if — it&apos;s when.
          </p>
          <a
            href="#booking"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #C87F4E, #8E5E34)',
              boxShadow: '0 8px 32px rgba(200,127,78,0.3)',
            }}
          >
            Book Your Free Strategy Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
