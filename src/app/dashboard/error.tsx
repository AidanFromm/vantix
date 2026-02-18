'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="p-4 rounded-2xl bg-red-50 mb-6">
        <AlertCircle size={32} className="text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-[#4A2112] mb-2">Dashboard Error</h2>
      <p className="text-[#8B6B56] text-sm mb-6 max-w-md">
        {error.message || 'Something went wrong loading the dashboard. This usually means the database tables need to be set up.'}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B3A1F] text-white font-medium hover:bg-[#A07848] transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
