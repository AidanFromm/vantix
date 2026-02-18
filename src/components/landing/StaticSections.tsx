'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Globe,
  Star,
  MessageSquare,
  Paintbrush,
  Rocket,
  Code,
  ShoppingCart,
  Cpu,
  Building2,
  TrendingUp,
  Plug,
} from 'lucide-react';
import Link from 'next/link';
import { GlowCard } from '@/components/ui/3d-card';

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

export function Stats() {
  const stats = [
    { value: '100%', label: 'Custom Built' },
    { value: 'Fast', label: 'Turnaround' },
    { value: '24/7', label: 'Support Available' },
    { value: 'Global', label: 'Clients Welcome' },
  ];
  return (
    <section className="py-12 md:py-16 border-y border-[var(--color-border)] bg-[var(--color-card)]/30">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1">{s.value}</p>
                <p className="text-xs md:text-sm text-[var(--color-muted)] uppercase tracking-wider">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Problem() {
  const problems = [
    'You have a great idea but no digital presence to back it up',
    'Your website is outdated and not generating leads or revenue',
    'Manual processes are eating your time — nothing is automated',
    'You are scaling but your systems cannot keep up with growth',
  ];
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
        <div>
          <Reveal><p className="text-[#B0614A]/80 text-sm font-medium tracking-wider uppercase mb-4">The Problem</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 md:mb-8">
              Your business deserves better than duct-taped solutions.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="space-y-4 text-[var(--color-muted)]">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-3"><span className="text-[#B0614A] mt-1 flex-shrink-0">x</span>{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="flex flex-col justify-center">
          <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">The Solution</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 md:mb-8">
              A digital partner that builds what you actually need.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="space-y-4">
              {[
                'Custom websites and apps built for conversion',
                'Business automation that saves hours every week',
                'Scalable systems that grow with your company',
                'End-to-end support — strategy to launch and beyond',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-[var(--color-accent)] mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const services = [
    { icon: <Globe size={24} />, title: 'Custom Websites', desc: 'Beautiful, fast, SEO-optimized websites that convert visitors into customers. From landing pages to full platforms.' },
    { icon: <Code size={24} />, title: 'Web Applications', desc: 'Custom dashboards, portals, SaaS products, and internal tools built with modern technology.' },
    { icon: <Cpu size={24} />, title: 'Business Automation', desc: 'Automate repetitive tasks, workflows, and processes. Save hours every week and eliminate human error.' },
    { icon: <ShoppingCart size={24} />, title: 'E-Commerce', desc: 'Online stores that sell. Product catalogs, payment processing, inventory management, and more.' },
    { icon: <Rocket size={24} />, title: 'Startup Launch Packages', desc: 'Everything a new business needs: website, branding, automation, and go-to-market strategy.' },
    { icon: <Building2 size={24} />, title: 'Enterprise Solutions', desc: 'Full-scale digital transformation. Custom software, system integration, and scalable architecture.' },
    { icon: <TrendingUp size={24} />, title: 'SEO & Marketing', desc: 'Get found online. Search engine optimization, content strategy, and performance marketing.' },
    { icon: <Plug size={24} />, title: 'System Integration', desc: 'Connect your tools and platforms. CRM, ERP, payment systems, APIs — we make everything work together.' },
  ];
  return (
    <section id="services" className="py-20 md:py-32 px-6 md:px-12 lg:px-24 relative">
      <div className="max-w-6xl mx-auto">
        <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">What We Build</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Websites, apps, automation,<br /><span className="text-[var(--color-muted)]">systems — whatever you need.</span>
          </h2>
          <p className="text-lg text-[var(--color-muted)] mb-12 md:mb-16 max-w-2xl">From startup to enterprise — we scale with you.</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((f, i) => (
            <Reveal key={i} delay={0.2 + i * 0.06}>
              <GlowCard>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">{f.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{f.desc}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      best: 'Startups and small businesses getting online',
      features: ['Professional website (up to 5 pages)', 'Mobile responsive design', 'Contact forms & lead capture', 'Basic SEO setup', 'Google Business Profile optimization', '1 round of revisions', 'Launch in under 2 weeks'],
    },
    {
      name: 'Professional',
      best: 'Growing businesses that need custom solutions',
      popular: true,
      features: ['Everything in Starter, plus:', 'Custom web application or portal', 'Business process automation', 'E-commerce or booking system', 'Advanced SEO & analytics', 'CRM or tool integration', '3 rounds of revisions', 'Priority support'],
    },
    {
      name: 'Enterprise',
      best: 'Full-scale digital transformation',
      features: ['Everything in Professional, plus:', 'Custom software development', 'Multi-system integration', 'Scalable cloud architecture', 'Workflow automation suite', 'Dedicated project manager', 'Ongoing development & support', 'SLA-backed response times'],
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[var(--color-card)]/20 border-y border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">What We Offer</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Solutions for every stage of growth.</h2>
          <p className="text-xl md:text-2xl text-[var(--color-muted)] mb-4">Every business is different. We build custom solutions based on YOUR needs.</p>
          <p className="text-base text-[var(--color-muted)] mb-12 md:mb-16">Whether you are launching, growing, or scaling — we have a solution. Get a free consultation today.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
              <div className={`relative p-6 md:p-8 rounded-2xl border transition-colors h-full flex flex-col ${
                plan.popular
                  ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5'
                  : 'border-[var(--color-border)] bg-[var(--color-card)]/50 hover:border-[var(--color-accent)]/30'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-[var(--color-accent)] text-black text-xs font-semibold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-bold mb-4">{plan.name}</h3>
                <p className="text-sm text-[var(--color-muted)] mb-6 pb-6 border-b border-[var(--color-border)]">Best for: {plan.best}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-light)]'
                      : 'border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  Get Started
                </motion.a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.5}>
          <p className="text-center text-sm text-[var(--color-muted)] mt-8">Every project is custom-quoted based on your specific needs. Remote-first — we work with clients worldwide.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    { icon: <MessageSquare size={24} />, title: 'Discovery', desc: 'We learn your business, goals, and challenges. Every project starts with understanding.' },
    { icon: <Paintbrush size={24} />, title: 'Strategy & Design', desc: 'We map out the solution and create designs you review and refine.' },
    { icon: <Globe size={24} />, title: 'Build & Automate', desc: 'We develop your solution — website, app, automation, or all of the above.' },
    { icon: <Rocket size={24} />, title: 'Launch & Scale', desc: 'Your project goes live. We provide training, support, and ongoing optimization.' },
  ];
  return (
    <section id="process" className="py-20 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">How It Works</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16">
            From idea to launch.<br /><span className="text-[var(--color-muted)]">Fast, transparent, collaborative.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
              <div className="relative p-6 border border-[var(--color-border)] rounded-2xl bg-[var(--color-card)]/50 hover:border-[var(--color-accent)]/30 transition-colors h-full">
                <span className="text-5xl font-bold text-[var(--color-accent)]/10 absolute top-4 right-6">0{i + 1}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      quote: 'Vantix built our entire platform from scratch — website, customer portal, and automated onboarding. We launched in three weeks and have not looked back.',
      name: 'Alex R.',
      role: 'Founder, SaaS Startup',
    },
    {
      quote: 'Our e-commerce store was a mess. They rebuilt it, integrated our inventory system, and automated our fulfillment emails. Revenue is up 40% in two months.',
      name: 'Sarah L.',
      role: 'E-Commerce Business Owner',
    },
    {
      quote: 'We needed a digital transformation partner, not just a web designer. Vantix delivered a complete system — CRM integration, automated workflows, and a site that actually converts.',
      name: 'David K.',
      role: 'Operations Director, Enterprise Company',
    },
  ];
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[var(--color-card)]/20 border-y border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <Reveal><p className="text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">Testimonials</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16">
            Trusted by businesses<br /><span className="text-[var(--color-muted)]">around the world.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
              <div className="p-6 md:p-8 border border-[var(--color-border)] rounded-2xl bg-[var(--color-card)]/50 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-[var(--color-accent)] text-[var(--color-accent)]" />)}
                </div>
                <p className="text-[var(--color-muted)] leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-[var(--color-muted)]">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HiddenDashboardButton() {
  return (
    <Link
      href="/dashboard"
      className="fixed top-4 right-16 md:top-6 md:right-6 z-40 w-10 h-10 rounded-lg opacity-0 hover:opacity-100 hover:bg-[var(--color-accent)]/10 hover:border hover:border-[var(--color-accent)]/30 transition-all duration-300 flex items-center justify-center"
      title="Dashboard"
    >
      <ArrowUpRight size={16} className="text-[var(--color-accent)]" />
    </Link>
  );
}
