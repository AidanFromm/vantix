'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Brain, Code2, Database, Zap, BarChart3, MessageSquare,
  Palette, GitBranch, Sparkles,
} from 'lucide-react';

const FloatingNav = dynamic(() => import('@/components/landing/FloatingNav'), { ssr: false });
const FooterSection = dynamic(() => import('@/components/landing/FooterSection'));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

interface Tool {
  name: string;
  desc: string;
}

interface StackCategory {
  title: string;
  icon: any;
  tools: Tool[];
}

const stack: StackCategory[] = [
  {
    title: 'AI & Machine Learning',
    icon: Brain,
    tools: [
      { name: 'OpenAI', desc: 'GPT models for content generation, analysis, and intelligent agents' },
      { name: 'Anthropic Claude', desc: 'Advanced reasoning for complex planning and code generation' },
      { name: 'Replicate', desc: 'Image generation and visual AI pipelines at scale' },
      { name: 'Custom Fine-tuned Models', desc: 'Domain-specific models trained on client data' },
    ],
  },
  {
    title: 'Development',
    icon: Code2,
    tools: [
      { name: 'Next.js', desc: 'React framework for production-grade web applications' },
      { name: 'React', desc: 'Component-driven UI architecture' },
      { name: 'TypeScript', desc: 'Type-safe development across all projects' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling for rapid, consistent design' },
      { name: 'Framer Motion', desc: 'Physics-based animations and micro-interactions' },
      { name: 'Swift / SwiftUI', desc: 'Native iOS and macOS application development' },
    ],
  },
  {
    title: 'Backend & Data',
    icon: Database,
    tools: [
      { name: 'Supabase', desc: 'PostgreSQL database with real-time subscriptions and auth' },
      { name: 'Vercel', desc: 'Edge-first hosting with instant global deploys' },
      { name: 'Redis', desc: 'In-memory caching for sub-millisecond responses' },
      { name: 'Stripe', desc: 'Payment processing, subscriptions, and financial infrastructure' },
    ],
  },
  {
    title: 'Automation',
    icon: Zap,
    tools: [
      { name: 'n8n (Self-hosted)', desc: 'Visual workflow automation with 400+ integrations' },
      { name: 'Custom Python Pipelines', desc: 'Data processing and ETL workflows' },
      { name: 'Webhook Orchestration', desc: 'Event-driven architecture connecting all systems' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    tools: [
      { name: 'Custom Dashboards', desc: 'Real-time business intelligence built per client' },
      { name: 'Google Analytics', desc: 'Traffic and conversion tracking' },
      { name: 'Lighthouse CI', desc: 'Automated performance and accessibility auditing' },
    ],
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    tools: [
      { name: 'Resend', desc: 'Transactional and marketing email delivery' },
      { name: 'Twilio', desc: 'SMS notifications and two-factor authentication' },
      { name: 'Custom Chatbot Framework', desc: 'AI-powered customer support agents' },
    ],
  },
  {
    title: 'Design',
    icon: Palette,
    tools: [
      { name: 'Figma', desc: 'Collaborative design and prototyping' },
      { name: 'Replicate AI', desc: 'AI-generated imagery and brand assets' },
      { name: 'Sharp', desc: 'High-performance image processing and optimization' },
    ],
  },
  {
    title: 'DevOps',
    icon: GitBranch,
    tools: [
      { name: 'GitHub Actions', desc: 'CI/CD pipelines for automated testing and deployment' },
      { name: 'Vercel CI/CD', desc: 'Preview deployments on every pull request' },
      { name: 'PM2', desc: 'Process management for long-running services' },
      { name: 'Docker', desc: 'Containerized environments for consistent deployments' },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C]">
      <FloatingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible"
            className="text-[#B07A45] font-semibold tracking-widest uppercase text-sm mb-4"
          >
            Technology
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-clash, sans-serif)' }}
          >
            Our Stack
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="text-[#7A746C] text-lg md:text-xl max-w-2xl mx-auto"
          >
            The tools behind every build. Enterprise-grade technology, startup-speed delivery.
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {stack.map((cat, ci) => (
            <motion.div
              key={cat.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: ci * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <cat.icon className="w-6 h-6 text-[#B07A45]" />
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
                  {cat.title}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="group rounded-xl border border-[#E3D9CD] bg-white/60 p-5 hover:border-[#B07A45] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F4EFE8] flex items-center justify-center mb-3 group-hover:bg-[#B07A45]/10 transition-colors">
                      <span className="text-[#B07A45] font-bold text-sm">{tool.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                    <p className="text-sm text-[#7A746C]">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Future */}
      <section className="pb-32 px-6">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-2xl border border-[#E3D9CD] bg-white/60 p-12"
        >
          <Sparkles className="w-8 h-8 text-[#B07A45] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
            Always Evolving
          </h2>
          <p className="text-[#7A746C] text-lg max-w-xl mx-auto">
            We&apos;re constantly evaluating and integrating new tools. Our AI agents scan for emerging tech daily.
          </p>
        </motion.div>
      </section>

      <FooterSection />
    </div>
  );
}

