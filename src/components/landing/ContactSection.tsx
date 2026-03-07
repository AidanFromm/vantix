'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Envelope, Phone } from '@phosphor-icons/react';
import { colors, fonts } from '@/lib/design-tokens';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Let&apos;s talk about what you&apos;re building next.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg mb-12 text-center"
          style={{ color: colors.textSecondary, fontFamily: fonts.body }}
        >
          Every great project starts with a conversation.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-colors duration-200 focus:border-[#B8935A50]"
              style={{
                backgroundColor: colors.bgCard,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                fontFamily: fonts.body,
              }}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-colors duration-200 focus:border-[#B8935A50]"
              style={{
                backgroundColor: colors.bgCard,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                fontFamily: fonts.body,
              }}
            />
          </div>
          <select
            className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-colors duration-200"
            style={{
              backgroundColor: colors.bgCard,
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
              fontFamily: fonts.body,
            }}
          >
            <option value="">Where do you want to start?</option>
            <option value="web">Web Design & Development</option>
            <option value="ai">AI Automation</option>
            <option value="brand">Brand Identity</option>
            <option value="growth">Growth & SEO</option>
            <option value="full">Full Package</option>
          </select>
          <textarea
            placeholder="Tell us about your project..."
            rows={5}
            className="w-full px-5 py-4 rounded-xl text-sm outline-none resize-none transition-colors duration-200 focus:border-[#B8935A50]"
            style={{
              backgroundColor: colors.bgCard,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              fontFamily: fonts.body,
            }}
          />
          <button
            type="submit"
            className="w-full py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:brightness-110"
            style={{
              backgroundColor: colors.bronze,
              color: colors.bg,
              fontFamily: fonts.body,
            }}
          >
            {submitted ? 'Message Sent!' : 'Send Message'}
          </button>
        </motion.form>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
          <a href="tel:+19084987753" className="flex items-center gap-2 hover:text-[#B8935A] transition-colors">
            <Phone size={18} weight="light" color={colors.bronze} />
            (908) 498-7753
          </a>
          <a href="mailto:usevantix@gmail.com" className="flex items-center gap-2 hover:text-[#B8935A] transition-colors">
            <Envelope size={18} weight="light" color={colors.bronze} />
            usevantix@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
