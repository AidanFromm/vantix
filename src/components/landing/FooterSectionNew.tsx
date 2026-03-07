'use client';

import { InstagramLogo, TwitterLogo, LinkedinLogo } from '@phosphor-icons/react';
import { colors, fonts } from '@/lib/design-tokens';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

const serviceLinks = [
  'Web Design',
  'AI Automation',
  'Brand Identity',
  'Growth & SEO',
];

export default function FooterSectionNew() {
  return (
    <footer className="px-6 pt-20 pb-10" style={{ backgroundColor: colors.bgElevated, borderTop: `1px solid ${colors.border}` }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo */}
          <div>
            <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: fonts.display, color: colors.text }}>
              vantix<span style={{ color: colors.bronze }}>.</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
              Brand identity, web, and AI — built from the same foundation.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-[#B8935A] transition-colors" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
              Services
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <span className="text-sm" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
              Connect
            </h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                <InstagramLogo size={22} weight="light" color={colors.textSecondary} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:opacity-80 transition-opacity">
                <TwitterLogo size={22} weight="light" color={colors.textSecondary} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity">
                <LinkedinLogo size={22} weight="light" color={colors.textSecondary} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8" style={{ borderTop: `1px solid ${colors.border}` }}>
          <p className="text-xs" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
            &copy; 2026 Vantix LLC. All rights reserved.
          </p>
          <a href="#hero" className="text-xs mt-3 sm:mt-0 hover:text-[#B8935A] transition-colors" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
            Back to Top &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
