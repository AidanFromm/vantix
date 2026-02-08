'use client';

import { useState, useEffect } from 'react';
import { Save, User, Bell, Palette, Shield, Database, ExternalLink } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('vantix_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-[var(--color-muted)] mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-[var(--color-accent)]" size={24} />
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg py-3 px-4 opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg py-3 px-4 opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg py-3 px-4 opacity-50 capitalize"
            />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="text-[var(--color-accent)]" size={24} />
          <h2 className="text-xl font-semibold">Integrations</h2>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Supabase', status: 'Not configured', connected: false },
            { name: 'GitHub', status: 'Ready to connect', connected: false },
            { name: 'Vercel', status: 'Ready to connect', connected: false },
            { name: 'Stripe', status: 'Ready to connect', connected: false },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 bg-[var(--color-primary)] rounded-lg border border-[var(--color-border)]"
            >
              <div>
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-[var(--color-muted)]">{integration.status}</p>
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  integration.connected
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white'
                }`}
              >
                {integration.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-[var(--color-accent)]" size={24} />
          <h2 className="text-xl font-semibold">Team Members</h2>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Aidan', email: 'aidan@vantix.com', role: 'Admin' },
            { name: 'Kyle', email: 'kyle@vantix.com', role: 'Admin' },
            { name: 'Botskii', email: 'botskii@vantix.com', role: 'Bot' },
            { name: "Kyle's Bot", email: 'kylebot@vantix.com', role: 'Bot' },
          ].map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between p-4 bg-[var(--color-primary)] rounded-lg border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold">
                  {member.name[0]}
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{member.email}</p>
                </div>
              </div>
              <span className="text-sm text-[var(--color-muted)]">{member.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white'
          }`}
        >
          <Save size={20} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
