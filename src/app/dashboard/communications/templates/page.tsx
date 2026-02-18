'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Copy, Send, FileText, Eye, Pencil, Trash2, Tag } from 'lucide-react'

type Category = 'Welcome' | 'Follow-up' | 'Proposal' | 'Invoice' | 'Custom'

interface Template {
  id: string
  name: string
  category: Category
  subject: string
  body: string
}

const STORAGE_KEY = 'vantix_email_templates'

const categories: Category[] = ['Welcome', 'Follow-up', 'Proposal', 'Invoice', 'Custom']

const categoryColors: Record<Category, string> = {
  'Welcome': 'bg-[#5B8C5A]/15 text-[#5B8C5A]',
  'Follow-up': 'bg-[#B07A45]/15 text-[#B07A45]',
  'Proposal': 'bg-[#6B7FB5]/15 text-[#6B7FB5]',
  'Invoice': 'bg-[#8B5E83]/15 text-[#8B5E83]',
  'Custom': 'bg-[#7A746C]/15 text-[#7A746C]',
}

const seedTemplates: Template[] = [
  {
    id: '1', name: 'Welcome Email', category: 'Welcome',
    subject: 'Welcome to Vantix - Next Steps',
    body: 'Hi {{client_name}},\n\nThank you for choosing Vantix for your security needs. We are excited to work with you.\n\nHere is what happens next:\n1. We will schedule a free consultation to assess your requirements\n2. You will receive a customized proposal within 48 hours\n3. Once approved, installation is typically completed within 5-7 business days\n\nIf you have any questions in the meantime, do not hesitate to reach out.\n\nBest regards,\nThe Vantix Team'
  },
  {
    id: '2', name: 'Follow-up After Consultation', category: 'Follow-up',
    subject: 'Great Meeting You, {{client_name}}',
    body: 'Hi {{client_name}},\n\nIt was great speaking with you today about your security needs. As discussed, I am putting together a comprehensive proposal that covers:\n\n- {{service_details}}\n- Timeline and installation process\n- Pricing and payment options\n\nYou can expect the proposal in your inbox within 24-48 hours. Feel free to reach out if you think of any additional requirements.\n\nLooking forward to working together.\n\nBest,\nVantix Team'
  },
  {
    id: '3', name: 'Proposal Introduction', category: 'Proposal',
    subject: 'Your Security Proposal from Vantix',
    body: 'Hi {{client_name}},\n\nPlease find attached your customized security proposal for {{project_name}}.\n\nProposal Summary:\n- Total Investment: {{total_amount}}\n- Installation Timeline: {{timeline}}\n- Warranty: 2-year comprehensive coverage\n\nThis proposal is valid for 30 days. To accept, simply reply to this email or click the approval link in the attached document.\n\nI am happy to walk through any details or adjust the scope as needed.\n\nBest regards,\nVantix Team'
  },
  {
    id: '4', name: 'Invoice Reminder', category: 'Invoice',
    subject: 'Payment Reminder - Invoice #{{invoice_number}}',
    body: 'Hi {{client_name}},\n\nThis is a friendly reminder that Invoice #{{invoice_number}} for {{amount}} is due on {{due_date}}.\n\nPayment Methods:\n- Bank Transfer: Details in the invoice\n- Credit Card: Pay online at our portal\n- Check: Mail to our office address\n\nIf you have already sent payment, please disregard this message. If you have any questions about the invoice, please do not hesitate to contact us.\n\nThank you for your business.\n\nBest,\nVantix Team'
  },
  {
    id: '5', name: 'Meeting Recap', category: 'Custom',
    subject: 'Meeting Recap - {{meeting_date}}',
    body: 'Hi {{client_name}},\n\nThank you for your time today. Here is a summary of what we discussed:\n\nKey Points:\n{{meeting_notes}}\n\nAction Items:\n{{action_items}}\n\nNext Steps:\n- {{next_steps}}\n\nPlease review and let me know if I missed anything or if you have additional questions.\n\nBest regards,\nVantix Team'
  }
]

