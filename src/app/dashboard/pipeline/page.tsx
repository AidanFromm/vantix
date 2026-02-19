'use client';

import { useState, useEffect } from 'react';
import { GitPullRequest, ArrowRight, Plus, MoreHorizontal } from 'lucide-react';
import { getData } from '@/lib/data';
import Link from 'next/link';

interface Lead {
  id: string;
  name?: string;
  company?: string;
  stage?: string;
  status?: string;
  value?: number;
  email?: string;
  score?: number;
}

const stages = ['new', 'contacted', 'qualified', 'proposal', 'won'] as const;
const stageLabels: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', proposal: 'Proposal', won: 'Won',
};

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData<Lead>('leads');
        setLeads(data);
      } catch { setLeads([]); }
      setLoading(false);
    })();
  }, []);

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      new: 'border-[#7A746C]',
      contacted: 'border-[#B07A45]/50',
      qualified: 'border-[#8E5E34]',
      proposal: 'border-[#6B4226]',
      won: 'border-green-500',
    };
    return colors[stage] || 'border-[#E3D9CD]';
  };

  const getLeadsForStage = (stage: string) =>
    leads.filter(l => (l.stage || l.status) === stage);

  const totalValue = leads.reduce((s, l) => s + (l.value || 0), 0);

  if (loading) return <div className="min-h-screen bg-[#F4EFE8] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#B07A45] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-[#F4EFE8]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Sales Pipeline</h1>
          <p className="text-sm text-[#7A746C] mt-1">{leads.length} leads · ${totalValue.toLocaleString()} total value</p>
        </div>
        <Link href="/dashboard/leads" className="px-4 py-2 bg-[#B07A45] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#8E5E34] transition-colors">
          <Plus size={16} />
          Manage Leads
        </Link>
      </div>

      {/* Pipeline visualization */}
      <div className="flex items-center justify-center gap-2 py-4">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-lg border-2 ${getStageColor(stage)} bg-[#EEE6DC]`}>
              <span className="text-sm font-medium text-[#1C1C1C]">{stageLabels[stage]}</span>
              <span className="ml-2 text-xs text-[#7A746C]">
                ({getLeadsForStage(stage).length})
              </span>
            </div>
            {i < stages.length - 1 && <ArrowRight size={16} className="text-[#7A746C]" />}
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {stages.map(stage => {
          const stageLeads = getLeadsForStage(stage);
          return (
            <div key={stage} className="min-w-[200px]">
              <div className={`border-t-2 ${getStageColor(stage)} bg-[#EEE6DC] rounded-xl p-3`}>
                <h3 className="font-medium text-[#1C1C1C] mb-3 flex items-center justify-between">
                  {stageLabels[stage]}
                  <span className="text-xs text-[#7A746C] bg-[#F4EFE8] px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white border border-[#E3D9CD] rounded-lg p-3 hover:border-[#B07A45]/50 transition-colors"
                    >
                      <p className="font-medium text-sm text-[#1C1C1C]">{lead.name}</p>
                      {lead.company && <p className="text-xs text-[#7A746C] mt-1">{lead.company}</p>}
                      <div className="flex items-center justify-between mt-2">
                        {lead.score != null && (
                          <span className="text-xs text-[#7A746C]">Score: {lead.score}</span>
                        )}
                        {lead.value != null && lead.value > 0 && (
                          <span className="text-xs font-medium text-[#B07A45]">${lead.value.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center py-6 text-xs text-[#7A746C]">No leads</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
