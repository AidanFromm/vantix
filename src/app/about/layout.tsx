import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vantix — AI Automation Agency',
  description: 'Meet the team behind Vantix. We are an AI consulting agency that builds intelligent systems to help businesses generate revenue, cut costs, and scale.',
  openGraph: {
    title: 'About Vantix — AI Automation Agency',
    description: 'Meet the team behind Vantix and learn about our mission to bring AI automation to every business.',
    url: 'https://www.usevantix.com/about',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
