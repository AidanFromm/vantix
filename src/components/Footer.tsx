'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#contact', label: 'Contact' },
  { href: '/roi-calculator', label: 'ROI Calculator' },
  { href: '/ai-assessment', label: 'AI Assessment' },
];

const serviceLinks = [
  { href: '/#services', label: 'Custom Websites' },
  { href: '/#services', label: 'Web Applications' },
  { href: '/#services', label: 'E-Commerce' },
  { href: '/#services', label: 'Business Automation' },
  { href: '/#services', label: 'Enterprise Solutions' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#1C1C1C]">
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#B07A45]/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B07A45] to-[#B07A45] flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform">
                V
              </div>
              <span className="text-xl font-bold text-white">Vantix</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Full-service digital agency. Websites, apps, automation, and systems for businesses worldwide.
            </p>
            {/* Social links coming soon */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Navigate</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#C89A6A] transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#C89A6A] transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+19084987753" 
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-[#C89A6A] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#B07A45]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-[#C89A6A]" />
                  </div>
                  (908) 498-7753
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@usevantix.com" 
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-[#C89A6A] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#B07A45]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-[#C89A6A]" />
                  </div>
                  hello@usevantix.com
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <div className="w-10 h-10 rounded-lg bg-[#B07A45]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-[#C89A6A]" />
                  </div>
                  Remote — Worldwide
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Vantix LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Team</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
