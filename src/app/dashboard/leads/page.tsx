'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls, PanInfo } from 'framer-motion';
import {
  Search, Users, Phone, Mail, Globe, RefreshCw, Clock,
  Filter, X, Zap, Target, MapPin, Download, Plus,
  GripVertical, ChevronRight, Building2, DollarSign,
  Calendar, Tag, ExternalLink, MoreHorizontal, Trash2,
  CheckCircle2, XCircle, AlertCircle, Loader2, Send,
  ArrowRight, Trophy, Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  value: number;
  source: 'scraper' | 'referral' | 'website' | 'cold' | 'social';
  status: LeadStatus;
  createdAt: string;
  stageEnteredAt: string;
  notes: string;
  city?: string;
  state?: string;
}

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

interface ScraperResult {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  status: 'pending' | 'valid' | 'invalid';
  addedToLeads: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'vantix_kanban_leads';

const STATUSES: { id: LeadStatus; label: string; color: string; bgColor: string; borderColor: string }[] = [
  { id: 'new', label: 'New', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { id: 'contacted', label: 'Contacted', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { id: 'qualified', label: 'Qualified', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
  { id: 'proposal', label: 'Proposal', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  { id: 'won', label: 'Won', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  { id: 'lost', label: 'Lost', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
];

const SOURCE_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  scraper: { label: 'Scraper', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  referral: { label: 'Referral', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  website: { label: 'Website', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  cold: { label: 'Cold', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  social: { label: 'Social', color: 'text-pink-400', bg: 'bg-pink-500/20' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

function getDaysInStage(stageEnteredAt: string) {
  const entered = new Date(stageEnteredAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - entered.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getInitialLeads(): Lead[] {
  return [
    {
      id: '601-lead',
      name: '601',
      company: '601',
      email: '',
      phone: '',
      website: '',
      status: 'proposal',
      source: 'cold',
      value: 2000,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      stageEnteredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'HOT LEAD - Shopify upgrade project. Trying to close $2,000 deal.',
    },
  ];
}

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return getInitialLeads(); // Start with real leads
}

function saveLeads(leads: Lead[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); } catch { /* ignore */ }
}

// ─── Lead Card Component ──────────────────────────────────────────────────────

interface LeadCardProps {
  lead: Lead;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

function LeadCard({ lead, onSelect, onDragStart, onDragEnd, isDragging }: LeadCardProps) {
  const daysInStage = getDaysInStage(lead.stageEnteredAt);
  const sourceBadge = SOURCE_BADGES[lead.source];
  
  return (
    <motion.div
      layout
      layoutId={lead.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isDragging ? 0.9 : 1, 
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging 
          ? '0 20px 40px -12px rgba(16, 185, 129, 0.3)' 
          : '0 2px 8px -2px rgba(0, 0, 0, 0.2)'
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        group cursor-pointer select-none
        relative rounded-xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.03]
        backdrop-blur-xl border border-white/[0.1]
        hover:border-emerald-500/40 hover:from-white/[0.12] hover:to-white/[0.06]
        transition-all duration-200 ease-out
        w-full box-border
        ${isDragging ? 'z-50 border-emerald-500/60 ring-2 ring-emerald-500/20' : ''}
      `}
    >
      {/* Glassmorphism shine effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Card Content Container */}
      <div className="relative p-3.5">
        {/* Drag Handle + Header Row */}
        <div className="flex items-start gap-2 mb-2.5">
          {/* Drag Handle */}
          <div 
            className="flex-shrink-0 mt-0.5 p-1 -ml-1 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} className="text-[var(--color-muted)] opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Name & Company */}
          <div className="flex-1 min-w-0 overflow-hidden" onClick={onSelect}>
            <h3 className="font-semibold text-white text-sm leading-tight truncate group-hover:text-emerald-300 transition-colors">
              {lead.name}
            </h3>
            <p className="text-xs text-[var(--color-muted)] truncate flex items-center gap-1 mt-1">
              <Building2 size={11} className="flex-shrink-0" />
              <span className="truncate">{lead.company}</span>
            </p>
          </div>
          
          {/* Source Badge */}
          <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${sourceBadge.bg} ${sourceBadge.color}`}>
            {sourceBadge.label}
          </span>
        </div>

        {/* Value Row */}
        <div className="flex items-center gap-2 mb-2.5 pl-6" onClick={onSelect}>
          <div className="flex items-center gap-1 text-emerald-400">
            <DollarSign size={14} className="flex-shrink-0" />
            <span className="font-bold text-sm">{formatCurrency(lead.value)}</span>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pl-6" onClick={onSelect}>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted)]">
            <Clock size={10} className="flex-shrink-0" />
            <span className="whitespace-nowrap">{daysInStage}d in stage</span>
          </div>
          
          {/* Quick actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {lead.email && (
              <button 
                onClick={(e) => { e.stopPropagation(); window.open(`mailto:${lead.email}`); }}
                className="w-6 h-6 rounded-md bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
                title="Send email"
              >
                <Mail size={11} className="text-[var(--color-muted)] hover:text-emerald-400" />
              </button>
            )}
            {lead.phone && (
              <button 
                onClick={(e) => { e.stopPropagation(); window.open(`tel:${lead.phone}`); }}
                className="w-6 h-6 rounded-md bg-white/5 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                title="Call"
              >
                <Phone size={11} className="text-[var(--color-muted)] hover:text-blue-400" />
              </button>
            )}
          </div>
        </div>

        {/* Days indicator bar */}
        <div className="mt-2.5 ml-6 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(daysInStage * 10, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              daysInStage <= 3 ? 'bg-emerald-500' :
              daysInStage <= 7 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Kanban Column Component ──────────────────────────────────────────────────

interface KanbanColumnProps {
  status: typeof STATUSES[0];
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onDropLead: (leadId: string, newStatus: LeadStatus) => void;
  draggingLead: string | null;
}

function KanbanColumn({ status, leads, onSelectLead, onDropLead, draggingLead }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] flex-shrink-0 lg:min-w-0 lg:w-auto lg:flex-1 h-full">
      {/* Column Header */}
      <div className={`
        px-3 py-3 rounded-t-xl border border-b-0 
        bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm
        transition-all duration-200
        ${isDragOver ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/[0.1]'}
      `}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status.bgColor.replace('/10', '')}`} />
            <h3 className={`font-semibold text-sm truncate ${status.color}`}>{status.label}</h3>
            <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-md bg-white/10 text-[var(--color-muted)] font-medium">
              {leads.length}
            </span>
          </div>
          <button className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors">
            <MoreHorizontal size={14} className="text-[var(--color-muted)]" />
          </button>
        </div>
        <div className="text-xs text-[var(--color-muted)] pl-4">
          Total: <span className="text-emerald-400 font-semibold">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Column Body - Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const leadId = e.dataTransfer.getData('leadId');
          if (leadId) onDropLead(leadId, status.id);
        }}
        className={`
          flex-1 p-2.5 rounded-b-xl border border-t-0 min-h-[420px] max-h-[calc(100vh-360px)] overflow-y-auto
          bg-gradient-to-b from-transparent to-white/[0.02]
          transition-all duration-200 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
          ${isDragOver ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/[0.1]'}
        `}
      >
        <div className="flex flex-col gap-2.5">
          <AnimatePresence mode="popLayout">
            {leads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('leadId', lead.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className="touch-none"
              >
                <LeadCard
                  lead={lead}
                  onSelect={() => onSelectLead(lead)}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  isDragging={draggingLead === lead.id}
                />
              </div>
            ))}
          </AnimatePresence>
          
          {leads.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center"
            >
              <div className={`w-11 h-11 mx-auto mb-3 rounded-xl ${status.bgColor} flex items-center justify-center`}>
                {status.id === 'won' ? <Trophy size={18} className={status.color} /> :
                 status.id === 'lost' ? <XCircle size={18} className={status.color} /> :
                 <Users size={18} className={status.color} />}
              </div>
              <p className="text-xs text-[var(--color-muted)] font-medium">No leads here</p>
              <p className="text-[10px] text-[var(--color-muted)] opacity-60 mt-1">Drag cards to move</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Slide Over Panel ─────────────────────────────────────────────────────────

interface SlideOverProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

function SlideOver({ lead, onClose, onUpdate, onDelete }: SlideOverProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(null);

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  if (!lead || !editedLead) return null;

  const handleSave = () => {
    onUpdate(editedLead);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      
      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-[var(--color-card)] border-l border-[var(--color-border)] z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)] p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-lg">{editedLead.name}</h2>
            <p className="text-sm text-[var(--color-muted)]">{editedLead.company}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setEditedLead({ ...editedLead, status: s.id, stageEnteredAt: new Date().toISOString().split('T')[0] })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    editedLead.status === s.id 
                      ? `${s.bgColor} ${s.color} border ${s.borderColor}` 
                      : 'bg-white/5 text-[var(--color-muted)] hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-2 block">Deal Value</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="number"
                value={editedLead.value}
                onChange={(e) => setEditedLead({ ...editedLead, value: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <label className="text-xs text-[var(--color-muted)] block">Contact Information</label>
            
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="email"
                value={editedLead.email}
                onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                placeholder="Email"
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="tel"
                value={editedLead.phone}
                onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                placeholder="Phone"
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={editedLead.website}
                onChange={(e) => setEditedLead({ ...editedLead, website: e.target.value })}
                placeholder="Website"
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-2 block">Notes</label>
            <textarea
              value={editedLead.notes}
              onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
              rows={4}
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              placeholder="Add notes about this lead..."
            />
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
            <div>
              <span className="text-xs text-[var(--color-muted)]">Source</span>
              <p className="text-sm font-medium capitalize">{editedLead.source}</p>
            </div>
            <div>
              <span className="text-xs text-[var(--color-muted)]">Created</span>
              <p className="text-sm font-medium">{new Date(editedLead.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-xs text-[var(--color-muted)]">Days in Stage</span>
              <p className="text-sm font-medium">{getDaysInStage(editedLead.stageEnteredAt)}</p>
            </div>
            <div>
              <span className="text-xs text-[var(--color-muted)]">Location</span>
              <p className="text-sm font-medium">{editedLead.city || 'N/A'}{editedLead.state ? `, ${editedLead.state}` : ''}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[var(--color-card)]/80 backdrop-blur-xl border-t border-[var(--color-border)] p-4 flex items-center gap-3">
          <button
            onClick={() => { onDelete(lead.id); onClose(); }}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 text-[var(--color-muted)] hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 size={14} />
            Save Changes
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Email Scraper Component ──────────────────────────────────────────────────

interface EmailScraperProps {
  onAddToLeads: (result: ScraperResult) => void;
}

function EmailScraper({ onAddToLeads }: EmailScraperProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isScrapeing, setIsScraping] = useState(false);
  const [results, setResults] = useState<ScraperResult[]>([]);
  const [progress, setProgress] = useState(0);

  // Simulated scraping
  const startScraping = async () => {
    if (!query.trim()) return;
    
    setIsScraping(true);
    setResults([]);
    setProgress(0);

    // Simulate scraping with fake results
    const fakeBusinesses = [
      'Mountain View Auto Repair',
      'Sunrise Dental Clinic',
      'Peak Performance Gym',
      'Rocky Road Construction',
      'Alpine Landscaping Co',
      'Front Range Plumbing',
      'Mile High Marketing',
      'Denver Design Studio',
      'Colorado Coffee Roasters',
      'Evergreen Electric'
    ];

    for (let i = 0; i < fakeBusinesses.length; i++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
      setProgress(((i + 1) / fakeBusinesses.length) * 100);
      
      const business = fakeBusinesses[i];
      const hasEmail = Math.random() > 0.3;
      const hasPhone = Math.random() > 0.2;
      
      setResults(prev => [...prev, {
        id: generateId(),
        businessName: business,
        email: hasEmail ? `contact@${business.toLowerCase().replace(/\s+/g, '')}.com` : '',
        phone: hasPhone ? `(303) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}` : '',
        website: Math.random() > 0.4 ? `${business.toLowerCase().replace(/\s+/g, '')}.com` : '',
        status: hasEmail ? 'valid' : 'pending',
        addedToLeads: false
      }]);
    }

    setIsScraping(false);
  };

  const exportToCSV = () => {
    const csv = ['Business Name,Email,Phone,Website,Status']
      .concat(results.map(r => `"${r.businessName}","${r.email}","${r.phone}","${r.website}","${r.status}"`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'scraped-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddToLeads = (result: ScraperResult) => {
    onAddToLeads(result);
    setResults(prev => prev.map(r => r.id === result.id ? { ...r, addedToLeads: true } : r));
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-emerald-400" />
          <h3 className="font-semibold">Search for Businesses</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-2 block">Business Type / Industry</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Restaurants, Auto Repair, Dentists"
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-2 block">Location</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Denver, CO"
                className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          onClick={startScraping}
          disabled={isScrapeing || !query.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          {isScrapeing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Scraping... {Math.round(progress)}%
            </>
          ) : (
            <>
              <Zap size={16} />
              Start Scraping
            </>
          )}
        </button>

        {/* Progress bar */}
        {isScrapeing && (
          <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden"
        >
          {/* Results Header */}
          <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">Results</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {results.length} found
              </span>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[var(--color-muted)] hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-[var(--color-muted)] text-left">
                  <th className="px-5 py-3 font-medium">Business Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Website</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {results.map((result, i) => (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-white">{result.businessName}</td>
                      <td className="px-5 py-3 text-[var(--color-muted)]">
                        {result.email || <span className="opacity-40">--</span>}
                      </td>
                      <td className="px-5 py-3 text-[var(--color-muted)]">
                        {result.phone || <span className="opacity-40">--</span>}
                      </td>
                      <td className="px-5 py-3">
                        {result.website ? (
                          <a 
                            href={`https://${result.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                          >
                            {result.website}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-red-400 text-xs">No website</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          result.status === 'valid' ? 'bg-emerald-500/20 text-emerald-400' :
                          result.status === 'invalid' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {result.status === 'valid' ? 'Verified' : result.status === 'invalid' ? 'Invalid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {result.addedToLeads ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            Added
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddToLeads(result)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-medium"
                          >
                            <Plus size={12} />
                            Add to Leads
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isScrapeing && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Search size={28} className="text-emerald-400" />
          </div>
          <h3 className="font-semibold mb-2">Start Finding Leads</h3>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            Enter a business type and location above to scrape for potential leads with contact information.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'kanban' | 'scraper'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [draggingLead, setDraggingLead] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLeads(loadLeads());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) saveLeads(leads);
  }, [leads, loading]);

  const filteredLeads = useMemo(() => {
    let result = leads;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    }
    
    if (filterSource !== 'all') {
      result = result.filter(l => l.source === filterSource);
    }
    
    if (filterValue === 'high') result = result.filter(l => l.value >= 15000);
    else if (filterValue === 'mid') result = result.filter(l => l.value >= 5000 && l.value < 15000);
    else if (filterValue === 'low') result = result.filter(l => l.value < 5000);
    
    return result;
  }, [leads, search, filterSource, filterValue]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      new: [], contacted: [], qualified: [], proposal: [], won: [], lost: []
    };
    filteredLeads.forEach(lead => {
      grouped[lead.status].push(lead);
    });
    // Sort each group by value desc
    Object.keys(grouped).forEach(key => {
      grouped[key as LeadStatus].sort((a, b) => b.value - a.value);
    });
    return grouped;
  }, [filteredLeads]);

  const handleDropLead = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId && lead.status !== newStatus) {
        return { ...lead, status: newStatus, stageEnteredAt: new Date().toISOString().split('T')[0] };
      }
      return lead;
    }));
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleAddFromScraper = (result: ScraperResult) => {
    const newLead: Lead = {
      id: generateId(),
      name: result.businessName.split(' ')[0] + ' (Owner)',
      company: result.businessName,
      email: result.email,
      phone: result.phone,
      website: result.website,
      value: 5000,
      source: 'scraper',
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
      stageEnteredAt: new Date().toISOString().split('T')[0],
      notes: 'Added from email scraper',
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleAddLead = () => {
    const newLead: Lead = {
      id: generateId(),
      name: 'New Lead',
      company: 'Company Name',
      email: '',
      phone: '',
      website: '',
      value: 0,
      source: 'cold',
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
      stageEnteredAt: new Date().toISOString().split('T')[0],
      notes: '',
    };
    setLeads(prev => [newLead, ...prev]);
    setSelectedLead(newLead);
  };

  // Stats
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
  const wonValue = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.value, 0);
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status)).length;

  const activeFilterCount = [filterSource !== 'all', filterValue !== 'all'].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Leads</h1>
          <p className="text-[var(--color-muted)] mt-1 text-sm">Manage your sales pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddLead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats - Real Vantix Lead Data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Leads Scraped', value: '3,327', icon: Users, accent: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Email Verified', value: '866', icon: Zap, accent: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Cold Emails Sent', value: '100', icon: Mail, accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pipeline Value', value: formatCurrency(totalValue), icon: DollarSign, accent: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--color-muted)]">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={18} className={stat.accent} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl p-1">
          <button
            onClick={() => setActiveView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === 'kanban' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-[var(--color-muted)] hover:text-white'
            }`}
          >
            <Target size={15} />
            Pipeline
          </button>
          <button
            onClick={() => setActiveView('scraper')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === 'scraper' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-[var(--color-muted)] hover:text-white'
            }`}
          >
            <Mail size={15} />
            Email Scraper
          </button>
        </div>

        {activeView === 'kanban' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                showFilters || activeFilterCount > 0
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-[var(--color-muted)] hover:text-white border-white/[0.08]'
              }`}
            >
              <Filter size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && activeView === 'kanban' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--color-muted)] mb-2 block">Source</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="all">All Sources</option>
                  {Object.keys(SOURCE_BADGES).map(s => (
                    <option key={s} value={s}>{SOURCE_BADGES[s].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-muted)] mb-2 block">Value Range</label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value as typeof filterValue)}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="all">All Values</option>
                  <option value="high">High ($15k+)</option>
                  <option value="mid">Medium ($5k-$15k)</option>
                  <option value="low">Low (&lt;$5k)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeView === 'kanban' ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Empty State or Kanban Board */}
            {leads.length === 0 && !search && filterSource === 'all' && filterValue === 'all' ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Target size={40} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No leads yet</h3>
                <p className="text-[var(--color-muted)] max-w-md mb-6">
                  Start building your sales pipeline by adding leads manually or using the email scraper to find potential clients.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddLead}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Add Your First Lead
                  </button>
                  <button
                    onClick={() => setActiveView('scraper')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 text-[var(--color-muted)] border border-white/10 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  >
                    <Mail size={18} />
                    Try Email Scraper
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="flex gap-4 lg:grid lg:grid-cols-6 lg:gap-3 min-w-max lg:min-w-0">
                  {STATUSES.map((status, index) => (
                    <motion.div
                      key={status.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <KanbanColumn
                        status={status}
                        leads={leadsByStatus[status.id]}
                        onSelectLead={setSelectedLead}
                        onDropLead={handleDropLead}
                        draggingLead={draggingLead}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="scraper"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <EmailScraper onAddToLeads={handleAddFromScraper} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Over Panel */}
      <AnimatePresence>
        {selectedLead && (
          <SlideOver
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={handleUpdateLead}
            onDelete={handleDeleteLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
