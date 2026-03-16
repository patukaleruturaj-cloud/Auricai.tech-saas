import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import PaddleInitializer from "@/components/PaddleInitializer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI LinkedIn Opener Generator | Personalized LinkedIn Outreach | AuricAI",
  description: "Generate hyper-personalized LinkedIn openers in seconds using AI. Increase reply rates and book more meetings with AuricAI's intelligent LinkedIn outreach generator.",
  keywords: ["AI LinkedIn opener generator", "LinkedIn opener generator", "LinkedIn message generator", "LinkedIn DM generator", "AI LinkedIn outreach tool", "LinkedIn outreach AI", "LinkedIn cold message generator", "personalized LinkedIn outreach", "LinkedIn prospecting AI", "LinkedIn lead generation tool", "AI sales outreach tool", "LinkedIn prospecting tool", "B2B LinkedIn outreach", "AI prospecting tool", "LinkedIn outreach generator"],
  authors: [{ name: "AuricAI Team" }],
  metadataBase: new URL("https://auricai.tech"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI LinkedIn Opener Generator | AuricAI",
    description: "Personalized LinkedIn outreach at scale. Generate opening messages that actually get replies.",
    url: "https://auricai.tech",
    siteName: "AuricAI",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "AuricAI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI LinkedIn Opener Generator | AuricAI",
    description: "Generate hyper-personalized LinkedIn openers in seconds with AI.",
    images: ["/logo.png"],
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Replace with your actual code
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png" },
    ],
  }
};

import ConditionalLayout from "@/components/ConditionalLayout";

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AuricAI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "AI LinkedIn opener generator for personalized outreach",
    "url": "https://auricai.tech",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AuricAI",
    "url": "https://auricai.tech",
    "logo": "https://auricai.tech/logo.png"
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          {/* Google Analytics Placeholder */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_MEASUREMENT_ID"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YOUR_MEASUREMENT_ID');
            `}
          </Script>
          <Script
            id="json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Script
            id="org-json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <PaddleInitializer />
        </body>
      </html>
    </ClerkProvider>
  );
}
