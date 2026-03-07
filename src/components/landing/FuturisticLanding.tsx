'use client';

import dynamic from 'next/dynamic';

import FloatingNav from './FloatingNav';
import HeroSection from './HeroSection';
import ChatWidget from '../ChatWidget';

const ProjectsShowcase = dynamic(() => import('./ProjectsShowcase'), { ssr: false });
const ServicesSection = dynamic(() => import('./ServicesSection'), { ssr: false });
const ProcessSectionNew = dynamic(() => import('./ProcessSectionNew'), { ssr: false });
const PricingSection = dynamic(() => import('./PricingSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), { ssr: false });
const FAQSectionNew = dynamic(() => import('./FAQSectionNew'), { ssr: false });
const ContactSection = dynamic(() => import('./ContactSection'), { ssr: false });
const FooterSectionNew = dynamic(() => import('./FooterSectionNew'), { ssr: false });

export default function FuturisticLanding() {
  return (
    <div className="min-h-screen scroll-smooth" style={{ backgroundColor: '#0A0A0A' }}>
      <FloatingNav />
      <HeroSection />
      <ProjectsShowcase />
      <ServicesSection />
      <ProcessSectionNew />
      <PricingSection />
      <TestimonialsSection />
      <FAQSectionNew />
      <ContactSection />
      <FooterSectionNew />
      <ChatWidget />
    </div>
  );
}
