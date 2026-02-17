import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Client, Lead, Project, Invoice, Expense, Activity, ScrapedLead, TeamMember, DashboardStats, SubscriptionMeta } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// ============================================
// LOCALSTORAGE HELPERS
// ============================================
function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, data: T[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch { /* noop */ }
}

function generateId(): string {
  return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const LS_CLIENTS = 'vantix_clients';
const LS_LEADS = 'vantix_leads';
const LS_EXPENSES = 'vantix_expenses';
const LS_INVOICES = 'vantix_invoices';
const LS_PROJECTS = 'vantix_projects';
const LS_ACTIVITIES = 'vantix_activities';
const LS_SCRAPED_LEADS = 'vantix_scraped_leads';

// ============================================
// CLIENTS
// ============================================
export async function getClients(filters?: { status?: string; search?: string }) {
  try {
    let query = supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    if (data) lsSet(LS_CLIENTS, data);
    return { data: data as Client[] | null, error: null };
  } catch {
    let items = lsGet<Client>(LS_CLIENTS);
    if (filters?.status) items = items.filter(c => c.status === filters.status);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(c => c.name?.toLowerCase().includes(s) || c.contact_email?.toLowerCase().includes(s));
    }
    return { data: items, error: null };
  }
}

export async function getClient(id: string) {
  try {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    if (error) throw error;
    return { data: data as Client | null, error: null };
  } catch {
    const items = lsGet<Client>(LS_CLIENTS);
    return { data: items.find(c => c.id === id) || null, error: null };
  }
}

export async function createClient(client: Partial<Client>) {
  try {
    const { data, error } = await supabase.from('clients').insert(client).select().single();
    if (error) throw error;
    return { data: data as Client | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newClient: Client = {
      id: generateId(),
      name: client.name || '',
      type: client.type || 'company',
      status: client.status || 'lead',
      contract_value: client.contract_value || 0,
      lifetime_value: client.lifetime_value || 0,
      tags: client.tags || [],
      created_at: now,
      updated_at: now,
      ...client,
    } as Client;
    newClient.id = newClient.id || generateId();
    newClient.created_at = newClient.created_at || now;
    newClient.updated_at = now;
    const items = lsGet<Client>(LS_CLIENTS);
    items.unshift(newClient);
    lsSet(LS_CLIENTS, items);
    return { data: newClient, error: null };
  }
}

export async function updateClient(id: string, updates: Partial<Client>) {
  try {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Client | null, error: null };
  } catch {
    const items = lsGet<Client>(LS_CLIENTS);
    const idx = items.findIndex(c => c.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
      lsSet(LS_CLIENTS, items);
      return { data: items[idx], error: null };
    }
    return { data: null, error: null };
  }
}

export async function deleteClient(id: string) {
  try {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch {
    const items = lsGet<Client>(LS_CLIENTS).filter(c => c.id !== id);
    lsSet(LS_CLIENTS, items);
    return { error: null };
  }
}

// ============================================
// LEADS
// ============================================
export async function getLeads(filters?: { status?: string; source?: string; search?: string }) {
  try {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.source) query = query.eq('source', filters.source);
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    if (data) lsSet(LS_LEADS, data);
    return { data: data as Lead[] | null, error: null };
  } catch {
    let items = lsGet<Lead>(LS_LEADS);
    if (filters?.status) items = items.filter(l => l.status === filters.status);
    if (filters?.source) items = items.filter(l => l.source === filters.source);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(l => l.name?.toLowerCase().includes(s) || l.email?.toLowerCase().includes(s) || l.company?.toLowerCase().includes(s));
    }
    return { data: items, error: null };
  }
}

export async function getLead(id: string) {
  try {
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
    if (error) throw error;
    return { data: data as Lead | null, error: null };
  } catch {
    const items = lsGet<Lead>(LS_LEADS);
    return { data: items.find(l => l.id === id) || null, error: null };
  }
}

export async function createLead(lead: Partial<Lead>) {
  try {
    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (error) throw error;
    return { data: data as Lead | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newLead: Lead = {
      id: generateId(),
      name: lead.name || '',
      status: lead.status || 'new',
      score: lead.score || 0,
      tags: lead.tags || [],
      created_at: now,
      updated_at: now,
      ...lead,
    } as Lead;
    newLead.id = newLead.id || generateId();
    newLead.created_at = newLead.created_at || now;
    newLead.updated_at = now;
    const items = lsGet<Lead>(LS_LEADS);
    items.unshift(newLead);
    lsSet(LS_LEADS, items);
    return { data: newLead, error: null };
  }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  try {
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Lead | null, error: null };
  } catch {
    const items = lsGet<Lead>(LS_LEADS);
    const idx = items.findIndex(l => l.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
      lsSet(LS_LEADS, items);
      return { data: items[idx], error: null };
    }
    return { data: null, error: null };
  }
}

