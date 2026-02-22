'use client';

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(() => import('../SmoothScroll'), { ssr: false });

import FloatingNav from './FloatingNav';
import ChatWidget from '../ChatWidget';
import NewHero from './NewHero';
import SocialProofBar from './SocialProofBar';
import ProblemSolutionSection from './ProblemSolutionSection';
import ServicesBentoSection from './ServicesBentoSection';
import ProcessSection from './ProcessSection';
import CaseStudySection from './CaseStudySection';
import ROISection from './ROISection';
import TeamSection from './TeamSection';
import FAQSection from './FAQSection';
import FinalCTASection from './FinalCTASection';
import FooterSection from './FooterSection';

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
        <NewHero />

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

        {/* Final CTA + Booking */}
        <FinalCTASection />

        {/* Footer */}
        <FooterSection />

        {/* AI Chat Widget */}
        <ChatWidget />
      </div>
    </SmoothScroll>
  );
}
