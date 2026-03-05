'use client';

import dynamic from 'next/dynamic';

import FloatingNav from './FloatingNav';
import ChatWidget from '../ChatWidget';
import VideoHero from './VideoHero';

const SocialProofBar = dynamic(() => import('./SocialProofBar'), { ssr: false });
const ProblemSolutionSection = dynamic(() => import('./ProblemSolutionSection'), { ssr: false });
const ServicesBentoSection = dynamic(() => import('./ServicesBentoSection'), { ssr: false });
const ProductShowcaseSection = dynamic(() => import('./ProductShowcaseSection'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });
const CaseStudySection = dynamic(() => import('./CaseStudySection'), { ssr: false });
const BookingSection = dynamic(() => import('./BookingSection'), { ssr: false });
const ROISection = dynamic(() => import('./ROISection'), { ssr: false });
const TeamSection = dynamic(() => import('./TeamSection'), { ssr: false });
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false });
const FinalCTASection = dynamic(() => import('./FinalCTASection'), { ssr: false });
const FooterSection = dynamic(() => import('./FooterSection'), { ssr: false });

export default function FuturisticLanding() {
  return (
    <div className="min-h-screen scroll-smooth" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <FloatingNav />
      <VideoHero />
      <SocialProofBar />
      <ProblemSolutionSection />
      <ServicesBentoSection />
      <ProductShowcaseSection />
      <ProcessSection />
      <CaseStudySection />
      <BookingSection />
      <ROISection />
      <TeamSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
      <ChatWidget />
    </div>
  );
}
