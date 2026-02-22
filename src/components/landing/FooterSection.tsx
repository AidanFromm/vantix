'use client';

import { Instagram, Twitter, Mail, Phone } from 'lucide-react';

const linkCols = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Work', href: '/case-studies' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram (@usevantix)', href: 'https://instagram.com/usevantix' },
      { label: 'X (@usevantix)', href: 'https://x.com/usevantix' },
      { label: 'Email', href: 'mailto:hello@usevantix.com' },
      { label: 'Phone', href: 'tel:+19084987753' },
    ],
  },
];

const socials = [
  { icon: Instagram, href: 'https://instagram.com/usevantix', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/usevantix', label: 'X' },
  { icon: Mail, href: 'mailto:hello@usevantix.com', label: 'Email' },
  { icon: Phone, href: 'tel:+19084987753', label: 'Phone' },
];

export default function FooterSection() {
  return (
    <footer className="bg-[#EEE6DC] border-t border-[#E3D9CD]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <span
              className="text-xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
            >
              vantix<span className="text-[#B07A45]">.</span>
            </span>
            <p
              className="text-[#7A746C] text-sm mt-1"
              style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
            >
              AI-first consulting for modern businesses.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-[#7A746C] hover:text-[#B07A45] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <s.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Middle row - links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
          {linkCols.map((col) => (
            <div key={col.title}>
              <h4
                className="text-sm font-semibold text-[#1C1C1C] mb-3 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-clash, "Clash Display", sans-serif)' }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#7A746C] hover:text-[#B07A45] transition-colors text-sm"
                      style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-[#E3D9CD] pt-6">
          <p className="text-[#7A746C] text-sm text-center">
            © 2026 Vantix LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
