'use client';

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(() => import('../SmoothScroll'), { ssr: false });

import FloatingNav from './FloatingNav';
import ChatWidget from '../ChatWidget';
import ProductShowcaseHero from './ProductShowcaseHero';

// Lazy load all sections below hero
const SocialProofBar = dynamic(() => import('./SocialProofBar'), { ssr: false });
const ProblemSolutionSection = dynamic(() => import('./ProblemSolutionSection'), { ssr: false });
const ServicesBentoSection = dynamic(() => import('./ServicesBentoSection'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });
const CaseStudySection = dynamic(() => import('./CaseStudySection'), { ssr: false });
const ROISection = dynamic(() => import('./ROISection'), { ssr: false });
const TeamSection = dynamic(() => import('./TeamSection'), { ssr: false });
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false });
const BookingSection = dynamic(() => import('./BookingSection'), { ssr: false });
const FinalCTASection = dynamic(() => import('./FinalCTASection'), { ssr: false });
const FooterSection = dynamic(() => import('./FooterSection'), { ssr: false });

export default function FuturisticLanding() {
  return (
    <SmoothScroll>
      <div className="min-h-screen" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        <FloatingNav />

        {/* Hero */}
        <ProductShowcaseHero />

        {/* Social Proof */}
        <SocialProofBar />

        {/* Services */}
        <ServicesBentoSection />

        {/* Process */}
        <ProcessSection />

        {/* 📅 Booking — RIGHT after Process so mobile users convert fast */}
        <BookingSection />

        {/* Problem → Solution — hidden on mobile (too long with sticky scroll) */}
        <div className="hidden lg:block">
          <ProblemSolutionSection />
        </div>

        {/* Case Studies */}
        <CaseStudySection />

        {/* ROI — hidden on mobile (stats already shown in Social Proof) */}
        <div className="hidden lg:block">
          <ROISection />
        </div>

        {/* Team */}
        <TeamSection />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <FinalCTASection />

        <FooterSection />

        <ChatWidget />
      </div>
    </SmoothScroll>
  );
}