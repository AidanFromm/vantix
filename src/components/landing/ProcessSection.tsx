'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  { num: '01', title: 'Audit', desc: 'Deep-dive into your current systems, brand, and growth bottlenecks.' },
  { num: '02', title: 'Build', desc: 'Design and develop your custom infrastructure — website, automations, creatives.' },
  { num: '03', title: 'Launch', desc: 'Deploy everything with paid campaigns driving qualified traffic from day one.' },
  { num: '04', title: 'Scale', desc: 'Optimize, iterate, and expand. Data-driven growth that compounds.' },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 md:py-32" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#B8935A' }}>
            Our Process
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            From Audit to Scale
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: 'linear-gradient(to bottom, transparent, rgba(184,147,90,0.3), transparent)' }} />

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full text-lg font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #B8935A, #7D5F35)',
                    color: '#0A0A0A',
                    boxShadow: '0 0 24px rgba(184,147,90,0.2)',
                  }}
                >
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#F0EBE3' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9090A0' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
