'use client';

import { useState, useEffect, useMemo } from 'react';
import { CreditCard, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

interface Subscription {
  client_name: string;
  project_name: string;
  monthly_recurring: number;
  status: string;
  start_date: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: projects } = await supabase.from('projects').select('*');
        const { data: clients } = await supabase.from('clients').select('id, company_name');

        const clientMap: Record<string, string> = {};
        (clients || []).forEach((c: { id: string; company_name: string }) => {
          clientMap[c.id] = c.company_name;
        });

        const subs = (projects || [])
          .filter((p: { monthly_recurring?: number }) => (p.monthly_recurring || 0) > 0)
          .map((p: { client_id: string; name?: string; monthly_recurring: number; status?: string; created_at?: string }) => ({
            client_name: clientMap[p.client_id] || 'Unknown',
            project_name: p.name || 'Platform Maintenance',
            monthly_recurring: p.monthly_recurring,
            status: p.status || 'active',
            start_date: p.created_at || '',
          }));

        setSubscriptions(subs);
      } catch {
        setSubscriptions([]);
      }
      setLoading(false);
    })();
  }, []);

  const totalMRR = useMemo(() => subscriptions.reduce((s, sub) => s + sub.monthly_recurring, 0), [subscriptions]);
  const annualProjection = totalMRR * 12;

  if (loading) return <div className="min-h-screen bg-[#F4EFE8]" />;

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-7 h-7 text-[#B07A45]" />
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Subscriptions</h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Monthly Recurring Revenue</span>
              <TrendingUp className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${totalMRR.toLocaleString()}/mo</div>
            <div className="text-xs mt-1 text-[#7A746C]">{subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Annual Projection</span>
              <Calendar className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">${annualProjection.toLocaleString()}/yr</div>
            <div className="text-xs mt-1 text-[#7A746C]">Based on current MRR</div>
          </div>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7A746C]">Active Clients</span>
              <CheckCircle2 className="w-5 h-5 text-[#B07A45]" />
            </div>
            <div className="text-2xl font-bold text-[#1C1C1C]">{subscriptions.length}</div>
            <div className="text-xs mt-1 text-[#7A746C]">Recurring subscriptions</div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3D9CD]">
                {['Client', 'Plan / Project', 'Monthly Amount', 'Status', 'Start Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#7A746C] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#7A746C]">No active subscriptions</td>
                </tr>
              ) : (
                subscriptions.map((sub, i) => (
                  <tr key={i} className="border-b border-[#E3D9CD] last:border-0 hover:bg-[#E3D9CD]/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#1C1C1C]">{sub.client_name}</td>
                    <td className="px-5 py-4 text-sm text-[#4B4B4B]">{sub.project_name}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#1C1C1C]">${sub.monthly_recurring.toLocaleString()}/mo</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-green-600 bg-green-50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4B4B4B]">
                      {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
