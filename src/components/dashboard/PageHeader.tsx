'use client';

import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function PageHeader({ title, description, actionLabel, actionHref, onAction }: PageHeaderProps) {
  const ActionButton = actionLabel ? (
    <button
      onClick={onAction}
      className="px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
    >
      {actionLabel}
    </button>
  ) : null;

  const ActionLink = actionLabel && actionHref ? (
    <Link
      href={actionHref}
      className="px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
    >
      {actionLabel}
    </Link>
  ) : null;

  return (
    <div className="flex items-start justify-between pb-5 mb-6 border-b border-[#B07A45]/20">
      <div>
        <h1 className="text-[28px] font-bold text-[#1C1C1C] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-[#7A746C] mt-1">{description}</p>
        )}
      </div>
      {actionHref ? ActionLink : ActionButton}
    </div>
  );
}
