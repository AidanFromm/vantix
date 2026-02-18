'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getData, getById, createRecord, updateRecord, deleteRecord } from '@/lib/data';

// ============================================
// useCollection — SWR-style hook for a table
// ============================================
export function useCollection<T extends { id: string }>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getData<T>(table);
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) setError(err as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    mountedRef.current = true;
    refresh();
    return () => { mountedRef.current = false; };
  }, [refresh]);

  const create = useCallback(async (record: Partial<T>): Promise<T> => {
    const created = await createRecord<T>(table, record);
    // Optimistic: prepend to list
    setData((prev) => [created, ...prev]);
    return created;
  }, [table]);

  const update = useCallback(async (id: string, updates: Partial<T>): Promise<T> => {
    // Optimistic update
    setData((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
    try {
      return await updateRecord<T>(table, id, updates);
    } catch (err) {
      // Revert on failure
      refresh();
      throw err;
    }
  }, [table, refresh]);

  const remove = useCallback(async (id: string): Promise<void> => {
    // Optimistic remove
    setData((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteRecord(table, id);
    } catch (err) {
      refresh();
      throw err;
    }
  }, [table, refresh]);

  return { data, loading, error, refresh, create, update, remove };
}

// ============================================
// useRecord — Single record hook
// ============================================
export function useRecord<T extends { id: string }>(table: string, id: string | null | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getById<T>(table, id)
      .then((result) => {
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mountedRef.current) setLoading(false);
      });
    return () => { mountedRef.current = false; };
  }, [table, id]);

  const update = useCallback(async (updates: Partial<T>): Promise<T> => {
    if (!id) throw new Error('No record ID');
    const updated = await updateRecord<T>(table, id, updates);
    setData(updated);
    return updated;
  }, [table, id]);

  return { data, loading, update };
}
