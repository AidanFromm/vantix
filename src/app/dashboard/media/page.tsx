'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  Upload, Search, Image as ImageIcon, Video, FileText, File, Filter,
  X, Download, Trash2, ChevronDown, ChevronRight, Copy, Check,
  Calendar, HardDrive, Tag, Eye, FolderOpen, Folder, Grid3X3,
  List, Pencil, Loader2, Plus, Link2, MoreVertical,
  Instagram, Linkedin, Clock, GripVertical, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

// ── Types ──────────────────────────────────────────────────────────────────

interface MediaFile {
  id: string
  filename: string
  file_url: string
  file_type: 'image' | 'video' | 'document' | 'gif'
  file_size: number
  company: string
  folder: string
  tags: string[]
  description: string
  uploaded_by: string
  created_at: string
}

interface SocialPost {
  id: string
  media_file_id: string | null
  caption: string
  platforms: string[]
  status: 'draft' | 'ready' | 'posted'
  scheduled_date: string
  posted_date: string | null
  created_at: string
  // joined
  media_file?: MediaFile | null
}

// ── Constants ──────────────────────────────────────────────────────────────

const COMPANIES = ['Vantix', 'SecuredTampa', 'J4K', 'CardLedger', 'Custom']
const COMPANY_COLORS: Record<string, string> = {
  Vantix: 'bg-amber-100 text-amber-700 border-amber-200',
  SecuredTampa: 'bg-red-100 text-red-700 border-red-200',
  J4K: 'bg-blue-100 text-blue-700 border-blue-200',
  CardLedger: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Custom: 'bg-stone-100 text-stone-600 border-stone-200',
}
const FOLDERS = ['Logos', 'Social Posts', 'Ads', 'Videos', 'Photos', 'Documents']
const FILE_TYPES = ['All', 'Images', 'Videos', 'Documents', 'GIFs']
const PLATFORMS = ['Instagram', 'X', 'LinkedIn']
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-600 border-stone-200',
  ready: 'bg-amber-100 text-amber-700 border-amber-200',
  posted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

function detectFileType(filename: string): MediaFile['file_type'] {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (ext === 'gif') return 'gif'
  if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) return 'video'
  return 'document'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const TYPE_ICONS: Record<string, typeof ImageIcon> = {
  image: ImageIcon, video: Video, document: FileText, gif: ImageIcon,
}

// ── Data helpers ───────────────────────────────────────────────────────────

async function fetchMediaFiles(): Promise<MediaFile[]> {
  try {
    const { data, error } = await supabase.from('media_files').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data as MediaFile[]) || []
  } catch {
    try {
      const raw = localStorage.getItem('vantix_media_files')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }
}

