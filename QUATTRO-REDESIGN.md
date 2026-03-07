# Vantix Landing Page — Quattro-Inspired Premium Redesign

## REFERENCE: quattro.design
Study this site's structure and vibe. It's a brand+web design studio with:
- Portfolio-first layout (projects are the hero)
- Clean dark aesthetic with massive white space
- Clear tiered pricing ($4,500 / $8,500 / $12,000+)
- Services presented as elegant cards with sub-tags
- 4-phase process (Discover → Define → Design → Deliver)
- FAQ section that handles objections
- Testimonials with real quotes
- Minimal footer with contact form
- "Trusted by 25+ founders" social proof bar

## DESIGN TOKENS (from src/lib/design-tokens.ts)
```
Background: #0A0A0A
Elevated: #141416
Card: #1A1A1E
Card Hover: #242428
Surface: #1E1E24
Text: #F0EBE3
Text Secondary: #9090A0
Text Muted: #5A5A6A
Bronze: #B8935A
Bronze Light: #D4B87A
Bronze Dark: #7D5F35
Copper: #C87F4E
Border: rgba(255,255,255,0.06)
Border Hover: rgba(255,255,255,0.15)
Font: Plus Jakarta Sans
```

## ICON SYSTEM
Use `@phosphor-icons/react` (NOT lucide-react). Install it first: `pnpm add @phosphor-icons/react`
Phosphor has multiple weights (thin, light, regular, bold, fill, duotone) — use "light" weight for elegance, "regular" for emphasis.

## PAGE STRUCTURE (rebuild FuturisticLanding.tsx to use these sections in order)

### 1. FloatingNav (keep existing, minor polish)
- Transparent on top, glass-blur on scroll
- Logo left, nav links center, CTA button right
- Bronze accent on CTA button

### 2. HeroSection (COMPLETE REWRITE)
- MASSIVE headline: "We design brands that" + rotating word animation ["convert", "scale", "dominate"]
- OR static: "Brand Identity & Web Design for Companies That Want to Win"
- Subtext: 1-2 lines max. "We build brands and websites from the same foundation — so nothing ever feels disconnected."
- One CTA button: "Start a Project" (bronze bg, dark text)
- "Trusted by 25+ founders & companies" text below with subtle client count
- TONS of white space. Hero should breathe. py-32 to py-48 minimum.
- NO video background, NO mesh gradients, NO particles. Clean and editorial like Quattro.
- Subtle entrance animation (fade up, staggered)

### 3. ProjectsShowcase (NEW — THE MOST IMPORTANT SECTION)
- Section header: "./projects" or "Selected Work"
- Grid of 3-4 project cards showing client work
- Each card: large image/screenshot area (aspect-ratio 16/10), project name, category tag
- Cards: rounded-2xl, subtle border, hover scale + bronze border glow
- Projects to show:
  - Just Four Kicks — E-commerce Platform (sneaker wholesale)
  - Secured Tampa — Retail Management (sneaker/Pokemon store)
  - CardLedger — SaaS Application (collectible card tracker)
  - Horizon Asphalt — Corporate Website (asphalt company)
- Use placeholder gradient backgrounds if no screenshots available (bronze-to-dark gradient with project name overlay)
- This section should feel like a portfolio gallery

### 4. ServicesSection (REWRITE — Quattro style)
- Headline: "Everything connects by design."
- Subtext: "Brand identity, web, and AI — built from the same foundation."
- 4 service cards in a 2x2 grid (desktop) or stacked (mobile):

**Card 1: Web Design & Development**
- "High-performance websites built for conversion and scale."
- Tags: Web, React, Next.js, UI Components

**Card 2: AI Automation**
- "Custom AI agents and workflows that eliminate repetitive tasks."
- Tags: Agents, Workflows, Chatbots, Integration

**Card 3: Brand Identity**
- "Your visual foundation built to last."
- Tags: Logo System, Typography, Color, Guidelines

**Card 4: Growth & SEO**
- "Data-driven strategies that deliver measurable results."
- Tags: SEO, Analytics, Paid Ads, Content

- Each card: bgCard background, Phosphor icon (light weight), title, description, row of small tags
- Hover: borderAccent glow, slight lift
- Clean, editorial feel — NOT bento grid this time. Equal elegant cards.

