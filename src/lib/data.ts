// Universal Data Access Layer
// Tries Supabase first, falls back to localStorage gracefully
import { supabase } from './supabase-client';
import type {
  Client, Lead, Project, Invoice, Expense, Activity,
  ScrapedLead, TeamMember, DashboardStats, SubscriptionMeta, MediaItem,
} from './types';

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

function lsKey(table: string): string {
  return `vantix_${table}`;
}

// ============================================
// MERGE HELPER — dedup by id, prefer Supabase
// ============================================
function mergeById<T extends { id: string }>(supabaseData: T[], localData: T[]): T[] {
  const map = new Map<string, T>();
  // Local first so Supabase overwrites
  for (const item of localData) map.set(item.id, item);
  for (const item of supabaseData) map.set(item.id, item);
  return Array.from(map.values());
}

// ============================================
// GENERIC CRUD
// ============================================

export async function getData<T extends { id: string }>(table: string): Promise<T[]> {
  const local = lsGet<T>(lsKey(table));
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    const supaData = (data as T[]) || [];
    // Supabase is source of truth — only keep localStorage items that don't exist in Supabase
    // (i.e. items created locally but not yet synced). Remove any that were deleted from Supabase.
    const supaIds = new Set(supaData.map(item => item.id));
    const localOnly = local.filter(item => !supaIds.has(item.id));
    const merged = [...supaData, ...localOnly];
    if (merged.length > 0) lsSet(lsKey(table), merged);
    else lsSet(lsKey(table), []);
    return merged;
  } catch {
    return local;
  }
}

export async function getById<T extends { id: string }>(table: string, id: string): Promise<T | null> {
  try {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data as T;
  } catch {
    const items = lsGet<T>(lsKey(table));
    return items.find((item) => item.id === id) || null;
  }
}

export async function createRecord<T extends { id: string }>(table: string, record: Partial<T>): Promise<T> {
  const now = new Date().toISOString();
  const full = {
    id: generateId(),
    created_at: now,
    updated_at: now,
    ...record,
  } as unknown as T;

  // Always save to localStorage as backup
  const items = lsGet<T>(lsKey(table));
  items.unshift(full);
  lsSet(lsKey(table), items);

  try {
    const { data, error } = await supabase.from(table).insert(full).select().single();
    if (error) throw error;
    // Update localStorage with Supabase version (may have server defaults)
    const updated = items.map(i => (i as { id: string }).id === (data as { id: string }).id ? data as T : i);
    lsSet(lsKey(table), updated);
    return data as T;
  } catch {
    return full;
  }
}

export async function updateRecord<T extends { id: string }>(table: string, id: string, updates: Partial<T> & Record<string, unknown>): Promise<T> {
  const patched = { ...updates, updated_at: new Date().toISOString() } as Partial<T>;

  // Always update localStorage
  const items = lsGet<T>(lsKey(table));
  const idx = items.findIndex((item) => item.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...patched } as T;
    lsSet(lsKey(table), items);
  }

  try {
    const { data, error } = await supabase.from(table).update(patched).eq('id', id).select().single();
    if (error) throw error;
    return data as T;
  } catch {
    if (idx >= 0) return items[idx];
    throw new Error(`Record ${id} not found in ${table}`);
  }
}

export async function deleteRecord(table: string, id: string): Promise<void> {
  // Always remove from localStorage
  const items = lsGet<{ id: string }>(lsKey(table)).filter((item) => item.id !== id);
  lsSet(lsKey(table), items);

  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  } catch { /* localStorage already updated */ }
}

export async function getWhere<T extends { id: string }>(
  table: string,
  field: string,
  value: string
): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*').eq(field, value).order('created_at', { ascending: false });
    if (error) throw error;
    return (data as T[]) || [];
  } catch {
    const items = lsGet<T>(lsKey(table));
    return items.filter((item) => (item as Record<string, unknown>)[field] === value);
  }
}

