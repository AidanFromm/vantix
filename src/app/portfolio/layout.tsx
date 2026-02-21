import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Our Work | Vantix',
  description: 'Explore the Vantix portfolio — custom AI-powered platforms, e-commerce builds, automation systems, and more built for real businesses.',
  openGraph: {
    title: 'Portfolio — Our Work | Vantix',
    description: 'See the custom AI platforms and automation systems we have built for businesses.',
    url: 'https://www.usevantix.com/portfolio',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
