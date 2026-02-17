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
  icon?: React.ElementType;
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

function Sparkline({ data, color = '#B8895A' }: { data: number[]; color?: string }) {
  const width = 80;
  const height = 32;
  const padding = 2;

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  
  // Create gradient area
  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${width - padding},${height - padding}`,
  ].join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill="url(#sparklineGradient)"
      />
      
      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      
      {/* End dot */}
      <motion.circle
        cx={points[points.length - 1].split(',')[0]}
        cy={points[points.length - 1].split(',')[1]}
        r={3}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
    </svg>
  );
}

function TrendIndicator({ value, label }: { value: number; label?: string }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const color = isNeutral ? 'text-[#8C857C]' : isPositive ? 'text-[#8DB580]' : 'text-[#C4735B]';
  const bgColor = isNeutral ? 'bg-[#8C857C]/10' : isPositive ? 'bg-[#8DB580]/10' : 'bg-[#C4735B]/10';

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${bgColor}`}>
      <Icon size={12} className={color} />
      <span className={`text-xs font-medium ${color}`}>
        {isPositive ? '+' : ''}{value}%
      </span>
      {label && <span className="text-xs text-[#8C857C]">{label}</span>}
    </div>
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        group relative overflow-hidden
        bg-white
        border border-[#E8E2DA] rounded-2xl
        shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]
        p-5 transition-all duration-300
        hover:shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff]
        hover:scale-[1.01]
        ${className}
      `}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B8895A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="p-2 rounded-lg bg-[#B8895A]/10 text-[#B8895A]">
                <Icon size={16} />
              </div>
            )}
            <span className="text-sm font-medium text-[#8C857C]">{title}</span>
          </div>
          
          {sparklineData && sparklineData.length > 0 && (
            <Sparkline data={sparklineData} color={trend && trend < 0 ? '#C4735B' : '#B8895A'} />
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-3xl font-bold text-[#2D2A26] tracking-tight">
              {isVisible && <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />}
            </h3>
            
            {trend !== undefined && (
              <div className="mt-2">
                <TrendIndicator value={trend} label={trendLabel} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
