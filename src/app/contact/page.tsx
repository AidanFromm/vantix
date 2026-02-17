'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, Calendar, Send, CheckCircle2, MapPin
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('vantix_leads') || '[]');
    existing.push({ ...form, timestamp: new Date().toISOString() });
    localStorage.setItem('vantix_leads', JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D2A26]">
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E8E2DA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Get in Touch
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }} className="text-lg text-[#8C857C] max-w-2xl mx-auto">
          Ready to explore what AI can do for your business? Reach out and we'll get back to you within 24 hours.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-3 rounded-2xl p-8 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-[#B8895A] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                <p className="text-[#8C857C]">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8E2DA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/30 transition-shadow"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8E2DA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/30 transition-shadow"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8E2DA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/30 transition-shadow"
                    placeholder="Your company (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8E2DA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/30 transition-shadow resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] transition-all"
                  style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
                >
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.15 } } }}
            className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
              <h3 className="font-bold mb-4">Contact Info</h3>
              <div className="space-y-4">
                <a href="tel:+19084987753" className="flex items-center gap-3 text-sm text-[#5C5650] hover:text-[#B8895A] transition-colors">
                  <Phone className="w-4 h-4 text-[#B8895A]" /> (908) 498-7753
                </a>
                <a href="mailto:hello@usevantix.com" className="flex items-center gap-3 text-sm text-[#5C5650] hover:text-[#B8895A] transition-colors">
                  <Mail className="w-4 h-4 text-[#B8895A]" /> hello@usevantix.com
                </a>
              </div>
            </div>
            <div className="rounded-2xl p-6 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
              <h3 className="font-bold mb-3">Book a Call</h3>
              <p className="text-sm text-[#8C857C] mb-4">Schedule a free 30-minute consultation to discuss your project.</p>
              <a
                href="https://calendly.com/usevantix/consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border border-[#E8E2DA] text-sm font-semibold shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#B8895A]" /> Open Calendly
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calendly Embed */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-6 text-center">Schedule a Consultation</h2>
          <div className="rounded-2xl overflow-hidden border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
            <iframe
              src="https://calendly.com/usevantix/consultation"
              width="100%"
              height="650"
              frameBorder="0"
              className="w-full"
            />
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[#E8E2DA] py-8 text-center text-sm text-[#8C857C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2D2A26] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2D2A26] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
