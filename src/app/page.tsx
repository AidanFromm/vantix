import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import { Stats, Problem, Services, Pricing, Process, Testimonials, HiddenDashboardButton } from '@/components/landing/StaticSections';
import { FAQ, Contact } from '@/components/landing/InteractiveSections';

export const metadata: Metadata = {
  title: 'Vantix | Digital Solutions for Businesses Worldwide',
  description: 'Websites, apps, automation, and systems for businesses worldwide. From startups to enterprise — custom digital solutions that help you launch, grow, and scale. Call (908) 498-7753.',
};

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <Header />
      <HiddenDashboardButton />
      <HeroSection />
      <Stats />
      <Problem />
      <Services />
      <Pricing />
      <Process />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
