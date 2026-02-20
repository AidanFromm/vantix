import { NextResponse } from 'next/server';

// Password MUST be set via environment variable - no fallback for security
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;

if (!DASHBOARD_PASSWORD) {
  console.error('CRITICAL: DASHBOARD_PASSWORD environment variable is not set');
}

const USERS = [
  { email: 'aidan@vantix.com', password: DASHBOARD_PASSWORD, name: 'Aidan', role: 'admin' },
  { email: 'kyle@vantix.com', password: DASHBOARD_PASSWORD, name: 'Kyle', role: 'admin' },
  { email: 'botskii@vantix.com', password: DASHBOARD_PASSWORD, name: 'Botskii', role: 'bot' },
  { email: 'kylebot@vantix.com', password: DASHBOARD_PASSWORD, name: "Kyle's Bot", role: 'bot' },
];

export async function POST(request: Request) {
  try {
    // Security check: ensure password is configured
    if (!DASHBOARD_PASSWORD) {
      console.error('Login attempted but DASHBOARD_PASSWORD not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { email, password } = await request.json();

    const user = USERS.find(
      (u) => u.email.toLowerCase() === email?.toLowerCase() && u.password === password
    );

    if (user) {
      const { password: _, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