function loadTemplates(): Template[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return seedTemplates
}

function saveTemplates(t: Template[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)) } catch {}
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filterCat, setFilterCat] = useState<Category | 'All'>('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Template | null>(null)
  const [preview, setPreview] = useState<Template | null>(null)
  const [form, setForm] = useState({ name: '', category: 'Welcome' as Category, subject: '', body: '' })
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => { setTemplates(loadTemplates()) }, [])
  useEffect(() => { if (templates.length) saveTemplates(templates) }, [templates])

  const filtered = filterCat === 'All' ? templates : templates.filter(t => t.category === filterCat)

  function openCreate() {
    setEditing(null)
    setForm({ name: '', category: 'Welcome', subject: '', body: '' })
    setShowModal(true)
  }

  function openEdit(t: Template) {
    setEditing(t)
    setForm({ name: t.name, category: t.category, subject: t.subject, body: t.body })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.name || !form.subject) return
    if (editing) {
      setTemplates(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t))
    } else {
      setTemplates(prev => [...prev, { id: Date.now().toString(), ...form }])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setTemplates(prev => prev.filter(t => t.id !== id))
    if (preview?.id === id) setPreview(null)
  }

  function handleCopy(t: Template) {
    navigator.clipboard.writeText(`Subject: ${t.subject}\n\n${t.body}`)
    setCopied(t.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Email Templates</h1>
            <p className="text-sm text-[#7A746C]">{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> New Template
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD] mb-6 w-fit">
          <button onClick={() => setFilterCat('All')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === 'All' ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'}`}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === c ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'}`}>{c}</button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#1C1C1C] truncate">{t.name}</h3>
                  <p className="text-xs text-[#7A746C] truncate mt-0.5">{t.subject}</p>
                </div>
                <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium flex-shrink-0 ${categoryColors[t.category]}`}>
                  <Tag size={10} /> {t.category}
                </span>
              </div>
              <p className="text-xs text-[#4B4B4B] leading-relaxed flex-1 line-clamp-3 mb-4">{t.body.slice(0, 150)}...</p>
              <div className="flex items-center gap-2 pt-3 border-t border-[#E3D9CD]">
                <button onClick={() => setPreview(t)} className="flex items-center gap-1 px-2.5 py-1.5 text-[#7A746C] hover:text-[#1C1C1C] text-xs transition-colors"><Eye size={12} /> Preview</button>
                <button onClick={() => openEdit(t)} className="flex items-center gap-1 px-2.5 py-1.5 text-[#7A746C] hover:text-[#1C1C1C] text-xs transition-colors"><Pencil size={12} /> Edit</button>
                <button onClick={() => handleDelete(t.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-[#7A746C] hover:text-red-600 text-xs transition-colors"><Trash2 size={12} /></button>
                <div className="flex-1" />
                <button onClick={() => handleCopy(t)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                  <Copy size={12} /> {copied === t.id ? 'Copied' : 'Use'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E3D9CD]">
              <div>
                <h3 className="text-lg font-semibold text-[#1C1C1C]">{preview.name}</h3>
                <p className="text-xs text-[#7A746C]">Subject: {preview.subject}</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-[#7A746C] hover:text-[#1C1C1C]"><X size={18} /></button>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm text-[#4B4B4B] leading-relaxed">{preview.body}</pre>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[#E3D9CD]">
              <button onClick={() => { handleCopy(preview); setPreview(null) }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <Copy size={14} /> Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E3D9CD]">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">{editing ? 'Edit Template' : 'New Template'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#7A746C] hover:text-[#1C1C1C]"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Template name" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject line" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <div>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Email body... Use {{client_name}} for variables" rows={10} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] resize-none" />
                <p className="text-[10px] text-[#7A746C] mt-1">Variables: {'{{client_name}}, {{amount}}, {{project_name}}, {{due_date}}'}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[#E3D9CD]">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-[#4B4B4B] hover:text-[#1C1C1C]">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <FileText size={14} /> {editing ? 'Save Changes' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
