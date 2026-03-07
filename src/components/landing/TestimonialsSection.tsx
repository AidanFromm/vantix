'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'Vantix completely transformed our online presence. The new site increased our conversions by 40% in the first month.',
    name: 'Marcus Johnson',
    company: 'Just Four Kicks',
  },
  {
    quote: 'Professional, responsive, and incredibly talented. They understood our vision and delivered beyond expectations.',
    name: 'Sarah Chen',
    company: 'SecuredTampa',
  },
  {
    quote: 'The best investment we made this year. Our brand finally feels cohesive across every touchpoint.',
    name: 'David Ramirez',
    company: 'CardLedger',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: '#F3F0EB' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">What Our Clients Say</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-black/[0.06] shadow-sm"
            >
              <span className="text-4xl text-[#B8935A] font-serif leading-none block mb-4">&ldquo;</span>
              <p className="text-[#1A1A1A] italic leading-relaxed mb-6">{t.quote}</p>
              <div>
                <p className="font-semibold text-[#1A1A1A]">{t.name}</p>
                <p className="text-sm text-[#6B6B6B]">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
