'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Globe, Smartphone, Package, Sparkles, ArrowRight, Check, Mail, User, MessageSquare, ChevronDown, Zap, Shield, TrendingUp, BarChart3 } from 'lucide-react';
import { brand } from '@/lib/brand';
import Link from 'next/link';

// Mouse Parallax Hook
function useMouseParallax(strength: number = 0.1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    };
    
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [x, y, strength]);
  
  return { x: useSpring(x, { stiffness: 100, damping: 30 }), y: useSpring(y, { stiffness: 100, damping: 30 }) };
}

// Animated Counter
function Counter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [isVisible, value, duration]);
  
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// 3D Floating Shape
function FloatingShape({ 
  className, 
  delay = 0, 
  size = 100, 
  color = 'blue' 
}: { 
  className?: string; 
  delay?: number; 
  size?: number; 
  color?: string;
}) {
  const colors = {
    blue: 'from-blue-500/30 to-blue-600/10',
    purple: 'from-purple-500/30 to-purple-600/10',
    cyan: 'from-cyan-500/30 to-cyan-600/10',
    pink: 'from-pink-500/30 to-pink-600/10',
  };
  
  return (
    <motion.div
      className={`absolute rounded-3xl bg-gradient-to-br ${colors[color as keyof typeof colors]} backdrop-blur-3xl ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        rotateX: [0, 15, 0],
        rotateY: [0, 15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Hero Section with 3D Effects
function Hero() {
  const { x, y } = useMouseParallax(0.05);
  const { x: x2, y: y2 } = useMouseParallax(0.1);
  const { x: x3, y: y3 } = useMouseParallax(0.02);
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"
          style={{ x: x3, y: y3 }}
        />
      </div>
      
      {/* Floating 3D Shapes */}
      <motion.div style={{ x, y }} className="absolute inset-0 pointer-events-none">
        <FloatingShape className="top-20 left-[15%]" size={120} color="blue" delay={0} />
        <FloatingShape className="top-40 right-[20%]" size={80} color="purple" delay={0.5} />
        <FloatingShape className="bottom-40 left-[25%]" size={100} color="cyan" delay={1} />
        <FloatingShape className="bottom-20 right-[15%]" size={150} color="pink" delay={1.5} />
      </motion.div>
      
      <motion.div style={{ x: x2, y: y2 }} className="absolute inset-0 pointer-events-none">
        <FloatingShape className="top-60 left-[10%]" size={60} color="purple" delay={0.3} />
        <FloatingShape className="top-20 right-[10%]" size={90} color="cyan" delay={0.8} />
        <FloatingShape className="bottom-60 right-[30%]" size={70} color="blue" delay={1.3} />
      </motion.div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">Custom Digital Solutions</span>
        </motion.div>
        
        {/* Main Heading with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
            We Build{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Digital
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
            <br />
            <span className="text-white/90">Experiences</span>
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
        >
          From stunning websites to powerful inventory systems — we transform ideas into 
          <span className="text-white"> custom solutions</span> that scale with your business.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Start Your Project
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-4 rounded-xl font-medium transition-all"
          >
            Team Login
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Stats Section with Animated Counters
function Stats() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  const stats = [
    { value: 50, suffix: 'K+', label: 'Lines of Code' },
    { value: 100, suffix: '%', label: 'Custom Built' },
    { value: 24, suffix: 'h', label: 'Response Time' },
    { value: 4, suffix: '+', label: 'Happy Clients' },
  ];
  
  return (
    <section ref={ref} className="py-20 border-y border-white/5">
      <motion.div style={{ opacity, scale }} className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/50 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// Case Study Section
function CaseStudy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ opacity }} className="text-center mb-16">
          <span className="text-blue-400 text-sm uppercase tracking-widest">Featured Project</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Secured Tampa
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            How we built a legendary inventory management system for a sneaker &amp; Pokemon store
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Features */}
          <motion.div style={{ y }} className="space-y-6">
            {[
              {
                icon: Package,
                title: 'Omnichannel Inventory',
                desc: 'Real-time sync between website, in-store POS, and mobile app',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Sales trends, inventory alerts, and profit margins at a glance',
              },
              {
                icon: Smartphone,
                title: 'iOS Scanning App',
                desc: 'Scan products, pull live StockX prices, instant inventory add',
              },
              {
                icon: Shield,
                title: 'Stripe + Clover Integration',
                desc: 'Unified payments whether online or in-person',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-white/50 mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Right - Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  $4,500
                </div>
                <div className="text-white/50 mt-4 text-lg">Project Value</div>
                
                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-white/50 text-sm">Weeks to Build</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-white/50 text-sm">Platforms</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {['Next.js', 'Supabase', 'Stripe', 'SwiftUI', 'Clover'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function Services() {
  const iconMap = {
    Globe,
    Smartphone,
    Package,
    Sparkles,
  };
  
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-sm uppercase tracking-widest">Services</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            What We Build
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            If you can dream it, we can build it. No templates, no shortcuts — just custom solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brand.services.map((service, i) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                  <Icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-white/50">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Process Section
function Process() {
  const steps = [
    { number: '01', title: 'Discovery', desc: 'We learn your business, goals, and vision' },
    { number: '02', title: 'Design', desc: 'Custom UI/UX tailored to your brand' },
    { number: '03', title: 'Build', desc: 'Clean code, modern stack, built to scale' },
    { number: '04', title: 'Launch', desc: 'Deploy, test, and go live with support' },
  ];
  
  return (
    <section className="py-32 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm uppercase tracking-widest">Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            How We Work
          </h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
              )}
              <div className="text-5xl font-bold text-white/10 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-white/50">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Team Section
function Team() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-pink-400 text-sm uppercase tracking-widest">Team</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Small Team, Big Results
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {brand.team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all w-64"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto">
                {member.emoji}
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-white/50 text-sm mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };
  
  return (
    <section id="contact" className="py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-400 text-sm uppercase tracking-widest">Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Let&apos;s Build Something
            </h2>
            <p className="text-white/50 mt-4">
              Tell us about your project and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-white/50">We&apos;ll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Project Details</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-white/30" size={20} />
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Send Message
                <ArrowRight size={20} />
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="container mx-auto px-6 text-center text-white/40">
        <p>© {new Date().getFullYear()} Vantix. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="bg-[#0a0a0f]">
      <Hero />
      <Stats />
      <CaseStudy />
      <Services />
      <Process />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
