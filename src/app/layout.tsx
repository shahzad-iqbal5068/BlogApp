import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import PWAProvider from "@/components/PWAProvider";
import UnsubscribeToast from "@/components/UnsubscribeToast";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "BlogApp", template: "%s | BlogApp" },
  description: "Discover stories, ideas, and insights about technology and web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>
          <SkipLink />
          <Navbar />
          <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <PWAProvider />
          <Suspense fallback={null}>
            <UnsubscribeToast />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
