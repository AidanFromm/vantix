'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Phone, Check, ArrowUpRight, Globe, Smartphone, Package, Zap, Bot, Code, Rocket, Shield, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect, FlipWords } from '@/components/ui/text-generate-effect';
import { GradientOrbs, GradientMesh } from '@/components/ui/aurora-background';
import { GlowCard } from '@/components/ui/3d-card';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { AnimatedCounter, StatsSection } from '@/components/ui/animated-counter';
import { Particles, GridBackground } from '@/components/ui/particles';

// Smooth reveal animation wrapper
function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Animated link with arrow
function AnimatedLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      className="group inline-flex items-center gap-3 text-lg font-medium"
      whileHover={{ x: 5 }}
    >
      <span className="relative overflow-hidden">
        <span className="block">{children}</span>
        <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-[var(--color-accent)] transition-transform group-hover:scale-x-100" />
      </span>
      <ArrowRight className="transition-transform group-hover:translate-x-2" size={20} />
    </motion.a>
  );
}

// Hero Section with Aurora + Particles
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const flipWords = ['Websites', 'Apps', 'Systems', 'Solutions'];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background layers */}
      <GradientOrbs className="opacity-60" />
      <GridBackground className="opacity-30" />
      <Particles quantity={40} color="#10b981" speed={0.3} size={2} />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#10b981" />
      
      <motion.div 
        style={{ opacity, scale, y }} 
        className="relative z-10 max-w-6xl px-6 md:px-12 lg:px-24"
      >
        <RevealText>
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2 text-sm text-[var(--color-accent)] mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Now Accepting New Clients
          </motion.div>
        </RevealText>

        <RevealText delay={0.1}>
          <h1 className="text-5xl md:text-7xl lg:text-[100px] font-bold leading-[0.95] tracking-tight mb-8">
            We Build
            <br />
            <span className="gradient-text">
              <FlipWords words={flipWords} className="gradient-text" />
            </span>
            <br />
            <span className="text-[var(--color-muted)]">That Work</span>
          </h1>
        </RevealText>

        <RevealText delay={0.2}>
          <p className="text-xl md:text-2xl text-[var(--color-muted)] max-w-xl leading-relaxed mb-12">
            Your business deserves systems that actually make sense. 
            Modern websites, powerful apps, inventory that syncs — all built exactly for how you work.
          </p>
        </RevealText>

        <RevealText delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-accent-light)] transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Project
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.a>
            <motion.a
              href="#work"
              className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-8 py-4 rounded-xl font-medium text-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              whileHover={{ scale: 1.02 }}
            >
              See Our Work
            </motion.a>
          </div>
        </RevealText>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-6 md:left-12 lg:left-24 flex items-center gap-4"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[var(--color-muted)] rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
        </motion.div>
        <span className="text-xs text-[var(--color-muted)] tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}

// Stats Marquee
function StatsMarquee() {
  const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '3', label: 'Week Turnaround' },
    { value: '100%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <section className="py-16 border-y border-[var(--color-border)] overflow-hidden">
      <motion.div 
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...stats, ...stats, ...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-4xl md:text-5xl font-bold gradient-text">{stat.value}</span>
            <span className="text-[var(--color-muted)] text-sm uppercase tracking-wider">{stat.label}</span>
            <span className="text-[var(--color-accent)] mx-8">•</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// Services Bento Grid
function Services() {
  const services = [
    {
      icon: <Globe size={24} />,
      title: 'Websites',
      description: 'Fast, modern, SEO-optimized. Built to convert visitors into customers.',
      className: 'md:col-span-2',
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Mobile Apps',
      description: 'Native iOS apps that work offline and sync perfectly.',
    },
    {
      icon: <Package size={24} />,
      title: 'Inventory Systems',
      description: 'Scan, track, and sync across all your sales channels.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Integrations',
      description: 'Stripe, Clover, StockX, Shopify — we connect everything.',
    },
    {
      icon: <Bot size={24} />,
      title: 'AI Automation',
      description: 'Chatbots and automation that work while you sleep.',
      className: 'md:col-span-2',
    },
  ];

  return (
    <section id="services" className="py-32 px-6 md:px-12 lg:px-24 relative">
      <GridBackground className="opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            What We Build
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-4xl md:text-6xl font-bold mb-16">
            Everything you need.<br />
            <span className="text-[var(--color-muted)]">Nothing you don't.</span>
          </h2>
        </RevealText>

        <BentoGrid className="md:grid-cols-3">
          {services.map((service, i) => (
            <BentoGridItem
              key={i}
              icon={service.icon}
              title={service.title}
              description={service.description}
              className={service.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

// Problem / Solution Section
function ProblemSolution() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <RevealText>
            <p className="text-red-400/80 text-sm font-medium tracking-wider uppercase mb-4">
              The Problem
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
              Your systems are scattered. Growth feels impossible.
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <ul className="space-y-4 text-[var(--color-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-red-400">✕</span>
                Tracking inventory in spreadsheets
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400">✕</span>
                Website looks like it's from 2010
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400">✕</span>
                Systems that don't talk to each other
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400">✕</span>
                Spending hours on manual tasks
              </li>
            </ul>
          </RevealText>
        </div>

        <div className="flex flex-col justify-center">
          <RevealText>
            <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
              The Solution
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
              One team. Everything connected.
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                <span>Real-time inventory across all channels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                <span>Modern website that converts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                <span>Everything synced automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                <span>Automation that saves hours daily</span>
              </li>
            </ul>
          </RevealText>
        </div>
      </div>
    </section>
  );
}

// Why Choose Us
function WhyUs() {
  const points = [
    { icon: <Clock size={20} />, title: 'Under 3 Weeks', desc: 'Most projects delivered in weeks, not months.' },
    { icon: <DollarSign size={20} />, title: 'Affordable', desc: 'Agency quality without the agency price tag.' },
    { icon: <Shield size={20} />, title: 'Reliable', desc: 'We deliver what we promise. Every time.' },
    { icon: <Rocket size={20} />, title: 'Modern Tech', desc: 'Built with the latest, fastest technologies.' },
  ];

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <GradientMesh className="opacity-30" />
      <div className="max-w-6xl mx-auto relative z-10">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            Why Vantix
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-4xl md:text-6xl font-bold mb-16">
            We're not a big agency.<br />
            <span className="text-[var(--color-muted)]">That's the point.</span>
          </h2>
        </RevealText>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, i) => (
            <RevealText key={i} delay={0.2 + i * 0.1}>
              <GlowCard>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                <p className="text-[var(--color-muted)] text-sm">{point.desc}</p>
              </GlowCard>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonial
function Testimonial() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)] relative overflow-hidden">
      <Particles quantity={20} color="#10b981" speed={0.2} interactive={false} />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <RevealText>
          <div className="text-6xl mb-8">"</div>
        </RevealText>
        <RevealText delay={0.1}>
          <p className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-12">
            You just saved my company.
          </p>
        </RevealText>
        <RevealText delay={0.2}>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)]" />
            <div className="text-left">
              <p className="font-semibold">Dave</p>
              <p className="text-sm text-[var(--color-muted)]">Secured Tampa</p>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  );
}

