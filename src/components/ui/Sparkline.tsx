'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  showGradient?: boolean;
  showDots?: boolean;
  showTooltip?: boolean;
  strokeWidth?: number;
  animate?: boolean;
  trend?: 'auto' | 'up' | 'down' | 'neutral';
  colors?: {
    up: string;
    down: string;
    neutral: string;
  };
}

export function Sparkline({
  data,
  width = 120,
  height = 40,
  className,
  showGradient = true,
  showDots = false,
  showTooltip = true,
  strokeWidth = 2,
  animate = true,
  trend = 'auto',
  colors = {
    up: '#10b981',
    down: '#ef4444',
    neutral: '#6b7280',
  },
}: SparklineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate trend
  const calculatedTrend = useMemo(() => {
    if (trend !== 'auto') return trend;
    if (data.length < 2) return 'neutral';
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first) return 'up';
    if (last < first) return 'down';
    return 'neutral';
  }, [data, trend]);

  const color = colors[calculatedTrend];

  // Generate path
  const { path, points, areaPath } = useMemo(() => {
    if (data.length === 0) return { path: '', points: [], areaPath: '' };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;

    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;

    const pts = data.map((value, i) => ({
      x: padding + (i / (data.length - 1)) * effectiveWidth,
      y: padding + effectiveHeight - ((value - min) / range) * effectiveHeight,
      value,
    }));

    // Create smooth curve using Catmull-Rom spline
    const smoothPath = pts.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x} ${point.y}`;

      // Control points for smooth curve
      const p0 = arr[i - 2] || arr[i - 1];
      const p1 = arr[i - 1];
      const p2 = point;
      const p3 = arr[i + 1] || point;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }, '');

    // Area path for gradient fill
    const area = `${smoothPath} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

    return { path: smoothPath, points: pts, areaPath: area };
  }, [data, width, height]);

  const gradientId = useRef(`sparkline-gradient-${Math.random().toString(36).slice(2)}`);

  return (
    <div className={cn('relative inline-block', className)}>
      <svg
        ref={ref}
        width={width}
        height={height}
        className="overflow-visible"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          {/* Gradient for fill */}
          <linearGradient id={gradientId.current} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient fill area */}
        {showGradient && (
          <motion.path
            d={areaPath}
            fill={`url(#${gradientId.current})`}
            initial={animate ? { opacity: 0 } : false}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        )}

        {/* Main line */}
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Interactive hover areas */}
        {showTooltip &&
          points.map((point, i) => (
            <rect
              key={i}
              x={point.x - width / data.length / 2}
              y={0}
              width={width / data.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              className="cursor-pointer"
            />
          ))}

        {/* Dots */}
        {(showDots || hoveredIndex !== null) &&
          points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === i ? 5 : showDots ? 3 : 0}
              fill={color}
              initial={animate ? { scale: 0 } : false}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.05 }}
              className={cn(
                'transition-all duration-150',
                hoveredIndex === i && 'drop-shadow-[0_0_6px_currentColor]'
              )}
              style={{ color }}
            />
          ))}

        {/* Hover line */}
        {hoveredIndex !== null && (
          <motion.line
            x1={points[hoveredIndex].x}
            y1={0}
            x2={points[hoveredIndex].x}
            y2={height}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="3 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          />
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 px-2 py-1 text-xs font-medium bg-black/90 backdrop-blur-sm border border-white/10 rounded-md shadow-xl"
          style={{
            left: points[hoveredIndex].x,
            top: -32,
            transform: 'translateX(-50%)',
            color,
          }}
        >
          {points[hoveredIndex].value.toLocaleString()}
          <div
            className="absolute w-2 h-2 bg-black/90 border-b border-r border-white/10 rotate-45"
            style={{
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// Mini sparkline for inline use
export function MiniSparkline({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  return <Sparkline data={data} width={60} height={20} showTooltip={false} strokeWidth={1.5} className={className} />;
}

// Sparkline with label and value
export function SparklineCard({
  label,
  value,
  data,
  suffix = '',
  prefix = '',
  className,
}: {
  label: string;
  value: number;
  data: number[];
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const trend = data.length > 1 ? (data[data.length - 1] > data[0] ? 'up' : 'down') : 'neutral';
  const changePercent = data.length > 1 
    ? ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1)
    : '0';

  return (
    <div className={cn('flex items-center justify-between gap-4 p-4', className)}>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </p>
        <p
          className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          )}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {changePercent}%
        </p>
      </div>
      <Sparkline data={data} width={100} height={40} />
    </div>
  );
}