// ============================================
// CLIENTS
// ============================================
export async function getClients(filters?: { status?: string; search?: string }) {
  const local = lsGet<Client>(lsKey('clients'));
  try {
    let query = supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    const supaData = (data as Client[]) || [];
    // If filtered query, we can't simply merge all local — filter local too then merge
    let filteredLocal = local;
    if (filters?.status) filteredLocal = filteredLocal.filter(c => c.status === filters.status);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filteredLocal = filteredLocal.filter(c => c.name?.toLowerCase().includes(s) || c.contact_email?.toLowerCase().includes(s));
    }
    const merged = mergeById(supaData, filteredLocal);
    // Update full cache with unfiltered merge
    if (!filters?.status && !filters?.search) lsSet(lsKey('clients'), merged);
    return { data: merged, error: null };
  } catch {
    let items = local;
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
    const items = lsGet<Client>(lsKey('clients'));
    return { data: items.find(c => c.id === id) || null, error: null };
  }
}

export async function createClient(client: Partial<Client>) {
  const now = new Date().toISOString();
  const newClient: Client = {
    id: generateId(), name: client.name || '', type: client.type || 'company',
    status: client.status || 'lead', contract_value: client.contract_value || 0,
    lifetime_value: client.lifetime_value || 0, tags: client.tags || [],
    created_at: now, updated_at: now, ...client,
  } as Client;

  // Always save to localStorage as backup
  const items = lsGet<Client>(lsKey('clients'));
  items.unshift(newClient);
  lsSet(lsKey('clients'), items);

  try {
    const { data, error } = await supabase.from('clients').insert(newClient).select().single();
    if (error) throw error;
    // Update localStorage with Supabase version
    const updated = items.map(c => c.id === (data as Client).id ? data as Client : c);
    lsSet(lsKey('clients'), updated);
    return { data: data as Client | null, error: null };
  } catch {
    return { data: newClient, error: null };
  }
}

export async function updateClient(id: string, updates: Partial<Client>) {
  // Always update localStorage
  const items = lsGet<Client>(lsKey('clients'));
  const idx = items.findIndex(c => c.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    lsSet(lsKey('clients'), items);
  }

  try {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Client | null, error: null };
  } catch {
    return { data: idx >= 0 ? items[idx] : null, error: null };
  }
}

export async function deleteClient(id: string) {
  // Always remove from localStorage
  const items = lsGet<Client>(lsKey('clients')).filter(c => c.id !== id);
  lsSet(lsKey('clients'), items);

  try {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  } catch { /* localStorage already updated */ }
  return { error: null };
}

// ============================================
// LEADS
// ============================================
export async function getLeads(filters?: { status?: string; source?: string; search?: string }) {
  const local = lsGet<Lead>(lsKey('leads'));
  try {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.source) query = query.eq('source', filters.source);
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    let filteredLocal = local;
    if (filters?.status) filteredLocal = filteredLocal.filter(l => l.status === filters.status);
    if (filters?.source) filteredLocal = filteredLocal.filter(l => l.source === filters.source);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filteredLocal = filteredLocal.filter(l => l.name?.toLowerCase().includes(s) || l.email?.toLowerCase().includes(s) || l.company?.toLowerCase().includes(s));
    }
    const merged = mergeById((data as Lead[]) || [], filteredLocal);
    if (!filters?.status && !filters?.source && !filters?.search) lsSet(lsKey('leads'), merged);
    return { data: merged, error: null };
  } catch {
    let items = local;
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
    const items = lsGet<Lead>(lsKey('leads'));
    return { data: items.find(l => l.id === id) || null, error: null };
  }
}

export async function createLead(lead: Partial<Lead>) {
  const now = new Date().toISOString();
  const newLead: Lead = {
    id: generateId(), name: lead.name || '', status: lead.status || 'new',
    score: lead.score || 0, tags: lead.tags || [],
    created_at: now, updated_at: now, ...lead,
  } as Lead;

  const items = lsGet<Lead>(lsKey('leads'));
  items.unshift(newLead);
  lsSet(lsKey('leads'), items);

  try {
    const { data, error } = await supabase.from('leads').insert(newLead).select().single();
    if (error) throw error;
    const updated = items.map(l => l.id === (data as Lead).id ? data as Lead : l);
    lsSet(lsKey('leads'), updated);
    return { data: data as Lead | null, error: null };
  } catch {
    return { data: newLead, error: null };
  }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const items = lsGet<Lead>(lsKey('leads'));
  const idx = items.findIndex(l => l.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    lsSet(lsKey('leads'), items);
  }

  try {
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Lead | null, error: null };
  } catch {
    return { data: idx >= 0 ? items[idx] : null, error: null };
  }
}

