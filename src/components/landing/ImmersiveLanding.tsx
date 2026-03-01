'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const Scene3D = dynamic(() => import('@/components/three/Scene'), { ssr: false })

/* ───────────────── ANIMATED TEXT COMPONENTS ───────────────── */

function MaskRevealText({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function CountUp({ end, suffix = '', prefix = '', duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isInView) return
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic ease out
      setCount(Math.floor(eased * end))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end, duration])
  
  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

function GlowText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 blur-xl opacity-50 text-[#B07A45]" aria-hidden>{children}</span>
    </span>
  )
}

/* ───────────────── SECTION: HERO ───────────────── */

function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        <MaskRevealText>
          <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight">
            vantix.
          </h1>
        </MaskRevealText>
        
        <MaskRevealText delay={0.3}>
          <p className="mt-6 text-xl md:text-2xl text-[#A39B90] font-light tracking-wide">
            Build your unfair advantage.
          </p>
        </MaskRevealText>
        
        <MaskRevealText delay={0.6}>
          <p className="mt-4 text-sm text-[#7A746C] tracking-widest uppercase">
            AI-Powered Consulting & Development
          </p>
        </MaskRevealText>
      </div>
      
      <motion.div
        className="absolute bottom-12"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-[#B07A45]/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#B07A45]/50" />
        </div>
      </motion.div>
    </section>
  )
}

/* ───────────────── SECTION: PAIN POINTS ───────────────── */

function PainSection() {
  const painPoints = [
    'Missed leads that never come back.',
    'Websites that drive customers away.',
    'Manual processes burning your time.',
  ]
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32">
      <MaskRevealText>
        <p className="text-lg text-[#7A746C] tracking-widest uppercase mb-16">
          The problem
        </p>
      </MaskRevealText>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <MaskRevealText>
          <h2 className="font-playfair text-4xl md:text-6xl text-white font-light italic">
            Every day, businesses lose money.
          </h2>
        </MaskRevealText>
        
        <div className="h-px w-24 bg-[#B07A45] mx-auto my-12" />
        
        {painPoints.map((point, i) => (
          <MaskRevealText key={i} delay={0.2 * (i + 1)}>
            <p className="text-xl md:text-2xl text-[#A39B90] font-light text-center">
              {point}
            </p>
          </MaskRevealText>
        ))}
      </div>
    </section>
  )
}

/* ───────────────── SECTION: SOLUTION ───────────────── */

function SolutionSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32">
      <div className="max-w-4xl mx-auto text-center">
        <MaskRevealText>
          <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white font-light">
            What if{' '}
            <GlowText className="text-[#B07A45] font-bold not-italic">AI</GlowText>
            {' '}worked for you
          </h2>
        </MaskRevealText>
        
        <MaskRevealText delay={0.3}>
          <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white font-light italic mt-4">
            — twenty-four seven?
          </h2>
        </MaskRevealText>
        
        <MaskRevealText delay={0.6}>
          <p className="mt-12 text-lg text-[#7A746C] max-w-2xl mx-auto leading-relaxed">
            We build custom platforms, deploy AI agents, and automate your entire operation.
            Not templates. Not cookie-cutter solutions. Systems built specifically for your business.
          </p>
        </MaskRevealText>
      </div>
    </section>
  )
}

/* ───────────────── SECTION: SERVICES ───────────────── */

function ServicesSection() {
  const services = [
    {
      title: 'Custom Platforms',
      description: 'Full-stack web and mobile applications built from scratch. E-commerce, SaaS, marketplaces — whatever your business needs.',
      icon: '</>',
    },
    {
      title: 'AI Agents',
      description: 'Autonomous AI systems that handle leads, customer service, data analysis, and operations — working while you sleep.',
      icon: '⚡',
    },
    {
      title: 'Full Automation',
      description: 'End-to-end workflow automation. From lead capture to invoicing, we eliminate every manual process in your business.',
      icon: '∞',
    },
  ]
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32">
      <MaskRevealText>
        <p className="text-lg text-[#7A746C] tracking-widest uppercase mb-16">
          What we build
        </p>
      </MaskRevealText>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {services.map((service, i) => (
          <MaskRevealText key={i} delay={0.15 * i}>
            <motion.div
              className="group relative p-8 rounded-2xl border border-[#B07A45]/10 bg-white/[0.02] backdrop-blur-sm hover:border-[#B07A45]/30 transition-all duration-500"
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="text-4xl mb-6 text-[#B07A45] font-mono">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-[#7A746C] text-sm leading-relaxed">{service.description}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#B07A45]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </MaskRevealText>
        ))}
      </div>
    </section>
  )
}

/* ───────────────── SECTION: CASE STUDY ───────────────── */

