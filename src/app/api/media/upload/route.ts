import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const clientId = formData.get('client_id') as string | null;
    const projectId = formData.get('project_id') as string | null;
    const tags = formData.get('tags') as string | null;

    const fileName = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    const publicUrl = urlData?.publicUrl || '';

    // Create record in media table
    const record = {
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size,
      client_id: clientId || null,
      project_id: projectId || null,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('media').insert(record).select().single();
    if (error) {
      console.error('Media record error:', error);
      return NextResponse.json({ url: publicUrl, record, note: 'File uploaded but record failed' });
    }

    return NextResponse.json({ url: publicUrl, media: data });
  } catch (err) {
    console.error('Media upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
