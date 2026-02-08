'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Phone, Check, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Cursor glow that follows mouse
function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      className="cursor-glow hidden md:block"
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}

// Smooth reveal text
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

// Marquee component
function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Hero
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center relative px-6 md:px-12 lg:px-24">
      <motion.div style={{ opacity, scale, y }} className="max-w-6xl">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm md:text-base font-medium tracking-wider uppercase mb-6">
            Digital Solutions
          </p>
        </RevealText>

        <RevealText delay={0.1}>
          <h1 className="text-5xl md:text-7xl lg:text-[120px] font-bold leading-[0.9] tracking-tight mb-8">
            Get
            <br />
            <span className="gradient-text">Organized</span>
          </h1>
        </RevealText>

        <RevealText delay={0.2}>
          <p className="text-xl md:text-2xl text-[var(--color-muted)] max-w-xl leading-relaxed mb-12">
            We build the systems that let you focus on what matters. 
            Websites. Apps. Inventory. All connected. All automated.
          </p>
        </RevealText>

        <RevealText delay={0.3}>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-lg font-medium"
          >
            <span className="line-reveal">Let's talk</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
          </a>
        </RevealText>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-6 md:left-12 lg:left-24"
      >
        <p className="text-xs text-[var(--color-muted)] tracking-widest uppercase">Scroll</p>
      </motion.div>
    </section>
  );
}

// Marquee Section
function MarqueeSection() {
  return (
    <section className="py-12 border-y border-[var(--color-border)]">
      <Marquee speed={40}>
        <span className="text-4xl md:text-6xl font-bold text-[var(--color-muted)] mx-8">
          Websites
        </span>
        <span className="text-[var(--color-accent)] mx-4">•</span>
        <span className="text-4xl md:text-6xl font-bold text-[var(--color-muted)] mx-8">
          Apps
        </span>
        <span className="text-[var(--color-accent)] mx-4">•</span>
        <span className="text-4xl md:text-6xl font-bold text-[var(--color-muted)] mx-8">
          Inventory Systems
        </span>
        <span className="text-[var(--color-accent)] mx-4">•</span>
        <span className="text-4xl md:text-6xl font-bold text-[var(--color-muted)] mx-8">
          Integrations
        </span>
        <span className="text-[var(--color-accent)] mx-4">•</span>
        <span className="text-4xl md:text-6xl font-bold text-[var(--color-muted)] mx-8">
          Automation
        </span>
        <span className="text-[var(--color-accent)] mx-4">•</span>
      </Marquee>
    </section>
  );
}

// About / Value Prop
function About() {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <RevealText>
            <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-6">
              The Problem
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Your systems are scattered. Your data is everywhere. Growth feels impossible.
            </h2>
          </RevealText>
        </div>

        <div className="flex flex-col justify-end">
          <RevealText delay={0.2}>
            <p className="text-xl text-[var(--color-muted)] leading-relaxed mb-8">
              We've seen it a hundred times. Sneaker stores tracking inventory in spreadsheets. 
              Businesses with websites that look like 2010. Systems that don't talk to each other.
            </p>
          </RevealText>
          <RevealText delay={0.3}>
            <p className="text-xl leading-relaxed">
              <span className="text-[var(--color-accent)]">Vantix fixes that.</span> One system. 
              Everything connected. Built exactly for how you work.
            </p>
          </RevealText>
        </div>
      </div>
    </section>
  );
}

