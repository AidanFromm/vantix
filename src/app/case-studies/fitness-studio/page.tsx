'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, Dumbbell, Globe, Clock, TrendingUp,
  Calendar, Users, Smartphone, Shield, CheckCircle2, Star,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stats = [
  { label: 'Membership Growth', value: '150%', icon: TrendingUp },
  { label: 'Classes Per Week', value: '45+', icon: Calendar },
  { label: 'Build Time', value: '4 Weeks', icon: Clock },
  { label: 'Member Rating', value: '4.9★', icon: Star },
];

const techStack = [
  'Next.js', 'Supabase', 'Stripe Subscriptions', 'Tailwind CSS', 'Resend', 'Cal.com API',
];

export default function FitnessCaseStudyPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] scroll-smooth">
      <nav className="sticky top-0 z-50 bg-[#F4EFE8]/90 backdrop-blur-md border-b border-[#E3D9CD]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/case-studies" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Case Studies
          </Link>
          <Link
            href="/#booking"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#8E5E34] shadow-sm hover:shadow-sm transition-all"
            style={{ background: 'linear-gradient(to right, #C89A6A, #C89A6A)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#F4EFE8] shadow-sm flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-[#8E5E34]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8E5E34] uppercase tracking-wider">Health & Fitness</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Boutique Fitness Studio</h1>
            </div>
          </div>
          <p className="text-lg text-[#7A746C] max-w-2xl leading-relaxed">
            A growing boutique fitness studio was managing class bookings through phone calls,
            DMs, and a shared spreadsheet. Members had no way to track their progress, manage
            their membership, or book classes on their own time. The studio needed a modern
            digital experience to match the quality of their in-person classes.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="rounded-xl p-5 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm text-center"
            >
              <stat.icon className="w-5 h-5 text-[#8E5E34] mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-[#7A746C] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenge */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
          <div className="rounded-2xl p-8 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm space-y-4 text-[#7A746C] leading-relaxed">
            <p>
              The studio owner was spending 15+ hours per week on administrative tasks that had nothing
              to do with coaching. Booking confirmations, cancellation management, membership renewals,
              and waitlist coordination were all handled manually — often via text message.
            </p>
            <p>
              No-shows were a persistent problem. Without automated reminders, 20% of booked spots
              went unused. Meanwhile, interested prospects had no easy way to sign up — the studio
              was turning away potential members simply because the onboarding process was too friction-heavy.
            </p>
            <p>
              The owner knew that a professional booking system and member portal would unlock growth,
              but off-the-shelf fitness software was either too expensive ($300+/month), too generic,
              or required members to download yet another app.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Solution */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Calendar, title: 'Smart Booking System', desc: 'Real-time class scheduling with automatic waitlists, cancellation backfills, and capacity management — no phone calls needed.' },
              { icon: Users, title: 'Member Portal', desc: 'A personalized dashboard where members can view their class history, manage their subscription, and track attendance streaks.' },
              { icon: Smartphone, title: 'Automated Communications', desc: 'Booking confirmations, 24-hour reminders, and post-class follow-ups sent automatically via email and SMS.' },
              { icon: Shield, title: 'Subscription Management', desc: 'Stripe-powered recurring billing with automatic renewals, failed payment recovery, and easy plan upgrades.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-6 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm">
                <item.icon className="w-6 h-6 text-[#8E5E34] mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[#7A746C] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">The Results</h2>
          <div className="rounded-2xl p-8 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm space-y-3">
            {[
              'Active memberships grew by 150% within 8 months of launch',
              'No-show rate dropped from 20% to under 5% with automated reminders',
              'Admin time reduced from 15+ hours per week to under 3 hours',
              'Average class fill rate increased from 65% to 92%',
              'Member retention improved by 35% with the loyalty and progress tracking features',
              'New member onboarding time dropped from 2 days to under 5 minutes',
            ].map((result) => (
              <div key={result} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8E5E34] shrink-0 mt-0.5" />
                <p className="text-[#7A746C] leading-relaxed">{result}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full border border-[#E3D9CD] text-sm text-[#7A746C] bg-[#F4EFE8] shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="rounded-2xl p-10 bg-[#F4EFE8] border border-[#E3D9CD] shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to modernize your fitness business?</h2>
            <p className="text-[#7A746C] mb-6 max-w-lg mx-auto">
              Let&apos;s build a booking and member management system that grows with your studio.
            </p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium shadow-sm transition-colors"
              style={{ background: 'linear-gradient(to right, #8E5E34, #B07A45)' }}
            >
              Book a Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
