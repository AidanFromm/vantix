'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Phone, Check, ArrowUpRight, Globe, Smartphone, Package, Zap, Bot, Clock, DollarSign, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect, FlipWords } from '@/components/ui/text-generate-effect';
import { GlowCard } from '@/components/ui/3d-card';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

// Smooth reveal animation wrapper
function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Hero Section - Clean, mobile-optimized
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Only use parallax on desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  const flipWords = ['Websites', 'Apps', 'Systems', 'Solutions'];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Simple gradient background - better performance on mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
        }}
      />
      
      {/* Spotlight only on desktop */}
      <div className="hidden md:block">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#10b981" />
      </div>
      
      <motion.div 
        style={isMobile ? {} : { opacity, y }} 
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24 w-full"
      >
        <RevealText>
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2 text-sm text-[var(--color-accent)] mb-6 md:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Now Accepting New Clients
          </motion.div>
        </RevealText>

        <RevealText delay={0.1}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[90px] font-bold leading-[1.05] tracking-tight mb-6 md:mb-8">
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
          <p className="text-lg md:text-xl lg:text-2xl text-[var(--color-muted)] max-w-xl leading-relaxed mb-8 md:mb-12">
            Your business deserves systems that actually make sense. 
            Modern websites, powerful apps, inventory that syncs — all built exactly for how you work.
          </p>
        </RevealText>

        <RevealText delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all active:scale-95"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Project
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.a>
            <motion.a
              href="#work"
              className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-medium text-base md:text-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              whileHover={{ scale: 1.02 }}
            >
              See Our Work
            </motion.a>
          </div>
        </RevealText>
      </motion.div>
    </section>
  );
}

