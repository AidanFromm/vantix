import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — SecuredTampa E-Commerce Platform | Vantix',
  description: 'Explore the Vantix portfolio: a 100+ page custom e-commerce platform with POS integration, inventory management, and admin dashboard built in under 2 weeks.',
  openGraph: {
    title: 'Portfolio — SecuredTampa E-Commerce Platform | Vantix',
    description: 'Explore the Vantix portfolio: custom e-commerce platforms and AI-powered business tools.',
    url: 'https://www.usevantix.com/portfolio',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
