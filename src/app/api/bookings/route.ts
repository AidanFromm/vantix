import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ bookings: data || [] });
  } catch {
    return NextResponse.json({ bookings: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      date: body.date,
      time: body.time,
      notes: body.notes || '',
      dismissed: false,
      created_at: new Date().toISOString(),
    };

    // Insert booking
    const { data, error } = await supabase.from('bookings').insert(booking).select().single();
    if (error) {
      console.error('Supabase booking error:', error);
      // Still return success — landing page will localStorage-fallback
      return NextResponse.json({ success: true, note: 'Stored locally', booking });
    }

    // Create notification (non-blocking)
    try {
      await supabase.from('notifications').insert({
        title: 'New Booking',
        message: `${booking.name} booked ${booking.date} at ${booking.time}`,
        type: 'success',
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch { /* noop */ }

    // Send emails via Resend (non-blocking)
    try {
      const { sendEmail } = await import('@/lib/email');
      const { bookingConfirmationEmail, bookingNotificationEmail } = await import('@/lib/email-templates');

      if (booking.email) {
        sendEmail(
          booking.email,
          `Your Vantix consultation is confirmed — ${booking.date}`,
          bookingConfirmationEmail(booking.name, booking.date, booking.time)
        ).catch(() => {});
      }

      sendEmail(
        'usevantix@gmail.com',
        `New booking: ${booking.name} — ${booking.date} at ${booking.time}`,
        bookingNotificationEmail(booking.name, booking.email, booking.phone || '', booking.date, booking.time)
      ).catch(() => {});
    } catch { /* never block booking flow */ }

    return NextResponse.json({ success: true, booking: data });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
