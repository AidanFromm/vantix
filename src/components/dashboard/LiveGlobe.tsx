'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Globe as GlobeIcon } from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface Visitor {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  page: string | null;
  visited_at: string;
}

interface VisitorStats {
  totalToday: number;
  totalWeek: number;
  uniqueCountries: number;
  topPages: { page: string; count: number }[];
}

interface PointData {
  lat: number;
  lng: number;
  size: number;
  color: string;
  city: string;
  country: string;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

const HQ_LAT = 40.0583;
const HQ_LNG = -74.4057;

export default function LiveGlobe() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<VisitorStats>({
    totalToday: 0,
    totalWeek: 0,
    uniqueCountries: 0,
    topPages: [],
  });
  const [globeReady, setGlobeReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 350 });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const isMobile = w < 500;
        setDimensions({
          width: w,
          height: isMobile ? Math.min(w, 320) : 400,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors');
      if (!res.ok) return;
      const data = await res.json();
      setVisitors(data.visitors || []);
      setStats(data.stats || { totalToday: 0, totalWeek: 0, uniqueCountries: 0, topPages: [] });
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 10000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  useEffect(() => {
    if (globeRef.current && globeReady) {
      const globe = globeRef.current;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.3;
      globe.controls().enableZoom = false;
      globe.pointOfView({ lat: 25, lng: -40, altitude: 2.5 }, 1000);
    }
  }, [globeReady]);

  const pointsData: PointData[] = useMemo(() => {
    const now = Date.now();
    return visitors.map((v) => {
      const age = now - new Date(v.visited_at).getTime();
      const recency = Math.max(0, 1 - age / (60 * 60 * 1000));
      return {
        lat: v.latitude,
        lng: v.longitude,
        size: 0.4 + recency * 0.6,
        color: `rgba(176, 122, 69, ${0.5 + recency * 0.5})`,
        city: v.city || 'Unknown',
        country: v.country || '',
      };
    });
  }, [visitors]);

  const arcsData: ArcData[] = useMemo(() => {
    return visitors.slice(0, 20).map((v) => ({
      startLat: v.latitude,
      startLng: v.longitude,
      endLat: HQ_LAT,
      endLng: HQ_LNG,
      color: ['rgba(176, 122, 69, 0.8)', 'rgba(176, 122, 69, 0.05)'] as [string, string],
    }));
  }, [visitors]);

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Globe with blended background */}
      <div
        ref={containerRef}
        className="relative w-full flex items-center justify-center"
        style={{
          height: dimensions.height + 'px',
          background: 'radial-gradient(ellipse at 50% 50%, #2a1f14 0%, #1a1510 40%, #EEE6DC 85%)',
        }}
      >
        {/* Live indicator overlay */}
        <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/60 text-[10px] font-medium tracking-wider uppercase">
            {visitors.length > 0
              ? `${visitors.length} live`
              : 'Live'}
          </span>
        </div>

        {visitors.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <p className="text-white/30 text-xs font-medium">Waiting for visitors...</p>
          </div>
        )}

        <Globe
          ref={globeRef}
          onGlobeReady={() => setGlobeReady(true)}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl=""
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#B07A45"
          atmosphereAltitude={0.15}
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointRadius="size"
          pointColor="color"
          pointAltitude={0.01}
          pointsMerge={false}
          arcsData={arcsData}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcDashLength={0.5}
          arcDashGap={0.2}
          arcDashAnimateTime={2500}
          arcStroke={0.6}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>

      {/* Minimal stats — seamlessly below */}
      <div className="flex items-center justify-center gap-6 py-3 bg-[#EEE6DC]">
        <div className="flex items-center gap-1.5">
          <GlobeIcon size={12} className="text-[#B07A45]" />
          <span className="text-[#4B4B4B] text-xs font-medium">{stats.totalToday} today</span>
        </div>
        <span className="text-[#E3D9CD]">|</span>
        <span className="text-[#4B4B4B] text-xs font-medium">{stats.uniqueCountries} countries</span>
        <span className="text-[#E3D9CD]">|</span>
        <span className="text-[#4B4B4B] text-xs font-medium">{stats.totalWeek} this week</span>
      </div>
    </div>
  );
}
