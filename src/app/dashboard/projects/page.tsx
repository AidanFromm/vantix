'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Globe, 
  MoreHorizontal, 
  Plus, 
  ChevronDown, 
  Trash2, 
  Edit2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';

interface LogEntry {
  id: string;
  date: string;
  message: string;
  author: string;
  type: 'update' | 'milestone' | 'note';
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  tech: string[];
  github: string | null;
  live: string | null;
  client: string;
  revenue: string;
  startDate: string;
  logs: LogEntry[];
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Secured Tampa',
    description: 'Multi-channel e-commerce platform for sneaker & Pokemon store',
    status: 'active',
    tech: ['Next.js', 'Supabase', 'Stripe', 'SwiftUI'],
    github: 'https://github.com/AidanFromm/Dave-App',
    live: 'https://securedtampa.com',
    client: 'Dave',
    revenue: '$4,500',
    startDate: '2025-12-01',
    logs: [
      { id: '1', date: '2026-02-08', message: 'Stripe webhook integration complete', author: 'Botskii', type: 'milestone' },
      { id: '2', date: '2026-02-07', message: 'Fixed StockX OAuth flow', author: 'Botskii', type: 'update' },
      { id: '3', date: '2026-02-06', message: 'Shop page filter bug resolved', author: 'Botskii', type: 'update' },
      { id: '4', date: '2026-02-05', message: 'Waiting on Clover credentials from Dave', author: 'Aidan', type: 'note' },
    ],
  },
  {
    id: '2',
    name: 'Vantix',
    description: 'Agency website and internal dashboard',
    status: 'active',
    tech: ['Next.js', 'Tailwind', 'Framer Motion'],
    github: 'https://github.com/AidanFromm/vantix',
    live: 'https://usevantix.com',
    client: 'Internal',
    revenue: '-',
    startDate: '2026-02-07',
    logs: [
      { id: '1', date: '2026-02-08', message: 'Landing page 3D overhaul', author: 'Botskii', type: 'milestone' },
      { id: '2', date: '2026-02-07', message: 'Dashboard sidebar fixed for desktop', author: 'Botskii', type: 'update' },
      { id: '3', date: '2026-02-07', message: 'Initial deploy to Vercel', author: 'Botskii', type: 'milestone' },
    ],
  },
];

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const statusIcons = {
  active: Activity,
  completed: CheckCircle2,
  paused: AlertCircle,
};

const logTypeColors = {
  update: 'border-blue-500/50 bg-blue-500/10',
  milestone: 'border-green-500/50 bg-green-500/10',
  note: 'border-yellow-500/50 bg-yellow-500/10',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setDeleteConfirm(null);
    setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-[var(--color-muted)] mt-1">All client and internal projects</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => {
          const isExpanded = expandedId === project.id;
          const StatusIcon = statusIcons[project.status];
          
          return (
            <motion.div
              key={project.id}
              layout
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors"
            >
              {/* Main Card */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">{project.name}</h2>
                      <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[project.status]} flex items-center gap-1`}>
                        <StatusIcon size={12} />
                        {project.status}
                      </span>
                    </div>
                    <p className="text-[var(--color-muted)] mb-4">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 bg-white/5 border border-[var(--color-border)] rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-[var(--color-muted)] flex items-center gap-2">
                        <Calendar size={14} />
                        {project.startDate}
                      </span>
                      <span className="text-[var(--color-muted)]">
                        Client: <span className="text-white">{project.client}</span>
                      </span>
                      {project.revenue !== '-' && (
                        <span className="flex items-center gap-1 text-green-400">
                          <DollarSign size={14} />
                          {project.revenue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title="GitHub"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title="Live Site"
                      >
                        <Globe size={20} />
                      </a>
                    )}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="p-2"
                    >
                      <ChevronDown size={20} className="text-[var(--color-muted)]" />
                    </motion.div>
                  </div>
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
                    <div className="p-6 space-y-6">
                      {/* Activity Log */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Clock size={18} />
                          Activity Log
                        </h3>
                        <div className="space-y-3">
                          {project.logs.map((log) => (
                            <div
                              key={log.id}
                              className={`p-4 rounded-xl border-l-4 ${logTypeColors[log.type]} bg-opacity-50`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{log.message}</p>
                                  <p className="text-sm text-[var(--color-muted)] mt-1">
                                    {log.author} • {log.date}
                                  </p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-white/5 capitalize">
                                  {log.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                        <button className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition-colors">
                          <Edit2 size={16} />
                          Edit Project
                        </button>
                        
                        {deleteConfirm === project.id ? (
                          <div className="flex items-center gap-3">
                            <span className="text-red-400 text-sm">Delete this project?</span>
                            <button
                              onClick={() => handleDelete(project.id)}
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
                            onClick={() => setDeleteConfirm(project.id)}
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
      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-[var(--color-muted)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-[var(--color-muted)]">Create your first project to get started</p>
        </div>
      )}
    </div>
  );
}
