"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  Link2,
  Check,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { getPostBySlug, getRelatedPosts } from "@/data/blog-posts";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#F0DFD1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#4A2112] mb-4">
            Post not found
          </h1>
          <Link
            href="/blog"
            className="text-[#6B3A1F] hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const relatedPosts = getRelatedPosts(slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#F0DFD1]">
      {/* Back Link */}
      <section className="pt-28 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#4A2112]/50 hover:text-[#6B3A1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </section>

      {/* Post Header */}
      <section className="pt-8 pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-3.5 h-3.5 text-[#6B3A1F]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B3A1F]">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#4A2112] mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-[#4A2112]/50">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Post Content */}
      <section className="px-6 pb-12">
        <div
          className="max-w-3xl mx-auto prose prose-lg prose-stone
            prose-headings:text-[#4A2112] prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#4A2112]/75 prose-p:leading-relaxed
            prose-a:text-[#6B3A1F] prose-a:no-underline hover:prose-a:underline
            prose-li:text-[#4A2112]/75
            prose-strong:text-[#4A2112]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* Share */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="border-t border-[#E0CCBA] pt-8">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E0CCBA] bg-[#F0DFD1] text-sm text-[#4A2112]/70 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff] hover:text-[#6B3A1F] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Link copied
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Copy link
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto rounded-2xl border border-[#E0CCBA] bg-[#F0DFD1] p-10 shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff] text-center">
          <h3 className="text-2xl font-bold text-[#4A2112] mb-3">
            Ready to automate your business?
          </h3>
          <p className="text-[#4A2112]/60 mb-6 max-w-lg mx-auto">
            Find out how much time and money AI automation can save you. Get a
            free, personalized assessment of your operations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#6B3A1F] text-white font-medium shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff] hover:bg-[#a67a4d] transition-colors"
          >
            Book a free consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-6 pb-32">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#4A2112] mb-6">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-2xl border border-[#E0CCBA] bg-[#F0DFD1] p-6 shadow-[4px_4px_12px_#d1cdc7,-4px_-4px_12px_#ffffff] hover:shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff] transition-all duration-300"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B3A1F]">
                    {related.category}
                  </span>
                  <h4 className="text-base font-bold text-[#4A2112] mt-2 mb-2 group-hover:text-[#6B3A1F] transition-colors">
                    {related.title}
                  </h4>
                  <p className="text-sm text-[#4A2112]/50 line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