export async function deleteLead(id: string) {
  const items = lsGet<Lead>(lsKey('leads')).filter(l => l.id !== id);
  lsSet(lsKey('leads'), items);

  try {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
  } catch { /* localStorage already updated */ }
  return { error: null };
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
    let items = lsGet<Project>(lsKey('projects'));
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
    const items = lsGet<Project>(lsKey('projects'));
    return { data: items.find(p => p.id === id) || null, error: null };
  }
}

export async function createProject(project: Partial<Project>) {
  const now = new Date().toISOString();
  const newProject = { id: generateId(), created_at: now, updated_at: now, spent: 0, progress: 0, health: 'green' as const, tags: [], ...project } as Project;
  const items = lsGet<Project>(lsKey('projects'));
  items.unshift(newProject);
  lsSet(lsKey('projects'), items);

  try {
    const { data, error } = await supabase.from('projects').insert(newProject).select().single();
    if (error) throw error;
    return { data: data as Project | null, error: null };
  } catch {
    return { data: newProject, error: null };
  }
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const items = lsGet<Project>(lsKey('projects'));
  const idx = items.findIndex(p => p.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    lsSet(lsKey('projects'), items);
  }

  try {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Project | null, error: null };
  } catch {
    return { data: idx >= 0 ? items[idx] : null, error: null };
  }
}

export async function deleteProject(id: string) {
  const items = lsGet<Project>(lsKey('projects')).filter(p => p.id !== id);
  lsSet(lsKey('projects'), items);

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  } catch { /* localStorage already updated */ }
  return { error: null };
}

// ============================================
// INVOICES
// ============================================
export async function getInvoices(filters?: { status?: string; client_id?: string }) {
  const local = lsGet<Invoice>(lsKey('invoices'));
  try {
    let query = supabase.from('invoices').select('*, client:clients(*), project:projects(*)').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.client_id) query = query.eq('client_id', filters.client_id);
    const { data, error } = await query;
    if (error) throw error;
    let filteredLocal = local;
    if (filters?.status) filteredLocal = filteredLocal.filter(i => i.status === filters.status);
    if (filters?.client_id) filteredLocal = filteredLocal.filter(i => i.client_id === filters.client_id);
    const merged = mergeById((data as Invoice[]) || [], filteredLocal);
    if (!filters?.status && !filters?.client_id) lsSet(lsKey('invoices'), merged);
    return { data: merged, error: null };
  } catch {
    let items = local;
    if (filters?.status) items = items.filter(i => i.status === filters.status);
    if (filters?.client_id) items = items.filter(i => i.client_id === filters.client_id);
    return { data: items, error: null };
  }
}

export async function createInvoice(invoice: Partial<Invoice>) {
  const now = new Date().toISOString();
  const newInvoice = { id: generateId(), created_at: now, status: 'draft' as const, total: 0, ...invoice } as Invoice;
  const items = lsGet<Invoice>(lsKey('invoices'));
  items.unshift(newInvoice);
  lsSet(lsKey('invoices'), items);

  try {
    const { data, error } = await supabase.from('invoices').insert(newInvoice).select().single();
    if (error) throw error;
    return { data: data as Invoice | null, error: null };
  } catch {
    return { data: newInvoice, error: null };
  }
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const items = lsGet<Invoice>(lsKey('invoices'));
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates };
    lsSet(lsKey('invoices'), items);
  }

  try {
    const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as Invoice | null, error: null };
  } catch {
    return { data: idx >= 0 ? items[idx] : null, error: null };
  }
}

export async function deleteInvoice(id: string) {
  const items = lsGet<Invoice>(lsKey('invoices')).filter(i => i.id !== id);
  lsSet(lsKey('invoices'), items);

  try {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  } catch { /* localStorage already updated */ }
  return { error: null };
}