// Stats Section - Clean horizontal layout
function Stats() {
  const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '3', label: 'Week Turnaround' },
    { value: '100%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <section className="py-12 md:py-16 border-y border-[var(--color-border)] bg-[var(--color-card)]/30">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <RevealText key={i} delay={i * 0.1}>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-[var(--color-muted)] uppercase tracking-wider">{stat.label}</p>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
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
    <section id="services" className="py-20 md:py-32 px-6 md:px-12 lg:px-24 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            What We Build
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16">
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
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
        <div>
          <RevealText>
            <p className="text-red-400/80 text-sm font-medium tracking-wider uppercase mb-4">
              The Problem
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 md:mb-8">
              Your systems are scattered. Growth feels impossible.
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <ul className="space-y-3 md:space-y-4 text-[var(--color-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">×</span>
                Tracking inventory in spreadsheets
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">×</span>
                Website looks like it's from 2010
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">×</span>
                Systems that don't talk to each other
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">×</span>
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
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 md:mb-8">
              One team. Everything connected.
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3">
                <Check size={18} className="text-[var(--color-accent)] mt-1 flex-shrink-0" />
                <span>Real-time inventory across all channels</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-[var(--color-accent)] mt-1 flex-shrink-0" />
                <span>Modern website that converts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-[var(--color-accent)] mt-1 flex-shrink-0" />
                <span>Everything synced automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-[var(--color-accent)] mt-1 flex-shrink-0" />
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
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden bg-[var(--color-card)]/20">
      <div className="max-w-6xl mx-auto relative z-10">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            Why Vantix
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16">
            We're not a big agency.<br />
            <span className="text-[var(--color-muted)]">That's the point.</span>
          </h2>
        </RevealText>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {points.map((point, i) => (
            <RevealText key={i} delay={0.2 + i * 0.1}>
              <GlowCard>
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">
                  {point.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{point.title}</h3>
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
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <RevealText>
          <div className="text-5xl md:text-6xl text-[var(--color-accent)] mb-6 md:mb-8">"</div>
        </RevealText>
        <RevealText delay={0.1}>
          <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 md:mb-12">
            You just saved my company.
          </p>
        </RevealText>
        <RevealText delay={0.2}>
          <div className="flex items-center justify-center gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)]" />
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

// Team Section - Professional with photo placeholders
function Team() {
  const founders = [
    { 
      name: 'Aidan Fromm', 
      role: 'Co-Founder & Technical Lead',
      bio: 'Full-stack developer focused on building systems that scale.',
      image: '/team/aidan.jpg' // Placeholder - needs photo upload
    },
    { 
      name: 'Kyle', 
      role: 'Co-Founder & Business Development',
      bio: 'Business strategist with expertise in retail and wholesale.',
      image: '/team/kyle.jpg' // Placeholder - needs photo upload
    },
  ];

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
            The Team
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Small team. Big results.
          </h2>
        </RevealText>
        <RevealText delay={0.15}>
          <p className="text-lg md:text-xl text-[var(--color-muted)] mb-12 md:mb-16 max-w-2xl">
            Two founders who handle everything — with AI-powered tools that multiply our output.
          </p>
        </RevealText>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {founders.map((member, i) => (
            <RevealText key={i} delay={0.2 + i * 0.1}>
              <div className="p-6 md:p-8 border border-[var(--color-border)] rounded-2xl bg-[var(--color-card)]/50 hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="flex items-start gap-4 md:gap-6">
                  {/* Photo placeholder - will show initials if no photo */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-[var(--color-accent)]">
                      {member.name.charAt(0)}
                    </span>
                    {/* Uncomment when photos are added:
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-[var(--color-accent)] text-sm md:text-base mb-2">{member.role}</p>
                    <p className="text-[var(--color-muted)] text-sm">{member.bio}</p>
                  </div>
                </div>
              </div>
            </RevealText>
          ))}
        </div>

        {/* AI-powered note - cleaner than showing robot emojis */}
        <RevealText delay={0.4}>
          <div className="mt-8 md:mt-12 p-4 md:p-6 border border-[var(--color-accent)]/20 rounded-xl bg-[var(--color-accent)]/5 text-center">
            <p className="text-sm md:text-base text-[var(--color-muted)]">
              <span className="text-[var(--color-accent)] font-medium">Powered by AI</span> — Our automated systems work around the clock, so you get faster delivery and 24/7 support.
            </p>
          </div>
        </RevealText>
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
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)] relative overflow-hidden">
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <RevealText>
              <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
                Let's Talk
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
                Ready to get organized?
              </h2>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-lg md:text-xl text-[var(--color-muted)] mb-6 md:mb-8">
                Drop your number. We'll text you within 24 hours to discuss your project.
              </p>
              <p className="text-[var(--color-muted)]">
                Or email us at{' '}
                <a href="mailto:usevantix@gmail.com" className="text-[var(--color-accent)] hover:underline">
                  usevantix@gmail.com
                </a>
              </p>
            </RevealText>
          </div>

          <div className="flex items-center">
            {submitted ? (
              <RevealText>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full p-6 md:p-8 border border-[var(--color-accent)] rounded-2xl bg-[var(--color-accent)]/5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                    >
                      <Check size={24} className="text-black" />
                    </motion.div>
                    <div>
                      <p className="text-lg md:text-xl font-bold">Got it!</p>
                      <p className="text-[var(--color-muted)] text-sm md:text-base">We'll be in touch soon.</p>
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
                      className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl py-3.5 md:py-4 pl-12 pr-4 text-base md:text-lg focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                    />
                  </div>
                </RevealText>
                <RevealText delay={0.4}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[var(--color-accent)] text-black py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
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
    <footer className="py-8 md:py-12 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.p 
          className="text-xl md:text-2xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          Vantix
        </motion.p>
        <div className="flex items-center gap-6 md:gap-8">
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
        <div className="flex items-center gap-4 md:gap-6">
          <p className="text-[var(--color-muted)] text-sm">© 2026 Vantix</p>
          <Link href="/dashboard" className="text-[var(--color-muted)] hover:text-white transition-colors text-sm">
            Team
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
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 rounded-lg opacity-0 hover:opacity-100 hover:bg-[var(--color-accent)]/10 hover:border hover:border-[var(--color-accent)]/30 transition-all duration-300 flex items-center justify-center"
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
      <Stats />
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
