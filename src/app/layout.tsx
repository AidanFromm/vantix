import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantix | Custom Digital Solutions",
  description: "We build websites, apps, and inventory systems tailored to your business.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
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
