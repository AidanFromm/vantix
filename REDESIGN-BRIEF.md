# Vantix Landing Page — Premium Redesign Brief

## YOUR MISSION
Rebuild ALL landing page sections to create a jaw-dropping, premium dark-mode website. This must look like it was designed by a top-tier agency, NOT a generic SaaS template.

## DESIGN SYSTEM (MANDATORY)
Import tokens from `src/lib/design-tokens.ts`:
- Background: #0A0A0A (off-black, NEVER pure #000)
- Cards: #1A1A1E with subtle borders rgba(255,255,255,0.06)
- Accent: #B8935A (bronze/gold) — used sparingly for CTAs, highlights, hover states
- Copper: #C87F4E, Light Gold: #D4B87A — secondary accents
- Text: #F0EBE3 (warm white), Secondary: #9090A0
- Font: Plus Jakarta Sans (already configured)
- Spacing: 8px grid system

## DESIGN PRINCIPLES (FOLLOW STRICTLY)
1. WHITE SPACE IS PREMIUM — More space = more expensive feel. Don't cram content.
2. MAX 2-3 COLORS — Bronze accent + warm white text + grays. That's it. No random colors.
3. TYPOGRAPHY HIERARCHY — Massive hero text (64-96px), clear size steps down. Font weight variation.
4. CONSISTENT 8px SPACING — Padding, margins, gaps all multiples of 8.
5. LAYERED DARK MODE — Use bgElevated (#141416), bgCard (#1A1A1E), surface (#1E1E24) for depth. NOT flat.
6. ANIMATION WITH PURPOSE — Framer Motion: staggered reveals, smooth fades, parallax. Every motion guides attention.
7. MOBILE-FIRST — Must look incredible on 390px. Test every section.
8. NO EMOJI ICONS — Use Lucide React icons or SVG. Emojis look amateur.
9. STEVE JOBS TEST — "If a user needs to think about how to use it, you've failed"

## ROLE MODEL: Fourth Floor Design (fourthfloor.design)
- Outcome-based testimonials with real metrics
- Stats bar with impressive numbers
- Anti-agency positioning ("we're not an agency, we're your growth partner")
- Clean, editorial feel with lots of breathing room
- Bold typography with subtle animations

## SECTIONS TO REBUILD (in order of FuturisticLanding.tsx)

### 1. VideoHero — KEEP but enhance
Already decent. Add subtle scroll indicator animation at bottom.

### 2. MetricsBar — Stats strip
- 4 key metrics in a horizontal bar
- "50+ Projects Delivered" | "3,327 Leads Generated" | "$5.82M Client Revenue" | "98% Client Retention"
- Animated number counters on scroll into view
- Subtle bronze underline accent
- Background: bgElevated with top/bottom border

### 3. HorizontalShowcase — Portfolio/showcase
- Horizontal scrolling showcase of project screenshots
- Device mockups (laptop/phone frames via CSS)
- Smooth scroll with grab cursor
- Subtle parallax on images

### 4. VideoSplitSection — Video + text split
- Left: embedded video or animated visual
- Right: compelling copy about Vantix's approach
- "We don't just build websites. We build revenue machines."
- Bronze accent on key phrases

### 5. ServicesBentoSection — COMPLETE REBUILD
- Bento grid layout (NOT equal cards)
- 1 large featured card + 3-4 smaller cards
- Services: AI Automation, Web Development, Paid Advertising, Brand & Creative, SEO & Growth
- Each card: Lucide icon, title, short description, subtle hover animation
- Featured card has bronze gradient border
- Cards use bgCard with borderDefault, hover to bgCardHover

### 6. BeforeAfterSection — Transformation showcase
- Split view showing before/after of client work
- Slider or side-by-side
- Real transformation metrics ("2x conversion rate", "300% more leads")

### 7. ProcessSection — How we work
- 4-step numbered process
- Step 1: Discovery → Step 2: Strategy → Step 3: Build → Step 4: Launch & Optimize
- Each step: number (bronze), title, description
- Connected by a subtle line/timeline
- Staggered reveal animation

### 8. CaseStudySection — Client results
- 2-3 featured case studies
- Each: client name, challenge, solution, results (with real numbers)
- Card layout with bronze accent hover
- "View Case Study" CTA

### 9. VideoTrustSection — Social proof
- Client testimonials or trust indicators
- Logo bar of technologies/tools used
- Clean, minimal layout

### 10. BookingSection — CTA to book a call
- Large, compelling headline: "Ready to Build Something Extraordinary?"
- Subtext about the process
- Bronze gradient CTA button
- Maybe embedded Calendly or link to booking

### 11. FinalCTASection — Last push
- Full-width section with bold typography
- "Let's create something remarkable together"
- Email input or CTA button
- Subtle background animation (mesh gradient or particles)

### 12. FooterSection — Clean footer
- Vantix logo
- Navigation links
- Social links
- "© 2026 Vantix LLC"
- Minimal, not cluttered

## TECHNICAL REQUIREMENTS
- Use `framer-motion` for ALL animations (already installed)
- Use `lucide-react` for icons (already installed)
- Import colors/fonts/animations from `src/lib/design-tokens.ts`
- Tailwind CSS for styling
- Each section in its own file under `src/components/landing/`
- TypeScript, 'use client' directive where needed
- MUST pass `pnpm build` with zero errors

## WHAT NOT TO DO
- No emoji icons (use Lucide)
- No generic blue/green SaaS colors
- No light mode
- No cramped layouts — WHITE SPACE IS PREMIUM
- No lorem ipsum — use real Vantix content
- Don't simplify or remove existing sections
- Don't change business logic or routing

## REFERENCE CONTENT
- Company: Vantix LLC — AI-powered web design & automation agency
- Tagline: "Get Organized" or "Build. Automate. Scale."
- Services: Web Design, AI Automation, Paid Ads, Brand & Creative, SEO
- Team: 2 founders + AI agents
- Phone: (908) 498-7753
- Email: usevantix@gmail.com
- Website: usevantix.com

After rebuilding all sections, run `pnpm build` to verify zero errors, then `git add -A && git commit -m "feat: premium landing page redesign - all sections rebuilt with proper design system" && git push origin main`.
