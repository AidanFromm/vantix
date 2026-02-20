import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPABASE_URL = 'https://obprrtqyzpaudfeyftyd.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ';

// Rate limit: one log per IP per 5 minutes
const recentIPs = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000;

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, ts] of recentIPs) {
    if (now - ts > RATE_LIMIT_MS) recentIPs.delete(ip);
  }
}, 10 * 60 * 1000);

const SKIP_PATHS = /^\/(api|_next|favicon\.ico|robots\.txt|sitemap\.xml|.*\.\w{2,4}$)/;
const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegram|pingdom|uptimerobot/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/api paths
  if (SKIP_PATHS.test(pathname)) return NextResponse.next();

  const ua = request.headers.get('user-agent') || '';
  if (BOT_RE.test(ua)) return NextResponse.next();

  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limit
  const lastSeen = recentIPs.get(ip);
  if (lastSeen && Date.now() - lastSeen < RATE_LIMIT_MS) return NextResponse.next();
  recentIPs.set(ip, Date.now());

  // Extract Vercel geo headers
  const city = request.headers.get('x-vercel-ip-city') || null;
  const country = request.headers.get('x-vercel-ip-country') || null;
  const latitude = request.headers.get('x-vercel-ip-latitude');
  const longitude = request.headers.get('x-vercel-ip-longitude');
  const region = request.headers.get('x-vercel-ip-country-region') || null;

  // Fire-and-forget POST to Supabase
  fetch(`${SUPABASE_URL}/rest/v1/site_visitors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      ip,
      city: city ? decodeURIComponent(city) : null,
      region,
      country,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      page: pathname,
      user_agent: ua.slice(0, 500),
      referrer: request.headers.get('referer')?.slice(0, 500) || null,
    }),
  }).catch(() => {});

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
