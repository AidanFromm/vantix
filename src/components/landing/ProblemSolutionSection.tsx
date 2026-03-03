'use client';

import Image from 'next/image';

/* ── Mockup Data (unchanged) ── */
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

/* ── Automation Visual: Simplified (removed motion.div infinite animations) ── */
function AutomationVisual() {
  const tasks = [
    { label: 'Invoice #4821', color: '#B07A45' },
    { label: 'Order Update', color: '#C89A6A' },
    { label: 'Inventory Sync', color: '#8E5E34' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center py-8">
      <div className="relative w-80 h-72">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {tasks.map((task, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: `${task.color}40`, color: task.color, backgroundColor: `${task.color}10` }}
            >
              {task.label}
            </div>
          ))}
        </div>

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C89A6A] to-[#8E5E34] flex items-center justify-center shadow-xl shadow-[#B07A45]/20"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F4EFE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {tasks.map((_, i) => (
          <div
            key={`done-${i}`}
            className="absolute right-0 w-8 h-8 rounded-full bg-[#B07A45]/20 flex items-center justify-center"
            style={{ top: `${20 + i * 13}%` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B07A45" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Integration Visual: Simplified (removed motion.line and motion.circle infinite animations) ── */
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
              stroke="#B07A45"
              strokeWidth="1.5"
              opacity="0.5" // Static opacity
            />
          ))
        )}

        <circle
          cx="0" cy="0" r="22"
          fill="#B07A45"
        />
        <text x="0" y="5" textAnchor="middle" fill="#F4EFE8" fontSize="11" fontWeight="bold" style={{ fontFamily: 'Satoshi, sans-serif' }}>V</text>

        {apps.map((app, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={app.x} cy={app.y} r="18"
              fill="#1C1C1C"
              stroke="#B07A45"
              strokeWidth="2"
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

/* ── Realtime Visual (unchanged as it had no framer-motion animations) ── */
function RealtimeVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center py-8">
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

const visualComponents = { 
  automation: AutomationVisual, 
  integration: IntegrationVisual, 
  realtime: RealtimeVisual 
};

export default function ProblemSolutionSection() {
  return (
    <section id="problem" className="bg-[#F4EFE8] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        {problems.map((p, i) => {
          const VisualComponent = visualComponents[p.visual as keyof typeof visualComponents];
          return (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 last:mb-0">
              <div className="flex flex-col justify-center text-center lg:text-left">
                <h3 className="text-3xl lg:text-4xl font-bold text-[#1C1C1C] leading-snug mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                  {p.headline}
                </h3>
                <p className="text-lg text-[#7A746C] leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  {p.description}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <VisualComponent />
              </div>
            </div>
          );
        })}

        <div className="mt-20 text-center">
          <h3 className="text-3xl lg:text-5xl font-bold text-[#B07A45] leading-snug mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            There&apos;s a better way.
          </h3>
          <p className="text-lg text-[#7A746C] mx-auto max-w-xl" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            Vantix builds the systems that get your time back.
          </p>
          <div className="flex items-center justify-center mt-8">
            <Image
              src="/logo-v-bronze.png"
              alt="Vantix"
              width={160} // Adjusted for mobile
              height={160} // Adjusted for mobile
              sizes="160px"
              loading="lazy"
              className="drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}