'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

export default function SettingsResetButton() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleReset = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('vantix_'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setConfirming(false); }}
        className="p-2 rounded-lg text-[var(--color-muted)] hover:text-white hover:bg-[#EEE6DC]/10 transition-colors"
        title="Settings"
      >
        <Settings size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-2xl p-4 z-50">
          {!confirming ? (
            <>
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-semibold mb-3">
                Settings
              </p>
              <button
                onClick={() => setConfirming(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#B0614A] hover:bg-[#B0614A]/10 transition-colors text-sm font-medium"
              >
                Reset Dashboard Data
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--color-foreground)] mb-3">
                This will clear all cached data and reload with fresh defaults. Continue?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#B0614A]/50 hover:bg-[#8E5E34] text-white text-sm font-medium transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#EEE6DC]/5 hover:bg-[#EEE6DC]/10 text-[var(--color-muted)] text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

