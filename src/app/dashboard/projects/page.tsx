'use client';

import { ExternalLink, Github, Globe, MoreHorizontal, Plus } from 'lucide-react';

const projects = [
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
  },
  {
    id: '2',
    name: 'Vantix',
    description: 'Agency website and internal dashboard',
    status: 'active',
    tech: ['Next.js', 'Tailwind', 'Supabase'],
    github: 'https://github.com/usevantix/vantix',
    live: 'https://usevantix.com',
    client: 'Internal',
    revenue: '-',
  },
  {
    id: '3',
    name: 'NexGen Dashboard',
    description: 'Business management dashboard with client tracking',
    status: 'completed',
    tech: ['Next.js', 'Tailwind'],
    github: null,
    live: null,
    client: 'Internal',
    revenue: '-',
  },
];

const statusColors = {
  active: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-[var(--color-muted)] mt-1">All client and internal projects</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status as keyof typeof statusColors]}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-[var(--color-muted)] mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-white/5 border border-[var(--color-border)] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[var(--color-muted)]">
                    Client: <span className="text-white">{project.client}</span>
                  </span>
                  {project.revenue !== '-' && (
                    <span className="text-[var(--color-muted)]">
                      Revenue: <span className="text-green-400">{project.revenue}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    title="Live Site"
                  >
                    <Globe size={20} />
                  </a>
                )}
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
