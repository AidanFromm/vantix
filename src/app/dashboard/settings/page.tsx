'use client';

import { useState, useEffect } from 'react';
import { Settings, Building2, Users, Plug, Bell, CreditCard, AlertTriangle, Plus, X, Eye, EyeOff, Trash2, Download, Save } from 'lucide-react';

interface TeamMember { id: string; name: string; role: string; email: string; }
interface CompanyInfo { name: string; email: string; phone: string; address: string; }
interface Integration { id: string; name: string; description: string; connected: boolean; apiKey: string; }
interface NotifPrefs { emailDigest: boolean; inAppAlerts: boolean; weeklyReport: boolean; leadNotifs: boolean; }

function loadLS<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function saveLS(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const defaultCompany: CompanyInfo = { name: 'Vantix', email: 'hello@vantix.io', phone: '(908) 499-7696', address: '123 Business Ave, Suite 200' };
const defaultTeam: TeamMember[] = [
  { id: '1', name: 'Alex Rivera', role: 'Project Manager', email: 'alex@vantix.io' },
  { id: '2', name: 'Jordan Lee', role: 'Developer', email: 'jordan@vantix.io' },
  { id: '3', name: 'Sam Chen', role: 'Designer', email: 'sam@vantix.io' },
];
const defaultIntegrations: Integration[] = [
  { id: 'resend', name: 'Resend', description: 'Transactional email delivery', connected: true, apiKey: '' },
  { id: 'twilio', name: 'Twilio', description: 'SMS and voice communications', connected: true, apiKey: '' },
  { id: 'replicate', name: 'Replicate', description: 'AI model inference', connected: false, apiKey: '' },
  { id: 'calcom', name: 'Cal.com', description: 'Appointment scheduling', connected: true, apiKey: '' },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing', connected: false, apiKey: '' },
];
const defaultNotifs: NotifPrefs = { emailDigest: true, inAppAlerts: true, weeklyReport: false, leadNotifs: true };

export default function SettingsPage() {
  const [company, setCompany] = useState<CompanyInfo>(defaultCompany);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [notifs, setNotifs] = useState<NotifPrefs>(defaultNotifs);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCompany(loadLS('vantix_company', defaultCompany));
    setTeam(loadLS('vantix_team', defaultTeam));
    setIntegrations(loadLS('vantix_integrations', defaultIntegrations));
    setNotifs(loadLS('vantix_notifs', defaultNotifs));
  }, []);

  const saveAll = () => {
    saveLS('vantix_company', company);
    saveLS('vantix_team', team);
    saveLS('vantix_integrations', integrations);
    saveLS('vantix_notifs', notifs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addMember = () => {
    if (!newMember.name) return;
    const updated = [...team, { ...newMember, id: Date.now().toString() }];
    setTeam(updated);
    setNewMember({ name: '', role: '', email: '' });
    setShowAddMember(false);
  };

  const removeMember = (id: string) => setTeam(team.filter(m => m.id !== id));

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const updateIntKey = (id: string, key: string) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, apiKey: key } : i));
  };

  const toggleKey = (id: string) => setVisibleKeys(v => ({ ...v, [id]: !v[id] }));

  const exportData = () => {
    const data = { company, team, integrations: integrations.map(i => ({ ...i, apiKey: '***' })), notifs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'vantix-settings.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const clearCache = () => {
    try {
      ['vantix_company','vantix_team','vantix_integrations','vantix_notifs','vantix_calendar_events','vantix_report_range'].forEach(k => localStorage.removeItem(k));
    } catch {}
    setCompany(defaultCompany); setTeam(defaultTeam); setIntegrations(defaultIntegrations); setNotifs(defaultNotifs);
  };

  const Section = ({ icon: Icon, title, children }: { icon: typeof Settings; title: string; children: React.ReactNode }) => (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-[#1C1C1C] flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#B07A45]" /> {title}
      </h2>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#4B4B4B]">{label}</span>
      <button onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-[#B07A45]' : 'bg-[#E3D9CD]'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="text-xs font-medium text-[#7A746C] mb-1 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#B07A45]" /> Settings
          </h1>
          <p className="text-[#7A746C] text-sm mt-1">Manage your workspace configuration</p>
        </div>
        <button onClick={saveAll} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <Section icon={Building2} title="Company Info">
          <div className="space-y-3">
            <Input label="Company Name" value={company.name} onChange={v => setCompany({ ...company, name: v })} />
            <Input label="Email" value={company.email} onChange={v => setCompany({ ...company, email: v })} />
            <Input label="Phone" value={company.phone} onChange={v => setCompany({ ...company, phone: v })} />
            <Input label="Address" value={company.address} onChange={v => setCompany({ ...company, address: v })} />
          </div>
        </Section>

        {/* Team Members */}
        <Section icon={Users} title="Team Members">
          <div className="space-y-2 mb-3">
            {team.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-[#F4EFE8] rounded-xl p-3 border border-[#E3D9CD]">
                <div>
                  <p className="text-sm font-medium text-[#1C1C1C]">{m.name}</p>
                  <p className="text-xs text-[#7A746C]">{m.role} — {m.email}</p>
                </div>
                <button onClick={() => removeMember(m.id)} className="text-[#7A746C] hover:text-red-600 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {showAddMember ? (
            <div className="space-y-2 bg-[#F4EFE8] rounded-xl p-3 border border-[#E3D9CD]">
              <input placeholder="Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#EEE6DC] border border-[#E3D9CD] text-sm outline-none" />
              <input placeholder="Role" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#EEE6DC] border border-[#E3D9CD] text-sm outline-none" />
              <input placeholder="Email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#EEE6DC] border border-[#E3D9CD] text-sm outline-none" />
              <div className="flex gap-2">
                <button onClick={addMember} className="px-3 py-1.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-lg text-sm">Add</button>
                <button onClick={() => setShowAddMember(false)} className="px-3 py-1.5 text-[#7A746C] text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1 text-sm text-[#B07A45] hover:text-[#8E5E34] transition">
              <Plus className="w-4 h-4" /> Add Member
            </button>
          )}
        </Section>

        {/* Integrations */}
        <Section icon={Plug} title="Integrations">
          <div className="space-y-3">
            {integrations.map(int => (
              <div key={int.id} className="bg-[#F4EFE8] rounded-xl p-3 border border-[#E3D9CD]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1C]">{int.name}</p>
                    <p className="text-xs text-[#7A746C]">{int.description}</p>
                  </div>
                  <button onClick={() => toggleIntegration(int.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${int.connected ? 'bg-green-100 text-green-700' : 'bg-[#E3D9CD] text-[#7A746C]'}`}>
                    {int.connected ? 'Connected' : 'Disconnected'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input type={visibleKeys[int.id] ? 'text' : 'password'} placeholder="API Key" value={int.apiKey}
                    onChange={e => updateIntKey(int.id, e.target.value)}
                    className="flex-1 px-2 py-1 rounded-lg bg-[#EEE6DC] border border-[#E3D9CD] text-xs outline-none font-mono" />
                  <button onClick={() => toggleKey(int.id)} className="text-[#7A746C]">
                    {visibleKeys[int.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notifications + Billing */}
        <div className="space-y-6">
          <Section icon={Bell} title="Notification Preferences">
            <Toggle label="Daily email digest" checked={notifs.emailDigest} onChange={() => setNotifs({ ...notifs, emailDigest: !notifs.emailDigest })} />
            <Toggle label="In-app alerts" checked={notifs.inAppAlerts} onChange={() => setNotifs({ ...notifs, inAppAlerts: !notifs.inAppAlerts })} />
            <Toggle label="Weekly performance report" checked={notifs.weeklyReport} onChange={() => setNotifs({ ...notifs, weeklyReport: !notifs.weeklyReport })} />
            <Toggle label="New lead notifications" checked={notifs.leadNotifs} onChange={() => setNotifs({ ...notifs, leadNotifs: !notifs.leadNotifs })} />
          </Section>

          <Section icon={CreditCard} title="Billing">
            <div className="bg-[#F4EFE8] rounded-xl p-4 border border-[#E3D9CD]">
              <p className="text-sm font-medium text-[#1C1C1C]">Pro Plan</p>
              <p className="text-xs text-[#7A746C] mt-1">$49/month — Unlimited projects, priority support</p>
              <p className="text-xs text-[#7A746C] mt-0.5">Next billing: March 1, 2026</p>
              <button className="mt-3 px-3 py-1.5 text-sm text-[#B07A45] border border-[#B07A45] rounded-xl hover:bg-[#B07A45]/10 transition">
                Manage Subscription
              </button>
            </div>
          </Section>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#EEE6DC] border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportData} className="flex items-center gap-1.5 px-4 py-2 border border-[#E3D9CD] rounded-xl text-sm text-[#4B4B4B] hover:bg-[#F4EFE8] transition">
            <Download className="w-4 h-4" /> Export All Data
          </button>
          <button onClick={clearCache} className="flex items-center gap-1.5 px-4 py-2 border border-red-300 rounded-xl text-sm text-red-600 hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" /> Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