function CaseStudySection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32">
      <MaskRevealText>
        <p className="text-lg text-[#7A746C] tracking-widest uppercase mb-16">
          Real results
        </p>
      </MaskRevealText>
      
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <MaskRevealText>
              <h3 className="font-playfair text-3xl md:text-5xl text-white font-light mb-8">
                SecuredTampa
              </h3>
            </MaskRevealText>
            
            <MaskRevealText delay={0.2}>
              <p className="text-[#A39B90] leading-relaxed mb-8">
                A full e-commerce platform with inventory management, barcode scanning, 
                Stripe payments, and shipping integration — built and shipped in two weeks.
                Replacing a broken Shopify setup that got their account terminated.
              </p>
            </MaskRevealText>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '2', label: 'Weeks to Ship' },
                { value: '122', label: 'Pages Built' },
                { value: '50+', label: 'API Routes' },
              ].map((stat, i) => (
                <MaskRevealText key={i} delay={0.3 + i * 0.1}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-[#B07A45]">{stat.value}</div>
                    <div className="text-xs text-[#7A746C] mt-1">{stat.label}</div>
                  </div>
                </MaskRevealText>
              ))}
            </div>
          </div>
          
          <MaskRevealText delay={0.2}>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#B07A45]/10 to-[#B07A45]/5 border border-[#B07A45]/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#B07A45]/20">ST</div>
                  <div className="text-sm text-[#7A746C] mt-2">securedtampa.com</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-lg bg-[#B07A45]/10 border border-[#B07A45]/20 flex items-center justify-center">
                <span className="text-[#B07A45] text-xs font-mono">LIVE</span>
              </div>
            </div>
          </MaskRevealText>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── SECTION: STATS ───────────────── */

function StatsSection() {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-32">
      <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-4xl mx-auto w-full text-center">
        {[
          { end: 10, suffix: '+', label: 'Projects Delivered' },
          { end: 24, suffix: '/7', label: 'AI Uptime' },
          { end: 2, prefix: '$', suffix: 'M+', label: 'Client Revenue' },
        ].map((stat, i) => (
          <MaskRevealText key={i} delay={0.15 * i}>
            <div>
              <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
                <CountUp end={stat.end} suffix={stat.suffix} prefix={stat.prefix || ''} />
              </div>
              <div className="text-xs md:text-sm text-[#7A746C] mt-3 tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          </MaskRevealText>
        ))}
      </div>
      
      <MaskRevealText delay={0.6}>
        <p className="font-playfair text-2xl md:text-4xl text-white/80 font-light italic text-center mt-20 max-w-2xl">
          No templates. No limits. Just results.
        </p>
      </MaskRevealText>
    </section>
  )
}

/* ───────────────── SECTION: PROCESS ───────────────── */

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Discovery', desc: 'We learn your business inside out. Goals, pain points, vision.' },
    { num: '02', title: 'Design', desc: 'Custom architecture and UI tailored to your exact needs.' },
    { num: '03', title: 'Build', desc: 'Rapid development with AI-assisted coding. Weeks, not months.' },
    { num: '04', title: 'Launch', desc: 'Deploy, monitor, iterate. We stay with you post-launch.' },
  ]
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32">
      <MaskRevealText>
        <p className="text-lg text-[#7A746C] tracking-widest uppercase mb-16">
          How we work
        </p>
      </MaskRevealText>
      
      <div className="max-w-4xl mx-auto w-full">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#B07A45]/0 via-[#B07A45]/30 to-[#B07A45]/0 hidden md:block" />
          
          <div className="space-y-16">
            {steps.map((step, i) => (
              <MaskRevealText key={i} delay={0.15 * i}>
                <div className="flex items-start gap-8 md:gap-12">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full border border-[#B07A45]/20 flex items-center justify-center">
                    <span className="text-[#B07A45] font-mono text-sm">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-[#7A746C] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </MaskRevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── SECTION: CTA ───────────────── */

function CTASection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-32">
      <div className="text-center max-w-3xl mx-auto">
        <MaskRevealText>
          <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white font-light">
            Ready to build your
          </h2>
        </MaskRevealText>
        
        <MaskRevealText delay={0.2}>
          <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-[#B07A45] font-bold mt-2">
            unfair advantage?
          </h2>
        </MaskRevealText>
        
        <MaskRevealText delay={0.5}>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://cal.com/vantix/ai-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#B07A45] text-white font-medium hover:bg-[#8E5E34] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(176,122,69,0.3)]"
            >
              Book a Free Consultation
            </a>
            <a
              href="tel:9084987753"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[#B07A45]/30 text-white font-medium hover:border-[#B07A45] transition-all duration-300"
            >
              (908) 498-7753
            </a>
          </div>
        </MaskRevealText>
        
        <MaskRevealText delay={0.7}>
          <p className="mt-8 text-sm text-[#7A746C]">
            hello@usevantix.com
          </p>
        </MaskRevealText>
      </div>
    </section>
  )
}

/* ───────────────── SECTION: FOOTER ───────────────── */

function FooterSection() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-[#7A746C]">
          © 2026 Vantix LLC. All rights reserved.
        </div>
        
        <div className="flex items-center gap-6">
          <a href="https://instagram.com/usevantix" target="_blank" rel="noopener noreferrer" className="text-[#7A746C] hover:text-[#B07A45] transition-colors text-sm">
            Instagram
          </a>
          <a href="https://x.com/usevantix" target="_blank" rel="noopener noreferrer" className="text-[#7A746C] hover:text-[#B07A45] transition-colors text-sm">
            X / Twitter
          </a>
          <a href="mailto:hello@usevantix.com" className="text-[#7A746C] hover:text-[#B07A45] transition-colors text-sm">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ───────────────── MAIN EXPORT ───────────────── */

export default function ImmersiveLanding() {
  const scrollProgress = useScrollProgress()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div className="relative bg-[#050510] text-white min-h-screen">
      {/* 3D Background */}
      {mounted && <Scene3D scrollProgress={scrollProgress} />}
      
      {/* Content Overlay */}
      <div className="relative z-10">
        <HeroSection />
        <PainSection />
        <SolutionSection />
        <ServicesSection />
        <CaseStudySection />
        <StatsSection />
        <ProcessSection />
        <CTASection />
        <FooterSection />
      </div>
    </div>
  )
}
