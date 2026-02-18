'use client'

import { useState, useEffect } from 'react'
import { Mail, MessageSquare, Phone, Search, Plus, X, Filter, ArrowLeft, Send, User, Clock, Circle } from 'lucide-react'

type MessageType = 'email' | 'sms' | 'call'
type FilterType = 'all' | 'email' | 'sms' | 'call'

interface Message {
  id: string
  type: MessageType
  sender: string
  senderEmail?: string
  subject: string
  preview: string
  body: string
  timestamp: string
  read: boolean
  clientId?: string
  clientName?: string
}

const STORAGE_KEY = 'vantix_inbox_messages'

const seedMessages: Message[] = [
  {
    id: '1', type: 'email', sender: 'Marcus Johnson', senderEmail: 'marcus.j@gmail.com',
    subject: 'Security Camera Installation Quote', preview: 'Hi, I saw your website and wanted to get a quote for...',
    body: 'Hi,\n\nI saw your website and wanted to get a quote for a full security camera installation at my business location in Tampa. We have about 4,000 sq ft and need coverage for the parking lot, entrance, and interior.\n\nCould you send over some pricing options?\n\nThanks,\nMarcus Johnson',
    timestamp: '2026-02-18T09:30:00', read: false, clientName: 'Marcus Johnson'
  },
  {
    id: '2', type: 'email', sender: 'Lisa Chen', senderEmail: 'lisa.chen@outlook.com',
    subject: 'Re: Alarm System Upgrade', preview: 'Thanks for the proposal. I have a few questions about...',
    body: 'Thanks for the proposal. I have a few questions about the monitoring fees and whether the system integrates with smart home devices.\n\nAlso, is there a warranty on the equipment?\n\nBest,\nLisa Chen',
    timestamp: '2026-02-17T16:45:00', read: true, clientName: 'Lisa Chen'
  },
  {
    id: '3', type: 'sms', sender: '+1 (813) 555-0142', subject: 'SMS from +1 (813) 555-0142',
    preview: 'Hey, are you available Thursday for the site walkthrough?',
    body: 'Hey, are you available Thursday for the site walkthrough? I can do anytime after 2pm. Let me know. - Dave',
    timestamp: '2026-02-18T08:12:00', read: false, clientName: 'Dave Rivera'
  },
  {
    id: '4', type: 'call', sender: 'Robert Simmons', subject: 'Call Transcript - 12 min',
    preview: 'Discussed access control system for warehouse facility...',
    body: 'Call Duration: 12 minutes\n\nSummary:\n- Client inquired about access control systems for a 10,000 sq ft warehouse\n- Needs keycard entry for 3 doors and biometric for server room\n- Budget range: $8,000-$12,000\n- Wants on-site assessment next week\n- Follow-up scheduled for Feb 20\n\nAction Items:\n1. Send access control product catalog\n2. Schedule site visit\n3. Prepare preliminary quote',
    timestamp: '2026-02-17T14:20:00', read: true, clientName: 'Robert Simmons'
  },
  {
    id: '5', type: 'email', sender: 'Cal.com', senderEmail: 'notifications@cal.com',
    subject: 'New Booking: AI Consultation - Feb 20', preview: 'You have a new booking from Jennifer Hayes for...',
    body: 'New Booking Confirmed\n\nEvent: Free AI Consultation\nDate: February 20, 2026 at 10:00 AM EST\nDuration: 30 minutes\nAttendee: Jennifer Hayes (jennifer.hayes@company.com)\n\nNotes from attendee:\n"Interested in learning about AI-powered security monitoring for our retail locations."\n\nManage this booking at cal.com/vantix',
    timestamp: '2026-02-18T07:00:00', read: false
  }
]

function loadMessages(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return seedMessages
}

function saveMessages(msgs: Message[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)) } catch {}
}

const typeIcon = (type: MessageType) => {
  switch (type) {
    case 'email': return <Mail size={14} />
    case 'sms': return <MessageSquare size={14} />
    case 'call': return <Phone size={14} />
  }
}

