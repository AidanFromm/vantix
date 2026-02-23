'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

/* ── Navigation links ── */
const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#booking' },
];

/* ── Ease curve for framer-motion ── */
const ease = animations.easing as unknown as [number, number, number, number];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  /* Show/hide based on scroll direction */
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 60);

    if (latest < 60) {
      setVisible(true);
    } else if (latest < prev) {
      setVisible(true); // scrolling up
    } else if (latest > prev + 5) {
      setVisible(false); // scrolling down (with threshold)
    }
  });

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: visible || mobileOpen ? 0 : -100 }}
        transition={{ duration: 0.35, ease }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
          backgroundColor: scrolled ? 'rgba(244, 239, 232, 0.85)' : 'transparent',
          borderBottom: scrolled ? `1px solid ${colors.border}` : '1px solid transparent',
          transition: 'background-color 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo-nav.png"
              alt="Vantix logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: fonts.display, color: colors.text }}
            >
              vantix<span style={{ color: colors.bronze }}>.</span>
            </span>
          </a>

          {/* ── Desktop Links (center) ── */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </div>

          {/* ── Desktop CTA (right) ── */}
          <div className="hidden md:flex items-center">
            <a
              href="#booking"
              className="relative px-7 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden group"
              style={{
                fontFamily: fonts.body,
                background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
              }}
            >
              {/* Shimmer overlay */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative z-10">Book a Call</span>
            </a>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden relative z-50"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{ color: colors.bronze }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={26} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={26} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Slide-In Panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease }}
              className="fixed top-0 right-0 bottom-0 z-45 w-[80vw] max-w-sm flex flex-col pt-24 px-8 pb-10"
              style={{
                backgroundColor: colors.bg,
                borderLeft: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex flex-col gap-6">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease }}
                    className="text-2xl font-semibold"
                    style={{ fontFamily: fonts.display, color: colors.text }}
                  >
                    {l.label}
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="mt-auto"
              >
                <a
                  href="#booking"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-4 rounded-full text-white font-semibold text-lg"
                  style={{
                    fontFamily: fonts.body,
                    background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
                  }}
                >
                  Book a Call
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── NavLink with bronze underline on hover ── */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="relative text-sm py-1 group"
      style={{ fontFamily: fonts.body, color: colors.muted }}
    >
      <span className="transition-colors duration-200 group-hover:text-[#B07A45]">
        {label}
      </span>
      {/* Bronze underline */}
      <span
        className="absolute left-0 -bottom-0.5 h-[2px] w-0 group-hover:w-full transition-all duration-300"
        style={{ backgroundColor: colors.bronze }}
      />
    </a>
  );
}
