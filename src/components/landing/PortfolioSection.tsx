'use client';

import { motion } from 'framer-motion';

const projects = [
  {
    name: 'Just Four Kicks',
    category: 'E-Commerce Platform',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    label: 'JUST FOUR KICKS',
    icon: '👟',
  },
  {
    name: 'Secured Tampa',
    category: 'Retail Store',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #e85d04 100%)',
    label: 'SECURED TAMPA',
    icon: '🛡️',
  },
  {
    name: 'CardLedger',
    category: 'SaaS Application',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)',
    label: 'CARDLEDGER',
    icon: '💳',
  },
  {
    name: 'Vantix Dashboard',
    category: 'Internal Tool',
    gradient: 'linear-gradient(135deg, #7D5F35 0%, #D4B87A 100%)',
    label: 'VANTIX',
    icon: '✦',
  },
];

export default function PortfolioSection() {
  return (
    <section id="work" className="py-24 md:py-32" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Selected Work</h2>
          <p className="text-lg text-[#6B6B6B] max-w-lg">Projects that drove real results for real businesses.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-black/[0.06] group cursor-pointer"
            >
              {/* Gradient area */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  background: project.gradient,
                  aspectRatio: '16/10',
                }}
              >
                <div className="text-center">
                  <span className="text-3xl mb-3 block">{project.icon}</span>
                  <span className="text-white/90 text-xl md:text-2xl font-bold tracking-[0.15em] uppercase">
                    {project.label}
                  </span>
                </div>
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{project.name}</h3>
                <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-[#F3F0EB] text-[#6B6B6B]">
                  {project.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
