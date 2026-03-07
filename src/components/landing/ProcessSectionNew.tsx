'use client';

import { motion } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

const steps = [
  { num: '01', title: 'Discover', desc: 'We start with a conversation, not a form. Goals, vision, audience.' },
  { num: '02', title: 'Strategy', desc: 'Positioning, competitive landscape, brand architecture.' },
  { num: '03', title: 'Design & Build', desc: 'From wireframes to production. Design and code, same team.' },
  { num: '04', title: 'Launch & Optimize', desc: 'Go live, measure, iterate. We don\'t disappear after delivery.' },
];

export default function ProcessSectionNew() {
  return (
    <section className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          How We Work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg mb-20 max-w-md"
          style={{ color: colors.textSecondary, fontFamily: fonts.body }}
        >
          Four phases. No surprises. No scope creep.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <span
                className="text-5xl md:text-6xl font-bold block mb-4"
                style={{ fontFamily: fonts.display, color: colors.bronze }}
              >
                {step.num}
              </span>
              {/* Connecting line (desktop only) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-7 right-0 translate-x-1/2 w-full h-px"
                  style={{ backgroundColor: colors.border }}
                />
              )}
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.textSecondary, fontFamily: fonts.body }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
