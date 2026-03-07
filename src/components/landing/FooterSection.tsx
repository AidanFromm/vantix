'use client';

import Image from 'next/image';

export default function FooterSection() {
  return (
    <footer className="py-12 border-t border-black/[0.06]" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/vantix-logo.png" alt="Vantix" width={100} height={30} className="h-7 w-auto" />
          <div className="flex items-center gap-6 text-sm text-[#6B6B6B]">
            <a href="#work" className="hover:text-[#1A1A1A] transition-colors">Work</a>
            <a href="#services" className="hover:text-[#1A1A1A] transition-colors">Services</a>
            <a href="#pricing" className="hover:text-[#1A1A1A] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
          </div>
          <p className="text-sm text-[#999]">© 2026 Vantix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
