'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  Upload, Search, Image, Video, FileText, File, Filter,
  X, Download, Trash2, Sparkles, ChevronDown, Copy, Check,
  Calendar, HardDrive, Tag, Eye, FolderOpen, Folder,
  Pencil, RotateCcw, Loader2, Plus
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: string
  date: string
  project: string
  tags: string[]
  url: string
  thumbnail: string
  uploadFailed?: boolean
  localPreview?: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const PROJECTS = [
  { name: 'SecuredTampa', color: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'Just Four Kicks', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Vantix', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Uncategorized', color: 'bg-stone-100 text-stone-600 border-stone-200' },
]

const PROJECT_COLOR_MAP: Record<string, string> = Object.fromEntries(
  PROJECTS.map(p => [p.name, p.color])
)

const SEED_MEDIA: MediaItem[] = [
  { id: '1', name: 'logo-v.png', type: 'image', size: '48 KB', date: '2026-01-15', project: 'Vantix', tags: ['logo', 'branding'], url: '/images/logo-v.png', thumbnail: '/images/logo-v.png' },
  { id: '2', name: 'logo-nav.png', type: 'image', size: '12 KB', date: '2026-01-15', project: 'Vantix', tags: ['logo', 'navigation'], url: '/images/logo-nav.png', thumbnail: '/images/logo-nav.png' },
  { id: '3', name: 'og-image.jpg', type: 'image', size: '320 KB', date: '2026-01-20', project: 'Vantix', tags: ['og', 'social', 'meta'], url: '/images/og-image.jpg', thumbnail: '/images/og-image.jpg' },
  { id: '4', name: 'paper-texture.png', type: 'image', size: '1.2 MB', date: '2026-01-10', project: 'Vantix', tags: ['texture', 'background'], url: '/images/paper-texture.png', thumbnail: '/images/paper-texture.png' },
  { id: '5', name: 'logo-icon.png', type: 'image', size: '64 KB', date: '2026-02-01', project: 'SecuredTampa', tags: ['logo', 'icon', 'branding'], url: '/images/logo-icon.png', thumbnail: '/images/logo-icon.png' },
  { id: '6', name: 'billboard.jpg', type: 'image', size: '2.4 MB', date: '2026-02-10', project: 'Vantix', tags: ['social', 'marketing', 'billboard'], url: '/images/billboard.jpg', thumbnail: '/images/billboard.jpg' },
  { id: '7', name: 'viral-story.jpg', type: 'image', size: '1.8 MB', date: '2026-02-12', project: 'Vantix', tags: ['social', 'story', 'viral'], url: '/images/viral-story.jpg', thumbnail: '/images/viral-story.jpg' },
  { id: '8', name: 'carousel-slide-1.jpg', type: 'image', size: '980 KB', date: '2026-02-14', project: 'Just Four Kicks', tags: ['carousel', 'social'], url: '', thumbnail: '' },
  { id: '9', name: 'carousel-slide-2.jpg', type: 'image', size: '1.1 MB', date: '2026-02-14', project: 'Just Four Kicks', tags: ['carousel', 'social'], url: '', thumbnail: '' },
  { id: '10', name: 'carousel-slide-3.jpg', type: 'image', size: '920 KB', date: '2026-02-14', project: 'Just Four Kicks', tags: ['carousel', 'social'], url: '', thumbnail: '' },
]

const TYPE_ICONS: Record<string, typeof Image> = { image: Image, video: Video, document: FileText }
const TYPE_COLORS: Record<string, string> = {
  image: 'bg-blue-100 text-blue-600',
  video: 'bg-purple-100 text-purple-600',
  document: 'bg-amber-100 text-amber-700',
}

function detectType(filename: string): 'image' | 'video' | 'document' {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) return 'video'
  return 'document'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function loadMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem('vantix_media_v2')
    if (raw) return JSON.parse(raw)
  } catch { /* empty */ }
  return SEED_MEDIA
}

