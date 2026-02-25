'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

const SESSION_KEY = 'vantix_vault_auth';

interface Field {
  label: string;
  value: string;
}

interface Credential {
  id: string;
  name: string;
  project: string | null;
  type: string | null;
  fields: Field[];
  notes: string | null;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const PROJECTS = ['Vantix', 'SecuredTampa', 'J4K', 'CardLedger', 'MixzoKickz'];
const TYPES = ['API Key', 'Login/Password', 'Database', 'Domain/DNS', 'Payment/Billing'];

const PROJECT_COLORS: Record<string, string> = {
  Vantix: 'bg-[#B07A45]/15 text-[#B07A45]',
  SecuredTampa: 'bg-blue-100 text-blue-700',
  J4K: 'bg-purple-100 text-purple-700',
  CardLedger: 'bg-emerald-100 text-emerald-700',
  MixzoKickz: 'bg-pink-100 text-pink-700',
};

// ── Password Gate ──────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/vault/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        onAuth();
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-sm p-8">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#C89A6A] to-[#B07A45] flex items-center justify-center">
              <Shield size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#1C1C1C] text-center mb-1">Secure Vault</h1>
          <p className="text-sm text-[#7A746C] text-center mb-6">Enter password to access credentials</p>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Password"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] text-sm placeholder:text-[#A39B90] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45]"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">Incorrect password</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock Vault'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Copy Button ────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] transition-colors" title="Copy">
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
}

