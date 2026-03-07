'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <footer ref={ref} className="py-12" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold" style={{ color: '#B8935A' }}>V</span>
            <span className="text-lg font-semibold" style={{ color: '#F0EBE3' }}>Vantix</span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#booking" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: '#9090A0' }}>
              Contact
            </a>
            <a href="https://instagram.com/usevantix" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: '#9090A0' }}>
              Instagram
            </a>
          </div>

          <p className="text-xs" style={{ color: '#5A5A6A' }}>
            © {new Date().getFullYear()} Vantix. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
