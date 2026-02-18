import { NextResponse } from 'next/server';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'vantix2024';

const USERS = [
  { email: 'aidan@vantix.com', password: DASHBOARD_PASSWORD, name: 'Aidan', role: 'admin' },
  { email: 'kyle@vantix.com', password: DASHBOARD_PASSWORD, name: 'Kyle', role: 'admin' },
  { email: 'botskii@vantix.com', password: DASHBOARD_PASSWORD, name: 'Botskii', role: 'bot' },
  { email: 'kylebot@vantix.com', password: DASHBOARD_PASSWORD, name: "Kyle's Bot", role: 'bot' },
];

export async function POST(request: Request) {
  try {
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
