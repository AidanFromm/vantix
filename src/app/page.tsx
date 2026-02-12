'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Phone, Check, Globe, Smartphone, Package, Zap, Bot } from 'lucide-react';
import Link from 'next/link';

// Simple fade animation
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================
// HERO - Clean, focused, no distracting animations
// ============================================================
function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
        }}
      />
      
      <div className="relative z-10 max-w-4xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2 text-sm text-[var(--color-accent)] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          Now Accepting Clients
        </motion.div>

        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          We build websites<br />
          <span className="text-[var(--color-muted)]">and systems that work.</span>
        </motion.h1>

        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed mb-10"
        >
          Modern websites, mobile apps, inventory systems. 
          Built fast, priced fair, delivered on time.
        </motion.p>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Start a Project
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-8 py-4 rounded-xl font-medium text-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            What We Do
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES - Clean grid, no bento complexity
// ============================================================
function Services() {
  const services = [
    {
      icon: <Globe size={24} />,
      title: 'Websites',
      description: 'Fast, modern, SEO-optimized sites that convert visitors into customers.',
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Mobile Apps',
      description: 'Native iOS apps that work offline and sync with your systems.',
    },
    {
      icon: <Package size={24} />,
      title: 'Inventory',
      description: 'Real-time tracking across all sales channels. Scan, sync, sell.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Integrations',
      description: 'Connect Stripe, Clover, StockX, Shopify — everything talks.',
    },
    {
      icon: <Bot size={24} />,
      title: 'Automation',
      description: 'Bots and workflows that handle the repetitive stuff.',
    },
  ];

  return (
    <section id="services" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            Services
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16">
            What we build.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 border border-[var(--color-border)] rounded-xl bg-[var(--color-card)]/50 hover:border-[var(--color-accent)]/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-[var(--color-muted)] text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT + CONTACT - Combined, clean
// ============================================================
function AboutContact() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, source: 'landing' }),
      });
      if (res.ok) setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* About */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
              About Us
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Small team.<br />Big results.
            </h2>
            <p className="text-[var(--color-muted)] text-lg leading-relaxed mb-8">
              We're Aidan and Kyle — two founders who handle everything. 
              No bloated agency overhead, no endless meetings. 
              Just fast delivery and fair prices.
            </p>
            
            <div className="space-y-4 text-[var(--color-muted)]">
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[var(--color-accent)]" />
                <span>Under 3 weeks delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[var(--color-accent)]" />
                <span>Affordable pricing</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-[var(--color-accent)]" />
                <span>24/7 support</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
              <p className="text-[var(--color-muted)] mb-6">
                Drop your number. We'll text you within 24 hours.
              </p>

              {submitted ? (
                <div className="p-6 border border-[var(--color-accent)] rounded-xl bg-[var(--color-accent)]/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                      <Check size={20} className="text-black" />
                    </div>
                    <div>
                      <p className="font-semibold">Got it!</p>
                      <p className="text-[var(--color-muted)] text-sm">We'll be in touch soon.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-4 pl-12 pr-4 text-lg focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--color-accent)] text-black py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Get in touch
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[var(--color-muted)] text-sm mt-4">
                Or email{' '}
                <a href="mailto:usevantix@gmail.com" className="text-[var(--color-accent)] hover:underline">
                  usevantix@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER - Minimal
// ============================================================
function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xl font-bold gradient-text">Vantix</p>
        <p className="text-[var(--color-muted)] text-sm">© 2026 Vantix</p>
        <Link href="/login" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">
          Team Login
        </Link>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <Hero />
      <Services />
      <AboutContact />
      <Footer />
    </main>
  );
}
