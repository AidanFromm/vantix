"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Calendar, Clock, Tag } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

const categories = [
  "All",
  "AI Strategy",
  "Automation",
  "Case Studies",
  "Industry Insights",
] as const;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [email, setEmail] = useState("");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F5EFE7]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
            Insights & Guides
          </h1>
          <p className="text-lg text-[#1E1E1E]/60 max-w-2xl mx-auto">
            Practical strategies for automating your business with AI. No hype,
            no jargon — just actionable advice backed by real numbers.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#B07A45] text-white shadow-sm"
                  : "bg-[#F5EFE7] text-[#1E1E1E]/70 border border-[#D8CFC4] shadow-sm hover:text-[#B07A45]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-[#D8CFC4] bg-[#F5EFE7] p-8 shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff] hover:shadow-[8px_8px_20px_#d1cdc7,-8px_-8px_20px_#ffffff] transition-all duration-300"
            >
              {/* Category Tag */}
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-3.5 h-3.5 text-[#B07A45]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B07A45]">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-[#1E1E1E] mb-3 group-hover:text-[#B07A45] transition-colors">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-[#1E1E1E]/60 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#1E1E1E]/40">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#B07A45] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="px-6 pb-32">
        <div className="max-w-2xl mx-auto rounded-2xl border border-[#D8CFC4] bg-[#F5EFE7] p-10 shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff] text-center">
          <Mail className="w-10 h-10 text-[#B07A45] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            Get automation insights delivered
          </h3>
          <p className="text-[#1E1E1E]/60 mb-6">
            One email per week. Practical AI strategies for growing businesses.
            No spam, unsubscribe anytime.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="flex-1 px-5 py-3 rounded-xl border border-[#D8CFC4] bg-[#F5EFE7] text-[#1E1E1E] shadow-[inset_3px_3px_6px_#d1cdc7,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#B07A45] text-white font-medium text-sm shadow-sm hover:bg-[#a67a4d] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}