'use client';

import Link from 'next/link';
import { colors, fonts } from '@/lib/design-tokens';

const links = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Login', href: '/login' },
];

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: colors.dark, borderTop: `1px solid ${colors.darkSurface}` }} className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Vantix<span style={{ color: colors.bronze }}>.</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ fontFamily: fonts.body, color: colors.muted }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = colors.bronze; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = colors.muted; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="mt-10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${colors.darkSurface}` }}
        >
          <p className="text-xs" style={{ fontFamily: fonts.body, color: colors.textSecondary }}>
            © 2026 Vantix LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="transition-colors duration-200"
              aria-label="Twitter"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = colors.bronze; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = colors.textSecondary; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="#"
              className="transition-colors duration-200"
              aria-label="LinkedIn"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = colors.bronze; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = colors.textSecondary; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
