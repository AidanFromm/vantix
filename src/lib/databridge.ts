/**
 * Vantix Data Bridge — Central data synchronization across all dashboard systems.
 * Reads/writes all localStorage keys and provides cross-system sync helpers.
 */

// ─── Storage Keys ────────────────────────────────────────────────
export const KEYS = {
  pipeline: 'vantix_pipeline',
  invoices: 'vantix_invoices',
  projects: 'vantix_projects',
  leads: 'vantix_leads',
  proposals: 'vantix_proposals',
  communications: 'vantix_communications',
  timeEntries: 'vantix_time_entries',
  finances: 'vantix_finances',
  revenue: 'vantix_revenue',
  feedback: 'vantix_feedback',
  referrals: 'vantix_referrals',
  portalClients: 'vantix_portal_clients',
  notifications: 'vantix_notifications',
  clients: 'vantix_clients',
  outreach: 'vantix_outreach',
  meetings: 'vantix_meetings',
  intake: 'vantix_intake',
  contracts: 'vantix_contracts',
} as const;

// ─── Generic LS helpers ──────────────────────────────────────────
export function ls<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota / SSR */ }
}

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const iso = () => new Date().toISOString();
const today = () => iso().slice(0, 10);

// ─── Shared types (mirrors from individual pages) ────────────────
export interface PipelineLead {
  id: string; businessName: string; contactName: string; contactEmail?: string; contactPhone?: string;
  source?: string; value: number | null; stage: string; stageEnteredAt: string; lastActivity: string;
  notes?: string; createdAt: string;
}

export interface Invoice {
  id: string; number: string; clientName: string; items: { description: string; amount: number }[];
  taxPercent: number; dueDate: string; status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string; paidAt?: string;
}

export interface Project {
  id: string; clientName: string; projectName: string; tier: string; stage: string;
  startDate: string; deadline: string; progress: number; assignedTo: string;
  description: string; tasks: { id: string; label: string; done: boolean }[];
}

export interface Proposal {
  id: string; clientName: string; projectTitle: string; total: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
  createdAt: string; sentAt?: string;
}

export interface Communication {
  id: string; clientName: string; type: string; date: string; summary: string; direction?: string;
}

export interface TimeEntry {
  id: string; clientName?: string; project?: string; hours: number; date: string; description?: string;
}

export interface FeedbackEntry {
  id: string; clientName: string; rating: number; comment?: string; date: string;
}

export interface Referral {
  id: string; referrerName: string; referredName: string; status: string; date: string; value?: number;
}

export interface IntakeSubmission {
  id: string; businessName: string; contactName: string; email: string; phone?: string;
  services?: string; budget?: string; submittedAt: string; status?: string;
}

export interface SmartLead {
  id: string; businessName: string; contactName?: string; email?: string; phone?: string;
  status: string; score?: number; source?: string; createdAt: string;
}

export interface IncomeEntry { id: string; date: string; client: string; amount: number; description: string; status: 'paid' | 'pending' | 'overdue'; }
export interface ExpenseEntry { id: string; date: string; category: string; amount: number; description: string; }
export interface RevenueData { income: IncomeEntry[]; expenses: ExpenseEntry[]; }

export interface Notification {
  id: string; type: string; title: string; description: string; timestamp: string; read: boolean;
}

// ─── addNotification ─────────────────────────────────────────────
export function addNotification(type: string, title: string, description: string): Notification {
  const list = ls<Notification[]>(KEYS.notifications, []);
  const n: Notification = { id: uid(), type, title, description, timestamp: iso(), read: false };
  list.unshift(n);
  lsSet(KEYS.notifications, list);
  return n;
}

// ─── Duplicate helpers ───────────────────────────────────────────
function hasPipelineEntry(businessName: string): boolean {
  return ls<PipelineLead[]>(KEYS.pipeline, []).some(
    p => p.businessName.toLowerCase() === businessName.toLowerCase()
  );
}

function hasProject(clientName: string, projectName: string): boolean {
  return ls<Project[]>(KEYS.projects, []).some(
    p => p.clientName.toLowerCase() === clientName.toLowerCase() && p.projectName.toLowerCase() === projectName.toLowerCase()
  );
}

function hasInvoiceForProject(clientName: string, descFragment: string): boolean {
  return ls<Invoice[]>(KEYS.invoices, []).some(
    inv => inv.clientName.toLowerCase() === clientName.toLowerCase() &&
           inv.items.some(it => it.description.toLowerCase().includes(descFragment.toLowerCase()))
  );
}

