import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://random-generators.org";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Random Generators - Free Random Name, Number, Password Generator Tools Online",
    template: "%s | Random Generators"
  },
  description: "Free online random generator tools: random name generator, random number generator, random password generator, random word generator and 50+ more random tools. No registration required.",
  keywords: [
    "random generators",
    "random generator", 
    "random name generator", 
    "random number generator",
    "random password generator",
    "random word generator",
    "random color generator",
    "free random tools",
    "online random generator",
    "random picker",
    "decision maker",
    "generator tools",
    "random tools online",
    "free generator tools"
  ],
  authors: [{ name: "Random Generators" }],
  creator: "Random Generators",
  publisher: "Random Generators",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    title: "Random Generators - Free Online Random Generator Tools",
    description: "Free online random generator tools: random name generator, random number generator, random password generator and 50+ more tools. No registration required.",
    siteName: "Random Generators",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Random Generators - Free Online Random Generator Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Generators - Free Online Random Generator Tools",
    description: "Free online random generator tools: random name generator, random number generator, random password generator and 50+ more tools.",
    images: ["/twitter-image.png"],
    creator: "@randomgenerators",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
      'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || '',
    }
  },
  alternates: {
    canonical: appUrl,
  },
  category: "Technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Random Generators",
  url: appUrl,
  description: "Free online random generator tools including random name generator, random number generator, random password generator and 50+ more tools.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "Free"
  },
  author: {
    "@type": "Organization",
    name: "Random Generators",
    url: appUrl
  },
  publisher: {
    "@type": "Organization",
    name: "Random Generators",
    url: appUrl
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "2540",
    bestRating: "5",
    worstRating: "1"
  },
  featureList: [
    "Random Name Generator",
    "Random Number Generator",
    "Random Password Generator", 
    "Random Word Generator",
    "Random Color Generator",
    "Decision Maker Tool",
    "Random Picker Tool"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="color-scheme" content="dark light" />
        
        {process.env.NODE_ENV === "production" && (
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
        )}
        
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Random Generators" />
        
        <meta name="application-name" content="Random Generators" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        
        <main id="main-content" role="main">
          {children}
        </main>
        
        {process.env.NODE_ENV === "production" && gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
