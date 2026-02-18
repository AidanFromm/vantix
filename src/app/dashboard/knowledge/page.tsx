'use client';

import { useState, useEffect, useMemo } from 'react';
import { Book, Search, Plus, Edit3, Trash2, ArrowLeft, Tag, Clock, User, FolderOpen, FileText, ChevronRight, X, Save } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  body: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ['Getting Started', 'Client Onboarding', 'Technical Docs', 'Processes', 'Templates'];

const SEED_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'New Client Onboarding Checklist',
    category: 'Client Onboarding',
    body: `# New Client Onboarding Checklist

## Before Kickoff
- Signed contract and SOW received
- Payment terms confirmed
- Access credentials collected (hosting, domains, APIs)
- Slack or communication channel created

## Week 1
- Kickoff call completed
- Project timeline shared
- Brand assets collected (logos, colors, fonts)
- Technical requirements documented

## Ongoing
- Weekly status updates scheduled
- Feedback loops established
- Milestone reviews planned

## Tools Setup
- Add client to project management board
- Create shared Google Drive folder
- Set up staging environment
- Configure CI/CD pipeline if needed

> Always confirm the client has a single point of contact before starting work.`,
    tags: ['onboarding', 'clients', 'checklist'],
    author: 'Kyle',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'How We Price Projects',
    category: 'Processes',
    body: `# How We Price Projects

## Pricing Models

### Fixed Price
Best for well-defined projects with clear scope.
- Small sites: $1,500 - $3,000
- Medium projects: $3,000 - $8,000
- Large builds: $8,000 - $20,000+

### Monthly Retainer
For ongoing maintenance and support.
- Basic: $200/mo (updates, backups, monitoring)
- Standard: $500/mo (+ minor changes, priority support)
- Premium: $1,000+/mo (dedicated hours, strategy)

### Hourly
For consulting and ad-hoc work.
- Rate: $75 - $150/hr depending on complexity

## Estimation Process
1. Discovery call (30 min)
2. Write scope document
3. Break into milestones
4. Estimate hours per milestone
5. Add 20% buffer for unknowns
6. Present proposal within 48 hours

## Payment Terms
- 50% upfront, 50% on completion (fixed)
- Net 15 for retainers
- Weekly invoicing for hourly`,
    tags: ['pricing', 'sales', 'process'],
    author: 'Kyle',
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z',
  },
  {
    id: '3',
    title: 'AI Tools We Use',
    category: 'Technical Docs',
    body: `# AI Tools We Use

## Development
- **Claude** — Primary AI assistant for code generation, debugging, architecture
- **GitHub Copilot** — Inline code suggestions in VS Code
- **Cursor** — AI-native code editor for complex refactors

## Design
- **Midjourney** — Concept art and visual exploration
- **Replicate** — Custom model hosting for image generation

## Client-Facing
- **Bland AI** — Automated phone agents for lead qualification
- **Cal.com** — AI-assisted scheduling

## Operations
- **OpenClaw** — Orchestration layer connecting all AI tools
- **Resend** — Transactional email with AI-generated content

## Guidelines
- Always review AI-generated code before shipping
- Never send raw AI output to clients without editing
- Document any custom prompts in the project repo
- Keep API keys in environment variables, never in code`,
    tags: ['ai', 'tools', 'technical'],
    author: 'Kyle',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-10T16:00:00Z',
  },
];

const STORAGE_KEY = 'vantix_knowledge_articles';

function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_ARTICLES;
}

