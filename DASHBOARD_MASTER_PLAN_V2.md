# Vantix Dashboard Master Plan V2
> "Run like a $100M company"

## Current State Audit

### What Works
- **Overview page** — KPI cards (revenue, pipeline, projects), revenue chart, lead funnel, tasks, activity feed, booking alerts
- **Leads page** — Kanban board, add/edit/delete, status pipeline, scoring
- **Clients page** — CRM with CRUD, status pipeline, Supabase-backed with localStorage fallback
- **Invoices page** — Full CRUD, status tracking, auto-overdue detection
- **Projects page** — CRUD, health tracking, progress bars
- **Tasks page** — Kanban-style task management
- **Contracts, Proposals, Outreach, Reports** — Various states of completion

### What's Broken/Missing
1. **Booking→Dashboard flow**: Bookings save to localStorage but dashboard overview reads from localStorage too — this works IF same browser. API webhook saves to server file but dashboard doesn't read from it. Need unified data flow.
2. **Contact form submissions**: /api/contact exists but doesn't feed into dashboard
3. **AI Audit form submissions**: /api/audit-submit exists but doesn't feed into dashboard  
4. **No real-time sync**: Two browsers = two different datasets
5. **Dashboard theme**: Still uses old colors, not cream/brown theme
6. **Sidebar navigation**: Bloated with 20+ pages, many are empty shells
7. **No "who owes us money" view**: Need clear accounts receivable
8. **No unified activity feed**: Actions across pages don't log to central activity

## The Plan — 4 Phases

### Phase 1: Data Foundation (Critical)
Make all data flow into one place and show on dashboard.

1. **Unified data store via JSON API routes**:
   - `GET/POST /api/dashboard/data` — reads/writes all dashboard data from server-side JSON files
   - All pages read from this API (not just localStorage)
   - This means Kyle and Aidan see the SAME data on any device

2. **Inbound data feeds**:
   - Website booking form → saves via API → shows on dashboard overview as alert
   - Contact form (/api/contact) → auto-creates lead in dashboard
   - AI Audit form (/api/audit-submit) → auto-creates qualified lead
   - All inbound → triggers activity log entry

3. **localStorage keys (standardized)**:
   - `vantix_clients` — CRM
   - `vantix_leads` — pipeline leads
   - `vantix_invoices` — billing
   - `vantix_projects` — active projects
   - `vantix_tasks` — task board
   - `vantix_activities` — activity feed
   - `vantix_bookings` — consultation bookings
   - `vantix_expenses` — costs tracking

### Phase 2: Dashboard Overview Overhaul
The command center — everything at a glance.

1. **Booking Alerts** (already built) — prominent alerts for new consultations
2. **Accounts Receivable widget** — "Who owes us money": list of unpaid/overdue invoices with client name, amount, days overdue, quick "Mark Paid" button
3. **Revenue snapshot** — This month, last month, YTD, projected (based on pipeline)
4. **Active Projects health** — traffic light status with progress bars
5. **Lead pipeline mini-funnel** — counts per stage
6. **Upcoming tasks** — due this week
7. **Recent activity feed** — last 10 actions across all pages
8. **Quick actions** — New Lead, New Invoice, New Project, View Reports

### Phase 3: Core Pages Polish
Each page fully functional with CRUD + proper theming.

1. **Clients CRM** — ✅ Working, needs theme update
2. **Leads** — ✅ Working, needs theme update  
3. **Invoices** — ✅ Working, add "Send Reminder" action, theme update
4. **Projects** — ✅ Working, needs theme update
5. **Tasks** — ✅ Working, needs theme update
6. **Finances** — Merge invoices + expenses into one financial view with P&L summary
7. **Calendar** — Show bookings + project deadlines + task due dates in calendar view
8. **Settings** — Company info, team members, notification prefs

### Phase 4: Trim & Theme
1. **Remove dead pages**: bots, memory, notepad, github, seo-tracker, deal-room, portfolio, revenue, financial (merge into finances), pipeline (merge into leads)
2. **Sidebar cleanup**: Only show essential pages:
   - Overview (home)
   - Clients
   - Leads  
   - Projects
   - Tasks
   - Invoices
   - Calendar
   - Reports
   - Settings
3. **Full cream/brown theme** across all dashboard pages — match landing page

## Execution Order
1. Phase 1 + Phase 2 together (data + overview) — Agent 1
2. Phase 3 (polish core pages) — Agent 2  
3. Phase 4 (trim + theme) — Agent 3

## Real Data to Seed
- **Dave / SecuredTampa**: Client (active), Project ($4,500, 90% complete), Invoice ($2,000 paid, $2,500 outstanding)
- **210 scraped leads**: Already in leads-scraper data files
- **Team**: Kyle (founder), Aidan (founder), Vantix AI, Botskii AI
