'use client';

import { useState } from 'react';
import { GitPullRequest, ArrowRight, Plus, MoreHorizontal } from 'lucide-react';

interface PipelineItem {
  id: string;
  title: string;
  description: string;
  stage: 'lead' | 'qualified' | 'meeting' | 'proposal' | 'closed';
  value?: number;
  contact?: string;
}

const mockPipeline: PipelineItem[] = [
  { id: '1', title: 'Secured Tampa (Dave App)', description: 'Sneaker/Pokemon store app — $4,500 total, $2K paid, $2.5K on delivery', stage: 'closed', value: 4500, contact: 'Dave' },
];

const stages = ['lead', 'qualified', 'meeting', 'proposal', 'closed'] as const;

export default function PipelinePage() {
  const [items] = useState<PipelineItem[]>(mockPipeline);

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      lead: 'border-gray-500',
      qualified: 'border-blue-500',
      meeting: 'border-yellow-500',
      proposal: 'border-purple-500',
      closed: 'border-green-500',
    };
    return colors[stage] || 'border-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Track leads through your sales process</p>
        </div>
        <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-[#0d9668] transition-colors">
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {/* Pipeline visualization */}
      <div className="flex items-center justify-center gap-2 py-4">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-lg border-2 ${getStageColor(stage)} bg-[var(--color-card)]`}>
              <span className="text-sm font-medium capitalize">{stage}</span>
              <span className="ml-2 text-xs text-[var(--color-muted)]">
                ({items.filter(item => item.stage === stage).length})
              </span>
            </div>
            {i < stages.length - 1 && <ArrowRight size={16} className="text-[var(--color-muted)]" />}
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {stages.map(stage => (
          <div key={stage} className="min-w-[200px]">
            <div className={`border-t-2 ${getStageColor(stage)} bg-[var(--color-card)] rounded-xl p-3`}>
              <h3 className="font-medium capitalize mb-3 flex items-center justify-between">
                {stage}
                <span className="text-xs text-[var(--color-muted)] bg-white/10 px-2 py-0.5 rounded-full">
                  {items.filter(item => item.stage === stage).length}
                </span>
              </h3>
              <div className="space-y-2">
                {items.filter(item => item.stage === stage).map(item => (
                  <div
                    key={item.id}
                    className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 hover:border-[#10b981]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <MoreHorizontal size={14} className="text-[var(--color-muted)]" />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      {item.contact && (
                        <span className="text-xs text-[var(--color-muted)]">{item.contact}</span>
                      )}
                      {item.value && (
                        <span className="text-xs font-medium text-[#10b981]">${item.value.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
