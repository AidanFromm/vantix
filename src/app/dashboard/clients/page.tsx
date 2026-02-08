'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Mail, 
  Phone, 
  Building, 
  ChevronDown,
  Trash2,
  Edit2,
  FolderOpen,
  StickyNote,
  FileText,
  Bot,
  User,
  Calendar,
  DollarSign,
  ExternalLink,
  Save,
  X
} from 'lucide-react';

interface ClientFile {
  id: string;
  name: string;
  content: string;
  lastUpdated: string;
}

interface ClientNote {
  id: string;
  content: string;
  author: string;
  date: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  projects: number;
  status: 'active' | 'prospect' | 'inactive';
  totalRevenue: string;
  startDate: string;
  files: ClientFile[];
  notes: ClientNote[];
}

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Dave',
    company: 'Secured Tampa',
    email: 'dave@securedtampa.com',
    phone: '(813) 555-0123',
    projects: 1,
    status: 'active',
    totalRevenue: '$4,500',
    startDate: '2025-12-01',
    files: [
      {
        id: 'f1',
        name: 'Client Overview',
        content: `## Secured Tampa - Client Profile

**Business Type:** Sneaker & Pokemon Card Store (Tampa, FL)
**Main Contact:** Dave
**Communication Style:** Prefers quick texts, available during business hours

### Technical Requirements
- Omnichannel inventory (website + in-store POS)
- Real-time StockX price integration
- iOS app for scanning & adding inventory
- Stripe for online, Clover for in-store

### Key Priorities
1. Fast inventory scanning
2. Accurate pricing from StockX
3. Easy checkout on website
4. POS integration for in-store sales

### Integration Notes
- StockX API working (OAuth fix completed)
- Stripe webhooks active
- Waiting on Clover merchant credentials`,
        lastUpdated: '2026-02-08',
      },
    ],
    notes: [
      { id: 'n1', content: 'Dave mentioned wanting a loyalty program in the future', author: 'Kyle', date: '2026-02-05' },
      { id: 'n2', content: 'Prefers to communicate via text, responds quickly', author: 'Aidan', date: '2026-01-15' },
    ],
  },
  {
    id: '2',
    name: 'Pending Lead',
    company: 'TBD',
    email: 'lead@example.com',
    phone: null,
    projects: 0,
    status: 'prospect',
    totalRevenue: '-',
    startDate: '-',
    files: [],
    notes: [
      { id: 'n1', content: 'Reached out through website contact form. Interested in e-commerce solution.', author: 'Aidan', date: '2026-02-08' },
    ],
  },
];

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  prospect: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'notes'>('files');
  const [editingNote, setEditingNote] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setActiveTab('files');
  };

  const addNote = (clientId: string) => {
    if (!editingNote.trim()) return;
    
    setClients(clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          notes: [
            {
              id: Date.now().toString(),
              content: editingNote,
              author: 'You',
              date: new Date().toISOString().split('T')[0],
            },
            ...client.notes,
          ],
        };
      }
      return client;
    }));
    setEditingNote('');
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    setDeleteConfirm(null);
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-[var(--color-muted)] mt-1">Manage client relationships and documentation</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {/* Client Cards */}
      <div className="space-y-4">
        {clients.map((client) => {
          const isExpanded = expandedId === client.id;
          
          return (
            <motion.div
              key={client.id}
              layout
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors"
            >
              {/* Main Card */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(client.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xl font-bold">
                        {client.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-semibold">{client.name}</h2>
                          <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[client.status]}`}>
                            {client.status}
                          </span>
                        </div>
                        <p className="text-[var(--color-muted)] flex items-center gap-2 text-sm mt-1">
                          <Building size={14} />
                          {client.company}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <a 
                        href={`mailto:${client.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition-colors"
                      >
                        <Mail size={14} />
                        {client.email}
                      </a>
                      {client.phone && (
                        <span className="flex items-center gap-2 text-[var(--color-muted)]">
                          <Phone size={14} />
                          {client.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-[var(--color-muted)]">
                        <FolderOpen size={14} />
                        {client.projects} project{client.projects !== 1 ? 's' : ''}
                      </span>
                      {client.totalRevenue !== '-' && (
                        <span className="flex items-center gap-2 text-green-400">
                          <DollarSign size={14} />
                          {client.totalRevenue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="p-2"
                  >
                    <ChevronDown size={20} className="text-[var(--color-muted)]" />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[var(--color-border)]"
                  >
                    <div className="p-6">
                      {/* Tabs */}
                      <div className="flex gap-2 mb-6">
                        <button
                          onClick={() => setActiveTab('files')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                            activeTab === 'files'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/5 text-[var(--color-muted)] hover:text-white'
                          }`}
                        >
                          <Bot size={16} />
                          Client Files
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                            {client.files.length}
                          </span>
                        </button>
                        <button
                          onClick={() => setActiveTab('notes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                            activeTab === 'notes'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-white/5 text-[var(--color-muted)] hover:text-white'
                          }`}
                        >
                          <User size={16} />
                          Team Notes
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                            {client.notes.length}
                          </span>
                        </button>
                      </div>

                      {/* Files Tab */}
                      {activeTab === 'files' && (
                        <div className="space-y-4">
                          <p className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                            <Bot size={14} />
                            These files help the bots understand client context and needs
                          </p>
                          
                          {client.files.length > 0 ? (
                            client.files.map((file) => (
                              <div
                                key={file.id}
                                className="p-4 rounded-xl bg-white/5 border border-[var(--color-border)]"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-blue-400" />
                                    <span className="font-medium">{file.name}</span>
                                  </div>
                                  <span className="text-xs text-[var(--color-muted)]">
                                    Updated: {file.lastUpdated}
                                  </span>
                                </div>
                                <div className="bg-[var(--color-primary)] rounded-lg p-4 text-sm text-white/70 whitespace-pre-wrap font-mono">
                                  {file.content}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-[var(--color-muted)]">
                              <FileText size={32} className="mx-auto mb-2 opacity-50" />
                              <p>No client files yet</p>
                              <button className="mt-2 text-blue-400 hover:underline text-sm">
                                + Add client file
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes Tab */}
                      {activeTab === 'notes' && (
                        <div className="space-y-4">
                          <p className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                            <User size={14} />
                            Personal notes from the team about this client
                          </p>
                          
                          {/* Add Note */}
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={editingNote}
                              onChange={(e) => setEditingNote(e.target.value)}
                              placeholder="Add a note..."
                              className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') addNote(client.id);
                              }}
                            />
                            <button
                              onClick={() => addNote(client.id)}
                              disabled={!editingNote.trim()}
                              className="px-4 py-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Save size={20} />
                            </button>
                          </div>
                          
                          {/* Notes List */}
                          <div className="space-y-3">
                            {client.notes.map((note) => (
                              <div
                                key={note.id}
                                className="p-4 rounded-xl bg-white/5 border border-[var(--color-border)]"
                              >
                                <p className="text-white/80">{note.content}</p>
                                <p className="text-xs text-[var(--color-muted)] mt-2">
                                  {note.author} • {note.date}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions Bar */}
                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--color-border)]">
                        <button className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition-colors">
                          <Edit2 size={16} />
                          Edit Client
                        </button>
                        
                        {deleteConfirm === client.id ? (
                          <div className="flex items-center gap-3">
                            <span className="text-red-400 text-sm">Delete this client?</span>
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(client.id)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-[var(--color-muted)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No clients yet</h3>
          <p className="text-[var(--color-muted)]">Add your first client to get started</p>
        </div>
      )}
    </div>
  );
}
