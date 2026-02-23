'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FloatingNav from '@/components/landing/FloatingNav';
import FooterSection from '@/components/landing/FooterSection';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const projects = [
  {
    slug: 'secured-tampa',
    title: 'Secured Tampa',
    tags: ['E-commerce', 'AI Chatbot', 'Automation'],
    image: '/case-secured.jpg',
    description:
      'A sneaker and Pokémon retail operation buried in manual work. We rebuilt the website with real-time inventory sync, deployed an AI chatbot, and automated order processing.',
    stats: ['42% less time on ops', '3x faster response', '28% sales increase'],
  },
  {
    slug: 'just-four-kicks',
    title: 'Just Four Kicks',
    tags: ['Wholesale', 'Data Pipeline', 'Dashboard'],
    image: '/case-j4k.jpg',
    description:
      'A $5.8M sneaker wholesale business running on duct tape. We built a centralized operations layer with automated pricing sync, real-time dashboards, and intelligent order routing.',
    stats: ['60% faster processing', '$43K saved annually', 'Real-time visibility'],
  },
  {
    slug: 'cardledger',
    title: 'CardLedger',
    tags: ['Web App', 'SaaS', 'AI'],
    image: '/case-cardledger.jpg',
    description:
      'From concept to product with a waitlist. A portfolio tracker for collectible card investors — designed, architected, and built from scratch in under 8 weeks.',
    stats: ['8-week build', '500+ beta signups', '4.8/5 rating'],
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <FloatingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 text-center">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
            style={{ fontFamily: fonts.display }}
          >
            Our Work
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.12 } } }}
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: colors.muted }}
          >
            Real projects. Real results. Here&apos;s what we&apos;ve built.
          </motion.p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
            >
              <Link href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 border" style={{ borderColor: colors.border }}>
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ borderColor: colors.border, color: colors.muted }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity" style={{ fontFamily: fonts.display }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: colors.muted }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  {p.stats.map((stat) => (
                    <span key={stat} className="text-xs font-semibold" style={{ color: colors.bronze }}>
                      {stat}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ backgroundColor: colors.bgAlt }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto px-5 sm:px-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: fonts.display }}>
            Your project could be next.
          </h2>
          <p className="text-base mb-8" style={{ color: colors.muted }}>
            Book a free audit and let&apos;s see what we can build together.
          </p>
          <Link
            href="/#booking"
            className="inline-block px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:opacity-90"
            style={{ backgroundColor: colors.bronze }}
          >
            See What&apos;s Possible →
          </Link>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
}
