'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Check, Phone, MessageSquare, Scan, Package, BarChart3, Smartphone, Globe, Zap, Shield, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Smooth scroll progress hook
function useSmoothScroll() {
  const { scrollYProgress } = useScroll();
  return useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
}

// Parallax wrapper for depth effects
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Hero Section - Zooms INTO the screen as you scroll
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  // As you scroll, zoom INTO the content
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 2.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const blur = useTransform(scrollYProgress, [0.3, 0.5], [0, 20]);
  
  // Floating elements parallax
  const float1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const float2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const float3Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  
  return (
    <section ref={ref} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"
          style={{ scale }}
        />
        
        {/* Floating Depth Elements */}
        <motion.div
          style={{ y: float1Y }}
          className="absolute top-20 left-[10%] w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10"
        />
        <motion.div
          style={{ y: float2Y }}
          className="absolute top-40 right-[15%] w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10"
        />
        <motion.div
          style={{ y: float3Y }}
          className="absolute bottom-40 left-[20%] w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10"
        />
        
        {/* Main Content - Scales up as you scroll */}
        <motion.div
          style={{ scale, opacity, y, filter: `blur(${blur}px)` }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Custom Digital Solutions</span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8"
          >
            <span className="block">Scan.</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Sync.</span>
            <span className="block">Sell.</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Full inventory management. In-store and online. 
            <span className="text-white"> Real-time analytics.</span> 
            <span className="text-white"> iOS + Web apps.</span> 
            <span className="text-white/60"> All automated.</span>
          </motion.p>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            >
              Start Your Build
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
        
        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Immersive Feature Cards - Scroll to reveal
function Features() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const features = [
    {
      icon: Scan,
      title: 'Instant Scan-to-Inventory',
      description: 'Scan any barcode. Pull live market prices. Add to inventory in seconds.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Layers,
      title: 'Omnichannel Sync',
      description: 'Your website, in-store POS, and mobile app — always in sync, always accurate.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Sales trends, profit margins, inventory alerts. Know your numbers instantly.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Smartphone,
      title: 'iOS + Web Apps',
      description: 'Native mobile app for scanning on the go. Web dashboard for deep management.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];
  
  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Built for <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Modern Retail</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Stop juggling spreadsheets. Start running your business with tools that actually work together.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/50 text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// The Depth Scroll Section - Content flies toward you
function DepthScroll() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  // Elements come FROM the distance TOWARD you
  const z1 = useTransform(scrollYProgress, [0, 0.5, 1], [-500, 0, 200]);
  const z2 = useTransform(scrollYProgress, [0, 0.5, 1], [-800, -100, 100]);
  const z3 = useTransform(scrollYProgress, [0, 0.5, 1], [-1000, -200, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  const scale1 = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.9]);
  const scale3 = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.8]);
  
  return (
    <section ref={ref} className="h-[150vh] relative" style={{ perspective: '1000px' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity }} className="relative w-full max-w-6xl px-6">
          {/* Layer 3 - Furthest back */}
          <motion.div
            style={{ translateZ: z3, scale: scale3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-[200px] font-bold text-white/5">VANTIX</div>
            </div>
          </motion.div>
          
          {/* Layer 2 */}
          <motion.div
            style={{ translateZ: z2, scale: scale2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="grid grid-cols-3 gap-8 opacity-30">
              {[Globe, Shield, Zap].map((Icon, i) => (
                <div key={i} className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-white/50" />
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Layer 1 - Closest */}
          <motion.div
            style={{ translateZ: z1, scale: scale1 }}
            className="relative text-center"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              100% <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Custom</span>
            </h2>
            <p className="text-2xl text-white/60 max-w-2xl mx-auto">
              No templates. No cookie-cutter solutions. 
              Every system built exactly for <span className="text-white">your workflow</span>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// What We Automate Section
function Automations() {
  const automations = [
    'Inventory sync across all channels',
    'Price updates from live market data',
    'Low stock alerts & reorder triggers',
    'Sales reports delivered daily',
    'Payment processing & reconciliation',
    'Customer order tracking',
  ];
  
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            We <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Automate</span> Everything
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Stop doing repetitive tasks. Let the system handle it while you focus on growing.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {automations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Social Proof / Stats
function Stats() {
  return (
    <section className="py-20 border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50K+', label: 'Lines of Code' },
            { value: '100%', label: 'Custom Built' },
            { value: '<24h', label: 'Response Time' },
            { value: '∞', label: 'Possibilities' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-white/50 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section - Simple intake form
function Contact() {
  const [formData, setFormData] = useState({
    phone: '',
    businessType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Save to Supabase → show in dashboard
    setSubmitted(true);
  };
  
  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Build?
            </h2>
            <p className="text-xl text-white/50">
              Tell us about your business. We'll reach out within 24 hours.
            </p>
          </motion.div>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">We Got Your Info!</h3>
              <p className="text-white/50">Expect a call or text soon.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors text-lg"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">What type of business?</label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-blue-500/50 transition-colors text-lg appearance-none"
                >
                  <option value="" className="bg-[#0a0a0f]">Select one...</option>
                  <option value="retail" className="bg-[#0a0a0f]">Retail Store</option>
                  <option value="ecommerce" className="bg-[#0a0a0f]">E-Commerce</option>
                  <option value="service" className="bg-[#0a0a0f]">Service Business</option>
                  <option value="restaurant" className="bg-[#0a0a0f]">Restaurant / Food</option>
                  <option value="other" className="bg-[#0a0a0f]">Other</option>
                </select>
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">What do you need built?</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-white/30" size={20} />
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors resize-none text-lg"
                    placeholder="Website, app, inventory system, integrations..."
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-white/20"
              >
                Let's Talk
                <ArrowRight size={20} />
              </motion.button>
              
              <p className="text-center text-sm text-white/30">
                We'll text or call you — no spam, ever.
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Vantix
          </div>
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Vantix. All rights reserved.
          </p>
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors text-sm">
            Team Login →
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="bg-[#0a0a0f] overflow-x-hidden">
      <Hero />
      <Features />
      <DepthScroll />
      <Automations />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
