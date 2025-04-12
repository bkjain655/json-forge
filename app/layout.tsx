import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import './globals.css'
import { KEYWORDS } from "@/lib/constants";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag_utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { GoogleAnalyticsProvider } from "@/hooks/GoogleAnalyticsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jsonforge.dev",
    title: "JSON Forge - Developer Utilities for JSON Operations",
    description:
      "Free online JSON Forge for developers - compare, merge, validate, format, convert JSON to YAML, generate schemas and more.",
    siteName: "JSON Forge",
  },
  twitter: {
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
                `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });`
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
        </ThemeProvider>
        <SpeedInsights />
        <GoogleAnalyticsProvider />
        
        <Analytics />
      </body>
    </html>
  )
}
