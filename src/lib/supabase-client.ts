import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';

if (supabaseAnonKey === 'missing-key') {
  if (typeof window !== 'undefined') {
    console.warn('[Vantix] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — Supabase calls will fail, falling back to localStorage.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
