// Seed data for Vantix Dashboard
// Populates localStorage with realistic data for development

import type {
  Client, Lead, Project, Invoice, Activity, TeamMember,
  Task, Payment, Notification,
} from './types';

function generateId(): string {
  return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function lsSet(key: string, data: unknown[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch { /* noop */ }
}

// Stable IDs for cross-references
const IDS = {
  // Clients
  dave: 'cl-dave-securedtampa',
  jfk: 'cl-jfk-justfourkicks',
  // Projects
  daveWeb: 'pj-dave-website',
  jfkStore: 'pj-jfk-store',
  // Team
  kyle: 'tm-kyle',
  aidan: 'tm-aidan',
  vantixAi: 'tm-vantix-ai',
  botskii: 'tm-botskii-ai',
  // Invoices
  daveInv1: 'inv-dave-001',
  daveInv2: 'inv-dave-002',
};

export function seedDatabase() {
  if (typeof window === 'undefined') return;

  // Check if already seeded
  try {
    const existing = localStorage.getItem('vantix_seed_version');
    if (existing === '2') return; // Already seeded with current version
  } catch { /* continue */ }

  // ---- TEAM MEMBERS ----
  const team: TeamMember[] = [
    {
      id: IDS.kyle, name: 'Kyle Ventura', email: 'kyle@usevantix.com',
      role: 'admin', type: 'human', avatar_url: '', created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: IDS.aidan, name: 'Aidan Ventura', email: 'aidan@usevantix.com',
      role: 'admin', type: 'human', avatar_url: '', created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: IDS.vantixAi, name: 'Vantix AI', email: 'ai@usevantix.com',
      role: 'ai_assistant', type: 'bot', avatar_url: '', created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: IDS.botskii, name: 'Botskii AI', email: 'botskii@usevantix.com',
      role: 'ai_assistant', type: 'bot', avatar_url: '', created_at: '2024-01-01T00:00:00Z',
    },
  ];

  // ---- CLIENTS ----
  const clients: Client[] = [
    {
      id: IDS.dave, name: 'Dave - SecuredTampa', type: 'company',
      contact_name: 'Dave', contact_email: 'dave@securedtampa.com', contact_phone: '813-555-0100',
      industry: 'Security', website: 'https://securedtampa.com',
      status: 'active', client_since: '2024-06-01',
      contract_value: 4500, lifetime_value: 4500, payment_terms: 'Net 30',
      tags: ['security', 'web-design'], assigned_to: 'kyle',
      notes: 'Security camera installation company in Tampa. Website redesign project.',
      created_at: '2024-06-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z',
    },
    {
      id: IDS.jfk, name: 'JFK - Just Four Kicks', type: 'company',
      contact_name: 'Kyle Ventura', contact_email: 'kyle@justfourkicks.store',
      industry: 'E-commerce / Sneakers', website: 'https://justfourkicks.store',
      status: 'active', client_since: '2024-01-01',
      contract_value: 0, lifetime_value: 0, payment_terms: 'Internal',
      tags: ['ecommerce', 'sneakers', 'internal'], assigned_to: 'kyle',
      notes: 'Kyle\'s own sneaker resale business. Ongoing development.',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z',
    },
  ];

  // ---- PROJECTS ----
  const projects: Project[] = [
    {
      id: IDS.daveWeb, name: 'SecuredTampa Website Redesign', client_id: IDS.dave,
      status: 'active', health: 'green',
      deadline: '2025-03-15', budget: 4500, spent: 4050, progress: 90,
      owner: 'kyle', assigned_to: 'kyle',
      description: 'Full website redesign for SecuredTampa security company. Includes new branding, service pages, quote form, and SEO.',
      tags: ['web-design', 'seo'], notes: '90% complete - final review pending',
      created_at: '2024-06-15T00:00:00Z', updated_at: '2025-02-15T00:00:00Z',
    },
    {
      id: IDS.jfkStore, name: 'JFK Storefront Development', client_id: IDS.jfk,
      status: 'active', health: 'green',
      budget: 0, spent: 0, progress: 65,
      owner: 'kyle', assigned_to: 'together',
      description: 'Ongoing development of justfourkicks.store e-commerce platform.',
      tags: ['ecommerce', 'nextjs'], notes: 'Ongoing - no fixed deadline',
      created_at: '2024-01-15T00:00:00Z', updated_at: '2025-02-10T00:00:00Z',
    },
  ];

  // ---- INVOICES ----
  const invoices: Invoice[] = [
    {
      id: IDS.daveInv1, invoice_number: 'VTX-001', client_id: IDS.dave, project_id: IDS.daveWeb,
      items: [
        { description: 'Website Design - Phase 1', quantity: 1, rate: 1200, amount: 1200 },
        { description: 'Development - Phase 1', quantity: 1, rate: 800, amount: 800 },
      ],
      subtotal: 2000, tax: 0, total: 2000, paid: 2000, amount: 2000,
      due_date: '2024-08-01', paid_at: '2024-07-28', paid_date: '2024-07-28',
      status: 'paid', notes: 'Phase 1 - Design and initial development',
      created_at: '2024-07-01T00:00:00Z',
    },
    {
      id: IDS.daveInv2, invoice_number: 'VTX-002', client_id: IDS.dave, project_id: IDS.daveWeb,
      items: [
        { description: 'Development - Phase 2', quantity: 1, rate: 1500, amount: 1500 },
        { description: 'SEO Optimization', quantity: 1, rate: 500, amount: 500 },
        { description: 'Content Writing', quantity: 1, rate: 500, amount: 500 },
      ],
      subtotal: 2500, tax: 0, total: 2500, paid: 0, amount: 2500,
      due_date: '2025-03-01',
      status: 'sent', notes: 'Phase 2 - Final development, SEO, content',
      created_at: '2025-01-15T00:00:00Z',
    },
  ];

  // ---- TASKS ----
  const tasks: Task[] = [
    { id: generateId(), project_id: IDS.daveWeb, assigned_to: 'kyle', title: 'Final design review with Dave', description: 'Review all pages before launch', status: 'in_progress', priority: 'high', due_date: '2025-02-28', created_at: '2025-02-10T00:00:00Z', updated_at: '2025-02-10T00:00:00Z' },
    { id: generateId(), project_id: IDS.daveWeb, assigned_to: 'aidan', title: 'Mobile responsiveness QA', description: 'Test all pages on mobile devices', status: 'todo', priority: 'high', due_date: '2025-03-01', created_at: '2025-02-10T00:00:00Z', updated_at: '2025-02-10T00:00:00Z' },
    { id: generateId(), project_id: IDS.daveWeb, assigned_to: 'vantix_bot', title: 'SEO meta tags audit', description: 'Verify all pages have proper meta tags', status: 'done', priority: 'medium', due_date: '2025-02-15', created_at: '2025-01-20T00:00:00Z', updated_at: '2025-02-14T00:00:00Z' },
    { id: generateId(), project_id: IDS.daveWeb, assigned_to: 'kyle', title: 'Set up contact form submissions', description: 'Connect form to email notification system', status: 'todo', priority: 'medium', due_date: '2025-03-05', created_at: '2025-02-12T00:00:00Z', updated_at: '2025-02-12T00:00:00Z' },
    { id: generateId(), project_id: IDS.jfkStore, assigned_to: 'kyle', title: 'Implement StockX price comparison', description: 'Pull live prices from StockX API', status: 'in_progress', priority: 'high', due_date: '2025-03-10', created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-15T00:00:00Z' },
    { id: generateId(), project_id: IDS.jfkStore, assigned_to: 'aidan', title: 'Product photography upload flow', description: 'Build drag-and-drop image upload for listings', status: 'todo', priority: 'medium', due_date: '2025-03-15', created_at: '2025-02-05T00:00:00Z', updated_at: '2025-02-05T00:00:00Z' },
    { id: generateId(), project_id: IDS.jfkStore, assigned_to: 'botskii', title: 'Automate inventory sync', description: 'Sync inventory counts across platforms', status: 'todo', priority: 'low', due_date: '2025-04-01', created_at: '2025-02-08T00:00:00Z', updated_at: '2025-02-08T00:00:00Z' },
    { id: generateId(), project_id: IDS.daveWeb, assigned_to: 'kyle', title: 'Deploy to production', description: 'Final deployment and DNS switch', status: 'todo', priority: 'high', due_date: '2025-03-15', created_at: '2025-02-15T00:00:00Z', updated_at: '2025-02-15T00:00:00Z' },
  ];

  // ---- PAYMENTS ----
  const payments: Payment[] = [
    { id: generateId(), invoice_id: IDS.daveInv1, amount: 2000, method: 'bank_transfer', date: '2024-07-28', notes: 'Phase 1 payment received', created_at: '2024-07-28T00:00:00Z' },
  ];

  // ---- LEADS ----
  const leads: Lead[] = [
    { id: generateId(), name: 'Mike Rodriguez', email: 'mike@cleanpro-tampa.com', phone: '813-555-0201', company: 'CleanPro Tampa', role: 'Owner', status: 'new', source: 'Cold Outreach', score: 65, tags: ['cleaning', 'local'], notes: 'Commercial cleaning company, needs website', created_at: '2025-02-10T00:00:00Z', updated_at: '2025-02-10T00:00:00Z' },
    { id: generateId(), name: 'Sarah Chen', email: 'sarah@luxnails.co', phone: '813-555-0302', company: 'Lux Nails Studio', role: 'Owner', status: 'contacted', source: 'Referral', score: 78, tags: ['beauty', 'local'], notes: 'Referred by Dave. Wants booking system and website.', created_at: '2025-02-08T00:00:00Z', updated_at: '2025-02-12T00:00:00Z' },
    { id: generateId(), name: 'Tom Bradley', email: 'tom@bradleyroofing.com', phone: '813-555-0403', company: 'Bradley Roofing', role: 'Owner', status: 'qualified', source: 'Website Form', score: 85, estimated_value: 3500, budget: '$3000-5000', need: 'Complete website with lead gen', timeline: '2 months', tags: ['roofing', 'lead-gen'], notes: 'Has budget approved, ready to start', created_at: '2025-02-05T00:00:00Z', updated_at: '2025-02-14T00:00:00Z' },
    { id: generateId(), name: 'Lisa Park', email: 'lisa@parkrealty.com', company: 'Park Realty Group', status: 'proposal', source: 'Social Media', score: 72, estimated_value: 5000, tags: ['real-estate'], notes: 'Wants IDX integration and CRM', created_at: '2025-01-28T00:00:00Z', updated_at: '2025-02-11T00:00:00Z' },
    { id: generateId(), name: 'James Wilson', email: 'james@wilsonplumbing.net', phone: '813-555-0605', company: 'Wilson Plumbing', role: 'Manager', status: 'new', source: 'Directory', score: 55, tags: ['plumbing', 'local'], notes: 'Found via Google Maps scraper', created_at: '2025-02-15T00:00:00Z', updated_at: '2025-02-15T00:00:00Z' },
  ];

  // ---- ACTIVITIES ----
  const activities: Activity[] = [
    { id: generateId(), type: 'invoice_paid', title: 'Invoice VTX-001 paid', description: 'Dave paid $2,000 for Phase 1', client_id: IDS.dave, project_id: IDS.daveWeb, created_by: 'system', created_at: '2024-07-28T00:00:00Z' },
    { id: generateId(), type: 'invoice_sent', title: 'Invoice VTX-002 sent', description: 'Phase 2 invoice for $2,500 sent to Dave', client_id: IDS.dave, project_id: IDS.daveWeb, created_by: 'kyle', created_at: '2025-01-15T00:00:00Z' },
    { id: generateId(), type: 'project_update', title: 'SecuredTampa at 90%', description: 'Website redesign nearing completion', client_id: IDS.dave, project_id: IDS.daveWeb, created_by: 'kyle', created_at: '2025-02-15T00:00:00Z' },
    { id: generateId(), type: 'lead_created', title: 'New lead: Tom Bradley', description: 'Bradley Roofing submitted website form', created_by: 'system', created_at: '2025-02-05T00:00:00Z' },
    { id: generateId(), type: 'lead_qualified', title: 'Tom Bradley qualified', description: 'Budget confirmed at $3,000-5,000', created_by: 'kyle', created_at: '2025-02-14T00:00:00Z' },
  ];

  // ---- NOTIFICATIONS ----
  const notifications: Notification[] = [
    { id: generateId(), title: 'Invoice overdue soon', message: 'VTX-002 for Dave/SecuredTampa ($2,500) is due March 1', type: 'warning', read: false, created_at: '2025-02-17T00:00:00Z' },
    { id: generateId(), title: 'New lead from website', message: 'Tom Bradley from Bradley Roofing submitted a contact form', type: 'info', read: true, created_at: '2025-02-05T00:00:00Z' },
    { id: generateId(), title: 'Project milestone', message: 'SecuredTampa Website Redesign reached 90% completion', type: 'success', read: true, created_at: '2025-02-15T00:00:00Z' },
  ];

  // ---- WRITE TO LOCALSTORAGE ----
  lsSet('vantix_team_members', team);
  lsSet('vantix_clients', clients);
  lsSet('vantix_projects', projects);
  lsSet('vantix_invoices', invoices);
  lsSet('vantix_tasks', tasks);
  lsSet('vantix_payments', payments);
  lsSet('vantix_leads', leads);
  lsSet('vantix_activities', activities);
  lsSet('vantix_notifications', notifications);

  // Mark as seeded
  try {
    localStorage.setItem('vantix_seed_version', '2');
  } catch { /* noop */ }
}

export function resetSeedData() {
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('vantix_'));
    keys.forEach(k => localStorage.removeItem(k));
  } catch { /* noop */ }
  seedDatabase();
}
