'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, ChevronDown, ChevronRight, ChevronLeft, Trash2, Edit2,
  Clock, CheckCircle2, AlertCircle, Calendar, Users, Filter,
  BarChart3, ArrowRight, GripVertical, ExternalLink, Link2,
  FileText, MessageSquare, User, Search, FolderKanban
} from 'lucide-react';

// --- Types ---

type Stage = 'discovery' | 'design' | 'development' | 'review' | 'launch' | 'complete';
type Tier = 'Starter' | 'Pro' | 'Premium';
type TeamMember = 'Kyle' | 'Aidan' | 'Botskii' | 'Vantix';

interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

interface ProjectNote {
  id: string;
  date: string;
  text: string;
  author: string;
}

interface ProjectLink {
  id: string;
  label: string;
  url: string;
}

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  tier: Tier;
  stage: Stage;
  startDate: string;
  deadline: string;
  progress: number;
  assignedTo: TeamMember;
  clientEmail: string;
  clientPhone: string;
  description: string;
  tasks: TaskItem[];
  notes: ProjectNote[];
  links: ProjectLink[];
  createdAt: string;
}

// --- Constants ---

const STORAGE_KEY = 'vantix_projects';

const STAGES: { key: Stage; label: string }[] = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'design', label: 'Design' },
  { key: 'development', label: 'Development' },
  { key: 'review', label: 'Review' },
  { key: 'launch', label: 'Launch' },
  { key: 'complete', label: 'Complete' },
];

const TIERS: Tier[] = ['Starter', 'Pro', 'Premium'];
const TEAM: TeamMember[] = ['Kyle', 'Aidan', 'Botskii', 'Vantix'];

const DEFAULT_TASKS: { label: string }[] = [
  { label: 'Domain setup' },
  { label: 'Hosting config' },
  { label: 'Design mockup' },
  { label: 'Homepage' },
  { label: 'About page' },
  { label: 'Contact page' },
  { label: 'SEO setup' },
  { label: 'Mobile testing' },
  { label: 'Client review' },
  { label: 'DNS switch' },
  { label: 'Launch' },
];

const tierColors: Record<Tier, string> = {
  Starter: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  Pro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Premium: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const stageColors: Record<Stage, string> = {
  discovery: '#8b5cf6',
  design: '#f59e0b',
  development: '#3b82f6',
  review: '#f97316',
  launch: '#10b981',
  complete: '#6b7280',
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createDefaultTasks(): TaskItem[] {
  return DEFAULT_TASKS.map(t => ({ id: generateId(), label: t.label, done: false }));
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].stage) {
        return parsed;
      }
    }
  } catch { /* fallback */ }
  return getDefaultProjects();
}

function saveProjectsToStorage(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch { /* ignore */ }
}

function getDefaultProjects(): Project[] {
  return [
    {
      id: generateId(),
      clientName: 'Dave (Secured Tampa)',
      projectName: 'Secured Tampa E-Commerce',
      tier: 'Premium',
      stage: 'development',
      startDate: '2025-12-01',
      deadline: '2026-03-01',
      progress: 40,
      assignedTo: 'Kyle',
      clientEmail: '',
      clientPhone: '',
      description: 'Sneaker and Pokemon store website build. $2,500 total deal — $2,000 paid, $500 remaining after completion. 3% revenue share for first 3 months.',
      tasks: createDefaultTasks(),
      notes: [],
      links: [
        { id: generateId(), label: 'GitHub', url: 'https://github.com/AidanFromm/Dave-App' },
      ],
      createdAt: '2025-12-01',
    },
  ];
}

function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getDeadlineClass(deadline: string, stage: Stage): string {
  if (stage === 'complete') return 'text-zinc-500';
  const days = getDaysUntilDeadline(deadline);
  if (days < 0) return 'text-red-400';
  if (days <= 7) return 'text-yellow-400';
  return 'text-zinc-400';
}

function getDeadlineLabel(deadline: string, stage: Stage): string {
  if (stage === 'complete') return 'Completed';
  const days = getDaysUntilDeadline(deadline);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days <= 7) return `${days}d left`;
  return deadline;
}

// --- Views ---

