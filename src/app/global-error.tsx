'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ backgroundColor: '#F5EFE7', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 32 }}>
          <h2 style={{ color: '#1E1E1E', fontSize: 24, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#A89F94', fontSize: 14, marginBottom: 24 }}>An unexpected error occurred. Try refreshing the page.</p>
          <button onClick={reset} style={{ backgroundColor: '#B07A45', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
