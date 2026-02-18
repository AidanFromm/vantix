'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Mail,
  User,
  Building,
  Target,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface Question {
  question: string;
  options: { label: string; score: number }[];
}

const questions: Question[] = [
  {
    question: 'How would you describe your current tech stack?',
    options: [
      { label: 'Legacy — Mostly manual or outdated systems', score: 1 },
      { label: 'Mixed — Some modern tools, some legacy', score: 2 },
      { label: 'Modern — Cloud-based, mostly integrated', score: 3 },
      { label: 'Cloud-native — Fully modern, API-driven', score: 4 },
    ],
  },
  {
    question: 'How many hours per week does your team spend on repetitive tasks?',
    options: [
      { label: '0–10 hours', score: 1 },
      { label: '10–20 hours', score: 2 },
      { label: '20–40 hours', score: 3 },
      { label: '40+ hours', score: 4 },
    ],
  },
  {
    question: 'Do you currently use any AI or automation tools?',
    options: [
      { label: 'None at all', score: 1 },
      { label: 'Basic tools like ChatGPT', score: 2 },
      { label: 'Some workflow automation', score: 3 },
      { label: 'Extensive AI/automation', score: 4 },
    ],
  },
  {
    question: "What's your biggest operational bottleneck?",
    options: [
      { label: 'Customer support', score: 3 },
      { label: 'Data entry & admin', score: 2 },
      { label: 'Inventory or scheduling', score: 2 },
      { label: 'Reporting & analytics', score: 3 },
    ],
  },
  {
    question: 'How many customer interactions do you handle daily?',
    options: [
      { label: '0–10', score: 1 },
      { label: '10–50', score: 2 },
      { label: '50–200', score: 3 },
      { label: '200+', score: 4 },
    ],
  },
  {
    question: "What's your annual revenue?",
    options: [
      { label: 'Under $100K', score: 1 },
      { label: '$100K – $500K', score: 2 },
      { label: '$500K – $2M', score: 3 },
      { label: '$2M+', score: 4 },
    ],
  },
  {
    question: 'How important is 24/7 availability for your business?',
    options: [
      { label: 'Not important', score: 1 },
      { label: 'Somewhat important', score: 2 },
      { label: 'Very important', score: 3 },
      { label: 'Critical', score: 4 },
    ],
  },
  {
    question: 'Do you have a dedicated IT person or team?',
    options: [
      { label: 'No', score: 1 },
      { label: 'Part-time / contractor', score: 2 },
      { label: 'Full-time IT person', score: 3 },
      { label: 'Dedicated IT team', score: 4 },
    ],
  },
  {
    question: "What's your budget for technology improvements?",
    options: [
      { label: 'Under $5K', score: 1 },
      { label: '$5K – $15K', score: 2 },
      { label: '$15K – $50K', score: 3 },
      { label: '$50K+', score: 4 },
    ],
  },
  {
    question: 'How quickly do you want to see results?',
    options: [
      { label: 'Within 1 month', score: 4 },
      { label: 'Within 3 months', score: 3 },
      { label: 'Within 6 months', score: 2 },
      { label: 'No rush', score: 1 },
    ],
  },
];

function getRating(score: number) {
  if (score >= 30) return { title: 'AI-Ready', subtitle: "You're primed for transformation", color: 'emerald', icon: Zap };
  if (score >= 20) return { title: 'AI-Curious', subtitle: 'Strong foundation, huge upside', color: 'teal', icon: TrendingUp };
  if (score >= 10) return { title: 'AI-Beginner', subtitle: 'Perfect time to start', color: 'amber', icon: Target };
  return { title: 'Pre-AI', subtitle: 'We can build your foundation', color: 'orange', icon: Shield };
}

function getRecommendations(answers: number[]): string[] {
  const recs: string[] = [];
  // Based on tech stack
  if (answers[0] !== undefined && answers[0] <= 2) recs.push('Start with cloud migration to enable AI integrations down the line.');
  // Based on repetitive hours
  if (answers[1] !== undefined && answers[1] >= 3) recs.push('Workflow automation could save your team 15+ hours per week immediately.');
  // Based on AI usage
  if (answers[2] !== undefined && answers[2] <= 2) recs.push('A custom AI chatbot could handle 70% of customer inquiries 24/7.');
  // Based on bottleneck
  if (answers[3] !== undefined) recs.push('Focus AI investment on your biggest bottleneck for fastest ROI.');
  // Based on interactions
  if (answers[4] !== undefined && answers[4] >= 3) recs.push('High interaction volume makes AI-powered customer support a high-impact win.');
  // Based on availability needs
  if (answers[6] !== undefined && answers[6] >= 3) recs.push('An AI agent can provide always-on availability without adding headcount.');
  // Trim to 4
  return recs.slice(0, 4);
}

