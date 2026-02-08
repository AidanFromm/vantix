'use client';

import { ExternalLink, GitBranch, GitCommit, Star, Eye, AlertCircle } from 'lucide-react';

const repos = [
  {
    name: 'Dave-App',
    fullName: 'AidanFromm/Dave-App',
    description: 'Secured Tampa - Multi-channel e-commerce platform',
    url: 'https://github.com/AidanFromm/Dave-App',
    language: 'TypeScript',
    stars: 0,
    watchers: 1,
    defaultBranch: 'main',
    lastCommit: '2 hours ago',
    lastCommitMessage: 'fix: shop page filter logic for new items',
    isPrivate: true,
  },
  {
    name: 'vantix',
    fullName: 'usevantix/vantix',
    description: 'Vantix agency website and dashboard',
    url: 'https://github.com/usevantix/vantix',
    language: 'TypeScript',
    stars: 0,
    watchers: 2,
    defaultBranch: 'main',
    lastCommit: 'Just now',
    lastCommitMessage: 'feat: initial project setup',
    isPrivate: true,
  },
];

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Swift: '#fa7343',
};

export default function GithubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GitHub</h1>
        <p className="text-[var(--color-muted)] mt-1">All repositories at a glance</p>
      </div>

      <div className="grid gap-6">
        {repos.map((repo) => (
          <div
            key={repo.name}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold hover:text-[var(--color-accent)] transition-colors flex items-center gap-2"
                  >
                    {repo.fullName}
                    <ExternalLink size={16} />
                  </a>
                  {repo.isPrivate && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-[var(--color-muted)] mt-1">{repo.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: languageColors[repo.language] || '#888' }}
                />
                {repo.language}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {repo.watchers}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch size={14} />
                {repo.defaultBranch}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-sm">
                <GitCommit size={14} className="text-[var(--color-accent)]" />
                <span className="text-[var(--color-muted)]">{repo.lastCommit}:</span>
                <span className="truncate">{repo.lastCommitMessage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex items-center gap-3 text-[var(--color-muted)]">
          <AlertCircle size={20} />
          <p className="text-sm">
            Connect GitHub API to see real-time repo data, commits, and pull requests.
          </p>
        </div>
      </div>
    </div>
  );
}
