'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';

const projects = [
  {
    name: 'Just Four Kicks',
    category: 'E-Commerce Platform',
    description: '$5.8M revenue wholesale sneaker platform with 80+ features',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    label: 'J4K',
    tags: ['React', 'Supabase', 'Stripe', 'FedEx API'],
    metric: '$5.8M Revenue',
  },
  {
    name: 'Secured Tampa',
    category: 'Retail Management',
    description: 'Full inventory management system for a sneaker & Pokemon retail store',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 50%, #e85d04 100%)',
    label: 'ST',
    tags: ['Next.js', 'Supabase', 'Barcode Scan'],
    metric: 'Full POS System',
  },
  {
    name: 'MixzoKickz',
    category: 'Sneaker Marketplace',
    description: 'Premium resale platform with integrated cleaning service booking',
    gradient: 'linear-gradient(135deg, #0C0C0C 0%, #1a0a1a 50%, #0a1a1a 100%)',
    label: 'MK',
    tags: ['Next.js', 'StockX API', 'Stripe'],
    accentColors: ['#FF2E88', '#00C2D6'],
    metric: 'Live Marketplace',
  },
  {
    name: 'CardLedger',
    category: 'SaaS Application',
    description: 'Portfolio tracker for collectible cards across 6+ card games',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)',
    label: 'CL',
    tags: ['React', 'TypeScript', 'eBay API', 'JustTCG'],
    metric: '44 Pages Built',
  },
  {
    name: 'Horizon Asphalt',
    category: 'Corporate Website',
    description: 'Professional commercial asphalt company landing page',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #B8935A 100%)',
    label: 'HA',
    tags: ['Next.js', 'Vercel', 'Resend'],
    metric: 'Commercial Focus',
  },
];

export default function PortfolioSection() {
  return (
    <section id="work" className="py-28 md:py-40" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#B8935A] mb-4">Our Work</p>
          <h2 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] mb-5">
            Projects that drove<br />real results.
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-xl">
            From $5.8M e-commerce platforms to SaaS products — we build technology that scales.
          </p>
        </motion.div>

        {/* Featured project - J4K full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-black/[0.06] group cursor-pointer"
        >
          <div className="grid md:grid-cols-2">
            <div
              className="relative flex items-center justify-center min-h-[300px] md:min-h-[400px]"
              style={{ background: projects[0].gradient }}
            >
              <div className="text-center">
                <span className="text-white/20 text-[120px] md:text-[160px] font-black leading-none">
                  {projects[0].label}
                </span>
              </div>
              <div className="absolute top-6 left-6">
                <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-white/80 backdrop-blur-sm">
                  {projects[0].metric}
                </span>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-medium tracking-widest uppercase text-[#B8935A] mb-3">
                {projects[0].category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">{projects[0].name}</h3>
              <p className="text-[#6B6B6B] mb-6 leading-relaxed">{projects[0].description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {projects[0].tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#F3F0EB] text-[#6B6B6B]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[#B8935A] font-medium text-sm group-hover:gap-3 transition-all">
                View Project <ArrowUpRight size={16} weight="bold" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid of remaining projects */}
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.slice(1).map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-black/[0.06] group cursor-pointer"
            >
              {/* Gradient area */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  background: project.gradient,
                  aspectRatio: '16/10',
                }}
              >
                <span className="text-white/15 text-[80px] md:text-[100px] font-black leading-none">
                  {project.label}
                </span>
                {/* Mixzo accent colors */}
                {'accentColors' in project && project.accentColors && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.accentColors.map((color) => (
                      <div key={color} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-white/80 backdrop-blur-sm">
                    {project.metric}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              {/* Info */}
              <div className="p-6">
                <span className="text-xs font-medium tracking-widest uppercase text-[#B8935A] mb-1 block">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{project.name}</h3>
                <p className="text-sm text-[#6B6B6B] mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[#F3F0EB] text-[#6B6B6B]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
