# Vantix Supabase Migration — 10 Chunks
## Copy-paste each chunk into the SQL Editor one at a time

---

## CHUNK 1: Enums (All Types)

```sql
CREATE TYPE client_status AS ENUM ('active', 'inactive', 'churned', 'prospect');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'review', 'delivered', 'maintenance', 'cancelled');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE deliverable_type AS ENUM ('file', 'link', 'document');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'revision_requested');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'void');
CREATE TYPE recurring_interval AS ENUM ('monthly', 'quarterly', 'yearly');
CREATE TYPE payment_method AS ENUM ('stripe', 'cash', 'zelle', 'wire', 'crypto', 'check', 'other');
CREATE TYPE expense_category AS ENUM ('software', 'hosting', 'marketing', 'contractors', 'office', 'travel', 'equipment', 'other');
CREATE TYPE lead_source AS ENUM ('website', 'cal_com', 'referral', 'cold_outreach', 'social_media', 'ai_phone', 'bland_ai', 'other');
CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost');
CREATE TYPE lead_activity_type AS ENUM ('email', 'call', 'meeting', 'note', 'stage_change', 'score_change');
CREATE TYPE insight_type AS ENUM ('recommendation', 'prediction', 'alert', 'analysis');
CREATE TYPE insight_category AS ENUM ('client', 'revenue', 'project', 'lead', 'general');
CREATE TYPE insight_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE email_direction AS ENUM ('outbound', 'inbound');
CREATE TYPE email_status AS ENUM ('draft', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed');
CREATE TYPE email_template_category AS ENUM ('invoice', 'follow_up', 'onboarding', 'update', 'marketing', 'custom');
CREATE TYPE sms_direction AS ENUM ('outbound', 'inbound');
CREATE TYPE sms_status AS ENUM ('queued', 'sent', 'delivered', 'failed', 'received');
CREATE TYPE call_direction AS ENUM ('outbound', 'inbound');
CREATE TYPE call_status AS ENUM ('completed', 'no_answer', 'busy', 'failed', 'voicemail');
CREATE TYPE call_sentiment AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'expired', 'cancelled');
CREATE TYPE event_type AS ENUM ('meeting', 'deadline', 'follow_up', 'internal', 'personal', 'booking');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE automation_trigger_type AS ENUM ('event', 'schedule', 'manual');
CREATE TYPE automation_log_status AS ENUM ('success', 'failure', 'skipped');
CREATE TYPE team_role AS ENUM ('admin', 'member', 'ai_assistant', 'client');
CREATE TYPE kb_category_type AS ENUM ('sop', 'meeting_notes', 'planning', 'reference', 'other');
CREATE TYPE webhook_direction AS ENUM ('incoming', 'outgoing');
CREATE TYPE webhook_status AS ENUM ('success', 'failure', 'pending');
CREATE TYPE integration_test_status AS ENUM ('success', 'failure', 'untested');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE email_digest_frequency AS ENUM ('realtime', 'daily', 'weekly', 'never');
```

---

## CHUNK 2: Core Tables (Team, Clients, Projects, Milestones, Deliverables)

```sql
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  role team_role NOT NULL DEFAULT 'member',
  avatar_url text,
  is_ai boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  logo_url text,
  website text,
  industry text,
  status client_status NOT NULL DEFAULT 'active',
  health_score integer DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  health_score_updated_at timestamptz,
  notes text,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  client_since date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE client_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  role text,
  is_primary boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE client_health_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  factors jsonb DEFAULT '{}',
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status project_status NOT NULL DEFAULT 'planning',
  priority project_priority NOT NULL DEFAULT 'medium',
  value numeric DEFAULT 0,
  monthly_recurring numeric DEFAULT 0,
  start_date date,
  target_date date,
  completed_date date,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  due_date date,
  completed_date date,
  status milestone_status NOT NULL DEFAULT 'pending',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES milestones(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  type deliverable_type NOT NULL DEFAULT 'file',
  url text,
  version integer NOT NULL DEFAULT 1,
  approval_status approval_status NOT NULL DEFAULT 'pending',
  approved_at timestamptz,
  approved_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## CHUNK 3: Financial Tables (Time Entries, Invoices, Payments, Expenses)

```sql
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id uuid,
  team_member_id uuid NOT NULL REFERENCES team_members(id),
  description text,
  start_time timestamptz,
  end_time timestamptz,
  duration_minutes integer,
  is_billable boolean NOT NULL DEFAULT true,
  hourly_rate numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  subtotal numeric NOT NULL DEFAULT 0,
  tax_rate numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  notes text,
  is_recurring boolean NOT NULL DEFAULT false,
  recurring_interval recurring_interval,
  next_recurring_date date,
  sent_at timestamptz,
  viewed_at timestamptz,
  paid_at timestamptz,
  stripe_invoice_id text,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total numeric NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'other',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  reference text,
  notes text,
  stripe_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category expense_category NOT NULL DEFAULT 'other',
  description text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  vendor text,
  receipt_url text,
  is_recurring boolean NOT NULL DEFAULT false,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);
