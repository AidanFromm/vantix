import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Services — Automation, Chatbots, Web Development | Vantix',
  description: 'Explore Vantix AI services: workflow automation, custom chatbots, AI-powered websites, and business analytics. Automate operations and scale revenue.',
  openGraph: {
    title: 'AI Services — Automation, Chatbots, Web Development | Vantix',
    description: 'Explore Vantix AI services: workflow automation, custom chatbots, AI-powered websites, and business analytics.',
    url: 'https://www.usevantix.com/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
