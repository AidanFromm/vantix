import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — Real AI Results for Real Businesses | Vantix',
  description: 'See how Vantix helped businesses automate operations, build custom platforms, and increase revenue with AI-powered solutions.',
  openGraph: {
    title: 'Case Studies — Real AI Results for Real Businesses | Vantix',
    description: 'See how Vantix helped businesses automate operations, build custom platforms, and increase revenue.',
    url: 'https://www.usevantix.com/case-studies',
  },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
