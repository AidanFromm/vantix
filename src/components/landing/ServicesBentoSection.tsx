'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const services = [
  {
    title: 'AI Automation',
    desc: 'Custom AI agents and workflows that eliminate repetitive tasks and accelerate decision-making.',
    icon: '⚡',
  },
  {
    title: 'Web & App Development',
    desc: 'High-performance websites and applications built for conversion and scale.',
    icon: '🖥️',
  },
  {
    title: 'Paid Advertising',
    desc: 'Data-driven ad campaigns across Meta, Google, and TikTok that deliver measurable ROI.',
    icon: '📈',
  },
  {
    title: 'Brand & Creative',
    desc: 'Premium brand identities and creative assets that command attention and trust.',
    icon: '✦',
  },
];

export default function ServicesBentoSection() {
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
            What We Do
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            Services Built for Growth
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              style={{
                background: '#1A1A1E',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: '0 0 40px rgba(184,147,90,0.15), inset 0 1px 0 rgba(184,147,90,0.1)' }}
              />
              <div className="relative z-10">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#F0EBE3' }}>{s.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#9090A0' }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
