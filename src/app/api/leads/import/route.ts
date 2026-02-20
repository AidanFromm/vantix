import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leads } = body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'Missing or empty leads array' }, { status: 400 });
    }

    // Get existing emails for dedup
    const emails = leads.map((l: Record<string, unknown>) => l.email).filter(Boolean) as string[];
    const { data: existing } = await supabase
      .from('leads')
      .select('email')
      .in('email', emails);

    const existingEmails = new Set((existing || []).map((e: { email: string }) => e.email?.toLowerCase()));

    const now = new Date().toISOString();
    const newLeads = leads
      .filter((l: Record<string, unknown>) => {
        if (!l.email) return true; // no email = can't dedup, just insert
        return !existingEmails.has((l.email as string).toLowerCase());
      })
      .map((l: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        name: l.name || '',
        email: l.email || null,
        phone: l.phone || null,
        company: l.company || null,
        role: l.role || null,
        status: l.status || 'new',
        source: l.source || 'import',
        score: l.score || 0,
        notes: l.notes || null,
        tags: l.tags || [],
        created_at: now,
        updated_at: now,
      }));

    if (newLeads.length === 0) {
      return NextResponse.json({
        imported: 0,
        duplicates: leads.length,
        message: 'All leads already exist',
      });
    }

    const { data, error } = await supabase.from('leads').insert(newLeads).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      imported: data?.length || 0,
      duplicates: leads.length - newLeads.length,
      data,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
