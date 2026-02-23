'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import ShimmerButton from './ShimmerButton';

/* ── Mockup data ── */
const columnA = [
  { src: '/vantix-mockups/mockup-1-dashboard.png', label: 'AI Dashboard' },
  { src: '/vantix-mockups/mockup-2-chatbot.png', label: 'Smart Chatbot' },
  { src: '/vantix-mockups/mockup-3-website.png', label: 'Custom App' },
  { src: '/vantix-mockups/mockup-4-lead-engine.png', label: 'Lead Engine' },
];

const columnB = [
  { src: '/vantix-mockups/mockup-5-api-integration.png', label: 'API Integration' },
  { src: '/vantix-mockups/mockup-6-mobile-app.png', label: 'Workflow Automation' },
  { src: '/vantix-mockups/mockup-7-analytics.png', label: 'Analytics Suite' },
  { src: '/vantix-mockups/mockup-8-automation.png', label: 'Automation Hub' },
];

/* Duplicate for seamless loop */
const colAItems = [...columnA, ...columnA];
const colBItems = [...columnB, ...columnB];

/* ── Component ── */
export default function ProductShowcaseHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#F4EFE8]">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 py-28 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        {/* ─── LEFT SIDE (60%) ─── */}
        <div className="w-full lg:w-[60%] lg:pr-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-[-0.03em] text-[#1C1C1C] leading-[1.08] mb-6"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            AI Infrastructure.
            <br />
            Built for You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg sm:text-xl text-[#7A746C] max-w-lg leading-relaxed mb-10"
          >
            From chatbots to dashboards to lead engines — we design, build, and deploy your AI stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col items-start gap-3"
          >
            <a href="#booking">
              <ShimmerButton className="text-lg px-10 py-4 rounded-full">
                Get Your AI Blueprint
              </ShimmerButton>
            </a>
            <p className="text-sm text-[#7A746C]">
              Free 30-minute strategy call. No pitch, just clarity.
            </p>
          </motion.div>
        </div>

        {/* ─── RIGHT SIDE (40%) — Infinite Scroll ─── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex w-[40%] h-[600px] relative gap-4 overflow-hidden"
        >
          {/* Top & bottom gradient fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#F4EFE8] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#F4EFE8] to-transparent" />

          {/* Column A — scrolls UP */}
          <div className="flex-1 overflow-hidden relative">
            <div className="scroll-col-up flex flex-col gap-4">
              {colAItems.map((item, i) => (
                <MockupCard key={`a-${i}`} item={item} />
              ))}
            </div>
          </div>

          {/* Column B — scrolls DOWN (offset start) */}
          <div className="flex-1 overflow-hidden relative -mt-20">
            <div className="scroll-col-down flex flex-col gap-4">
              {colBItems.map((item, i) => (
                <MockupCard key={`b-${i}`} item={item} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} className="text-[#B07A45]/50" />
        </motion.div>
      </motion.div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .scroll-col-up {
          animation: scroll-up 25s linear infinite;
        }
        .scroll-col-down {
          animation: scroll-down 25s linear infinite;
        }
      `}</style>
    </section>
  );
}

/* ── Mockup Card ── */
function MockupCard({ item }: { item: { src: string; label: string } }) {
  return (
    <div className="group flex flex-col items-center">
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-transparent transition-all duration-300 hover:border-[#B07A45]/60 hover:shadow-xl">
        <Image
          src={item.src}
          alt={item.label}
          width={280}
          height={200}
          className="w-full h-auto object-cover"
        />
      </div>
      <span className="mt-2 text-xs font-medium text-[#7A746C] tracking-wide uppercase">
        {item.label}
      </span>
    </div>
  );
}
