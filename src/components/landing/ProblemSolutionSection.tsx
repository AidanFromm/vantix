'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const problems = [
  {
    headline: 'Half your team\u2019s day is wasted.',
    description: 'Repetitive tasks, manual data entry, copy-pasting between tools \u2014 your best people are doing work a machine should handle.',
    visual: 'automation',
  },
  {
    headline: 'Your tools don\u2019t talk to each other.',
    description: 'Inventory in one app. Payments in another. Analytics somewhere else. Nothing syncs, nothing connects, nothing scales.',
    visual: 'integration',
  },
  {
    headline: 'You\u2019re always a step behind.',
    description: 'By the time you see the numbers, the opportunity already passed. Real-time intelligence isn\u2019t optional anymore.',
    visual: 'realtime',
  },
];

/* ── Automation Visual: Reduced to 3 task cards ── */
function AutomationVisual() {
  const tasks = [
    { label: 'Invoice #4821', color: '#B07A45' },
    { label: 'Order Update', color: '#C89A6A' },
    { label: 'Inventory Sync', color: '#8E5E34' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-72">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {tasks.map((task, i) => (
            <motion.div
              key={i}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: `${task.color}40`, color: task.color, backgroundColor: `${task.color}10`, willChange: 'transform' }}
              animate={{
                x: [0, 140, 280],
                opacity: [1, 1, 0],
                scale: [1, 0.9, 0.7],
              }}
              transition={{
                duration: 3,
                delay: i * 0.6,
                repeat: Infinity,
                repeatDelay: tasks.length * 0.6 - 3 + 1,
                ease: 'easeInOut',
              }}
            >
              {task.label}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C89A6A] to-[#8E5E34] flex items-center justify-center shadow-xl shadow-[#B07A45]/20"
          style={{ willChange: 'transform' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F4EFE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>

        {tasks.map((_, i) => (
          <motion.div
            key={`done-${i}`}
            className="absolute right-0 w-8 h-8 rounded-full bg-[#B07A45]/20 flex items-center justify-center"
            style={{ top: `${20 + i * 13}%`, willChange: 'transform' }}
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1, 1, 0.8] }}
            transition={{ duration: 3, delay: i * 0.6 + 2, repeat: Infinity, repeatDelay: tasks.length * 0.6 - 2 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B07A45" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Integration Visual: Reduced to 4 nodes ── */
function IntegrationVisual() {
  const apps = [
    { name: 'CRM', x: 0, y: -70 },
    { name: 'Shop', x: 70, y: 0 },
    { name: 'Pay', x: 0, y: 70 },
    { name: 'Mail', x: -70, y: 0 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="280" height="280" viewBox="-120 -120 240 240" className="overflow-visible" style={{ willChange: 'transform' }}>
        {apps.map((app, i) =>
          apps.slice(i + 1).map((other, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              x1={app.x} y1={app.y} x2={other.x} y2={other.y}
              stroke="#B07A45"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 0.3, 0.5, 0.3, 0] }}
              transition={{ duration: 4, delay: (i + j) * 0.3, repeat: Infinity }}
            />
          ))
        )}

        {apps.slice(0, 2).map((app, i) => {
          const target = apps[(i + 2) % apps.length];
          return (
            <motion.circle
              key={`packet-${i}`}
              r="4"
              fill="#B07A45"
              style={{ willChange: 'transform' }}
              animate={{
                cx: [app.x, 0, target.x],
                cy: [app.y, 0, target.y],
              }}
              transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity, repeatDelay: 1 }}
            />
          );
        })}

        <motion.circle
          cx="0" cy="0" r="22"
          fill="#B07A45"
          style={{ willChange: 'transform' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="0" y="5" textAnchor="middle" fill="#F4EFE8" fontSize="11" fontWeight="bold" style={{ fontFamily: 'Satoshi, sans-serif' }}>V</text>

        {apps.map((app, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={app.x} cy={app.y} r="18"
              fill="#1C1C1C"
              stroke="#B07A45"
              strokeWidth="2"
              style={{ willChange: 'transform' }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
            <text x={app.x} y={app.y + 4} textAnchor="middle" fill="#B07A45" fontSize="9" fontWeight="600" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              {app.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Realtime Visual: KPI cards + chart only (removed activity feed) ── */
function RealtimeVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-72 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl bg-[#1C1C1C] border border-[#B07A45]/20 p-3">
            <div className="text-[10px] text-[#7A746C] mb-1">Revenue</div>
            <div
              className="text-lg font-bold text-[#B07A45]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              $48,291
            </div>
            <div className="text-[9px] text-green-400 mt-1">+12.4% ↑</div>
          </div>
          <div className="flex-1 rounded-xl bg-[#1C1C1C] border border-[#B07A45]/20 p-3">
            <div className="text-[10px] text-[#7A746C] mb-1">Orders</div>
            <div
              className="text-lg font-bold text-[#F4EFE8]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              1,847
            </div>
            <div className="text-[9px] text-green-400 mt-1">+8.2% ↑</div>
          </div>
        </div>

        <div className="rounded-xl bg-[#1C1C1C] border border-[#B07A45]/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] text-[#B07A45] font-semibold tracking-wider uppercase">Live Analytics</span>
            </div>
            <span className="text-[10px] text-[#7A746C]">Last 24h</span>
          </div>
          <div className="flex items-end gap-[3px] h-24">
            {Array.from({ length: 24 }).map((_, i) => {
              const h = 30 + Math.sin(i * 0.5) * 25 + (i % 3) * 5;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#8E5E34] to-[#C89A6A] rounded-t"
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-[#7A746C]">
            <span>12AM</span>
            <span>Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const visualComponents = [AutomationVisual, IntegrationVisual, RealtimeVisual];

export default function ProblemSolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section id="problem" className="bg-[#F4EFE8]">
      <div ref={containerRef} className="relative problem-scroll-container">
        <style jsx>{`
          .problem-scroll-container { height: 400vh; }
          @media (max-width: 1023px) { .problem-scroll-container { height: 350vh; } }
        `}</style>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative h-[300px] flex flex-col justify-center">
              {problems.map((p, i) => {
                const total = problems.length + 1;
                const start = i / total;
                const mid = (i + 0.5) / total;
                const end = (i + 1) / total;
                return <ProblemText key={i} problem={p} progress={scrollYProgress} start={start} mid={mid} end={end} />;
              })}
              <BetterWayText progress={scrollYProgress} start={problems.length / (problems.length + 1)} />
            </div>

            <div className="relative h-[250px] lg:h-[400px]">
              {visualComponents.map((Visual, i) => {
                const total = problems.length + 1;
                const start = i / total;
                const end = (i + 1) / total;
                return <VisualPanel key={i} Visual={Visual} progress={scrollYProgress} start={start} end={end} />;
              })}
              <LogoReveal progress={scrollYProgress} start={problems.length / (problems.length + 1)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemText({ problem, progress, start, mid, end }: {
  problem: typeof problems[0];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number; mid: number; end: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, mid, end - 0.05, end], [0, 1, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.05, end - 0.05, end], [30, 0, 0, -30]);

  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y, willChange: 'opacity, transform' }}>
      <h3 className="text-3xl lg:text-4xl font-bold text-[#1C1C1C] leading-snug mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        {problem.headline}
      </h3>
      <p className="text-lg text-[#7A746C] leading-relaxed max-w-lg" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        {problem.description}
      </p>
    </motion.div>
  );
}

function BetterWayText({ progress, start }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, 1], [0, 1, 1]);
  const y = useTransform(progress, [start, start + 0.05], [30, 0]);

  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y, willChange: 'opacity, transform' }}>
      <h3 className="text-3xl lg:text-5xl font-bold text-[#B07A45] leading-snug mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        There&apos;s a better way.
      </h3>
      <p className="text-lg text-[#7A746C]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        Vantix builds the systems that get your time back.
      </p>
    </motion.div>
  );
}

function VisualPanel({ Visual, progress, start, end }: {
  Visual: React.ComponentType;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number; end: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity, willChange: 'opacity' }}>
      <Visual />
    </motion.div>
  );
}

function LogoReveal({ progress, start }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, 1], [0, 1, 1]);
  const scale = useTransform(progress, [start, start + 0.1], [0.7, 1]);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity, scale, willChange: 'opacity, transform' }}>
      <Image
        src="/logo-v-bronze.png"
        alt="Vantix"
        width={240}
        height={240}
        sizes="240px"
        loading="lazy"
        className="drop-shadow-2xl"
      />
    </motion.div>
  );
}
