export async function syncGet<T = unknown>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/sync?key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data !== null && json.data !== undefined) {
        // Cache to localStorage
        try { localStorage.setItem(key, JSON.stringify(json.data)); } catch {}
        return json.data as T;
      }
    }
  } catch {
    // API unavailable, fall back to localStorage
  }

  try {
    const local = localStorage.getItem(key);
    if (local) return JSON.parse(local) as T;
  } catch {}

  return null;
}

export async function syncSet<T = unknown>(key: string, data: T): Promise<void> {
  // Write to localStorage immediately
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}

  // Write to API
  try {
    await fetch(`/api/sync?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
  } catch {
    // Offline — localStorage already has it
  }
}

export async function syncMerge<T = unknown>(key: string, data: T): Promise<T> {
  // Write to API with merge flag
  try {
    const res = await fetch(`/api/sync?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, merge: true }),
    });
    if (res.ok) {
      const json = await res.json();
      try { localStorage.setItem(key, JSON.stringify(json.data)); } catch {}
      return json.data as T;
    }
  } catch {}

  // Fallback: local merge
  try {
    const local = localStorage.getItem(key);
    if (local) {
      const existing = JSON.parse(local);
      const merged = Array.isArray(existing) && Array.isArray(data)
        ? [...existing, ...data]
        : { ...existing, ...(data as object) };
      localStorage.setItem(key, JSON.stringify(merged));
      return merged as T;
    }
  } catch {}

  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  return data;
}

