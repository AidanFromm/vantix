// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Globe,
  Phone,
  Mail,
  Clock,
  Github,
  Calendar,
  Send,
  Target,
  Handshake,
  Heart,
  Trophy,
  Users,
  Code2,
  Rocket,
} from 'lucide-react';
import { useState } from 'react';

// ============================================
// METADATA (exported from layout or head)
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <StatsSection />
      <TeamSection />
      <ValuesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-white font-semibold text-lg">Vantix</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Home
          </Link>
          <Link href="/about" className="text-emerald-400 text-sm font-medium">
            About
          </Link>
          <Link
            href="https://calendly.com/usevantix/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// HERO
// ============================================
function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-4"
          >
            About Vantix
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            We&apos;re not a factory.{' '}
            <span className="text-emerald-400">We&apos;re builders.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Two founders. One mission. We started Vantix because we were tired of seeing
            businesses get overcharged for mediocre digital work. So we built something different.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Based in New Jersey</span>
            <span className="mx-2">·</span>
            <Globe className="w-4 h-4" />
            <span>Serving clients worldwide</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// MISSION
// ============================================
function MissionSection() {
  return (
    <section className="py-20 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Our mission is simple
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-gray-400 text-lg leading-relaxed mb-4"
            >
              Make professional digital solutions accessible to businesses of all sizes, anywhere
              in the world. No bloated contracts, no mystery pricing, no disappearing after launch.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-gray-400 text-lg leading-relaxed"
            >
              We believe great software shouldn&apos;t be a luxury. Whether you&apos;re a local shop or a
              growing startup, you deserve the same quality of work that Fortune 500 companies get
              &mdash; without the Fortune 500 price tag.
            </motion.p>
          </div>
          <motion.div
            variants={fadeUp}
            custom={2}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-8"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real results, not deliverables</h3>
                  <p className="text-gray-500 text-sm">
                    We measure success by what your software actually does for your business.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Partners, not vendors</h3>
                  <p className="text-gray-500 text-sm">
                    We stick around after launch. Your growth is our growth.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Honest from day one</h3>
                  <p className="text-gray-500 text-sm">
                    Transparent pricing. Clear timelines. No surprises.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// STATS
// ============================================
function StatsSection() {
  const stats = [
    { value: '1', label: 'Client Launched', icon: Rocket },
    { value: '200+', label: 'Features Built', icon: Code2 },
    { value: '24/7', label: 'Availability', icon: Clock },
    { value: 'Global', label: 'Service Reach', icon: Globe },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TEAM
// ============================================
function TeamSection() {
  const team = [
    {
      initials: 'KV',
      name: 'Kyle Ventura',
      role: 'Co-Founder, Business & Operations',
      bio: 'Drives client relationships, strategy, and business development. Makes sure every project delivers real value and stays on track.',
    },
    {
      initials: 'AF',
      name: 'Aidan Fromm',
      role: 'Co-Founder, Technical Lead',
      bio: 'Architects and builds the systems that power our clients\' businesses. Obsessed with clean code, performance, and getting the details right.',
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-3">
              The Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Small team. Big output.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              We keep our team lean on purpose. Every project gets our full attention.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i + 1}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                  <span className="text-emerald-400 font-bold text-xl">{member.initials}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-emerald-400 text-sm font-medium mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// VALUES
// ============================================
function ValuesSection() {
  const values = [
    {
      icon: Trophy,
      title: 'Quality over quantity',
      desc: 'We take on fewer projects so every one gets our best work. No assembly lines here.',
    },
    {
      icon: Handshake,
      title: 'Honest pricing',
      desc: 'You\'ll know exactly what you\'re paying for before we write a single line of code.',
    },
    {
      icon: Users,
      title: 'Long-term partnerships',
      desc: 'We don\'t just build and bounce. We\'re in it for the long haul with every client.',
    },
    {
      icon: Target,
      title: 'Real results',
      desc: 'Pretty designs are nice. Software that grows your business is better.',
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Our values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                custom={i + 1}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT
// ============================================
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="py-20 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <p className="text-emerald-400 font-medium text-sm tracking-wide uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s build something together
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Have a project in mind? We&apos;d love to hear about it. Reach out and let&apos;s talk.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={fadeUp} custom={1} className="space-y-8">
              <div className="space-y-6">
                <a
                  href="tel:+19084987753"
                  className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-white">(908) 498-7753</p>
                  </div>
                </a>

                <a
                  href="mailto:usevantix@gmail.com"
                  className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-white">usevantix@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hours</p>
                    <p className="font-medium text-white">Mon &ndash; Sun (we&apos;re always building)</p>
                  </div>
                </div>

                <a
                  href="https://github.com/usevantix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Github className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GitHub</p>
                    <p className="font-medium text-white">github.com/usevantix</p>
                  </div>
                </a>
              </div>

              <a
                href="https://calendly.com/usevantix/consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeUp} custom={2}>
              <form
                onSubmit={handleSubmit}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5"
              >
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
                </button>
                {status === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    Something went wrong. Try emailing us directly.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Vantix LLC. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <a
            href="https://calendly.com/usevantix/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Book a Call
          </a>
        </div>
      </div>
    </footer>
  );
}