export default function AIAssessmentPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalScore = answers.reduce((sum, s) => sum + s, 0);
  const rating = getRating(totalScore);
  const RatingIcon = rating.icon;
  const recommendations = getRecommendations(answers);

  function handleSelectOption(score: number, idx: number) {
    setSelectedOption(idx);
  }

  function handleNext() {
    if (selectedOption === null) return;
    const score = questions[currentQ].options[selectedOption].score;
    const newAnswers = [...answers];
    newAnswers[currentQ] = score;
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < 9) {
      setCurrentQ(currentQ + 1);
      // Pre-select if already answered
      if (newAnswers[currentQ + 1] !== undefined) {
        // Find matching option
        const q = questions[currentQ + 1];
        const idx = q.options.findIndex((o) => o.score === newAnswers[currentQ + 1]);
        if (idx >= 0) setSelectedOption(idx);
      }
    } else {
      setShowResults(true);
    }
  }

  function handleBack() {
    if (showResults) {
      setShowResults(false);
      // Restore selection for current question
      const q = questions[currentQ];
      const idx = q.options.findIndex((o) => o.score === answers[currentQ]);
      setSelectedOption(idx >= 0 ? idx : null);
      return;
    }
    if (currentQ > 0) {
      const prev = currentQ - 1;
      setCurrentQ(prev);
      const q = questions[prev];
      const idx = q.options.findIndex((o) => o.score === answers[prev]);
      setSelectedOption(idx >= 0 ? idx : null);
    }
  }

  function handleSubmitLead(e: React.FormEvent) {
    e.preventDefault();
    const leads = JSON.parse(localStorage.getItem('vantix_leads') || '[]');
    leads.push({
      source: 'ai-assessment',
      name: leadName,
      email: leadEmail,
      company: leadCompany,
      score: totalScore,
      rating: rating.title,
      answers,
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
            <ClipboardCheck className="w-4 h-4" />
            AI Readiness Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            How Ready Is Your Business for AI?
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            10 quick questions. Personalized score. Actionable recommendations.
          </p>
        </motion.div>
      </div>

      {/* Progress */}
      {!showResults && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-8">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>Question {currentQ + 1} of 10</span>
            <span>{Math.round(((currentQ + 1) / 10) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#EEE6DC]/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              animate={{ width: `${((currentQ + 1) / 10) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-[#EEE6DC]/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10"
            >
              <h2 className="text-xl font-semibold mb-6">{questions[currentQ].question}</h2>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.score, idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      selectedOption === idx
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-[#EEE6DC]/[0.03] border-white/10 text-white/70 hover:bg-[#EEE6DC]/[0.06] hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-2 text-sm text-white/50 hover:text-white transition ${currentQ === 0 ? 'invisible' : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedOption !== null
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-[#EEE6DC]/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {currentQ === 9 ? 'See My Results' : 'Next'}
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
              {/* Score */}
              <div className="bg-[#EEE6DC]/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 mb-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <RatingIcon className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-white/40 text-sm uppercase tracking-wider mb-2">Your Score</p>
                <p className="text-6xl font-bold text-emerald-400 mb-1">{totalScore}<span className="text-2xl text-white/30">/40</span></p>
                <h2 className="text-2xl font-bold mt-3">{rating.title}</h2>
                <p className="text-white/50 mt-1">{rating.subtitle}</p>
              </div>

              {/* Recommendations */}
              <div className="bg-[#EEE6DC]/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Your Personalized Recommendations
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex items-start gap-3 text-white/70 text-sm"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </div>
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Email Gate */}
              {!submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-[#EEE6DC]/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 mb-6"
                >
                  <h3 className="text-lg font-semibold mb-2">Get Your Full AI Readiness Report</h3>
                  <p className="text-white/40 text-sm mb-6">
                    Receive a detailed breakdown with a custom AI roadmap for your business.
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EEE6DC]/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 transition"
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EEE6DC]/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 transition"
                      />
                    </div>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        required
                        placeholder="Company name"
                        value={leadCompany}
                        onChange={(e) => setLeadCompany(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EEE6DC]/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
                    >
                      Send My Full Report
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
                  <p className="text-white/50 text-sm">Check your inbox for your custom AI readiness report.</p>
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
                  Get Your Custom AI Roadmap — Book a Free Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <div className="text-center mt-6">
                <button onClick={handleBack} className="text-sm text-white/40 hover:text-white transition">
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Retake Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
