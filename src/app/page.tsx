import { ConsultantLanding } from '@/components/landing/ConsultantLanding';

export const metadata = {
  title: 'Vantix | AI Consultants Who Actually Build',
  description: 'We consult, build, and manage AI systems that work. Strategy + implementation + ongoing support from one partner. Book a free discovery call.',
  openGraph: {
    title: 'Vantix | AI Consultants Who Actually Build',
    description: 'Most consultants hand you a strategy deck and disappear. We consult, build, and manage—so your AI actually works.',
    type: 'website',
  },
};

export default function Home() {
  return <ConsultantLanding />;
}
