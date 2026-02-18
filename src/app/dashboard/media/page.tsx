'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Plus, Upload, Search, Image, Video, FileText, File, Filter,
  X, Download, Trash2, Sparkles, Grid3X3, ChevronDown,
  Calendar, HardDrive, Tag, Eye
} from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: string
  date: string
  client: string
  project: string
  tags: string[]
  url: string
  thumbnail: string
}

const SEED_MEDIA: MediaItem[] = [
  { id: '1', name: 'SecuredTampa Logo.png', type: 'image', size: '2.4 MB', date: '2026-02-10', client: 'SecuredTampa', project: 'Branding', tags: ['logo', 'branding'], url: '', thumbnail: '' },
  { id: '2', name: 'JFK Store Banner.jpg', type: 'image', size: '1.8 MB', date: '2026-02-12', client: 'JFK', project: 'Marketing', tags: ['banner', 'social'], url: '', thumbnail: '' },
  { id: '3', name: 'AI Generated Sneaker Ad.png', type: 'image', size: '3.1 MB', date: '2026-02-14', client: 'JFK', project: 'Social Media', tags: ['ai-generated', 'ad', 'sneakers'], url: '', thumbnail: '' },
  { id: '4', name: 'Security Audit Report.pdf', type: 'document', size: '540 KB', date: '2026-02-08', client: 'SecuredTampa', project: 'Reports', tags: ['report', 'audit'], url: '', thumbnail: '' },
  { id: '5', name: 'Product Showcase Reel.mp4', type: 'video', size: '24.6 MB', date: '2026-02-16', client: 'JFK', project: 'Social Media', tags: ['video', 'product', 'reel'], url: '', thumbnail: '' },
]

const TYPE_ICONS: Record<string, typeof Image> = { image: Image, video: Video, document: FileText }
const TYPE_COLORS: Record<string, string> = {
  image: 'bg-blue-100 text-blue-600',
  video: 'bg-purple-100 text-purple-600',
  document: 'bg-amber-100 text-amber-700',
}
const CLIENTS = ['SecuredTampa', 'JFK']
const TYPES = ['All', 'Images', 'Videos', 'Documents']

function loadMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem('vantix_media')
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEED_MEDIA
}

