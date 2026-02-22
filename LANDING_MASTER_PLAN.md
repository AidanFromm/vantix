# VANTIX LANDING PAGE — MASTER PLAN V2
> Complete head-to-toe rebuild. $100K quality. Research-backed.
> Date: 2026-02-22

## Design Philosophy
- **Apple product page energy** — scroll-driven storytelling, one idea per viewport
- **Stripe's engineering feel** — every interaction purposeful, nothing decorative
- **Cream (#F4EFE8) + Bronze (#B07A45) ONLY** — NO black backgrounds anywhere
- **Font upgrade:** Clash Display (headlines) + Satoshi (body) — premium feel over basic Inter
- **Copy framework:** Hybrid StoryBrand (hero) + PAS (problem) + BAB (case studies)

## New Tools
1. **Aceternity UI** — Spotlight, Text Generate Effect, 3D Cards, Moving Border, Sticky Scroll Reveal, Compare, Timeline, Infinite Moving Cards
2. **Magic UI** — Shimmer Button, Number Ticker, Border Beam, Marquee, Animated Beam, Dock
3. **GSAP ScrollTrigger** (already installed, all plugins now FREE) — SplitText for character animations, ScrollSmoother
4. **Lenis** (already installed) — Smooth scrolling foundation
5. **Framer Motion** (already installed) — Layout animations, AnimatePresence, spring physics

## Font Stack
```
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap');

Headlines: 'Clash Display', sans-serif
Body: 'Satoshi', sans-serif  
Mono: 'JetBrains Mono', monospace (code snippets)
```

## Color System (expanded)
```
--bg-primary: #F4EFE8        (main background)
--bg-alt: #EEE6DC            (alternating sections)
--bg-card: #E6DED3           (cards)
--bronze: #B07A45            (primary accent)
--bronze-dark: #8E5E34       (hover states)
--bronze-light: #C89A6A      (subtle accents)
--bronze-glow: rgba(176,122,69,0.15) (glows/spotlights)
--text: #1C1C1C              (primary text)
--text-secondary: #4B4B4B    (body text)
--text-muted: #7A746C        (captions)
--border: #E3D9CD            (dividers)
--border-bronze: #D8C2A8     (accent borders)
```

---

## SECTIONS (11 total, top to bottom)

### 1. NAVIGATION (Floating)
- **Component:** Aceternity Floating Navbar
- **Style:** Transparent initially, blur-glass cream on scroll
- **Content:** Logo (vantix.) | Services | Work | About | Contact | [Book a Call] shimmer button
- **Animation:** Slides down on load with spring, shrinks slightly on scroll

### 2. HERO (Full viewport)
- **Component:** Custom — Aceternity Spotlight + Text Generate Effect + Shimmer Button
- **Background:** Cream (#F4EFE8) with subtle bronze Spotlight beam following cursor
- **Headline:** "We Build AI Systems That Run Your Business." (Clash Display, 72px desktop / 40px mobile, #1C1C1C)
- **Subline:** Text Generate Effect — words appear one by one: "Automation. Dashboards. Chatbots. Lead engines. Deployed in weeks, not months."
- **CTA:** Magic UI Shimmer Button — "Book Your Free AI Audit" with bronze shimmer
- **Below CTA:** Small muted text "No commitment. 30-minute strategy call."
- **Hero Visual:** Polished dashboard mockup (hero-dashboard-new.jpg) with 3D Card tilt effect on hover, Border Beam around the frame
- **Scroll indicator:** Subtle animated chevron at bottom
- **Animation:** Headline fades up (0.6s), subline generates word-by-word (1.2s stagger), CTA pops in (1.5s), dashboard slides up from below (2s) with parallax on scroll

### 3. SOCIAL PROOF BAR (Logo marquee)
- **Component:** Aceternity Infinite Moving Cards / Magic UI Marquee
- **Content:** "Trusted by businesses ready to scale" + logo strip
- **Logos:** SecuredTampa, Just Four Kicks, CardLedger + 3-4 generated "client" logos
- **Style:** Continuous horizontal scroll marquee, muted bronze logos on cream
- **Animation:** Auto-scrolling, pauses on hover

### 4. PROBLEM → SOLUTION (Sticky scroll)
- **Component:** Aceternity Sticky Scroll Reveal
- **Left side (sticky):** Headline stays pinned: "Running a Business Shouldn't Feel Like This."
- **Right side (scrolling):** 4 pain point cards scroll through:
  1. "You're answering the same questions 100x a day"
  2. "Your data lives in 5 different spreadsheets"  
  3. "You're losing leads because you can't follow up fast enough"
  4. "You're hiring people for tasks a machine could do"
- **Each card transitions** to the solution: After all pain points, sticky text morphs to "What If It Didn't Have To?"
- **Colors:** Pain points = muted/gray cards, Solutions = bronze-accented cards

### 5. SERVICES (Bento grid)
- **Component:** Aceternity Bento Grid + 3D Card Effect
- **Layout:** Asymmetric bento grid (2 large + 4 small)
- **Cards:**
  - LARGE: "AI Chatbots" (with animated beam showing conversation flow)
  - LARGE: "Custom Platforms" (with mini dashboard mockup)
  - SMALL: "Automated Lead Gen"
  - SMALL: "Business Dashboards"
  - SMALL: "Email Automation"
  - SMALL: "Phone AI Agents"
- **Each card:** 3D tilt on hover, Moving Border on the featured cards, icon + short description
- **Animation:** Cards stagger in from bottom on scroll

### 6. PROCESS (Animated timeline)
- **Component:** Aceternity Timeline
- **Steps:**
  1. "Discovery Call" — "30 min. We learn your business inside out."
  2. "Strategy & Blueprint" — "Custom AI roadmap. No cookie-cutter solutions."
  3. "Build Sprint" — "2-4 weeks. Daily updates. You see progress in real-time."
  4. "Launch & Optimize" — "Go live. We monitor, iterate, improve."
- **Style:** Vertical timeline with bronze dots, Tracing Beam SVG follows scroll progress
- **Animation:** Each step reveals as the beam traces down

### 7. CASE STUDIES (Interactive cards)
- **Component:** Aceternity Wobble Card + Compare (before/after)
- **Layout:** 2 featured case studies side by side
- **Card 1 — SecuredTampa:**
  - Before: "Instagram DMs + Zelle payments"
  - After: "Full e-commerce + POS + inventory in 3 weeks"
  - Stats: 122 pages | 50+ APIs | Clover POS integrated
  - Aceternity Compare slider showing before/after screenshots
- **Card 2 — Just Four Kicks:**
  - Before: "Lovable template, broken features"  
  - After: "Enterprise B2B wholesale platform"
  - Stats: 200+ stores | StockX integration | Custom scan system
- **Testimonial inline:** Dave quote with avatar — "They built our entire platform in 3 weeks."
- **Animation:** Wobble tilt on hover, stats count up with Magic UI Number Ticker

### 8. ROI / BY THE NUMBERS
- **Component:** Magic UI Number Ticker + Aceternity Highlight
- **Layout:** 4 large stat blocks in a row
- **Stats:**
  - "40+" → "Hours Saved Per Week" 
  - "3x" → "More Leads Captured"
  - "24/7" → "AI Never Sleeps"
  - "3 Weeks" → "Average Build Time"
- **Style:** Massive Clash Display numbers with Number Ticker animation, bronze accent
- **Animation:** Numbers count up when scrolled into view

### 9. TEAM
- **Component:** Aceternity Animated Tooltip + custom cards
- **Layout:** 2 cards side by side
- **Kyle:** Photo, "Co-Founder", brief description
- **Aidan:** Photo, "Co-Founder", brief description
- **Below:** "Plus our AI workforce that never sleeps." with subtle animated dots
- **Animation:** Cards slide in from sides, photos have subtle parallax

### 10. FAQ
- **Component:** Custom accordion with Framer Motion AnimatePresence
- **Style:** Clean, minimal, bronze chevron indicators
- **Questions:** 6 key questions (pricing approach, timeline, what's included, industries, support, getting started)
- **Animation:** Smooth expand/collapse, staggered initial reveal

### 11. FINAL CTA + BOOKING
- **Component:** Aceternity Spotlight + Shimmer Button + custom calendar
- **Background:** Bronze Spotlight beam effect on cream
- **Headline:** "Ready to Automate Your Business?"
- **Subline:** "Book a free 30-minute AI audit. No strings attached."
- **CTA:** Shimmer Button + phone number (908) 498-7753
- **Below:** Compact booking calendar (keep existing calendar component)
- **Animation:** Spotlight sweeps, text generates, button pulses

### 12. FOOTER
- **Style:** Light cream, minimal
- **Content:** vantix. logo, nav links, social links (IG + X), contact info, copyright
- **Keep it simple** — footer should be lightweight, not a statement

---

## INTERACTIVE ELEMENTS
- **Cursor spotlight** on hero (Aceternity Spotlight follows mouse)
- **3D card tilts** on services and case studies
- **Number tickers** on all stat sections
- **Shimmer buttons** on all CTAs
- **Moving borders** on featured cards
- **Compare slider** on case study before/after
- **Tracing beam** on process timeline
- **Marquee** on social proof logos
- **Text generate** on hero subline

## MOBILE STRATEGY
- All 3D effects disabled (no tilt, no cursor spotlight)
- Bento grid → stacked single column
- Sticky scroll reveal → regular scroll sections
- Reduced animation (fade-in only, no stagger)
- Touch-friendly: larger tap targets, swipeable case studies
- Font sizes: 32px hero headline, 16px body

## PERFORMANCE
- Fonts: `display=swap` + preload critical weights
- Images: Next.js Image with blur placeholders
- Animations: GPU-only (transform + opacity)
- Lazy load: All sections below fold via Intersection Observer
- Code split: Each section is dynamic import
- Target: < 3s First Contentful Paint

## BUILD ORDER (6 waves)
1. **Wave 1:** Install fonts + Aceternity/Magic UI deps + create base layout
2. **Wave 2:** Hero + Nav + Social Proof Bar
3. **Wave 3:** Problem/Solution + Services Bento
4. **Wave 4:** Process + Case Studies + ROI
5. **Wave 5:** Team + FAQ + Final CTA + Footer  
6. **Wave 6:** Polish — mobile, performance, micro-interactions, testing

## KEEP FROM CURRENT
- Dashboard onboarding flow (login → dashboard) — UNTOUCHED
- Booking calendar component — REUSE
- Team photos (Kyle + Aidan) — REUSE
- hero-dashboard-new.jpg mockup — REUSE
- ChatWidget (AI chatbot) — KEEP
- SmoothScroll wrapper (Lenis) — KEEP
- GSAP + Framer Motion deps — KEEP

## REMOVE
- ScrollHero.tsx (dark hero — replace entirely)
- HeroSection.tsx (dead code)
- useTypewriter hook (dead code)
- BeforeAfterSection (redundant with new Problem section)
- ProblemSection (merged into new sticky scroll)
- AnimatedCounterSection (replaced by Number Ticker)
- ProductShowcase (replaced by case studies)
- TechStackSection (cut — clients don't care about tech names)
- ROISection (replaced by new ROI section)
- StickyCTABar (replace with better approach)
- All `#0a0a0a` dark theme code
