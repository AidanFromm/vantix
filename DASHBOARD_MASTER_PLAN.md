# VANTIX DASHBOARD MASTER PLAN
## "Act like a $100M company"

---

## THE VISION
Vantix is no longer just a web dev agency. We're an **AI-first digital transformation company**. 
Every tool, every page, every pixel screams: "We use AI to 10x your business."

The dashboard is our **command center** — where Kyle and Aidan run everything.
The website is our **storefront** — where prospects see the future and want in.

---

## PHASE 1: LANDING PAGE — "The Best Page on the Internet"

### Positioning Shift
- FROM: "We build websites" 
- TO: "We deploy AI that runs your business while you sleep"

### Landing Page Sections
1. **Hero** — Full-screen, dark, animated. "Your Business. Powered by AI." Particle/neural network background animation. One CTA: "See What AI Can Do For You"
2. **The Problem** — "You're doing manually what AI can do in seconds" — animated stats counter showing time/money wasted
3. **AI Services Showcase** — Interactive cards that flip/animate:
   - AI Chatbots (24/7 customer support)
   - AI-Powered Websites (self-optimizing)
   - Automated Lead Generation (finds customers for you)
   - AI Analytics & Insights (decisions made for you)
   - AI Email Marketing (writes, sends, follows up)
   - AI Inventory Management (predicts demand)
   - AI Phone Agents (answers calls, books appointments)
   - Custom AI Solutions (anything you need)
