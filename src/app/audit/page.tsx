'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle, Loader2 } from 'lucide-react';

export default function AuditPage() {
  const [formData, setFormData] = useState({ name: '', email: '', website: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/audit-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#B07A45]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-[#C89A6A]" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Audit Request Received!</h1>
          <p className="text-[var(--color-muted)] mb-6">
            We&apos;ll analyze your website and get back to you within 24-48 hours with actionable insights.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#B07A45] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1C1C1C]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B07A45]/10 text-[#B07A45] text-sm mb-6">
              <Search size={14} />
              Free Website Audit
            </div>
            <h1 className="text-4xl font-bold mb-6">
              Get a Free<br />
              <span className="text-[#B07A45]">Website Audit</span>
            </h1>
            <p className="text-lg text-[var(--color-muted)] mb-8">
              We&apos;ll analyze your website and provide actionable recommendations to improve performance, SEO, and conversions.
            </p>

            <div className="space-y-4">
              {[
                'Performance & Speed Analysis',
                'SEO Health Check',
                'Mobile Responsiveness',
                'Security Assessment',
                'Conversion Optimization Tips',
                'Competitor Comparison',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-[#B07A45]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Request Your Free Audit</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[#B07A45] transition-colors"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[#B07A45] transition-colors"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-2">Website URL</label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[#B07A45] transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[#B07A45] transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>

              {error && (
                <p className="text-[#B0614A] text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B07A45] text-white font-medium rounded-lg hover:bg-[#8E5E34] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Get My Free Audit'
                )}
              </button>

              <p className="text-xs text-[var(--color-muted)] text-center">
                No spam. We&apos;ll only use your info to send the audit.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
