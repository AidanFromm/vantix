import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Get a Free AI Consultation | Vantix',
  description: 'Get in touch with Vantix for a free AI automation consultation. Tell us about your business and we will identify the highest-impact opportunities.',
  openGraph: {
    title: 'Contact Us — Get a Free AI Consultation | Vantix',
    description: 'Reach out for a free consultation on AI automation for your business.',
    url: 'https://www.usevantix.com/contact',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