// ============================================
// EXPENSES
// ============================================
export async function getExpenses(filters?: { category?: string; from?: string; to?: string }) {
  const local = lsGet<Expense>(lsKey('expenses'));
  try {
    let query = supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.from) query = query.gte('expense_date', filters.from);
    if (filters?.to) query = query.lte('expense_date', filters.to);
    const { data, error } = await query;
    if (error) throw error;
    let filteredLocal = local;
    if (filters?.category) filteredLocal = filteredLocal.filter(e => e.category === filters.category);
    if (filters?.from) filteredLocal = filteredLocal.filter(e => e.expense_date >= filters.from!);
    if (filters?.to) filteredLocal = filteredLocal.filter(e => e.expense_date <= filters.to!);
    const merged = mergeById((data as Expense[]) || [], filteredLocal);
    if (!filters?.category && !filters?.from && !filters?.to) lsSet(lsKey('expenses'), merged);
    return { data: merged, error: null };
  } catch {
    let items = local;
    if (filters?.category) items = items.filter(e => e.category === filters.category);
    if (filters?.from) items = items.filter(e => e.expense_date >= filters.from!);
    if (filters?.to) items = items.filter(e => e.expense_date <= filters.to!);
    return { data: items, error: null };
  }
}

export async function createExpense(expense: Partial<Expense>) {
  const now = new Date().toISOString();
  const newExpense: Expense = {
    id: generateId(), amount: expense.amount || 0,
    expense_date: expense.expense_date || now.split('T')[0],
    created_at: now, ...expense,
  } as Expense;
  const items = lsGet<Expense>(lsKey('expenses'));
  items.unshift(newExpense);
  lsSet(lsKey('expenses'), items);

  try {
    const { data, error } = await supabase.from('expenses').insert(newExpense).select().single();
    if (error) throw error;
    return { data: data as Expense | null, error: null };
  } catch {
    return { data: newExpense, error: null };
  }
}

export async function deleteExpense(id: string) {
  const items = lsGet<Expense>(lsKey('expenses')).filter(e => e.id !== id);
  lsSet(lsKey('expenses'), items);

  try {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  } catch { /* localStorage already updated */ }
  return { error: null };
}

export async function getExpensesByProject(projectId: string): Promise<{ data: Expense[] | null; error: null }> {
  try {
    const { data, error } = await supabase.from('expenses').select('*').eq('project_id', projectId).order('expense_date', { ascending: false });
    if (error) throw error;
    return { data: data as Expense[], error: null };
  } catch {
    const items = lsGet<Expense>(lsKey('expenses')).filter(e => e.project_id === projectId);
    return { data: items, error: null };
  }
}

export async function getMonthlyPL(year?: number): Promise<{ month: string; revenue: number; expenses: number; profit: number }[]> {
  const y = year || new Date().getFullYear();
  const months: { month: string; revenue: number; expenses: number; profit: number }[] = [];

  try {
    const [invRes, expRes] = await Promise.all([getInvoices(), getExpenses()]);
    const invoices = invRes.data || [];
    const expenses = expRes.data || [];

    for (let m = 0; m < 12; m++) {
      const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
      const monthLabel = new Date(y, m).toLocaleString('en-US', { month: 'short' });
      const rev = invoices
        .filter(i => i.status === 'paid' && (i.paid_at || i.paid_date || i.created_at || '').startsWith(prefix))
        .reduce((s, i) => s + (i.total || i.amount || 0), 0);
      const exp = expenses
        .filter(e => (e.expense_date || e.created_at || '').startsWith(prefix))
        .reduce((s, e) => s + (e.amount || 0), 0);
      months.push({ month: monthLabel, revenue: rev, expenses: exp, profit: rev - exp });
    }
  } catch {
    for (let m = 0; m < 12; m++) {
      months.push({ month: new Date(y, m).toLocaleString('en-US', { month: 'short' }), revenue: 0, expenses: 0, profit: 0 });
    }
  }
  return months;
}

// ============================================
// ACTIVITIES
// ============================================
export async function getActivities(limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('activities').select('*, client:clients(*), project:projects(*), lead:leads(*)')
      .order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return { data: data as Activity[] | null, error: null };
  } catch {
    const items = lsGet<Activity>(lsKey('activities')).slice(0, limit);
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
    const items = lsGet<Activity>(lsKey('activities'));
    items.unshift(newActivity);
    lsSet(lsKey('activities'), items);
    return { data: newActivity, error: null };
  }
}

