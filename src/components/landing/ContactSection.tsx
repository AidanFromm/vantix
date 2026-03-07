'use client';

import { motion } from 'framer-motion';
import { Phone, EnvelopeSimple } from '@phosphor-icons/react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32" style={{ backgroundColor: '#F3F0EB' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Let&apos;s Build Something Great
            </h2>
            <p className="text-lg text-[#6B6B6B] mb-10 max-w-md">
              Ready to elevate your brand? Tell us about your project and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#6B6B6B]">
                <Phone size={20} weight="light" className="text-[#B8935A]" />
                <span>(813) 555-0142</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B6B6B]">
                <EnvelopeSimple size={20} weight="light" className="text-[#B8935A]" />
                <span>hello@usevantix.com</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-5 py-3.5 rounded-xl bg-white border border-black/[0.06] text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-[#B8935A] transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-5 py-3.5 rounded-xl bg-white border border-black/[0.06] text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-[#B8935A] transition-colors"
            />
            <select
              className="w-full px-5 py-3.5 rounded-xl bg-white border border-black/[0.06] text-[#6B6B6B] focus:outline-none focus:border-[#B8935A] transition-colors"
              defaultValue=""
            >
              <option value="" disabled>Select a Service</option>
              <option>Web Design & Development</option>
              <option>AI Automation</option>
              <option>Brand Identity</option>
              <option>Growth & SEO</option>
            </select>
            <textarea
              placeholder="Tell us about your project..."
              rows={4}
              className="w-full px-5 py-3.5 rounded-xl bg-white border border-black/[0.06] text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:border-[#B8935A] transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-[#B8935A] hover:bg-[#A07D4A] text-white font-semibold rounded-xl transition-colors"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
