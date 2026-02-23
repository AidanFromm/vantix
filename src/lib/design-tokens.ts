/**
 * Vantix Design System — Core Tokens
 * Single source of truth for colors, typography, and animation values.
 */

export const colors = {
  bg: '#F4EFE8',
  bgAlt: '#EEE6DC',
  surface: '#EEE6DC',
  text: '#1C1C1C',
  textSecondary: '#4B4B4B',
  muted: '#7A746C',
  border: '#E3D9CD',
  borderHover: '#D8C2A8',
  bronze: '#B07A45',
  bronzeLight: '#C89A6A',
  bronzeDark: '#8E5E34',
  dark: '#0a0a0a',
  darkSurface: '#1C1C1C',
};

export const fonts = {
  display: "'Clash Display', sans-serif",
  body: "'Satoshi', sans-serif",
};

export const animations = {
  fast: '150ms',
  normal: '300ms',
  slow: '600ms',
  easing: [0.16, 1, 0.3, 1] as const,
};
