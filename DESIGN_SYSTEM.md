# Vantix Design System v2.0
*Full redesign — March 2026*

## Brand Identity
- **Name:** Vantix
- **Tagline:** "Your business runs on decisions. We make them faster."
- **Positioning:** Premium AI-powered business infrastructure agency
- **Feel:** Calm, confident, premium, inevitable. Dark luxury meets modern tech.
- **Logo:** Bronze/gold metallic "V" — 3D ribbon-fold effect

## Color Tokens

### Primary (Bronze/Gold Family — from logo)
| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-gold-light` | `#D4B87A` | Highlights, hover accents |
| `--brand-gold` | `#B8935A` | Primary brand, headings accent |
| `--brand-gold-dark` | `#7D5F35` | Shadows, pressed states |
| `--accent-copper` | `#C87F4E` | Charts, data viz, CTAs |
| `--accent-peach` | `#D9A06B` | Secondary accents, gradients |

### Backgrounds (Dark-first)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0A0A0A` | Page background |
| `--bg-elevated` | `#141416` | Sidebar, nav |
| `--bg-card` | `#1A1A1E` | Cards, panels |
| `--bg-card-hover` | `#242428` | Card hover state |
| `--bg-surface` | `#1E1E24` | Elevated surfaces |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#F0EBE3` | Main text (warm white) |
| `--text-secondary` | `#9090A0` | Descriptions, labels |
| `--text-muted` | `#5A5A6A` | Placeholders, hints |
| `--text-accent` | `#B8935A` | Links, emphasis |

### Borders
| Token | Hex | Usage |
|-------|-----|-------|
| `--border-subtle` | `rgba(255,255,255,0.06)` | Card borders |
| `--border-default` | `rgba(255,255,255,0.10)` | Input borders |
| `--border-hover` | `rgba(255,255,255,0.15)` | Hover state borders |
| `--border-accent` | `rgba(184,147,90,0.3)` | Active/focus borders |

### Status
| Token | Hex | Usage |
|-------|-----|-------|
| `--status-positive` | `#4CAF7A` | Success, growth |
| `--status-negative` | `#CF5555` | Error, decline |
| `--status-warning` | `#D4A05A` | Caution |

### Gradients
```css
--gradient-bronze: linear-gradient(135deg, #B8935A, #7D5F35);
--gradient-hero: linear-gradient(to bottom, rgba(10,10,10,0.4), rgba(10,10,10,0.85));
--gradient-card-glow: radial-gradient(ellipse at top, rgba(184,147,90,0.08), transparent 70%);
--gradient-cta: linear-gradient(135deg, #C87F4E, #8E5E34);
```

## Typography

### Font Stack
| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| Display/Headlines | Plus Jakarta Sans | system-ui | 700, 800 |
| Body/UI | Plus Jakarta Sans | system-ui | 400, 500, 600 |
| Mono (code/data) | JetBrains Mono | monospace | 400 |

**Why Plus Jakarta Sans:** Confident, slightly bold, premium B2B feel. Works for both headlines and body — one family, multiple weights = consistency.