```

---

## CHUNK 4: Leads & AI Tables

```sql
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  contact_name text NOT NULL,
  email text,
  phone text,
  website text,
  industry text,
  source lead_source DEFAULT 'other',
  source_detail text,
  stage lead_stage NOT NULL DEFAULT 'new',
  score integer DEFAULT 50 CHECK (score >= 0 AND score <= 100),
  estimated_value numeric,
  expected_close_date date,
  assigned_to uuid REFERENCES team_members(id),
  notes text,
  tags text[] DEFAULT '{}',
  lost_reason text,
  converted_client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  converted_at timestamptz,
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type lead_activity_type NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type insight_type NOT NULL,
  category insight_category NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority insight_priority NOT NULL DEFAULT 'medium',
  data jsonb DEFAULT '{}',
  entity_type text,
  entity_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  is_actioned boolean NOT NULL DEFAULT false,
  actioned_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ai_daily_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  summary text,
  key_metrics jsonb DEFAULT '{}',
  action_items jsonb DEFAULT '[]',
  predictions jsonb DEFAULT '{}',
  generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

## CHUNK 5: Media, Emails, SMS, Calls

```sql
CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_name text,
  file_type text,
  file_size bigint,
  storage_path text NOT NULL,
  url text,
  thumbnail_url text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  folder text,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  is_ai_generated boolean NOT NULL DEFAULT false,
  ai_prompt text,
  ai_model text,
  ai_parameters jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  uploaded_by uuid REFERENCES team_members(id)
);

CREATE TABLE emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES client_contacts(id) ON DELETE SET NULL,
  direction email_direction NOT NULL DEFAULT 'outbound',
  from_email text,
  to_email text,
  cc text[] DEFAULT '{}',
  bcc text[] DEFAULT '{}',
  subject text,
  body_html text,
  body_text text,
  template_id uuid,
  status email_status NOT NULL DEFAULT 'draft',
  resend_id text,
  opened_at timestamptz,
  clicked_at timestamptz,
  scheduled_for timestamptz,
  sent_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text,
  body_html text,
  body_text text,
  variables text[] DEFAULT '{}',
  category email_template_category NOT NULL DEFAULT 'custom',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

ALTER TABLE emails ADD CONSTRAINT emails_template_id_fkey
  FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

CREATE TABLE sms_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES client_contacts(id) ON DELETE SET NULL,
  direction sms_direction NOT NULL,
  from_number text,
  to_number text,
  body text,
  status sms_status NOT NULL DEFAULT 'queued',
  twilio_sid text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES client_contacts(id) ON DELETE SET NULL,
  direction call_direction NOT NULL DEFAULT 'outbound',
  phone_number text,
  duration_seconds integer,
  status call_status NOT NULL DEFAULT 'completed',
  transcript text,
  summary text,
  sentiment call_sentiment,
  action_items jsonb DEFAULT '[]',
  bland_call_id text,
  recording_url text,
  called_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);
```

---

## CHUNK 6: Proposals, Contracts, Calendar, Tasks

```sql
CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  status proposal_status NOT NULL DEFAULT 'draft',
  content jsonb DEFAULT '{}',
  pricing_items jsonb DEFAULT '[]',
  total_value numeric DEFAULT 0,
  valid_until date,
  share_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  template_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE proposal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content jsonb DEFAULT '{}',
  pricing_items jsonb DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

ALTER TABLE proposals ADD CONSTRAINT proposals_template_id_fkey
  FOREIGN KEY (template_id) REFERENCES proposal_templates(id) ON DELETE SET NULL;

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  status contract_status NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  file_url text,
  signed_at timestamptz,
  signed_by text,
  signature_data jsonb,
  expires_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type event_type NOT NULL DEFAULT 'meeting',
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  all_day boolean NOT NULL DEFAULT false,
  location text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  cal_com_booking_id text,
  attendees jsonb DEFAULT '[]',
  meeting_notes text,
  prep_notes text,
  follow_up_date date,
  is_completed boolean NOT NULL DEFAULT false,
  recurrence jsonb,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES team_members(id),
  due_date date,
  completed_at timestamptz,
  parent_task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_recurring boolean NOT NULL DEFAULT false,
  recurrence_rule jsonb,
  next_recurrence_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

ALTER TABLE time_entries ADD CONSTRAINT time_entries_task_id_fkey
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;

CREATE TABLE task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);
```

