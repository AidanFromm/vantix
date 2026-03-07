/**
 * Vantix Design System v3.0 — Light/Cream Theme
 * Warm cream backgrounds with bronze/gold accents.
 */

export const colors = {
  // Backgrounds (light cream)
  bg: '#FAFAF7',
  bgElevated: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgCardHover: '#FFFFFF',
  bgWarm: '#F3F0EB',
  surface: '#F3F0EB',

  // Text
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  muted: '#6B6B6B',
  textMuted: '#999999',
  textAccent: '#B8935A',

  // Bronze/Gold family
  bronze: '#B8935A',
  bronzeLight: '#D4B87A',
  bronzeDark: '#7D5F35',
  bronzeHover: '#A07D4A',
  copper: '#C87F4E',
  peach: '#D9A06B',

  // Borders
  border: 'rgba(0,0,0,0.06)',
  borderDefault: 'rgba(0,0,0,0.08)',
  borderHover: 'rgba(0,0,0,0.12)',
  borderAccent: 'rgba(184,147,90,0.3)',

  // Status
  positive: '#4CAF7A',
  negative: '#CF5555',
  warning: '#D4A05A',

  // Legacy aliases (for pages that still reference old tokens)
  dark: '#FAFAF7',
  darkSurface: '#F3F0EB',
  bgAlt: '#F3F0EB',

  /* Dark theme (reference):
  bg: '#0A0A0A',
  bgElevated: '#141416',
  bgCard: '#1A1A1E',
  bgCardHover: '#242428',
  surface: '#1E1E24',
  text: '#F0EBE3',
  textSecondary: '#9090A0',
  border: 'rgba(255,255,255,0.06)',
  */
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
