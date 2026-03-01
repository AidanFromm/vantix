'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  sparklineData?: number[];
  icon?: any;
  className?: string;
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 75, damping: 25 });
  const display = useTransform(spring, (current) => {
    if (prefix === '$') {
      return `${prefix}${Math.round(current).toLocaleString()}`;
    }
    return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

function Sparkline({ data, color = '#B07A45' }: { data: number[]; color?: string }) {
  const width = 120;
  const height = 36;
  const padding = 2;

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `M ${padding},${height - padding} L ${points.map((p) => `${p.x},${p.y}`).join(' L ')} L ${width - padding},${height - padding} Z`;

  const gradientId = `spark-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      />
    </svg>
  );
}

export default function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  sparklineData,
  icon: Icon,
  className = '',
}: KPICardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const trendColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-[#7A746C]';
  const trendBg = isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-[#EEE6DC]';
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        group relative overflow-hidden
        bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl
        shadow-sm hover:shadow-md hover:-translate-y-0.5
        transition-all duration-300
        ${className}
      `}
    >
      {/* Bronze gradient top border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#B07A45] via-[#C89A6A] to-[#B07A45]" />

      <div className="p-5">
        {/* Header: icon + sparkline */}
        <div className="flex items-start justify-between mb-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-[#B07A45]/10">
              <Icon size={20} className="text-[#B07A45]" />
            </div>
          )}
          {sparklineData && sparklineData.length > 0 && (
            <Sparkline data={sparklineData} color={isNegative ? '#EF4444' : '#B07A45'} />
          )}
        </div>

        {/* Big number */}
        <h3 className="text-[32px] font-bold text-[#1C1C1C] tracking-tight leading-none mb-1">
          {isVisible && <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />}
        </h3>

        {/* Label */}
        <p className="text-[14px] text-[#7A746C] mb-3">{title}</p>

        {/* Trend indicator */}
        {trend !== undefined && (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${trendBg}`}>
            <TrendIcon size={13} className={trendColor} />
            <span className={`text-xs font-semibold ${trendColor}`}>
              {isPositive ? '+' : ''}{trend}%
            </span>
            {trendLabel && (
              <span className="text-xs text-[#7A746C]">{trendLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B07A45]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}


