'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Globe as GlobeIcon, Users, MapPin, Clock, Eye } from 'lucide-react';

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
  label: string;
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

function formatTime(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
      // silent
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
      globe.controls().minDistance = 180;
      globe.controls().maxDistance = 500;
      globe.pointOfView({ lat: 30, lng: -40, altitude: 2.0 }, 1000);
    }
  }, [globeReady]);

  const pointsData: PointData[] = useMemo(() => {
    const now = Date.now();
    return visitors.map((v) => {
      const age = now - new Date(v.visited_at).getTime();
      const recency = Math.max(0, 1 - age / (3600000));
      return {
        lat: v.latitude,
        lng: v.longitude,
        size: 0.3 + recency * 0.5,
        color: `rgba(255, 180, 80, ${0.6 + recency * 0.4})`,
        label: `${v.city || 'Unknown'}${v.country ? ', ' + v.country : ''}`,
      };
    });
  }, [visitors]);

  const arcsData: ArcData[] = useMemo(() => {
    return visitors.slice(0, 20).map((v) => ({
      startLat: v.latitude,
      startLng: v.longitude,
      endLat: HQ_LAT,
      endLng: HQ_LNG,
      color: ['rgba(255, 200, 120, 0.9)', 'rgba(176, 122, 69, 0.2)'] as [string, string],
    }));
  }, [visitors]);

  // Recent visitors for the feed
  const recentVisitors = visitors.slice(0, 5);

  // Last updated timestamp
  const lastUpdate = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* LEFT — Globe */}
        <div className="relative lg:w-[280px] xl:w-[320px] shrink-0 flex items-center justify-center bg-[#0a0a12] rounded-xl lg:m-3 overflow-hidden"
          style={{ minHeight: '260px' }}
        >
          {/* Live badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-[10px] font-medium tracking-wide uppercase">Live</span>
          </div>

          <Globe
            ref={globeRef}
            onGlobeReady={() => setGlobeReady(true)}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl=""
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#B07A45"
            atmosphereAltitude={0.2}
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
            arcDashAnimateTime={2000}
            arcStroke={1.5}
            width={300}
            height={260}
          />
        </div>

        {/* RIGHT — Stats & Feed */}
        <div className="flex-1 p-4 lg:p-5 flex flex-col justify-between min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GlobeIcon size={14} className="text-[#B07A45]" />
              <h3 className="text-[#1C1C1C] font-bold text-sm">Site Activity</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[#7A746C]">
              <Clock size={11} />
              <span className="text-[10px]">Updated {lastUpdate}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2.5 bg-[#F4EFE8] rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye size={12} className="text-[#B07A45]" />
              </div>
              <p className="text-[#1C1C1C] text-lg font-bold leading-none">{stats.totalToday}</p>
              <p className="text-[#7A746C] text-[10px] mt-0.5">Today</p>
            </div>
            <div className="text-center p-2.5 bg-[#F4EFE8] rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin size={12} className="text-[#B07A45]" />
              </div>
              <p className="text-[#1C1C1C] text-lg font-bold leading-none">{stats.uniqueCountries}</p>
              <p className="text-[#7A746C] text-[10px] mt-0.5">Countries</p>
            </div>
            <div className="text-center p-2.5 bg-[#F4EFE8] rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={12} className="text-[#B07A45]" />
              </div>
              <p className="text-[#1C1C1C] text-lg font-bold leading-none">{stats.totalWeek}</p>
              <p className="text-[#7A746C] text-[10px] mt-0.5">This Week</p>
            </div>
          </div>

          {/* Recent Visitors Feed */}
          <div>
            <p className="text-[#7A746C] text-[10px] font-semibold uppercase tracking-wider mb-2">Recent Visitors</p>
            <div className="space-y-1.5">
              {recentVisitors.length > 0 ? recentVisitors.map((v, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B07A45] shrink-0" />
                  <span className="text-[#1C1C1C] font-medium truncate">
                    {v.city || 'Unknown'}{v.country ? `, ${v.country}` : ''}
                  </span>
                  <span className="text-[#A39B90] ml-auto shrink-0 text-[10px]">
                    {v.page || '/'}
                  </span>
                  <span className="text-[#A39B90] shrink-0 text-[10px]">
                    {formatTime(v.visited_at)}
                  </span>
                </div>
              )) : (
                <p className="text-[#A39B90] text-xs">No visitors yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
