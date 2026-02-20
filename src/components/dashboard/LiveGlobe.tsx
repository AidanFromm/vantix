'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe from 'cobe';
import { Globe as GlobeIcon } from 'lucide-react';

interface Visitor {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  visited_at: string;
}

interface VisitorStats {
  totalToday: number;
  totalWeek: number;
  uniqueCountries: number;
}

export default function LiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const markersRef = useRef<{ location: [number, number]; size: number }[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<VisitorStats>({ totalToday: 0, totalWeek: 0, uniqueCountries: 0 });

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors');
      if (!res.ok) return;
      const data = await res.json();
      const v = data.visitors || [];
      setVisitors(v);
      setStats(data.stats || { totalToday: 0, totalWeek: 0, uniqueCountries: 0 });
      
      // Update markers for cobe
      const now = Date.now();
      markersRef.current = v.map((vis: Visitor) => {
        const age = now - new Date(vis.visited_at).getTime();
        const recency = Math.max(0.03, (1 - age / (3600000)) * 0.12);
        return { location: [vis.latitude, vis.longitude] as [number, number], size: recency };
      });

      // Add HQ marker
      markersRef.current.push({ location: [40.0583, -74.4057], size: 0.06 });
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 10000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 6,
      baseColor: [0.15, 0.12, 0.1],
      markerColor: [0.69, 0.48, 0.27],
      glowColor: [0.18, 0.15, 0.12],
      markers: markersRef.current,
      scale: 1.05,
      offset: [0, 0],
      onRender: (state) => {
        // Auto rotate unless user is dragging
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.markers = markersRef.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    globeRef.current = globe;

    // Fade in
    if (canvasRef.current) {
      canvasRef.current.style.opacity = '0';
      canvasRef.current.style.transition = 'opacity 1s ease';
      setTimeout(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = '1';
      }, 100);
    }

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden bg-[#EEE6DC] border border-[#E3D9CD] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <GlobeIcon size={14} className="text-[#B07A45]" />
          <span className="text-[#1C1C1C] font-semibold text-sm">Live Visitors</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[#7A746C] text-[11px]">
            {visitors.length > 0 ? `${visitors.length} active` : 'Monitoring'}
          </span>
        </div>
      </div>

      {/* Globe */}
      <div className="relative flex items-center justify-center mx-4" style={{ aspectRatio: '1' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ maxWidth: '100%', contain: 'layout paint size' }}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta / 200;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta / 100;
            }
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-5 px-4 py-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm text-[#1C1C1C]">{stats.totalToday}</span>
          <span className="text-[#7A746C]">today</span>
        </div>
        <div className="w-px h-3 bg-[#D8C2A8]" />
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm text-[#1C1C1C]">{stats.uniqueCountries}</span>
          <span className="text-[#7A746C]">countries</span>
        </div>
        <div className="w-px h-3 bg-[#D8C2A8]" />
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm text-[#1C1C1C]">{stats.totalWeek}</span>
          <span className="text-[#7A746C]">this week</span>
        </div>
      </div>
    </div>
  );
}
