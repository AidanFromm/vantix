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

// ============================================
// VANTIX — Landing Page V2
// Complete rebuild: cream + bronze, research-backed
// ============================================

export default function FuturisticLanding() {
  return (
    <SmoothScroll>
      <div className="min-h-screen" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        {/* Navigation */}
        <FloatingNav />

        {/* Hero */}
        {/* <NewHero /> */}
        <ProductShowcaseHero />

        {/* Social Proof Logo Bar */}
        <SocialProofBar />

        {/* Problem → Solution (Sticky Scroll) */}
        <ProblemSolutionSection />

        {/* Services Bento Grid */}
        <ServicesBentoSection />

        {/* Process Timeline */}
        <ProcessSection />

        {/* Case Studies */}
        <CaseStudySection />

        {/* ROI Numbers */}
        <ROISection />

        {/* Team */}
        <TeamSection />

        {/* FAQ */}
        <FAQSection />

        {/* Booking Calendar */}
        <BookingSection />

        {/* Final CTA */}
        <FinalCTASection />

        {/* Footer */}
        <FooterSection />

        {/* AI Chat Widget */}
        <ChatWidget />
      </div>
    </SmoothScroll>
  );
}