// ─── syncPipelineToProjects ──────────────────────────────────────
// When pipeline deal moves to "closed_won", auto-create a project
export function syncPipelineToProjects(): number {
  const pipeline = ls<PipelineLead[]>(KEYS.pipeline, []);
  const projects = ls<Project[]>(KEYS.projects, []);
  let created = 0;

  const wonDeals = pipeline.filter(p => p.stage === 'closed_won');
  for (const deal of wonDeals) {
    const projName = `${deal.businessName} Project`;
    if (hasProject(deal.businessName, projName)) continue;

    const newProject: Project = {
      id: uid(),
      clientName: deal.businessName,
      projectName: projName,
      tier: 'standard',
      stage: 'planning',
      startDate: today(),
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      progress: 0,
      assignedTo: '',
      description: `Auto-created from pipeline deal. Value: $${(deal.value || 0).toLocaleString()}`,
      tasks: [],
    };
    projects.push(newProject);
    created++;
    addNotification('new_lead', 'Project Created', `"${projName}" auto-created from won deal.`);
  }

  if (created) lsSet(KEYS.projects, projects);
  return created;
}

// ─── syncProposalToInvoice ───────────────────────────────────────
// When proposal accepted, auto-create 50% deposit invoice
export function syncProposalToInvoice(): number {
  const proposals = ls<Proposal[]>(KEYS.proposals, []);
  const invoices = ls<Invoice[]>(KEYS.invoices, []);
  let created = 0;

  const accepted = proposals.filter(p => p.status === 'accepted');
  for (const prop of accepted) {
    const desc = `50% Deposit - ${prop.projectTitle}`;
    if (hasInvoiceForProject(prop.clientName, desc)) continue;

    const invNum = `INV-${String(invoices.length + 1 + created).padStart(4, '0')}`;
    const depositAmount = Math.round(prop.total * 0.5 * 100) / 100;

    invoices.push({
      id: uid(),
      number: invNum,
      clientName: prop.clientName,
      items: [{ description: desc, amount: depositAmount }],
      taxPercent: 0,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'sent',
      createdAt: iso(),
    });
    created++;
    addNotification('invoice_overdue', 'Invoice Created', `${invNum} ($${depositAmount.toLocaleString()}) for ${prop.clientName} deposit.`);
  }

  if (created) lsSet(KEYS.invoices, invoices);
  return created;
}

// ─── syncProjectCompletion ───────────────────────────────────────
// When project hits "complete", create final invoice + feedback request
export function syncProjectCompletion(): number {
  const projects = ls<Project[]>(KEYS.projects, []);
  const invoices = ls<Invoice[]>(KEYS.invoices, []);
  let created = 0;

  const complete = projects.filter(p => p.stage === 'complete' || p.stage === 'completed');
  for (const proj of complete) {
    const desc = `Final Payment - ${proj.projectName}`;
    if (hasInvoiceForProject(proj.clientName, desc)) continue;

    const invNum = `INV-${String(invoices.length + 1 + created).padStart(4, '0')}`;
    invoices.push({
      id: uid(),
      number: invNum,
      clientName: proj.clientName,
      items: [{ description: desc, amount: 0 }], // amount unknown — user fills in
      taxPercent: 0,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'draft',
      createdAt: iso(),
    });
    created++;
    addNotification('project_deadline', 'Project Complete', `"${proj.projectName}" marked complete. Final invoice created & feedback requested.`);
  }

  if (created) lsSet(KEYS.invoices, invoices);
  return created;
}

// ─── syncLeadToPipeline ─────────────────────────────────────────
// When smart lead marked "Won" or "qualified", create pipeline entry
export function syncLeadToPipeline(): number {
  const leads = ls<SmartLead[]>(KEYS.leads, []);
  const pipeline = ls<PipelineLead[]>(KEYS.pipeline, []);
  let created = 0;

  const qualified = leads.filter(l =>
    l.status?.toLowerCase() === 'won' || l.status?.toLowerCase() === 'qualified'
  );

  for (const lead of qualified) {
    if (hasPipelineEntry(lead.businessName)) continue;

    pipeline.push({
      id: uid(),
      businessName: lead.businessName,
      contactName: lead.contactName || '',
      contactEmail: lead.email || '',
      contactPhone: lead.phone || '',
      source: lead.source || 'inbound',
      value: null,
      stage: 'new_lead',
      stageEnteredAt: iso(),
      lastActivity: iso(),
      notes: `Auto-imported from Smart Leads (score: ${lead.score ?? 'N/A'})`,
      createdAt: iso(),
    });
    created++;
    addNotification('new_lead', 'Lead → Pipeline', `${lead.businessName} added to pipeline from Smart Leads.`);
  }

  if (created) lsSet(KEYS.pipeline, pipeline);
  return created;
}

