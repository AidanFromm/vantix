'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Send, Copy, Pencil, Trash2, ArrowLeft, FileText, Eye, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data'

type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Declined'

interface LineItem { service: string; price: number }

interface ActivityEntry { action: string; timestamp: string }

interface Proposal {
  id: string
  title: string
  client: string
  description: string
  lineItems: LineItem[]
  total: number
  terms: string
  status: ProposalStatus
  date: string
  activity: ActivityEntry[]
}

const STORAGE_KEY = 'vantix_proposals'

const statusConfig: Record<ProposalStatus, { color: string; icon: typeof Clock }> = {
  'Draft': { color: 'bg-[#7A746C]/15 text-[#7A746C]', icon: FileText },
  'Sent': { color: 'bg-[#6B7FB5]/15 text-[#6B7FB5]', icon: Send },
  'Viewed': { color: 'bg-[#B07A45]/15 text-[#B07A45]', icon: Eye },
  'Accepted': { color: 'bg-[#5B8C5A]/15 text-[#5B8C5A]', icon: CheckCircle },
  'Declined': { color: 'bg-[#B54B4B]/15 text-[#B54B4B]', icon: XCircle },
}

const seedProposals: Proposal[] = [
  {
    id: '1', title: 'Security System Installation - SecuredTampa', client: 'SecuredTampa',
    description: 'Complete security camera and access control installation for commercial property including 8 exterior cameras, 4 interior cameras, and keycard access system.',
    lineItems: [
      { service: 'Security Cameras (12x)', price: 2400 },
      { service: 'Access Control System', price: 1200 },
      { service: 'Installation & Wiring', price: 600 },
      { service: 'Monitoring Setup (1yr)', price: 300 },
    ],
    total: 4500, terms: 'Net 30. 50% deposit required to begin installation. Includes 2-year warranty on all equipment.',
    status: 'Accepted', date: '2026-02-10',
    activity: [
      { action: 'Proposal created', timestamp: '2026-02-10T10:00:00' },
      { action: 'Sent to client', timestamp: '2026-02-10T10:15:00' },
      { action: 'Viewed by client', timestamp: '2026-02-11T09:30:00' },
      { action: 'Accepted by client', timestamp: '2026-02-12T14:00:00' },
    ]
  },
  {
    id: '2', title: 'Warehouse Monitoring Package', client: 'Robert Simmons',
    description: 'Comprehensive warehouse security monitoring with AI-powered threat detection, access control for 3 entry points, and biometric server room access.',
    lineItems: [
      { service: 'AI Security Cameras (6x)', price: 3600 },
      { service: 'Biometric Access Control', price: 2200 },
      { service: 'Keycard System (3 doors)', price: 900 },
      { service: 'Installation & Configuration', price: 1300 },
    ],
    total: 8000, terms: 'Net 45. Payment plan available: 3 installments. Equipment warranty: 2 years. Monitoring contract: 12 months minimum.',
    status: 'Draft', date: '2026-02-17',
    activity: [
      { action: 'Proposal created', timestamp: '2026-02-17T16:00:00' },
    ]
  }
]

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selected, setSelected] = useState<Proposal | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Proposal | null>(null)
  const [form, setForm] = useState({ title: '', client: '', description: '', terms: '', lineItems: [{ service: '', price: 0 }] as LineItem[] })

  useEffect(() => {
    (async () => {
      const d = await getData<Proposal>('proposals')
      setProposals(d)
    })()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm({ title: '', client: '', description: '', terms: '', lineItems: [{ service: '', price: 0 }] })
    setShowCreate(true)
  }

  function openEdit(p: Proposal) {
    setEditing(p)
    setForm({ title: p.title, client: p.client, description: p.description, terms: p.terms, lineItems: [...p.lineItems] })
    setShowCreate(true)
  }

  async function handleSave() {
    if (!form.title || !form.client) return
    const items = form.lineItems.filter(i => i.service)
    const total = items.reduce((s, i) => s + i.price, 0)
    if (editing) {
      const updates = { ...form, lineItems: items, total, activity: [...editing.activity, { action: 'Proposal edited', timestamp: new Date().toISOString() }] }
      await updateRecord<Proposal>('proposals', editing.id, updates as any)
      setProposals(prev => prev.map(p => p.id === editing.id ? { ...p, ...updates } : p))
      if (selected?.id === editing.id) setSelected(prev => prev ? { ...prev, ...updates } : null)
    } else {
      const np = await createRecord<Proposal>('proposals', {
        ...form, lineItems: items, total,
        status: 'Draft', date: new Date().toISOString().split('T')[0],
        activity: [{ action: 'Proposal created', timestamp: new Date().toISOString() }]
      } as any)
      setProposals(prev => [np, ...prev])
    }
    setShowCreate(false)
  }

  async function handleSend(p: Proposal) {
    const updates = { status: 'Sent' as ProposalStatus, activity: [...p.activity, { action: 'Sent to client', timestamp: new Date().toISOString() }] }
    await updateRecord<Proposal>('proposals', p.id, updates as any)
    setProposals(prev => prev.map(pr => pr.id === p.id ? { ...pr, ...updates } : pr))
    if (selected?.id === p.id) setSelected(prev => prev ? { ...prev, ...updates } : null)
  }

  async function handleDuplicate(p: Proposal) {
    const dup = await createRecord<Proposal>('proposals', {
      title: `${p.title} (Copy)`, client: p.client, description: p.description, terms: p.terms,
      lineItems: [...p.lineItems], total: p.total, status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      activity: [{ action: 'Duplicated from existing proposal', timestamp: new Date().toISOString() }]
    } as any)
    setProposals(prev => [dup, ...prev])
  }

  async function handleDelete(id: string) {
    await deleteRecord('proposals', id)
    setProposals(prev => prev.filter(p => p.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  async function handleStatusChange(p: Proposal, status: ProposalStatus) {
    const actionMap: Record<string, string> = { 'Accepted': 'Accepted by client', 'Declined': 'Declined by client', 'Viewed': 'Viewed by client' }
    const updates = { status, activity: [...p.activity, { action: actionMap[status] || `Status changed to ${status}`, timestamp: new Date().toISOString() }] }
    await updateRecord<Proposal>('proposals', p.id, updates as any)
    setProposals(prev => prev.map(pr => pr.id === p.id ? { ...pr, ...updates } : pr))
    setSelected(prev => prev?.id === p.id ? { ...prev, ...updates } : prev)
  }

  function addLineItem() { setForm(f => ({ ...f, lineItems: [...f.lineItems, { service: '', price: 0 }] })) }
  function updateLineItem(i: number, field: keyof LineItem, value: string | number) {
    setForm(f => ({ ...f, lineItems: f.lineItems.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }))
  }
  function removeLineItem(i: number) { setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) })) }

  const formTotal = form.lineItems.filter(i => i.service).reduce((s, i) => s + Number(i.price), 0)

  if (selected) {
    const StatusIcon = statusConfig[selected.status].icon
    return (
      <div className="min-h-screen bg-[#F4EFE8] p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-[#7A746C] hover:text-[#1C1C1C] mb-4"><ArrowLeft size={16} /> Back to Proposals</button>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#E3D9CD]">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-[#1C1C1C]">{selected.title}</h1>
                  <p className="text-sm text-[#7A746C] mt-1">Client: {selected.client} | Created: {new Date(selected.date).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium ${statusConfig[selected.status].color}`}>
                  <StatusIcon size={12} /> {selected.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#4B4B4B] mb-6">{selected.description}</p>
              <h3 className="text-sm font-semibold text-[#1C1C1C] mb-3">Line Items</h3>
              <div className="bg-[#F4EFE8] rounded-xl border border-[#E3D9CD] overflow-hidden mb-6">
                {selected.lineItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-[#E3D9CD] last:border-0">
                    <span className="text-sm text-[#4B4B4B]">{item.service}</span>
                    <span className="text-sm font-medium text-[#1C1C1C]">${item.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-[#EEE6DC]">
                  <span className="text-sm font-semibold text-[#1C1C1C]">Total</span>
                  <span className="text-lg font-bold text-[#B07A45]">${selected.total.toLocaleString()}</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[#1C1C1C] mb-2">Terms</h3>
              <p className="text-sm text-[#4B4B4B] mb-6">{selected.terms}</p>

              {/* Actions */}
              <div className="flex items-center gap-2 mb-8">
                {selected.status === 'Draft' && (
                  <button onClick={() => handleSend(selected)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90"><Send size={14} /> Send</button>
                )}
                {(selected.status === 'Sent' || selected.status === 'Viewed') && (
                  <>
                    <button onClick={() => handleStatusChange(selected, 'Accepted')} className="flex items-center gap-2 px-4 py-2 bg-[#5B8C5A] text-white rounded-xl text-sm font-medium hover:opacity-90"><CheckCircle size={14} /> Mark Accepted</button>
                    <button onClick={() => handleStatusChange(selected, 'Declined')} className="flex items-center gap-2 px-4 py-2 bg-[#B54B4B] text-white rounded-xl text-sm font-medium hover:opacity-90"><XCircle size={14} /> Mark Declined</button>
                  </>
                )}
                <button onClick={() => openEdit(selected)} className="flex items-center gap-1 px-3 py-2 text-[#7A746C] hover:text-[#1C1C1C] text-sm"><Pencil size={14} /> Edit</button>
                <button onClick={() => handleDuplicate(selected)} className="flex items-center gap-1 px-3 py-2 text-[#7A746C] hover:text-[#1C1C1C] text-sm"><Copy size={14} /> Duplicate</button>
              </div>

              {/* Activity Log */}
              <h3 className="text-sm font-semibold text-[#1C1C1C] mb-3">Activity</h3>
              <div className="space-y-2">
                {selected.activity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Clock size={12} className="text-[#7A746C] flex-shrink-0" />
                    <span className="text-[#4B4B4B]">{a.action}</span>
                    <span className="text-[#7A746C] text-xs">{new Date(a.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Proposals</h1>
            <p className="text-sm text-[#7A746C]">{proposals.length} proposal{proposals.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> New Proposal
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_150px_100px_120px_80px_120px] gap-4 px-5 py-3 border-b border-[#E3D9CD] text-xs font-medium text-[#7A746C] uppercase tracking-wide">
            <span>Title</span><span>Client</span><span>Amount</span><span>Status</span><span>Date</span><span>Actions</span>
          </div>
          {proposals.map(p => {
            const SI = statusConfig[p.status].icon
            return (
              <div key={p.id} onClick={() => setSelected(p)} className="grid grid-cols-[1fr_150px_100px_120px_80px_120px] gap-4 px-5 py-4 border-b border-[#E3D9CD] last:border-0 hover:bg-[#E3D9CD]/50 cursor-pointer items-center">
                <span className="text-sm font-medium text-[#1C1C1C] truncate">{p.title}</span>
                <span className="text-sm text-[#4B4B4B] truncate">{p.client}</span>
                <span className="text-sm font-semibold text-[#B07A45]">${p.total.toLocaleString()}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium w-fit ${statusConfig[p.status].color}`}><SI size={10} /> {p.status}</span>
                <span className="text-xs text-[#7A746C]">{new Date(p.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  {p.status === 'Draft' && <button onClick={() => handleSend(p)} className="p-1.5 text-[#7A746C] hover:text-[#B07A45]" title="Send"><Send size={14} /></button>}
                  <button onClick={() => handleDuplicate(p)} className="p-1.5 text-[#7A746C] hover:text-[#B07A45]" title="Duplicate"><Copy size={14} /></button>
                  <button onClick={() => openEdit(p)} className="p-1.5 text-[#7A746C] hover:text-[#B07A45]" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-[#7A746C] hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
          {proposals.length === 0 && <p className="text-center text-[#7A746C] text-sm py-8">No proposals yet</p>}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#E3D9CD] sticky top-0 bg-[#F4EFE8] rounded-t-2xl">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">{editing ? 'Edit Proposal' : 'New Proposal'}</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#7A746C] hover:text-[#1C1C1C]"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Proposal title" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Client name" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] resize-none" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[#7A746C]">Line Items</label>
                  <button onClick={addLineItem} className="text-xs text-[#B07A45] hover:text-[#8E5E34] font-medium">+ Add Item</button>
                </div>
                {form.lineItems.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={item.service} onChange={e => updateLineItem(i, 'service', e.target.value)} placeholder="Service" className="flex-1 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
                    <input type="number" value={item.price || ''} onChange={e => updateLineItem(i, 'price', Number(e.target.value))} placeholder="$0" className="w-24 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
                    {form.lineItems.length > 1 && <button onClick={() => removeLineItem(i)} className="text-[#7A746C] hover:text-red-600"><X size={16} /></button>}
                  </div>
                ))}
                <p className="text-right text-sm font-semibold text-[#B07A45]">Total: ${formTotal.toLocaleString()}</p>
              </div>

              <textarea value={form.terms} onChange={e => setForm(f => ({ ...f, terms: e.target.value }))} placeholder="Terms and conditions" rows={2} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] resize-none" />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[#E3D9CD]">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#4B4B4B] hover:text-[#1C1C1C]">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <FileText size={14} /> {editing ? 'Save Changes' : 'Create Proposal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
