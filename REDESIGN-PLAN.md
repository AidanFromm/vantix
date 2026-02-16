# Vantix Website Redesign Plan
## Inspired by Premium Wine Showcase + Tech Aesthetic

---

## 🎯 Design Direction

### Core Concept
**"Scroll-driven storytelling on a clean, light canvas"**

Transform Vantix from a dark agency site to a premium, light-themed tech showcase that tells the story of what we build through immersive scroll experiences.

### Key Inspiration Elements (from wine video)
1. **3D Product Showcase** - Wine bottles on pedestals → Laptop/phone mockups with project screenshots
2. **Large Background Typography** - Year as massive text ("2016") → Project numbers/years
3. **Glass Morphism Panels** - Frosted glass sidebars with info
4. **Scroll-Triggered Transitions** - Smooth parallax between sections
5. **Story Narrative** - "2016 was an incredible year..." → "We built a $5.8M platform..."
6. **Ambient Lighting/Gradients** - Subtle colored glows behind products
7. **Horizontal Grid View** - Multiple products in grid layout

---

## 🎨 Color Palette

### Primary (Light Theme)
```
Background:     #fafafa (off-white)
Surface:        #ffffff (pure white)
Border:         #e5e7eb (light gray)
Text Primary:   #111827 (near black)
Text Secondary: #6b7280 (gray)
Text Muted:     #9ca3af (light gray)
```

### Accent (Green - Tech/Growth)
```
Primary:        #10b981 (emerald-500)
Primary Hover:  #059669 (emerald-600)
Primary Light:  #d1fae5 (emerald-100)
Primary Glow:   rgba(16, 185, 129, 0.15)
```

### Gradient Accents (per project)
```
J4K:            Orange → Red gradient
CardLedger:     Blue → Cyan gradient
SecuredTampa:   Purple → Pink gradient
Automation:     Emerald → Teal gradient
```

---

## 📐 Layout Structure

### 1. Hero Section (Full Screen)
- Ultra-light typography (font-extralight/font-thin)
- "We Build Digital" headline
- Subtle animated gradient orb behind text
- Scroll indicator at bottom
- Minimal - just logo + CTA in nav

### 2. Project Chapters (Full Screen Each)
Each project gets a dedicated full-screen section:

```
┌─────────────────────────────────────────────────────────────┐
│  [Nav: Logo ................ Contact]                       │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │         ┌─────────────┐                             │   │
│   │  01     │             │      Project Title          │   │
│   │  ──     │   MOCKUP    │      Subtitle               │   │
│   │  2024   │   (3D)      │                             │   │
│   │         │             │      Description text...    │   │
│   │         └─────────────┘                             │   │
│   │                              $5.8M    300+          │   │
│   │   "Story text about         Revenue  Stores        │   │
│   │    this project..."                                 │   │
│   │                              [View Project →]       │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│                        ● ○ ○ ○  (progress dots)             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Services/Capabilities Section
- Clean grid of what we offer
- Icons + short descriptions
- Hover animations

### 4. Process Section
- Numbered steps (01, 02, 03, 04)
- Horizontal scroll or vertical timeline
- Clean, minimal

### 5. Contact/CTA Section
- Large typography CTA
- Email + phone
- Social links

### 6. Footer
- Minimal, clean
- Links + copyright

---

## 🖥️ Components to Build

### Core Components
1. **LightHero** - Clean hero with animated gradient
2. **ProjectChapter** - Full-screen project showcase
3. **DeviceMockup** - 3D laptop/phone mockup component
4. **GlassPanel** - Frosted glass info panel
5. **ScrollProgress** - Progress dots/bar
6. **AnimatedNumber** - Counter animation for stats
7. **StoryText** - Animated narrative text
8. **ServiceCard** - Clean service offering card
9. **ProcessStep** - Timeline/step component
10. **LightNav** - Clean navigation for light theme

### Animation Techniques
- **useScroll + useTransform** - Parallax effects
- **useInView** - Trigger animations on scroll
- **AnimatePresence** - Page transitions
- **useSpring** - Smooth value animations
- **Variants** - Staggered children animations

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   - Single column, stacked layouts
Tablet:   640-1024px - 2 columns, adjusted spacing
Desktop:  > 1024px  - Full experience
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Current)
- [x] Create plan document
- [ ] Set up light theme colors in globals.css
- [ ] Create base layout component
- [ ] Build LightNav component

### Phase 2: Hero Section
- [ ] Build LightHero component
- [ ] Add animated gradient orb
- [ ] Typography animations
- [ ] Scroll indicator

### Phase 3: Project Chapters
- [ ] Build ProjectChapter component
- [ ] Create DeviceMockup component
- [ ] Add project data structure
- [ ] Implement scroll-linked animations
- [ ] Add progress indicators

### Phase 4: Supporting Sections
- [ ] Services grid
- [ ] Process timeline
- [ ] Contact section
- [ ] Footer

### Phase 5: Polish
- [ ] Page transitions
- [ ] Loading states
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility

---

## 📄 File Structure

```
src/
├── app/
│   ├── page.tsx              # Main landing (LightLanding)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Light theme variables
│
├── components/
│   └── landing/
│       ├── LightLanding.tsx  # Main landing page
│       ├── LightHero.tsx     # Hero section
│       ├── ProjectChapter.tsx # Project showcase
│       ├── DeviceMockup.tsx  # 3D device component
│       ├── GlassPanel.tsx    # Frosted glass panel
│       ├── ServicesGrid.tsx  # Services section
│       ├── ProcessTimeline.tsx # Process steps
│       └── ContactSection.tsx # CTA section
│
├── data/
│   └── projects.ts           # Project data
│
└── lib/
    └── animations.ts         # Shared animation configs
```

---

## 🔗 Reference Sites

- **Linear.app** - Clean, minimal SaaS design
- **Vercel.com** - Tech-forward, elegant
- **Stripe.com** - Premium fintech aesthetic
- **Apple.com** - Product showcase mastery
- **Framer.com** - Animation excellence

---

## ✅ Success Criteria

1. **Premium Feel** - Looks like a $50K+ website
2. **Story-Driven** - Each scroll reveals more of the narrative
3. **Tech-Focused** - Clearly shows we build digital products
4. **Fast** - Sub-2s load, 90+ Lighthouse score
5. **Memorable** - Visitors remember the experience
6. **Convertible** - Clear CTAs, easy to contact

---

*Plan created: 2026-02-15*
*Target completion: 2026-02-16*