// ── Masked Field ───────────────────────────────────────────────
function MaskedField({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-[#E3D9CD]/50 last:border-0">
      <span className="text-xs text-[#7A746C] w-24 flex-shrink-0 font-medium">{label}</span>
      <span className="text-xs text-[#1C1C1C] flex-1 font-mono break-all">
        {visible ? value : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
      </span>
      <button onClick={() => setVisible(!visible)} className="p-1 rounded hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] transition-colors" title={visible ? 'Hide' : 'Reveal'}>
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <CopyButton value={value} />
    </div>
  );
}

// ── Credential Card ────────────────────────────────────────────
function CredentialCard({ cred, onEdit, onDelete }: { cred: Credential; onEdit: () => void; onDelete: () => void }) {
  const isExpiringSoon = cred.expires_at && new Date(cred.expires_at).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && new Date(cred.expires_at).getTime() > Date.now();
  const isExpired = cred.expires_at && new Date(cred.expires_at).getTime() < Date.now();

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1C1C1C] truncate">{cred.name}</h3>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            {cred.project && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PROJECT_COLORS[cred.project] || 'bg-gray-100 text-gray-600'}`}>
                {cred.project}
              </span>
            )}
            {cred.type && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4EFE8] text-[#7A746C] border border-[#E3D9CD]">
                {cred.type}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] transition-colors" title="Edit">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-[#7A746C] hover:text-red-500 transition-colors" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        {(cred.fields || []).map((f, i) => (
          <MaskedField key={i} label={f.label} value={f.value} />
        ))}
      </div>

      {cred.notes && (
        <p className="text-xs text-[#7A746C] mb-2 italic">{cred.notes}</p>
      )}

      <div className="flex items-center justify-between text-[10px] text-[#A39B90] mt-2 pt-2 border-t border-[#E3D9CD]/50">
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>Updated {new Date(cred.updated_at).toLocaleDateString()}</span>
        </div>
        {(isExpiringSoon || isExpired) && (
          <div className={`flex items-center gap-1 ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
            <AlertTriangle size={10} />
            <span>{isExpired ? 'Expired' : 'Expiring soon'}</span>
          </div>
        )}
        {cred.expires_at && !isExpiringSoon && !isExpired && (
          <span>Expires {new Date(cred.expires_at).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

// ── Credential Modal ───────────────────────────────────────────
function CredentialModal({
  credential,
  onSave,
  onClose,
}: {
  credential?: Credential;
  onSave: (data: Partial<Credential>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(credential?.name || '');
  const [project, setProject] = useState(credential?.project || '');
  const [type, setType] = useState(credential?.type || '');
  const [fields, setFields] = useState<Field[]>(credential?.fields?.length ? credential.fields : [{ label: '', value: '' }]);
  const [notes, setNotes] = useState(credential?.notes || '');
  const [expiresAt, setExpiresAt] = useState(credential?.expires_at ? credential.expires_at.split('T')[0] : '');
  const [saving, setSaving] = useState(false);

  const addField = () => setFields([...fields, { label: '', value: '' }]);
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));
  const updateField = (i: number, key: 'label' | 'value', val: string) => {
    const updated = [...fields];
    updated[i] = { ...updated[i], [key]: val };
    setFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      project: project || null,
      type: type || null,
      fields: fields.filter((f) => f.label.trim() || f.value.trim()),
      notes: notes.trim() || null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    setSaving(false);
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] text-sm placeholder:text-[#A39B90] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45]";
  const selectCls = "w-full px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45] appearance-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1C]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#E3D9CD]">
          <h2 className="text-base font-bold text-[#1C1C1C]">{credential ? 'Edit Credential' : 'Add Credential'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#4B4B4B] mb-1 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Resend API Key" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#4B4B4B] mb-1 block">Project</label>
              <div className="relative">
                <select value={project} onChange={(e) => setProject(e.target.value)} className={selectCls}>
                  <option value="">None</option>
                  {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A746C] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4B4B4B] mb-1 block">Type</label>
              <div className="relative">
                <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                  <option value="">None</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A746C] pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#4B4B4B]">Fields</label>
              <button type="button" onClick={addField} className="text-xs text-[#B07A45] hover:underline font-semibold flex items-center gap-1">
                <Plus size={12} /> Add Field
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={f.label} onChange={(e) => updateField(i, 'label', e.target.value)} className={`${inputCls} flex-[2]`} placeholder="Label" />
                  <input value={f.value} onChange={(e) => updateField(i, 'value', e.target.value)} className={`${inputCls} flex-[3]`} placeholder="Value" />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => removeField(i)} className="p-1 text-[#7A746C] hover:text-red-500"><X size={14} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#4B4B4B] mb-1 block">Expiration Date (optional)</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#4B4B4B] mb-1 block">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#7A746C] hover:text-[#1C1C1C] rounded-xl hover:bg-[#E3D9CD] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? 'Saving...' : credential ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation ────────────────────────────────────────
function DeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1C]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl shadow-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={22} className="text-red-500" />
          </div>
        </div>
        <h3 className="text-base font-bold text-[#1C1C1C] text-center mb-1">Delete Credential</h3>
        <p className="text-sm text-[#7A746C] text-center mb-5">
          Are you sure you want to delete <span className="font-semibold text-[#1C1C1C]">{name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm text-[#7A746C] rounded-xl border border-[#E3D9CD] hover:bg-[#E3D9CD] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Vault ─────────────────────────────────────────────────
export default function VaultPage() {
  const [authed, setAuthed] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCred, setEditingCred] = useState<Credential | undefined>();
  const [deletingCred, setDeletingCred] = useState<Credential | undefined>();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setAuthed(true);
    }
  }, []);

  const fetchCredentials = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('credentials')
      .select('*')
      .order('created_at', { ascending: false });
    setCredentials((data as Credential[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchCredentials();
  }, [authed, fetchCredentials]);

  const handleSave = async (data: Partial<Credential>) => {
    if (editingCred) {
      await supabase
        .from('credentials')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingCred.id);
    } else {
      await supabase.from('credentials').insert({ ...data, created_by: 'vault' });
    }
    setModalOpen(false);
    setEditingCred(undefined);
    fetchCredentials();
  };

  const handleDelete = async () => {
    if (!deletingCred) return;
    await supabase.from('credentials').delete().eq('id', deletingCred.id);
    setDeletingCred(undefined);
    fetchCredentials();
  };

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  const filtered = credentials.filter((c) => {
    if (filterProject && c.project !== filterProject) return false;
    if (filterType && c.type !== filterType) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectCls = "px-3 py-2 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45] appearance-none";

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Secure Vault</h1>
          <p className="text-sm text-[#7A746C] mt-0.5">{credentials.length} credentials stored</p>
        </div>
        <button
          onClick={() => { setEditingCred(undefined); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Credential
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className={selectCls} style={{ paddingRight: '2rem' }}>
            <option value="">All Projects</option>
            {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A746C] pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectCls} style={{ paddingRight: '2rem' }}>
            <option value="">All Types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A746C] pointer-events-none" />
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search credentials..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] text-sm placeholder:text-[#A39B90] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 focus:border-[#B07A45]"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#B07A45] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Shield size={40} className="mx-auto text-[#E3D9CD] mb-3" />
          <p className="text-sm text-[#7A746C]">{credentials.length === 0 ? 'No credentials yet. Add your first one.' : 'No credentials match your filters.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cred) => (
            <CredentialCard
              key={cred.id}
              cred={cred}
              onEdit={() => { setEditingCred(cred); setModalOpen(true); }}
              onDelete={() => setDeletingCred(cred)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <CredentialModal
          credential={editingCred}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingCred(undefined); }}
        />
      )}
      {deletingCred && (
        <DeleteModal
          name={deletingCred.name}
          onConfirm={handleDelete}
          onClose={() => setDeletingCred(undefined)}
        />
      )}
    </div>
  );
}
