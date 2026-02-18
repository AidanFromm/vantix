import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Store contact submission
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone || null,
        status: 'new',
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Supabase contact error:', error);
    }

    // Create lead in leads table (non-blocking)
    try {
      await supabase.from('leads').insert({
        name: data.name || 'Unknown',
        email: data.email || null,
        phone: data.phone || null,
        source: 'Website Form',
        status: 'new',
        score: 0,
        notes: data.message || null,
        tags: ['website-contact'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch { /* table may not exist yet */ }

    // Create notification (non-blocking)
    try {
      await supabase.from('notifications').insert({
        title: 'New Contact Form',
        message: `${data.name || 'Someone'} submitted a contact form${data.email ? ` (${data.email})` : ''}`,
        type: 'info',
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch { /* noop */ }

    // Send emails via Resend (non-blocking)
    try {
      const { sendEmail } = await import('@/lib/email');
      const { contactConfirmationEmail, contactNotificationEmail } = await import('@/lib/email-templates');

      if (data.email) {
        sendEmail(
          data.email,
          'We got your message — Vantix',
          contactConfirmationEmail(data.name || 'there')
        ).catch(() => {});
      }

      sendEmail(
        'usevantix@gmail.com',
        `New contact: ${data.name || 'Unknown'}`,
        contactNotificationEmail(data.name || 'Unknown', data.email || 'No email', data.message || '')
      ).catch(() => {});
    } catch { /* never block contact flow */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact submit error:', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ submissions: [] });
    }

    return NextResponse.json({ submissions: data || [] });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}