type ViewMode = 'board' | 'workload';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all');
  const [filterMember, setFilterMember] = useState<TeamMember | 'all'>('all');
  const [filterTier, setFilterTier] = useState<Tier | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const save = useCallback((updated: Project[]) => {
    setProjects(updated);
    saveProjectsToStorage(updated);
  }, []);

  const moveProject = (id: string, direction: 'next' | 'prev') => {
    const stageKeys = STAGES.map(s => s.key);
    save(projects.map(p => {
      if (p.id !== id) return p;
      const idx = stageKeys.indexOf(p.stage);
      const newIdx = direction === 'next' ? Math.min(idx + 1, stageKeys.length - 1) : Math.max(idx - 1, 0);
      return { ...p, stage: stageKeys[newIdx] };
    }));
  };

  const toggleTask = (projectId: string, taskId: string) => {
    save(projects.map(p => {
      if (p.id !== projectId) return p;
      const tasks = p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
      const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
      return { ...p, tasks, progress };
    }));
  };

  const deleteProject = (id: string) => {
    save(projects.filter(p => p.id !== id));
    setExpandedId(null);
  };

  const addNote = (projectId: string, text: string) => {
    save(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p, notes: [
          { id: generateId(), date: new Date().toISOString().split('T')[0], text, author: 'You' },
          ...p.notes
        ]
      };
    }));
  };

  // --- Filtered projects ---
  const filtered = projects.filter(p => {
    if (filterStage !== 'all' && p.stage !== filterStage) return false;
    if (filterMember !== 'all' && p.assignedTo !== filterMember) return false;
    if (filterTier !== 'all' && p.tier !== filterTier) return false;
    return true;
  });

  // --- Stats ---
  const activeCount = projects.filter(p => p.stage !== 'complete').length;
  const completedThisMonth = projects.filter(p => {
    if (p.stage !== 'complete') return false;
    const now = new Date();
    return p.deadline.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }).length;
  const avgDelivery = (() => {
    const completed = projects.filter(p => p.stage === 'complete' && p.startDate && p.deadline);
    if (completed.length === 0) return '--';
    const total = completed.reduce((sum, p) => {
      return sum + Math.abs(getDaysUntilDeadline(p.startDate) - getDaysUntilDeadline(p.deadline));
    }, 0);
    return `${Math.round(total / completed.length)}d`;
  })();
  const onTimeRate = (() => {
    const completed = projects.filter(p => p.stage === 'complete');
    if (completed.length === 0) return '--';
    const onTime = completed.filter(p => getDaysUntilDeadline(p.deadline) >= 0).length;
    return `${Math.round((onTime / completed.length) * 100)}%`;
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-[var(--color-muted)] mt-1">Workflow tracker and project board</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/40 text-[var(--color-accent)]' : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-muted)] hover:text-white'}`}
          >
            <Filter size={16} /> Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl hover:brightness-110 transition-all font-medium"
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Projects', value: activeCount, color: 'text-[var(--color-accent)]' },
          { label: 'Completed This Month', value: completedThisMonth, color: 'text-blue-400' },
          { label: 'Avg Delivery Time', value: avgDelivery, color: 'text-yellow-400' },
          { label: 'On-Time Rate', value: onTimeRate, color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl">
              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value as Stage | 'all')}
                className="bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="all">All Stages</option>
                {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <select
                value={filterMember}
                onChange={e => setFilterMember(e.target.value as TeamMember | 'all')}
                className="bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="all">All Members</option>
                {TEAM.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={filterTier}
                onChange={e => setFilterTier(e.target.value as Tier | 'all')}
                className="bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="all">All Tiers</option>
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button
                onClick={() => { setFilterStage('all'); setFilterMember('all'); setFilterTier('all'); }}
                className="text-sm text-[var(--color-muted)] hover:text-white transition-colors px-3 py-2"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Toggle */}
      <div className="flex gap-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-1 w-fit">
        {[
          { key: 'board' as ViewMode, label: 'Board', icon: FolderKanban },
          { key: 'workload' as ViewMode, label: 'Workload', icon: Users },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => setViewMode(v.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === v.key ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-white'}`}
          >
            <v.icon size={15} /> {v.label}
          </button>
        ))}
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex gap-4 min-w-[1200px] lg:min-w-0 lg:grid lg:grid-cols-6">
            {STAGES.map(stage => {
              const stageProjects = filtered.filter(p => p.stage === stage.key);
              return (
                <div key={stage.key} className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: stageColors[stage.key] }} />
                    <h3 className="text-sm font-semibold uppercase tracking-wider">{stage.label}</h3>
                    <span className="text-xs text-[var(--color-muted)] ml-auto bg-white/5 px-2 py-0.5 rounded-full">{stageProjects.length}</span>
                  </div>
                  <div className="space-y-3">
                    {stageProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onExpand={() => setExpandedId(project.id)}
                        onMove={moveProject}
                      />
                    ))}
                    {stageProjects.length === 0 && (
                      <div className="border border-dashed border-[var(--color-border)] rounded-xl p-4 text-center text-xs text-[var(--color-muted)]">
                        No projects
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Workload View */}
      {viewMode === 'workload' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(member => {
            const memberProjects = filtered.filter(p => p.assignedTo === member && p.stage !== 'complete');
            return (
              <div key={member} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold">
                    {member[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{member}</p>
                    <p className="text-xs text-[var(--color-muted)]">{memberProjects.length} active project{memberProjects.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {memberProjects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setExpandedId(p.id)}
                      className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <p className="text-sm font-medium truncate">{p.projectName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[var(--color-muted)] capitalize">{p.stage}</span>
                        <span className={`text-xs ${getDeadlineClass(p.deadline, p.stage)}`}>
                          {getDeadlineLabel(p.deadline, p.stage)}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div className="bg-[var(--color-accent)] h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                      </div>
                    </button>
                  ))}
                  {memberProjects.length === 0 && (
                    <p className="text-xs text-[var(--color-muted)] text-center py-4">No active projects</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded Project Detail Modal */}
      <AnimatePresence>
        {expandedId && (
          <ProjectDetailModal
            project={projects.find(p => p.id === expandedId)!}
            onClose={() => setExpandedId(null)}
            onToggleTask={toggleTask}
            onMove={moveProject}
            onDelete={deleteProject}
            onAddNote={addNote}
          />
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddProjectModal
            onClose={() => setShowAddModal(false)}
            onAdd={(project) => {
              save([project, ...projects]);
              setShowAddModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {filtered.length === 0 && projects.length > 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--color-muted)]">No projects match the current filters</p>
        </div>
      )}
    </div>
  );
}

// --- Project Card (Kanban) ---

function ProjectCard({ project, onExpand, onMove }: { project: Project; onExpand: () => void; onMove: (id: string, dir: 'next' | 'prev') => void }) {
  const stageIdx = STAGES.findIndex(s => s.key === project.stage);
  const tasksDone = project.tasks.filter(t => t.done).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-accent)]/30 transition-colors group"
      onClick={onExpand}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold text-sm leading-tight">{project.projectName}</p>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ml-2 ${tierColors[project.tier]}`}>
          {project.tier}
        </span>
      </div>
      <p className="text-xs text-[var(--color-muted)] mb-3">{project.clientName}</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-white/10 rounded-full h-1.5">
          <div className="bg-[var(--color-accent)] h-1.5 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
        </div>
        <span className="text-xs text-[var(--color-muted)]">{project.progress}%</span>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--color-muted)]">{tasksDone}/{project.tasks.length} tasks</span>
        <span className={getDeadlineClass(project.deadline, project.stage)}>
          {getDeadlineLabel(project.deadline, project.stage)}
        </span>
      </div>

      {/* Assigned + Move buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] text-[10px] font-bold">
            {project.assignedTo[0]}
          </div>
          <span className="text-xs text-[var(--color-muted)]">{project.assignedTo}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          {stageIdx > 0 && (
            <button onClick={() => onMove(project.id, 'prev')} className="p-1 hover:bg-white/10 rounded transition-colors">
              <ChevronLeft size={14} />
            </button>
          )}
          {stageIdx < STAGES.length - 1 && (
            <button onClick={() => onMove(project.id, 'next')} className="p-1 hover:bg-white/10 rounded transition-colors">
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Project Detail Modal ---

function ProjectDetailModal({ project, onClose, onToggleTask, onMove, onDelete, onAddNote }: {
  project: Project;
  onClose: () => void;
  onToggleTask: (pid: string, tid: string) => void;
  onMove: (id: string, dir: 'next' | 'prev') => void;
  onDelete: (id: string) => void;
  onAddNote: (pid: string, text: string) => void;
}) {
  const [noteText, setNoteText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const stageIdx = STAGES.findIndex(s => s.key === project.stage);
  const tasksDone = project.tasks.filter(t => t.done).length;

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl mb-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold">{project.projectName}</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${tierColors[project.tier]}`}>{project.tier}</span>
              </div>
              <p className="text-[var(--color-muted)] mt-1">{project.clientName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Stage indicator */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto">
            {STAGES.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${project.stage === s.key ? 'text-white' : i <= stageIdx ? 'text-[var(--color-accent)]' : 'text-zinc-600'}`}
                  style={project.stage === s.key ? { background: stageColors[s.key] } : {}}
                >
                  {s.label}
                </div>
                {i < STAGES.length - 1 && <ArrowRight size={12} className="text-zinc-700 mx-1 flex-shrink-0" />}
              </div>
            ))}
          </div>

          {/* Move buttons */}
          <div className="flex gap-2 mt-3">
            {stageIdx > 0 && (
              <button onClick={() => onMove(project.id, 'prev')} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <ChevronLeft size={14} /> {STAGES[stageIdx - 1].label}
              </button>
            )}
            {stageIdx < STAGES.length - 1 && (
              <button onClick={() => onMove(project.id, 'next')} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)]/30 transition-colors">
                {STAGES[stageIdx + 1].label} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-[var(--color-muted)] text-xs mb-1">Assigned To</p>
              <p className="font-medium">{project.assignedTo}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-[var(--color-muted)] text-xs mb-1">Progress</p>
              <p className="font-medium">{project.progress}% ({tasksDone}/{project.tasks.length})</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-[var(--color-muted)] text-xs mb-1">Start Date</p>
              <p className="font-medium">{project.startDate}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-[var(--color-muted)] text-xs mb-1">Deadline</p>
              <p className={`font-medium ${getDeadlineClass(project.deadline, project.stage)}`}>
                {project.deadline} ({getDeadlineLabel(project.deadline, project.stage)})
              </p>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div>
              <p className="text-sm text-[var(--color-muted)] mb-1">Description</p>
              <p className="text-sm">{project.description}</p>
            </div>
          )}

          {/* Client Contact */}
          {(project.clientEmail || project.clientPhone) && (
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-2"><User size={15} /> Client Contact</p>
              <div className="text-sm space-y-1">
                {project.clientEmail && <p className="text-[var(--color-muted)]">{project.clientEmail}</p>}
                {project.clientPhone && <p className="text-[var(--color-muted)]">{project.clientPhone}</p>}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-[var(--color-accent)] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Task Checklist */}
          <div>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2"><CheckCircle2 size={15} /> Task Checklist</p>
            <div className="space-y-1">
              {project.tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => onToggleTask(project.id, task.id)}
                  className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.done ? 'bg-[var(--color-accent)] border-[var(--color-accent)]' : 'border-zinc-600'}`}>
                    {task.done && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm ${task.done ? 'line-through text-zinc-500' : ''}`}>{task.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {project.links.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Link2 size={15} /> Files / Links</p>
              <div className="space-y-1">
                {project.links.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline p-1"
                  >
                    <ExternalLink size={13} /> {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2"><MessageSquare size={15} /> Notes</p>
            <div className="flex gap-2 mb-3">
              <input
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && noteText.trim()) {
                    onAddNote(project.id, noteText.trim());
                    setNoteText('');
                  }
                }}
                placeholder="Add a note..."
                className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    onAddNote(project.id, noteText.trim());
                    setNoteText('');
                  }
                }}
                className="px-3 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm hover:brightness-110 transition-all"
              >
                Add
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {project.notes.map(note => (
                <div key={note.id} className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1">{note.author} -- {note.date}</p>
                </div>
              ))}
              {project.notes.length === 0 && (
                <p className="text-xs text-[var(--color-muted)] text-center py-2">No notes yet</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div />
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-sm">Delete this project?</span>
                <button onClick={() => { onDelete(project.id); onClose(); }} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm">
                <Trash2 size={14} /> Delete Project
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Add Project Modal ---

function AddProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Project) => void }) {
  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    tier: 'Starter' as Tier,
    stage: 'discovery' as Stage,
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    assignedTo: 'Kyle' as TeamMember,
    clientEmail: '',
    clientPhone: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName.trim() || !form.clientName.trim()) return;
    onAdd({
      id: generateId(),
      ...form,
      progress: 0,
      tasks: createDefaultTasks(),
      notes: [],
      links: [],
      createdAt: new Date().toISOString().split('T')[0],
    });
  };

  const inputClass = "w-full bg-white/5 border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg mb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-lg font-bold">New Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Project Name *</label>
            <input value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Client Name *</label>
            <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Tier</label>
              <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value as Tier })} className={inputClass}>
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Stage</label>
              <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as Stage })} className={inputClass}>
                {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Assigned To</label>
            <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value as TeamMember })} className={inputClass}>
              {TEAM.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Client Email</label>
              <input type="email" value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Client Phone</label>
              <input value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] uppercase tracking-wider block mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl hover:brightness-110 transition-all font-medium">
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

