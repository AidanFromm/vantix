'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Dave',
    content: '- Needs Clover POS integration\n- Stripe already connected\n- Ask for Merchant ID + API token\n- Timeline: 2 weeks',
    updatedAt: new Date('2024-02-07'),
  },
  {
    id: '2',
    title: 'Ideas for Vantix',
    content: '- Add testimonials section\n- Case studies page\n- Blog for SEO\n- Integrate calendar booking',
    updatedAt: new Date('2024-02-06'),
  },
];

export default function NotepadPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNote, setActiveNote] = useState<Note | null>(initialNotes[0]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
    ));
    if (activeNote?.id === id) {
      setActiveNote({ ...activeNote, ...updates, updatedAt: new Date() });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(notes.find(n => n.id !== id) || null);
    }
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
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Note
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Notes list */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 overflow-y-auto">
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  activeNote?.id === note.id
                    ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-[var(--color-muted)] mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      {note.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <textarea
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none resize-none text-[var(--color-muted)]"
                placeholder="Start writing..."
              />
              <p className="text-xs text-[var(--color-muted)] mt-4">
                Last updated: {activeNote.updatedAt.toLocaleString()}
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
