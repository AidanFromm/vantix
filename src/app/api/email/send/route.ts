import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_cYnijget_FyAroQA3mF9U9qD4jX4Z75wf';
const DEFAULT_FROM = 'Vantix <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const { to, subject, html, from } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: from || DEFAULT_FROM,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to send email' }, { status: res.status });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Email route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
