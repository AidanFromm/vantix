'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface StickyScrollRevealProps {
  leftContent: ReactNode;
  items: { title: string; description: string; icon?: ReactNode }[];
  className?: string;
}

export default function StickyScrollReveal({
  leftContent,
  items,
  className = '',
}: StickyScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        const rightItems = containerRef.current!.querySelectorAll('.scroll-item');
        rightItems.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true,
              },
            },
          );
        });
      }, containerRef);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col lg:flex-row gap-12 ${className}`}>
      <div className="lg:w-5/12 lg:sticky lg:top-32 lg:self-start">
        {leftContent}
      </div>
      <div className="lg:w-7/12 space-y-16">
        {items.map((item, i) => (
          <div key={i} className="scroll-item p-6 rounded-2xl border border-[#E3D9CD] bg-[#EEE6DC]">
            {item.icon && <div className="mb-3 text-[#B07A45]">{item.icon}</div>}
            <h3 className="text-xl font-bold text-[#B07A45] mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              {item.title}
            </h3>
            <p className="text-[#7A746C] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
