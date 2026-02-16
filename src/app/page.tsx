import { LightLanding } from '@/components/landing/LightLanding';

export const metadata = {
  title: 'Vantix | Digital Solutions That Actually Work',
  description: 'We build websites, apps, and automation systems that help businesses launch, grow, and dominate. From startups to enterprise — custom digital solutions that convert.',
  openGraph: {
    title: 'Vantix | Digital Solutions That Actually Work',
    description: 'Websites, apps, automation, and systems for businesses worldwide.',
    type: 'website',
  },
};

export default function Home() {
  return <LightLanding />;
}
