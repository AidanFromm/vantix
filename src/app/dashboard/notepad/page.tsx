'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const STORAGE_KEY = 'vantix_notes';

const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Dave',
    content: '- Needs Clover POS integration\n- Stripe already connected\n- Ask for Merchant ID + API token\n- Timeline: 2 weeks',
    updatedAt: new Date('2026-02-07').toISOString(),
  },
  {
    id: '2',
    title: 'Ideas for Vantix',
    content: '- Add testimonials section\n- Case studies page\n- Blog for SEO\n- Integrate calendar booking\n- Leads scraper API route',
    updatedAt: new Date('2026-02-09').toISOString(),
  },
];

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fallback */ }
  return defaultNotes;
}

export default function NotepadPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    setActiveNote(loaded[0] || null);
  }, []);

  const saveNotes = useCallback((updated: Note[]) => {
    setNotes(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }, []);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNote(newNote);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const now = new Date().toISOString();
    const updated = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: now } : n);
    saveNotes(updated);
    if (activeNote?.id === id) {
      setActiveNote({ ...activeNote, ...updates, updatedAt: now });
    }
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    if (activeNote?.id === id) {
      setActiveNote(updated[0] || null);
    }
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString(); } catch { return ''; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notepad</h1>
          <p className="text-[var(--color-muted)] mt-1">Quick notes and scratch space</p>
        </div>
        <button
          onClick={createNote}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus size={20} />
          New Note
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 overflow-y-auto">
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  activeNote?.id === note.id
                    ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]'
                    : 'hover:bg-[#EEE6DC]/5 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-[var(--color-muted)] mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] mt-1">{formatDate(note.updatedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-center text-[var(--color-muted)] py-8">No notes yet</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col">
          {activeNote ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  className="text-xl font-semibold bg-transparent border-none outline-none flex-1"
                  placeholder="Note title..."
                />
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none resize-none text-[var(--color-muted)]"
                placeholder="Start writing..."
              />
              <p className="text-xs text-[var(--color-muted)] mt-4">
                Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
              </p>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-muted)]">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

