import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/audit', label: 'Free Website Audit' },
];

const serviceLinks = [
  { href: '/services/web-design-nj', label: 'Web Design & Development' },
  { href: '/services/web-design-tampa', label: 'Custom Web Apps' },
  { href: '/services/web-design-orlando', label: 'E-Commerce Solutions' },
  { href: '/services/small-business-websites', label: 'Startup Packages' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-black font-bold text-lg">V</span>
              <span className="text-lg font-bold text-white">Vantix</span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Full-service digital agency. Websites, apps, automation, and systems for businesses worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:9084987753" className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  <Phone size={16} className="text-[var(--color-accent)]" />
                  (908) 498-7753
                </a>
              </li>
              <li>
                <a href="mailto:usevantix@gmail.com" className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  <Mail size={16} className="text-[var(--color-accent)]" />
                  usevantix@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-border)] py-6">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} Vantix LLC. All rights reserved.</p>
          <Link href="/dashboard" className="text-xs text-[var(--color-muted)] hover:text-white transition-colors">Team</Link>
        </div>
      </div>
    </footer>
  );
}