### Type Scale (1.250 ratio — Major Third)
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--text-hero` | 64px / 4rem | 800 | Hero headline |
| `--text-h1` | 48px / 3rem | 700 | Section titles |
| `--text-h2` | 36px / 2.25rem | 700 | Sub-section titles |
| `--text-h3` | 24px / 1.5rem | 600 | Card titles |
| `--text-h4` | 20px / 1.25rem | 600 | Small headings |
| `--text-body` | 16px / 1rem | 400 | Body text |
| `--text-body-lg` | 18px / 1.125rem | 400 | Lead paragraphs |
| `--text-small` | 14px / 0.875rem | 400 | Captions, labels |
| `--text-xs` | 12px / 0.75rem | 500 | Tags, badges |
| `--text-overline` | 12px / 0.75rem | 600 | Uppercase labels, tracking 0.15em |

### Line Heights
- Headlines: 1.1
- Body: 1.6
- Small text: 1.4

### Letter Spacing
- Headlines: -0.03em (tight)
- Body: 0
- Overlines/labels: 0.15em

## Spacing Scale (8px base)
| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

### Section Spacing
- Between major sections: 128px (desktop), 80px (mobile)
- Section padding-x: max-w-7xl with px-6 (mobile) / px-8 (desktop)

## Radii
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Tags, badges |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards |
| `--radius-xl` | 24px | Large cards, modals |
| `--radius-full` | 9999px | Pills, avatars |

## Shadows
```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
--shadow-md: 0 8px 24px rgba(0,0,0,0.4);
--shadow-lg: 0 16px 48px rgba(0,0,0,0.5);
--shadow-glow: 0 0 40px rgba(184,147,90,0.15);
--shadow-card: 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
```

## Components

### Buttons
**Primary (CTA):**
- Background: `--gradient-cta`
- Text: white, 600 weight
- Padding: 16px 32px
- Radius: `--radius-full` (pill)
- Shadow: `0 8px 32px rgba(200,127,78,0.3)`
- Hover: brightness(1.1), shadow expands
- Transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1)

**Secondary:**
- Background: transparent
- Border: 1px solid `--border-default`
- Text: `--text-primary`, 500 weight
- Hover: border `--border-hover`, bg `--bg-card`

**Ghost:**
- Background: transparent
- Text: `--text-accent`
- Hover: bg `rgba(184,147,90,0.08)`

### Cards
- Background: `--bg-card`
- Border: 1px solid `--border-subtle`
- Radius: `--radius-lg`
- Shadow: `--shadow-card`
- Hover: border `--border-hover`, subtle y-translate(-2px)
- Optional: top glow gradient `--gradient-card-glow`

### Navigation
- Fixed top, blur backdrop
- Background: `rgba(10,10,10,0.8)` + `backdrop-filter: blur(20px)`
- Border-bottom: 1px solid `--border-subtle`
- Logo left, links center, CTA right
- Mobile: slide-out menu or bottom sheet

### Inputs
- Background: `--bg-surface`
- Border: 1px solid `--border-default`
- Radius: `--radius-md`
- Focus: border `--border-accent`, glow shadow
- Text: `--text-primary`
- Placeholder: `--text-muted`

## Motion

### Principles
- Motion should feel like physics, not decoration
- Enter: ease-out (fast start, gentle stop)
- Exit: ease-in (gentle start, fast stop)
- Interactive: spring-like (0.16, 1, 0.3, 1)

### Standard Transitions
| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover, focus) | 150ms | ease |
| Standard (appear, toggle) | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Entrance (section reveal) | 600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Hero (first load) | 800-1000ms | cubic-bezier(0.16, 1, 0.3, 1) |

### Scroll Animations
- Sections fade-in + translate-y(24px → 0) on viewport entry
- Stagger children by 100-150ms
- Use Framer Motion `useInView` with `once: true`
- Parallax on hero only (subtle, 0.1-0.2 factor)

## Iconography
- **Library:** Phosphor Icons (consistent, tree-shakeable for React)
- **Style:** Regular weight (not bold, not thin)
- **Size:** 20px default, 24px for nav, 16px for inline
- **Color:** Inherit from text color

## Responsive Breakpoints
| Name | Width | Columns |
|------|-------|---------|
| Mobile | 0-639px | 1 |
| Tablet | 640-1023px | 2 |
| Desktop | 1024-1279px | 3 |
| Wide | 1280px+ | 4 (max-w-7xl) |

### Touch Targets
- Minimum: 44x44px on mobile
- Buttons: min-height 48px on mobile
- Nav items: min-height 44px

## Media Assets (from Google Drive)
Located: `/vantix/media-assets/Vantix media/`
- Videos: hero bg, cinematic data viz, vantix showcases (x4)
- Images: workspace setup, client results, dashboard mockups, process, service icons
- Logo: logo-v.png (bronze metallic)

## Anti-Patterns (DO NOT)
- No paper textures on dark backgrounds
- No mixing light and dark themes on same page
- No more than 2 font families
- No gradients that don't use brand colors
- No blue/green tech accents — bronze/gold ONLY for accents
- No generic stock photos — use generated/custom media only
- No hardcoded colors — everything references tokens
