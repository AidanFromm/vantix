-- Vantix Dashboard Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- CLIENTS
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'company' CHECK (type IN ('company', 'individual')),
  
  -- Primary contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_role TEXT,
  
  -- Business details
  industry TEXT,
  company_size TEXT,
  website TEXT,
  
  -- Relationship
  status TEXT DEFAULT 'active' CHECK (status IN ('lead', 'prospect', 'active', 'inactive', 'churned')),
  client_since DATE,
  
  -- Value
  contract_value NUMERIC DEFAULT 0,
  lifetime_value NUMERIC DEFAULT 0,
  payment_terms TEXT,
  
  -- Source
  lead_source TEXT,
  referred_by UUID REFERENCES clients(id),
  
  -- Organization
  tags TEXT[] DEFAULT '{}',
  assigned_to TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEADS
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT,
  
  -- Pipeline
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'unqualified', 'nurture')),
  source TEXT,
  assigned_to TEXT,
  
  -- Value
  estimated_value NUMERIC,
  score INTEGER DEFAULT 0,
  
  -- Qualification (BANT)
  budget TEXT,
  authority TEXT,
  need TEXT,
  timeline TEXT,
  
  -- Context
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Timing
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  
  -- Status
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'proposal', 'active', 'on-hold', 'review', 'complete', 'archived')),
  health TEXT DEFAULT 'green' CHECK (health IN ('green', 'yellow', 'red')),
  
  -- Timeline & Budget
  deadline DATE,
  budget NUMERIC,
  spent NUMERIC DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Assignment
  owner TEXT,
  assigned_to TEXT, -- 'botskii' | 'vantix_bot' | 'aidan' | 'kyle' | 'together'
  
  -- Details
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT,
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  
  -- Amounts
  amount NUMERIC NOT NULL,
  
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  amount NUMERIC NOT NULL,
  category TEXT,
  vendor TEXT,
  description TEXT,
  
  expense_date DATE DEFAULT CURRENT_DATE,
  
  -- Optional links
  project_id UUID REFERENCES projects(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY TIMELINE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  type TEXT NOT NULL, -- 'project_update', 'invoice_paid', 'client_added', 'lead_converted', etc.
  title TEXT NOT NULL,
  description TEXT,
  
  -- Links (optional)
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  lead_id UUID REFERENCES leads(id),
  
  -- Who did it
  created_by TEXT, -- 'botskii', 'vantix_bot', 'aidan', 'kyle', 'system'
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL SCRAPER RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS scraped_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  business_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  
  -- Search context
  search_query TEXT,
  search_location TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'added_to_leads', 'ignored')),
  
  -- Link to lead if converted
  lead_id UUID REFERENCES leads(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS (for assignments)
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  role TEXT, -- 'admin', 'member', 'bot'
  type TEXT DEFAULT 'human' CHECK (type IN ('human', 'bot')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default team members
INSERT INTO team_members (name, email, role, type) VALUES
  ('Aidan', 'aidan@vantix.com', 'admin', 'human'),
  ('Kyle', 'kyle@vantix.com', 'admin', 'human'),
  ('Botskii', 'botskii@vantix.com', 'bot', 'bot'),
  ('Vantix Bot', 'vantix-bot@vantix.com', 'bot', 'bot')
ON CONFLICT DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
