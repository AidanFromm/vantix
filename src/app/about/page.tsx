'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Zap, Eye, Target, Lightbulb,
  Users, Bot, Phone, Calendar, Settings, Code
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const values = [
  { icon: Zap, title: 'Speed', description: 'We ship fast. Most projects go from concept to deployment in weeks, not months.' },
  { icon: Eye, title: 'Transparency', description: 'No black boxes. You see every step, every decision, every line of progress.' },
  { icon: Target, title: 'Results-Driven', description: 'We measure success by impact — revenue generated, time saved, costs cut.' },
  { icon: Lightbulb, title: 'Innovation', description: 'We stay on the cutting edge so you don\'t have to. New tools, new methods, better outcomes.' },
];

const team = [
  { name: 'Kyle', role: 'Co-founder, Operations & Strategy', icon: Settings, description: 'Drives client relationships, business strategy, and ensures every project delivers measurable ROI.' },
  { name: 'Aidan', role: 'Co-founder, Engineering & Design', icon: Code, description: 'Architects and builds the technical solutions — from full-stack applications to AI integrations.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D2A26]">
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E8E2DA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#5C4033] shadow-[4px_4px_10px_#c8c4be,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] transition-all"
            style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
          >
            Get in Touch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          About Vantix
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }} className="text-lg text-[#8C857C] max-w-2xl mx-auto">
          Founded by two builders who believe AI should work for you, not the other way around.
        </motion.p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 md:p-10 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-[#5C5650] leading-relaxed">
            We exist to bring AI-first automation to businesses worldwide. Not theoretical AI — practical, deployed systems that generate revenue, cut costs, and scale operations. We handle strategy, implementation, and ongoing support so our clients can focus on what they do best.
          </p>
        </motion.div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-2xl font-bold mb-8 text-center">
          The Team
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {team.map((m, i) => (
            <motion.div key={m.name} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="rounded-2xl p-8 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
              <div className="w-14 h-14 rounded-xl bg-[#FAFAFA] shadow-[inset_4px_4px_8px_#d1cdc7,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-5">
                <m.icon className="w-7 h-7 text-[#B8895A]" />
              </div>
              <h3 className="text-xl font-bold">{m.name}</h3>
              <p className="text-sm text-[#B8895A] font-medium mb-3">{m.role}</p>
              <p className="text-[#8C857C] text-sm leading-relaxed">{m.description}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Team */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-8 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] text-center">
          <div className="w-14 h-14 rounded-xl bg-[#FAFAFA] shadow-[inset_4px_4px_8px_#d1cdc7,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-5 mx-auto">
            <Bot className="w-7 h-7 text-[#B8895A]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our AI Team</h3>
          <p className="text-[#8C857C] max-w-lg mx-auto leading-relaxed">
            Our team includes 2 AI assistants that work 24/7 — building, researching, and optimizing while you sleep. They handle research, code generation, testing, and continuous improvement so we can deliver faster than teams 10x our size.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-2xl font-bold mb-8 text-center">
          Our Values
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.08 } } }}
              className="rounded-2xl p-6 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]">
              <v.icon className="w-6 h-6 text-[#B8895A] mb-3" />
              <h3 className="font-bold mb-1">{v.title}</h3>
              <p className="text-sm text-[#8C857C] leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-2xl p-12 bg-[#FAFAFA] border border-[#E8E2DA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]">
          <h2 className="text-3xl font-bold mb-4">Let's Build Something Together</h2>
          <p className="text-[#8C857C] mb-8 max-w-lg mx-auto">
            Ready to see what AI can do for your business? Let's talk.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] transition-all"
            style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-[#E8E2DA] py-8 text-center text-sm text-[#8C857C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2D2A26] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2D2A26] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
