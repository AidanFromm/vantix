import type { Metadata } from "next";
import "./globals.css";
import ChatWidgetWrapper from "@/components/ChatWidgetWrapper";

export const metadata: Metadata = {
  title: "Vantix — AI-Powered Business Automation",
  description:
    "Vantix is an AI consulting agency that builds intelligent systems to generate revenue, cut costs, and automate operations. Custom AI chatbots, websites, automation, and analytics for businesses ready to scale.",
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
    url: "https://usevantix.com",
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
  metadataBase: new URL("https://usevantix.com"),
  alternates: {
    canonical: "https://usevantix.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vantix",
    url: "https://usevantix.com",
    logo: "https://usevantix.com/og-image.jpg",
    telephone: "(908) 498-7753",
    email: "usevantix@gmail.com",
    description:
      "AI consulting agency that builds intelligent systems to generate revenue, cut costs, and automate operations.",
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics — replace GA_MEASUREMENT_ID with your real ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
        <script
          defer
          data-domain="usevantix.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className="antialiased">
        {children}
        <ChatWidgetWrapper />
      </body>
    </html>
  );
}
