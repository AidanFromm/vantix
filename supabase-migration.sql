-- VANTIX DASHBOARD - SUPABASE MIGRATION
-- Run this in Supabase SQL Editor (obprrtqyzpaudfeyftyd.supabase.co)
-- February 18, 2026

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE project_status AS ENUM ('ideas', 'in_progress', 'review', 'shipped', 'maintenance');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
CREATE TYPE expense_type AS ENUM ('one_time', 'subscription');
CREATE TYPE expense_category AS ENUM ('api', 'hosting', 'domain', 'subscription', 'hardware', 'contractor', 'marketing', 'other');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document', 'other');
CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'lead', 'invoice', 'system');

-- ============================================
-- TEAM MEMBERS
-- ============================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  avatar_url TEXT,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENTS
-- ============================================
CREATE TABLE clients (
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

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE projects (
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

-- ============================================
-- TASKS
-- ============================================
CREATE TABLE tasks (
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

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE invoices (
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

-- ============================================
-- INVOICE LINE ITEMS
-- ============================================
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  rate DECIMAL(10,2) DEFAULT 0,
  amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT DEFAULT 'zelle',
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expenses (
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

-- ============================================
-- LEADS
-- ============================================
CREATE TABLE leads (
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

-- ============================================
-- BOOKINGS (from landing page)
-- ============================================
CREATE TABLE bookings (
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

-- ============================================
-- MEDIA LIBRARY
-- ============================================
CREATE TABLE media (
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

-- ============================================
-- PROPOSALS
-- ============================================
CREATE TABLE proposals (
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

-- ============================================
-- EMAIL TEMPLATES
-- ============================================
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'custom',
  subject TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNICATIONS LOG
-- ============================================
CREATE TABLE communications (
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

-- ============================================
-- ACTIVITIES / AUDIT LOG
-- ============================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  details TEXT,
  user_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT,
  type notification_type DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CALENDAR EVENTS
-- ============================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'meeting',
  date DATE NOT NULL,
  time TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- KNOWLEDGE BASE
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  body TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_media_project ON media(project_id);
CREATE INDEX idx_media_client ON media(client_id);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_communications_client ON communications(client_id);

-- ============================================
-- RLS POLICIES (permissive for now - team only)
-- ============================================
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (tighten later)
CREATE POLICY "auth_full_access" ON team_members FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON clients FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON projects FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON tasks FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON invoices FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON invoice_items FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON payments FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON expenses FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON leads FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON bookings FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON media FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON proposals FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON email_templates FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON communications FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON activities FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON notifications FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON calendar_events FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON articles FOR ALL USING (true);
CREATE POLICY "auth_full_access" ON settings FOR ALL USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Team
INSERT INTO team_members (id, name, email, role, is_ai) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Kyle', 'kyle.ventura@gmail.com', 'admin', false),
  ('a1000000-0000-0000-0000-000000000002', 'Aidan', 'aidanfromm@gmail.com', 'admin', false),
  ('a1000000-0000-0000-0000-000000000003', 'Vantix AI', 'usevantix@gmail.com', 'ai_assistant', true),
  ('a1000000-0000-0000-0000-000000000004', 'Botskii AI', null, 'ai_assistant', true);

-- Clients
INSERT INTO clients (id, name, company, email, phone, status, health_score, tags) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Dave', 'SecuredTampa', 'securedtampa.llc@gmail.com', '(813) 943-2777', 'active', 85, ARRAY['sneakers', 'pokemon', 'ecommerce']),
  ('c1000000-0000-0000-0000-000000000002', 'Kyle', 'Just Four Kicks', 'justfourkicks.llc@gmail.com', '(908) 498-7753', 'active', 95, ARRAY['wholesale', 'b2b', 'internal']);

-- Projects
INSERT INTO projects (id, client_id, name, description, status, budget, spent, progress, start_date) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'SecuredTampa E-Commerce Platform', 'Custom sneaker/Pokemon e-commerce + inventory management platform. Replaces Shopify. 122 pages, Clover POS integrated.', 'shipped', 4500.00, 4050.00, 100, '2026-01-28'),
  ('p1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Just Four Kicks Platform', 'B2B wholesale sneaker platform. Internal project with Kyle. Ongoing maintenance and feature development.', 'maintenance', 0, 0, 100, '2026-02-07');

-- Invoices
INSERT INTO invoices (id, client_id, project_id, invoice_number, status, amount, due_date, paid_date) VALUES
  ('i1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'INV-001', 'paid', 2000.00, '2026-02-01', '2026-02-01'),
  ('i1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'INV-002', 'sent', 2500.00, '2026-03-01', null);

-- Invoice Items
INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount) VALUES
  ('i1000000-0000-0000-0000-000000000001', 'SecuredTampa Platform - Initial Payment', 1, 2000.00, 2000.00),
  ('i1000000-0000-0000-0000-000000000002', 'SecuredTampa Platform - Final Payment (on delivery)', 1, 2500.00, 2500.00);

-- Payment
INSERT INTO payments (client_id, invoice_id, amount, method, date, notes) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'i1000000-0000-0000-0000-000000000001', 2000.00, 'zelle', '2026-02-01', 'Initial payment from Dave');

-- Default email templates
INSERT INTO email_templates (name, category, subject, body) VALUES
  ('Welcome', 'onboarding', 'Welcome to Vantix - Let''s Build Something Great', 'Hi {{client_name}},\n\nWelcome to Vantix! We''re excited to start working with you.\n\nNext steps:\n1. We''ll schedule a kickoff call\n2. Share access to your project dashboard\n3. Begin building your AI-powered solution\n\nQuestions? Call us at (908) 498-7753.\n\nBest,\nThe Vantix Team'),
  ('Invoice', 'billing', 'Invoice {{invoice_number}} from Vantix', 'Hi {{client_name}},\n\nPlease find your invoice {{invoice_number}} for ${{amount}}.\n\nDue date: {{due_date}}\n\nPayment methods:\n- Zelle: usevantix@gmail.com\n- Wire transfer (details on request)\n\nThank you for your business.\n\nBest,\nVantix'),
  ('Follow Up', 'sales', 'Following Up - Vantix AI Consultation', 'Hi {{client_name}},\n\nJust following up on our conversation about automating your business with AI.\n\nWe''d love to show you exactly how we can help. Book a free 30-minute consultation:\nhttps://usevantix.com/#booking\n\nBest,\nThe Vantix Team'),
  ('Project Update', 'project', 'Project Update: {{project_name}}', 'Hi {{client_name}},\n\nHere''s a quick update on your project:\n\n{{update_details}}\n\nProgress: {{progress}}%\n\nQuestions? Reply to this email or call (908) 498-7753.\n\nBest,\nVantix'),
  ('Payment Reminder', 'billing', 'Payment Reminder - Invoice {{invoice_number}}', 'Hi {{client_name}},\n\nThis is a friendly reminder that invoice {{invoice_number}} for ${{amount}} is due on {{due_date}}.\n\nPayment methods:\n- Zelle: usevantix@gmail.com\n- Wire transfer (details on request)\n\nThank you!\nVantix');

-- Initial notification
INSERT INTO notifications (title, message, type) VALUES
  ('Dashboard is live', 'Welcome to the Vantix command center. All systems operational.', 'system');