// What We Do
function Services() {
  const services = [
    { num: '01', title: 'Websites', desc: 'Fast, modern, built to convert. No templates.' },
    { num: '02', title: 'Mobile Apps', desc: 'iOS apps that work offline and sync perfectly.' },
    { num: '03', title: 'Inventory Systems', desc: 'Scan, track, sync across all your channels.' },
    { num: '04', title: 'Integrations', desc: 'Stripe, Clover, StockX — we connect everything.' },
    { num: '05', title: 'Automation', desc: 'Bots that work while you sleep.' },
  ];

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-6">
            What We Build
          </p>
        </RevealText>

        <div className="mt-16 space-y-0">
          {services.map((service, i) => (
            <RevealText key={i} delay={i * 0.1}>
              <div className="group py-8 border-b border-[var(--color-border)] flex items-start md:items-center justify-between gap-6 cursor-pointer hover:pl-4 transition-all">
                <div className="flex items-start md:items-center gap-6 md:gap-12">
                  <span className="text-sm text-[var(--color-muted)]">{service.num}</span>
                  <h3 className="text-2xl md:text-4xl font-bold group-hover:text-[var(--color-accent)] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-[var(--color-muted)] text-right md:text-left max-w-xs hidden md:block">
                  {service.desc}
                </p>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Us
function WhyUs() {
  const points = [
    { title: 'Under 3 weeks', desc: 'Most projects delivered in weeks, not months.' },
    { title: 'Affordable', desc: 'Agency quality without the agency price tag.' },
    { title: 'Reliable', desc: 'We deliver what we promise. Every time.' },
  ];

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-6">
            Why Vantix
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-16">
            We're not a big agency. That's the point.
          </h2>
        </RevealText>

        <div className="grid md:grid-cols-3 gap-12">
          {points.map((point, i) => (
            <RevealText key={i} delay={0.2 + i * 0.1}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                    <Check size={16} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold">{point.title}</h3>
                </div>
                <p className="text-[var(--color-muted)]">{point.desc}</p>
              </div>
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
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto text-center">
        <RevealText>
          <p className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-12">
            "You just saved my company."
          </p>
        </RevealText>
        <RevealText delay={0.2}>
          <p className="text-[var(--color-muted)]">
            — Dave, Secured Tampa
          </p>
        </RevealText>
      </div>
    </section>
  );
}

// Team
function Team() {
  const founders = [
    { name: 'Aidan', role: 'Co-Founder' },
    { name: 'Kyle', role: 'Co-Founder' },
  ];
  
  const bots = [
    { name: 'Vantix Bot #1', role: '24/7 Employee' },
    { name: 'Vantix Bot #2', role: '24/7 Employee' },
  ];

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <RevealText>
          <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-6">
            The Team
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Small team. Big results.
          </h2>
        </RevealText>
        <RevealText delay={0.15}>
          <p className="text-[var(--color-muted)] text-xl mb-16 max-w-2xl">
            We work together on everything. No silos, no handoffs — just two founders who get things done.
          </p>
        </RevealText>

        {/* Founders */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {founders.map((member, i) => (
            <RevealText key={i} delay={0.2 + i * 0.1}>
              <div className="p-8 border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-accent)] transition-colors">
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-[var(--color-muted)]">{member.role}</p>
              </div>
            </RevealText>
          ))}
        </div>

        {/* Bots */}
        <div className="grid md:grid-cols-2 gap-8">
          {bots.map((bot, i) => (
            <RevealText key={i} delay={0.4 + i * 0.1}>
              <div className="p-8 border border-[var(--color-border)] rounded-2xl bg-[var(--color-accent)]/5 hover:border-[var(--color-accent)] transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-2xl font-bold">{bot.name}</h3>
                </div>
                <p className="text-[var(--color-accent)]">{bot.role}</p>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact
function Contact() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <section id="contact" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <RevealText>
              <p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-6">
                Contact
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                Ready to get organized?
              </h2>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-xl text-[var(--color-muted)]">
                Drop your number. We'll text you within 24 hours.
              </p>
            </RevealText>
          </div>

          <div className="flex items-center">
            {submitted ? (
              <RevealText>
                <div className="w-full p-8 border border-[var(--color-accent)] rounded-2xl bg-[var(--color-accent)]/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                      <Check size={20} className="text-black" />
                    </div>
                    <p className="text-xl font-bold">Got it!</p>
                  </div>
                  <p className="text-[var(--color-muted)]">We'll be in touch soon.</p>
                </div>
              </RevealText>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <RevealText delay={0.3}>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full bg-transparent border border-[var(--color-border)] rounded-xl py-4 pl-12 pr-4 text-lg focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </RevealText>
                <RevealText delay={0.4}>
                  <button
                    type="submit"
                    className="mt-4 w-full bg-[var(--color-accent)] text-black py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2"
                  >
                    Get in touch
                    <ArrowRight size={20} />
                  </button>
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
        <p className="text-2xl font-bold gradient-text">Vantix</p>
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

export default function Home() {
  return (
    <main className="relative">
      <CursorGlow />
      <Hero />
      <MarqueeSection />
      <About />
      <Services />
      <WhyUs />
      <Testimonial />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
