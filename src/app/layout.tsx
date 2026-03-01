import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ChatWidgetWrapper from "@/components/ChatWidgetWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vantix — AI-Powered Business Automation",
  description:
    "Vantix is an AI consulting agency that builds intelligent systems to generate revenue, cut costs, and automate operations. Custom AI chatbots, websites, automation, and analytics for businesses ready to scale.",
  keywords: [
    "AI automation",
    "AI consulting",
    "business automation",
    "AI chatbots",
    "custom AI systems",
    "AI-powered websites",
    "lead generation automation",
    "AI phone agents",
    "workflow automation",
    "AI analytics",
    "Vantix",
  ],
  authors: [{ name: "Vantix", url: "https://www.usevantix.com" }],
  creator: "Vantix",
  publisher: "Vantix",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vantix — AI-Powered Business Automation",
    description:
      "We deploy AI systems that generate revenue, cut costs, and automate operations. Strategy, implementation, and ongoing support from one partner.",
    url: "https://www.usevantix.com",
    siteName: "Vantix",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vantix — AI-Powered Business Automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vantix — AI-Powered Business Automation",
    description:
      "We deploy AI systems that generate revenue, cut costs, and automate operations.",
    images: ["/og-image.jpg"],
  },
  metadataBase: new URL("https://www.usevantix.com"),
  alternates: {
    canonical: "https://www.usevantix.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Vantix",
      url: "https://www.usevantix.com",
      logo: "https://www.usevantix.com/og-image.jpg",
      telephone: "(908) 498-7753",
      email: "hello@usevantix.com",
      description:
        "AI consulting agency that builds intelligent systems to generate revenue, cut costs, and automate operations.",
      sameAs: [
        "https://instagram.com/usevantix",
        "https://x.com/usevantix",
      ],
      founder: [
        { "@type": "Person", name: "Kyle Ventura", jobTitle: "Founder & AI Strategist" },
        { "@type": "Person", name: "Aidan Fromm", jobTitle: "Co-Founder & Lead Engineer" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Vantix",
      url: "https://www.usevantix.com",
      telephone: "(908) 498-7753",
      email: "hello@usevantix.com",
      description: "AI-powered business automation consulting agency.",
      priceRange: "$$$$",
      image: "https://www.usevantix.com/og-image.jpg",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Vantix",
      url: "https://www.usevantix.com",
    },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          defer
          data-domain="usevantix.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className={`antialiased ${playfair.variable} ${inter.variable}`}>
        {children}
        <ChatWidgetWrapper />
      </body>
    </html>
  );
}
