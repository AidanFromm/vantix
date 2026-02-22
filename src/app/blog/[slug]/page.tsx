import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, blogPosts } from "@/data/blog-posts";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Vantix Blog`,
    description: post.metaDescription,
    keywords: [post.seoKeyword, "AI automation", "business automation", "Vantix"],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://www.usevantix.com/blog/${post.slug}`,
      siteName: "Vantix",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://www.usevantix.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://www.usevantix.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Vantix",
      url: "https://www.usevantix.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.usevantix.com/og-image.jpg",
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.usevantix.com/blog/${post.slug}`,
    },
    image: "https://www.usevantix.com/og-image.jpg",
    url: `https://www.usevantix.com/blog/${post.slug}`,
    keywords: post.seoKeyword,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
