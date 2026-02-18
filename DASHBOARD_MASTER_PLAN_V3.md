# 🏗️ VANTIX LLC — DASHBOARD MASTER PLAN V3

> **The definitive blueprint for building a world-class internal operating system.**
> Version 3.0 | February 2026 | Authors: Kyle, Aidan, Vantix AI
> Dashboard: `usevantix.com/dashboard` | Stack: Next.js + Supabase + Vercel

---

## Table of Contents

1. [Vision & Philosophy](#1-vision--philosophy)
2. [Architecture Overview](#2-architecture-overview)
3. [Sidebar Navigation Structure](#3-sidebar-navigation-structure)
4. [Feature Categories (Detailed)](#4-feature-categories)
   - 4.1 [CRM & Client Management](#41-crm--client-management)
   - 4.2 [Project Management](#42-project-management)
   - 4.3 [Financial Hub](#43-financial-hub)
   - 4.4 [Lead Management](#44-lead-management)
   - 4.5 [AI Insights Engine](#45-ai-insights-engine)
   - 4.6 [Media Library](#46-media-library)
   - 4.7 [Communication Center](#47-communication-center)
   - 4.8 [Proposal & Contract System](#48-proposal--contract-system)
   - 4.9 [Calendar & Scheduling](#49-calendar--scheduling)
   - 4.10 [Reporting & Analytics](#410-reporting--analytics)
   - 4.11 [Task & Workflow Automation](#411-task--workflow-automation)
   - 4.12 [Team Collaboration](#412-team-collaboration)
   - 4.13 [Client Portal](#413-client-portal)
   - 4.14 [Knowledge Base](#414-knowledge-base)
   - 4.15 [Settings & Integrations](#415-settings--integrations)
   - 4.16 [Notification System](#416-notification-system)
5. [Complete Supabase SQL Migration](#5-complete-supabase-sql-migration)
6. [Environment Variables Checklist](#6-environment-variables-checklist)
7. [Implementation Phases](#7-implementation-phases)
8. [Estimated Effort](#8-estimated-effort)

---

## 1. Vision & Philosophy

Vantix is two humans and two AIs running a high-ticket AI consulting operation. Every dollar of revenue comes from relationships, trust, and execution speed. The dashboard isn't an admin panel — it's the **central nervous system** of the company.

### Design Principles

1. **Speed over features.** Every page loads in <200ms. No spinners. Optimistic UI everywhere.
2. **AI-native.** AI isn't a feature — it's embedded in every surface. Insights, suggestions, and automations are ambient.
3. **High-signal, low-noise.** A 4-person team doesn't need enterprise bloat. Every element earns its pixel.
4. **Client-obsessed.** Every screen answers: "How do we make our clients more successful?"
5. **Revenue-aware.** Money is always visible. MRR, pipeline, outstanding invoices — never more than one click away.

### Design Language

- **Aesthetic:** Dark mode primary (like Linear). Clean typography, generous whitespace, subtle gradients.
- **Components:** shadcn/ui + Tailwind CSS. Consistent with existing codebase.
- **Animations:** Framer Motion. Subtle transitions, no gratuitous motion.
- **Data viz:** Recharts or Tremor for charts. Consistent color palette across all graphs.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         Next.js 14 (App Router) on Vercel        │
│    shadcn/ui + Tailwind + Framer Motion          │
├─────────────────────────────────────────────────┤
│                 SUPABASE LAYER                   │
│  Auth │ Postgres │ Storage │ Realtime │ Edge Fn  │
├─────────────────────────────────────────────────┤
│              EXTERNAL INTEGRATIONS               │
│  Resend │ Twilio │ Bland AI │ Replicate │ Cal.com│
│  Stripe │ n8n │ OpenAI/Claude                    │
├─────────────────────────────────────────────────┤
│             AUTOMATION LAYER (n8n)               │
│  Webhooks │ Scheduled Jobs │ Event Triggers      │
└─────────────────────────────────────────────────┘
```

### Auth Model

- Supabase Auth for team members (Kyle, Aidan)
- API key auth for AI assistants (Vantix AI, Botskii AI)
- Magic link auth for client portal access
- Role-based access: `admin`, `member`, `ai_assistant`, `client`

### Data Flow

1. **Frontend** → Supabase client SDK (direct DB access with RLS)
2. **Automations** → n8n webhooks → Supabase service role
3. **AI Assistants** → Supabase REST API with service role key
4. **Client Portal** → Supabase client SDK with client-role RLS
5. **External tools** → Edge Functions as API middleware

---

## 3. Sidebar Navigation Structure

```
📊 Overview (Dashboard Home)
─────────────────────────
👥 Clients
   ├── All Clients
   ├── Client Health
   └── Client Portal Settings
🎯 Leads
   ├── Pipeline
   ├── Lead Scoring
   └── Sources
📁 Projects
   ├── Active Projects
   ├── Milestones
   └── Deliverables
✅ Tasks
   ├── My Tasks
   ├── All Tasks
   └── Automations
💰 Finances
   ├── Invoices
   ├── Payments
   ├── Revenue
   └── Expenses
📝 Proposals
   ├── Templates
   ├── Active Proposals
   └── Contracts
💬 Communications
   ├── Inbox
   ├── Email Templates
   ├── SMS Log
   └── Call Transcripts
🖼️ Media Library
   ├── All Media
   ├── AI Generations
   └── Client Assets
📅 Calendar
🤖 AI Insights
   ├── Dashboard
   ├── Recommendations
   └── Predictions
📈 Reports
   ├── Revenue
   ├── Clients
   ├── Projects
   └── Team
👥 Team
   ├── Activity Feed
   ├── Notes
   └── Documents
📚 Knowledge Base
🔔 Notifications
⚙️ Settings
   ├── General
   ├── Integrations
   ├── API Keys
   └── Notifications
```

---

## 4. Feature Categories

---

### 4.1 CRM & Client Management

#### Why It Matters
At $4,500+ per project, every client relationship is worth tens of thousands over their lifetime. You need to know everything about every client at a glance — their history, health, preferences, upcoming renewals, and opportunities to upsell. This is the beating heart of the dashboard.

#### Features

**Client Profiles** (P0)
- Company name, logo, website, industry
- Primary contact + additional contacts (name, email, phone, role)
- Tags and custom fields
- Client since date, lifetime value (auto-calculated)
- Internal notes, preferences, communication style
- Link to all projects, invoices, proposals, media, communications

**Client Health Score** (P0)
- Composite score (0-100) calculated from:
  - Payment timeliness (weight: 25%)
  - Communication frequency (weight: 20%)
  - Project satisfaction / milestone completion (weight: 25%)
  - Engagement with deliverables (weight: 15%)
  - Revenue trend (weight: 15%)
- Visual indicator: 🟢 Healthy (70-100) | 🟡 At Risk (40-69) | 🔴 Critical (0-39)
- Automated alerts when score drops below threshold
- Historical trend chart

**Contact History Timeline** (P0)
- Unified timeline showing all interactions: emails, calls, meetings, invoices, project updates
- Filterable by type
- Linked to Communication Center records

**Deal Pipeline** (P1)
- Kanban board: Discovery → Proposal → Negotiation → Closed Won / Lost
- Deal value, expected close date, probability
- Conversion analytics

#### Data Model

```
clients
├── id (uuid, PK)
├── company_name (text, NOT NULL)
├── logo_url (text)
├── website (text)
├── industry (text)
├── status (enum: active, inactive, churned, prospect)
├── health_score (integer, 0-100)
├── health_score_updated_at (timestamptz)
├── notes (text)
├── tags (text[])
├── custom_fields (jsonb)
├── client_since (date)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

client_contacts
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id)
├── name (text, NOT NULL)
├── email (text)
├── phone (text)
├── role (text)
├── is_primary (boolean, default false)
├── notes (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

client_health_history
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id)
├── score (integer)
├── factors (jsonb) -- breakdown of score components
├── recorded_at (timestamptz)
└── created_at (timestamptz)
```

#### UI Components
- Client list with search, filter (status, health, tags), and sort
- Client detail page with tabbed sections (Overview, Projects, Invoices, Communications, Media, Notes)
- Health score badge with tooltip showing breakdown
- Contact cards with click-to-email/call
- Client timeline (vertical, chronological)
- Quick-add client modal

#### Integration Points
- **Resend**: Send emails directly from client profile
- **Twilio**: Click-to-SMS from contact card
- **Bland AI**: Initiate AI calls from client profile
- **Cal.com**: Schedule meetings linked to client
- **AI Insights Engine**: Health score calculation, churn prediction

---

### 4.2 Project Management

#### Why It Matters
You're building custom AI systems — projects are complex, multi-phase, and high-stakes. One missed milestone can blow a client relationship. You need visibility into every project's status, blockers, and timeline at all times.

#### Features

**Project Board** (P0)
- List and Kanban views
- Statuses: Planning → In Progress → Review → Delivered → Maintenance
- Project overview: client, value, start date, target date, progress %
- Linked tasks, milestones, deliverables, invoices

**Milestones** (P0)
- Named checkpoints within a project (e.g., "MVP Delivered", "Phase 2 Launch")
- Due date, status, linked tasks
- Milestone completion triggers (e.g., auto-send update email to client, generate invoice)

**Deliverables** (P1)
- Files, links, or descriptions of what was delivered
- Versioning (v1, v2, etc.)
- Client approval status: Pending → Approved → Revision Requested
- Linked to media library

**Time Tracking** (P1)
- Start/stop timer or manual entry
- Per-project and per-task time logs
- Billable vs. non-billable hours
- Project profitability calculation (revenue - (hours × rate))

#### Data Model

```
projects
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id)
├── name (text, NOT NULL)
├── description (text)
├── status (enum: planning, in_progress, review, delivered, maintenance, cancelled)
├── priority (enum: low, medium, high, urgent)
├── value (numeric) -- contract value
├── monthly_recurring (numeric) -- maintenance revenue
├── start_date (date)
├── target_date (date)
├── completed_date (date)
├── progress (integer, 0-100)
├── tags (text[])
├── metadata (jsonb)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

milestones
├── id (uuid, PK)
├── project_id (uuid, FK → projects.id)
├── name (text, NOT NULL)
├── description (text)
├── due_date (date)
├── completed_date (date)
├── status (enum: pending, in_progress, completed, overdue)
├── sort_order (integer)
├── created_at (timestamptz)
└── updated_at (timestamptz)

deliverables
├── id (uuid, PK)
├── project_id (uuid, FK → projects.id)
├── milestone_id (uuid, FK → milestones.id, nullable)
├── name (text, NOT NULL)
├── description (text)
├── type (enum: file, link, document)
├── url (text)
├── version (integer, default 1)
├── approval_status (enum: pending, approved, revision_requested)
├── approved_at (timestamptz)
├── approved_by (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

time_entries
├── id (uuid, PK)
├── project_id (uuid, FK → projects.id)
├── task_id (uuid, FK → tasks.id, nullable)
├── team_member_id (uuid, FK → team_members.id)
├── description (text)
├── start_time (timestamptz)
├── end_time (timestamptz)
├── duration_minutes (integer)
├── is_billable (boolean, default true)
├── hourly_rate (numeric)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

#### UI Components
- Project list with Kanban toggle
- Project detail page (header with key metrics, tabbed: Tasks, Milestones, Deliverables, Time, Invoices, Files)
- Milestone timeline (horizontal Gantt-lite)
- Timer widget (floating, always accessible)
- Progress bar with milestone markers
- Quick status update dropdown

#### Integration Points
- **n8n**: Auto-create tasks when project created, send milestone notifications
- **Resend**: Client update emails on milestone completion
- **AI Insights**: Project health prediction, deadline risk assessment
- **Media Library**: Deliverable files stored in Supabase Storage

---

### 4.3 Financial Hub

#### Why It Matters
Cash flow is king. At $4,500 per project + $100/mo maintenance, you need to know exactly where every dollar is. Who's paid, who hasn't, what's your MRR, what's your runway. This is the CFO view.

#### Features

**Invoice Management** (P0)
- Create, send, and track invoices
- Statuses: Draft → Sent → Viewed → Paid → Overdue
- Line items with descriptions, quantities, rates
- Auto-calculate tax, discounts
- PDF generation
- Send via Resend email
- Payment link (Stripe or manual)
- Recurring invoices for maintenance clients

**Payment Tracking** (P0)
- Record payments against invoices
- Payment methods: Stripe, Cash, Zelle, Wire, Crypto
- Partial payment support
- Accounts receivable aging report

**Revenue Dashboard** (P0)
- MRR (Monthly Recurring Revenue) from maintenance clients
- Total revenue by month/quarter/year
- Revenue by client
- Revenue by project type
- Pipeline revenue (weighted by probability)
- YoY / MoM growth rates

**Expense Tracking** (P1)
- Log expenses with categories (Software, Hosting, Marketing, Contractors, etc.)
- Receipt upload (stored in Supabase Storage)
- Monthly burn rate
- Simple P&L (Revenue - Expenses)

**Accounts Receivable** (P0)
- Outstanding invoices sorted by age
- Days Sales Outstanding (DSO)
- Auto-reminder emails for overdue invoices (via n8n + Resend)

#### Data Model

```
invoices
├── id (uuid, PK)
├── invoice_number (text, UNIQUE) -- e.g., VTX-2026-001
├── client_id (uuid, FK → clients.id)
├── project_id (uuid, FK → projects.id, nullable)
├── status (enum: draft, sent, viewed, paid, overdue, cancelled, void)
├── issue_date (date)
├── due_date (date)
├── subtotal (numeric)
├── tax_rate (numeric, default 0)
├── tax_amount (numeric, default 0)
├── discount_amount (numeric, default 0)
├── total (numeric)
├── amount_paid (numeric, default 0)
├── currency (text, default 'USD')
├── notes (text)
├── is_recurring (boolean, default false)
├── recurring_interval (enum: monthly, quarterly, yearly, nullable)
├── next_recurring_date (date, nullable)
├── sent_at (timestamptz)
├── viewed_at (timestamptz)
├── paid_at (timestamptz)
├── stripe_invoice_id (text)
├── pdf_url (text)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

invoice_items
├── id (uuid, PK)
├── invoice_id (uuid, FK → invoices.id)
├── description (text, NOT NULL)
├── quantity (numeric, default 1)
├── unit_price (numeric, NOT NULL)
├── total (numeric)
├── sort_order (integer)
├── created_at (timestamptz)
└── updated_at (timestamptz)

payments
├── id (uuid, PK)
├── invoice_id (uuid, FK → invoices.id)
├── amount (numeric, NOT NULL)
├── payment_method (enum: stripe, cash, zelle, wire, crypto, check, other)
├── payment_date (date)
├── reference (text) -- transaction ID, check number, etc.
├── notes (text)
├── stripe_payment_id (text)
├── created_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

expenses
├── id (uuid, PK)
├── category (enum: software, hosting, marketing, contractors, office, travel, equipment, other)
├── description (text, NOT NULL)
├── amount (numeric, NOT NULL)
├── date (date)
├── vendor (text)
├── receipt_url (text)
├── is_recurring (boolean, default false)
├── project_id (uuid, FK → projects.id, nullable)
├── notes (text)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)
```

#### UI Components
- Invoice builder (form with line items, live preview, PDF download)
- Invoice list with status badges and quick filters
- Payment recording modal
- Revenue dashboard with charts: MRR trend, revenue by client (pie), monthly revenue (bar), pipeline (funnel)
- Expense list with category filters
- P&L statement view (monthly/quarterly)
- AR aging table (Current, 1-30, 31-60, 61-90, 90+ days)
- Quick stats cards: Total Revenue, MRR, Outstanding, Overdue

#### Integration Points
- **Resend**: Send invoices, payment receipts, overdue reminders
- **Stripe** (future): Payment processing, auto-reconciliation
- **n8n**: Recurring invoice generation, overdue reminders, payment notifications
- **AI Insights**: Revenue predictions, client payment behavior analysis

---

### 4.4 Lead Management

#### Why It Matters
Every lead at $4,500+ is potentially a huge deal. You need to know where leads come from, score them intelligently, and never let one slip through the cracks. The difference between closing 2 vs 3 deals a month is an extra $54K/year.

#### Features

**Lead Pipeline** (P0)
- Kanban board: New → Contacted → Qualified → Proposal Sent → Negotiation → Won / Lost
- Lead value, source, expected close date
- Drag-and-drop stage changes
- Days in stage counter (urgency indicator)

**Lead Scoring** (P1)
- AI-powered scoring based on:
  - Company size / industry
  - Budget indicated
  - Engagement level (emails opened, calls taken)
  - Source quality
  - Response time
- Score: 0-100 with Hot/Warm/Cold labels

**Source Attribution** (P1)
- Track where leads come from: Website, Cal.com, Referral, Cold Outreach, Social Media, AI Phone Agent
- Conversion rate by source
- Cost per acquisition by source

**Conversion Tracking** (P0)
- Lead → Client conversion rate
- Average time to close
- Win/loss reasons (dropdown + notes)
- Lost deal analysis

#### Data Model

```
leads
├── id (uuid, PK)
├── company_name (text)
├── contact_name (text, NOT NULL)
├── email (text)
├── phone (text)
├── website (text)
├── industry (text)
├── source (enum: website, cal_com, referral, cold_outreach, social_media, ai_phone, bland_ai, other)
├── source_detail (text) -- e.g., "referred by Dave"
├── stage (enum: new, contacted, qualified, proposal_sent, negotiation, won, lost)
├── score (integer, 0-100)
├── estimated_value (numeric)
├── expected_close_date (date)
├── assigned_to (uuid, FK → team_members.id)
├── notes (text)
├── tags (text[])
├── lost_reason (text)
├── converted_client_id (uuid, FK → clients.id, nullable)
├── converted_at (timestamptz)
├── last_contacted_at (timestamptz)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

lead_activities
├── id (uuid, PK)
├── lead_id (uuid, FK → leads.id)
├── type (enum: email, call, meeting, note, stage_change, score_change)
├── description (text)
├── metadata (jsonb) -- old_stage, new_stage, etc.
├── created_at (timestamptz)
└── created_by (uuid, FK → team_members.id)
```

#### UI Components
- Kanban pipeline board with deal values on cards
- Lead list view with sort/filter (score, stage, source, assigned to)
- Lead detail page with activity timeline
- Source breakdown chart
- Conversion funnel visualization
- Quick-add lead form
- Lead score badge with breakdown tooltip

#### Integration Points
- **Cal.com**: Auto-create leads from bookings
- **Bland AI**: AI phone qualification results → lead score update
- **Resend**: Follow-up email sequences
- **Twilio**: SMS follow-ups
- **n8n**: Lead routing, auto-assignment, follow-up reminders
- **AI Insights**: Lead scoring model, close probability prediction

---

### 4.5 AI Insights Engine

#### Why It Matters
This is what separates a $100M dashboard from a spreadsheet. AI should surface things you didn't know to ask about. "Dave hasn't responded in 12 days and his health score dropped — here's a re-engagement email draft." "Based on your pipeline, February revenue will be $13,500." "JFK project is 3 days behind — suggest reallocating from lower-priority tasks." This is your competitive advantage as an AI company — eat your own dog food.

#### Features

**Client Analysis** (P0)
- Client health score calculation (automated, daily)
- Churn risk prediction with contributing factors
- Upsell opportunity scoring (based on client engagement, project success, time since last sale)
- Recommended next actions per client

**Revenue Predictions** (P1)
- Monthly/quarterly revenue forecast based on:
  - Recurring revenue (maintenance contracts)
  - Pipeline deals (weighted by stage probability)
  - Historical close rates
  - Seasonality patterns
- Confidence intervals on predictions

**Automated Recommendations** (P0)
- Daily AI briefing: "Here's what needs your attention today"
- Smart suggestions: "Follow up with Dave — no contact in 10 days"
- Template suggestions: "Send Q1 review to all active clients"
- Pricing recommendations based on project complexity and client history

**Opportunity Scoring** (P1)
- For existing clients: likelihood of purchasing additional services
- Based on: client satisfaction, project completion, industry trends, past purchasing patterns

#### Data Model

```
ai_insights
├── id (uuid, PK)
├── type (enum: recommendation, prediction, alert, analysis)
├── category (enum: client, revenue, project, lead, general)
├── title (text, NOT NULL)
├── description (text, NOT NULL)
├── priority (enum: low, medium, high, critical)
├── data (jsonb) -- structured insight data
├── entity_type (text) -- 'client', 'project', 'lead', etc.
├── entity_id (uuid) -- FK to the relevant entity
├── is_read (boolean, default false)
├── is_actioned (boolean, default false)
├── actioned_at (timestamptz)
├── expires_at (timestamptz)
├── created_at (timestamptz)
└── updated_at (timestamptz)

ai_daily_briefings
├── id (uuid, PK)
├── date (date, UNIQUE)
├── summary (text)
├── key_metrics (jsonb)
├── action_items (jsonb)
├── predictions (jsonb)
├── generated_at (timestamptz)
└── created_at (timestamptz)
```

#### UI Components
- AI Insights dashboard with cards: Recommendations, Alerts, Predictions
- Daily briefing view (morning summary page)
- Inline insight badges on client/project cards ("⚠️ Churn Risk" or "🔥 Upsell Opportunity")
- Revenue forecast chart with confidence bands
- Recommendation action buttons (Dismiss, Snooze, Act On It)
- AI chat interface for ad-hoc queries about data

#### Integration Points
- **OpenAI/Claude API**: Generate insights, recommendations, and briefings
- **n8n**: Scheduled insight generation (daily/weekly)
- **Supabase Edge Functions**: Run scoring algorithms
- All other modules feed data into the insights engine

---

### 4.6 Media Library

#### Why It Matters
You're generating AI images with Replicate, creating assets for clients, and storing brand materials. Right now these are scattered across local drives and chat histories. A centralized media library means anyone on the team (or AI assistants) can instantly find any asset.

#### Features

**Media Upload & Storage** (P0)
- Upload images, videos, documents, PDFs
- Drag-and-drop upload
- Organize by folders / tags
- Link media to clients and projects
- Preview thumbnails for images/video
- Storage in Supabase Storage buckets

**AI Generations** (P1)
- Gallery of Replicate-generated images
- Store prompt, model, parameters alongside each generation
- Regenerate with modified parameters
- Mark favorites, send to client

**Client Brand Assets** (P0)
- Per-client folder for logos, brand guidelines, colors, fonts
- Version history on assets
- Quick copy/download

#### Data Model

```
media
├── id (uuid, PK)
├── name (text, NOT NULL)
├── file_name (text)
├── file_type (text) -- image/png, video/mp4, etc.
├── file_size (bigint) -- bytes
├── storage_path (text, NOT NULL) -- Supabase Storage path
├── url (text) -- public or signed URL
├── thumbnail_url (text)
├── client_id (uuid, FK → clients.id, nullable)
├── project_id (uuid, FK → projects.id, nullable)
├── folder (text) -- virtual folder path
├── tags (text[])
├── metadata (jsonb) -- dimensions, duration, etc.
├── is_ai_generated (boolean, default false)
├── ai_prompt (text)
├── ai_model (text)
├── ai_parameters (jsonb)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── uploaded_by (uuid, FK → team_members.id)
```

#### UI Components
- Grid/list view toggle for media browsing
- Upload dropzone (drag-and-drop with progress)
- Media detail modal (preview, metadata, linked entities)
- Filter by: client, project, type, tags, AI-generated
- Folder tree sidebar
- Replicate generation form (prompt → generate → save)
- Bulk operations (tag, move, delete)

#### Integration Points
- **Supabase Storage**: File storage backend
- **Replicate**: AI image generation, store results
- **Client Portal**: Share approved assets with clients

---

### 4.7 Communication Center

#### Why It Matters
You're talking to clients via email, SMS, and AI phone calls. Without a unified view, context gets lost and things fall through cracks. The Communication Center is your unified inbox — every touchpoint in one place.

#### Features

**Email (Resend)** (P0)
- Send emails from dashboard (via Resend API)
- Email templates with variable substitution ({{client_name}}, {{project_name}}, etc.)
- Send history with open/click tracking (Resend webhooks)
- Scheduled sends
- Bulk emails for announcements

**SMS (Twilio)** (P1)
- Send/receive SMS from dashboard
- Conversation view per contact
- SMS templates
- Auto-SMS triggers (e.g., invoice sent, appointment reminder)

**Call Transcripts (Bland AI)** (P1)
- Store transcripts from Bland AI calls
- Call summaries (AI-generated)
- Sentiment analysis per call
- Action items extracted from calls

**Unified Inbox** (P1)
- All communications in one timeline per client
- Filter by channel (email, SMS, call)
- Quick reply from inbox

#### Data Model

```
emails
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id, nullable)
├── contact_id (uuid, FK → client_contacts.id, nullable)
├── direction (enum: outbound, inbound)
├── from_email (text)
├── to_email (text)
├── cc (text[])
├── bcc (text[])
├── subject (text)
├── body_html (text)
├── body_text (text)
├── template_id (uuid, FK → email_templates.id, nullable)
├── status (enum: draft, queued, sent, delivered, opened, clicked, bounced, failed)
├── resend_id (text)
├── opened_at (timestamptz)
├── clicked_at (timestamptz)
├── scheduled_for (timestamptz)
├── sent_at (timestamptz)
├── metadata (jsonb)
├── created_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

email_templates
├── id (uuid, PK)
├── name (text, NOT NULL)
├── subject (text)
├── body_html (text)
├── body_text (text)
├── variables (text[]) -- list of {{variable}} names
├── category (enum: invoice, follow_up, onboarding, update, marketing, custom)
├── is_active (boolean, default true)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

sms_messages
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id, nullable)
├── contact_id (uuid, FK → client_contacts.id, nullable)
├── direction (enum: outbound, inbound)
├── from_number (text)
├── to_number (text)
├── body (text)
├── status (enum: queued, sent, delivered, failed, received)
├── twilio_sid (text)
├── sent_at (timestamptz)
├── created_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

call_logs
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id, nullable)
├── contact_id (uuid, FK → client_contacts.id, nullable)
├── direction (enum: outbound, inbound)
├── phone_number (text)
├── duration_seconds (integer)
├── status (enum: completed, no_answer, busy, failed, voicemail)
├── transcript (text)
├── summary (text)
├── sentiment (enum: positive, neutral, negative)
├── action_items (jsonb)
├── bland_call_id (text)
├── recording_url (text)
├── called_at (timestamptz)
├── created_at (timestamptz)
└── created_by (uuid, FK → team_members.id)
```

#### UI Components
- Unified inbox (3-column: contacts | conversation | detail)
- Email composer with template picker and variable substitution
- SMS chat interface
- Call log list with expandable transcript
- Template manager (CRUD with preview)
- Communication timeline on client profile
- Quick-compose floating button

#### Integration Points
- **Resend**: Send emails, track delivery/opens via webhooks
- **Twilio**: Send/receive SMS
- **Bland AI**: Initiate calls, receive transcripts via webhook
- **n8n**: Automated email sequences, SMS triggers
- **AI Insights**: Sentiment analysis, action item extraction from calls

---

### 4.8 Proposal & Contract System

#### Why It Matters
Professional proposals close deals faster. At $4,500+, clients expect polished proposals. Right now, you're probably using Google Docs or PDFs created ad-hoc. A built-in proposal system means consistent branding, faster creation, and tracking (did they open it?).

#### Features

**Proposal Builder** (P0)
- Rich text editor for proposal content
- Sections: Executive Summary, Scope, Timeline, Pricing, Terms
- Drag-and-drop section reordering
- Pricing table with line items
- Insert media from Media Library
- Client-facing shareable link

**Proposal Templates** (P1)
- Pre-built templates for common project types
- Clone and customize per deal
- AI-assisted content generation ("Generate executive summary for a sneaker platform AI build")

**Contract Management** (P1)
- Attach contracts to proposals/projects
- Version tracking
- Status: Draft → Sent → Signed → Expired
- Simple e-signature (type name + date, or embed DocuSign/HelloSign later)

**Tracking** (P0)
- View tracking (when client opens proposal)
- Time spent on proposal
- Comments from client (via client portal)

#### Data Model

```
proposals
├── id (uuid, PK)
├── title (text, NOT NULL)
├── client_id (uuid, FK → clients.id)
├── lead_id (uuid, FK → leads.id, nullable)
├── project_id (uuid, FK → projects.id, nullable)
├── status (enum: draft, sent, viewed, accepted, declined, expired)
├── content (jsonb) -- structured sections
├── pricing_items (jsonb) -- line items array
├── total_value (numeric)
├── valid_until (date)
├── share_token (text, UNIQUE) -- for shareable link
├── sent_at (timestamptz)
├── viewed_at (timestamptz)
├── accepted_at (timestamptz)
├── declined_at (timestamptz)
├── template_id (uuid, FK → proposal_templates.id, nullable)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

proposal_templates
├── id (uuid, PK)
├── name (text, NOT NULL)
├── description (text)
├── content (jsonb)
├── pricing_items (jsonb)
├── is_active (boolean, default true)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

contracts
├── id (uuid, PK)
├── proposal_id (uuid, FK → proposals.id, nullable)
├── project_id (uuid, FK → projects.id, nullable)
├── client_id (uuid, FK → clients.id)
├── title (text, NOT NULL)
├── content (text) -- contract body
├── status (enum: draft, sent, signed, expired, cancelled)
├── version (integer, default 1)
├── file_url (text) -- PDF in storage
├── signed_at (timestamptz)
├── signed_by (text)
├── signature_data (jsonb) -- typed name, IP, timestamp
├── expires_at (date)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)
```

#### UI Components
- Proposal builder with live preview (split pane)
- Template gallery with thumbnails
- Pricing table editor
- Proposal list with status indicators
- Client-facing proposal page (public, branded)
- Contract upload/editor
- Signature capture component

#### Integration Points
- **Resend**: Send proposals to clients
- **Media Library**: Embed images in proposals
- **AI Insights**: Suggest pricing based on project type/client history
- **Client Portal**: Client views/accepts proposals

---

### 4.9 Calendar & Scheduling

#### Why It Matters
You run on Cal.com for bookings but need internal visibility into all team schedules, project deadlines, and follow-up reminders. Calendar is the coordination layer.

#### Features

**Booking Management** (P0)
- View Cal.com bookings in dashboard
- Sync events bidirectionally
- Meeting details with client/lead link

**Meeting Prep** (P1)
- Auto-generate meeting prep notes: client summary, recent interactions, open items, suggested talking points
- Pre-meeting checklist

**Follow-up Reminders** (P0)
- After-meeting auto-remind to log notes and set follow-up
- Customizable follow-up intervals (1 day, 3 days, 1 week)

**Event Types** (P0)
- Calendar event categories: Meeting, Deadline, Follow-up, Internal, Personal
- Color-coded by type
- Project/client association

#### Data Model

```
calendar_events
├── id (uuid, PK)
├── title (text, NOT NULL)
├── description (text)
├── type (enum: meeting, deadline, follow_up, internal, personal, booking)
├── start_time (timestamptz, NOT NULL)
├── end_time (timestamptz)
├── all_day (boolean, default false)
├── location (text) -- URL or physical
├── client_id (uuid, FK → clients.id, nullable)
├── lead_id (uuid, FK → leads.id, nullable)
├── project_id (uuid, FK → projects.id, nullable)
├── cal_com_booking_id (text)
├── attendees (jsonb) -- [{name, email}]
├── meeting_notes (text)
├── prep_notes (text) -- AI-generated
├── follow_up_date (date)
├── is_completed (boolean, default false)
├── recurrence (jsonb) -- recurrence rules
├── metadata (jsonb)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)
```

#### UI Components
- Monthly/weekly/daily calendar view
- Event detail modal with linked entities
- Quick-add event with smart parsing
- Meeting prep panel (sidebar on event detail)
- Follow-up reminder badges
- Mini calendar on overview page
- Today's agenda widget

#### Integration Points
- **Cal.com**: Sync bookings via API/webhooks
- **n8n**: Follow-up reminder triggers, meeting prep generation
- **AI Insights**: Auto-generate meeting prep notes
- **Resend**: Send meeting confirmations/follow-ups

---

### 4.10 Reporting & Analytics

#### Why It Matters
You can't improve what you don't measure. Reports turn data into decisions. Revenue trends, project profitability, client lifetime value — this is how you scale from 2 clients to 20.

#### Features

**Revenue Reports** (P0)
- Monthly/quarterly/annual revenue
- MRR trend
- Revenue by client, project type, source
- Revenue growth rate
- Revenue forecast vs. actual

**Client Reports** (P1)
- Client Lifetime Value (CLV)
- Acquisition cost by source
- Retention rate
- Health score distribution

**Project Reports** (P1)
- Project profitability (revenue vs. time invested)
- On-time delivery rate
- Average project duration by type
- Scope creep indicator (planned vs. actual hours)

**Team Productivity** (P2)
- Hours logged per team member
- Tasks completed per week
- Response time to leads/clients

#### Data Model

No additional tables needed — reports are computed views over existing data. Add:

```
report_snapshots
├── id (uuid, PK)
├── type (text) -- 'monthly_revenue', 'client_health', etc.
├── period (text) -- '2026-02', 'Q1-2026', etc.
├── data (jsonb) -- snapshot of computed metrics
├── generated_at (timestamptz)
└── created_at (timestamptz)
```

#### UI Components
- Report dashboard with key metrics cards
- Interactive charts (line, bar, pie, funnel)
- Date range picker for all reports
- Export to CSV/PDF
- Comparison view (this month vs. last month)
- Report scheduler (auto-generate weekly/monthly)

#### Integration Points
- **n8n**: Scheduled report generation and email delivery
- **Resend**: Email report summaries
- **AI Insights**: Narrative summaries of reports ("Revenue grew 23% this month, driven by...")

---

### 4.11 Task & Workflow Automation

#### Why It Matters
With a 4-person team (2 human, 2 AI), automation is how you punch above your weight. Every manual repetitive action should be automated. Follow-up emails, invoice reminders, task creation — automate it all.

#### Features

**Task Management** (P0)
- Tasks linked to projects, clients, or standalone
- Assignee (team member or AI assistant)
- Priority, due date, status
- Subtasks / checklists
- Comments and attachments

**Recurring Tasks** (P1)
- Define tasks that auto-create on schedule (daily, weekly, monthly)
- Examples: "Send weekly client update", "Review accounts receivable", "Check project deadlines"

**Workflow Automations** (P1)
- Trigger → Condition → Action chains
- Triggers: New lead, invoice overdue, milestone completed, health score drop, etc.
- Actions: Send email, create task, update status, send SMS, notify team, call via Bland
- Visual workflow builder (stretch goal) or config-based

#### Data Model

```
tasks
├── id (uuid, PK)
├── title (text, NOT NULL)
├── description (text)
├── status (enum: todo, in_progress, done, cancelled)
├── priority (enum: low, medium, high, urgent)
├── project_id (uuid, FK → projects.id, nullable)
├── client_id (uuid, FK → clients.id, nullable)
├── assigned_to (uuid, FK → team_members.id, nullable)
├── due_date (date)
├── completed_at (timestamptz)
├── parent_task_id (uuid, FK → tasks.id, nullable) -- subtasks
├── sort_order (integer)
├── tags (text[])
├── is_recurring (boolean, default false)
├── recurrence_rule (jsonb) -- {frequency, interval, days, etc.}
├── next_recurrence_date (date)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

task_comments
├── id (uuid, PK)
├── task_id (uuid, FK → tasks.id)
├── content (text, NOT NULL)
├── attachments (jsonb)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

automations
├── id (uuid, PK)
├── name (text, NOT NULL)
├── description (text)
├── trigger_type (enum: event, schedule, manual)
├── trigger_config (jsonb) -- {event: 'invoice.overdue', conditions: [...]}
├── actions (jsonb) -- [{type: 'send_email', config: {...}}, ...]
├── is_active (boolean, default true)
├── last_run_at (timestamptz)
├── run_count (integer, default 0)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

automation_logs
├── id (uuid, PK)
├── automation_id (uuid, FK → automations.id)
├── status (enum: success, failure, skipped)
├── trigger_data (jsonb)
├── actions_executed (jsonb)
├── error_message (text)
├── executed_at (timestamptz)
└── created_at (timestamptz)
```

#### UI Components
- Task list with filters (My Tasks, All Tasks, by project, by client)
- Task detail with subtask checklist, comments, attachments
- Kanban board for tasks (Todo → In Progress → Done)
- Automation list with on/off toggles
- Automation builder (form-based trigger/action config)
- Automation run history log
- Recurring task setup modal

#### Integration Points
- **n8n**: Execute complex automations, scheduled jobs
- **Resend**: Email actions
- **Twilio**: SMS actions
- **Bland AI**: Phone call actions
- **All modules**: Trigger events when data changes

---

### 4.12 Team Collaboration

#### Why It Matters
Kyle, Aidan, Vantix AI, and Botskii AI all need to stay in sync. Shared context reduces mistakes and speeds up execution.

#### Features

**Activity Feed** (P0)
- Real-time feed of all activity: new clients, closed deals, completed tasks, sent invoices, etc.
- Filterable by team member, entity type
- @mentions to notify specific team members

**Internal Notes** (P0)
- Notes attached to any entity (client, project, lead, etc.)
- Rich text with formatting
- @mentions and link embedding

**Shared Documents** (P2)
- Simple doc editor for SOPs, meeting notes, plans
- Organized by category
- Version history

#### Data Model

```
activity_feed
├── id (uuid, PK)
├── actor_id (uuid, FK → team_members.id)
├── action (text) -- 'created', 'updated', 'completed', 'sent', etc.
├── entity_type (text) -- 'client', 'project', 'task', 'invoice', etc.
├── entity_id (uuid)
├── entity_name (text) -- for display without lookup
├── description (text) -- human-readable description
├── metadata (jsonb)
├── created_at (timestamptz)

notes
├── id (uuid, PK)
├── content (text, NOT NULL)
├── entity_type (text) -- 'client', 'project', 'lead', etc.
├── entity_id (uuid)
├── is_pinned (boolean, default false)
├── mentions (uuid[]) -- team member IDs
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

documents
├── id (uuid, PK)
├── title (text, NOT NULL)
├── content (text)
├── category (enum: sop, meeting_notes, planning, reference, other)
├── tags (text[])
├── is_published (boolean, default true)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

team_members
├── id (uuid, PK)
├── user_id (uuid, FK → auth.users.id, nullable) -- null for AI members
├── name (text, NOT NULL)
├── email (text)
├── role (enum: admin, member, ai_assistant, client)
├── avatar_url (text)
├── is_ai (boolean, default false)
├── is_active (boolean, default true)
├── preferences (jsonb)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

#### UI Components
- Activity feed (real-time updating list)
- Note editor (inline on entity pages)
- @mention autocomplete
- Document editor with toolbar
- Team member avatars/badges

#### Integration Points
- **Supabase Realtime**: Live activity feed updates
- **Notification System**: @mention triggers notification

---

### 4.13 Client Portal

#### Why It Matters
Clients paying $4,500+ want to see what's happening with their project without emailing you. A client portal signals professionalism and reduces "Hey, what's the status?" messages by 80%.

#### Features

**Project Status View** (P0)
- Client sees their active projects, milestones, progress
- Timeline of completed deliverables

**Invoice & Payment View** (P0)
- View invoices and payment history
- Pay invoices (link to payment)

**File Sharing** (P1)
- Access approved deliverables and assets
- Download files shared by team

**Proposal View** (P1)
- View and accept/decline proposals
- Comment on proposals

**Communication** (P2)
- Simple message thread with team
- Request support

#### Data Model

No new tables — client portal uses existing tables with RLS policies scoped to the client's user. Additional:

```
client_portal_users
├── id (uuid, PK)
├── client_id (uuid, FK → clients.id)
├── user_id (uuid, FK → auth.users.id) -- Supabase auth user
├── email (text, NOT NULL)
├── name (text)
├── is_active (boolean, default true)
├── last_login_at (timestamptz)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

#### UI Components
- Simplified dashboard (client's projects only)
- Project timeline view
- Invoice list with status
- File browser (approved files only)
- Proposal viewer with accept/decline buttons
- Branded portal (Vantix logo, client's name)

#### Integration Points
- **Supabase Auth**: Magic link login for clients
- **Resend**: Portal invitation emails
- **RLS**: All data access scoped to client's records

---

### 4.14 Knowledge Base

#### Why It Matters
Internal knowledge shouldn't live in people's heads. Process documentation, client onboarding checklists, technical guides — everything should be searchable and accessible.

#### Features

**Internal Wiki** (P1)
- Hierarchical pages (categories → articles)
- Rich text editor
- Search across all articles

**Client Onboarding Docs** (P1)
- Standard onboarding checklist template
- Per-client customization
- Track onboarding progress

**Process Documentation** (P2)
- SOPs for common tasks
- Integration guides
- Troubleshooting docs

#### Data Model

```
knowledge_base_categories
├── id (uuid, PK)
├── name (text, NOT NULL)
├── slug (text, UNIQUE)
├── description (text)
├── icon (text)
├── sort_order (integer)
├── parent_id (uuid, FK → knowledge_base_categories.id, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

knowledge_base_articles
├── id (uuid, PK)
├── category_id (uuid, FK → knowledge_base_categories.id)
├── title (text, NOT NULL)
├── slug (text, UNIQUE)
├── content (text) -- markdown
├── excerpt (text)
├── tags (text[])
├── is_published (boolean, default true)
├── is_client_visible (boolean, default false)
├── views (integer, default 0)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)
```

#### UI Components
- Knowledge base browser (sidebar categories, main content)
- Article editor with markdown support
- Search with highlighted results
- Onboarding checklist component
- "Was this helpful?" feedback

#### Integration Points
- **Client Portal**: Client-visible articles
- **AI Insights**: Suggest relevant articles during client/project work

---

### 4.15 Settings & Integrations

#### Why It Matters
Clean settings = fewer bugs, faster onboarding of new tools, and auditability. Every API key, webhook, and preference in one place.

#### Features

**General Settings** (P0)
- Company info (name, logo, address)
- Default currency, timezone
- Invoice numbering format
- Notification preferences

**API Key Management** (P0)
- View/rotate API keys for integrations
- Test connection buttons
- Last used timestamps
- Encrypted storage

**Webhook Configuration** (P1)
- Manage incoming/outgoing webhooks
- Webhook logs with payload inspection
- Retry failed webhooks

**Team Management** (P0)
- Add/remove team members
- Role assignment
- Activity audit log

#### Data Model

```
settings
├── id (uuid, PK)
├── key (text, UNIQUE, NOT NULL)
├── value (jsonb, NOT NULL)
├── category (text) -- 'general', 'invoicing', 'notifications', etc.
├── updated_at (timestamptz)
└── updated_by (uuid, FK → team_members.id)

integration_configs
├── id (uuid, PK)
├── name (text, NOT NULL) -- 'resend', 'twilio', 'bland_ai', etc.
├── config (jsonb) -- encrypted API keys, endpoints, etc.
├── is_active (boolean, default true)
├── last_tested_at (timestamptz)
├── last_test_status (enum: success, failure, untested)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── updated_by (uuid, FK → team_members.id)

webhook_configs
├── id (uuid, PK)
├── name (text, NOT NULL)
├── url (text, NOT NULL)
├── direction (enum: incoming, outgoing)
├── events (text[]) -- event types this webhook handles
├── secret (text) -- webhook signing secret
├── is_active (boolean, default true)
├── last_triggered_at (timestamptz)
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── created_by (uuid, FK → team_members.id)

webhook_logs
├── id (uuid, PK)
├── webhook_id (uuid, FK → webhook_configs.id)
├── direction (enum: incoming, outgoing)
├── event (text)
├── payload (jsonb)
├── response_status (integer)
├── response_body (text)
├── status (enum: success, failure, pending)
├── retries (integer, default 0)
├── created_at (timestamptz)

audit_log
├── id (uuid, PK)
├── actor_id (uuid, FK → team_members.id)
├── action (text)
├── entity_type (text)
├── entity_id (uuid)
├── old_values (jsonb)
├── new_values (jsonb)
├── ip_address (text)
├── user_agent (text)
├── created_at (timestamptz)
```

#### UI Components
- Settings page with tabbed sections
- API key cards with masked values and copy button
- Integration status indicators (green/red dot)
- Test connection button with result toast
- Webhook list with log viewer
- Team member management table
- Audit log table with filters

#### Integration Points
- All external services configured here
- **Supabase Vault**: Encrypted secret storage (or encrypt in app layer)

---

### 4.16 Notification System

#### Why It Matters
With 2 humans and 2 AIs working asynchronously, the right notification at the right time prevents dropped balls. Too many notifications = noise. Priority-based routing ensures critical alerts always land.

#### Features

**In-App Notifications** (P0)
- Real-time notification bell with unread count
- Notification dropdown with categories
- Click to navigate to relevant entity
- Mark as read / mark all read

**Email Digests** (P1)
- Daily summary of important events
- Configurable frequency (real-time, daily, weekly)
- Per-user preferences

**Priority Routing** (P1)
- Critical: In-app + email + SMS immediately
- High: In-app + email immediately
- Medium: In-app immediately, email digest
- Low: In-app only

#### Data Model

```
notifications
├── id (uuid, PK)
├── recipient_id (uuid, FK → team_members.id)
├── type (text) -- 'invoice_overdue', 'lead_new', 'task_assigned', etc.
├── title (text, NOT NULL)
├── message (text)
├── priority (enum: low, medium, high, critical)
├── entity_type (text)
├── entity_id (uuid)
├── link (text) -- dashboard URL to navigate to
├── is_read (boolean, default false)
├── read_at (timestamptz)
├── channels_sent (text[]) -- ['in_app', 'email', 'sms']
├── created_at (timestamptz)

notification_preferences
├── id (uuid, PK)
├── team_member_id (uuid, FK → team_members.id)
├── notification_type (text) -- matches notifications.type
├── in_app (boolean, default true)
├── email (boolean, default true)
├── sms (boolean, default false)
├── email_digest (enum: realtime, daily, weekly, never)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

#### UI Components
- Notification bell icon with badge count
- Notification dropdown (grouped by date)
- Notification center page (full list, filters)
- Notification preferences matrix (type × channel)
- Toast notifications for real-time alerts

#### Integration Points
- **Supabase Realtime**: Push notifications to connected clients
- **Resend**: Email notifications and digests
- **Twilio**: SMS for critical alerts
- **n8n**: Digest generation and delivery

---

## 5. Complete Supabase SQL Migration

```sql
-- ============================================================
-- VANTIX DASHBOARD - COMPLETE SQL MIGRATION
-- Run this AFTER the plan is approved
-- Supabase Project: obprrtqyzpaudfeyftyd.supabase.co
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

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

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Team Members
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

-- Clients
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

-- Client Contacts
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

-- Client Health History
CREATE TABLE client_health_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  factors jsonb DEFAULT '{}',
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Projects
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

-- Milestones
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

-- Deliverables
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

-- Time Entries
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id uuid,  -- FK added after tasks table
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

-- Invoices
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

-- Invoice Items
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

-- Payments
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

-- Expenses
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

-- Leads
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

-- Lead Activities
CREATE TABLE lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type lead_activity_type NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

-- AI Insights
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

-- AI Daily Briefings
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

-- Media
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

-- Emails
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
  template_id uuid,  -- FK added after email_templates
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

-- Email Templates
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

-- Add FK for emails.template_id
ALTER TABLE emails ADD CONSTRAINT emails_template_id_fkey
  FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

-- SMS Messages
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

-- Call Logs
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

-- Proposals
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
  template_id uuid,  -- FK added after proposal_templates
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

-- Proposal Templates
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

-- Contracts
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

-- Calendar Events
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

-- Tasks
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

-- Add FK for time_entries.task_id
ALTER TABLE time_entries ADD CONSTRAINT time_entries_task_id_fkey
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL;

-- Task Comments
CREATE TABLE task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES team_members(id)
);

-- Automations
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

-- Automation Logs
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

-- Activity Feed
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

-- Notes
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

-- Documents
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

-- Client Portal Users
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

-- Knowledge Base Categories
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

-- Knowledge Base Articles
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

-- Report Snapshots
CREATE TABLE report_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  period text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Settings
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES team_members(id)
);

-- Integration Configs
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

-- Webhook Configs
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

-- Webhook Logs
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

-- Audit Log
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

-- Notifications
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

-- Notification Preferences
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

-- ============================================================
-- INDEXES
-- ============================================================

-- Clients
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_health_score ON clients(health_score);
CREATE INDEX idx_clients_created_at ON clients(created_at);

-- Client Contacts
CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);
CREATE INDEX idx_client_contacts_email ON client_contacts(email);

-- Projects
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Milestones
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);

-- Deliverables
CREATE INDEX idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX idx_deliverables_milestone_id ON deliverables(milestone_id);

-- Time Entries
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_team_member_id ON time_entries(team_member_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);

-- Invoices
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_is_recurring ON invoices(is_recurring) WHERE is_recurring = true;

-- Payments
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Expenses
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_project_id ON expenses(project_id);

-- Leads
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- Lead Activities
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(type);

-- AI Insights
CREATE INDEX idx_ai_insights_type ON ai_insights(type);
CREATE INDEX idx_ai_insights_category ON ai_insights(category);
CREATE INDEX idx_ai_insights_entity ON ai_insights(entity_type, entity_id);
CREATE INDEX idx_ai_insights_is_read ON ai_insights(is_read) WHERE is_read = false;
CREATE INDEX idx_ai_insights_priority ON ai_insights(priority);

-- Media
CREATE INDEX idx_media_client_id ON media(client_id);
CREATE INDEX idx_media_project_id ON media(project_id);
CREATE INDEX idx_media_is_ai_generated ON media(is_ai_generated);
CREATE INDEX idx_media_folder ON media(folder);

-- Emails
CREATE INDEX idx_emails_client_id ON emails(client_id);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_created_at ON emails(created_at);

-- SMS Messages
CREATE INDEX idx_sms_messages_client_id ON sms_messages(client_id);

-- Call Logs
CREATE INDEX idx_call_logs_client_id ON call_logs(client_id);

-- Proposals
CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_share_token ON proposals(share_token);

-- Calendar Events
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_client_id ON calendar_events(client_id);
CREATE INDEX idx_calendar_events_type ON calendar_events(type);

-- Tasks
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);

-- Activity Feed
CREATE INDEX idx_activity_feed_entity ON activity_feed(entity_type, entity_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_actor_id ON activity_feed(actor_id);

-- Notes
CREATE INDEX idx_notes_entity ON notes(entity_type, entity_id);

-- Notifications
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Knowledge Base Articles
CREATE INDEX idx_kb_articles_category_id ON knowledge_base_articles(category_id);
CREATE INDEX idx_kb_articles_slug ON knowledge_base_articles(slug);

-- Audit Log
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- Webhook Logs
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

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

-- Helper function: check if user is a team member
CREATE OR REPLACE FUNCTION is_team_member()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: get client_id for portal user
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

-- =====================
-- TEAM MEMBER POLICIES (full access for team members)
-- =====================

-- Generic policy pattern for team members: full CRUD
-- Applied to all internal tables

-- Clients
CREATE POLICY "Team members can view all clients" ON clients FOR SELECT USING (is_team_member());
CREATE POLICY "Team members can create clients" ON clients FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team members can update clients" ON clients FOR UPDATE USING (is_team_member());
CREATE POLICY "Admins can delete clients" ON clients FOR DELETE USING (is_admin());

-- Client Contacts
CREATE POLICY "Team: select client_contacts" ON client_contacts FOR SELECT USING (is_team_member());
CREATE POLICY "Team: insert client_contacts" ON client_contacts FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team: update client_contacts" ON client_contacts FOR UPDATE USING (is_team_member());
CREATE POLICY "Team: delete client_contacts" ON client_contacts FOR DELETE USING (is_team_member());

-- Projects
CREATE POLICY "Team: select projects" ON projects FOR SELECT USING (is_team_member());
CREATE POLICY "Team: insert projects" ON projects FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team: update projects" ON projects FOR UPDATE USING (is_team_member());
CREATE POLICY "Admin: delete projects" ON projects FOR DELETE USING (is_admin());

-- Milestones
CREATE POLICY "Team: all milestones" ON milestones FOR ALL USING (is_team_member());

-- Deliverables
CREATE POLICY "Team: all deliverables" ON deliverables FOR ALL USING (is_team_member());

-- Time Entries
CREATE POLICY "Team: all time_entries" ON time_entries FOR ALL USING (is_team_member());

-- Invoices
CREATE POLICY "Team: select invoices" ON invoices FOR SELECT USING (is_team_member());
CREATE POLICY "Team: insert invoices" ON invoices FOR INSERT WITH CHECK (is_team_member());
CREATE POLICY "Team: update invoices" ON invoices FOR UPDATE USING (is_team_member());
CREATE POLICY "Admin: delete invoices" ON invoices FOR DELETE USING (is_admin());

-- Invoice Items
CREATE POLICY "Team: all invoice_items" ON invoice_items FOR ALL USING (is_team_member());

-- Payments
CREATE POLICY "Team: all payments" ON payments FOR ALL USING (is_team_member());

-- Expenses
CREATE POLICY "Team: all expenses" ON expenses FOR ALL USING (is_team_member());

-- Leads
CREATE POLICY "Team: all leads" ON leads FOR ALL USING (is_team_member());

-- Lead Activities
CREATE POLICY "Team: all lead_activities" ON lead_activities FOR ALL USING (is_team_member());

-- AI Insights
CREATE POLICY "Team: all ai_insights" ON ai_insights FOR ALL USING (is_team_member());

-- AI Daily Briefings
CREATE POLICY "Team: all ai_daily_briefings" ON ai_daily_briefings FOR ALL USING (is_team_member());

-- Media
CREATE POLICY "Team: all media" ON media FOR ALL USING (is_team_member());

-- Emails
CREATE POLICY "Team: all emails" ON emails FOR ALL USING (is_team_member());

-- Email Templates
CREATE POLICY "Team: all email_templates" ON email_templates FOR ALL USING (is_team_member());

-- SMS Messages
CREATE POLICY "Team: all sms_messages" ON sms_messages FOR ALL USING (is_team_member());

-- Call Logs
CREATE POLICY "Team: all call_logs" ON call_logs FOR ALL USING (is_team_member());

-- Proposals
CREATE POLICY "Team: all proposals" ON proposals FOR ALL USING (is_team_member());

-- Proposal Templates
CREATE POLICY "Team: all proposal_templates" ON proposal_templates FOR ALL USING (is_team_member());

-- Contracts
CREATE POLICY "Team: all contracts" ON contracts FOR ALL USING (is_team_member());

-- Calendar Events
CREATE POLICY "Team: all calendar_events" ON calendar_events FOR ALL USING (is_team_member());

-- Tasks
CREATE POLICY "Team: all tasks" ON tasks FOR ALL USING (is_team_member());

-- Task Comments
CREATE POLICY "Team: all task_comments" ON task_comments FOR ALL USING (is_team_member());

-- Automations
CREATE POLICY "Team: all automations" ON automations FOR ALL USING (is_team_member());

-- Automation Logs
CREATE POLICY "Team: all automation_logs" ON automation_logs FOR ALL USING (is_team_member());

-- Activity Feed
CREATE POLICY "Team: all activity_feed" ON activity_feed FOR ALL USING (is_team_member());

-- Notes
CREATE POLICY "Team: all notes" ON notes FOR ALL USING (is_team_member());

-- Documents
CREATE POLICY "Team: all documents" ON documents FOR ALL USING (is_team_member());

-- Team Members
CREATE POLICY "Team: select team_members" ON team_members FOR SELECT USING (is_team_member());
CREATE POLICY "Admin: manage team_members" ON team_members FOR ALL USING (is_admin());

-- Client Portal Users
CREATE POLICY "Team: all client_portal_users" ON client_portal_users FOR ALL USING (is_team_member());

-- Knowledge Base
CREATE POLICY "Team: all kb_categories" ON knowledge_base_categories FOR ALL USING (is_team_member());
CREATE POLICY "Team: all kb_articles" ON knowledge_base_articles FOR ALL USING (is_team_member());

-- Report Snapshots
CREATE POLICY "Team: all report_snapshots" ON report_snapshots FOR ALL USING (is_team_member());

-- Settings
CREATE POLICY "Team: select settings" ON settings FOR SELECT USING (is_team_member());
CREATE POLICY "Admin: manage settings" ON settings FOR ALL USING (is_admin());

-- Integration Configs
CREATE POLICY "Admin: all integration_configs" ON integration_configs FOR ALL USING (is_admin());

-- Webhook Configs
CREATE POLICY "Admin: all webhook_configs" ON webhook_configs FOR ALL USING (is_admin());

-- Webhook Logs
CREATE POLICY "Team: select webhook_logs" ON webhook_logs FOR SELECT USING (is_team_member());

-- Audit Log
CREATE POLICY "Admin: select audit_log" ON audit_log FOR SELECT USING (is_admin());
CREATE POLICY "Team: insert audit_log" ON audit_log FOR INSERT WITH CHECK (is_team_member());

-- Notifications
CREATE POLICY "Users: own notifications" ON notifications FOR SELECT
  USING (recipient_id IN (SELECT id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "Users: update own notifications" ON notifications FOR UPDATE
  USING (recipient_id IN (SELECT id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "Team: insert notifications" ON notifications FOR INSERT WITH CHECK (is_team_member());

-- Notification Preferences
CREATE POLICY "Users: own notification_preferences" ON notification_preferences FOR ALL
  USING (team_member_id IN (SELECT id FROM team_members WHERE user_id = auth.uid()));

-- =====================
-- CLIENT PORTAL POLICIES
-- =====================

-- Clients can see their own company
CREATE POLICY "Portal: view own client" ON clients FOR SELECT
  USING (id = get_portal_client_id());

-- Portal: view own projects
CREATE POLICY "Portal: view own projects" ON projects FOR SELECT
  USING (client_id = get_portal_client_id());

-- Portal: view own invoices
CREATE POLICY "Portal: view own invoices" ON invoices FOR SELECT
  USING (client_id = get_portal_client_id());

-- Portal: view own proposals
CREATE POLICY "Portal: view own proposals" ON proposals FOR SELECT
  USING (client_id = get_portal_client_id());

-- Portal: view own contracts
CREATE POLICY "Portal: view own contracts" ON contracts FOR SELECT
  USING (client_id = get_portal_client_id());

-- Portal: view own deliverables
CREATE POLICY "Portal: view own deliverables" ON deliverables FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE client_id = get_portal_client_id()));

-- Portal: view own media
CREATE POLICY "Portal: view own media" ON media FOR SELECT
  USING (client_id = get_portal_client_id());

-- Portal: view published KB articles marked client-visible
CREATE POLICY "Portal: view kb articles" ON knowledge_base_articles FOR SELECT
  USING (is_published = true AND is_client_visible = true);

-- Public: view proposals by share token (handled in app layer, not RLS)

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
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

-- Generate next invoice number
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

-- Calculate client health score
CREATE OR REPLACE FUNCTION calculate_client_health_score(p_client_id uuid)
RETURNS integer AS $$
DECLARE
  payment_score integer := 100;
  communication_score integer := 100;
  project_score integer := 100;
  engagement_score integer := 100;
  revenue_score integer := 100;
  total_score integer;
  last_payment_days integer;
  overdue_count integer;
  last_comm_days integer;
  active_projects integer;
  overdue_milestones integer;
BEGIN
  -- Payment timeliness (25%)
  SELECT COUNT(*) INTO overdue_count
  FROM invoices WHERE client_id = p_client_id AND status = 'overdue';
  IF overdue_count > 0 THEN
    payment_score := GREATEST(0, 100 - (overdue_count * 30));
  END IF;

  -- Communication frequency (20%)
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

  -- Project health (25%)
  SELECT COUNT(*) INTO overdue_milestones
  FROM milestones m
  JOIN projects p ON m.project_id = p.id
  WHERE p.client_id = p_client_id AND m.status = 'overdue';
  IF overdue_milestones > 0 THEN
    project_score := GREATEST(0, 100 - (overdue_milestones * 20));
  END IF;

  -- Weighted total
  total_score := (
    (payment_score * 25) +
    (communication_score * 20) +
    (project_score * 25) +
    (engagement_score * 15) +
    (revenue_score * 15)
  ) / 100;

  -- Update client
  UPDATE clients
  SET health_score = total_score, health_score_updated_at = now()
  WHERE id = p_client_id;

  -- Record history
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

-- Log activity helper
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

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Run these via Supabase dashboard or management API:
-- 1. Create bucket 'media' (public: false)
-- 2. Create bucket 'invoices' (public: false)
-- 3. Create bucket 'receipts' (public: false)
-- 4. Create bucket 'contracts' (public: false)
-- 5. Create bucket 'avatars' (public: true)

-- Storage policies (example for media bucket):
-- Team members can upload/read from media bucket
-- Client portal users can read their client's media

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert team members
INSERT INTO team_members (name, email, role, is_ai) VALUES
  ('Kyle', 'kyle@usevantix.com', 'admin', false),
  ('Aidan', 'aidan@usevantix.com', 'admin', false),
  ('Vantix AI', 'ai@usevantix.com', 'ai_assistant', true),
  ('Botskii AI', 'botskii@usevantix.com', 'ai_assistant', true);

-- Insert default settings
INSERT INTO settings (key, value, category) VALUES
  ('company_name', '"Vantix LLC"', 'general'),
  ('company_website', '"https://usevantix.com"', 'general'),
  ('default_currency', '"USD"', 'general'),
  ('timezone', '"America/New_York"', 'general'),
  ('invoice_prefix', '"VTX"', 'invoicing'),
  ('default_payment_terms_days', '30', 'invoicing'),
  ('default_tax_rate', '0', 'invoicing');

-- Insert default email templates
INSERT INTO email_templates (name, subject, body_html, variables, category) VALUES
  ('Invoice', 'Invoice {{invoice_number}} from Vantix LLC',
   '<h1>Invoice {{invoice_number}}</h1><p>Hi {{client_name}},</p><p>Please find your invoice for {{total}} attached.</p><p>Due date: {{due_date}}</p><p>Thank you for your business!</p><p>— Vantix Team</p>',
   ARRAY['invoice_number', 'client_name', 'total', 'due_date'], 'invoice'),
  ('Follow Up', 'Following up — {{subject}}',
   '<p>Hi {{client_name}},</p><p>Just wanted to follow up on {{subject}}. Let us know if you have any questions.</p><p>Best,<br>{{sender_name}}<br>Vantix LLC</p>',
   ARRAY['client_name', 'subject', 'sender_name'], 'follow_up'),
  ('Welcome / Onboarding', 'Welcome to Vantix! 🚀',
   '<h1>Welcome aboard, {{client_name}}!</h1><p>We''re excited to start working with you. Here''s what happens next:</p><ol><li>Kickoff call to align on goals</li><li>Project plan delivered within 48 hours</li><li>Development begins!</li></ol><p>Your client portal: <a href="https://usevantix.com/portal">usevantix.com/portal</a></p><p>— The Vantix Team</p>',
   ARRAY['client_name'], 'onboarding');

-- Insert existing clients
INSERT INTO clients (company_name, industry, status, client_since, notes) VALUES
  ('SecuredTampa', 'Retail / E-commerce', 'active', '2025-01-01', 'Dave''s sneaker & Pokemon card store. $4,500 AI build. Monthly maintenance $100.'),
  ('Just Four Kicks', 'B2B Wholesale / Sneakers', 'active', '2025-01-01', 'Kyle''s own B2B wholesale sneaker platform. Internal project.');
```

---

## 6. Environment Variables Checklist

```env
# ============================================================
# VANTIX DASHBOARD - ENVIRONMENT VARIABLES
# Set in Vercel Dashboard → Settings → Environment Variables
# ============================================================

# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=https://obprrtqyzpaudfeyftyd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# --- Resend (Email) ---
RESEND_API_KEY=<resend-api-key>
RESEND_FROM_EMAIL=hello@usevantix.com
# Note: Must verify domain in Resend dashboard first

# --- Twilio (SMS) ---
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE_NUMBER=<twilio-phone>

# --- Bland AI (Phone Agent) ---
BLAND_AI_API_KEY=<bland-ai-key>

# --- Replicate (AI Image Generation) ---
REPLICATE_API_TOKEN=<replicate-token>

# --- Cal.com (Scheduling) ---
CAL_COM_API_KEY=<cal-com-key>
CAL_COM_USERNAME=vantix

# --- OpenAI / Claude (AI Insights) ---
OPENAI_API_KEY=<openai-key>
# or
ANTHROPIC_API_KEY=<anthropic-key>

# --- Stripe (Payments - Future) ---
# STRIPE_SECRET_KEY=<stripe-secret>
# STRIPE_PUBLISHABLE_KEY=<stripe-publishable>
# STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>

# --- n8n (Automation) ---
N8N_WEBHOOK_BASE_URL=<n8n-instance-url>
N8N_API_KEY=<n8n-api-key>

# --- App Config ---
NEXT_PUBLIC_APP_URL=https://usevantix.com
NEXT_PUBLIC_APP_NAME=Vantix Dashboard
CRON_SECRET=<random-secret-for-cron-endpoints>

# --- Feature Flags ---
NEXT_PUBLIC_ENABLE_CLIENT_PORTAL=true
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=true
NEXT_PUBLIC_ENABLE_PHONE_AGENT=true
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2) — P0 Core
**Goal:** Replace localStorage with Supabase. Core CRM and project management working.

- [ ] Run SQL migration (all tables, indexes, RLS)
- [ ] Set up Supabase Auth (team members)
- [ ] Migrate existing localStorage data to Supabase
- [ ] **Clients**: List, detail page, contacts, notes
- [ ] **Projects**: List, detail page, status management
- [ ] **Tasks**: CRUD, assignment, status, project linking
- [ ] **Team Members**: Seed data, role-based access
- [ ] **Activity Feed**: Basic logging on CRUD operations
- [ ] **Settings**: General settings page

**Estimated effort:** 40-50 hours

### Phase 2: Revenue Engine (Weeks 3-4) — P0 Financial
**Goal:** Full invoicing and payment tracking. Know your money.

- [ ] **Invoices**: Builder, PDF generation, send via Resend
- [ ] **Invoice Items**: Line item management
- [ ] **Payments**: Recording, partial payments
- [ ] **Revenue Dashboard**: MRR, monthly revenue, by client
- [ ] **Accounts Receivable**: Aging report
- [ ] **Resend Integration**: Email sending, templates, webhooks

**Estimated effort:** 35-45 hours

### Phase 3: Lead Pipeline (Weeks 5-6) — P0/P1 Growth
**Goal:** Never lose a lead. Pipeline visibility and tracking.

- [ ] **Leads**: Kanban pipeline, detail page, activities
- [ ] **Lead Scoring**: Basic scoring algorithm
- [ ] **Source Attribution**: Track lead sources
- [ ] **Conversion Tracking**: Won/lost tracking
- [ ] **Cal.com Integration**: Auto-create leads from bookings

**Estimated effort:** 25-35 hours

### Phase 4: Communication Hub (Weeks 7-8) — P0/P1 Connectivity
**Goal:** Unified communication. Every touchpoint tracked.

- [ ] **Email**: Composer, templates, send history (Resend)
- [ ] **SMS**: Send/receive via Twilio
- [ ] **Call Logs**: Bland AI transcript storage
- [ ] **Unified Timeline**: Per-client communication history
- [ ] **Notification System**: In-app notifications

**Estimated effort:** 30-40 hours

### Phase 5: AI & Insights (Weeks 9-10) — P0/P1 Intelligence
**Goal:** AI-native dashboard. Insights everywhere.

- [ ] **Client Health Score**: Automated calculation
- [ ] **AI Daily Briefing**: Morning summary generation
- [ ] **Recommendations**: Smart suggestions
- [ ] **Revenue Predictions**: Forecast model
- [ ] **Inline Insights**: Badges on client/project cards

**Estimated effort:** 30-40 hours

### Phase 6: Media & Proposals (Weeks 11-12) — P1 Professional
**Goal:** Media library and proposal system. Look like a $100M company.

- [ ] **Media Library**: Upload, browse, organize, tag
- [ ] **Replicate Integration**: AI image generation + storage
- [ ] **Proposals**: Builder, templates, share links, tracking
- [ ] **Contracts**: Upload, versioning, basic signatures

**Estimated effort:** 30-40 hours

### Phase 7: Client Portal & Knowledge Base (Weeks 13-14) — P1 Client-Facing
**Goal:** Clients can self-serve. Less "what's the status?" emails.

- [ ] **Client Portal**: Auth (magic links), project view, invoice view, files
- [ ] **Knowledge Base**: Categories, articles, search
- [ ] **Onboarding Docs**: Templates for new clients

**Estimated effort:** 25-35 hours

### Phase 8: Automation & Polish (Weeks 15-16) — P1/P2 Scale
**Goal:** Automate repetitive work. Polish the experience.

- [ ] **Workflow Automations**: Trigger/action system
- [ ] **Recurring Tasks**: Auto-creation
- [ ] **Recurring Invoices**: Auto-generation
- [ ] **Calendar**: Full integration with Cal.com
- [ ] **Reports**: Advanced analytics, export
- [ ] **Time Tracking**: Timer widget, project profitability
- [ ] **Expense Tracking**: Full CRUD with receipts
- [ ] **Audit Log**: Track all changes
- [ ] **Dark mode polish**: Consistent design pass
- [ ] **Mobile responsiveness**: Full responsive cleanup

**Estimated effort:** 40-50 hours

---

## 8. Estimated Effort

| Phase | Focus | Hours | Calendar |
|-------|-------|-------|----------|
| 1 | Foundation (CRM, Projects, Tasks) | 40-50h | Weeks 1-2 |
| 2 | Revenue Engine (Invoices, Payments) | 35-45h | Weeks 3-4 |
| 3 | Lead Pipeline | 25-35h | Weeks 5-6 |
| 4 | Communication Hub | 30-40h | Weeks 7-8 |
| 5 | AI & Insights | 30-40h | Weeks 9-10 |
| 6 | Media & Proposals | 30-40h | Weeks 11-12 |
| 7 | Client Portal & KB | 25-35h | Weeks 13-14 |
| 8 | Automation & Polish | 40-50h | Weeks 15-16 |
| **Total** | | **255-335h** | **~16 weeks** |

> **Note:** With AI-assisted development (Cursor, Claude, Copilot), these estimates can be compressed by 40-60%. Realistically, a motivated builder (Kyle) with AI pair programming could ship Phase 1-3 in 4-6 weeks, not 6.

---

## Final Notes

### What Makes This a $100M Dashboard

1. **AI is ambient, not a feature.** Every page has intelligence baked in — health scores, predictions, smart suggestions. Your clients should feel like they're working with a team of 20.

2. **Revenue is always visible.** MRR in the sidebar, pipeline on the overview, outstanding invoices one click away. Money-awareness drives growth.

3. **Client-obsession shows.** The client portal, branded proposals, and proactive health monitoring signal to clients that you're a premium operation.

4. **Automation compounds.** Every automated follow-up, invoice reminder, and task creation saves time that compounds. A 4-person team operating like 10.

5. **Data becomes decisions.** Reports and analytics aren't vanity metrics — they're actionable. "We close 60% of referral leads vs 15% of cold outreach — double down on referrals."

6. **It's built for speed.** Sub-200ms loads, optimistic UI, keyboard shortcuts. Using the dashboard should feel like