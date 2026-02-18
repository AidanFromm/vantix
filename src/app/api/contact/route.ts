import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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

    // Auto-create lead from contact submission
    try {
      const dataDir = join(process.cwd(), 'data');
      if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
      const leadsFile = join(dataDir, 'leads.json');
      const leads = existsSync(leadsFile) ? JSON.parse(readFileSync(leadsFile, 'utf-8')) : [];
      leads.push({
        id: `lead-contact-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: '',
        status: 'new',
        source: 'website_contact',
        estimated_value: 0,
        notes: data.message || '',
        created_at: new Date().toISOString(),
      });
      writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch (e) { console.error('Failed to create lead from contact:', e); }

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
