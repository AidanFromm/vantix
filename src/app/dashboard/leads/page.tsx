'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Building, 
  MessageSquare, 
  Clock, 
  ChevronDown,
  CheckCircle2,
  Circle,
  UserCheck,
  XCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Lead {
  id: string;
  phone: string;
  business_type: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes?: string;
  created_at: string;
}

const statusConfig = {
  new: { 
    label: 'New', 
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Circle,
  },
  contacted: { 
    label: 'Contacted', 
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Phone,
  },
  qualified: { 
    label: 'Qualified', 
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: UserCheck,
  },
  closed: { 
    label: 'Closed', 
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: XCircle,
  },
};

const businessTypes: Record<string, string> = {
  retail: 'Retail Store',
  ecommerce: 'E-Commerce',
  service: 'Service Business',
  restaurant: 'Restaurant / Food',
  other: 'Other',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(l => l.status === filter);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-[var(--color-muted)] mt-1">
            {leads.length} total • {leads.filter(l => l.status === 'new').length} new
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 bg-white/5 border border-[var(--color-border)] hover:bg-white/10 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'contacted', 'qualified', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-[var(--color-muted)] hover:text-white border border-transparent'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig].label}
            {status !== 'all' && (
              <span className="ml-2 opacity-60">
                {leads.filter(l => l.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-20">
          <RefreshCw size={32} className="animate-spin mx-auto text-[var(--color-muted)]" />
          <p className="text-[var(--color-muted)] mt-4">Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare size={48} className="mx-auto text-[var(--color-muted)] opacity-30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No leads yet</h3>
          <p className="text-[var(--color-muted)]">
            {filter === 'all' 
              ? 'Leads from your contact form will appear here'
              : `No ${filter} leads`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const StatusIcon = statusConfig[lead.status].icon;
            
            return (
              <motion.div
                key={lead.id}
                layout
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Status indicator */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig[lead.status].color}`}>
                        <StatusIcon size={24} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <a 
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xl font-semibold hover:text-blue-400 transition-colors flex items-center gap-2"
                          >
                            {lead.phone}
                            <ExternalLink size={14} className="opacity-50" />
                          </a>
                          <span className={`text-xs px-3 py-1 rounded-full border ${statusConfig[lead.status].color}`}>
                            {statusConfig[lead.status].label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
                          <span className="flex items-center gap-1">
                            <Building size={14} />
                            {businessTypes[lead.business_type] || lead.business_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {getTimeAgo(lead.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="p-2"
                    >
                      <ChevronDown size={20} className="text-[var(--color-muted)]" />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--color-border)]"
                    >
                      <div className="p-6 space-y-4">
                        {/* Message */}
                        <div>
                          <h4 className="text-sm font-medium text-[var(--color-muted)] mb-2">Message</h4>
                          <p className="p-4 rounded-xl bg-white/5 border border-[var(--color-border)]">
                            {lead.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors"
                          >
                            <Phone size={18} />
                            Call
                          </a>
                          <a
                            href={`sms:${lead.phone}`}
                            className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors"
                          >
                            <MessageSquare size={18} />
                            Text
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
