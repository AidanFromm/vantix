import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://obprrtqyzpaudfeyftyd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ'
);

export async function GET() {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Recent visitors (last 1 hour) for globe dots
    const { data: recent, error: recentError } = await supabase
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

    // Unique countries today
    const { data: countriesData } = await supabase
      .from('site_visitors')
      .select('country')
      .gte('visited_at', todayStart)
      .not('country', 'is', null);

    const uniqueCountries = new Set(countriesData?.map((r) => r.country)).size;

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
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));

    return NextResponse.json({
      visitors: recent || [],
      stats: {
        totalToday: totalToday || 0,
        totalWeek: totalWeek || 0,
        uniqueCountries,
        topPages,
      },
    });
  } catch (error) {
    return NextResponse.json({ visitors: [], stats: { totalToday: 0, totalWeek: 0, uniqueCountries: 0, topPages: [] } });
  }
}