async function fetchSocialPosts(): Promise<SocialPost[]> {
  try {
    const { data, error } = await supabase.from('social_posts').select('*, media_file:media_files(*)').order('created_at', { ascending: false })
    if (error) throw error
    return (data as SocialPost[]) || []
  } catch {
    try {
      const raw = localStorage.getItem('vantix_social_posts')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }
}

function lsSave(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function MediaPage() {
  const [tab, setTab] = useState<'all' | 'company' | 'social'>('all')
  const [media, setMedia] = useState<MediaFile[]>([])
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [tagSearch, setTagSearch] = useState('')

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false)
  const [lightbox, setLightbox] = useState<MediaFile | null>(null)
  const [contextMenu, setContextMenu] = useState<{ item: MediaFile; x: number; y: number } | null>(null)
  const [socialModal, setSocialModal] = useState(false)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [socialView, setSocialView] = useState<'grid' | 'calendar'>('grid')

  useEffect(() => {
    Promise.all([fetchMediaFiles(), fetchSocialPosts()]).then(([m, s]) => {
      setMedia(m)
      setSocialPosts(s)
      setLoading(false)
    })
  }, [])

  // Close context menu on click outside
  useEffect(() => {
    const handler = () => setContextMenu(null)
    if (contextMenu) window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [contextMenu])

  const filtered = useMemo(() => {
    return media.filter(m => {
      if (companyFilter !== 'All' && m.company !== companyFilter) return false
      if (typeFilter === 'Images' && m.file_type !== 'image') return false
      if (typeFilter === 'Videos' && m.file_type !== 'video') return false
      if (typeFilter === 'Documents' && m.file_type !== 'document') return false
      if (typeFilter === 'GIFs' && m.file_type !== 'gif') return false
      if (search) {
        const q = search.toLowerCase()
        if (!m.filename.toLowerCase().includes(q) && !m.description?.toLowerCase().includes(q)) return false
      }
      if (tagSearch) {
        const q = tagSearch.toLowerCase()
        if (!m.tags?.some(t => t.toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [media, companyFilter, typeFilter, search, tagSearch])

  const mediaByCompany = useMemo(() => {
    const map: Record<string, Record<string, MediaFile[]>> = {}
    COMPANIES.forEach(c => {
      map[c] = {}
      FOLDERS.forEach(f => { map[c][f] = [] })
    })
    media.forEach(m => {
      const c = m.company || 'Custom'
      const f = m.folder || 'Documents'
      if (!map[c]) { map[c] = {}; FOLDERS.forEach(fl => { map[c][fl] = [] }) }
      if (!map[c][f]) map[c][f] = []
      map[c][f].push(m)
    })
    return map
  }, [media])

  const deleteMedia = async (id: string) => {
    const item = media.find(m => m.id === id)
    if (!item) return
    try {
      // Extract path from URL for storage deletion
      const urlParts = item.file_url.split('/storage/v1/object/public/media/')
      if (urlParts[1]) {
        await supabase.storage.from('media').remove([decodeURIComponent(urlParts[1])])
      }
      await supabase.from('media_files').delete().eq('id', id)
    } catch {}
    const updated = media.filter(m => m.id !== id)
    setMedia(updated)
    lsSave('vantix_media_files', updated)
    setLightbox(null)
  }

  const updateMediaFile = async (id: string, updates: Partial<MediaFile>) => {
    try {
      await supabase.from('media_files').update(updates).eq('id', id)
    } catch {}
    const updated = media.map(m => m.id === id ? { ...m, ...updates } : m)
    setMedia(updated)
    lsSave('vantix_media_files', updated)
    if (lightbox?.id === id) setLightbox({ ...lightbox, ...updates } as MediaFile)
  }

  const addMedia = (items: MediaFile[]) => {
    const updated = [...items, ...media]
    setMedia(updated)
    lsSave('vantix_media_files', updated)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const deleteSocialPost = async (id: string) => {
    try { await supabase.from('social_posts').delete().eq('id', id) } catch {}
    const updated = socialPosts.filter(p => p.id !== id)
    setSocialPosts(updated)
    lsSave('vantix_social_posts', updated)
  }

  const updateSocialPost = async (id: string, updates: Partial<SocialPost>) => {
    try { await supabase.from('social_posts').update(updates).eq('id', id) } catch {}
    const updated = socialPosts.map(p => p.id === id ? { ...p, ...updates } : p)
    setSocialPosts(updated)
    lsSave('vantix_social_posts', updated)
  }

  const addSocialPost = (post: SocialPost) => {
    const updated = [post, ...socialPosts]
    setSocialPosts(updated)
    lsSave('vantix_social_posts', updated)
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Media Library</h1>
          <p className="text-sm text-[#7A746C] mt-0.5">{media.length} files across {COMPANIES.length} companies</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            <Upload size={16} /> Upload
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD] mb-5 w-fit">
        {([['all', 'All'], ['company', 'By Company'], ['social', 'Social Content']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C] hover:text-[#4B4B4B]'}`}>{label}</button>
        ))}
      </div>

      {/* Filter Bar — shown for All and By Company */}
      {(tab === 'all' || tab === 'company') && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* View toggle */}
          <div className="flex bg-[#EEE6DC] rounded-lg p-0.5 border border-[#E3D9CD]">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}><Grid3X3 size={14} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}><List size={14} /></button>
          </div>

          {/* Company dropdown */}
          <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="px-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30">
            <option value="All">All Companies</option>
            {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type dropdown */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30">
            {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Tags search */}
          <div className="relative">
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
            <input value={tagSearch} onChange={e => setTagSearch(e.target.value)} placeholder="Filter by tag..." className="pl-8 pr-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 w-40" />
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-8 pr-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>

          <span className="text-xs text-[#7A746C]">{filtered.length} items</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#B07A45]" />
        </div>
      ) : (
        <>
          {/* ALL TAB */}
          {tab === 'all' && (
            filtered.length === 0 ? (
              <EmptyState onUpload={() => setUploadOpen(true)} />
            ) : viewMode === 'grid' ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {filtered.map(item => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onClick={() => setLightbox(item)}
                    onContextMenu={(e) => { e.preventDefault(); setContextMenu({ item, x: e.clientX, y: e.clientY }) }}
                  />
                ))}
              </div>
            ) : (
              <MediaListView items={filtered} onClick={setLightbox} onDelete={deleteMedia} onCopy={copyUrl} />
            )
          )}

          {/* BY COMPANY TAB */}
          {tab === 'company' && (
            <CompanyView data={mediaByCompany} onClickItem={setLightbox} viewMode={viewMode} />
          )}

          {/* SOCIAL CONTENT TAB */}
          {tab === 'social' && (
            <SocialSection
              posts={socialPosts}
              media={media}
              view={socialView}
              onToggleView={() => setSocialView(v => v === 'grid' ? 'calendar' : 'grid')}
              onAdd={() => setSocialModal(true)}
              onEdit={setEditingPost}
              onDelete={deleteSocialPost}
              onUpdate={updateSocialPost}
            />
          )}
        </>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenuPopup
          item={contextMenu.item}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDownload={() => { window.open(contextMenu.item.file_url, '_blank'); setContextMenu(null) }}
          onCopyUrl={() => { copyUrl(contextMenu.item.file_url); setContextMenu(null) }}
          onDelete={() => { deleteMedia(contextMenu.item.id); setContextMenu(null) }}
          onEditTags={() => { setLightbox(contextMenu.item); setContextMenu(null) }}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <LightboxModal
          item={lightbox}
          onClose={() => setLightbox(null)}
          onDelete={deleteMedia}
          onUpdate={updateMediaFile}
          onCopyUrl={copyUrl}
        />
      )}

      {/* Upload Modal */}
      {uploadOpen && <UploadModal onUpload={(items) => { addMedia(items); setUploadOpen(false) }} onClose={() => setUploadOpen(false)} />}

      {/* Social Post Modal */}
      {(socialModal || editingPost) && (
        <SocialPostModal
          media={media}
          existing={editingPost}
          onSave={(post) => {
            if (editingPost) {
              updateSocialPost(editingPost.id, post)
            } else {
              addSocialPost(post as SocialPost)
            }
            setSocialModal(false)
            setEditingPost(null)
          }}
          onClose={() => { setSocialModal(false); setEditingPost(null) }}
        />
      )}
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-16 text-center">
      <FolderOpen size={48} className="mx-auto text-[#7A746C] opacity-30 mb-3" />
      <p className="text-sm text-[#7A746C] mb-4">No media files found</p>
      <button onClick={onUpload} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium">
        <Upload size={16} /> Upload Files
      </button>
    </div>
  )
}

// ── Media Card (masonry) ───────────────────────────────────────────────────

function MediaCard({ item, onClick, onContextMenu }: { item: MediaFile; onClick: () => void; onContextMenu: (e: React.MouseEvent) => void }) {
  const Icon = TYPE_ICONS[item.file_type] || File
  const isVisual = item.file_type === 'image' || item.file_type === 'gif'
  const companyColor = COMPANY_COLORS[item.company] || COMPANY_COLORS['Custom']

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="break-inside-avoid bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all group"
    >
      <div className={`${isVisual ? '' : 'aspect-square'} bg-[#E3D9CD] flex items-center justify-center relative overflow-hidden`}>
        {isVisual ? (
          <img src={item.file_url} alt={item.filename} className="w-full object-cover" loading="lazy" />
        ) : item.file_type === 'video' ? (
          <div className="aspect-video w-full flex items-center justify-center relative">
            <Video size={48} className="text-[#7A746C] opacity-30" />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium">VIDEO</div>
          </div>
        ) : (
          <div className="aspect-square w-full flex items-center justify-center">
            <FileText size={48} className="text-[#7A746C] opacity-30" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <span className="p-2 bg-[#F4EFE8]/90 rounded-lg"><Eye size={16} className="text-[#1C1C1C]" /></span>
          </div>
        </div>
        {/* Type overlay for non-images */}
        {!isVisual && (
          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#F4EFE8]/80">
            <Icon size={12} className="text-[#7A746C]" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.filename}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${companyColor}`}>{item.company}</span>
          <span className="text-xs text-[#7A746C]">{formatBytes(item.file_size)}</span>
        </div>
        {item.tags && item.tags.length > 0 && (
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

// ── List View ──────────────────────────────────────────────────────────────

function MediaListView({ items, onClick, onDelete, onCopy }: { items: MediaFile[]; onClick: (m: MediaFile) => void; onDelete: (id: string) => void; onCopy: (url: string) => void }) {
  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E3D9CD]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A746C] uppercase tracking-wider">File</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A746C] uppercase tracking-wider hidden md:table-cell">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A746C] uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A746C] uppercase tracking-wider hidden sm:table-cell">Size</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A746C] uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const Icon = TYPE_ICONS[item.file_type] || File
              const companyColor = COMPANY_COLORS[item.company] || COMPANY_COLORS['Custom']
              return (
                <tr key={item.id} onClick={() => onClick(item)} className="border-b border-[#E3D9CD] last:border-b-0 hover:bg-[#F4EFE8] cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E3D9CD] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {(item.file_type === 'image' || item.file_type === 'gif') ? (
                          <img src={item.file_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Icon size={18} className="text-[#7A746C]" />
                        )}
                      </div>
                      <span className="font-medium text-[#1C1C1C] truncate max-w-[200px]">{item.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${companyColor}`}>{item.company}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell capitalize text-[#7A746C]">{item.file_type}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-[#7A746C]">{formatBytes(item.file_size)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[#7A746C]">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => onCopy(item.file_url)} className="p-1.5 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><Copy size={14} /></button>
                      <a href={item.file_url} download className="p-1.5 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><Download size={14} /></a>
                      <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#7A746C] hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Company View (Accordion) ───────────────────────────────────────────────

function CompanyView({ data, onClickItem, viewMode }: { data: Record<string, Record<string, MediaFile[]>>; onClickItem: (m: MediaFile) => void; viewMode: 'grid' | 'list' }) {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null)
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {COMPANIES.map(company => {
        const folders = data[company] || {}
        const total = Object.values(folders).reduce((s, arr) => s + arr.length, 0)
        const isOpen = expandedCompany === company
        const companyColor = COMPANY_COLORS[company] || COMPANY_COLORS['Custom']

        return (
          <div key={company} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedCompany(isOpen ? null : company)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#E8DFD3] transition-colors"
            >
              {isOpen ? <ChevronDown size={16} className="text-[#7A746C]" /> : <ChevronRight size={16} className="text-[#7A746C]" />}
              <Folder size={18} className="text-[#B07A45]" />
              <span className="text-sm font-semibold text-[#1C1C1C] flex-1 text-left">{company}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${companyColor}`}>{total} files</span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 space-y-1">
                {FOLDERS.map(folder => {
                  const items = folders[folder] || []
                  const folderOpen = expandedFolder === `${company}-${folder}`
                  return (
                    <div key={folder}>
                      <button
                        onClick={() => setExpandedFolder(folderOpen ? null : `${company}-${folder}`)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F4EFE8] transition-colors"
                      >
                        {folderOpen ? <ChevronDown size={14} className="text-[#7A746C]" /> : <ChevronRight size={14} className="text-[#7A746C]" />}
                        <FolderOpen size={14} className="text-[#7A746C]" />
                        <span className="text-sm text-[#4B4B4B] flex-1 text-left">{folder}</span>
                        <span className="text-xs text-[#7A746C]">{items.length}</span>
                      </button>
                      {folderOpen && items.length > 0 && (
                        <div className="ml-8 mt-2 mb-3">
                          {viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {items.map(item => (
                                <div key={item.id} onClick={() => onClickItem(item)} className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all group">
                                  <div className="aspect-square bg-[#E3D9CD] flex items-center justify-center overflow-hidden">
                                    {(item.file_type === 'image' || item.file_type === 'gif') ? (
                                      <img src={item.file_url} alt={item.filename} className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                      <File size={32} className="text-[#7A746C] opacity-30" />
                                    )}
                                  </div>
                                  <div className="p-2">
                                    <p className="text-xs font-medium text-[#1C1C1C] truncate">{item.filename}</p>
                                    <p className="text-[10px] text-[#7A746C] mt-0.5">{formatBytes(item.file_size)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {items.map(item => (
                                <div key={item.id} onClick={() => onClickItem(item)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F4EFE8] cursor-pointer">
                                  <File size={14} className="text-[#7A746C]" />
                                  <span className="text-sm text-[#1C1C1C] flex-1 truncate">{item.filename}</span>
                                  <span className="text-xs text-[#7A746C]">{formatBytes(item.file_size)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {folderOpen && items.length === 0 && (
                        <p className="ml-8 text-xs text-[#7A746C] py-2">No files in this folder</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Context Menu ───────────────────────────────────────────────────────────

function ContextMenuPopup({ item, x, y, onClose, onDownload, onCopyUrl, onDelete, onEditTags }: {
  item: MediaFile; x: number; y: number; onClose: () => void
  onDownload: () => void; onCopyUrl: () => void; onDelete: () => void; onEditTags: () => void
}) {
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 100 }} className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl shadow-lg py-1 min-w-[180px]" onClick={e => e.stopPropagation()}>
      <button onClick={onDownload} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#F4EFE8] transition-colors"><Download size={14} /> Download</button>
      <button onClick={onCopyUrl} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#F4EFE8] transition-colors"><Copy size={14} /> Copy URL</button>
      <button onClick={onEditTags} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#F4EFE8] transition-colors"><Tag size={14} /> Edit Tags</button>
      <div className="my-1 border-t border-[#E3D9CD]" />
      <button onClick={onDelete} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /> Delete</button>
    </div>
  )
}

// ── Lightbox Modal ─────────────────────────────────────────────────────────

function LightboxModal({ item, onClose, onDelete, onUpdate, onCopyUrl }: {
  item: MediaFile; onClose: () => void; onDelete: (id: string) => void
  onUpdate: (id: string, u: Partial<MediaFile>) => void; onCopyUrl: (url: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editCompany, setEditCompany] = useState(item.company)
  const [editFolder, setEditFolder] = useState(item.folder)
  const [editTags, setEditTags] = useState((item.tags || []).join(', '))
  const [editDesc, setEditDesc] = useState(item.description || '')
  const [copied, setCopied] = useState(false)
  const isVisual = item.file_type === 'image' || item.file_type === 'gif'

  const handleCopy = () => {
    onCopyUrl(item.file_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveEdits = () => {
    onUpdate(item.id, {
      company: editCompany,
      folder: editFolder,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      description: editDesc,
    })
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Preview */}
        <div className="bg-[#E3D9CD] flex items-center justify-center flex-shrink-0 relative overflow-hidden max-h-[50vh]">
          {isVisual ? (
            <img src={item.file_url} alt={item.filename} className="max-w-full max-h-[50vh] object-contain" />
          ) : item.file_type === 'video' ? (
            <video src={item.file_url} controls className="max-w-full max-h-[50vh]" />
          ) : (
            <div className="py-16 flex flex-col items-center gap-2">
              <FileText size={64} className="text-[#7A746C] opacity-30" />
              <span className="text-sm text-[#7A746C]">{item.filename}</span>
            </div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/40 rounded-lg text-white hover:bg-black/60 transition-colors"><X size={16} /></button>
        </div>

        {/* Details */}
        <div className="p-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-[#1C1C1C] mb-1">{item.filename}</h2>
          {item.description && <p className="text-sm text-[#7A746C] mb-3">{item.description}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><HardDrive size={14} className="text-[#7A746C]" /> {formatBytes(item.file_size)}</div>
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><Calendar size={14} className="text-[#7A746C]" /> {formatDate(item.created_at)}</div>
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B] capitalize"><File size={14} className="text-[#7A746C]" /> {item.file_type}</div>
            <div className="flex items-center gap-2 text-sm text-[#4B4B4B]"><Folder size={14} className="text-[#7A746C]" /> {item.folder || 'None'}</div>
          </div>

          {/* Company badge */}
          <div className="mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${COMPANY_COLORS[item.company] || COMPANY_COLORS['Custom']}`}>{item.company}</span>
          </div>

          {editing ? (
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Company</label>
                  <select value={editCompany} onChange={e => setEditCompany(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Folder</label>
                  <select value={editFolder} onChange={e => setEditFolder(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                    {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Tags (comma separated)</label>
                <input value={editTags} onChange={e => setEditTags(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Description</label>
                <input value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdits} className="px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium">Save</button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-xs text-[#4B4B4B] flex items-center gap-1"><Tag size={10} /> {tag}</span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <a href={item.file_url} download className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium">
              <Download size={14} /> Download
            </a>
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] rounded-xl text-sm font-medium hover:bg-[#E8DFD3]">
              {copied ? <Check size={14} /> : <Link2 size={14} />} {copied ? 'Copied' : 'Copy Link'}
            </button>
            {!editing && (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] text-[#4B4B4B] rounded-xl text-sm font-medium hover:bg-[#E8DFD3]">
                <Pencil size={14} /> Edit
              </button>
            )}
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

function UploadModal({ onUpload, onClose }: { onUpload: (items: MediaFile[]) => void; onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([])
  const [company, setCompany] = useState('Vantix')
  const [folder, setFolder] = useState('Photos')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | File[]) => {
    setFiles(prev => [...prev, ...Array.from(newFiles)])
  }

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (files.length === 0) return
    setUploading(true)
    const results: MediaFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileKey = `${i}-${file.name}`
      setProgress(prev => ({ ...prev, [fileKey]: 10 }))

      const filePath = `${company}/${Date.now()}_${file.name}`
      let fileUrl = ''

      try {
        setProgress(prev => ({ ...prev, [fileKey]: 30 }))
        const { data, error } = await supabase.storage.from('media').upload(filePath, file)
        if (error) throw error
        setProgress(prev => ({ ...prev, [fileKey]: 60 }))
        fileUrl = supabase.storage.from('media').getPublicUrl(data.path).data.publicUrl
      } catch {
        // Fallback — use object URL for preview
        fileUrl = URL.createObjectURL(file)
      }

      const mediaFile: MediaFile = {
        id: crypto.randomUUID?.() || `${Date.now()}-${i}`,
        filename: file.name,
        file_url: fileUrl,
        file_type: detectFileType(file.name),
        file_size: file.size,
        company,
        folder,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        description,
        uploaded_by: 'admin',
        created_at: new Date().toISOString(),
      }

      setProgress(prev => ({ ...prev, [fileKey]: 80 }))

      try {
        await supabase.from('media_files').insert(mediaFile)
      } catch {}

      setProgress(prev => ({ ...prev, [fileKey]: 100 }))
      results.push(mediaFile)
    }

    setUploading(false)
    onUpload(results)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C1C1C]">Upload Media</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4 ${dragOver ? 'border-[#B07A45] bg-[#EEE6DC]' : 'border-[#E3D9CD] hover:border-[#B07A45]/50'}`}
        >
          <Upload size={32} className="mx-auto text-[#7A746C] mb-2" />
          <p className="text-sm text-[#4B4B4B]">Drag and drop files here or click to browse</p>
          <p className="text-xs text-[#7A746C] mt-1">PNG, JPG, GIF, PDF, MP4 up to 50MB each</p>
          <input ref={fileRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files?.length) handleFiles(e.target.files) }} />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file, i) => {
              const key = `${i}-${file.name}`
              const pct = progress[key] || 0
              return (
                <div key={key} className="flex items-center gap-3 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl">
                  <File size={14} className="text-[#7A746C] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1C1C1C] truncate">{file.name}</p>
                    <p className="text-[10px] text-[#7A746C]">{formatBytes(file.size)}</p>
                    {uploading && (
                      <div className="mt-1 h-1.5 bg-[#E3D9CD] rounded-full overflow-hidden">
                        <div className="h-full bg-[#B07A45] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  {!uploading && (
                    <button onClick={(e) => { e.stopPropagation(); removeFile(i) }} className="p-1 rounded hover:bg-[#E3D9CD] text-[#7A746C]"><X size={14} /></button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Company</label>
              <select value={company} onChange={e => setCompany(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Folder</label>
              <select value={folder} onChange={e => setFolder(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="logo, branding, social" className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Description (optional)</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
          <button onClick={handleSubmit} disabled={uploading || files.length === 0} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 flex items-center gap-2">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Social Media Section ───────────────────────────────────────────────────

function SocialSection({ posts, media, view, onToggleView, onAdd, onEdit, onDelete, onUpdate }: {
  posts: SocialPost[]; media: MediaFile[]; view: 'grid' | 'calendar'
  onToggleView: () => void; onAdd: () => void; onEdit: (p: SocialPost) => void
  onDelete: (id: string) => void; onUpdate: (id: string, u: Partial<SocialPost>) => void
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex bg-[#EEE6DC] rounded-lg p-0.5 border border-[#E3D9CD]">
            <button onClick={() => view === 'calendar' && onToggleView()} className={`p-2 rounded-md text-sm transition-colors ${view === 'grid' ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}><Grid3X3 size={14} /></button>
            <button onClick={() => view === 'grid' && onToggleView()} className={`p-2 rounded-md text-sm transition-colors ${view === 'calendar' ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}><Calendar size={14} /></button>
          </div>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md">
          <Plus size={16} /> Add Content
        </button>
      </div>

      {view === 'grid' ? (
        posts.length === 0 ? (
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-16 text-center">
            <Calendar size={48} className="mx-auto text-[#7A746C] opacity-30 mb-3" />
            <p className="text-sm text-[#7A746C] mb-4">No social content yet</p>
            <button onClick={onAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium">
              <Plus size={16} /> Create First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => {
              const mediaItem = post.media_file || media.find(m => m.id === post.media_file_id)
              return (
                <SocialCard key={post.id} post={post} mediaItem={mediaItem || null} onEdit={() => onEdit(post)} onDelete={() => onDelete(post.id)} onUpdate={(u) => onUpdate(post.id, u)} />
              )
            })}
          </div>
        )
      ) : (
        <SocialCalendar posts={posts} media={media} onEdit={onEdit} />
      )}
    </div>
  )
}

// ── Social Card ────────────────────────────────────────────────────────────

function SocialCard({ post, mediaItem, onEdit, onDelete, onUpdate }: {
  post: SocialPost; mediaItem: MediaFile | null; onEdit: () => void; onDelete: () => void
  onUpdate: (u: Partial<SocialPost>) => void
}) {
  const [editingCaption, setEditingCaption] = useState(false)
  const [caption, setCaption] = useState(post.caption)

  const saveCaption = () => {
    onUpdate({ caption })
    setEditingCaption(false)
  }

  const platformIcon = (p: string) => {
    if (p === 'Instagram') return <Instagram size={12} />
    if (p === 'LinkedIn') return <Linkedin size={12} />
    // X icon - just use text
    return <span className="text-[10px] font-bold leading-none">X</span>
  }

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
      {/* Thumbnail */}
      <div className="aspect-video bg-[#E3D9CD] flex items-center justify-center overflow-hidden">
        {mediaItem && (mediaItem.file_type === 'image' || mediaItem.file_type === 'gif') ? (
          <img src={mediaItem.file_url} alt="" className="w-full h-full object-cover" />
        ) : mediaItem?.file_type === 'video' ? (
          <Video size={32} className="text-[#7A746C] opacity-30" />
        ) : (
          <ImageIcon size={32} className="text-[#7A746C] opacity-30" />
        )}
      </div>

      <div className="p-4">
        {/* Caption */}
        {editingCaption ? (
          <div className="mb-3">
            <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={3} className="w-full px-3 py-2 bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none" />
            <div className="flex gap-2 mt-1">
              <button onClick={saveCaption} className="px-3 py-1 bg-[#B07A45] text-white rounded-lg text-xs font-medium">Save</button>
              <button onClick={() => { setEditingCaption(false); setCaption(post.caption) }} className="px-3 py-1 text-xs text-[#7A746C]">Cancel</button>
            </div>
          </div>
        ) : (
          <p onClick={() => setEditingCaption(true)} className="text-sm text-[#4B4B4B] mb-3 cursor-pointer hover:text-[#1C1C1C] line-clamp-3">{post.caption || 'Click to add caption...'}</p>
        )}

        {/* Platform badges & status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5">
            {post.platforms.map(p => (
              <span key={p} className="flex items-center gap-1 px-2 py-0.5 bg-[#F4EFE8] border border-[#E3D9CD] rounded-md text-[10px] text-[#7A746C] font-medium">
                {platformIcon(p)} {p}
              </span>
            ))}
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium capitalize ${STATUS_COLORS[post.status]}`}>{post.status}</span>
        </div>

        {/* Scheduled date */}
        {post.scheduled_date && (
          <div className="flex items-center gap-1.5 text-xs text-[#7A746C] mb-3">
            <Clock size={12} />
            {formatDate(post.scheduled_date)}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="flex-1 px-3 py-1.5 text-xs font-medium text-[#4B4B4B] bg-[#F4EFE8] border border-[#E3D9CD] rounded-lg hover:bg-[#F4EFE8] transition-colors">Edit</button>
          <select
            value={post.status}
            onChange={e => onUpdate({ status: e.target.value as SocialPost['status'] })}
            className="flex-1 px-3 py-1.5 text-xs bg-[#F4EFE8] border border-[#E3D9CD] rounded-lg text-[#4B4B4B]"
          >
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="posted">Posted</option>
          </select>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-[#7A746C] hover:text-red-500"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  )
}

// ── Social Calendar ────────────────────────────────────────────────────────

function SocialCalendar({ posts, media, onEdit }: { posts: SocialPost[]; media: MediaFile[]; onEdit: (p: SocialPost) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const postsByDay: Record<number, SocialPost[]> = {}
  posts.forEach(p => {
    if (!p.scheduled_date) return
    const d = new Date(p.scheduled_date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!postsByDay[day]) postsByDay[day] = []
      postsByDay[day].push(p)
    }
  })

  return (
    <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 rounded-lg hover:bg-[#F4EFE8] text-[#7A746C]"><ArrowLeft size={16} /></button>
        <h3 className="text-sm font-semibold text-[#1C1C1C]">
          {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 rounded-lg hover:bg-[#F4EFE8] text-[#7A746C]"><ArrowRight size={16} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-[#7A746C] uppercase py-2">{d}</div>
        ))}
        {days.map((day, i) => (
          <div key={i} className={`min-h-[80px] p-1.5 rounded-lg ${day ? 'bg-[#F4EFE8]' : ''}`}>
            {day && (
              <>
                <span className="text-xs text-[#7A746C]">{day}</span>
                <div className="mt-1 space-y-1">
                  {(postsByDay[day] || []).map(post => (
                    <button key={post.id} onClick={() => onEdit(post)} className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${STATUS_COLORS[post.status]}`}>
                      {post.caption?.slice(0, 20) || 'Untitled'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Social Post Modal ──────────────────────────────────────────────────────

function SocialPostModal({ media, existing, onSave, onClose }: {
  media: MediaFile[]; existing: SocialPost | null
  onSave: (post: Partial<SocialPost> & { id: string }) => void; onClose: () => void
}) {
  const [mediaFileId, setMediaFileId] = useState(existing?.media_file_id || '')
  const [caption, setCaption] = useState(existing?.caption || '')
  const [platforms, setPlatforms] = useState<string[]>(existing?.platforms || [])
  const [status, setStatus] = useState<SocialPost['status']>(existing?.status || 'draft')
  const [scheduledDate, setScheduledDate] = useState(existing?.scheduled_date?.slice(0, 10) || '')
  const [saving, setSaving] = useState(false)

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleSave = async () => {
    setSaving(true)
    const post: Partial<SocialPost> & { id: string } = {
      id: existing?.id || (crypto.randomUUID?.() || `${Date.now()}`),
      media_file_id: mediaFileId || null,
      caption,
      platforms,
      status,
      scheduled_date: scheduledDate || new Date().toISOString().slice(0, 10),
      posted_date: status === 'posted' ? new Date().toISOString() : null,
      created_at: existing?.created_at || new Date().toISOString(),
    }

    if (!existing) {
      try { await supabase.from('social_posts').insert(post) } catch {}
    } else {
      try { await supabase.from('social_posts').update(post).eq('id', existing.id) } catch {}
    }

    setSaving(false)
    onSave(post)
  }

  const selectedMedia = media.find(m => m.id === mediaFileId)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C1C1C]">{existing ? 'Edit Post' : 'Add Social Content'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>

        {/* Media picker */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Media</label>
          {selectedMedia ? (
            <div className="flex items-center gap-3 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[#E3D9CD] overflow-hidden flex-shrink-0">
                {(selectedMedia.file_type === 'image' || selectedMedia.file_type === 'gif') ? (
                  <img src={selectedMedia.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><File size={16} className="text-[#7A746C]" /></div>
                )}
              </div>
              <span className="text-sm text-[#1C1C1C] truncate flex-1">{selectedMedia.filename}</span>
              <button onClick={() => setMediaFileId('')} className="p-1 text-[#7A746C] hover:text-[#1C1C1C]"><X size={14} /></button>
            </div>
          ) : (
            <select value={mediaFileId} onChange={e => setMediaFileId(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
              <option value="">Select media (optional)</option>
              {media.slice(0, 50).map(m => <option key={m.id} value={m.id}>{m.filename} ({m.company})</option>)}
            </select>
          )}
        </div>

        {/* Caption */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Caption</label>
          <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={4} placeholder="Write your caption..." className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none" />
        </div>

        {/* Platforms */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#4B4B4B] mb-2">Platforms</label>
          <div className="flex gap-2">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => togglePlatform(p)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${platforms.includes(p) ? 'bg-[#B07A45] text-white border-[#B07A45]' : 'bg-[#EEE6DC] text-[#7A746C] border-[#E3D9CD] hover:border-[#B07A45]/50'}`}>
                {p === 'Instagram' && <Instagram size={14} />}
                {p === 'LinkedIn' && <Linkedin size={14} />}
                {p === 'X' && <span className="text-xs font-bold">X</span>}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Status & Date */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as SocialPost['status'])} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="posted">Posted</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Scheduled Date</label>
            <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {existing ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
