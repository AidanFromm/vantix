-- Vantix Dashboard Migration
-- Generated: 2026-02-17

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  type TEXT CHECK (type IN ('human', 'ai')) DEFAULT 'human',
  avatar_url TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  company TEXT,
  website TEXT,
  industry TEXT,
  status TEXT CHECK (status IN ('lead', 'prospect', 'active', 'completed', 'churned')) DEFAULT 'lead',
  source TEXT,
  notes TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,
  industry TEXT,
  city TEXT,
  state TEXT,
  score INT CHECK (score >= 0 AND score <= 100) DEFAULT 0,
  status TEXT CHECK (status IN ('new', 'contacted', 'replied', 'qualified', 'converted', 'dead')) DEFAULT 'new',
  source TEXT,
  notes TEXT,
  last_contacted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('discovery', 'proposal', 'active', 'review', 'completed', 'cancelled')) DEFAULT 'discovery',
  type TEXT,
  budget NUMERIC(12,2) DEFAULT 0,
  paid NUMERIC(12,2) DEFAULT 0,
  start_date DATE,
  deadline DATE,
  completed_at TIMESTAMPTZ,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  items JSONB DEFAULT '[]',
  subtotal NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  paid NUMERIC(12,2) DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT,
  description TEXT,
  amount NUMERIC(12,2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  vendor TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  scope TEXT,
  deliverables JSONB DEFAULT '[]',
  timeline TEXT,
  price NUMERIC(12,2) DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected')) DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  document_url TEXT,
  status TEXT CHECK (status IN ('draft', 'sent', 'signed', 'expired')) DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT CHECK (assignee IN ('kyle', 'aidan', 'vantix', 'botskii')),
  status TEXT CHECK (status IN ('todo', 'in_progress', 'review', 'done')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  template TEXT,
  status TEXT CHECK (status IN ('draft', 'sending', 'sent', 'paused')) DEFAULT 'draft',
  total_sent INT DEFAULT 0,
  total_opened INT DEFAULT 0,
  total_replied INT DEFAULT 0,
  total_bounced INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('project_fee', 'maintenance', 'consultation', 'upsell')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  received_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chat_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  conversation JSONB DEFAULT '[]',
  interested_in TEXT,
  qualified BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE site_monitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  name TEXT,
  status TEXT CHECK (status IN ('up', 'down', 'degraded')) DEFAULT 'up',
  response_time_ms INT,
  last_check TIMESTAMPTZ,
  uptime_percent NUMERIC(5,2) DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE scraped_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  city TEXT,
  state TEXT,
  source TEXT,
  score INT CHECK (score >= 0 AND score <= 100) DEFAULT 0,
  status TEXT CHECK (status IN ('new', 'verified', 'sent', 'replied', 'dead')) DEFAULT 'new',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_client_id ON activities(client_id);
CREATE INDEX idx_revenue_client_id ON revenue(client_id);
CREATE INDEX idx_revenue_received_at ON revenue(received_at);
CREATE INDEX idx_chat_leads_created_at ON chat_leads(created_at);
CREATE INDEX idx_scraped_leads_status ON scraped_leads(status);
CREATE INDEX idx_scraped_leads_created_at ON scraped_leads(created_at);
CREATE INDEX idx_site_monitors_status ON site_monitors(status);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_leads ENABLE ROW LEVEL SECURITY;

-- Authenticated users get full access (tighten later)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'team_members','clients','leads','projects','invoices','expenses',
    'proposals','contracts','tasks','email_campaigns','activities',
    'revenue','chat_leads','site_monitors','scraped_leads'
  ] LOOP
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t || '_auth_all', t);
  END LOOP;
END;
$$;

-- ============================================
-- SEED DATA
-- ============================================

-- Team members
INSERT INTO team_members (name, email, role, type, status) VALUES
  ('Kyle Ventura', 'kyle.ventura@gmail.com', 'Founder & AI Architect', 'human', 'active'),
  ('Aidan Fromm', 'aidanfromm27@gmail.com', 'Co-Founder & Technical Lead', 'human', 'active'),
  ('Vantix AI', 'usevantix@gmail.com', 'AI Operations', 'ai', 'active'),
  ('Botskii', 'botskii@vantix.com', 'AI Development', 'ai', 'active');

-- Dave (first client)
INSERT INTO clients (id, name, contact_email, contact_phone, company, website, industry, status, source)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Dave', 'securedtampa.llc@gmail.com', '(813) 943-2777',
  'Secured Tampa', 'securedtampa.com', 'Retail', 'active', 'referral'
);

-- Dave's project
INSERT INTO projects (client_id, name, status, type, budget, paid)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Secured Tampa E-Commerce Platform', 'active', 'ecommerce', 4500, 2000
);
