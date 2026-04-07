import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MR.KERA | Management System",
  description: "Admin dashboard for coconut plucking business management",
  generator: "abu",
  manifest: "/manifest.json",
  themeColor: "#142616",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MR. KERA",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

import { Toaster } from "@/components/ui/toaster"
import ErrorToastListener from "@/components/ui/error-toast-listener"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
          <ErrorToastListener />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
