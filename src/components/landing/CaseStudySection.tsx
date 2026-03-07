'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '$5.8M+', label: 'Revenue Generated' },
  { value: '3,300+', label: 'Leads Captured' },
  { value: '847%', label: 'ROAS' },
  { value: '12x', label: 'Lead Volume Increase' },
];

export default function CaseStudySection() {
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
            Case Study
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            J4K — $5.8M in Revenue
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-8 md:p-12"
          style={{
            background: '#1A1A1E',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto text-center" style={{ color: '#9090A0' }}>
            Just4Keepers came to us with a solid product but no digital infrastructure. We built their entire online presence — website, ad funnels, CRM automations — and scaled them to $5.8M in tracked revenue.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: '#B8935A' }}>{s.value}</div>
                <div className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: '#9090A0' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
