'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Table2, Clock, Users } from 'lucide-react';

const problems = [
  {
    icon: MessageSquare,
    title: "You're answering the same questions 100x a day",
    description:
      "Your team spends hours repeating the same responses to customers. That's time stolen from growth, strategy, and the work that actually moves the needle.",
  },
  {
    icon: Table2,
    title: 'Your data lives in 5 different spreadsheets',
    description:
      "Orders in one place, inventory in another, customer info somewhere else. Nothing talks to each other, and you're duct-taping it all together manually.",
  },
  {
    icon: Clock,
    title: "You're losing leads because you can't follow up fast enough",
    description:
      "By the time you respond, they've already gone to a competitor. Every hour of delay is revenue walking out the door.",
  },
  {
    icon: Users,
    title: "You're hiring people for tasks a machine could do",
    description:
      "Data entry, appointment scheduling, order processing — you're paying salaries for work that AI handles in seconds, 24/7, without mistakes.",
  },
];

function ProblemCard({ problem, index }: { problem: typeof problems[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = problem.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-[#EEE6DC] rounded-2xl border border-[#E3D9CD] p-8 shadow-sm"
    >
      <div className="w-12 h-12 rounded-xl bg-[#D8C2A8]/30 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-[#B07A45]" />
      </div>
      <h3
        className="text-xl md:text-2xl font-semibold text-[#4B3621] mb-3"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        {problem.title}
      </h3>
      <p className="text-[#6B5B4E] leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif' }}>
        {problem.description}
      </p>
    </motion.div>
  );
}

export default function ProblemSolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
    let gsapInstance: typeof import('gsap').gsap;

    const init = async () => {
      if (typeof window === 'undefined' || window.innerWidth < 768) return;

      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      gsapInstance = gsapMod.gsap;
      ScrollTrigger = stMod.ScrollTrigger;
      gsapInstance.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const rightCol = sectionRef.current.querySelector('.right-col') as HTMLElement;
      if (!rightCol) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${rightCol.scrollHeight - window.innerHeight + 200}`,
        pin: sectionRef.current.querySelector('.left-col') as HTMLElement,
        pinSpacing: false,
        onUpdate: (self) => {
          setTransitioned(self.progress > 0.85);
        },
      });
    };

    init();

    return () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F4EFE8] relative">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        {/* Mobile layout */}
        <div className="block md:hidden space-y-6">
          <h2
            className="text-3xl font-bold text-[#4B3621] mb-8"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Running a Business Shouldn&apos;t Feel Like This.
          </h2>
          {problems.map((p, i) => (
            <ProblemCard key={i} problem={p} index={i} />
          ))}
          <h2
            className="text-3xl font-bold text-[#B07A45] pt-8 text-center"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            What If It Didn&apos;t Have To?
          </h2>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-16">
          <div className="left-col flex items-center min-h-screen">
            <motion.h2
              className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
              style={{
                fontFamily: 'Clash Display, sans-serif',
                color: transitioned ? '#B07A45' : '#4B3621',
                transition: 'color 0.6s ease',
              }}
            >
              {transitioned
                ? "What If It Didn't Have To?"
                : "Running a Business Shouldn't Feel Like This."}
            </motion.h2>
          </div>
          <div className="right-col space-y-8 py-32">
            {problems.map((p, i) => (
              <ProblemCard key={i} problem={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
