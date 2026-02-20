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

// Vantix HQ - New Jersey
const HQ_LAT = 40.0583;
const HQ_LNG = -74.4057;

export default function LiveGlobe() {
  const globeRef = useRef<any>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<VisitorStats>({
    totalToday: 0,
    totalWeek: 0,
    uniqueCountries: 0,
    topPages: [],
  });
  const [globeReady, setGlobeReady] = useState(false);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors');
      if (!res.ok) return;
      const data = await res.json();
      setVisitors(data.visitors || []);
      setStats(data.stats || { totalToday: 0, totalWeek: 0, uniqueCountries: 0, topPages: [] });
    } catch {
      // Silently fail — globe shows empty state
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
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = true;
      globe.pointOfView({ lat: 30, lng: -20, altitude: 2.2 }, 1000);
    }
  }, [globeReady]);

  const pointsData: PointData[] = useMemo(() => {
    const now = Date.now();
    return visitors.map((v) => {
      const age = now - new Date(v.visited_at).getTime();
      const recency = Math.max(0, 1 - age / (60 * 60 * 1000)); // 0-1 over 1 hour
      return {
        lat: v.latitude,
        lng: v.longitude,
        size: 0.3 + recency * 0.7,
        color: `rgba(0, 210, 230, ${0.4 + recency * 0.6})`,
        city: v.city || 'Unknown',
        country: v.country || '',
      };
    });
  }, [visitors]);

  const arcsData: ArcData[] = useMemo(() => {
    return visitors.slice(0, 30).map((v) => ({
      startLat: v.latitude,
      startLng: v.longitude,
      endLat: HQ_LAT,
      endLng: HQ_LNG,
      color: ['rgba(176, 122, 69, 0.6)', 'rgba(176, 122, 69, 0.1)'] as [string, string],
    }));
  }, [visitors]);

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <GlobeIcon size={16} className="text-[#B07A45]" />
          <h3 className="text-[#1C1C1C] font-bold text-sm">Live Visitors</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[#7A746C] text-xs">
            {visitors.length > 0
              ? `${visitors.length} visitor${visitors.length !== 1 ? 's' : ''} right now`
              : 'Monitoring'}
          </span>
        </div>
      </div>

      {/* Globe Container */}
      <div className="relative w-full" style={{ height: '420px', background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 70%)', borderRadius: '0' }}>
        {visitors.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <p className="text-white/40 text-sm font-medium">No visitors yet</p>
          </div>
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
          arcsData={arcsData}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcDashLength={0.6}
          arcDashGap={0.15}
          arcDashAnimateTime={2000}
          arcStroke={0.8}
          width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 80, 900) : 800}
          height={420}
        />
      </div>

      {/* Clean Stats Row */}
      <div className="flex items-center justify-around px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[#1C1C1C] text-base font-bold">{stats.totalToday}</span>
          <span className="text-[#7A746C] text-xs">today</span>
        </div>
        <div className="w-px h-4 bg-[#E3D9CD]" />
        <div className="flex items-center gap-2">
          <span className="text-[#1C1C1C] text-base font-bold">{stats.uniqueCountries}</span>
          <span className="text-[#7A746C] text-xs">countries</span>
        </div>
        <div className="w-px h-4 bg-[#E3D9CD]" />
        <div className="flex items-center gap-2">
          <span className="text-[#1C1C1C] text-base font-bold">{stats.totalWeek}</span>
          <span className="text-[#7A746C] text-xs">this week</span>
        </div>
      </div>
    </div>
  );
}