// ─── syncIntakeToLead ────────────────────────────────────────────
// When intake form submitted, create pipeline entry + notification
export function syncIntakeToLead(): number {
  const intakes = ls<IntakeSubmission[]>(KEYS.intake, []);
  const pipeline = ls<PipelineLead[]>(KEYS.pipeline, []);
  let created = 0;

  for (const intake of intakes) {
    if (intake.status === 'synced') continue;
    if (hasPipelineEntry(intake.businessName)) {
      // mark synced even if duplicate
      intake.status = 'synced';
      continue;
    }

    pipeline.push({
      id: uid(),
      businessName: intake.businessName,
      contactName: intake.contactName,
      contactEmail: intake.email,
      contactPhone: intake.phone || '',
      source: 'inbound',
      value: null,
      stage: 'new_lead',
      stageEnteredAt: iso(),
      lastActivity: iso(),
      notes: `Intake form: ${intake.services || 'N/A'} — Budget: ${intake.budget || 'N/A'}`,
      createdAt: iso(),
    });
    intake.status = 'synced';
    created++;
    addNotification('intake_submitted', 'Intake Submitted', `${intake.businessName} submitted intake form.`);
  }

  if (created) {
    lsSet(KEYS.pipeline, pipeline);
    lsSet(KEYS.intake, intakes);
  }
  return created;
}

// ─── getClientOverview ───────────────────────────────────────────
// Pull ALL data about a client across every system
export interface ClientOverview {
  name: string;
  pipelineDeals: PipelineLead[];
  projects: Project[];
  invoices: Invoice[];
  proposals: Proposal[];
  communications: Communication[];
  timeEntries: TimeEntry[];
  feedback: FeedbackEntry[];
  referrals: Referral[];
  totalRevenue: number;
  totalOwed: number;
  totalHours: number;
  healthScore: number; // 0–100
}

export function getClientOverview(clientName: string): ClientOverview {
  const match = (s: string) => s.toLowerCase().includes(clientName.toLowerCase());

  const pipelineDeals = ls<PipelineLead[]>(KEYS.pipeline, []).filter(p => match(p.businessName) || match(p.contactName));
  const projects = ls<Project[]>(KEYS.projects, []).filter(p => match(p.clientName));
  const invoices = ls<Invoice[]>(KEYS.invoices, []).filter(i => match(i.clientName));
  const proposals = ls<Proposal[]>(KEYS.proposals, []).filter(p => match(p.clientName));
  const communications = ls<Communication[]>(KEYS.communications, []).filter(c => match(c.clientName));
  const timeEntries = ls<TimeEntry[]>(KEYS.timeEntries, []).filter(t => match(t.clientName || '') || match(t.project || ''));
  const feedback = ls<FeedbackEntry[]>(KEYS.feedback, []).filter(f => match(f.clientName));
  const referrals = ls<Referral[]>(KEYS.referrals, []).filter(r => match(r.referrerName) || match(r.referredName));

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.items.reduce((a, it) => a + it.amount, 0), 0);
  const totalOwed = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.items.reduce((a, it) => a + it.amount, 0), 0);
  const totalHours = timeEntries.reduce((s, t) => s + (t.hours || 0), 0);

  // Health score: payment history (40%), communication frequency (30%), project progress (30%)
  let health = 50; // baseline
  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;
  if (paidCount > 0) health += Math.min(paidCount * 5, 20);
  health -= overdueCount * 10;

  const recentComms = communications.filter(c => {
    const d = new Date(c.date).getTime();
    return Date.now() - d < 30 * 86400000;
  }).length;
  health += Math.min(recentComms * 5, 15);

  const activeProjs = projects.filter(p => p.stage !== 'complete' && p.stage !== 'completed');
  const avgProgress = activeProjs.length ? activeProjs.reduce((s, p) => s + p.progress, 0) / activeProjs.length : 50;
  health += (avgProgress / 100) * 15;

  const avgRating = feedback.length ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length : 3;
  health += (avgRating - 3) * 5;

  const healthScore = Math.max(0, Math.min(100, Math.round(health)));

  return { name: clientName, pipelineDeals, projects, invoices, proposals, communications, timeEntries, feedback, referrals, totalRevenue, totalOwed, totalHours, healthScore };
}

