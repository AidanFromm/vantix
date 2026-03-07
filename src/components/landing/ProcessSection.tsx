'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Target, Hammer, Rocket } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';
import type { LucideIcon } from 'lucide-react';

const ease = animations.easing as unknown as [number, number, number, number];

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  detail: string;
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Deep-dive into your current systems, brand, and growth bottlenecks.',
    detail: 'We audit everything — your tech stack, conversion funnels, competitive landscape, and missed opportunities.',
    icon: Search,
  },
  {
    num: '02',
    title: 'Strategy',
    desc: 'Map out the blueprint — what to build, automate, and position.',
    detail: 'A custom roadmap with clear milestones, KPIs, and expected ROI timelines for every initiative.',
    icon: Target,
  },
  {
    num: '03',
    title: 'Build',
    desc: 'Design and develop your custom infrastructure with precision.',
    detail: 'Website, automations, creative assets — built in sprints with weekly demos so nothing is a surprise.',
    icon: Hammer,
  },
  {
    num: '04',
    title: 'Launch & Optimize',
    desc: 'Deploy with paid campaigns driving qualified traffic, then scale.',
    detail: 'Continuous A/B testing, performance monitoring, and iterative improvements to compound your results.',
    icon: Rocket,
  },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-28 md:py-40" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-20 md:mb-28"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
            style={{ fontFamily: fonts.body, color: colors.bronze }}
          >
            Our Process
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: fonts.display, color: colors.text, letterSpacing: '-0.035em' }}
          >
            From Discovery
            <br />
            <span style={{ color: colors.bronze }}>to Scale</span>
          </h2>
          <p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            A proven four-step system that turns operational chaos into compounding growth.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line (all screens) */}
          <div
            className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${colors.bronze}25, ${colors.bronze}25, transparent)`,
            }}
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.15, ease }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step number node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold relative"
                      style={{
                        background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
                        color: colors.bg,
                        boxShadow: `0 0 30px ${colors.bronze}30, 0 0 0 6px ${colors.bg}`,
                      }}
                    >
                      {step.num}
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 pl-20 md:pl-0 ${isEven ? 'md:pr-[calc(50%+56px)]' : 'md:pl-[calc(50%+56px)]'}`}>
                    <div
                      className="group rounded-2xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-1"
                      style={{
                        backgroundColor: colors.bgCard,
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500"
                        style={{
                          background: `${colors.bronze}10`,
                          border: `1px solid ${colors.borderAccent}`,
                        }}
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.5}
                          className="transition-colors duration-500 group-hover:text-[#D4B87A]"
                          style={{ color: colors.bronze }}
                        />
                      </div>

                      <h3
                        className="text-2xl font-bold mb-3 tracking-tight"
                        style={{ fontFamily: fonts.display, color: colors.text }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-base mb-4 leading-relaxed"
                        style={{ fontFamily: fonts.body, color: colors.text }}
                      >
                        {step.desc}
                      </p>
                      <p
                        className="text-sm leading-[1.7]"
                        style={{ fontFamily: fonts.body, color: colors.muted }}
                      >
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
