import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export all data functions for backward compatibility
// Pages that import from '@/lib/supabase' will still work
export * from './data';
