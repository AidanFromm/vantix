import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ'
);

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_TJNHAFRB_A66nrWk5st1W4RAFyn2z4eQs';
const FROM_EMAIL = 'Vantix <onboarding@resend.dev>';

const TEMPLATES: Record<string, { subject: string; html: string }> = {
  intro: {
    subject: 'Vantix — AI-Powered Growth for Your Business',
    html: `<div style="font-family:sans-serif;color:#1C1C1C;max-width:600px;margin:0 auto;padding:32px;">
      <h2 style="color:#B07A45;">Transform Your Business with AI</h2>
      <p>Hi there,</p>
      <p>I noticed your business could benefit from intelligent automation. At Vantix, we help companies streamline operations and accelerate growth using custom AI solutions.</p>
      <p>Would you be open to a quick 15-minute call to explore how we can help?</p>
      <p style="margin-top:24px;">Best,<br/>The Vantix Team</p>
    </div>`,
  },
  followup: {
    subject: 'Quick follow-up — Vantix',
    html: `<div style="font-family:sans-serif;color:#1C1C1C;max-width:600px;margin:0 auto;padding:32px;">
      <h2 style="color:#B07A45;">Just checking in</h2>
      <p>Hi,</p>
      <p>I wanted to follow up on my previous message. We have helped businesses save 20+ hours per week with our AI solutions.</p>
      <p>If you have 15 minutes this week, I would love to show you what is possible.</p>
      <p style="margin-top:24px;">Best,<br/>The Vantix Team</p>
    </div>`,
  },
  casestudy: {
    subject: 'How we helped a business grow 3x — Vantix',
    html: `<div style="font-family:sans-serif;color:#1C1C1C;max-width:600px;margin:0 auto;padding:32px;">
      <h2 style="color:#B07A45;">Real Results, Real Growth</h2>
      <p>Hi,</p>
      <p>One of our clients went from manual outreach to fully automated lead generation, tripling their pipeline in 60 days.</p>
      <p>Would you like to see if we can do the same for your business?</p>
      <p style="margin-top:24px;">Best,<br/>The Vantix Team</p>
    </div>`,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, subject, html, template } = body;

    if (!leadId) return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });

    const { data: lead, error: fetchError } = await supabase.from('leads').select('*').eq('id', leadId).single();
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 404 });
    if (!lead.email) return NextResponse.json({ error: 'Lead has no email address' }, { status: 400 });

    let emailSubject = subject;
    let emailHtml = html;

    if (template && TEMPLATES[template]) {
      emailSubject = emailSubject || TEMPLATES[template].subject;
      emailHtml = emailHtml || TEMPLATES[template].html;
    }

    if (!emailSubject || !emailHtml) {
      return NextResponse.json({ error: 'Missing subject/html or valid template' }, { status: 400 });
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [lead.email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    const sent = resendRes.ok;

    const emailRecord = {
      id: crypto.randomUUID(),
      template: template || 'custom',
      subject: emailSubject,
      status: sent ? 'sent' : 'failed',
      resend_id: resendData.id || null,
      sent_at: new Date().toISOString(),
      sequence: false,
    };

    const emailHistory = (lead.email_history as Array<Record<string, unknown>>) || [];
    emailHistory.push(emailRecord);

    const { error: updateError } = await supabase
      .from('leads')
      .update({
        email_history: emailHistory,
        last_contacted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message, emailSent: sent }, { status: 500 });
    }

    return NextResponse.json({ success: sent, emailRecord });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
