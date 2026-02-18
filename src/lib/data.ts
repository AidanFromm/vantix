// Universal Data Access Layer
// Tries Supabase first, falls back to localStorage gracefully
import { supabase } from './supabase';

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
// GENERIC CRUD
// ============================================

export async function getData<T extends { id: string }>(table: string): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) lsSet(lsKey(table), data);
    return (data as T[]) || [];
  } catch {
    return lsGet<T>(lsKey(table));
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
  } as T;

  try {
    const { data, error } = await supabase.from(table).insert(full).select().single();
    if (error) throw error;
    return data as T;
  } catch {
    const items = lsGet<T>(lsKey(table));
    items.unshift(full);
    lsSet(lsKey(table), items);
    return full;
  }
}

export async function updateRecord<T extends { id: string }>(table: string, id: string, updates: Partial<T>): Promise<T> {
  const patched = { ...updates, updated_at: new Date().toISOString() } as Partial<T>;

  try {
    const { data, error } = await supabase.from(table).update(patched).eq('id', id).select().single();
    if (error) throw error;
    return data as T;
  } catch {
    const items = lsGet<T>(lsKey(table));
    const idx = items.findIndex((item) => item.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...patched } as T;
      lsSet(lsKey(table), items);
      return items[idx];
    }
    throw new Error(`Record ${id} not found in ${table}`);
  }
}

export async function deleteRecord(table: string, id: string): Promise<void> {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  } catch {
    const items = lsGet<{ id: string }>(lsKey(table)).filter((item) => item.id !== id);
    lsSet(lsKey(table), items);
  }
}

// ============================================
// QUERY HELPERS
// ============================================

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