// ============================================
// SCRAPED LEADS
// ============================================
export async function getScrapedLeads(filters?: { status?: string }) {
  try {
    let query = supabase.from('scraped_leads').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw error;
    return { data: data as ScrapedLead[] | null, error: null };
  } catch {
    let items = lsGet<ScrapedLead>(lsKey('scraped_leads'));
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
    const items = lsGet<ScrapedLead>(lsKey('scraped_leads'));
    items.unshift(newLead);
    lsSet(lsKey('scraped_leads'), items);
    return { data: newLead, error: null };
  }
}

export async function updateScrapedLead(id: string, updates: Partial<ScrapedLead>) {
  try {
    const { data, error } = await supabase.from('scraped_leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return { data: data as ScrapedLead | null, error: null };
  } catch {
    const items = lsGet<ScrapedLead>(lsKey('scraped_leads'));
    const idx = items.findIndex(l => l.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      lsSet(lsKey('scraped_leads'), items);
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
// CHAT LEADS
// ============================================
export async function createChatLead(lead: { visitor_name: string; email?: string; phone?: string; interested_in?: string }) {
  try {
    const { data, error } = await supabase.from('leads').insert({
      ...lead,
      name: lead.visitor_name,
      source: 'Chat Widget',
      status: 'new',
      score: 0,
      tags: ['chat-lead'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// ============================================
// BOOKINGS
// ============================================
export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  notes?: string;
  dismissed?: boolean;
  created_at: string;
}

export async function getBookings(): Promise<{ data: Booking[] | null; error: null }> {
  const local = lsGet<Booking>(lsKey('bookings'));
  try {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    const merged = mergeById((data as Booking[]) || [], local);
    if (merged.length > 0) lsSet(lsKey('bookings'), merged);
    return { data: merged, error: null };
  } catch {
    return { data: local, error: null };
  }
}

export async function createBooking(booking: Partial<Booking>): Promise<{ data: Booking | null; error: null }> {
  const now = new Date().toISOString();
  const full: Booking = {
    id: generateId(), name: booking.name || '', email: booking.email || '',
    phone: booking.phone, date: booking.date || '', time: booking.time || '',
    notes: booking.notes || '', dismissed: false, created_at: now, ...booking,
  } as Booking;

  const items = lsGet<Booking>(lsKey('bookings'));
  items.unshift(full);
  lsSet(lsKey('bookings'), items);

  try {
    const { data, error } = await supabase.from('bookings').insert(full).select().single();
    if (error) throw error;
    return { data: data as Booking, error: null };
  } catch {
    return { data: full, error: null };
  }
}

// ============================================
// MEDIA UPLOAD
// ============================================
export async function uploadMedia(file: File, meta?: { client_id?: string; project_id?: string; tags?: string[] }): Promise<{ data: MediaItem | null; error: string | null }> {
  const fileName = `${Date.now()}-${file.name}`;

  try {
    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    const publicUrl = urlData?.publicUrl || '';

    const record: Partial<MediaItem> = {
      id: generateId(),
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size,
      client_id: meta?.client_id,
      project_id: meta?.project_id,
      tags: meta?.tags || [],
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('media').insert(record).select().single();
    if (error) throw error;
    return { data: data as MediaItem, error: null };
  } catch {
    // localStorage fallback - store metadata only (no actual file storage)
    const record: MediaItem = {
      id: generateId(), name: file.name, url: URL.createObjectURL(file),
      type: file.type, size: file.size, tags: meta?.tags || [],
      client_id: meta?.client_id, project_id: meta?.project_id,
      created_at: new Date().toISOString(),
    };
    const items = lsGet<MediaItem>(lsKey('media'));
    items.unshift(record);
    lsSet(lsKey('media'), items);
    return { data: record, error: null };
  }
}

// ============================================
// NOTIFICATIONS
// ============================================
export async function createNotification(notification: { title: string; message: string; type?: string }) {
  try {
    const { data, error } = await supabase.from('notifications').insert({
      id: generateId(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      read: false,
      created_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch {
    return { data: null, error: null };
  }
}

// ============================================
// SUBSCRIPTION EXPENSES (localStorage)
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
      getInvoices(), getExpenses(), getProjects(), getClients(), getLeads(),
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
        totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses,
        outstandingInvoices: outstandingInvoices.length, outstandingAmount,
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