export async function deleteLead(id: string) {
  try {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch {
    const items = lsGet<Lead>(LS_LEADS).filter(l => l.id !== id);
    lsSet(LS_LEADS, items);
    return { error: null };
  }
}

// ============================================
// PROJECTS
// ============================================
export async function getProjects(filters?: { status?: string; assigned_to?: string; client_id?: string }) {
  try {
    let query = supabase.from('projects').select('*, client:clients(*)').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters?.client_id) query = query.eq('client_id', filters.client_id);
    const { data, error } = await query;
    if (error) throw error;
    return { data: data as Project[] | null, error: null };
  } catch {
    let items = lsGet<Project>(LS_PROJECTS);
    if (filters?.status) items = items.filter(p => p.status === filters.status);
    if (filters?.client_id) items = items.filter(p => p.client_id === filters.client_id);
    return { data: items, error: null };
  }
}

export async function getProject(id: string) {
  try {
    const { data, error } = await supabase.from('projects').select('*, client:clients(*)').eq('id', id).single();
    if (error) throw error;
    return { data: data as Project | null, error: null };
  } catch {
    const items = lsGet<Project>(LS_PROJECTS);
    return { data: items.find(p => p.id === id) || null, error: null };
  }
}

export async function createProject(project: Partial<Project>) {
  try {
    const { data, error } = await supabase.from('projects').insert(project).select().single();
    if (error) throw error;
    return { data: data as Project | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newProject = { id: generateId(), created_at: now, updated_at: now, spent: 0, progress: 0, health: 'green' as const, tags: [], ...project } as Project;
    const items = lsGet<Project>(LS_PROJECTS);
    items.unshift(newProject);
    lsSet(LS_PROJECTS, items);
    return { data: newProject, error: null };
  }
}

export async function updateProject(id: string, updates: Partial<Project>) {
  try {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Project | null, error: null };
  } catch {
    const items = lsGet<Project>(LS_PROJECTS);
    const idx = items.findIndex(p => p.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
      lsSet(LS_PROJECTS, items);
      return { data: items[idx], error: null };
    }
    return { data: null, error: null };
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch {
    const items = lsGet<Project>(LS_PROJECTS).filter(p => p.id !== id);
    lsSet(LS_PROJECTS, items);
    return { error: null };
  }
}

// ============================================
// INVOICES
// ============================================
export async function getInvoices(filters?: { status?: string; client_id?: string }) {
  try {
    let query = supabase.from('invoices').select('*, client:clients(*), project:projects(*)').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.client_id) query = query.eq('client_id', filters.client_id);
    const { data, error } = await query;
    if (error) throw error;
    if (data) lsSet(LS_INVOICES, data);
    return { data: data as Invoice[] | null, error: null };
  } catch {
    let items = lsGet<Invoice>(LS_INVOICES);
    if (filters?.status) items = items.filter(i => i.status === filters.status);
    if (filters?.client_id) items = items.filter(i => i.client_id === filters.client_id);
    return { data: items, error: null };
  }
}

export async function createInvoice(invoice: Partial<Invoice>) {
  try {
    const { data, error } = await supabase.from('invoices').insert(invoice).select().single();
    if (error) throw error;
    return { data: data as Invoice | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newInvoice = { id: generateId(), created_at: now, status: 'draft' as const, total: 0, ...invoice } as Invoice;
    const items = lsGet<Invoice>(LS_INVOICES);
    items.unshift(newInvoice);
    lsSet(LS_INVOICES, items);
    return { data: newInvoice, error: null };
  }
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  try {
    const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Invoice | null, error: null };
  } catch {
    const items = lsGet<Invoice>(LS_INVOICES);
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      lsSet(LS_INVOICES, items);
      return { data: items[idx], error: null };
    }
    return { data: null, error: null };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch {
    const items = lsGet<Invoice>(LS_INVOICES).filter(i => i.id !== id);
    lsSet(LS_INVOICES, items);
    return { error: null };
  }
}

// ============================================
// EXPENSES
// ============================================
export async function getExpenses(filters?: { category?: string; from?: string; to?: string }) {
  try {
    let query = supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.from) query = query.gte('expense_date', filters.from);
    if (filters?.to) query = query.lte('expense_date', filters.to);
    const { data, error } = await query;
    if (error) throw error;
    if (data) lsSet(LS_EXPENSES, data);
    return { data: data as Expense[] | null, error: null };
  } catch {
    let items = lsGet<Expense>(LS_EXPENSES);
    if (filters?.category) items = items.filter(e => e.category === filters.category);
    if (filters?.from) items = items.filter(e => e.expense_date >= filters.from!);
    if (filters?.to) items = items.filter(e => e.expense_date <= filters.to!);
    return { data: items, error: null };
  }
}

