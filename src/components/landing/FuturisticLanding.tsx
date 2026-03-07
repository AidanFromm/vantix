'use client';

import dynamic from 'next/dynamic';

import FloatingNav from './FloatingNav';
import HeroSection from './HeroSection';
import ChatWidget from '../ChatWidget';

const PortfolioSection = dynamic(() => import('./PortfolioSection'), { ssr: false });
const ServicesSection = dynamic(() => import('./ServicesSection'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });
const PricingSection = dynamic(() => import('./PricingSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), { ssr: false });
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false });
const ContactSection = dynamic(() => import('./ContactSection'), { ssr: false });
const FooterSection = dynamic(() => import('./FooterSection'), { ssr: false });

export default function FuturisticLanding() {
  return (
    <div className="min-h-screen scroll-smooth" style={{ backgroundColor: '#FAFAF7' }}>
      <FloatingNav />
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
      <ChatWidget />
    </div>
  );
}
