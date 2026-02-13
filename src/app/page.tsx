import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  HeroSection, 
  ServicesSection, 
  TestimonialsSection, 
  PricingSection, 
  CTASection 
} from '@/components/landing/UltimateSections';
import { PortfolioSection } from '@/components/landing/PortfolioSection';

export const metadata: Metadata = {
  title: 'Vantix | Digital Solutions That Actually Work',
  description: 'We build websites, apps, and automation systems that help businesses launch, grow, and dominate. From startups to enterprise — custom digital solutions that convert.',
  openGraph: {
    title: 'Vantix | Digital Solutions That Actually Work',
    description: 'Websites, apps, automation, and systems for businesses worldwide.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a] overflow-hidden">
      <Header />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
