'use client';

import { motion } from 'framer-motion';
import { colors, fonts } from '@/lib/design-tokens';

const projects = [
  { name: 'Just Four Kicks', category: 'E-commerce Platform', gradient: 'from-[#B8935A]/30 to-[#0A0A0A]' },
  { name: 'Secured Tampa', category: 'Retail Management', gradient: 'from-[#7D5F35]/30 to-[#0A0A0A]' },
  { name: 'CardLedger', category: 'SaaS Application', gradient: 'from-[#C87F4E]/30 to-[#0A0A0A]' },
  { name: 'Horizon Asphalt', category: 'Corporate Website', gradient: 'from-[#D4B87A]/20 to-[#0A0A0A]' },
];

export default function ProjectsShowcase() {
  return (
    <section id="work" className="px-6 py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-[0.25em] mb-4"
          style={{ color: colors.textMuted, fontFamily: fonts.mono }}
        >
          ./projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-16"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          Selected Work
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className={`aspect-[16/10] bg-gradient-to-br ${project.gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]`}
              >
                <span
                  className="text-2xl md:text-3xl font-bold opacity-40"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {project.name}
                </span>
              </div>
              <div className="p-6">
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: fonts.display, color: colors.text }}
                >
                  {project.name}
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: colors.textSecondary, fontFamily: fonts.body }}
                >
                  {project.category}
                </p>
              </div>
              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${colors.bronze}40` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
