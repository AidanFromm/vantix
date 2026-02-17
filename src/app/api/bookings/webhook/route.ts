import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BOOKINGS_FILE = join(process.cwd(), 'data', 'bookings.json');

function getBookings() {
  try {
    if (existsSync(BOOKINGS_FILE)) return JSON.parse(readFileSync(BOOKINGS_FILE, 'utf-8'));
  } catch { /* */ }
  return [];
}

function saveBookings(bookings: unknown[]) {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) { const { mkdirSync } = require('fs'); mkdirSync(dir, { recursive: true }); }
  writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// Cal.com webhook handler
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
        date: payload.startTime ? new Date(payload.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '',
        time: payload.startTime ? new Date(payload.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
        notes: payload.responses?.notes || payload.additionalNotes || '',
        created_at: new Date().toISOString(),
        dismissed: false,
      };

      const bookings = getBookings();
      bookings.unshift(booking);
      saveBookings(bookings);

      return NextResponse.json({ ok: true, booking });
    }

    return NextResponse.json({ ok: true, skipped: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// GET: fetch all bookings (for dashboard sync)
export async function GET() {
  return NextResponse.json(getBookings());
}
