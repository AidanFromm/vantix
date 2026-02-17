'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calculator,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  Clock,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Check,
  Download,
  Mail,
  User,
} from 'lucide-react';

const industries = [
  'Retail',
  'E-commerce',
  'Security',
  'Real Estate',
  'Healthcare',
  'Restaurant',
  'Professional Services',
  'Other',
];

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
      else ref.current = value;
    }

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

function getAIInvestment(teamSize: number): number {
  if (teamSize <= 5) return 3000;
  if (teamSize <= 10) return 6000;
  if (teamSize <= 20) return 12000;
  if (teamSize <= 35) return 18000;
  return 25000;
}

const steps = [
  { icon: Building2, label: 'Industry' },
  { icon: Users, label: 'Team Size' },
  { icon: Clock, label: 'Manual Hours' },
  { icon: DollarSign, label: 'Hourly Cost' },
  { icon: MessageSquare, label: 'Inquiries' },
];

export default function ROICalculatorPage() {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState(10);
  const [manualHours, setManualHours] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [inquiries, setInquiries] = useState(50);
  const [showResults, setShowResults] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const timeSavedWeekly = manualHours * 0.7;
  const monthlySavings = timeSavedWeekly * hourlyCost * 4.3;
  const annualSavings = monthlySavings * 12;
  const aiInvestment = getAIInvestment(teamSize);
  const roiPercent = ((annualSavings - aiInvestment) / aiInvestment) * 100;
  const paybackMonths = aiInvestment / monthlySavings;

  const canProceed = step === 0 ? industry !== '' : true;

  function handleNext() {
    if (step < 4) setStep(step + 1);
    else setShowResults(true);
  }

  function handleBack() {
    if (showResults) { setShowResults(false); return; }
    if (step > 0) setStep(step - 1);
  }

  function handleSubmitLead(e: React.FormEvent) {
    e.preventDefault();
    const leads = JSON.parse(localStorage.getItem('vantix_leads') || '[]');
    leads.push({
      source: 'roi-calculator',
      name: leadName,
      email: leadEmail,
      industry,
      teamSize,
      manualHours,
      hourlyCost,
      inquiries,
      annualSavings: Math.round(annualSavings),
      roiPercent: Math.round(roiPercent),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('vantix_leads', JSON.stringify(leads));
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero */}
      <div className="relative pt-28 pb-12 px-4 sm:px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <Calculator className="w-4 h-4" />
            AI ROI Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            See How Much AI Can Save Your Business
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Answer 5 quick questions and get a personalized savings estimate in under 60 seconds.
          </p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      {!showResults && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      i < step
                        ? 'bg-emerald-500 text-black'
                        : i === step
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs hidden sm:block ${i <= step ? 'text-white/70' : 'text-white/30'}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              animate={{ width: `${((step + 1) / 5) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10"
            >
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What industry is your business in?</h2>
                  <p className="text-white/40 text-sm mb-6">This helps us tailor your savings estimate.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {industries.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setIndustry(ind)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          industry === ind
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">How many people are on your team?</h2>
                  <p className="text-white/40 text-sm mb-8">Include anyone who handles repetitive or manual tasks.</p>
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold text-emerald-400">{teamSize}</span>
                    <span className="text-white/40 ml-2">employees</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">How many hours per week does your team spend on manual tasks?</h2>
                  <p className="text-white/40 text-sm mb-8">Think data entry, scheduling, responding to inquiries, reporting.</p>
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold text-emerald-400">{manualHours}</span>
                    <span className="text-white/40 ml-2">hours/week</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    value={manualHours}
                    onChange={(e) => setManualHours(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>5 hrs</span>
                    <span>80 hrs</span>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What&apos;s the average hourly cost of your team?</h2>
                  <p className="text-white/40 text-sm mb-8">Include salary, benefits, and overhead if possible.</p>
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold text-emerald-400">${hourlyCost}</span>
                    <span className="text-white/40 ml-2">/hour</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={150}
                    value={hourlyCost}
                    onChange={(e) => setHourlyCost(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>$15</span>
                    <span>$150</span>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">How many customer inquiries do you handle per day?</h2>
                  <p className="text-white/40 text-sm mb-8">Emails, calls, chat messages, support tickets, etc.</p>
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold text-emerald-400">{inquiries}</span>
                    <span className="text-white/40 ml-2">per day</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={inquiries}
                    onChange={(e) => setInquiries(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 rounded-full appearance-none bg-white/10 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>0</span>
                    <span>200</span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-2 text-sm text-white/50 hover:text-white transition ${step === 0 ? 'invisible' : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    canProceed
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {step === 4 ? 'Calculate My Savings' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Results */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Your AI Savings Estimate</h2>
                    <p className="text-white/40 text-sm">{industry} business with {teamSize} employees</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Weekly Time Saved</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      <AnimatedNumber value={timeSavedWeekly} decimals={1} suffix=" hrs" />
                    </p>
                    <p className="text-white/30 text-xs mt-1">AI automates ~70% of repetitive tasks</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Monthly Savings</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      <AnimatedNumber value={monthlySavings} prefix="$" />
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-5 sm:col-span-2">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Projected Annual Savings</p>
                    <p className="text-4xl font-bold text-emerald-400">
                      <AnimatedNumber value={annualSavings} prefix="$" />
                    </p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Estimated AI Investment</p>
                    <p className="text-2xl font-bold text-white">
                      <AnimatedNumber value={aiInvestment} prefix="$" />
                    </p>
                    <p className="text-white/30 text-xs mt-1">Based on team size</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">ROI</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      <AnimatedNumber value={roiPercent} suffix="%" />
                    </p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:col-span-2">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Payback Period</p>
                    <p className="text-2xl font-bold text-white">
                      <AnimatedNumber value={paybackMonths} decimals={1} suffix=" months" />
                    </p>
                  </div>
                </div>

                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition">
                  <ChevronLeft className="w-4 h-4" /> Recalculate
                </button>
              </div>

              {/* Email Gate */}
              {!submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 mb-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold">Get Your Detailed AI Savings Report</h3>
                  </div>
                  <p className="text-white/40 text-sm mb-6">
                    We&apos;ll send a personalized breakdown with implementation recommendations for your {industry.toLowerCase()} business.
                  </p>
                  <form onSubmit={handleSubmitLead} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 transition"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
                    >
                      Send My Report
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 sm:p-10 text-center mb-6"
                >
                  <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Report on its way!</h3>
                  <p className="text-white/50 text-sm">Check your inbox for your personalized AI savings report.</p>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold hover:opacity-90 transition text-lg"
                >
                  Book a Free Consultation to Start Saving
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
