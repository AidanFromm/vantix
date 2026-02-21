import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — AI Automation Insights for Business | Vantix',
  description: 'Practical guides, case studies, and strategies on AI automation for small and mid-size businesses. Learn how to cut costs, save time, and scale smarter.',
  openGraph: {
    title: 'Blog — AI Automation Insights for Business | Vantix',
    description: 'Practical guides and strategies on AI automation for businesses.',
    url: 'https://www.usevantix.com/blog',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
