'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowRight,
  Phone,
  Mail,
  Check,
  ChevronDown,
} from 'lucide-react';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FAQ() {
  const faqs = [
    { q: 'What types of businesses do you work with?', a: 'Everyone from solo founders launching their first startup to established enterprises needing digital transformation. We work with startups, small businesses, e-commerce brands, and large companies worldwide.' },
    { q: 'Do you only build websites?', a: 'No. We build websites, web applications, e-commerce stores, business automation systems, custom software, and more. If your business needs it digitally, we can build it.' },
    { q: 'How long does a typical project take?', a: 'Simple websites launch in 1-2 weeks. Custom applications and automation projects typically take 4-8 weeks. Enterprise solutions vary — we scope every project individually.' },
    { q: 'Do you work with clients outside the US?', a: 'Absolutely. We are a remote-first team and work with clients worldwide. Time zones are never an issue — we adapt to your schedule.' },
    { q: 'What about ongoing support?', a: 'Every project includes post-launch support. We also offer ongoing retainer plans for businesses that need continuous development, maintenance, and optimization.' },
    { q: 'How much does a project cost?', a: 'Every project is custom-quoted based on scope and complexity. Simple websites start in the low thousands. Contact us for a free consultation and detailed quote.' },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">FAQ</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 md:mb-16">Common questions.</h2>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={0.15 + i * 0.05}>
              <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-[var(--color-card)]/50 transition-colors"
                >
                  <span className="font-semibold text-base md:text-lg pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={20} className="text-[var(--color-muted)] flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 md:px-6 pb-5 md:pb-6 text-[var(--color-muted)] leading-relaxed">{faq.a}</p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'landing-page' }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      window.location.href = `mailto:usevantix@gmail.com?subject=Project%20Inquiry&body=${encodeURIComponent(formData.message || 'I am interested in working with Vantix.')}`;
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 70% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">Let&apos;s Build Something Great</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
                Ready to take your business to the next level?
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl text-[var(--color-muted)] mb-8">
                Tell us about your project. Free consultation, no commitment — just a conversation about what is possible.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="space-y-4">
                <a href="tel:9084987753" className="flex items-center gap-3 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  <Phone size={20} className="text-[var(--color-accent)]" />
                  (908) 498-7753
                </a>
                <a href="mailto:usevantix@gmail.com" className="flex items-center gap-3 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  <Mail size={20} className="text-[var(--color-accent)]" />
                  usevantix@gmail.com
                </a>
              </div>
            </Reveal>
          </div>

          <div className="flex items-center">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full p-6 md:p-8 border border-[var(--color-accent)] rounded-2xl bg-[var(--color-accent)]/5"
              >
                <div className="flex items-center gap-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                    <Check size={24} className="text-black" />
                  </motion.div>
                  <div>
                    <p className="text-xl font-bold">Request received</p>
                    <p className="text-[var(--color-muted)]">We will be in touch within 24 hours.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <Reveal delay={0.25}>
                  <input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-base focus:border-[var(--color-accent)] transition-colors" />
                </Reveal>
                <Reveal delay={0.3}>
                  <input type="tel" required placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-base focus:border-[var(--color-accent)] transition-colors" />
                </Reveal>
                <Reveal delay={0.35}>
                  <input type="email" placeholder="Email (optional)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-base focus:border-[var(--color-accent)] transition-colors" />
                </Reveal>
                <Reveal delay={0.4}>
                  <textarea placeholder="Tell us about your project" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 text-base focus:border-[var(--color-accent)] transition-colors resize-none" />
                </Reveal>
                <Reveal delay={0.45}>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-[var(--color-accent)] text-black py-3.5 rounded-xl font-semibold text-base hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                    ) : (
                      <>Start My Project <ArrowRight size={20} /></>
                    )}
                  </motion.button>
                </Reveal>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
