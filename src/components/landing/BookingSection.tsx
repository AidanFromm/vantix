'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BookingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="booking" className="py-20 md:py-32" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#B8935A' }}>
            Let&apos;s Talk
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: '#F0EBE3', letterSpacing: '-0.03em' }}>
            Ready to Scale?
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#9090A0' }}>
            Book a free strategy call. We&apos;ll audit your current setup and show you exactly where the growth is.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: '#1A1A1E',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            minHeight: '650px',
          }}
        >
          <iframe
            src="https://calendly.com/usevantix/30min"
            width="100%"
            height="650"
            frameBorder="0"
            title="Book a call with Vantix"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
