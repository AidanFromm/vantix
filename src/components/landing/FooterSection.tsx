'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, Instagram, ArrowUpRight } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Results', href: '#results' },
  { label: 'Book a Call', href: '#booking' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/usevantix', icon: Instagram },
];

export default function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <footer
      ref={ref}
      className="pt-20 pb-10 md:pt-24 md:pb-12 relative"
      style={{
        backgroundColor: colors.bg,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.bronze}40, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-extrabold"
                style={{
                  background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
                  color: colors.bg,
                }}
              >
                V
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: fonts.display, color: colors.text }}
              >
                Vantix
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-wrap items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-300 hover:text-white"
                  style={{ color: colors.muted, fontFamily: fonts.body }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: colors.bgCard,
                      border: `1px solid ${colors.border}`,
                    }}
                    aria-label={s.label}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className="transition-colors duration-300 group-hover:text-[#B8935A]"
                      style={{ color: colors.muted }}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Row */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 py-8 mb-10"
            style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}
          >
            <a
              href="mailto:usevantix@gmail.com"
              className="group flex items-center gap-2 text-sm transition-colors duration-300 hover:text-white"
              style={{ color: colors.muted, fontFamily: fonts.body }}
            >
              <Mail size={14} strokeWidth={1.5} style={{ color: colors.bronze }} />
              usevantix@gmail.com
              <ArrowUpRight
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: colors.bronze }}
              />
            </a>
            <a
              href="tel:+19084987753"
              className="group flex items-center gap-2 text-sm transition-colors duration-300 hover:text-white"
              style={{ color: colors.muted, fontFamily: fonts.body }}
            >
              <Phone size={14} strokeWidth={1.5} style={{ color: colors.bronze }} />
              (908) 498-7753
            </a>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-xs"
              style={{ color: colors.textMuted, fontFamily: fonts.body }}
            >
              © {new Date().getFullYear()} Vantix LLC. All rights reserved.
            </p>
            <p
              className="text-xs"
              style={{ color: colors.textMuted, fontFamily: fonts.body }}
            >
              AI-Powered Web Design & Automation
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
