'use client';

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(() => import('../SmoothScroll'), { ssr: false });

import FloatingNav from './FloatingNav';
import ChatWidget from '../ChatWidget';
import ProductShowcaseHero from './ProductShowcaseHero';

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
        <ProductShowcaseHero />
        <SocialProofBar />
        <ProblemSolutionSection />

        {/* 📅 Booking — right after the slide animation */}
        <BookingSection />

        <ServicesBentoSection />
        <ProcessSection />
        <CaseStudySection />

        <div className="hidden lg:block">
          <ROISection />
        </div>

        <TeamSection />
        <FAQSection />
        <FinalCTASection />
        <FooterSection />
        <ChatWidget />
      </div>
    </SmoothScroll>
  );
}