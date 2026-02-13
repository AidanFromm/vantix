'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, 
  TrendingDown,
  TrendingUp,
  Briefcase,
  Users,
  Plus,
  UserPlus,
  FileText,
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface KPIData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendLabel: string;
  sparkline: number[];
  icon: React.ElementType;
  color: string;
}

interface Activity {
  id: string;
  type: 'payment' | 'project' | 'lead' | 'bot' | 'client';
  title: string;
  amount?: string;
  timestamp: Date;
  icon: React.ElementType;
  color: string;
}

interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind';
  client: string;
}

// ============================================================================
// ANIMATED COUNTER COMPONENT
// ============================================================================

function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '',
  duration = 1500 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatted = prefix === '$' 
    ? `${prefix}${displayValue.toLocaleString()}`
    : `${displayValue.toLocaleString()}${suffix}`;

  return <span className="tabular-nums">{formatted}</span>;
}

// ============================================================================
// SPARKLINE COMPONENT
// ============================================================================

function Sparkline({ 
  data, 
  color = '#10b981',
  width = 80,
  height = 32 
}: { 
  data: number[]; 
  color?: string;
  width?: number;
  height?: number;
}) {
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
  const areaPoints = [
    `${padding},${height}`,
    ...points,
    `${width - padding},${height}`,
  ].join(' ');

  const gradientId = `sparkline-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
      <motion.circle
        cx={parseFloat(points[points.length - 1].split(',')[0])}
        cy={parseFloat(points[points.length - 1].split(',')[1])}
        r={3}
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      />
    </svg>
  );
}

// ============================================================================
// KPI CARD COMPONENT
// ============================================================================

function KPICard({ 
  data, 
  index 
}: { 
  data: KPIData; 
  index: number;
}) {
  const Icon = data.icon;
  const isPositive = data.trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden"
    >
      {/* Glass card */}
      <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/20">
        {/* Gradient overlay on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${data.color}10 0%, transparent 60%)` }}
        />
        
        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${data.color}15` }}
              >
                <Icon size={18} style={{ color: data.color }} />
              </div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {data.title}
              </span>
            </div>
            
            {/* Sparkline */}
            <Sparkline 
              data={data.sparkline} 
              color={isPositive ? '#10b981' : '#ef4444'} 
            />
          </div>

          {/* Value */}
          <div className="mb-3">
            <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              <AnimatedNumber 
                value={data.value} 
                prefix={data.prefix} 
                suffix={data.suffix}
                duration={1500 + index * 200}
              />
            </h3>
          </div>

          {/* Trend indicator */}
          <div className="flex items-center gap-2">
            <div 
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              <TrendIcon size={12} />
              <span>{isPositive ? '+' : ''}{data.trend}%</span>
            </div>
            <span className="text-xs text-gray-500">{data.trendLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-white/5 rounded-lg" />
        <div className="h-4 w-48 bg-white/5 rounded-lg" />
      </div>
      
      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-white/5 rounded-2xl" />
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-white/5 rounded-2xl" />
        <div className="h-80 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

// ============================================================================
// REVENUE CHART COMPONENT
// ============================================================================

function RevenueChart({ data }: { data: { month: string; revenue: number; expenses: number }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden"
    >
      {/* Gradient glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <BarChart3 size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue Trend</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-gray-400">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: '8px' }}
                itemStyle={{ color: '#9ca3af', fontSize: '12px' }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#expensesGradient)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// ACTIVITY FEED COMPONENT
// ============================================================================

function ActivityFeed({ activities }: { activities: Activity[] }) {
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Sparkles size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <p className="text-xs text-gray-500">What's happening in your business</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1 max-h-[320px] overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <div 
                  className="p-2 rounded-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  <Icon size={14} style={{ color: activity.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                    {activity.title}
                  </p>
                  {activity.amount && (
                    <p className="text-xs text-emerald-400 font-medium">{activity.amount}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================================
// PROJECTS CARD COMPONENT
// ============================================================================

function ProjectsCard({ projects }: { projects: Project[] }) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'on-track': return { dot: 'bg-emerald-400', bar: 'bg-emerald-500' };
      case 'at-risk': return { dot: 'bg-yellow-400', bar: 'bg-yellow-500' };
      case 'behind': return { dot: 'bg-red-400', bar: 'bg-red-500' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10">
            <Briefcase size={18} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Active Projects</h3>
            <p className="text-xs text-gray-500">{projects.length} in progress</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {projects.map((project, index) => {
          const colors = getStatusColor(project.status);
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-white">{project.progress}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${colors.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-2">{project.client}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// QUICK ACTIONS COMPONENT
// ============================================================================

function QuickActions() {
  const actions = [
    { label: 'New Project', icon: Plus, color: '#10b981' },
    { label: 'Add Lead', icon: UserPlus, color: '#3b82f6' },
    { label: 'Create Invoice', icon: FileText, color: '#8b5cf6' },
    { label: 'View Reports', icon: BarChart3, color: '#f59e0b' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10">
            <Zap size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            <p className="text-xs text-gray-500">Get things done fast</p>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.08 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all"
            >
              <div 
                className="p-2 rounded-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <Icon size={14} style={{ color: action.color }} />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');

  // Sample KPI data
  const kpiData: KPIData[] = useMemo(() => [
    {
      title: 'Revenue',
      value: 45200,
      prefix: '$',
      trend: 12.5,
      trendLabel: 'vs last month',
      sparkline: [28000, 32000, 35000, 38000, 41000, 45200],
      icon: DollarSign,
      color: '#10b981',
    },
    {
      title: 'Expenses',
      value: 12300,
      prefix: '$',
      trend: -3.2,
      trendLabel: 'vs last month',
      sparkline: [14000, 13500, 13000, 12800, 12500, 12300],
      icon: TrendingDown,
      color: '#ef4444',
    },
    {
      title: 'Profit',
      value: 32900,
      prefix: '$',
      trend: 18.7,
      trendLabel: 'vs last month',
      sparkline: [18000, 22000, 25000, 28000, 30000, 32900],
      icon: TrendingUp,
      color: '#8b5cf6',
    },
    {
      title: 'Active',
      value: 5,
      suffix: ' projects',
      trend: 25,
      trendLabel: '2 clients',
      sparkline: [2, 3, 3, 4, 4, 5],
      icon: Briefcase,
      color: '#3b82f6',
    },
  ], []);

  // Revenue chart data
  const chartData = useMemo(() => [
    { month: 'Aug', revenue: 28000, expenses: 8500 },
    { month: 'Sep', revenue: 32000, expenses: 9200 },
    { month: 'Oct', revenue: 35000, expenses: 10100 },
    { month: 'Nov', revenue: 38000, expenses: 11000 },
    { month: 'Dec', revenue: 41000, expenses: 11800 },
    { month: 'Jan', revenue: 45200, expenses: 12300 },
  ], []);

  // Activity data
  const activities: Activity[] = useMemo(() => [
    { 
      id: '1', 
      type: 'payment', 
      title: 'Invoice paid', 
      amount: '$2,400',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: CheckCircle2,
      color: '#10b981',
    },
    { 
      id: '2', 
      type: 'project', 
      title: 'New project started', 
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: Briefcase,
      color: '#3b82f6',
    },
    { 
      id: '3', 
      type: 'lead', 
      title: 'Lead converted', 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: Users,
      color: '#8b5cf6',
    },
    { 
      id: '4', 
      type: 'bot', 
      title: 'Bot completed task', 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      icon: Zap,
      color: '#f59e0b',
    },
    { 
      id: '5', 
      type: 'payment', 
      title: 'Payment received', 
      amount: '$5,800',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      icon: DollarSign,
      color: '#10b981',
    },
  ], []);

  // Projects data
  const projects: Project[] = useMemo(() => [
    { id: '1', name: 'Dave App', progress: 90, status: 'on-track', client: 'Dave Martinez' },
    { id: '2', name: 'CardLedger', progress: 65, status: 'at-risk', client: 'Kyle Johnson' },
    { id: '3', name: 'J4K Update', progress: 30, status: 'behind', client: 'J4K Sneakers' },
  ], []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const user = localStorage.getItem('vantix_user');
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.name?.split(' ')[0] || 'there');
    }

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {userName}
            </span>
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, delay: 0.5 }}
            >
              👋
            </motion.span>
          </h1>
          <p className="text-gray-500 mt-1">Here's your business at a glance</p>
        </div>
        
        {/* Today's date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((data, index) => (
          <KPICard key={data.title} data={data} index={index} />
        ))}
      </div>

      {/* Main content grid - Revenue Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Bottom grid - Projects + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectsCard projects={projects} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
