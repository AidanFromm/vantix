'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

// Temporary users until Supabase is set up
const TEMP_USERS = [
  { email: 'aidan@vantix.com', password: 'vantix2024', name: 'Aidan', role: 'admin' },
  { email: 'kyle@vantix.com', password: 'vantix2024', name: 'Kyle', role: 'admin' },
  { email: 'botskii@vantix.com', password: 'vantix2024', name: 'Botskii', role: 'bot' },
  { email: 'kylebot@vantix.com', password: 'vantix2024', name: "Kyle's Bot", role: 'bot' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));

    const user = TEMP_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      // Store user in localStorage (temporary until Supabase)
      localStorage.setItem('vantix_user', JSON.stringify(user));
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <span className="text-3xl font-bold gradient-text">Vantix</span>
        </Link>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-[var(--color-muted)] mb-8">Sign in to your dashboard</p>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="you@vantix.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[#2C1810] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2C1810] hover:bg-[#3A1A0D] disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

{/* Demo credentials removed */}
        </div>
      </div>
    </div>
  );
}

