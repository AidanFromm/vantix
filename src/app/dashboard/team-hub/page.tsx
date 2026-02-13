'use client';

import { useState } from 'react';
import { Users2, Bot, User, Activity, CheckCircle, Clock, MessageSquare, Zap } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: 'human' | 'bot';
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
  tasks: { completed: number; pending: number };
  lastActive: string;
}

const mockTeam: TeamMember[] = [
  { 
    id: '1', 
    name: 'Aidan', 
    role: 'Founder / Tech Lead', 
    type: 'human', 
    status: 'online',
    tasks: { completed: 12, pending: 3 },
    lastActive: 'Now'
  },
  { 
    id: '2', 
    name: 'Kyle', 
    role: 'Co-Founder / Business', 
    type: 'human', 
    status: 'offline',
    tasks: { completed: 8, pending: 2 },
    lastActive: '2 hours ago'
  },
  { 
    id: '3', 
    name: 'Botskii', 
    role: 'AI Assistant', 
    type: 'bot', 
    status: 'online',
    tasks: { completed: 47, pending: 5 },
    lastActive: 'Now'
  },
];

export default function TeamHubPage() {
  const [team] = useState<TeamMember[]>(mockTeam);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const totalCompleted = team.reduce((s, m) => s + m.tasks.completed, 0);
  const totalPending = team.reduce((s, m) => s + m.tasks.pending, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Hub</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Humans + bots working together</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users2 size={16} className="text-[var(--color-muted)]" />
            <span className="text-xs text-[var(--color-muted)]">Team Size</span>
          </div>
          <p className="text-2xl font-bold">{team.length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-400" />
            <span className="text-xs text-[var(--color-muted)]">Online Now</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{team.filter(m => m.status === 'online').length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-[#10b981]" />
            <span className="text-xs text-[var(--color-muted)]">Tasks Done</span>
          </div>
          <p className="text-2xl font-bold">{totalCompleted}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-400" />
            <span className="text-xs text-[var(--color-muted)]">Pending</span>
          </div>
          <p className="text-2xl font-bold">{totalPending}</p>
        </div>
      </div>

      {/* Team members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map(member => (
          <div key={member.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[#10b981]/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                  {member.type === 'bot' ? (
                    <Bot size={20} className="text-[#10b981]" />
                  ) : (
                    <User size={20} className="text-[#10b981]" />
                  )}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--color-card)] ${getStatusColor(member.status)}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{member.name}</h3>
                  {member.type === 'bot' && (
                    <Zap size={12} className="text-yellow-400" />
                  )}
                </div>
                <p className="text-sm text-[var(--color-muted)]">{member.role}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Last active: {member.lastActive}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>{member.tasks.completed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-yellow-400" />
                    <span>{member.tasks.pending}</span>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <MessageSquare size={14} className="text-[var(--color-muted)]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity feed placeholder */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { name: 'Botskii', action: 'completed task', target: 'Fix Vantix 404 pages', time: 'Just now' },
            { name: 'Aidan', action: 'assigned task to', target: 'Botskii', time: '5 min ago' },
            { name: 'Botskii', action: 'deployed', target: 'Heavy Favorite Bot', time: '2 hours ago' },
            { name: 'Kyle', action: 'closed deal', target: 'Secured Tampa', time: 'Yesterday' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="font-medium">{activity.name}</span>
              <span className="text-[var(--color-muted)]">{activity.action}</span>
              <span className="text-[#10b981]">{activity.target}</span>
              <span className="text-[var(--color-muted)] ml-auto text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
