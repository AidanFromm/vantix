import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Get a Free AI Consultation | Vantix',
  description: 'Reach out to Vantix for a free AI consultation. Tell us about your business and we\'ll show you how automation can save time and increase revenue.',
  openGraph: {
    title: 'Contact Us — Get a Free AI Consultation | Vantix',
    description: 'Reach out to Vantix for a free AI consultation. Tell us about your business challenges.',
    url: 'https://www.usevantix.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
