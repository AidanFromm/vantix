import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Use /tmp on Vercel (writable in serverless), fallback to data/ locally
const TMP_DIR = join('/tmp', 'vantix-data');
const LOCAL_DIR = join(process.cwd(), 'data');
const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel ? TMP_DIR : LOCAL_DIR;

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function getBookings(): unknown[] {
  try {
    ensureDir();
    const f = join(DATA_DIR, 'bookings.json');
    if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf-8'));
  } catch { /* */ }
  return [];
}

function saveBookings(bookings: unknown[]) {
  ensureDir();
  writeFileSync(join(DATA_DIR, 'bookings.json'), JSON.stringify(bookings, null, 2));
}

function getActivities(): unknown[] {
  try {
    ensureDir();
    const f = join(DATA_DIR, 'activities.json');
    if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf-8'));
  } catch { /* */ }
  return [];
}

function saveActivities(activities: unknown[]) {
  ensureDir();
  writeFileSync(join(DATA_DIR, 'activities.json'), JSON.stringify(activities, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { triggerEvent, payload } = body;

    if (triggerEvent === 'BOOKING_CREATED' && payload) {
      const booking = {
        id: `booking-${Date.now()}`,
        name: payload.attendees?.[0]?.name || payload.name || 'Unknown',
        email: payload.attendees?.[0]?.email || payload.email || '',
        phone: payload.attendees?.[0]?.phone || payload.phone || '',
        date: payload.startTime
          ? new Date(payload.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })
          : payload.date || '',
        time: payload.startTime
          ? new Date(payload.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
          : payload.time || '',
        notes: payload.responses?.notes || payload.additionalNotes || payload.notes || '',
        created_at: new Date().toISOString(),
        dismissed: false,
      };

      const bookings = getBookings();
      bookings.unshift(booking);
      saveBookings(bookings);

      // Append to activities
      try {
        const activities = getActivities();
        activities.unshift({
          id: `act-booking-${Date.now()}`,
          type: 'booking',
          title: `New booking from ${booking.name}`,
          description: `${booking.date} at ${booking.time}`,
          created_at: new Date().toISOString(),
        });
        saveActivities(activities);
      } catch (e) { console.error('Failed to log booking activity:', e); }

      // Send email notification to team
      try {
        const RESEND_KEY = process.env.RESEND_API_KEY;
        if (RESEND_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Vantix <onboarding@resend.dev>',
              to: ['kyle.ventura@gmail.com'],
              subject: `New Booking: ${booking.name} — ${booking.date} at ${booking.time}`,
              html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#F4EFE8;border-radius:12px;">
                <h2 style="color:#1C1C1C;margin:0 0 16px;">New Consultation Booking</h2>
                <p style="color:#B07A45;margin:4px 0;"><strong>Name:</strong> ${booking.name}</p>
                <p style="color:#B07A45;margin:4px 0;"><strong>Email:</strong> ${booking.email}</p>
                ${booking.phone ? `<p style="color:#B07A45;margin:4px 0;"><strong>Phone:</strong> ${booking.phone}</p>` : ''}
                <p style="color:#B07A45;margin:4px 0;"><strong>Date:</strong> ${booking.date}</p>
                <p style="color:#B07A45;margin:4px 0;"><strong>Time:</strong> ${booking.time}</p>
                ${booking.notes ? `<p style="color:#B07A45;margin:4px 0;"><strong>Notes:</strong> ${booking.notes}</p>` : ''}
                <hr style="border:1px solid #E3D9CD;margin:16px 0;"/>
                <p style="color:#8E5E34;font-size:13px;">View all bookings on your <a href="https://usevantix.com/dashboard" style="color:#1C1C1C;">dashboard</a></p>
              </div>`,
            }),
          });
        }
      } catch { /* email is best-effort */ }

      return NextResponse.json({ ok: true, booking });
    }

    return NextResponse.json({ ok: true, skipped: true });
  } catch (e) {
    console.error('Booking webhook error:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(getBookings());
}
