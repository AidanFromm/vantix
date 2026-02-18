import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vantix',
  description: 'Vantix privacy policy — how we collect, use, and protect your data.',
  openGraph: { title: 'Privacy Policy | Vantix', description: 'How we collect, use, and protect your data.' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5EFE7] text-[#1E1E1E]">
      <nav className="sticky top-0 z-50 bg-[#F5EFE7]/90 backdrop-blur-md border-b border-[#D8CFC4]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 prose prose-neutral prose-sm max-w-none">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#A89F94] mb-8">Last updated: February 17, 2026</p>

        <p>Vantix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website usevantix.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage our services.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Information We Collect</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">Personal Information</h3>
        <p>We may collect personally identifiable information that you voluntarily provide when you:</p>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Fill out a contact form (name, email, company, message)</li>
          <li>Schedule a consultation through our booking system</li>
          <li>Subscribe to our newsletter</li>
          <li>Engage us for consulting or development services</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Automatically Collected Information</h3>
        <p>When you visit our website, we may automatically collect:</p>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and time spent</li>
          <li>Referring website addresses</li>
          <li>IP address (anonymized)</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>To respond to your inquiries and provide requested services</li>
          <li>To send relevant communications about our services</li>
          <li>To improve our website and user experience</li>
          <li>To analyze usage patterns via privacy-focused analytics (Plausible)</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Cookies & Tracking</h2>
        <p>We use Plausible Analytics, a privacy-focused analytics tool that does not use cookies and does not collect personal data. We do not use advertising trackers or sell your data to third parties.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Third-Party Services</h2>
        <p>We may use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li><strong>Plausible Analytics</strong> — privacy-focused website analytics</li>
          <li><strong>Cal.com</strong> — appointment scheduling</li>
          <li><strong>Stripe</strong> — payment processing (for contracted services)</li>
          <li><strong>Resend</strong> — transactional email delivery</li>
        </ul>
        <p>Each third-party service has its own privacy policy governing their use of your information.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. Data Retention</h2>
        <p>We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. You may request deletion of your data at any time.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Access your personal data</li>
          <li>Request correction or deletion of your data</li>
          <li>Opt out of marketing communications</li>
          <li>Request a copy of your data in a portable format</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">8. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, contact us at:</p>
        <ul className="list-none pl-0 space-y-1 text-[#5C5650]">
          <li>Email: hello@usevantix.com</li>
          <li>Phone: (908) 498-7753</li>
          <li>Website: <Link href="/contact" className="text-[#B07A45] hover:underline">usevantix.com/contact</Link></li>
        </ul>
      </article>

      <footer className="border-t border-[#D8CFC4] py-8 text-center text-sm text-[#A89F94]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[#1E1E1E] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#1E1E1E] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

