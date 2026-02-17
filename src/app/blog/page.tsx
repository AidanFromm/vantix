'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Bell, CheckCircle2, Send } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('vantix_blog_subs') || '[]');
    existing.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem('vantix_blog_subs', JSON.stringify(existing));
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D2A26]">
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E8E2DA]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <ArrowLeft className="w-4 h-4" /> Vantix
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2 text-sm font-semibold rounded-full text-[#5C4033] shadow-[4px_4px_10px_#c8c4be,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] transition-all"
            style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="w-20 h-20 rounded-2xl bg-[#FAFAFA] shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] flex items-center justify-center mx-auto mb-8">
            <BookOpen className="w-10 h-10 text-[#B8895A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-xl text-[#8C857C] mb-2">Coming Soon</p>
          <p className="text-[#8C857C] mb-10 max-w-md mx-auto leading-relaxed">
            We're working on in-depth guides, case studies, and insights on AI automation, business strategy, and building with modern tools.
          </p>

          {subscribed ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAFAFA] border border-[#E8E2DA] shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]">
              <CheckCircle2 className="w-5 h-5 text-[#B8895A]" />
              <span className="font-medium">You're on the list. We'll notify you.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-full bg-[#FAFAFA] border border-[#E8E2DA] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/30 transition-shadow text-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 text-[#5C4033] font-semibold rounded-full shadow-[6px_6px_14px_#c8c4be,-6px_-6px_14px_#ffffff] hover:shadow-[8px_8px_18px_#c8c4be,-8px_-8px_18px_#ffffff] transition-all text-sm"
                style={{ background: 'linear-gradient(to right, #E6C78C, #D4A85C, #C89B4E, #DDB878)' }}
              >
                <Bell className="w-4 h-4" /> Notify Me
              </button>
            </form>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-[#E8E2DA] py-8 text-center text-sm text-[#8C857C]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vantix {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#2D2A26] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2D2A26] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
