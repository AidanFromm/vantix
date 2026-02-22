'use client';

import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = false,
  className = '',
}: MarqueeProps) {
  const animDir = direction === 'left' ? 'normal' : 'reverse';

  return (
    <div
      className={`overflow-hidden ${pauseOnHover ? 'group' : ''} ${className}`}
    >
      <div
        className={`flex w-max ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          animationDirection: animDir,
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>{children}</div>
      </div>
      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
