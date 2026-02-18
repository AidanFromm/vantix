import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Vantix',
  description: 'Vantix terms of service — the agreement governing use of our services.',
  openGraph: { title: 'Terms of Service | Vantix', description: 'Terms governing use of Vantix services.' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5EDE4] text-[#2C1810]">
      <nav className="sticky top-0 z-50 bg-[#F5EDE4]/90 backdrop-blur-md border-b border-[#E8D8CA]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 prose prose-neutral prose-sm max-w-none">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-[#9C8575] mb-8">Last updated: February 17, 2026</p>

        <p>These Terms of Service (&quot;Terms&quot;) govern your use of the Vantix website (usevantix.com) and any consulting, development, or automation services provided by Vantix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).</p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Services</h2>
        <p>Vantix provides AI consulting, custom software development, automation, and related technology services. The specific scope, deliverables, and timelines for each engagement will be outlined in a separate Statement of Work (SOW) or service agreement.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Engagement & Scope</h2>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>All projects begin after mutual agreement on scope, timeline, and pricing</li>
          <li>Changes to scope may result in adjustments to timeline and cost</li>
          <li>We reserve the right to subcontract work to qualified team members or AI tools</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Payment Terms</h2>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Payment schedules will be defined in individual service agreements</li>
          <li>Typical structure: deposit upon signing, milestone payments, final payment on delivery</li>
          <li>Late payments may incur a fee of 1.5% per month on outstanding balances</li>
          <li>We accept payments via Stripe, wire transfer, and other agreed methods</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Upon full payment, clients receive ownership of custom-built deliverables as specified in the SOW</li>
          <li>Vantix retains ownership of proprietary tools, frameworks, and reusable components developed independently</li>
          <li>We reserve the right to showcase completed work in our portfolio unless otherwise agreed in writing</li>
          <li>Open-source components used in projects retain their original licenses</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Confidentiality</h2>
        <p>Both parties agree to maintain confidentiality of proprietary information shared during the engagement. This includes business data, technical specifications, strategies, and any information marked as confidential.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law:</p>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Vantix shall not be liable for indirect, incidental, special, or consequential damages</li>
          <li>Our total liability for any claim shall not exceed the amount paid for the specific service giving rise to the claim</li>
          <li>We do not guarantee specific business outcomes, revenue increases, or cost savings</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Warranties</h2>
        <p>We warrant that services will be performed in a professional and workmanlike manner. All deliverables are provided &quot;as is&quot; after the agreed warranty/support period. We do not warrant uninterrupted or error-free operation of any software.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">8. Termination</h2>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Either party may terminate an engagement with 14 days written notice</li>
          <li>Client is responsible for payment of all work completed up to the termination date</li>
          <li>Completed deliverables will be transferred upon receipt of final payment</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">9. Website Use</h2>
        <p>By using our website, you agree not to:</p>
        <ul className="list-disc pl-6 space-y-1 text-[#5C5650]">
          <li>Use the site for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the site</li>
          <li>Reproduce or distribute content without permission</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">10. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to conflict of law principles.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">11. Contact</h2>
        <p>For questions about these Terms, contact us at:</p>
        <ul className="list-none pl-0 space-y-1 text-[#5C5650]">
          <li>Email: hello@usevantix.com</li>
          <li>Phone: (908) 498-7753</li>
          <li>Website: <Link href="/contact" className="text-[#8B5E3C] hover:underline">usevantix.com/contact</Link></li>
        </ul>
      </article>

      <footer className="border-t border-[#E8D8CA] py-8 text-center text-sm text-[#9C8575]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2C1810] transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-[#2C1810] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
