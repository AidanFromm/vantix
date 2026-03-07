'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const trustItems = [
  { label: 'Businesses Scaled', value: '50+' },
  { label: 'Client Retention', value: '94%' },
  { label: 'Avg. ROAS', value: '6.2x' },
];

export default function VideoTrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 md:py-32" style={{ background: '#141416' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#B8935A' }}>
            Trusted By Leaders
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            Results That Speak
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#9090A0' }}>
            We don&apos;t just promise growth — we prove it. Every engagement is measured, tracked, and optimized.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-8 text-center"
              style={{
                background: '#1A1A1E',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: '#B8935A' }}>{item.value}</div>
              <div className="text-sm font-medium uppercase tracking-[0.15em]" style={{ color: '#9090A0' }}>{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