---

## CHUNK 7: Automations, Activity, Notes, Documents, Portal, KB, Reports, Settings

```sql
CREATE TABLE automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_type automation_trigger_type NOT NULL DEFAULT 'event',
  trigger_config jsonb NOT NULL DEFAULT '{}',
  actions jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  last_run_at timestamptz,
  run_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id uuid NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  status automation_log_status NOT NULL,
  trigger_data jsonb DEFAULT '{}',
  actions_executed jsonb DEFAULT '[]',
  error_message text,
  executed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES team_members(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  entity_name text,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  mentions uuid[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category kb_category_type NOT NULL DEFAULT 'other',
  tags text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE client_portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE knowledge_base_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  parent_id uuid REFERENCES knowledge_base_categories(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE knowledge_base_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES knowledge_base_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  tags text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  is_client_visible boolean NOT NULL DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE report_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  period text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES team_members(id)
);

CREATE TABLE integration_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  last_tested_at timestamptz,
  last_test_status integration_test_status DEFAULT 'untested',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES team_members(id)
);

CREATE TABLE webhook_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  direction webhook_direction NOT NULL,
  events text[] DEFAULT '{}',
  secret text,
  is_active boolean NOT NULL DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

CREATE TABLE webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid NOT NULL REFERENCES webhook_configs(id) ON DELETE CASCADE,
  direction webhook_direction NOT NULL,
  event text,
  payload jsonb,
  response_status integer,
  response_body text,
  status webhook_status NOT NULL DEFAULT 'pending',
  retries integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES team_members(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  priority notification_priority NOT NULL DEFAULT 'medium',
  entity_type text,
  entity_id uuid,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  channels_sent text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  in_app boolean NOT NULL DEFAULT true,
  email boolean NOT NULL DEFAULT true,
  sms boolean NOT NULL DEFAULT false,
  email_digest email_digest_frequency NOT NULL DEFAULT 'daily',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_member_id, notification_type)
);
```

---

## CHUNK 8: All Indexes

```sql
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_health_score ON clients(health_score);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);
CREATE INDEX idx_client_contacts_email ON client_contacts(email);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
CREATE INDEX idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX idx_deliverables_milestone_id ON deliverables(milestone_id);
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_team_member_id ON time_entries(team_member_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_is_recurring ON invoices(is_recurring) WHERE is_recurring = true;
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_project_id ON expenses(project_id);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(type);
CREATE INDEX idx_ai_insights_type ON ai_insights(type);
CREATE INDEX idx_ai_insights_category ON ai_insights(category);
CREATE INDEX idx_ai_insights_entity ON ai_insights(entity_type, entity_id);
CREATE INDEX idx_ai_insights_is_read ON ai_insights(is_read) WHERE is_read = false;
CREATE INDEX idx_ai_insights_priority ON ai_insights(priority);
CREATE INDEX idx_media_client_id ON media(client_id);
CREATE INDEX idx_media_project_id ON media(project_id);
CREATE INDEX idx_media_is_ai_generated ON media(is_ai_generated);
CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_emails_client_id ON emails(client_id);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_created_at ON emails(created_at);
CREATE INDEX idx_sms_messages_client_id ON sms_messages(client_id);
CREATE INDEX idx_call_logs_client_id ON call_logs(client_id);
CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_share_token ON proposals(share_token);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_client_id ON calendar_events(client_id);
CREATE INDEX idx_calendar_events_type ON calendar_events(type);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_activity_feed_entity ON activity_feed(entity_type, entity_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_actor_id ON activity_feed(actor_id);
CREATE INDEX idx_notes_entity ON notes(entity_type, entity_id);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_kb_articles_category_id ON knowledge_base_articles(category_id);
CREATE INDEX idx_kb_articles_slug ON knowledge_base_articles(slug);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
```

---

## CHUNK 9: RLS + Policies

