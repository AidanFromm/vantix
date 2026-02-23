'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import FloatingNav from '@/components/landing/FloatingNav';
import FooterSection from '@/components/landing/FooterSection';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Vantix Inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`);
    window.location.href = `mailto:usevantix@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    color: colors.text,
    fontFamily: fonts.body,
  };

  const focusClass = 'focus:outline-none focus:ring-2 focus:border-transparent';

  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <FloatingNav />

      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-center"
            style={{ fontFamily: fonts.display }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }}
            className="text-lg text-center max-w-xl mx-auto mb-16"
            style={{ color: colors.muted }}
          >
            Tell us what you&apos;re working with. We&apos;ll tell you what&apos;s possible.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-5"
            >
              {(['name', 'email', 'company'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1.5 capitalize" style={{ color: colors.muted }}>
                    {field}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    required={field !== 'company'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${focusClass}`}
                    style={{ ...inputStyle, ['--tw-ring-color' as string]: colors.bronze }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.muted }}>
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border resize-none ${focusClass}`}
                  style={{ ...inputStyle, ['--tw-ring-color' as string]: colors.bronze }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-full text-white font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: colors.bronze }}
              >
                {submitted ? 'Opening Email Client…' : 'Send Message'}
              </button>
            </motion.form>

            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.15 } } }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: fonts.display }}>
                  Direct Contact
                </h3>
                <div className="space-y-4">
                  <a href="mailto:usevantix@gmail.com" className="flex items-center gap-3 text-base transition-colors hover:opacity-80" style={{ color: colors.muted }}>
                    <Mail size={20} style={{ color: colors.bronze }} />
                    usevantix@gmail.com
                  </a>
                  <a href="tel:+19084987753" className="flex items-center gap-3 text-base transition-colors hover:opacity-80" style={{ color: colors.muted }}>
                    <Phone size={20} style={{ color: colors.bronze }} />
                    (908) 498-7753
                  </a>
                  <div className="flex items-center gap-3 text-base" style={{ color: colors.muted }}>
                    <MapPin size={20} style={{ color: colors.bronze }} />
                    Tampa, FL
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border" style={{ borderColor: colors.border, backgroundColor: colors.bgAlt }}>
                <h4 className="font-bold mb-2" style={{ fontFamily: fonts.display }}>
                  What happens next?
                </h4>
                <ol className="space-y-2 text-sm" style={{ color: colors.muted }}>
                  <li>1. You fill out the form — takes 2 minutes.</li>
                  <li>2. We review your info and do some homework.</li>
                  <li>3. We hop on a call, audit your setup, and show you where the leverage is.</li>
                </ol>
              </div>
            </motion.div>
          </div>

          {/* Book a call CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-16 text-center"
          >
            <p className="text-base mb-4" style={{ color: colors.muted }}>
              Prefer to just talk? Book a call instead.
            </p>
            <Link
              href="/#booking"
              className="inline-block px-8 py-4 rounded-full font-semibold text-base border-2 transition-all hover:opacity-80"
              style={{ borderColor: colors.bronze, color: colors.bronze }}
            >
              Book a Call →
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
