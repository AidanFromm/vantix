import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About & Contact | Vantix',
  description:
    'Meet the team behind Vantix. Two founders building digital solutions that deliver real results for businesses worldwide.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
