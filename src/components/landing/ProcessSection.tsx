'use client';

import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Discover', desc: 'We learn your business, audience, and goals through deep research and conversation.' },
  { num: '02', title: 'Strategy', desc: 'We map the brand positioning, site architecture, and creative direction.' },
  { num: '03', title: 'Design & Build', desc: 'We design in the browser, iterate fast, and build with production-grade code.' },
  { num: '04', title: 'Launch', desc: 'We deploy, test, and optimize — then hand you the keys with full documentation.' },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-32" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">How We Work</h2>
          <p className="text-lg text-[#6B6B6B]">A proven process from discovery to launch.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-[#B8935A]/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center lg:text-left"
            >
              <span className="text-5xl font-bold text-[#B8935A]/30 block mb-4">{step.num}</span>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{step.title}</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
