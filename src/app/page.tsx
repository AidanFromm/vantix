'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Globe, Smartphone, Package, Sparkles, ArrowRight, Check, Mail, User, MessageSquare } from 'lucide-react';
import { brand } from '@/lib/brand';
import Link from 'next/link';

const iconMap = {
  Globe,
  Smartphone,
  Package,
  Sparkles,
};

// Hero Section
function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            Build{' '}
            <span className="gradient-text">Digital</span>
            <br />
            Excellence
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10"
        >
          {brand.description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-8 py-4 rounded-lg font-medium transition-all hover:scale-105"
          >
            Start Your Project
            <ArrowRight size={20} />
          </a>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[var(--color-border)] hover:border-[var(--color-muted)] px-8 py-4 rounded-lg font-medium transition-all"
          >
            Team Dashboard
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-[var(--color-border)] rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Problem Section
function Problem() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
  
  return (
    <section ref={ref} className="min-h-screen flex items-center py-32">
      <motion.div style={{ opacity, y }} className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            The Problem with
            <br />
            <span className="text-[var(--color-muted)]">Generic Solutions</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { title: 'Templates', desc: "Cookie-cutter designs that don't represent your brand" },
              { title: 'Limitations', desc: "Off-the-shelf software that can't do what you need" },
              { title: 'Integration', desc: "Systems that don't talk to each other" },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-[var(--color-border)] rounded-xl bg-[var(--color-card)]">
                <div className="text-4xl font-bold text-[var(--color-accent)] mb-4">{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[var(--color-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Solution Section
function Solution() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
  
  return (
    <section ref={ref} className="min-h-screen flex items-center py-32">
      <motion.div style={{ opacity, y }} className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            <span className="gradient-text">Vantix</span> is Different
          </h2>
          <p className="text-xl text-[var(--color-muted)] mb-16">
            Everything we build is 100% custom. Tailored to your business, your workflow, your vision.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              'Custom-designed, not templated',
              'Built for your specific needs',
              'Seamless integrations',
              'Scalable architecture',
              'Ongoing support & updates',
              'Full ownership of your code',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg">
                <Check className="text-[var(--color-accent)] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Services Section
function Services() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  return (
    <section ref={ref} className="py-32">
      <motion.div style={{ opacity }} className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          What We Build
        </h2>
        <p className="text-[var(--color-muted)] text-center mb-16 max-w-2xl mx-auto">
          From simple landing pages to complex enterprise systems — if you can dream it, we can build it.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brand.services.map((service, i) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-[var(--color-border)] rounded-xl bg-[var(--color-card)] hover:border-[var(--color-accent)] transition-colors group"
              >
                <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                  <Icon className="text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-[var(--color-muted)] text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// Team Section
function Team() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          The Team
        </h2>
        <p className="text-[var(--color-muted)] text-center mb-16">
          Small team. Big results.
        </p>
        
        <div className="flex justify-center gap-8">
          {brand.team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
                {member.emoji}
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-[var(--color-muted)] text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook up to Supabase
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };
  
  return (
    <section id="contact" className="py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            Let&apos;s Build Something
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-12">
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 border border-[var(--color-accent)] rounded-xl bg-[var(--color-accent)]/5"
            >
              <Check className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-[var(--color-muted)]">We&apos;ll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tell us about your project</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-[var(--color-muted)]" size={20} />
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                    placeholder="What do you want to build?"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-4 rounded-lg font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="container mx-auto px-6 text-center text-[var(--color-muted)]">
        <p>© {new Date().getFullYear()} Vantix. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <Services />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
