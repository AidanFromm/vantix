'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Globe as GlobeIcon,
  Users,
  MapPin,
  TrendingUp,
  TrendingDown,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Clock,
} from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────
interface Visitor {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  page: string | null;
  visited_at: string;
}

interface DetailedVisitor {
  ip: string;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  page: string | null;
  user_agent: string | null;
  referrer: string | null;
  visited_at: string;
  device: string;
  browser: string;
}

interface ApiData {
  visitors: Visitor[];
  stats: {
    totalToday: number;
    totalWeek: number;
    uniqueCountries: number;
    activeNow: number;
    topPages: { page: string; count: number }[];
  };
  countryBreakdown: { country: string; count: number }[];
  hourlyData: number[];
  referrerBreakdown: { referrer: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  recentDetailed: DetailedVisitor[];
}

const HQ_LAT = 40.0583;
const HQ_LNG = -74.4057;

// ─── Helpers ─────────────────────────────────────────────────────────
function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function countryToFlag(code: string | null): string {
  if (!code || code.length !== 2) return '🌍';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

// ─── Mini Sparkline SVG ──────────────────────────────────────────────
function Sparkline({ data, color = '#B07A45' }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

// ─── Mini Bar Chart ──────────────────────────────────────────────────
function MiniBarChart({ data, labels }: { data: number[]; labels?: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px] h-[100px]">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all duration-300"
            style={{
              height: `${Math.max((v / max) * 80, 2)}px`,
              background: `linear-gradient(to top, #B07A45, #D4A574)`,
              opacity: 0.7 + (v / max) * 0.3,
            }}
          />
          {labels && (
            <span className="text-[8px] text-[#A39B90]">{labels[i]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────
export default function TrackingPage() {
  const globeRef = useRef<any>(null);
  const [data, setData] = useState<ApiData | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Visitor | null>(null);
  const [tablePage, setTablePage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'visited_at' | 'city' | 'page' | 'device'>('visited_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [globeDimensions, setGlobeDimensions] = useState({ width: 800, height: 650 });
  const globeContainerRef = useRef<HTMLDivElement>(null);

  const PER_PAGE = 20;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors');
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Globe resize
  useEffect(() => {
    const updateSize = () => {
      if (globeContainerRef.current) {
        const rect = globeContainerRef.current.getBoundingClientRect();
        setGlobeDimensions({ width: rect.width, height: Math.max(rect.height, 600) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current && globeReady) {
      const g = globeRef.current;
      g.controls().autoRotate = true;
      g.controls().autoRotateSpeed = 0.3;
      g.controls().enableZoom = true;
      g.controls().minDistance = 150;
      g.controls().maxDistance = 600;
      g.pointOfView({ lat: 25, lng: -20, altitude: 2.2 }, 1500);
    }
  }, [globeReady]);

  const pointsData = useMemo(() => {
    if (!data) return [];
    const now = Date.now();
    return data.visitors.map((v) => {
      const age = now - new Date(v.visited_at).getTime();
      const recency = Math.max(0, 1 - age / 3600000);
      return {
        lat: v.latitude,
        lng: v.longitude,
        size: 0.4 + recency * 0.6,
        color: `rgba(176, 122, 69, ${0.5 + recency * 0.5})`,
        city: v.city,
        country: v.country,
        page: v.page,
        visited_at: v.visited_at,
      };
    });
  }, [data]);

  const arcsData = useMemo(() => {
    if (!data) return [];
    return data.visitors.slice(0, 30).map((v) => ({
      startLat: v.latitude,
      startLng: v.longitude,
      endLat: HQ_LAT,
      endLng: HQ_LNG,
      color: ['rgba(212, 165, 116, 0.8)', 'rgba(176, 122, 69, 0.15)'] as [string, string],
    }));
  }, [data]);

  // Table data
  const filteredVisitors = useMemo(() => {
    if (!data) return [];
    let list = [...data.recentDetailed];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          (v.city && v.city.toLowerCase().includes(q)) ||
          (v.country && v.country.toLowerCase().includes(q)) ||
          (v.page && v.page.toLowerCase().includes(q)) ||
          (v.device && v.device.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [data, searchQuery, sortField, sortDir]);

  const totalTablePages = Math.ceil(filteredVisitors.length / PER_PAGE);
  const pagedVisitors = filteredVisitors.slice(tablePage * PER_PAGE, (tablePage + 1) * PER_PAGE);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const hourLabels = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const h = i % 12 || 12;
      return i < 12 ? `${h}a` : `${h}p`;
    });
  }, []);

  const stats = data?.stats;
  const kpis = [
    {
      label: 'Visitors Today',
      value: stats?.totalToday ?? 0,
      icon: Users,
      sparkData: data?.hourlyData || [],
    },
    {
      label: 'Unique Countries',
      value: stats?.uniqueCountries ?? 0,
      icon: MapPin,
      sparkData: data?.countryBreakdown?.slice(0, 8).map((c) => c.count) || [],
    },
    {
      label: 'This Week',
      value: stats?.totalWeek ?? 0,
      icon: TrendingUp,
      sparkData: data?.hourlyData || [],
    },
    {
      label: 'Active Now',
      value: stats?.activeNow ?? 0,
      icon: Zap,
      sparkData: [],
      pulse: true,
    },
  ];

  const deviceIcon = (d: string) => {
    if (d === 'Mobile') return <Smartphone size={14} className="text-[#B07A45]" />;
    if (d === 'Tablet') return <Tablet size={14} className="text-[#B07A45]" />;
    return <Monitor size={14} className="text-[#B07A45]" />;
  };

  return (
    <div className="min-h-screen bg-[#F4EFE8]">
      {/* ── HERO GLOBE ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-2xl overflow-hidden mx-auto"
        style={{ background: '#0a0a0a' }}
      >
        <div ref={globeContainerRef} className="relative w-full" style={{ height: '650px' }}>
          {/* LIVE badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            </div>
            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">Live</span>
          </div>

          {/* Visitor count overlay */}
          <div className="absolute top-5 right-5 z-20 bg-black/50 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Last Hour</p>
            <p className="text-white text-2xl font-bold mt-0.5" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
              {data?.visitors.length ?? 0} <span className="text-sm text-white/40 font-normal">visitors</span>
            </p>
          </div>

          {/* Tooltip */}
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-5 left-5 z-20 bg-black/70 backdrop-blur-md rounded-xl px-5 py-4 border border-[#B07A45]/30 max-w-xs"
            >
              <button onClick={() => setSelectedPoint(null)} className="absolute top-2 right-3 text-white/40 hover:text-white text-xs">✕</button>
              <p className="text-white font-semibold text-sm">
                {countryToFlag(selectedPoint.country)} {selectedPoint.city || 'Unknown'}{selectedPoint.country ? `, ${selectedPoint.country}` : ''}
              </p>
              <p className="text-white/50 text-xs mt-1">Page: {selectedPoint.page || '/'}</p>
              <p className="text-white/50 text-xs">Time: {timeAgo(selectedPoint.visited_at)}</p>
            </motion.div>
          )}

          <Globe
            ref={globeRef}
            onGlobeReady={() => setGlobeReady(true)}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl=""
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#B07A45"
            atmosphereAltitude={0.18}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointRadius="size"
            pointColor="color"
            pointAltitude={0.01}
            pointsMerge={false}
            onPointClick={(point: any) => {
              setSelectedPoint({
                latitude: point.lat,
                longitude: point.lng,
                city: point.city,
                country: point.country,
                page: point.page,
                visited_at: point.visited_at,
              });
            }}
            arcsData={arcsData}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcDashLength={0.5}
            arcDashGap={0.2}
            arcDashAnimateTime={2500}
            arcStroke={1.2}
            width={globeDimensions.width}
            height={globeDimensions.height}
          />
        </div>
      </motion.div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative bg-[#EEE6DC] rounded-xl p-5 border border-[#E3D9CD] overflow-hidden"
            >
              {/* Bronze gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B07A45] via-[#D4A574] to-[#B07A45]" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#B07A45]/10 flex items-center justify-center">
                  <Icon size={18} className="text-[#B07A45]" />
                </div>
                {kpi.pulse && (
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    </div>
                    <span className="text-[10px] text-green-600 font-medium">Live</span>
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
                {kpi.value.toLocaleString()}
              </p>
              <p className="text-xs text-[#7A746C] mt-1">{kpi.label}</p>
              {kpi.sparkData.length > 2 && (
                <div className="mt-3">
                  <Sparkline data={kpi.sparkData} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── THIRD ROW: Table + Analytics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        {/* LEFT: Visitor Table (3/5) */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="lg:col-span-3 bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] overflow-hidden"
        >
          <div className="p-5 border-b border-[#E3D9CD]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#1C1C1C] font-bold text-base" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
                Recent Visitors
              </h3>
              <span className="text-xs text-[#A39B90]">{filteredVisitors.length} total</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A39B90]" />
              <input
                type="text"
                placeholder="Search by location, page, device..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setTablePage(0); }}
                className="w-full pl-9 pr-4 py-2 bg-[#F4EFE8] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] placeholder:text-[#A39B90] focus:outline-none focus:border-[#B07A45]/50 transition-colors"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-[#A39B90] border-b border-[#E3D9CD]">
                  <th className="px-5 py-3 cursor-pointer hover:text-[#B07A45] transition-colors" onClick={() => toggleSort('city')}>
                    Location {sortField === 'city' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 cursor-pointer hover:text-[#B07A45] transition-colors" onClick={() => toggleSort('page')}>
                    Page {sortField === 'page' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 cursor-pointer hover:text-[#B07A45] transition-colors" onClick={() => toggleSort('device')}>
                    Device {sortField === 'device' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 cursor-pointer hover:text-[#B07A45] transition-colors" onClick={() => toggleSort('visited_at')}>
                    Time {sortField === 'visited_at' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedVisitors.map((v, i) => (
                  <tr key={i} className="border-b border-[#E3D9CD]/50 hover:bg-[#F4EFE8] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{countryToFlag(v.country)}</span>
                        <span className="text-[#1C1C1C] font-medium">{v.city || 'Unknown'}</span>
                        {v.country && <span className="text-[#A39B90] text-xs">{v.country}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#7A746C] font-mono text-xs">{v.page || '/'}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        {deviceIcon(v.device)}
                        <span className="text-[#7A746C] text-xs">{v.browser}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#A39B90] text-xs whitespace-nowrap">{timeAgo(v.visited_at)}</td>
                  </tr>
                ))}
                {pagedVisitors.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[#A39B90] text-sm">
                      No visitors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalTablePages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3D9CD]">
              <span className="text-xs text-[#A39B90]">Page {tablePage + 1} of {totalTablePages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTablePage((p) => Math.max(0, p - 1))}
                  disabled={tablePage === 0}
                  className="p-1.5 rounded-md bg-[#F4EFE8] border border-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setTablePage((p) => Math.min(totalTablePages - 1, p + 1))}
                  disabled={tablePage >= totalTablePages - 1}
                  className="p-1.5 rounded-md bg-[#F4EFE8] border border-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* RIGHT: Analytics Stack (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Countries */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] p-5">
            <h4 className="text-[#1C1C1C] font-bold text-sm mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
              Top Countries
            </h4>
            <div className="space-y-2.5">
              {(data?.countryBreakdown || []).slice(0, 8).map((c, i) => {
                const maxCount = data?.countryBreakdown?.[0]?.count || 1;
                return (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{countryToFlag(c.country)}</span>
                    <span className="text-xs text-[#1C1C1C] font-medium w-8">{c.country}</span>
                    <div className="flex-1 h-2 bg-[#F4EFE8] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(to right, #B07A45, #D4A574)' }}
                      />
                    </div>
                    <span className="text-xs text-[#A39B90] w-8 text-right">{c.count}</span>
                  </div>
                );
              })}
              {(!data?.countryBreakdown || data.countryBreakdown.length === 0) && (
                <p className="text-[#A39B90] text-xs">No data yet</p>
              )}
            </div>
          </motion.div>

          {/* Top Pages */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] p-5">
            <h4 className="text-[#1C1C1C] font-bold text-sm mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
              Top Pages
            </h4>
            <div className="space-y-2">
              {(data?.stats.topPages || []).slice(0, 8).map((p) => (
                <div key={p.page} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <ExternalLink size={12} className="text-[#B07A45] shrink-0" />
                    <span className="text-xs text-[#1C1C1C] font-mono truncate">{p.page}</span>
                  </div>
                  <span className="text-xs text-[#A39B90] ml-2 shrink-0">{p.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Traffic by Hour */}
          <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] p-5">
            <h4 className="text-[#1C1C1C] font-bold text-sm mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
              Traffic by Hour
            </h4>
            <MiniBarChart data={data?.hourlyData || new Array(24).fill(0)} labels={hourLabels} />
          </motion.div>

          {/* Referrer Sources */}
          <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] p-5">
            <h4 className="text-[#1C1C1C] font-bold text-sm mb-4" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
              Referrer Sources
            </h4>
            <div className="space-y-2">
              {(data?.referrerBreakdown || []).slice(0, 6).map((r) => (
                <div key={r.referrer} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-[#1C1C1C] truncate max-w-[200px]">{r.referrer || 'Direct'}</span>
                  <span className="text-xs font-semibold text-[#B07A45] ml-2">{r.count}</span>
                </div>
              ))}
              {(!data?.referrerBreakdown || data.referrerBreakdown.length === 0) && (
                <p className="text-[#A39B90] text-xs">No referrer data</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── FOURTH ROW: Timeline ── */}
      <motion.div
        custom={10}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-6 bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#1C1C1C] font-bold text-base" style={{ fontFamily: 'var(--font-clash, sans-serif)' }}>
            Visitor Timeline — Last 24 Hours
          </h3>
          <div className="flex items-center gap-1.5 text-[#A39B90]">
            <Clock size={12} />
            <span className="text-xs">Updated live</span>
          </div>
        </div>
        <div className="h-[120px]">
          <TimelineChart data={data?.hourlyData || new Array(24).fill(0)} />
        </div>
      </motion.div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}

// ─── Timeline Chart (SVG area chart) ─────────────────────────────────
function TimelineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const w = 1000;
  const h = 110;
  const pad = 2;

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - (v / max) * (h - pad * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B07A45" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#B07A45" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#timelineGrad)" />
      <path d={linePath} fill="none" stroke="#B07A45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#B07A45" opacity={data[i] > 0 ? 0.8 : 0.2} />
          <text x={p.x} y={h - 0} textAnchor="middle" className="text-[9px]" fill="#A39B90">
            {i % 3 === 0 ? `${i % 12 || 12}${i < 12 ? 'a' : 'p'}` : ''}
          </text>
        </g>
      ))}
    </svg>
  );
}
