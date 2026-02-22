'use client';

import { useCallback, useRef, useState } from 'react';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export default function Spotlight({
  className = '',
  fill = 'rgba(176,122,69,0.15)',
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id="spotlight-grad"
            cx={`${position.x}%`}
            cy={`${position.y}%`}
            r="40%"
          >
            <stop offset="0%" stopColor={fill} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#spotlight-grad)" />
      </svg>
    </div>
  );
}
