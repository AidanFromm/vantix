'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="team" className="py-24 lg:py-32 bg-[#F4EFE8]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#B07A45] mb-4" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            Who We Are
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Small team. Big output.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="bg-[#EEE6DC] rounded-2xl p-8 border border-[#E3D9CD] shadow-sm md:hover:shadow-md md:hover:-translate-y-2 transition-all duration-300 cursor-default"
            >
              {/* Avatar */}
              {member.isAI ? (
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[#1C1C1C] border-2 border-[#B07A45]">
                  <motion.span
                    className="text-xl font-bold text-[#B07A45]"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    AI
                  </motion.span>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-[#B07A45]/30">
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

              <h3 className="text-xl font-bold text-[#1C1C1C] mb-1" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-[#B07A45] mb-4" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {member.role}
              </p>
              <p className="text-[#7A746C] text-sm leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}