4. **Live Demo** — Embedded AI chatbot right on the page. "Try our AI right now"
5. **ROI Calculator** — Interactive slider: "How many hours do you spend on [X]?" → shows savings
6. **Case Studies** — Secured Tampa transformation story with real metrics
7. **Process** — "How We Work": Discovery Call → AI Audit → Build → Launch → Monitor → Scale
8. **Testimonials** — (Dave's when we get it)
9. **Team** — Kyle + Aidan, positioned as AI architects
10. **FAQ** — AI-focused objection handling
11. **Final CTA** — "Book Your Free AI Consultation" → Cal.com embed
12. **Footer** — Full links, social, legal

### Copy Direction
- Aggressive, confident, future-focused
- "While your competitors figure out ChatGPT, we're building AI systems that run entire businesses"
- "We don't just build websites. We build revenue machines."
- Numbers, results, ROI everywhere
- No fluff, no "we're passionate about..." garbage

---

## PHASE 2: AI CHATBOT

### On Website (Public)
- Flowise-powered or custom-built
- Bottom-right widget on every page
- Trained on Vantix services, pricing guidelines, process
- Can: answer questions, qualify leads, book consultations, collect contact info
- Personality: professional, knowledgeable, slightly aggressive on closing
- Auto-saves lead data to Supabase

### On Dashboard (Internal)
- AI assistant for Kyle/Aidan
- Can pull dashboard data, generate reports, suggest actions
- "What's our pipeline looking like?" → instant answer

---

## PHASE 3: DASHBOARD — The $100M Command Center

### Supabase Tables Needed
```sql
-- Clients & CRM
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,
  industry TEXT,
  status TEXT DEFAULT 'lead', -- lead, prospect, active, completed, churned
  source TEXT, -- cold_email, referral, website, chatbot
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'discovery', -- discovery, proposal, active, review, completed, cancelled
  type TEXT, -- website, ecommerce, ai_chatbot, automation, consulting
  budget DECIMAL,
  paid DECIMAL DEFAULT 0,
  start_date DATE,
  deadline DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  invoice_number TEXT UNIQUE,
  items JSONB DEFAULT '[]',
  subtotal DECIMAL,
  tax DECIMAL DEFAULT 0,
  total DECIMAL,
  paid DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  due_date DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  city TEXT,
  state TEXT,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new', -- new, contacted, replied, qualified, converted, dead
  source TEXT,
  notes TEXT,
  last_contacted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Campaigns
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'draft', -- draft, sending, sent, paused
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_replied INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  project_name TEXT,
  scope TEXT,
  deliverables JSONB DEFAULT '[]',
  timeline TEXT,
  price DECIMAL,
  status TEXT DEFAULT 'draft', -- draft, sent, viewed, accepted, rejected
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  client_id UUID REFERENCES clients(id),
  document_url TEXT,
  status TEXT DEFAULT 'draft', -- draft, sent, signed, expired
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT, -- kyle, aidan, vantix, botskii
  status TEXT DEFAULT 'todo', -- todo, in_progress, review, done
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Tracking
CREATE TABLE revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  type TEXT, -- project_fee, maintenance, consultation, upsell
  amount DECIMAL,
  description TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat Leads (from website chatbot)
CREATE TABLE chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  conversation JSONB DEFAULT '[]',
  qualified BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Monitors
CREATE TABLE site_monitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'up', -- up, down, degraded
  response_time INTEGER, -- ms
  last_check TIMESTAMPTZ,
  uptime_percent DECIMAL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Dashboard Pages (ALL Supabase-backed)

#### HOME — Command Center
- Revenue this month / this quarter / all time
- Active projects count + status breakdown
- Pipeline value (proposals sent)
- Recent activity feed (new leads, payments, messages)
- Quick actions: New Client, New Invoice, New Proposal

#### CRM — Client Management
- Client list with search/filter/sort
- Client detail: contact info, projects, invoices, notes, timeline
- Pipeline view (Kanban): Lead → Prospect → Active → Completed
- Add/edit clients

#### PROJECTS — Project Tracker
- Active projects with progress bars
- Project detail: tasks, timeline, budget vs spent, client info
- Gantt-style timeline view
- Task board (Kanban per project)

#### LEADS — Lead Pipeline
- All leads from scraper + chatbot + manual
- Lead scoring with visual indicators
- Bulk actions (email, qualify, archive)
- Import from CSV
- Lead source breakdown chart

#### INVOICES — Billing
- Create/send invoices
- Payment tracking with partial payments
- Overdue alerts
- Revenue charts
- Export for QuickBooks

#### PROPOSALS — Sales
- Create proposals from templates
- Send to clients (email)
- Track views/opens
- Convert to project on acceptance

#### CONTRACTS — Legal
- Contract templates
- E-signature tracking (Documenso integration)
- Contract status pipeline

#### EMAIL — Outreach
- Campaign builder
- Template library
- Send tracking (opens, replies, bounces)
- Automated sequences
- Integration with leads

#### ANALYTICS — Business Intelligence
- Revenue over time (line chart)
- Client acquisition funnel
- Project profitability
- Lead source ROI
- Email campaign performance
- Monthly/quarterly reports

#### TASKS — Team Work
- All tasks across all projects
- Filter by assignee (Kyle, Aidan, Vantix, Botskii)
- Priority sorting
- Due date calendar view

#### MONITORING — Site Health
- All monitored sites with status
- Response time graphs
- Uptime percentages
- Alert history
- Uptime Kuma integration

#### AI TOOLS — Internal AI
- AI copywriter (generate email copy, proposals, etc.)
- AI lead scorer (auto-score leads)
- AI report generator
- Chat interface for business questions

#### SETTINGS
- Team members
- Supabase connection status
- API keys management
- Notification preferences
- Branding/theme

---

## PHASE 4: MARKETING COPY DIRECTION

### Taglines (pick favorites)
- "AI That Actually Makes You Money"
- "Your Business Runs Itself. We Make That Happen."
- "We Don't Build Websites. We Build Revenue Machines."
- "While You Sleep, Your AI Works."
- "The Future Called. It Wants To Run Your Business."
- "AI-Powered Everything. Human-Approved Results."

### Email Subject Lines
- "Your competitor just automated their entire business"
- "What if your website made sales while you slept?"
- "We built an AI that replaced a 5-person team"
- "Free AI audit: Here's what you're wasting money on"

### Value Props
1. **Save 40+ hours/week** with AI automation
2. **24/7 customer support** via AI chatbot (no hiring)
3. **3x more leads** with AI-powered marketing
4. **Zero missed calls** with AI phone agents
5. **Real-time insights** — AI analyzes your data constantly

---

## DEPLOYMENT ORDER
1. Landing page (tonight) — 2 agents
2. AI chatbot widget (tonight) — 1 agent  
3. Supabase SQL (Aidan runs in morning)
4. Dashboard pages (tonight) — 4-6 agents
5. Push everything, deploy

## AGENT ASSIGNMENTS
- Agent 1: Landing page hero + services + animations
- Agent 2: Landing page case study + CTA + footer + SEO
- Agent 3: AI chatbot component
- Agent 4: Dashboard home + CRM + clients
- Agent 5: Dashboard leads + email + analytics
- Agent 6: Dashboard invoices (done) + proposals + contracts
- Agent 7: Dashboard tasks + monitoring + AI tools
- Agent 8: Copywriting + marketing content
