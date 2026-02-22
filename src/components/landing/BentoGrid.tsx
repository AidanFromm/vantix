'use client';

import type { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[18rem] ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  href?: string;
}

export function BentoCard({
  title,
  description,
  icon,
  className = '',
  href,
}: BentoCardProps) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag
      {...(href ? { href } : {})}
      className={`relative rounded-2xl border border-[#E3D9CD] bg-[#EEE6DC] p-6 flex flex-col justify-end overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#B07A45] ${className}`}
    >
      {icon && (
        <div className="mb-3 text-[#B07A45]">{icon}</div>
      )}
      <h3 className="text-lg font-bold text-[#B07A45] mb-1" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm text-[#7A746C] leading-relaxed">{description}</p>
    </Tag>
  );
}
