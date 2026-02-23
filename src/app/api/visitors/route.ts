import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://obprrtqyzpaudfeyftyd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ'
);

function parseDevice(ua: string | null): string {
  if (!ua) return 'Unknown';
  const lower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(lower)) return 'Tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(lower)) return 'Mobile';
  return 'Desktop';
}

function parseBrowser(ua: string | null): string {
  if (!ua) return 'Unknown';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return 'Other';
}

export async function GET() {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // Recent visitors (last 1 hour) for globe dots
    const { data: recent } = await supabase
      .from('site_visitors')
      .select('latitude, longitude, city, country, page, visited_at')
      .gte('visited_at', oneHourAgo)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('visited_at', { ascending: false })
      .limit(200);

    // Total today
    const { count: totalToday } = await supabase
      .from('site_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', todayStart);

    // Total this week
    const { count: totalWeek } = await supabase
      .from('site_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', weekAgo);

    // Active now (last 5 min)
    const { count: activeNow } = await supabase
      .from('site_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', fiveMinAgo);

    // Unique countries today
    const { data: countriesData } = await supabase
      .from('site_visitors')
      .select('country')
      .gte('visited_at', todayStart)
      .not('country', 'is', null);

    const countryMap: Record<string, number> = {};
    countriesData?.forEach((r) => {
      if (r.country) countryMap[r.country] = (countryMap[r.country] || 0) + 1;
    });
    const uniqueCountries = Object.keys(countryMap).length;
    const countryBreakdown = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([country, count]) => ({ country, count }));

    // Top pages today
    const { data: pagesData } = await supabase
      .from('site_visitors')
      .select('page')
      .gte('visited_at', todayStart);

    const pageCounts: Record<string, number> = {};
    pagesData?.forEach((r) => {
      if (r.page) pageCounts[r.page] = (pageCounts[r.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Hourly data (last 24 hours)
    const { data: hourlyRaw } = await supabase
      .from('site_visitors')
      .select('visited_at')
      .gte('visited_at', twentyFourHoursAgo);

    const hourlyData = new Array(24).fill(0);
    hourlyRaw?.forEach((r) => {
      const hour = new Date(r.visited_at).getHours();
      hourlyData[hour]++;
    });

    // Referrer breakdown
    const { data: referrerRaw } = await supabase
      .from('site_visitors')
      .select('referrer')
      .gte('visited_at', todayStart)
      .not('referrer', 'is', null);

    const referrerMap: Record<string, number> = {};
    referrerRaw?.forEach((r) => {
      const ref = r.referrer || 'Direct';
      referrerMap[ref] = (referrerMap[ref] || 0) + 1;
    });
    const referrerBreakdown = Object.entries(referrerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Device breakdown
    const { data: deviceRaw } = await supabase
      .from('site_visitors')
      .select('user_agent')
      .gte('visited_at', todayStart);

    const deviceMap: Record<string, number> = {};
    deviceRaw?.forEach((r) => {
      const device = parseDevice(r.user_agent);
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    const deviceBreakdown = Object.entries(deviceMap)
      .sort((a, b) => b[1] - a[1])
      .map(([device, count]) => ({ device, count }));

    // Recent detailed (last 50 with all fields)
    const { data: recentDetailed } = await supabase
      .from('site_visitors')
      .select('ip, city, region, country, latitude, longitude, page, user_agent, referrer, visited_at')
      .order('visited_at', { ascending: false })
      .limit(50);

    // Parse browser/device into recentDetailed
    const recentDetailedParsed = (recentDetailed || []).map((v) => ({
      ...v,
      device: parseDevice(v.user_agent),
      browser: parseBrowser(v.user_agent),
    }));

    return NextResponse.json({
      visitors: recent || [],
      stats: {
        totalToday: totalToday || 0,
        totalWeek: totalWeek || 0,
        uniqueCountries,
        activeNow: activeNow || 0,
        topPages,
      },
      countryBreakdown,
      hourlyData,
      referrerBreakdown,
      deviceBreakdown,
      recentDetailed: recentDetailedParsed,
    });
  } catch (error) {
    return NextResponse.json({
      visitors: [],
      stats: { totalToday: 0, totalWeek: 0, uniqueCountries: 0, activeNow: 0, topPages: [] },
      countryBreakdown: [],
      hourlyData: new Array(24).fill(0),
      referrerBreakdown: [],
      deviceBreakdown: [],
      recentDetailed: [],
    });
  }
}