function saveMedia(items: MediaItem[]) {
  try { localStorage.setItem('vantix_media', JSON.stringify(items)) } catch {}
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [filterType, setFilterType] = useState('All')
  const [filterClient, setFilterClient] = useState('All')
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  useEffect(() => { setMedia(loadMedia()) }, [])
  useEffect(() => { if (media.length) saveMedia(media) }, [media])

  const filtered = useMemo(() => {
    return media.filter(m => {
      if (filterType === 'Images' && m.type !== 'image') return false
      if (filterType === 'Videos' && m.type !== 'video') return false
      if (filterType === 'Documents' && m.type !== 'document') return false
      if (filterClient !== 'All' && m.client !== filterClient) return false
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.tags.some(t => t.includes(search.toLowerCase()))) return false
      return true
    })
  }, [media, filterType, filterClient, search])

  const deleteMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
    setDetailItem(null)
  }

  const addMedia = (item: MediaItem) => {
    setMedia(prev => [...prev, item])
    setUploadOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Media Library</h1>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] rounded-xl text-sm font-medium hover:bg-[#E8DFD3] transition-colors">
            <Sparkles size={16} /> Generate with AI
          </button>
          <button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            <Upload size={16} /> Upload
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD]">
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterType === t ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}>{t}</button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files or tags..." className="pl-8 pr-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 w-56" />
        </div>
        <FilterDropdown label="Client" value={filterClient} options={['All', ...CLIENTS]} onChange={setFilterClient} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-16 text-center text-[#7A746C] text-sm">No media items match your filters</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(item => {
            const Icon = TYPE_ICONS[item.type] || File
            return (
              <div key={item.id} onClick={() => setDetailItem(item)} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                <div className="aspect-square bg-[#E3D9CD] flex items-center justify-center relative">
                  <Icon size={48} className="text-[#7A746C] opacity-40" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className={`absolute top-2 right-2 p-1.5 rounded-lg ${TYPE_COLORS[item.type]}`}>
                    <Icon size={12} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#7A746C]">{item.size}</span>
                    <span className="text-xs text-[#7A746C]">{item.date}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-[#E3D9CD] flex items-center justify-center">
              {(() => { const Icon = TYPE_ICONS[detailItem.type] || File; return <Icon size={64} className="text-[#7A746C] opacity-30" /> })()}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1C1C1C]">{detailItem.name}</h2>
                  <p className="text-sm text-[#7A746C] mt-0.5">{detailItem.client} / {detailItem.project}</p>
                </div>
                <button onClick={() => setDetailItem(null)} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><HardDrive size={14} className="text-[#7A746C]" /> {detailItem.size}</div>
                <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><Calendar size={14} className="text-[#7A746C]" /> {detailItem.date}</div>
                <div className="flex items-center gap-2 text-sm text-[#4B4B4B] capitalize"><File size={14} className="text-[#7A746C]" /> {detailItem.type}</div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {detailItem.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-xs text-[#4B4B4B] flex items-center gap-1"><Tag size={10} /> {tag}</span>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium"><Download size={14} /> Download</button>
                <button onClick={() => deleteMedia(detailItem.id)} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {uploadOpen && <UploadModal onUpload={addMedia} onClose={() => setUploadOpen(false)} />}

      {/* AI Generate modal */}
      {aiOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setAiOpen(false)}>
          <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1C1C1C] flex items-center gap-2"><Sparkles size={18} className="text-[#B07A45]" /> AI Image Generation</h2>
              <button onClick={() => setAiOpen(false)} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
            </div>
            <p className="text-sm text-[#7A746C] mb-4">Describe the image you want to generate. Powered by Replicate.</p>
            <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={4} placeholder="A professional cybersecurity company logo with shield icon, dark blue and bronze colors..." className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setAiOpen(false)} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
              <button onClick={() => { setAiOpen(false); setAiPrompt('') }} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow flex items-center gap-2">
                <Sparkles size={14} /> Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#4B4B4B]">
        {label}: {value} <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 bg-white border border-[#E3D9CD] rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false) }} className={`w-full text-left px-4 py-1.5 text-sm hover:bg-[#F4EFE8] ${o === value ? 'text-[#B07A45] font-medium' : 'text-[#1C1C1C]'}`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function UploadModal({ onUpload, onClose }: { onUpload: (item: MediaItem) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('SecuredTampa')
  const [project, setProject] = useState('')
  const [tags, setTags] = useState('')
  const [type, setType] = useState<'image' | 'video' | 'document'>('image')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!name) return
    onUpload({
      id: Date.now().toString(),
      name, type,
      size: '0 KB',
      date: new Date().toISOString().slice(0, 10),
      client, project,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      url: '', thumbnail: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C1C1C]">Upload Media</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setName(f.name) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-5 ${dragOver ? 'border-[#B07A45] bg-[#EEE6DC]' : 'border-[#E3D9CD] hover:border-[#B07A45]/50'}`}
        >
          <Upload size={32} className="mx-auto text-[#7A746C] mb-2" />
          <p className="text-sm text-[#4B4B4B]">Drag and drop files here or click to browse</p>
          <p className="text-xs text-[#7A746C] mt-1">PNG, JPG, PDF, MP4 up to 50MB</p>
          <input ref={fileRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setName(f.name) }} />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">File Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Client</label>
              <select value={client} onChange={e => setClient(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {CLIENTS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Project</label>
            <input value={project} onChange={e => setProject(e.target.value)} placeholder="e.g. Branding, Marketing" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="logo, branding, social" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Upload</button>
        </div>
      </div>
    </div>
  )
}
