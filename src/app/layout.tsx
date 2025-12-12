import type { Metadata } from "next";
import { Suspense } from "react";
import { Sora } from 'next/font/google';
import localFont from 'next/font/local';
import "./styles/styles.css";

import Header from "./blocks/header/header";
import Highlight from "./blocks/highlight/highlight";
import Footer from "./blocks/footer/footer";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Loading from "./components/Loading/Loading";
import StructuredData from "./components/StructuredData/StructuredData";
import { organizationSchema, websiteSchema } from "./utils/structuredData";

// Optimize Google Fonts
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Only load weights actually used
  variable: '--font-sora',
  display: 'swap',
  preload: true,
});

// Optimize Local Fonts
const geist = localFont({
  src: [
    {
      path: '../../public/fonts/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "NGC - Next Generation Commerce Platform",
    template: "%s | NGC"
  },
  description: "Discover cutting-edge products and services with NGC's next-generation commerce platform. Browse our curated collection of innovative solutions designed for modern businesses.",
  keywords: ["commerce", "e-commerce", "next generation", "products", "services", "digital marketplace", "business solutions"],
  authors: [{ name: "NGC Team" }],
  creator: "NGC",
  publisher: "NGC",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ngc-website.com",
    siteName: "NGC",
    title: "NGC - Next Generation Commerce Platform",
    description: "Discover cutting-edge products and services with NGC's next-generation commerce platform.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NGC Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NGC - Next Generation Commerce Platform",
    description: "Discover cutting-edge products and services with NGC's next-generation commerce platform.",
    images: ["/assets/twitter-image.jpg"],
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://ngc-website.com",
  },
  // Performance optimizations
  other: {
    // Font preloading
    'link-preload-sora': '<link rel="preload" href="/fonts/sora-subset.woff2" as="font" type="font/woff2" crossorigin="">',
    // DNS prefetch for critical resources
    'dns-prefetch': '<link rel="dns-prefetch" href="//fonts.gstatic.com">',
    // Resource hints
    'preconnect': '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${geist.variable}`}>
      <head>
        <StructuredData data={[organizationSchema, websiteSchema]} />
      </head>
      <body className={`${sora.className} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={<Loading message="Loading header..." />}>
            <Highlight />
            <Header />
          </Suspense>
          <main>
            <Suspense fallback={<Loading message="Loading content..." fullScreen />}>
              {children}
            </Suspense>

          </main>
          <Suspense fallback={<Loading message="Loading footer..." />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}