// Team Section
function Team() {
  const founders = [
    { name: 'Aidan', role: 'Co-Founder', emoji: '👨‍💻' },
    { name: 'Kyle', role: 'Co-Founder', emoji: '🚀' },
  ];
  
  const bots = [
    { name: 'Vantix Bot #1', role: '24/7 Employee', emoji: '🤖' },
    { name: 'Vantix Bot #2', role: '24/7 Employee', emoji: '🤖' },
  ];

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            The Team
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Small team. Big results.
          </h2>
        </RevealText>
        <RevealText delay={0.15}>
          <p className="text-xl text-[var(--color-muted)] mb-16 max-w-2xl">
            Two founders who handle everything — plus AI teammates that never sleep.
          </p>
        </RevealText>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {founders.map((member, i) => (
            <RevealText key={i} delay={0.2 + i * 0.1}>
              <GlowCard className="flex items-center gap-6">
                <div className="text-4xl">{member.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-[var(--color-muted)]">{member.role}</p>
                </div>
              </GlowCard>
            </RevealText>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {bots.map((bot, i) => (
            <RevealText key={i} delay={0.4 + i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-8 border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 rounded-2xl flex items-center gap-6"
              >
                <div className="text-4xl">{bot.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold">{bot.name}</h3>
                  <p className="text-[var(--color-accent)]">{bot.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center gap-2 text-xs text-[var(--color-accent)]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    </span>
                    Online
                  </span>
                </div>
              </motion.div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function Contact() {
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
        body: JSON.stringify({ 
          phone, 
          businessType: 'direct',
          message: 'Phone inquiry from landing page' 
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)] relative overflow-hidden">
      <GradientOrbs className="opacity-40" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <RevealText>
              <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
                Let's Talk
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                Ready to get organized?
              </h2>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-xl text-[var(--color-muted)] mb-8">
                Drop your number. We'll text you within 24 hours to discuss your project.
              </p>
              <p className="text-[var(--color-muted)]">
                Or email us at <a href="mailto:usevantix@gmail.com" className="text-[var(--color-accent)] hover:underline">usevantix@gmail.com</a>
              </p>
            </RevealText>
          </div>

          <div className="flex items-center">
            {submitted ? (
              <RevealText>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full p-8 border border-[var(--color-accent)] rounded-2xl bg-[var(--color-accent)]/5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                    >
                      <Check size={24} className="text-black" />
                    </motion.div>
                    <div>
                      <p className="text-xl font-bold">Got it!</p>
                      <p className="text-[var(--color-muted)]">We'll be in touch soon.</p>
                    </div>
                  </div>
                </motion.div>
              </RevealText>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <RevealText delay={0.3}>
                  <div className="relative mb-4">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-4 pl-12 pr-4 text-lg focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </RevealText>
                <RevealText delay={0.4}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[var(--color-accent)] text-black py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Get in touch
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </RevealText>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.p 
          className="text-2xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          Vantix
        </motion.p>
        <div className="flex items-center gap-8">
          <a href="#" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">
            Twitter
          </a>
          <a href="#" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">
            Instagram
          </a>
          <a href="#" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">
            LinkedIn
          </a>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-[var(--color-muted)] text-sm">© 2026 Vantix</p>
          <Link href="/dashboard" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">
            Team →
          </Link>
        </div>
      </div>
    </footer>
  );
}

// Hidden dashboard button
function HiddenDashboardButton() {
  return (
    <Link
      href="/dashboard"
      className="fixed top-6 right-6 z-50 w-10 h-10 rounded-lg opacity-0 hover:opacity-100 hover:bg-[var(--color-accent)]/10 hover:border hover:border-[var(--color-accent)]/30 transition-all duration-300 flex items-center justify-center"
      title="Dashboard"
    >
      <ArrowUpRight size={16} className="text-[var(--color-accent)]" />
    </Link>
  );
}

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <HiddenDashboardButton />
      <Hero />
      <StatsMarquee />
      <Services />
      <ProblemSolution />
      <WhyUs />
      <Testimonial />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