### 5. ProcessSection (REWRITE — Quattro's 4 phases)
- Headline: "How We Work"
- Subtext: "Four phases. No surprises. No scope creep."
- 4 numbered steps in a horizontal row (desktop) or vertical (mobile):
  01 | Discover — "We start with a conversation, not a form. Goals, vision, audience."
  02 | Strategy — "Positioning, competitive landscape, brand architecture."
  03 | Design & Build — "From wireframes to production. Design and code, same team."
  04 | Launch & Optimize — "Go live, measure, iterate. We don't disappear after delivery."
- Numbered with large "01" "02" etc in bronze
- Subtle connecting line between steps
- Staggered reveal animation on scroll

### 6. PricingSection (NEW — Quattro inspired)
- Headline: "Pricing Plans"
- Subtext: "Three tiers. Each built for a specific moment."
- 3 pricing cards side by side:

**Starter — $2,500**
- "For startups and small businesses launching their digital presence."
- 5-7 Business Days
- Includes: Landing Page, Basic SEO, Mobile Responsive, 1 Round of Revisions, 14 Days Support

**Growth — $5,000**
- "For brands scaling fast that need a complete digital overhaul."
- 2-3 Weeks
- Includes: Everything in Starter + Multi-page Site, Brand Guidelines, AI Chatbot, Social Media Kit, 60 Days Support
- Mark this one as "Most Popular" with bronze badge

**Enterprise — $10,000+**
- "For companies at a defining moment — full rebrand, full build."
- 4-6 Weeks
- Includes: Everything in Growth + Custom AI Automation, Full Brand Identity, SEO Strategy, Priority Support (120 days)

- Cards: bgCard, clean typography, bronze accent on "Most Popular"
- CTA button on each card: "Get Started"

### 7. TestimonialsSection (REWRITE)
- Headline: "Client Testimonials"
- Subtext: "Real results from founders who trusted Vantix."
- 3 testimonial cards with:
  - Quote text (italic, larger font)
  - Client name, title, company
  - Star rating or result metric
- Clean card design, no heavy styling
- Staggered fade-in

### 8. FAQSection (NEW or enhance existing)
- Headline: "FAQs"
- Subtext: "Everything you need to know before we start."
- 6 accordion-style questions:
  01 | What makes Vantix different? → "Most agencies separate design from development..."
  02 | How long does a project take? → Timeline per tier
  03 | What does the process look like? → 4 phases
  04 | Can packages be customized? → Yes
  05 | Do you offer ongoing support? → Yes, included in every tier
  06 | How do we get started? → "Book a call or fill out the form below"
- Numbered "01" "02" style like Quattro
- Smooth expand/collapse animation

### 9. ContactSection (NEW — replaces BookingSection + FinalCTA)
- Headline: "Let's talk about what you're building next."
- Subtext: "Every great project starts with a conversation."
- Simple contact form: Name, Email, "Where do you want to start?" dropdown, Message
- Bronze submit button
- OR: Calendly embed for booking a call
- Phone: (908) 498-7753, Email: usevantix@gmail.com

### 10. FooterSection (REWRITE — minimal)
- Vantix logo (text)
- 3 columns: Navigation, Services, Connect
- "© 2026 Vantix LLC. All rights reserved."
- "Back to Top ↑" link
- Social icons (Phosphor icons)
- Super clean, not cluttered

## CRITICAL DESIGN RULES
1. **WHITE SPACE IS EVERYTHING** — py-28 to py-48 on sections. Let it breathe.
2. **No emojis anywhere** — Phosphor icons only
3. **No mesh gradients, no particles, no flashy effects** — Clean and editorial
4. **Typography is the design** — Large headlines (48-80px), clear hierarchy
5. **Bronze accent used SPARINGLY** — CTAs, numbers, hover states, badges. Not everywhere.
6. **Cards are subtle** — bgCard with borderDefault, not heavy shadows
7. **Animations are gentle** — Fade up, stagger. No bouncy or flashy.
8. **Mobile-first** — Must look incredible on 390px
9. **Real content** — No lorem ipsum. Use real Vantix copy.

## TECHNICAL
- Install Phosphor: `pnpm add @phosphor-icons/react`
- Use framer-motion for scroll animations
- Import tokens from src/lib/design-tokens.ts
- Update FuturisticLanding.tsx to use the new section order
- Each section in its own file in src/components/landing/
- MUST pass `pnpm build` with zero errors
- After done: `git add -A && git commit -m "feat: Quattro-inspired premium redesign - portfolio-first, tiered pricing, editorial aesthetic" && git push origin main`
