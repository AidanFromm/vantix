'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const problems = [
  {
    headline: 'Half your team\u2019s day is wasted.',
    description:
      'Repetitive tasks, manual data entry, copy-pasting between tools \u2014 your best people are doing work a machine should handle.',
    visual: 'automation',
  },
  {
    headline: 'Your tools don\u2019t talk to each other.',
    description:
      'Inventory in one app. Payments in another. Analytics somewhere else. Nothing syncs, nothing connects, nothing scales.',
    visual: 'integration',
  },
  {
    headline: 'You\u2019re always a step behind.',
    description:
      'By the time you see the numbers, the opportunity already passed. Real-time intelligence isn\u2019t optional anymore.',
    visual: 'realtime',
  },
];

function AutomationVisual() {
  const tasks = [
    { label: 'Invoice #4821', color: colors.bronze },
    { label: 'Order Update', color: colors.bronzeLight },
    { label: 'Inventory Sync', color: colors.bronzeDark },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center py-8">
      <div className="relative w-80 h-72">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {tasks.map((task, i) => (
            <div
              key={i}
              className="px-5 py-3 rounded-xl border text-sm font-medium"
              style={{
                borderColor: `${task.color}30`,
                color: task.color,
                backgroundColor: `${task.color}08`,
              }}
            >
              {task.label}
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.bronzeLight}, ${colors.bronzeDark})`,
            boxShadow: `0 12px 40px ${colors.bronze}25`,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        {tasks.map((_, i) => (
          <div
            key={`done-${i}`}
            className="absolute right-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ top: `${20 + i * 13}%`, backgroundColor: `${colors.bronze}15` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.bronze} strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationVisual() {
  const apps = [
    { name: 'CRM', x: 0, y: -70 },
    { name: 'Shop', x: 70, y: 0 },
    { name: 'Pay', x: 0, y: 70 },
    { name: 'Mail', x: -70, y: 0 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center py-8">
      <svg width="280" height="280" viewBox="-120 -120 240 240" className="overflow-visible">
        {apps.map((app, i) =>
          apps.slice(i + 1).map((other, j) => (
            <line
              key={`line-${i}-${j}`}
              x1={app.x} y1={app.y} x2={other.x} y2={other.y}
              stroke={colors.bronze}
              strokeWidth="1.5"
              opacity="0.4"
            />
          ))
        )}
        <circle cx="0" cy="0" r="22" fill={colors.bronze} />
        <text x="0" y="5" textAnchor="middle" fill={colors.bg} fontSize="11" fontWeight="bold" style={{ fontFamily: fonts.body }}>V</text>
        {apps.map((app, i) => (
          <g key={`node-${i}`}>
            <circle cx={app.x} cy={app.y} r="18" fill={colors.darkSurface} stroke={colors.bronze} strokeWidth="2" />
            <text x={app.x} y={app.y + 4} textAnchor="middle" fill={colors.bronze} fontSize="9" fontWeight="600" style={{ fontFamily: fonts.body }}>
              {app.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RealtimeVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center py-8">
      <div className="w-72 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl border p-4" style={{ backgroundColor: colors.darkSurface, borderColor: `${colors.bronze}20` }}>
            <div className="text-[10px] mb-1" style={{ color: colors.muted }}>Revenue</div>
            <div className="text-xl font-bold" style={{ fontFamily: fonts.display, color: colors.bronze }}>$48,291</div>
            <div className="text-[10px] mt-1" style={{ color: colors.bronze }}>+12.4% ↑</div>
          </div>
          <div className="flex-1 rounded-xl border p-4" style={{ backgroundColor: colors.darkSurface, borderColor: `${colors.bronze}20` }}>
            <div className="text-[10px] mb-1" style={{ color: colors.muted }}>Orders</div>
            <div className="text-xl font-bold" style={{ fontFamily: fonts.display, color: colors.bg }}>1,847</div>
            <div className="text-[10px] mt-1" style={{ color: colors.bronze }}>+8.2% ↑</div>
          </div>
        </div>
        <div className="rounded-xl border p-5" style={{ backgroundColor: colors.darkSurface, borderColor: `${colors.bronze}20` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.bronze }} />
              <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: colors.bronze }}>Live Analytics</span>
            </div>
            <span className="text-[10px]" style={{ color: colors.muted }}>Last 24h</span>
          </div>
          <div className="flex items-end gap-[3px] h-24">
            {Array.from({ length: 24 }).map((_, i) => {
              const h = 30 + Math.sin(i * 0.5) * 25 + (i % 3) * 5;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, ${colors.bronzeDark}, ${colors.bronzeLight})`,
                  }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex justify-between text-[9px]" style={{ color: colors.muted }}>
            <span>12AM</span>
            <span>Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const visualComponents = {
  automation: AutomationVisual,
  integration: IntegrationVisual,
  realtime: RealtimeVisual,
};

function ProblemCard({ problem, index }: { problem: typeof problems[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const VisualComponent = visualComponents[problem.visual as keyof typeof visualComponents];
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center mb-24 last:mb-0`}
    >
      <div className={`flex flex-col justify-center text-center lg:text-left ${!isEven ? 'lg:order-2' : ''}`}>
        <div className="flex items-center gap-3 mb-5 justify-center lg:justify-start">
          <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          <span
            className="text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: fonts.body, color: colors.bronze }}
          >
            The Problem
          </span>
        </div>
        <h3
          className="text-3xl lg:text-[2.75rem] font-bold leading-[1.1] mb-5"
          style={{ fontFamily: fonts.display, color: colors.text }}
        >
          {problem.headline}
        </h3>
        <p
          className="text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
          style={{ fontFamily: fonts.body, color: colors.muted }}
        >
          {problem.description}
        </p>
      </div>
      <div className={`flex items-center justify-center ${!isEven ? 'lg:order-1' : ''}`}>
        <VisualComponent />
      </div>
    </motion.div>
  );
}

export default function ProblemSolutionSection() {
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <section id="problem" className="py-24 sm:py-32" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-7xl mx-auto px-6 w-full">
        {problems.map((p, i) => (
          <ProblemCard key={i} problem={p} index={i} />
        ))}

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mt-32 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12" style={{ backgroundColor: colors.border }} />
            <span className="h-px w-12" style={{ backgroundColor: colors.border }} />
          </div>
          <h3
            className="text-3xl lg:text-5xl font-bold leading-snug mb-5"
            style={{ fontFamily: fonts.display, color: colors.bronze }}
          >
            There&apos;s a better way.
          </h3>
          <p
            className="text-lg mx-auto max-w-xl mb-10"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Vantix builds the systems that get your time back.
          </p>
          <div className="flex items-center justify-center">
            <Image
              src="/logo-v-bronze.png"
              alt="Vantix"
              width={140}
              height={140}
              sizes="140px"
              loading="lazy"
              className="drop-shadow-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
