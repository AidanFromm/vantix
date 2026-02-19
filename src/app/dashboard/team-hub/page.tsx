'use client';

import { useState, useEffect } from 'react';
import { Users2, Bot, User, Activity, CheckCircle, Clock, MessageSquare, Zap, Loader2 } from 'lucide-react';
import { getData } from '@/lib/data';

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

export default function TeamHubPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const d = await getData<TeamMember>('team_members');
      setTeam(d);
      setLoading(false);
    })();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#C89A6A]';
      case 'busy': return 'bg-[#C89A6A]';
      case 'offline': return 'bg-[#A39B90]';
      default: return 'bg-[#A39B90]';
    }
  };

  const totalCompleted = team.reduce((s, m) => s + (m.tasks?.completed || 0), 0);
  const totalPending = team.reduce((s, m) => s + (m.tasks?.pending || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#B07A45]" />
      </div>
    );
  }

  if (team.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Hub</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Humans + bots working together</p>
          </div>
        </div>
        <div className="text-center py-16 text-[var(--color-muted)]">
          <Users2 size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No team members yet</p>
        </div>
      </div>
    );
  }

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
            <Activity size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Online Now</span>
          </div>
          <p className="text-2xl font-bold text-[#C89A6A]">{team.filter(m => m.status === 'online').length}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-[#B07A45]" />
            <span className="text-xs text-[var(--color-muted)]">Tasks Done</span>
          </div>
          <p className="text-2xl font-bold">{totalCompleted}</p>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[#C89A6A]" />
            <span className="text-xs text-[var(--color-muted)]">Pending</span>
          </div>
          <p className="text-2xl font-bold">{totalPending}</p>
        </div>
      </div>

      {/* Team members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map(member => (
          <div key={member.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[#B07A45]/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#B07A45]/20 flex items-center justify-center">
                  {member.type === 'bot' ? (
                    <Bot size={20} className="text-[#B07A45]" />
                  ) : (
                    <User size={20} className="text-[#B07A45]" />
                  )}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--color-card)] ${getStatusColor(member.status)}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{member.name}</h3>
                  {member.type === 'bot' && (
                    <Zap size={12} className="text-[#C89A6A]" />
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
                    <CheckCircle size={14} className="text-[#C89A6A]" />
                    <span>{member.tasks?.completed || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#C89A6A]" />
                    <span>{member.tasks?.pending || 0}</span>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-[#EEE6DC]/10 rounded-lg transition-colors">
                  <MessageSquare size={14} className="text-[var(--color-muted)]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
