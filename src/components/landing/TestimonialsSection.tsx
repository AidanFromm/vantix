'use client';

import { motion } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

const testimonials = [
  {
    quote: 'Vantix completely transformed our online presence. The attention to detail and understanding of our brand was exceptional.',
    name: 'Marcus Chen',
    title: 'Founder',
    company: 'Just Four Kicks',
  },
  {
    quote: 'Working with Vantix felt like having an in-house creative team. They delivered beyond what we imagined — on time and on budget.',
    name: 'Sarah Mitchell',
    title: 'CEO',
    company: 'Secured Tampa',
  },
  {
    quote: 'The AI automation they built saves us 20+ hours a week. Best investment we\'ve made this year.',
    name: 'David Park',
    title: 'Operations Lead',
    company: 'Horizon Asphalt',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Client Testimonials
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg mb-16 text-center max-w-md mx-auto"
          style={{ color: colors.textSecondary, fontFamily: fonts.body }}
        >
          Real results from founders who trusted Vantix.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-8"
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
              }}
            >
              <p
                className="text-base md:text-lg italic leading-relaxed mb-6"
                style={{ color: colors.text, fontFamily: fonts.body }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: fonts.display }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
                  {t.title}, {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
