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

function AutomationVisual({ opacity }: { opacity: number }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ opacity }}>
      <div className="relative">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-lg bg-[#B07A45]/10 border border-[#B07A45]/20"
            style={{
              width: 60,
              height: 40,
              top: i * 28 - 56,
              left: i % 2 === 0 ? -40 : 40,
            }}
            animate={{ x: [0, 80], opacity: [1, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
        <div className="w-24 h-24 rounded-2xl bg-[#B07A45] flex items-center justify-center shadow-lg shadow-[#B07A45]/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F4EFE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IntegrationVisual({ opacity }: { opacity: number }) {
  const nodes = [
    { x: 0, y: -60 }, { x: 52, y: -30 }, { x: 52, y: 30 },
    { x: 0, y: 60 }, { x: -52, y: 30 }, { x: -52, y: -30 },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ opacity }}>
      <svg width="200" height="200" viewBox="-100 -100 200 200" className="overflow-visible">
        {nodes.map((n, i) =>
          nodes.slice(i + 1).map((m, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="#B07A45" strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 3, delay: (i + j) * 0.2, repeat: Infinity }}
            />
          ))
        )}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y} r="12"
            fill="#B07A45" fillOpacity={0.15}
            stroke="#B07A45" strokeWidth="2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        <circle cx="0" cy="0" r="16" fill="#B07A45" />
        <text x="0" y="5" textAnchor="middle" fill="#F4EFE8" fontSize="12" fontWeight="bold">V</text>
      </svg>
    </div>
  );
}

function RealtimeVisual({ opacity }: { opacity: number }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ opacity }}>
      <div className="w-64 h-44 rounded-xl bg-[#1C1C1C] border border-[#B07A45]/30 p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-[#B07A45] font-semibold tracking-wider uppercase">Live</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-[#B07A45] rounded-t"
              animate={{ height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-[#7A746C]">
          <span>Now</span>
          <span className="text-[#B07A45] font-bold">+23% ↑</span>
        </div>
      </div>
    </div>
  );
}

const visuals = [AutomationVisual, IntegrationVisual, RealtimeVisual];

export default function ProblemSolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section id="problem" className="bg-[#0a0a0a]">
      <div ref={containerRef} style={{ height: `${(problems.length + 1) * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text */}
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

            {/* Right: Visual */}
            <div className="relative h-[300px]">
              {visuals.map((Visual, i) => {
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
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
      <h3 className="text-3xl lg:text-4xl font-bold text-[#F4EFE8] leading-snug mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
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
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
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
  Visual: typeof visuals[0];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number; end: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Visual opacity={1} />
    </motion.div>
  );
}

function LogoReveal({ progress, start }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, 1], [0, 1, 1]);
  const scale = useTransform(progress, [start, start + 0.08], [0.8, 1]);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity, scale }}>
      <div className="relative">
        {/* Bronze glow behind logo */}
        <div className="absolute inset-0 blur-3xl bg-[#B07A45]/20 rounded-full scale-150" />
        <Image
          src="/logo-v-bronze.png"
          alt="Vantix"
          width={200}
          height={200}
          className="relative z-10 drop-shadow-2xl"
        />
      </div>
    </motion.div>
  );
}