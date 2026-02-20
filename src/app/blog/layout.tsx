import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — AI Automation Insights & Strategy | Vantix',
  description: 'Read actionable insights on AI automation, business strategy, and digital transformation. Learn how to cut costs and scale with AI.',
  openGraph: {
    title: 'Blog — AI Automation Insights & Strategy | Vantix',
    description: 'Actionable insights on AI automation, business strategy, and digital transformation.',
    url: 'https://www.usevantix.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
