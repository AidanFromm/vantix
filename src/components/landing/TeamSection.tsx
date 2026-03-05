'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const team = [
  {
    name: 'Aidan Fromm',
    role: 'Co-founder & Tech Lead',
    bio: '19. CU Denver. Fell into coding through a business class and never looked back. Builds the systems that make everything else possible.',
    photo: '/team/aidan.jpg',
  },
  {
    name: 'Kyle',
    role: 'Co-founder & CEO, Just Four Kicks',
    bio: '20. Built a $5.8M sneaker business before he could legally drink. Understands operations from the warehouse floor up.',
    photo: '/team/kyle.jpg',
  },
];

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-28 lg:py-36" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.bronze }}
            >
              Who We Are
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Built by founders who ship,{' '}
            <br className="hidden sm:block" />
            <span style={{ color: colors.bronze }}>not consultants who talk.</span>
          </h2>
        </motion.div>

        {/* Brand accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="flex justify-center mb-16"
        >
          <Image
            src="/media-assets/images/vantix-brand.png"
            alt="Vantix"
            width={120}
            height={120}
            className="rounded-2xl opacity-80"
            loading="lazy"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease }}
              className="group rounded-3xl p-9 border transition-all duration-300 md:hover:-translate-y-2 cursor-default"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${colors.bronze}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${colors.bronze}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div
                className="w-20 h-20 rounded-full overflow-hidden mb-7"
                style={{ border: `2px solid ${colors.bronze}30` }}
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                {member.name}
              </h3>
              <p
                className="text-sm font-semibold mb-5"
                style={{ fontFamily: fonts.body, color: colors.bronze }}
              >
                {member.role}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: fonts.body, color: colors.muted }}
              >
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
