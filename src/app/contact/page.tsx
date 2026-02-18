'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Phone, Mail, Calendar, CheckCircle2, Clock, Zap
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch { /* best effort */ }
    const existing = JSON.parse(localStorage.getItem('vantix_leads') || '[]');
    existing.push({ ...form, timestamp: new Date().toISOString() });
    localStorage.setItem('vantix_leads', JSON.stringify(existing));
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45] transition-all text-[#1C1C1C] placeholder-[#A39B90]";

  return (
    <div className="min-h-screen text-[#1C1C1C]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-nav.png" alt="Vantix" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-[#B07A45] tracking-tight">vantix<span className="text-[#8E5E34]">.</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-[#7A746C] hover:text-[#B07A45] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#B07A45] text-sm font-semibold uppercase tracking-widest mb-4">
          Let&apos;s Talk
        </motion.p>
        <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.05 } } }} className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1C1C1C]">
          Stop Losing Time.<br />Start Automating This Week.
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }} className="text-lg text-[#7A746C] max-w-2xl mx-auto">
          Tell us what&apos;s eating your time. We&apos;ll respond within 24 hours with a clear plan to fix it.
        </motion.p>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-3 rounded-2xl p-8 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-[#B07A45] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">You&apos;re In.</h3>
                <p className="text-[#7A746C] mb-2">We&apos;ll respond within 24 hours with next steps.</p>
                <p className="text-[#7A746C] text-sm">Check your inbox — or book a call below for faster turnaround.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-sm text-[#7A746C] mb-2">Takes 60 seconds. No commitment required.</p>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4B4B4B]">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4B4B4B]">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4B4B4B]">Company <span className="text-[#A39B90]">(optional)</span></label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} placeholder="Your company" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4B4B4B]">What&apos;s eating your time? *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass + " resize-none"} placeholder="Tell us about the manual tasks, bottlenecks, or goals you want to automate..." />
                </div>
                <button type="submit" className="w-full bronze-btn text-white font-semibold rounded-full px-8 py-4 shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  Start Automating This Week <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.15 } } }}
            className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
              <h3 className="font-bold mb-4 text-[#1C1C1C]">Direct Line</h3>
              <div className="space-y-4">
                <a href="tel:+19084987753" className="flex items-center gap-3 text-sm text-[#4B4B4B] hover:text-[#B07A45] transition-colors">
                  <Phone className="w-4 h-4 text-[#B07A45]" /> (908) 498-7753
                </a>
                <a href="mailto:hello@usevantix.com" className="flex items-center gap-3 text-sm text-[#4B4B4B] hover:text-[#B07A45] transition-colors">
                  <Mail className="w-4 h-4 text-[#B07A45]" /> hello@usevantix.com
                </a>
              </div>
            </div>
            <div className="rounded-2xl p-6 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
              <h3 className="font-bold mb-3 text-[#1C1C1C]">Skip the Form — Book a Call</h3>
              <p className="text-sm text-[#7A746C] mb-4">30-minute free AI audit. We&apos;ll map your automation opportunities and show you projected ROI.</p>
              <a href="/#booking" className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border border-[#D8C2A8] text-sm font-semibold text-[#1C1C1C] hover:bg-[#E6DED3] transition-all">
                <Calendar className="w-4 h-4 text-[#B07A45]" /> Book a Call
              </a>
            </div>
            <div className="rounded-2xl p-6 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
              <h3 className="font-bold mb-3 text-[#1C1C1C]">What Happens Next</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail, text: 'We respond within 24 hours' },
                  { icon: Clock, text: '30-min discovery call to understand your needs' },
                  { icon: Zap, text: 'Custom proposal with ROI projections' },
                ].map((step) => (
                  <div key={step.text} className="flex items-start gap-3 text-sm text-[#4B4B4B]">
                    <step.icon className="w-4 h-4 text-[#B07A45] mt-0.5 shrink-0" />
                    <span>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E3D9CD] py-8 text-center text-sm text-[#7A746C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#1C1C1C] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1C1C1C] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
