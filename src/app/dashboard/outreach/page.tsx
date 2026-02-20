'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  Eye,
  MessageCircle,
  AlertTriangle,
  Activity,
  Users,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

interface EmailEntry {
  id?: string;
  template?: string;
  subject?: string;
  status?: string;
  sent_at?: string;
  sequence?: boolean;
  step?: number;
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  status: string;
  email_history?: EmailEntry[];
  created_at: string;
}

const FUNNEL_STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won'] as const;
const FUNNEL_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Replied',
  proposal: 'Call Booked',
  won: 'Won',
};

export default function OutreachPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      setLeads((data as Lead[]) || []);
      setLoading(false);
    }
    fetchLeads();
  }, []);

  // Compute stats
  const allEmails: (EmailEntry & { leadName: string; leadEmail: string })[] = [];
  leads.forEach((lead) => {
    (lead.email_history || []).forEach((e) => {
      allEmails.push({ ...e, leadName: lead.name, leadEmail: lead.email || '' });
    });
  });

  const totalSent = allEmails.filter((e) => e.status === 'sent' || e.status === 'opened' || e.status === 'replied').length;
  const totalOpened = allEmails.filter((e) => e.status === 'opened' || e.status === 'replied').length;
  const totalReplied = allEmails.filter((e) => e.status === 'replied').length;
  const totalBounced = allEmails.filter((e) => e.status === 'bounced').length;
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;
  const bounceRate = totalSent > 0 ? Math.round((totalBounced / totalSent) * 100) : 0;

  const sequencesActive = leads.filter(
    (l) => (l as unknown as Record<string, unknown>).sequence_status === 'active'
  ).length;
  const pipelineCount = leads.filter((l) => l.status !== 'lost' && l.status !== 'won').length;

  // Funnel
  const funnelCounts = FUNNEL_STAGES.map((stage) => ({
    stage,
    label: FUNNEL_LABELS[stage],
    count: leads.filter((l) => l.status === stage).length,
  }));

  // Sequence performance by template
  const templateStats: Record<string, { sent: number; replied: number }> = {};
  allEmails.forEach((e) => {
    const tpl = e.template || 'custom';
    if (!templateStats[tpl]) templateStats[tpl] = { sent: 0, replied: 0 };
    if (e.status === 'sent' || e.status === 'opened' || e.status === 'replied') templateStats[tpl].sent++;
    if (e.status === 'replied') templateStats[tpl].replied++;
  });
  const maxTemplateSent = Math.max(...Object.values(templateStats).map((t) => t.sent), 1);

  // Weekly summary
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString();
  const weekLeads = leads.filter((l) => l.created_at >= weekStr).length;
  const weekContacted = allEmails.filter((e) => e.sent_at && e.sent_at >= weekStr).length;
  const weekReplied = allEmails.filter((e) => e.status === 'replied' && e.sent_at && e.sent_at >= weekStr).length;
  const weekBooked = leads.filter(
    (l) => l.status === 'proposal' && l.created_at >= weekStr
  ).length;

  // Recent emails (last 20)
  const recentEmails = [...allEmails]
    .sort((a, b) => (b.sent_at || '').localeCompare(a.sent_at || ''))
    .slice(0, 20);

  const stats = [
    { label: 'Emails Sent', value: totalSent, icon: Mail },
    { label: 'Open Rate', value: `${openRate}%`, icon: Eye },
    { label: 'Reply Rate', value: `${replyRate}%`, icon: MessageCircle },
    { label: 'Bounce Rate', value: `${bounceRate}%`, icon: AlertTriangle },
    { label: 'Sequences Active', value: sequencesActive, icon: Activity },
    { label: 'In Pipeline', value: pipelineCount, icon: Users },
  ];

  const statusColors: Record<string, string> = {
    sent: 'text-[#B07A45]',
    opened: 'text-[#7A9B6D]',
    replied: 'text-[#4A7A8C]',
    bounced: 'text-[#B0614A]',
    failed: 'text-[#B0614A]',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4EFE8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B07A45] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Outreach Analytics</h1>
        <p className="text-sm text-[#7A746C] mt-1">Email campaign performance and pipeline metrics</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-[#B07A45]" />
                <span className="text-xs text-[#7A746C] font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#1C1C1C]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-4">Pipeline Funnel</h2>
          <div className="space-y-3">
            {funnelCounts.map((item, idx) => {
              const maxCount = Math.max(...funnelCounts.map((f) => f.count), 1);
              const width = Math.max((item.count / maxCount) * 100, 8);
              const nextCount = funnelCounts[idx + 1]?.count;
              const convRate =
                idx < funnelCounts.length - 1 && item.count > 0
                  ? Math.round((nextCount / item.count) * 100)
                  : null;

              return (
                <div key={item.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1C1C1C]">{item.label}</span>
                    <span className="text-sm font-bold text-[#1C1C1C]">{item.count}</span>
                  </div>
                  <div className="h-8 bg-[#F4EFE8] rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-[#B07A45] rounded-lg transition-all duration-500"
                      style={{ width: `${width}%`, opacity: 1 - idx * 0.15 }}
                    />
                  </div>
                  {convRate !== null && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#7A746C]">
                      <ArrowRight size={10} />
                      <span>{convRate}% conversion</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sequence Performance */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-4">Sequence Performance</h2>
          {Object.keys(templateStats).length === 0 ? (
            <p className="text-sm text-[#7A746C]">No email data yet</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(templateStats).map(([tpl, data]) => {
                const tplReplyRate = data.sent > 0 ? Math.round((data.replied / data.sent) * 100) : 0;
                const barWidth = (data.sent / maxTemplateSent) * 100;
                return (
                  <div key={tpl}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#1C1C1C] capitalize">{tpl}</span>
                      <span className="text-xs text-[#7A746C]">
                        {data.sent} sent / {tplReplyRate}% reply
                      </span>
                    </div>
                    <div className="h-6 bg-[#F4EFE8] rounded-lg overflow-hidden flex">
                      <div
                        className="h-full bg-[#B07A45] rounded-l-lg transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                      {data.replied > 0 && (
                        <div
                          className="h-full bg-[#B07A45]/40"
                          style={{ width: `${(data.replied / maxTemplateSent) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Summary */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-[#B07A45]" />
            <h2 className="text-lg font-semibold text-[#1C1C1C]">Weekly Summary</h2>
          </div>
          <p className="text-sm text-[#1C1C1C] leading-relaxed">
            This week: <span className="font-semibold">{weekLeads}</span> leads sourced,{' '}
            <span className="font-semibold">{weekContacted}</span> contacted,{' '}
            <span className="font-semibold">{weekReplied}</span> replied,{' '}
            <span className="font-semibold">{weekBooked}</span> calls booked.
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { label: 'Sourced', value: weekLeads },
              { label: 'Contacted', value: weekContacted },
              { label: 'Replied', value: weekReplied },
              { label: 'Booked', value: weekBooked },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xl font-bold text-[#B07A45]">{item.value}</p>
                <p className="text-xs text-[#7A746C]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email Activity Feed */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[#B07A45]" />
            <h2 className="text-lg font-semibold text-[#1C1C1C]">Recent Email Activity</h2>
          </div>
          {recentEmails.length === 0 ? (
            <p className="text-sm text-[#7A746C]">No emails sent yet</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentEmails.map((email, idx) => (
                <div
                  key={email.id || idx}
                  className="flex items-start gap-3 p-3 bg-[#F4EFE8] rounded-lg"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#B07A45] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[#1C1C1C] truncate">
                        {email.leadName || email.leadEmail}
                      </p>
                      <span
                        className={`text-xs font-medium capitalize ${
                          statusColors[email.status || ''] || 'text-[#7A746C]'
                        }`}
                      >
                        {email.status || 'unknown'}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A746C] truncate mt-0.5">
                      {email.subject || 'No subject'}
                    </p>
                    <p className="text-xs text-[#A39B90] mt-0.5">
                      {email.sent_at
                        ? new Date(email.sent_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
