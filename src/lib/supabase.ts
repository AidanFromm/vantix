// Re-export the Supabase client + all data functions for backward compatibility
// Pages that import from '@/lib/supabase' will still work
export { supabase } from './supabase-client';
export * from './data';
