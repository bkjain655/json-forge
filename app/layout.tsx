import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { KEYWORDS, SITE_URL } from "@/lib/constants";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag_utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AppCommandPalette } from "@/components/app-command-palette"
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalyticsProvider } from "@/hooks/GoogleAnalyticsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | JSON Forge",
    default: "JSON Forge - Developer Utilities for JSON Operations",
  },
  description:
    "Free online JSON Forge for developers - compare, merge, validate, format, convert JSON to YAML, generate schemas and more.",
  keywords: KEYWORDS,
  icons: "/favicon/favicon.ico",
  authors: [{ name: "JSON Forge" }],
  creator: "JSON Forge",
  // Google Search Console "HTML tag" verification. Set GOOGLE_SITE_VERIFICATION
  // to the token GSC gives you; when unset, no tag is emitted (no harm).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "JSON Forge - Developer Utilities for JSON Operations",
    description:
      "Free online JSON Forge for developers - compare, merge, validate, format, convert JSON to YAML, generate schemas and more.",
    siteName: "JSON Forge",
  },
  twitter: {
    // The card image comes from app/opengraph-image.tsx - Next reuses the
    // Open Graph image for Twitter when no twitter-image route exists.
    card: "summary_large_image",
    title: "JSON Forge - Developer Utilities for JSON Operations",
    description:
      "Free online JSON Forge for developers - compare, merge, validate, format, convert JSON to YAML, generate schemas and more.",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="ga-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}>
        </Script>
        <Script id="ga-analytics-init" strategy="afterInteractive">
            {
                // send_page_view: false - GoogleAnalyticsProvider owns pageviews,
                // including the initial one, so they are not counted twice.
                `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', { send_page_view: false });`
            }
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <AppCommandPalette />
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
        <GoogleAnalyticsProvider />

        <Analytics />
      </body>
    </html>
  )
}