```sql
-- Enable RLS on all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_health_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_daily_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_team_member()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_portal_client_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT client_id FROM client_portal_users
    WHERE user_id = auth.uid() AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Team policies
CREATE POLICY "Team members can view all clients" ON clients FOR SELECT USING (is_team_member());
CREATE POLICY "Team members can create clients" ON clients FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team members can update clients" ON clients FOR UPDATE USING (is_team_member());
CREATE POLICY "Admins can delete clients" ON clients FOR DELETE USING (is_admin());
CREATE POLICY "Team: select client_contacts" ON client_contacts FOR SELECT USING (is_team_member());
CREATE POLICY "Team: insert client_contacts" ON client_contacts FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team: update client_contacts" ON client_contacts FOR UPDATE USING (is_team_member());
CREATE POLICY "Team: delete client_contacts" ON client_contacts FOR DELETE USING (is_team_member());
CREATE POLICY "Team: select projects" ON projects FOR SELECT USING (is_team_member());
CREATE POLICY "Team: insert projects" ON projects FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team: update projects" ON projects FOR UPDATE USING (is_team_member());
CREATE POLICY "Admin: delete projects" ON projects FOR DELETE USING (is_admin());
CREATE POLICY "Team: all milestones" ON milestones FOR ALL USING (is_team_member());
CREATE POLICY "Team: all deliverables" ON deliverables FOR ALL USING (is_team_member());
CREATE POLICY "Team: all time_entries" ON time_entries FOR ALL USING (is_team_member());
CREATE POLICY "Team: select invoices" ON invoices FOR SELECT USING (is_team_member());
CREATE POLICY "Team: insert invoices" ON invoices FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team: update invoices" ON invoices FOR UPDATE USING (is_team_member());
CREATE POLICY "Admin: delete invoices" ON invoices FOR DELETE USING (is_admin());
CREATE POLICY "Team: all invoice_items" ON invoice_items FOR ALL USING (is_team_member());
CREATE POLICY "Team: all payments" ON payments FOR ALL USING (is_team_member());
CREATE POLICY "Team: all expenses" ON expenses FOR ALL USING (is_team_member());
CREATE POLICY "Team: all leads" ON leads FOR ALL USING (is_team_member());
CREATE POLICY "Team: all lead_activities" ON lead_activities FOR ALL USING (is_team_member());
CREATE POLICY "Team: all ai_insights" ON ai_insights FOR ALL USING (is_team_member());
CREATE POLICY "Team: all ai_daily_briefings" ON ai_daily_briefings FOR ALL USING (is_team_member());
CREATE POLICY "Team: all media" ON media FOR ALL USING (is_team_member());
CREATE POLICY "Team: all emails" ON emails FOR ALL USING (is_team_member());
CREATE POLICY "Team: all email_templates" ON email_templates FOR ALL USING (is_team_member());
CREATE POLICY "Team: all sms_messages" ON sms_messages FOR ALL USING (is_team_member());
CREATE POLICY "Team: all call_logs" ON call_logs FOR ALL USING (is_team_member());
CREATE POLICY "Team: all proposals" ON proposals FOR ALL USING (is_team_member());
CREATE POLICY "Team: all proposal_templates" ON proposal_templates FOR ALL USING (is_team_member());
CREATE POLICY "Team: all contracts" ON contracts FOR ALL USING (is_team_member());
CREATE POLICY "Team: all calendar_events" ON calendar_events FOR ALL USING (is_team_member());
CREATE POLICY "Team: all tasks" ON tasks FOR ALL USING (is_team_member());
CREATE POLICY "Team: all task_comments" ON task_comments FOR ALL USING (is_team_member());
CREATE POLICY "Team: all automations" ON automations FOR ALL USING (is_team_member());
CREATE POLICY "Team: all automation_logs" ON automation_logs FOR ALL USING (is_team_member());
CREATE POLICY "Team: all activity_feed" ON activity_feed FOR ALL USING (is_team_member());
CREATE POLICY "Team: all notes" ON notes FOR ALL USING (is_team_member());
CREATE POLICY "Team: all documents" ON documents FOR ALL USING (is_team_member());
CREATE POLICY "Team: select team_members" ON team_members FOR SELECT USING (is_team_member());
CREATE POLICY "Admin: manage team_members" ON team_members FOR ALL USING (is_admin());
CREATE POLICY "Team: all client_portal_users" ON client_portal_users FOR ALL USING (is_team_member());
CREATE POLICY "Team: all kb_categories" ON knowledge_base_categories FOR ALL USING (is_team_member());
CREATE POLICY "Team: all kb_articles" ON knowledge_base_articles FOR ALL USING (is_team_member());
CREATE POLICY "Team: all report_snapshots" ON report_snapshots FOR ALL USING (is_team_member());
CREATE POLICY "Team: select settings" ON settings FOR SELECT USING (is_team_member());
CREATE POLICY "Admin: manage settings" ON settings FOR ALL USING (is_admin());
CREATE POLICY "Admin: all integration_configs" ON integration_configs FOR ALL USING (is_admin());
CREATE POLICY "Admin: all webhook_configs" ON webhook_configs FOR ALL USING (is_admin());
CREATE POLICY "Team: select webhook_logs" ON webhook_logs FOR SELECT USING (is_team_member());
CREATE POLICY "Admin: select audit_log" ON audit_log FOR SELECT USING (is_admin());
CREATE POLICY "Team: insert audit_log" ON audit_log FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Users: own notifications" ON notifications FOR SELECT
  USING (recipient_id IN (SELECT id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "Users: update own notifications" ON notifications FOR UPDATE
  USING (recipient_id IN (SELECT id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "Team: insert notifications" ON notifications FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Users: own notification_preferences" ON notification_preferences FOR ALL
  USING (team_member_id IN (SELECT id FROM team_members WHERE user_id = auth.uid()));

-- Portal policies
CREATE POLICY "Portal: view own client" ON clients FOR SELECT
  USING (id = get_portal_client_id());
CREATE POLICY "Portal: view own projects" ON projects FOR SELECT
  USING (client_id = get_portal_client_id());
CREATE POLICY "Portal: view own invoices" ON invoices FOR SELECT
  USING (client_id = get_portal_client_id());
CREATE POLICY "Portal: view own proposals" ON proposals FOR SELECT
  USING (client_id = get_portal_client_id());
CREATE POLICY "Portal: view own contracts" ON contracts FOR SELECT
  USING (client_id = get_portal_client_id());
CREATE POLICY "Portal: view own deliverables" ON deliverables FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE client_id = get_portal_client_id()));
CREATE POLICY "Portal: view own media" ON media FOR SELECT
  USING (client_id = get_portal_client_id());
CREATE POLICY "Portal: view kb articles" ON knowledge_base_articles FOR SELECT
  USING (is_published = true AND is_client_visible = true);
```

