import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI ROI Calculator — Estimate Your Automation Savings | Vantix',
  description: 'Use our free ROI calculator to estimate how much time and money AI automation can save your business. Get a personalized report in under 2 minutes.',
  openGraph: {
    title: 'AI ROI Calculator — Estimate Your Automation Savings | Vantix',
    description: 'Estimate how much AI automation can save your business with our free calculator.',
    url: 'https://www.usevantix.com/roi-calculator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
