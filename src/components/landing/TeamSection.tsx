'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const team = [
  {
    name: 'Kyle Ventura',
    role: 'Co-Founder',
    bio: 'Builder. Systems thinker. Runs operations and client delivery.',
    photo: '/team-kyle.jpg',
  },
  {
    name: 'Aidan Fromm',
    role: 'Co-Founder',
    bio: 'Creative strategist. Handles design, marketing, and client relationships.',
    photo: '/team-aidan.jpg',
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-28 bg-[#EEE6DC]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1C1C] text-center mb-14"
          style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
        >
          Who We Are
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {team.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={i === 0 ? fadeLeft : fadeRight}
              className="bg-[#EEE6DC] rounded-2xl p-8 border border-[#E3D9CD] text-center"
            >
              <div className="w-[120px] h-[120px] rounded-full mx-auto mb-6 overflow-hidden border-4 border-[#D8C2A8]">
                <Image
                  src={t.photo}
                  alt={t.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3
                className="text-2xl font-semibold text-[#1C1C1C] mb-1"
                style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
              >
                {t.name}
              </h3>
              <p className="text-[#B07A45] font-medium mb-3">{t.role}</p>
              <p
                className="text-[#4B4B4B] leading-relaxed"
                style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
              >
                {t.bio}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center text-[#7A746C] italic mt-10 text-lg"
          style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
        >
          Plus our AI workforce that never sleeps.
        </motion.p>
      </div>
    </section>
  );
}
