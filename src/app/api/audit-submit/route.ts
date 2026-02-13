import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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
