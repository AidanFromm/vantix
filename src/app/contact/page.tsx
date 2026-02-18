'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Phone, Mail, Calendar, Send, CheckCircle2, Clock, Zap
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const woodButtonStyle = {
  background: `repeating-linear-gradient(95deg, transparent, transparent 3px, rgba(139,90,43,0.04) 3px, rgba(139,90,43,0.04) 5px), repeating-linear-gradient(85deg, transparent, transparent 7px, rgba(160,120,60,0.03) 7px, rgba(160,120,60,0.03) 9px), linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878, #E6C78C)`,
  border: '1px solid rgba(139,90,43,0.2)',
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase, createLead } = await import('@/lib/supabase');
      try {
        await supabase.from('chat_leads').insert({
          visitor_name: form.name,
          email: form.email,
          phone: null,
          interested_in: form.message || null,
        });
      } catch { /* table may not exist */ }
      try {
        await createLead({
          name: form.name,
          email: form.email || undefined,
          source: 'Contact Page',
          status: 'new',
          notes: `Company: ${form.company || 'N/A'}\n${form.message}`,
          score: 0,
          tags: ['website-contact'],
        });
      } catch { /* table may not exist */ }
    } catch { /* supabase may not be configured */ }
    const existing = JSON.parse(localStorage.getItem('vantix_leads') || '[]');
    existing.push({ ...form, timestamp: new Date().toISOString() });
    localStorage.setItem('vantix_leads', JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F0DFD1] text-[#4A2112] scroll-smooth">
      <nav className="sticky top-0 z-50 bg-[#F0DFD1]/90 backdrop-blur-md border-b border-[#E0CCBA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#6B3A1F] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#6B3A1F] text-sm font-semibold uppercase tracking-widest mb-4">
          Let&apos;s Talk
        </motion.p>
        <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.05 } } }} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Stop Losing Time.<br />Start Automating This Week.
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }} className="text-lg text-[#8B6B56] max-w-2xl mx-auto">
          Tell us what&apos;s eating your time. We&apos;ll respond within 24 hours with a clear plan to fix it.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-3 rounded-2xl p-8 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-[#6B3A1F] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">You&apos;re In.</h3>
                <p className="text-[#8B6B56] mb-2">We&apos;ll respond within 24 hours with next steps.</p>
                <p className="text-[#8B6B56] text-sm">Check your inbox — or book a call below for faster turnaround.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-sm text-[#8B6B56] mb-2">Takes 60 seconds. No commitment required.</p>
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F0DFD1] border border-[#E0CCBA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6B3A1F]/30 focus:border-[#6B3A1F] transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F0DFD1] border border-[#E0CCBA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6B3A1F]/30 focus:border-[#6B3A1F] transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company <span className="text-[#C5C3BE]">(optional)</span></label>
                  <input
                    value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F0DFD1] border border-[#E0CCBA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6B3A1F]/30 focus:border-[#6B3A1F] transition-all"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">What&apos;s eating your time? *</label>
                  <textarea
                    required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F0DFD1] border border-[#E0CCBA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6B3A1F]/30 focus:border-[#6B3A1F] transition-all resize-none"
                    placeholder="Tell us about the manual tasks, bottlenecks, or goals you want to automate..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full group flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[inset_3px_3px_6px_#b8965f,inset_-3px_-3px_6px_#e8d4a8] transition-all"
                  style={woodButtonStyle}
                >
                  Start Automating This Week <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.15 } } }}
            className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
              <h3 className="font-bold mb-4">Direct Line</h3>
              <div className="space-y-4">
                <a href="tel:+19084987753" className="flex items-center gap-3 text-sm text-[#5C5650] hover:text-[#6B3A1F] transition-colors">
                  <Phone className="w-4 h-4 text-[#6B3A1F]" /> (908) 498-7753
                </a>
                <a href="mailto:hello@usevantix.com" className="flex items-center gap-3 text-sm text-[#5C5650] hover:text-[#6B3A1F] transition-colors">
                  <Mail className="w-4 h-4 text-[#6B3A1F]" /> hello@usevantix.com
                </a>
              </div>
            </div>
            <div className="rounded-2xl p-6 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
              <h3 className="font-bold mb-3">Skip the Form — Book a Call</h3>
              <p className="text-sm text-[#8B6B56] mb-4">30-minute free AI audit. We&apos;ll map your automation opportunities and show you projected ROI.</p>
              <a
                href="https://cal.com/vantix/ai-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border border-[#E0CCBA] text-sm font-semibold shadow-[4px_4px_10px_#d1cdc7,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:border-[#6B3A1F]/20 transition-all"
              >
                <Calendar className="w-4 h-4 text-[#6B3A1F]" /> Open Cal.com
              </a>
            </div>
            <div className="rounded-2xl p-6 bg-white border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
              <h3 className="font-bold mb-3">What Happens Next</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail, text: 'We respond within 24 hours' },
                  { icon: Clock, text: '30-min discovery call to understand your needs' },
                  { icon: Zap, text: 'Custom proposal with ROI projections' },
                ].map((step) => (
                  <div key={step.text} className="flex items-start gap-3 text-sm text-[#5C5650]">
                    <step.icon className="w-4 h-4 text-[#6B3A1F] mt-0.5 shrink-0" />
                    <span>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cal.com Embed */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-2 text-center">Prefer to Talk Live?</h2>
          <p className="text-[#8B6B56] text-center mb-6">Pick a time below. 30 minutes. Zero pressure. All value.</p>
          <div className="rounded-2xl overflow-hidden border border-[#E0CCBA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
            <iframe
              src="https://cal.com/vantix/ai-consultation"
              width="100%"
              height="650"
              frameBorder="0"
              className="w-full"
            />
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[#E0CCBA] py-8 text-center text-sm text-[#8B6B56]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#4A2112] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#4A2112] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

