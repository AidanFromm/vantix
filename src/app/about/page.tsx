'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Zap, Eye, Target, Lightbulb,
  Bot, Settings, Code, Clock, Shield
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};


const values = [
  { icon: Zap, title: 'Ship Fast, Ship Right', description: 'We built a 122-page platform in 3 weeks. Speed without sacrifice is our standard — not our exception.' },
  { icon: Eye, title: 'Radical Transparency', description: 'No black boxes. No surprise invoices. You see every step, every decision, every line of progress in real time.' },
  { icon: Target, title: 'Outcomes Over Output', description: 'We don\'t measure success by hours logged. We measure it by revenue generated, time saved, and costs eliminated.' },
  { icon: Shield, title: 'Own Everything', description: 'You own every line of code, every system, every asset. No vendor lock-in. No hostage situations. Ever.' },
];

const team = [
  { name: 'Kyle Ventura', role: 'Co-Founder · Operations & Strategy', icon: Settings, description: 'Kyle doesn\'t just plan AI strategies — he obsesses over your P&L until AI is making you money. Drives client relationships, scopes every project, and won\'t sign off until the ROI is undeniable. Background in business operations and a genuine obsession with making things work better.' },
  { name: 'Aidan Fromm', role: 'Co-Founder · Engineering & Design', icon: Code, description: 'Aidan turns "that sounds impossible" into "it shipped Tuesday." Architects and builds every technical solution from full-stack applications to deep AI integrations. Built a complete e-commerce platform in 3 weeks. When he\'s not coding, he\'s coding something else.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] scroll-smooth">
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-[#8E5E34] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/#booking"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#8E5E34] shadow-sm hover:shadow-inner transition-all"
            
          >
            Work With Us
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#8E5E34] text-sm font-semibold uppercase tracking-widest mb-4">
          About Vantix
        </motion.p>
        <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.05 } } }} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          A 4-Person Team.<br />Half of Us Never Sleep.
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }} className="text-lg text-[#7A746C] max-w-2xl mx-auto">
          2 humans who obsess over your success. 2 AI assistants who build around the clock. Small enough to care. Powerful enough to deliver enterprise results.
        </motion.p>
      </section>

      {/* Origin Story */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Why We Exist</h2>
          <div className="space-y-4 text-[#4B4B4B] leading-relaxed">
            <p>We started Vantix because we watched business after business get sold overpriced AI "consulting" that never actually shipped anything. Decks without deployments. Strategies without systems. Six-figure invoices for PowerPoints.</p>
            <p><strong className="text-[#1C1C1C]">We decided to be the opposite.</strong> No theory. No fluff. We build AI systems that are live in weeks and generating ROI from day one.</p>
            <p>Our unfair advantage? Half our team is AI. Two AI assistants work alongside us 24/7 — researching, building, testing, optimizing — while our competitors&apos; teams are asleep. That&apos;s how we built a 122-page e-commerce platform in 3 weeks. That&apos;s how we deliver what agencies 10x our size can&apos;t.</p>
          </div>
        </motion.div>
      </section>

      {/* Human Team */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-2xl font-bold mb-8 text-center">
          The Humans
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {team.map((m, i) => (
            <motion.div key={m.name} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="rounded-2xl p-8 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm hover:border-[#8E5E34]/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-[#F4EFE8] shadow-sm flex items-center justify-center mb-5">
                <m.icon className="w-7 h-7 text-[#8E5E34]" />
              </div>
              <h3 className="text-xl font-bold">{m.name}</h3>
              <p className="text-sm text-[#8E5E34] font-medium mb-3">{m.role}</p>
              <p className="text-[#7A746C] text-sm leading-relaxed">{m.description}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Team */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#EEE6DC] border border-[#8E5E34]/20 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="w-14 h-14 rounded-xl bg-[#F4EFE8] shadow-sm flex items-center justify-center mb-5 mx-auto md:mx-0">
                <Bot className="w-7 h-7 text-[#8E5E34]" />
              </div>
              <h3 className="text-xl font-bold mb-2">The AI Team Members</h3>
              <p className="text-[#8E5E34] text-sm font-medium mb-4">The Half That Never Sleeps</p>
              <p className="text-[#7A746C] leading-relaxed">
                This isn&apos;t a gimmick. Our 2 AI assistants are full team members. They research technologies, generate and review code, run tests, draft documentation, and optimize systems — 24 hours a day, 7 days a week, 365 days a year.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Code, text: 'Code generation, review, and testing around the clock' },
                { icon: Target, text: 'Research and identify the best tools for every project' },
                { icon: Clock, text: 'Work continues while humans sleep — deadlines crushed' },
                { icon: Lightbulb, text: 'Continuous optimization of deployed systems' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-[#8E5E34] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#4B4B4B]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-2xl font-bold mb-8 text-center">
          What We Stand For
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.08 } } }}
              className="rounded-2xl p-6 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm hover:border-[#8E5E34]/20 transition-all">
              <v.icon className="w-6 h-6 text-[#8E5E34] mb-3" />
              <h3 className="font-bold mb-1">{v.title}</h3>
              <p className="text-sm text-[#7A746C] leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-12 bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to See What 4 of Us Can Do?</h2>
          <p className="text-[#7A746C] mb-8 max-w-lg mx-auto">
            We take on 3 new clients per month. If you&apos;re serious about automating your business, let&apos;s talk before the spots fill.
          </p>
          <Link
            href="/#booking"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#8E5E34] font-semibold rounded-full shadow-sm hover:shadow-inner transition-all"
            
          >
            Book Your Free AI Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

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