const typeBadgeColor = (type: MessageType) => {
  switch (type) {
    case 'email': return 'bg-[#B07A45]/15 text-[#B07A45]'
    case 'sms': return 'bg-[#5B8C5A]/15 text-[#5B8C5A]'
    case 'call': return 'bg-[#6B7FB5]/15 text-[#6B7FB5]'
  }
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [composeClient, setComposeClient] = useState('')

  useEffect(() => { setMessages(loadMessages()) }, [])
  useEffect(() => { if (messages.length) saveMessages(messages) }, [messages])

  const filtered = messages.filter(m => {
    if (filter !== 'all' && m.type !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return m.sender.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const unreadCount = messages.filter(m => !m.read).length

  function selectMessage(m: Message) {
    setSelected(m)
    if (!m.read) {
      setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, read: true } : msg))
    }
  }

  function handleSend() {
    if (!composeTo || !composeSubject) return
    const newMsg: Message = {
      id: Date.now().toString(), type: 'email', sender: 'You',
      senderEmail: 'usevantix@gmail.com', subject: composeSubject,
      preview: composeBody.slice(0, 80), body: composeBody,
      timestamp: new Date().toISOString(), read: true,
      clientName: composeClient || undefined
    }
    setMessages(prev => [newMsg, ...prev])
    setShowCompose(false)
    setComposeTo(''); setComposeSubject(''); setComposeBody(''); setComposeClient('')
  }

  function formatTime(ts: string) {
    const d = new Date(ts)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Inbox</h1>
            <p className="text-sm text-[#7A746C]">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Compose
          </button>
        </div>

        {/* Filters + Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD]">
            {(['all', 'email', 'sms', 'call'] as FilterType[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'}`}>
                {f === 'all' ? 'All' : f === 'sms' ? 'SMS' : f === 'call' ? 'Calls' : 'Email'}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4 h-[calc(100vh-220px)]">
          {/* Message List */}
          <div className={`${selected ? 'hidden md:block' : ''} w-full md:w-[380px] bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden`}>
            <div className="overflow-y-auto h-full">
              {filtered.length === 0 && <p className="text-center text-[#7A746C] text-sm py-8">No messages found</p>}
              {filtered.map(m => (
                <button key={m.id} onClick={() => selectMessage(m)}
                  className={`w-full text-left p-4 border-b border-[#E3D9CD] hover:bg-[#E3D9CD]/50 transition-colors ${selected?.id === m.id ? 'bg-[#E3D9CD]' : ''} ${!m.read ? 'bg-[#F4EFE8]/50' : ''}`}>
                  <div className="flex items-start gap-3">
                    {!m.read && <Circle size={8} fill="#B07A45" className="text-[#B07A45] mt-1.5 flex-shrink-0" />}
                    {m.read && <div className="w-2 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm truncate ${!m.read ? 'font-semibold text-[#1C1C1C]' : 'text-[#4B4B4B]'}`}>{m.sender}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${typeBadgeColor(m.type)}`}>
                            {typeIcon(m.type)} {m.type === 'sms' ? 'SMS' : m.type.charAt(0).toUpperCase() + m.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-xs truncate mb-1 ${!m.read ? 'font-medium text-[#1C1C1C]' : 'text-[#4B4B4B]'}`}>{m.subject}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#7A746C] truncate flex-1">{m.preview}</p>
                        <span className="text-[10px] text-[#7A746C] flex-shrink-0 ml-2">{formatTime(m.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className={`${selected ? '' : 'hidden md:flex'} flex-1 bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden`}>
            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Mail size={40} className="mx-auto text-[#E3D9CD] mb-3" />
                  <p className="text-[#7A746C] text-sm">Select a message to read</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-[#E3D9CD] flex items-center gap-3">
                  <button onClick={() => setSelected(null)} className="md:hidden text-[#7A746C] hover:text-[#1C1C1C]"><ArrowLeft size={18} /></button>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#1C1C1C]">{selected.subject}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#4B4B4B]">{selected.sender}</span>
                      {selected.senderEmail && <span className="text-xs text-[#7A746C]">&lt;{selected.senderEmail}&gt;</span>}
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${typeBadgeColor(selected.type)}`}>
                        {typeIcon(selected.type)} {selected.type === 'sms' ? 'SMS' : selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#7A746C]">{new Date(selected.timestamp).toLocaleString()}</p>
                    {selected.clientName && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#B07A45]/10 text-[#B07A45] rounded-lg text-[10px] font-medium">
                        <User size={10} /> {selected.clientName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-[#4B4B4B] leading-relaxed">{selected.body}</pre>
                </div>
                <div className="p-4 border-t border-[#E3D9CD]">
                  <button onClick={() => { setShowCompose(true); setComposeTo(selected.senderEmail || ''); setComposeSubject(`Re: ${selected.subject}`) }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    <Send size={14} /> Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E3D9CD]">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">Compose Email</h3>
              <button onClick={() => setShowCompose(false)} className="text-[#7A746C] hover:text-[#1C1C1C]"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <input value={composeTo} onChange={e => setComposeTo(e.target.value)} placeholder="To" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <input value={composeClient} onChange={e => setComposeClient(e.target.value)} placeholder="Attach to client (optional)" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" />
              <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} placeholder="Write your message..." rows={8} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#7A746C] focus:outline-none focus:ring-1 focus:ring-[#B07A45] resize-none" />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[#E3D9CD]">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-sm text-[#4B4B4B] hover:text-[#1C1C1C]">Cancel</button>
              <button onClick={handleSend} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
