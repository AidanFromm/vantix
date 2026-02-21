import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Readiness Assessment — Vantix',
  description: 'Take our free AI readiness assessment to discover how prepared your business is for automation. Get a personalized score and actionable recommendations.',
  openGraph: {
    title: 'Free AI Readiness Assessment — Vantix',
    description: 'Discover how prepared your business is for AI automation with our free assessment tool.',
    url: 'https://www.usevantix.com/ai-assessment',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
