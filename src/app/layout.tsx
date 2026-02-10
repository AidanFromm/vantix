import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantix | Custom Digital Solutions",
  description: "We build websites, apps, and inventory systems tailored to your business.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Vantix | Custom Digital Solutions",
    description: "We build websites, apps, and inventory systems tailored to your business.",
    url: "https://usevantix.com",
    siteName: "Vantix",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Vantix - Get Organized",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vantix | Custom Digital Solutions",
    description: "We build websites, apps, and inventory systems tailored to your business.",
    images: ["/api/og"],
  },
  metadataBase: new URL("https://usevantix.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
