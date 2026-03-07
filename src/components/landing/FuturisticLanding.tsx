'use client';

import dynamic from 'next/dynamic';

import FloatingNav from './FloatingNav';
import ScrollProgressBar from './ScrollProgressBar';
import ChatWidget from '../ChatWidget';
import VideoHero from './VideoHero';

const MetricsBar = dynamic(() => import('./MetricsBar'), { ssr: false });
const HorizontalShowcase = dynamic(() => import('./HorizontalShowcase'), { ssr: false });
const VideoSplitSection = dynamic(() => import('./VideoSplitSection'), { ssr: false });
const ServicesBentoSection = dynamic(() => import('./ServicesBentoSection'), { ssr: false });
const BeforeAfterSection = dynamic(() => import('./BeforeAfterSection'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });
const CaseStudySection = dynamic(() => import('./CaseStudySection'), { ssr: false });
const VideoTrustSection = dynamic(() => import('./VideoTrustSection'), { ssr: false });
const BookingSection = dynamic(() => import('./BookingSection'), { ssr: false });
const FinalCTASection = dynamic(() => import('./FinalCTASection'), { ssr: false });
const FooterSection = dynamic(() => import('./FooterSection'), { ssr: false });

export default function FuturisticLanding() {
  return (
    <div className="min-h-screen scroll-smooth">
      <ScrollProgressBar />
      <FloatingNav />
      <VideoHero />
      <MetricsBar />
      <HorizontalShowcase />
      <VideoSplitSection />
      <ServicesBentoSection />
      <BeforeAfterSection />
      <ProcessSection />
      <CaseStudySection />
      <VideoTrustSection />
      <BookingSection />
      <FinalCTASection />
      <FooterSection />
      <ChatWidget />
    </div>
  );
}