function saveMedia(items: MediaItem[]) {
  try { localStorage.setItem('vantix_media_v2', JSON.stringify(items)) } catch { /* empty */ }
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('All')
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null)
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => { setMedia(loadMedia()) }, [])
  useEffect(() => { if (media.length) saveMedia(media) }, [media])

  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = { All: media.length }
    PROJECTS.forEach(p => { counts[p.name] = 0 })
    media.forEach(m => { counts[m.project] = (counts[m.project] || 0) + 1 })
    return counts
  }, [media])

  const filtered = useMemo(() => {
    return media.filter(m => {
      if (activeProject && m.project !== activeProject) return false
      if (filterType === 'Images' && m.type !== 'image') return false
      if (filterType === 'Videos' && m.type !== 'video') return false
      if (filterType === 'Documents' && m.type !== 'document') return false
      if (search) {
        const q = search.toLowerCase()
        if (!m.name.toLowerCase().includes(q) && !m.tags.some(t => t.toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [media, activeProject, filterType, search])

  const deleteMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
    setDetailItem(null)
  }

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
    setDetailItem(prev => prev && prev.id === id ? { ...prev, ...updates } : prev)
  }

  const addMedia = (item: MediaItem) => {
    setMedia(prev => [...prev, item])
    setUploadOpen(false)
  }

  const retryUpload = async (item: MediaItem) => {
    // Placeholder for retry logic — would re-POST to /api/media/upload
    updateMedia(item.id, { uploadFailed: false })
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Media Library</h1>
          <p className="text-sm text-[#7A746C] mt-0.5">{media.length} files across {PROJECTS.length} projects</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] rounded-xl text-sm font-medium hover:bg-[#E8DFD3] transition-colors">
            <Sparkles size={16} /> Generate with AI
          </button>
          <button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            <Upload size={16} /> Upload
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — Project Folders */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-3">
            <p className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider px-2 mb-2">Projects</p>
            <button
              onClick={() => setActiveProject(null)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors mb-1 ${
                !activeProject ? 'bg-white text-[#1C1C1C] shadow-sm font-medium' : 'text-[#4B4B4B] hover:bg-white/50'
              }`}
            >
              <FolderOpen size={16} className="text-[#B07A45]" />
              <span className="flex-1 text-left">All Files</span>
              <span className="text-xs text-[#7A746C]">{projectCounts.All}</span>
            </button>
            {PROJECTS.map(p => (
              <button
                key={p.name}
                onClick={() => setActiveProject(activeProject === p.name ? null : p.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors mb-0.5 ${
                  activeProject === p.name ? 'bg-white text-[#1C1C1C] shadow-sm font-medium' : 'text-[#4B4B4B] hover:bg-white/50'
                }`}
              >
                <Folder size={16} className="text-[#7A746C]" />
                <span className="flex-1 text-left truncate">{p.name}</span>
                <span className="text-xs text-[#7A746C]">{projectCounts[p.name] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD]">
              {['All', 'Images', 'Videos', 'Documents'].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterType === t ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C] hover:text-[#4B4B4B]'}`}>{t}</button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files or tags..." className="pl-8 pr-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 w-56" />
            </div>
            <span className="text-xs text-[#7A746C] ml-auto">{filtered.length} items</span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-16 text-center">
              <FolderOpen size={48} className="mx-auto text-[#7A746C] opacity-30 mb-3" />
              <p className="text-sm text-[#7A746C]">No media items match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onClick={() => setDetailItem(item)}
                  onRetry={() => retryUpload(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onDelete={deleteMedia}
          onUpdate={updateMedia}
        />
      )}

      {/* Upload Modal */}
      {uploadOpen && <UploadModal onUpload={addMedia} onClose={() => setUploadOpen(false)} />}

      {/* AI Generate Modal */}
      {aiOpen && <AIGenerateModal onClose={() => setAiOpen(false)} onGenerated={addMedia} />}
    </div>
  )
}

// ── Media Card ─────────────────────────────────────────────────────────────

function MediaCard({ item, onClick, onRetry }: { item: MediaItem; onClick: () => void; onRetry: () => void }) {
  const Icon = TYPE_ICONS[item.type] || File
  const projectColor = PROJECT_COLOR_MAP[item.project] || PROJECT_COLOR_MAP['Uncategorized']
  const hasPreview = item.type === 'image' && (item.thumbnail || item.localPreview)

  return (
    <div onClick={onClick} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all group relative">
      {/* Thumbnail */}
      <div className="aspect-square bg-[#E3D9CD] flex items-center justify-center relative overflow-hidden">
        {hasPreview ? (
          <img src={item.localPreview || item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <Icon size={48} className="text-[#7A746C] opacity-30" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <span className="p-2 bg-white/90 rounded-lg"><Eye size={16} className="text-[#1C1C1C]" /></span>
            <a onClick={e => { e.stopPropagation() }} href={item.url || '#'} download className="p-2 bg-white/90 rounded-lg">
              <Download size={16} className="text-[#1C1C1C]" />
            </a>
          </div>
        </div>
        {/* Type badge */}
        <div className={`absolute top-2 right-2 p-1.5 rounded-lg ${TYPE_COLORS[item.type]}`}>
          <Icon size={12} />
        </div>
        {/* Upload failed badge */}
        {item.uploadFailed && (
          <button
            onClick={e => { e.stopPropagation(); onRetry() }}
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium"
          >
            <RotateCcw size={10} /> Retry
          </button>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.name}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${projectColor}`}>{item.project}</span>
          <span className="text-xs text-[#7A746C]">{item.size}</span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 bg-[#F4EFE8] rounded text-[10px] text-[#7A746C]">{tag}</span>
            ))}
            {item.tags.length > 3 && <span className="text-[10px] text-[#7A746C]">+{item.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Detail Modal ───────────────────────────────────────────────────────────

function DetailModal({ item, onClose, onDelete, onUpdate }: {
  item: MediaItem
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<MediaItem>) => void
}) {
  const Icon = TYPE_ICONS[item.type] || File
  const projectColor = PROJECT_COLOR_MAP[item.project] || PROJECT_COLOR_MAP['Uncategorized']
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editProject, setEditProject] = useState(item.project)
  const [editTags, setEditTags] = useState(item.tags.join(', '))
  const hasPreview = item.type === 'image' && (item.thumbnail || item.localPreview)

  const copyUrl = () => {
    if (item.url) {
      navigator.clipboard.writeText(item.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const saveEdits = () => {
    onUpdate(item.id, {
      project: editProject,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Preview */}
        <div className="aspect-video bg-[#E3D9CD] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {hasPreview ? (
            <img src={item.localPreview || item.thumbnail} alt={item.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <Icon size={64} className="text-[#7A746C] opacity-30" />
          )}
        </div>

        {/* Details */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1C]">{item.name}</h2>
              <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-md border font-medium ${projectColor}`}>{item.project}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><HardDrive size={14} className="text-[#7A746C]" /> {item.size}</div>
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><Calendar size={14} className="text-[#7A746C]" /> {item.date}</div>
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B] capitalize"><File size={14} className="text-[#7A746C]" /> {item.type}</div>
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><Folder size={14} className="text-[#7A746C]" /> {item.project}</div>
          </div>

          {/* Tags — view or edit */}
          {editing ? (
            <div className="mb-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Project</label>
                <select value={editProject} onChange={e => setEditProject(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                  {PROJECTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Tags (comma separated)</label>
                <input value={editTags} onChange={e => setEditTags(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdits} className="px-3 py-1.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-lg text-xs font-medium">Save</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-lg">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {item.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-xs text-[#4B4B4B] flex items-center gap-1"><Tag size={10} /> {tag}</span>
              ))}
              <button onClick={() => setEditing(true)} className="px-2.5 py-1 rounded-lg text-xs text-[#7A746C] hover:bg-[#EEE6DC] flex items-center gap-1"><Pencil size={10} /> Edit</button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {item.url && (
              <a href={item.url} download className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium">
                <Download size={14} /> Download
              </a>
            )}
            <button onClick={copyUrl} className="flex items-center gap-2 px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] rounded-xl text-sm font-medium hover:bg-[#E8DFD3]">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy URL'}
            </button>
            <button onClick={() => onDelete(item.id)} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 ml-auto">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Upload Modal ───────────────────────────────────────────────────────────

function UploadModal({ onUpload, onClose }: { onUpload: (item: MediaItem) => void; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [project, setProject] = useState('Uncategorized')
  const [tags, setTags] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setName(f.name)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => setPreview(e.target?.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async () => {
    if (!name) return
    setUploading(true)

    const type = detectType(name)
    let uploadFailed = false
    let url = ''
    let thumbnail = ''

    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', name)
        formData.append('project', project)
        formData.append('tags', tags)

        const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          url = data.url || ''
          thumbnail = data.thumbnail || data.url || ''
        } else {
          uploadFailed = true
        }
      } catch {
        uploadFailed = true
      }
    }

    const newItem: MediaItem = {
      id: Date.now().toString(),
      name,
      type,
      size: file ? formatBytes(file.size) : '0 KB',
      date: new Date().toISOString().slice(0, 10),
      project,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      url,
      thumbnail,
      uploadFailed,
      localPreview: preview || undefined,
    }

    setUploading(false)
    onUpload(newItem)
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
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-5 ${dragOver ? 'border-[#B07A45] bg-[#EEE6DC]' : 'border-[#E3D9CD] hover:border-[#B07A45]/50'}`}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto max-h-32 rounded-lg mb-2" />
          ) : (
            <Upload size={32} className="mx-auto text-[#7A746C] mb-2" />
          )}
          <p className="text-sm text-[#4B4B4B]">{file ? file.name : 'Drag and drop files here or click to browse'}</p>
          <p className="text-xs text-[#7A746C] mt-1">PNG, JPG, PDF, MP4 up to 50MB</p>
          <input ref={fileRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">File Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Project</label>
            <select value={project} onChange={e => setProject(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
              {PROJECTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="logo, branding, social" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
          <button onClick={handleSubmit} disabled={uploading || !name} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 flex items-center gap-2">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AI Generate Modal ──────────────────────────────────────────────────────

function AIGenerateModal({ onClose, onGenerated }: { onClose: () => void; onGenerated: (item: MediaItem) => void }) {
  const [prompt, setPrompt] = useState('')
  const [aspect, setAspect] = useState('1:1')
  const [project, setProject] = useState('Uncategorized')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<MediaItem | null>(null)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/media/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: aspect, project_id: project }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }

      const data = await res.json()
      const newItem: MediaItem = {
        id: data.id || Date.now().toString(),
        name: data.name || `ai-generated-${Date.now()}.png`,
        type: 'image',
        size: data.size || 'Unknown',
        date: new Date().toISOString().slice(0, 10),
        project,
        tags: ['ai-generated'],
        url: data.url || '',
        thumbnail: data.thumbnail || data.url || '',
      }
      setResult(newItem)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const saveAndClose = () => {
    if (result) {
      onGenerated(result)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1C1C1C] flex items-center gap-2">
            <Sparkles size={18} className="text-[#B07A45]" /> AI Image Generation
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>

        {result ? (
          /* Result view */
          <div>
            <div className="rounded-xl overflow-hidden mb-4 bg-[#E3D9CD]">
              <img src={result.thumbnail} alt="Generated" className="w-full" />
            </div>
            <p className="text-sm text-[#4B4B4B] mb-4">Image generated successfully</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setResult(null); setPrompt('') }} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Generate Another</button>
              <button onClick={saveAndClose} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                Save to Library
              </button>
            </div>
          </div>
        ) : (
          /* Input view */
          <div>
            <p className="text-sm text-[#7A746C] mb-4">Describe the image you want to generate. Powered by FLUX 1.1 Pro.</p>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              placeholder="A professional cybersecurity company logo with shield icon, dark blue and bronze colors..."
              className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none mb-4"
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Aspect Ratio</label>
                <div className="flex bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD]">
                  {['1:1', '16:9', '9:16'].map(r => (
                    <button key={r} onClick={() => setAspect(r)} className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${aspect === r ? 'bg-white text-[#1C1C1C] shadow-sm font-medium' : 'text-[#7A746C]'}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Project</label>
                <select value={project} onChange={e => setProject(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                  {PROJECTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
