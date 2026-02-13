'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 flex items-center justify-between h-14 sm:h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-emerald-500/25"
          >
            V
          </motion.div>
          <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            Vantix
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            link.href === '/#contact' ? (
              <motion.a
                key={link.href}
                href="#contact"
                onClick={handleContactClick}
                whileHover={{ y: -2 }}
                className="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-1/2 transition-all duration-300 rounded-full" />
              </motion.a>
            ) : (
              <motion.div key={link.href} whileHover={{ y: -2 }}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors block group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 group-hover:w-1/2 transition-all duration-300 rounded-full" />
                </Link>
              </motion.div>
            )
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <motion.a
            href="#contact"
            onClick={handleContactClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
          >
            Start Project
            <ArrowRight size={16} />
          </motion.a>
        </div>

        {/* Mobile menu toggle */}
        <motion.button
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9 }}
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col px-4 sm:px-6 py-4 sm:py-6 gap-1 sm:gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.href === '/#contact' ? (
                    <a
                      href="#contact"
                      onClick={(e) => { setMobileOpen(false); handleContactClick(e); }}
                      className="text-lg text-white/80 hover:text-emerald-400 transition-colors py-3 px-4 rounded-xl hover:bg-white/5 block cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg text-white/80 hover:text-emerald-400 transition-colors py-3 px-4 rounded-xl hover:bg-white/5 block"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 space-y-3"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 border border-white/10 text-white px-5 py-3.5 rounded-xl text-base bg-white/5"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <a
                  href="#contact"
                  onClick={(e) => { setMobileOpen(false); handleContactClick(e); }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-5 py-3.5 rounded-xl font-semibold text-base cursor-pointer"
                >
                  Start Your Project
                  <ArrowRight size={18} />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
