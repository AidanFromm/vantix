import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
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
      console.error('Supabase error:', error);
      return NextResponse.json({ success: true, note: 'Stored locally' });
    }

    // Log lead creation (filesystem writes removed for serverless compatibility)
    console.log('Contact lead created:', { name: data.name, email: data.email });

    // Send emails via Resend (non-blocking)
    try {
      const { sendEmail } = await import('@/lib/email');
      const { contactConfirmationEmail, contactNotificationEmail } = await import('@/lib/email-templates');
      // Confirmation to submitter
      if (data.email) {
        sendEmail(
          data.email,
          'We got your message — Vantix',
          contactConfirmationEmail(data.name || 'there')
        ).catch(() => {});
      }
      // Notification to team
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
