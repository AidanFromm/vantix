/**
 * Vantix Design System v2.0 — Core Tokens
 * Dark premium theme with bronze/gold accents.
 * Single source of truth for colors, typography, and animation values.
 */

export const colors = {
  // Backgrounds (dark-first)
  bg: '#0A0A0A',
  bgElevated: '#141416',
  bgCard: '#1A1A1E',
  bgCardHover: '#242428',
  surface: '#1E1E24',

  // Text
  text: '#F0EBE3',
  textSecondary: '#9090A0',
  muted: '#9090A0',
  textMuted: '#5A5A6A',
  textAccent: '#B8935A',

  // Bronze/Gold family
  bronze: '#B8935A',
  bronzeLight: '#D4B87A',
  bronzeDark: '#7D5F35',
  copper: '#C87F4E',
  peach: '#D9A06B',

  // Borders
  border: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.10)',
  borderHover: 'rgba(255,255,255,0.15)',
  borderAccent: 'rgba(184,147,90,0.3)',

  // Status
  positive: '#4CAF7A',
  negative: '#CF5555',
  warning: '#D4A05A',

  // Legacy aliases
  dark: '#0A0A0A',
  darkSurface: '#1A1A1E',
  bgAlt: '#141416',
};

export const fonts = {
  display: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const animations = {
  fast: '150ms',
  normal: '300ms',
  slow: '600ms',
  entrance: '600ms',
  hero: '800ms',
  easing: [0.16, 1, 0.3, 1] as const,
};
