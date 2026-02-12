import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our tables
export interface Lead {
  id: string;
  phone: string;
  business_type: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  created_at: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'bot';
  created_at: string;
}

