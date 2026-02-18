-- VANTIX DASHBOARD - SAFE MIGRATION (won't duplicate existing tables)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard
-- February 18, 2026

-- ============================================
-- ENUMS (safe - IF NOT EXISTS)
-- ============================================
DO $$ BEGIN CREATE TYPE project_status AS ENUM ('ideas', 'in_progress', 'review', 'shipped', 'maintenance'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE expense_type AS ENUM ('one_time', 'subscription'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE expense_category AS ENUM ('api', 'hosting', 'domain', 'subscription', 'hardware', 'contractor', 'marketing', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_type AS ENUM ('image', 'video', 'document', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'lead', 'invoice', 'system'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- TABLES (all use IF NOT EXISTS)
-- ============================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  avatar_url TEXT,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  health_score INTEGER DEFAULT 80,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'ideas',
  budget DECIMAL(10,2) DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status invoice_status DEFAULT 'draft',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  rate DECIMAL(10,2) DEFAULT 0,
  amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT DEFAULT 'zelle',
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category expense_category DEFAULT 'other',
  expense_type expense_type DEFAULT 'one_time',
  vendor TEXT,
  date DATE DEFAULT CURRENT_DATE,
  recurring_interval TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'website',
  stage lead_stage DEFAULT 'new',
  score INTEGER DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_path TEXT,
  type media_type DEFAULT 'image',
  size_bytes BIGINT,
  tags TEXT[] DEFAULT '{}',
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  items JSONB DEFAULT '[]',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'custom',
  subject TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'email',
  direction TEXT DEFAULT 'outbound',
  subject TEXT,
  body TEXT,
  from_email TEXT,
  to_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  details TEXT,
  user_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT,
  type notification_type DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'meeting',
  date DATE NOT NULL,
  time TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  body TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (safe - IF NOT EXISTS)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_media_project ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_media_client ON media(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_communications_client ON communications(client_id);

-- ============================================
-- RLS (enable on all tables, permissive for now)
-- ============================================
DO $$ 
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'team_members','clients','projects','tasks','invoices','invoice_items',
    'payments','expenses','leads','bookings','media','proposals',
    'email_templates','communications','activities','notifications',
    'calendar_events','articles','settings'
  ]) LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY IF NOT EXISTS "allow_all" ON %I FOR ALL USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- ============================================
-- SEED DATA (only insert if tables are empty)
-- ============================================

-- Team members (only if empty)
INSERT INTO team_members (id, name, email, role, is_ai)
SELECT * FROM (VALUES
  ('a1000000-0000-0000-0000-000000000001'::UUID, 'Kyle', 'kyle.ventura@gmail.com', 'admin', false),
  ('a1000000-0000-0000-0000-000000000002'::UUID, 'Aidan', 'aidanfromm@gmail.com', 'admin', false),
  ('a1000000-0000-0000-0000-000000000003'::UUID, 'Vantix AI', 'usevantix@gmail.com', 'ai_assistant', true),
  ('a1000000-0000-0000-0000-000000000004'::UUID, 'Botskii AI', null, 'ai_assistant', true)
) AS v(id, name, email, role, is_ai)
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);

-- Clients (only if empty)
INSERT INTO clients (id, name, company, email, phone, status, health_score, tags)
SELECT * FROM (VALUES
  ('c1000000-0000-0000-0000-000000000001'::UUID, 'Dave', 'SecuredTampa', 'securedtampa.llc@gmail.com', '(813) 943-2777', 'active', 85, ARRAY['sneakers','pokemon','ecommerce']),
  ('c1000000-0000-0000-0000-000000000002'::UUID, 'Kyle', 'Just Four Kicks', 'justfourkicks.llc@gmail.com', '(908) 498-7753', 'active', 95, ARRAY['wholesale','b2b','internal'])
) AS v(id, name, company, email, phone, status, health_score, tags)
WHERE NOT EXISTS (SELECT 1 FROM clients LIMIT 1);

-- Projects (only if empty)
INSERT INTO projects (id, client_id, name, description, status, budget, spent, progress, start_date)
SELECT * FROM (VALUES
  ('p1000000-0000-0000-0000-000000000001'::UUID, 'c1000000-0000-0000-0000-000000000001'::UUID, 'SecuredTampa E-Commerce Platform', 'Custom sneaker/Pokemon e-commerce + inventory management. 122 pages, Clover POS integrated.', 'shipped'::project_status, 4500.00, 4050.00, 100, '2026-01-28'::DATE),
  ('p1000000-0000-0000-0000-000000000002'::UUID, 'c1000000-0000-0000-0000-000000000002'::UUID, 'Just Four Kicks Platform', 'B2B wholesale sneaker platform. Internal project. Ongoing maintenance.', 'maintenance'::project_status, 0.00, 0.00, 100, '2026-02-07'::DATE)
) AS v(id, client_id, name, description, status, budget, spent, progress, start_date)
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);

-- Invoices (only if empty)
INSERT INTO invoices (id, client_id, project_id, invoice_number, status, amount, due_date, paid_date)
SELECT * FROM (VALUES
  ('i1000000-0000-0000-0000-000000000001'::UUID, 'c1000000-0000-0000-0000-000000000001'::UUID, 'p1000000-0000-0000-0000-000000000001'::UUID, 'INV-001', 'paid'::invoice_status, 2000.00, '2026-02-01'::DATE, '2026-02-01'::DATE),
  ('i1000000-0000-0000-0000-000000000002'::UUID, 'c1000000-0000-0000-0000-000000000001'::UUID, 'p1000000-0000-0000-0000-000000000001'::UUID, 'INV-002', 'sent'::invoice_status, 2500.00, '2026-03-01'::DATE, NULL::DATE)
) AS v(id, client_id, project_id, invoice_number, status, amount, due_date, paid_date)
WHERE NOT EXISTS (SELECT 1 FROM invoices LIMIT 1);

-- Payment (only if empty)
INSERT INTO payments (client_id, invoice_id, amount, method, date, notes)
SELECT 'c1000000-0000-0000-0000-000000000001'::UUID, 'i1000000-0000-0000-0000-000000000001'::UUID, 2000.00, 'zelle', '2026-02-01'::DATE, 'Initial payment from Dave'
WHERE NOT EXISTS (SELECT 1 FROM payments LIMIT 1);

-- Email templates (only if empty)
INSERT INTO email_templates (name, category, subject, body)
SELECT * FROM (VALUES
  ('Welcome', 'onboarding', 'Welcome to Vantix', 'Hi {{client_name}},

Welcome to Vantix! We are excited to start working with you.

Next steps:
1. We will schedule a kickoff call
2. Share access to your project dashboard
3. Begin building your AI-powered solution

Questions? Call us at (908) 498-7753.

Best,
The Vantix Team'),
  ('Invoice', 'billing', 'Invoice {{invoice_number}} from Vantix', 'Hi {{client_name}},

Please find your invoice {{invoice_number}} for ${{amount}}.

Due date: {{due_date}}

Payment methods:
- Zelle: usevantix@gmail.com
- Wire transfer (details on request)

Thank you for your business.

Best,
Vantix'),
  ('Follow Up', 'sales', 'Following Up - Vantix AI Consultation', 'Hi {{client_name}},

Just following up on our conversation about automating your business with AI.

Book a free 30-minute consultation:
https://www.usevantix.com/#booking

Best,
The Vantix Team'),
  ('Payment Reminder', 'billing', 'Payment Reminder - Invoice {{invoice_number}}', 'Hi {{client_name}},

Friendly reminder that invoice {{invoice_number}} for ${{amount}} is due on {{due_date}}.

Payment methods:
- Zelle: usevantix@gmail.com
- Wire transfer (details on request)

Thank you!
Vantix')
) AS v(name, category, subject, body)
WHERE NOT EXISTS (SELECT 1 FROM email_templates LIMIT 1);

-- Welcome notification
INSERT INTO notifications (title, message, type)
SELECT 'Dashboard is live', 'Welcome to the Vantix command center. All systems operational.', 'system'::notification_type
WHERE NOT EXISTS (SELECT 1 FROM notifications LIMIT 1);
