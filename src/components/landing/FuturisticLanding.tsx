'use client';

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(() => import('../SmoothScroll'), { ssr: false });

import FloatingNav from './FloatingNav';
import ChatWidget from '../ChatWidget';
// import NewHero from './NewHero';
import ProductShowcaseHero from './ProductShowcaseHero';
import SocialProofBar from './SocialProofBar';
import ProblemSolutionSection from './ProblemSolutionSection';
import ServicesBentoSection from './ServicesBentoSection';
import ProcessSection from './ProcessSection';
import FinalCTASection from './FinalCTASection';
import FooterSection from './FooterSection';

// Lazy load heavy below-fold sections
const CaseStudySection = dynamic(() => import('./CaseStudySection'), { ssr: false });
const ROISection = dynamic(() => import('./ROISection'), { ssr: false });
const TeamSection = dynamic(() => import('./TeamSection'), { ssr: false });
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false });
const BookingSection = dynamic(() => import('./BookingSection'), { ssr: false });

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
