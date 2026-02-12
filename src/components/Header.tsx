'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const user = localStorage.getItem('vantix_user');
      setIsLoggedIn(!!user);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-black font-bold text-lg">V</span>
          <span className="text-lg font-bold text-white group-hover:text-[var(--color-accent)] transition-colors">Vantix</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href === '/#contact' ? (
              <a
                key={link.href}
                href="#contact"
                onClick={handleContactClick}
                className="text-sm text-[var(--color-muted)] hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white hover:border-[var(--color-accent)] px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            <LayoutDashboard size={16} strokeWidth={1.5} />
            Dashboard
          </Link>
          <a
            href="#contact"
            onClick={handleContactClick}
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors cursor-pointer"
          >
            Start a Project
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[var(--color-border)] overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                link.href === '/#contact' ? (
                  <a
                    key={link.href}
                    href="#contact"
                    onClick={(e) => { setMobileOpen(false); handleContactClick(e); }}
                    className="text-base text-[var(--color-muted)] hover:text-white transition-colors py-2 cursor-pointer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-[var(--color-muted)] hover:text-white transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] text-white px-5 py-3 rounded-lg text-sm mt-2"
              >
                <LayoutDashboard size={16} strokeWidth={1.5} />
                Dashboard
              </Link>
              <a
                href="#contact"
                onClick={(e) => { setMobileOpen(false); handleContactClick(e); }}
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-black px-5 py-3 rounded-lg font-semibold text-sm mt-1 cursor-pointer"
              >
                Start a Project
                <ArrowRight size={16} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
