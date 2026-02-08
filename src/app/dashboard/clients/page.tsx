'use client';

import { Plus, Mail, Phone, Building, MoreHorizontal, FolderOpen } from 'lucide-react';

const clients = [
  {
    id: '1',
    name: 'Dave',
    company: 'Secured Tampa',
    email: 'dave@securedtampa.com',
    phone: '(813) 555-0123',
    projects: 1,
    status: 'active',
    notes: 'Sneaker & Pokemon store. Needs Clover POS integration.',
  },
  {
    id: '2',
    name: 'Pending Lead',
    company: 'TBD',
    email: 'lead@example.com',
    phone: null,
    projects: 0,
    status: 'prospect',
    notes: 'New inquiry - needs follow up',
  },
];

const statusColors = {
  active: 'bg-green-500/20 text-green-400',
  prospect: 'bg-yellow-500/20 text-yellow-400',
  inactive: 'bg-gray-500/20 text-gray-400',
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-[var(--color-muted)] mt-1">Manage client relationships</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          Add Client
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{client.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[client.status as keyof typeof statusColors]}`}>
                    {client.status}
                  </span>
                </div>
                <p className="text-[var(--color-muted)] flex items-center gap-2 mt-1">
                  <Building size={14} />
                  {client.company}
                </p>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <Mail size={14} />
                  <a href={`mailto:${client.email}`} className="hover:text-white transition-colors">
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <Phone size={14} />
                  {client.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <FolderOpen size={14} />
                {client.projects} project{client.projects !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-muted)]">{client.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
