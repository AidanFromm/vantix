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
    role: 'Co-founder & Business Lead',
    bio: '20. Built a $5.8M sneaker business before he could legally drink. Understands operations from the warehouse floor up.',
    photo: '/team/kyle.jpg',
  },
  {
    name: 'Our AI Team',
    role: 'Always-On Agents',
    bio: 'Two always-on AI agents that handle research, monitoring, development, and optimization 24/7. They don\u2019t sleep, and they don\u2019t miss deadlines.',
    initials: 'AI',
    isAI: true,
  },
];

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="team" className="py-28 lg:py-36" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              Who We Are
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Small team. Big output.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease }}
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
              {member.isAI ? (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-7"
                  style={{ backgroundColor: colors.darkSurface, border: `2px solid ${colors.bronze}` }}
                >
                  <motion.span
                    className="text-xl font-bold"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontFamily: fonts.display, color: colors.bronze }}
                  >
                    AI
                  </motion.span>
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-full overflow-hidden mb-7"
                  style={{ border: `2px solid ${colors.bronze}30` }}
                >
                  <Image
                    src={member.photo!}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

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
