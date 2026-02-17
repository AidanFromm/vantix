import { FuturisticLanding } from '@/components/landing/FuturisticLanding';

export const metadata = {
  title: 'Vantix | AI-Powered Business Solutions',
  description: 'We deploy AI systems that generate revenue, cut costs, and automate operations. Custom AI chatbots, websites, automation, and analytics for businesses ready to scale.',
  openGraph: {
    title: 'Vantix | AI-Powered Business Solutions',
    description: 'We deploy AI systems that generate revenue, cut costs, and automate operations. Strategy + implementation + ongoing support from one partner.',
    type: 'website',
  },
};

export default function Home() {
  return <FuturisticLanding />;
}
