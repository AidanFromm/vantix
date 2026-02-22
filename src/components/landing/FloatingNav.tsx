'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import ShimmerButton from './ShimmerButton';

const links = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-[#F4EFE8]/90 shadow-sm border-b border-[#E3D9CD]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-nav.png"
            alt="Vantix logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
            priority
          />
          <span
            className="text-2xl font-extrabold tracking-tight text-[#1C1C1C]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            vantix<span className="text-[#B07A45]">.</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#7A746C] hover:text-[#B07A45] transition-colors"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {l.label}
            </a>
          ))}
          <a href="#booking">
            <ShimmerButton className="px-6 py-2.5 text-sm rounded-full">
              Book a Call
            </ShimmerButton>
          </a>
        </div>

        <button
          className="md:hidden text-[#B07A45]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F4EFE8]/95 backdrop-blur-xl border-b border-[#E3D9CD] overflow-hidden"
          >
            <div className="px-5 py-3 flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#7A746C] hover:text-[#B07A45] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a href="#booking" onClick={() => setMobileOpen(false)}>
                <ShimmerButton className="w-full text-sm rounded-full">
                  Book a Call
                </ShimmerButton>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
