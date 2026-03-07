'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const beforeItems = [
  'Generic template website',
  'Manual lead follow-up',
  'Inconsistent branding',
  'No data-driven decisions',
];

const afterItems = [
  'Custom high-converting platform',
  'AI-powered instant response',
  'Premium cohesive brand identity',
  'Real-time analytics dashboard',
];

export default function BeforeAfterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 md:py-32" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#B8935A' }}>
            The Transformation
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            Before vs. After Vantix
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-8"
            style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] mb-6"
              style={{ background: 'rgba(207,85,85,0.15)', color: '#CF5555' }}>
              Before
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-base" style={{ color: '#9090A0' }}>
                  <span className="mt-1 text-sm" style={{ color: '#CF5555' }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-8"
            style={{
              background: '#1A1A1E',
              border: '1px solid rgba(184,147,90,0.3)',
              boxShadow: '0 0 40px rgba(184,147,90,0.08)',
            }}
          >
            <div className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] mb-6"
              style={{ background: 'rgba(184,147,90,0.15)', color: '#B8935A' }}>
              After
            </div>
            <ul className="space-y-4">
              {afterItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-base" style={{ color: '#F0EBE3' }}>
                  <span className="mt-1 text-sm" style={{ color: '#4CAF7A' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