---

## CHUNK 10: Functions + Triggers + Seed Data

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'team_members', 'clients', 'client_contacts', 'projects', 'milestones',
      'deliverables', 'time_entries', 'invoices', 'invoice_items', 'expenses',
      'leads', 'media', 'emails', 'email_templates', 'proposals',
      'proposal_templates', 'contracts', 'calendar_events', 'tasks',
      'task_comments', 'automations', 'notes', 'documents',
      'client_portal_users', 'knowledge_base_categories', 'knowledge_base_articles',
      'settings', 'integration_configs', 'webhook_configs', 'notification_preferences',
      'ai_insights', 'sms_messages'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t
    );
  END LOOP;
END;
$$;

-- Invoice number generator
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS text AS $$
DECLARE
  year_str text;
  next_num integer;
BEGIN
  year_str := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(invoice_number, '-', 3) AS integer)
  ), 0) + 1 INTO next_num
  FROM invoices
  WHERE invoice_number LIKE 'VTX-' || year_str || '-%';
  RETURN 'VTX-' || year_str || '-' || LPAD(next_num::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Client health score calculator
CREATE OR REPLACE FUNCTION calculate_client_health_score(p_client_id uuid)
RETURNS integer AS $$
DECLARE
  payment_score integer := 100;
  communication_score integer := 100;
  project_score integer := 100;
  engagement_score integer := 100;
  revenue_score integer := 100;
  total_score integer;
  overdue_count integer;
  last_comm_days integer;
  overdue_milestones integer;
BEGIN
  SELECT COUNT(*) INTO overdue_count
  FROM invoices WHERE client_id = p_client_id AND status = 'overdue';
  IF overdue_count > 0 THEN
    payment_score := GREATEST(0, 100 - (overdue_count * 30));
  END IF;

  SELECT EXTRACT(DAY FROM now() - MAX(created_at))::integer INTO last_comm_days
  FROM (
    SELECT created_at FROM emails WHERE client_id = p_client_id
    UNION ALL
    SELECT created_at FROM call_logs WHERE client_id = p_client_id
    UNION ALL
    SELECT created_at FROM sms_messages WHERE client_id = p_client_id
  ) comms;
  IF last_comm_days IS NOT NULL THEN
    communication_score := GREATEST(0, 100 - (last_comm_days * 3));
  END IF;

  SELECT COUNT(*) INTO overdue_milestones
  FROM milestones m
  JOIN projects p ON m.project_id = p.id
  WHERE p.client_id = p_client_id AND m.status = 'overdue';
  IF overdue_milestones > 0 THEN
    project_score := GREATEST(0, 100 - (overdue_milestones * 20));
  END IF;

  total_score := (
    (payment_score * 25) +
    (communication_score * 20) +
    (project_score * 25) +
    (engagement_score * 15) +
    (revenue_score * 15)
  ) / 100;

  UPDATE clients
  SET health_score = total_score, health_score_updated_at = now()
  WHERE id = p_client_id;

  INSERT INTO client_health_history (client_id, score, factors)
  VALUES (p_client_id, total_score, jsonb_build_object(
    'payment', payment_score,
    'communication', communication_score,
    'project', project_score,
    'engagement', engagement_score,
    'revenue', revenue_score
  ));

  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activity logger
CREATE OR REPLACE FUNCTION log_activity(
  p_actor_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_entity_name text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO activity_feed (actor_id, action, entity_type, entity_id, entity_name, description, metadata)
  VALUES (p_actor_id, p_action, p_entity_type, p_entity_id, p_entity_name, p_description, p_metadata)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed: Team members
INSERT INTO team_members (name, email, role, is_ai) VALUES
  ('Kyle', 'kyle@usevantix.com', 'admin', false),
  ('Aidan', 'aidan@usevantix.com', 'admin', false),
  ('Vantix AI', 'ai@usevantix.com', 'ai_assistant', true),
  ('Botskii AI', 'botskii@usevantix.com', 'ai_assistant', true);

-- Seed: Settings
INSERT INTO settings (key, value, category) VALUES
  ('company_name', '"Vantix LLC"', 'general'),
  ('company_website', '"https://usevantix.com"', 'general'),
  ('default_currency', '"USD"', 'general'),
  ('timezone', '"America/New_York"', 'general'),
  ('invoice_prefix', '"VTX"', 'invoicing'),
  ('default_payment_terms_days', '30', 'invoicing'),
  ('default_tax_rate', '0', 'invoicing');

-- Seed: Email templates
INSERT INTO email_templates (name, subject, body_html, variables, category) VALUES
  ('Invoice', 'Invoice {{invoice_number}} from Vantix LLC',
   '<h1>Invoice {{invoice_number}}</h1><p>Hi {{client_name}},</p><p>Please find your invoice for {{total}} attached.</p><p>Due date: {{due_date}}</p><p>Thank you for your business!</p><p>— Vantix Team</p>',
   ARRAY['invoice_number', 'client_name', 'total', 'due_date'], 'invoice'),
  ('Follow Up', 'Following up — {{subject}}',
   '<p>Hi {{client_name}},</p><p>Just wanted to follow up on {{subject}}. Let us know if you have any questions.</p><p>Best,<br>{{sender_name}}<br>Vantix LLC</p>',
   ARRAY['client_name', 'subject', 'sender_name'], 'follow_up'),
  ('Welcome / Onboarding', 'Welcome to Vantix!',
   '<h1>Welcome aboard, {{client_name}}!</h1><p>We are excited to start working with you. Here is what happens next:</p><ol><li>Kickoff call to align on goals</li><li>Project plan delivered within 48 hours</li><li>Development begins!</li></ol><p>Your client portal: <a href="https://usevantix.com/portal">usevantix.com/portal</a></p><p>— The Vantix Team</p>',
   ARRAY['client_name'], 'onboarding');

-- Seed: Clients
INSERT INTO clients (company_name, industry, status, client_since, notes) VALUES
  ('SecuredTampa', 'Retail / E-commerce', 'active', '2025-01-01', 'Dave''s sneaker & Pokemon card store. $4,500 AI build. Monthly maintenance $100.'),
  ('Just Four Kicks', 'B2B Wholesale / Sneakers', 'active', '2025-01-01', 'Kyle''s own B2B wholesale sneaker platform. Internal project.');
```

---

**Done! Run chunks 1 through 10 in order. Each should succeed before moving to the next.**
