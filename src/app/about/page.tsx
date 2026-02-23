'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import FloatingNav from '@/components/landing/FloatingNav';
import FooterSection from '@/components/landing/FooterSection';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease } },
};

const values = [
  {
    title: 'Build > Talk',
    description:
      'We don\'t pitch decks for months. We audit, scope, build, and deliver. You\'ll see working software before most agencies finish their discovery phase.',
  },
  {
    title: 'Speed Matters',
    description:
      'We stay lean, move fast, and deliver more per dollar than agencies three times our size. Our AI agents handle the rest.',
  },
  {
    title: 'Your Business First',
    description:
      'We don\'t build technology for its own sake. We build it because your margins depend on it, your team\'s time is finite, and your competitors are already figuring this out.',
  },
];

const team = [
  {
    name: 'Kyle Ventura',
    role: 'Co-Founder',
    bio: 'Builder. Systems thinker. Runs operations and client delivery.',
    photo: '/team/kyle.jpg',
  },
  {
    name: 'Aidan Fromm',
    role: 'Co-Founder',
    bio: 'Creative strategist. Handles design, marketing, and client relationships.',
    photo: '/team/aidan.jpg',
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <FloatingNav />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-36">
        <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-5 sm:px-6 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            style={{ fontFamily: fonts.display }}
          >
            We&apos;re Vantix.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.15 } } }}
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: colors.muted }}
          >
            An AI consulting and infrastructure agency building the systems that make businesses faster, leaner, and harder to compete with.
          </motion.p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28" style={{ backgroundColor: colors.bgAlt }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-lg sm:text-xl leading-relaxed mb-6" style={{ color: colors.muted }}>
              Started in 2025 by two friends who got tired of watching businesses burn money on problems AI already solved.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: colors.muted }}>
              Aidan — the engineer — was spending nights building data pipelines and AI systems, watching companies pay six figures for solutions he could ship in weeks. Kyle — the operator — kept running into the same story from business owners: &quot;We know AI can help, but every vendor wants to sell us a product, not solve our problem.&quot;
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: colors.muted }}>
              So they teamed up. One builds the systems. The other speaks both languages — yours and ours. Together, they started Vantix with a simple thesis: start with the business, not the tech stack. Audit how you actually operate, find the highest-leverage opportunities, and build custom infrastructure that makes you faster.
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: colors.muted }}>
              No off-the-shelf products. No dashboards you&apos;ll never check. Just systems that work — and numbers that follow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-14"
            style={{ fontFamily: fonts.display }}
          >
            What We Believe
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
                className="rounded-2xl p-8 border-2"
                style={{ borderColor: colors.bronze, backgroundColor: colors.bg }}
              >
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: fonts.display, color: colors.bronze }}>
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28" style={{ backgroundColor: colors.bgAlt }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-14"
            style={{ fontFamily: fonts.display }}
          >
            Who We Are
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.12 } } }}
                className="text-center"
              >
                <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-2" style={{ borderColor: colors.border }}>
                  <Image src={m.photo} alt={m.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: fonts.display }}>{m.name}</h3>
                <p className="text-sm mb-2" style={{ color: colors.bronze }}>{m.role}</p>
                <p className="text-sm" style={{ color: colors.muted }}>{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto px-5 sm:px-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: fonts.display }}>
            Ready to build something?
          </h2>
          <p className="text-base mb-8" style={{ color: colors.muted }}>
            Book a free audit call and we&apos;ll map your biggest opportunities in 30 minutes.
          </p>
          <Link
            href="/#booking"
            className="inline-block px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:opacity-90"
            style={{ backgroundColor: colors.bronze }}
          >
            Talk to Our Team →
          </Link>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
}
