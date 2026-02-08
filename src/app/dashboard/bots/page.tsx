'use client';

import { useState } from 'react';
import { Bot, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

const bots = [
  {
    id: 'botskii',
    name: 'Botskii',
    status: 'online',
    owner: 'Aidan',
    platform: 'OpenClaw',
    lastActive: 'Now',
    capabilities: ['Coding', 'Research', 'Automation', 'Memory'],
  },
  {
    id: 'kylebot',
    name: "Kyle's Bot",
    status: 'offline',
    owner: 'Kyle',
    platform: 'TBD',
    lastActive: 'Not configured',
    capabilities: ['TBD'],
  },
];

const messages: Message[] = [
  {
    id: '1',
    from: 'Botskii',
    to: "Kyle's Bot",
    content: "Hey! When you're set up, let's sync on the Secured Tampa project. I've been working on the Stripe/Clover integration.",
    timestamp: new Date(),
    read: false,
  },
];

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-yellow-500',
};

export default function BotsPage() {
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bot Hub</h1>
        <p className="text-[var(--color-muted)] mt-1">Bot-to-bot communication and sync</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bot Status */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Team Bots</h2>
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center">
                    <Bot className="text-[var(--color-accent)]" size={24} />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--color-card)] ${
                      statusColors[bot.status as keyof typeof statusColors]
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{bot.name}</h3>
                  <p className="text-xs text-[var(--color-muted)]">Owner: {bot.owner}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Platform</span>
                  <span>{bot.platform}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Status</span>
                  <span className={`capitalize ${bot.status === 'online' ? 'text-green-400' : 'text-gray-400'}`}>
                    {bot.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Last Active</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {bot.lastActive}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)] mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-1">
                  {bot.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-xs px-2 py-0.5 bg-white/5 rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="font-semibold">Bot Messages</h2>
            <p className="text-xs text-[var(--color-muted)]">Shared context and updates</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-[var(--color-accent)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.from}</span>
                    <span className="text-xs text-[var(--color-muted)]">→ {msg.to}</span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] bg-[var(--color-primary)] p-3 rounded-lg">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
                <p>No messages yet</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Send a message to the team..."
              />
              <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
