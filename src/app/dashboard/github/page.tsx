'use client';

import { motion } from 'framer-motion';
import { ExternalLink, GitBranch, GitCommit, Star, Eye, AlertCircle, Info } from 'lucide-react';

const repos = [
  {
    name: 'Dave-App',
    fullName: 'AidanFromm/Dave-App',
    description: 'Secured Tampa - Multi-channel e-commerce platform for sneaker and Pokemon store',
    url: 'https://github.com/AidanFromm/Dave-App',
    language: 'TypeScript',
    stars: 0,
    watchers: 2,
    defaultBranch: 'main',
    isPrivate: true,
  },
  {
    name: 'vantix',
    fullName: 'AidanFromm/vantix',
    description: 'Vantix agency website and internal dashboard',
    url: 'https://github.com/AidanFromm/vantix',
    language: 'TypeScript',
    stars: 0,
    watchers: 2,
    defaultBranch: 'main',
    isPrivate: true,
  },
  {
    name: 'Sports',
    fullName: 'AidanFromm/Sports',
    description: 'Automated NBA/NHL moneyline arbitrage bot - Vegas odds vs Polymarket',
    url: 'https://github.com/AidanFromm/Sports',
    language: 'Python',
    stars: 0,
    watchers: 2,
    defaultBranch: 'main',
    isPrivate: true,
  },
  {
    name: 'card-ledger',
    fullName: 'AidanFromm/card-ledger',
    description: 'iOS app for collectors and resellers - sports cards, Pokemon, TCGs with portfolio analytics',
    url: 'https://github.com/AidanFromm/card-ledger',
    language: 'TypeScript',
    stars: 0,
    watchers: 2,
    defaultBranch: 'main',
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

      <div className="grid gap-4">
        {repos.map((repo, i) => (
          <motion.div
            key={repo.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)]/30 transition-colors"
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
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Private</span>
                  )}
                </div>
                <p className="text-[var(--color-muted)] mt-1">{repo.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColors[repo.language] || '#888' }} />
                {repo.language}
              </span>
              <span className="flex items-center gap-1"><Star size={14} /> {repo.stars}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {repo.watchers}</span>
              <span className="flex items-center gap-1"><GitBranch size={14} /> {repo.defaultBranch}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6"
      >
        <div className="flex items-center gap-3 text-[var(--color-muted)]">
          <Info size={20} className="text-blue-400" />
          <p className="text-sm">
            GitHub API integration is planned. Once connected, this page will show real-time commits, pull requests, and deployment status.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

