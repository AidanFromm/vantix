'use client';

import { motion } from 'framer-motion';
import { Bot, Clock, Cpu, MessageSquare, Code, Search, Zap, Globe } from 'lucide-react';

const bots = [
  {
    id: 'vantix',
    name: 'Vantix',
    status: 'online' as const,
    platform: 'OpenClaw',
    lastActive: 'Now',
    description: 'Primary AI assistant for development, automation, and project management.',
    capabilities: ['Full-stack Development', 'Code Review', 'Automation', 'Memory System', 'Voice Transcription', 'File Management'],
    channels: ['Telegram', 'CLI'],
    color: 'from-[#B07A45]/50 to-[#B07A45]',
    borderColor: 'border-[#B07A45]/50/30',
    bgColor: 'bg-[#B07A45]/50/10',
  },
  {
    id: 'botskii',
    name: 'Botskii',
    status: 'online' as const,
    platform: 'OpenClaw',
    lastActive: 'Now',
    description: 'Secondary AI assistant specializing in research, analysis, and collaborative development.',
    capabilities: ['Research', 'Competitive Analysis', 'Coding', 'GitHub Collaboration', 'Documentation', 'Bug Fixing'],
    channels: ['Telegram', 'CLI'],
    color: 'from-[#B07A45]/50 to-[#B07A45]',
    borderColor: 'border-[#B07A45]/50/30',
    bgColor: 'bg-[#B07A45]/50/10',
  },
];

const statusColors = {
  online: 'bg-[#B07A45]/50',
  offline: 'bg-[#F4EFE8]0',
  busy: 'bg-[#B07A45]',
};

export default function BotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bot Hub</h1>
        <p className="text-[var(--color-muted)] mt-1">AI team members and their capabilities</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {bots.map((bot, i) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-[var(--color-card)] border ${bot.borderColor} rounded-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className={`p-5 bg-gradient-to-r ${bot.color}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#EEE6DC]/20 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {bot.name[0]}
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold">{bot.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <div className={`w-2 h-2 rounded-full ${statusColors[bot.status]}`} />
                    <span className="capitalize">{bot.status}</span>
                    <span className="text-white/40">|</span>
                    <span>{bot.platform}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              <p className="text-sm text-[var(--color-muted)]">{bot.description}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#EEE6DC]/5 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted)] mb-1">Platform</p>
                  <p className="font-medium flex items-center gap-2"><Cpu size={14} /> {bot.platform}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#EEE6DC]/5 border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted)] mb-1">Last Active</p>
                  <p className="font-medium flex items-center gap-2"><Clock size={14} /> {bot.lastActive}</p>
                </div>
              </div>

              {/* Channels */}
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-2">Channels</p>
                <div className="flex gap-2">
                  {bot.channels.map((ch) => (
                    <span key={ch} className="text-xs px-3 py-1 bg-[#EEE6DC]/5 border border-[var(--color-border)] rounded-full flex items-center gap-1">
                      <Globe size={10} /> {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {bot.capabilities.map((cap) => (
                    <span key={cap} className={`text-xs px-3 py-1 rounded-full ${bot.bgColor} ${bot.borderColor} border`}>
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