function saveArticles(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {}
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeBlock: string[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre key={`code-${i}`} className="bg-[#1C1C1C] text-[#C89A6A] p-4 rounded-lg text-sm overflow-x-auto my-3 font-mono">
            {codeBlock.join('\n')}
          </pre>
        );
        codeBlock = [];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) {
      codeBlock.push(line);
      return;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-[#1C1C1C] mt-6 mb-3">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-semibold text-[#1C1C1C] mt-5 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-[#4B4B4B] mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-[#B07A45] pl-4 italic text-[#4B4B4B] my-3">{line.slice(2)}</blockquote>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 ml-4 my-1">
          <span className="text-[#B07A45] mt-1.5 text-xs">&#9679;</span>
          <span className="text-[#4B4B4B]">{renderInline(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex items-start gap-2 ml-4 my-1">
            <span className="text-[#B07A45] font-medium min-w-[1.25rem]">{match[1]}.</span>
            <span className="text-[#4B4B4B]">{renderInline(match[2])}</span>
          </div>
        );
      }
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="text-[#4B4B4B] my-1">{renderInline(line)}</p>);
    }
  });

  return elements;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[#1C1C1C]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-[#E3D9CD] px-1.5 py-0.5 rounded text-sm text-[#8E5E34] font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', category: CATEGORIES[0], body: '', tags: '' });

  useEffect(() => {
    setArticles(loadArticles());
  }, []);

  const filtered = useMemo(() => {
    let list = articles;
    if (selectedCategory) list = list.filter(a => a.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, selectedCategory, searchQuery]);

  function startCreate() {
    setEditForm({ title: '', category: selectedCategory || CATEGORIES[0], body: '', tags: '' });
    setCreating(true);
    setEditing(false);
    setSelectedArticle(null);
  }

  function startEdit(article: Article) {
    setEditForm({ title: article.title, category: article.category, body: article.body, tags: article.tags.join(', ') });
    setEditing(true);
    setCreating(false);
  }

  function handleSave() {
    const now = new Date().toISOString();
    const tags = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    let updated: Article[];

    if (creating) {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: editForm.title,
        category: editForm.category,
        body: editForm.body,
        tags,
        author: 'Kyle',
        createdAt: now,
        updatedAt: now,
      };
      updated = [...articles, newArticle];
      setSelectedArticle(newArticle);
    } else if (editing && selectedArticle) {
      updated = articles.map(a =>
        a.id === selectedArticle.id
          ? { ...a, title: editForm.title, category: editForm.category, body: editForm.body, tags, updatedAt: now }
          : a
      );
      setSelectedArticle({ ...selectedArticle, title: editForm.title, category: editForm.category, body: editForm.body, tags, updatedAt: now });
    } else return;

    setArticles(updated);
    saveArticles(updated);
    setEditing(false);
    setCreating(false);
  }

  function handleDelete(id: string) {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    saveArticles(updated);
    setSelectedArticle(null);
    setEditing(false);
  }

  const categoryCount = (cat: string) => articles.filter(a => a.category === cat).length;

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Book className="w-7 h-7 text-[#B07A45]" />
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Knowledge Base</h1>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A746C]" />
          <input
            type="text"
            placeholder="Search articles, tags, content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
          />
        </div>

        <div className="flex gap-6">
          {/* Category Sidebar */}
          <div className="w-60 flex-shrink-0">
            <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#7A746C] uppercase tracking-wider mb-3">Categories</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors ${
                  !selectedCategory ? 'bg-[#B07A45]/10 text-[#B07A45] font-medium' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'
                }`}
              >
                <span className="flex items-center gap-2"><FolderOpen className="w-4 h-4" /> All</span>
                <span className="text-xs">{articles.length}</span>
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors ${
                    selectedCategory === cat ? 'bg-[#B07A45]/10 text-[#B07A45] font-medium' : 'text-[#4B4B4B] hover:bg-[#E3D9CD]'
                  }`}
                >
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {cat}</span>
                  <span className="text-xs">{categoryCount(cat)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {(editing || creating) ? (
              /* Editor */
              <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1C1C1C]">{creating ? 'New Article' : 'Edit Article'}</h2>
                  <button onClick={() => { setEditing(false); setCreating(false); }} className="text-[#7A746C] hover:text-[#1C1C1C]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Title</label>
                    <input
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Category</label>
                      <select
                        value={editForm.category}
                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Tags (comma-separated)</label>
                      <input
                        value={editForm.tags}
                        onChange={e => setEditForm({ ...editForm, tags: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B4B4B] mb-1">Body (Markdown)</label>
                    <textarea
                      value={editForm.body}
                      onChange={e => setEditForm({ ...editForm, body: e.target.value })}
                      rows={20}
                      className="w-full px-4 py-3 bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 font-mono text-sm resize-y"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => { setEditing(false); setCreating(false); }}
                      className="px-4 py-2.5 text-[#4B4B4B] hover:text-[#1C1C1C] text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!editForm.title.trim() || !editForm.body.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {creating ? 'Create' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedArticle ? (
              /* Article Viewer */
              <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-1 text-sm text-[#B07A45] hover:text-[#8E5E34] mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to articles
                </button>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">{selectedArticle.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-[#7A746C]">
                      <span className="flex items-center gap-1"><FolderOpen className="w-3.5 h-3.5" /> {selectedArticle.category}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedArticle.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(selectedArticle.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(selectedArticle)} className="p-2 text-[#7A746C] hover:text-[#B07A45] hover:bg-[#E3D9CD] rounded-lg">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(selectedArticle.id)} className="p-2 text-[#7A746C] hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedArticle.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <Tag className="w-3.5 h-3.5 text-[#7A746C]" />
                    {selectedArticle.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-[#B07A45]/10 text-[#8E5E34] text-xs rounded-lg font-medium">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="border-t border-[#E3D9CD] pt-6">
                  {renderMarkdown(selectedArticle.body)}
                </div>
              </div>
            ) : (
              /* Article List */
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-12 text-center">
                    <FileText className="w-10 h-10 text-[#7A746C] mx-auto mb-3" />
                    <p className="text-[#7A746C]">No articles found</p>
                  </div>
                ) : (
                  filtered.map(article => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="w-full bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-4 text-left hover:border-[#B07A45]/30 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#B07A45] transition-colors">{article.title}</h3>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-[#7A746C]">
                            <span className="flex items-center gap-1"><FolderOpen className="w-3 h-3" /> {article.category}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(article.updatedAt).toLocaleDateString()}</span>
                          </div>
                          {article.tags.length > 0 && (
                            <div className="flex gap-1.5 mt-2">
                              {article.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-[#B07A45]/10 text-[#8E5E34] text-xs rounded-md">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#7A746C] group-hover:text-[#B07A45] flex-shrink-0 ml-4" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
