'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Globe,
  Code2,
  Cpu,
  ShoppingCart,
  Rocket,
  Building2,
  TrendingUp,
  Plug,
  Zap,
  Shield,
  Star,
  Play,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Particles, GridBackground } from '@/components/ui/particles';
import { Spotlight } from '@/components/ui/spotlight';
import { MagneticButton, MagneticArrowButton } from '@/components/ui/magnetic-button';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { FadeInUp, StaggerContainer, StaggerItem, BlurIn } from '@/components/ui/scroll-animations';
import { HeroFloatingElements, FloatingStat, GlassCard } from '@/components/ui/floating-elements';
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel';
import { PortfolioGrid, FeaturedCaseStudy, Portfolio3DCard } from '@/components/ui/portfolio-cards';

// ============================================
// HERO SECTION
// ============================================
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <GridBackground className="opacity-40" />
        
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial" />
        
        {/* Particles */}
        <Particles
          quantity={60}
          color="#10b981"
          speed={0.3}
          size={2}
          interactive
        />

        {/* Aurora effect */}
        <div className="absolute inset-0 aurora-bg opacity-50" />
      </div>

      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#10b981" />

      {/* Floating elements */}
      <HeroFloatingElements />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 sm:mb-8"
        >
          <Sparkles size={14} className="text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-emerald-400 font-medium">Digital Solutions Worldwide</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6"
        >
          We Build Digital
          <br />
          <AnimatedGradientText className="block">
            That Actually Works
          </AnimatedGradientText>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 max-w-3xl mx-auto mb-8 sm:mb-10 px-2"
        >
          Websites, apps, automation, and systems for businesses worldwide.
          <br className="hidden md:block" />
          From startups to enterprise — custom solutions that convert.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <MagneticButton
            href="#contact"
            glow
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold w-full sm:w-auto"
          >
            Start Your Project
            <ArrowRight className="ml-2 w-5 h-5 inline-block" />
          </MagneticButton>
          
          <MagneticArrowButton href="#services" className="w-full sm:w-auto justify-center">
            See Our Work
          </MagneticArrowButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-12"
        >
          {[
            { value: '500+', label: 'Projects Delivered' },
            { value: '99%', label: 'Client Satisfaction' },
            { value: '48hr', label: 'Response Time' },
            { value: '24/7', label: 'Support Available' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 rounded-full bg-emerald-400"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// SERVICES SECTION (Bento Grid Style)
// ============================================
export function ServicesSection() {
  const services = [
    {
      icon: <Globe size={28} />,
      title: 'Custom Websites',
      description: 'Stunning, fast, SEO-optimized websites that convert visitors into paying customers.',
      color: 'from-emerald-500/20 to-teal-500/20',
      span: 'md:col-span-2',
    },
    {
      icon: <Code2 size={28} />,
      title: 'Web Applications',
      description: 'Custom dashboards, portals, SaaS products, and internal tools.',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <Cpu size={28} />,
      title: 'Business Automation',
      description: 'Eliminate repetitive tasks. Save hours every week.',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <ShoppingCart size={28} />,
      title: 'E-Commerce',
      description: 'Online stores that sell. Full stack from catalog to checkout.',
      color: 'from-orange-500/20 to-amber-500/20',
    },
    {
      icon: <Rocket size={28} />,
      title: 'Startup Packages',
      description: 'Everything to launch: website, branding, automation, go-to-market.',
      color: 'from-red-500/20 to-rose-500/20',
      span: 'md:col-span-2',
    },
    {
      icon: <Building2 size={28} />,
      title: 'Enterprise Solutions',
      description: 'Full digital transformation. Custom software at scale.',
      color: 'from-indigo-500/20 to-violet-500/20',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'SEO & Marketing',
      description: 'Get found. Search optimization and performance marketing.',
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: <Plug size={28} />,
      title: 'System Integration',
      description: 'Connect all your tools. CRM, ERP, payments, APIs — unified.',
      color: 'from-cyan-500/20 to-blue-500/20',
      span: 'md:col-span-2',
    },
  ];

  return (
    <section id="services" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <FadeInUp>
          <span className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
            What We Build
          </span>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Everything you need to
            <br />
            <span className="gradient-text">dominate digitally.</span>
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mb-10 sm:mb-16">
            From idea to launch and beyond. We build it all — beautifully.
          </p>
        </FadeInUp>

        {/* Bento Grid */}
        <StaggerContainer stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {services.map((service, i) => (
            <StaggerItem key={i} className={cn('group', service.span)}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'relative h-full p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer',
                  'bg-gradient-to-br from-white/5 to-white/[0.02]',
                  'border border-white/10 hover:border-emerald-500/30',
                  'transition-colors duration-300'
                )}
              >
                {/* Gradient background on hover */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  service.color
                )} />

                {/* Shine effect */}
                <div className="absolute inset-0 shine-effect" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 5 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ============================================
// PORTFOLIO SECTION
// ============================================
export function PortfolioSection() {
  const portfolioItems = [
    {
      title: 'TechFlow Dashboard',
      category: 'Web Application',
      description: 'A real-time analytics dashboard for a fintech startup. 40% increase in user engagement.',
      tags: ['React', 'Node.js', 'Real-time'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Luxe Commerce',
      category: 'E-Commerce',
      description: 'Premium fashion e-commerce platform with AI-powered recommendations.',
      tags: ['Next.js', 'Stripe', 'AI'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AutoFlow CRM',
      category: 'Automation',
      description: 'Custom CRM with automated workflows, saving 20+ hours per week.',
      tags: ['Automation', 'CRM', 'API'],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'HealthSync Portal',
      category: 'Healthcare',
      description: 'Patient management portal serving 50,000+ monthly users.',
      tags: ['HIPAA', 'React', 'PostgreSQL'],
      color: 'from-red-500 to-orange-500',
    },
    {
      title: 'PropTech Platform',
      category: 'Real Estate',
      description: 'Full-stack property management with virtual tours integration.',
      tags: ['3D Tours', 'Payments', 'Maps'],
      color: 'from-amber-500 to-yellow-500',
    },
    {
      title: 'EduLearn LMS',
      category: 'Education',
      description: 'Learning management system with video hosting and certifications.',
      tags: ['Video', 'LMS', 'Certificates'],
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  return (
    <section id="portfolio" className="relative py-32 px-6 md:px-12 lg:px-24 bg-[#080808]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <FadeInUp>
              <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
                Our Work
              </span>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
                Case studies that
                <br />
                <span className="gradient-text">speak for themselves.</span>
              </h2>
            </FadeInUp>
          </div>
          <FadeInUp delay={0.2}>
            <MagneticArrowButton href="#contact">
              Start your project
            </MagneticArrowButton>
          </FadeInUp>
        </div>

        {/* Portfolio Grid */}
        <PortfolioGrid items={portfolioItems} />
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
export function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'Vantix transformed our entire digital presence. The website they built generates 3x more leads than our old one, and the automation saves us 15 hours every week.',
      name: 'Sarah Mitchell',
      role: 'CEO',
      company: 'TechFlow Inc',
    },
    {
      quote: 'Working with Vantix felt like having a tech co-founder. They understood our vision and built exactly what we needed — on time and on budget.',
      name: 'Marcus Chen',
      role: 'Founder',
      company: 'Luxe Fashion',
    },
    {
      quote: 'Our e-commerce revenue increased 150% after the redesign. The attention to detail and performance optimization was incredible.',
      name: 'Jessica Park',
      role: 'Director of Digital',
      company: 'RetailMax',
    },
    {
      quote: 'They built our entire patient portal from scratch. HIPAA compliant, beautiful UI, and our patients love it. Couldn\'t ask for more.',
      name: 'Dr. Robert Hayes',
      role: 'CMO',
      company: 'HealthSync Medical',
    },
    {
      quote: 'Best agency we\'ve ever worked with. Responsive, creative, and they actually deliver what they promise. Rare in this industry.',
      name: 'Amanda Foster',
      role: 'Marketing Director',
      company: 'PropTech Solutions',
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full bg-emerald-500/5 blur-[80px] sm:blur-[100px] md:blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <FadeInUp>
            <span className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
              Testimonials
            </span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
              Loved by businesses
              <br />
              <span className="gradient-text">around the world.</span>
            </h2>
          </FadeInUp>
        </div>

        {/* Carousel */}
        <FadeInUp delay={0.2}>
          <TestimonialCarousel testimonials={testimonials} interval={6000} />
        </FadeInUp>

        {/* Trust badges */}
        <FadeInUp delay={0.4}>
          <div className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {['Google', 'Stripe', 'AWS', 'Vercel', 'Supabase'].map((partner, i) => (
              <span
                key={i}
                className="text-white/20 text-lg sm:text-xl md:text-2xl font-bold tracking-tight hover:text-white/40 transition-colors"
              >
                {partner}
              </span>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

// ============================================
// PRICING SECTION
// ============================================
export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'From $2,500',
      description: 'Perfect for small businesses getting online.',
      features: [
        'Custom 5-page website',
        'Mobile responsive design',
        'SEO fundamentals',
        'Contact forms',
        'Analytics setup',
        '2-week delivery',
      ],
    },
    {
      name: 'Professional',
      price: 'From $7,500',
      description: 'For growing businesses that need more.',
      features: [
        'Everything in Starter',
        'Custom web application',
        'Business automation',
        'E-commerce or booking',
        'CRM integration',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Full-scale digital transformation.',
      features: [
        'Everything in Professional',
        'Custom software development',
        'System integration',
        'Scalable architecture',
        'Dedicated manager',
        'SLA-backed support',
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#080808]">
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <FadeInUp>
            <span className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
              Pricing
            </span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
              Investment that
              <br />
              <span className="gradient-text">pays for itself.</span>
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto px-2">
              Every project is custom-quoted. These are starting points — 
              let's talk about what you actually need.
            </p>
          </FadeInUp>
        </div>

        {/* Pricing cards */}
        <StaggerContainer stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {plans.map((plan, i) => (
            <StaggerItem key={i} className={plan.popular ? 'sm:col-span-2 md:col-span-1' : ''}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'relative h-full p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl',
                  'bg-gradient-to-br from-white/5 to-white/[0.02]',
                  'border transition-colors duration-300',
                  plan.popular
                    ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                    : 'border-white/10 hover:border-emerald-500/30'
                )}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 bg-emerald-500 text-black text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                {/* Plan info */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2 sm:mb-3">{plan.price}</p>
                  <p className="text-white/60 text-xs sm:text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'block w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-center text-sm sm:text-base transition-colors',
                    plan.popular
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
                  )}
                >
                  Get Started
                </motion.a>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom note */}
        <FadeInUp delay={0.5}>
          <p className="text-center text-white/50 mt-8 sm:mt-12 text-xs sm:text-sm px-4">
            All pricing is custom based on your needs. Free consultation included.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Remote-first — we work with clients worldwide.
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================
export function CTASection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Cursor glow effect */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle at center, rgba(16, 185, 129, 0.4) 0%, transparent 60%)`,
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
      />

      {/* Background glows */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[150px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main CTA card */}
        <FadeInUp>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '10s' }}>
                <div className="absolute top-0 left-1/2 w-40 h-40 bg-emerald-500/30 rounded-full blur-[60px] -translate-y-1/2" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-emerald-500/20 flex items-center justify-center"
              >
                <Rocket size={28} className="text-emerald-400 sm:hidden" />
                <Rocket size={36} className="text-emerald-400 hidden sm:block" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
                Ready to build
                <br />
                <span className="gradient-text">something amazing?</span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2">
                Let's talk about your project. Free consultation — no commitment.
                We'll map out exactly what you need.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full">
                <MagneticButton
                  href="tel:+19084987753"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 w-full sm:w-auto"
                >
                  <Phone size={18} className="mr-2 flex-shrink-0" />
                  (908) 498-7753
                </MagneticButton>

                <MagneticButton
                  href="mailto:hello@vantix.dev"
                  className="bg-white/10 border border-white/30 hover:border-emerald-500/60 hover:bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 w-full sm:w-auto"
                >
                  <Mail size={18} className="mr-2 flex-shrink-0" />
                  hello@vantix.dev
                </MagneticButton>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-white/50">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Shield size={12} className="text-emerald-400 sm:hidden" />
                  <Shield size={14} className="text-emerald-400 hidden sm:block" />
                  100% Confidential
                </span>
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Zap size={12} className="text-emerald-400 sm:hidden" />
                  <Zap size={14} className="text-emerald-400 hidden sm:block" />
                  48hr Response
                </span>
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Globe size={12} className="text-emerald-400 sm:hidden" />
                  <Globe size={14} className="text-emerald-400 hidden sm:block" />
                  Remote Worldwide
                </span>
              </div>
            </div>
          </motion.div>
        </FadeInUp>
      </div>
    </section>
  );
}