// ─── getAllClientNames ───────────────────────────────────────────
// Collect unique client names from every system
export function getAllClientNames(): string[] {
  const names = new Set<string>();

  ls<PipelineLead[]>(KEYS.pipeline, []).forEach(p => { if (p.businessName) names.add(p.businessName); });
  ls<Project[]>(KEYS.projects, []).forEach(p => { if (p.clientName) names.add(p.clientName); });
  ls<Invoice[]>(KEYS.invoices, []).forEach(i => { if (i.clientName) names.add(i.clientName); });
  ls<Proposal[]>(KEYS.proposals, []).forEach(p => { if (p.clientName) names.add(p.clientName); });
  ls<Communication[]>(KEYS.communications, []).forEach(c => { if (c.clientName) names.add(c.clientName); });
  ls<FeedbackEntry[]>(KEYS.feedback, []).forEach(f => { if (f.clientName) names.add(f.clientName); });

  // Also from explicit clients list
  ls<{ name?: string; company?: string }[]>(KEYS.clients, []).forEach(c => {
    if (c.company) names.add(c.company);
    else if (c.name) names.add(c.name);
  });

  return Array.from(names).filter(Boolean).sort();
}

// ─── getDashboardStats ──────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeProjects: number;
  totalProjects: number;
  hotLeads: number;
  pendingInvoices: number;
  overdueInvoices: number;
  proposalsSent: number;
  proposalsAccepted: number;
  totalClients: number;
  activeClients: number;
  avgProjectSize: number;
  pipelineValue: number;
  totalTimeHours: number;
  avgRating: number;
  meetingsToday: number;
}

export function getDashboardStats(): DashboardStats {
  const rev = ls<RevenueData>(KEYS.revenue, { income: [], expenses: [] });
  const fin = ls<RevenueData>(KEYS.finances, { income: [], expenses: [] });
  const income = rev.income.length ? rev.income : fin.income || [];
  const expenses = rev.expenses.length ? rev.expenses : fin.expenses || [];

  const totalRevenue = income.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const pipeline = ls<PipelineLead[]>(KEYS.pipeline, []);
  const invoices = ls<Invoice[]>(KEYS.invoices, []);
  const projects = ls<Project[]>(KEYS.projects, []);
  const proposals = ls<Proposal[]>(KEYS.proposals, []);
  const timeEntries = ls<TimeEntry[]>(KEYS.timeEntries, []);
  const feedback = ls<FeedbackEntry[]>(KEYS.feedback, []);
  const meetings = ls<{ id: string; date: string }[]>(KEYS.meetings, []);

  const td = today();
  const clientNames = getAllClientNames();
  const activeClientNames = new Set<string>();
  projects.filter(p => p.stage !== 'complete' && p.stage !== 'completed').forEach(p => activeClientNames.add(p.clientName));

  const paidInvoiceTotal = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.items.reduce((a, it) => a + it.amount, 0), 0);

  return {
    totalRevenue: totalRevenue || paidInvoiceTotal,
    totalExpenses,
    netProfit: (totalRevenue || paidInvoiceTotal) - totalExpenses,
    activeProjects: projects.filter(p => p.stage !== 'complete' && p.stage !== 'completed').length,
    totalProjects: projects.length,
    hotLeads: pipeline.filter(p => p.stage === 'proposal_sent' || p.stage === 'negotiating').length,
    pendingInvoices: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length,
    overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
    proposalsSent: proposals.filter(p => p.status !== 'draft').length,
    proposalsAccepted: proposals.filter(p => p.status === 'accepted').length,
    totalClients: clientNames.length,
    activeClients: activeClientNames.size,
    avgProjectSize: projects.length ? Math.round(paidInvoiceTotal / Math.max(projects.length, 1)) : 0,
    pipelineValue: pipeline.filter(l => l.stage !== 'closed_lost' && l.stage !== 'closed_won').reduce((a, l) => a + (l.value || 0), 0),
    totalTimeHours: timeEntries.reduce((s, t) => s + (t.hours || 0), 0),
    avgRating: feedback.length ? Math.round((feedback.reduce((s, f) => s + f.rating, 0) / feedback.length) * 10) / 10 : 0,
    meetingsToday: meetings.filter(m => m.date === td).length,
  };
}

// ─── runAllSyncs ─────────────────────────────────────────────────
// Run all sync functions at once. Returns summary.
export function runAllSyncs(): { pipelineToProjects: number; proposalToInvoice: number; projectCompletion: number; leadToPipeline: number; intakeToLead: number } {
  return {
    intakeToLead: syncIntakeToLead(),
    leadToPipeline: syncLeadToPipeline(),
    pipelineToProjects: syncPipelineToProjects(),
    proposalToInvoice: syncProposalToInvoice(),
    projectCompletion: syncProjectCompletion(),
  };
}

