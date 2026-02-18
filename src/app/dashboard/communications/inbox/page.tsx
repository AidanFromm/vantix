'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mail, Search, Plus, X, Send, Filter, ChevronDown, ChevronUp, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, BarChart3, ArrowUpRight } from 'lucide-react'
import supabase from '@/lib/supabase-client'

// Types
interface EmailRecord {
  id: string
  direction: string
  from_email: string
  to_email: string
  subject: string
  body_html: string
  status: string
  resend_id: string | null
  sent_at: string | null
  template_id: string | null
  created_at: string
}

type StatusFilter = 'all' | 'sent' | 'delivered' | 'bounced' | 'failed'

const STORAGE_KEY = 'vantix_email_log'

// Helpers
function statusIcon(status: string) {
  switch (status) {
    case 'delivered': return <CheckCircle2 size={14} className="text-green-600" />
    case 'sent': return <ArrowUpRight size={14} className="text-[#B07A45]" />
    case 'bounced': return <AlertTriangle size={14} className="text-amber-500" />
    case 'failed': return <XCircle size={14} className="text-red-500" />
    default: return <Clock size={14} className="text-[#7A746C]" />
  }
}

function statusBadge(status: string) {
  const base = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium capitalize'
  switch (status) {
    case 'delivered': return `${base} bg-green-100 text-green-700`
    case 'sent': return `${base} bg-[#B07A45]/15 text-[#B07A45]`
    case 'bounced': return `${base} bg-amber-100 text-amber-700`
    case 'failed': return `${base} bg-red-100 text-red-600`
    default: return `${base} bg-[#E3D9CD] text-[#7A746C]`
  }
}

function formatDate(ts: string | null) {
  if (!ts) return '--'
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function EmailLogPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [sending, setSending] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: sbError } = await supabase
        .from('emails')
        .select('*')
        .eq('direction', 'outbound')
        .order('created_at', { ascending: false })

      if (sbError) throw sbError
      if (data) {
        setEmails(data as EmailRecord[])
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
      }
    } catch {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) setEmails(JSON.parse(stored))
      } catch {}
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEmails() }, [fetchEmails])

  const filtered = emails.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return e.to_email?.toLowerCase().includes(q) || e.subject?.toLowerCase().includes(q)
    }
    return true
  })

  // Stats
  const totalSent = emails.length
  const delivered = emails.filter(e => e.status === 'delivered').length
  const bounced = emails.filter(e => e.status === 'bounced').length
  const failed = emails.filter(e => e.status === 'failed').length

  async function handleSend() {
    if (!composeTo || !composeSubject) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: composeTo, subject: composeSubject, html: composeBody || `<p>${composeBody}</p>` })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send email')
      }
      setShowCompose(false)
      setComposeTo(''); setComposeSubject(''); setComposeBody('')
      fetchEmails()
    } catch (err: any) {
      setError(err.message || 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const stats = [
    { label: 'Total Sent', value: totalSent, icon: <Send size={16} />, color: 'text-[#B07A45]' },
    { label: 'Delivered', value: delivered, icon: <CheckCircle2 size={16} />, color: 'text-green-600' },
    { label: 'Bounced', value: bounced, icon: <AlertTriangle size={16} />, color: 'text-amber-500' },
    { label: 'Open Rate', value: totalSent > 0 ? `${Math.round((delivered / totalSent) * 100)}%` : '--', icon: <BarChart3 size={16} />, color: 'text-[#6B7FB5]' },
  ]

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Email Log</h1>
            <p className="text-sm text-[#7A746C]">Outbound emails sent via Resend</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchEmails} className="p-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#7A746C] hover:text-[#1C1C1C] transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus size={16} /> Compose
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={s.color}>{s.icon}</span>
                <span className="text-xs text-[#7A746C] font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#1C1C1C]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD]">
            {(['all', 'sent', 'delivered', 'bounced', 'failed'] as StatusFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by recipient or subject..."
              className="w-full pl-9 pr-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
          </div>
        </div>

        {/* Email Table */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[140px_1fr_1fr_120px_140px] gap-4 px-5 py-3 border-b border-[#E3D9CD] text-xs font-semibold text-[#7A746C] uppercase tracking-wide">
            <span>Date</span>
            <span>To</span>
            <span>Subject</span>
            <span>Status</span>
            <span>Template</span>
          </div>

          {loading && emails.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <RefreshCw size={20} className="animate-spin text-[#B07A45] mr-2" />
              <span className="text-sm text-[#7A746C]">Loading emails...</span>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Mail size={36} className="text-[#E3D9CD] mb-3" />
              <p className="text-sm text-[#7A746C]">{emails.length === 0 ? 'No emails sent yet' : 'No emails match your filters'}</p>
            </div>
          )}

          {filtered.map(email => (
            <div key={email.id}>
              <button onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                className="w-full text-left grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_120px_140px] gap-2 md:gap-4 px-5 py-3.5 border-b border-[#E3D9CD] hover:bg-[#E3D9CD]/50 transition-colors items-center">
                <span className="text-xs text-[#7A746C]">{formatDate(email.sent_at || email.created_at)}</span>
                <span className="text-sm text-[#1C1C1C] truncate">{email.to_email}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-[#4B4B4B] truncate">{email.subject || '(no subject)'}</span>
                  {expandedId === email.id ? <ChevronUp size={14} className="text-[#7A746C] flex-shrink-0" /> : <ChevronDown size={14} className="text-[#7A746C] flex-shrink-0" />}
                </div>
                <span className={statusBadge(email.status)}>
                  {statusIcon(email.status)} {email.status}
                </span>
                <span className="text-xs text-[#7A746C] truncate">{email.template_id || '--'}</span>
              </button>

              {/* Expanded Body */}
              {expandedId === email.id && (
                <div className="px-5 py-4 bg-[#F4EFE8] border-b border-[#E3D9CD]">
                  <div className="flex items-center gap-4 mb-3 text-xs text-[#7A746C]">
                    <span>From: {email.from_email}</span>
                    <span>To: {email.to_email}</span>
                    {email.resend_id && <span>Resend ID: {email.resend_id}</span>}
                  </div>
                  {email.body_html ? (
                    <div className="bg-white border border-[#E3D9CD] rounded-xl p-4 text-sm text-[#4B4B4B] max-h-80 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: email.body_html }} />
                  ) : (
                    <p className="text-sm text-[#7A746C] italic">No email body available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E3D9CD]">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">Compose Email</h3>
              <button onClick={() => { setShowCompose(false); setError(null) }} className="text-[#7A746C] hover:text-[#1C1C1C]"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <XCircle size={14} /> {error}
                </div>
              )}
              <input value={composeTo} onChange={e => setComposeTo(e.target.value)} placeholder="To (email address)"
                className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject"
                className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} placeholder="Email body (HTML supported)..." rows={8}
                className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] resize-none font-mono" />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[#E3D9CD]">
              <button onClick={() => { setShowCompose(false); setError(null) }} className="px-4 py-2 text-sm text-[#4B4B4B] hover:text-[#1C1C1C]">Cancel</button>
              <button onClick={handleSend} disabled={sending || !composeTo || !composeSubject}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />} {sending ? 'Sending...' : 'Send via Resend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
