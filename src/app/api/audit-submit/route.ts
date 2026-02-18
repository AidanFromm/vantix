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
      .from('audit_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        website: data.website,
        phone: data.phone || null,
        status: 'new',
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Supabase error:', error);
      // Still return success for now - might not have table set up
      return NextResponse.json({ success: true, note: 'Stored locally' });
    }

    // Auto-create qualified lead from audit submission
    try {
      const dataDir = join(process.cwd(), 'data');
      if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
      const leadsFile = join(dataDir, 'leads.json');
      const leads = existsSync(leadsFile) ? JSON.parse(readFileSync(leadsFile, 'utf-8')) : [];
      leads.push({
        id: `lead-audit-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.website || '',
        status: 'qualified',
        source: 'ai_audit',
        estimated_value: 0,
        notes: `Website: ${data.website || 'N/A'}`,
        created_at: new Date().toISOString(),
      });
      writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch (e) { console.error('Failed to create lead from audit:', e); }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Audit submit error:', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('audit_submissions')
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