export async function createExpense(expense: Partial<Expense>) {
  try {
    const { data, error } = await supabase.from('expenses').insert(expense).select().single();
    if (error) throw error;
    return { data: data as Expense | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: generateId(),
      amount: expense.amount || 0,
      expense_date: expense.expense_date || now.split('T')[0],
      created_at: now,
      ...expense,
    } as Expense;
    newExpense.id = newExpense.id || generateId();
    const items = lsGet<Expense>(LS_EXPENSES);
    items.unshift(newExpense);
    lsSet(LS_EXPENSES, items);
    return { data: newExpense, error: null };
  }
}

export async function deleteExpense(id: string) {
  try {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch {
    const items = lsGet<Expense>(LS_EXPENSES).filter(e => e.id !== id);
    lsSet(LS_EXPENSES, items);
    return { error: null };
  }
}

// ============================================
// ACTIVITIES (Timeline)
// ============================================
export async function getActivities(limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*, client:clients(*), project:projects(*), lead:leads(*)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { data: data as Activity[] | null, error: null };
  } catch {
    const items = lsGet<Activity>(LS_ACTIVITIES).slice(0, limit);
    return { data: items, error: null };
  }
}

export async function createActivity(activity: Partial<Activity>) {
  try {
    const { data, error } = await supabase.from('activities').insert(activity).select().single();
    if (error) throw error;
    return { data: data as Activity | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newActivity = { id: generateId(), created_at: now, ...activity } as Activity;
    const items = lsGet<Activity>(LS_ACTIVITIES);
    items.unshift(newActivity);
    lsSet(LS_ACTIVITIES, items);
    return { data: newActivity, error: null };
  }
}

// ============================================
// SCRAPED LEADS (Email Scraper)
// ============================================
export async function getScrapedLeads(filters?: { status?: string }) {
  try {
    let query = supabase.from('scraped_leads').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw error;
    return { data: data as ScrapedLead[] | null, error: null };
  } catch {
    let items = lsGet<ScrapedLead>(LS_SCRAPED_LEADS);
    if (filters?.status) items = items.filter(l => l.status === filters.status);
    return { data: items, error: null };
  }
}

export async function createScrapedLead(lead: Partial<ScrapedLead>) {
  try {
    const { data, error } = await supabase.from('scraped_leads').insert(lead).select().single();
    if (error) throw error;
    return { data: data as ScrapedLead | null, error: null };
  } catch {
    const now = new Date().toISOString();
    const newLead = { id: generateId(), created_at: now, status: 'new' as const, ...lead } as ScrapedLead;
    const items = lsGet<ScrapedLead>(LS_SCRAPED_LEADS);
    items.unshift(newLead);
    lsSet(LS_SCRAPED_LEADS, items);
    return { data: newLead, error: null };
  }
}

export async function updateScrapedLead(id: string, updates: Partial<ScrapedLead>) {
  try {
    const { data, error } = await supabase.from('scraped_leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as ScrapedLead | null, error: null };
  } catch {
    const items = lsGet<ScrapedLead>(LS_SCRAPED_LEADS);
    const idx = items.findIndex(l => l.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      lsSet(LS_SCRAPED_LEADS, items);
      return { data: items[idx], error: null };
    }
    return { data: null, error: null };
  }
}

// ============================================
// TEAM MEMBERS
// ============================================
export async function getTeamMembers() {
  try {
    const { data, error } = await supabase.from('team_members').select('*').order('type', { ascending: false });
    if (error) throw error;
    return { data: data as TeamMember[] | null, error: null };
  } catch {
    return { data: [] as TeamMember[], error: null };
  }
}

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

// ============================================
// DASHBOARD STATS
// ============================================
export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: Error | null }> {
  try {
    const [invoicesRes, expensesRes, projectsRes, clientsRes, leadsRes] = await Promise.all([
      getInvoices(),
      getExpenses(),
      getProjects(),
      getClients(),
      getLeads(),
    ]);

    const invoices = invoicesRes.data || [];
    const expenses = expensesRes.data || [];
    const projects = projectsRes.data || [];
    const clients = clientsRes.data || [];
    const leads = leadsRes.data || [];

    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const outstandingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue');
    const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + (i.total || i.amount || 0), 0);

    return {
      data: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        outstandingInvoices: outstandingInvoices.length,
        outstandingAmount,
        activeProjects: projects.filter(p => p.status === 'active').length,
        activeClients: clients.filter(c => c.status === 'active').length,
        newLeads: leads.filter(l => l.status === 'new').length,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
