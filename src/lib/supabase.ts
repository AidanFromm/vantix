import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Client, Lead, Project, Invoice, Expense, Activity, ScrapedLead, TeamMember, DashboardStats, SubscriptionMeta } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// ============================================
// CLIENTS
// ============================================
export async function getClients(filters?: { status?: string; search?: string }) {
  let query = supabase.from('clients').select('*').order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query;
  return { data: data as Client[] | null, error };
}

export async function getClient(id: string) {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
  return { data: data as Client | null, error };
}

export async function createClient(client: Partial<Client>) {
  const { data, error } = await supabase.from('clients').insert(client).select().single();
  return { data: data as Client | null, error };
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single();
  return { data: data as Client | null, error };
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  return { error };
}

// ============================================
// LEADS
// ============================================
export async function getLeads(filters?: { status?: string; source?: string; search?: string }) {
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.source) {
    query = query.eq('source', filters.source);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query;
  return { data: data as Lead[] | null, error };
}

export async function getLead(id: string) {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
  return { data: data as Lead | null, error };
}

export async function createLead(lead: Partial<Lead>) {
  const { data, error } = await supabase.from('leads').insert(lead).select().single();
  return { data: data as Lead | null, error };
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
  return { data: data as Lead | null, error };
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  return { error };
}

// ============================================
// PROJECTS
// ============================================
export async function getProjects(filters?: { status?: string; assigned_to?: string; client_id?: string }) {
  let query = supabase.from('projects').select('*, client:clients(*)').order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  if (filters?.client_id) {
    query = query.eq('client_id', filters.client_id);
  }
  
  const { data, error } = await query;
  return { data: data as Project[] | null, error };
}

export async function getProject(id: string) {
  const { data, error } = await supabase.from('projects').select('*, client:clients(*)').eq('id', id).single();
  return { data: data as Project | null, error };
}

export async function createProject(project: Partial<Project>) {
  const { data, error } = await supabase.from('projects').insert(project).select().single();
  return { data: data as Project | null, error };
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
  return { data: data as Project | null, error };
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return { error };
}

// ============================================
// INVOICES
// ============================================
export async function getInvoices(filters?: { status?: string; client_id?: string }) {
  let query = supabase.from('invoices').select('*, client:clients(*), project:projects(*)').order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.client_id) {
    query = query.eq('client_id', filters.client_id);
  }
  
  const { data, error } = await query;
  return { data: data as Invoice[] | null, error };
}

export async function createInvoice(invoice: Partial<Invoice>) {
  const { data, error } = await supabase.from('invoices').insert(invoice).select().single();
  return { data: data as Invoice | null, error };
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select().single();
  return { data: data as Invoice | null, error };
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  return { error };
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  return { error };
}

// ============================================
// EXPENSES
// ============================================
export async function getExpenses(filters?: { category?: string; from?: string; to?: string }) {
  let query = supabase.from('expenses').select('*').order('expense_date', { ascending: false });
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.from) {
    query = query.gte('expense_date', filters.from);
  }
  if (filters?.to) {
    query = query.lte('expense_date', filters.to);
  }
  
  const { data, error } = await query;
  return { data: data as Expense[] | null, error };
}

export async function createExpense(expense: Partial<Expense>) {
  const { data, error } = await supabase.from('expenses').insert(expense).select().single();
  return { data: data as Expense | null, error };
}

// ============================================
// ACTIVITIES (Timeline)
// ============================================
export async function getActivities(limit: number = 20) {
  const { data, error } = await supabase
    .from('activities')
    .select('*, client:clients(*), project:projects(*), lead:leads(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: data as Activity[] | null, error };
}

export async function createActivity(activity: Partial<Activity>) {
  const { data, error } = await supabase.from('activities').insert(activity).select().single();
  return { data: data as Activity | null, error };
}

// ============================================
// SCRAPED LEADS (Email Scraper)
// ============================================
export async function getScrapedLeads(filters?: { status?: string }) {
  let query = supabase.from('scraped_leads').select('*').order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  return { data: data as ScrapedLead[] | null, error };
}

export async function createScrapedLead(lead: Partial<ScrapedLead>) {
  const { data, error } = await supabase.from('scraped_leads').insert(lead).select().single();
  return { data: data as ScrapedLead | null, error };
}

export async function updateScrapedLead(id: string, updates: Partial<ScrapedLead>) {
  const { data, error } = await supabase.from('scraped_leads').update(updates).eq('id', id).select().single();
  return { data: data as ScrapedLead | null, error };
}

// ============================================
// TEAM MEMBERS
// ============================================
export async function getTeamMembers() {
  const { data, error } = await supabase.from('team_members').select('*').order('type', { ascending: false });
  return { data: data as TeamMember[] | null, error };
}

// ============================================
// DASHBOARD STATS
// ============================================
// ============================================
// CHAT LEADS (Landing Page / Chat Widget)
// ============================================
export async function createChatLead(lead: { visitor_name: string; email?: string; phone?: string; interested_in?: string }) {
  try {
    const { data, error } = await supabase.from('chat_leads').insert(lead).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// ============================================
// SUBSCRIPTION EXPENSES (localStorage fallback)
// ============================================
const SUBSCRIPTION_STORAGE_KEY = 'vantix_subscription_meta';

export function getSubscriptionMetas(): SubscriptionMeta[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubscriptionMeta(meta: SubscriptionMeta) {
  try {
    const existing = getSubscriptionMetas();
    const idx = existing.findIndex(m => m.expense_id === meta.expense_id);
    if (idx >= 0) existing[idx] = meta;
    else existing.push(meta);
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(existing));
  } catch { /* noop */ }
}

export function removeSubscriptionMeta(expenseId: string) {
  try {
    const existing = getSubscriptionMetas().filter(m => m.expense_id !== expenseId);
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(existing));
  } catch { /* noop */ }
}

export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: Error | null }> {
  try {
    const { data: invoices } = await supabase.from('invoices').select('total, status').then(r => r, () => ({ data: null, error: null }));
    const { data: expenses } = await supabase.from('expenses').select('amount').then(r => r, () => ({ data: null, error: null }));
    const { data: projects } = await supabase.from('projects').select('status').then(r => r, () => ({ data: null, error: null }));
    const { data: clients } = await supabase.from('clients').select('status').then(r => r, () => ({ data: null, error: null }));
    const { data: leads } = await supabase.from('leads').select('status').then(r => r, () => ({ data: null, error: null }));
    
    const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
    const outstandingInvoices = invoices?.filter(i => i.status === 'sent' || i.status === 'overdue') || [];
    const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + (i.total || 0), 0);
    
    return {
      data: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        outstandingInvoices: outstandingInvoices.length,
        outstandingAmount,
        activeProjects: projects?.filter(p => p.status === 'active').length || 0,
        activeClients: clients?.filter(c => c.status === 'active').length || 0,
        newLeads: leads?.filter(l => l.status === 'new').length || 0,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
