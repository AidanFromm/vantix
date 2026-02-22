'use client';

import type { ReactNode, MouseEventHandler } from 'react';

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ShimmerButton({
  children,
  className = '',
  shimmerColor = '#C89A6A',
  onClick,
}: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden bg-[#B07A45] text-white font-semibold rounded-xl px-8 py-4 transition-all hover:brightness-110 hover:scale-[1.02] ${className}`}
      style={{ isolation: 'isolate' }}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(120deg, transparent 30%, ${shimmerColor}55 50%, transparent 70%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer-sweep 2.5s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes shimmer-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </button>
  );
}
