# Vantix Full Redesign Plan v2
*March 7, 2026 — Bronze/Gold Dark Premium*

## Current State Assessment
The site has good bones — 13 landing sections, Framer Motion animations, responsive layout, real content. But it's inconsistent: design tokens reference a light theme (#F4EFE8 bg) while the hero is dark. The font stack (Satoshi/Clash Display) is fine but not distinctive enough for a premium B2B agency. The warm paper texture bg feels craft/artisan, not tech-premium.

**What's working:** Good copy, real metrics, video hero, bento services grid, process timeline, booking section.
**What needs fixing:** Color consistency (dark everywhere), typography upgrade, spacing/rhythm, animation polish, responsive refinement, overall visual cohesion.

## The Redesign

### Phase 1: Foundation (Design System + Core)
1. **Update `design-tokens.ts`** — Replace ALL color/font/spacing tokens with DESIGN_SYSTEM.md v2 values
2. **Update `globals.css`** — Dark-mode-first, new font imports (Plus Jakarta Sans), remove paper texture, new CSS variables
3. **Update `tailwind.config`** — Extend with new tokens
4. **Install Plus Jakarta Sans** via Google Fonts or `@fontsource/plus-jakarta-sans`

### Phase 2: Navigation
1. **FloatingNav** — Glassmorphism nav (blur backdrop, dark transparent bg)
   - Logo left, centered links, bronze CTA pill right
   - Mobile: hamburger → slide-out dark panel
   - Smooth show/hide on scroll direction
   - Active link: bronze underline indicator

### Phase 3: Hero
1. **VideoHero** — Full-viewport dark cinematic hero
   - Video background with dark gradient overlay
   - Plus Jakarta Sans 800 weight hero text, 64px desktop / 40px mobile
   - Bronze accent on key phrase
   - Single CTA button (bronze gradient pill)
   - Trusted-by logos below CTA
   - Subtle scroll indicator
   - Parallax on product image (desktop only)

### Phase 4: Social Proof / Metrics
1. **MetricsBar** — Horizontal strip with animated counters
   - Dark bg-card background
   - Gold accent numbers, muted labels
   - Subtle border top/bottom
   - Count-up animation on scroll into view

### Phase 5: Services (Bento Grid)
1. **ServicesBentoSection** — Asymmetric bento grid
   - Dark cards with subtle bronze glow on hover
   - Service images/icons inside cards
   - Clean hierarchy: title → description
   - Grid: 2x2 featured + smaller cards
   - Hover: border glow + slight lift

### Phase 6: Horizontal Showcase
1. **HorizontalShowcase** — Horizontal scroll with product screenshots
   - Dark frame mockups (browser/phone frames)
   - Smooth scroll-linked animation
   - Caption below each

### Phase 7: Before/After
1. **BeforeAfterSection** — Side-by-side comparison
   - "Before" = muted, grayscale feel
   - "After" = bronze accented, vibrant
   - Clean two-column layout

### Phase 8: Process Timeline
1. **ProcessSection** — Vertical timeline, 4 steps
   - Bronze numbered circles connected by line
   - Step cards alternate left/right on desktop
   - Stack vertically on mobile
   - Animate in on scroll

### Phase 9: Case Study
1. **CaseStudySection** — Featured project card(s)
   - Full-width dark card with screenshot
   - Key metrics highlighted in bronze
   - Client quote if available

### Phase 10: Trust / Video Section
1. **VideoTrustSection** — Embedded video or autoplay showcase
   - Dark rounded container
   - Play button overlay if not autoplay

### Phase 11: Booking / CTA
1. **BookingSection** — Clean booking form or Calendly embed
   - Dark card with bronze accents
   - Minimal fields
2. **FinalCTASection** — Full-width bronze gradient CTA
   - Big headline, single button
   - "Your business runs on decisions" callback

### Phase 12: Footer
1. **FooterSection** — Minimal dark footer
   - Logo, nav links, contact info
   - Copyright
   - Social icons (if applicable)

### Phase 13: Dashboard Upgrade
- Apply same design tokens to dashboard pages
- Ensure consistency between landing and authenticated experience

## Key Principles
- **Dark-mode only** — no light theme toggle for now
- **Bronze/gold accents only** — no blue, no green, no generic tech colors
- **Plus Jakarta Sans everywhere** — one font family, multiple weights
- **8px spacing grid** — all spacing references the scale
- **Mobile-first** — design for 390px, enhance for 1280px+
- **Framer Motion** — keep using it, but refine animations (physics-based, not decorative)
- **Radix Colors approach** — each color has a specific purpose in the hierarchy

## Files to Modify
- `src/lib/design-tokens.ts` — complete rewrite
- `src/app/globals.css` — complete rewrite  
- `src/app/layout.tsx` — update font imports
- `src/components/landing/FuturisticLanding.tsx` — section ordering
- `src/components/landing/*.tsx` — every component gets updated styling
- `tailwind.config.ts` — extend with new tokens
- `public/` — organize media assets

## Success Criteria
- [ ] Consistent dark theme across every section
- [ ] Bronze/gold palette from logo colors
- [ ] Plus Jakarta Sans typography
- [ ] Smooth, purposeful animations
- [ ] Mobile-first responsive (test at 390px, 768px, 1280px)
- [ ] No hardcoded colors — everything references tokens
- [ ] Page loads fast (< 3s on 4G)
- [ ] "Would Steve Jobs approve?" test on every screen
