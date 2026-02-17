// Vantix Dashboard Types

export type ClientStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'unqualified' | 'nurture';
export type ProjectStatus = 'lead' | 'proposal' | 'active' | 'on-hold' | 'review' | 'complete' | 'archived';
export type ProjectHealth = 'green' | 'yellow' | 'red';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type TeamMemberType = 'human' | 'bot';
export type Assignee = 'botskii' | 'vantix_bot' | 'aidan' | 'kyle' | 'together';

export interface Client {
  id: string;
  name: string;
  type: 'company' | 'individual';
  
  // Primary contact
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_role?: string;
  
  // Business details
  industry?: string;
  company_size?: string;
  website?: string;
  
  // Relationship
  status: ClientStatus;
  client_since?: string;
  
  // Value
  contract_value: number;
  lifetime_value: number;
  payment_terms?: string;
  
  // Source
  lead_source?: string;
  referred_by?: string;
  
  // Organization
  tags: string[];
  assigned_to?: string;
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  
  // Identity
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  
  // Pipeline
  status: LeadStatus;
  source?: string;
  assigned_to?: string;
  
  // Value
  estimated_value?: number;
  score: number;
  
  // Qualification (BANT)
  budget?: string;
  authority?: string;
  need?: string;
  timeline?: string;
  
  // Context
  notes?: string;
  tags: string[];
  
  // Timing
  last_contacted_at?: string;
  next_follow_up_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_id?: string;
  
  // Status
  status: ProjectStatus;
  health: ProjectHealth;
  
  // Timeline & Budget
  deadline?: string;
  budget?: number;
  spent: number;
  progress: number;
  
  // Assignment
  owner?: string;
  assigned_to?: Assignee;
  
  // Details
  description?: string;
  tags: string[];
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  client?: Client;
}

export interface Invoice {
  id: string;
  invoice_number?: string;
  client_id?: string;
  project_id?: string;
  
  items?: unknown[];
  subtotal?: number;
  tax?: number;
  total: number;
  paid?: number;
  amount?: number; // legacy alias
  
  due_date?: string;
  paid_at?: string;
  paid_date?: string; // legacy alias
  
  status: InvoiceStatus;
  notes?: string;
  
  created_at: string;
  
  // Joined data
  client?: Client;
  project?: Project;
}

export interface Expense {
  id: string;
  amount: number;
  category?: string;
  vendor?: string;
  description?: string;
  expense_date: string;
  project_id?: string;
  created_at: string;
  // Subscription fields (stored in Supabase once migrated, localStorage fallback)
  expense_type?: 'one-time' | 'subscription';
  billing_cycle?: 'monthly' | 'quarterly' | 'yearly';
  next_due_date?: string;
  company_name?: string;
}

export interface SubscriptionMeta {
  expense_id: string;
  expense_type: 'subscription';
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  next_due_date: string;
  company_name: string;
  amount: number;
  category?: string;
  description?: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  
  client_id?: string;
  project_id?: string;
  lead_id?: string;
  
  created_by?: string;
  created_at: string;
  
  // Joined data
  client?: Client;
  project?: Project;
  lead?: Lead;
}

export interface ScrapedLead {
  id: string;
  business_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  
  search_query?: string;
  search_location?: string;
  
  status: 'new' | 'added_to_leads' | 'ignored';
  lead_id?: string;
  
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
  type: TeamMemberType;
  avatar_url?: string;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingInvoices: number;
  outstandingAmount: number;
  activeProjects: number;
  activeClients: number;
  newLeads: number;
}

// Lead Pipeline Stage Config
export const LEAD_STAGES: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'new', label: 'New', color: 'bg-blue-500' },
  { status: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { status: 'qualified', label: 'Qualified', color: 'bg-amber-500' },
  { status: 'proposal', label: 'Proposal', color: 'bg-orange-500' },
  { status: 'won', label: 'Won', color: 'bg-emerald-500' },
  { status: 'lost', label: 'Lost', color: 'bg-red-500' },
];

// Project Pipeline Stage Config
export const PROJECT_STAGES: { status: ProjectStatus; label: string; color: string }[] = [
  { status: 'lead', label: 'Lead', color: 'bg-blue-500' },
  { status: 'proposal', label: 'Proposal', color: 'bg-purple-500' },
  { status: 'active', label: 'Active', color: 'bg-emerald-500' },
  { status: 'review', label: 'Review', color: 'bg-amber-500' },
  { status: 'complete', label: 'Complete', color: 'bg-teal-500' },
];

// Assignee Config (for bot filters)
export const ASSIGNEES: { id: Assignee; name: string; type: 'human' | 'bot'; emoji: string }[] = [
  { id: 'botskii', name: 'Botskii', type: 'bot', emoji: '🤖' },
  { id: 'vantix_bot', name: 'Vantix Bot', type: 'bot', emoji: '🤖' },
  { id: 'aidan', name: 'Aidan', type: 'human', emoji: '👤' },
  { id: 'kyle', name: 'Kyle', type: 'human', emoji: '👤' },
  { id: 'together', name: 'Together', type: 'human', emoji: '👥' },
];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  'Software & Subscriptions',
  'Equipment & Hardware',
  'Professional Services',
  'Marketing & Advertising',
  'Contractor/Freelancer',
  'Travel & Meals',
  'Office Supplies',
  'Professional Development',
  'Insurance & Fees',
  'Other',
];

// Lead Sources
export const LEAD_SOURCES = [
  'Referral',
  'Website Form',
  'Cold Outreach',
  'Social Media',
  'Paid Ads',
  'Event',
  'Directory',
  'Partner',
  'Other',
];
